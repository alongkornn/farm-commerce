"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { UserPage } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

const roleLabels = { buyer: "ผู้ซื้อ", seller: "สวน", admin: "ผู้ดูแล" };

export default function AdminUsersPage() {
  const { user: currentUser, request } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const path = useMemo(() => {
    const query = new URLSearchParams({ page: "1", limit: "100" });
    if (search.trim()) query.set("search", search.trim());
    if (role) query.set("userType", role);
    if (status) query.set("status", status);
    return `/admin/users?${query}`;
  }, [role, search, status]);
  const resource = useApiResource<UserPage>(path, {
    items: [],
    meta: { page: 1, limit: 100, total: 0, totalPages: 0 },
  });

  async function changeStatus(id: string, nextStatus: string) {
    try {
      await request(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await resource.reload();
      toast.success(nextStatus === "active" ? "เปิดบัญชีแล้ว" : "ระงับบัญชีแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปเดตไม่สำเร็จ");
    }
  }

  return (
    <OperationsShell
      mode="admin"
      title="ผู้ใช้งาน"
      description={`จัดการบัญชีทั้งหมด ${resource.data.meta.total} บัญชี`}
    >
      <AuthGuard roles={["admin"]}>
        <div className="mb-5 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="absolute left-3 top-3 text-muted" size={18} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาชื่อ อีเมล หรือเบอร์โทร"
              className="pl-10"
            />
          </label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          >
            <option value="">ทุกประเภท</option>
            <option value="buyer">ผู้ซื้อ</option>
            <option value="seller">สวน</option>
            <option value="admin">ผู้ดูแล</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">ใช้งานอยู่</option>
            <option value="suspended">ระงับ</option>
          </select>
        </div>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.items.length ? (
            <DataTable headers={["ผู้ใช้งาน", "ประเภท", "สถานะ", "สมัครเมื่อ", ""]} minWidth="min-w-[640px]">
              {resource.data.items.map((user) => (
                <tr key={user.id}>
                  <Cell>
                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted">{user.email} · {user.phone}</p>
                  </Cell>
                  <Cell>{roleLabels[user.userType]}</Cell>
                  <Cell><StatusBadge status={user.status} /></Cell>
                  <Cell>{formatDateTime(user.createdAt)}</Cell>
                  <Cell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                      disabled={user.id === currentUser?.id}
                      onClick={() =>
                        void changeStatus(
                          user.id,
                          user.status === "active" ? "suspended" : "active",
                        )
                      }
                    >
                      {user.status === "active" ? "ระงับบัญชี" : "เปิดบัญชี"}
                    </Button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ไม่พบผู้ใช้งาน
            </p>
          )
        ) : null}
      </AuthGuard>
    </OperationsShell>
  );
}
