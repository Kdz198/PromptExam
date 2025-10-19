import { ClipboardList } from "lucide-react";
import { useEffect, useMemo } from "react";
import type { Question } from "../../types/api";
import { Modal } from "../ui/Modal";

interface ViewQuestionModalProps {
  question: Question | null;
  open: boolean;
  onClose: () => void;
}

interface ParsedOption {
  label: string;
  value: string;
  isCorrect: boolean;
}

function parseOptions(optionsJson: string | null, answerKey: string | undefined): ParsedOption[] {
  if (!optionsJson) return [];
  try {
    const parsed = JSON.parse(optionsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((option: Record<string, string>) => {
        const key = Object.keys(option)[0];
        if (!key) return null;
        return {
          label: key.toUpperCase(),
          value: option[key],
          isCorrect: key.toUpperCase() === (answerKey ?? "").toUpperCase(),
        };
      })
      .filter((option): option is ParsedOption => Boolean(option?.label) && Boolean(option?.value));
  } catch (error) {
    console.error("Không thể parse options", error);
    return [];
  }
}

export function ViewQuestionModal({ question, open, onClose }: ViewQuestionModalProps) {
  const options = useMemo(() => parseOptions(question?.optionsJson ?? null, question?.answerKey), [question?.answerKey, question?.optionsJson]);

  useEffect(() => {
    if (!open) return;
    window.MathJax?.typesetPromise?.();
  }, [open, question]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chi tiết câu hỏi"
      icon={<ClipboardList className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      }
    >
      {question ? (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Loại câu hỏi</p>
              <p>{question.questionType === "TracNghiem" ? "Trắc nghiệm" : "Tự luận"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Mức độ</p>
              <p>{question.difficulty}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Điểm mặc định</p>
              <p>{question.defaultPoint}</p>
            </div>
            {question.questionType === "TracNghiem" ? (
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Đáp án</p>
                <p>{question.answerKey.toUpperCase()}</p>
              </div>
            ) : null}
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Môn học</p>
              <p>{question.lesson.subject?.name ?? "Không xác định"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Bài học</p>
              <p>
                {question.lesson.name} (ID: {question.lesson.id})
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Nội dung</p>
            <div
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              dangerouslySetInnerHTML={{ __html: question.questionText }}
            />
          </div>

          {options.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Lựa chọn</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {options.map((option) => (
                  <li
                    key={option.label}
                    className={`rounded-xl border px-3 py-2 ${
                      option.isCorrect
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{option.label}:</span> <span>{option.value}</span>
                    {option.isCorrect ? (
                      <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        Đúng
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng chọn câu hỏi để xem chi tiết.</p>
      )}
    </Modal>
  );
}
