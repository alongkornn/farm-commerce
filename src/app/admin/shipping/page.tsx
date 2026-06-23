"use client";

import { Pencil, Plus, Power, Trash2 } from "lucide-react";
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
import type { ShippingRate } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export default function AdminShippingPage() {
  const { request } = useAuth();
  const resource = useApiResource<ShippingRate[]>("/admin/shipping-rates", []);
  const [selected, setSelected] = useState<ShippingRate | null | undefined>();

  async function saveRate(input: Omit<ShippingRate, "id">) {
    try {
      await request(
        selected
          ? `/admin/shipping-rates/${selected.id}`
          : "/admin/shipping-rates",
        {
          method: selected ? "PUT" : "POST",
          body: JSON.stringify(input),
        },
      );
      const wasEditing = Boolean(selected);
      setSelected(undefined);
      await resource.reload();
      toast.success(wasEditing ? "แก้ไขช่วงราคาแล้ว" : "เพิ่มช่วงราคาแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    }
  }

  async function updateRate(
    rate: ShippingRate,
    input: Omit<ShippingRate, "id">,
  ) {
    try {
      await request(`/admin/shipping-rates/${rate.id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });
      await resource.reload();
      toast.success(input.active ? "เปิดใช้งานช่วงราคาแล้ว" : "ปิดช่วงราคาแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปเดตไม่สำเร็จ");
    }
  }

  async function deleteRate(rate: ShippingRate) {
    try {
      await request(`/admin/shipping-rates/${rate.id}`, { method: "DELETE" });
      await resource.reload();
      toast.success("ลบช่วงราคาแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบไม่สำเร็จ");
    }
  }

  return (
    <OperationsShell
      mode="admin"
      title="ค่าจัดส่ง"
      description="กำหนดราคาตามระยะทางระหว่างสวนกับที่อยู่จัดส่ง"
      actions={
        <Button onClick={() => setSelected(null)}>
          <Plus size={18} />
          เพิ่มช่วงราคา
        </Button>
      }
    >
      <AuthGuard roles={["admin"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <DataTable headers={["ชื่อ", "ระยะทาง", "ค่าจัดส่ง", "สถานะ", ""]}>
              {resource.data.map((rate) => (
                <tr key={rate.id}>
                  <Cell className="font-bold">{rate.name}</Cell>
                  <Cell>
                    {rate.minKm}-{rate.maxKm} กม.
                  </Cell>
                  <Cell>{formatMoney(rate.feeSatang)}</Cell>
                  <Cell className={rate.active ? "text-primary" : "text-muted"}>
                    {rate.active ? "ใช้งาน" : "ปิด"}
                  </Cell>
                  <Cell>
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label={`แก้ไข ${rate.name}`}
                        className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-muted hover:text-foreground"
                        onClick={() => setSelected(rate)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        aria-label={
                          rate.active
                            ? `ปิดใช้งาน ${rate.name}`
                            : `เปิดใช้งาน ${rate.name}`
                        }
                        className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-muted hover:text-primary"
                        onClick={() =>
                          void updateRate(rate, {
                            name: rate.name,
                            minKm: rate.minKm,
                            maxKm: rate.maxKm,
                            feeSatang: rate.feeSatang,
                            active: !rate.active,
                          })
                        }
                      >
                        <Power size={17} />
                      </button>
                      <button
                        aria-label={`ลบ ${rate.name}`}
                        className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-muted hover:text-danger"
                        onClick={() => void deleteRate(rate)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </Cell>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีช่วงค่าจัดส่ง ระบบจะยัง checkout ไม่ได้จนกว่าจะกำหนดเรต
            </p>
          )
        ) : null}
      </AuthGuard>
      <Dialog
        open={selected !== undefined}
        title={selected ? "แก้ไขช่วงค่าจัดส่ง" : "เพิ่มช่วงค่าจัดส่ง"}
        onClose={() => setSelected(undefined)}
      >
        <ShippingRateForm
          key={selected?.id ?? "new"}
          rate={selected ?? null}
          onSubmit={saveRate}
        />
      </Dialog>
    </OperationsShell>
  );
}

function ShippingRateForm({
  rate,
  onSubmit,
}: {
  rate: ShippingRate | null;
  onSubmit: (input: Omit<ShippingRate, "id">) => Promise<void>;
}) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void onSubmit({
          name: String(data.get("name") ?? ""),
          minKm: Number(data.get("minKm")),
          maxKm: Number(data.get("maxKm")),
          feeSatang: Math.round(Number(data.get("fee")) * 100),
          active: rate?.active ?? true,
        });
      }}
    >
      <label className="grid gap-1.5 text-sm font-bold">
        ชื่อ
        <Input name="name" defaultValue={rate?.name} required />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5 text-sm font-bold">
          ตั้งแต่ (กม.)
          <Input
            name="minKm"
            type="number"
            min="0"
            step="0.1"
            defaultValue={rate?.minKm}
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          ถึง (กม.)
          <Input
            name="maxKm"
            type="number"
            min="0.1"
            step="0.1"
            defaultValue={rate?.maxKm}
            required
          />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-bold">
        ค่าจัดส่ง (บาท)
        <Input
          name="fee"
          type="number"
          min="0"
          step="0.01"
          defaultValue={rate ? rate.feeSatang / 100 : undefined}
          required
        />
      </label>
      <Button type="submit">บันทึก</Button>
    </form>
  );
}
