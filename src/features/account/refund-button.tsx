"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function RefundButton() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="mt-4 w-full"
        disabled={submitted}
        onClick={() => setOpen(true)}
      >
        <RotateCcw size={17} />
        {submitted ? "ส่งคำขอคืนเงินแล้ว" : "ขอคืนเงิน"}
      </Button>
      <Dialog
        open={open}
        title="ขอคืนเงิน"
        description="อธิบายปัญหาเพื่อให้ผู้ดูแลตรวจสอบคำขอ"
        onClose={() => setOpen(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            setOpen(false);
            toast.success("ส่งคำขอคืนเงินแล้ว");
          }}
          className="grid gap-4"
        >
          <label className="grid gap-1.5 text-sm font-bold">
            เหตุผล
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              minLength={10}
              className="focus-ring min-h-28 rounded-md border border-border p-3 text-sm"
            />
          </label>
          <Button type="submit">ยืนยันคำขอ</Button>
        </form>
      </Dialog>
    </>
  );
}
