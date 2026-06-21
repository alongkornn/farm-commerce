import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  pending: "รอตรวจสอบ",
  processing: "กำลังเตรียม",
  confirmed: "ยืนยันแล้ว",
  shipped: "จัดส่งแล้ว",
  delivered: "สำเร็จ",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
  rejected: "ไม่อนุมัติ",
  refunded: "คืนเงินแล้ว",
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed" || status === "delivered" || status === "confirmed"
      ? "success"
      : status === "cancelled" || status === "rejected"
        ? "danger"
        : status === "shipped"
          ? "info"
          : "warning";
  return <Badge tone={tone}>{labels[status] ?? status}</Badge>;
}
