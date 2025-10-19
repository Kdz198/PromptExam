import { Eye } from "lucide-react";
import type { Lesson } from "../../types/api";
import { Modal } from "../ui/Modal";

interface ViewLessonModalProps {
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lesson: Lesson) => void;
}

function parseObjectives(lesson: Lesson | null): string[] {
  if (!lesson) return [];
  try {
    const parsed = JSON.parse(lesson.learningObjectivesJson);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item: Record<string, string>) => {
          const key = Object.keys(item)[0];
          return key ? `${key}: ${item[key]}` : "";
        })
        .filter(Boolean);
    }
  } catch (error) {
    console.error("Không thể parse learningObjectivesJson", error);
  }
  return lesson ? [lesson.learningObjectivesJson] : [];
}

export function ViewLessonModal({ lesson, open, onClose, onEdit }: ViewLessonModalProps) {
  const objectives = parseObjectives(lesson);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thông tin bài học"
      icon={<Eye className="h-5 w-5 text-sky-500" aria-hidden />}
      headerActions={
        <button
          type="button"
          onClick={() => {
            if (lesson) {
              onEdit(lesson);
            }
          }}
          disabled={!lesson}
          className="inline-flex items-center gap-2 rounded-xl border border-sky-500 px-3 py-1.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 disabled:opacity-60 dark:border-sky-400 dark:text-sky-200 dark:hover:bg-sky-500/20"
        >
          Chỉnh sửa
        </button>
      }
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
      {lesson ? (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Môn học</p>
            <p>{lesson.subject.name}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Lớp học</p>
            <p>Lớp {lesson.grade}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Tên bài học</p>
            <p>{lesson.name}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">Yêu cầu cần đạt</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors dark:border-slate-700 dark:bg-slate-900">
              {objectives.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có dữ liệu.</p>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {objectives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng chọn bài học để xem chi tiết.</p>
      )}
    </Modal>
  );
}
