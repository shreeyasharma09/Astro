import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';

interface PostDeleteProps {
  mode: 'guest' | 'account';
  authDeleted?: boolean;
  go: (route: string, params?: Record<string, any>) => void;
}

export function PostDelete({ mode, authDeleted, go }: PostDeleteProps) {
  return (
    <Container>
      <Screen className="px-6 pt-16 pb-6 flex flex-col items-center gap-5 text-center">
        <Panda mood="listen" size={120} />
        <h2 className="text-2xl font-extrabold">We're sorry to see you go.</h2>
        <p className="text-sm text-mute-light dark:text-mute-dark leading-relaxed px-2">
          {mode === 'guest'
            ? 'Your on-device data is cleared. If Astro ever feels useful again, everything starts fresh.'
            : 'Your account data is deleted. You can keep using Astro as a guest anytime — nothing you do here needs an account.'}
        </p>

        {mode === 'account' && !authDeleted && (
          <Card className="bg-coral/10 text-left">
            <p className="text-xs font-bold mb-1">One detail</p>
            <p className="text-[11px] text-mute-light dark:text-mute-dark leading-relaxed">
              Your login was kept for now — the final step needs a service update. If you want it fully removed, email us and we'll handle it manually.
            </p>
          </Card>
        )}

        <Card className="bg-sage-soft dark:bg-sage/10 w-full text-left">
          <div className="flex items-start gap-3">
            <div className="text-2xl shrink-0">🌱</div>
            <div>
              <p className="font-bold text-sm">You can always come back — even as a guest.</p>
              <p className="text-xs text-mute-light dark:text-mute-dark mt-1 leading-relaxed">Sessions stay on your device. No account needed. Pick up whenever it feels right.</p>
            </div>
          </div>
        </Card>

        <div className="mt-auto w-full flex flex-col gap-2">
          <Button onClick={() => go('tabs')}>Continue as guest</Button>
          <Button variant="ghost" onClick={() => go('welcome')}>Back to welcome</Button>
        </div>

        <p className="text-[11px] text-mute-light dark:text-mute-dark leading-relaxed px-4 mt-2">
          If you're struggling and that's why you're leaving, you're not alone — call or text <b>988</b> (US & Canada).
        </p>
      </Screen>
    </Container>
  );
}