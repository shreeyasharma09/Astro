import { Button } from '../components/Button';
import { Tulip } from '../components/Tulip';
import { PageLayout } from '../components/PageLayout';

interface SplashProps {
  onNext: () => void;
}

export function Splash({ onNext }: SplashProps) {
  return (
    <PageLayout
      header={
        <>
          <div className="pulse-slow"><Tulip size={180} /></div>
          <div>
            <h1 className="text-3xl font-extrabold text-ink-light dark:text-ink-dark">Astro</h1>
            <p className="text-mute-light dark:text-mute-dark mt-1 text-sm">A kinder way to practice.</p>
          </div>
        </>
      }
      actions={<Button onClick={onNext}>Get started</Button>}
    />
  );
}