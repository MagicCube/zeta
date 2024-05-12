'use client';

import Textarea from '@mui/joy/Textarea';

import { useVisualViewport } from '../../hooks';
import AppHeader from '../app-header';
import Lorem from '../lorem';

import styles from './index.module.css';

export default function Main() {
  const { scrollableRef, containerProps, targetProps } = useVisualViewport();
  return (
    <div className={styles.container} {...containerProps}>
      <header className={styles.header}>
        <AppHeader />
      </header>
      <main ref={scrollableRef} className={styles.main}>
        <Lorem />
      </main>
      <footer className={styles.footer} {...targetProps}>
        <Textarea id="abc" className={styles.input} placeholder="Message" />
      </footer>
    </div>
  );
}
