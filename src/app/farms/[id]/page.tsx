import { CalendarDays, MapPin, Trees } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/store-shell";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/product-card";
import { getSeller, getSellerProducts } from "@/lib/api/catalog";

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await getSeller(id).catch(() => null);
  if (!seller) notFound();
  const products = await getSellerProducts(id).catch(() => []);
  return (
    <StoreShell>
      <section className="border-b border-border bg-[#dbe7c4]">
        <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="grid size-14 place-items-center rounded-lg bg-primary text-white">
              <Trees size={30} />
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">{seller.farmName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {seller.description || "ไม่มีคำอธิบาย"}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
              <MapPin size={17} />
              {seller.address}
            </p>
          </div>
          <Link href={`/visits?sellerId=${seller.userId}`}>
            <Button>
              <CalendarDays size={18} />
              ดูรอบเข้าชมสวน
            </Button>
          </Link>
        </div>
      </section>
      <section className="container-page py-10">
        <h2 className="text-2xl font-extrabold">สินค้าจากสวนนี้</h2>
        {products.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
            สวนยังไม่มีสินค้า
          </p>
        )}
      </section>
    </StoreShell>
  );
}
