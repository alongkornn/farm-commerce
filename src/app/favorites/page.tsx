import { AccountShell } from "@/components/layout/account-shell";
import { ProductCard } from "@/features/catalog/product-card";
import { mockProducts } from "@/lib/mock-data";

export default function FavoritesPage() {
  return (
    <AccountShell title="รายการโปรด" description="เก็บสินค้าที่สนใจไว้เปรียบเทียบหรือกลับมาซื้อภายหลัง">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockProducts.slice(0, 3).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
      </div>
    </AccountShell>
  );
}
