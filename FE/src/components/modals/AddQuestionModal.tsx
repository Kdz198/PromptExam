import { Bot, Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { generateQuestionWithAI } from "../../services/api";
import type { Difficulty, Lesson, QuestionType, Subject } from "../../types/api";
import { Modal } from "../ui/Modal";

function extractLessonSummary(lesson: Lesson): string {
  const raw = lesson.learningObjectivesJson;
  if (!raw) return lesson.name;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const flattened = parsed
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (entry && typeof entry === "object") {
            return Object.values(entry)
              .filter((value): value is string => typeof value === "string")
              .join("; ");
          }
          return "";
        })
        .filter((value) => value && value.length > 0);
      if (flattened.length > 0) return flattened.join("; ");
    } else if (parsed && typeof parsed === "object") {
      const values = Object.values(parsed).filter((value): value is string => typeof value === "string");
      if (values.length > 0) return values.join("; ");
    }
  } catch (error) {
    console.warn("Không thể parse learningObjectivesJson", error);
  }

  return raw;
}

interface AddQuestionModalProps {
  open: boolean;
  lessons: Lesson[];
  subjects: Subject[];
  defaultSubjectCode?: string;
  defaultGrade?: string;
  onClose: () => void;
  onSubmit: (payload: {
    lessonId: number;
    questionText: string;
    questionType: QuestionType;
    difficulty: Difficulty;
    defaultPoint: number;
    optionsJson: string | null;
    answerKey: string;
  }) => Promise<void>;
}

const difficultyOptions: Difficulty[] = ["NhanBiet", "ThongHieu", "VanDung", "VanDungCao"];

