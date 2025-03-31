// commonChords.ts
export interface Chord {
    name: string;
    notes: string[];
  }
  
  export const commonChords: Chord[] = [
    { name: 'C Major', notes: ['C', 'E', 'G'] },
    { name: 'G Major', notes: ['G', 'B', 'D'] },
    { name: 'D Major', notes: ['D', 'F#', 'A'] },
    { name: 'A Major', notes: ['A', 'C#', 'E'] },
    { name: 'E Major', notes: ['E', 'G#', 'B'] },
    { name: 'F Major', notes: ['F', 'A', 'C'] },
    { name: 'A Minor', notes: ['A', 'C', 'E'] },
    { name: 'E Minor', notes: ['E', 'G', 'B'] },
    { name: 'D Minor', notes: ['D', 'F', 'A'] }
  ];