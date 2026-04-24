export type PandaMood = 'calm' | 'cheer' | 'listen' | 'concern' | 'sleep' | 'breathing';

interface PandaProps {
  mood?: PandaMood;
  size?: number;
  className?: string;
}

export function Panda({ mood = 'calm', size = 120, className = '' }: PandaProps) {
  const cheeks: Record<PandaMood, { size: number; opacity: number; color: string }> = {
    calm:      { size: 7,   opacity: 0.75, color: '#F2B5B5' },
    cheer:     { size: 7.5, opacity: 0.85, color: '#EFB0BD' },
    listen:    { size: 7,   opacity: 0.75, color: '#F2B5B5' },
    concern:   { size: 6,   opacity: 0.55, color: '#F2B5B5' },
    sleep:     { size: 7,   opacity: 0.70, color: '#F2B5B5' },
    breathing: { size: 7,   opacity: 0.70, color: '#F2B5B5' },
  };
  const cheek = cheeks[mood];

  const renderMouth = () => {
    switch (mood) {
      case 'cheer':
        return <path d="M43 66 Q50 72 57 66" stroke="#1A1826" strokeWidth="2" fill="none" strokeLinecap="round"/>;
      case 'concern':
        return <path d="M46 69 Q50 68 54 69" stroke="#1A1826" strokeWidth="1.8" fill="none" strokeLinecap="round"/>;
      case 'breathing':
        return <ellipse cx="50" cy="69" rx="2.2" ry="1.8" fill="#1A1826" opacity="0.75"/>;
      default:
        return <path d="M45 67 Q50 70 55 67" stroke="#1A1826" strokeWidth="1.8" fill="none" strokeLinecap="round"/>;
    }
  };

  const renderBrows = () => {
    if (mood !== 'concern') return null;
    return (
      <>
        <path d="M33 44 Q37 43 41 45" stroke="#1A1826" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M59 45 Q63 43 67 44" stroke="#1A1826" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </>
    );
  };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="haloMomo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#E8E0FB" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#E8E0FB" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="bodyMomo" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F5F0FC"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#haloMomo)"/>
      <circle cx="26" cy="28" r="11" fill="#1A1826"/>
      <circle cx="74" cy="28" r="11" fill="#1A1826"/>
      <circle cx="26" cy="28" r="5.5" fill="#F2B5B5" opacity="0.55"/>
      <circle cx="74" cy="28" r="5.5" fill="#F2B5B5" opacity="0.55"/>
      <ellipse cx="50" cy="88" rx="22" ry="10" fill="url(#bodyMomo)"/>
      <ellipse cx="33" cy="90" rx="5" ry="3.5" fill="#1A1826"/>
      <ellipse cx="67" cy="90" rx="5" ry="3.5" fill="#1A1826"/>
      <circle cx="50" cy="52" r="32" fill="url(#bodyMomo)"/>
      <ellipse cx="28" cy="58" rx={cheek.size} ry={cheek.size * 0.65} fill={cheek.color} opacity={cheek.opacity}/>
      <ellipse cx="72" cy="58" rx={cheek.size} ry={cheek.size * 0.65} fill={cheek.color} opacity={cheek.opacity}/>
      <path d="M33 52 Q38 46 43 52" stroke="#1A1826" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <path d="M57 52 Q62 46 67 52" stroke="#1A1826" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      {renderBrows()}
      <ellipse cx="50" cy="62" rx="2" ry="1.4" fill="#1A1826"/>
      {renderMouth()}
      <path d="M80 18 Q86 14 90 20 Q85 24 80 22 Z" fill="#A8C9A8"/>
    </svg>
  );
}