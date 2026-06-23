"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { Order } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function SellerOrdersPage() {
  const { request } = useAuth();
  const resource = useApiResource<Order[]>("/seller/orders", []);
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <OperationsShell
      mode="seller"
      title="คำสั่งซื้อ"
      description="อัปเดตสถานะและข้อมูลจัดส่ง"
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={[
                "เลขที่",
                "ลูกค้า",
                "วันที่",
                "ยอดรวม",
                "สถานะ",
                "",
              ]}
            >
              {resource.data.map((order) => (
                <tr key={order.id}>
                  <Cell className="font-mono text-xs font-bold">
                    {order.paymentNumber || "รอเลขอ้างอิง"}
                  </Cell>
                  <Cell>{order.recipientName}</Cell>
                  <Cell>{formatDateTime(order.createdAt)}</Cell>
                  <Cell className="font-bold">
                    {formatMoney(
                      order.totalSatang + order.shippingFeeSatang,
                    )}
                  </Cell>
                  <Cell>
                    <StatusBadge status={order.status} />
                  </Cell>
                  <Cell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(order)}
                    >
                      อัปเดต
                    </Button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ไม่มีคำสั่งซื้อ
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={Boolean(selected)}
        title="อัปเดตสถานะคำสั่งซื้อ"
        onClose={() => setSelected(null)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!selected) return;
            const data = new FormData(event.currentTarget);
            try {
              await request(`/seller/orders/${selected.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({
                  status: data.get("status"),
                  shippingProvider: data.get("shippingProvider"),
                  trackingNumber: data.get("trackingNumber"),
                  note: data.get("note"),
                }),
              });
              setSelected(null);
              await resource.reload();
              toast.success("อัปเดตคำสั่งซื้อแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "อัปเดตไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            สถานะ
            <select
              name="status"
              defaultValue={selected?.status}
              className="h-11 rounded-md border border-border bg-surface px-3"
            >
              <option value="processing">กำลังเตรียม</option>
              <option value="shipped">จัดส่งแล้ว</option>
              <option value="completed">สำเร็จ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            ผู้ให้บริการจัดส่ง
            <Input name="shippingProvider" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            Tracking number
            <Input name="trackingNumber" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            หมายเหตุ
            <Input name="note" />
          </label>
          <Button type="submit">บันทึกสถานะ</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
