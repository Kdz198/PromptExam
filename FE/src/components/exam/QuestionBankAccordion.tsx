import { LibraryBig, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import type { Lesson, Question, Subject } from "../../types/api";

interface QuestionBankAccordionProps {
  subjects: Subject[];
  lessons: Lesson[];
  selectedSubject: string;
  selectedGrade: string;
  selectedLessonId: string;
  selectedType: string;
  selectedDifficulty: string;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onLessonChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  questions: Question[];
  loading: boolean;
  selectedQuestionIds: number[];
  onToggleQuestion: (id: number) => void;
  onOpenAddQuestion: () => void;
  onEditQuestion: (question: Question) => void;
}

const grades = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: String(index + 1),
}));

export function QuestionBankAccordion({
  subjects,
  lessons,
  selectedSubject,
  selectedGrade,
  selectedLessonId,
  selectedType,
  selectedDifficulty,
  onSubjectChange,
  onGradeChange,
  onLessonChange,
  onTypeChange,
  onDifficultyChange,
  questions,
  loading,
  selectedQuestionIds,
  onToggleQuestion,
  onOpenAddQuestion,
  onEditQuestion,
}: QuestionBankAccordionProps) {
  const [open, setOpen] = useState(false);

  const filteredLessons = useMemo(() => {
    if (!selectedSubject || !selectedGrade) return [];
    return lessons.filter((lesson) => lesson.subject.code === selectedSubject && lesson.grade === Number.parseInt(selectedGrade, 10));
  }, [lessons, selectedGrade, selectedSubject]);

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-colors dark:bg-slate-900 dark:ring-slate-700/60 dark:shadow-none">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-slate-800 transition-colors dark:text-slate-100"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex items-center gap-2 text-base font-semibold">
          <LibraryBig className="h-5 w-5 text-sky-500" aria-hidden />
          Ngân hàng câu hỏi
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{open ? "Thu gọn" : "Mở rộng"}</span>
      </button>

      {open ? (
        <div className="border-t border-slate-200 px-6 py-5 transition-colors dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Duyệt, chọn và quản lý các câu hỏi đã được phân loại.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="bankSubjectSelect">
                Môn học
              </label>
              <div className="flex gap-2">
                <select
                  id="bankSubjectSelect"
                  value={selectedSubject}
                  onChange={(event) => onSubjectChange(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                >
                  <option value="" disabled>
                    -- Chọn môn học --
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject.code} value={subject.code}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onOpenAddQuestion}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/20 dark:hover:text-sky-200"
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden />
                  Câu hỏi mới
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="bankGradeSelect">
                Lớp
              </label>
              <select
                id="bankGradeSelect"
                value={selectedGrade}
                onChange={(event) => onGradeChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              >
                <option value="" disabled>
                  -- Chọn lớp --
                </option>
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="bankLessonSelect">
                Bài học
              </label>
              <select
                id="bankLessonSelect"
                value={selectedLessonId}
                onChange={(event) => onLessonChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                disabled={filteredLessons.length === 0}
              >
                <option value="" disabled>
                  {filteredLessons.length === 0 ? "Vui lòng chọn môn và lớp" : "-- Chọn bài học --"}
                </option>
                {filteredLessons.map((lesson) => (
                  <option key={lesson.id} value={String(lesson.id)}>
                    {lesson.name} (ID: {lesson.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="bankTypeSelect">
                Loại câu hỏi
              </label>
              <select
                id="bankTypeSelect"
                value={selectedType}
                onChange={(event) => onTypeChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              >
                <option value="all">Tất cả</option>
                <option value="TracNghiem">Trắc nghiệm</option>
                <option value="TuLuan">Tự luận</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="bankDifficultySelect">
                Mức độ
              </label>
              <select
                id="bankDifficultySelect"
                value={selectedDifficulty}
                onChange={(event) => onDifficultyChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              >
                <option value="all">Tất cả</option>
                <option value="NhanBiet">Nhận biết</option>
                <option value="ThongHieu">Thông hiểu</option>
                <option value="VanDung">Vận dụng</option>
                <option value="VanDungCao">Vận dụng cao</option>
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải câu hỏi...</p>
            ) : questions.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Không tìm thấy câu hỏi nào phù hợp.</p>
            ) : (
              <SimpleBar className="max-h-[360px] pr-2" autoHide={false}>
                <div className="flex flex-col gap-3">
                  {questions.map((question, index) => {
                    let optionsList: string[] = [];

                    if (question.optionsJson) {
                      try {
                        const parsed = JSON.parse(question.optionsJson);
                        if (Array.isArray(parsed)) {
                          optionsList = parsed
                            .map((option: Record<string, string>) => {
                              const key = Object.keys(option)[0];
                              return `${key.toUpperCase()}: ${option[key]}`;
                            })
                            .filter(Boolean);
                        }
                      } catch (error) {
                        console.error("Không thể parse options", error);
                      }
                    }

                    const isChecked = selectedQuestionIds.includes(question.id);

                    return (
                      <article
                        key={question.id}
                        className="relative rounded-xl border border-white bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800"
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onEditQuestion(question);
                          }}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:bg-sky-500/20"
                          aria-label="Chỉnh sửa câu hỏi"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Chỉnh sửa câu hỏi</span>
                        </button>
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 dark:border-slate-600"
                            checked={isChecked}
                            onChange={() => onToggleQuestion(question.id)}
                          />
                          <div className="flex flex-col gap-2">
                            <p className="font-semibold text-slate-700 dark:text-slate-100">
                              Câu {index + 1}:{" "}
                              <span
                                className="font-normal text-slate-600 dark:text-slate-300"
                                dangerouslySetInnerHTML={{ __html: question.questionText }}
                              />
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                                Loại: {question.questionType === "TracNghiem" ? "Trắc nghiệm" : "Tự luận"}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                                Mức độ: {question.difficulty}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                                Điểm: {question.defaultPoint}
                              </span>
                              {question.questionType === "TracNghiem" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                                  Đáp án: {question.answerKey?.toUpperCase() || ""}
                                </span>
                              ) : null}
                            </div>
                            {optionsList.length > 0 ? (
                              <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
                                {optionsList.map((option) => (
                                  <li key={option}>{option}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </label>
                      </article>
                    );
                  })}
                </div>
              </SimpleBar>
            )}
          </div>

          {selectedQuestionIds.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Đã chọn: <strong>{selectedQuestionIds.length}</strong> câu hỏi
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
