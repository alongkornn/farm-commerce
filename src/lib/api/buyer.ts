import { apiRequest } from "@/lib/api/client";
import type {
  Address,
  ApiEnvelope,
  Booking,
  CartItem,
  Notification,
  Order,
  Product,
} from "@/lib/types";

type Token = string;

export async function getProfile(token: Token) {
  return apiRequest<ApiEnvelope<unknown>>("/account/profile", { token });
}

export async function updateProfile(
  token: Token,
  payload: { firstName: string; lastName: string; phone: string },
) {
  return apiRequest<ApiEnvelope<unknown>>("/account/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getCart(token: Token) {
  const response = await apiRequest<ApiEnvelope<CartItem[]>>("/cart", { token });
  return response.data;
}

export async function addToCart(
  token: Token,
  payload: { productId: string; quantity: number },
) {
  return apiRequest<ApiEnvelope<CartItem>>("/cart", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(token: Token, id: string) {
  return apiRequest<void>(`/cart/${id}`, { method: "DELETE", token });
}

export async function checkout(
  token: Token,
  payload: { addressId: string; idempotencyKey: string; couponCode?: string },
) {
  return apiRequest<ApiEnvelope<Order>>("/orders/checkout", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getOrders(token: Token) {
  const response = await apiRequest<ApiEnvelope<Order[]>>("/orders", { token });
  return response.data;
}

export async function createBooking(
  token: Token,
  payload: {
    slotId: string;
    visitorCount: number;
    vehicle: string;
    bookerName: string;
  },
) {
  return apiRequest<ApiEnvelope<Booking>>("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getBookings(token: Token) {
  const response = await apiRequest<ApiEnvelope<Booking[]>>("/bookings", {
    token,
  });
  return response.data;
}

export async function cancelBooking(token: Token, id: string) {
  return apiRequest<void>(`/bookings/${id}`, { method: "DELETE", token });
}

export async function getAddresses(token: Token) {
  const response = await apiRequest<ApiEnvelope<Address[]>>("/addresses", {
    token,
  });
  return response.data;
}

export async function createAddress(
  token: Token,
  payload: Omit<Address, "id">,
) {
  return apiRequest<ApiEnvelope<Address>>("/addresses", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(
  token: Token,
  id: string,
  payload: Omit<Address, "id">,
) {
  return apiRequest<ApiEnvelope<Address>>(`/addresses/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(token: Token, id: string) {
  return apiRequest<void>(`/addresses/${id}`, { method: "DELETE", token });
}

export async function getFavorites(token: Token) {
  const response = await apiRequest<ApiEnvelope<Product[]>>("/favorites", {
    token,
  });
  return response.data;
}

export async function addFavorite(token: Token, productId: string) {
  return apiRequest<void>(`/favorites/${productId}`, { method: "POST", token });
}

export async function removeFavorite(token: Token, productId: string) {
  return apiRequest<void>(`/favorites/${productId}`, {
    method: "DELETE",
    token,
  });
}

export async function getNotifications(token: Token) {
  const response = await apiRequest<ApiEnvelope<Notification[]>>(
    "/notifications",
    { token },
  );
  return response.data;
}

export async function markNotificationRead(token: Token, id: string) {
  return apiRequest<void>(`/notifications/${id}/read`, {
    method: "PATCH",
    token,
  });
}

export async function requestRefund(
  token: Token,
  orderId: string,
  reason: string,
) {
  return apiRequest<ApiEnvelope<unknown>>(`/orders/${orderId}/refunds`, {
    method: "POST",
    token,
    body: JSON.stringify({ reason }),
  });
}
