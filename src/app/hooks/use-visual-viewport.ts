import { useState, useCallback, useEffect, useRef } from 'react';

export function useVisualViewport() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const keyboardShown = window.visualViewport!.offsetTop > 10;
  const handleResize = useCallback(() => {
    setTop(window.visualViewport!.offsetTop);
    if (window.visualViewport!.offsetTop > 0) {
      setTimeout(() => {
        // scroll to bottom
        scrollableRef.current!.scrollTo({
          top: scrollableRef.current!.scrollHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  }, []);
  useEffect(() => {
    window.visualViewport!.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport!.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  return {
    containerProps: {
      'data-keyboard': keyboardShown ? 'shown' : undefined,
      style: { top },
    },
    scrollableRef,
  };
}
