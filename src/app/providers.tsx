"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

import { ScheduleProvider } from "@/features/schedule";
import type { Course } from "@/shared/types/schedule";

import { useCourses } from "@/features/course-catalog";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

interface ScheduleProviderWithCoursesProps {
  readonly children: ReactNode;
}

export function ScheduleProviderWithCourses({
  children,
}: ScheduleProviderWithCoursesProps) {
  const { data: courses } = useCourses();
  const resolvedCourses: readonly Course[] = courses ?? [];

  return (
    <ScheduleProvider courses={resolvedCourses}>{children}</ScheduleProvider>
  );
}