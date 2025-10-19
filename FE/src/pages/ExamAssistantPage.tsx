import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MatrixBankAccordion } from "../components/exam/MatrixBankAccordion";
import { PreviewPanel } from "../components/exam/PreviewPanel";
import { QuestionBankAccordion } from "../components/exam/QuestionBankAccordion";
import { StructureBuilderCard } from "../components/exam/StructureBuilderCard";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { AddLessonModal } from "../components/modals/AddLessonModal";
import { AddQuestionModal } from "../components/modals/AddQuestionModal";
import { AddSubjectModal } from "../components/modals/AddSubjectModal";
import { ApiKeyModal } from "../components/modals/ApiKeyModal";
import { CreateExamModal } from "../components/modals/CreateExamModal";
import { CreateMatrixModal } from "../components/modals/CreateMatrixModal.tsx";
import { EditLessonModal } from "../components/modals/EditLessonModal";
import { EditMatrixModal } from "../components/modals/EditMatrixModal";
import { EditQuestionModal } from "../components/modals/EditQuestionModal";
import { ViewLessonModal } from "../components/modals/ViewLessonModal";
import { ViewMatrixModal } from "../components/modals/ViewMatrixModal";
import { ViewQuestionModal } from "../components/modals/ViewQuestionModal";
import {
  createExam,
  createLesson,
  createMatrix,
  createQuestion,
  createSubject,
  fetchLessons,
  fetchMatrices,
  fetchMatrixDetails,
  fetchQuestions,
  fetchSubjects,
  updateLesson,
  updateMatrix,
  updateQuestion,
} from "../services/api";
import type { Difficulty, Lesson, Matrix, MatrixConfig, Question, Subject } from "../types/api";

interface MessageState {
  type: "success" | "error";
  text: string;
}

const THEME_STORAGE_KEY = "exam-assistant-theme";

interface ExamAssistantPageProps {
  tabSwitcher?: ReactNode;
}

interface ExamDraft {
  examName: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
}

