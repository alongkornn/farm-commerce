import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <MobileNav />
    </div>
  );
}
