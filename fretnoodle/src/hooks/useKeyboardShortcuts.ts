import { useEffect } from 'react';

interface KeyboardShortcutConfig {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleDrawingMode: () => void;
  onToggleMapMode: () => void;
}

export function useKeyboardShortcuts({
  isFullscreen,
  onToggleFullscreen,
  onToggleDrawingMode,
  onToggleMapMode,
}: KeyboardShortcutConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      }
      if (event.key === 'd' && isFullscreen) {
        onToggleDrawingMode();
      }
      if (event.key === 'f') {
        onToggleFullscreen();
      }
      if (event.key === 'm' && isFullscreen) {
        onToggleMapMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen, onToggleDrawingMode, onToggleMapMode]);
}

export default useKeyboardShortcuts;