export function AddQuestionModal({ open, lessons, subjects, defaultSubjectCode, defaultGrade, onClose, onSubmit }: AddQuestionModalProps) {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("TracNghiem");
  const [difficulty, setDifficulty] = useState<Difficulty>("NhanBiet");
  const [defaultPoint, setDefaultPoint] = useState(1);
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answerKey, setAnswerKey] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const availableSubjects = useMemo(() => {
    const subjectCodesWithLessons = new Set(lessons.map((lesson) => lesson.subject.code));
    return subjects.filter((subject) => subjectCodesWithLessons.has(subject.code));
  }, [lessons, subjects]);

  const gradeOptions = useMemo(() => {
    if (!selectedSubjectCode) return [];
    const gradeSet = new Set<number>();
    for (const lesson of lessons) {
      if (lesson.subject.code === selectedSubjectCode) {
        gradeSet.add(lesson.grade);
      }
    }
    return Array.from(gradeSet)
      .sort((a, b) => a - b)
      .map((grade) => ({ label: `Lớp ${grade}`, value: String(grade) }));
  }, [lessons, selectedSubjectCode]);

  const filteredLessons = useMemo(() => {
    if (!selectedSubjectCode || !selectedGrade) return [];
    const parsedGrade = Number.parseInt(selectedGrade, 10);
    if (Number.isNaN(parsedGrade)) return [];
    return lessons
      .filter((lesson) => lesson.subject.code === selectedSubjectCode && lesson.grade === parsedGrade)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [lessons, selectedGrade, selectedSubjectCode]);

  useEffect(() => {
    if (!open) return;

    const hasDefaultSubject = Boolean(defaultSubjectCode && availableSubjects.some((subject) => subject.code === defaultSubjectCode));
    const nextSubject = hasDefaultSubject ? (defaultSubjectCode as string) : "";
    setSelectedSubjectCode(nextSubject);

    const hasDefaultGrade = Boolean(
      hasDefaultSubject &&
        defaultGrade &&
        lessons.some((lesson) => lesson.subject.code === defaultSubjectCode && lesson.grade === Number.parseInt(defaultGrade, 10))
    );
    setSelectedGrade(hasDefaultGrade ? (defaultGrade as string) : "");

    setLessonId(null);
    setStatus(null);
  }, [availableSubjects, defaultGrade, defaultSubjectCode, lessons, open]);

  useEffect(() => {
    if (lessonId == null) return;
    const stillExists = filteredLessons.some((lesson) => lesson.id === lessonId);
    if (!stillExists) {
      setLessonId(null);
    }
  }, [filteredLessons, lessonId]);

  const selectedLesson = useMemo(() => {
    if (lessonId == null) return null;
    return lessons.find((lesson) => lesson.id === lessonId) ?? null;
  }, [lessonId, lessons]);

  const selectedSubject = useMemo(() => {
    if (!selectedSubjectCode) return null;
    return subjects.find((subject) => subject.code === selectedSubjectCode) ?? null;
  }, [selectedSubjectCode, subjects]);

  const resetForm = () => {
    setLessonId(null);
    setQuestionText("");
    setQuestionType("TracNghiem");
    setDifficulty("NhanBiet");
    setDefaultPoint(1);
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setAnswerKey("");
  };

  const canUseAI = Boolean(selectedLesson && selectedSubject && selectedGrade && questionType && difficulty);

  const applyAIResult = (payload: {
    questionText?: string;
    questionType?: QuestionType;
    difficulty?: Difficulty;
    defaultPoint?: number;
    options?: string[];
    answerKey?: string;
  }) => {
    if (payload.questionText) {
      setQuestionText(payload.questionText);
    }

    if (payload.questionType) {
      setQuestionType(payload.questionType);
    }

    if (payload.difficulty) {
      setDifficulty(payload.difficulty);
    }

    if (payload.defaultPoint != null) {
      const numericPoint = Number(payload.defaultPoint);
      if (Number.isFinite(numericPoint)) {
        setDefaultPoint(numericPoint);
      }
    }

    const nextType = payload.questionType ?? questionType;
    if (nextType === "TracNghiem") {
      const options = (payload.options ?? []).map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object") {
          const first = Object.values(entry)[0];
          if (typeof first === "string") return first;
        }
        return "";
      });
      setOptionA(options[0] ?? "");
      setOptionB(options[1] ?? "");
      setOptionC(options[2] ?? "");
      setOptionD(options[3] ?? "");
      if (payload.answerKey) {
        setAnswerKey(payload.answerKey.toLowerCase());
      } else {
        setAnswerKey("");
      }
    } else {
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setAnswerKey("");
    }
  };

  const handleGenerateWithAI = async () => {
    if (!canUseAI || !selectedLesson || !selectedSubject) {
      setStatus({ type: "error", message: "Vui lòng chọn môn học, khối lớp và bài học trước khi tạo bằng AI." });
      return;
    }

    try {
      setAiLoading(true);
      setStatus(null);

      const lessonContent = extractLessonSummary(selectedLesson);
      const aiResult = await generateQuestionWithAI({
        lessonContent,
        subjectName: selectedSubject.name,
        grade: selectedLesson.grade,
        questionType,
        difficulty,
      });

      applyAIResult({
        questionText: aiResult.questionText,
        questionType: aiResult.questionType,
        difficulty: aiResult.difficulty,
        defaultPoint: aiResult.defaultPoint,
        options: aiResult.options,
        answerKey: aiResult.answerKey,
      });

      setStatus({ type: "success", message: "Đã sinh gợi ý câu hỏi từ AI. Vui lòng rà soát trước khi lưu." });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Không thể tạo câu hỏi bằng AI. Vui lòng thử lại." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubjectCode) {
      setStatus({ type: "error", message: "Vui lòng chọn môn học." });
      return;
    }

    if (!selectedGrade) {
      setStatus({ type: "error", message: "Vui lòng chọn khối lớp." });
      return;
    }

    if (!lessonId) {
      setStatus({ type: "error", message: "Vui lòng chọn bài học." });
      return;
    }

    if (!questionText.trim()) {
      setStatus({ type: "error", message: "Vui lòng nhập nội dung câu hỏi." });
      return;
    }

    let optionsJson: string | null = null;
    let computedAnswerKey = answerKey;

    if (questionType === "TracNghiem") {
      const preparedOptions = [
        { key: "a", value: optionA.trim() },
        { key: "b", value: optionB.trim() },
        { key: "c", value: optionC.trim() },
        { key: "d", value: optionD.trim() },
      ].filter((entry) => entry.value.length > 0);

      if (preparedOptions.length < 2) {
        setStatus({ type: "error", message: "Vui lòng nhập ít nhất 2 đáp án cho câu trắc nghiệm." });
        return;
      }

      if (!computedAnswerKey) {
        setStatus({ type: "error", message: "Vui lòng chọn đáp án đúng." });
        return;
      }

      optionsJson = JSON.stringify(preparedOptions.map((entry) => ({ [entry.key]: entry.value })));
    } else {
      computedAnswerKey = "";
    }

    setLoading(true);
    setStatus(null);
    try {
      await onSubmit({
        lessonId,
        questionText: questionText.trim(),
        questionType,
        difficulty,
        defaultPoint,
        optionsJson,
        answerKey: computedAnswerKey,
      });
      setStatus({ type: "success", message: "Thêm câu hỏi thành công!" });
      resetForm();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Không thể thêm câu hỏi. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tạo câu hỏi mới"
      icon={<Plus className="h-5 w-5 text-sky-500" aria-hidden />}
      headerActions={
        <button
          type="button"
          onClick={handleGenerateWithAI}
          disabled={!canUseAI || aiLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/20"
          title={canUseAI ? "Sinh nội dung câu hỏi dựa trên thông tin bài học" : "Vui lòng chọn môn, khối và bài học trước"}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Bot className="h-4 w-4" aria-hidden />}
          <span>{aiLoading ? "Đang sinh..." : "Tạo câu hỏi bằng AI"}</span>
        </button>
      }
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionSubject">
              Môn học
            </label>
            <select
              id="questionSubject"
              value={selectedSubjectCode}
              onChange={(event) => {
                setSelectedSubjectCode(event.target.value);
                setSelectedGrade("");
                setLessonId(null);
                setStatus(null);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            >
              <option value="" disabled>
                -- Chọn môn học --
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.code} value={subject.code}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionGrade">
              Khối lớp
            </label>
            <select
              id="questionGrade"
              value={selectedGrade}
              onChange={(event) => {
                setSelectedGrade(event.target.value);
                setLessonId(null);
                setStatus(null);
              }}
              disabled={!selectedSubjectCode || gradeOptions.length === 0}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-800/60"
            >
              <option value="" disabled>
                {selectedSubjectCode ? (gradeOptions.length > 0 ? "-- Chọn khối lớp --" : "Không có dữ liệu khối lớp") : "Vui lòng chọn môn học"}
              </option>
              {gradeOptions.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionLesson">
            Bài học
          </label>
          <select
            id="questionLesson"
            value={lessonId ?? ""}
            onChange={(event) => {
              setLessonId(Number.parseInt(event.target.value, 10));
              setStatus(null);
            }}
            disabled={filteredLessons.length === 0}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-800/60"
          >
            <option value="" disabled>
              {selectedSubjectCode && selectedGrade
                ? filteredLessons.length > 0
                  ? "-- Chọn bài học --"
                  : "Không có bài học phù hợp"
                : "Vui lòng chọn môn & khối"}
            </option>
            {filteredLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name} (ID: {lesson.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionType">
              Loại câu hỏi
            </label>
            <select
              id="questionType"
              value={questionType}
              onChange={(event) => {
                const nextType = event.target.value as QuestionType;
                setQuestionType(nextType);
                if (nextType !== "TracNghiem") {
                  setAnswerKey("");
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            >
              <option value="TracNghiem">Trắc nghiệm</option>
              <option value="TuLuan">Tự luận</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionDifficulty">
              Mức độ
            </label>
            <select
              id="questionDifficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            >
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionText">
            Nội dung câu hỏi (hỗ trợ LaTeX)
          </label>
          <textarea
            id="questionText"
            rows={4}
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="Nhập nội dung câu hỏi, ví dụ: Giải bất phương trình \\( 2x - 3 > 5 \\)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="questionPoint">
            Điểm mặc định
          </label>
          <input
            id="questionPoint"
            type="number"
            min={0}
            step={0.1}
            value={defaultPoint}
            onChange={(event) => setDefaultPoint(Number.parseFloat(event.target.value) || 0)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        {questionType === "TracNghiem" ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Lựa chọn (chọn 1 đáp án đúng)</p>
            {[
              { label: "A", value: optionA, setter: setOptionA },
              { label: "B", value: optionB, setter: setOptionB },
              { label: "C", value: optionC, setter: setOptionC },
              { label: "D", value: optionD, setter: setOptionD },
            ].map(({ label, value, setter }) => (
              <label key={label} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="answerKey"
                  value={label.toLowerCase()}
                  checked={answerKey === label.toLowerCase()}
                  onChange={(event) => setAnswerKey(event.target.value)}
                  className="h-4 w-4 border-slate-300 text-sky-500 focus:ring-sky-400 dark:border-slate-600"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  placeholder={`Đáp án ${label}`}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                />
              </label>
            ))}
          </div>
        ) : null}
        {status ? (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
