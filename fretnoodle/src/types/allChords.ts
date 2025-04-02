// allChords.ts
import { Chord } from './commonChords';

// Root notes
const roots = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

// Intervals for different chord types (half steps from root)
const chordTypes: Record<string, { intervals: number[], suffix: string }> = {
  // Triads
  major: { intervals: [0, 4, 7], suffix: 'Major' },
  minor: { intervals: [0, 3, 7], suffix: 'Minor' },
  diminished: { intervals: [0, 3, 6], suffix: 'dim' },
  augmented: { intervals: [0, 4, 8], suffix: 'aug' },
  sus2: { intervals: [0, 2, 7], suffix: 'sus2' },
  sus4: { intervals: [0, 5, 7], suffix: 'sus4' },
  
  // Seventh chords
  major7: { intervals: [0, 4, 7, 11], suffix: 'Maj7' },
  dominant7: { intervals: [0, 4, 7, 10], suffix: '7' },
  minor7: { intervals: [0, 3, 7, 10], suffix: 'm7' },
  diminished7: { intervals: [0, 3, 6, 9], suffix: 'dim7' },
  halfDiminished7: { intervals: [0, 3, 6, 10], suffix: 'm7b5' },
  minorMajor7: { intervals: [0, 3, 7, 11], suffix: 'mMaj7' },
  augmented7: { intervals: [0, 4, 8, 10], suffix: 'aug7' },
  augmentedMajor7: { intervals: [0, 4, 8, 11], suffix: 'augMaj7' },
  
  // Extended chords
  dominant9: { intervals: [0, 4, 7, 10, 14], suffix: '9' },
  major9: { intervals: [0, 4, 7, 11, 14], suffix: 'Maj9' },
  minor9: { intervals: [0, 3, 7, 10, 14], suffix: 'm9' },
  dominant11: { intervals: [0, 4, 7, 10, 14, 17], suffix: '11' },
  major11: { intervals: [0, 4, 7, 11, 14, 17], suffix: 'Maj11' },
  minor11: { intervals: [0, 3, 7, 10, 14, 17], suffix: 'm11' },
  dominant13: { intervals: [0, 4, 7, 10, 14, 17, 21], suffix: '13' },
  major13: { intervals: [0, 4, 7, 11, 14, 17, 21], suffix: 'Maj13' },
  minor13: { intervals: [0, 3, 7, 10, 14, 17, 21], suffix: 'm13' },
  
  // Added tone chords
  add9: { intervals: [0, 4, 7, 14], suffix: 'add9' },
  minorAdd9: { intervals: [0, 3, 7, 14], suffix: 'madd9' },
  add11: { intervals: [0, 4, 7, 17], suffix: 'add11' },
  add13: { intervals: [0, 4, 7, 21], suffix: 'add13' },
  
  // 6th chords
  major6: { intervals: [0, 4, 7, 9], suffix: '6' },
  minor6: { intervals: [0, 3, 7, 9], suffix: 'm6' },
  major69: { intervals: [0, 4, 7, 9, 14], suffix: '6/9' },
  
  // Power chord
  power: { intervals: [0, 7], suffix: '5' },
};

// Note mapping for converting semitones to notes
const noteMapping: Record<number, string[]> = {
  0: ['C'],
  1: ['C#', 'Db'],
  2: ['D'],
  3: ['D#', 'Eb'],
  4: ['E'],
  5: ['F'],
  6: ['F#', 'Gb'],
  7: ['G'],
  8: ['G#', 'Ab'],
  9: ['A'],
  10: ['A#', 'Bb'],
  11: ['B']
};

/**
 * Converts a semitone value (0-11) to a note name
 */
const semitoneToNote = (semitone: number, preferSharp = true): string => {
  const normalizedSemitone = ((semitone % 12) + 12) % 12;
  const notes = noteMapping[normalizedSemitone];
  return preferSharp ? notes[0] : notes[notes.length - 1];
};

/**
 * Generates the notes for a chord based on the root and intervals
 */
const generateChordNotes = (root: string, intervals: number[]): string[] => {
  // Find the semitone value of the root
  let rootSemitone = -1;
  for (const [semitone, notes] of Object.entries(noteMapping)) {
    if (notes.includes(root)) {
      rootSemitone = parseInt(semitone);
      break;
    }
  }
  
  if (rootSemitone === -1) {
    throw new Error(`Invalid root note: ${root}`);
  }
  
  // Determine whether to use sharps or flats based on the root notation
  const preferSharp = !root.includes('b');
  
  // Generate the notes for each interval
  return intervals.map(interval => {
    const semitone = (rootSemitone + interval) % 12;
    return semitoneToNote(semitone, preferSharp);
  });
};

// Generate all chords
export const allChords: Chord[] = [];

roots.forEach(root => {
  Object.entries(chordTypes).forEach(([type, { intervals, suffix }]) => {
    // Skip duplicate chords (e.g., C# and Db are enharmonic equivalents)
    if ((root === 'C#' && type === 'major' && allChords.some(c => c.name === 'Db Major')) ||
        (root === 'Db' && type === 'major' && allChords.some(c => c.name === 'C# Major')) ||
        (root === 'D#' && type === 'major' && allChords.some(c => c.name === 'Eb Major')) ||
        (root === 'Eb' && type === 'major' && allChords.some(c => c.name === 'D# Major')) ||
        (root === 'F#' && type === 'major' && allChords.some(c => c.name === 'Gb Major')) ||
        (root === 'Gb' && type === 'major' && allChords.some(c => c.name === 'F# Major')) ||
        (root === 'G#' && type === 'major' && allChords.some(c => c.name === 'Ab Major')) ||
        (root === 'Ab' && type === 'major' && allChords.some(c => c.name === 'G# Major')) ||
        (root === 'A#' && type === 'major' && allChords.some(c => c.name === 'Bb Major')) ||
        (root === 'Bb' && type === 'major' && allChords.some(c => c.name === 'A# Major'))) {
      return;
    }
    
    const chordName = `${root} ${suffix}`;
    allChords.push({
      name: chordName,
      notes: generateChordNotes(root, intervals)
    });
  });
});

export default allChords;