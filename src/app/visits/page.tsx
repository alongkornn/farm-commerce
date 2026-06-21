import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/page-heading";
import { StoreShell } from "@/components/layout/store-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getSellers, getVisitSlots } from "@/lib/api/catalog";
import { mockSellers, mockVisitSlots } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "เที่ยวชมสวน" };

export default async function VisitsPage() {
  let slots = mockVisitSlots;
  let sellers = mockSellers;
  try {
    [slots, sellers] = await Promise.all([getVisitSlots(), getSellers()]);
  } catch {
    // Keep mock data available for local UI review if the API is offline.
  }
  return (
    <StoreShell>
      <PageHeading
        eyebrow="ประสบการณ์จากสวนจริง"
        title="รอบเที่ยวชมสวน"
        description="เลือกรอบวันและเวลาที่สะดวก จากนั้นเข้าสู่ระบบเพื่อแจ้งจำนวนผู้เข้าชม พาหนะ และชื่อผู้จอง"
      />
      <div className="container-page py-8">
        {slots.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {slots.map((slot, index) => {
          const seller =
            sellers.find((item) => item.userId === slot.sellerId) ??
            mockSellers[index % mockSellers.length];
          return (
            <article
              key={slot.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-md bg-accent-soft text-[#725214]">
                  <CalendarDays size={23} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold">{seller.farmName}</h2>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    {seller.address}
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
                <span className="text-xs font-bold text-primary">เปิดรับจอง</span>
                <Link href={`/login?next=/visits?slot=${slot.id}`}>
                  <Button size="sm">เลือกช่วงเวลานี้</Button>
                </Link>
              </div>
            </article>
          );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState
              icon={CalendarDays}
              title="ยังไม่มีรอบเที่ยวชมสวน"
              description="เชื่อมต่อ API สำเร็จแล้ว แต่ยังไม่มีสวนเปิดรอบให้จองในขณะนี้"
            />
          </div>
        )}
      </div>
    </StoreShell>
  );
}
