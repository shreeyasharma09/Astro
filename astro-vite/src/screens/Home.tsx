import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Panda } from '../components/Panda';
import { TulipMark } from '../components/Tulip';
import { DifficultyDot } from '../components/DifficultyDot';
import { BottomNav, type NavId } from '../components/BottomNav';
import { CrisisChip } from '../components/CrisisChip';
import { SCENARIOS } from '../lib/scenarios';

interface HomeProps {
  go: (route: string, params?: Record<string, any>) => void;
  nav: NavId;
  setNav: (id: NavId) => void;
  onCrisis: () => void;
}

export function Home({ go, nav, setNav, onCrisis }: HomeProps) {
  const suggested = SCENARIOS[0];
  const [mood, setMood] = useState<number | null>(null);

  return (
    <Container>
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <TulipMark size={28} />
          <span className="font-extrabold text-lg tracking-tight">Astro</span>
        </div>
        <button onClick={() => go('settings')} className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center shadow-soft">
          <Icon name="settings" size={18} />
        </button>
      </div>
      <div className="px-5 pb-2">
        <p className="text-xs text-mute-light dark:text-mute-dark">Today</p>
        <h1 className="text-2xl font-extrabold">Hi, friend 🌿</h1>
      </div>

      <Screen className="px-5 pb-4 flex flex-col gap-4">
        <Card className="bg-gradient-to-br from-lilac-soft to-sky-soft dark:from-lilac/10 dark:to-sky/10 flex items-center gap-3">
          <Panda mood="calm" size={72} />
          <div className="flex-1">
            <p className="font-bold">No pressure today.</p>
            <p className="text-sm text-mute-light dark:text-mute-dark">Just looking around is a win.</p>
          </div>
        </Card>

        <div>
          <p className="font-bold mb-2">How's right now feeling?</p>
          <div className="grid grid-cols-5 gap-2">
            {['😣', '😟', '😐', '🙂', '😌'].map((e, i) => (
              <button
                key={i}
                onClick={() => setMood(i)}
                className={`aspect-square rounded-card text-2xl flex items-center justify-center transition ${mood === i ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
              >{e}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-bold mb-2">Suggested for today</p>
          <Card onClick={() => go('scenario', { id: suggested.id })} className="flex items-center gap-3">
            <div className="text-3xl">{suggested.emoji}</div>
            <div className="flex-1">
              <p className="font-bold">{suggested.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <DifficultyDot level={suggested.difficulty} />
                <p className="text-xs text-mute-light dark:text-mute-dark">{suggested.category}</p>
              </div>
            </div>
            <Icon name="chevronRight" />
          </Card>
        </div>

        <div>
          <p className="font-bold mb-2">Coming up</p>
          <Card onClick={() => setNav('reminders')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-soft dark:bg-sage/20 flex items-center justify-center text-sage-strong dark:text-sage-dark">
              <Icon name="clock" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-bold">Dinner with friends</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">Friday, 7:00 PM</p>
            </div>
            <Icon name="chevronRight" />
          </Card>
        </div>

        <div>
          <p className="font-bold mb-2">Quick help</p>
          <div className="grid grid-cols-2 gap-3">
            <Card onClick={() => go('breathing')} className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-sky-soft dark:bg-sky/20 flex items-center justify-center text-sky-strong dark:text-sky-dark"><Icon name="wind" size={18} /></div>
              <p className="font-bold">Grounding</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">60-second exercise</p>
            </Card>
            <Card onClick={() => setNav('journal')} className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-lilac-soft dark:bg-lilac/20 flex items-center justify-center text-lilac-strong dark:text-lilac-dark"><Icon name="book" size={18} /></div>
              <p className="font-bold">Wins journal</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">Note one thing.</p>
            </Card>
          </div>
        </div>
      </Screen>

      <CrisisChip onClick={onCrisis} />
      <BottomNav current={nav} onChange={setNav} />
    </Container>
  );
}