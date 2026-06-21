"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/features/catalog/product-card";
import type { Product } from "@/lib/types";

export function ProductExplorer({
  products,
  initialSearch = "",
  initialCategory = "",
}: {
  products: Product[];
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = Array.from(new Set(products.map((item) => item.category)));

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("th");
    const result = products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!query ||
          product.name.toLocaleLowerCase("th").includes(query) ||
          product.description.toLocaleLowerCase("th").includes(query)),
    );

    return result.toSorted((a, b) => {
      if (sort === "price-asc") return a.priceSatang - b.priceSatang;
      if (sort === "price-desc") return b.priceSatang - a.priceSatang;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, products, search, sort]);

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อผลไม้หรือรายละเอียด"
          aria-label="ค้นหาสินค้า"
          className="sm:flex-1"
        />
        <Button
          variant="outline"
          className="sm:hidden"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal size={18} />
          ตัวกรอง
        </Button>
        <div
          className={`${filtersOpen ? "grid" : "hidden"} gap-3 sm:flex sm:shrink-0`}
        >
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="ประเภทสินค้า"
            className="focus-ring h-11 rounded-md border border-border bg-surface px-3 text-sm"
          >
            <option value="">ทุกประเภท</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="เรียงสินค้า"
            className="focus-ring h-11 rounded-md border border-border bg-surface px-3 text-sm"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price-asc">ราคาน้อยไปมาก</option>
            <option value="price-desc">ราคามากไปน้อย</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          พบ <strong className="text-foreground">{filtered.length}</strong>{" "}
          รายการ
        </p>
        {search || category ? (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="focus-ring flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-danger hover:bg-[#f6ded8]"
          >
            <X size={14} />
            ล้างตัวกรอง
          </button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-surface px-5 py-16 text-center">
          <p className="font-bold">
            {products.length
              ? "ไม่พบสินค้าที่ตรงกับตัวกรอง"
              : "ยังไม่มีสินค้าใน environment นี้"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {products.length
              ? "ลองเปลี่ยนคำค้นหาหรือเลือกประเภทอื่น"
              : "เชื่อมต่อ API สำเร็จแล้ว รอเจ้าของสวนเพิ่มสินค้าและเปิดขาย"}
          </p>
        </div>
      )}
    </div>
  );
}
