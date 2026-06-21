import { OperationsShell } from "@/components/layout/operations-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockSellers } from "@/lib/mock-data";

export default function AdminSellersPage() {
  return (
    <OperationsShell mode="admin" title="ตรวจสอบสวน" description="อนุมัติ ปฏิเสธ หรือระงับสวนก่อนให้เปิดขายในระบบ">
      <DataTable headers={["ชื่อสวน", "ที่อยู่", "สถานะ", "ดำเนินการ"]}>
        {mockSellers.map((seller, index) => <tr key={seller.id}><Cell><p className="font-bold">{seller.farmName}</p><p className="text-xs text-muted">{seller.description}</p></Cell><Cell>{seller.address}</Cell><Cell><StatusBadge status={index === 0 ? "pending" : "confirmed"} /></Cell><Cell className="space-x-2"><ActionButton message={`อนุมัติ ${seller.farmName} แล้ว`} size="sm">อนุมัติ</ActionButton><ActionButton message={`เปิดข้อมูล ${seller.farmName}`} size="sm" variant="outline">ดูข้อมูล</ActionButton></Cell></tr>)}
      </DataTable>
    </OperationsShell>
  );
}
