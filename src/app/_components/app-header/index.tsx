'use client';

import cn from 'classnames';

import styles from './index.module.css';

export default function AppHeader({ className }: { className?: string }) {
  return (
    <div className={cn(styles.container, className)}>
      <main className={styles.main}>
        <div className={styles.title}>Zeta</div>
      </main>
    </div>
  );
}
