import { Table2 } from "lucide-react";
import type { Matrix, MatrixConfig } from "../../types/api";
import { Modal } from "../ui/Modal";

interface ViewMatrixModalProps {
  matrix: Matrix | null;
  configs: MatrixConfig[];
  open: boolean;
  onClose: () => void;
}

export function ViewMatrixModal({ matrix, configs, open, onClose }: ViewMatrixModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chi tiết ma trận"
      icon={<Table2 className="h-5 w-5 text-sky-500" aria-hidden />}
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
      {matrix ? (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Tên ma trận</p>
              <p>{matrix.matrixName}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Tổng số câu hỏi</p>
              <p>{matrix.totalQuestions}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Mô tả</p>
              <p>{matrix.description}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Ngày tạo</p>
              <p>{new Date(matrix.createdAt).toLocaleString("vi-VN")}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Cấu hình ma trận</p>
            <div className="overflow-hidden rounded-xl border border-slate-200 transition-colors dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 text-sm transition-colors dark:divide-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Mức độ</th>
                    <th className="px-4 py-3 text-center">Số câu hỏi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {configs.map((config) => (
                    <tr key={config.id}>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{config.difficulty}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-200">{config.require_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {configs.length === 0 ? <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Chưa có cấu hình ma trận.</p> : null}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng chọn ma trận để xem chi tiết.</p>
      )}
    </Modal>
  );
}
