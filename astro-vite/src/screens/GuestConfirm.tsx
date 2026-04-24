import { Container } from '../components/Container';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';
import { Icon } from '../components/Icon';
import { PageLayout } from '../components/PageLayout';

interface GuestConfirmProps {
  onContinue: () => void;
  onBack: () => void;
}

export function GuestConfirm({ onContinue, onBack }: GuestConfirmProps) {
  return (
    <Container>
      <TopBar title="" onBack={onBack} />
      <PageLayout
        header={
          <>
            <Panda mood="listen" size={130} />
            <h2 className="text-2xl font-extrabold">Guest mode — you're good to go.</h2>
            <p className="text-mute-light dark:text-mute-dark text-base leading-relaxed">
              Your practice and journal stay on this device. You can make an account anytime to back things up — no pressure.
            </p>
          </>
        }
        actions={<Button onClick={onContinue}>Continue</Button>}
      >
        <div className="bg-lilac-soft dark:bg-lilac/10 p-4 rounded-card text-sm flex gap-3 items-start">
          <div className="mt-0.5"><Icon name="lock" size={18} /></div>
          <p>Nothing you type here is shared with anyone. Only you see your journal.</p>
        </div>
      </PageLayout>
    </Container>
  );
}