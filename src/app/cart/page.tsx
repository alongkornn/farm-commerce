import { AccountShell } from "@/components/layout/account-shell";
import { CartContent } from "@/features/commerce/cart-content";
import { AuthGuard } from "@/features/auth/auth-guard";

export default function CartPage() {
  return (
    <AccountShell
      title="ตะกร้าสินค้า"
      description="ตรวจสอบจำนวนและราคาก่อนดำเนินการสั่งซื้อ"
    >
      <AuthGuard roles={["buyer"]}>
        <CartContent />
      </AuthGuard>
    </AccountShell>
  );
}
