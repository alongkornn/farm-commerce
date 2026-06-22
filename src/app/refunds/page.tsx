"use client";

import { AccountShell } from "@/components/layout/account-shell";
import { Cell, DataTable } from "@/components/ui/data-table";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import type { Refund } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function RefundsPage() {
  const resource = useApiResource<Refund[]>("/refunds", []);
  return (
    <AccountShell
      title="การคืนเงิน"
      description="ติดตามคำขอคืนเงินของคุณ"
    >
      <AuthGuard roles={["buyer"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={["คำสั่งซื้อ", "เหตุผล", "ยอดเงิน", "วันที่", "สถานะ"]}
            >
              {resource.data.map((refund) => (
                <tr key={refund.id}>
                  <Cell className="font-bold">
                    {refund.orderId.slice(0, 8)}
                  </Cell>
                  <Cell>{refund.reason}</Cell>
                  <Cell>{formatMoney(refund.amountSatang)}</Cell>
                  <Cell>{formatDateTime(refund.createdAt)}</Cell>
                  <Cell>
                    <StatusBadge status={refund.status} />
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
    </AccountShell>
  );
}
