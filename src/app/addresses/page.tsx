import { AccountShell } from "@/components/layout/account-shell";
import { AddressManager } from "@/features/account/address-manager";

export default function AddressesPage() {
  return (
    <AccountShell
      title="ที่อยู่จัดส่ง"
      description="เพิ่มและจัดการที่อยู่สำหรับใช้ตอนสั่งซื้อ"
    >
      <AddressManager />
    </AccountShell>
  );
}
