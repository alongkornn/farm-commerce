import { ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { mockCartItems } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const subtotal = mockCartItems.reduce(
    (sum, item) => sum + item.product.priceSatang * item.quantity,
    0,
  );
  const shipping = 4000;
  return (
    <AccountShell title="ตะกร้าสินค้า" description="ตรวจสอบจำนวนและราคาก่อนดำเนินการสั่งซื้อ">
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="divide-y divide-border rounded-lg border border-border bg-surface">
          {mockCartItems.map((item, index) => (
            <div key={item.id} className="flex gap-4 p-4">
              <div className={`grid size-20 shrink-0 place-items-center rounded-md ${index ? "bg-[#cfe0aa]" : "bg-[#f1d880]"}`}>
                <ImageIcon size={25} className="text-foreground/40" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.product.name}</p>
                    <p className="mt-1 text-xs text-muted">{item.product.size}</p>
                  </div>
                  <button aria-label="นำสินค้าออก" className="self-start text-muted hover:text-danger">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button className="grid size-8 place-items-center" aria-label="ลดจำนวน"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="grid size-8 place-items-center" aria-label="เพิ่มจำนวน"><Plus size={14} /></button>
                  </div>
                  <p className="font-display font-extrabold text-primary">
                    {formatMoney(item.product.priceSatang * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-border bg-surface p-5 xl:sticky xl:top-24">
          <h2 className="text-lg font-extrabold">สรุปคำสั่งซื้อ</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <p className="flex justify-between"><span className="text-muted">ราคาสินค้า</span><strong>{formatMoney(subtotal)}</strong></p>
            <p className="flex justify-between"><span className="text-muted">ค่าจัดส่งโดยประมาณ</span><strong>{formatMoney(shipping)}</strong></p>
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-5">
            <span className="font-bold">ยอดรวม</span>
            <strong className="font-display text-xl text-primary">{formatMoney(subtotal + shipping)}</strong>
          </div>
          <Link href="/checkout" className="mt-5 block">
            <Button size="lg" className="w-full">ดำเนินการชำระเงิน</Button>
          </Link>
        </aside>
      </div>
    </AccountShell>
  );
}
