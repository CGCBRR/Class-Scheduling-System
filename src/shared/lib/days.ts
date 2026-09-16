import type { Day } from "@/shared/types/schedule";

export const DAYS_MON_SAT: readonly Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_INDEX: Readonly<Record<Day, number>> = Object.freeze(
  DAYS_MON_SAT.reduce<Record<Day, number>>(
    (acc, day, index) => {
      acc[day] = index;
      return acc;
    },
    {} as Record<Day, number>,
  ),
);