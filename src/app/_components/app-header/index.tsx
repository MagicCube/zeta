'use client';

import cn from 'classnames';

import styles from './index.module.css';

export default function AppHeader({ className }: { className?: string }) {
  let env = '';
  if (window.location.hostname === 'localhost') {
    env = 'Local';
  } else if (window.location.hostname.startsWith('10.')) {
    env = 'Office';
  }
  return (
    <div className={cn(styles.container, className)}>
      <main className={styles.main}>
        <div className={styles.title}>
          <h1>Zeta</h1>
          {env && <span className={styles.env}>{env}</span>}
        </div>
      </main>
    </div>
  );
}
