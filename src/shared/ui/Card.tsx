import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

const BASE_CLASSES =
  "rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900";

export function Card({ className, ...props }: CardProps) {
  return <div className={cn(BASE_CLASSES, className)} {...props} />;
}