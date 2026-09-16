import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export type BadgeTone = "neutral" | "accent" | "success";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  accent:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
};

const BASE_CLASSES =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(BASE_CLASSES, TONE_CLASSES[tone], className)}
      {...props}
    />
  );
}