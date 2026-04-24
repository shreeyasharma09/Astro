import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Panda } from '../components/Panda';
import { BottomNav, type NavId } from '../components/BottomNav';
import { useAuth } from '../hooks/useAuth';
import { storage, signOutUser } from '../services/storage';

// notif
const perm = await Notification.requestPermission();

if (perm === 'granted') {
  new Notification('Time to practice', {
    body: 'Dinner with friends is in 1 hour. Ready to rehearse?',
    icon: '/tulip.png',
  });
}

interface MeProps {
  go: (route: string, params?: Record<string, any>) => void;
  nav: NavId;
  setNav: (id: NavId) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  onCrisis: () => void;
}

type UpgradeStatus = null | 'running' | 'done' | 'nothing';

export function Me({ go, nav, setNav, dark, setDark, onCrisis }: MeProps) {
  const { user } = useAuth();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>(null);

  const handleUpgrade = async () => {
    setUpgradeStatus('running');
    const { migrated } = await storage.upgradeGuest();
    setUpgradeStatus(migrated > 0 ? 'done' : 'nothing');
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <Container>
      <TopBar title="Me" />
      <Screen className="px-5 pb-6 flex flex-col gap-3">
        <Card className="flex items-center gap-3">
          <Panda mood="cheer" size={56} />
          <div className="flex-1">
            <p className="font-bold">{user ? user.email : 'Guest'}</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">
              {user ? 'Your data is safely backed up.' : 'Sessions stay on this device.'}
            </p>
          </div>
          {user ? (
            <button onClick={handleSignOut} className="text-xs font-bold text-mute-light dark:text-mute-dark">Sign out</button>
          ) : (
            <button onClick={() => go('account')} className="text-xs font-bold text-lilac-strong dark:text-lilac-dark">Sign in</button>
          )}
        </Card>

        {user && upgradeStatus === null && (
          <Card className="flex items-center gap-3 bg-sage-soft dark:bg-sage/10">
            <div className="flex-1">
              <p className="font-bold text-sm">Move guest data to your account?</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">Anything you practiced before signing in.</p>
            </div>
            <button onClick={handleUpgrade} className="text-xs font-bold text-sage-strong dark:text-sage-dark">Migrate</button>
          </Card>
        )}
        {upgradeStatus === 'running' && (
          <Card><p className="text-sm text-mute-light dark:text-mute-dark">Moving your data…</p></Card>
        )}
        {upgradeStatus === 'done' && (
          <Card className="bg-sage-soft dark:bg-sage/10"><p className="text-sm">✓ Your guest data is now on your account.</p></Card>
        )}
        {upgradeStatus === 'nothing' && (
          <Card><p className="text-sm text-mute-light dark:text-mute-dark">No guest data to move — you're all set.</p></Card>
        )}

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mt-3 mb-2 px-1">Your streak</p>
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-bold">3 gentle days</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">No-pressure streaks. Missed days don't reset you.</p>
            </div>
            <div className="text-3xl">🌱</div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mt-3 mb-2 px-1">Settings</p>
          <Card className="divide-y divide-lilac-soft dark:divide-ink-light/10 p-0">
            <button onClick={() => setDark(!dark)} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name={dark ? 'sun' : 'moon'} size={18} />
              <span className="flex-1 font-semibold">{dark ? 'Light mode' : 'Dark mode'}</span>
              <span className="text-xs text-mute-light dark:text-mute-dark">{dark ? 'On' : 'Off'}</span>
            </button>
            <button onClick={() => go('privacy')} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="shield" size={18} />
              <span className="flex-1 font-semibold">Privacy & data</span>
              <Icon name="chevronRight" size={16} />
            </button>
            <button onClick={onCrisis} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="heart" size={18} />
              <span className="flex-1 font-semibold">Crisis resources</span>
              <Icon name="chevronRight" size={16} />
            </button>
            <button onClick={() => go('deleteData')} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="trash" size={18} />
              <span className="flex-1 font-semibold">Delete my data</span>
              <Icon name="chevronRight" size={16} />
            </button>
          </Card>
        </div>

        <p className="text-[11px] text-center text-mute-light dark:text-mute-dark mt-2">Astro is a supportive tool, not therapy or a medical device.</p>
      </Screen>
      <BottomNav current={nav} onChange={setNav} />
    </Container>
  );
}