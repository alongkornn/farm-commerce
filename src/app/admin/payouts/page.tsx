import { Play } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";

export default function AdminPayoutsPage() {
  return (
    <OperationsShell mode="admin" title="รอบจ่ายเงิน" description="ประมวลผลยอดสุทธิที่จะจ่ายให้สวนตามรายการที่เข้าเงื่อนไข" actions={<ActionButton message="เริ่มประมวลผลรอบจ่ายเงินแล้ว"><Play size={17} />เริ่มรอบจ่ายเงิน</ActionButton>}>
      <DataTable headers={["สวน", "จำนวนออเดอร์", "ยอดขาย", "ค่าธรรมเนียม", "ยอดจ่าย", "สถานะ"]}>
        <tr><Cell className="font-bold">สวนลุงพร</Cell><Cell>28</Cell><Cell>{formatMoney(1320000)}</Cell><Cell>{formatMoney(66000)}</Cell><Cell className="font-bold">{formatMoney(1254000)}</Cell><Cell><StatusBadge status="pending" /></Cell></tr>
      </DataTable>
    </OperationsShell>
  );
}
