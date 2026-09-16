import type { Course } from "@/shared/types/schedule";
import coursesData from "./courses.json";

const MOCK_DELAY_MS = 600;
const MOCK_FAIL = false;

function loadCourses(): readonly Course[] {
  return (coursesData as { courses: Course[] }).courses;
}

export async function fetchCourses(): Promise<readonly Course[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (MOCK_FAIL) {
    throw new Error("Failed to fetch courses. Please try again.");
  }

  return loadCourses();
}