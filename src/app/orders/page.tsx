"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/layout/account-shell";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import type { Order } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { cn, formatDateTime, formatMoney } from "@/lib/utils";

const tabs = [
  { label: "ทั้งหมด", status: "" },
  { label: "กำลังดำเนินการ", status: "processing" },
  { label: "จัดส่งแล้ว", status: "shipped" },
  { label: "สำเร็จ", status: "completed" },
  { label: "ยกเลิก", status: "cancelled" },
];

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const resource = useApiResource<Order[]>(
    `/orders${status ? `?status=${status}` : ""}`,
    [],
  );

  return (
    <AccountShell
      title="คำสั่งซื้อ"
      description="ติดตามการเตรียมสินค้า การจัดส่ง และขอคืนเงินจากรายการที่เข้าเงื่อนไข"
    >
      <AuthGuard roles={["buyer"]}>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatus(tab.status)}
              className={cn(
                "shrink-0 rounded-md px-4 py-2 text-sm font-bold",
                status === tab.status
                  ? "bg-primary text-white"
                  : "bg-surface text-muted",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          <div className="grid gap-4">
            {resource.data.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="rounded-lg border border-border bg-surface p-5 hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      รายการชำระเงิน{" "}
                      {order.paymentNumber || "กำลังจัดเตรียมเลขอ้างอิง"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <p className="text-sm text-muted">
                    {order.items?.length ?? 0} รายการ
                  </p>
                  <p className="font-display text-xl font-extrabold text-primary sm:text-right">
                    {formatMoney(
                      order.totalSatang + order.shippingFeeSatang,
                    )}
                  </p>
                </div>
              </Link>
            ))}
            {!resource.data.length ? (
              <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
                ไม่มีคำสั่งซื้อ
              </p>
            ) : null}
          </div>
        ) : null}
      </AuthGuard>
    </AccountShell>
  );
}
