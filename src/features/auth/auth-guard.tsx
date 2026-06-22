"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/features/auth/auth-provider";
import type { UserRole } from "@/lib/types";

export function AuthGuard({
  roles,
  children,
}: {
  roles?: UserRole[];
  children: React.ReactNode;
}) {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="grid min-h-64 place-items-center text-primary">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          icon={LogIn}
          title="กรุณาเข้าสู่ระบบ"
          description="หน้านี้ต้องใช้บัญชีที่เข้าสู่ระบบแล้ว"
          action={
            <Link href="/login">
              <Button>เข้าสู่ระบบ</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (roles && !roles.includes(user.userType)) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          icon={LogIn}
          title="ไม่มีสิทธิ์เข้าถึง"
          description="ประเภทบัญชีนี้ไม่สามารถใช้งานหน้านี้ได้"
        />
      </div>
    );
  }

  return children;
}
