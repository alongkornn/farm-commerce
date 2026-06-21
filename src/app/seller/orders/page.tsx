import { OperationsShell } from "@/components/layout/operations-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockOrders } from "@/lib/mock-data";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function SellerOrdersPage() {
  return (
    <OperationsShell mode="seller" title="คำสั่งซื้อ" description="อัปเดตสถานะการเตรียมสินค้าและข้อมูลจัดส่ง">
      <DataTable headers={["เลขที่", "ลูกค้า", "วันที่", "ยอดรวม", "สถานะ", "ดำเนินการ"]}>
        {mockOrders.map((order) => <tr key={order.id}><Cell className="font-bold">{order.id}</Cell><Cell>{order.recipientName}</Cell><Cell className="text-muted">{formatDateTime(order.createdAt)}</Cell><Cell className="font-bold">{formatMoney(order.totalSatang)}</Cell><Cell><StatusBadge status={order.status} /></Cell><Cell><ActionButton message={`อัปเดตสถานะ ${order.id} แล้ว`} size="sm" variant="outline">อัปเดตสถานะ</ActionButton></Cell></tr>)}
      </DataTable>
    </OperationsShell>
  );
}
