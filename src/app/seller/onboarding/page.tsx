import { Store } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SellerOnboardingPage() {
  return (
    <OperationsShell mode="seller" title="ตั้งค่าข้อมูลสวน" description="กรอกข้อมูลให้ครบเพื่อส่งให้ผู้ดูแลตรวจสอบก่อนเริ่มขาย">
      <form className="max-w-2xl rounded-lg border border-border bg-surface p-6">
        <Store size={28} className="text-primary" />
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-bold">ชื่อสวน<Input required /></label>
          <label className="grid gap-1.5 text-sm font-bold">เรื่องราวและรายละเอียดสวน<textarea required className="focus-ring min-h-32 rounded-md border border-border p-3 text-sm" /></label>
          <label className="grid gap-1.5 text-sm font-bold">ที่อยู่สวน<Input required /></label>
          <Button type="submit" className="justify-self-start">ส่งข้อมูลเพื่อตรวจสอบ</Button>
        </div>
      </form>
    </OperationsShell>
  );
}
