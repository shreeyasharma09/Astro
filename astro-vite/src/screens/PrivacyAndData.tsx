import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../services/storage';

interface PrivacyAndDataProps {
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

type ExportStatus = null | 'sending' | 'sent' | 'error' | 'guest';

export function PrivacyAndData({ onBack, go }: PrivacyAndDataProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<ExportStatus>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleExport = async () => {
    if (!user) {
      setStatus('guest');
      return;
    }
    setStatus('sending');
    const res = await storage.requestEmailExport();
    if (res.ok) setStatus('sent');
    else {
      setStatus('error');
      setErrorMsg(res.error || 'Something went wrong.');
    }
  };

  return (
    <Container>
      <TopBar title="Privacy & data" onBack={onBack} />
      <Screen className="px-5 pb-6 flex flex-col gap-3">
        <Card className="bg-lilac-soft dark:bg-lilac/10">
          <p className="font-bold mb-1">What Astro stores</p>
          <p className="text-sm text-mute-light dark:text-mute-dark leading-relaxed">
            Your journal entries, reminders, and scenario sessions — tied to your account. Data is stored in Supabase, hosted in the United States.
          </p>
        </Card>

        <Card>
          <p className="font-bold mb-1 text-sm">About the mic</p>
          <p className="text-xs text-mute-light dark:text-mute-dark leading-relaxed">
            Speech-to-text runs through your browser. Safari keeps audio on-device. Chrome and Edge send audio to Google for transcription — Astro doesn't control that part and doesn't record or store audio itself. We're working on a fully on-device option.
          </p>
        </Card>

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mt-2 mb-2 px-1">Your data, your call</p>
          <Card className="divide-y divide-lilac-soft dark:divide-ink-light/10 p-0">
            <button onClick={handleExport} disabled={status === 'sending'} className="w-full p-4 flex items-center gap-3 text-left disabled:opacity-60">
              <Icon name="send" size={18} />
              <div className="flex-1">
                <p className="font-semibold">Email me a copy of my data</p>
                <p className="text-[11px] text-mute-light dark:text-mute-dark">{user ? `Sent to ${user.email}` : 'Sign in required'}</p>
              </div>
              <Icon name="chevronRight" size={16} />
            </button>
            <button onClick={() => go('deleteData')} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="trash" size={18} />
              <div className="flex-1">
                <p className="font-semibold text-crisis">Delete all my data</p>
                <p className="text-[11px] text-mute-light dark:text-mute-dark">Permanent — we'll confirm first.</p>
              </div>
              <Icon name="chevronRight" size={16} />
            </button>
          </Card>
        </div>

        {status === 'sending' && <Card><p className="text-sm text-mute-light dark:text-mute-dark">Sending your export…</p></Card>}
        {status === 'sent' && <Card className="bg-sage-soft dark:bg-sage/10"><p className="text-sm">✓ Check your inbox — it may take a minute to arrive.</p></Card>}
        {status === 'error' && (
          <Card className="bg-coral/20">
            <p className="text-sm font-bold mb-1">Export isn't available yet</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">{errorMsg}</p>
          </Card>
        )}
        {status === 'guest' && <Card><p className="text-sm text-mute-light dark:text-mute-dark">You're using Astro as a guest — there's no account data to export. Your notes live on this device only.</p></Card>}

        <p className="text-[11px] text-center text-mute-light dark:text-mute-dark mt-2">Questions? Astro is a supportive tool, not therapy or a medical device.</p>
      </Screen>
    </Container>
  );
}