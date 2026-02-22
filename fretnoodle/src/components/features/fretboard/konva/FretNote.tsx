import React, { useState, useCallback } from 'react';
import { Circle, Text, Group } from 'react-konva';
import { FretboardColors } from '../../../../types/fretboard';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface FretNoteProps {
  stringIndex: number;
  fret: number;
  note: string;
  dims: FretboardDimensions;
  colors: FretboardColors;
  isFullscreen: boolean;
  isSelected: boolean;
  isReferenceForIntervals: boolean;
  isHighlighted: boolean;
  isMapped: boolean;
  isDrawingMode: boolean;
  showIntervals: boolean;
  showOctaves: boolean;
  intervalText: string | null;
  onNoteClick: (stringIndex: number, fret: number) => void;
}

const FretNote: React.FC<FretNoteProps> = React.memo(({
  stringIndex,
  fret,
  note,
  dims,
  colors,
  isFullscreen,
  isSelected,
  isReferenceForIntervals,
  isHighlighted,
  isMapped,
  isDrawingMode,
  showIntervals,
  showOctaves,
  intervalText,
  onNoteClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const stringY = dims.verticalMargin + stringIndex * dims.stringSpacing;

  // Position
  let fretX: number;
  if (fret === 0) {
    fretX = dims.horizontalMargin - dims.fretWidth * 0.4;
  } else {
    fretX = dims.horizontalMargin + (fret - 0.5) * dims.fretWidth;
  }

  // Circle color priority
  let fillColor: string;
  if (isReferenceForIntervals) {
    fillColor = colors.root;
  } else if (isSelected) {
    fillColor = colors.selected;
  } else if (isHovered && !isDrawingMode) {
    fillColor = colors.hover;
  } else if (isMapped) {
    fillColor = colors.mapped;
  } else if (isHighlighted) {
    fillColor = colors.highlight;
  } else {
    fillColor = colors.defaultNote;
  }

  const noteSize = isFullscreen ? dims.fretWidth * 0.5 : dims.fretWidth * 0.6;
  const fontSize = isFullscreen ? dims.fretWidth * 0.2 : dims.fretWidth * 0.25;
  const noteRadius = noteSize / 2;

  const handleMouseEnter = useCallback(() => {
    if (!isDrawingMode) setIsHovered(true);
  }, [isDrawingMode]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isDrawingMode) {
      onNoteClick(stringIndex, fret);
    }
  }, [isDrawingMode, onNoteClick, stringIndex, fret]);

  // Note name position
  const noteTextX = fret === 0
    ? fretX - dims.fretWidth * 0.35
    : fretX - (isFullscreen ? dims.fretWidth * 0.35 : dims.fretWidth * 0.4);

  // Show interval inside circle for selected/mapped notes
  const showIntervalText = showIntervals && (isSelected || isMapped) && intervalText;

  return (
    <Group
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Note circle */}
      <Circle
        x={fretX}
        y={stringY}
        radius={noteRadius}
        fill={fillColor}
      />

      {/* Note name text (to the left) */}
      <Text
        x={noteTextX - fontSize}
        y={stringY - fontSize / 2}
        text={note}
        fontSize={fontSize}
        fill={colors.text}
        width={fontSize * 2}
        align="center"
        verticalAlign="middle"
      />

      {/* Interval text inside circle */}
      {showIntervalText && (
        <Text
          x={fretX - noteRadius}
          y={stringY - fontSize / 2}
          text={intervalText}
          fontSize={fontSize}
          fill="rgb(255, 255, 255)"
          width={noteSize}
          align="center"
          verticalAlign="middle"
        />
      )}

      {/* Octave text below */}
      {showOctaves && fret > 0 && (
        <Text
          x={fretX - noteRadius}
          y={stringY + (isFullscreen ? dims.fretWidth * 0.2 : dims.fretWidth * 0.25) - fontSize * 0.4}
          text={(4 - Math.floor(stringIndex / 2)).toString()}
          fontSize={isFullscreen ? dims.fretWidth * 0.15 : dims.fretWidth * 0.2}
          fill={colors.text}
          width={noteSize}
          align="center"
        />
      )}
    </Group>
  );
});

export default FretNote;
