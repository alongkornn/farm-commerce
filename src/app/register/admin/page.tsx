"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/features/auth/auth-shell";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api/client";
import type { ApiEnvelope, AuthResponse } from "@/lib/types";

export default function AdminRegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  return (
    <AuthShell>
      <h1 className="text-3xl font-extrabold">สมัครผู้ดูแลระบบ</h1>
      <form
        className="mt-8 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          try {
            const response = await apiRequest<ApiEnvelope<AuthResponse>>(
              "/register/admin",
              {
                method: "POST",
                body: JSON.stringify({
                  email: data.get("email"),
                  password: data.get("password"),
                  firstName: data.get("firstName"),
                  lastName: data.get("lastName"),
                  phone: data.get("phone"),
                  registrationKey: data.get("registrationKey"),
                }),
              },
            );
            setSession(response.data);
            router.push("/admin");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "สมัครไม่สำเร็จ",
            );
          }
        }}
      >
        {[
          ["firstName", "ชื่อ"],
          ["lastName", "นามสกุล"],
          ["phone", "เบอร์โทรศัพท์"],
          ["email", "อีเมล"],
          ["password", "รหัสผ่าน"],
          ["registrationKey", "Admin registration key"],
        ].map(([name, label]) => (
          <label key={name} className="grid gap-1.5 text-sm font-bold">
            {label}
            <Input
              name={name}
              type={name === "password" ? "password" : "text"}
              required
            />
          </label>
        ))}
        <Button type="submit">สมัครผู้ดูแลระบบ</Button>
      </form>
    </AuthShell>
  );
}
