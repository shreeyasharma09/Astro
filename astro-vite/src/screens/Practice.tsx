import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { DifficultyDot } from '../components/DifficultyDot';
import { BottomNav, type NavId } from '../components/BottomNav';
import { CrisisChip } from '../components/CrisisChip';
import { SCENARIOS } from '../lib/scenarios';

interface PracticeProps {
  go: (route: string, params?: Record<string, any>) => void;
  nav: NavId;
  setNav: (id: NavId) => void;
  onCrisis: () => void;
}

export function Practice({ go, nav, setNav, onCrisis }: PracticeProps) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...Array.from(new Set(SCENARIOS.map((s) => s.category)))];
  const list = filter === 'All' ? SCENARIOS : SCENARIOS.filter((s) => s.category === filter);

  return (
    <Container>
      <TopBar title="Practice" right={<Icon name="sparkle" size={18} />} />
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${filter === c ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark text-mute-light dark:text-mute-dark'}`}
          >{c}</button>
        ))}
      </div>
      <Screen className="px-5 pb-4 flex flex-col gap-3">
        {list.map((s) => (
          <Card key={s.id} onClick={() => go('scenario', { id: s.id })} className="flex items-center gap-3">
            <div className="text-3xl">{s.emoji}</div>
            <div className="flex-1">
              <p className="font-bold">{s.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <DifficultyDot level={s.difficulty} />
                <p className="text-xs text-mute-light dark:text-mute-dark">{s.category}</p>
              </div>
            </div>
            <Icon name="chevronRight" />
          </Card>
        ))}
      </Screen>
      <CrisisChip onClick={onCrisis} />
      <BottomNav current={nav} onChange={setNav} />
    </Container>
  );
}