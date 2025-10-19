import { ClipboardList, Copy, FileDown, FileText, PlusCircle, Save } from "lucide-react";
import { useState } from "react";

interface ResultSectionProps {
  visible: boolean;
}

const tabs = [
  { id: "exam", label: "Đề thi & Đáp án" },
  { id: "matrix", label: "Ma trận đề thi" },
  { id: "spec", label: "Bản đặc tả" },
];

export function ResultSection({ visible }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState("exam");

  if (!visible) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ClipboardList className="h-5 w-5 text-sky-500" aria-hidden />
          Kết quả
        </h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-sky-600 transition hover:border-sky-300 hover:bg-sky-50"
          >
            <Save className="h-4 w-4" aria-hidden />
            <span>Lưu vào Ngân hàng</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" aria-hidden />
            <span>Sao chép</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <FileDown className="h-4 w-4" aria-hidden />
            <span>Tải .docx</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" aria-hidden />
            <span>Tải .tex</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 font-medium text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            <span>Tạo đề mới</span>
          </button>
        </div>
      </header>

      <div className="mt-5 border-b border-slate-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-3 py-2 text-sm font-medium transition ${
                  isActive ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
        {activeTab === "exam" && <p>Nội dung đề thi sẽ hiển thị tại đây.</p>}
        {activeTab === "matrix" && <p>Ma trận đề thi sẽ hiển thị tại đây.</p>}
        {activeTab === "spec" && <p>Bản đặc tả sẽ hiển thị tại đây.</p>}
      </div>
    </section>
  );
}
