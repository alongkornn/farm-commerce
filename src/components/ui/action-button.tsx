"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ActionButton({
  message,
  onClick,
  ...props
}: ComponentProps<typeof Button> & { message: string }) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toast.success(message);
      }}
    />
  );
}
