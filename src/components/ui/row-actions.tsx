"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RowActions({ subject }: { subject: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={`เมนู ${subject}`}
        className="grid size-8 place-items-center rounded-md hover:bg-surface-muted"
      >
        <MoreHorizontal size={18} />
      </button>
      {open ? (
        <div className="absolute right-0 top-9 z-20 grid w-36 rounded-md border border-border bg-surface p-1 shadow-[var(--shadow)]">
          <button
            onClick={() => {
              setOpen(false);
              toast.success(`เปิดหน้าแก้ไข ${subject}`);
            }}
            className="rounded px-3 py-2 text-left text-xs font-bold hover:bg-surface-muted"
          >
            แก้ไข
          </button>
          <button
            onClick={() => {
              setOpen(false);
              toast.success(`เปลี่ยนสถานะ ${subject} แล้ว`);
            }}
            className="rounded px-3 py-2 text-left text-xs font-bold hover:bg-surface-muted"
          >
            เปลี่ยนสถานะ
          </button>
        </div>
      ) : null}
    </div>
  );
}
