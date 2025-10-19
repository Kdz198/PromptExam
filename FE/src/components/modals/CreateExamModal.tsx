import { ClipboardPen } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";

interface CreateExamModalProps {
  open: boolean;
  defaultValues: {
    examName: string;
    description: string;
    durationMinutes: number;
    totalMarks: number;
  } | null;
  questionCount: number;
  matrixName?: string;
  onClose: () => void;
  onSubmit: (payload: { examName: string; description: string; durationMinutes: number; totalMarks: number }) => Promise<void>;
  loading?: boolean;
}

export function CreateExamModal({ open, defaultValues, questionCount, matrixName, onClose, onSubmit, loading = false }: CreateExamModalProps) {
  const [examName, setExamName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [totalMarks, setTotalMarks] = useState(10);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !defaultValues) return;
    setExamName(defaultValues.examName);
    setDescription(defaultValues.description);
    setDurationMinutes(defaultValues.durationMinutes);
    setTotalMarks(defaultValues.totalMarks);
    setStatus(null);
  }, [defaultValues, open]);

  useEffect(() => {
    if (!open) {
      setStatus(null);
    }
  }, [open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!examName.trim()) {
      setStatus("Vui lòng nhập tên đề thi.");
      return;
    }

    if (durationMinutes <= 0) {
      setStatus("Thời lượng phải lớn hơn 0 phút.");
      return;
    }

    if (totalMarks <= 0) {
      setStatus("Tổng điểm phải lớn hơn 0.");
      return;
    }

    setStatus(null);
    try {
      await onSubmit({
        examName: examName.trim(),
        description: description.trim(),
        durationMinutes,
        totalMarks,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tạo đề thi. Vui lòng thử lại.";
      setStatus(message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Hoàn tất đề thi"
      icon={<ClipboardPen className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            {loading ? "Đang tạo..." : "Tạo đề thi"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Số câu hỏi đã chọn: {questionCount}</p>
          {matrixName ? <p className="text-sm text-slate-500 dark:text-slate-400">Ma trận: {matrixName}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="examName">
            Tên đề thi
          </label>
          <input
            id="examName"
            type="text"
            value={examName}
            onChange={(event) => setExamName(event.target.value)}
            placeholder="Ví dụ: Đề thi Toán giữa kỳ"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="examDescription">
            Mô tả (tùy chọn)
          </label>
          <textarea
            id="examDescription"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Nhập mô tả ngắn cho đề thi"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="examDuration">
              Thời lượng (phút)
            </label>
            <input
              id="examDuration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number.parseInt(event.target.value, 10) || 0)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="examTotalMarks">
              Tổng điểm
            </label>
            <input
              id="examTotalMarks"
              type="number"
              min={0.5}
              step={0.5}
              value={totalMarks}
              onChange={(event) => setTotalMarks(Number.parseFloat(event.target.value) || 0)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            />
          </div>
        </div>

        {status ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 transition-colors dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {status}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
