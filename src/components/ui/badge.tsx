import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        {
          "bg-surface-muted text-foreground": tone === "neutral",
          "bg-[#dcebdc] text-[#225333]": tone === "success",
          "bg-accent-soft text-[#725214]": tone === "warning",
          "bg-[#f6ded8] text-danger": tone === "danger",
          "bg-[#dcebf0] text-info": tone === "info",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
