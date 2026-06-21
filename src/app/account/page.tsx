import { CalendarCheck, Package, ShoppingBasket, UserRound } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/layout/account-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockBookings, mockOrders } from "@/lib/mock-data";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function AccountPage() {
  const order = mockOrders[0];
  const booking = mockBookings[0];
  return (
    <AccountShell
      title="สวัสดี สมชาย"
      description="ติดตามรายการล่าสุดและจัดการข้อมูลของคุณจากหน้านี้"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Summary icon={Package} label="คำสั่งซื้อที่กำลังดำเนินการ" value="1" />
        <Summary icon={CalendarCheck} label="การจองที่รอตรวจสอบ" value="1" />
        <Summary icon={ShoppingBasket} label="สินค้าในตะกร้า" value="3" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">คำสั่งซื้อล่าสุด</h2>
            <Link href="/orders" className="text-sm font-bold text-primary">
              ดูทั้งหมด
            </Link>
          </div>
          <Link
            href={`/orders/${order.id}`}
            className="block rounded-lg border border-border bg-surface p-5 hover:border-primary/40"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{order.id}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-5 text-right font-display text-xl font-extrabold text-primary">
              {formatMoney(order.totalSatang)}
            </p>
          </Link>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">การจองล่าสุด</h2>
            <Link href="/bookings" className="text-sm font-bold text-primary">
              ดูทั้งหมด
            </Link>
          </div>
          <Link
            href="/bookings"
            className="block rounded-lg border border-border bg-surface p-5 hover:border-primary/40"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm font-bold">
                  ผู้เข้าชม {booking.visitorCount} คน
                </p>
                <p className="mt-1 text-xs text-muted">
                  {formatDateTime(booking.slot.startAt)}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <p className="mt-5 text-sm text-muted">{booking.vehicle}</p>
          </Link>
        </section>
      </div>
    </AccountShell>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Icon size={21} className="text-primary" />
      <p className="mt-4 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{label}</p>
    </div>
  );
}
