"use client";

import { Button as SharedButton } from "@saas-maker/ui/components/button";
import { Input as SharedInput } from "@saas-maker/ui/components/input";
import { cn } from "@saas-maker/ui/utils";
import type { ComponentProps } from "react";

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@saas-maker/ui/components/table";

export function Button({
  className = "button",
  variant = className.includes("secondary")
    ? "outline"
    : className.includes("text-button")
      ? "link"
      : "brand",
  ...props
}: ComponentProps<typeof SharedButton>) {
  return <SharedButton variant={variant} className={className} {...props} />;
}

export function Input(props: ComponentProps<typeof SharedInput>) {
  return <SharedInput {...props} />;
}

// Keep native showModal(), Escape, focus restoration and form behavior.
export function Dialog({ className, ...props }: ComponentProps<"dialog">) {
  return <dialog className={cn("connect-dialog", className)} {...props} />;
}

// The existing labeled nav retains its link order and aria-current contract.
export function NavLink(props: ComponentProps<typeof SharedButton>) {
  return (
    <SharedButton asChild variant="ghost" className="nav-link" {...props} />
  );
}
