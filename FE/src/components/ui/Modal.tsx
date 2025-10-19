import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import SimpleBar from "simplebar-react";

interface ModalProps {
  open: boolean;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  headerActions?: ReactNode;
  onClose: () => void;
}

const modalRootId = "modal-root";

function ensureModalRoot(): HTMLElement {
  let root = document.getElementById(modalRootId);
  if (!root) {
    root = document.createElement("div");
    root.id = modalRootId;
    document.body.appendChild(root);
  }
  return root;
}

export function Modal({ open, title, icon, children, footer, headerActions, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl transition-colors dark:bg-slate-950 dark:text-slate-100">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 transition-colors dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            {icon}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </header>
        <SimpleBar className="max-h-[70vh] text-sm text-slate-700 transition-colors dark:text-slate-200" autoHide={false}>
          <div className="px-6 py-5">{children}</div>
        </SimpleBar>
        {footer ? (
          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    ensureModalRoot()
  );
}
