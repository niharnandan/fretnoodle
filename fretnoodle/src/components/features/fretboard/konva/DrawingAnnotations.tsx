import React from 'react';
import { Line } from 'react-konva';
import { DrawingPoint } from '../../../../types/fretboard';

interface DrawingAnnotationsProps {
  drawingPoints: DrawingPoint[];
  color: string;
  isFullscreen: boolean;
}

const DrawingAnnotations: React.FC<DrawingAnnotationsProps> = React.memo(({
  drawingPoints,
  color,
  isFullscreen,
}) => {
  if (!isFullscreen || drawingPoints.length < 2) return null;

  // Group consecutive dragging points into line segments
  const segments: number[][] = [];
  let currentSegment: number[] = [];

  for (let i = 0; i < drawingPoints.length; i++) {
    const pt = drawingPoints[i];
    if (pt.isDragging && i > 0) {
      const prev = drawingPoints[i - 1];
      if (prev.inFullscreen !== pt.inFullscreen) {
        // Break segment at fullscreen boundary
        if (currentSegment.length >= 4) segments.push(currentSegment);
        currentSegment = [pt.x, pt.y];
      } else {
        if (currentSegment.length === 0) {
          currentSegment = [prev.x, prev.y, pt.x, pt.y];
        } else {
          currentSegment.push(pt.x, pt.y);
        }
      }
    } else {
      if (currentSegment.length >= 4) segments.push(currentSegment);
      currentSegment = [];
    }
  }
  if (currentSegment.length >= 4) segments.push(currentSegment);

  return (
    <>
      {segments.map((pts, i) => (
        <Line
          key={`draw-seg-${i}`}
          points={pts}
          stroke={color}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </>
  );
});

export default DrawingAnnotations;
