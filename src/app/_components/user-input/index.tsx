'use client';

import Textarea from '@mui/joy/Textarea';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

export default function UserInput({
  className,
  disabled,
  onSubmit,
}: {
  className?: string;
  disabled?: boolean;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );
  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (disabled) {
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.(value);
        setValue('');
      }
    },
    [value, disabled, onSubmit]
  );
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      inputRef.current?.blur();
    }
  }, []);
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
  return (
    <div className={cn(styles.container, className)}>
      <Textarea
        className={styles.input}
        slotProps={{ textarea: { ref: inputRef } }}
        placeholder="Message"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />
    </div>
  );
}
