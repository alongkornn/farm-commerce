import { Leaf } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-[#edf1e9] pb-20 md:pb-0">
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-white">
              <Leaf size={18} />
            </span>
            Farm Commerce
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            ตลาดที่เชื่อมผู้ซื้อกับสวนโดยตรง ทั้งผลไม้สด การสั่งซื้อ
            และประสบการณ์เที่ยวชมสวนในที่เดียว
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">เลือกซื้อและเยี่ยมชม</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <Link href="/products">สินค้าทั้งหมด</Link>
            <Link href="/farms">สวนทั้งหมด</Link>
            <Link href="/visits">รอบเที่ยวชมสวน</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold">สำหรับผู้ใช้งาน</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <Link href="/register?role=buyer">สมัครเป็นผู้ซื้อ</Link>
            <Link href="/register?role=seller">สมัครเป็นเจ้าของสวน</Link>
            <Link href="/login">เข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-4 text-xs text-muted">
          © {new Date().getFullYear()} Farm Commerce
        </div>
      </div>
    </footer>
  );
}
