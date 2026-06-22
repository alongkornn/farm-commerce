"use client";

import { OperationsShell } from "@/components/layout/operations-shell";
import { Cell, DataTable } from "@/components/ui/data-table";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import type { Payout } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function SellerPayoutsPage() {
  const resource = useApiResource<Payout[]>("/seller/payouts", []);
  return (
    <OperationsShell
      mode="seller"
      title="รายรับและการจ่ายเงิน"
      description="รายการยอดสุทธิที่ระบบจ่ายให้สวน"
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={[
                "วันที่",
                "ยอดขาย",
                "ค่าธรรมเนียม",
                "ยอดสุทธิ",
                "สถานะ",
              ]}
            >
              {resource.data.map((payout) => (
                <tr key={payout.id}>
                  <Cell>{formatDateTime(payout.createdAt)}</Cell>
                  <Cell>{formatMoney(payout.grossSatang)}</Cell>
                  <Cell>{formatMoney(payout.feeSatang)}</Cell>
                  <Cell className="font-bold">
                    {formatMoney(payout.netSatang)}
                  </Cell>
                  <Cell>
                    <StatusBadge status={payout.status} />
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีรายการจ่ายเงิน
            </p>
          )
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}
