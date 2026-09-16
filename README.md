# Class Scheduling System

A web application that helps students browse courses, pick sections, and assemble a conflict-free weekly class schedule.

Built as the take-home assessment for the **La Salle Computer Society — Frontend Engineering** assessment (September 2026, 41st LSCS, Term 1).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Global state | React Context + `useReducer` |
| Runtime | React 19 |

No backend, database, or external API is required. Course data is served from a bundled mock file through a fake async fetcher that simulates network latency, so the app exercises real loading and error paths.

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later (or `pnpm` / `yarn` / `bun` if you prefer — commands below use `npm`)

### Installation

```bash
git clone <your-repo-url>
cd Class-Scheduling-System
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Type-check

```bash
npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

---

## Features

**Catalog**
- Browse all courses; each card expands to reveal its sections
- Live search by course code or title
- Filter by day of the week (Mon–Sat)
- Filter to only courses already in the schedule
- Combined filters (search + day + selected-only)
- Reset filters action, surfaced only when filters are active

**Schedule**
- Select a section to add it to the schedule
- Selecting another section of the same course replaces the previous one (one section per course)
- Remove a course from the schedule
- Clear all selections
- Live aggregate: total courses and total units

**Timetable**
- Weekly grid, Monday–Saturday, 07:00–20:00
- Blocks positioned by actual class duration
- Instructor, room, and section shown per block
- Hover any block for full details (course, section, room, instructor, time range)

**States**
- Loading (spinner during the simulated fetch)
- Error (with retry)
- Empty catalog
- Empty filter result
- Empty schedule
- Empty timetable

---

## Project Structure

The codebase uses a **feature-sliced architecture** with three layers and a strict one-way import rule:

```
src/
├── app/                # Next.js App Router: routing, layout, providers
├── features/           # Feature slices: catalog, schedule, timetable
│   ├── course-catalog/
│   ├── schedule/
│   └── timetable/
└── shared/             # Cross-cutting primitives: types, data, lib, ui
```

**Import rule (enforced by convention):**

```
app  →  may import from  features  and  shared
features  →  may import from  shared  only
shared  →  may not import from  features  or  app
```

This keeps feature slices independently replaceable and prevents the accidental coupling that flat structures tend to accumulate.

For the reasoning behind this and every other technical decision, see [`TECHNICAL_RATIONALE.md`](./TECHNICAL_RATIONALE.md).

---

## Mock Data

The course catalog lives at `src/shared/data/courses.json`:

- **10 courses**, **31 sections** total
- Realistic Lasallian course codes (e.g. `STSWENG`, `CSOPESY`, `STHCIUX`)
- Sections labelled `S01`, `S02`, `S23`, etc.
- Meetings spread across Monday–Saturday, 07:00–20:00
- No two sections conflict — the assessment explicitly waives conflict detection

To exercise the error UI, flip `MOCK_FAIL` to `true` in `src/shared/data/fetchCourses.ts` and reload. Flip it back when done.

---

## Assessment Notes

The assessment brief specified a frontend take-home with the following constraints, all of which this implementation respects:

- Modern frontend framework (Next.js)
- Component-based, maintainable code
- Loading, empty, and error states
- Responsive behavior
- No backend required
- Conflict detection not required

No optional features were added beyond the core specification, in line with the brief's guidance to prioritize quality over quantity.

---

## License

This project was produced as an assessment submission. No license is granted for redistribution.