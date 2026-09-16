"use client";

import { Input } from "@/shared/ui/Input";

export interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="course-search" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
        Search courses
      </label>
      <Input
        id="course-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by course code or title…"
        autoComplete="off"
        aria-describedby="course-search-status"
      />
      <p
        id="course-search-status"
        role="status"
        aria-live="polite"
        className="text-xs text-neutral-500 dark:text-neutral-400"
      >
        {resultCount === 1 ? "1 course" : `${resultCount} courses`}
      </p>
    </div>
  );
}