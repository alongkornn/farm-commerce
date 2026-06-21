import { OperationsShell } from "@/components/layout/operations-shell";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney } from "@/lib/utils";

export default function SellerPayoutsPage() {
  return (
    <OperationsShell mode="seller" title="รายรับและการจ่ายเงิน" description="ตรวจสอบยอดขาย ค่าธรรมเนียม และสถานะการโอนเงิน">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {["ยอดพร้อมจ่าย|1254000", "กำลังดำเนินการ|482000", "จ่ายแล้วเดือนนี้|3168000"].map((item) => { const [label, value] = item.split("|"); return <div key={label} className="rounded-lg border border-border bg-surface p-5"><p className="text-xs text-muted">{label}</p><p className="mt-2 font-display text-2xl font-extrabold text-primary">{formatMoney(Number(value))}</p></div>; })}
      </div>
      <DataTable headers={["รอบจ่าย", "ยอดขาย", "ค่าธรรมเนียม", "ยอดสุทธิ", "สถานะ"]}>
        <tr><Cell className="font-bold">20 มิ.ย. 2569</Cell><Cell>{formatMoney(1320000)}</Cell><Cell>{formatMoney(66000)}</Cell><Cell className="font-bold">{formatMoney(1254000)}</Cell><Cell><StatusBadge status="pending" /></Cell></tr>
      </DataTable>
    </OperationsShell>
  );
}
