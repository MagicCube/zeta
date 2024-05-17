'use client';

import Skeleton from '@mui/joy/Skeleton';
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
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.hint}>{hint}</div>
      {response?.subject && <MiniSubjectView subject={response.subject} />}
      <div className={styles.resultListContainer}>
        {message.state === 'running' ? (
          <ResultListSkeleton />
        ) : (
          <ul className={styles.resultList}>
            {response?.organicResults.map((result, i) => (
              <li key={result.link} className={styles.result}>
                <a className={styles.link} href={result.link}>
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
        )}
      </div>
    </div>
  );
}

export function ResultListSkeleton() {
  return (
    <ul className={styles.resultList} style={{ overflow: 'hidden' }}>
      {[1, 2, 3].map((i) => (
        <li key={i} className={styles.result}>
          <a className={styles.link}>
            <div className={styles.title}>
              <div className={styles.lines}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="1rem"
                  style={{ margin: '0.25rem 0' }}
                />
                <Skeleton
                  variant="rectangular"
                  width={`${40 + 50 * Math.random()}%`}
                  height="1rem"
                  style={{ margin: '0.25rem 0 0.5rem 0' }}
                />
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.lines}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="0.8rem"
                  style={{ margin: '0.25rem 0' }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="0.8rem"
                  style={{ margin: '0.25rem 0' }}
                />
                <Skeleton
                  variant="rectangular"
                  width={`${40 + 50 * Math.random()}%`}
                  height="0.8rem"
                  style={{ margin: '0.25rem 0' }}
                />
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.source}>
                <Skeleton
                  variant="rectangular"
                  width="50%"
                  height="0.5rem"
                  style={{ margin: '0.5rem 0' }}
                />
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
