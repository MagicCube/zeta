import type React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

export function useVisualViewport(): {
  scrollableRef: React.MutableRefObject<HTMLElement | null>;
  containerProps: Pick<React.HTMLAttributes<HTMLElement>, 'style'>;
  targetProps: Pick<React.HTMLAttributes<HTMLElement>, 'style' | 'onMouseDown'>;
} {
  const scrollableRef = useRef<HTMLElement | null>(null);
  const [interactable, setInteractable] = useState(true);
  const [height, setHeight] = useState(window.visualViewport?.height);
  const handleTargetMouseDown = useCallback(() => {
    setInteractable(false);
    setTimeout(() => {
      setInteractable(true);
    }, 0);
  }, []);
  const handleResize = useCallback(() => {
    const height = window.visualViewport?.height;
    if (height) {
      setHeight(height);
    }
    if (scrollableRef.current) {
      const scrollable = scrollableRef.current;
      setTimeout(() => {
        scrollable.scrollTo({
          top: scrollable.scrollHeight - scrollable.clientHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  }, []);
  useEffect(() => {
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  return {
    scrollableRef,
    containerProps: {
      style: {
        height,
      },
    },
    targetProps: {
      style: {
        top: interactable ? undefined : -window.innerHeight,
        position: interactable ? undefined : 'fixed',
      },
      onMouseDown: handleTargetMouseDown,
    },
  };
}
