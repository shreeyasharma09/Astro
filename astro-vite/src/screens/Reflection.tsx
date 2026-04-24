import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Panda } from '../components/Panda';
import { SCENARIOS } from '../lib/scenarios';
import { storage } from '../services/storage';

interface ReflectionProps {
  id: string;
  onDone: () => void;
}

export function Reflection({ id, onDone }: ReflectionProps) {
  const [postRating, setPostRating] = useState<number | null>(null);
  const [win, setWin] = useState('');
  const [saving, setSaving] = useState(false);
  const s = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];

  const handleSave = async () => {
    setSaving(true);
    try {
      const session = await storage.saveSession({
        scenario_id: s.id,
        post_anxiety: postRating,
        ended_at: new Date().toISOString(),
        completed: true,
      });
      if (win.trim()) {
        await storage.saveJournal({
          title: `I practiced: ${s.short}`,
          body: win.trim(),
          tag: s.short,
          session_id: session?.id || null,
        } as any);
      }
    } catch (e) {
      console.error('[Reflection] save failed:', e);
    } finally {
      setSaving(false);
      onDone();
    }
  };

  return (
    <Container>
      <TopBar title="Reflection" />
      <Screen className="px-6 pb-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <Panda mood="cheer" size={120} />
          <h2 className="text-2xl font-extrabold">That took courage.</h2>
          <p className="text-sm text-mute-light dark:text-mute-dark">Let's notice something before we close out.</p>
        </div>
        <div>
          <p className="font-bold mb-2">How anxious does it feel now?</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setPostRating(n)}
                className={`aspect-square rounded-card font-bold text-lg transition ${postRating === n ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
              >{n}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold mb-2">One thing that went okay?</p>
          <textarea
            value={win}
            onChange={(e) => setWin(e.target.value)}
            placeholder="Even something small — 'I asked for oat milk without stumbling.'"
            className="w-full min-h-[100px] rounded-card p-4 bg-surface-light dark:bg-surface-dark text-sm resize-none outline-none focus:ring-2 focus:ring-lilac"
          />
        </div>
        <div className="mt-auto"><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save to journal'}</Button></div>
      </Screen>
    </Container>
  );
}