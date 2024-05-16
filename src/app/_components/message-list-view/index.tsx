'use client';

import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type ThreadMessage, type Thread } from '~/shared/threads';

import TextMessage from './text-message';

import styles from './index.module.css';

export default function MessageListView({
  className,
  thread,
}: {
  className?: string;
  thread: Thread;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchor = useRef<HTMLAnchorElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const handleTouchStart = useCallback(() => {
    setAutoScroll(false);
  }, []);
  useEffect(() => {
    if (thread.running) {
      setAutoScroll(true);
    }
  }, [thread.running]);
  useEffect(() => {
    if (autoScroll && thread.running) {
      bottomAnchor.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread.running, thread.messages, autoScroll]);
  return (
    <div
      ref={containerRef}
      className={cn(styles.container, className)}
      onTouchStart={handleTouchStart}
    >
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
            <div className={styles.bubble}>{renderMessage(message)}</div>
          </li>
        ))}
      </ul>
      <a ref={bottomAnchor}></a>
    </div>
  );
}

function renderMessage(message: ThreadMessage) {
  if (message.type === 'text') {
    return <TextMessage message={message} />;
  }
  return null;
}
