import { apiRequest } from "@/lib/api/client";
import type {
  ApiEnvelope,
  Coupon,
  Payout,
  Refund,
  SellerProfile,
} from "@/lib/types";

type Token = string;

export async function getPendingSellers(token: Token) {
  const response = await apiRequest<ApiEnvelope<SellerProfile[]>>(
    "/admin/sellers/pending",
    { token },
  );
  return response.data;
}

export async function updateSellerApproval(
  token: Token,
  id: string,
  payload: { status: string; note?: string },
) {
  return apiRequest<void>(`/admin/sellers/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getCoupons(token: Token) {
  const response = await apiRequest<ApiEnvelope<Coupon[]>>("/admin/coupons", {
    token,
  });
  return response.data;
}

export async function createCoupon(
  token: Token,
  payload: {
    code: string;
    discountType: "percent" | "fixed";
    discountValue: number;
    minimumSatang: number;
    maximumDiscount: number;
    usageLimit: number;
    startsAt: string;
    endsAt: string;
  },
) {
  return apiRequest<ApiEnvelope<Coupon>>("/admin/coupons", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getRefunds(token: Token) {
  const response = await apiRequest<ApiEnvelope<Refund[]>>("/admin/refunds", {
    token,
  });
  return response.data;
}

export async function updateRefundStatus(
  token: Token,
  id: string,
  status: string,
) {
  return apiRequest<void>(`/admin/refunds/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function runPayouts(token: Token) {
  return apiRequest<ApiEnvelope<Payout[]>>("/admin/payouts/run", {
    method: "POST",
    token,
  });
}
