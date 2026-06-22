"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/features/auth/auth-provider";
import type { ApiEnvelope, CartItem, Product } from "@/lib/types";

type CommerceContextValue = {
  cart: CartItem[];
  cartCount: number;
  favorites: string[];
  hydrated: boolean;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  reload: () => Promise<void>;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const { user, hydrated: authHydrated, request } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isBuyer = user?.userType === "buyer";
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const reload = useCallback(async () => {
    if (!isBuyer) {
      setCart([]);
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const [cartResponse, favoriteResponse] = await Promise.all([
        request<ApiEnvelope<CartItem[]>>("/cart"),
        request<
          ApiEnvelope<Array<{ productId: string; product: Product }>>
        >("/favorites"),
      ]);
      setCart(cartResponse.data ?? []);
      setFavorites(
        (favoriteResponse.data ?? []).map((favorite) => favorite.productId),
      );
    } finally {
      setLoading(false);
    }
  }, [isBuyer, request]);

  useEffect(() => {
    if (!authHydrated) return;
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [authHydrated, reload]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (!isBuyer) throw new Error("กรุณาเข้าสู่ระบบด้วยบัญชีผู้ซื้อ");
      const existing = cart.find((item) => item.productId === product.id);
      const available = product.stock - (existing?.quantity ?? 0);
      if (available <= 0) throw new Error("สินค้าในตะกร้าครบจำนวนที่มีแล้ว");
      await request("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: Math.min(available, quantity),
        }),
      });
      await reload();
    },
    [cart, isBuyer, reload, request],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const item = cart.find((value) => value.id === itemId);
      if (!item) return;
      const target = Math.max(1, Math.min(item.product.stock, quantity));
      if (target === item.quantity) return;
      await request(`/cart/${item.id}`, { method: "DELETE" });
      await request("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: item.productId,
          quantity: target,
        }),
      });
      await reload();
    },
    [cart, reload, request],
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      await request(`/cart/${itemId}`, { method: "DELETE" });
      await reload();
    },
    [reload, request],
  );

  const clearCart = useCallback(async () => {
    await Promise.all(
      cart.map((item) =>
        request(`/cart/${item.id}`, { method: "DELETE" }),
      ),
    );
    await reload();
  }, [cart, reload, request]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!isBuyer) throw new Error("กรุณาเข้าสู่ระบบด้วยบัญชีผู้ซื้อ");
      const added = !favorites.includes(productId);
      await request(`/favorites/${productId}`, {
        method: added ? "POST" : "DELETE",
      });
      await reload();
      return added;
    },
    [favorites, isBuyer, reload, request],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      favorites,
      hydrated: authHydrated,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      reload,
    }),
    [
      addToCart,
      authHydrated,
      cart,
      cartCount,
      clearCart,
      favorites,
      loading,
      reload,
      removeFromCart,
      toggleFavorite,
      updateQuantity,
    ],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }
  return context;
}
