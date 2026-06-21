import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountSettingsPage() {
  return (
    <AccountShell title="ตั้งค่าบัญชี" description="แก้ไขข้อมูลส่วนตัว รหัสผ่าน และการยืนยันอีเมล">
      <div className="grid gap-6 xl:grid-cols-2">
        <form className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-extrabold">ข้อมูลส่วนตัว</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">ชื่อ<Input defaultValue="สมชาย" /></label>
            <label className="grid gap-1.5 text-sm font-bold">นามสกุล<Input defaultValue="ใจดี" /></label>
            <label className="grid gap-1.5 text-sm font-bold">เบอร์โทรศัพท์<Input defaultValue="0812345678" /></label>
            <Button type="submit" className="justify-self-start">บันทึกข้อมูล</Button>
          </div>
        </form>
        <form className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-extrabold">เปลี่ยนรหัสผ่าน</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">รหัสผ่านปัจจุบัน<Input type="password" /></label>
            <label className="grid gap-1.5 text-sm font-bold">รหัสผ่านใหม่<Input type="password" /></label>
            <label className="grid gap-1.5 text-sm font-bold">ยืนยันรหัสผ่านใหม่<Input type="password" /></label>
            <Button type="submit" className="justify-self-start">เปลี่ยนรหัสผ่าน</Button>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
