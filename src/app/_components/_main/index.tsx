'use client';

import Textarea from '@mui/joy/Textarea';

import { useVisualViewport } from '../../hooks/use-visual-viewport';
import Lorem from '../lorem';

import styles from './index.module.css';

export default function Main() {
  const { containerProps, targetProps } = useVisualViewport();
  return (
    <div className={styles.container} {...containerProps}>
      <header className={styles.header}>Zeta</header>
      <main className={styles.main}>
        <Lorem />
      </main>
      <footer className={styles.footer} {...targetProps}>
        <Textarea id="abc" className={styles.input} placeholder="Message" />
      </footer>
    </div>
  );
}
