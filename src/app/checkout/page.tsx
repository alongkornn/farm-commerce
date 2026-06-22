import { AccountShell } from "@/components/layout/account-shell";
import { CheckoutContent } from "@/features/commerce/checkout-content";
import { AuthGuard } from "@/features/auth/auth-guard";

export default function CheckoutPage() {
  return (
    <AccountShell
      title="ยืนยันคำสั่งซื้อ"
      description="ตรวจสอบที่อยู่ รายการสินค้า และยอดชำระ"
    >
      <AuthGuard roles={["buyer"]}>
        <CheckoutContent />
      </AuthGuard>
    </AccountShell>
  );
}
