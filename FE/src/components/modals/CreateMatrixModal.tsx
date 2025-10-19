import { ClipboardList, Loader2 } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { Difficulty, Subject } from "../../types/api";
import { Modal } from "../ui/Modal";

interface CreateMatrixModalProps {
  open: boolean;
  subjects: Subject[];
  onClose: () => void;
  onSubmit: (payload: {
    subjectId: number;
    grade: number;
    matrixName: string;
    description: string;
    difficultyQuestionCountMap: Partial<Record<Difficulty, number>>;
  }) => Promise<void>;
}

const gradeOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: String(index + 1),
}));

const difficultyLabels: Record<Difficulty, string> = {
  NhanBiet: "Nhận biết",
  ThongHieu: "Thông hiểu",
  VanDung: "Vận dụng",
  VanDungCao: "Vận dụng cao",
};

const difficultyOrder: Difficulty[] = ["NhanBiet", "ThongHieu", "VanDung", "VanDungCao"];

function createDefaultDifficultyCounts(): Record<Difficulty, string> {
  return {
    NhanBiet: "0",
    ThongHieu: "0",
    VanDung: "0",
    VanDungCao: "0",
  };
}

export function CreateMatrixModal({ open, subjects, onClose, onSubmit }: CreateMatrixModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [matrixName, setMatrixName] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyCounts, setDifficultyCounts] = useState<Record<Difficulty, string>>(createDefaultDifficultyCounts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectableSubjects = useMemo(() => subjects.filter((subject) => typeof subject.id === "number"), [subjects]);

  const totalQuestions = useMemo(() => {
    return (Object.values(difficultyCounts) as string[]).reduce((total, value) => {
      if (value === "") return total;
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed) || parsed < 0) return total;
      return total + parsed;
    }, 0);
  }, [difficultyCounts]);

  const resetForm = () => {
    setSelectedSubjectId("");
    setSelectedGrade("");
    setMatrixName("");
    setDescription("");
    setDifficultyCounts(createDefaultDifficultyCounts());
    setStatus(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleDifficultyChange = (difficulty: Difficulty, rawValue: string) => {
    if (rawValue === "") {
      setDifficultyCounts((prev) => ({ ...prev, [difficulty]: "" }));
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setDifficultyCounts((prev) => ({ ...prev, [difficulty]: String(parsed) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setStatus(null);

    if (!selectedSubjectId) {
      setStatus({ type: "error", message: "Vui lòng chọn môn học." });
      return;
    }

    if (!selectedGrade) {
      setStatus({ type: "error", message: "Vui lòng chọn khối lớp." });
      return;
    }

    if (!matrixName.trim()) {
      setStatus({ type: "error", message: "Vui lòng nhập tên ma trận." });
      return;
    }

    const subjectId = Number.parseInt(selectedSubjectId, 10);
    const gradeNumber = Number.parseInt(selectedGrade, 10);

    if (Number.isNaN(subjectId) || Number.isNaN(gradeNumber)) {
      setStatus({ type: "error", message: "Dữ liệu môn học hoặc khối lớp không hợp lệ." });
      return;
    }

    const normalizedCounts = Object.fromEntries(
      (Object.entries(difficultyCounts) as Array<[Difficulty, string]>).map(([key, value]) => {
        if (value === "") return [key, 0];
        const parsed = Number.parseInt(value, 10);
        return [key, Number.isNaN(parsed) || parsed < 0 ? 0 : parsed];
      })
    ) as Record<Difficulty, number>;

    const totalNormalized = Object.values(normalizedCounts).reduce((total, count) => total + count, 0);
    if (totalNormalized <= 0) {
      setStatus({ type: "error", message: "Vui lòng nhập ít nhất một câu hỏi cho ma trận." });
      return;
    }

    const filteredCounts = Object.fromEntries(
      (Object.entries(normalizedCounts) as Array<[Difficulty, number]>).filter(([, count]) => count > 0)
    ) as Partial<Record<Difficulty, number>>;

    setIsSubmitting(true);
    try {
      await onSubmit({
        subjectId,
        grade: gradeNumber,
        matrixName: matrixName.trim(),
        description: description.trim(),
        difficultyQuestionCountMap: filteredCounts,
      });
      setStatus({ type: "success", message: "Đã tạo ma trận mới thành công." });
      setTimeout(() => {
        resetForm();
        onClose();
      }, 900);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Không thể tạo ma trận. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title="Tạo ma trận mới"
      icon={<ClipboardList className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="createMatrixForm"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Tạo ma trận</span>
            )}
          </button>
        </div>
      }
    >
      <form id="createMatrixForm" onSubmit={handleSubmit} className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="matrixSubject" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Môn học
            </label>
            <select
              id="matrixSubject"
              value={selectedSubjectId}
              onChange={(event) => setSelectedSubjectId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            >
              <option value="" disabled>
                -- Chọn môn học --
              </option>
              {selectableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="matrixGrade" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Khối lớp
            </label>
            <select
              id="matrixGrade"
              value={selectedGrade}
              onChange={(event) => setSelectedGrade(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            >
              <option value="" disabled>
                -- Chọn khối lớp --
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
          <label htmlFor="matrixName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên ma trận
          </label>
          <input
            id="matrixName"
            type="text"
            value={matrixName}
            onChange={(event) => setMatrixName(event.target.value)}
            placeholder="VD: Ma trận giữa kỳ Toán 9"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <label htmlFor="matrixDescription" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Ghi chú
          </label>
          <textarea
            id="matrixDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Ghi chú ngắn gọn cho ma trận này (không bắt buộc)"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Số câu hỏi theo mức độ</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {difficultyOrder.map((difficulty) => (
              <label
                key={difficulty}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 transition-colors dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{difficultyLabels[difficulty]}</span>
                <input
                  type="number"
                  min={0}
                  value={difficultyCounts[difficulty]}
                  onChange={(event) => handleDifficultyChange(difficulty, event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-medium text-slate-700 dark:text-slate-200">Tổng số câu hỏi: {totalQuestions}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tổng số câu được cộng từ các mức độ phía trên.</p>
        </div>

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
      </form>
    </Modal>
  );
}
