"use client";

import { Pencil, Plus, Power, Scale, Trash2 } from "lucide-react";
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
import type { ProductUnit, ShippingRate } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatMoney } from "@/lib/utils";

export default function AdminShippingPage() {
  const { request } = useAuth();
  const rates = useApiResource<ShippingRate[]>("/admin/shipping-rates", []);
  const units = useApiResource<ProductUnit[]>("/admin/product-units", []);
  const [selectedRate, setSelectedRate] =
    useState<ShippingRate | null | undefined>();
  const [selectedUnit, setSelectedUnit] =
    useState<ProductUnit | null | undefined>();

  async function reloadAll() {
    await Promise.all([rates.reload(), units.reload()]);
  }

  async function saveRate(input: Omit<ShippingRate, "id">) {
    try {
      await request(
        selectedRate
          ? `/admin/shipping-rates/${selectedRate.id}`
          : "/admin/shipping-rates",
        {
          method: selectedRate ? "PUT" : "POST",
          body: JSON.stringify(input),
        },
      );
      setSelectedRate(undefined);
      await rates.reload();
      toast.success("บันทึกช่วงค่าจัดส่งแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    }
  }

  async function updateRate(rate: ShippingRate, active: boolean) {
    await saveExisting(
      `/admin/shipping-rates/${rate.id}`,
      { ...rate, active },
      rates.reload,
      active ? "เปิดช่วงค่าจัดส่งแล้ว" : "ปิดช่วงค่าจัดส่งแล้ว",
    );
  }

  async function saveUnit(input: Omit<ProductUnit, "id">) {
    try {
      await request(
        selectedUnit
          ? `/admin/product-units/${selectedUnit.id}`
          : "/admin/product-units",
        {
          method: selectedUnit ? "PUT" : "POST",
          body: JSON.stringify(input),
        },
      );
      setSelectedUnit(undefined);
      await units.reload();
      toast.success("บันทึกหน่วยสินค้าแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    }
  }

  async function updateUnit(unit: ProductUnit, active: boolean) {
    await saveExisting(
      `/admin/product-units/${unit.id}`,
      { ...unit, active },
      units.reload,
      active ? "เปิดหน่วยสินค้าแล้ว" : "ปิดหน่วยสินค้าแล้ว",
    );
  }

  async function saveExisting(
    path: string,
    body: object,
    reload: () => Promise<void>,
    message: string,
  ) {
    try {
      await request(path, { method: "PUT", body: JSON.stringify(body) });
      await reload();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "อัปเดตไม่สำเร็จ");
    }
  }

  async function deleteRate(rate: ShippingRate) {
    try {
      await request(`/admin/shipping-rates/${rate.id}`, { method: "DELETE" });
      await rates.reload();
      toast.success("ลบช่วงค่าจัดส่งแล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบไม่สำเร็จ");
    }
  }

  return (
    <OperationsShell
      mode="admin"
      title="ค่าจัดส่งและหน่วยสินค้า"
      description="กำหนดตัวคูณหน่วยเป็นกิโลกรัม และคิดค่าส่งตามน้ำหนักรวมของสินค้า"
    >
      <AuthGuard roles={["admin"]}>
        <div className="grid gap-8">
          <section>
            <SectionHeader
              title="หน่วยสินค้า"
              description="ตัวคูณคือค่าน้ำหนักกิโลกรัมต่อ 1 หน่วย เช่น 1 กรัม = 0.001 กก."
              action={
                <Button size="sm" onClick={() => setSelectedUnit(null)}>
                  <Plus size={17} />
                  เพิ่มหน่วย
                </Button>
              }
            />
            <ResourceState {...units} onRetry={reloadAll} />
            {!units.loading && !units.error ? (
              units.data.length ? (
                <DataTable
                  headers={["หน่วย", "สัญลักษณ์", "เท่ากับกิโลกรัม", "สถานะ", ""]}
                >
                  {units.data.map((unit) => (
                    <tr key={unit.id}>
                      <Cell>
                        <p className="font-bold">{unit.name}</p>
                        <p className="font-mono text-xs text-muted">{unit.code}</p>
                      </Cell>
                      <Cell>{unit.symbol}</Cell>
                      <Cell>1 {unit.symbol} = {unit.kgMultiplier} กก.</Cell>
                      <Cell className={unit.active ? "text-primary" : "text-muted"}>
                        {unit.active ? "ใช้งาน" : "ปิด"}
                      </Cell>
                      <Cell>
                        <RowActions
                          active={unit.active}
                          edit={() => setSelectedUnit(unit)}
                          toggle={() => void updateUnit(unit, !unit.active)}
                        />
                      </Cell>
                    </tr>
                  ))}
                </DataTable>
              ) : (
                <Empty text="ยังไม่มีหน่วยสินค้า" />
              )
            ) : null}
          </section>

          <section>
            <SectionHeader
              title="ช่วงค่าจัดส่งตามน้ำหนัก"
              description="ระบบรวมสินค้าของแต่ละสวนเป็นกิโลกรัม แล้วเลือกค่าจัดส่งจากช่วงนี้"
              action={
                <Button size="sm" onClick={() => setSelectedRate(null)}>
                  <Plus size={17} />
                  เพิ่มช่วงราคา
                </Button>
              }
            />
            <ResourceState {...rates} onRetry={reloadAll} />
            {!rates.loading && !rates.error ? (
              rates.data.length ? (
                <DataTable headers={["ชื่อ", "น้ำหนัก", "ค่าจัดส่ง", "สถานะ", ""]}>
                  {rates.data.map((rate) => (
                    <tr key={rate.id}>
                      <Cell className="font-bold">{rate.name}</Cell>
                      <Cell>
                        {rate.minWeightKg}-{rate.maxWeightKg} กก.
                      </Cell>
                      <Cell>{formatMoney(rate.feeSatang)}</Cell>
                      <Cell className={rate.active ? "text-primary" : "text-muted"}>
                        {rate.active ? "ใช้งาน" : "ปิด"}
                      </Cell>
                      <Cell>
                        <div className="flex justify-end gap-1">
                          <RowActions
                            active={rate.active}
                            edit={() => setSelectedRate(rate)}
                            toggle={() => void updateRate(rate, !rate.active)}
                          />
                          <IconButton
                            label={`ลบ ${rate.name}`}
                            danger
                            onClick={() => void deleteRate(rate)}
                          >
                            <Trash2 size={17} />
                          </IconButton>
                        </div>
                      </Cell>
                    </tr>
                  ))}
                </DataTable>
              ) : (
                <Empty text="ยังไม่มีช่วงค่าจัดส่ง ระบบจะ checkout ไม่ได้จนกว่าจะกำหนดเรต" />
              )
            ) : null}
          </section>
        </div>
      </AuthGuard>

      <Dialog
        open={selectedUnit !== undefined}
        title={selectedUnit ? "แก้ไขหน่วยสินค้า" : "เพิ่มหน่วยสินค้า"}
        onClose={() => setSelectedUnit(undefined)}
      >
        <UnitForm
          key={selectedUnit?.id ?? "new-unit"}
          unit={selectedUnit ?? null}
          onSubmit={saveUnit}
        />
      </Dialog>

      <Dialog
        open={selectedRate !== undefined}
        title={selectedRate ? "แก้ไขช่วงค่าจัดส่ง" : "เพิ่มช่วงค่าจัดส่ง"}
        onClose={() => setSelectedRate(undefined)}
      >
        <RateForm
          key={selectedRate?.id ?? "new-rate"}
          rate={selectedRate ?? null}
          onSubmit={saveRate}
        />
      </Dialog>
    </OperationsShell>
  );
}

function UnitForm({
  unit,
  onSubmit,
}: {
  unit: ProductUnit | null;
  onSubmit: (input: Omit<ProductUnit, "id">) => Promise<void>;
}) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        void onSubmit({
          code: String(data.get("code") ?? ""),
          name: String(data.get("name") ?? ""),
          symbol: String(data.get("symbol") ?? ""),
          kgMultiplier: Number(data.get("kgMultiplier")),
          sortOrder: Number(data.get("sortOrder")),
          active: unit?.active ?? true,
        });
      }}
    >
      <label className="grid gap-1.5 text-sm font-bold">
        รหัสหน่วย
        <Input name="code" defaultValue={unit?.code} placeholder="เช่น kg, g, ml" required />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5 text-sm font-bold">
          ชื่อหน่วย
          <Input name="name" defaultValue={unit?.name} placeholder="กิโลกรัม" required />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          สัญลักษณ์
          <Input name="symbol" defaultValue={unit?.symbol} placeholder="กก." required />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-bold">
        ตัวคูณเป็นกิโลกรัม
        <Input
          name="kgMultiplier"
          type="number"
          min="0.000001"
          step="0.000001"
          defaultValue={unit?.kgMultiplier ?? 1}
          required
        />
        <span className="text-xs font-medium text-muted">
          ตัวอย่าง: กรัม = 0.001, มิลลิลิตร = 0.001, ลิตร = 1
        </span>
      </label>
      <label className="grid gap-1.5 text-sm font-bold">
        ลำดับ
        <Input name="sortOrder" type="number" min="0" defaultValue={unit?.sortOrder ?? 0} />
      </label>
      <Button type="submit">บันทึก</Button>
    </form>
  );
}

function RateForm({
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
          minWeightKg: Number(data.get("minWeightKg")),
          maxWeightKg: Number(data.get("maxWeightKg")),
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
          ตั้งแต่ (กก.)
          <Input
            name="minWeightKg"
            type="number"
            min="0"
            step="0.001"
            defaultValue={rate?.minWeightKg}
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          ถึง (กก.)
          <Input
            name="maxWeightKg"
            type="number"
            min="0.001"
            step="0.001"
            defaultValue={rate?.maxWeightKg}
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

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Scale size={19} className="text-primary" />
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {action}
    </header>
  );
}

function RowActions({
  active,
  edit,
  toggle,
}: {
  active: boolean;
  edit: () => void;
  toggle: () => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <IconButton label="แก้ไข" onClick={edit}>
        <Pencil size={17} />
      </IconButton>
      <IconButton label={active ? "ปิดใช้งาน" : "เปิดใช้งาน"} onClick={toggle}>
        <Power size={17} />
      </IconButton>
    </div>
  );
}

function IconButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center rounded-md text-muted hover:bg-surface-muted ${
        danger ? "hover:text-danger" : "hover:text-primary"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
      {text}
    </p>
  );
}
