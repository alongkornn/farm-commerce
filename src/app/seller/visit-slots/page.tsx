"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { VisitSlot } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

export default function SellerVisitSlotsPage() {
  const { request } = useAuth();
  const resource = useApiResource<VisitSlot[]>("/seller/visit-slots", []);
  const [open, setOpen] = useState(false);
  return (
    <OperationsShell
      mode="seller"
      title="รอบเข้าชมสวน"
      description="กำหนดวัน เวลา และจำนวนผู้เข้าชมสูงสุดต่อรอบ"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} />
          เพิ่มรอบ
        </Button>
      }
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable headers={["เริ่ม", "สิ้นสุด", "ความจุ", "สถานะ"]}>
              {resource.data.map((slot) => (
                <tr key={slot.id}>
                  <Cell className="font-bold">
                    {formatDateTime(slot.startAt)}
                  </Cell>
                  <Cell>{formatDateTime(slot.endAt)}</Cell>
                  <Cell>{slot.capacity} คน</Cell>
                  <Cell
                    className={`font-bold ${
                      slot.available !== false ? "text-primary" : "text-muted"
                    }`}
                  >
                    {!slot.active
                      ? "ปิด"
                      : slot.available !== false
                        ? "เปิดรับจอง"
                        : "มีผู้จองแล้ว"}
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีรอบเข้าชม
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={open}
        title="เพิ่มรอบเข้าชม"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/seller/visit-slots", {
                method: "POST",
                body: JSON.stringify({
                  startAt: new Date(String(data.get("startAt"))).toISOString(),
                  endAt: new Date(String(data.get("endAt"))).toISOString(),
                  capacity: Number(data.get("capacity")),
                }),
              });
              setOpen(false);
              await resource.reload();
              toast.success("เพิ่มรอบเข้าชมแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "เพิ่มรอบไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            เริ่ม
            <Input name="startAt" type="datetime-local" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            สิ้นสุด
            <Input name="endAt" type="datetime-local" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            จำนวนคน
            <Input name="capacity" type="number" min="1" required />
          </label>
          <Button type="submit">เพิ่มรอบ</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
