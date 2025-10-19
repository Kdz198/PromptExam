import { NotebookPen } from "lucide-react";

interface HeaderProps {
  onOpenApiKeyModal: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ onOpenApiKeyModal, theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === "dark";
  const sharedButtonClasses =
    "inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/20 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-slate-400 dark:hover:bg-slate-700/80";

  return (
    <header className="bg-gradient-to-r from-sky-500 via-sky-500 to-emerald-500 text-white transition-colors dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
              <NotebookPen className="h-6 w-6" aria-hidden />
            </span>
            Trợ lý tạo đề thi AI
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/90">Tạo đề kiểm tra, đáp án, ma trận và bảng đặc tả theo chương trình giáo dục.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto"></div>
      </div>
    </header>
  );
}
