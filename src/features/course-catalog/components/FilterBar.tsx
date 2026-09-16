"use client";

import { DAYS_MON_SAT } from "@/shared/lib/days";
import { cn } from "@/shared/lib/cn";
import type { Day } from "@/shared/types/schedule";
import { Button } from "@/shared/ui/Button";

export interface FilterBarProps {
  readonly day: Day | null;
  readonly onDayChange: (day: Day | null) => void;
  readonly selectedOnly: boolean;
  readonly onSelectedOnlyChange: (selectedOnly: boolean) => void;
  readonly onReset: () => void;
  readonly hasActiveFilters: boolean;
}

const PILL_BASE =
  "h-7 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

const PILL_IDLE =
  "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800";

const PILL_ACTIVE =
  "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600";

export function FilterBar({
  day,
  onDayChange,
  selectedOnly,
  onSelectedOnlyChange,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Day
        </span>
        <button
          type="button"
          onClick={() => onDayChange(null)}
          className={cn(PILL_BASE, day === null ? PILL_ACTIVE : PILL_IDLE)}
          aria-pressed={day === null}
        >
          Any
        </button>
        {DAYS_MON_SAT.map((dayOption) => {
          const isActive = day === dayOption;
          return (
            <button
              key={dayOption}
              type="button"
              onClick={() => onDayChange(isActive ? null : dayOption)}
              className={cn(PILL_BASE, isActive ? PILL_ACTIVE : PILL_IDLE)}
              aria-pressed={isActive}
            >
              {dayOption.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={selectedOnly}
            onChange={(event) => onSelectedOnlyChange(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600"
          />
          Show only selected courses
        </label>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}