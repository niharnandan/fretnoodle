import { DEFAULT_FRETBOARD_CONFIG } from '../types/fretboard';
import { FRETBOARD } from '../constants';

export interface FretboardDimensions {
  horizontalMargin: number;
  verticalMargin: number;
  fretboardWidth: number;
  fretboardHeight: number;
  fretWidth: number;
  stringSpacing: number;
  displayFrets: number;
  numStrings: number;
}

export function calculateDimensions(
  canvasWidth: number,
  canvasHeight: number,
  isFullscreen: boolean
): FretboardDimensions {
  const config = DEFAULT_FRETBOARD_CONFIG;
  const numStrings = config.numStrings;
  const displayFrets = isFullscreen ? FRETBOARD.FULLSCREEN_FRETS : config.numFrets;

  const horizontalMargin = isFullscreen
    ? canvasWidth * FRETBOARD.FULLSCREEN_WIDTH_RATIO
    : canvasWidth * FRETBOARD.NORMAL_WIDTH_RATIO;

  const fretboardWidth = canvasWidth - horizontalMargin * 2;
  const fretWidth = fretboardWidth / displayFrets;

  let verticalMargin: number;
  let fretboardHeight: number;
  let stringSpacing: number;

  if (isFullscreen) {
    const effectiveHeight = canvasHeight * FRETBOARD.FULLSCREEN_STRING_HEIGHT_RATIO;
    stringSpacing = effectiveHeight / (numStrings - 1);
    fretboardHeight = stringSpacing * (numStrings - 1);
    verticalMargin = (canvasHeight - fretboardHeight) / 2;
  } else {
    verticalMargin = horizontalMargin;
    fretboardHeight = canvasHeight - verticalMargin * 2;
    stringSpacing = fretboardHeight / (numStrings - 1);
  }

  return {
    horizontalMargin,
    verticalMargin,
    fretboardWidth,
    fretboardHeight,
    fretWidth,
    stringSpacing,
    displayFrets,
    numStrings,
  };
}
