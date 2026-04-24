import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';

interface CrisisProps {
  onBack: () => void;
}

export function Crisis({ onBack }: CrisisProps) {
  return (
    <Container>
      <div className="bg-crisis text-white px-6 pt-6 pb-8 rounded-b-[32px]">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4">
          <Icon name="chevronLeft" />
        </button>
        <h2 className="text-2xl font-extrabold mb-2">You're not alone right now.</h2>
        <p className="text-sm opacity-90">Reach a human. These lines are free and open 24/7.</p>
      </div>
      <Screen className="px-5 pt-4 pb-6 flex flex-col gap-3">
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone" /></div>
          <div className="flex-1">
            <p className="font-bold">988 Suicide & Crisis Lifeline</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">Call or text 988 · US & Canada</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone" /></div>
          <div className="flex-1">
            <p className="font-bold">Crisis Text Line</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">Text HOME to 741741</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone" /></div>
          <div className="flex-1">
            <p className="font-bold">Emergency services</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">911 · if you or someone else is in immediate danger</p>
          </div>
        </Card>
        <Card className="bg-sage-soft dark:bg-sage/20">
          <p className="font-bold mb-1">Or just breathe with me.</p>
          <p className="text-sm">A 60-second grounding exercise is always available on the home tab.</p>
        </Card>
      </Screen>
    </Container>
  );
}