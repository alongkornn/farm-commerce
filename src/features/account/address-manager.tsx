"use client";

import { MapPin, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockAddresses } from "@/lib/mock-data";
import type { Address } from "@/lib/types";

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
  isDefault: false,
};

export function AddressManager() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [draft, setDraft] = useState<Omit<Address, "id">>(emptyAddress);
  const [open, setOpen] = useState(false);

  function openForm(address?: Address) {
    setEditing(address ?? null);
    setDraft(address ? { ...address } : emptyAddress);
    setOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (editing) {
      setAddresses((items) =>
        items.map((item) =>
          item.id === editing.id ? { ...draft, id: item.id } : item,
        ),
      );
    } else {
      setAddresses((items) => [
        ...items,
        { ...draft, id: `address-${Date.now()}` },
      ]);
    }
    setOpen(false);
    toast.success(editing ? "แก้ไขที่อยู่แล้ว" : "เพิ่มที่อยู่แล้ว");
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => openForm()}>
          <Plus size={18} />
          เพิ่มที่อยู่
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
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
                onClick={() => {
                  setAddresses((items) =>
                    items.filter((item) => item.id !== address.id),
                  );
                  toast.success("ลบที่อยู่แล้ว");
                }}
              >
                ลบ
              </Button>
            </div>
          </article>
        ))}
      </div>
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
          <Button type="submit">บันทึกที่อยู่</Button>
        </form>
      </Dialog>
    </>
  );
}
