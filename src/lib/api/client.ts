import type { ApiEnvelope, AuthResponse } from "@/lib/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api-dev.nexdev-tech.com/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new ApiError(
      payload?.message ?? "ไม่สามารถดำเนินการได้",
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const response = await apiRequest<ApiEnvelope<AuthResponse>>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response.data;
}

export async function register(
  role: "buyer" | "seller",
  payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  },
) {
  const response = await apiRequest<ApiEnvelope<AuthResponse>>(
    `/register/${role}`,
    { method: "POST", body: JSON.stringify(payload) },
  );
  return response.data;
}
