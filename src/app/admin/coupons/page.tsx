import { Plus } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";

export default function AdminCouponsPage() {
  return (
    <OperationsShell mode="admin" title="คูปอง" description="สร้างและติดตามสิทธิ์ส่วนลดของ marketplace" actions={<Button><Plus size={18} />สร้างคูปอง</Button>}>
      <DataTable headers={["รหัส", "ส่วนลด", "ขั้นต่ำ", "ใช้แล้ว", "วันหมดอายุ", "สถานะ"]}>
        <tr><Cell className="font-mono font-bold">FRESH100</Cell><Cell>฿100</Cell><Cell>฿800</Cell><Cell>38 / 200</Cell><Cell>30 มิ.ย. 2569</Cell><Cell className="font-bold text-primary">ใช้งานอยู่</Cell></tr>
      </DataTable>
    </OperationsShell>
  );
}
