import { Plus } from "lucide-react";
import { useState } from "react";
import type { Subject } from "../../types/api";
import { Modal } from "../ui/Modal";

interface AddLessonModalProps {
  open: boolean;
  subjects: Subject[];
  onClose: () => void;
  onSubmit: (payload: { subjectCode: string; grade: number; name: string; learningObjectivesJson: string }) => Promise<void>;
}

const grades = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: index + 1,
}));

export function AddLessonModal({ open, subjects, onClose, onSubmit }: AddLessonModalProps) {
  const [subjectCode, setSubjectCode] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [objectives, setObjectives] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subjectCode || !grade || !name.trim() || !objectives.trim()) {
      setStatus("Vui lòng nhập đầy đủ thông tin bài học.");
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await onSubmit({
        subjectCode,
        grade,
        name: name.trim(),
        learningObjectivesJson: objectives.trim(),
      });
      setStatus("Thêm bài học thành công!");
      setSubjectCode("");
      setGrade(null);
      setName("");
      setObjectives("");
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(error);
      setStatus("Không thể thêm bài học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thêm bài học"
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
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="lessonSubject">
            Môn học
          </label>
          <select
            id="lessonSubject"
            value={subjectCode}
            onChange={(event) => setSubjectCode(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
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
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="lessonGrade">
            Lớp học
          </label>
          <select
            id="lessonGrade"
            value={grade ?? ""}
            onChange={(event) => setGrade(Number.parseInt(event.target.value, 10))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          >
            <option value="" disabled>
              -- Chọn lớp học --
            </option>
            {grades.map((gradeOption) => (
              <option key={gradeOption.value} value={gradeOption.value}>
                {gradeOption.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="lessonName">
            Tên bài học
          </label>
          <input
            id="lessonName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nhập tên bài học (ví dụ: Hàm số Bậc hai)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="lessonObjectives">
            Yêu cầu cần đạt
          </label>
          <textarea
            id="lessonObjectives"
            rows={4}
            value={objectives}
            onChange={(event) => setObjectives(event.target.value)}
            placeholder='Nhập yêu cầu cần đạt (ví dụ: [{"key":"MATH_OBJ","obj":"Hiểu và áp dụng kiến thức cơ bản toán học."}])'
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
