import { useEffect } from 'react';

export interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void;
}

// Binds keyboard shortcuts scoped to the window. Pass a map like:
//   { 'Escape': () => close(), '1': () => pickChoice(0) }
// Modifier keys: use 'cmd+k' or 'shift+enter' style.
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Skip single-key shortcuts while typing in an input.
      const hasMod = e.metaKey || e.ctrlKey || e.altKey;
      if (isEditable && !hasMod && e.key !== 'Escape') return;

      const parts: string[] = [];
      if (e.metaKey || e.ctrlKey) parts.push('cmd');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');
      parts.push(e.key.toLowerCase());
      const key = parts.join('+');

      const handler = shortcuts[key] || shortcuts[e.key];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts, enabled]);
}