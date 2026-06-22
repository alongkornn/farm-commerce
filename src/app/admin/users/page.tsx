import { OperationsShell } from "@/components/layout/operations-shell";

export default function AdminUsersPage() {
  return (
    <OperationsShell
      mode="admin"
      title="ผู้ใช้งาน"
      description="การจัดการผู้ใช้งาน"
    >
      <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm leading-6 text-muted">
        Backend ยังไม่มี endpoint สำหรับดูหรือจัดการผู้ใช้งานทั้งหมด
        หน้านี้จึงไม่แสดงข้อมูลจำลอง
      </p>
    </OperationsShell>
  );
}
