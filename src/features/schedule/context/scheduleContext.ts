"use client";

import { createContext, useContext } from "react";

import type { Course, SelectedEntry } from "@/shared/types/schedule";

export interface ScheduleContextValue {
  readonly selectedEntries: readonly SelectedEntry[];
  readonly totalUnits: number;
  readonly selectedCount: number;
  readonly isEmpty: boolean;
  getSelectedSectionId(courseId: string): string | undefined;
  isSectionSelected(courseId: string, sectionId: string): boolean;
  isCourseSelected(courseId: string): boolean;
  selectSection(courseId: string, sectionId: string): void;
  removeSection(courseId: string): void;
  clearSelections(): void;
}

export const ScheduleContext = createContext<ScheduleContextValue | null>(null);

export function useSchedule(): ScheduleContextValue {
  const context = useContext(ScheduleContext);
  if (context === null) {
    throw new Error("useSchedule must be used within a <ScheduleProvider>.");
  }
  return context;
}

export type { Course };