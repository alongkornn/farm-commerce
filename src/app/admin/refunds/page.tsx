import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";

export default function AdminRefundsPage() {
  return (
    <OperationsShell mode="admin" title="คำขอคืนเงิน" description="ตรวจสอบเหตุผล หลักฐาน และอัปเดตผลการพิจารณา">
      <DataTable headers={["คำสั่งซื้อ", "ผู้ซื้อ", "เหตุผล", "ยอดเงิน", "สถานะ", "ดำเนินการ"]}>
        <tr><Cell className="font-bold">order-20260621-01</Cell><Cell>สมชาย ใจดี</Cell><Cell>สินค้าเสียหายระหว่างจัดส่ง</Cell><Cell className="font-bold">{formatMoney(14900)}</Cell><Cell><StatusBadge status="pending" /></Cell><Cell><Button size="sm">พิจารณา</Button></Cell></tr>
      </DataTable>
    </OperationsShell>
  );
}
