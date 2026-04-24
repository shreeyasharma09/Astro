interface TulipProps {
  size?: number;
  className?: string;
  showLeaves?: boolean;
  showStem?: boolean;
  showFace?: boolean;
}

export function Tulip({
  size = 120,
  className = '',
  showLeaves = true,
  showStem = true,
  showFace = true,
}: TulipProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tulipPinkMain" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FBC9D6"/>
          <stop offset="100%" stopColor="#ED8FA3"/>
        </linearGradient>
        <linearGradient id="tulipLeafMain" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A8C9A8"/>
          <stop offset="100%" stopColor="#7AA67A"/>
        </linearGradient>
      </defs>
      {showLeaves && (
        <>
          <path d="M 50 74 Q 30 72 20 82 Q 22 90 34 88 Q 46 84 50 82 Z"
                fill="url(#tulipLeafMain)" stroke="#2D2A3E" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M 26 83 Q 38 83 46 81"
                stroke="#2D2A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
          <path d="M 50 74 Q 70 72 80 82 Q 78 90 66 88 Q 54 84 50 82 Z"
                fill="url(#tulipLeafMain)" stroke="#2D2A3E" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M 74 83 Q 62 83 54 81"
                stroke="#2D2A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
        </>
      )}
      {showStem && (
        <path d="M 50 66 L 50 92" stroke="#8B5E3C" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      )}
      <path d="M 26 50 Q 22 28 32 22 Q 38 18 42 26 Q 46 18 50 17 Q 54 18 58 26 Q 62 18 68 22 Q 78 28 74 50 Q 72 64 50 66 Q 28 64 26 50 Z"
            fill="url(#tulipPinkMain)" stroke="#2D2A3E" strokeWidth="2.2" strokeLinejoin="round"/>
      {showFace && (
        <>
          <path d="M 40 41 Q 43 37 46 41" stroke="#2D2A3E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M 54 41 Q 57 37 60 41" stroke="#2D2A3E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <ellipse cx="38" cy="48" rx="3" ry="1.8" fill="#E87A92" opacity="0.55"/>
          <ellipse cx="62" cy="48" rx="3" ry="1.8" fill="#E87A92" opacity="0.55"/>
          <path d="M 46 47 Q 50 51 54 47" stroke="#2D2A3E" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

export function TulipMark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <Tulip size={size} className={className} showLeaves={false} showStem={false} />;
}