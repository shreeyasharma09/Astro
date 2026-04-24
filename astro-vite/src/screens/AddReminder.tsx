import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { SCENARIOS } from '../lib/scenarios';
import { storage } from '../services/storage';

interface AddReminderProps {
  onBack: () => void;
  onSave: () => void;
}

export function AddReminder({ onBack, onSave }: AddReminderProps) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!label.trim() || !date || !time) return;
    setSaving(true);
    try {
      const event_time = new Date(`${date}T${time}`).toISOString();
      await storage.saveReminder({
        label: label.trim(),
        event_time,
        scenario_id: scenarioId,
      } as any);
    } catch (e) {
      console.error('[AddReminder] save failed:', e);
    } finally {
      setSaving(false);
      onSave();
    }
  };

  return (
    <Container>
      <TopBar title="New reminder" onBack={onBack} />
      <Screen className="px-6 pb-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">What's happening?</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Dinner with friends"
            className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none focus:ring-2 focus:ring-lilac"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Related practice</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {SCENARIOS.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => setScenarioId(scenarioId === s.id ? null : s.id)}
                className={`p-3 rounded-card text-left text-sm font-semibold flex items-center gap-2 transition border-2 ${scenarioId === s.id ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
              >
                <span className="text-lg">{s.emoji}</span>
                {s.short}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <Button onClick={handleSave} disabled={saving || !label.trim() || !date || !time}>
            {saving ? 'Saving…' : 'Save reminder'}
          </Button>
        </div>
      </Screen>
    </Container>
  );
}