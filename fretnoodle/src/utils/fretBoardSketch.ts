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
    
    // Margins and dimensions
    let horizontalMargin: number;
    let verticalMargin: number;
    let fretboardWidth: number;
    let fretboardHeight: number;
    let fretWidth: number;
    let stringSpacing: number;
    
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
    
    const setupDimensions = () => {
      // Set horizontal margin
      horizontalMargin = isFullscreen ? p.width * 0.04 : p.width * 0.05;
      
      // Set number of frets based on mode
      const displayFrets = isFullscreen ? 24 : config.numFrets; // 24 frets in fullscreen, default in normal mode
      
      // Calculate width
      fretboardWidth = p.width - horizontalMargin * 2;
      fretWidth = fretboardWidth / displayFrets;
      
      // Calculate height and string spacing based on mode
      if (isFullscreen) {
        // In fullscreen, compress the strings to 40% of canvas height
        const effectiveHeight = p.height * 0.3;
        stringSpacing = effectiveHeight / (numStrings - 1);
        
        // Calculate actual fretboard height based on string spacing
        fretboardHeight = stringSpacing * (numStrings - 1);
        
        // Center vertically
        verticalMargin = (p.height - fretboardHeight) / 2;
      } else {
        // Normal mode - use standard spacing
        verticalMargin = horizontalMargin; // Same margin all around in normal mode
        fretboardHeight = p.height - verticalMargin * 2;
        stringSpacing = fretboardHeight / (numStrings - 1);
      }
    };
    
    p.setup = () => {
      if (isFullscreen) {
        p.createCanvas(window.innerWidth, window.innerHeight);
      } else {
        p.createCanvas(width, height);
      }
      
      setupDimensions();
      p.background(colors.background);
      p.textAlign(p.CENTER, p.CENTER);
      
      // Initialize with current drawing points
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
      
      // Set number of frets based on mode
      const displayFrets = isFullscreen ? 24 : config.numFrets; // 24 frets in fullscreen
      
      p.background(colors.background);
      
      // Draw fretboard background
      p.fill(colors.fretboard);
      p.rect(horizontalMargin, verticalMargin, fretboardWidth, fretboardHeight);
      
      // Draw frets
      p.stroke(colors.fret);
      p.strokeWeight(2);
      for (let i = 0; i <= displayFrets; i++) {
        const x = horizontalMargin + i * fretWidth;
        p.line(x, verticalMargin, x, verticalMargin + fretboardHeight);
      }
      
      // Draw fret numbers below the fretboard
      p.noStroke();
      p.fill(colors.text);
      p.textSize(isFullscreen ? fretWidth * 0.25 : fretWidth * 0.3);
      p.textAlign(p.CENTER, p.TOP);
      for (let i = 1; i <= displayFrets; i++) {
        const x = horizontalMargin + i * fretWidth - fretWidth/2;
        const textYOffset = isFullscreen ? 15 : 25;
        p.text(i.toString(), x, verticalMargin + fretboardHeight + textYOffset);
      }
      
      // Reset text alignment
      p.textAlign(p.CENTER, p.CENTER);
      
      // Draw fret position dots
      if (showDots) {
        p.fill(colors.dot);
        p.noStroke();
        
        const dotSize = isFullscreen ? fretWidth * 0.35 : fretWidth * 0.4;
        
        // Get extended dot positions for 24 frets
        const allDotPositions = [...config.dotPositions];
        if (isFullscreen && !allDotPositions.includes(21)) {
          allDotPositions.push(21);
        }
        if (isFullscreen && !allDotPositions.includes(24)) {
          allDotPositions.push(24);
        }
        
        // Single dots
        for (const position of allDotPositions) {
          // Skip positions beyond our display frets
          if (position > (isFullscreen ? 24 : config.numFrets)) continue;
          
          const x = horizontalMargin + (position - 0.5) * fretWidth;
          const y = verticalMargin + fretboardHeight / 2;
          p.ellipse(x, y, dotSize, dotSize);
        }
        
        // Double dots - including 24th fret in fullscreen mode
        const doubleDotPositions = [...config.doubleDotPositions];
        if (isFullscreen && !doubleDotPositions.includes(24)) {
          doubleDotPositions.push(24);
        }
        
        for (const position of doubleDotPositions) {
          // Skip positions beyond our display frets
          if (position > (isFullscreen ? 24 : config.numFrets)) continue;
          
          const x = horizontalMargin + (position - 0.5) * fretWidth;
          const y1 = verticalMargin + fretboardHeight / 3;
          const y2 = verticalMargin + fretboardHeight * 2/3;
          p.ellipse(x, y1, dotSize, dotSize);
          p.ellipse(x, y2, dotSize, dotSize);
        }
      }
      
      // Draw capo if set
      if (capo > 0 && capo <= numFrets) {
        p.fill(colors.capo);
        p.noStroke();
        const capoX = horizontalMargin + (capo - 0.5) * fretWidth;
        p.rect(capoX - fretWidth * 0.2, verticalMargin - 10, fretWidth * 0.4, fretboardHeight + 20, 5);
      }
      
      // Draw strings
      for (let i = 0; i < numStrings; i++) {
        const y = verticalMargin + i * stringSpacing;
        
        // String thickness varies (thickest at the bottom)
        const thickness = p.map(i, 0, numStrings - 1, 1, 3);
        p.stroke(colors.string);
        p.strokeWeight(thickness);
        p.line(horizontalMargin, y, horizontalMargin + fretboardWidth, y);
      }
      
      // Function to draw notes on the fretboard
      const drawNotes = () => {
        if (!showNotes) return;
        
        p.textSize(isFullscreen ? fretWidth * 0.2 : fretWidth * 0.25);
        
        // Get mouse position to detect hover
        const mouseX = p.mouseX;
        const mouseY = p.mouseY;
        
        // Reset clicked positions
        clickedString = -1;
        clickedFret = -1;
        
        // Use displayFrets based on mode
        const displayFrets = isFullscreen ? 24 : config.numFrets;
        
        for (let string = 0; string < numStrings; string++) {
          const openNote = tuning[string];
          const stringY = verticalMargin + string * stringSpacing;
          
          // Loop through all frets including 0 (open notes)
          for (let fret = 0; fret <= displayFrets; fret++) {
            // For fretted notes, apply capo logic
            if (fret > 0) {
              // Calculate actual fret number considering capo
              const effectiveFret = fret - capo;
              if (effectiveFret <= 0) continue;
            }
            
            // Calculate position and note based on whether it's an open note or fretted note
            let fretX, note, effectiveFret;
            
            if (fret === 0) {
              // Position open notes slightly to the left of the fretboard
              fretX = horizontalMargin - fretWidth * 0.4;
              note = openNote; // Open note is just the tuning note
              effectiveFret = 0;
            } else {
              // Regular notes on the fretboard
              fretX = horizontalMargin + (fret - 0.5) * fretWidth;
              effectiveFret = fret - capo;
              note = getNoteAtFret(openNote, effectiveFret);
            }
            
            // Check if this note is already selected
            const isSelected = selectedNotes.some(
              (n: { string: number; fret: number; }) => n.string === string && n.fret === fret
            );
            
            // Determine if this note should be highlighted
            const isHighlighted = highlightedNotes.includes(note) || 
                               (fret > 0 && highlightedFrets.includes(fret));
            
            // Adjust hover detection settings
            const hoverRadius = isFullscreen ? 8 : 10;
            let isHovered = false;
            
            if (fret === 0) {
              // Hover detection for open notes
              isHovered = !drawingModeRef.current &&
                         mouseY >= stringY - hoverRadius &&
                         mouseY <= stringY + hoverRadius &&
                         mouseX >= fretX - hoverRadius &&
                         mouseX <= fretX + hoverRadius;
            } else {
              // Hover detection for regular notes
              const fretStartX = horizontalMargin + (fret - 1) * fretWidth;
              const fretEndX = horizontalMargin + fret * fretWidth;
              isHovered = !drawingModeRef.current &&
                         mouseY >= stringY - hoverRadius &&
                         mouseY <= stringY + hoverRadius &&
                         mouseX >= fretStartX &&
                         mouseX <= fretEndX;
            }
            
            // If mouse is hovering and not in drawing mode, store the string and fret for potential clicks
            if (isHovered && !drawingModeRef.current) {
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
              // Semi-transparent white in light mode, semi-transparent dark gray in dark mode
              p.fill(themeRef.current ? 100 : 255, themeRef.current ? 100 : 255, themeRef.current ? 100 : 255, 150);
            }
            
            p.noStroke();
            const noteSize = isFullscreen ? fretWidth * 0.5 : fretWidth * 0.6;
            p.ellipse(fretX, stringY, noteSize, noteSize);
            
            // Draw note name with adjusted position based on fret
            p.fill(isSelected || isHovered ? colors.hover : colors.text);
            
            if (fret === 0) {
              // For open notes, position the text to the left of the circle
              const textOffset = fretWidth * 0.35;
              // Use regular text alignment but adjust the position
              p.text(note, fretX - textOffset, stringY);
            } else {
              // For regular notes, position as before
              const noteTextOffset = isFullscreen ? fretWidth * 0.35 : fretWidth * 0.4;
              p.text(note, fretX - noteTextOffset, stringY);
            }
            
            // Draw octave if enabled
            if (showOctaves && fret > 0) { // Only show octaves for fretted notes
              const octave = 4 - Math.floor(string / 2); // Simplified octave calculation
              p.textSize(isFullscreen ? fretWidth * 0.15 : fretWidth * 0.2);
              const octaveOffset = isFullscreen ? fretWidth * 0.2 : fretWidth * 0.25;
              p.text(octave.toString(), fretX, stringY + octaveOffset);
              p.textSize(isFullscreen ? fretWidth * 0.2 : fretWidth * 0.4);
            }
          }
        }
      };
      
      // Draw chord name if detected
      const drawChordName = () => {
        if (detectedChord && selectedNotes.length >= 3 && !drawingModeRef.current && isFullscreen) {
          p.fill(themeRef.current ? 50 : 0, themeRef.current ? 50 : 0, themeRef.current ? 50 : 0, 200);
          p.noStroke();
          p.rect(p.width - 370, 10, 190, 30, 5);
          
          p.fill(255);
          p.textSize(16);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(detectedChord, p.width - 275, 25);
          
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
        // Theme-aware UI elements - smaller and more compact in fullscreen
        const bgColor = themeRef.current ? 
          p.color(50, 50, 50, 200) : p.color(0, 0, 0, 200);
        
        if (drawingModeRef.current) {
          p.fill(bgColor);
          p.noStroke();
          p.rect(10, 10, 140, 30, 5);
          
          p.fill(255);
          p.textSize(14);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("Drawing Mode On", 15, 25);
          p.textAlign(p.CENTER, p.CENTER);
        }
        else {
          p.fill(bgColor);
          p.noStroke();
          p.rect(10, 10, 220, 30, 5);
          
          p.fill(255);
          p.textSize(14);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("Press d to enter Drawing Mode", 15, 25);
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
      } else if (!isDrawingModeActive && clickedString >= 0 && clickedFret >= 0) {
        // Allow note clicking when not in drawing mode - now including open notes (fret = 0)
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