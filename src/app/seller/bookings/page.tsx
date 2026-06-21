import { QrCode } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function SellerBookingsPage() {
  return (
    <OperationsShell mode="seller" title="ผู้เข้าชมสวน" description="ตรวจสอบคำขอ อนุมัติการจอง และเช็กอินเมื่อผู้เข้าชมมาถึง" actions={<Button variant="outline"><QrCode size={18} />เช็กอิน</Button>}>
      <DataTable headers={["ผู้จอง", "วันและเวลา", "จำนวน", "พาหนะ", "สถานะ", "ดำเนินการ"]}>
        {mockBookings.map((booking) => <tr key={booking.id}><Cell className="font-bold">{booking.bookerName}</Cell><Cell>{formatDateTime(booking.slot.startAt)}</Cell><Cell>{booking.visitorCount} คน</Cell><Cell>{booking.vehicle}</Cell><Cell><StatusBadge status={booking.status} /></Cell><Cell className="space-x-2"><Button size="sm">อนุมัติ</Button><Button size="sm" variant="outline">ปฏิเสธ</Button></Cell></tr>)}
      </DataTable>
    </OperationsShell>
  );
}
