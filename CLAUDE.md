# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from the `fretnoodle/` directory:

```bash
npm start          # Dev server on localhost:3000
npm run build      # Production build to fretnoodle/build/
npm test           # Jest test runner (react-scripts test)
```

ESLint is configured via react-scripts (extends `react-app` and `react-app/jest`). No separate lint command — warnings surface during `npm start` and `npm run build`.

## Architecture

React 19 + TypeScript app using Create React App. Interactive guitar fretboard visualizer with p5.js canvas rendering, chord detection, and music theory tools.

**Routes** (defined in `App.tsx`):
- `/` Home, `/fretboard` main tool, `/visualizer` placeholder, `/about`, `/howto`

### P5.js / React Integration

This is the most important architectural pattern to understand. P5.js needs mutable state access without triggering React re-renders:

1. `createFretboardSketch()` in `utils/fretBoardSketch.ts` is a factory that accepts React refs
2. Refs (`fretboardStateRef`, `drawingModeRef`, `themeRef`, `mappedNotesRef`) let the p5 draw loop read latest React state each frame
3. `P5Canvas` (`components/common/P5Canvas.tsx`) manages p5 instance lifecycle
4. `FretboardVisualizer` is the orchestrator that wires refs, hooks, and the sketch together
5. Note clicks flow back from p5 → `handleNoteClick` callback → React state update → ref sync

Changing the sketch factory signature or ref structure will break the bridge between React and p5.

### State Management (No Redux — hooks + refs)

**`useFretboard`** — Core fretboard state: tuning, capo, selected notes, root note, chord detection. Chord detection runs automatically when 3+ notes are selected, matching against `types/allChords.ts`.

**`useFretboardStates`** — Save/load/reorder named fretboard configurations. Each saved state includes drawing points and is auto-named from detected chords. States are in-memory only (not persisted to localStorage).

**`useDrawingMode`** / **`useFullscreen`** — Toggle modes. Drawing mode uses refs so the p5 sketch can access points without re-instantiation.

**`useKeyboardShortcuts`** — Centralized keyboard handler (F=fullscreen, D=drawing, M=map, Escape=exit). Do not add keyboard listeners elsewhere — they previously caused a double-toggle bug.

### Theme System

`ThemeContext` provides light/dark mode via MUI's `ThemeProvider`. Preference stored in localStorage key `themeMode`. The p5 sketch reads `themeRef.current` each frame and recomputes colors via `utils/fretboardColors.ts`.

## Music Theory Data Model

- **Note sequence**: 12-semitone chromatic scale in `types/fretboard.ts` (`NOTE_SEQUENCE`)
- **Fret calculation**: `getNoteAtFret(openNote, fret)` — modulo-12 arithmetic
- **Intervals**: `utils/interval-utils.ts` maps semitone distances to names (R, m2, M2, m3, M3, P4, TT, P5, m6, M6, m7, M7)
- **Chords**: `types/allChords.ts` generates ~200+ chords from 17 roots x 28+ chord types, each defined by interval pattern from root
- **Tunings**: Standard, Drop D, Half Step Down, Full Step Down, Open G, DADGAD — managed in `useFretboard`

## Key Types

```typescript
SelectedNote    { string, fret, note }         // A note clicked on the fretboard
FretboardState  { tuning, capo, selectedNotes, rootNote, detectedChord, ... }
DrawingPoint    { x, y, isDragging, inFullscreen }
ChordShape      { name, positions[] }          // Fingering diagram (fret per string)
Chord           { name, notes[] }              // Pitch-class definition (from commonChords.ts)
```

`SelectedNote` and `ChordShape` are the renamed/extracted types — older code may reference inline versions.

## Conventions

- MUI `sx` prop is the primary styling method. CSS files exist only for keyframe animations (`Home.css`) and global resets (`index.css`).
- Constants (timing delays, z-indexes, fretboard dimensions) live in `constants/index.ts`.
- Components that need scroll-triggered animation use the `useScrollAnimation` hook.
- The `FretboardVisualizer` component is `React.memo`-wrapped and is the single orchestrator for fullscreen, drawing, map mode, and state persistence. Keep responsibilities here rather than spreading across child components.
