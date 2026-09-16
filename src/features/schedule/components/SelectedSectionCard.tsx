"use client";

import { memo } from "react";

import { formatTimeRange } from "@/shared/lib/time";
import type { SelectedEntry } from "@/shared/types/schedule";
import { Badge } from "@/shared/ui/Badge";

export interface SelectedSectionCardProps {
  readonly entry: SelectedEntry;
  readonly onRemove: (courseId: string) => void;
}

function SelectedSectionCardBase({
  entry,
  onRemove,
}: SelectedSectionCardProps) {
  const { course, section } = entry;

  return (
    <li className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {course.code}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {course.title}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(course.id)}
          aria-label={`Remove ${course.code} from schedule`}
          className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{section.section}</Badge>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {section.room}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          · {section.instructor}
        </span>
      </div>

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
    </li>
  );
}

export const SelectedSectionCard = memo(SelectedSectionCardBase);
SelectedSectionCard.displayName = "SelectedSectionCard";