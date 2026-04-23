  // ==============================================================
  //  SERVICES — auth + storage
  //  - Signed-in users → Supabase (Postgres with RLS)
  //  - Guest users → localStorage
  //  Same API for both. Storage methods detect auth state internally.
  // ==============================================================

  // ---------- Auth hook ----------
  const useAuth = () => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
      if (!window.supabase) { setAuthLoading(false); return; }

      window.supabase.auth.getSession().then(({ data }) => {
        setUser(data?.session?.user || null);
        setAuthLoading(false);
      });

      const { data: listener } = window.supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => listener?.subscription?.unsubscribe();
    }, []);

    return { user, authLoading };
  };

  // ---------- Current user helper (for non-hook contexts) ----------
  const getCurrentUser = async () => {
    if (!window.supabase) return null;
    const { data } = await window.supabase.auth.getUser();
    return data?.user || null;
  };

  // ---------- Magic link sign-in ----------
  const signInWithMagicLink = async (email) => {
    if (!window.supabase) throw new Error('Supabase not configured yet. Add credentials in config/supabase.js.');
    const { error } = await window.supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href }
    });
    if (error) throw error;
    return true;
  };

  // ---------- Sign out ----------
  const signOutUser = async () => {
    if (!window.supabase) return;
    await window.supabase.auth.signOut();
  };

  // ---------- Storage service ----------
  // Each method auto-detects: if signed in → Supabase; else → localStorage.
  const storage = {
    async getJournal() {
      const user = await getCurrentUser();
      if (user && window.supabase) {
        const { data, error } = await window.supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) console.error('[storage] getJournal:', error);
        return data || [];
      }
      return JSON.parse(localStorage.getItem('astro.journal') || '[]');
    },

    async saveJournal(entry) {
      const user = await getCurrentUser();
      if (user && window.supabase) {
        const { data, error } = await window.supabase
          .from('journal_entries')
          .insert({ ...entry, user_id: user.id })
          .select()
          .single();
        if (error) console.error('[storage] saveJournal:', error);
        return data;
      }
      const entries = JSON.parse(localStorage.getItem('astro.journal') || '[]');
      const newEntry = {
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        ...entry
      };
      localStorage.setItem('astro.journal', JSON.stringify([newEntry, ...entries]));
      return newEntry;
    },

    async getReminders() {
      const user = await getCurrentUser();
      if (user && window.supabase) {
        const { data, error } = await window.supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .order('event_time', { ascending: true });
        if (error) console.error('[storage] getReminders:', error);
        return data || [];
      }
      return JSON.parse(localStorage.getItem('astro.reminders') || '[]');
    },

    async saveReminder(reminder) {
      const user = await getCurrentUser();
      if (user && window.supabase) {
        const { data, error } = await window.supabase
          .from('reminders')
          .insert({ ...reminder, user_id: user.id })
          .select()
          .single();
        if (error) console.error('[storage] saveReminder:', error);
        return data;
      }
      const reminders = JSON.parse(localStorage.getItem('astro.reminders') || '[]');
      const newReminder = {
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        ...reminder
      };
      localStorage.setItem('astro.reminders', JSON.stringify([...reminders, newReminder]));
      return newReminder;
    },

    async saveSession(session) {
      const user = await getCurrentUser();
      if (user && window.supabase) {
        const { data, error } = await window.supabase
          .from('sessions')
          .insert({ ...session, user_id: user.id })
          .select()
          .single();
        if (error) console.error('[storage] saveSession:', error);
        return data;
      }
      const sessions = JSON.parse(localStorage.getItem('astro.sessions') || '[]');
      const newSession = {
        id: 'local-' + Date.now(),
        started_at: new Date().toISOString(),
        ...session
      };
      localStorage.setItem('astro.sessions', JSON.stringify([newSession, ...sessions]));
      return newSession;
    },

    // Upgrade: migrate guest localStorage → Supabase after first sign-in.
    // Call this from the Me tab's Upgrade action (or auto on first signed-in load).
    async upgradeGuest() {
      const user = await getCurrentUser();
      if (!user || !window.supabase) return { migrated: 0 };

      const journal = JSON.parse(localStorage.getItem('astro.journal') || '[]');
      const reminders = JSON.parse(localStorage.getItem('astro.reminders') || '[]');
      const sessions = JSON.parse(localStorage.getItem('astro.sessions') || '[]');

      let migrated = 0;

      if (journal.length) {
        const rows = journal.map(({ id, ...rest }) => ({ ...rest, user_id: user.id }));
        const { error } = await window.supabase.from('journal_entries').insert(rows);
        if (!error) migrated += rows.length;
      }
      if (reminders.length) {
        const rows = reminders.map(({ id, ...rest }) => ({ ...rest, user_id: user.id }));
        const { error } = await window.supabase.from('reminders').insert(rows);
        if (!error) migrated += rows.length;
      }
      if (sessions.length) {
        const rows = sessions.map(({ id, ...rest }) => ({ ...rest, user_id: user.id }));
        const { error } = await window.supabase.from('sessions').insert(rows);
        if (!error) migrated += rows.length;
      }

      if (migrated > 0) {
        localStorage.removeItem('astro.journal');
        localStorage.removeItem('astro.reminders');
        localStorage.removeItem('astro.sessions');
      }

      return { migrated };
    }
  };
