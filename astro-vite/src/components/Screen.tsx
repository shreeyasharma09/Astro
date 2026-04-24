import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export function Screen({ children, className = '' }: ScreenProps) {
  return (
    <div className={`flex-1 overflow-y-auto no-scrollbar fade-enter ${className}`}>
      {children}
    </div>
  );
}