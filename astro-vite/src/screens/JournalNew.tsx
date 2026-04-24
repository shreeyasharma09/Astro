import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { storage } from '../services/storage';

interface JournalNewProps {
  onBack: () => void;
  onSave: () => void;
}

export function JournalNew({ onBack, onSave }: JournalNewProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !body.trim()) return;
    setSaving(true);
    try {
      await storage.saveJournal({
        title: title.trim() || 'A small win',
        body: body.trim(),
      });
    } catch (e) {
      console.error('[JournalNew] save failed:', e);
    } finally {
      setSaving(false);
      onSave();
    }
  };

  return (
    <Container>
      <TopBar title="New entry" onBack={onBack} />
      <Screen className="px-6 pb-6 flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="One small thing I did…"
          className="p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none font-bold text-lg"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened? How did it feel?"
          className="min-h-[200px] p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none resize-none"
        />
        <div className="mt-auto">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </Screen>
    </Container>
  );
}