import { CalendarDays, Car, Users } from "lucide-react";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function BookingsPage() {
  return (
    <AccountShell title="การจองเที่ยวสวน" description="ตรวจสอบสถานะคำขอ วันที่เข้าเยี่ยมชม และรหัสเช็กอิน">
      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none">
        {["ทั้งหมด", "รอตรวจสอบ", "ยืนยันแล้ว", "สำเร็จ", "ยกเลิก"].map((item, index) => <button key={item} className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold ${index === 0 ? "bg-primary text-white" : "bg-surface text-muted"}`}>{item}</button>)}
      </div>
      {mockBookings.map((booking) => (
        <article key={booking.id} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-lg font-extrabold">สวนลุงพร</h2><p className="mt-1 text-xs text-muted">{booking.id}</p></div>
            <StatusBadge status={booking.status} />
          </div>
          <div className="mt-5 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
            <p className="flex items-center gap-2"><CalendarDays size={17} className="text-primary" />{formatDateTime(booking.slot.startAt)}</p>
            <p className="flex items-center gap-2"><Users size={17} className="text-primary" />{booking.visitorCount} คน</p>
            <p className="flex items-center gap-2"><Car size={17} className="text-primary" />{booking.vehicle}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4">ยกเลิกการจอง</Button>
        </article>
      ))}
    </AccountShell>
  );
}
