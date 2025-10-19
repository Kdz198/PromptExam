import { CalendarClock, ClipboardList, FileText, Layers } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import { PreviewPanel } from "../components/exam/PreviewPanel";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ApiKeyModal } from "../components/modals/ApiKeyModal";
import { ViewQuestionModal } from "../components/modals/ViewQuestionModal";
import { fetchExams, fetchMatrixDetails, fetchSubjects } from "../services/api";
import type { Exam, MatrixConfig, Question, Subject } from "../types/api";

const THEME_STORAGE_KEY = "exam-assistant-theme";

interface ExamLibraryPageProps {
  tabSwitcher?: ReactNode;
}

export function ExamLibraryPage({ tabSwitcher }: ExamLibraryPageProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [matrixConfigCache, setMatrixConfigCache] = useState<Record<number, MatrixConfig[]>>({});
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionToView, setQuestionToView] = useState<Question | null>(null);
  const selectedExam = useMemo(() => exams.find((exam) => exam.id === selectedExamId) ?? null, [exams, selectedExamId]);
  const selectedMatrixId = selectedExam?.matrix?.id ?? null;
  const selectedQuestions = selectedExam?.questions ?? [];
  const matrixConfigs = useMemo(() => {
    if (!selectedExam) return [] as MatrixConfig[];
    if (selectedExam.matrix?.matrixConfigs?.length) return selectedExam.matrix.matrixConfigs;
    if (selectedExam.matrixConfigs?.length) return selectedExam.matrixConfigs;
    if (selectedMatrixId && matrixConfigCache[selectedMatrixId]) return matrixConfigCache[selectedMatrixId];
    return [] as MatrixConfig[];
  }, [matrixConfigCache, selectedExam, selectedMatrixId]);
  const selectedMatrix = useMemo(() => {
    if (selectedExam?.matrix) return selectedExam.matrix;
    if (matrixConfigs.length > 0) {
      const matrixFromConfig = matrixConfigs[0]?.matrix;
      if (matrixFromConfig) return matrixFromConfig;
    }
    return null;
  }, [matrixConfigs, selectedExam]);

  const handleViewQuestion = useCallback((question: Question) => {
    setQuestionToView(question);
    setQuestionModalOpen(true);
  }, []);

  useEffect(() => {
    if (!questionModalOpen) return;
    if (!questionToView) return;
    const stillExists = selectedExam?.questions?.some((question) => question.id === questionToView.id);
    if (!stillExists) {
      setQuestionModalOpen(false);
      setQuestionToView(null);
    }
  }, [questionModalOpen, questionToView, selectedExam]);

  const handleCloseQuestionModal = useCallback(() => {
    setQuestionModalOpen(false);
    setQuestionToView(null);
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

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const loadExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExams();
      setExams(data);
      if (data.length > 0) {
        setSelectedExamId((current) => {
          if (current && data.some((exam) => exam.id === current)) return current;
          return data[0].id;
        });
      } else {
        setSelectedExamId(null);
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Không thể tải danh sách đề thi.";
      setError(message);
      setExams([]);
      setSelectedExamId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    void loadSubjects();
  }, []);

  useEffect(() => {
    if (!selectedMatrixId) return;
    if (matrixConfigCache[selectedMatrixId]) return;

    const initialConfigs = selectedExam?.matrix?.matrixConfigs?.length
      ? selectedExam.matrix.matrixConfigs
      : selectedExam?.matrixConfigs?.length
      ? selectedExam.matrixConfigs
      : null;

    if (initialConfigs && initialConfigs.length > 0) {
      setMatrixConfigCache((prev) => {
        if (prev[selectedMatrixId]) return prev;
        return { ...prev, [selectedMatrixId]: initialConfigs };
      });
      return;
    }

    const loadMatrixConfigs = async () => {
      try {
        setMatrixLoading(true);
        const configs = await fetchMatrixDetails(selectedMatrixId);
        setMatrixConfigCache((prev) => ({ ...prev, [selectedMatrixId]: configs }));
      } catch (error) {
        console.error(error);
      } finally {
        setMatrixLoading(false);
      }
    };

    void loadMatrixConfigs();
  }, [matrixConfigCache, selectedExam, selectedMatrixId]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header onOpenApiKeyModal={() => setApiKeyModalOpen(true)} theme={theme} onToggleTheme={handleToggleTheme} />

      {tabSwitcher ? (
        <div className="bg-slate-100 py-4 transition-colors dark:bg-slate-950">
          <div className="mx-auto flex max-w-6xl justify-center px-4">{tabSwitcher}</div>
        </div>
      ) : null}

      <main className="mx-auto max-w-6xl px-4 py-10 transition-colors">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
            <header className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors dark:bg-sky-500/20 dark:text-sky-200">
                <ClipboardList className="h-5 w-5" aria-hidden />
              </span>
              <span>Danh sách đề thi</span>
            </header>

            <div className="mt-6">
              {loading ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-10 text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Đang tải danh sách đề thi...
                </div>
              ) : error ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-10 text-center text-sm text-rose-600 transition-colors dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  {error}
                </div>
              ) : exams.length === 0 ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Chưa có đề thi nào. Hãy tạo đề thi từ tab Tạo đề thi.
                </div>
              ) : (
                <SimpleBar className="max-h-[60vh]" autoHide={false}>
                  <div className="space-y-3 pr-2">
                    {exams.map((exam) => {
                      const isActive = exam.id === selectedExamId;
                      return (
                        <button
                          type="button"
                          key={exam.id}
                          onClick={() => setSelectedExamId(exam.id)}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-500/60 ${
                            isActive
                              ? "border-sky-400 bg-sky-50 text-slate-800 shadow-sm dark:border-sky-400/70 dark:bg-sky-500/10 dark:text-slate-100"
                              : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{exam.examName}</h3>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ID: {exam.id}</p>
                            </div>
                            {exam.grade ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                                <Layers className="h-3.5 w-3.5" aria-hidden /> Lớp {exam.grade}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {exam.createdAt ? (
                              <span className="inline-flex items-center gap-1">
                                <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                                {new Date(exam.createdAt).toLocaleString()}
                              </span>
                            ) : null}
                            {typeof exam.subjectId === "number" ? (
                              <span className="inline-flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" aria-hidden />
                                Môn ID: {exam.subjectId}
                              </span>
                            ) : null}
                            <span className="inline-flex items-center gap-1">
                              <ClipboardList className="h-3.5 w-3.5" aria-hidden />
                              {exam.questions?.length ?? 0} câu hỏi
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </SimpleBar>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
              <header className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors dark:bg-emerald-500/20 dark:text-emerald-200">
                  <ClipboardList className="h-5 w-5" aria-hidden />
                </span>
                <span>Chi tiết đề thi</span>
              </header>

              {selectedExam ? (
                <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedExam.examName}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                        {selectedExam.createdAt ? new Date(selectedExam.createdAt).toLocaleString() : "Chưa xác định"}
                      </span>
                      {typeof selectedExam.subjectId === "number" ? (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" aria-hidden />
                          Môn ID: {selectedExam.subjectId}
                        </span>
                      ) : null}
                      {selectedExam.grade ? (
                        <span className="inline-flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" aria-hidden />
                          Lớp {selectedExam.grade}
                        </span>
                      ) : null}
                      {typeof selectedExam.durationMinutes === "number" && selectedExam.durationMinutes > 0 ? (
                        <span className="inline-flex items-center gap-1">Thời lượng: {selectedExam.durationMinutes} phút</span>
                      ) : null}
                      {typeof selectedExam.totalMarks === "number" && selectedExam.totalMarks > 0 ? (
                        <span className="inline-flex items-center gap-1">Tổng điểm: {selectedExam.totalMarks}</span>
                      ) : null}
                    </div>
                    {selectedExam.description ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{selectedExam.description}</p> : null}
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Chọn một đề thi ở danh sách bên trái để xem chi tiết.
                </div>
              )}
            </section>

            <PreviewPanel
              selectedQuestions={selectedQuestions}
              onRemoveQuestion={() => undefined}
              onViewQuestion={handleViewQuestion}
              selectedMatrix={selectedMatrix}
              matrixConfigs={matrixConfigs}
              onGenerateWithAI={() => undefined}
              canGenerate={false}
              loading={matrixLoading}
              subjects={subjects}
              validationMessage={null}
              readOnly
              allowReadOnlyQuestionView
            />
          </div>
        </div>
      </main>

      <Footer />

      <ApiKeyModal open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
      <ViewQuestionModal question={questionToView} open={questionModalOpen} onClose={handleCloseQuestionModal} />
    </div>
  );
}

export default ExamLibraryPage;
