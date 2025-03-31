// Types for fretboard and guitar
export interface Note {
  name: string;
  octave: number;
  frequency: number;
}

export interface GuitarString {
  tuning: string;  // Note name (e.g., "E", "A", "D")
  octave: number;  // Octave number
  notes: Note[];   // Notes along the fretboard for this string
}

export interface Chord {
  name: string;
  positions: number[];  // Fret positions for each string (-1 means don't play)
}

export interface FretboardState {
  tuning: string[];
  capo: number;
  highlightedNotes: string[];
  highlightedFrets: number[];
  selectedNotes: {string: number, fret: number, note: string}[];
  detectedChord: string | null;
  showNotes: boolean;
  showOctaves: boolean;
  showDots: boolean;
}

export interface FretboardConfig {
  numFrets: number;
  numStrings: number;
  dotPositions: number[];
  doubleDotPositions: number[];
}

export interface ChordDefinition {
  name: string;
  notes: string[];
}

export const DEFAULT_FRETBOARD_CONFIG: FretboardConfig = {
  numFrets: 22,
  numStrings: 6,
  dotPositions: [3, 5, 7, 9, 15, 17, 19, 21],
  doubleDotPositions: [12, 24]
};

export const DEFAULT_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

export const NOTE_SEQUENCE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getNextNote = (note: string): string => {
  const index = NOTE_SEQUENCE.indexOf(note);
  return index > -1 ? NOTE_SEQUENCE[(index + 1) % NOTE_SEQUENCE.length] : note;
};

export const getPrevNote = (note: string): string => {
  const index = NOTE_SEQUENCE.indexOf(note);
  return index > -1 ? NOTE_SEQUENCE[(index - 1 + NOTE_SEQUENCE.length) % NOTE_SEQUENCE.length] : note;
};

export const getNoteAtFret = (openNote: string, fret: number): string => {
  const index = NOTE_SEQUENCE.indexOf(openNote);
  if (index === -1) return openNote;
  return NOTE_SEQUENCE[(index + fret) % NOTE_SEQUENCE.length];
};

// Function to detect chord from notes
export const detectChord = (notes: string[]): string | null => {
  // Import this from commonChords.ts instead of defining here
  // This function will be used by the hook
  return null;
};