"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/features/catalog/product-card";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { mockProducts } from "@/lib/mock-data";

export default function FavoritesPage() {
  const { favorites } = useCommerce();
  const products = mockProducts.filter((product) =>
    favorites.includes(product.id),
  );

  return (
    <AccountShell
      title="รายการโปรด"
      description="เก็บสินค้าที่สนใจไว้เปรียบเทียบหรือกลับมาซื้อภายหลัง"
    >
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface">
          <EmptyState
            icon={Heart}
            title="ยังไม่มีรายการโปรด"
            description="กดรูปหัวใจบนสินค้าที่สนใจเพื่อเก็บไว้ที่นี่"
            action={
              <Link href="/products">
                <Button>ดูสินค้า</Button>
              </Link>
            }
          />
        </div>
      )}
    </AccountShell>
  );
}
