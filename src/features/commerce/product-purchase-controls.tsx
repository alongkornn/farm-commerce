"use client";

import { Heart, Minus, Plus, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCommerce } from "@/features/commerce/commerce-provider";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductPurchaseControls({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, favorites, toggleFavorite } = useCommerce();
  const favorite = favorites.includes(product.id);

  function changeQuantity(value: number) {
    setQuantity(Math.max(1, Math.min(product.stock, value)));
  }

  return (
    <>
      <div className="mt-6 border-y border-border py-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">จำนวน</span>
          <div className="flex items-center rounded-md border border-border">
            <button
              onClick={() => changeQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="grid size-10 place-items-center disabled:opacity-35"
              aria-label="ลดจำนวน"
            >
              <Minus size={17} />
            </button>
            <span className="grid w-11 place-items-center text-sm font-bold">
              {quantity}
            </span>
            <button
              onClick={() => changeQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
              className="grid size-10 place-items-center disabled:opacity-35"
              aria-label="เพิ่มจำนวน"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-right text-xs text-muted">
          มีสินค้าพร้อมขาย {product.stock} ชิ้น
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            addToCart(product, quantity);
            toast.success(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
          }}
        >
          <ShoppingBasket size={19} />
          เพิ่มลงตะกร้า
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn(favorite && "border-danger text-danger")}
          aria-label={
            favorite ? "นำออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"
          }
          onClick={() => {
            const added = toggleFavorite(product.id);
            toast.success(
              added ? "เพิ่มในรายการโปรดแล้ว" : "นำออกจากรายการโปรดแล้ว",
            );
          }}
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </Button>
      </div>
    </>
  );
}
