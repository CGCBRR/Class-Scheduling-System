"use client";

import { useMemo, useState } from "react";

//import { DAY_INDEX } from "@/shared/lib/days";
import type { Course, Day } from "@/shared/types/schedule";

export interface CourseFilters {
  readonly query: string;
  readonly day: Day | null;
  readonly selectedOnly: boolean;
}

export interface UseCourseFiltersResult {
  readonly filters: CourseFilters;
  readonly setQuery: (query: string) => void;
  readonly setDay: (day: Day | null) => void;
  readonly setSelectedOnly: (selectedOnly: boolean) => void;
  readonly resetFilters: () => void;
  readonly filteredCourses: readonly Course[];
  readonly hasActiveFilters: boolean;
}

const INITIAL_FILTERS: CourseFilters = {
  query: "",
  day: null,
  selectedOnly: false,
};

interface UseCourseFiltersOptions {
  readonly courses: readonly Course[];
  readonly selectedCourseIds: ReadonlySet<string>;
}

export function useCourseFilters({
  courses,
  selectedCourseIds,
}: UseCourseFiltersOptions): UseCourseFiltersResult {
  const [filters, setFilters] = useState<CourseFilters>(INITIAL_FILTERS);

  const setQuery = (query: string) =>
    setFilters((prev) => ({ ...prev, query }));

  const setDay = (day: Day | null) =>
    setFilters((prev) => ({ ...prev, day }));

  const setSelectedOnly = (selectedOnly: boolean) =>
    setFilters((prev) => ({ ...prev, selectedOnly }));

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.day !== null ||
    filters.selectedOnly;

  const filteredCourses = useMemo(() => {
    const needle = filters.query.trim().toLowerCase();

    return courses.filter((course) => {
      if (filters.selectedOnly && !selectedCourseIds.has(course.id)) {
        return false;
      }

      if (filters.day !== null) {
        const hasDay = course.sections.some((section) =>
          section.schedule.some((block) => block.day === filters.day),
        );
        if (!hasDay) return false;
      }

      if (needle !== "") {
        const matches =
          course.code.toLowerCase().includes(needle) ||
          course.title.toLowerCase().includes(needle);
        if (!matches) return false;
      }

      return true;
    });
  }, [courses, filters.query, filters.day, filters.selectedOnly, selectedCourseIds]);

  return {
    filters,
    setQuery,
    setDay,
    setSelectedOnly,
    resetFilters,
    filteredCourses,
    hasActiveFilters,
  };
}