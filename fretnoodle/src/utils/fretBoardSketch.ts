import p5 from 'p5';
import { 
  DEFAULT_FRETBOARD_CONFIG, 
  getNoteAtFret, 
  DrawingPoint,
  FretboardColors
} from '../types/fretboard';

// Create a sketch factory function that accepts refs and handlers
export const createFretboardSketch = (
  fretboardStateRef: React.MutableRefObject<any>,
  drawingModeRef: React.MutableRefObject<boolean>,
  drawingPointsRef: React.MutableRefObject<DrawingPoint[]>,
  themeRef: React.MutableRefObject<boolean>,
  handleNoteClick: (stringIndex: number, fret: number) => void,
  width: number,
  height: number,
  isFullscreen: boolean
) => {
  return (p: p5) => {
    // Configuration
    const config = DEFAULT_FRETBOARD_CONFIG;
    const numFrets = config.numFrets;
    const numStrings = config.numStrings;
    
    // Variables for note clicking
    let clickedString = -1;
    let clickedFret = -1;
    
    // Drawing variables
    let isDrawing = false;
    let currentDrawingPoints: DrawingPoint[] = [];
    
    // Create a function to get current theme-aware colors
    const getColors = (): FretboardColors => {
      const isDark = themeRef.current;
      
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
        
        // Hover: uses theme's orange/amber accent
        hover: p.color(255, 152, 0, 150),
        
        // Text: dark in light mode, light in dark mode
        text: p.color(
          isDark ? 220 : 20, 
          isDark ? 220 : 20, 
          isDark ? 220 : 20
        ),
        
        // Drawing line: always visible red
        drawLine: p.color(255, 0, 0, 255)
      };
    };
    
    // Create colors object
    let colors = getColors();
    
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
      if (isFullscreen) {
        p.createCanvas(window.innerWidth, window.innerHeight);
      } else {
        p.createCanvas(width, height);
      }
      p.background(colors.background);
      p.textAlign(p.CENTER, p.CENTER);
      setupDimensions();
      
      // Initialize with current drawing points - work with a copy to avoid state issues
      currentDrawingPoints = [...drawingPointsRef.current];
    };
    
    p.draw = () => {
      // Get current fretboard state from ref
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
      } = fretboardStateRef.current;
      
      // Update colors in case theme changed
      colors = getColors();
      
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
      
      // Draw fret numbers below the fretboard
      p.noStroke();
      p.fill(colors.text);
      p.textSize(fretWidth * 0.3);
      p.textAlign(p.CENTER, p.TOP);
      for (let i = 1; i <= numFrets; i++) {
        const x = margin + i * fretWidth;
        p.text(i.toString(), x - fretWidth/2, margin + fretboardHeight + 25);
      }
      
      // Reset text alignment
      p.textAlign(p.CENTER, p.CENTER);
      
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
        
        p.textSize(fretWidth * 0.25);
        
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
              (n: { string: number; fret: number; }) => n.string === string && n.fret === fret
            );
            
            // Determine if this note should be highlighted
            const isHighlighted = highlightedNotes.includes(note) || 
                                highlightedFrets.includes(fret);
            
            // Check if mouse is hovering over this note (only when not in drawing mode)
            // Adjust hover detection radius to match the smaller circle size
            // Define the area between frets for this string
            const fretStartX = margin + (fret - 1) * fretWidth;
            const fretEndX = margin + fret * fretWidth;
            const isHovered = !drawingModeRef.current &&
                             mouseY >= stringY - 10 &&
                             mouseY <= stringY + 10 &&
                             mouseX >= fretStartX &&
                             mouseX <= fretEndX;
            
            // If mouse is hovering and not in drawing mode, store the string and fret for potential clicks
            if (isHovered && !drawingModeRef.current) {
              clickedString = string;
              clickedFret = fret;
            }
            
            // Draw note circle with appropriate color - smaller size
            if (isSelected) {
              p.fill(colors.selected);
            } else if (isHovered) {
              p.fill(colors.hover);
            } else if (isHighlighted) {
              p.fill(colors.highlight);
            } else {
              // Semi-transparent white in light mode, semi-transparent dark gray in dark mode
              p.fill(themeRef.current ? 100 : 255, themeRef.current ? 100 : 255, themeRef.current ? 100 : 255, 150);
            }
            
            p.noStroke();
            // Decrease circle size from 0.7 to 0.5
            p.ellipse(fretX, stringY, fretWidth * 0.6, fretWidth * 0.6);
            
            // Draw note name to the left of the circle
            p.fill(isSelected || isHovered ? colors.hover : colors.text);
            p.text(note, fretX - fretWidth * 0.4, stringY);
            
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
        if (detectedChord && selectedNotes.length >= 3 && !drawingModeRef.current && isFullscreen) {
          // Adjust background color based on theme
          p.fill(themeRef.current ? 50 : 0, themeRef.current ? 50 : 0, themeRef.current ? 50 : 0, 200);
          p.noStroke();
          p.rect(p.width - 400, 10, 190, 40, 5);
          
          // Text is white in both modes for contrast
          p.fill(255);
          p.textSize(18);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(detectedChord, p.width - 305, 30);
          
          // Reset text alignment
          p.textAlign(p.CENTER, p.CENTER);
        }
      };
      
      // Draw notes on the fretboard if enabled
      drawNotes();
      
      // Draw detected chord name
      drawChordName();
      
      // Draw all saved drawing points - ONLY IN FULLSCREEN MODE
      if (isFullscreen && currentDrawingPoints.length > 0) {
        p.stroke(colors.drawLine);
        p.strokeWeight(4);
        
        for (let i = 1; i < currentDrawingPoints.length; i++) {
          if (currentDrawingPoints[i].isDragging) {
            // Get points
            const p1 = currentDrawingPoints[i-1];
            const p2 = currentDrawingPoints[i];
            
            // Skip if points aren't connected (e.g., from different drawing sessions)
            if (p1.inFullscreen !== p2.inFullscreen) continue;
            
            // Direct line drawing
            p.line(p1.x, p1.y, p2.x, p2.y);
          }
        }
      }
      
      if (isFullscreen){
        // Theme-aware UI elements
        const bgColor = themeRef.current ? 
          p.color(50, 50, 50, 200) : p.color(0, 0, 0, 200);
        
        if (drawingModeRef.current) {
          p.fill(bgColor);
          p.noStroke();
          p.rect(10, 10, 160, 40, 5);
          
          p.fill(255);
          p.textSize(16);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("Drawing Mode On", 20, 30);
          p.textAlign(p.CENTER, p.CENTER);
        }
        else {
          p.fill(bgColor);
          p.noStroke();
          p.rect(10, 10, 250, 40, 5);
          
          p.fill(255);
          p.textSize(16);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("Press d to enter Drawing Mode", 20, 30);
          p.textAlign(p.CENTER, p.CENTER);
        }
      }
    };

    p.mousePressed = () => {
      const isDrawingModeActive = drawingModeRef.current;
      
      if (isFullscreen && isDrawingModeActive) {
        isDrawing = true;
        
        // Add a new point (not dragging yet)
        const newPoint: DrawingPoint = { 
          x: p.mouseX, 
          y: p.mouseY, 
          isDragging: false,
          inFullscreen: true
        };
        
        // Update both the local and component state
        currentDrawingPoints = [...currentDrawingPoints, newPoint];
        drawingPointsRef.current = [...drawingPointsRef.current, newPoint];
        
        return false; // Prevent default behavior
      } else if (!isDrawingModeActive && clickedString >= 0 && clickedFret > 0) {
        // Only allow note clicking when not in drawing mode
        // Call the handler directly instead of using the prop
        handleNoteClick(clickedString, clickedFret);
        return false; // Prevent default behavior
      }
      
      return true;
    };
    
    p.mouseDragged = () => {
      if (isFullscreen && drawingModeRef.current && isDrawing) {
        // Add a new point with dragging
        const newPoint: DrawingPoint = { 
          x: p.mouseX, 
          y: p.mouseY, 
          isDragging: true,
          inFullscreen: true
        };
        
        // Update both the local and component state
        currentDrawingPoints = [...currentDrawingPoints, newPoint];
        drawingPointsRef.current = [...drawingPointsRef.current, newPoint];
        
        return false; // Prevent default behavior
      }
      
      return true;
    };
    
    p.mouseReleased = () => {
      isDrawing = false;
      return true;
    };
    
    p.windowResized = () => {
      if (isFullscreen) {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      } else {
        p.resizeCanvas(width, height);
      }
      setupDimensions();
    };
  };
};