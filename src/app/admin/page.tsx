"use client";

import { RefreshCcw, Store, TicketPercent } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import type { Coupon, Refund, SellerProfile } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

export default function AdminDashboardPage() {
  const sellers = useApiResource<SellerProfile[]>(
    "/admin/sellers/pending",
    [],
  );
  const refunds = useApiResource<Refund[]>("/admin/refunds", []);
  const coupons = useApiResource<Coupon[]>("/admin/coupons", []);
  const loading = sellers.loading || refunds.loading || coupons.loading;
  const error = sellers.error || refunds.error || coupons.error;
  return (
    <OperationsShell
      mode="admin"
      title="ภาพรวมระบบ"
      description="ข้อมูลเฉพาะ endpoint ที่ backend รองรับ"
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState
          loading={loading}
          error={error}
          onRetry={() => {
            void sellers.reload();
            void refunds.reload();
            void coupons.reload();
          }}
        />
        {!loading && !error ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric
              icon={Store}
              label="สวนรอตรวจสอบ"
              value={sellers.data.length}
            />
            <Metric
              icon={RefreshCcw}
              label="คำขอคืนเงิน"
              value={refunds.data.length}
            />
            <Metric
              icon={TicketPercent}
              label="คูปอง"
              value={coupons.data.length}
            />
          </div>
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Icon size={21} className="text-primary" />
      <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
