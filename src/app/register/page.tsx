import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  return (
    <AuthShell>
      <RegisterForm initialRole={role === "seller" ? "seller" : "buyer"} />
    </AuthShell>
  );
}
