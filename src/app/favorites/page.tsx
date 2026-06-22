"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/layout/account-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResourceState } from "@/components/ui/resource-state";
import { AuthGuard } from "@/features/auth/auth-guard";
import { ProductCard } from "@/features/catalog/product-card";
import type { Product } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";

type Favorite = { productId: string; product: Product };

export default function FavoritesPage() {
  const resource = useApiResource<Favorite[]>("/favorites", []);
  return (
    <AccountShell
      title="รายการโปรด"
      description="เก็บสินค้าที่สนใจไว้เปรียบเทียบหรือกลับมาซื้อภายหลัง"
    >
      <AuthGuard roles={["buyer"]}>
        <ResourceState {...resource} onRetry={resource.reload} />
        {!resource.loading && !resource.error ? (
          resource.data.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resource.data.map((favorite, index) => (
                <ProductCard
                  key={favorite.productId}
                  product={favorite.product}
                  index={index}
                />
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
          )
        ) : null}
      </AuthGuard>
    </AccountShell>
  );
}
