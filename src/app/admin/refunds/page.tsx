"use client";

import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { Refund } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export default function AdminRefundsPage() {
  const { request } = useAuth();
  const resource = useApiResource<Refund[]>("/admin/refunds", []);
  async function review(id: string, status: string) {
    try {
      await request(`/admin/refunds/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await resource.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ",
      );
    }
  }
  return (
    <OperationsShell
      mode="admin"
      title="คำขอคืนเงิน"
      description="ตรวจสอบและอัปเดตผลการพิจารณา"
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={["คำสั่งซื้อ", "เหตุผล", "ยอดเงิน", "สถานะ", ""]}
            >
              {resource.data.map((refund) => (
                <tr key={refund.id}>
                  <Cell className="font-bold">
                    {refund.orderId.slice(0, 8)}
                  </Cell>
                  <Cell>{refund.reason}</Cell>
                  <Cell>{formatMoney(refund.amountSatang)}</Cell>
                  <Cell>
                    <StatusBadge status={refund.status} />
                  </Cell>
                  <Cell className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => void review(refund.id, "approved")}
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void review(refund.id, "rejected")}
                    >
                      ปฏิเสธ
                    </Button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ไม่มีคำขอคืนเงิน
            </p>
          )
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}
