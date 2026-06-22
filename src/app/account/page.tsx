"use client";

import { CalendarCheck, Package, ShoppingBasket } from "lucide-react";
import { AccountShell } from "@/components/layout/account-shell";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import { useCommerce } from "@/features/commerce/commerce-provider";
import type { Booking, Order, User } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

export default function AccountPage() {
  const { user } = useAuth();
  const { cart } = useCommerce();
  const orders = useApiResource<Order[]>("/orders", []);
  const bookings = useApiResource<Booking[]>("/bookings", []);
  const profile = useApiResource<User>("/account/profile", {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    userType: "buyer",
    verified: false,
    status: "",
  });

  return (
    <AccountShell
      title={`สวัสดี ${profile.data.firstName || user?.firstName || ""}`}
      description="ติดตามรายการล่าสุดและจัดการข้อมูลของคุณจากหน้านี้"
    >
      <AuthGuard roles={["buyer"]}>
        <ResourceState
          loading={orders.loading || bookings.loading || profile.loading}
          error={orders.error || bookings.error || profile.error}
          onRetry={() => {
            void orders.reload();
            void bookings.reload();
            void profile.reload();
          }}
        />
        {!orders.loading &&
        !bookings.loading &&
        !profile.loading &&
        !orders.error &&
        !bookings.error &&
        !profile.error ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Summary
              icon={Package}
              label="คำสั่งซื้อทั้งหมด"
              value={String(orders.data.length)}
            />
            <Summary
              icon={CalendarCheck}
              label="การจองทั้งหมด"
              value={String(bookings.data.length)}
            />
            <Summary
              icon={ShoppingBasket}
              label="สินค้าในตะกร้า"
              value={String(
                cart.reduce((sum, item) => sum + item.quantity, 0),
              )}
            />
          </div>
        ) : null}
      </AuthGuard>
    </AccountShell>
  );
}

function Summary({
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
      <Icon size={21} className="text-primary" />
      <p className="mt-4 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{label}</p>
    </div>
  );
}
