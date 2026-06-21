import { ArrowUpRight, MapPin, Trees } from "lucide-react";
import Link from "next/link";
import type { SellerProfile } from "@/lib/types";

export function FarmCard({
  seller,
  index,
}: {
  seller: SellerProfile;
  index: number;
}) {
  const colors = ["#d7e4b2", "#f2d597", "#b8d9d2"];

  return (
    <Link
      href={`/farms/${seller.userId}`}
      className="group grid min-h-52 overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-[120px_1fr]"
    >
      <div
        className="grid min-h-28 place-items-center"
        style={{ backgroundColor: colors[index % colors.length] }}
      >
        <Trees size={42} className="text-primary/70" />
      </div>
      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-extrabold">{seller.farmName}</h3>
          <ArrowUpRight
            size={19}
            className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {seller.description}
        </p>
        <p className="mt-auto flex items-start gap-1.5 pt-4 text-xs font-semibold text-primary">
          <MapPin size={15} className="mt-0.5 shrink-0" />
          {seller.address}
        </p>
      </div>
    </Link>
  );
}
