"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResourceState({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="grid min-h-48 place-items-center text-primary">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center">
        <AlertCircle className="text-danger" />
        <p className="mt-3 font-bold">โหลดข้อมูลไม่สำเร็จ</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
        <Button className="mt-4" size="sm" variant="outline" onClick={onRetry}>
          ลองอีกครั้ง
        </Button>
      </div>
    );
  }
  return null;
}
