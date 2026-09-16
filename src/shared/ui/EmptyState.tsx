import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-neutral-700",
        className,
      )}
    >
      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {title}
      </p>
      {description !== undefined && (
        <p className="max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}