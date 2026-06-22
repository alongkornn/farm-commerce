import { ImageIcon, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/store-shell";
import { Badge } from "@/components/ui/badge";
import { ProductPurchaseControls } from "@/features/commerce/product-purchase-controls";
import { ProductReviews } from "@/features/catalog/product-reviews";
import { getProduct, getSeller } from "@/lib/api/catalog";
import { formatMoney } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();
  const seller = await getSeller(product.sellerId).catch(() => null);

  return (
    <StoreShell>
      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#eed785]">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.name}
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon size={72} className="text-foreground/35" />
            )}
          </div>
          <div className="lg:py-4">
            <Badge>{product.category}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm font-bold text-primary">
              {seller?.farmName ?? "ไม่ระบุสวน"}
            </p>
            <p className="mt-5 font-display text-3xl font-extrabold text-primary">
              {formatMoney(product.priceSatang)}
              <span className="ml-2 font-sans text-sm font-medium text-muted">
                / {product.size}
              </span>
            </p>
            <p className="mt-5 text-sm leading-7 text-muted">
              {product.description || "ไม่มีคำอธิบาย"}
            </p>
            <ProductPurchaseControls product={product} />
            <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Truck size={18} className="text-primary" />
                จัดส่งจากสวนโดยตรง
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                สวนผ่านการอนุมัติ
              </span>
            </div>
          </div>
        </div>
        <ProductReviews productId={product.id} />
      </div>
    </StoreShell>
  );
}
