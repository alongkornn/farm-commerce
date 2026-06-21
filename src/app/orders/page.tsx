import Link from "next/link";
import { AccountShell } from "@/components/layout/account-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockOrders } from "@/lib/mock-data";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function OrdersPage() {
  return (
    <AccountShell title="คำสั่งซื้อ" description="ติดตามการเตรียมสินค้า การจัดส่ง และขอคืนเงินจากรายการที่เข้าเงื่อนไข">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
        {["ทั้งหมด", "กำลังดำเนินการ", "จัดส่งแล้ว", "สำเร็จ", "ยกเลิก"].map((item, index) => (
          <button key={item} className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold ${index === 0 ? "bg-primary text-white" : "bg-surface text-muted"}`}>{item}</button>
        ))}
      </div>
      <div className="grid gap-4">
        {mockOrders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="rounded-lg border border-border bg-surface p-5 hover:border-primary/40">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-bold">{order.id}</p><p className="mt-1 text-xs text-muted">{formatDateTime(order.createdAt)}</p></div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <p className="text-sm text-muted">{order.items.length} รายการ · {order.items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</p>
              <p className="font-display text-xl font-extrabold text-primary">{formatMoney(order.totalSatang)}</p>
            </div>
          </Link>
        ))}
      </div>
    </AccountShell>
  );
}
