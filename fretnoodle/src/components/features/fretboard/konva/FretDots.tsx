import React from 'react';
import { Circle } from 'react-konva';
import { DEFAULT_FRETBOARD_CONFIG } from '../../../../types/fretboard';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface FretDotsProps {
  dims: FretboardDimensions;
  color: string;
  isFullscreen: boolean;
}

const FretDots: React.FC<FretDotsProps> = React.memo(({ dims, color, isFullscreen }) => {
  const config = DEFAULT_FRETBOARD_CONFIG;
  const dotRadius = (isFullscreen ? dims.fretWidth * 0.35 : dims.fretWidth * 0.4) / 2;

  const allDotPositions = [...config.dotPositions];
  if (isFullscreen && !allDotPositions.includes(21)) allDotPositions.push(21);
  if (isFullscreen && !allDotPositions.includes(24)) allDotPositions.push(24);

  const doubleDotPositions = [...config.doubleDotPositions];
  if (isFullscreen && !doubleDotPositions.includes(24)) doubleDotPositions.push(24);

  const elements: React.ReactNode[] = [];

  // Single dots
  for (const pos of allDotPositions) {
    if (pos > dims.displayFrets) continue;
    // Skip positions that are double dots
    if (doubleDotPositions.includes(pos)) continue;
    const x = dims.horizontalMargin + (pos - 0.5) * dims.fretWidth;
    const y = dims.verticalMargin + dims.fretboardHeight / 2;
    elements.push(<Circle key={`dot-${pos}`} x={x} y={y} radius={dotRadius} fill={color} />);
  }

  // Double dots
  for (const pos of doubleDotPositions) {
    if (pos > dims.displayFrets) continue;
    const x = dims.horizontalMargin + (pos - 0.5) * dims.fretWidth;
    const y1 = dims.verticalMargin + dims.fretboardHeight / 3;
    const y2 = dims.verticalMargin + (dims.fretboardHeight * 2) / 3;
    elements.push(<Circle key={`ddot-${pos}-1`} x={x} y={y1} radius={dotRadius} fill={color} />);
    elements.push(<Circle key={`ddot-${pos}-2`} x={x} y={y2} radius={dotRadius} fill={color} />);
  }

  return <>{elements}</>;
});

export default FretDots;
