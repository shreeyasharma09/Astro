import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { Tulip } from '../components/Tulip';

interface SplashProps {
  onNext: () => void;
}

export function Splash({ onNext }: SplashProps) {
  return (
    <Screen className="flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="pulse-slow"><Tulip size={180} /></div>
      <div>
        <h1 className="text-3xl font-extrabold text-ink-light dark:text-ink-dark">Astro</h1>
        <p className="text-mute-light dark:text-mute-dark mt-1 text-sm">A kinder way to practice.</p>
      </div>
      <div className="w-full mt-6"><Button onClick={onNext}>Get started</Button></div>
    </Screen>
  );
}