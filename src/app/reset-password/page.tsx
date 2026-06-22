"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useSearchParams();
  return (
    <AuthShell>
      <h1 className="text-3xl font-extrabold">ตั้งรหัสผ่านใหม่</h1>
      <form
        className="mt-8 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          try {
            await apiRequest("/account/reset-password", {
              method: "POST",
              body: JSON.stringify({
                token: data.get("token"),
                newPassword: data.get("newPassword"),
              }),
            });
            toast.success("ตั้งรหัสผ่านใหม่แล้ว");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ",
            );
          }
        }}
      >
        <label className="grid gap-1.5 text-sm font-bold">
          Token
          <Input
            name="token"
            defaultValue={params.get("token") ?? ""}
            required
          />
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
        <Button type="submit">ตั้งรหัสผ่านใหม่</Button>
      </form>
    </AuthShell>
  );
}
