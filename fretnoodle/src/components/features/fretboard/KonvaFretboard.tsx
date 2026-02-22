import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { FretboardState, FretboardColors, DrawingPoint } from '../../../types/fretboard';
import { calculateDimensions } from '../../../utils/fretboardDimensions';
import FretboardBackground from './konva/FretboardBackground';
import FretLines from './konva/FretLines';
import FretDots from './konva/FretDots';
import CapoBar from './konva/CapoBar';
import GuitarStrings from './konva/GuitarStrings';
import NoteGrid from './konva/NoteGrid';
import DrawingAnnotations from './konva/DrawingAnnotations';
import OverlayUI from './konva/OverlayUI';

interface KonvaFretboardProps {
  fretboardState: FretboardState;
  colors: FretboardColors;
  mappedNotes: string[];
  width: number;
  height: number;
  isFullscreen: boolean;
  isDrawingMode: boolean;
  isDarkMode: boolean;
  drawingPoints: DrawingPoint[];
  onDrawingPointsChange: (points: DrawingPoint[]) => void;
  onNoteClick: (stringIndex: number, fret: number) => void;
  id: string;
}

const KonvaFretboard: React.FC<KonvaFretboardProps> = React.memo(({
  fretboardState,
  colors,
  mappedNotes,
  width,
  height,
  isFullscreen,
  isDrawingMode,
  isDarkMode,
  drawingPoints,
  onDrawingPointsChange,
  onNoteClick,
  id,
}) => {
  // Responsive canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: isFullscreen ? window.innerWidth : width,
    height: isFullscreen ? window.innerHeight : height,
  });

  useEffect(() => {
    if (isFullscreen) {
      const handleResize = () => {
        setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      setCanvasSize({ width, height });
    }
  }, [isFullscreen, width, height]);

  const dims = useMemo(
    () => calculateDimensions(canvasSize.width, canvasSize.height, isFullscreen),
    [canvasSize.width, canvasSize.height, isFullscreen]
  );

  // Drawing state
  const isDrawingRef = React.useRef(false);

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isFullscreen || !isDrawingMode) return;
      isDrawingRef.current = true;

      const stage = e.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      const newPoint: DrawingPoint = {
        x: pos.x,
        y: pos.y,
        isDragging: false,
        inFullscreen: true,
      };
      onDrawingPointsChange([...drawingPoints, newPoint]);
    },
    [isFullscreen, isDrawingMode, drawingPoints, onDrawingPointsChange]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isFullscreen || !isDrawingMode || !isDrawingRef.current) return;

      const stage = e.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      const newPoint: DrawingPoint = {
        x: pos.x,
        y: pos.y,
        isDragging: true,
        inFullscreen: true,
      };
      onDrawingPointsChange([...drawingPoints, newPoint]);
    },
    [isFullscreen, isDrawingMode, drawingPoints, onDrawingPointsChange]
  );

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  // Stage cast needed: react-konva types don't include children for React 19
  const StageAny = Stage as any;

  return (
    <div id={id}>
      <StageAny
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ background: colors.background }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Static layer — no hit testing */}
        <Layer listening={false}>
          <FretboardBackground dims={dims} color={colors.fretboard} />
          <FretLines
            dims={dims}
            fretColor={colors.fret}
            textColor={colors.text}
            isFullscreen={isFullscreen}
          />
          {fretboardState.showDots && (
            <FretDots dims={dims} color={colors.dot} isFullscreen={isFullscreen} />
          )}
          <CapoBar dims={dims} capo={fretboardState.capo} color={colors.capo} />
          <GuitarStrings dims={dims} color={colors.string} />
        </Layer>

        {/* Interactive layer — note click/hover */}
        <Layer>
          <NoteGrid
            dims={dims}
            fretboardState={fretboardState}
            colors={colors}
            mappedNotes={mappedNotes}
            isFullscreen={isFullscreen}
            isDrawingMode={isDrawingMode}
            onNoteClick={onNoteClick}
          />
        </Layer>

        {/* Overlay layer — drawing + UI */}
        <Layer listening={false}>
          <DrawingAnnotations
            drawingPoints={drawingPoints}
            color={colors.drawLine}
            isFullscreen={isFullscreen}
          />
          <OverlayUI
            canvasWidth={canvasSize.width}
            isFullscreen={isFullscreen}
            isDrawingMode={isDrawingMode}
            isDarkMode={isDarkMode}
            detectedChord={fretboardState.detectedChord}
            selectedNotesCount={fretboardState.selectedNotes.length}
            mappedNotes={mappedNotes}
          />
        </Layer>
      </StageAny>
    </div>
  );
});

export default KonvaFretboard;
