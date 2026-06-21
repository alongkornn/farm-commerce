import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/page-heading";
import { StoreShell } from "@/components/layout/store-shell";
import { FarmCard } from "@/features/catalog/farm-card";
import { mockSellers } from "@/lib/mock-data";

export const metadata: Metadata = { title: "สวนทั้งหมด" };

export default function FarmsPage() {
  return (
    <StoreShell>
      <PageHeading
        eyebrow="เลือกซื้ออย่างรู้ที่มา"
        title="สวนที่เข้าร่วม"
        description="ทำความรู้จักสวน แหล่งปลูก และเรื่องราวของคนดูแลผลไม้ก่อนตัดสินใจซื้อหรือจองเข้าเยี่ยมชม"
      />
      <div className="container-page grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-3">
        {mockSellers.map((seller, index) => (
          <FarmCard key={seller.id} seller={seller} index={index} />
        ))}
      </div>
    </StoreShell>
  );
}
