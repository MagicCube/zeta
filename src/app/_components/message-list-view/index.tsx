'use client';

import cn from 'classnames';
import { useRef } from 'react';

import { type Thread } from '~/shared/threads';

import styles from './index.module.css';

export default function MessageListView({
  className,
  thread,
}: {
  className?: string;
  thread: Thread;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={containerRef} className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {thread.messages.map((message) => (
          <li
            key={message.id}
            id={`message_${message.id}`}
            className={cn(
              message.role === 'user' && styles.user,
              styles.message
            )}
          >
            <div className={styles.bubble}>{message.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
