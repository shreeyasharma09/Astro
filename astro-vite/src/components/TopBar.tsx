import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function TopBar({ title, onBack, right }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <button
        onClick={onBack}
        className={`w-9 h-9 rounded-full flex items-center justify-center ${onBack ? 'bg-surface-light dark:bg-surface-dark shadow-soft' : 'opacity-0 pointer-events-none'}`}
        aria-label="Back"
      >
        <Icon name="chevronLeft" />
      </button>
      <h1 className="text-base font-bold">{title}</h1>
      <div className="w-9 h-9 flex items-center justify-center">{right}</div>
    </div>
  );
}