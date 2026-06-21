"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockCartItems } from "@/lib/mock-data";
import type { CartItem, Product } from "@/lib/types";

type CommerceContextValue = {
  cart: CartItem[];
  favorites: string[];
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => boolean;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const STORAGE_KEY = "farm-commerce-demo-data";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(mockCartItems);
  const [favorites, setFavorites] = useState<string[]>(["p-1", "p-2", "p-3"]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as {
          cart?: CartItem[];
          favorites?: string[];
        };
        if (data.cart) setCart(data.cart);
        if (data.favorites) setFavorites(data.favorites);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart, favorites }),
      );
    }
  }, [cart, favorites, hydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((items) => {
      const existing = items.find((item) => item.productId === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: Math.min(product.stock, item.quantity + quantity),
              }
            : item,
        );
      }
      return [
        ...items,
        {
          id: `cart-${product.id}`,
          productId: product.id,
          quantity: Math.min(product.stock, quantity),
          product,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.product.stock, quantity)),
            }
          : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((items) => items.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    let added = false;
    setFavorites((items) => {
      if (items.includes(productId)) {
        return items.filter((id) => id !== productId);
      }
      added = true;
      return [...items, productId];
    });
    return added;
  }, []);

  const value = useMemo(
    () => ({
      cart,
      favorites,
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
    }),
    [
      addToCart,
      cart,
      clearCart,
      favorites,
      hydrated,
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
