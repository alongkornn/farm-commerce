import type { Metadata } from "next";
import { Trees } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { StoreShell } from "@/components/layout/store-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { FarmCard } from "@/features/catalog/farm-card";
import { getSellers } from "@/lib/api/catalog";
import { mockSellers } from "@/lib/mock-data";

export const metadata: Metadata = { title: "สวนทั้งหมด" };

export default async function FarmsPage() {
  let sellers = mockSellers;
  try {
    sellers = await getSellers();
  } catch {
    // Keep mock data available for local UI review if the API is offline.
  }
  return (
    <StoreShell>
      <PageHeading
        eyebrow="เลือกซื้ออย่างรู้ที่มา"
        title="สวนที่เข้าร่วม"
        description="ทำความรู้จักสวน แหล่งปลูก และเรื่องราวของคนดูแลผลไม้ก่อนตัดสินใจซื้อหรือจองเข้าเยี่ยมชม"
      />
      <div className="container-page py-8">
        {sellers.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sellers.map((seller, index) => (
              <FarmCard key={seller.id} seller={seller} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState
              icon={Trees}
              title="ยังไม่มีสวนที่เปิดให้เข้าชม"
              description="เชื่อมต่อ API สำเร็จแล้ว แต่ยังไม่มีสวนที่ผ่านการอนุมัติใน environment นี้"
            />
          </div>
        )}
      </div>
    </StoreShell>
  );
}
