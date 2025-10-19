import { useState } from "react";
import { ExamAssistantPage } from "./pages/ExamAssistantPage";
import { ExamLibraryPage } from "./pages/ExamLibraryPage";

type AppTab = "assistant" | "library";

interface WorkspaceTabSwitcherProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

function WorkspaceTabSwitcher({ activeTab, onChange }: WorkspaceTabSwitcherProps) {
  const baseButtonClasses =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-500/60";

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-md transition-colors dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onChange("assistant")}
        className={`${baseButtonClasses} ${
          activeTab === "assistant"
            ? "bg-orange-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
        }`}
      >
        Tạo đề thi
      </button>
      <button
        type="button"
        onClick={() => onChange("library")}
        className={`${baseButtonClasses} ${
          activeTab === "library"
            ? "bg-orange-500 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
        }`}
      >
        Ngân hàng đề thi
      </button>
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("assistant");

  const tabSwitcher = <WorkspaceTabSwitcher activeTab={activeTab} onChange={setActiveTab} />;

  if (activeTab === "assistant") {
    return <ExamAssistantPage tabSwitcher={tabSwitcher} />;
  }

  return <ExamLibraryPage tabSwitcher={tabSwitcher} />;
}

export default App;
