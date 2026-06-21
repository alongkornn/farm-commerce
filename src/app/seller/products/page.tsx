import { Plus } from "lucide-react";
import { OperationsShell } from "@/components/layout/operations-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { RowActions } from "@/components/ui/row-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockProducts } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export default function SellerProductsPage() {
  return (
    <OperationsShell mode="seller" title="สินค้า" description="เพิ่ม แก้ไข และควบคุมสถานะสินค้าที่แสดงในหน้าร้าน" actions={<ActionButton message="เปิดแบบฟอร์มเพิ่มสินค้า"><Plus size={18} />เพิ่มสินค้า</ActionButton>}>
      <DataTable headers={["สินค้า", "SKU", "ราคา", "คงเหลือ", "สถานะ", ""]}>
        {mockProducts.filter((item) => item.sellerId === "s-1").map((product) => (
          <tr key={product.id}>
            <Cell><p className="font-bold">{product.name}</p><p className="text-xs text-muted">{product.category} · {product.size}</p></Cell>
            <Cell className="font-mono text-xs">{product.sku}</Cell>
            <Cell className="font-bold">{formatMoney(product.priceSatang)}</Cell>
            <Cell>{product.stock}</Cell>
            <Cell><StatusBadge status={product.active ? "confirmed" : "cancelled"} /></Cell>
            <Cell><RowActions subject={product.name} /></Cell>
          </tr>
        ))}
      </DataTable>
    </OperationsShell>
  );
}
