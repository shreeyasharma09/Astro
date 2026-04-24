import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Panda } from '../components/Panda';
import { SCENARIOS, DEMO_TURNS, TYPE_SUGGESTIONS, type Turn } from '../lib/scenarios';
import { containsCrisisLanguage } from '../lib/crisis';
import { getSpeechPrivacyMode } from '../lib/privacy';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface RoleplayProps {
  id: string;
  mode?: 'tap' | 'type' | 'speak';
  onBack: () => void;
  go: (route: string, params?: Record<string, any>) => void;
}

type Mode = 'tap' | 'type' | 'speak';

export function Roleplay({ id, mode = 'tap', onBack, go }: RoleplayProps) {
  const s = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];
  const turns: Turn[] = DEMO_TURNS[id] || [
    { role: 'assistant', text: s.opener },
    { choices: [{ id: 'a', text: '(type or speak your response)' }] },
    { role: 'system', text: 'This scenario is available as a full demo in scenario #1 (Coffee). The others will open up with LLM-powered replies in the real build.' },
  ];

  const [cursor, setCursor] = useState(0);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const [draft, setDraft] = useState('');
  const [showMicNotice, setShowMicNotice] = useState(false);
  const speech = useSpeechRecognition();
  const privacy = getSpeechPrivacyMode();

  useEffect(() => {
    if (!speech.transcript) return;
    setDraft((d) => (d ? d + ' ' : '') + speech.transcript);
    speech.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript]);

  useEffect(() => {
    const step = turns[cursor];
    if (!step) return;
    if ('role' in step && (step.role === 'assistant' || step.role === 'system')) {
      setTyping(true);
      const t = setTimeout(() => {
        setMessages((m) => [...m, step]);
        setTyping(false);
        setCursor((c) => c + 1);
      }, 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const current = turns[cursor];
  const isChoice = current && 'choices' in current;
  const isDone = !current;

  const pickChoice = (c: { id: string; text: string }) => {
    setMessages((m) => [...m, { role: 'user' as const, text: c.text } as any]);
    setCursor((x) => x + 1);
  };

  const sendFreeText = () => {
    const text = draft.trim();
    if (!text) return;
    if (containsCrisisLanguage(text)) {
      setDraft('');
      if (speech.listening) speech.stop();
      go('crisis');
      return;
    }
    setMessages((m) => [...m, { role: 'user' as const, text } as any]);
    setDraft('');
    if (speech.listening) speech.stop();
    if (isChoice) setCursor((x) => x + 1);
  };

  const toggleMic = () => {
    if (!speech.supported) return;
    if (speech.listening) { speech.stop(); return; }
    let seen: string | null = '1';
    try { seen = window.localStorage.getItem('astro_mic_notice_v1'); } catch { /* ignore */ }
    if (!seen) { setShowMicNotice(true); return; }
    speech.start();
  };

  const acceptMicNotice = () => {
    try { window.localStorage.setItem('astro_mic_notice_v1', '1'); } catch { /* ignore */ }
    setShowMicNotice(false);
    speech.start();
  };

  useKeyboardShortcuts(
    {
      '1': () => {
        if (isChoice && activeMode === 'tap' && (current as any).choices[0]) {
          pickChoice((current as any).choices[0]);
        }
      },
      '2': () => {
        if (isChoice && activeMode === 'tap' && (current as any).choices[1]) {
          pickChoice((current as any).choices[1]);
        }
      },
      '3': () => {
        if (isChoice && activeMode === 'tap' && (current as any).choices[2]) {
          pickChoice((current as any).choices[2]);
        }
      },
      m: () => {
        if (activeMode === 'speak') toggleMic();
      },
      Escape: () => {
        if (showMicNotice) {
          setShowMicNotice(false);
          return;
        }
        if (speech.listening) {
          speech.stop();
          return;
        }
        onBack();
      },
    },
    true
  );

  const modeLabel = activeMode === 'tap' ? 'tap mode' : activeMode === 'type' ? 'type mode' : 'speak mode';

  const transcriptContent: ReactNode = draft
    ? draft + (speech.interim ? ' ' + speech.interim : '')
    : speech.interim
      ? <span className="opacity-70">{speech.interim}</span>
      : speech.error === 'not-allowed'
        ? <span className="not-italic text-mute-light">Mic permission was denied. Switch to type or tap.</span>
        : speech.supported
          ? <span className="not-italic text-mute-light">Tap the mic and say your response…</span>
          : <span className="not-italic text-mute-light">Speech isn't supported here. Switch to type or tap.</span>;

  return (
    <Container>
      <div className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-lilac-soft dark:border-ink-light/10">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-light dark:bg-surface-dark shadow-soft">
          <Icon name="chevronLeft" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-2xl">{s.emoji}</div>
          <div className="text-center">
            <p className="text-sm font-bold">{s.short}</p>
            <p className="text-[10px] text-mute-light dark:text-mute-dark">with {s.character} · {modeLabel}</p>
          </div>
        </div>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-light dark:bg-surface-dark shadow-soft">
          <Icon name="x" size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
        {messages.map((m: any, i) => {
          if (m.role === 'system') {
            return (
              <div key={i} className="self-center bg-sage-soft dark:bg-sage/20 text-sage-strong dark:text-sage-dark text-sm font-semibold px-4 py-2 rounded-full">{m.text}</div>
            );
          }
          const mine = m.role === 'user';
          return (
            <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
              {!mine && <Panda mood="listen" size={32} />}
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${mine ? 'bg-lilac-strong text-white rounded-br-sm' : 'bg-surface-light dark:bg-surface-dark rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex items-end gap-2">
            <Panda mood="listen" size={32} />
            <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark" />
            </div>
          </div>
        )}
      </div>

      {/* TAP MODE */}
      {isChoice && activeMode === 'tap' && (
        <div className="px-4 pt-3 pb-6 bg-white/70 dark:bg-surface-dark/60 backdrop-blur border-t border-lilac-soft dark:border-ink-light/10">
          <div className="flex items-center justify-between px-1 pb-1.5">
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-mute-light dark:text-mute-dark">Tap a reply</p>
            <button onClick={() => setActiveMode('speak')} className="text-[10px] font-extrabold text-lilac-strong dark:text-lilac-dark flex items-center gap-1">
              <Icon name="mic" size={11} /> Switch to speak
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {(current as any).choices.map((c: any) => (
              <button
                key={c.id}
                onClick={() => pickChoice(c)}
                className="text-left p-3 rounded-card bg-lilac-soft dark:bg-lilac/10 text-sm font-bold active:scale-[0.99] transition"
              >{c.text}</button>
            ))}
          </div>
        </div>
      )}

      {/* TYPE MODE */}
      {isChoice && activeMode === 'type' && (
        <div className="px-3 pt-2.5 pb-6 bg-white/85 dark:bg-surface-dark/85 border-t border-lilac-soft dark:border-ink-light/10">
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-mute-light dark:text-mute-dark">Type your reply</p>
            <button onClick={() => setActiveMode('speak')} className="text-[10px] font-extrabold text-sky-strong dark:text-sky-dark flex items-center gap-1">
              <Icon name="mic" size={11} /> Switch to speak
            </button>
          </div>
          <div className="bg-white dark:bg-bg-dark rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-2 shadow-soft">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendFreeText(); } }}
              placeholder="Type your response…"
              className="flex-1 bg-transparent outline-none text-sm min-h-[36px]"
            />
            <button
              onClick={sendFreeText}
              disabled={!draft.trim()}
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-lilac-strong text-white flex items-center justify-center shadow-soft disabled:opacity-40"
            >
              <Icon name="send" size={16} />
            </button>
          </div>
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {(TYPE_SUGGESTIONS[id] || ['okay', 'sure', 'thanks']).map((sug, i) => (
              <button
                key={i}
                onClick={() => setDraft((d) => (d ? d + ' ' : '') + sug)}
                className="px-3 py-1.5 rounded-full bg-lilac-soft dark:bg-lilac/10 text-lilac-strong dark:text-lilac-dark text-[11px] font-extrabold whitespace-nowrap active:scale-[0.98] transition"
              >{sug}</button>
            ))}
          </div>
        </div>
      )}

      {/* SPEAK MODE */}
      {isChoice && activeMode === 'speak' && (
        <div
          className="px-4 pt-3 pb-6 border-t border-lilac-soft dark:border-ink-light/10 flex flex-col items-center gap-2.5"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, #DFEDDF 100%)' }}
        >
          <div className="flex items-center justify-between w-full px-1">
            <button onClick={() => setActiveMode('tap')} className="text-[10px] font-extrabold text-mute-light dark:text-mute-dark flex items-center gap-1">
              <Icon name="chevronLeft" size={11} /> Switch to tap
            </button>
            <p className="text-[10px] uppercase tracking-widest font-extrabold text-sage-strong">
              {!speech.supported ? 'Not supported' : speech.listening ? 'Listening' : 'Tap mic to speak'}
            </p>
            <span className="w-[70px]" />
          </div>

          <button
            onClick={toggleMic}
            disabled={!speech.supported}
            aria-label={speech.listening ? 'Stop listening' : 'Start listening'}
            className="relative w-28 h-28 flex items-center justify-center disabled:opacity-40"
          >
            <span className={`absolute inset-0 rounded-full bg-sage ${speech.listening ? 'orb-ring-1' : ''}`} style={{ opacity: 0.15 }} />
            <span className={`absolute inset-3 rounded-full bg-sage ${speech.listening ? 'orb-ring-2' : ''}`} style={{ opacity: 0.28 }} />
            <span className="absolute inset-7 rounded-full flex items-center justify-center shadow-soft" style={{ background: 'radial-gradient(circle, #fff 0%, #DFEDDF 100%)' }}>
              <Icon name="mic" size={26} className="text-sage-strong" />
            </span>
          </button>

          {speech.listening && (
            <div className="flex items-end gap-[2px] h-6">
              {[5, 8, 12, 18, 14, 20, 16, 22, 19, 14, 10, 7, 11, 15, 9].map((h, i) => (
                <span
                  key={i}
                  className="wave-bar block w-[3px] rounded-full bg-sage-strong"
                  style={{ height: h, animationDelay: `${i * 0.06}s`, opacity: 0.45 + h / 40 }}
                />
              ))}
            </div>
          )}

          <div className="w-full bg-white rounded-card px-3.5 py-2.5 shadow-soft min-h-[44px] flex items-center justify-center">
            <p className="text-sm italic text-ink-light text-center">{transcriptContent}</p>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={() => setActiveMode('tap')}
              className="flex-1 py-2.5 rounded-full bg-white text-mute-light dark:text-mute-dark text-[11px] font-extrabold shadow-soft flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
            >
              <Icon name="sparkle" size={12} /> Switch to tap
            </button>
            <button
              onClick={sendFreeText}
              disabled={!draft.trim()}
              className="flex-1 py-2.5 rounded-full bg-sage-strong text-white text-[11px] font-extrabold shadow-soft flex items-center justify-center gap-1.5 disabled:opacity-40 active:scale-[0.98] transition"
            >
              <span className="w-2 h-2 rounded-full bg-white" /> Tap to send
            </button>
          </div>

          {privacy === 'cloud' && (
            <p className="text-[10px] text-mute-light dark:text-mute-dark font-semibold text-center leading-snug px-2">
              On this browser, speech is transcribed by Google. For on-device speech, use Safari.
            </p>
          )}
        </div>
      )}

      {isDone && (
        <div className="px-4 pt-3 pb-6 bg-surface-light/50 dark:bg-surface-dark/30 border-t border-lilac-soft dark:border-ink-light/10">
          <Button onClick={() => go('reflection', { id: s.id })}>Finish & reflect</Button>
        </div>
      )}
      {!isChoice && !isDone && !typing && (
        <div className="px-4 pt-3 pb-6 border-t border-lilac-soft dark:border-ink-light/10">
          <p className="text-xs text-center text-mute-light dark:text-mute-dark">…</p>
        </div>
      )}

      {showMicNotice && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-50" onClick={() => setShowMicNotice(false)}>
          <div className="bg-surface-light dark:bg-surface-dark rounded-t-modal p-5 w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-extrabold text-base mb-1">Quick note about the mic</h3>
            <p className="text-xs text-mute-light dark:text-mute-dark leading-relaxed mb-3">
              {privacy === 'on-device'
                ? 'Your browser handles speech-to-text on your device. Astro does not record or store audio.'
                : 'Your browser sends audio to Google for transcription as part of its built-in speech feature. Astro does not record or store audio. For on-device speech, use Safari.'}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowMicNotice(false)} className="flex-1 py-2.5 rounded-btn bg-bg-light dark:bg-bg-dark font-bold text-sm">Not now</button>
              <button onClick={acceptMicNotice} className="flex-1 py-2.5 rounded-btn bg-lilac-strong text-white font-bold text-sm">OK, got it</button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}