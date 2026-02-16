import p5 from 'p5';
import { FretboardColors } from '../types/fretboard';

export function createFretboardColors(p: p5, isDark: boolean): FretboardColors {
  return {
    // Background: light gray in light mode, dark gray in dark mode
    background: p.color(isDark ? 30 : 245, isDark ? 30 : 245, isDark ? 30 : 245),

    // Fretboard: wooden color in light mode, darker brown in dark mode
    fretboard: p.color(
      isDark ? 120 : 210,
      isDark ? 100 : 180,
      isDark ? 70 : 140
    ),

    // Fret: dark in light mode, light in dark mode
    fret: p.color(
      isDark ? 150 : 80,
      isDark ? 150 : 80,
      isDark ? 150 : 80
    ),

    // String: silver in light mode, brighter in dark mode
    string: p.color(
      isDark ? 220 : 200,
      isDark ? 220 : 200,
      isDark ? 220 : 200
    ),

    // Dot markers: off-white in light mode, darker in dark mode
    dot: p.color(
      isDark ? 180 : 240,
      isDark ? 180 : 240,
      isDark ? 180 : 240
    ),

    // Capo: remains reddish in both modes
    capo: p.color(120, 20, 20),

    // Note: dark in light mode, light in dark mode
    note: p.color(
      isDark ? 200 : 50,
      isDark ? 200 : 50,
      isDark ? 200 : 50
    ),

    // Highlight: uses theme's primary color
    highlight: p.color(
      isDark ? 39 : 76,
      isDark ? 225 : 175,
      isDark ? 193 : 80
    ),

    // Selected: uses theme's secondary color variations
    selected: p.color(
      isDark ? 39 : 33,
      isDark ? 133 : 150,
      isDark ? 245 : 243
    ),

    // Root note: bright red for visibility
    root: p.color(255, 0, 0, 255),

    // Hover: uses theme's orange/amber accent
    hover: p.color(255, 152, 0, 150),

    // Text: dark in light mode, light in dark mode
    text: p.color(
      isDark ? 220 : 20,
      isDark ? 220 : 20,
      isDark ? 220 : 20
    ),

    // Drawing line: always visible red
    drawLine: p.color(255, 0, 0, 255),

    // Mapped notes - a lighter blue
    mapped: p.color(
      isDark ? 100 : 100,
      isDark ? 180 : 200,
      isDark ? 255 : 255,
      220
    )
  };
}
