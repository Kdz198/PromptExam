import { ClipboardList, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Difficulty, Matrix, MatrixConfig, Subject } from "../../types/api";
import { Modal } from "../ui/Modal";

interface EditMatrixModalProps {
  open: boolean;
  matrix: Matrix | null;
  configs: MatrixConfig[];
  subjects: Subject[];
  onClose: () => void;
  onSubmit: (payload: {
    matrixId: number;
    subjectId: number;
    grade: number;
    matrixName: string;
    description: string;
    difficultyQuestionCountMap: Partial<Record<Difficulty, number>>;
    totalQuestions: number;
  }) => Promise<void>;
}

const difficultyLabels: Record<Difficulty, string> = {
  NhanBiet: "Nhận biết",
  ThongHieu: "Thông hiểu",
  VanDung: "Vận dụng",
  VanDungCao: "Vận dụng cao",
};

const difficultyOrder: Difficulty[] = ["NhanBiet", "ThongHieu", "VanDung", "VanDungCao"];

const gradeOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: String(index + 1),
}));

function createEmptyCounts(): Record<Difficulty, string> {
  return {
    NhanBiet: "0",
    ThongHieu: "0",
    VanDung: "0",
    VanDungCao: "0",
  };
}

export function EditMatrixModal({ open, matrix, configs, subjects, onClose, onSubmit }: EditMatrixModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [matrixName, setMatrixName] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyCounts, setDifficultyCounts] = useState<Record<Difficulty, string>>(createEmptyCounts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectableSubjects = useMemo(() => subjects.filter((subject) => typeof subject.id === "number"), [subjects]);

  useEffect(() => {
    if (!open) return;

    if (!matrix) {
      setSelectedSubjectId("");
      setSelectedGrade("");
      setMatrixName("");
      setDescription("");
      setDifficultyCounts(createEmptyCounts());
      setStatus(null);
      return;
    }

    const subjectId = matrix.subject?.id ?? matrix.subjectId;
    setSelectedSubjectId(subjectId ? String(subjectId) : "");
    setSelectedGrade(matrix.grade ? String(matrix.grade) : "");
    setMatrixName(matrix.matrixName ?? "");
    setDescription(matrix.description ?? "");

    const counts = createEmptyCounts();
    for (const config of configs) {
      counts[config.difficulty] = String(config.require_count ?? 0);
    }
    setDifficultyCounts(counts);
    setStatus(null);
  }, [configs, matrix, open]);

  const totalQuestions = useMemo(() => {
    return difficultyOrder.reduce((total, difficulty) => {
      const value = difficultyCounts[difficulty];
      if (value === "") return total;
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed) || parsed < 0) return total;
      return total + parsed;
    }, 0);
  }, [difficultyCounts]);

  const handleDifficultyChange = (difficulty: Difficulty, rawValue: string) => {
    if (rawValue === "") {
      setDifficultyCounts((prev) => ({ ...prev, [difficulty]: "" }));
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setDifficultyCounts((prev) => ({ ...prev, [difficulty]: String(parsed) }));
  };

  const resetAndClose = () => {
    setStatus(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!matrix) return;

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

    const subjectIdNumber = Number.parseInt(selectedSubjectId, 10);
    const gradeNumber = Number.parseInt(selectedGrade, 10);

    if (Number.isNaN(subjectIdNumber) || Number.isNaN(gradeNumber)) {
      setStatus({ type: "error", message: "Dữ liệu môn học hoặc khối lớp không hợp lệ." });
      return;
    }

    const normalizedCounts = Object.fromEntries(
      difficultyOrder.map((difficulty) => {
        const raw = difficultyCounts[difficulty];
        if (raw === "") return [difficulty, 0];
        const parsed = Number.parseInt(raw, 10);
        return [difficulty, Number.isNaN(parsed) || parsed < 0 ? 0 : parsed];
      })
    ) as Record<Difficulty, number>;

    const total = Object.values(normalizedCounts).reduce((sum, count) => sum + count, 0);
    if (total <= 0) {
      setStatus({ type: "error", message: "Vui lòng nhập ít nhất một câu hỏi cho ma trận." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      await onSubmit({
        matrixId: matrix.id,
        subjectId: subjectIdNumber,
        grade: gradeNumber,
        matrixName: matrixName.trim(),
        description: description.trim(),
        difficultyQuestionCountMap: normalizedCounts,
        totalQuestions: total,
      });
      setStatus({ type: "success", message: "Đã cập nhật ma trận." });
      setTimeout(() => {
        resetAndClose();
      }, 900);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Không thể cập nhật ma trận. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Chỉnh sửa ma trận"
      icon={<ClipboardList className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !matrix}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu thay đổi</span>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="editMatrixSubject" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Môn học
            </label>
            <select
              id="editMatrixSubject"
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
            <label htmlFor="editMatrixGrade" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Khối lớp
            </label>
            <select
              id="editMatrixGrade"
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
          <label htmlFor="editMatrixName" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tên ma trận
          </label>
          <input
            id="editMatrixName"
            type="text"
            value={matrixName}
            onChange={(event) => setMatrixName(event.target.value)}
            placeholder="VD: Ma trận giữa kỳ Toán 9"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
        </div>

        <div>
          <label htmlFor="editMatrixDescription" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Ghi chú
          </label>
          <textarea
            id="editMatrixDescription"
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
      </div>
    </Modal>
  );
}
