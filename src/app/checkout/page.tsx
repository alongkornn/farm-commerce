import { AccountShell } from "@/components/layout/account-shell";
import { CheckoutContent } from "@/features/commerce/checkout-content";

export default function CheckoutPage() {
  return (
    <AccountShell
      title="ยืนยันคำสั่งซื้อ"
      description="ตรวจสอบที่อยู่ รายการสินค้า และยอดชำระ"
    >
      <CheckoutContent />
    </AccountShell>
  );
}
