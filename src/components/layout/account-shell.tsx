"use client";

import {
  Bell,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MapPinHouse,
  Package,
  Settings,
  ShoppingBasket,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreShell } from "@/components/layout/store-shell";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/orders", label: "คำสั่งซื้อ", icon: Package },
  { href: "/bookings", label: "การจอง", icon: CalendarCheck },
  { href: "/cart", label: "ตะกร้า", icon: ShoppingBasket },
  { href: "/favorites", label: "รายการโปรด", icon: Heart },
  { href: "/addresses", label: "ที่อยู่", icon: MapPinHouse },
  { href: "/notifications", label: "การแจ้งเตือน", icon: Bell },
  { href: "/refunds", label: "การคืนเงิน", icon: RotateCcw },
  { href: "/account/settings", label: "ตั้งค่าบัญชี", icon: Settings },
];

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <StoreShell>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="scrollbar-none flex gap-1 overflow-x-auto lg:sticky lg:top-24 lg:grid">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/account" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "focus-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-bold text-muted hover:bg-surface-muted",
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
        <section className="min-w-0">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            ) : null}
          </div>
          {children}
        </section>
      </div>
    </StoreShell>
  );
}
