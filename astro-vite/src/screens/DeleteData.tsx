import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../services/storage';

interface DeleteDataProps {
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

export function DeleteData({ onBack, go }: DeleteDataProps) {
  const { user } = useAuth();
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const canDelete = confirm.trim().toUpperCase() === 'DELETE';

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    setError('');
    const res = await storage.deleteMyData();
    setDeleting(false);
    if (res.mode === 'guest') {
      go('postDelete', { mode: 'guest' });
      return;
    }
    if (res.ok) {
      go('postDelete', { mode: 'account', authDeleted: true });
    } else if (res.authDeleted === false && (!res.errors || res.errors.every((e) => e.startsWith('auth:')))) {
      go('postDelete', { mode: 'account', authDeleted: false });
    } else {
      setError((res.errors || []).join(' · ') || 'Something went wrong. Your data may not be fully deleted.');
    }
  };

  return (
    <Container>
      <TopBar title="Delete my data" onBack={onBack} />
      <Screen className="px-5 pb-6 flex flex-col gap-4">
        <Card className="bg-coral/20">
          <p className="font-bold mb-2">This cannot be undone.</p>
          <p className="text-sm text-mute-light dark:text-mute-dark leading-relaxed">
            We'll permanently delete your journal entries, reminders, scenario sessions, and profile. {user ? 'Your account will be removed too.' : 'Your local data on this device will be cleared.'}
          </p>
        </Card>

        <Card>
          <p className="font-bold mb-1 text-sm">What stays after deletion</p>
          <ul className="text-xs text-mute-light dark:text-mute-dark leading-relaxed list-disc pl-4 space-y-1">
            <li>Nothing in your account — we remove every row we store about you.</li>
            <li>Anonymous, aggregated usage counts (never tied to you) may remain.</li>
            <li>You can create a new account anytime.</li>
          </ul>
        </Card>

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mb-2 px-1">Type DELETE to confirm</p>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full p-3 rounded-card bg-surface-light dark:bg-surface-dark text-sm outline-none focus:ring-2 focus:ring-crisis font-bold tracking-widest uppercase"
          />
        </div>

        {error && (
          <Card className="bg-coral/20">
            <p className="text-xs font-bold mb-1">We hit a problem</p>
            <p className="text-[11px] text-mute-light dark:text-mute-dark">{error}</p>
          </Card>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <Button variant="danger" disabled={!canDelete || deleting} onClick={handleDelete}>
            {deleting ? 'Deleting…' : 'Delete my data'}
          </Button>
          <Button variant="ghost" onClick={onBack}>Cancel</Button>
        </div>
      </Screen>
    </Container>
  );
}