import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { Lesson, Subject } from "../../types/api";
import { Modal } from "../ui/Modal";

interface EditLessonModalProps {
  open: boolean;
  lesson: Lesson | null;
  subjects: Subject[];
  onClose: () => void;
  onSubmit: (payload: { id: number; subjectCode: string; grade: number; name: string; learningObjectivesJson: string }) => Promise<void>;
}

const grades = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: index + 1,
}));

export function EditLessonModal({ open, lesson, subjects, onClose, onSubmit }: EditLessonModalProps) {
  const [subjectCode, setSubjectCode] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [objectives, setObjectives] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !lesson) return;
    setSubjectCode(lesson.subject.code ?? "");
    setGrade(lesson.grade ?? null);
    setName(lesson.name ?? "");
    setObjectives(lesson.learningObjectivesJson ?? "");
    setStatus(null);
  }, [lesson, open]);

  useEffect(() => {
    if (open) return;
    setStatus(null);
  }, [open]);

  const handleClose = () => {
    setStatus(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!lesson) return;

    if (!subjectCode) {
      setStatus({ type: "error", message: "Vui lòng chọn môn học." });
      return;
    }

    if (!grade) {
      setStatus({ type: "error", message: "Vui lòng chọn lớp học." });
      return;
    }

    if (!name.trim()) {
      setStatus({ type: "error", message: "Vui lòng nhập tên bài học." });
      return;
    }

    if (!objectives.trim()) {
      setStatus({ type: "error", message: "Vui lòng nhập yêu cầu cần đạt." });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await onSubmit({
        id: lesson.id,
        subjectCode,
        grade,
        name: name.trim(),
        learningObjectivesJson: objectives.trim(),
      });
      setStatus({ type: "success", message: "Cập nhật bài học thành công!" });
      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Không thể cập nhật bài học. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Chỉnh sửa bài học"
      icon={<Pencil className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
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
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      }
    >
      {lesson ? (
        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="editLessonSubject">
              Môn học
            </label>
            <select
              id="editLessonSubject"
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
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="editLessonGrade">
              Lớp học
            </label>
            <select
              id="editLessonGrade"
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
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="editLessonName">
              Tên bài học
            </label>
            <input
              id="editLessonName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nhập tên bài học"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="editLessonObjectives">
              Yêu cầu cần đạt
            </label>
            <textarea
              id="editLessonObjectives"
              rows={4}
              value={objectives}
              onChange={(event) => setObjectives(event.target.value)}
              placeholder='Nhập yêu cầu cần đạt (ví dụ: [{"key":"MATH_OBJ","obj":"Hiểu kiến thức cơ bản."}])'
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            />
          </div>

          {status ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
              }`}
            >
              {status.message}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Không có dữ liệu bài học để chỉnh sửa.</p>
      )}
    </Modal>
  );
}
