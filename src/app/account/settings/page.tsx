"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { ApiEnvelope, User } from "@/lib/types";

export default function AccountSettingsPage() {
  const { user, request, signOut } = useAuth();
  const [profile, setProfile] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  return (
    <AccountShell
      title="ตั้งค่าบัญชี"
      description="แก้ไขข้อมูลส่วนตัว รหัสผ่าน และจัดการบัญชี"
    >
      <AuthGuard>
        <div className="grid gap-6 xl:grid-cols-2">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await request<ApiEnvelope<User>>("/account/profile", {
                  method: "PUT",
                  body: JSON.stringify(profile),
                });
                toast.success("บันทึกข้อมูลส่วนตัวแล้ว");
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : "บันทึกไม่สำเร็จ",
                );
              }
            }}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <h2 className="text-lg font-extrabold">ข้อมูลส่วนตัว</h2>
            <div className="mt-5 grid gap-4">
              {(["firstName", "lastName", "phone"] as const).map((key) => (
                <label key={key} className="grid gap-1.5 text-sm font-bold">
                  {key === "firstName"
                    ? "ชื่อ"
                    : key === "lastName"
                      ? "นามสกุล"
                      : "เบอร์โทรศัพท์"}
                  <Input
                    value={profile[key] ?? user?.[key] ?? ""}
                    onChange={(event) =>
                      setProfile((value) => ({
                        ...value,
                        [key]: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              ))}
              <Button type="submit" className="justify-self-start">
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              try {
                await request("/account/change-password", {
                  method: "POST",
                  body: JSON.stringify({
                    currentPassword: data.get("currentPassword"),
                    newPassword: data.get("newPassword"),
                  }),
                });
                event.currentTarget.reset();
                toast.success("เปลี่ยนรหัสผ่านแล้ว กรุณาเข้าสู่ระบบใหม่");
                await signOut();
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ",
                );
              }
            }}
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
              <Button type="submit" className="justify-self-start">
                เปลี่ยนรหัสผ่าน
              </Button>
            </div>
          </form>
          <section className="rounded-lg border border-danger/30 bg-surface p-5 xl:col-span-2">
            <h2 className="font-extrabold text-danger">ปิดบัญชี</h2>
            <p className="mt-1 text-sm text-muted">
              การปิดบัญชีจะยกเลิก session และไม่สามารถใช้งานบัญชีนี้ต่อได้
            </p>
            <Button
              variant="danger"
              className="mt-4"
              onClick={async () => {
                try {
                  await request("/account", { method: "DELETE" });
                  await signOut();
                  toast.success("ปิดบัญชีแล้ว");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "ปิดบัญชีไม่สำเร็จ",
                  );
                }
              }}
            >
              ปิดบัญชี
            </Button>
          </section>
          {!user?.verified ? (
            <section className="rounded-lg border border-border bg-surface p-5 xl:col-span-2">
              <h2 className="font-extrabold">ยืนยันอีเมล</h2>
              <p className="mt-1 text-sm text-muted">
                ขอ verification token จาก backend เพื่อยืนยันอีเมล
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={async () => {
                  try {
                    const response = await request<{
                      developmentToken?: string;
                    }>("/account/verification-token", { method: "POST" });
                    toast.success(
                      response.developmentToken
                        ? `Token: ${response.developmentToken}`
                        : "ส่ง verification token แล้ว",
                    );
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "ส่งคำขอไม่สำเร็จ",
                    );
                  }
                }}
              >
                ขอ verification token
              </Button>
            </section>
          ) : null}
        </div>
      </AuthGuard>
    </AccountShell>
  );
}
