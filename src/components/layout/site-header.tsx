"use client";

import {
  Bell,
  Heart,
  Leaf,
  LogIn,
  Menu,
  Search,
  ShoppingBasket,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { href: "/products", label: "สินค้าทั้งหมด" },
  { href: "/farms", label: "สวนที่น่าสนใจ" },
  { href: "/visits", label: "เที่ยวชมสวน" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, hydrated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardHref =
    user?.userType === "seller"
      ? "/seller"
      : user?.userType === "admin"
        ? "/admin"
        : "/account";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link
          href="/"
          className="focus-ring flex shrink-0 items-center gap-2 rounded-md"
          aria-label="Farm Commerce"
        >
          <span className="grid size-9 place-items-center rounded-md bg-primary text-white">
            <Leaf size={20} strokeWidth={2.4} />
          </span>
          <span className="hidden font-display text-lg font-extrabold sm:block">
            Farm Commerce
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded-md px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground",
                pathname.startsWith(link.href) &&
                  "bg-surface-muted text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/products"
            className="focus-ring grid size-10 place-items-center rounded-md hover:bg-surface-muted"
            aria-label="ค้นหาสินค้า"
          >
            <Search size={20} />
          </Link>
          {user?.userType === "buyer" ? (
            <>
              <Link
                href="/favorites"
                className="focus-ring hidden size-10 place-items-center rounded-md hover:bg-surface-muted sm:grid"
                aria-label="รายการโปรด"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/notifications"
                className="focus-ring hidden size-10 place-items-center rounded-md hover:bg-surface-muted sm:grid"
                aria-label="การแจ้งเตือน"
              >
                <Bell size={20} />
              </Link>
              <Link
                href="/cart"
                className="focus-ring grid size-10 place-items-center rounded-md hover:bg-surface-muted"
                aria-label="ตะกร้าสินค้า"
              >
                <ShoppingBasket size={21} />
              </Link>
            </>
          ) : null}

          {hydrated && user ? (
            <Link href={dashboardHref} className="ml-1 hidden sm:block">
              <Button variant="outline" size="sm">
                <UserRound size={17} />
                {user.firstName}
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="ml-1 hidden sm:block">
              <Button size="sm">
                <LogIn size={17} />
                เข้าสู่ระบบ
              </Button>
            </Link>
          )}

          <button
            className="focus-ring grid size-10 place-items-center rounded-md hover:bg-surface-muted lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="เปิดเมนู"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="container-page grid gap-1 border-t border-border py-3 lg:hidden">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-semibold hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? dashboardHref : "/login"}
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-semibold text-primary hover:bg-surface-muted"
          >
            {user ? "ไปยังบัญชีของฉัน" : "เข้าสู่ระบบ / สมัครสมาชิก"}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
