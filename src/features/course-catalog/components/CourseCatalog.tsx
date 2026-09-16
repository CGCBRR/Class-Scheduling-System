"use client";

import { useCallback, useMemo } from "react";

import { useSchedule } from "@/features/schedule/context/scheduleContext";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Spinner } from "@/shared/ui/Spinner";

import { useCourseFilters } from "../hooks/useCourseFilters";
import { useCourses } from "../hooks/useCourses";
import { CourseCard } from "./CourseCard";
import { FilterBar } from "./FilterBar";
import { SearchBar } from "./SearchBar";
import type { Course } from "@/shared/types/schedule";

export function CourseCatalog() {
  const coursesQuery = useCourses();
  const schedule = useSchedule();

  const courses = coursesQuery.data ?? [];

  const selectedCourseIds = useMemo<ReadonlySet<string>>(() => {
    return new Set(schedule.selectedEntries.map((entry) => entry.course.id));
  }, [schedule.selectedEntries]);

  const {
    filters,
    setQuery,
    setDay,
    setSelectedOnly,
    resetFilters,
    filteredCourses,
    hasActiveFilters,
  } = useCourseFilters({ courses, selectedCourseIds });

  const handleToggleSection = useCallback(
    (courseId: string, sectionId: string) => {
      const isCurrent = schedule.getSelectedSectionId(courseId) === sectionId;
      if (isCurrent) {
        schedule.removeSection(courseId);
      } else {
        schedule.selectSection(courseId, sectionId);
      }
    },
    [schedule],
  );

  return (
    <section className="flex h-full flex-col gap-4" aria-label="Course catalog">
      <header className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Courses
        </h2>
        <SearchBar
          value={filters.query}
          onChange={setQuery}
          resultCount={filteredCourses.length}
        />
        <FilterBar
          day={filters.day}
          onDayChange={setDay}
          selectedOnly={filters.selectedOnly}
          onSelectedOnlyChange={setSelectedOnly}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </header>

      <div className="flex-1 min-h-0">
        <CatalogBody
          isLoading={coursesQuery.isLoading}
          isError={coursesQuery.isError}
          error={coursesQuery.error}
          onRetry={() => coursesQuery.refetch()}
          courses={courses}
          filteredCourses={filteredCourses}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          onToggleSection={handleToggleSection}
          getSelectedSectionId={schedule.getSelectedSectionId}
        />
      </div>
    </section>
  );
}

interface CatalogBodyProps {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
  readonly onRetry: () => void;
  readonly courses: readonly Course[];
  readonly filteredCourses: readonly Course[];
  readonly hasActiveFilters: boolean;
  readonly onResetFilters: () => void;
  readonly onToggleSection: (courseId: string, sectionId: string) => void;
  readonly getSelectedSectionId: (courseId: string) => string | undefined;
}

function CatalogBody({
  isLoading,
  isError,
  error,
  onRetry,
  courses,
  filteredCourses,
  hasActiveFilters,
  onResetFilters,
  onToggleSection,
  getSelectedSectionId,
}: CatalogBodyProps) {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner label="Loading courses" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Unable to load courses."}
        action={
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses available"
        description="The catalog is empty. Please check back later."
      />
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <EmptyState
        title="No courses match your filters"
        description="Try adjusting your search or clearing filters."
        action={
          hasActiveFilters ? (
            <Button variant="secondary" size="sm" onClick={onResetFilters}>
              Reset filters
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3 overflow-y-auto pr-1">
      {filteredCourses.map((course) => (
        <li key={course.id}>
          <CourseCard
            course={course}
            selectedSectionId={getSelectedSectionId(course.id)}
            onToggleSection={onToggleSection}
          />
        </li>
      ))}
    </ul>
  );
}