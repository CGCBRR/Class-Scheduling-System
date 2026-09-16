import type { SelectionMap } from "@/shared/types/schedule";

export interface ScheduleState {
  readonly selections: SelectionMap;
}

export type ScheduleAction =
  | { type: "SELECT_SECTION"; courseId: string; sectionId: string }
  | { type: "REMOVE_SECTION"; courseId: string }
  | { type: "CLEAR_SELECTIONS" };

export const initialScheduleState: ScheduleState = {
  selections: {},
};

export function scheduleReducer(
  state: ScheduleState,
  action: ScheduleAction,
): ScheduleState {
  switch (action.type) {
    case "SELECT_SECTION": {
      const { courseId, sectionId } = action;

      if (state.selections[courseId] === sectionId) {
        return state;
      }

      return {
        selections: {
          ...state.selections,
          [courseId]: sectionId,
        },
      };
    }

    case "REMOVE_SECTION": {
      const { courseId } = action;

      if (!(courseId in state.selections)) {
        return state;
      }

      const { [courseId]: _removed, ...rest } = state.selections;
      return { selections: rest };
    }

    case "CLEAR_SELECTIONS": {
      if (Object.keys(state.selections).length === 0) {
        return state;
      }
      return initialScheduleState;
    }

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}