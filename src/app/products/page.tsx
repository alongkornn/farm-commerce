import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/store-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { ProductExplorer } from "@/features/catalog/product-explorer";
import { mockProducts } from "@/lib/mock-data";

export const metadata: Metadata = { title: "สินค้าทั้งหมด" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const filters = await searchParams;
  return (
    <StoreShell>
      <PageHeading
        eyebrow="เลือกจากสวนทั่วไทย"
        title="สินค้าทั้งหมด"
        description="ค้นหาผลไม้ตามฤดูกาล เปรียบเทียบราคาและขนาด ก่อนเลือกซื้อจากสวนโดยตรง"
      />
      <ProductExplorer
        products={mockProducts}
        initialSearch={filters.search}
        initialCategory={filters.category}
      />
    </StoreShell>
  );
}
