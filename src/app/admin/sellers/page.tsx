"use client";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { SellerProfile } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

export default function AdminSellersPage() {
  const { request } = useAuth();
  const resource = useApiResource<SellerProfile[]>("/admin/sellers", []);

  async function review(userId: string, status: string) {
    try {
      await request(`/admin/sellers/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note: "" }),
      });
      await resource.reload();
      toast.success("อัปเดตสถานะสวนแล้ว");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "อัปเดตสถานะไม่สำเร็จ",
      );
    }
  }

  async function setDeleted(userId: string, deleted: boolean) {
    try {
      await request(`/admin/sellers/${userId}/deleted`, {
        method: "PATCH",
        body: JSON.stringify({ deleted }),
      });
      await resource.reload();
      toast.success(deleted ? "ซ่อนสวนแล้ว" : "คืนค่าสวนแล้ว");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "เปลี่ยนการแสดงสวนไม่สำเร็จ",
      );
    }
  }

  return (
    <OperationsShell
      mode="admin"
      title="จัดการสวน"
      description="อนุมัติ ระงับ ซ่อน และคืนค่าสวนในระบบ"
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={["ชื่อสวน", "ที่อยู่", "สถานะ", "การแสดงผล", "ดำเนินการ"]}
            >
              {resource.data.map((seller) => (
                <tr key={seller.id}>
                  <Cell>
                    <p className="font-bold">{seller.farmName}</p>
                    <p className="text-xs text-muted">{seller.description}</p>
                  </Cell>
                  <Cell>{seller.address}</Cell>
                  <Cell>
                    <StatusBadge status={seller.status} />
                  </Cell>
                  <Cell className={seller.deleted ? "text-danger" : "text-primary"}>
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      {seller.deleted ? <EyeOff size={15} /> : <Eye size={15} />}
                      {seller.deleted ? "ซ่อนอยู่" : "แสดงอยู่"}
                    </span>
                  </Cell>
                  <Cell>
                    <div className="flex flex-wrap gap-2">
                      {seller.status !== "approved" ? (
                        <Button
                          size="sm"
                          onClick={() => void review(seller.userId, "approved")}
                        >
                          อนุมัติ
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void review(seller.userId, "suspended")}
                        >
                          ระงับ
                        </Button>
                      )}
                      {seller.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void review(seller.userId, "rejected")}
                        >
                          ปฏิเสธ
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void setDeleted(seller.userId, !seller.deleted)
                        }
                      >
                        {seller.deleted ? "คืนค่า" : "ซ่อนสวน"}
                      </Button>
                    </div>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีสวนในระบบ
            </p>
          )
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}
