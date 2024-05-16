'use client';

import cn from 'classnames';
import { useEffect } from 'react';

import styles from './index.module.css';

let env = '';
if (window.location.hostname === 'z.henry1943.top') {
  env = '';
} else if (window.location.hostname === 'localhost') {
  env = 'Local';
} else if (window.location.hostname.startsWith('10.')) {
  env = 'Office';
} else {
  env = 'Dev';
}

export default function AppHeader({
  className,
  left,
  right,
}: {
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  useEffect(() => {
    document.title = `Zeta${env ? ` - ${env}` : ''}`;
  }, []);
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.left}>{left}</div>
      <main className={styles.main}>
        <div className={styles.title}>
          <h1>Zeta</h1>
          {env && <span className={styles.env}>{env}</span>}
        </div>
      </main>
      <div className={styles.right}>{right}</div>
    </div>
  );
}
