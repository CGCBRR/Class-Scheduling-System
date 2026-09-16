"use client";

import { DAYS_MON_SAT } from "@/shared/lib/days";
import { minutesToTime } from "@/shared/lib/time";
import type { Day } from "@/shared/types/schedule";

import type { TimetableBlockData } from "../lib/buildTimetableGrid";
import { TimetableBlock } from "./TimetableBlock";

import { Fragment } from "react";

export interface TimetableGridProps {
  readonly blocks: readonly TimetableBlockData[];
}

const DAY_START_MINUTES = 7 * 60;
const DAY_END_MINUTES = 20 * 60;
const PIXELS_PER_MINUTE = 0.8;
const GUTTER_WIDTH = "3.5rem";

const HOUR_COUNT = (DAY_END_MINUTES - DAY_START_MINUTES) / 60;
const HOUR_HEIGHT_PX = PIXELS_PER_MINUTE * 60;
const GRID_HEIGHT_PX = (DAY_END_MINUTES - DAY_START_MINUTES) * PIXELS_PER_MINUTE;

export function TimetableGrid({ blocks }: TimetableGridProps) {
  const blocksByDay = groupBlocksByDay(blocks);
  const columnTemplate = `${GUTTER_WIDTH} repeat(${DAYS_MON_SAT.length}, minmax(0, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Day header */}
        <div
          className="grid border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
          style={{ gridTemplateColumns: columnTemplate }}
        >
          <div aria-hidden="true" />
          {DAYS_MON_SAT.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Body: background cells + block overlay */}
        <div className="relative">
          {/* Background: hour rows × day columns */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: columnTemplate,
              gridTemplateRows: `repeat(${HOUR_COUNT}, ${HOUR_HEIGHT_PX}px)`,
              height: GRID_HEIGHT_PX,
            }}
          >
            {Array.from({ length: HOUR_COUNT }).map((_, rowIndex) => (
              <Fragment key={`row-${rowIndex}`}>
                <div
                  className="flex justify-end border-b border-r border-neutral-200 bg-white pr-2 pt-0.5 text-[10px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500"
                  style={{ gridColumn: 1, gridRow: rowIndex + 1 }}
                >
                  {minutesToTime(DAY_START_MINUTES + rowIndex * 60)}
                </div>
                {DAYS_MON_SAT.map((day, dayIndex) => (
                  <div
                    key={`${day}-${rowIndex}`}
                    className="border-b border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                    style={{ gridColumn: dayIndex + 2, gridRow: rowIndex + 1 }}
                  />
                ))}
              </Fragment>
            ))}
          </div>

          {/* Block overlay */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: columnTemplate }}
            aria-hidden="true"
          >
            <div />
            {DAYS_MON_SAT.map((day) => (
              <div key={`overlay-${day}`} className="relative">
                {blocksByDay[day].map((block) => (
                  <div key={block.id} className="pointer-events-auto">
                    <TimetableBlock
                      block={block}
                      pixelsPerMinute={PIXELS_PER_MINUTE}
                      dayStartMinutes={DAY_START_MINUTES}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupBlocksByDay(
  blocks: readonly TimetableBlockData[],
): Record<Day, TimetableBlockData[]> {
  const grouped = DAYS_MON_SAT.reduce<Record<Day, TimetableBlockData[]>>(
    (acc, day) => {
      acc[day] = [];
      return acc;
    },
    {} as Record<Day, TimetableBlockData[]>,
  );

  for (const block of blocks) {
    grouped[block.day].push(block);
  }

  return grouped;
}