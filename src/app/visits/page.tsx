import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Trees,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/page-heading";
import { StoreShell } from "@/components/layout/store-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { FarmCard } from "@/features/catalog/farm-card";
import { VisitBookingButton } from "@/features/commerce/visit-booking-button";
import { getSeller, getSellers, getVisitSlots } from "@/lib/api/catalog";
import type { SellerProfile, VisitSlot } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "เที่ยวชมสวน" };

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ sellerId?: string }>;
}) {
  const { sellerId } = await searchParams;

  if (!sellerId) {
    const sellers = await getSellers().catch(() => []);
    return <FarmSelection sellers={sellers} />;
  }

  const [seller, slots] = await Promise.all([
    getSeller(sellerId).catch(() => null),
    getVisitSlots(sellerId).catch(() => []),
  ]);

  return <FarmSlots seller={seller} slots={slots} />;
}

function FarmSelection({ sellers }: { sellers: SellerProfile[] }) {
  return (
    <StoreShell>
      <PageHeading
        eyebrow="เริ่มต้นการจอง"
        title="เลือกสวนที่ต้องการเข้าชม"
        description="เลือกรายชื่อสวนก่อน จากนั้นระบบจะแสดงเฉพาะวันและเวลาที่สวนนั้นเปิดรับผู้เข้าชม"
      />
      <div className="container-page py-8">
        {sellers.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sellers.map((seller, index) => (
              <FarmCard
                key={seller.id}
                href={`/visits?sellerId=${seller.userId}`}
                seller={seller}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState
              icon={Trees}
              title="ยังไม่มีสวนให้เลือก"
              description="ยังไม่มีสวนที่ผ่านการอนุมัติและเปิดให้เข้าชม"
            />
          </div>
        )}
      </div>
    </StoreShell>
  );
}

function FarmSlots({
  seller,
  slots,
}: {
  seller: SellerProfile | null;
  slots: VisitSlot[];
}) {
  return (
    <StoreShell>
      <PageHeading
        eyebrow="รอบที่เปิดรับจอง"
        title={seller?.farmName ?? "เที่ยวชมสวน"}
        description={
          seller
            ? `${seller.address} เลือกวันและเวลาที่สะดวกเพื่อส่งคำขอจอง`
            : "เลือกรอบวันและเวลาที่สะดวก"
        }
        actions={
          <Link
            href="/visits"
            className="flex items-center gap-2 text-sm font-bold text-primary"
          >
            <ArrowLeft size={17} />
            เปลี่ยนสวน
          </Link>
        }
      />
      <div className="container-page py-8">
        {slots.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {slots.map((slot) => (
              <article
                key={slot.id}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-accent-soft text-[#725214]">
                    <CalendarDays size={23} />
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold">
                      {seller?.farmName ?? "สวน"}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={14} />
                      {seller?.address ?? "ไม่ระบุที่อยู่"}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
                  <span className="flex items-center gap-2">
                    <Clock3 size={17} className="text-primary" />
                    {formatDateTime(slot.startAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={17} className="text-primary" />
                    รับสูงสุด {slot.capacity} คน
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">
                    เปิดรับจอง
                  </span>
                  <VisitBookingButton slotId={slot.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState
              icon={CalendarDays}
              title="สวนนี้ยังไม่มีรอบเปิดให้จอง"
              description="ลองเลือกสวนอื่นหรือตรวจสอบอีกครั้งภายหลัง"
              action={
                <Link href="/visits">
                  <span className="font-bold text-primary">เลือกสวนอื่น</span>
                </Link>
              }
            />
          </div>
        )}
      </div>
    </StoreShell>
  );
}
