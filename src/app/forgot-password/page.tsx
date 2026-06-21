"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/features/auth/auth-shell";
import { Field } from "@/features/auth/login-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/account/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("ส่งคำแนะนำสำหรับตั้งรหัสผ่านใหม่แล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ไม่สามารถส่งคำขอได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <p className="text-sm font-bold text-primary">กู้คืนบัญชี</p>
      <h1 className="mt-1 text-3xl font-extrabold">ลืมรหัสผ่าน</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        กรอกอีเมลที่ใช้สมัคร เราจะส่งขั้นตอนสำหรับตั้งรหัสผ่านใหม่ให้คุณ
      </p>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <Field label="อีเมล">
          <Input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" disabled={loading}>
          ส่งคำขอ
        </Button>
      </form>
    </AuthShell>
  );
}
