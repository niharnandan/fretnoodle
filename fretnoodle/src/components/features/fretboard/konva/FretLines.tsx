import React from 'react';
import { Line, Text } from 'react-konva';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface FretLinesProps {
  dims: FretboardDimensions;
  fretColor: string;
  textColor: string;
  isFullscreen: boolean;
}

const FretLines: React.FC<FretLinesProps> = React.memo(({ dims, fretColor, textColor, isFullscreen }) => {
  const elements: React.ReactNode[] = [];

  // Fret lines
  for (let i = 0; i <= dims.displayFrets; i++) {
    const x = dims.horizontalMargin + i * dims.fretWidth;
    elements.push(
      <Line
        key={`fret-${i}`}
        points={[x, dims.verticalMargin, x, dims.verticalMargin + dims.fretboardHeight]}
        stroke={fretColor}
        strokeWidth={2}
      />
    );
  }

  // Fret numbers
  const fontSize = isFullscreen ? dims.fretWidth * 0.25 : dims.fretWidth * 0.3;
  const textYOffset = isFullscreen ? 15 : 25;

  for (let i = 1; i <= dims.displayFrets; i++) {
    const x = dims.horizontalMargin + i * dims.fretWidth - dims.fretWidth / 2;
    elements.push(
      <Text
        key={`fret-num-${i}`}
        x={x}
        y={dims.verticalMargin + dims.fretboardHeight + textYOffset}
        text={i.toString()}
        fontSize={fontSize}
        fill={textColor}
        align="center"
        offsetX={0}
        width={dims.fretWidth}
      />
    );
  }

  return <>{elements}</>;
});

export default FretLines;
