import { MapPin, Plus, Star } from "lucide-react";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { mockAddresses } from "@/lib/mock-data";

export default function AddressesPage() {
  return (
    <AccountShell title="ที่อยู่จัดส่ง" description="เพิ่มและจัดการที่อยู่สำหรับใช้ตอนสั่งซื้อ">
      <div className="mb-5 flex justify-end"><Button><Plus size={18} />เพิ่มที่อยู่</Button></div>
      <div className="grid gap-4 md:grid-cols-2">
        {mockAddresses.map((address) => (
          <article key={address.id} className="rounded-lg border border-primary bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="flex items-center gap-2 font-extrabold"><MapPin size={18} className="text-primary" />{address.label}</h2>
              {address.isDefault ? <span className="flex items-center gap-1 text-xs font-bold text-primary"><Star size={14} fill="currentColor" />ค่าเริ่มต้น</span> : null}
            </div>
            <p className="mt-4 text-sm font-bold">{address.recipient} · {address.phone}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{address.line1} {address.subdistrict} {address.district} {address.province} {address.postalCode}</p>
            <div className="mt-4 flex gap-2"><Button size="sm" variant="outline">แก้ไข</Button><Button size="sm" variant="ghost" className="text-danger">ลบ</Button></div>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
