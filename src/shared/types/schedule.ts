export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface ScheduleBlock {
  readonly day: Day;
  readonly startTime: string;
  readonly endTime: string;
}

export interface Section {
  readonly id: string;
  readonly section: string;
  readonly instructor: string;
  readonly room: string;
  readonly schedule: readonly ScheduleBlock[];
}

export interface Course {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly units: number;
  readonly sections: readonly Section[];
}

export type SelectionMap = Readonly<Record<string, string>>;

export interface SelectedEntry {
  readonly course: Course;
  readonly section: Section;
}