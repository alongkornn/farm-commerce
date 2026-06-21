import { Heart, ImageIcon, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

const productColors = [
  "bg-[#f1d880]",
  "bg-[#cfe0aa]",
  "bg-[#f0b6a0]",
  "bg-[#d8c4ef]",
];

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const image = product.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={`/products/${product.id}`}
          className="block size-full"
          aria-label={`ดูรายละเอียด ${product.name}`}
        >
        {image ? (
          // Product URLs come from seller uploads and are not limited to one host.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`grid size-full place-items-center ${productColors[index % productColors.length]}`}
          >
            <ImageIcon size={38} className="text-foreground/45" />
          </div>
        )}
        </Link>
        <Link
          href={`/login?next=${encodeURIComponent(`/products/${product.id}`)}`}
          className="focus-ring absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm hover:text-danger"
          aria-label={`เพิ่ม ${product.name} เป็นรายการโปรด`}
        >
          <Heart size={18} />
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge>{product.category}</Badge>
            <Link href={`/products/${product.id}`}>
              <h3 className="mt-2 line-clamp-2 min-h-12 font-bold leading-6 hover:text-primary">
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="shrink-0 text-right font-display text-lg font-extrabold text-primary">
            {formatMoney(product.priceSatang)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted">
            {product.size} · เหลือ {product.stock}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="focus-ring grid size-9 place-items-center rounded-md bg-primary text-white hover:bg-primary-strong"
            aria-label={`ดูและเลือกซื้อ ${product.name}`}
          >
            <ShoppingBasket size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
