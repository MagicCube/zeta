import type React from 'react';
import { useState, useCallback, useEffect } from 'react';

export function useVisualViewport(): {
  containerProps: Pick<React.HTMLAttributes<HTMLElement>, 'style'>;
  targetProps: Pick<React.HTMLAttributes<HTMLElement>, 'style' | 'onMouseDown'>;
} {
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
  }, []);
  useEffect(() => {
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  return {
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
