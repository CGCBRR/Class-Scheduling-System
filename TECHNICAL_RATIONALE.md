# Technical Rationale

This document explains the engineering decisions behind the Class Scheduling System, the trade-offs considered, and what would change at a larger scale. It is written for a reviewer who wants to understand *why* the code looks the way it does.

---

## 1. Architecture: Feature-Sliced, Three Layers

The codebase is organized into three layers with a strict one-way dependency rule:

```
app  →  features  →  shared
```

- **`app/`** is the composition root. It owns routing, layouts, and provider composition. It is the only layer allowed to know about all features at once.
- **`features/`** are vertically sliced by domain: `course-catalog`, `schedule`, `timetable`. Each slice owns its own components, hooks, and (where applicable) state. Slices may import from `shared` but never from each other.
- **`shared/`** holds everything cross-cutting: domain types, mock data, pure utilities, and reusable UI primitives. It imports from nothing else in the project.

### Why this shape

The alternative — a flat `components/`, `hooks/`, `utils/` layout — is fine at the scale of a small prototype, but it stops communicating intent as the app grows. A `SectionRow.tsx` under `components/` doesn't tell you which domain it belongs to or who is allowed to import it. Under `features/course-catalog/components/`, its ownership and its public surface are unambiguous.

The strict one-way rule also eliminates an entire class of bugs. If `shared/ui/Button.tsx` can never import from a feature, it can never accidentally depend on business logic, and it stays reusable forever.

### Slice encapsulation

Each feature exposes a public API through an `index.ts` barrel. Internal components (`SectionRow`, `TimetableBlock`, `scheduleReducer`) are *not* re-exported. A consumer of the catalog slice imports `CourseCatalog`, not the pieces that make it up. This is the same discipline you'd apply to a package boundary, applied at the folder level.

### The `schedule` ↔ `timetable` split

`schedule` owns the selection state. `timetable` renders it spatially. They could have been one feature, but they have different render models (list vs. grid), different update frequencies, and different test surfaces. Splitting them means a change to the grid layout never touches the selection reducer, and vice versa.

The cost is that `timetable` imports `useSchedule` from `schedule`. That's a *feature → feature* import, which technically violates the strict rule. In this project it's acceptable because the dependency is one-directional and on a public API (`useSchedule`) rather than internals. If we wanted to be purist, `timetable` would accept `selectedEntries` as a prop from `app/page.tsx`, and the coupling would be broken. We chose the direct import because it's more ergonomic and the coupling is intentional, not accidental. This is documented in the code.

---

## 2. State Management: Context + Reducer

Global state in this app is exactly one thing: **which section a student has selected for each course.**

### The data model

```ts
type SelectionMap = Readonly<Record<string, string>>; // courseId -> sectionId
```

This encoding is deliberate. The business rule is *one section per course*. Encoding the selection as a map makes that rule structurally impossible to violate — a map cannot hold two values for one key. Adding a section for a course that already has one is an overwrite, which is precisely what "change section" means. No separate code path, no invariant to maintain, no way to get it wrong.

The alternative — `Array<{ courseId, sectionId }>` — would allow duplicates and require runtime enforcement. The map is cheaper and safer.

### Why Context + reducer, not Zustand or Redux

- **Redux** is overkill for a single global concern. It brings a store, middleware, actions, and a mental model that this app doesn't need.
- **Zustand** would be a legitimate alternative and slightly more ergonomic. But adding a dependency for one reducer's worth of state isn't justified when React's built-ins do the job cleanly.
- **Context + `useReducer`** keeps the entire state story inside React's own primitives. The reducer is a pure function, trivially testable, and the context value is a hand-curated API rather than the raw state object. That last point matters: consumers call `selectSection(courseId, sectionId)`, not `dispatch({ ... })`. The dispatch mechanism is an implementation detail.

### Reference-stable no-ops

The reducer returns the **same state reference** when an action wouldn't change anything (selecting an already-selected section, removing a course with no selection, clearing an already-empty schedule). This isn't a micro-optimization — it's what makes downstream `useMemo` and `memo` effective. Without it, a no-op dispatch would produce a new object, invalidate every memoized consumer, and cause a full re-render for nothing.

### Why `useSchedule` returns functions, not state

The context exposes `getSelectedSectionId(courseId)`, `isSectionSelected(courseId, sectionId)`, `isCourseSelected(courseId)` — all O(1) lookups. Consumers never receive the raw `SelectionMap`. This means:

1. The shape of the underlying state can change without touching consumers.
2. The API reads like the domain ("is this section selected?") rather than like data plumbing ("does `selections[courseId] === sectionId`?").
3. Selection checks are constant-time, so rendering 31 section rows costs 31 property lookups, not 31 array scans.

---

## 3. Data Fetching: TanStack Query Over a Fake Fetcher

`fetchCourses()` simulates a network call: a 600 ms delay and an optional failure flag. Wrapping it in TanStack Query buys us:

