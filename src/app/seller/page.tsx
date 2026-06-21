import { CalendarCheck, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockOrders, mockProducts } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

const chart = [32, 48, 39, 66, 54, 78, 70];

export default function SellerDashboardPage() {
  return (
    <OperationsShell mode="seller" title="ภาพรวมสวนลุงพร" description="ข้อมูลการขายและผู้เข้าชมในช่วง 7 วันที่ผ่านมา">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ShoppingBag} label="ยอดขาย" value="฿18,450" change="+12.4%" />
        <Metric icon={Package} label="คำสั่งซื้อ" value="36" change="+8.1%" />
        <Metric icon={CalendarCheck} label="ผู้เข้าชมสวน" value="84" change="+16.2%" />
        <Metric icon={TrendingUp} label="มูลค่าเฉลี่ยต่อออเดอร์" value="฿512" change="+3.7%" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between"><h2 className="font-extrabold">ยอดขายรายวัน</h2><span className="text-xs text-muted">7 วันล่าสุด</span></div>
          <div className="mt-8 flex h-52 items-end gap-3 border-b border-border px-2">
            {chart.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-12 rounded-t bg-primary" style={{ height: `${value}%` }} /><span className="text-[10px] text-muted">{index + 15} มิ.ย.</span></div>)}
          </div>
        </section>
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-extrabold">สินค้าคงเหลือน้อย</h2>
          <div className="mt-4 divide-y divide-border">
            {mockProducts.slice(0, 3).map((product) => <div key={product.id} className="flex items-center justify-between py-3 text-sm"><div><p className="font-bold">{product.name}</p><p className="text-xs text-muted">{product.sku}</p></div><strong className={product.stock < 20 ? "text-danger" : "text-primary"}>{product.stock} ชิ้น</strong></div>)}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-extrabold">คำสั่งซื้อล่าสุด</h2>
        {mockOrders.map((order) => <div key={order.id} className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm"><div><p className="font-bold">{order.id}</p><p className="text-xs text-muted">{order.recipientName}</p></div><StatusBadge status={order.status} /><strong>{formatMoney(order.totalSatang)}</strong></div>)}
      </section>
    </OperationsShell>
  );
}

function Metric({ icon: Icon, label, value, change }: { icon: typeof Package; label: string; value: string; change: string }) {
  return <div className="rounded-lg border border-border bg-surface p-5"><div className="flex items-center justify-between"><Icon size={20} className="text-primary" /><span className="text-xs font-bold text-primary">{change}</span></div><p className="mt-4 font-display text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs text-muted">{label}</p></div>;
}
