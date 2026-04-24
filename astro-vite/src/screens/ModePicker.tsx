import { useState } from 'react';
import { Container } from '../components/Container';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Icon } from '../components/Icon';
import { Panda } from '../components/Panda';
import { SCENARIOS } from '../lib/scenarios';
import { getSpeechPrivacyMode } from '../lib/privacy';

interface ModePickerProps {
  id: string;
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

export function ModePicker({ id, onBack, go }: ModePickerProps) {
  const s = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];
  const [showWhy, setShowWhy] = useState(false);
  const privacy = getSpeechPrivacyMode();

  const pick = (mode: 'tap' | 'type' | 'speak') => go('roleplay', { id, mode });

  return (
    <Container>
      <TopBar title="Choose how to practice" onBack={onBack} />
      <Screen className="px-5 pb-6 flex flex-col gap-4">
        <div className="text-center pt-2">
          <div className="text-5xl mb-1">{s.emoji}</div>
          <h2 className="text-2xl font-extrabold tracking-tight">{s.short}</h2>
          <p className="text-xs text-mute-light dark:text-mute-dark font-semibold mt-1">Pick your comfort level — you can switch anytime.</p>
        </div>

        {/* Tap */}
        <button
          onClick={() => pick('tap')}
          className="bg-surface-light dark:bg-surface-dark rounded-card p-4 flex items-center gap-3 shadow-soft dark:shadow-soft-dark text-left active:scale-[0.99] transition"
        >
          <div className="w-12 h-12 rounded-card bg-lilac-soft dark:bg-lilac/20 flex items-center justify-center text-lilac-strong dark:text-lilac-dark">
            <Icon name="sparkle" size={22} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-sm">Tap a reply</p>
            <p className="text-[11px] text-mute-light dark:text-mute-dark font-semibold mt-0.5">Pick from 3 gentle options. Easiest start.</p>
          </div>
          <Icon name="chevronRight" size={16} className="text-mute-light dark:text-mute-dark" />
        </button>

        {/* Type */}
        <button
          onClick={() => pick('type')}
          className="bg-surface-light dark:bg-surface-dark rounded-card p-4 flex items-center gap-3 shadow-soft dark:shadow-soft-dark text-left active:scale-[0.99] transition"
        >
          <div className="w-12 h-12 rounded-card bg-sky-soft dark:bg-sky/20 flex items-center justify-center text-sky-strong dark:text-sky-dark">
            <Icon name="book" size={22} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-sm">Type to text</p>
            <p className="text-[11px] text-mute-light dark:text-mute-dark font-semibold mt-0.5">Write your own replies. Take your time.</p>
          </div>
          <Icon name="chevronRight" size={16} className="text-mute-light dark:text-mute-dark" />
        </button>

        {/* Speak — recommended */}
        <button
          onClick={() => pick('speak')}
          className="relative rounded-card p-4 text-left active:scale-[0.99] transition border-2 border-sage shadow-soft"
          style={{ background: 'linear-gradient(135deg, #DFEDDF 0%, #F6FBF0 100%)' }}
        >
          <div className="absolute -top-2.5 right-4 bg-sage-strong text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Icon name="heart" size={10} /> RECOMMENDED
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-card bg-white text-sage-strong flex items-center justify-center shadow-soft">
              <Icon name="wind" size={22} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-sm text-sage-strong">Speak out loud</p>
              <p className="text-[11px] text-sage-strong font-semibold mt-0.5 opacity-80">Rehearse with your actual voice. Builds confidence faster.</p>
            </div>
            <Icon name="chevronRight" size={16} className="text-sage-strong" />
          </div>
          <div className="mt-3 bg-white/60 rounded-btn p-2.5 flex gap-2 items-center">
            <Panda mood="cheer" size={32} />
            <p className="text-[10.5px] text-sage-strong font-semibold leading-snug">
              <b>Why Momo suggests this:</b> saying words out loud in a safe space helps your nervous system learn it's okay — so the real thing feels less scary.
            </p>
          </div>
        </button>

        {/* Honest privacy note */}
        <div className="mt-auto text-center px-2">
          {privacy === 'on-device' ? (
            <p className="text-[11px] text-mute-light dark:text-mute-dark font-semibold leading-relaxed">
              Your voice stays on your device. Astro doesn't record or store audio.
            </p>
          ) : (
            <div>
              <p className="text-[11px] text-mute-light dark:text-mute-dark font-semibold leading-relaxed">
                On this browser, speech is transcribed by Google as part of your browser's built-in speech feature. Astro doesn't record or store audio.{' '}
                <button
                  onClick={() => setShowWhy((v) => !v)}
                  className="text-lilac-strong dark:text-lilac-dark font-extrabold underline"
                >{showWhy ? 'Hide' : 'Why?'}</button>
              </p>
              {showWhy && (
                <div className="mt-2 text-left bg-surface-light dark:bg-surface-dark rounded-btn p-3">
                  <p className="text-[11px] text-mute-light dark:text-mute-dark leading-relaxed">
                    Your browser provides speech-to-text. Chrome and Edge send audio to Google's servers to transcribe it — we don't control that. Safari runs speech recognition on your device.
                  </p>
                  <p className="text-[11px] text-mute-light dark:text-mute-dark leading-relaxed mt-2">
                    If on-device speech matters to you, use Safari, or pick Tap / Type instead. We're working on a fully on-device option for a future update.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Screen>
    </Container>
  );
}