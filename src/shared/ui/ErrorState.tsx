import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/40",
        className,
      )}
    >
      <p className="text-sm font-medium text-red-900 dark:text-red-200">
        {title}
      </p>
      <p className="max-w-sm text-xs text-red-700 dark:text-red-300">
        {message}
      </p>
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}