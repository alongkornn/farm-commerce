"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";
import { login } from "@/lib/api/client";
import { getSeller } from "@/lib/api/catalog";

const schema = z.object({
  email: z.email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await login(values.email, values.password);
      setSession(session);
      toast.success("เข้าสู่ระบบสำเร็จ");
      let destination =
        session.user.userType === "admin" ? "/admin" : "/account";
      if (session.user.userType === "seller") {
        const seller = await getSeller(session.user.id).catch(() => null);
        destination =
          seller?.status === "approved" ? "/seller" : "/seller/settings";
        if (seller && seller.status !== "approved") {
          toast.info("ข้อมูลสวนอยู่ระหว่างรอผู้ดูแลอนุมัติ");
        }
      }
      router.push(destination);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ");
    }
  });

  return (
    <>
      <p className="text-sm font-bold text-primary">ยินดีต้อนรับกลับมา</p>
      <h1 className="mt-1 text-3xl font-extrabold">เข้าสู่ระบบ</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        ใช้อีเมลและรหัสผ่านที่ลงทะเบียนไว้
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5">
        <Field label="อีเมล" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...register("email")}
          />
        </Field>
        <Field label="รหัสผ่าน" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="focus-ring absolute right-1 top-1 grid size-9 place-items-center rounded-md text-muted hover:bg-surface-muted"
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Link
          href="/forgot-password"
          className="-mt-2 justify-self-end text-sm font-bold text-primary hover:underline"
        >
          ลืมรหัสผ่าน?
        </Link>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={19} /> : null}
          เข้าสู่ระบบ
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="font-bold text-primary hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}
