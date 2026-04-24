import type { ReactNode } from 'react';

interface PageLayoutProps {
  /** Top zone — hero, title, emoji, etc. Optional. */
  header?: ReactNode;
  /** Bottom zone — primary action buttons. Pinned to the bottom. Optional. */
  actions?: ReactNode;
  /** Main content — flexible middle area. Scrolls if too tall. */
  children?: ReactNode;
  /** Override inner classes if you need to. */
  className?: string;
  /** Center the header content vertically in its zone. Default true. */
  centerHeader?: boolean;
}

// One layout for every pre-login / simple screen. Enforces consistent padding,
// vertical rhythm, and bottom-pinned actions so screens feel the same
// regardless of what's inside.
export function PageLayout({
  header,
  actions,
  children,
  className = '',
  centerHeader = true,
}: PageLayoutProps) {
  return (
    <div className={`flex-1 flex flex-col px-6 pt-6 pb-8 gap-6 fade-enter no-scrollbar overflow-y-auto ${className}`}>
      {header && (
        <div className={`flex flex-col items-center text-center gap-4 ${centerHeader ? 'mt-8' : ''}`}>
          {header}
        </div>
      )}
      {children && (
        <div className="flex-1 flex flex-col gap-4">
          {children}
        </div>
      )}
      {actions && (
        <div className="mt-auto flex flex-col gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}