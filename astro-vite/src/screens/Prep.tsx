import { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SCENARIOS, getScript } from '../lib/scenarios';

interface PrepProps {
  id: string;
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

type Phase = 'in' | 'hold' | 'out';

export function Prep({ id, onBack, go }: PrepProps) {
  const s = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];
  const [step, setStep] = useState(0);
  const [breath, setBreath] = useState<Phase>('in');
  const [ready, setReady] = useState(false);
  const [preRating, setPreRating] = useState<number | null>(null);

  useEffect(() => {
    if (step !== 0) return;
    setReady(false);
    setBreath('in');
    const readyTimer = setTimeout(() => setReady(true), 50);
    const t = setInterval(
      () => setBreath((b) => (b === 'in' ? 'hold' : b === 'hold' ? 'out' : 'in')),
      3000
    );
    return () => {
      clearTimeout(readyTimer);
      clearInterval(t);
    };
  }, [step]);

  const nextStep = () => (step < 2 ? setStep(step + 1) : go('mode-picker', { id: s.id }));
  const isLarge = ready && (breath === 'in' || breath === 'hold');

  return (
    <Container>
      <TopBar
        title={`Prep · Step ${step + 1}/3`}
        onBack={step > 0 ? () => setStep(step - 1) : onBack}
      />
      <Screen className="px-6 pb-6 flex flex-col gap-5">
        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-4 flex-1 justify-center">
            <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">Ground yourself</p>
            <h2 className="text-2xl font-extrabold">Let's breathe for a moment.</h2>
            <div className="relative flex items-center justify-center h-48 w-48">
              <div className={`absolute rounded-full bg-lilac-soft dark:bg-lilac/40 transition-all duration-[3000ms] ease-in-out ${isLarge ? 'w-44 h-44' : 'w-24 h-24'}`} />
              <p className="relative font-bold text-lg text-ink-light">
                {breath === 'in' ? 'Breathe in' : breath === 'hold' ? 'Hold' : 'Breathe out'}
              </p>
            </div>
            <p className="text-sm text-mute-light dark:text-mute-dark">Three rounds is plenty. No rush.</p>
            <div className="w-full mt-4"><Button onClick={nextStep}>I'm ready</Button></div>
          </div>
        )}
        {step === 1 && (
          <>
            <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">A small script</p>
            <h2 className="text-2xl font-extrabold">Here's a starting line.</h2>
            <Card className="bg-lilac-soft dark:bg-lilac/10">
              <p className="font-bold text-lg">"{getScript(s.id)}"</p>
            </Card>
            <p className="text-sm text-mute-light dark:text-mute-dark">You don't have to say it word-for-word. It's a starting point.</p>
            <div className="mt-auto"><Button onClick={nextStep}>Next</Button></div>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">Check in</p>
            <h2 className="text-2xl font-extrabold">How anxious does this feel right now?</h2>
            <p className="text-sm text-mute-light dark:text-mute-dark">1 is calm, 10 is overwhelming.</p>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setPreRating(n)}
                  className={`aspect-square rounded-card font-bold text-lg transition ${preRating === n ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
                >{n}</button>
              ))}
            </div>
            <div className="mt-auto"><Button disabled={preRating === null} onClick={nextStep}>Start roleplay</Button></div>
          </>
        )}
      </Screen>
    </Container>
  );
}