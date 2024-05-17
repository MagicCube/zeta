'use client';

import cn from 'classnames';

import { type SearchResponse } from '~/server/tools';
import { type ToolMessage } from '~/shared/threads';

import MiniSubjectView from '../../mini-subject-view';

import styles from './index.module.css';

export default function SearchToolMessage({
  className,
  message: originalMessage,
}: {
  className?: string;
  message: ToolMessage;
}) {
  const message = originalMessage as ToolMessage<{ response: SearchResponse }>;
  let hint = '';
  let response: SearchResponse | undefined;
  if (message.state === 'running') {
    hint = `正在为您搜索 "${message.params[0]}"...`;
  } else if (message.state === 'done' && message.data) {
    response = message.data.response;
    hint = `为您搜索到了以下线索`;
  }
  console.info(response?.subject);
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.hint}>{hint}</div>
      {response?.subject && <MiniSubjectView subject={response.subject} />}
      <div className={styles.resultListContainer}>
        <ul className={styles.resultList}>
          {response?.organicResults.map((result, i) => (
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
    </div>
  );
}
