import { Plus } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { mockVisitSlots } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function SellerVisitSlotsPage() {
  return (
    <OperationsShell mode="seller" title="รอบเข้าชมสวน" description="กำหนดวัน เวลา และจำนวนผู้เข้าชมสูงสุดต่อรอบ" actions={<Button><Plus size={18} />เพิ่มรอบ</Button>}>
      <DataTable headers={["เริ่ม", "สิ้นสุด", "ความจุ", "สถานะ", "ดำเนินการ"]}>
        {mockVisitSlots.filter((slot) => slot.sellerId === "s-1").map((slot) => <tr key={slot.id}><Cell className="font-bold">{formatDateTime(slot.startAt)}</Cell><Cell>{formatDateTime(slot.endAt)}</Cell><Cell>{slot.capacity} คน</Cell><Cell className="font-bold text-primary">เปิดรับจอง</Cell><Cell><Button size="sm" variant="outline">ปิดรอบ</Button></Cell></tr>)}
      </DataTable>
    </OperationsShell>
  );
}
