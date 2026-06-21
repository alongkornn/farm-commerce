import { Banknote, RefreshCcw, Store, UsersRound } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";

export default function AdminDashboardPage() {
  return (
    <OperationsShell mode="admin" title="ภาพรวมระบบ" description="สถานะ marketplace และรายการที่ต้องดำเนินการ">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetric icon={UsersRound} label="ผู้ใช้งานทั้งหมด" value="1,284" />
        <AdminMetric icon={Store} label="สวนรอตรวจสอบ" value="7" />
        <AdminMetric icon={RefreshCcw} label="คำขอคืนเงิน" value="4" />
        <AdminMetric icon={Banknote} label="ยอดขายเดือนนี้" value="฿428K" />
      </div>
      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-extrabold">งานที่ต้องตรวจสอบ</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-surface-muted p-4"><p className="font-bold">คำขอเปิดสวนใหม่ 7 รายการ</p><p className="mt-1 text-xs text-muted">รายการเก่าสุดรอมาแล้ว 2 วัน</p></div>
          <div className="rounded-md bg-[#fff4d7] p-4"><p className="font-bold">คำขอคืนเงิน 4 รายการ</p><p className="mt-1 text-xs text-muted">รวมมูลค่า ฿3,840</p></div>
        </div>
      </div>
    </OperationsShell>
  );
}

function AdminMetric({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-surface p-5"><Icon size={21} className="text-primary" /><p className="mt-4 font-display text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs text-muted">{label}</p></div>;
}
