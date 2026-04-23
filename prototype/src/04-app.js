  // ==============================================================
  const App = () => {
    const [dark, setDark] = useState(false);
    const [route, setRoute] = useState({ name: 'splash' });
    const [nav, setNav] = useState('home');
    const { user, authLoading } = useAuth();

    useEffect(() => {
      document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    const go = (name, params = {}) => setRoute({ name, ...params });

    // dev shortcuts
    useEffect(() => {
      const jumpTo = new URLSearchParams(window.location.search).get('to');
      if (jumpTo) go(jumpTo);
    }, []);

    // Signed-in users skip onboarding
    useEffect(() => {
      if (user && ['splash', 'welcome', 'account', 'guestConfirm'].includes(route.name)) {
        go('tabs');
      }
    }, [user]);

    const onCrisis = () => go('crisis');

    // render by route
    const screen = (() => {
      switch (route.name) {
        case 'splash': return <Container><Splash onNext={() => go('welcome')}/></Container>;
        case 'welcome': return <Container><Welcome onDone={() => go('account')}/></Container>;
        case 'account': return <Container><AccountChoice onGuest={() => go('guestConfirm')} onSignUp={() => go('guestConfirm')} onSignIn={() => go('guestConfirm')}/></Container>;
        case 'guestConfirm': return <GuestConfirm onContinue={() => go('onboarding')} onBack={() => go('account')}/>;
        case 'onboarding': return <Onboarding onDone={() => go('tabs')}/>;
        case 'tabs':
        case 'breathing':
        case 'settings': {
          // tab container — show chosen tab
          const crisisHandler = () => go('crisis');
          if (route.name === 'breathing') return <Breathing onBack={() => go('tabs')}/>;
          if (nav === 'home') return <Home go={go} nav={nav} setNav={setNav} onCrisis={crisisHandler}/>;
          if (nav === 'practice') return <Practice go={go} nav={nav} setNav={setNav} onCrisis={crisisHandler}/>;
          if (nav === 'reminders') return <Reminders go={go} nav={nav} setNav={setNav} onCrisis={crisisHandler}/>;
          if (nav === 'journal') return <Journal go={go} nav={nav} setNav={setNav} onCrisis={crisisHandler}/>;
          if (nav === 'me') return <Me go={go} nav={nav} setNav={setNav} dark={dark} setDark={setDark} onCrisis={crisisHandler}/>;
          return null;
        }
        case 'scenario': return <ScenarioDetail id={route.id} onBack={() => go('tabs')} go={go}/>;
        case 'prep': return <Prep id={route.id} onBack={() => go('scenario', { id: route.id })} go={go}/>;
        case 'roleplay': return <Roleplay id={route.id} onBack={() => go('tabs')} go={go}/>;
        case 'reflection': return <Reflection id={route.id} onDone={() => { setNav('journal'); go('tabs'); }}/>;
        case 'crisis': return <Crisis onBack={() => go('tabs')}/>;
        case 'addReminder': return <AddReminder onBack={() => go('tabs')} onSave={() => go('tabs')}/>;
        case 'journalNew': return <JournalNew onBack={() => go('tabs')} onSave={() => { setNav('journal'); go('tabs'); }}/>;
        default: return <Container><Splash onNext={() => go('welcome')}/></Container>;
      }
    })();

    return (
      <>
        {/* Dev bar (only on sm+) */}
        <div className="hidden sm:flex fixed top-3 right-3 z-50 gap-2 items-center text-xs bg-white/70 dark:bg-surface-dark/70 backdrop-blur rounded-full px-2 py-1 shadow-soft">
          <button onClick={() => setDark(!dark)} className="w-7 h-7 rounded-full flex items-center justify-center bg-lilac-soft dark:bg-lilac/20">
            <Icon name={dark ? 'sun' : 'moon'} size={14}/>
          </button>
          <select
            value={route.name}
            onChange={e => go(e.target.value, e.target.value === 'scenario' || e.target.value === 'prep' || e.target.value === 'roleplay' || e.target.value === 'reflection' ? { id: 'coffee' } : {})}
            className="bg-transparent text-ink-light dark:text-ink-dark font-semibold text-xs outline-none"
          >
            <option value="splash">Splash</option>
            <option value="welcome">Welcome slides</option>
            <option value="account">Account choice</option>
            <option value="guestConfirm">Guest confirm</option>
            <option value="onboarding">Onboarding</option>
            <option value="tabs">Home / Tabs</option>
            <option value="scenario">Scenario detail</option>
            <option value="prep">Prep flow</option>
            <option value="roleplay">Roleplay</option>
            <option value="reflection">Reflection</option>
            <option value="addReminder">Add reminder</option>
            <option value="journalNew">Journal new</option>
            <option value="crisis">Crisis resources</option>
            <option value="breathing">Breathing</option>
          </select>
        </div>
        {screen}
      </>
    );
  };

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
