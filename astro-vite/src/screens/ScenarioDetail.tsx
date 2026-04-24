import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DifficultyDot } from '../components/DifficultyDot';
import { SCENARIOS } from '../lib/scenarios';

interface ScenarioDetailProps {
  id: string;
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

export function ScenarioDetail({ id, onBack, go }: ScenarioDetailProps) {
  const s = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];

  return (
    <Container>
      <TopBar title="" onBack={onBack} />
      <Screen className="px-6 pb-6 flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="text-5xl">{s.emoji}</div>
          <h2 className="text-2xl font-extrabold">{s.title}</h2>
          <div className="flex items-center gap-2">
            <DifficultyDot level={s.difficulty} />
            <span className="text-xs text-mute-light dark:text-mute-dark">{s.category}</span>
          </div>
        </div>
        <Card>
          <p className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase tracking-wide mb-1">You'll practice</p>
          <p className="text-sm leading-relaxed">{s.summary}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase tracking-wide mb-1">Who you'll meet</p>
          <p className="text-sm leading-relaxed">{s.character}</p>
        </Card>
        {s.id === 'coffee' && (
          <Card className="bg-sage-soft dark:bg-sage/10">
            <p className="text-sm">💡 This one's our walkthrough demo — the full roleplay is clickable end-to-end.</p>
          </Card>
        )}
        <div className="mt-auto">
          <Button onClick={() => go('prep', { id: s.id })}>Start prep</Button>
        </div>
      </Screen>
    </Container>
  );
}