'use client';

import cn from 'classnames';

import { type SearchSubject } from '~/server/tools';

import styles from './index.module.css';

export default function MiniSubjectView({
  className,
  subject,
}: {
  className?: string;
  subject: SearchSubject;
}) {
  return (
    <a
      className={cn(styles.container, className)}
      href={`https://m.douban.com/movie/subject/${subject.id}/`}
      target="_blank"
    >
      <div className={styles.left}>
        <img
          className={styles.image}
          src={subject.images.medium}
          alt=""
          referrerPolicy="no-referrer"
        />
      </div>
      <main className={styles.main}>
        <div className={styles.title}>
          <span>{subject.title}</span>
          {subject.year && (
            <span className={styles.year}>({subject.year})</span>
          )}
        </div>
        <div className={styles.rating}>
          <Rating value={subject.rating.stars} />
          <span className={styles.ratingAverage}>{subject.rating.average}</span>
        </div>
        <div className={styles.genres}>
          <span>{subject.genres.join(' / ')}</span>
        </div>
        <div className={styles.directors}>
          <span>{subject.directors?.map((cast) => cast.name).join(' / ')}</span>
        </div>
        <div className={styles.casts}>
          <span>{subject.casts?.map((cast) => cast.name).join(' / ')}</span>
        </div>
      </main>
    </a>
  );
}

function Rating({ value }: { value: string }) {
  let r = parseInt(value) / 10;
  if (!r) {
    r = 0;
  }
  return (
    <div className={styles.rating}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={cn(
            styles.star,
            r >= i + 1 && styles.full,
            r - i === 0.5 && styles.half
          )}
        />
      ))}
    </div>
  );
}
