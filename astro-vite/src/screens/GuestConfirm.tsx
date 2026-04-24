import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';
import { Icon } from '../components/Icon';

interface GuestConfirmProps {
  onContinue: () => void;
  onBack: () => void;
}

export function GuestConfirm({ onContinue, onBack }: GuestConfirmProps) {
  return (
    <Container>
      <TopBar title="" onBack={onBack} />
      <Screen className="flex flex-col items-center text-center px-6 gap-5">
        <Panda mood="listen" size={130} />
        <h2 className="text-2xl font-extrabold">Guest mode — you're good to go.</h2>
        <p className="text-mute-light dark:text-mute-dark text-base leading-relaxed">
          Your practice and journal stay on this device. You can make an account anytime to back things up — no pressure.
        </p>
        <div className="bg-lilac-soft dark:bg-lilac/10 p-4 rounded-card text-sm w-full text-left flex gap-3 items-start">
          <div className="mt-0.5"><Icon name="lock" size={18} /></div>
          <p>Nothing you type here is shared with anyone. Only you see your journal.</p>
        </div>
        <div className="w-full mt-auto"><Button onClick={onContinue}>Continue</Button></div>
      </Screen>
    </Container>
  );
}