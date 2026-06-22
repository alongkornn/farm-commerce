"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/features/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const params = useSearchParams();
  return (
    <AuthShell>
      <h1 className="text-3xl font-extrabold">ยืนยันอีเมล</h1>
      <form
        className="mt-8 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          try {
            await apiRequest("/account/verify-email", {
              method: "POST",
              body: JSON.stringify({ token: data.get("token") }),
            });
            toast.success("ยืนยันอีเมลแล้ว");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "ยืนยันอีเมลไม่สำเร็จ",
            );
          }
        }}
      >
        <label className="grid gap-1.5 text-sm font-bold">
          Verification token
          <Input
            name="token"
            defaultValue={params.get("token") ?? ""}
            required
          />
        </label>
        <Button type="submit">ยืนยันอีเมล</Button>
      </form>
    </AuthShell>
  );
}
