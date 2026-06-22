"use client";

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
  const resource = useApiResource<SellerProfile[]>("/admin/sellers/pending", []);

  async function review(id: string, status: string) {
    try {
      await request(`/admin/sellers/${id}/status`, {
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

  return (
    <OperationsShell
      mode="admin"
      title="ตรวจสอบสวน"
      description="รายการสวนที่รอการอนุมัติ"
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable headers={["ชื่อสวน", "ที่อยู่", "สถานะ", "ดำเนินการ"]}>
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
                  <Cell className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => void review(seller.id, "approved")}
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void review(seller.id, "rejected")}
                    >
                      ปฏิเสธ
                    </Button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ไม่มีสวนรอตรวจสอบ
            </p>
          )
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}
