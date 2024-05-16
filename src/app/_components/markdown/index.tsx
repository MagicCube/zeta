'use client';

import cn from 'classnames';
import ReactMarkdown from 'react-markdown';

import styles from './index.module.css';

export default function Markdown({
  className,
  children,
}: {
  className?: string;
  children: string;
}) {
  return (
    <ReactMarkdown className={cn(styles.container, className)}>
      {children}
    </ReactMarkdown>
  );
}
