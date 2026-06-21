import { Plus, Trash2 } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";

export default function SellerClosuresPage() {
  return (
    <OperationsShell mode="seller" title="วันปิดสวน" description="ระบุช่วงวันที่ไม่รับออเดอร์หรือไม่เปิดให้เข้าชม" actions={<Button><Plus size={18} />เพิ่มวันปิด</Button>}>
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 p-5"><div><p className="font-bold">หยุดปรับปรุงพื้นที่สวน</p><p className="mt-1 text-sm text-muted">28 มิ.ย. 2569 - 30 มิ.ย. 2569</p></div><button aria-label="ลบวันปิดสวน" className="text-muted hover:text-danger"><Trash2 size={18} /></button></div>
      </div>
    </OperationsShell>
  );
}
