import { timeToMinutes } from "@/shared/lib/time";
import type { Day, SelectedEntry } from "@/shared/types/schedule";

export interface TimetableBlockData {
  readonly id: string;
  readonly courseId: string;
  readonly courseCode: string;
  readonly sectionId: string;
  readonly sectionLabel: string;
  readonly room: string;
  readonly instructor: string;
  readonly day: Day;
  readonly startMinutes: number;
  readonly endMinutes: number;
}

export function buildTimetableGrid(
  entries: readonly SelectedEntry[],
): readonly TimetableBlockData[] {
  const blocks: TimetableBlockData[] = [];

  for (const entry of entries) {
    const { course, section } = entry;

    for (const slot of section.schedule) {
      const startMinutes = timeToMinutes(slot.startTime);
      const endMinutes = timeToMinutes(slot.endTime);

      blocks.push({
        id: `${section.id}-${slot.day}-${slot.startTime}`,
        courseId: course.id,
        courseCode: course.code,
        sectionId: section.id,
        sectionLabel: section.section,
        room: section.room,
        instructor: section.instructor,
        day: slot.day,
        startMinutes,
        endMinutes,
      });
    }
  }

  return blocks;
}