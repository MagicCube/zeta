'use client';

import IconEdit from '@mui/icons-material/Edit';
import Button from '@mui/joy/Button';
import { useCallback } from 'react';

import {
  activateThread,
  createThread,
  getActiveThread,
  useActiveThread,
} from '~/client/store';

import { useVisualViewport } from '../../hooks';
import AppHeader from '../app-header';
import MessageListView from '../message-list-view';
import UserInput from '../user-input';

import styles from './index.module.css';

export default function Main() {
  const { scrollableRef, containerProps } = useVisualViewport();
  const thread = useActiveThread();
  const handleUserInput = useCallback(async (value: string) => {
    const thread = getActiveThread();
    await thread.sendMessage(value);
  }, []);
  const handleNewThread = useCallback(() => {
    const newThread = createThread();
    activateThread(newThread);
  }, []);
  return (
    <div className={styles.container} {...containerProps}>
      <header className={styles.header}>
        <AppHeader
          right={
            <Button variant="plain" size="sm" onClick={handleNewThread}>
              <IconEdit />
            </Button>
          }
        />
      </header>
      <main ref={scrollableRef} className={styles.main}>
        <MessageListView className={styles.messageListView} thread={thread} />
      </main>
      <footer className={styles.footer}>
        <UserInput
          className={styles.userInput}
          disabled={thread.running}
          onSubmit={handleUserInput}
        />
      </footer>
    </div>
  );
}
