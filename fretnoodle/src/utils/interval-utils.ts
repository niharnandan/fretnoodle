import { NOTE_SEQUENCE } from '../types/fretboard';

// Interval names as they would appear on the fretboard
export const INTERVAL_NAMES: Record<number, string> = {
  0: 'R',   // Root
  1: 'm2',  // Minor second
  2: 'M2',  // Major second
  3: 'm3',  // Minor third
  4: 'M3',  // Major third
  5: 'P4',  // Perfect fourth
  6: 'TT',  // Tritone
  7: 'P5',  // Perfect fifth
  8: 'm6',  // Minor sixth
  9: 'M6',  // Major sixth
  10: 'm7', // Minor seventh
  11: 'M7'  // Major seventh
};

/**
 * Calculate semitone distance between two notes
 * @param rootNote - The reference note
 * @param comparedNote - The note to compare against the root
 * @returns Number of semitones between the notes (0-11)
 */
export const calculateInterval = (rootNote: string, comparedNote: string): number => {
  const rootIndex = NOTE_SEQUENCE.indexOf(rootNote);
  const comparedIndex = NOTE_SEQUENCE.indexOf(comparedNote);
  
  if (rootIndex === -1 || comparedIndex === -1) {
    return -1; // Invalid notes
  }
  
  // Calculate semitones between the two notes (0-11)
  const semitones = (comparedIndex - rootIndex + 12) % 12;
  return semitones;
};

/**
 * Get the interval name between two notes
 * @param rootNote - The reference note
 * @param comparedNote - The note to compare against the root
 * @returns String representing the interval (R, m2, M2, etc.)
 */
export const getIntervalName = (rootNote: string, comparedNote: string): string => {
  const semitones = calculateInterval(rootNote, comparedNote);
  
  if (semitones === -1) {
    return '?'; // Error case
  }
  
  return INTERVAL_NAMES[semitones];
};