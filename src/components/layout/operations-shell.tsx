"use client";

import {
  BadgeDollarSign,
  Banknote,
  CalendarClock,
  CalendarX2,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  RefreshCcw,
  Settings,
  ShoppingBag,
  Store,
  TicketPercent,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

const sellerLinks = [
  { href: "/seller", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/seller/products", label: "สินค้า", icon: Package },
  { href: "/seller/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
  { href: "/seller/bookings", label: "ผู้เข้าชม", icon: ClipboardCheck },
  { href: "/seller/visit-slots", label: "รอบเข้าชม", icon: CalendarClock },
  { href: "/seller/closures", label: "วันปิดสวน", icon: CalendarX2 },
  { href: "/seller/payouts", label: "รายรับ", icon: Banknote },
  { href: "/seller/settings", label: "ข้อมูลสวน", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "ตรวจสอบสวน", icon: Store },
  { href: "/admin/refunds", label: "คืนเงิน", icon: RefreshCcw },
  { href: "/admin/coupons", label: "คูปอง", icon: TicketPercent },
  { href: "/admin/payouts", label: "รอบจ่ายเงิน", icon: BadgeDollarSign },
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: UsersRound },
];

export function OperationsShell({
  mode,
  title,
  description,
  actions,
  children,
}: {
  mode: "seller" | "admin";
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = mode === "seller" ? sellerLinks : adminLinks;

  return (
    <div className="min-h-screen bg-[#f4f6f1]">
      <SiteHeader />
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-6 py-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside>
          <div className="mb-3 hidden px-3 text-xs font-extrabold uppercase text-muted lg:block">
            {mode === "seller" ? "จัดการสวน" : "ผู้ดูแลระบบ"}
          </div>
          <nav className="scrollbar-none flex gap-1 overflow-x-auto lg:sticky lg:top-24 lg:grid">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === `/${mode}` ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "focus-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-bold text-muted hover:bg-surface",
                    active && "bg-primary text-white hover:bg-primary hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
              {description ? (
                <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
