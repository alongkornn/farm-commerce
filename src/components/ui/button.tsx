import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-white hover:bg-primary-strong": variant === "primary",
          "bg-accent text-[#332400] hover:bg-[#d99a17]":
            variant === "secondary",
          "border border-border bg-surface hover:border-primary/40 hover:bg-surface-muted":
            variant === "outline",
          "hover:bg-surface-muted": variant === "ghost",
          "bg-danger text-white hover:bg-[#973c2d]": variant === "danger",
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-4 text-sm": size === "md",
          "h-12 px-5 text-base": size === "lg",
          "size-10 p-0": size === "icon",
        },
        className,
      )}
      {...props}
    />
  );
}
