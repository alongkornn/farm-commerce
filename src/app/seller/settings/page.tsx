import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SellerSettingsPage() {
  return (
    <OperationsShell mode="seller" title="ข้อมูลสวน" description="ข้อมูลนี้จะแสดงในหน้าสวนและใช้ประกอบการตรวจสอบ">
      <form className="max-w-2xl rounded-lg border border-border bg-surface p-5">
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-bold">ชื่อสวน<Input defaultValue="สวนลุงพร" /></label>
          <label className="grid gap-1.5 text-sm font-bold">คำอธิบาย<textarea defaultValue="สวนมะม่วงครอบครัว ดูแลแบบลดสารและเก็บตามออเดอร์" className="focus-ring min-h-28 rounded-md border border-border bg-surface p-3 text-sm" /></label>
          <label className="grid gap-1.5 text-sm font-bold">ที่อยู่<Input defaultValue="อำเภอดำเนินสะดวก จังหวัดราชบุรี" /></label>
          <Button type="submit" className="justify-self-start">บันทึกข้อมูลสวน</Button>
        </div>
      </form>
    </OperationsShell>
  );
}
