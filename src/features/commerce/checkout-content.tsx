"use client";

import { CreditCard, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { useAuth } from "@/features/auth/auth-provider";
import { useCommerce } from "@/features/commerce/commerce-provider";
import type {
  Address,
  ApiEnvelope,
  CheckoutResponse,
  ShippingQuote,
} from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export function CheckoutContent() {
  const router = useRouter();
  const { request } = useAuth();
  const { cart, reload } = useCommerce();
  const addresses = useApiResource<Address[]>("/addresses", []);
  const shippingQuote = useApiResource<ShippingQuote>(
    "/orders/shipping-quote",
    { totalWeightKg: 0, shippingFeeSatang: 0, items: [] },
  );
  const [addressId, setAddressId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.priceSatang * item.quantity,
    0,
  );
  const selectedAddress =
    addressId ||
    addresses.data.find((address) => address.isDefault)?.id ||
    addresses.data[0]?.id ||
    "";

  async function confirmOrder() {
    setSubmitting(true);
    try {
      const response = await request<ApiEnvelope<CheckoutResponse>>(
        "/orders/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            addressId: selectedAddress,
            idempotencyKey: crypto.randomUUID(),
            couponCode: couponCode.trim(),
          }),
        },
      );
      await reload();
      toast.success(
        response.data.paymentNumber
          ? `สร้างรายการชำระเงิน ${response.data.paymentNumber} แล้ว`
          : "สร้างคำสั่งซื้อสำเร็จ",
      );
      router.push("/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "สร้างคำสั่งซื้อไม่สำเร็จ",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <MapPin size={20} className="text-primary" />
            ที่อยู่จัดส่ง
          </h2>
          <ResourceState {...addresses} onRetry={addresses.reload} />
          {!addresses.loading && !addresses.error ? (
            <div className="mt-4 grid gap-3">
              {addresses.data.map((address) => (
                <label
                  key={address.id}
                  className="flex cursor-pointer gap-3 rounded-md border border-border p-4 has-checked:border-primary has-checked:bg-surface-muted"
                >
                  <input
                    type="radio"
                    checked={selectedAddress === address.id}
                    onChange={() => setAddressId(address.id)}
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
                    </span>
                  </span>
                </label>
              ))}
              {!addresses.data.length ? (
                <p className="text-sm text-muted">
                  ยังไม่มีที่อยู่ กรุณาเพิ่มที่หน้าที่อยู่จัดส่ง
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <CreditCard size={20} className="text-primary" />
            คูปองและการชำระเงิน
          </h2>
          <Input
            className="mt-4"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="รหัสคูปอง (ถ้ามี)"
          />
          <p className="mt-4 rounded-md bg-surface-muted p-4 text-sm text-muted">
            Backend จะตรวจคูปองและสร้างรายการชำระเงินเมื่อยืนยัน
          </p>
        </section>
      </div>
      <aside className="h-fit rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-extrabold">ยอดชำระโดยประมาณ</h2>
        <p className="mt-5 flex items-start justify-between gap-4 text-sm">
          <span className="text-muted">สินค้า</span>
          <strong>{formatMoney(subtotal)}</strong>
        </p>
        <p className="mt-3 flex items-start justify-between gap-4 text-sm">
          <span className="text-muted">
            ค่าจัดส่ง ({shippingQuote.data.totalWeightKg.toFixed(3)} กก.)
          </span>
          <strong className="text-right">{formatMoney(shippingQuote.data.shippingFeeSatang)}</strong>
        </p>
        <ResourceState
          loading={shippingQuote.loading}
          error={shippingQuote.error}
          onRetry={shippingQuote.reload}
        />
        {!shippingQuote.loading && !shippingQuote.error ? (
          <p className="mt-5 flex items-start justify-between gap-4 border-t border-border pt-5">
            <span className="font-bold">ยอดรวม</span>
            <strong className="font-display text-right text-xl text-primary">
              {formatMoney(subtotal + shippingQuote.data.shippingFeeSatang)}
            </strong>
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-muted">
          ระบบคิดค่าจัดส่งแยกตามน้ำหนักสินค้ารวมของแต่ละสวน
          ส่วนลดจะตรวจสอบอีกครั้งเมื่อยืนยัน
        </p>
        <Button
          size="lg"
          className="mt-5 w-full"
          disabled={
            submitting ||
            shippingQuote.loading ||
            Boolean(shippingQuote.error) ||
            !cart.length ||
            !selectedAddress
          }
          onClick={confirmOrder}
        >
          {submitting ? "กำลังสร้างคำสั่งซื้อ..." : "ยืนยันคำสั่งซื้อ"}
        </Button>
      </aside>
    </div>
  );
}
