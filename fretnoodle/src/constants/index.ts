// Timing constants
export const TIMING = {
  STATE_STABILIZE_DELAY: 200, // ms to wait before considering state stable
  STATE_LOAD_DELAY: 50, // ms delay for state load after React updates
  OPACITY_TRANSITION: 10, // ms for opacity transition
  HOW_TO_BUTTON_DELAY: 400, // ms delay before showing "How To" button
  DOM_SETUP_DELAY: 100, // ms delay for DOM observer setup
  ANIMATION_RESET_DELAY: 500, // ms for animation reset
} as const;

// Fretboard display constants
export const FRETBOARD = {
  FULLSCREEN_FRETS: 24,
  FULLSCREEN_STRING_HEIGHT_RATIO: 0.3,
  NORMAL_WIDTH_RATIO: 0.05,
  FULLSCREEN_WIDTH_RATIO: 0.04,
} as const;

// Animation delays for Home page cards
export const ANIMATION_DELAYS = {
  FEATURE_CARD_STEP: 200, // ms between each feature card animation
  TOOL_FEATURE_STEP: 200, // ms between each tool feature animation
} as const;

// Z-index layers
export const Z_INDEX = {
  NAVBAR: 1100,
  FULLSCREEN_OVERLAY: 1000,
  FULLSCREEN_CONTROLS: 1001,
  FULLSCREEN_STATES: 1002,
} as const;
