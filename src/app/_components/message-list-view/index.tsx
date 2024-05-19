'use client';

import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type ThreadMessage, type Thread } from '~/shared/threads';

import Logo from '../logo';

import SearchToolMessage from './search-tool-message';
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
      // TODO: Scroll
    }
  }, [thread.running, thread.messages, autoScroll]);
  return (
    <div
      ref={containerRef}
      className={cn(styles.container, className)}
      onTouchStart={handleTouchStart}
    >
      {thread.messages.length ? (
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
              <div className={styles.bubble}>
                {renderMessage(message, thread)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className={styles.empty}>
      <Logo className={styles.logo} />
    </div>
  );
}

function renderMessage(message: ThreadMessage, thread: Thread) {
  const running =
    (message.role === 'assistant' || message.role === 'tool') &&
    thread.running &&
    message.id === thread.messages[thread.messages.length - 1]?.id;
  if (message.type === 'text') {
    return <TextMessage message={message} running={running} />;
  } else if (message.type === 'tool') {
    if (message.toolName === 'search') {
      return <SearchToolMessage message={message} />;
    }
  }
  return null;
}
