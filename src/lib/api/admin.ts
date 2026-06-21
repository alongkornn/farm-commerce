import { apiRequest } from "@/lib/api/client";
import type { ApiEnvelope, SellerProfile } from "@/lib/types";

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
  payload: { status: string; reviewNote?: string },
) {
  return apiRequest<void>(`/admin/sellers/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getCoupons(token: Token) {
  const response = await apiRequest<ApiEnvelope<unknown[]>>("/admin/coupons", {
    token,
  });
  return response.data;
}

export async function createCoupon(token: Token, payload: object) {
  return apiRequest<ApiEnvelope<unknown>>("/admin/coupons", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getRefunds(token: Token) {
  const response = await apiRequest<ApiEnvelope<unknown[]>>("/admin/refunds", {
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
  return apiRequest<ApiEnvelope<unknown>>("/admin/payouts/run", {
    method: "POST",
    token,
  });
}
