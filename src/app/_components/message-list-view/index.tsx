'use client';

import cn from 'classnames';

import { type Thread } from '~/shared/threads';

import styles from './index.module.css';

export default function MessageListView({
  className,
  thread,
}: {
  className?: string;
  thread: Thread;
}) {
  return (
    <div className={cn(styles.container, className)}>
      <ul>
        {thread.messages.map((message, index) => (
          <li key={index} className={styles.message}>
            <div className={styles.role}>{message.role}</div>
            <div className={styles.content}>{message.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
