"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCourses } from "@/shared/data/fetchCourses";
import type { Course } from "@/shared/types/schedule";

export const COURSES_QUERY_KEY = ["courses"] as const;

export function useCourses() {
  return useQuery<readonly Course[], Error>({
    queryKey: COURSES_QUERY_KEY,
    queryFn: fetchCourses,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}