import { Icon } from './Icon';

interface CrisisChipProps {
  onClick: () => void;
}

export function CrisisChip({ onClick }: CrisisChipProps) {
  return (
    <button
      onClick={onClick}
      className="fixed sm:absolute z-30 bg-coral/90 text-ink-light rounded-full pl-3 pr-4 py-2 shadow-soft flex items-center gap-2 text-xs font-bold"
      style={{ bottom: 96, right: 16 }}
    >
      <Icon name="heart" size={16} /> I'm not okay
    </button>
  );
}