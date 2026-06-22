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
import type { Coupon } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function AdminCouponsPage() {
  const { request } = useAuth();
  const resource = useApiResource<Coupon[]>("/admin/coupons", []);
  const [open, setOpen] = useState(false);
  return (
    <OperationsShell
      mode="admin"
      title="คูปอง"
      description="สร้างและติดตามสิทธิ์ส่วนลด"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} />
          สร้างคูปอง
        </Button>
      }
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={["รหัส", "ส่วนลด", "ใช้แล้ว", "หมดอายุ", "สถานะ"]}
            >
              {resource.data.map((coupon) => (
                <tr key={coupon.id}>
                  <Cell className="font-mono font-bold">{coupon.code}</Cell>
                  <Cell>
                    {coupon.discountType === "fixed"
                      ? formatMoney(coupon.discountValue)
                      : `${coupon.discountValue}%`}
                  </Cell>
                  <Cell>
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </Cell>
                  <Cell>{formatDateTime(coupon.endsAt)}</Cell>
                  <Cell className="font-bold text-primary">
                    {coupon.active ? "ใช้งานอยู่" : "ปิด"}
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีคูปอง
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={open}
        title="สร้างคูปอง"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/admin/coupons", {
                method: "POST",
                body: JSON.stringify({
                  code: data.get("code"),
                  discountType: data.get("discountType"),
                  discountValue: Number(data.get("discountValue")),
                  minimumSatang:
                    Number(data.get("minimumBaht") || 0) * 100,
                  maximumDiscount:
                    Number(data.get("maximumBaht") || 0) * 100,
                  usageLimit: Number(data.get("usageLimit") || 0),
                  startsAt: new Date(
                    String(data.get("startsAt")),
                  ).toISOString(),
                  endsAt: new Date(String(data.get("endsAt"))).toISOString(),
                }),
              });
              setOpen(false);
              await resource.reload();
              toast.success("สร้างคูปองแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "สร้างคูปองไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            รหัส
            <Input name="code" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            ประเภท
            <select
              name="discountType"
              className="h-11 rounded-md border border-border bg-surface px-3"
            >
              <option value="fixed">จำนวนเงิน</option>
              <option value="percent">เปอร์เซ็นต์</option>
            </select>
          </label>
          {[
            ["discountValue", "มูลค่าส่วนลด"],
            ["minimumBaht", "ยอดขั้นต่ำ (บาท)"],
            ["maximumBaht", "ส่วนลดสูงสุด (บาท)"],
            ["usageLimit", "จำนวนครั้งที่ใช้ได้"],
          ].map(([name, label]) => (
            <label key={name} className="grid gap-1.5 text-sm font-bold">
              {label}
              <Input name={name} type="number" min="0" required />
            </label>
          ))}
          <label className="grid gap-1.5 text-sm font-bold">
            เริ่ม
            <Input name="startsAt" type="datetime-local" required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            สิ้นสุด
            <Input name="endsAt" type="datetime-local" required />
          </label>
          <Button type="submit">สร้างคูปอง</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
