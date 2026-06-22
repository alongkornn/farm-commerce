"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/auth-provider";
import { CommerceProvider } from "@/features/commerce/commerce-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CommerceProvider>
          {children}
          <Toaster
            richColors
            closeButton
            duration={3000}
            position="top-right"
          />
        </CommerceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
