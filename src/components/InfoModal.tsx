import { useEffect } from "react";

export interface InfoModalProps {
  title: string;
  body: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ title, body, isOpen, onClose }: InfoModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4"
      onClick={onClose}
      data-testid="info-modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
      </div>
    </div>
  );
}
