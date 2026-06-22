"use client";

import { CalendarDays, Car, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { Booking } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { cn, formatDateTime } from "@/lib/utils";

const tabs = [
  ["ทั้งหมด", ""],
  ["รอตรวจสอบ", "pending"],
  ["ยืนยันแล้ว", "approved"],
  ["สำเร็จ", "completed"],
  ["ยกเลิก", "cancelled"],
];

export default function BookingsPage() {
  const { request } = useAuth();
  const [status, setStatus] = useState("");
  const resource = useApiResource<Booking[]>(
    `/bookings${status ? `?status=${status}` : ""}`,
    [],
  );

  return (
    <AccountShell
      title="การจองเที่ยวสวน"
      description="ตรวจสอบสถานะคำขอ วันที่เข้าเยี่ยมชม และรหัสเช็กอิน"
    >
      <AuthGuard roles={["buyer"]}>
        <div className="mb-5 flex justify-end">
          <Link href="/visits">
            <Button>
              <CalendarDays size={17} />
              จองเที่ยวสวนเพิ่ม
            </Button>
          </Link>
        </div>
        <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map(([label, value]) => (
            <button
              key={label}
              onClick={() => setStatus(value)}
              className={cn(
                "shrink-0 rounded-md px-4 py-2 text-sm font-bold",
                status === value
                  ? "bg-primary text-white"
                  : "bg-surface text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          <div className="grid gap-4">
            {resource.data.map((booking) => (
              <article
                key={booking.id}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold">
                      การจอง{" "}
                      {booking.bookingNumber || "กำลังจัดเตรียมเลขอ้างอิง"}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      สร้างเมื่อ {formatDateTime(booking.createdAt)}
                    </p>
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
                {!["cancelled", "completed"].includes(booking.status) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={async () => {
                      try {
                        await request(`/bookings/${booking.id}`, {
                          method: "DELETE",
                        });
                        await resource.reload();
                        toast.success("ยกเลิกการจองแล้ว");
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "ยกเลิกไม่สำเร็จ",
                        );
                      }
                    }}
                  >
                    ยกเลิกการจอง
                  </Button>
                ) : null}
              </article>
            ))}
            {!resource.data.length ? (
              <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
                <p className="font-bold">ยังไม่มีรายการจอง</p>
                <p className="mt-1 text-sm text-muted">
                  เลือกสวนก่อน แล้วเลือกรอบวันที่ต้องการเข้าชม
                </p>
                <Link href="/visits" className="mt-4 inline-flex">
                  <Button size="sm" variant="outline">
                    เลือกสวนเพื่อจอง
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </AuthGuard>
    </AccountShell>
  );
}
