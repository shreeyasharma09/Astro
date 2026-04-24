import { useState } from 'react';
import { Button } from '../components/Button';
import { Tulip } from '../components/Tulip';
import { Panda, type PandaMood } from '../components/Panda';
import { PageLayout } from '../components/PageLayout';

interface WelcomeProps {
  onDone: () => void;
}

interface Slide {
  hero: 'tulip' | 'panda';
  mood: PandaMood;
  title: string;
  body: string;
}

export function Welcome({ onDone }: WelcomeProps) {
  const [idx, setIdx] = useState(0);
  const slides: Slide[] = [
    { hero: 'tulip', mood: 'calm', title: 'Hey — welcome to Astro.', body: 'A gentle space to practice the situations that feel hard.' },
    { hero: 'panda', mood: 'listen', title: 'Meet Momo.', body: 'Your companion for roleplays, grounding, and small wins. Momo moves at your pace.' },
    { hero: 'panda', mood: 'cheer', title: 'Every tiny step is a win.', body: 'Nothing here is graded. Just take the next small step.' },
  ];
  const slide = slides[idx];

  return (
    <PageLayout
      header={
        <>
          {slide.hero === 'tulip' ? <Tulip size={170} /> : <Panda mood={slide.mood} size={160} />}
          <h2 className="text-2xl font-extrabold">{slide.title}</h2>
          <p className="text-mute-light dark:text-mute-dark text-base leading-relaxed">{slide.body}</p>
        </>
      }
      actions={
        <>
          <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-lilac-strong' : 'w-1.5 bg-lilac-soft'}`} />
            ))}
          </div>
          <Button onClick={() => (idx < slides.length - 1 ? setIdx(idx + 1) : onDone())}>
            {idx < slides.length - 1 ? 'Next' : "Let's go"}
          </Button>
        </>
      }
    />
  );
}