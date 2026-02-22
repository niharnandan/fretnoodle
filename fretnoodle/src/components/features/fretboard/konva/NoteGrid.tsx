import React from 'react';
import FretNote from './FretNote';
import { FretboardState, FretboardColors, getNoteAtFret, SelectedNote } from '../../../../types/fretboard';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';
import { getIntervalName } from '../../../../utils/interval-utils';

interface NoteGridProps {
  dims: FretboardDimensions;
  fretboardState: FretboardState;
  colors: FretboardColors;
  mappedNotes: string[];
  isFullscreen: boolean;
  isDrawingMode: boolean;
  onNoteClick: (stringIndex: number, fret: number) => void;
}

const NoteGrid: React.FC<NoteGridProps> = React.memo(({
  dims,
  fretboardState,
  colors,
  mappedNotes,
  isFullscreen,
  isDrawingMode,
  onNoteClick,
}) => {
  const {
    tuning,
    capo,
    highlightedNotes,
    highlightedFrets,
    selectedNotes,
    rootNote,
    showIntervals,
    showNotes,
    showOctaves,
  } = fretboardState;

  if (!showNotes) return null;

  const elements: React.ReactNode[] = [];

  // Reference note for intervals
  const referenceNote: string | null = rootNote
    ? rootNote.note
    : selectedNotes.length > 0
    ? selectedNotes[0].note
    : null;

  for (let string = 0; string < dims.numStrings; string++) {
    const openNote = tuning[string];

    for (let fret = 0; fret <= dims.displayFrets; fret++) {
      // Capo logic for fretted notes
      if (fret > 0) {
        const effectiveFret = fret - capo;
        if (effectiveFret <= 0) continue;
      }

      const note = fret === 0 ? openNote : getNoteAtFret(openNote, fret - capo);

      const isSelected = selectedNotes.some(
        (n: SelectedNote) => n.string === string && n.fret === fret
      );

      const isReferenceForIntervals = rootNote
        ? rootNote.string === string && rootNote.fret === fret
        : selectedNotes.length > 0 &&
          selectedNotes[0].string === string &&
          selectedNotes[0].fret === fret;

      const isHighlighted =
        highlightedNotes.includes(note) || (fret > 0 && highlightedFrets.includes(fret));

      const isMapped = mappedNotes.includes(note);

      // Compute interval text
      let intervalText: string | null = null;
      if (showIntervals && isSelected) {
        intervalText = isReferenceForIntervals
          ? 'R'
          : referenceNote
          ? getIntervalName(referenceNote, note)
          : null;
      } else if (showIntervals && isMapped && referenceNote) {
        intervalText = note === referenceNote ? 'R' : getIntervalName(referenceNote, note);
      }

      elements.push(
        <FretNote
          key={`${string}-${fret}`}
          stringIndex={string}
          fret={fret}
          note={note}
          dims={dims}
          colors={colors}
          isFullscreen={isFullscreen}
          isSelected={isSelected}
          isReferenceForIntervals={isReferenceForIntervals}
          isHighlighted={isHighlighted}
          isMapped={isMapped}
          isDrawingMode={isDrawingMode}
          showIntervals={showIntervals}
          showOctaves={showOctaves}
          intervalText={intervalText}
          onNoteClick={onNoteClick}
        />
      );
    }
  }

  return <>{elements}</>;
});

export default NoteGrid;
