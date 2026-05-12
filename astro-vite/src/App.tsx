import { useEffect, useState } from 'react';
import { Container } from './components/Container';
import { Icon } from './components/Icon';
import type { NavId } from './components/BottomNav';
import { useAuth } from './hooks/useAuth';

import { Splash } from './screens/Splash';
import { Welcome } from './screens/Welcome';
import { AccountChoice } from './screens/AccountChoice';
import { GuestConfirm } from './screens/GuestConfirm';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Practice } from './screens/Practice';
import { Reminders } from './screens/Reminders';
import { Journal } from './screens/Journal';
import { Me } from './screens/Me';
import { ScenarioDetail } from './screens/ScenarioDetail';
import { Prep } from './screens/Prep';
import { ModePicker } from './screens/ModePicker';
import { Roleplay } from './screens/Roleplay';
import { Reflection } from './screens/Reflection';
import { Crisis } from './screens/Crisis';
import { Breathing } from './screens/Breathing';
import { AddReminder } from './screens/AddReminder';
import { JournalNew } from './screens/JournalNew';
import { PrivacyAndData } from './screens/PrivacyAndData';
import { DeleteData } from './screens/DeleteData';
import { PostDelete } from './screens/PostDelete';
import { DesktopFrame } from './components/DesktopFrame';

interface Route {
  name: string;
  id?: string;
  mode?: 'tap' | 'type' | 'speak';
  authDeleted?: boolean;
  [key: string]: any;
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [route, setRoute] = useState<Route>({ name: 'splash' });
  const [nav, setNav] = useState<NavId>('home');
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const go = (name: string, params: Record<string, any> = {}) =>
    setRoute({ name, ...params });

  // Dev shortcut: ?to=<route-name> jumps straight there on load.
  useEffect(() => {
    const jumpTo = new URLSearchParams(window.location.search).get('to');
    if (jumpTo) go(jumpTo);
  }, []);

  // Signed-in users skip onboarding flow.
  useEffect(() => {
    if (user && ['splash', 'welcome', 'account', 'guestConfirm'].includes(route.name)) {
      go('tabs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onCrisis = () => go('crisis');

  const renderScreen = () => {
    switch (route.name) {
      case 'splash':
        return <Container><Splash onNext={() => go('welcome')} /></Container>;
      case 'welcome':
        return <Container><Welcome onDone={() => go('account')} /></Container>;
      case 'account':
        return <Container><AccountChoice onGuest={() => go('guestConfirm')} /></Container>;
      case 'guestConfirm':
        return <GuestConfirm onContinue={() => go('onboarding')} onBack={() => go('account')} />;
      case 'onboarding':
        return <Onboarding onDone={() => go('tabs')} />;
      case 'tabs':
      case 'settings': {
        if (nav === 'home') return <Home go={go} nav={nav} setNav={setNav} onCrisis={onCrisis} />;
        if (nav === 'practice') return <Practice go={go} nav={nav} setNav={setNav} onCrisis={onCrisis} />;
        if (nav === 'reminders') return <Reminders go={go} nav={nav} setNav={setNav} onCrisis={onCrisis} />;
        if (nav === 'journal') return <Journal go={go} nav={nav} setNav={setNav} onCrisis={onCrisis} />;
        if (nav === 'me') return <Me go={go} nav={nav} setNav={setNav} dark={dark} setDark={setDark} onCrisis={onCrisis} />;
        return null;
      }
      case 'breathing':
        return <Breathing onBack={() => go('tabs')} />;
      case 'scenario':
        return <ScenarioDetail id={route.id!} onBack={() => go('tabs')} go={go} />;
      case 'prep':
        return <Prep id={route.id!} onBack={() => go('scenario', { id: route.id })} go={go} />;
      case 'mode-picker':
        return <ModePicker id={route.id!} onBack={() => go('tabs')} go={go} />;
      case 'roleplay':
        return <Roleplay id={route.id!} mode={route.mode} onBack={() => go('tabs')} go={go} />;
      case 'reflection':
        return <Reflection id={route.id!} onDone={() => { setNav('journal'); go('tabs'); }} />;
      case 'crisis':
        return <Crisis onBack={() => go('tabs')} />;
      case 'privacy':
        return <PrivacyAndData onBack={() => go('tabs')} go={go} />;
      case 'deleteData':
        return <DeleteData onBack={() => go('privacy')} go={go} />;
      case 'postDelete':
        return <PostDelete mode={(route.mode as 'guest' | 'account') || 'account'} authDeleted={route.authDeleted} go={go} />;
      case 'addReminder':
        return <AddReminder onBack={() => go('tabs')} onSave={() => go('tabs')} />;
      case 'journalNew':
        return <JournalNew onBack={() => go('tabs')} onSave={() => { setNav('journal'); go('tabs'); }} />;
      default:
        return <Container><Splash onNext={() => go('welcome')} /></Container>;
    }
  };

  return (
    <>
      {/* Dev bar — hidden on mobile, visible on desktop */}
      <div className="hidden sm:flex fixed top-3 right-3 z-50 gap-2 items-center text-xs bg-white/70 dark:bg-surface-dark/70 backdrop-blur rounded-full px-2 py-1 shadow-soft">
        <button
          onClick={() => setDark(!dark)}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-lilac-soft dark:bg-lilac/20"
          aria-label="Toggle dark mode"
        >
          <Icon name={dark ? 'sun' : 'moon'} size={14} />
        </button>
        <select
          value={route.name}
          onChange={(e) => {
            const v = e.target.value;
            const needsId = ['scenario', 'prep', 'roleplay', 'reflection', 'mode-picker'].includes(v);
            go(v, needsId ? { id: 'coffee' } : {});
          }}
          className="bg-transparent text-ink-light dark:text-ink-dark font-semibold text-xs outline-none"
        >
          <option value="splash">Splash</option>
          <option value="welcome">Welcome slides</option>
          <option value="account">Account choice</option>
          <option value="guestConfirm">Guest confirm</option>
          <option value="onboarding">Onboarding</option>
          <option value="tabs">Home / Tabs</option>
          <option value="scenario">Scenario detail</option>
          <option value="prep">Prep flow</option>
          <option value="mode-picker">Mode picker</option>
          <option value="roleplay">Roleplay</option>
          <option value="reflection">Reflection</option>
          <option value="addReminder">Add reminder</option>
          <option value="journalNew">Journal new</option>
          <option value="privacy">Privacy & data</option>
          <option value="deleteData">Delete data</option>
          <option value="crisis">Crisis resources</option>
          <option value="breathing">Breathing</option>
        </select>
      </div>

      {/* FIXED WRAPPER */}
      <DesktopFrame>
        <div className="content-scroller">
          {renderScreen()}
        </div>
      </DesktopFrame>
    </>
  );
}