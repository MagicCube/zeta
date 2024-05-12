'use client';

import Textarea from '@mui/joy/Textarea';
import { useCallback, useEffect, useState } from 'react';

import Lorem from '../lorem';

import styles from './index.module.css';

export default function Main() {
  const [hacking, setHacking] = useState(false);
  const [height, setHeight] = useState(window.visualViewport?.height);
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
  return (
    <div
      className={styles.container}
      style={{
        height,
      }}
    >
      <header className={styles.header}>Zeta</header>
      <main className={styles.main}>
        <Lorem />
      </main>
      <footer className={styles.footer}>
        <Textarea
          id="abc"
          className={styles.input}
          placeholder="Message"
          style={{
            top: hacking ? -200 : undefined,
            position: hacking ? 'fixed' : undefined,
          }}
          onMouseDown={() => {
            setHacking(true);
            setTimeout(() => {
              setHacking(false);
            }, 0);
          }}
        />
      </footer>
    </div>
  );
}
