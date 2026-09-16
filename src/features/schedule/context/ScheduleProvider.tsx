"use client";

import { useCallback, useMemo, useReducer, type ReactNode } from "react";

import type { Course, SelectedEntry } from "@/shared/types/schedule";

import { ScheduleContext, type ScheduleContextValue } from "./scheduleContext";
import {
  initialScheduleState,
  scheduleReducer,
} from "./scheduleReducer";

interface ScheduleProviderProps {
  readonly courses: readonly Course[];
  readonly children: ReactNode;
}

export function ScheduleProvider({
  courses,
  children,
}: ScheduleProviderProps) {
  const [state, dispatch] = useReducer(scheduleReducer, initialScheduleState);

  const { selections } = state;

  const getSelectedSectionId = useCallback(
    (courseId: string): string | undefined => selections[courseId],
    [selections],
  );

  const isSectionSelected = useCallback(
    (courseId: string, sectionId: string): boolean =>
      selections[courseId] === sectionId,
    [selections],
  );

  const isCourseSelected = useCallback(
    (courseId: string): boolean => courseId in selections,
    [selections],
  );

  const selectSection = useCallback(
    (courseId: string, sectionId: string): void => {
      dispatch({ type: "SELECT_SECTION", courseId, sectionId });
    },
    [],
  );

  const removeSection = useCallback((courseId: string): void => {
    dispatch({ type: "REMOVE_SECTION", courseId });
  }, []);

  const clearSelections = useCallback((): void => {
    dispatch({ type: "CLEAR_SELECTIONS" });
  }, []);

  const selectedEntries = useMemo<readonly SelectedEntry[]>(() => {
    const entries: SelectedEntry[] = [];

    for (const course of courses) {
      const sectionId = selections[course.id];
      if (sectionId === undefined) continue;

      const section = course.sections.find((s) => s.id === sectionId);
      if (section === undefined) continue;

      entries.push({ course, section });
    }

    return entries;
  }, [courses, selections]);

  const totalUnits = useMemo(
    () => selectedEntries.reduce((sum, entry) => sum + entry.course.units, 0),
    [selectedEntries],
  );

  const value = useMemo<ScheduleContextValue>(
    () => ({
      selectedEntries,
      totalUnits,
      selectedCount: selectedEntries.length,
      isEmpty: selectedEntries.length === 0,
      getSelectedSectionId,
      isSectionSelected,
      isCourseSelected,
      selectSection,
      removeSection,
      clearSelections,
    }),
    [
      selectedEntries,
      totalUnits,
      getSelectedSectionId,
      isSectionSelected,
      isCourseSelected,
      selectSection,
      removeSection,
      clearSelections,
    ],
  );

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}