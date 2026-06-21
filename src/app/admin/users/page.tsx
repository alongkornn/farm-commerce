import { OperationsShell } from "@/components/layout/operations-shell";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

export default function AdminUsersPage() {
  return (
    <OperationsShell mode="admin" title="ผู้ใช้งาน" description="ค้นหาและตรวจสอบสถานะบัญชีในระบบ">
      <DataTable headers={["ชื่อ", "อีเมล", "ประเภท", "ยืนยันอีเมล", "สถานะ"]}>
        <tr><Cell className="font-bold">สมชาย ใจดี</Cell><Cell>somchai@example.com</Cell><Cell>Buyer</Cell><Cell><StatusBadge status="confirmed" /></Cell><Cell className="font-bold text-primary">ใช้งานอยู่</Cell></tr>
      </DataTable>
    </OperationsShell>
  );
}
