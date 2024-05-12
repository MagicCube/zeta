import { Button } from '@mui/joy';

import styles from './index.module.css';

export default function NotSignedIn() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>Welcome to Zeta</h3>
      </header>
      <main className={styles.main}>
        <p>
          Zeta is a personal assistant capable of answering any question using
          LLM and built-in tools.
        </p>
        <p>We are now in private Beta. Sign in to get started.</p>
      </main>
      <footer className={styles.footer}>
        <Button component="a" fullWidth size="lg" href="/api/auth/signin">
          Sign in
        </Button>
      </footer>
    </div>
  );
}
