interface DifficultyDotProps {
  level: number;
}

export function DifficultyDot({ level }: DifficultyDotProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-lilac' : 'bg-lilac-soft dark:bg-lilac/20'}`}
        />
      ))}
    </div>
  );
}