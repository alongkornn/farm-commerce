"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResourceState } from "@/components/ui/resource-state";
import { useAuth } from "@/features/auth/auth-provider";
import type { Review } from "@/lib/types";
import { useApiResource } from "@/lib/use-api-resource";
import { formatDateTime } from "@/lib/utils";

export function ProductReviews({ productId }: { productId: string }) {
  const { user, request } = useAuth();
  const resource = useApiResource<Review[]>(
    `/products/${productId}/reviews`,
    [],
    true,
    false,
  );
  const [rating, setRating] = useState(5);

  return (
    <section className="mt-14 border-t border-border pt-8">
      <h2 className="text-2xl font-extrabold">รีวิวสินค้า</h2>
      {user?.userType === "buyer" ? (
        <form
          className="mt-5 grid max-w-xl gap-3 rounded-lg border border-border bg-surface p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            try {
              await request(`/products/${productId}/reviews`, {
                method: "POST",
                body: JSON.stringify({
                  rating,
                  comment: data.get("comment"),
                }),
              });
              event.currentTarget.reset();
              await resource.reload();
              toast.success("บันทึกรีวิวแล้ว");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "รีวิวไม่สำเร็จ",
              );
            }
          }}
        >
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} ดาว`}
                className="text-accent"
              >
                <Star size={22} fill={value <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            name="comment"
            placeholder="เขียนความคิดเห็น"
            className="focus-ring min-h-24 rounded-md border border-border p-3 text-sm"
          />
          <Button type="submit" className="justify-self-start">
            บันทึกรีวิว
          </Button>
        </form>
      ) : null}
      <ResourceState {...resource} onRetry={resource.reload} />
      {!resource.loading && !resource.error ? (
        <div className="mt-5 grid gap-3">
          {resource.data.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="font-bold text-accent">{"★".repeat(review.rating)}</p>
              <p className="mt-2 text-sm">{review.comment || "ไม่มีความคิดเห็น"}</p>
              <p className="mt-2 text-xs text-muted">
                {formatDateTime(review.createdAt)}
              </p>
            </article>
          ))}
          {!resource.data.length ? (
            <p className="text-sm text-muted">ยังไม่มีรีวิว</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
