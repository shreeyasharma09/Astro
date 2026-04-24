import { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { TulipMark } from '../components/Tulip';
import { BottomNav, type NavId } from '../components/BottomNav';
import { CrisisChip } from '../components/CrisisChip';
import { storage, type JournalEntry } from '../services/storage';

interface JournalProps {
  go: (route: string, params?: Record<string, any>) => void;
  nav: NavId;
  setNav: (id: NavId) => void;
  onCrisis: () => void;
}

function formatEntryDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function Journal({ go, nav, setNav, onCrisis }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    storage.getJournal().then((data) => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <Container>
      <TopBar
        title="Journal"
        right={
          <button onClick={() => go('journalNew')} className="w-8 h-8 rounded-full bg-lilac-strong text-white flex items-center justify-center">
            <Icon name="plus" size={16} />
          </button>
        }
      />
      <Screen className="px-5 pb-4 flex flex-col gap-3">
        <Card className="bg-gradient-to-br from-lilac-soft to-sage-soft dark:from-lilac/10 dark:to-sage/10">
          <p className="font-bold mb-1">Wins journal</p>
          <p className="text-sm text-mute-light dark:text-mute-dark">Small wins only — no pressure to perform.</p>
        </Card>
        {loading && <p className="text-sm text-center text-mute-light dark:text-mute-dark py-6">Loading…</p>}
        {!loading && entries.length === 0 && (
          <Card className="text-center py-6">
            <p className="text-sm text-mute-light dark:text-mute-dark">No entries yet. Tap <strong>+</strong> to note your first small win.</p>
          </Card>
        )}
        {entries.map((e, i) => (
          <Card key={e.id || i}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FBEEF4' }}>
                <TulipMark size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{e.title}</p>
                  <span className="text-[10px] uppercase font-bold text-mute-light dark:text-mute-dark">{formatEntryDate(e.created_at)}</span>
                </div>
                <p className="text-sm text-mute-light dark:text-mute-dark mt-1">{e.body}</p>
                {e.tag && <span className="mt-2 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-lilac-soft dark:bg-lilac/20 text-lilac-strong dark:text-lilac-dark">{e.tag}</span>}
              </div>
            </div>
          </Card>
        ))}
      </Screen>
      <CrisisChip onClick={onCrisis} />
      <BottomNav current={nav} onChange={setNav} />
    </Container>
  );
}