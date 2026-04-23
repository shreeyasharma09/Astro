  // ---------- Splash ----------
  const Splash = ({ onNext }) => (
    <Screen className="flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="pulse-slow"><Tulip size={180}/></div>
      <div>
        <h1 className="text-3xl font-extrabold text-ink-light dark:text-ink-dark">Astro</h1>
        <p className="text-mute-light dark:text-mute-dark mt-1 text-sm">A kinder way to practice.</p>
      </div>
      <div className="w-full mt-6"><Button onClick={onNext}>Get started</Button></div>
    </Screen>
  );

  // ---------- Welcome slides ----------
  const Welcome = ({ onDone }) => {
    const [idx, setIdx] = useState(0);
    const slides = [
      { hero: 'tulip',  mood: 'calm',  title: "Hey — welcome to Astro.", body: "A gentle space to practice the situations that feel hard." },
      { hero: 'panda',  mood: 'listen', title: "Meet Momo.", body: "Your companion for roleplays, grounding, and small wins. Momo moves at your pace." },
      { hero: 'panda',  mood: 'cheer', title: "Every tiny step is a win.", body: "Nothing here is graded. Just take the next small step." }
    ];
    const slide = slides[idx];
    return (
      <Screen className="flex flex-col items-center justify-between px-8 pt-12 pb-8 text-center">
        <div className="flex flex-col items-center gap-6 mt-8">
          {slide.hero === 'tulip'
            ? <Tulip size={170}/>
            : <Panda mood={slide.mood} size={160} />}
          <h2 className="text-2xl font-extrabold">{slide.title}</h2>
          <p className="text-mute-light dark:text-mute-dark text-base leading-relaxed">{slide.body}</p>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-lilac-strong' : 'w-1.5 bg-lilac-soft'}`} />
            ))}
          </div>
          <Button onClick={() => idx < slides.length - 1 ? setIdx(idx + 1) : onDone()}>
            {idx < slides.length - 1 ? 'Next' : "Let's go"}
          </Button>
        </div>
      </Screen>
    );
  };

  // ---------- Account choice ----------
  const AccountChoice = ({ onGuest }) => {
    const [mode, setMode] = useState('choose'); // 'choose' | 'email' | 'sent'
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const sendMagicLink = async () => {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email.');
        return;
      }
      setSubmitting(true);
      setError('');
      try {
        await signInWithMagicLink(email);
        setMode('sent');
      } catch (e) {
        setError(e.message || 'Something went wrong. Try again?');
      } finally {
        setSubmitting(false);
      }
    };

    if (mode === 'sent') {
      return (
        <Screen className="flex flex-col px-6 pt-10 pb-8 text-center">
          <div className="flex flex-col items-center gap-4 mt-8">
            <Panda mood="cheer" size={130}/>
            <h2 className="text-2xl font-extrabold">Check your email</h2>
            <p className="text-mute-light dark:text-mute-dark text-sm leading-relaxed">
              We sent a sign-in link to <strong>{email}</strong>. Tap the link to come back signed in. No password needed.
            </p>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="secondary" onClick={() => { setMode('choose'); setEmail(''); }}>Use a different email</Button>
            <Button variant="ghost" onClick={onGuest}>Continue as guest for now</Button>
          </div>
        </Screen>
      );
    }

    if (mode === 'email') {
      return (
        <Screen className="flex flex-col px-6 pt-10 pb-8">
          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <Panda mood="listen" size={110}/>
            <h2 className="text-2xl font-extrabold">What's your email?</h2>
            <p className="text-mute-light dark:text-mute-dark text-sm">We'll send you a sign-in link. No password to remember.</p>
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="p-4 rounded-btn bg-surface-light dark:bg-surface-dark outline-none text-base focus:ring-2 focus:ring-lilac"
          />
          {error && <p className="text-crisis text-sm mt-2">{error}</p>}
          <div className="mt-auto flex flex-col gap-3">
            <Button onClick={sendMagicLink} disabled={submitting}>
              {submitting ? 'Sending…' : 'Send sign-in link'}
            </Button>
            <button onClick={() => setMode('choose')} className="text-sm text-mute-light dark:text-mute-dark py-2 font-semibold">
              Back
            </button>
          </div>
        </Screen>
      );
    }

    return (
      <Screen className="flex flex-col px-6 pt-10 pb-8">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <Panda mood="calm" size={110}/>
          <h2 className="text-2xl font-extrabold">How would you like to start?</h2>
          <p className="text-mute-light dark:text-mute-dark text-sm">You can always change this later.</p>
        </div>
        <div className="flex flex-col gap-3 mt-auto">
          <Button onClick={onGuest}>Continue as guest</Button>
          <Button variant="secondary" onClick={() => setMode('email')}>Sign up with email</Button>
          <button onClick={() => setMode('email')} className="text-sm text-mute-light dark:text-mute-dark py-2 font-semibold">Already have an account? Sign in</button>
        </div>
      </Screen>
    );
  };

  const GuestConfirm = ({ onContinue, onBack }) => (
    <Container>
      <TopBar onBack={onBack}/>
      <Screen className="flex flex-col items-center text-center px-6 gap-5">
        <Panda mood="listen" size={130}/>
        <h2 className="text-2xl font-extrabold">Guest mode — you're good to go.</h2>
        <p className="text-mute-light dark:text-mute-dark text-base leading-relaxed">
          Your practice and journal stay on this device. You can make an account anytime to back things up — no pressure.
        </p>
        <div className="bg-lilac-soft dark:bg-lilac/10 p-4 rounded-card text-sm w-full text-left flex gap-3 items-start">
          <div className="mt-0.5"><Icon name="lock" size={18}/></div>
          <p>Nothing you type here is shared with anyone. Only you see your journal.</p>
        </div>
        <div className="w-full mt-auto"><Button onClick={onContinue}>Continue</Button></div>
      </Screen>
    </Container>
  );

  // ---------- Onboarding ----------
  const Onboarding = ({ onDone }) => {
    const [step, setStep] = useState(0);
    const [age, setAge] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [reminderPref, setReminderPref] = useState('balanced');

    const toggle = (id) => {
      const s = new Set(selected);
      s.has(id) ? s.delete(id) : s.add(id);
      setSelected(s);
    };

    const ageOptions = ['13–17', '18–24', '25–34', '35 or older', 'Prefer not to say'];
    const remOptions = [
      { id: 'gentle', title: 'Gentle', body: 'One nudge the day of.' },
      { id: 'balanced', title: 'Balanced', body: 'A day before, an hour before, and after.' },
      { id: 'full', title: 'Full support', body: 'Extra check-ins through the day.' }
    ];

    return (
      <Container>
        <TopBar
          title={`Step ${step + 1} of 3`}
          onBack={step > 0 ? () => setStep(step - 1) : undefined}
        />
        <Screen className="px-6 pb-6 flex flex-col gap-5">
          {step === 0 && (
            <>
              <h2 className="text-2xl font-extrabold mt-2">Which age range fits you?</h2>
              <p className="text-mute-light dark:text-mute-dark text-sm">This just helps us suggest the right scenarios.</p>
              <div className="flex flex-col gap-2 mt-2">
                {ageOptions.map(a => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`text-left p-4 rounded-card border-2 font-semibold transition ${age === a ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-4"><Button disabled={!age} onClick={() => setStep(1)}>Next</Button></div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-extrabold mt-2">What feels hardest right now?</h2>
              <p className="text-mute-light dark:text-mute-dark text-sm">Pick as many as apply. We'll start your library here.</p>
              <div className="flex flex-col gap-2 mt-2">
                {SCENARIOS.map(s => {
                  const on = selected.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      className={`text-left p-4 rounded-card border-2 flex items-center gap-3 transition ${on ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                    >
                      <span className="text-2xl">{s.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{s.short}</p>
                        <p className="text-xs text-mute-light dark:text-mute-dark">{s.category}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${on ? 'bg-lilac-strong text-white' : 'bg-lilac-soft dark:bg-ink-light/10'}`}>
                        {on && <Icon name="check" size={14}/>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 sticky bottom-0 bg-bg-light dark:bg-bg-dark">
                <Button onClick={() => setStep(2)}>{selected.size === 0 ? 'Skip for now' : `Next (${selected.size} selected)`}</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold mt-2">How should reminders feel?</h2>
              <p className="text-mute-light dark:text-mute-dark text-sm">We'll ping you before and after real situations you schedule.</p>
              <div className="flex flex-col gap-2 mt-2">
                {remOptions.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setReminderPref(r.id)}
                    className={`text-left p-4 rounded-card border-2 transition ${reminderPref === r.id ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                  >
                    <p className="font-bold">{r.title}</p>
                    <p className="text-sm text-mute-light dark:text-mute-dark">{r.body}</p>
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-4"><Button onClick={onDone}>All set — take me in</Button></div>
            </>
          )}
        </Screen>
      </Container>
    );
  };

  // ---------- Home ----------
  const Home = ({ go, nav, setNav, onCrisis }) => {
    const suggested = SCENARIOS[0];
    const [mood, setMood] = useState(null);
    return (
      <Container>
        <div className="flex items-center justify-between px-5 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <TulipMark size={28}/>
            <span className="font-extrabold text-lg tracking-tight">Astro</span>
          </div>
          <button onClick={() => go('settings')} className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center shadow-soft">
            <Icon name="settings" size={18}/>
          </button>
        </div>
        <div className="px-5 pb-2">
          <p className="text-xs text-mute-light dark:text-mute-dark">Wednesday, April 22</p>
          <h1 className="text-2xl font-extrabold">Hi, friend 🌿</h1>
        </div>

        <Screen className="px-5 pb-4 flex flex-col gap-4">
          {/* mascot + greeting card */}
          <Card className="bg-gradient-to-br from-lilac-soft to-sky-soft dark:from-lilac/10 dark:to-sky/10 flex items-center gap-3">
            <Panda mood="calm" size={72}/>
            <div className="flex-1">
              <p className="font-bold">No pressure today.</p>
              <p className="text-sm text-mute-light dark:text-mute-dark">Just looking around is a win.</p>
            </div>
          </Card>

          {/* Mood check-in */}
          <div>
            <p className="font-bold mb-2">How's right now feeling?</p>
            <div className="grid grid-cols-5 gap-2">
              {['😣','😟','😐','🙂','😌'].map((e, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={`aspect-square rounded-card text-2xl flex items-center justify-center transition ${mood === i ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Suggested practice */}
          <div>
            <p className="font-bold mb-2">Suggested for today</p>
            <Card onClick={() => go('scenario', { id: suggested.id })} className="flex items-center gap-3">
              <div className="text-3xl">{suggested.emoji}</div>
              <div className="flex-1">
                <p className="font-bold">{suggested.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <DifficultyDot level={suggested.difficulty}/>
                  <p className="text-xs text-mute-light dark:text-mute-dark">{suggested.category}</p>
                </div>
              </div>
              <Icon name="chevronRight"/>
            </Card>
          </div>

          {/* Upcoming reminder */}
          <div>
            <p className="font-bold mb-2">Coming up</p>
            <Card onClick={() => setNav('reminders')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-soft dark:bg-sage/20 flex items-center justify-center text-sage-strong dark:text-sage-dark">
                <Icon name="clock" size={18}/>
              </div>
              <div className="flex-1">
                <p className="font-bold">Dinner with friends</p>
                <p className="text-xs text-mute-light dark:text-mute-dark">Friday, 7:00 PM</p>
              </div>
              <Icon name="chevronRight"/>
            </Card>
          </div>

          {/* quick actions */}
          <div>
            <p className="font-bold mb-2">Quick help</p>
            <div className="grid grid-cols-2 gap-3">
              <Card onClick={() => go('breathing')} className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-sky-soft dark:bg-sky/20 flex items-center justify-center text-sky-strong dark:text-sky-dark"><Icon name="wind" size={18}/></div>
                <p className="font-bold">Grounding</p>
                <p className="text-xs text-mute-light dark:text-mute-dark">60-second exercise</p>
              </Card>
              <Card onClick={() => setNav('journal')} className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-lilac-soft dark:bg-lilac/20 flex items-center justify-center text-lilac-strong dark:text-lilac-dark"><Icon name="book" size={18}/></div>
                <p className="font-bold">Wins journal</p>
                <p className="text-xs text-mute-light dark:text-mute-dark">Note one thing.</p>
              </Card>
            </div>
          </div>
        </Screen>

        <CrisisChip onClick={onCrisis}/>
        <BottomNav current={nav} onChange={setNav}/>
      </Container>
    );
  };

  // ---------- Practice (scenarios list) ----------
  const Practice = ({ go, nav, setNav, onCrisis }) => {
    const [filter, setFilter] = useState('All');
    const cats = ['All', ...Array.from(new Set(SCENARIOS.map(s => s.category)))];
    const list = filter === 'All' ? SCENARIOS : SCENARIOS.filter(s => s.category === filter);
    return (
      <Container>
        <TopBar title="Practice" right={<Icon name="sparkle" size={18}/>}/>
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${filter === c ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark text-mute-light dark:text-mute-dark'}`}
            >{c}</button>
          ))}
        </div>
        <Screen className="px-5 pb-4 flex flex-col gap-3">
          {list.map(s => (
            <Card key={s.id} onClick={() => go('scenario', { id: s.id })} className="flex items-center gap-3">
              <div className="text-3xl">{s.emoji}</div>
              <div className="flex-1">
                <p className="font-bold">{s.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <DifficultyDot level={s.difficulty}/>
                  <p className="text-xs text-mute-light dark:text-mute-dark">{s.category}</p>
                </div>
              </div>
              <Icon name="chevronRight"/>
            </Card>
          ))}
        </Screen>
        <CrisisChip onClick={onCrisis}/>
        <BottomNav current={nav} onChange={setNav}/>
      </Container>
    );
  };

  // ---------- Scenario detail ----------
  const ScenarioDetail = ({ id, onBack, go }) => {
    const s = SCENARIOS.find(x => x.id === id) || SCENARIOS[0];
    return (
      <Container>
        <TopBar onBack={onBack}/>
        <Screen className="px-6 pb-6 flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-5xl">{s.emoji}</div>
            <h2 className="text-2xl font-extrabold">{s.title}</h2>
            <div className="flex items-center gap-2">
              <DifficultyDot level={s.difficulty}/>
              <span className="text-xs text-mute-light dark:text-mute-dark">{s.category}</span>
            </div>
          </div>
          <Card>
            <p className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase tracking-wide mb-1">You'll practice</p>
            <p className="text-sm leading-relaxed">{s.summary}</p>
          </Card>
          <Card>
            <p className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase tracking-wide mb-1">Who you'll meet</p>
            <p className="text-sm leading-relaxed">{s.character}</p>
          </Card>
          {s.id === 'coffee' && (
            <Card className="bg-sage-soft dark:bg-sage/10">
              <p className="text-sm">💡 This one's our walkthrough demo — the full roleplay is clickable end-to-end.</p>
            </Card>
          )}
          <div className="mt-auto">
            <Button onClick={() => go('prep', { id: s.id })}>Start prep</Button>
          </div>
        </Screen>
      </Container>
    );
  };

  // ---------- Prep flow ----------
  const Prep = ({ id, onBack, go }) => {
    const s = SCENARIOS.find(x => x.id === id) || SCENARIOS[0];
    const [step, setStep] = useState(0);
    const [breath, setBreath] = useState('in');
    const [preRating, setPreRating] = useState(null);

    useEffect(() => {
      if (step !== 0) return;
      const t = setInterval(() => setBreath(b => b === 'in' ? 'hold' : b === 'hold' ? 'out' : 'in'), 3000);
      return () => clearInterval(t);
    }, [step]);

    const nextStep = () => step < 2 ? setStep(step + 1) : go('roleplay', { id: s.id });
    return (
      <Container>
        <TopBar title={`Prep · Step ${step + 1}/3`} onBack={step > 0 ? () => setStep(step - 1) : onBack}/>
        <Screen className="px-6 pb-6 flex flex-col gap-5">
          {step === 0 && (
            <div className="flex flex-col items-center text-center gap-4 flex-1 justify-center">
              <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">Ground yourself</p>
              <h2 className="text-2xl font-extrabold">Let's breathe for a moment.</h2>
              <div className="relative flex items-center justify-center h-48 w-48">
                <div className={`absolute rounded-full bg-lilac-soft transition-all duration-[3000ms] ${breath === 'in' ? 'w-44 h-44' : breath === 'hold' ? 'w-44 h-44' : 'w-24 h-24'}`}/>
                <p className="relative font-bold text-lg capitalize">
                  {breath === 'in' ? 'Breathe in' : breath === 'hold' ? 'Hold' : 'Breathe out'}
                </p>
              </div>
              <p className="text-sm text-mute-light dark:text-mute-dark">Three rounds is plenty. No rush.</p>
              <div className="w-full mt-4"><Button onClick={nextStep}>I'm ready</Button></div>
            </div>
          )}
          {step === 1 && (
            <>
              <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">A small script</p>
              <h2 className="text-2xl font-extrabold">Here's a starting line.</h2>
              <Card className="bg-lilac-soft dark:bg-lilac/10">
                <p className="font-bold text-lg">"{getScript(s.id)}"</p>
              </Card>
              <p className="text-sm text-mute-light dark:text-mute-dark">You don't have to say it word-for-word. It's a starting point.</p>
              <div className="mt-auto"><Button onClick={nextStep}>Next</Button></div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-xs uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark">Check in</p>
              <h2 className="text-2xl font-extrabold">How anxious does this feel right now?</h2>
              <p className="text-sm text-mute-light dark:text-mute-dark">1 is calm, 10 is overwhelming.</p>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    onClick={() => setPreRating(n)}
                    className={`aspect-square rounded-card font-bold text-lg transition ${preRating === n ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
                  >{n}</button>
                ))}
              </div>
              <div className="mt-auto"><Button disabled={preRating === null} onClick={nextStep}>Start roleplay</Button></div>
            </>
          )}
        </Screen>
      </Container>
    );
  };
  function getScript(id) {
    const scripts = {
      coffee: "Hi, could I get a medium oat latte please?",
      directions: "Excuse me — sorry to bother you, do you know how to get to the library?",
      menu: "Hi! Sorry, quick question — is the pasta dairy-free?",
      'phone-appt': "Hi, I'm calling to book a new patient appointment.",
      return: "Hi, I'd like to return this — it didn't quite work out.",
      professor: "Hey Professor — do you have a minute? I had a quick question about today's lecture.",
      smalltalk: "Hey! Pretty good. How about you?",
      party: "Hey, mind if I jump in? I love that show too.",
      meeting: "Can I add something? I'd suggest we split it a bit differently.",
      decline: "That sounds fun! I'm gonna sit this one out — have the best time."
    };
    return scripts[id] || "Let's give it a try.";
  }

  // ---------- Roleplay ----------
  const Roleplay = ({ id, onBack, go }) => {
    const s = SCENARIOS.find(x => x.id === id) || SCENARIOS[0];
    const turns = DEMO_TURNS[id] || [
      { role: 'assistant', text: s.opener },
      { choices: [
        { id: 'a', text: '(type your response in the full app)' }
      ]},
      { role: 'system', text: "This scenario is available as a full demo in scenario #1 (Coffee). The others will open up with LLM-powered replies in the real build." }
    ];
    const [cursor, setCursor] = useState(0);
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
      // push next AI/system message if at one
      const step = turns[cursor];
      if (!step) return;
      if (step.role === 'assistant' || step.role === 'system') {
        setTyping(true);
        const t = setTimeout(() => {
          setMessages(m => [...m, step]);
          setTyping(false);
          setCursor(c => c + 1);
        }, 900);
        return () => clearTimeout(t);
      }
    }, [cursor]);

    useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, typing]);

    const current = turns[cursor];
    const isChoice = current && current.choices;
    const isDone = !current;

    const pickChoice = (c) => {
      setMessages(m => [...m, { role: 'user', text: c.text }]);
      setCursor(x => x + 1);
    };

    return (
      <Container>
        <div className="flex items-center justify-between px-5 pt-6 pb-3 border-b border-lilac-soft dark:border-ink-light/10">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-light dark:bg-surface-dark shadow-soft"><Icon name="chevronLeft"/></button>
          <div className="flex items-center gap-2">
            <div className="text-2xl">{s.emoji}</div>
            <div className="text-center">
              <p className="text-sm font-bold">{s.short}</p>
              <p className="text-[10px] text-mute-light dark:text-mute-dark">{s.character}</p>
            </div>
          </div>
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-light dark:bg-surface-dark shadow-soft"><Icon name="x" size={18}/></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
          {messages.map((m, i) => {
            if (m.role === 'system') return (
              <div key={i} className="self-center bg-sage-soft dark:bg-sage/20 text-sage-strong dark:text-sage-dark text-sm font-semibold px-4 py-2 rounded-full">{m.text}</div>
            );
            const mine = m.role === 'user';
            return (
              <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
                {!mine && <Panda mood="listen" size={32}/>}
                <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${mine ? 'bg-lilac-strong text-white rounded-br-sm' : 'bg-surface-light dark:bg-surface-dark rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex items-end gap-2">
              <Panda mood="listen" size={32}/>
              <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark"/>
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark"/>
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-mute-light dark:bg-mute-dark"/>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pt-2 pb-5 bg-surface-light/50 dark:bg-surface-dark/30 border-t border-lilac-soft dark:border-ink-light/10">
          {isChoice && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-wide font-bold text-mute-light dark:text-mute-dark px-1">Tap a reply to continue</p>
              {current.choices.map(c => (
                <button
                  key={c.id}
                  onClick={() => pickChoice(c)}
                  className="text-left p-3 rounded-card bg-lilac-soft dark:bg-lilac/10 text-sm font-semibold active:scale-[0.99]"
                >{c.text}</button>
              ))}
            </div>
          )}
          {isDone && (
            <Button onClick={() => go('reflection', { id: s.id })}>Finish & reflect</Button>
          )}
          {!isChoice && !isDone && !typing && (
            <p className="text-xs text-center text-mute-light dark:text-mute-dark">…</p>
          )}
        </div>
      </Container>
    );
  };

  // ---------- Reflection ----------
  const Reflection = ({ id, onDone }) => {
    const [postRating, setPostRating] = useState(null);
    const [win, setWin] = useState('');
    const [saving, setSaving] = useState(false);
    const s = SCENARIOS.find(x => x.id === id) || SCENARIOS[0];

    const handleSave = async () => {
      setSaving(true);
      try {
        const session = await storage.saveSession({
          scenario_id: s.id,
          post_anxiety: postRating,
          ended_at: new Date().toISOString(),
          completed: true
        });
        if (win.trim()) {
          await storage.saveJournal({
            title: `I practiced: ${s.short}`,
            body: win.trim(),
            tag: s.short,
            session_id: session?.id || null
          });
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
        <TopBar title="Reflection"/>
        <Screen className="px-6 pb-6 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <Panda mood="cheer" size={120}/>
            <h2 className="text-2xl font-extrabold">That took courage.</h2>
            <p className="text-sm text-mute-light dark:text-mute-dark">Let's notice something before we close out.</p>
          </div>
          <div>
            <p className="font-bold mb-2">How anxious does it feel now?</p>
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
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
              onChange={e => setWin(e.target.value)}
              placeholder="Even something small — 'I asked for oat milk without stumbling.'"
              className="w-full min-h-[100px] rounded-card p-4 bg-surface-light dark:bg-surface-dark text-sm resize-none outline-none focus:ring-2 focus:ring-lilac"
            />
          </div>
          <div className="mt-auto"><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save to journal'}</Button></div>
        </Screen>
      </Container>
    );
  };

  // ---------- Reminders ----------
  const formatReminderWhen = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'long' }) +
      ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const Reminders = ({ go, nav, setNav, onCrisis }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let cancelled = false;
      storage.getReminders().then(data => {
        if (!cancelled) { setItems(data); setLoading(false); }
      });
      return () => { cancelled = true; };
    }, []);

    return (
      <Container>
        <TopBar title="Reminders" right={<button onClick={() => go('addReminder')} className="w-8 h-8 rounded-full bg-lilac-strong text-white flex items-center justify-center"><Icon name="plus" size={16}/></button>}/>
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
                <Icon name="clock" size={18}/>
              </div>
              <div className="flex-1">
                <p className="font-bold">{it.label}</p>
                <p className="text-xs text-mute-light dark:text-mute-dark">{formatReminderWhen(it.event_time)}</p>
              </div>
              {it.scenario_id && (
                <button onClick={() => go('scenario', { id: it.scenario_id })} className="text-xs font-bold text-lilac-strong dark:text-lilac-dark">Prep</button>
              )}
            </Card>
          ))}
        </Screen>
        <CrisisChip onClick={onCrisis}/>
        <BottomNav current={nav} onChange={setNav}/>
      </Container>
    );
  };

  const AddReminder = ({ onBack, onSave }) => {
    const [label, setLabel] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [scenarioId, setScenarioId] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      if (!label.trim() || !date || !time) return;
      setSaving(true);
      try {
        const event_time = new Date(`${date}T${time}`).toISOString();
        await storage.saveReminder({
          label: label.trim(),
          event_time,
          scenario_id: scenarioId
        });
      } catch (e) {
        console.error('[AddReminder] save failed:', e);
      } finally {
        setSaving(false);
        onSave();
      }
    };
    return (
      <Container>
        <TopBar title="New reminder" onBack={onBack}/>
        <Screen className="px-6 pb-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">What's happening?</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Dinner with friends" className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none focus:ring-2 focus:ring-lilac"/>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-mute-light dark:text-mute-dark uppercase">Related practice</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SCENARIOS.slice(0,4).map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenarioId(scenarioId === s.id ? null : s.id)}
                  className={`p-3 rounded-card text-left text-sm font-semibold flex items-center gap-2 transition border-2 ${scenarioId === s.id ? 'border-lilac-strong bg-lilac-soft dark:bg-lilac/10' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}
                >
                  <span className="text-lg">{s.emoji}</span>{s.short}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto"><Button onClick={handleSave} disabled={saving || !label.trim() || !date || !time}>{saving ? 'Saving…' : 'Save reminder'}</Button></div>
        </Screen>
      </Container>
    );
  };

  // ---------- Journal ----------
  const formatEntryDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const today = new Date();
    const yest = new Date(today); yest.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yest.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const Journal = ({ go, nav, setNav, onCrisis }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let cancelled = false;
      storage.getJournal().then(data => {
        if (!cancelled) { setEntries(data); setLoading(false); }
      });
      return () => { cancelled = true; };
    }, []);

    return (
      <Container>
        <TopBar title="Journal" right={<button onClick={() => go('journalNew')} className="w-8 h-8 rounded-full bg-lilac-strong text-white flex items-center justify-center"><Icon name="plus" size={16}/></button>}/>
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
                  <TulipMark size={22}/>
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
        <CrisisChip onClick={onCrisis}/>
        <BottomNav current={nav} onChange={setNav}/>
      </Container>
    );
  };

  const JournalNew = ({ onBack, onSave }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      if (!title.trim() && !body.trim()) return;
      setSaving(true);
      try {
        await storage.saveJournal({
          title: title.trim() || 'A small win',
          body: body.trim()
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
        <TopBar title="New entry" onBack={onBack}/>
        <Screen className="px-6 pb-6 flex flex-col gap-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="One small thing I did…" className="p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none font-bold text-lg"/>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What happened? How did it feel?" className="min-h-[200px] p-3 rounded-btn bg-surface-light dark:bg-surface-dark outline-none resize-none"/>
          <div className="mt-auto"><Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></div>
        </Screen>
      </Container>
    );
  };

  // ---------- Me / Settings ----------
  const Me = ({ go, nav, setNav, dark, setDark, onCrisis }) => {
    const { user } = useAuth();
    const [upgradeStatus, setUpgradeStatus] = useState(null); // null | 'running' | 'done' | 'nothing'

    const handleUpgrade = async () => {
      setUpgradeStatus('running');
      const { migrated } = await storage.upgradeGuest();
      setUpgradeStatus(migrated > 0 ? 'done' : 'nothing');
    };

    const handleSignOut = async () => {
      await signOutUser();
    };

    return (
    <Container>
      <TopBar title="Me"/>
      <Screen className="px-5 pb-6 flex flex-col gap-3">
        <Card className="flex items-center gap-3">
          <Panda mood="cheer" size={56}/>
          <div className="flex-1">
            <p className="font-bold">{user ? user.email : 'Guest'}</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">
              {user ? 'Your data is safely backed up.' : 'Sessions stay on this device.'}
            </p>
          </div>
          {user ? (
            <button onClick={handleSignOut} className="text-xs font-bold text-mute-light dark:text-mute-dark">Sign out</button>
          ) : (
            <button onClick={() => go('account')} className="text-xs font-bold text-lilac-strong dark:text-lilac-dark">Sign in</button>
          )}
        </Card>

        {user && upgradeStatus === null && (
          <Card className="flex items-center gap-3 bg-sage-soft dark:bg-sage/10">
            <div className="flex-1">
              <p className="font-bold text-sm">Move guest data to your account?</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">Anything you practiced before signing in.</p>
            </div>
            <button onClick={handleUpgrade} className="text-xs font-bold text-sage-strong dark:text-sage-dark">Migrate</button>
          </Card>
        )}
        {upgradeStatus === 'running' && (
          <Card><p className="text-sm text-mute-light dark:text-mute-dark">Moving your data…</p></Card>
        )}
        {upgradeStatus === 'done' && (
          <Card className="bg-sage-soft dark:bg-sage/10"><p className="text-sm">✓ Your guest data is now on your account.</p></Card>
        )}
        {upgradeStatus === 'nothing' && (
          <Card><p className="text-sm text-mute-light dark:text-mute-dark">No guest data to move — you're all set.</p></Card>
        )}

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mt-3 mb-2 px-1">Your streak</p>
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-bold">3 gentle days</p>
              <p className="text-xs text-mute-light dark:text-mute-dark">No-pressure streaks. Missed days don't reset you.</p>
            </div>
            <div className="text-3xl">🌱</div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-mute-light dark:text-mute-dark mt-3 mb-2 px-1">Settings</p>
          <Card className="divide-y divide-lilac-soft dark:divide-ink-light/10 p-0">
            <button onClick={() => setDark(!dark)} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name={dark ? 'sun' : 'moon'} size={18}/>
              <span className="flex-1 font-semibold">{dark ? 'Light mode' : 'Dark mode'}</span>
              <span className="text-xs text-mute-light dark:text-mute-dark">{dark ? 'On' : 'Off'}</span>
            </button>
            <button className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="shield" size={18}/>
              <span className="flex-1 font-semibold">Privacy & data</span>
              <Icon name="chevronRight" size={16}/>
            </button>
            <button onClick={onCrisis} className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="heart" size={18}/>
              <span className="flex-1 font-semibold">Crisis resources</span>
              <Icon name="chevronRight" size={16}/>
            </button>
            <button className="w-full p-4 flex items-center gap-3 text-left">
              <Icon name="trash" size={18}/>
              <span className="flex-1 font-semibold">Delete my data</span>
              <Icon name="chevronRight" size={16}/>
            </button>
          </Card>
        </div>

        <p className="text-[11px] text-center text-mute-light dark:text-mute-dark mt-2">Astro is a supportive tool, not therapy or a medical device.</p>
      </Screen>
      <BottomNav current={nav} onChange={setNav}/>
    </Container>
    );
  };

  // ---------- Crisis resources ----------
  const Crisis = ({ onBack }) => (
    <Container>
      <div className="bg-crisis text-white px-6 pt-6 pb-8 rounded-b-[32px]">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4"><Icon name="chevronLeft"/></button>
        <h2 className="text-2xl font-extrabold mb-2">You're not alone right now.</h2>
        <p className="text-sm opacity-90">Reach a human. These lines are free and open 24/7.</p>
      </div>
      <Screen className="px-5 pt-4 pb-6 flex flex-col gap-3">
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone"/></div>
          <div className="flex-1">
            <p className="font-bold">988 Suicide & Crisis Lifeline</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">Call or text 988 · US & Canada</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone"/></div>
          <div className="flex-1">
            <p className="font-bold">Crisis Text Line</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">Text HOME to 741741</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-coral/30 flex items-center justify-center"><Icon name="phone"/></div>
          <div className="flex-1">
            <p className="font-bold">Emergency services</p>
            <p className="text-xs text-mute-light dark:text-mute-dark">911 · if you or someone else is in immediate danger</p>
          </div>
        </Card>
        <Card className="bg-sage-soft dark:bg-sage/20">
          <p className="font-bold mb-1">Or just breathe with me.</p>
          <p className="text-sm">A 60-second grounding exercise is always available on the home tab.</p>
        </Card>
      </Screen>
    </Container>
  );

  const Breathing = ({ onBack }) => {
    // stages: 'setup' | 'running' | 'done'
    const [stage, setStage] = useState('setup');
    const [targetRounds, setTargetRounds] = useState(3);
    const [phase, setPhase] = useState('in');
    const [phaseCount, setPhaseCount] = useState(0); // counts every phase tick

    // Start running
    const start = () => {
      setPhase('in');
      setPhaseCount(0);
      setStage('running');
    };

    // Phase cycle: in → hold → out; each phase = 3s; one round = 3 phases
    useEffect(() => {
      if (stage !== 'running') return;
      const t = setInterval(() => {
        setPhaseCount(c => {
          const next = c + 1;
          const roundsCompleted = Math.floor(next / 3);
          if (roundsCompleted >= targetRounds) {
            setStage('done');
            return next;
          }
          return next;
        });
        setPhase(p => p === 'in' ? 'hold' : p === 'hold' ? 'out' : 'in');
      }, 3000);
      return () => clearInterval(t);
    }, [stage, targetRounds]);

    const currentRound = Math.min(Math.floor(phaseCount / 3) + 1, targetRounds);

    return (
      <Container>
        <TopBar title="Grounding" onBack={onBack}/>

        {stage === 'setup' && (
          <Screen className="px-6 pb-6 flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-3 mt-4">
              <Panda mood="breathing" size={130}/>
              <h2 className="text-2xl font-extrabold">How many rounds?</h2>
              <p className="text-sm text-mute-light dark:text-mute-dark">Each round is about 9 seconds (in · hold · out). Pick whatever feels doable.</p>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => setTargetRounds(n)}
                  className={`aspect-square rounded-card font-extrabold text-xl transition ${targetRounds === n ? 'bg-lilac-strong text-white' : 'bg-surface-light dark:bg-surface-dark'}`}
                >{n}</button>
              ))}
            </div>
            <p className="text-xs text-center text-mute-light dark:text-mute-dark">
              {targetRounds} round{targetRounds > 1 ? 's' : ''} · about {targetRounds * 9}s
            </p>
            <div className="mt-auto"><Button onClick={start}>Start</Button></div>
          </Screen>
        )}

        {stage === 'running' && (
          <Screen className="px-6 flex flex-col items-center justify-center gap-8">
            <div className="relative flex items-center justify-center h-64 w-64">
              <div className={`absolute rounded-full bg-sky-soft dark:bg-sky/20 transition-all duration-[3000ms] ${phase === 'in' ? 'w-60 h-60' : phase === 'hold' ? 'w-60 h-60' : 'w-24 h-24'}`}/>
              <p className="relative text-2xl font-extrabold">
                {phase === 'in' ? 'Breathe in' : phase === 'hold' ? 'Hold' : 'Breathe out'}
              </p>
            </div>
            <p className="text-sm font-semibold text-mute-light dark:text-mute-dark">
              Round {currentRound} of {targetRounds}
            </p>
            <button onClick={onBack} className="text-sm font-semibold text-mute-light dark:text-mute-dark py-2">
              Stop early
            </button>
          </Screen>
        )}

        {stage === 'done' && (
          <Screen className="px-6 pb-6 flex flex-col items-center text-center gap-5">
            <div className="mt-6"><Panda mood="cheer" size={150}/></div>
            <h2 className="text-2xl font-extrabold">Nicely done.</h2>
            <p className="text-sm text-mute-light dark:text-mute-dark">
              You finished {targetRounds} round{targetRounds > 1 ? 's' : ''}. Notice anything? Breath a little slower, shoulders a little lower.
            </p>
            <div className="w-full flex flex-col gap-3 mt-auto">
              <Button onClick={() => setStage('setup')}>Go again</Button>
              <Button variant="secondary" onClick={onBack}>I feel steadier</Button>
            </div>
          </Screen>
        )}
      </Container>
    );
  };

  // ==============================================================
  //  ROUTER
