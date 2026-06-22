import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/store-shell";
import { PageHeading } from "@/components/layout/page-heading";
import { ProductExplorer } from "@/features/catalog/product-explorer";
import { getProductCategories, getProducts } from "@/lib/api/catalog";
import type { Product, ProductCategory } from "@/lib/types";

export const metadata: Metadata = { title: "สินค้าทั้งหมด" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const filters = await searchParams;
  let products: Product[] = [];
  let categories: ProductCategory[] = [];
  const [productResult, categoryResult] = await Promise.allSettled([
    getProducts({
      page: 1,
      limit: 100,
    }),
    getProductCategories(),
  ]);
  if (productResult.status === "fulfilled") {
    products = productResult.value.items;
  }
  if (categoryResult.status === "fulfilled") {
    categories = categoryResult.value;
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
        categories={categories}
        initialSearch={filters.search}
        initialCategory={filters.category}
      />
    </StoreShell>
  );
}
