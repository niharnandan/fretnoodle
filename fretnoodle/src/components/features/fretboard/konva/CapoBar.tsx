import React from 'react';
import { Rect } from 'react-konva';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface CapoBarProps {
  dims: FretboardDimensions;
  capo: number;
  color: string;
}

const CapoBar: React.FC<CapoBarProps> = React.memo(({ dims, capo, color }) => {
  if (capo <= 0) return null;

  const capoX = dims.horizontalMargin + (capo - 0.5) * dims.fretWidth;
  return (
    <Rect
      x={capoX - dims.fretWidth * 0.2}
      y={dims.verticalMargin - 10}
      width={dims.fretWidth * 0.4}
      height={dims.fretboardHeight + 20}
      fill={color}
      cornerRadius={5}
    />
  );
});

export default CapoBar;
