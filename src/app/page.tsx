import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  PackageCheck,
  Search,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StoreShell } from "@/components/layout/store-shell";
import { Button } from "@/components/ui/button";
import { FarmCard } from "@/features/catalog/farm-card";
import { ProductCard } from "@/features/catalog/product-card";
import { getProducts, getSellers, getVisitSlots } from "@/lib/api/catalog";
import { formatDateTime } from "@/lib/utils";

const categories = ["มะม่วง", "ส้มโอ", "ผลไม้ตามฤดูกาล", "ชุดของขวัญ"];

export default async function Home() {
  const [productResult, sellers, visitSlots] = await Promise.all([
    getProducts({ page: 1, limit: 4 }).catch(() => ({
      items: [],
      meta: { page: 1, limit: 4, total: 0, totalPages: 0 },
    })),
    getSellers().catch(() => []),
    getVisitSlots().catch(() => []),
  ]);
  const products = productResult.items;
  const availableVisitSlots = visitSlots.filter(
    (slot) => slot.available !== false,
  );
  return (
    <StoreShell>
      <section className="relative min-h-[560px] overflow-hidden bg-[#24472f] text-white md:min-h-[620px]">
        <Image
          src="/images/orchard-hero.png"
          alt="สวนผลไม้ไทยในยามเช้า"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,48,28,0.93)_0%,rgba(18,48,28,0.68)_48%,rgba(18,48,28,0.08)_100%)]" />
        <div className="container-page relative flex min-h-[560px] items-center py-16 md:min-h-[620px]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#ffe29a]">
              <Sprout size={18} />
              สดจากสวนที่ผ่านการตรวจสอบ
            </span>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl">
              ผลไม้จากสวน ส่งถึงบ้านคุณ
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              เลือกซื้อผลไม้ตามฤดูกาลจากเจ้าของสวนโดยตรง
              หรือจองวันเพื่อไปสัมผัสสวนจริงด้วยตัวเอง
            </p>
            <form
              action="/products"
              className="mt-8 flex max-w-xl flex-col gap-2 rounded-lg bg-white p-2 shadow-xl sm:flex-row sm:items-center"
            >
              <Search size={20} className="ml-2 hidden shrink-0 text-muted sm:block" />
              <input
                name="search"
                aria-label="ค้นหาผลไม้หรือสวน"
                placeholder="ค้นหาผลไม้หรือชื่อสวน"
                className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm text-foreground outline-none"
              />
              <Button type="submit" className="w-full sm:w-auto">ค้นหา</Button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#f3c553]" />
                สวนผ่านการอนุมัติ
              </span>
              <span className="flex items-center gap-1.5">
                <PackageCheck size={16} className="text-[#f3c553]" />
                ติดตามสถานะคำสั่งซื้อ
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck size={16} className="text-[#f3c553]" />
                จองเที่ยวสวนออนไลน์
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow)] scrollbar-none">
          <Link
            href="/products"
            className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            ผลไม้ทั้งหมด
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="shrink-0 rounded-md px-4 py-2.5 text-sm font-bold text-muted hover:bg-surface-muted hover:text-primary"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeading
          eyebrow="เก็บใหม่ตามออเดอร์"
          title="ผลไม้แนะนำประจำสัปดาห์"
          href="/products"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
          {!products.length ? (
            <p className="col-span-full rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
              ยังไม่มีสินค้า
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-y border-border bg-[#edf1e9] py-14">
        <div className="container-page">
          <SectionHeading
            eyebrow="รู้จักคนปลูก"
            title="สวนที่น่าสนใจ"
            href="/farms"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {sellers.slice(0, 3).map((seller, index) => (
              <FarmCard key={seller.id} seller={seller} index={index} />
            ))}
            {!sellers.length ? (
              <p className="col-span-full rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
                ยังไม่มีสวน
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <span className="text-sm font-bold text-primary">วันหยุดครั้งถัดไป</span>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight">
              ไปเห็นสวนจริง เรียนรู้และเก็บความสดกลับบ้าน
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              เลือกรอบที่สวนเปิดรับ จองจำนวนผู้เข้าชมและแจ้งพาหนะล่วงหน้า
              ติดตามผลการอนุมัติได้จากบัญชีของคุณ
            </p>
            <Link href="/visits" className="mt-6 inline-flex">
              <Button>
                ดูรอบเที่ยวสวน
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {availableVisitSlots.slice(0, 3).map((slot, index) => (
              <Link
                key={slot.id}
                href={`/visits?sellerId=${slot.sellerId}`}
                className="flex items-center gap-3 p-4 hover:bg-surface-muted sm:gap-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-soft font-display text-sm font-extrabold text-[#725214]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold">
                    {sellers.find((seller) => seller.userId === slot.sellerId)
                      ?.farmName ?? "สวน"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDateTime(slot.startAt)} · รับ {slot.capacity} คน
                  </p>
                </div>
                <ArrowRight className="ml-auto shrink-0 text-muted" size={18} />
              </Link>
            ))}
            {!availableVisitSlots.length ? (
              <p className="p-8 text-center text-sm text-muted">
                ยังไม่มีรอบเที่ยวชมสวน
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </StoreShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="text-sm font-bold text-primary">{eyebrow}</span>
        <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="focus-ring hidden items-center gap-1 rounded-md px-2 py-1 text-sm font-bold text-primary hover:bg-surface-muted sm:flex"
      >
        ดูทั้งหมด
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
