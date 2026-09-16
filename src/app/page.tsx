import { CourseCatalog } from "@/features/course-catalog";
import { SchedulePanel } from "@/features/schedule";
import { TimetableView } from "@/features/timetable";

import { ScheduleProviderWithCourses } from "./providers";

export default function HomePage() {
  return (
    <ScheduleProviderWithCourses>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Class Scheduling System
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Build your weekly schedule
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Left: catalog (40% at lg+) */}
            <div className="min-w-0">
              <CourseCatalog />
            </div>

            {/* Right: schedule + timetable (60% at lg+), sticky on desktop */}
            <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
              <SchedulePanel />
              <TimetableView />
            </div>
          </div>
        </main>
      </div>
    </ScheduleProviderWithCourses>
  );
}