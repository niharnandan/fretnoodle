import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface UseP5Props {
  sketch: (p: p5) => void;
  parentDivId: string;
}

const useP5 = ({ sketch, parentDivId }: UseP5Props) => {
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    // Initialize p5 instance
    const parentElement = document.getElementById(parentDivId);
    if (parentElement) {
      p5Instance.current = new p5(sketch, parentElement);
    }

    // Cleanup function
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [sketch, parentDivId]);

  return p5Instance;
};

export default useP5;