import { BarChart3, Eye, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import type { Matrix, Subject } from "../../types/api";

interface MatrixBankAccordionProps {
  subjects: Subject[];
  selectedSubject: string;
  selectedGrade: string;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  matrices: Matrix[];
  loading: boolean;
  selectedMatrixId: number | null;
  onSelectMatrix: (matrix: Matrix) => void;
  onViewMatrix: (matrix: Matrix) => void;
  onCreateMatrix: () => void;
  onEditMatrix: (matrix: Matrix) => void;
}

const grades = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: String(index + 1),
}));

export function MatrixBankAccordion({
  subjects,
  selectedSubject,
  selectedGrade,
  onSubjectChange,
  onGradeChange,
  matrices,
  loading,
  selectedMatrixId,
  onSelectMatrix,
  onViewMatrix,
  onCreateMatrix,
  onEditMatrix,
}: MatrixBankAccordionProps) {
  const [open, setOpen] = useState(false);
  const selectedSubjectRecord = useMemo(() => subjects.find((subject) => subject.code === selectedSubject), [subjects, selectedSubject]);

  const filteredMatrices = useMemo(() => {
    if (!selectedSubject || !selectedGrade) return [];
    const gradeNumber = Number.parseInt(selectedGrade, 10);
    if (Number.isNaN(gradeNumber)) return [];

    return matrices.filter((matrix) => {
      if (matrix.grade !== gradeNumber) return false;

      const matrixSubjectCode = matrix.subject?.code;
      if (matrixSubjectCode) {
        return matrixSubjectCode === selectedSubject;
      }

      if (selectedSubjectRecord?.id == null) return false;
      return matrix.subjectId === selectedSubjectRecord.id;
    });
  }, [matrices, selectedGrade, selectedSubject, selectedSubjectRecord]);

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-colors dark:bg-slate-900 dark:ring-slate-700/60 dark:shadow-none">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-slate-800 transition-colors dark:text-slate-100"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-5 w-5 text-sky-500" aria-hidden />
          Ngân hàng ma trận
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{open ? "Thu gọn" : "Mở rộng"}</span>
      </button>

      {open ? (
        <div className="border-t border-slate-200 px-6 py-5 transition-colors dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Duyệt và xem chi tiết các ma trận đề thi đã lưu.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="matrixSubjectSelect">
                Môn học
              </label>
              <select
                id="matrixSubjectSelect"
                value={selectedSubject}
                onChange={(event) => onSubjectChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
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
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="matrixGradeSelect">
                Lớp
              </label>
              <select
                id="matrixGradeSelect"
                value={selectedGrade}
                onChange={(event) => onGradeChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              >
                <option value="" disabled>
                  -- Chọn lớp --
                </option>
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onCreateMatrix}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-500/40 dark:bg-slate-800 dark:text-sky-200 dark:hover:border-sky-400 dark:hover:bg-sky-500/10 dark:hover:text-sky-100 sm:w-auto"
            >
              <Plus className="h-4 w-4" aria-hidden />
              <span>Tạo ma trận mới</span>
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải ma trận...</p>
            ) : filteredMatrices.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Không tìm thấy ma trận nào phù hợp.</p>
            ) : (
              <SimpleBar className="max-h-[360px] pr-2" autoHide={false}>
                <div className="flex flex-col gap-3">
                  {filteredMatrices.map((matrix, index) => {
                    const isSelected = selectedMatrixId === matrix.id;
                    return (
                      <article
                        key={matrix.id}
                        className="relative rounded-xl border border-white bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800"
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onEditMatrix(matrix);
                          }}
                          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-sky-400 dark:hover:bg-sky-500/20"
                          aria-label="Chỉnh sửa ma trận"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Chỉnh sửa ma trận</span>
                        </button>
                        <div className="flex flex-col gap-3">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="radio"
                              name="matrix-selection"
                              checked={isSelected}
                              onChange={() => onSelectMatrix(matrix)}
                              className="mt-1 h-4 w-4 border-slate-300 text-sky-500 focus:ring-sky-400 dark:border-slate-600"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                                Ma trận {index + 1}: {matrix.matrixName}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{matrix.description}</p>
                            </div>
                          </label>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                              Tổng số câu hỏi: {matrix.totalQuestions}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/80 dark:text-slate-200">
                              Ngày tạo: {new Date(matrix.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Mã: {matrix.id}</span>
                            <button
                              type="button"
                              onClick={() => onViewMatrix(matrix)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-sky-600 transition hover:border-sky-400 hover:bg-sky-50 dark:border-slate-700 dark:text-sky-200 dark:hover:border-sky-400 dark:hover:bg-sky-500/10"
                            >
                              <Eye className="h-4 w-4" aria-hidden />
                              <span>Xem chi tiết</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </SimpleBar>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
