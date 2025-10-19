import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "ag-ai-api-key";

export function ApiKeyModal({ open, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!open) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      setRemember(true);
    }
  }, [open]);

  const handleSave = async () => {
    setIsChecking(true);
    setStatusMessage(null);
    try {
      if (remember) {
        window.localStorage.setItem(STORAGE_KEY, apiKey);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      // Placeholder for actual API key validation endpoint.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatusMessage("API Key đã được lưu thành công.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Không thể lưu API Key. Vui lòng thử lại.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cài đặt API Key"
      icon={<Key className="h-5 w-5 text-sky-500" aria-hidden />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isChecking}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            {isChecking ? "Đang kiểm tra..." : "Lưu và Kiểm tra"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <div>
          <label htmlFor="apiKeyInput" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Google Gemini API Key
          </label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Nhập API Key của bạn"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            API Key được lưu cục bộ.{" "}
            <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-sky-600 underline dark:text-sky-300">
              Lấy API Key tại Google AI Studio
            </a>
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 dark:border-slate-600"
          />
          Ghi nhớ API Key
        </label>

        {statusMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 transition-colors dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
