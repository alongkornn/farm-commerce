"use client";

import { Plus, Trash2 } from "lucide-react";
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
import type { Product, UploadResponse } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export default function SellerProductsPage() {
  const { request } = useAuth();
  const resource = useApiResource<Product[]>("/seller/products", []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  function edit(product?: Product) {
    setEditing(product ?? null);
    setImageUrls(product?.images?.map((image) => image.url) ?? []);
    setOpen(true);
  }

  return (
    <OperationsShell
      mode="seller"
      title="สินค้า"
      description="เพิ่ม แก้ไข เปิดปิด และลบสินค้าของสวน"
      actions={
        <Button onClick={() => edit()}>
          <Plus size={18} />
          เพิ่มสินค้า
        </Button>
      }
    >
      <AuthGuard roles={["seller"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable
              headers={["สินค้า", "SKU", "ราคา", "คงเหลือ", "สถานะ", ""]}
            >
              {resource.data.map((product) => (
                <tr key={product.id}>
                  <Cell>
                    <button
                      onClick={() => edit(product)}
                      className="text-left font-bold hover:text-primary"
                    >
                      {product.name}
                    </button>
                    <p className="text-xs text-muted">{product.category}</p>
                  </Cell>
                  <Cell className="font-mono text-xs">{product.sku}</Cell>
                  <Cell className="font-bold">
                    {formatMoney(product.priceSatang)}
                  </Cell>
                  <Cell>{product.stock}</Cell>
                  <Cell>
                    <button
                      onClick={async () => {
                        try {
                          await request(
                            `/seller/products/${product.id}/status`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({ active: !product.active }),
                            },
                          );
                          await resource.reload();
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "เปลี่ยนสถานะไม่สำเร็จ",
                          );
                        }
                      }}
                      className={`font-bold ${
                        product.active ? "text-primary" : "text-muted"
                      }`}
                    >
                      {product.active ? "เปิดขาย" : "ปิดขาย"}
                    </button>
                  </Cell>
                  <Cell>
                    <button
                      aria-label={`ลบ ${product.name}`}
                      onClick={async () => {
                        try {
                          await request(`/seller/products/${product.id}`, {
                            method: "DELETE",
                          });
                          await resource.reload();
                          toast.success("ลบสินค้าแล้ว");
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "ลบสินค้าไม่สำเร็จ",
                          );
                        }
                      }}
                      className="text-muted hover:text-danger"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีสินค้า
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={open}
        title={editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
        onClose={() => setOpen(false)}
      >
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request(
                editing
                  ? `/seller/products/${editing.id}`
                  : "/seller/products",
                {
                  method: editing ? "PUT" : "POST",
                  body: JSON.stringify({
                    sku: data.get("sku"),
                    name: data.get("name"),
                    category: data.get("category"),
                    priceSatang: Math.round(Number(data.get("price")) * 100),
                    size: data.get("size"),
                    stock: Number(data.get("stock")),
                    imageUrls,
                    description: data.get("description"),
                  }),
                },
              );
              setOpen(false);
              await resource.reload();
              toast.success(editing ? "แก้ไขสินค้าแล้ว" : "เพิ่มสินค้าแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "บันทึกไม่สำเร็จ",
              );
            }
          }}
        >
          {[
            ["sku", "SKU", editing?.sku ?? ""],
            ["name", "ชื่อสินค้า", editing?.name ?? ""],
            ["category", "ประเภท", editing?.category ?? ""],
            ["size", "ขนาด", editing?.size ?? ""],
          ].map(([name, label, value]) => (
            <label key={name} className="grid gap-1.5 text-sm font-bold">
              {label}
              <Input name={name} defaultValue={value} required />
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm font-bold">
              ราคา (บาท)
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  editing ? String(editing.priceSatang / 100) : "0"
                }
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              จำนวน
              <Input
                name="stock"
                type="number"
                min="0"
                defaultValue={editing?.stock ?? 0}
                required
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-bold">
            คำอธิบาย
            <textarea
              name="description"
              defaultValue={editing?.description}
              className="focus-ring min-h-24 rounded-md border border-border p-3 text-sm"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold">
            รูปสินค้า
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const response = await request<{ data: UploadResponse }>(
                    "/seller/uploads/product-image",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                      }),
                    },
                  );
                  await fetch(response.data.uploadUrl, {
                    method: response.data.method,
                    headers: response.data.headers,
                    body: file,
                  });
                  setImageUrls((items) => [
                    ...items,
                    response.data.publicUrl,
                  ]);
                  toast.success("อัปโหลดรูปแล้ว");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "อัปโหลดไม่สำเร็จ",
                  );
                }
              }}
            />
          </label>
          <Button type="submit">บันทึกสินค้า</Button>
        </form>
      </Dialog>
    </OperationsShell>
  );
}
