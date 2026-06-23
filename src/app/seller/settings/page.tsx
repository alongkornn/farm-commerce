"use client";

import { Clock3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { SellerProfile } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

const emptyProfile: SellerProfile = {
  id: "",
  userId: "",
  farmName: "",
  description: "",
  address: "",
  latitude: 0,
  longitude: 0,
  status: "pending",
  deleted: false,
};

export default function SellerSettingsPage() {
  const { user, request } = useAuth();
  const profile = useApiResource<SellerProfile>(
    user ? `/sellers/${user.id}` : "",
    emptyProfile,
    Boolean(user),
    false,
  );
  const [saving, setSaving] = useState(false);

  return (
    <OperationsShell
      mode="seller"
      title="ข้อมูลสวน"
      description="บันทึกข้อมูลสวนเพื่อส่งตรวจสอบหรืออัปเดตหน้าสวน"
    >
      <AuthGuard roles={["seller"]}>
        {profile.loading ? (
          <ResourceState
            loading
            error=""
            onRetry={profile.reload}
          />
        ) : (
          <>
            {profile.data.id ? (
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                <Clock3 size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-bold">สถานะการตรวจสอบสวน</p>
                  <p className="text-xs text-muted">
                    ผู้ดูแลระบบจะตรวจสอบข้อมูลก่อนเปิดใช้งานหลังบ้าน
                  </p>
                </div>
                <Badge
                  className="ml-auto"
                  tone={
                    profile.data.status === "approved"
                      ? "success"
                      : profile.data.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {profile.data.status === "approved"
                    ? "อนุมัติแล้ว"
                    : profile.data.status === "rejected"
                      ? "ไม่อนุมัติ"
                      : "รอตรวจสอบ"}
                </Badge>
              </div>
            ) : null}
            <form
              key={`${profile.data.id}-${profile.data.status}-${profile.data.farmName}`}
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
                      latitude: Number(data.get("latitude")),
                      longitude: Number(data.get("longitude")),
                    }),
                  });
                  await profile.reload();
                  toast.success(
                    profile.data.id
                      ? "อัปเดตข้อมูลสวนแล้ว"
                      : "ส่งข้อมูลสวนเพื่อตรวจสอบแล้ว",
                  );
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
                  <Input
                    name="farmName"
                    defaultValue={profile.data.farmName}
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5 text-sm font-bold">
                    ละติจูด
                    <Input
                      name="latitude"
                      type="number"
                      step="any"
                      defaultValue={profile.data.latitude || ""}
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold">
                    ลองจิจูด
                    <Input
                      name="longitude"
                      type="number"
                      step="any"
                      defaultValue={profile.data.longitude || ""}
                      required
                    />
                  </label>
                </div>
                <label className="grid gap-1.5 text-sm font-bold">
                  คำอธิบาย
                  <textarea
                    name="description"
                    defaultValue={profile.data.description}
                    className="focus-ring min-h-28 rounded-md border border-border bg-surface p-3 text-sm"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-bold">
                  ที่อยู่
                  <Input
                    name="address"
                    defaultValue={profile.data.address}
                    required
                  />
                </label>
                <Button
                  type="submit"
                  disabled={saving}
                  className="justify-self-start"
                >
                  {saving
                    ? "กำลังบันทึก..."
                    : profile.data.id
                      ? "อัปเดตข้อมูลสวน"
                      : "ส่งข้อมูลเพื่อตรวจสอบ"}
                </Button>
              </div>
            </form>
          </>
        )}
      </AuthGuard>
    </OperationsShell>
  );
}
