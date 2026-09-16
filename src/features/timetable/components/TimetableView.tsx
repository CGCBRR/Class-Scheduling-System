"use client";

import { useMemo } from "react";

import { useSchedule } from "@/features/schedule/context/scheduleContext";
import { EmptyState } from "@/shared/ui/EmptyState";

import { buildTimetableGrid } from "../lib/buildTimetableGrid";
import { TimetableGrid } from "./TimetableGrid";

export function TimetableView() {
  const { selectedEntries, isEmpty } = useSchedule();

  const blocks = useMemo(
    () => buildTimetableGrid(selectedEntries),
    [selectedEntries],
  );

  return (
    <section aria-label="Weekly timetable" className="flex flex-col gap-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Weekly timetable
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Mon–Sat · 07:00–20:00
        </span>
      </header>

      {isEmpty ? (
        <EmptyState
          title="Nothing scheduled yet"
          description="Your timetable will appear here once you select sections."
        />
      ) : (
        <TimetableGrid blocks={blocks} />
      )}
    </section>
  );
}