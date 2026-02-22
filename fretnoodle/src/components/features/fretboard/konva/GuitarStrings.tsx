import React from 'react';
import { Line } from 'react-konva';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface GuitarStringsProps {
  dims: FretboardDimensions;
  color: string;
}

const GuitarStrings: React.FC<GuitarStringsProps> = React.memo(({ dims, color }) => {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < dims.numStrings; i++) {
    const y = dims.verticalMargin + i * dims.stringSpacing;
    // Thickness varies: thinnest at top (string 0), thickest at bottom
    const thickness = 1 + (i / (dims.numStrings - 1)) * 2;
    elements.push(
      <Line
        key={`string-${i}`}
        points={[dims.horizontalMargin, y, dims.horizontalMargin + dims.fretboardWidth, y]}
        stroke={color}
        strokeWidth={thickness}
      />
    );
  }

  return <>{elements}</>;
});

export default GuitarStrings;
