import { Plus } from "lucide-react";
import { useState } from "react";
import { Modal } from "../ui/Modal";

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { code: string; name: string }) => Promise<void>;
}

export function AddSubjectModal({ open, onClose, onSubmit }: AddSubjectModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim() || !name.trim()) {
      setStatus("Vui lòng nhập đầy đủ mã và tên môn học.");
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await onSubmit({ code: code.trim(), name: name.trim() });
      setStatus("Thêm môn học thành công!");
      setCode("");
      setName("");
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(error);
      setStatus("Không thể thêm môn học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thêm môn học"
      icon={<Plus className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
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
        <div>
          <label htmlFor="subjectCode" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Mã môn học
          </label>
          <input
            id="subjectCode"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Nhập mã môn học (ví dụ: TOAN)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>
        <div>
          <label htmlFor="subjectName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên môn học
          </label>
          <input
            id="subjectName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nhập tên môn học (ví dụ: Toán Học)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>
        {status ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 transition-colors dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
            {status}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
