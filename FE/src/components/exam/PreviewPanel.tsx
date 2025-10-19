import { FileText, FolderOpen, Table, X } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useMemo } from "react";
import SimpleBar from "simplebar-react";
import type { Matrix, MatrixConfig, Question, Subject } from "../../types/api";

interface PreviewPanelProps {
  selectedQuestions: Question[];
  onRemoveQuestion: (id: number) => void;
  onViewQuestion?: (question: Question) => void;
  selectedMatrix: Matrix | null;
  matrixConfigs: MatrixConfig[];
  onGenerateWithAI: () => void;
  canGenerate: boolean;
  loading: boolean;
  subjects: Subject[];
  validationMessage?: string | null;
  readOnly?: boolean;
  footerSlot?: ReactNode;
  allowReadOnlyQuestionView?: boolean;
}

export function PreviewPanel({
  selectedQuestions,
  onRemoveQuestion,
  onViewQuestion = () => undefined,
  selectedMatrix,
  matrixConfigs,
  onGenerateWithAI,
  canGenerate,
  loading,
  subjects,
  validationMessage = null,
  readOnly = false,
  footerSlot,
  allowReadOnlyQuestionView = false,
}: PreviewPanelProps) {
  const questionTypeLabel = (type: Question["questionType"]) => (type === "TracNghiem" ? "Trắc nghiệm" : "Tự luận");
  const difficultyLabel = (value: MatrixConfig["difficulty"] | Question["difficulty"]) => {
    const mapping: Record<string, string> = {
      NhanBiet: "Nhận biết",
      ThongHieu: "Thông hiểu",
      VanDung: "Vận dụng",
      VanDungCao: "Vận dụng cao",
    };
    return mapping[value as string] ?? value;
  };

  const matrixSubjectName = useMemo(() => {
    if (!selectedMatrix) return "";
    if (selectedMatrix.subject?.name) return selectedMatrix.subject.name;
    if (selectedMatrix.subjectId == null) return "";
    const subjectMatch = subjects.find((subject) => subject.id === selectedMatrix.subjectId);
    return subjectMatch?.name ?? "";
  }, [selectedMatrix, subjects]);

  const totalPoints = useMemo(() => {
    return selectedQuestions.reduce((total, question) => total + (question.defaultPoint ?? 0), 0);
  }, [selectedQuestions]);

  const emptyQuestionMessage = readOnly ? "Đề thi chưa có câu hỏi." : "Chọn câu hỏi từ ngân hàng để xem trước.";

  const QUESTIONS_PER_PAGE = 6;

  const questionPages = useMemo<Question[][]>(() => {
    const pages: Question[][] = [];
    selectedQuestions.forEach((question, index) => {
      const pageIndex = Math.floor(index / QUESTIONS_PER_PAGE);
      if (!pages[pageIndex]) pages[pageIndex] = [];
      pages[pageIndex].push(question);
    });
    return pages;
  }, [selectedQuestions]);

  const renderQuestionCard = (question: Question, index: number, extraClassName?: string) => {
    const readOnlyInteractive = readOnly && allowReadOnlyQuestionView;
    const isInteractive = readOnlyInteractive || !readOnly;

    const interactiveProps = isInteractive
      ? {
          role: "button" as const,
          tabIndex: 0,
          onClick: () => onViewQuestion(question),
          onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onViewQuestion(question);
            }
          },
        }
      : {};

    const baseClassName =
      "relative flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition dark:border-slate-700 dark:bg-slate-800";
    const interactiveClassName = readOnly
      ? readOnlyInteractive
        ? "cursor-pointer hover:border-sky-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 dark:hover:border-sky-400 dark:hover:shadow-lg"
        : "cursor-default"
      : "hover:border-sky-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 cursor-pointer dark:hover:border-sky-400 dark:hover:shadow-lg";

    return (
      <div key={question.id} {...interactiveProps} className={`${baseClassName} ${interactiveClassName} ${extraClassName ?? ""}`}>
        {!readOnly ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemoveQuestion(question.id);
            }}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
            aria-label="Loại bỏ câu hỏi"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Câu {index + 1}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {question.id}</p>
        </div>
        <dl className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <dt className="font-medium dark:text-slate-200">Loại:</dt>
            <dd>{questionTypeLabel(question.questionType)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium dark:text-slate-200">Mức độ:</dt>
            <dd>{difficultyLabel(question.difficulty)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium dark:text-slate-200">Điểm:</dt>
            <dd>{question.defaultPoint}</dd>
          </div>
          {question.questionType === "TracNghiem" ? (
            <div className="flex items-center justify-between">
              <dt className="font-medium dark:text-slate-200">Đáp án:</dt>
              <dd>{question.answerKey?.toUpperCase() || ""}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    );
  };

  return (
    <section className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <header className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors dark:bg-emerald-500/20 dark:text-emerald-300">
          <FileText className="h-5 w-5" aria-hidden />
        </span>
        <span>Xem trước</span>
      </header>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors dark:bg-slate-800/80 dark:text-slate-200">
              <FolderOpen className="h-4 w-4" aria-hidden />
            </span>
            Câu hỏi đã chọn
          </h3>
          {selectedQuestions.length === 0 ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {emptyQuestionMessage}
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                  Tổng câu: {selectedQuestions.length}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                  Tổng điểm: {totalPoints}
                </span>
              </div>
              {selectedQuestions.length <= QUESTIONS_PER_PAGE ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
                  {selectedQuestions.map((question, index) => renderQuestionCard(question, index))}
                </div>
              ) : (
                <SimpleBar className="pb-2" autoHide={false} forceVisible="x">
                  <div className="flex gap-4 pr-2 snap-x snap-mandatory" role="list" style={{ minWidth: "100%" }}>
                    {questionPages.map((pageQuestions, pageIndex) => (
                      <div key={`question-page-${pageIndex}`} className="min-w-full snap-start" role="listitem">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
                          {pageQuestions.map((question, index) => renderQuestionCard(question, pageIndex * QUESTIONS_PER_PAGE + index))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SimpleBar>
              )}
            </>
          )}
        </div>

        <div className="h-px bg-slate-200 transition-colors dark:bg-slate-700" />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors dark:bg-slate-800/80 dark:text-slate-200">
              <Table className="h-4 w-4" aria-hidden />
            </span>
            Ma trận đã chọn
          </h3>
          {readOnly && loading ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Đang tải cấu hình ma trận...
            </div>
          ) : selectedMatrix ? (
            <div className="rounded-2xl border border-slate-200 transition-colors dark:border-slate-700">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-900">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedMatrix.matrixName}</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedMatrix.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 dark:bg-slate-800 dark:text-slate-200">
                    Môn: {matrixSubjectName || "Không xác định"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 dark:bg-slate-800 dark:text-slate-200">
                    Lớp: {selectedMatrix.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 dark:bg-slate-800 dark:text-slate-200">
                    Tổng câu hỏi: {selectedMatrix.totalQuestions}
                  </span>
                </div>
              </div>

              {matrixConfigs.length > 0 ? (
                <SimpleBar className="min-h-[1px]" autoHide={false} forceVisible="x">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-slate-200 text-sm transition-colors dark:divide-slate-700">
                      <thead className="bg-white text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Mức độ</th>
                          <th className="px-4 py-3 text-center">Số câu hỏi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                        {matrixConfigs.map((config) => (
                          <tr key={config.id}>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{difficultyLabel(config.difficulty)}</td>
                            <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-200">{config.require_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SimpleBar>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-500 transition-colors dark:text-slate-400">Ma trận chưa có cấu hình chi tiết.</p>
              )}
            </div>
          ) : (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Chọn ma trận từ ngân hàng để xem trước.
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200 transition-colors dark:bg-slate-700" />

        {footerSlot
          ? footerSlot
          : !readOnly && (
              <button
                type="button"
                onClick={onGenerateWithAI}
                disabled={!canGenerate || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                {loading ? "Đang gửi..." : "Gửi để tạo đề thi"}
              </button>
            )}
        {!readOnly && validationMessage ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 transition-colors dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {validationMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