export function ExamAssistantPage({ tabSwitcher }: ExamAssistantPageProps) {
  const [message, setMessage] = useState<MessageState | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [matrices, setMatrices] = useState<Matrix[]>([]);

  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [questionBankLoading, setQuestionBankLoading] = useState(false);
  const [matrixLoading, setMatrixLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const [questionBankSubject, setQuestionBankSubject] = useState("");
  const [questionBankGrade, setQuestionBankGrade] = useState("");
  const [questionBankLessonId, setQuestionBankLessonId] = useState("");
  const [questionBankType, setQuestionBankType] = useState("all");
  const [questionBankDifficulty, setQuestionBankDifficulty] = useState("all");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [selectedQuestionEntities, setSelectedQuestionEntities] = useState<Record<number, Question>>({});

  const [matrixSubject, setMatrixSubject] = useState("");
  const [matrixGrade, setMatrixGrade] = useState("");
  const [selectedMatrixId, setSelectedMatrixId] = useState<number | null>(null);
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);
  const [matrixPreviewConfigs, setMatrixPreviewConfigs] = useState<MatrixConfig[]>([]);
  const [matrixModalConfigs, setMatrixModalConfigs] = useState<MatrixConfig[]>([]);

  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateValidationMessage, setGenerateValidationMessage] = useState<string | null>(null);

  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [addLessonModalOpen, setAddLessonModalOpen] = useState(false);
  const [addQuestionModalOpen, setAddQuestionModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [lessonToView, setLessonToView] = useState<Lesson | null>(null);
  const [editLessonModalOpen, setEditLessonModalOpen] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  const [createExamModalOpen, setCreateExamModalOpen] = useState(false);
  const [examDraft, setExamDraft] = useState<ExamDraft | null>(null);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [matrixToView, setMatrixToView] = useState<Matrix | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionToView, setQuestionToView] = useState<Question | null>(null);
  const [editQuestionModalOpen, setEditQuestionModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [createMatrixModalOpen, setCreateMatrixModalOpen] = useState(false);
  const [editMatrixModalOpen, setEditMatrixModalOpen] = useState(false);
  const [matrixToEdit, setMatrixToEdit] = useState<Matrix | null>(null);
  const [matrixEditConfigs, setMatrixEditConfigs] = useState<MatrixConfig[]>([]);

  const difficultyLabelMap: Record<Difficulty, string> = {
    NhanBiet: "Nhận biết",
    ThongHieu: "Thông hiểu",
    VanDung: "Vận dụng",
    VanDungCao: "Vận dụng cao",
  };

  useEffect(() => {
    const mathjaxId = "mathjax-script";
    if (!document.getElementById(mathjaxId)) {
      const script = document.createElement("script");
      script.id = mathjaxId;
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const rootElement = document.documentElement;
    rootElement.classList.toggle("dark", theme === "dark");
    rootElement.style.colorScheme = theme;
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    }
  }, [theme]);

  const loadSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Lỗi khi tải danh sách môn học." });
    } finally {
      setSubjectsLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      setLessonsLoading(true);
      const data = await fetchLessons();
      setLessons(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Lỗi khi tải danh sách bài học." });
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
    loadLessons();
  }, []);

  useEffect(() => {
    if (!questionBankGrade || !questionBankLessonId) {
      setQuestions([]);
      return;
    }

    const loadQuestionsData = async () => {
      try {
        setQuestionBankLoading(true);
        const data = await fetchQuestions({
          gradeId: questionBankGrade,
          lessonId: questionBankLessonId,
        });
        setQuestions(data);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "Lỗi khi tải ngân hàng câu hỏi." });
      } finally {
        setQuestionBankLoading(false);
      }
    };

    loadQuestionsData();
  }, [questionBankGrade, questionBankLessonId]);

  const fetchMatricesForSelection = useCallback(
    async (subjectCode: string, gradeValue: string) => {
      if (!subjectCode || !gradeValue) {
        setMatrices([]);
        return;
      }

      const subjectRecord = subjects.find((subject) => subject.code === subjectCode);
      const subjectId = subjectRecord?.id;
      if (typeof subjectId !== "number") {
        setMatrices([]);
        return;
      }

      const gradeNumber = Number.parseInt(gradeValue, 10);
      if (Number.isNaN(gradeNumber)) {
        setMatrices([]);
        return;
      }

      try {
        setMatrixLoading(true);
        const data = await fetchMatrices({ subjectId, grade: gradeNumber });
        setMatrices(data);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "Lỗi khi tải ngân hàng ma trận." });
      } finally {
        setMatrixLoading(false);
      }
    },
    [subjects]
  );

  useEffect(() => {
    void fetchMatricesForSelection(matrixSubject, matrixGrade);
  }, [fetchMatricesForSelection, matrixGrade, matrixSubject]);

  useEffect(() => {
    window.MathJax?.typesetPromise?.();
  }, [questions]);

  useEffect(() => {
    window.MathJax?.typesetPromise?.();
  }, [selectedQuestionIds]);

  useEffect(() => {
    setGenerateValidationMessage(null);
  }, [matrixPreviewConfigs, selectedMatrixId, selectedQuestionIds]);

  useEffect(() => {
    if (selectedMatrixId == null) return;
    const matchedMatrix = matrices.find((matrix) => matrix.id === selectedMatrixId);
    if (!matchedMatrix) return;
    if (selectedMatrix == null || selectedMatrix.id !== matchedMatrix.id || selectedMatrix !== matchedMatrix) {
      setSelectedMatrix(matchedMatrix);
    }
  }, [matrices, selectedMatrix, selectedMatrixId]);

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => {
        if (questionBankType === "all") return true;
        return question.questionType === questionBankType;
      })
      .filter((question) => {
        if (questionBankDifficulty === "all") return true;
        return question.difficulty === questionBankDifficulty;
      });
  }, [questionBankDifficulty, questionBankType, questions]);

  useEffect(() => {
    if (questions.length === 0) return;

    setSelectedQuestionEntities((prev) => {
      let hasChanged = false;
      let next = prev;

      for (const question of questions) {
        if (!selectedQuestionIds.includes(question.id)) continue;
        if (prev[question.id] === question) continue;
        if (!hasChanged) {
          next = { ...prev };
          hasChanged = true;
        }
        next[question.id] = question;
      }

      return hasChanged ? next : prev;
    });
  }, [questions, selectedQuestionIds]);

  const selectedQuestionDetails = useMemo(() => {
    return selectedQuestionIds.map((id) => selectedQuestionEntities[id] ?? null).filter((question): question is Question => Boolean(question));
  }, [selectedQuestionEntities, selectedQuestionIds]);

  const totalSelectedPoints = useMemo(() => {
    return selectedQuestionDetails.reduce((total, question) => total + (question.defaultPoint ?? 0), 0);
  }, [selectedQuestionDetails]);

  useEffect(() => {
    if (!questionToView) return;
    const stillSelected = selectedQuestionDetails.some((question) => question.id === questionToView.id);
    if (!stillSelected) {
      setQuestionModalOpen(false);
      setQuestionToView(null);
    }
  }, [questionToView, selectedQuestionDetails]);

  const canGenerateWithAI = selectedQuestionDetails.length > 0 && selectedMatrix !== null;

  const handleToggleQuestion = (id: number) => {
    const alreadySelected = selectedQuestionIds.includes(id);

    if (alreadySelected) {
      setSelectedQuestionIds((prev) => prev.filter((questionId) => questionId !== id));
      setSelectedQuestionEntities((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (questionToView?.id === id) {
        setQuestionModalOpen(false);
        setQuestionToView(null);
      }
      return;
    }

    const question = questions.find((item) => item.id === id) ?? selectedQuestionEntities[id];
    if (!question) {
      console.warn("Không tìm thấy dữ liệu câu hỏi để thêm vào danh sách xem trước", id);
      return;
    }

    setSelectedQuestionIds((prev) => [...prev, id]);
    setSelectedQuestionEntities((prev) => ({
      ...prev,
      [id]: question,
    }));
  };

  const handleRemoveSelectedQuestion = (id: number) => {
    setSelectedQuestionIds((prev) => prev.filter((questionId) => questionId !== id));
    setSelectedQuestionEntities((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (questionToView?.id === id) {
      setQuestionModalOpen(false);
      setQuestionToView(null);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerateWithAI) {
      setGenerateValidationMessage("Vui lòng chọn câu hỏi và ma trận trước khi tạo.");
      setMessage(null);
      return;
    }

    setGenerateValidationMessage(null);

    if (selectedMatrix) {
      const totalSelected = selectedQuestionDetails.length;

      if (matrixPreviewConfigs.length > 0) {
        const requirementEntries = matrixPreviewConfigs.reduce<Record<Difficulty, number>>((acc, config) => {
          acc[config.difficulty] = (acc[config.difficulty] ?? 0) + config.require_count;
          return acc;
        }, {} as Record<Difficulty, number>);

        const totalRequired = Object.values(requirementEntries).reduce((total, count) => total + count, 0);

        if (totalSelected !== totalRequired) {
          const difference = totalRequired - totalSelected;
          const reason = difference > 0 ? `thiếu ${difference} câu` : `thừa ${Math.abs(difference)} câu`;
          setGenerateValidationMessage(`Số câu hỏi đã chọn chưa khớp với ma trận (${reason}).`);
          setMessage(null);
          return;
        }

        const selectedByDifficulty = selectedQuestionDetails.reduce<Record<Difficulty, number>>((acc, question) => {
          acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
          return acc;
        }, {} as Record<Difficulty, number>);

        const mismatched: string[] = [];
        for (const [difficulty, requiredCount] of Object.entries(requirementEntries) as Array<[Difficulty, number]>) {
          const selectedCount = selectedByDifficulty[difficulty] ?? 0;
          if (selectedCount !== requiredCount) {
            mismatched.push(`${difficultyLabelMap[difficulty]} cần ${requiredCount} câu nhưng đang có ${selectedCount}`);
          }
        }

        const unexpected = Object.entries(selectedByDifficulty).filter(([difficulty, count]) => !(difficulty in requirementEntries) && count > 0);
        if (unexpected.length > 0) {
          const detail = unexpected
            .map(([difficulty, count]) => `${difficultyLabelMap[difficulty as Difficulty]} không có trong ma trận nhưng đã chọn ${count} câu`)
            .join(", ");
          setGenerateValidationMessage(`Cấu hình ma trận không yêu cầu các câu hiện có: ${detail}.`);
          setMessage(null);
          return;
        }

        if (mismatched.length > 0) {
          setGenerateValidationMessage(`Cần điều chỉnh lựa chọn câu hỏi: ${mismatched.join("; ")}.`);
          setMessage(null);
          return;
        }
      } else if (selectedMatrix.totalQuestions > 0 && totalSelected !== selectedMatrix.totalQuestions) {
        const difference = selectedMatrix.totalQuestions - totalSelected;
        const reason = difference > 0 ? `thiếu ${difference} câu` : `thừa ${Math.abs(difference)} câu`;
        setGenerateValidationMessage(`Số câu hỏi đã chọn chưa khớp với ma trận (${reason}).`);
        setMessage(null);
        return;
      }
    }

    setGenerateValidationMessage(null);
    setMessage(null);

    const suggestedName = selectedMatrix ? `Đề thi ${selectedMatrix.matrixName}` : "Đề thi mới";
    const suggestedDescription = selectedMatrix?.description ?? "";
    const suggestedMarks = totalSelectedPoints > 0 ? totalSelectedPoints : 10;

    setExamDraft({
      examName: suggestedName,
      description: suggestedDescription,
      durationMinutes: 90,
      totalMarks: Number.isFinite(suggestedMarks) && suggestedMarks > 0 ? suggestedMarks : 10,
    });
    setCreateExamModalOpen(true);
  };

  const handleSubmitExam = async ({ examName, description, durationMinutes, totalMarks }: ExamDraft) => {
    if (!selectedMatrix) {
      const error = new Error("Bạn cần chọn ma trận trước khi tạo đề thi.");
      setMessage({ type: "error", text: error.message });
      throw error;
    }

    const subjectId = selectedMatrix.subject?.id ?? selectedMatrix.subjectId;
    if (typeof subjectId !== "number") {
      const error = new Error("Không tìm thấy thông tin môn học của ma trận.");
      setMessage({ type: "error", text: error.message });
      throw error;
    }

    const gradeValue = selectedMatrix.grade;
    if (typeof gradeValue !== "number") {
      const error = new Error("Không xác định được khối lớp của ma trận.");
      setMessage({ type: "error", text: error.message });
      throw error;
    }

    const questionIds = selectedQuestionDetails.map((question) => question.id);
    if (questionIds.length === 0) {
      const error = new Error("Vui lòng chọn câu hỏi trước khi tạo đề thi.");
      setMessage({ type: "error", text: error.message });
      throw error;
    }

    setGenerateLoading(true);
    try {
      const createdExam = await createExam({
        examName,
        description,
        subjectId,
        grade: gradeValue,
        matrixId: selectedMatrix.id,
        questionIds,
        durationMinutes,
        totalMarks,
      });

      setMessage({ type: "success", text: `Đã tạo đề thi "${createdExam.examName}" thành công.` });
      setCreateExamModalOpen(false);
      setExamDraft(null);
    } catch (error) {
      console.error(error);
      const messageText = error instanceof Error ? error.message : "Không thể tạo đề thi. Vui lòng thử lại.";
      setMessage({ type: "error", text: messageText });
      throw new Error(messageText);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleToggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const handleCreateMatrix = async (payload: {
    subjectId: number;
    grade: number;
    matrixName: string;
    description: string;
    difficultyQuestionCountMap: Partial<Record<Difficulty, number>>;
  }) => {
    try {
      const newMatrix = await createMatrix(payload);
      const subjectRecord = subjects.find((subject) => subject.id === payload.subjectId);
      const gradeString = String(payload.grade);

      if (subjectRecord?.code) {
        setMatrixSubject(subjectRecord.code);
        setMatrixGrade(gradeString);
        await fetchMatricesForSelection(subjectRecord.code, gradeString);
      } else {
        await fetchMatricesForSelection(matrixSubject, matrixGrade);
      }

      setSelectedMatrixId(newMatrix.id);
      setSelectedMatrix(newMatrix);
      setMatrixPreviewConfigs([]);

      try {
        const configs = await fetchMatrixDetails(newMatrix.id);
        setMatrixPreviewConfigs(configs);
      } catch (detailError) {
        console.error(detailError);
        setMatrixPreviewConfigs([]);
      }

      setMessage({ type: "success", text: "Đã tạo ma trận mới thành công." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Không thể tạo ma trận mới." });
      throw error;
    }
  };

  const messageBanner = message ? (
    <div
      className={`rounded-2xl px-4 py-3 text-sm transition-colors ${
        message.type === "success"
          ? "border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300"
      }`}
    >
      {message.text}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header onOpenApiKeyModal={() => setApiKeyModalOpen(true)} theme={theme} onToggleTheme={handleToggleTheme} />

      {tabSwitcher ? (
        <div className="bg-slate-100 py-4 transition-colors dark:bg-slate-950">
          <div className="mx-auto flex max-w-6xl justify-center px-4">{tabSwitcher}</div>
        </div>
      ) : null}

      <main className="mx-auto max-w-6xl px-4 py-10 transition-colors">
        <div className="space-y-4">
          {subjectsLoading || lessonsLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Đang tải dữ liệu nền...
            </div>
          ) : null}
          {messageBanner}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <StructureBuilderCard
              subjects={subjects}
              lessons={lessons}
              selectedSubject={selectedSubject}
              selectedGrade={selectedGrade}
              selectedLessonId={selectedLessonId}
              onSubjectChange={(value) => {
                setSelectedSubject(value);
                setSelectedGrade("");
                setSelectedLessonId(null);
              }}
              onGradeChange={(value) => {
                setSelectedGrade(value);
                setSelectedLessonId(null);
              }}
              onLessonChange={(value) => setSelectedLessonId(value)}
              onOpenAddSubject={() => setAddSubjectModalOpen(true)}
              onOpenAddLesson={() => setAddLessonModalOpen(true)}
              onViewLesson={(lesson) => {
                setLessonToView(lesson);
                setLessonModalOpen(true);
              }}
              message={null}
            />

            <QuestionBankAccordion
              subjects={subjects}
              lessons={lessons}
              selectedSubject={questionBankSubject}
              selectedGrade={questionBankGrade}
              selectedLessonId={questionBankLessonId}
              selectedType={questionBankType}
              selectedDifficulty={questionBankDifficulty}
              onSubjectChange={(value) => {
                setQuestionBankSubject(value);
                setQuestionBankGrade("");
                setQuestionBankLessonId("");
              }}
              onGradeChange={(value) => {
                setQuestionBankGrade(value);
                setQuestionBankLessonId("");
              }}
              onLessonChange={(value) => {
                setQuestionBankLessonId(value);
              }}
              onTypeChange={setQuestionBankType}
              onDifficultyChange={setQuestionBankDifficulty}
              questions={filteredQuestions}
              loading={questionBankLoading}
              selectedQuestionIds={selectedQuestionIds}
              onToggleQuestion={handleToggleQuestion}
              onOpenAddQuestion={() => setAddQuestionModalOpen(true)}
              onEditQuestion={(question) => {
                setQuestionToEdit(question);
                setEditQuestionModalOpen(true);
              }}
            />

            <MatrixBankAccordion
              subjects={subjects}
              selectedSubject={matrixSubject}
              selectedGrade={matrixGrade}
              onSubjectChange={(value) => {
                setMatrixSubject(value);
                setMatrixGrade("");
                setSelectedMatrixId(null);
                setSelectedMatrix(null);
                setMatrixPreviewConfigs([]);
              }}
              onGradeChange={(value) => {
                setMatrixGrade(value);
                setSelectedMatrixId(null);
                setSelectedMatrix(null);
                setMatrixPreviewConfigs([]);
              }}
              matrices={matrices}
              loading={matrixLoading}
              selectedMatrixId={selectedMatrixId}
              onSelectMatrix={async (matrix) => {
                try {
                  setSelectedMatrixId(matrix.id);
                  setSelectedMatrix(matrix);
                  setMatrixPreviewConfigs([]);
                  const configs = await fetchMatrixDetails(matrix.id);
                  setMatrixPreviewConfigs(configs);
                } catch (error) {
                  console.error(error);
                  setSelectedMatrixId(null);
                  setSelectedMatrix(null);
                  setMatrixPreviewConfigs([]);
                  setMessage({ type: "error", text: "Không thể tải chi tiết ma trận." });
                }
              }}
              onViewMatrix={async (matrix) => {
                try {
                  setMatrixToView(matrix);
                  setMatrixModalOpen(true);
                  setMatrixModalConfigs([]);
                  const configs = await fetchMatrixDetails(matrix.id);
                  setMatrixModalConfigs(configs);
                } catch (error) {
                  console.error(error);
                  setMessage({ type: "error", text: "Không thể tải chi tiết ma trận." });
                }
              }}
              onEditMatrix={async (matrix) => {
                try {
                  setMatrixToEdit(matrix);
                  setMatrixEditConfigs([]);
                  setEditMatrixModalOpen(true);
                  const configs = await fetchMatrixDetails(matrix.id);
                  setMatrixEditConfigs(configs);
                } catch (error) {
                  console.error(error);
                  setMatrixToEdit(matrix);
                  setMatrixEditConfigs([]);
                  setEditMatrixModalOpen(true);
                  setMessage({ type: "error", text: "Không thể tải cấu hình ma trận để chỉnh sửa." });
                }
              }}
              onCreateMatrix={() => setCreateMatrixModalOpen(true)}
            />
          </div>

          <div className="space-y-6">
            <PreviewPanel
              selectedQuestions={selectedQuestionDetails}
              onRemoveQuestion={handleRemoveSelectedQuestion}
              onViewQuestion={(question) => {
                setQuestionToView(question);
                setQuestionModalOpen(true);
              }}
              selectedMatrix={selectedMatrix}
              matrixConfigs={matrixPreviewConfigs}
              onGenerateWithAI={handleGenerate}
              canGenerate={canGenerateWithAI}
              loading={generateLoading}
              subjects={subjects}
              validationMessage={generateValidationMessage}
            />
          </div>
        </div>
      </main>

      <Footer />

      <ApiKeyModal open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />

      <AddSubjectModal
        open={addSubjectModalOpen}
        onClose={() => setAddSubjectModalOpen(false)}
        onSubmit={async (payload) => {
          await createSubject(payload);
          await loadSubjects();
        }}
      />

      <AddLessonModal
        open={addLessonModalOpen}
        subjects={subjects}
        onClose={() => setAddLessonModalOpen(false)}
        onSubmit={async (payload) => {
          await createLesson(payload);
          await loadLessons();
        }}
      />

      <EditLessonModal
        open={editLessonModalOpen}
        lesson={lessonToEdit}
        subjects={subjects}
        onClose={() => {
          setEditLessonModalOpen(false);
          setLessonToEdit(null);
        }}
        onSubmit={async (payload) => {
          try {
            const updatedLesson = await updateLesson(payload);
            await loadLessons();

            const updatedSubjectCode = updatedLesson.subject.code ?? "";
            const updatedGradeValue = String(updatedLesson.grade);
            const updatedLessonIdString = String(updatedLesson.id);

            if (selectedLessonId === updatedLesson.id) {
              setSelectedSubject(updatedSubjectCode);
              setSelectedGrade(updatedGradeValue);
              setSelectedLessonId(updatedLesson.id);
            }

            if (questionBankLessonId && Number.parseInt(questionBankLessonId, 10) === updatedLesson.id) {
              setQuestionBankSubject(updatedSubjectCode);
              setQuestionBankGrade(updatedGradeValue);
              setQuestionBankLessonId(updatedLessonIdString);
            }

            setLessonToView((prev) => (prev && prev.id === updatedLesson.id ? updatedLesson : prev));
            setMessage({ type: "success", text: "Đã cập nhật bài học." });
          } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Không thể cập nhật bài học." });
            throw error;
          }
        }}
      />

      <AddQuestionModal
        open={addQuestionModalOpen}
        lessons={lessons}
        subjects={subjects}
        defaultSubjectCode={questionBankSubject || undefined}
        defaultGrade={questionBankGrade || undefined}
        onClose={() => setAddQuestionModalOpen(false)}
        onSubmit={async (payload) => {
          await createQuestion(payload);
          if (questionBankGrade && questionBankLessonId) {
            const data = await fetchQuestions({
              gradeId: questionBankGrade,
              lessonId: questionBankLessonId,
            });
            setQuestions(data);
          }
        }}
      />

      <EditQuestionModal
        open={editQuestionModalOpen}
        question={questionToEdit}
        lessons={lessons}
        subjects={subjects}
        onClose={() => {
          setEditQuestionModalOpen(false);
          setQuestionToEdit(null);
        }}
        onSubmit={async (payload) => {
          try {
            const updatedQuestion = await updateQuestion(payload);
            if (selectedQuestionIds.includes(updatedQuestion.id)) {
              setSelectedQuestionEntities((prev) => ({
                ...prev,
                [updatedQuestion.id]: updatedQuestion,
              }));
            }
            if (questionBankGrade && questionBankLessonId) {
              const data = await fetchQuestions({
                gradeId: questionBankGrade,
                lessonId: questionBankLessonId,
              });
              setQuestions(data);
            }
            setMessage({ type: "success", text: "Đã cập nhật câu hỏi." });
          } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Không thể cập nhật câu hỏi." });
            throw error;
          }
        }}
      />

      <ViewQuestionModal
        open={questionModalOpen}
        question={questionToView}
        onClose={() => {
          setQuestionModalOpen(false);
          setQuestionToView(null);
        }}
      />

      <ViewLessonModal
        lesson={lessonToView}
        open={lessonModalOpen}
        onClose={() => {
          setLessonModalOpen(false);
          setLessonToView(null);
        }}
        onEdit={(lesson) => {
          setLessonModalOpen(false);
          setLessonToEdit(lesson);
          setEditLessonModalOpen(true);
        }}
      />

      <ViewMatrixModal matrix={matrixToView} configs={matrixModalConfigs} open={matrixModalOpen} onClose={() => setMatrixModalOpen(false)} />

      <CreateExamModal
        open={createExamModalOpen}
        defaultValues={examDraft}
        questionCount={selectedQuestionDetails.length}
        matrixName={selectedMatrix?.matrixName}
        onClose={() => {
          if (generateLoading) return;
          setCreateExamModalOpen(false);
        }}
        onSubmit={handleSubmitExam}
        loading={generateLoading}
      />

      <CreateMatrixModal
        open={createMatrixModalOpen}
        subjects={subjects}
        onClose={() => setCreateMatrixModalOpen(false)}
        onSubmit={handleCreateMatrix}
      />

      <EditMatrixModal
        open={editMatrixModalOpen}
        matrix={matrixToEdit}
        configs={matrixEditConfigs}
        subjects={subjects}
        onClose={() => {
          setEditMatrixModalOpen(false);
          setMatrixToEdit(null);
          setMatrixEditConfigs([]);
        }}
        onSubmit={async (payload) => {
          try {
            const updatedMatrix = await updateMatrix(payload);

            const fallbackGrade = String(updatedMatrix.grade);
            const targetSubjectCode = matrixSubject || updatedMatrix.subject?.code || "";
            const targetGradeValue = matrixGrade || (fallbackGrade !== "undefined" ? fallbackGrade : "");

            if (targetSubjectCode && targetGradeValue) {
              if (matrixSubject !== targetSubjectCode) setMatrixSubject(targetSubjectCode);
              if (matrixGrade !== targetGradeValue) setMatrixGrade(targetGradeValue);
              await fetchMatricesForSelection(targetSubjectCode, targetGradeValue);
            } else {
              await fetchMatricesForSelection(matrixSubject, matrixGrade);
            }

            if (selectedMatrixId === updatedMatrix.id) {
              setSelectedMatrix(updatedMatrix);
              try {
                const configs = await fetchMatrixDetails(updatedMatrix.id);
                setMatrixPreviewConfigs(configs);
              } catch (detailError) {
                console.error(detailError);
              }
            }

            if (matrixModalOpen && matrixToView?.id === updatedMatrix.id) {
              setMatrixToView(updatedMatrix);
              try {
                const configs = await fetchMatrixDetails(updatedMatrix.id);
                setMatrixModalConfigs(configs);
              } catch (detailError) {
                console.error(detailError);
              }
            }

            setMessage({ type: "success", text: "Đã cập nhật ma trận." });
          } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Không thể cập nhật ma trận." });
            throw error;
          }
        }}
      />
    </div>
  );
}
