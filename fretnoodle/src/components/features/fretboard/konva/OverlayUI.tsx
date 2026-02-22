import React from 'react';
import { Rect, Text, Group } from 'react-konva';

interface OverlayUIProps {
  canvasWidth: number;
  isFullscreen: boolean;
  isDrawingMode: boolean;
  isDarkMode: boolean;
  detectedChord: string | null;
  selectedNotesCount: number;
  mappedNotes: string[];
}

const OverlayUI: React.FC<OverlayUIProps> = React.memo(({
  canvasWidth,
  isFullscreen,
  isDrawingMode,
  isDarkMode,
  detectedChord,
  selectedNotesCount,
  mappedNotes,
}) => {
  if (!isFullscreen) return null;

  const bgColor = isDarkMode ? 'rgba(50, 50, 50, 0.78)' : 'rgba(0, 0, 0, 0.78)';

  return (
    <>
      {/* Chord name */}
      {detectedChord && selectedNotesCount >= 3 && !isDrawingMode && (
        <Group>
          <Rect x={canvasWidth - 370} y={10} width={190} height={30} fill={bgColor} cornerRadius={5} />
          <Text
            x={canvasWidth - 370}
            y={10}
            width={190}
            height={30}
            text={detectedChord}
            fontSize={16}
            fill="rgb(255, 255, 255)"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}

      {/* Mode indicator */}
      {isDrawingMode ? (
        <Group>
          <Rect x={10} y={10} width={140} height={30} fill={bgColor} cornerRadius={5} />
          <Text
            x={15}
            y={10}
            width={130}
            height={30}
            text="Drawing Mode On"
            fontSize={14}
            fill="rgb(255, 255, 255)"
            verticalAlign="middle"
          />
        </Group>
      ) : mappedNotes.length > 0 ? (
        <Group>
          <Rect x={10} y={10} width={270} height={30} fill={bgColor} cornerRadius={5} />
          <Text
            x={15}
            y={10}
            width={260}
            height={30}
            text={`Map Mode: ${mappedNotes.join(', ')} highlighted`}
            fontSize={14}
            fill="rgb(255, 255, 255)"
            verticalAlign="middle"
          />
        </Group>
      ) : (
        <Group>
          <Rect x={10} y={10} width={220} height={30} fill={bgColor} cornerRadius={5} />
          <Text
            x={15}
            y={10}
            width={210}
            height={30}
            text="Press d to enter Drawing Mode"
            fontSize={14}
            fill="rgb(255, 255, 255)"
            verticalAlign="middle"
          />
        </Group>
      )}
    </>
  );
});

export default OverlayUI;
