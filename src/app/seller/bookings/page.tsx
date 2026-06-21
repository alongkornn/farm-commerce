import { QrCode } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function SellerBookingsPage() {
  return (
    <OperationsShell mode="seller" title="ผู้เข้าชมสวน" description="ตรวจสอบคำขอ อนุมัติการจอง และเช็กอินเมื่อผู้เข้าชมมาถึง" actions={<ActionButton message="เปิดเครื่องมือเช็กอินแล้ว" variant="outline"><QrCode size={18} />เช็กอิน</ActionButton>}>
      <DataTable headers={["ผู้จอง", "วันและเวลา", "จำนวน", "พาหนะ", "สถานะ", "ดำเนินการ"]}>
        {mockBookings.map((booking) => <tr key={booking.id}><Cell className="font-bold">{booking.bookerName}</Cell><Cell>{formatDateTime(booking.slot.startAt)}</Cell><Cell>{booking.visitorCount} คน</Cell><Cell>{booking.vehicle}</Cell><Cell><StatusBadge status={booking.status} /></Cell><Cell className="space-x-2"><ActionButton message={`อนุมัติการจองของ ${booking.bookerName} แล้ว`} size="sm">อนุมัติ</ActionButton><ActionButton message={`ปฏิเสธการจองของ ${booking.bookerName} แล้ว`} size="sm" variant="outline">ปฏิเสธ</ActionButton></Cell></tr>)}
      </DataTable>
    </OperationsShell>
  );
}
