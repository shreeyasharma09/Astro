  const { useState, useEffect, useMemo, useRef } = React;

  // ---------- Icons (minimal inline SVG set) ----------
  const Icon = ({ name, size = 22, className = '' }) => {
    const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className };
    const paths = {
      home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></>,
      sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6 8.4 8.4M15.6 15.6l2.8 2.8M5.6 18.4 8.4 15.6M15.6 8.4l2.8-2.8"/></>,
      bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
      book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
      user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></>,
      chevronLeft: <><path d="M15 18l-6-6 6-6"/></>,
      chevronRight: <><path d="M9 6l6 6-6 6"/></>,
      x: <><path d="M6 6l12 12M18 6L6 18"/></>,
      check: <><path d="M5 12l5 5L20 7"/></>,
      send: <><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></>,
      clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
      heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.5l-1-.9a5.5 5.5 0 1 0-7.8 7.8l1 .9L12 21l7.8-7.7 1-.9a5.5 5.5 0 0 0 0-7.8z"/></>,
      moon: <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
      sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
      arrowRight: <><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>,
      plus: <><path d="M12 5v14M5 12h14"/></>,
      phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.2z"/></>,
      shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
      settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
      wind: <><path d="M9.6 8a3 3 0 1 1 2.5 4.5H2"/><path d="M12 19.5a3 3 0 1 0 2.5-4.5H2"/><path d="M17.7 4.5a3.5 3.5 0 1 1 2.8 5H2"/></>,
      trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></>,
      lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>
    };
    return <svg {...common}>{paths[name]}</svg>;
  };

  // ---------- Momo the Panda (companion mascot) ----------
  // Closed-eye by default; emotion via mouth + cheek intensity.
  const Panda = ({ mood = 'calm', size = 120, className = '' }) => {
    const cheek = {
      calm:      { size: 7,   opacity: 0.75, color: '#F2B5B5' },
      cheer:     { size: 7.5, opacity: 0.85, color: '#EFB0BD' },
      listen:    { size: 7,   opacity: 0.75, color: '#F2B5B5' },
      concern:   { size: 6,   opacity: 0.55, color: '#F2B5B5' },
      sleep:     { size: 7,   opacity: 0.70, color: '#F2B5B5' },
      breathing: { size: 7,   opacity: 0.70, color: '#F2B5B5' }
    }[mood] || { size: 7, opacity: 0.75, color: '#F2B5B5' };

    const renderMouth = () => {
      switch (mood) {
        case 'cheer':
          return <path d="M43 66 Q50 72 57 66" stroke="#1A1826" strokeWidth="2" fill="none" strokeLinecap="round"/>;
        case 'concern':
          return <path d="M46 69 Q50 68 54 69" stroke="#1A1826" strokeWidth="1.8" fill="none" strokeLinecap="round"/>;
        case 'breathing':
          return <ellipse cx="50" cy="69" rx="2.2" ry="1.8" fill="#1A1826" opacity="0.75"/>;
        default:
          return <path d="M45 67 Q50 70 55 67" stroke="#1A1826" strokeWidth="1.8" fill="none" strokeLinecap="round"/>;
      }
    };

    const renderBrows = () => {
      if (mood !== 'concern') return null;
      return (
        <>
          <path d="M33 44 Q37 43 41 45" stroke="#1A1826" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M59 45 Q63 43 67 44" stroke="#1A1826" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </>
      );
    };

    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
        <defs>
          <radialGradient id="haloMomo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#E8E0FB" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#E8E0FB" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="bodyMomo" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#F5F0FC"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#haloMomo)"/>
        {/* ears */}
        <circle cx="26" cy="28" r="11" fill="#1A1826"/>
        <circle cx="74" cy="28" r="11" fill="#1A1826"/>
        <circle cx="26" cy="28" r="5.5" fill="#F2B5B5" opacity="0.55"/>
        <circle cx="74" cy="28" r="5.5" fill="#F2B5B5" opacity="0.55"/>
        {/* body + paws */}
        <ellipse cx="50" cy="88" rx="22" ry="10" fill="url(#bodyMomo)"/>
        <ellipse cx="33" cy="90" rx="5" ry="3.5" fill="#1A1826"/>
        <ellipse cx="67" cy="90" rx="5" ry="3.5" fill="#1A1826"/>
        {/* head */}
        <circle cx="50" cy="52" r="32" fill="url(#bodyMomo)"/>
        {/* cheeks */}
        <ellipse cx="28" cy="58" rx={cheek.size} ry={cheek.size * 0.65} fill={cheek.color} opacity={cheek.opacity}/>
        <ellipse cx="72" cy="58" rx={cheek.size} ry={cheek.size * 0.65} fill={cheek.color} opacity={cheek.opacity}/>
        {/* closed crescent eyes */}
        <path d="M33 52 Q38 46 43 52" stroke="#1A1826" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M57 52 Q62 46 67 52" stroke="#1A1826" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        {renderBrows()}
        {/* nose */}
        <ellipse cx="50" cy="62" rx="2" ry="1.4" fill="#1A1826"/>
        {/* mouth */}
        {renderMouth()}
        {/* sage leaf accent on ear */}
        <path d="M80 18 Q86 14 90 20 Q85 24 80 22 Z" fill="#A8C9A8"/>
      </svg>
    );
  };

  // ---------- Astro Tulip (brand mark) ----------
  // Closed-eye tulip used for brand identity, app icon, splash.
  const Tulip = ({ size = 120, className = '', showLeaves = true, showStem = true, showFace = true }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tulipPinkMain" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FBC9D6"/>
          <stop offset="100%" stopColor="#ED8FA3"/>
        </linearGradient>
        <linearGradient id="tulipLeafMain" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A8C9A8"/>
          <stop offset="100%" stopColor="#7AA67A"/>
        </linearGradient>
      </defs>
      {showLeaves && (
        <>
          <path d="M 50 74 Q 30 72 20 82 Q 22 90 34 88 Q 46 84 50 82 Z"
                fill="url(#tulipLeafMain)" stroke="#2D2A3E" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M 26 83 Q 38 83 46 81"
                stroke="#2D2A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
          <path d="M 50 74 Q 70 72 80 82 Q 78 90 66 88 Q 54 84 50 82 Z"
                fill="url(#tulipLeafMain)" stroke="#2D2A3E" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M 74 83 Q 62 83 54 81"
                stroke="#2D2A3E" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
        </>
      )}
      {showStem && (
        <path d="M 50 66 L 50 92" stroke="#8B5E3C" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      )}
      {/* bloom */}
      <path d="M 26 50
               Q 22 28 32 22
               Q 38 18 42 26
               Q 46 18 50 17
               Q 54 18 58 26
               Q 62 18 68 22
               Q 78 28 74 50
               Q 72 64 50 66
               Q 28 64 26 50 Z"
            fill="url(#tulipPinkMain)" stroke="#2D2A3E" strokeWidth="2.2" strokeLinejoin="round"/>
      {showFace && (
        <>
          {/* closed crescent eyes */}
          <path d="M 40 41 Q 43 37 46 41" stroke="#2D2A3E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M 54 41 Q 57 37 60 41" stroke="#2D2A3E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* cheeks */}
          <ellipse cx="38" cy="48" rx="3" ry="1.8" fill="#E87A92" opacity="0.55"/>
          <ellipse cx="62" cy="48" rx="3" ry="1.8" fill="#E87A92" opacity="0.55"/>
          {/* smile */}
          <path d="M 46 47 Q 50 51 54 47" stroke="#2D2A3E" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );

  // Icon-sized Tulip (16-32pt) — drops leaves and stem
  const TulipMark = ({ size = 24, className = '' }) => (
    <Tulip size={size} className={className} showLeaves={false} showStem={false}/>
  );

  // ---------- Scenarios ----------
  const SCENARIOS = [
    { id: 'coffee', title: 'Ordering Coffee at a Counter', short: 'Ordering coffee', difficulty: 1, category: 'Food & Drink', emoji: '☕',
      summary: 'Stating a clear order, handling a small interruption, thanking the person.',
      character: 'Friendly but slightly busy barista.',
      opener: "Hi there, welcome in! What can I get started for you today?" },
    { id: 'directions', title: 'Asking a Stranger for Directions', short: 'Asking for directions', difficulty: 1, category: 'Out & About', emoji: '🧭',
      summary: 'Opening with a polite excuse-me, stating the ask, thanking and exiting.',
      character: 'Passerby, polite, in a mild hurry.',
      opener: "Oh — hi, yeah, what's up?" },
    { id: 'menu', title: 'Asking a Server About the Menu', short: 'Menu questions', difficulty: 2, category: 'Food & Drink', emoji: '🍽️',
      summary: 'Asking about ingredients or swaps without over-apologizing.',
      character: 'Attentive server.',
      opener: "Hi! Are you ready to order, or do you have questions about the menu?" },
    { id: 'phone-appt', title: 'Calling to Book an Appointment', short: 'Phone call: appointment', difficulty: 2, category: 'Phone Calls', emoji: '📞',
      summary: 'Stating your reason, giving info, handling being put on hold.',
      character: 'Clinic receptionist.',
      opener: "Good morning, Dr. Patel's office, this is Marie. How can I help you?" },
    { id: 'return', title: 'Returning an Item to a Store', short: 'Returning an item', difficulty: 3, category: 'Out & About', emoji: '🛍️',
      summary: 'Explaining the return calmly, handling a "let me check with my manager".',
      character: 'Customer service associate, neutral.',
      opener: "Hi, were you looking to return something?" },
    { id: 'professor', title: 'Asking a Professor After Class', short: 'Question for a professor', difficulty: 3, category: 'School & Work', emoji: '🎓',
      summary: 'Framing a specific question, admitting what you don\'t understand.',
      character: 'Professor, friendly, finishing up notes.',
      opener: "Hey — did you have a question? I've got a minute before my next thing." },
    { id: 'smalltalk', title: 'Small Talk with a Classmate', short: 'Small talk', difficulty: 3, category: 'School & Work', emoji: '💬',
      summary: 'Returning a question, picking up a conversational thread, ending warmly.',
      character: 'Classmate, approachable.',
      opener: "Oh hey — how's your week going?" },
    { id: 'party', title: 'Joining a Group Conversation at a Party', short: 'Joining a group', difficulty: 4, category: 'Social Events', emoji: '🎉',
      summary: 'Waiting for a pause, a brief intro, a light on-topic comment.',
      character: 'Two friends mid-conversation.',
      opener: "[They're talking about a show they both watched. You approach.]" },
    { id: 'meeting', title: 'Speaking Up in a Group Meeting', short: 'Speaking up in a group', difficulty: 4, category: 'School & Work', emoji: '👥',
      summary: 'Verbal entry, stating a view briefly, holding it under gentle pushback.',
      character: 'Group members discussing plans.',
      opener: "[The group has just suggested splitting the project a certain way.]" },
    { id: 'decline', title: 'Declining an Invitation Kindly', short: 'Saying no to plans', difficulty: 5, category: 'Social Events', emoji: '🫶',
      summary: 'Saying no once clearly, keeping warmth, resisting over-apology.',
      character: 'Close friend, a bit persistent.',
      opener: "Heyyy — a bunch of us are going out Friday. You're in, right?" }
  ];

  // ---------- Demo roleplay flow (one scenario fully scripted) ----------
  const DEMO_TURNS = {
    coffee: [
      { role: 'assistant', text: "Hi there, welcome in! What can I get started for you today?" },
      { choices: [
        { id: 'a', text: "Hi! Could I get a medium oat milk latte please?" },
        { id: 'b', text: "Um, sorry, I'm not ready yet." },
        { id: 'c', text: "Hi, what do you recommend?" }
      ]},
      { role: 'assistant', text: "A medium oat latte, coming right up. Anything else with that?" },
      { choices: [
        { id: 'a', text: "No thanks, that's it." },
        { id: 'b', text: "Actually, could I add a small blueberry muffin?" }
      ]},
      { role: 'assistant', text: "Perfect — that'll be $6.75. Can I get a name for the order?" },
      { choices: [
        { id: 'a', text: "Sure, it's Alex." },
        { id: 'b', text: "Oh, uh — Alex. Sorry!" }
      ]},
      { role: 'assistant', text: "Thanks Alex! I'll call you when it's ready." },
      { role: 'system', text: "Nice work. That's a full interaction — you handled it well." }
    ]
  };

  // ---------- Shared UI ----------
  const Container = ({ children, className = '' }) => (
    <div className={`device-frame bg-bg-light dark:bg-bg-dark text-ink-light dark:text-ink-dark flex flex-col ${className}`}>
      {children}
    </div>
  );

  const Screen = ({ children, className = '' }) => (
    <div className={`flex-1 overflow-y-auto no-scrollbar fade-enter ${className}`}>
      {children}
    </div>
  );

  const TopBar = ({ title, onBack, right }) => (
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <button
        onClick={onBack}
        className={`w-9 h-9 rounded-full flex items-center justify-center ${onBack ? 'bg-surface-light dark:bg-surface-dark shadow-soft' : 'opacity-0 pointer-events-none'}`}
        aria-label="Back"
      >
        <Icon name="chevronLeft" />
      </button>
      <h1 className="text-base font-bold">{title}</h1>
      <div className="w-9 h-9 flex items-center justify-center">{right}</div>
    </div>
  );

  const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, full = true }) => {
    const base = 'rounded-btn font-bold text-base py-4 px-5 transition active:scale-[0.98] disabled:opacity-50';
    const styles = {
      primary: 'bg-lilac-strong text-white',
      secondary: 'bg-lilac-soft text-lilac-strong dark:bg-lilac/20 dark:text-lilac-dark',
      ghost: 'bg-transparent text-ink-light dark:text-ink-dark',
      danger: 'bg-crisis text-white'
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${styles[variant]} ${full ? 'w-full' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = '', onClick }) => (
    <div
      onClick={onClick}
      className={`bg-surface-light dark:bg-surface-dark rounded-card shadow-soft dark:shadow-soft-dark p-4 ${onClick ? 'cursor-pointer active:scale-[0.99] transition' : ''} ${className}`}
    >
      {children}
    </div>
  );

  const DifficultyDot = ({ level }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i <= level ? 'bg-lilac' : 'bg-lilac-soft dark:bg-lilac/20'}`} />
      ))}
    </div>
  );

  const BottomNav = ({ current, onChange }) => {
    const items = [
      { id: 'home', icon: 'home', label: 'Home' },
      { id: 'practice', icon: 'sparkle', label: 'Practice' },
      { id: 'reminders', icon: 'bell', label: 'Reminders' },
      { id: 'journal', icon: 'book', label: 'Journal' },
      { id: 'me', icon: 'user', label: 'Me' }
    ];
    return (
      <div className="bg-surface-light dark:bg-surface-dark border-t border-lilac-soft dark:border-ink-light/10 px-2 pt-2 pb-5 flex justify-around">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${current === it.id ? 'text-lilac-strong dark:text-lilac-dark' : 'text-mute-light dark:text-mute-dark'}`}
          >
            <Icon name={it.icon} size={22}/>
            <span className="text-[10px] font-semibold">{it.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Sticky "I'm not okay" button
  const CrisisChip = ({ onClick }) => (
    <button
      onClick={onClick}
      className="fixed sm:absolute bottom-24 right-4 z-30 bg-coral/90 text-ink-light rounded-full pl-3 pr-4 py-2 shadow-soft flex items-center gap-2 text-xs font-bold"
      style={{ bottom: 96 }}
    >
      <Icon name="heart" size={16}/> I'm not okay
    </button>
  );

  // ==============================================================
  //  SCREENS
  // ==============================================================

