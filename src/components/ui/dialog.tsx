"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-end bg-foreground/45 p-0 sm:place-items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-surface shadow-[var(--shadow)] sm:max-h-[90vh] sm:rounded-lg"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
          <div>
            <h2 id="dialog-title" className="text-lg font-extrabold">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="focus-ring grid size-9 shrink-0 place-items-center rounded-md hover:bg-surface-muted"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={19} />
          </button>
        </header>
        <div className="p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}
