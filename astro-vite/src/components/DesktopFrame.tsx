import type { ReactNode } from 'react';
import { TulipMark } from './Tulip';

interface DesktopFrameProps {
  children: ReactNode;
}

export function DesktopFrame({ children }: DesktopFrameProps) {
  return (
    <div className="min-h-dvh relative flex items-center justify-center overflow-hidden lg:bg-gradient-to-br lg:from-[#F5EDFB] lg:via-[#FBF8FF] lg:to-[#E5F1FB] lg:dark:from-[#1A1730] lg:dark:via-[#121028] lg:dark:to-[#151530]">
      {/* Decorative floating orbs — desktop only */}
      <div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-60 dark:opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C9BAF5 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-50 dark:opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #A5C9E8 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full opacity-40 dark:opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #DFEDDF 0%, transparent 70%)' }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, #8E78D0 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top-left brand — desktop only */}
      <div className="hidden lg:flex fixed top-6 left-6 z-40 items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-surface-dark/80 backdrop-blur flex items-center justify-center shadow-soft">
          <TulipMark size={26} />
        </div>
        <div>
          <p className="text-base font-extrabold tracking-tight leading-none">Astro</p>
          <p className="text-[11px] text-mute-light dark:text-mute-dark font-semibold mt-0.5">A kinder way to practice.</p>
        </div>
      </div>

      {/* Right-side context card — wide screens only */}
      <div className="hidden xl:block fixed top-1/2 right-10 -translate-y-1/2 z-40 max-w-[260px]">
        <div className="bg-white/70 dark:bg-surface-dark/70 backdrop-blur rounded-card p-4 shadow-soft border border-lilac-soft/60 dark:border-transparent">
          <p className="text-xs font-extrabold text-lilac-strong dark:text-lilac-dark tracking-wide uppercase mb-1.5">Gentle pace</p>
          <p className="text-xs text-mute-light dark:text-mute-dark leading-relaxed">
            Nothing here is graded. Close it anytime. Come back when it feels right — Momo's not going anywhere.
          </p>
        </div>
        <div className="mt-3 bg-white/70 dark:bg-surface-dark/70 backdrop-blur rounded-card p-4 shadow-soft border border-lilac-soft/60 dark:border-transparent">
          <p className="text-xs font-extrabold text-sage-strong tracking-wide uppercase mb-1.5">Privacy-first</p>
          <p className="text-xs text-mute-light dark:text-mute-dark leading-relaxed">
            Audio never leaves Safari. Nothing is recorded. Delete your data anytime.
          </p>
        </div>
      </div>

      {/* The phone */}
      <div className="relative z-10">{children}</div>

    </div>
  );
}