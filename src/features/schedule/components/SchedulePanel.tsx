"use client";

import { useCallback } from "react";

import { useSchedule } from "@/features/schedule/context/scheduleContext";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";

import { SelectedSectionCard } from "./SelectedSectionCard";

export function SchedulePanel() {
  const { selectedEntries, totalUnits, selectedCount, isEmpty, removeSection, clearSelections } =
    useSchedule();

  const handleRemove = useCallback(
    (courseId: string) => {
      removeSection(courseId);
    },
    [removeSection],
  );

  return (
    <section
      aria-label="Selected courses"
      className="flex flex-col gap-3"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Your schedule
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {selectedCount} {selectedCount === 1 ? "course" : "courses"} ·{" "}
            {totalUnits} {totalUnits === 1 ? "unit" : "units"}
          </span>
        </div>

        {!isEmpty && (
          <Button variant="ghost" size="sm" onClick={clearSelections}>
            Clear all
          </Button>
        )}
      </header>

      {isEmpty ? (
        <EmptyState
          title="No classes selected yet"
          description="Browse courses on the left and select a section to add it to your schedule."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {selectedEntries.map((entry) => (
            <SelectedSectionCard
              key={entry.section.id}
              entry={entry}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}