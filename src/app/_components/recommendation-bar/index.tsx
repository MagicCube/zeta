'use client';

import cn from 'classnames';

import styles from './index.module.css';

const recommendations = [
  '什么是 AGI',
  '如何有技术判断力？',
  '想知道《辐射》这部剧的背景',
  '《破产姐妹》里面的两个女主角是什么关系？',
  '将来会不会有《权力的游戏》的续集？',
  '《Friends》中的六个主角是怎么认识的？',
  '南京最好的季节是？',
  '京都最好的季节是？',
  '京都哪天樱花满开？',
  '大钟寺附近有什么公司？',
  '介绍一下大钟寺的历史',
];

export default function RecommendationBar({
  className,
  onClick,
}: {
  className?: string;
  onClick?: (question: string) => void;
}) {
  const questions = [
    '《幕府将军》好看吗？',
    ...recommendations.sort(() => Math.random() - 0.5).slice(0, 4),
  ];
  return (
    <div className={cn(styles.container, className)}>
      <ul className={styles.list}>
        {questions.map((question) => (
          <li
            key={question}
            className={styles.item}
            onClick={() => onClick?.(question)}
          >
            {question}
          </li>
        ))}
      </ul>
    </div>
  );
}