- **Loading / error / success states** without hand-rolling a `useState` triad.
- **A single cache** across the app — the catalog and the schedule both see the same `Course[]` instance.
- **Retry semantics** for free (`retry: 1` in the client defaults).
- **A real-world seam.** Replacing `fetchCourses` with `fetch("/api/courses")` is a one-line change; nothing else in the app knows where the data came from.

The query is configured with `staleTime: Infinity` and `refetchOnWindowFocus: false`. This is correct for a catalog: the data does not change within a user's session, and re-fetching on tab focus would be wasteful. It's also what a real catalog endpoint would do.

### Why `ScheduleProvider` takes `courses` as a prop

`ScheduleProvider` resolves `courseId → sectionId` selections into display data (`SelectedEntry[]`), which requires the course list. Two options were available:

- **Have the provider fetch courses itself.** Rejected — it would couple the schedule feature to a specific data-fetching method.
- **Pass `courses` in as a prop.** Chosen — the provider stays agnostic about *how* courses arrive. `app/providers.tsx` wires the two together, and `ScheduleProvider` remains independently testable.

This is a small case of the dependency-inversion principle: the schedule slice depends on an abstraction (`Course[]`) rather than on a concrete data source.

---

## 4. Performance Considerations

The brief asks applicants to *identify* performance concerns and explain their decisions. Here's what we did, and what we consciously did not do.

### What we did

**Memoized components.** `CourseCard`, `SectionRow`, `SelectedSectionCard`, and `TimetableBlock` are all wrapped in `React.memo`. Each receives only the props it needs, as primitives where possible. `SectionRow`, for example, receives `isSelected: boolean` rather than reading the selection map — so toggling one section only re-renders that section, not its siblings.

**Stable callbacks.** Event handlers are `useCallback`'d with appropriate dependencies. `selectSection`, `removeSection`, and `clearSelections` dispatch and never close over state, so their identities are permanently stable — a prerequisite for `memo` to be effective downstream.

**Derived, not duplicated, filter state.** `useCourseFilters` computes `filteredCourses` inside `useMemo` from the raw course list plus the filter inputs. There is no state that mirrors the filtered list, so there is no way for it to drift out of sync.

**Single-pass filtering.** The filter predicate checks the three active filters in one `filter()` call. No chained `.filter().filter().filter()` that would allocate intermediate arrays.

**O(1) selection lookups.** Selection is a `Record<courseId, sectionId>`, so `isSelected` is a key comparison, not an array scan.

**Reference-stable reducer no-ops.** As described above.

**`staleTime: Infinity`.** Prevents background refetches that would recompute derived data for no reason.

### What we deliberately did not do

**No virtualization.** The catalog renders ~10 courses and ~31 sections. Virtualization (`react-window`, TanStack Virtual) would add complexity and a dependency for zero measurable benefit at this scale. It would be the correct answer at 1,000+ courses, and the component structure supports adding it later without touching the feature's public API. We chose to keep the code readable rather than pre-optimize for a scenario the data doesn't present.

**No debouncing of the search input.** Filtering 10 courses is instant. A debounce would add latency for no benefit. At 1,000+ courses with a slower filter predicate, we'd add a `useDeferredValue` or a 150 ms debounce inside `useCourseFilters` — a change localized to one hook.

**No `useMemo` on every derived value.** We memoize what's actually expensive or what feeds a `memo` boundary: `selectedEntries`, `totalUnits`, the context value object, and the filtered list. Memoizing trivial computations (e.g. `courses.length`) is noise that makes the code harder to read without changing runtime behavior.

### Known trade-offs

**`CourseCard` re-renders all of its `SectionRow`s when its own selection changes.** Because the row's `onToggle` is an inline arrow, its identity changes when the card re-renders. This is fine at 2–4 sections per card. To eliminate it, we'd hoist `courseId` into `SectionRow`'s props and pass `onToggleSection` directly — a small refactor we noted but didn't do, because the current version is more readable and the cost is negligible.

**`getSelectedSectionId` is called once per course during catalog render.** O(n) calls, each O(1). At 31 sections this is unmeasurable. At thousands of courses we'd invert this: build a `Map<courseId, sectionId>` once in `useSchedule` and pass it down, so each card does one lookup instead of the catalog doing n lookups on its behalf. The public API of `useSchedule` wouldn't change.

---

## 5. Accessibility

- **Semantic elements.** `<button>` for anything interactive, `<ul>`/`<li>` for lists, `<section>` with `aria-label` for landmark regions. No `div` with `onClick`.
- **`aria-pressed` on toggle controls.** Section rows and day filter pills announce their selected state to assistive technology.
- **`aria-expanded` and `aria-controls` on the course card disclosure.** The expand/collapse behavior is announced, and the controlled region is linked by id.
- **`role="alert"` on `ErrorState`.** Errors are announced immediately when they appear.
- **`role="status"` with `aria-live="polite"` on the search result count.** Screen-reader users get the same live feedback as sighted users when filtering.
- **Focus-visible rings everywhere.** Keyboard navigation is fully supported and visible. The default focus ring color is blue, matching the accent.
- **No color-only signaling.** Selection is communicated by color *and* a `✓ Selected` label *and* `aria-pressed`. Filter state is communicated by fill *and* `aria-pressed`.
- **`sr-only` labels.** The `Spinner` announces "Loading" to screen readers while showing only a visual spinner.

