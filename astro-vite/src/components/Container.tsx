import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`device-frame bg-bg-light dark:bg-bg-dark text-ink-light dark:text-ink-dark flex flex-col ${className}`}>
      {children}
    </div>
  );
}