import { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { BottomNav, type NavId } from '../components/BottomNav';
import { CrisisChip } from '../components/CrisisChip';
import { storage, type Reminder } from '../services/storage';

interface RemindersProps {
  go: (route: string, params?: Record<string, any>) => void;
  nav: NavId;
  setNav: (id: NavId) => void;
  onCrisis: () => void;
}

function formatReminderWhen(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { weekday: 'long' }) +
    ' · ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  );
}

export function Reminders({ go, nav, setNav, onCrisis }: RemindersProps) {
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    storage.getReminders().then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <Container>
      <TopBar
        title="Reminders"
        right={
          <button onClick={() => go('addReminder')} className="w-8 h-8 rounded-full bg-lilac-strong text-white flex items-center justify-center">
            <Icon name="plus" size={16} />
          </button>
        }
      />
      <Screen className="px-5 pb-4 flex flex-col gap-3">
        <Card className="bg-gradient-to-br from-sky-soft to-sage-soft dark:from-sky/10 dark:to-sage/10">
          <p className="font-bold mb-1">Schedule anything real.</p>
          <p className="text-sm text-mute-light dark:text-mute-dark">We'll ping you before, during prep, and after — with the right practice at each step.</p>
        </Card>
        {loading && <p className="text-sm text-center text-mute-light dark:text-mute-dark py-6">Loading…</p>}
        {!loading && items.length === 0 && (
          <Card className="text-center py-6">
            <p className="text-sm text-mute-light dark:text-mute-dark">No reminders yet. Tap <strong>+</strong> to add one.</p>
          </Card>
        )}
        {items.map((it, i) => (
          <Card key={it.id || i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-soft dark:bg-sage/20 flex items-center justify-center text-sage-strong dark:text-sage-dark">
              <Icon name="clock" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-bold">{it.label}</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">{formatReminderWhen(it.event_time)}</p>
            </div>
            {(it as any).scenario_id && (
              <button onClick={() => go('scenario', { id: (it as any).scenario_id })} className="text-xs font-bold text-lilac-strong dark:text-lilac-dark">Prep</button>
            )}
          </Card>
        ))}
      </Screen>
      <CrisisChip onClick={onCrisis} />
      <BottomNav current={nav} onChange={setNav} />
    </Container>
  );
}