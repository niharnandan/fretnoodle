import { FretboardColors } from '../types/fretboard';

export function createFretboardColors(isDark: boolean): FretboardColors {
  return {
    background: isDark ? 'rgb(30, 30, 30)' : 'rgb(245, 245, 245)',
    fretboard: isDark ? 'rgb(120, 100, 70)' : 'rgb(210, 180, 140)',
    fret: isDark ? 'rgb(150, 150, 150)' : 'rgb(80, 80, 80)',
    string: isDark ? 'rgb(220, 220, 220)' : 'rgb(200, 200, 200)',
    dot: isDark ? 'rgb(180, 180, 180)' : 'rgb(240, 240, 240)',
    capo: 'rgb(120, 20, 20)',
    note: isDark ? 'rgb(200, 200, 200)' : 'rgb(50, 50, 50)',
    highlight: isDark ? 'rgb(39, 225, 193)' : 'rgb(76, 175, 80)',
    selected: isDark ? 'rgb(39, 133, 245)' : 'rgb(33, 150, 243)',
    root: 'rgba(255, 0, 0, 1)',
    hover: 'rgba(255, 152, 0, 0.59)',
    text: isDark ? 'rgb(220, 220, 220)' : 'rgb(20, 20, 20)',
    drawLine: 'rgba(255, 0, 0, 1)',
    mapped: isDark ? 'rgba(100, 180, 255, 0.86)' : 'rgba(100, 200, 255, 0.86)',
    defaultNote: isDark ? 'rgba(100, 100, 100, 0.59)' : 'rgba(255, 255, 255, 0.59)',
  };
}
