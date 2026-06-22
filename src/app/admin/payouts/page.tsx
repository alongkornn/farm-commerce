"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { ApiEnvelope, Payout } from "@/lib/types";

export default function AdminPayoutsPage() {
  const { request } = useAuth();
  const [result, setResult] = useState<Payout[]>([]);
  const [running, setRunning] = useState(false);
  return (
    <OperationsShell
      mode="admin"
      title="รอบจ่ายเงิน"
      description="สร้าง payout จากคำสั่งซื้อที่เข้าเงื่อนไข"
      actions={
        <Button
          disabled={running}
          onClick={async () => {
            setRunning(true);
            try {
              const response = await request<ApiEnvelope<Payout[]>>(
                "/admin/payouts/run",
                { method: "POST" },
              );
              setResult(response.data ?? []);
              toast.success("ประมวลผลรอบจ่ายเงินแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "ดำเนินการไม่สำเร็จ",
              );
            } finally {
              setRunning(false);
            }
          }}
        >
          <Play size={17} />
          {running ? "กำลังประมวลผล..." : "เริ่มรอบจ่ายเงิน"}
        </Button>
      }
    >
      <AuthGuard roles={["admin"]}>
        <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          {result.length
            ? `สร้างรายการจ่ายเงิน ${result.length} รายการ`
            : "กดเริ่มรอบจ่ายเงินเพื่อประมวลผลรายการใหม่"}
        </p>
      </AuthGuard>
    </OperationsShell>
  );
}
