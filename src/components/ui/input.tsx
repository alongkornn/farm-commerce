import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-11 w-full rounded-md border border-border bg-surface px-3 text-sm placeholder:text-muted/70",
        className,
      )}
      {...props}
    />
  );
}
