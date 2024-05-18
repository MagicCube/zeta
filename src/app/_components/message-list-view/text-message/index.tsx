'use client';

import cn from 'classnames';

import { type ThreadMessage } from '~/shared/threads';

import Markdown from '../../markdown';

import styles from './index.module.css';

export default function TextMessage({
  className,
  message,
}: {
  className?: string;
  message: ThreadMessage;
  running?: boolean;
}) {
  const content = processContent(message.content);
  return (
    <div className={cn(styles.container, className)}>
      {content && <Markdown>{content}</Markdown>}
    </div>
  );
}

function processContent(content: string | null | undefined): string | null {
  if (!content) {
    return null;
  }
  // Replace `[##${number}]` with `[{number}](##${number})`
  content = content.replace(/\[##(\d+)]/g, '[[$1]](##$1)');
  return content;
}
