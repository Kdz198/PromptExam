import { Lightbulb, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { Lesson, Subject } from "../../types/api";

interface StructureBuilderCardProps {
  subjects: Subject[];
  lessons: Lesson[];
  selectedSubject: string;
  selectedGrade: string;
  selectedLessonId: number | null;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onLessonChange: (value: number | null) => void;
  onOpenAddSubject: () => void;
  onOpenAddLesson: () => void;
  onViewLesson: (lesson: Lesson | null) => void;
  message?: string | null;
}

const grades = Array.from({ length: 12 }, (_, index) => ({
  label: `Lớp ${index + 1}`,
  value: String(index + 1),
}));

export function StructureBuilderCard({
  subjects,
  lessons,
  selectedSubject,
  selectedGrade,
  selectedLessonId,
  onSubjectChange,
  onGradeChange,
  onLessonChange,
  onOpenAddSubject,
  onOpenAddLesson,
  onViewLesson,
  message,
}: StructureBuilderCardProps) {
  const [isLessonPickerTouched, setLessonPickerTouched] = useState(false);

  const filteredLessons = useMemo(() => {
    if (!selectedSubject || !selectedGrade) return [];
    return lessons.filter((lesson) => lesson.subject.code === selectedSubject && lesson.grade === Number.parseInt(selectedGrade, 10));
  }, [lessons, selectedGrade, selectedSubject]);

  const selectedLesson = filteredLessons.find((lesson) => lesson.id === selectedLessonId) ?? null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none">
      <header className="mb-6 flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-colors dark:bg-sky-500/20 dark:text-sky-200">
          <Pencil className="h-5 w-5" aria-hidden />
        </span>
        <span>1. Xây dựng cấu trúc</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subjectSelect" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Môn học
          </label>
          <div className="flex gap-2">
            <select
              id="subjectSelect"
              value={selectedSubject}
              onChange={(event) => {
                onSubjectChange(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
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
            <button
              type="button"
              onClick={onOpenAddSubject}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/20 dark:hover:text-sky-200"
              aria-label="Thêm môn học"
            >
              <Plus className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="gradeSelect" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Lớp học
          </label>
          <select
            id="gradeSelect"
            value={selectedGrade}
            onChange={(event) => {
              onGradeChange(event.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          >
            <option value="" disabled>
              -- Chọn lớp học --
            </option>
            {grades.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="lessonSelect" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Bài học
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onViewLesson(selectedLesson)}
              disabled={!selectedLesson}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/20 dark:hover:text-sky-200"
            >
              <Lightbulb className="h-4 w-4" aria-hidden />
              Xem bài học
            </button>
            <select
              id="lessonSelect"
              value={selectedLessonId ? String(selectedLessonId) : ""}
              onChange={(event) => {
                setLessonPickerTouched(true);
                const value = event.target.value;
                onLessonChange(value ? Number.parseInt(value, 10) : null);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              disabled={filteredLessons.length === 0}
            >
              <option value="" disabled>
                {filteredLessons.length === 0 ? "Vui lòng chọn môn và lớp" : "-- Chọn bài học --"}
              </option>
              {filteredLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onOpenAddLesson}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/20 dark:hover:text-sky-200"
              aria-label="Thêm bài học"
            >
              <Plus className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {isLessonPickerTouched && !selectedLesson ? (
            <p className="mt-2 text-xs text-rose-500 dark:text-rose-400">Vui lòng chọn bài học hợp lệ.</p>
          ) : null}
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 transition-colors dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {message}
        </p>
      ) : null}
    </section>
  );
}
