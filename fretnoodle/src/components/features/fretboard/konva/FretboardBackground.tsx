import React from 'react';
import { Rect } from 'react-konva';
import { FretboardDimensions } from '../../../../utils/fretboardDimensions';

interface FretboardBackgroundProps {
  dims: FretboardDimensions;
  color: string;
}

const FretboardBackground: React.FC<FretboardBackgroundProps> = React.memo(({ dims, color }) => (
  <Rect
    x={dims.horizontalMargin}
    y={dims.verticalMargin}
    width={dims.fretboardWidth}
    height={dims.fretboardHeight}
    fill={color}
  />
));

export default FretboardBackground;
