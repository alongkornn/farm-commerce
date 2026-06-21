import { Bell, CheckCheck } from "lucide-react";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  return (
    <AccountShell title="การแจ้งเตือน" description="ข่าวสารเกี่ยวกับคำสั่งซื้อ การจอง และบัญชีของคุณ">
      <div className="mb-5 flex justify-end"><Button size="sm" variant="outline"><CheckCheck size={17} />อ่านทั้งหมดแล้ว</Button></div>
      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {mockNotifications.map((item) => (
          <article key={item.id} className={`flex gap-4 p-5 ${item.read ? "" : "bg-[#f4f7ef]"}`}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-muted text-primary"><Bell size={18} /></span>
            <div><div className="flex items-center gap-2"><h2 className="font-bold">{item.title}</h2>{!item.read ? <span className="size-2 rounded-full bg-accent" /> : null}</div><p className="mt-1 text-sm leading-6 text-muted">{item.message}</p><p className="mt-2 text-xs text-muted">{formatDateTime(item.createdAt)}</p></div>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
