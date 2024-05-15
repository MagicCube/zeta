import type React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

export function useVisualViewport(): {
  scrollableRef: React.MutableRefObject<HTMLElement | null>;
  containerProps: Pick<React.HTMLAttributes<HTMLElement>, 'style'>;
  targetProps: Pick<
    React.HTMLAttributes<HTMLElement>,
    'style' | 'onMouseDown' | 'onFocus'
  >;
} {
  const scrollableRef = useRef<HTMLElement | null>(null);
  const [interactable, setInteractable] = useState(true);
  const [height, setHeight] = useState(window.visualViewport?.height);
  const scrollToBottom = useCallback(() => {
    if (scrollableRef.current) {
      const scrollable = scrollableRef.current;
      setTimeout(() => {
        scrollable.scrollTo({
          top: scrollable.scrollHeight - scrollable.clientHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, []);
  const handleTargetMouseDown = useCallback(() => {
    setInteractable(false);
    setTimeout(() => {
      setInteractable(true);
    }, 100);
  }, []);
  const handleResize = useCallback(() => {
    const height = window.visualViewport?.height;
    if (height) {
      setHeight(height);
    }
    scrollToBottom();
  }, [scrollToBottom]);
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
      onFocus: scrollToBottom,
      onMouseDown: handleTargetMouseDown,
    },
  };
}
