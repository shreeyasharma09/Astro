import { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';

interface BreathingProps {
  onBack: () => void;
}

type Stage = 'setup' | 'running' | 'done';
type Phase = 'in' | 'hold' | 'out';

export function Breathing({ onBack }: BreathingProps) {
  const [stage, setStage] = useState<Stage>('setup');
  const [targetRounds, setTargetRounds] = useState(3);
  const [phase, setPhase] = useState<Phase>('in');
  const [phaseCount, setPhaseCount] = useState(0);
  // ready = "the first inhale has started" — gates the initial grow so
  // the circle visibly expands from small, rather than appearing already large.
  const [ready, setReady] = useState(false);

  const start = () => {
    setPhase('in');
    setPhaseCount(0);
    setReady(false); // render small initially
    setStage('running');
  };

  useEffect(() => {
    if (stage !== 'running') return;

    // Flip ready on the next frame so the CSS transition kicks in
    // going from small → large for the first inhale.
    const readyTimer = setTimeout(() => setReady(true), 50);

    const t = setInterval(() => {
      setPhaseCount((c) => {
        const next = c + 1;
        const roundsCompleted = Math.floor(next / 3);
        if (roundsCompleted >= targetRounds) {
          setStage('done');
        }
        return next;
      });
      setPhase((p) => (p === 'in' ? 'hold' : p === 'hold' ? 'out' : 'in'));
    }, 3000);

    return () => {
      clearTimeout(readyTimer);
      clearInterval(t);
    };
  }, [stage, targetRounds]);

  const currentRound = Math.min(Math.floor(phaseCount / 3) + 1, targetRounds);

  // Circle is large during inhale and hold, small during exhale.
  // Before `ready`, it stays small even if phase is 'in' — that lets the
  // first inhale visibly grow from small instead of appearing already large.
  const isLarge = ready && (phase === 'in' || phase === 'hold');

  return (
    <Container>
      <TopBar title="Grounding" onBack={onBack} />

      {stage === 'setup' && (
        <Screen className="px-6 pb-6 flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-3 mt-4">
            <Panda mood="breathing" size={130} />
            <h2 className="text-2xl font-extrabold">How many rounds?</h2>
            <p className="text-sm text-mute-light dark:text-mute-dark">Each round is about 9 seconds (in · hold · out). Pick whatever feels doable.</p>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setTargetRounds(n)}
                className={`aspect-square rounded-card font-extrabold text-xl transition ${targetRounds === n ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
              >{n}</button>
            ))}
          </div>
          <p className="text-xs text-center text-mute-light dark:text-mute-dark">
            {targetRounds} round{targetRounds > 1 ? 's' : ''} · about {targetRounds * 9}s
          </p>
          <div className="mt-auto"><Button onClick={start}>Start</Button></div>
        </Screen>
      )}

      {stage === 'running' && (
        <Screen className="px-6 flex flex-col items-center justify-center gap-8">
          <div className="relative flex items-center justify-center h-64 w-64">
            <div
              className={`absolute rounded-full bg-sky-soft dark:bg-sky/40 transition-all duration-[3000ms] ease-in-out ${isLarge ? 'w-60 h-60' : 'w-24 h-24'}`}
            />
            <p className="relative text-2xl font-extrabold text-ink-light">
              {phase === 'in' ? 'Breathe in' : phase === 'hold' ? 'Hold' : 'Breathe out'}
            </p>
          </div>
          <p className="text-sm font-semibold text-mute-light dark:text-mute-dark">
            Round {currentRound} of {targetRounds}
          </p>
          <button onClick={onBack} className="text-sm font-semibold text-mute-light dark:text-mute-dark py-2">
            Stop early
          </button>
        </Screen>
      )}

      {stage === 'done' && (
        <Screen className="px-6 pb-6 flex flex-col items-center text-center gap-5">
          <div className="mt-6"><Panda mood="cheer" size={150} /></div>
          <h2 className="text-2xl font-extrabold">Nicely done.</h2>
          <p className="text-sm text-mute-light dark:text-mute-dark">
            You finished {targetRounds} round{targetRounds > 1 ? 's' : ''}. Notice anything? Breath a little slower, shoulders a little lower.
          </p>
          <div className="w-full flex flex-col gap-3 mt-auto">
            <Button onClick={() => setStage('setup')}>Go again</Button>
            <Button variant="secondary" onClick={onBack}>I feel steadier</Button>
          </div>
        </Screen>
      )}
    </Container>
  );
}