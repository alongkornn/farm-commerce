"use client";

import {
  CalendarDays,
  Home,
  LayoutDashboard,
  PackageSearch,
  ShoppingBasket,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartCount } = useCommerce();
  const dashboardHref =
    user?.userType === "seller"
      ? "/seller"
      : user?.userType === "admin"
        ? "/admin"
        : "/account";

  const items =
    user?.userType === "seller" || user?.userType === "admin"
      ? [
          { href: "/", label: "หน้าหลัก", icon: Home },
          {
            href: dashboardHref,
            label: "แดชบอร์ด",
            icon: LayoutDashboard,
          },
          { href: "/account", label: "บัญชี", icon: UserRound },
        ]
      : [
          { href: "/", label: "หน้าหลัก", icon: Home },
          { href: "/products", label: "สินค้า", icon: PackageSearch },
          { href: "/visits", label: "เที่ยวสวน", icon: CalendarDays },
          { href: "/cart", label: "ตะกร้า", icon: ShoppingBasket },
          { href: dashboardHref, label: "บัญชี", icon: UserRound },
        ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "focus-ring flex min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted",
                active && "text-primary",
              )}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {href === "/cart" && cartCount > 0 ? (
                  <span className="absolute -right-3 -top-2 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-surface">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </span>
              <span className="max-w-full truncate px-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
