"use client";

import { QrCode } from "lucide-react";
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
import type { Booking } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

export default function SellerBookingsPage() {
  const { request } = useAuth();
  const resource = useApiResource<Booking[]>("/seller/bookings", []);
  const [checkIn, setCheckIn] = useState(false);

  async function update(id: string, status: string) {
    try {
      await request(`/seller/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await resource.reload();
      toast.success("อัปเดตการจองแล้ว");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "อัปเดตการจองไม่สำเร็จ",
      );
    }
  }

  return (
    <OperationsShell
      mode="seller"
      title="ผู้เข้าชมสวน"
      description="อนุมัติการจองและเช็กอิน"
      actions={
        <Button variant="outline" onClick={() => setCheckIn(true)}>
          <QrCode size={18} />
          เช็กอิน
        </Button>
      }
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={[
                "ผู้จอง",
                "วันและเวลา",
                "จำนวน",
                "พาหนะ",
                "สถานะ",
                "",
              ]}
            >
              {resource.data.map((booking) => (
                <tr key={booking.id}>
                  <Cell className="font-bold">{booking.bookerName}</Cell>
                  <Cell>{formatDateTime(booking.slot.startAt)}</Cell>
                  <Cell>{booking.visitorCount} คน</Cell>
                  <Cell>{booking.vehicle}</Cell>
                  <Cell>
                    <StatusBadge status={booking.status} />
                  </Cell>
                  <Cell className="space-x-2">
                    {booking.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => void update(booking.id, "approved")}
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void update(booking.id, "rejected")}
                        >
                          ปฏิเสธ
                        </Button>
                      </>
                    ) : null}
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ไม่มีการจอง
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={checkIn}
        title="เช็กอินผู้เข้าชม"
        onClose={() => setCheckIn(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/seller/bookings/check-in", {
                method: "POST",
                body: JSON.stringify({ code: data.get("code") }),
              });
              setCheckIn(false);
              toast.success("เช็กอินสำเร็จ");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "เช็กอินไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            รหัสเช็กอิน
            <Input name="code" required />
          </label>
          <Button type="submit">ยืนยันเช็กอิน</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
