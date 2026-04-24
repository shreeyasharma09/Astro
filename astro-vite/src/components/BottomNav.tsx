import { Icon, type IconName } from './Icon';

export type NavId = 'home' | 'practice' | 'reminders' | 'journal' | 'me';

interface BottomNavProps {
  current: NavId;
  onChange: (id: NavId) => void;
}

interface NavItem {
  id: NavId;
  icon: IconName;
  label: string;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  const items: NavItem[] = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'practice', icon: 'sparkle', label: 'Practice' },
    { id: 'reminders', icon: 'bell', label: 'Reminders' },
    { id: 'journal', icon: 'book', label: 'Journal' },
    { id: 'me', icon: 'user', label: 'Me' },
  ];
  return (
    <div className="bg-surface-light dark:bg-surface-dark border-t border-lilac-soft dark:border-ink-light/10 px-2 pt-2 pb-5 flex justify-around">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${current === it.id ? 'text-lilac-strong dark:text-lilac-dark' : 'text-mute-light dark:text-mute-dark'}`}
        >
          <Icon name={it.icon} size={22} />
          <span className="text-[10px] font-semibold">{it.label}</span>
        </button>
      ))}
    </div>
  );
}