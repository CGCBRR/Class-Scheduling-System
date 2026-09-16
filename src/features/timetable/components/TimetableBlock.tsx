"use client";

import { memo } from "react";
import { formatTimeRange, minutesToTime } from "@/shared/lib/time";
import type { TimetableBlockData } from "../lib/buildTimetableGrid";

export interface TimetableBlockProps {
  readonly block: TimetableBlockData;
  readonly pixelsPerMinute: number;
  readonly dayStartMinutes: number;
}

function TimetableBlockBase({
  block,
  pixelsPerMinute,
  dayStartMinutes,
}: TimetableBlockProps) {
  const top = (block.startMinutes - dayStartMinutes) * pixelsPerMinute;
  const height = (block.endMinutes - block.startMinutes) * pixelsPerMinute;

  const tooltip = `${block.courseCode} ${block.sectionLabel} · ${block.room} · ${block.instructor} · ${formatTimeRange(
    minutesToTime(block.startMinutes),
    minutesToTime(block.endMinutes),
  )}`;

  return (
    <div
      title={tooltip}
      className="absolute left-1 right-1 overflow-hidden rounded-md border border-blue-500 bg-blue-100 p-1.5 text-blue-950 shadow-sm dark:border-blue-500 dark:bg-blue-950 dark:text-blue-100"
      style={{ top, height }}
    >
      <p className="truncate text-xs font-semibold leading-tight">
        {block.courseCode}
      </p>
      <p className="truncate text-[10px] leading-tight opacity-80">
        {block.sectionLabel} · {block.room}
      </p>
      <p className="truncate text-[10px] leading-tight opacity-70">
        {block.instructor}
      </p>
    </div>
  );
}

export const TimetableBlock = memo(TimetableBlockBase);
TimetableBlock.displayName = "TimetableBlock";