**Trade-off noted:** timetable blocks are `aria-hidden` and rely on the `title` tooltip for full details. Screen-reader users get the same information through the `SchedulePanel` list, which is fully accessible. Making the timetable itself navigable by keyboard would require a different structure (e.g. a data table instead of an absolutely-positioned grid), which would compromise the visual design. We chose to duplicate the information accessibly rather than force the grid to be accessible, and documented the decision here.

---

## 6. Responsive Design

The layout is a single CSS grid with one breakpoint:

```
lg and up:  [ catalog (40%) | schedule + timetable (60%) ]
below lg:   [ catalog       ]
            [ schedule      ]
            [ timetable     ]
```

- The 40/60 split uses `lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`. The `minmax(0, …)` is important — without it, a long course title can force its column wider than the intended fraction.
- The right column is `lg:sticky lg:top-6` with its own `overflow-y-auto`, so it stays in view while the catalog scrolls and scrolls independently if the timetable is tall.
- The timetable has a `min-w-[640px]` inner container with `overflow-x-auto` on its parent, so narrow viewports can still see a usable grid via horizontal scroll. This is preferable to collapsing the grid into an unusable state.
- Mobile is a single column with catalog first. That matches the reading order a student would use: browse, then review.

---

## 7. Testing — What We Would Test First

No tests are included (the brief lists them as optional). If we were to add them, the priority order would be:

1. **`scheduleReducer`** — pure function, highest value per line. Cases: select, select again (no-op), select different section of same course (replace), remove, remove non-selected (no-op), clear, clear empty (no-op).
2. **`buildTimetableGrid`** — pure function. Cases: empty input, single entry, multi-day section, minute conversion correctness.
3. **`timeToMinutes` / `formatTime` / `formatTimeRange`** — pure, boundary conditions (midnight, noon, invalid input).
4. **`useCourseFilters`** — pure-ish. Cases: empty query, no matches, day filter, selected-only filter, combined filters.
5. **`CourseCatalog`** — integration. Loading → data → selection → timetable block appears.

The architecture is deliberately test-friendly: the two most complex pieces of logic (`scheduleReducer`, `buildTimetableGrid`) are pure functions with no React or DOM dependency, so they can be tested with a plain test runner.

---

## 8. What Would Change at Scale

If this app were to serve thousands of courses and hundreds of concurrent users, the following changes would be the natural next steps — in priority order:

1. **Real backend + API boundary.** Replace `fetchCourses` with `fetch("/api/courses")`. Add server-side pagination and filtering. Add Zod validation at the response boundary.
2. **Virtualize the catalog.** `@tanstack/react-virtual` or `react-window` on the course list. The `CourseCard` component doesn't change; only the list rendering does.
3. **Debounce the search input.** Use `useDeferredValue` (React 19) inside `useCourseFilters`, or an explicit debounce. Localized to one hook.
4. **URL-driven filters.** Move `filters` from `useState` into `useSearchParams`, so filter state is shareable and survives reload.
5. **Persistence.** Add `localStorage` (or a server-side user schedule) via a `useSyncExternalStore` wrapper or Zustand's persist middleware.
6. **Conflict detection.** The `SelectionMap` model extends naturally — on `SELECT_SECTION`, walk the new section's time blocks and reject if any overlap an existing selection.
7. **ESLint boundary enforcement.** Add `eslint-plugin-boundaries` or `import/no-restricted-paths` to mechanically enforce the layer rule.
8. **Testing.** Add Vitest for pure functions, Testing Library for integration, Playwright for the end-to-end selection flow.

Each of these is a localized change, not a rewrite, because the architecture keeps concerns separated.

---

## 9. Summary of Key Decisions

| Decision | Choice | Why |
|---|---|---|
| Architecture | Feature-sliced, 3 layers | Encapsulation, replaceability, clear ownership |
| State | Context + reducer | Right-sized for one global concern; no extra dependency |
| Selection model | `Record<courseId, sectionId>` | Business rule encoded structurally; O(1) lookups |
| Data fetching | TanStack Query | Real loading/error states; single cache; swappable seam |
| Provider inputs | `courses` as prop | Decouples schedule from data source; testable |
| Performance | Memoize + derive, no virtualization | Right-sized for the data; readable; extensible later |
| Accessibility | Semantic + `aria-*` + no color-only | Meets the brief's "basic accessibility" bar without overreach |
| Responsiveness | One CSS grid, one breakpoint | Simplest thing that works; no dead breakpoints |