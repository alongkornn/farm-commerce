import { CreditCard, MapPin } from "lucide-react";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAddresses, mockCartItems } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export default function CheckoutPage() {
  const address = mockAddresses[0];
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.product.priceSatang * item.quantity, 0);
  return (
    <AccountShell title="ยืนยันคำสั่งซื้อ" description="ตรวจสอบที่อยู่ รายการสินค้า และยอดชำระ">
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-6">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><MapPin size={20} className="text-primary" />ที่อยู่จัดส่ง</h2>
            <label className="mt-4 flex cursor-pointer gap-3 rounded-md border border-primary bg-surface-muted p-4">
              <input type="radio" defaultChecked name="address" className="accent-primary" />
              <span className="text-sm leading-6">
                <strong>{address.label} · {address.recipient}</strong><br />
                <span className="text-muted">{address.line1} {address.subdistrict} {address.district} {address.province} {address.postalCode}<br />{address.phone}</span>
              </span>
            </label>
          </section>
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><CreditCard size={20} className="text-primary" />ส่วนลดและการชำระเงิน</h2>
            <div className="mt-4 flex gap-2">
              <Input placeholder="รหัสคูปอง" />
              <Button variant="outline">ใช้คูปอง</Button>
            </div>
            <p className="mt-4 rounded-md bg-surface-muted p-4 text-sm text-muted">ระบบจะสร้างคำสั่งซื้อและนำคุณไปยังช่องทางชำระเงินที่รองรับ</p>
          </section>
        </div>
        <aside className="h-fit rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-extrabold">ยอดชำระ</h2>
          <p className="mt-5 flex justify-between text-sm"><span className="text-muted">สินค้า</span><strong>{formatMoney(subtotal)}</strong></p>
          <p className="mt-3 flex justify-between text-sm"><span className="text-muted">ค่าจัดส่ง</span><strong>{formatMoney(4000)}</strong></p>
          <p className="mt-5 flex justify-between border-t border-border pt-5"><span className="font-bold">รวมทั้งหมด</span><strong className="font-display text-xl text-primary">{formatMoney(subtotal + 4000)}</strong></p>
          <Button size="lg" className="mt-5 w-full">ยืนยันและชำระเงิน</Button>
        </aside>
      </div>
    </AccountShell>
  );
}
