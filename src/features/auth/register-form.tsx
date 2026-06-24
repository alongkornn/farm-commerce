"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";
import { Field } from "@/features/auth/login-form";
import { register as registerAccount } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    phone: z.string().min(9, "กรุณากรอกเบอร์โทรศัพท์"),
    email: z.email("กรุณากรอกอีเมลให้ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านไม่ตรงกัน",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm({
  initialRole = "buyer",
}: {
  initialRole?: "buyer" | "seller";
}) {
  const router = useRouter();
  const { setSession } = useAuth();
  const [role, setRole] = useState<"buyer" | "seller">(initialRole);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (formValues) => {
    const values = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone,
      email: formValues.email,
      password: formValues.password,
    };
    try {
      const session = await registerAccount(role, values);
      setSession(session);
      toast.success(
        role === "seller"
          ? "สมัครสำเร็จ กรุณากรอกข้อมูลสวนเพื่อส่งตรวจสอบ"
          : "สมัครสมาชิกสำเร็จ",
      );
      router.push(role === "seller" ? "/seller/onboarding" : "/account");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "สมัครสมาชิกไม่สำเร็จ");
    }
  });

  return (
    <>
      <p className="text-sm font-bold text-primary">เริ่มต้นกับ Farm Commerce</p>
      <h1 className="mt-1 text-3xl font-extrabold">สร้างบัญชีใหม่</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        เลือกประเภทบัญชีให้ตรงกับการใช้งานของคุณ
      </p>

      <div className="mt-6 grid gap-2 rounded-lg bg-surface-muted p-1 sm:grid-cols-2">
        <RoleButton
          active={role === "buyer"}
          icon={UserRound}
          label="ผู้ซื้อ"
          onClick={() => setRole("buyer")}
        />
        <RoleButton
          active={role === "seller"}
          icon={Store}
          label="เจ้าของสวน"
          onClick={() => setRole("seller")}
        />
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="ชื่อ" error={errors.firstName?.message}>
            <Input autoComplete="given-name" {...register("firstName")} />
          </Field>
          <Field label="นามสกุล" error={errors.lastName?.message}>
            <Input autoComplete="family-name" {...register("lastName")} />
          </Field>
        </div>
        <Field label="เบอร์โทรศัพท์" error={errors.phone?.message}>
          <Input inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="อีเมล" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="รหัสผ่าน" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
          </Field>
          <Field label="ยืนยันรหัสผ่าน" error={errors.confirmPassword?.message}>
            <Input
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </Field>
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={19} /> : null}
          {role === "seller" ? "สมัครเป็นเจ้าของสวน" : "สมัครสมาชิก"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        มีบัญชีแล้ว?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </>
  );
}

function RoleButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof UserRound;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition",
        active ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-foreground",
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
