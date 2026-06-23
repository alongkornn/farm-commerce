import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  active: "ใช้งานอยู่",
  pending: "รอตรวจสอบ",
  processing: "กำลังเตรียม",
  confirmed: "ยืนยันแล้ว",
  approved: "ยืนยันแล้ว",
  shipped: "จัดส่งแล้ว",
  delivered: "สำเร็จ",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
  rejected: "ไม่อนุมัติ",
  suspended: "ระงับ",
  refunded: "คืนเงินแล้ว",
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed" ||
    status === "delivered" ||
    status === "confirmed" ||
    status === "approved"
      ? "success"
      : status === "cancelled" || status === "rejected"
        ? "danger"
        : status === "shipped"
          ? "info"
          : "warning";
  return <Badge tone={tone}>{labels[status] ?? status}</Badge>;
}
