"use client";

import { memo, useState } from "react";

import { Badge } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import type { Course } from "@/shared/types/schedule";

import { SectionRow } from "./SectionRow";

export interface CourseCardProps {
  readonly course: Course;
  readonly selectedSectionId: string | undefined;
  readonly onToggleSection: (courseId: string, sectionId: string) => void;
}

function CourseCardBase({
  course,
  selectedSectionId,
  onToggleSection,
}: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSelection = selectedSectionId !== undefined;
  const sectionCount = course.sections.length;

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls={`course-${course.id}-sections`}
        className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-neutral-800/50"
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {course.code}
            </span>
            <Badge tone={hasSelection ? "success" : "neutral"}>
              {course.units} {course.units === 1 ? "unit" : "units"}
            </Badge>
            {hasSelection && (
              <Badge tone="accent">In schedule</Badge>
            )}
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {course.title}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            {sectionCount} {sectionCount === 1 ? "section" : "sections"} available
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`mt-1 shrink-0 text-neutral-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {isExpanded && (
        <div
          id={`course-${course.id}-sections`}
          className="flex flex-col gap-2 border-t border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40"
        >
          {course.sections.map((section) => (
            <SectionRow
              key={section.id}
              section={section}
              isSelected={section.id === selectedSectionId}
              onToggle={(sectionId) => onToggleSection(course.id, sectionId)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export const CourseCard = memo(CourseCardBase);
CourseCard.displayName = "CourseCard";