"use client";

import { CheckCircle2, CreditCard, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { mockAddresses } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart } = useCommerce();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const address = mockAddresses[0];
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.priceSatang * item.quantity,
    0,
  );
  const shipping = cart.length ? 4000 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "FRESH100") {
      setDiscount(10000);
      toast.success("ใช้คูปอง FRESH100 สำเร็จ");
    } else {
      setDiscount(0);
      toast.error("ไม่พบคูปองนี้ ลองใช้ FRESH100");
    }
  }

  async function confirmOrder() {
    if (!cart.length) {
      toast.error("ไม่มีสินค้าในตะกร้า");
      router.push("/products");
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    clearCart();
    toast.success("สร้างคำสั่งซื้อสำเร็จ");
    router.push("/orders");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <MapPin size={20} className="text-primary" />
            ที่อยู่จัดส่ง
          </h2>
          <label className="mt-4 flex cursor-pointer gap-3 rounded-md border border-primary bg-surface-muted p-4">
            <input
              type="radio"
              defaultChecked
              name="address"
              className="accent-primary"
            />
            <span className="text-sm leading-6">
              <strong>
                {address.label} · {address.recipient}
              </strong>
              <br />
              <span className="text-muted">
                {address.line1} {address.subdistrict} {address.district}{" "}
                {address.province} {address.postalCode}
                <br />
                {address.phone}
              </span>
            </span>
          </label>
        </section>
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <CreditCard size={20} className="text-primary" />
            ส่วนลดและการชำระเงิน
          </h2>
          <div className="mt-4 flex gap-2">
            <Input
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder="รหัสคูปอง"
            />
            <Button variant="outline" onClick={applyCoupon}>
              ใช้คูปอง
            </Button>
          </div>
          {discount ? (
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-primary">
              <CheckCircle2 size={17} />
              ลดเพิ่ม {formatMoney(discount)}
            </p>
          ) : null}
          <p className="mt-4 rounded-md bg-surface-muted p-4 text-sm text-muted">
            ในโหมด local ระบบจะจำลองการสร้างคำสั่งซื้อโดยไม่เรียกเก็บเงินจริง
          </p>
        </section>
      </div>
      <aside className="h-fit rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-extrabold">ยอดชำระ</h2>
        <p className="mt-5 flex justify-between text-sm">
          <span className="text-muted">สินค้า</span>
          <strong>{formatMoney(subtotal)}</strong>
        </p>
        <p className="mt-3 flex justify-between text-sm">
          <span className="text-muted">ค่าจัดส่ง</span>
          <strong>{formatMoney(shipping)}</strong>
        </p>
        {discount ? (
          <p className="mt-3 flex justify-between text-sm text-primary">
            <span>ส่วนลด</span>
            <strong>-{formatMoney(discount)}</strong>
          </p>
        ) : null}
        <p className="mt-5 flex justify-between border-t border-border pt-5">
          <span className="font-bold">รวมทั้งหมด</span>
          <strong className="font-display text-xl text-primary">
            {formatMoney(total)}
          </strong>
        </p>
        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={submitting || !cart.length}
          onClick={confirmOrder}
        >
          {submitting ? "กำลังสร้างคำสั่งซื้อ..." : "ยืนยันและชำระเงิน"}
        </Button>
      </aside>
    </div>
  );
}
