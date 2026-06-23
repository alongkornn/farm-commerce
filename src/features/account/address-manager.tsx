"use client";

import { MapPin, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceState } from "@/components/ui/resource-state";
import { useAuth } from "@/features/auth/auth-provider";
import type { Address } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

const emptyAddress: Omit<Address, "id"> = {
  label: "",
  recipient: "",
  phone: "",
  line1: "",
  line2: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  latitude: 0,
  longitude: 0,
  isDefault: false,
};

export function AddressManager() {
  const { request } = useAuth();
  const resource = useApiResource<Address[]>("/addresses", []);
  const [editing, setEditing] = useState<Address | null>(null);
  const [draft, setDraft] = useState<Omit<Address, "id">>(emptyAddress);
  const [open, setOpen] = useState(false);

  function openForm(address?: Address) {
    setEditing(address ?? null);
    setDraft(
      address
        ? {
            label: address.label,
            recipient: address.recipient,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            subdistrict: address.subdistrict,
            district: address.district,
            province: address.province,
            postalCode: address.postalCode,
            latitude: address.latitude,
            longitude: address.longitude,
            isDefault: address.isDefault,
          }
        : emptyAddress,
    );
    setOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    try {
      await request(editing ? `/addresses/${editing.id}` : "/addresses", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(draft),
      });
      await resource.reload();
      setOpen(false);
      toast.success(editing ? "แก้ไขที่อยู่แล้ว" : "เพิ่มที่อยู่แล้ว");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกไม่สำเร็จ");
    }
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => openForm()}>
          <Plus size={18} />
          เพิ่มที่อยู่
        </Button>
      </div>
      <ResourceState {...resource} onRetry={resource.reload} />
      {!resource.loading && !resource.error ? (
        <div className="grid gap-4 md:grid-cols-2">
          {resource.data.map((address) => (
            <article
              key={address.id}
              className="rounded-lg border border-primary bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-extrabold">
                  <MapPin size={18} className="text-primary" />
                  {address.label}
                </h2>
                {address.isDefault ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-primary">
                    <Star size={14} fill="currentColor" />
                    ค่าเริ่มต้น
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm font-bold">
                {address.recipient} · {address.phone}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {address.line1} {address.subdistrict} {address.district}{" "}
                {address.province} {address.postalCode}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openForm(address)}
                >
                  แก้ไข
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  onClick={async () => {
                    try {
                      await request(`/addresses/${address.id}`, {
                        method: "DELETE",
                      });
                      await resource.reload();
                      toast.success("ลบที่อยู่แล้ว");
                    } catch (error) {
                      toast.error(
                        error instanceof Error ? error.message : "ลบไม่สำเร็จ",
                      );
                    }
                  }}
                >
                  ลบ
                </Button>
              </div>
            </article>
          ))}
          {!resource.data.length ? (
            <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted md:col-span-2">
              ยังไม่มีที่อยู่จัดส่ง
            </p>
          ) : null}
        </div>
      ) : null}
      <Dialog
        open={open}
        title={editing ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={save} className="grid gap-4">
          {[
            ["label", "ชื่อเรียกที่อยู่"],
            ["recipient", "ชื่อผู้รับ"],
            ["phone", "เบอร์โทรศัพท์"],
            ["line1", "บ้านเลขที่ / ถนน"],
            ["subdistrict", "แขวง / ตำบล"],
            ["district", "เขต / อำเภอ"],
            ["province", "จังหวัด"],
            ["postalCode", "รหัสไปรษณีย์"],
          ].map(([key, label]) => (
            <label key={key} className="grid gap-1.5 text-sm font-bold">
              {label}
              <Input
                required
                value={String(draft[key as keyof typeof draft] ?? "")}
                onChange={(event) =>
                  setDraft((value) => ({
                    ...value,
                    [key]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm font-bold">
              ละติจูด
              <Input
                type="number"
                step="any"
                value={draft.latitude || ""}
                onChange={(event) =>
                  setDraft((value) => ({ ...value, latitude: Number(event.target.value) }))
                }
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              ลองจิจูด
              <Input
                type="number"
                step="any"
                value={draft.longitude || ""}
                onChange={(event) =>
                  setDraft((value) => ({ ...value, longitude: Number(event.target.value) }))
                }
                required
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={draft.isDefault}
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  isDefault: event.target.checked,
                }))
              }
              className="accent-primary"
            />
            ใช้เป็นที่อยู่เริ่มต้น
          </label>
          <Button type="submit">บันทึกที่อยู่</Button>
        </form>
      </Dialog>
    </>
  );
}
