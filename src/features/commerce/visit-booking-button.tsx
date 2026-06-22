"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";

export function VisitBookingButton({ slotId }: { slotId: string }) {
  const { user, request } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          if (!user) {
            toast.error("กรุณาเข้าสู่ระบบก่อนจอง");
            return;
          }
          if (user.userType !== "buyer") {
            toast.error("เฉพาะบัญชีผู้ซื้อเท่านั้น");
            return;
          }
          setOpen(true);
        }}
      >
        เลือกช่วงเวลานี้
      </Button>
      <Dialog
        open={open}
        title="จองเที่ยวชมสวน"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/bookings", {
                method: "POST",
                body: JSON.stringify({
                  slotId,
                  visitorCount: Number(data.get("visitorCount")),
                  vehicle: data.get("vehicle"),
                  bookerName: data.get("bookerName"),
                }),
              });
              setOpen(false);
              toast.success("ส่งคำขอจองแล้ว");
              router.push("/bookings");
              router.refresh();
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "จองไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            ชื่อผู้จอง
            <Input name="bookerName" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            จำนวนผู้เข้าชม
            <Input name="visitorCount" type="number" min="1" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            พาหนะ
            <Input name="vehicle" required />
          </label>
          <Button type="submit">ยืนยันการจอง</Button>
        </form>
      </Dialog>
    </>
  );
}
