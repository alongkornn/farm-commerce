import { MapPin, PackageCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/layout/account-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { RefundButton } from "@/features/account/refund-button";
import { mockOrders } from "@/lib/mock-data";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = mockOrders.find((item) => item.id === id);
  if (!order) notFound();
  return (
    <AccountShell title={`คำสั่งซื้อ ${order.id}`} description={formatDateTime(order.createdAt)}>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <section className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">สถานะ</h2><StatusBadge status={order.status} /></div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-muted">
              <div className="text-primary"><PackageCheck className="mx-auto mb-2" size={23} />รับคำสั่งซื้อ</div>
              <div className="text-primary"><Truck className="mx-auto mb-2" size={23} />กำลังเตรียม</div>
              <div><PackageCheck className="mx-auto mb-2" size={23} />จัดส่งสำเร็จ</div>
            </div>
          </section>
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-lg font-extrabold">รายการสินค้า</h2>
            {order.items.map((item) => (
              <div key={item.id} className="mt-4 flex justify-between gap-4 border-t border-border pt-4 text-sm">
                <div><p className="font-bold">{item.productName}</p><p className="mt-1 text-muted">{item.quantity} × {formatMoney(item.unitPriceSatang)}</p></div>
                <strong>{formatMoney(item.subtotalSatang)}</strong>
              </div>
            ))}
          </section>
        </div>
        <aside className="grid h-fit gap-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 font-extrabold"><MapPin size={18} className="text-primary" />จัดส่งไปที่</h2>
            <p className="mt-3 text-sm font-bold">{order.recipientName}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{order.shippingAddress}<br />{order.recipientPhone}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="flex justify-between text-sm"><span className="text-muted">ยอดรวม</span><strong className="text-primary">{formatMoney(order.totalSatang)}</strong></p>
            <RefundButton />
          </div>
        </aside>
      </div>
    </AccountShell>
  );
}
