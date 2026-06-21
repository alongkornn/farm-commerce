"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <AccountShell
      title="การแจ้งเตือน"
      description="ข่าวสารเกี่ยวกับคำสั่งซื้อ การจอง และบัญชีของคุณ"
    >
      <div className="mb-5 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setNotifications((items) =>
              items.map((item) => ({ ...item, read: true })),
            )
          }
        >
          <CheckCheck size={17} />
          อ่านทั้งหมดแล้ว
        </Button>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {notifications.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setNotifications((items) =>
                items.map((notification) =>
                  notification.id === item.id
                    ? { ...notification, read: true }
                    : notification,
                ),
              )
            }
            className={`flex w-full gap-4 p-5 text-left ${
              item.read ? "" : "bg-[#f4f7ef]"
            }`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-muted text-primary">
              <Bell size={18} />
            </span>
            <span>
              <span className="flex items-center gap-2">
                <strong>{item.title}</strong>
                {!item.read ? (
                  <span className="size-2 rounded-full bg-accent" />
                ) : null}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted">
                {item.message}
              </span>
              <span className="mt-2 block text-xs text-muted">
                {formatDateTime(item.createdAt)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </AccountShell>
  );
}
