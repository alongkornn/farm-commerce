"use client";

import { toast } from "sonner";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountSettingsPage() {
  function save(event: React.FormEvent, message: string) {
    event.preventDefault();
    toast.success(message);
  }

  return (
    <AccountShell
      title="ตั้งค่าบัญชี"
      description="แก้ไขข้อมูลส่วนตัว รหัสผ่าน และการยืนยันอีเมล"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={(event) => save(event, "บันทึกข้อมูลส่วนตัวแล้ว")}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <h2 className="text-lg font-extrabold">ข้อมูลส่วนตัว</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">
              ชื่อ
              <Input name="firstName" defaultValue="สมชาย" required />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              นามสกุล
              <Input name="lastName" defaultValue="ใจดี" required />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              เบอร์โทรศัพท์
              <Input name="phone" defaultValue="0812345678" required />
            </label>
            <Button type="submit" className="justify-self-start">
              บันทึกข้อมูล
            </Button>
          </div>
        </form>
        <form
          onSubmit={(event) => save(event, "เปลี่ยนรหัสผ่านแล้ว")}
          className="rounded-lg border border-border bg-surface p-5"
        >
          <h2 className="text-lg font-extrabold">เปลี่ยนรหัสผ่าน</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">
              รหัสผ่านปัจจุบัน
              <Input name="currentPassword" type="password" required />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              รหัสผ่านใหม่
              <Input
                name="newPassword"
                type="password"
                minLength={8}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              ยืนยันรหัสผ่านใหม่
              <Input
                name="confirmPassword"
                type="password"
                minLength={8}
                required
              />
            </label>
            <Button type="submit" className="justify-self-start">
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
