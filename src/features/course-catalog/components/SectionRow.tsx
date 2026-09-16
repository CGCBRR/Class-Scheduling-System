"use client";

import { memo } from "react";

import { cn } from "@/shared/lib/cn";
import { formatTimeRange } from "@/shared/lib/time";
import type { Section } from "@/shared/types/schedule";
import { Badge } from "@/shared/ui/Badge";

export interface SectionRowProps {
  readonly section: Section;
  readonly isSelected: boolean;
  readonly onToggle: (sectionId: string) => void;
}

function SectionRowBase({ section, isSelected, onToggle }: SectionRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(section.id)}
      aria-pressed={isSelected}
      className={cn(
        "flex w-full flex-col gap-2 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone={isSelected ? "accent" : "neutral"}>
            {section.section}
          </Badge>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {section.room}
          </span>
        </div>
        {isSelected && (
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            ✓ Selected
          </span>
        )}
      </div>

      <p className="text-xs text-neutral-700 dark:text-neutral-300">
        {section.instructor}
      </p>

      <ul className="flex flex-col gap-0.5">
        {section.schedule.map((block) => (
          <li
            key={`${block.day}-${block.startTime}`}
            className="text-xs text-neutral-600 dark:text-neutral-400"
          >
            {block.day} · {formatTimeRange(block.startTime, block.endTime)}
          </li>
        ))}
      </ul>
    </button>
  );
}

export const SectionRow = memo(SectionRowBase);
SectionRow.displayName = "SectionRow";