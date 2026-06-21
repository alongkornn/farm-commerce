import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/store-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { ProductExplorer } from "@/features/catalog/product-explorer";
import { getProducts } from "@/lib/api/catalog";
import { mockProducts } from "@/lib/mock-data";

export const metadata: Metadata = { title: "สินค้าทั้งหมด" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const filters = await searchParams;
  let products = mockProducts;
  try {
    const response = await getProducts({
      search: filters.search,
      category: filters.category,
      page: 1,
      limit: 40,
    });
    products = response.items;
  } catch {
    // Keep the storefront reviewable when the development API is unavailable.
  }
  return (
    <StoreShell>
      <PageHeading
        eyebrow="เลือกจากสวนทั่วไทย"
        title="สินค้าทั้งหมด"
        description="ค้นหาผลไม้ตามฤดูกาล เปรียบเทียบราคาและขนาด ก่อนเลือกซื้อจากสวนโดยตรง"
      />
      <ProductExplorer
        products={products}
        initialSearch={filters.search}
        initialCategory={filters.category}
      />
    </StoreShell>
  );
}
