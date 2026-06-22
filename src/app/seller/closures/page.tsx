"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { FarmClosure } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

export default function SellerClosuresPage() {
  const { request } = useAuth();
  const resource = useApiResource<FarmClosure[]>("/seller/closures", []);
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
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {resource.data.map((closure) => (
              <div
                key={closure.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-bold">{closure.reason || "ปิดสวน"}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(closure.startDate)} -{" "}
                    {formatDateTime(closure.endDate)}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await request(`/seller/closures/${closure.id}`, {
                        method: "DELETE",
                      });
                      await resource.reload();
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "ลบไม่สำเร็จ",
                      );
                    }
                  }}
                  aria-label="ลบวันปิดสวน"
                  className="text-muted hover:text-danger"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!resource.data.length ? (
              <p className="p-10 text-center text-sm text-muted">
                ไม่มีวันปิดสวน
              </p>
            ) : null}
          </div>
        ) : null}
      </AuthGuard>
      <Dialog
        open={open}
        title="เพิ่มวันปิดสวน"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/seller/closures", {
                method: "POST",
                body: JSON.stringify({
                  reason: data.get("reason"),
                  startDate: new Date(
                    String(data.get("startDate")),
                  ).toISOString(),
                  endDate: new Date(String(data.get("endDate"))).toISOString(),
                }),
              });
              setOpen(false);
              await resource.reload();
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "เพิ่มไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            เหตุผล
            <Input name="reason" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            วันที่เริ่ม
            <Input name="startDate" type="datetime-local" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            วันที่สิ้นสุด
            <Input name="endDate" type="datetime-local" required />
          </label>
          <Button type="submit">บันทึกวันปิดสวน</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
