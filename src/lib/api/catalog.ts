import { apiRequest } from "@/lib/api/client";
import type {
  ApiEnvelope,
  Product,
  ProductPage,
  SellerProfile,
  VisitSlot,
  Review,
} from "@/lib/types";

export type ProductFilters = {
  search?: string;
  category?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export async function getProducts(filters: ProductFilters = {}) {
  const response = await apiRequest<ApiEnvelope<ProductPage>>(
    `/products${queryString(filters)}`,
  );
  return response.data;
}

export async function getProduct(id: string) {
  const response = await apiRequest<ApiEnvelope<Product>>(`/products/${id}`);
  return response.data;
}

export async function getSellers() {
  const response =
    await apiRequest<ApiEnvelope<SellerProfile[]>>("/sellers");
  return response.data;
}

export async function getSeller(id: string) {
  const response = await apiRequest<ApiEnvelope<SellerProfile>>(
    `/sellers/${id}`,
  );
  return response.data;
}

export async function getSellerProducts(id: string) {
  const response = await apiRequest<ApiEnvelope<Product[]>>(
    `/sellers/${id}/products`,
  );
  return response.data;
}

export async function getVisitSlots(sellerId?: string) {
  const response = await apiRequest<ApiEnvelope<VisitSlot[]>>(
    `/visit-slots${queryString({ sellerId })}`,
  );
  return response.data;
}

export async function getReviews(productId: string) {
  const response = await apiRequest<ApiEnvelope<Review[]>>(
    `/products/${productId}/reviews`,
  );
  return response.data;
}
