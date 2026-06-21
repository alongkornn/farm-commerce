import { apiRequest } from "@/lib/api/client";
import type {
  ApiEnvelope,
  Booking,
  Order,
  Product,
  SellerProfile,
  VisitSlot,
} from "@/lib/types";

type Token = string;

export async function updateSellerProfile(
  token: Token,
  payload: Pick<SellerProfile, "farmName" | "description" | "address">,
) {
  return apiRequest<ApiEnvelope<SellerProfile>>("/seller/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getSellerProducts(token: Token) {
  const response = await apiRequest<ApiEnvelope<Product[]>>("/seller/products", {
    token,
  });
  return response.data;
}

export async function createProduct(
  token: Token,
  payload: {
    sku: string;
    name: string;
    category: string;
    priceSatang: number;
    size: string;
    stock: number;
    imageUrls: string[];
    description: string;
  },
) {
  return apiRequest<ApiEnvelope<Product>>("/seller/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  token: Token,
  id: string,
  payload: Partial<Product>,
) {
  return apiRequest<ApiEnvelope<Product>>(`/seller/products/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(token: Token, id: string) {
  return apiRequest<void>(`/seller/products/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function setProductStatus(
  token: Token,
  id: string,
  active: boolean,
) {
  return apiRequest<void>(`/seller/products/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ active }),
  });
}

export async function getSellerOrders(token: Token) {
  const response = await apiRequest<ApiEnvelope<Order[]>>("/seller/orders", {
    token,
  });
  return response.data;
}

export async function updateOrderStatus(
  token: Token,
  id: string,
  payload: {
    status: string;
    shippingProvider?: string;
    trackingNumber?: string;
    note?: string;
  },
) {
  return apiRequest<void>(`/seller/orders/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getSellerBookings(token: Token) {
  const response = await apiRequest<ApiEnvelope<Booking[]>>("/seller/bookings", {
    token,
  });
  return response.data;
}

export async function updateBookingStatus(
  token: Token,
  id: string,
  status: string,
) {
  return apiRequest<void>(`/seller/bookings/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function checkInBooking(token: Token, checkInCode: string) {
  return apiRequest<void>("/seller/bookings/check-in", {
    method: "POST",
    token,
    body: JSON.stringify({ checkInCode }),
  });
}

export async function getSellerVisitSlots(token: Token) {
  const response = await apiRequest<ApiEnvelope<VisitSlot[]>>(
    "/seller/visit-slots",
    { token },
  );
  return response.data;
}

export async function createVisitSlot(
  token: Token,
  payload: { startAt: string; endAt: string; capacity: number },
) {
  return apiRequest<ApiEnvelope<VisitSlot>>("/seller/visit-slots", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getSellerDashboard(token: Token) {
  const response = await apiRequest<ApiEnvelope<unknown>>("/seller/dashboard", {
    token,
  });
  return response.data;
}

export async function getSellerPayouts(token: Token) {
  const response = await apiRequest<ApiEnvelope<unknown[]>>("/seller/payouts", {
    token,
  });
  return response.data;
}
