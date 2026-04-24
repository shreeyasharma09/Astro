import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { SCENARIOS } from '../lib/scenarios';

interface OnboardingProps {
  onDone: () => void;
}

interface ReminderOption {
  id: string;
  title: string;
  body: string;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reminderPref, setReminderPref] = useState('balanced');

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const ageOptions = ['13–17', '18–24', '25–34', '35 or older', 'Prefer not to say'];
  const remOptions: ReminderOption[] = [
    { id: 'gentle', title: 'Gentle', body: 'One nudge the day of.' },
    { id: 'balanced', title: 'Balanced', body: 'A day before, an hour before, and after.' },
    { id: 'full', title: 'Full support', body: 'Extra check-ins through the day.' },
  ];

  return (
    <Container>
      <TopBar title={`Step ${step + 1} of 3`} onBack={step > 0 ? () => setStep(step - 1) : undefined} />
      <Screen className="px-6 pb-6 flex flex-col gap-5">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-extrabold mt-2">Which age range fits you?</h2>
            <p className="text-mute-light dark:text-mute-dark text-sm">This just helps us suggest the right scenarios.</p>
            <div className="flex flex-col gap-2 mt-2">
              {ageOptions.map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`text-left p-4 rounded-card border-2 font-semibold transition ${age === a ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-4"><Button disabled={!age} onClick={() => setStep(1)}>Next</Button></div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-extrabold mt-2">What feels hardest right now?</h2>
            <p className="text-mute-light dark:text-mute-dark text-sm">Pick as many as apply. We'll start your library here.</p>
            <div className="flex flex-col gap-2 mt-2">
              {SCENARIOS.map((s) => {
                const on = selected.has(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={`text-left p-4 rounded-card border-2 flex items-center gap-3 transition ${on ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{s.short}</p>
                      <p className="text-xs text-mute-light dark:text-mute-dark">{s.category}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${on ? 'bg-lilac-strong text-white' : 'bg-lilac-soft dark:bg-ink-light/10'}`}>
                      {on && <Icon name="check" size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="pt-4 sticky bottom-0 bg-bg-light dark:bg-bg-dark">
              <Button onClick={() => setStep(2)}>{selected.size === 0 ? 'Skip for now' : `Next (${selected.size} selected)`}</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-extrabold mt-2">How should reminders feel?</h2>
            <p className="text-mute-light dark:text-mute-dark text-sm">We'll ping you before and after real situations you schedule.</p>
            <div className="flex flex-col gap-2 mt-2">
              {remOptions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReminderPref(r.id)}
                  className={`text-left p-4 rounded-card border-2 transition ${reminderPref === r.id ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                >
                  <p className="font-bold">{r.title}</p>
                  <p className="text-sm text-mute-light dark:text-mute-dark">{r.body}</p>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-4"><Button onClick={onDone}>All set — take me in</Button></div>
          </>
        )}
      </Screen>
    </Container>
  );
}