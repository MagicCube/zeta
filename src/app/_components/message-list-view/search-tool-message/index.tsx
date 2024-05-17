'use client';

import cn from 'classnames';

import { type SearchResult } from '~/server/tools';
import { type ToolMessage } from '~/shared/threads';

import styles from './index.module.css';

export default function SearchToolMessage({
  className,
  message: originalMessage,
}: {
  className?: string;
  message: ToolMessage;
}) {
  const message = originalMessage as ToolMessage<{ results: SearchResult[] }>;
  let hint = '';
  let results: SearchResult[] = [];
  if (message.state === 'running') {
    hint = `正在为您搜索 "${message.params[0]}"...`;
  } else if (message.state === 'done' && message.data) {
    results = message.data.results;
    hint = `为您搜索到了 ${results.length} 条线索`;
  }
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.hint}>{hint}</div>
      <ul className={styles.resultList}>
        {results.map((result, i) => (
          <li key={result.link} className={styles.result}>
            <a className={styles.link} target="_blank" href={result.link}>
              <div className={styles.title}>
                {i + 1}. {result.title}
              </div>
              <div className={styles.content}>{result.description}</div>
              <div className={styles.footer}>
                <div className={styles.source}>
                  <img
                    className={styles.favicon}
                    src={result.faviconURL}
                    alt={result.source}
                  />
                  <span>{result.source}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
