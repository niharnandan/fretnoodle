import { useState, useCallback } from 'react';
import { 
  FretboardState, 
  DEFAULT_TUNING, 
  NOTE_SEQUENCE, 
  getNextNote, 
  getPrevNote,
  getNoteAtFret
} from '../types/fretboard';
import allChords from '../types/allChords';

const useFretboard = () => {
  const [fretboardState, setFretboardState] = useState<FretboardState>({
    tuning: [...DEFAULT_TUNING],
    capo: 0,
    highlightedNotes: [],
    highlightedFrets: [],
    selectedNotes: [],
    detectedChord: null,
    showNotes: true,
    showOctaves: false,
    showDots: false
  });

  // Change the tuning of a specific string
  const changeTuning = useCallback((stringIndex: number, direction: 'up' | 'down') => {
    setFretboardState(prevState => {
      const newTuning = [...prevState.tuning];
      const currentNote = newTuning[stringIndex];
      
      if (direction === 'up') {
        newTuning[stringIndex] = getNextNote(currentNote);
      } else {
        newTuning[stringIndex] = getPrevNote(currentNote);
      }
      
      return {
        ...prevState,
        tuning: newTuning
      };
    });
  }, []);

  // Reset tuning to standard
  const resetTuning = useCallback(() => {
    setFretboardState(prevState => ({
      ...prevState,
      tuning: [...DEFAULT_TUNING]
    }));
  }, []);

  // Set a common alternate tuning
  const setAlternateTuning = useCallback((tuningName: string) => {
    let newTuning: string[] = [...DEFAULT_TUNING];
    
    switch (tuningName.toLowerCase()) {
      case 'drop d':
        newTuning = ['E', 'B', 'G', 'D', 'A', 'D'];
        break;
      case 'half step down':
        newTuning = ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'];
        break;
      case 'full step down':
        newTuning = ['D', 'A', 'F', 'C', 'G', 'D'];
        break;
      case 'open g':
        newTuning = ['D', 'B', 'G', 'D', 'G', 'D'];
        break;
      case 'dadgad':
        newTuning = ['D', 'A', 'G', 'D', 'A', 'D'];
        break;
      default:
        newTuning = [...DEFAULT_TUNING];
    }
    
    setFretboardState(prevState => ({
      ...prevState,
      tuning: newTuning
    }));
  }, []);

  // Set capo position
  const setCapo = useCallback((position: number) => {
    setFretboardState(prevState => ({
      ...prevState,
      capo: position
    }));
  }, []);

  // Highlight specific notes on the fretboard
  const highlightNotes = useCallback((notes: string[]) => {
    setFretboardState(prevState => ({
      ...prevState,
      highlightedNotes: notes
    }));
  }, []);

  // Highlight specific frets on the fretboard
  const highlightFrets = useCallback((frets: number[]) => {
    setFretboardState(prevState => ({
      ...prevState,
      highlightedFrets: frets
    }));
  }, []);

  // Toggle display options
  const toggleOption = useCallback((option: 'showNotes' | 'showOctaves' | 'showDots') => {
    setFretboardState(prevState => ({
      ...prevState,
      [option]: !prevState[option]
    }));
  }, []);
  
  // Function to detect chord from selected notes
  const detectChordFromNotes = (notes: string[]): string | null => {
    if (notes.length < 3) return null;
    
    // Get unique notes
    const uniqueNotes = Array.from(new Set(notes)).sort();
    
    // Check against common chords
    for (const chord of allChords) {
      // Check if the selected notes match the chord notes
      const allChordNotesPresent = chord.notes.every(note => 
        uniqueNotes.includes(note)
      );
      
      // For a match, we need:
      // 1. All chord notes to be present
      // 2. For triads, we only accept exact matches (all 3 notes)
      // 3. For 7th chords (4 notes), we allow the 7th to be optional
      if (allChordNotesPresent &&
          (uniqueNotes.length === chord.notes.length || 
           (chord.notes.length === 4 && uniqueNotes.length >= 3))) {
        return chord.name;
      }
    }
    
    return null;
  };

  // Toggle (add/remove) a note selection
  const toggleNoteSelection = useCallback((stringIndex: number, fret: number) => {
    setFretboardState(prevState => {
      // Get the actual note at this position
      const openNote = prevState.tuning[stringIndex];
      const effectiveFret = Math.max(0, fret - prevState.capo);
      const note = getNoteAtFret(openNote, effectiveFret);
      
      // Check if this note is already selected
      const existingIndex = prevState.selectedNotes.findIndex(
        selection => selection.string === stringIndex && selection.fret === fret
      );
      
      let newSelectedNotes;
      if (existingIndex >= 0) {
        // Remove the note if already selected
        newSelectedNotes = [
          ...prevState.selectedNotes.slice(0, existingIndex),
          ...prevState.selectedNotes.slice(existingIndex + 1)
        ];
      } else {
        // Add the note if not selected
        newSelectedNotes = [
          ...prevState.selectedNotes,
          { string: stringIndex, fret, note }
        ];
      }
      
      // Get unique notes for chord detection
      const uniqueNotes = Array.from(new Set(newSelectedNotes.map(n => n.note)));
      
      // Detect chord
      const detectedChord = detectChordFromNotes(uniqueNotes);
      
      return {
        ...prevState,
        selectedNotes: newSelectedNotes,
        detectedChord
      };
    });
  }, []);
  
  // Clear all selected notes
  const clearSelectedNotes = useCallback(() => {
    setFretboardState(prevState => ({
      ...prevState,
      selectedNotes: [],
      detectedChord: null
    }));
  }, []);

  return {
    fretboardState,
    changeTuning,
    resetTuning,
    setAlternateTuning,
    setCapo,
    highlightNotes,
    highlightFrets,
    toggleOption,
    toggleNoteSelection,
    clearSelectedNotes
  };
};

export default useFretboard;