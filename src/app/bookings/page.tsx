"use client";

import { CalendarDays, Car, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { cn, formatDateTime } from "@/lib/utils";

const tabs = [
  { label: "ทั้งหมด", status: "" },
  { label: "รอตรวจสอบ", status: "pending" },
  { label: "ยืนยันแล้ว", status: "confirmed" },
  { label: "สำเร็จ", status: "completed" },
  { label: "ยกเลิก", status: "cancelled" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [status, setStatus] = useState("");
  const visible = useMemo(
    () => bookings.filter((booking) => !status || booking.status === status),
    [bookings, status],
  );

  return (
    <AccountShell
      title="การจองเที่ยวสวน"
      description="ตรวจสอบสถานะคำขอ วันที่เข้าเยี่ยมชม และรหัสเช็กอิน"
    >
      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none">
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
      <div className="grid gap-4">
        {visible.map((booking) => (
          <article
            key={booking.id}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">สวนลุงพร</h2>
                <p className="mt-1 text-xs text-muted">{booking.id}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="mt-5 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <CalendarDays size={17} className="text-primary" />
                {formatDateTime(booking.slot.startAt)}
              </p>
              <p className="flex items-center gap-2">
                <Users size={17} className="text-primary" />
                {booking.visitorCount} คน
              </p>
              <p className="flex items-center gap-2">
                <Car size={17} className="text-primary" />
                {booking.vehicle}
              </p>
            </div>
            {booking.status !== "cancelled" ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setBookings((items) =>
                    items.map((item) =>
                      item.id === booking.id
                        ? { ...item, status: "cancelled" }
                        : item,
                    ),
                  );
                  toast.success("ยกเลิกการจองแล้ว");
                }}
              >
                ยกเลิกการจอง
              </Button>
            ) : null}
          </article>
        ))}
        {!visible.length ? (
          <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
            ไม่มีรายการในสถานะนี้
          </p>
        ) : null}
      </div>
    </AccountShell>
  );
}
