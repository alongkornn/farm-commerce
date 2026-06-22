"use client";

import { AlertCircle, Clock3, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ResourceState({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="grid min-h-48 place-items-center text-primary">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (error) {
    if (error.toLowerCase().includes("seller approval required")) {
      return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-[#725214]">
            <Clock3 size={23} />
          </span>
          <p className="mt-4 text-lg font-extrabold">
            ข้อมูลสวนอยู่ระหว่างรออนุมัติ
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            ผู้ดูแลระบบต้องตรวจสอบและอนุมัติสวนก่อน
            จึงจะสามารถจัดการสินค้า คำสั่งซื้อ การจอง และดูแดชบอร์ดได้
          </p>
          <Link href="/seller/settings" className="mt-5">
            <Button variant="outline">ตรวจสอบข้อมูลสวน</Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center">
        <AlertCircle className="text-danger" />
        <p className="mt-3 font-bold">โหลดข้อมูลไม่สำเร็จ</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
        <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
          ลองอีกครั้ง
        </Button>
      </div>
    );
  }
  return null;
}
