"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SellerClosuresPage() {
  const [closures, setClosures] = useState([
    {
      id: "closure-1",
      reason: "หยุดปรับปรุงพื้นที่สวน",
      start: "2569-06-28",
      end: "2569-06-30",
    },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <OperationsShell
      mode="seller"
      title="วันปิดสวน"
      description="ระบุช่วงวันที่ไม่รับออเดอร์หรือไม่เปิดให้เข้าชม"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} />
          เพิ่มวันปิด
        </Button>
      }
    >
      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {closures.map((closure) => (
          <div
            key={closure.id}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div>
              <p className="font-bold">{closure.reason}</p>
              <p className="mt-1 text-sm text-muted">
                {closure.start} - {closure.end}
              </p>
            </div>
            <button
              onClick={() => {
                setClosures((items) =>
                  items.filter((item) => item.id !== closure.id),
                );
                toast.success("ลบวันปิดสวนแล้ว");
              }}
              aria-label="ลบวันปิดสวน"
              className="text-muted hover:text-danger"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        title="เพิ่มวันปิดสวน"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setClosures((items) => [
              ...items,
              {
                id: `closure-${Date.now()}`,
                reason: String(data.get("reason")),
                start: String(data.get("start")),
                end: String(data.get("end")),
              },
            ]);
            setOpen(false);
            toast.success("เพิ่มวันปิดสวนแล้ว");
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            เหตุผล
            <Input name="reason" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            วันที่เริ่ม
            <Input name="start" type="date" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            วันที่สิ้นสุด
            <Input name="end" type="date" required />
          </label>
          <Button type="submit">บันทึกวันปิดสวน</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
