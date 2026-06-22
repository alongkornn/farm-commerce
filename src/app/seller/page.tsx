"use client";

import { CalendarCheck, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import type { DashboardSummary } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export default function SellerDashboardPage() {
  const resource = useApiResource<DashboardSummary>("/seller/dashboard", {
    period: "day",
    visitorCount: 0,
    orderCount: 0,
    revenueSatang: 0,
    pendingBooking: 0,
    pendingOrder: 0,
  });

  return (
    <OperationsShell
      mode="seller"
      title="ภาพรวมสวน"
      description="ข้อมูลจากระบบตามช่วงเวลาปัจจุบัน"
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={ShoppingBag}
              label="รายได้"
              value={formatMoney(resource.data.revenueSatang)}
            />
            <Metric
              icon={Package}
              label="คำสั่งซื้อทั้งหมด"
              value={String(resource.data.orderCount)}
            />
            <Metric
              icon={CalendarCheck}
              label="ผู้เข้าชมสวน"
              value={String(resource.data.visitorCount)}
            />
            <Metric
              icon={TrendingUp}
              label="งานที่รอดำเนินการ"
              value={String(
                resource.data.pendingOrder + resource.data.pendingBooking,
              )}
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
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Icon size={20} className="text-primary" />
      <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
