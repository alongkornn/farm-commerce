"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { AccountShell } from "@/components/layout/account-shell";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { Notification } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { request } = useAuth();
  const resource = useApiResource<Notification[]>("/notifications", []);

  return (
    <AccountShell
      title="การแจ้งเตือน"
      description="ข่าวสารเกี่ยวกับคำสั่งซื้อ การจอง และบัญชีของคุณ"
    >
      <AuthGuard>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {resource.data.map((item) => (
              <button
                key={item.id}
                onClick={async () => {
                  if (item.readAt) return;
                  try {
                    await request(`/notifications/${item.id}/read`, {
                      method: "PATCH",
                    });
                    await resource.reload();
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "ดำเนินการไม่สำเร็จ",
                    );
                  }
                }}
                className={`flex w-full gap-4 p-5 text-left ${
                  item.readAt ? "" : "bg-[#f4f7ef]"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-muted text-primary">
                  <Bell size={18} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    {item.message}
                  </span>
                  <span className="mt-2 block text-xs text-muted">
                    {formatDateTime(item.createdAt)}
                  </span>
                </span>
              </button>
            ))}
            {!resource.data.length ? (
              <p className="p-10 text-center text-sm text-muted">
                ไม่มีการแจ้งเตือน
              </p>
            ) : null}
          </div>
        ) : null}
      </AuthGuard>
    </AccountShell>
  );
}
