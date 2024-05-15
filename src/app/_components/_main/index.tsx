'use client';

import { useCallback } from 'react';

import { getActiveThread, useActiveThread } from '~/client/store';

import { useVisualViewport } from '../../hooks';
import AppHeader from '../app-header';
import MessageListView from '../message-list-view';
import UserInput from '../user-input';

import styles from './index.module.css';

export default function Main() {
  const { scrollableRef, containerProps, targetProps } = useVisualViewport();
  const thread = useActiveThread();
  const handleUserInput = useCallback(async (value: string) => {
    const thread = getActiveThread();
    await thread.sendMessage(value);
  }, []);
  return (
    <div className={styles.container} {...containerProps}>
      <header className={styles.header}>
        <AppHeader />
      </header>
      <main ref={scrollableRef} className={styles.main}>
        <MessageListView thread={thread} />
      </main>
      <footer className={styles.footer} {...targetProps}>
        <UserInput
          className={styles.userInput}
          disabled={thread.running}
          onSubmit={handleUserInput}
        />
      </footer>
    </div>
  );
}
