import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import P5Canvas from '../../layout/common/P5Canvas';
import { 
  FretboardState, 
  DEFAULT_FRETBOARD_CONFIG,
  getNoteAtFret,
  NOTE_SEQUENCE
} from '../../../types/fretboard';

interface FretboardVisualizerProps {
  fretboardState: FretboardState;
  width?: number;
  height?: number;
  onNoteClick?: (stringIndex: number, fret: number) => void;
}

const FretboardVisualizer: React.FC<FretboardVisualizerProps> = ({
  fretboardState,
  width = 1000,
  height = 300,
  onNoteClick
}) => {
  const {
    tuning,
    capo,
    highlightedNotes,
    highlightedFrets,
    selectedNotes,
    detectedChord,
    showNotes,
    showOctaves,
    showDots
  } = fretboardState;
  
  const sketchFretboard = useCallback((p: p5) => {
    // Configuration
    const config = DEFAULT_FRETBOARD_CONFIG;
    const numFrets = config.numFrets;
    const numStrings = config.numStrings;
    
    // Variables for note clicking
    let clickedString = -1;
    let clickedFret = -1;
    
    // Colors
    const colors = {
      background: p.color(245, 245, 245),
      fretboard: p.color(210, 180, 140),
      fret: p.color(80, 80, 80),
      string: p.color(200, 200, 200),
      dot: p.color(240, 240, 240),
      capo: p.color(120, 20, 20),
      note: p.color(50, 50, 50),
      highlight: p.color(76, 175, 80),
      selected: p.color(33, 150, 243),
      hover: p.color(255, 152, 0, 150),
      text: p.color(20, 20, 20)
    };
    
    // Calculate dimensions
    let fretboardWidth: number;
    let fretboardHeight: number;
    let fretWidth: number;
    let stringSpacing: number;
    let margin: number;
    
    const setupDimensions = () => {
      margin = p.width * 0.05;
      fretboardWidth = p.width - margin * 2;
      fretboardHeight = p.height - margin * 2;
      fretWidth = fretboardWidth / numFrets;
      stringSpacing = fretboardHeight / (numStrings - 1);
    };
    
    p.setup = () => {
      p.createCanvas(width, height);
      p.background(colors.background);
      p.textAlign(p.CENTER, p.CENTER);
      setupDimensions();
    };
    
    p.draw = () => {
      p.background(colors.background);
      
      // Draw fretboard background
      p.fill(colors.fretboard);
      p.rect(margin, margin, fretboardWidth, fretboardHeight);
      
      // Draw frets
      p.stroke(colors.fret);
      p.strokeWeight(2);
      for (let i = 0; i <= numFrets; i++) {
        const x = margin + i * fretWidth;
        p.line(x, margin, x, margin + fretboardHeight);
      }
      
      // Draw fret position dots
      if (showDots) {
        p.fill(colors.dot);
        p.noStroke();
        
        // Single dots
        for (const position of config.dotPositions) {
          if (position <= numFrets) {
            const x = margin + (position - 0.5) * fretWidth;
            const y = margin + fretboardHeight / 2;
            p.ellipse(x, y, fretWidth * 0.4, fretWidth * 0.4);
          }
        }
        
        // Double dots
        for (const position of config.doubleDotPositions) {
          if (position <= numFrets) {
            const x = margin + (position - 0.5) * fretWidth;
            const y1 = margin + fretboardHeight / 3;
            const y2 = margin + fretboardHeight * 2/3;
            p.ellipse(x, y1, fretWidth * 0.4, fretWidth * 0.4);
            p.ellipse(x, y2, fretWidth * 0.4, fretWidth * 0.4);
          }
        }
      }
      
      // Draw capo if set
      if (capo > 0 && capo <= numFrets) {
        p.fill(colors.capo);
        p.noStroke();
        const capoX = margin + (capo - 0.5) * fretWidth;
        p.rect(capoX - fretWidth * 0.2, margin - 10, fretWidth * 0.4, fretboardHeight + 20, 5);
      }
      
      // Draw strings
      for (let i = 0; i < numStrings; i++) {
        const y = margin + i * stringSpacing;
        
        // String thickness varies (thickest at the bottom)
        const thickness = p.map(i, 0, numStrings - 1, 1, 3);
        p.stroke(colors.string);
        p.strokeWeight(thickness);
        p.line(margin, y, margin + fretboardWidth, y);
        
        // Draw open string note names
        if (showNotes) {
          p.fill(colors.text);
          p.noStroke();
          p.textSize(fretWidth * 0.3);
          p.text(tuning[i], margin - fretWidth * 0.5, y);
        }
      }
      
      // Function to draw notes on the fretboard
    const drawNotes = () => {
      if (!showNotes) return;
      
      p.textSize(fretWidth * 0.4);
      
      // Get mouse position to detect hover
      const mouseX = p.mouseX;
      const mouseY = p.mouseY;
      
      // Reset clicked positions
      clickedString = -1;
      clickedFret = -1;
      
      for (let string = 0; string < numStrings; string++) {
        const openNote = tuning[string];
        const stringY = margin + string * stringSpacing;
        
        for (let fret = 0; fret <= numFrets; fret++) {
          // Skip the open string notes (already drawn)
          if (fret === 0) continue;
          
          // Calculate actual fret number considering capo
          const effectiveFret = fret - capo;
          if (effectiveFret <= 0) continue;
          
          const fretX = margin + (fret - 0.5) * fretWidth;
          const note = getNoteAtFret(openNote, effectiveFret);
          
          // Check if this note is already selected
          const isSelected = selectedNotes.some(
            n => n.string === string && n.fret === fret
          );
          
          // Determine if this note should be highlighted
          const isHighlighted = highlightedNotes.includes(note) || 
                              highlightedFrets.includes(fret);
          
          // Check if mouse is hovering over this note
          const isHovered = p.dist(mouseX, mouseY, fretX, stringY) < fretWidth * 0.35;
          
          // If mouse is hovering, store the string and fret for potential clicks
          if (isHovered) {
            clickedString = string;
            clickedFret = fret;
          }
          
          // Draw note circle with appropriate color
          if (isSelected) {
            p.fill(colors.selected);
          } else if (isHovered) {
            p.fill(colors.hover);
          } else if (isHighlighted) {
            p.fill(colors.highlight);
          } else {
            p.fill(255, 255, 255, 150); // Semi-transparent
          }
          
          p.noStroke();
          p.ellipse(fretX, stringY, fretWidth * 0.7, fretWidth * 0.7);
          
          // Draw note name
          p.fill(isSelected || isHovered ? colors.hover : colors.text);
          p.text(note, fretX, stringY);
          
          // Draw octave if enabled
          if (showOctaves) {
            const octave = 4 - Math.floor(string / 2); // Simplified octave calculation
            p.textSize(fretWidth * 0.2);
            p.text(octave.toString(), fretX, stringY + fretWidth * 0.25);
            p.textSize(fretWidth * 0.4); // Reset text size
          }
        }
      }
    };
    
    // Draw chord name if detected
    const drawChordName = () => {
      if (detectedChord && selectedNotes.length >= 3) {
        p.fill(0, 0, 0, 200);
        p.noStroke();
        p.rect(p.width - 200, 10, 190, 40, 5);
        
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(detectedChord, p.width - 105, 30);
        
        // Reset text alignment
        p.textAlign(p.CENTER, p.CENTER);
      }
    };
    
    // Draw notes on the fretboard if enabled
    drawNotes();
    
    // Draw detected chord name
    drawChordName();
    };
    
    // Function to handle mouse clicks
    p.mousePressed = () => {
      if (clickedString >= 0 && clickedFret > 0 && onNoteClick) {
        onNoteClick(clickedString, clickedFret);
        return false; // Prevent default behavior
      }
      return true;
    };
    
    p.windowResized = () => {
      p.resizeCanvas(width, height);
      setupDimensions();
    };
  }, [fretboardState, width, height]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 2
      }}
    >
      <P5Canvas 
        sketch={sketchFretboard} 
        id="fretboard-visualizer"
        width={width}
        height={height}
      />
    </Box>
  );
};

export default FretboardVisualizer;