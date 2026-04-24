import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  full?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  full = true,
}: ButtonProps) {
  const base = 'rounded-btn font-bold text-base py-4 px-5 transition active:scale-[0.98] disabled:opacity-50';
  const styles: Record<ButtonVariant, string> = {
    primary: 'bg-lilac-strong text-white',
    secondary: 'bg-lilac-soft text-lilac-strong dark:bg-lilac/20 dark:text-lilac-dark',
    ghost: 'bg-transparent text-ink-light dark:text-ink-dark',
    danger: 'bg-crisis text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}