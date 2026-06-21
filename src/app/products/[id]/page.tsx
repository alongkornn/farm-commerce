import {
  Heart,
  ImageIcon,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/store-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/product-card";
import { mockProducts, mockSellers } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((item) => item.id === id);
  return { title: product?.name ?? "สินค้า" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = mockProducts.find((item) => item.id === id);
  if (!product) notFound();
  const seller = mockSellers.find((item) => item.userId === product.sellerId);

  return (
    <StoreShell>
      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#eed785]">
            <ImageIcon size={72} className="text-foreground/35" />
          </div>
          <div className="lg:py-4">
            <Badge>{product.category}</Badge>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <Link
              href={`/farms/${product.sellerId}`}
              className="mt-2 inline-block text-sm font-bold text-primary hover:underline"
            >
              {seller?.farmName ?? "ดูข้อมูลสวน"}
            </Link>
            <p className="mt-5 font-display text-3xl font-extrabold text-primary">
              {formatMoney(product.priceSatang)}
              <span className="ml-2 font-sans text-sm font-medium text-muted">
                / {product.size}
              </span>
            </p>
            <p className="mt-5 text-sm leading-7 text-muted">
              {product.description}
            </p>

            <div className="mt-6 border-y border-border py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">จำนวน</span>
                <div className="flex items-center rounded-md border border-border">
                  <button className="grid size-10 place-items-center" aria-label="ลดจำนวน">
                    <Minus size={17} />
                  </button>
                  <span className="grid w-11 place-items-center text-sm font-bold">1</span>
                  <button className="grid size-10 place-items-center" aria-label="เพิ่มจำนวน">
                    <Plus size={17} />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-right text-xs text-muted">
                มีสินค้าพร้อมขาย {product.stock} ชิ้น
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/login" className="flex-1">
                <Button size="lg" className="w-full">
                  <ShoppingBasket size={19} />
                  เพิ่มลงตะกร้า
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" aria-label="เพิ่มเป็นรายการโปรด">
                  <Heart size={19} />
                </Button>
              </Link>
            </div>
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

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">สินค้าอื่นที่น่าสนใจ</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockProducts
              .filter((item) => item.id !== product.id)
              .slice(0, 3)
              .map((item, index) => (
                <ProductCard key={item.id} product={item} index={index + 1} />
              ))}
          </div>
        </section>
      </div>
    </StoreShell>
  );
}
