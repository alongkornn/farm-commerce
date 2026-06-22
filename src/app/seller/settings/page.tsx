"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";

export default function SellerSettingsPage() {
  const { request } = useAuth();
  const [saving, setSaving] = useState(false);

  return (
    <OperationsShell
      mode="seller"
      title="ข้อมูลสวน"
      description="บันทึกข้อมูลสวนเพื่อส่งตรวจสอบหรืออัปเดตหน้าสวน"
    >
      <AuthGuard roles={["seller"]}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setSaving(true);
            try {
              await request("/seller/profile", {
                method: "PUT",
                body: JSON.stringify({
                  farmName: data.get("farmName"),
                  description: data.get("description"),
                  address: data.get("address"),
                }),
              });
              toast.success("บันทึกข้อมูลสวนแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "บันทึกไม่สำเร็จ",
              );
            } finally {
              setSaving(false);
            }
          }}
          className="max-w-2xl rounded-lg border border-border bg-surface p-5"
        >
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">
              ชื่อสวน
              <Input name="farmName" required />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              คำอธิบาย
              <textarea
                name="description"
                className="focus-ring min-h-28 rounded-md border border-border bg-surface p-3 text-sm"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              ที่อยู่
              <Input name="address" required />
            </label>
            <Button type="submit" disabled={saving} className="justify-self-start">
              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลสวน"}
            </Button>
          </div>
        </form>
      </AuthGuard>
    </OperationsShell>
  );
}
