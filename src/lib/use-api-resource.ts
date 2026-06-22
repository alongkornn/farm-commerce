"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { apiRequest } from "@/lib/api/client";

export function useApiResource<T>(
  path: string,
  initialValue: T,
  enabled = true,
  authRequired = true,
) {
  const { request, accessToken } = useAuth();
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!enabled || (authRequired && !accessToken)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = authRequired
        ? await request<{ data: T }>(path)
        : await apiRequest<{ data: T }>(path);
      setData(response.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ไม่สามารถโหลดข้อมูลได้",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, authRequired, enabled, path, request]);

  useEffect(() => {
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  return { data, setData, loading, error, reload };
}
