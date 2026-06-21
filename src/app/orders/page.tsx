"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccountShell } from "@/components/layout/account-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockOrders } from "@/lib/mock-data";
import { cn, formatDateTime, formatMoney } from "@/lib/utils";

const tabs = [
  { label: "ทั้งหมด", statuses: [] },
  { label: "กำลังดำเนินการ", statuses: ["pending", "processing"] },
  { label: "จัดส่งแล้ว", statuses: ["shipped"] },
  { label: "สำเร็จ", statuses: ["delivered", "completed"] },
  { label: "ยกเลิก", statuses: ["cancelled"] },
];

export default function OrdersPage() {
  const [selected, setSelected] = useState(0);
  const visible = useMemo(() => {
    const statuses = tabs[selected].statuses;
    return mockOrders.filter(
      (order) => !statuses.length || statuses.includes(order.status),
    );
  }, [selected]);

  return (
    <AccountShell
      title="คำสั่งซื้อ"
      description="ติดตามการเตรียมสินค้า การจัดส่ง และขอคืนเงินจากรายการที่เข้าเงื่อนไข"
    >
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setSelected(index)}
            className={cn(
              "shrink-0 rounded-md px-4 py-2 text-sm font-bold",
              selected === index
                ? "bg-primary text-white"
                : "bg-surface text-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {visible.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="rounded-lg border border-border bg-surface p-5 hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{order.id}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <p className="text-sm text-muted">
                {order.items.length} รายการ ·{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น
              </p>
              <p className="font-display text-xl font-extrabold text-primary">
                {formatMoney(order.totalSatang)}
              </p>
            </div>
          </Link>
        ))}
        {!visible.length ? (
          <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
            ไม่มีคำสั่งซื้อในสถานะนี้
          </p>
        ) : null}
      </div>
    </AccountShell>
  );
}
