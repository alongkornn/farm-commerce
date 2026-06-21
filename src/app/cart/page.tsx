import { AccountShell } from "@/components/layout/account-shell";
import { CartContent } from "@/features/commerce/cart-content";

export default function CartPage() {
  return (
    <AccountShell
      title="ตะกร้าสินค้า"
      description="ตรวจสอบจำนวนและราคาก่อนดำเนินการสั่งซื้อ"
    >
      <CartContent />
    </AccountShell>
  );
}
