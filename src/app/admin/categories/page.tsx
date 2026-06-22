"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OperationsShell } from "@/components/layout/operations-shell";
import { Button } from "@/components/ui/button";
import { Cell, DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useAuth } from "@/features/auth/auth-provider";
import type { ProductCategory } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

export default function AdminProductCategoriesPage() {
  const { request } = useAuth();
  const resource = useApiResource<ProductCategory[]>(
    "/admin/product-categories",
    [],
  );
  const [open, setOpen] = useState(false);

  return (
    <OperationsShell
      mode="admin"
      title="หมวดสินค้า"
      description="กำหนดตัวเลือกประเภทสินค้าที่สวนสามารถนำไปใช้ได้"
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} />
          เพิ่มหมวด
        </Button>
      }
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable headers={["หมวดสินค้า", "ลำดับ", "สถานะ"]}>
              {resource.data.map((category) => (
                <tr key={category.id}>
                  <Cell className="font-bold">{category.name}</Cell>
                  <Cell>{category.sortOrder}</Cell>
                  <Cell>
                    <button
                      className={`font-bold ${
                        category.active ? "text-primary" : "text-muted"
                      }`}
                      onClick={async () => {
                        try {
                          await request(
                            `/admin/product-categories/${category.id}/status`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                active: !category.active,
                              }),
                            },
                          );
                          await resource.reload();
                          toast.success(
                            category.active
                              ? "ปิดหมวดสินค้าแล้ว"
                              : "เปิดหมวดสินค้าแล้ว",
                          );
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "เปลี่ยนสถานะไม่สำเร็จ",
                          );
                        }
                      }}
                    >
                      {category.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีหมวดสินค้า
            </p>
          )
        ) : null}
      </AuthGuard>

      <Dialog
        open={open}
        title="เพิ่มหมวดสินค้า"
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request("/admin/product-categories", {
                method: "POST",
                body: JSON.stringify({
                  name: data.get("name"),
                  sortOrder: Number(data.get("sortOrder")),
                }),
              });
              setOpen(false);
              await resource.reload();
              toast.success("เพิ่มหมวดสินค้าแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "เพิ่มหมวดไม่สำเร็จ",
              );
            }
          }}
        >
          <label className="grid gap-1.5 text-sm font-bold">
            ชื่อหมวด
            <Input name="name" maxLength={100} required />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            ลำดับการแสดง
            <Input
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={resource.data.length + 1}
              required
            />
          </label>
          <Button type="submit">บันทึกหมวดสินค้า</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
