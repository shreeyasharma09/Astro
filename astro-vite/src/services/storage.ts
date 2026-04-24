import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ---- Types for our own data shapes ----
export interface JournalEntry {
  id?: string;
  user_id?: string;
  title: string;
  body?: string;
  tag?: string;
  created_at?: string;
}

export interface Reminder {
  id?: string;
  user_id?: string;
  label: string;
  when?: string;
  event_time?: string;
  scenario?: string;
  created_at?: string;
}

export interface SessionRecord {
  id?: string;
  user_id?: string;
  scenario_id?: string;
  duration_sec?: number;
  started_at?: string;
  [k: string]: any;
}

// ---- Auth helpers ----
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function signInWithMagicLink(email: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured.');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href },
  });
  if (error) throw error;
  return true;
}

export async function signOutUser(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ---- Storage — auto-detects signed-in vs guest ----
export const storage = {
  async getJournal(): Promise<JournalEntry[]> {
    const user = await getCurrentUser();
    if (user && supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) console.error('[storage] getJournal:', error);
      return data || [];
    }
    return JSON.parse(localStorage.getItem('astro.journal') || '[]');
  },

  async saveJournal(entry: JournalEntry): Promise<JournalEntry | null> {
    const user = await getCurrentUser();
    if (user && supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single();
      if (error) console.error('[storage] saveJournal:', error);
      return data;
    }
    const entries: JournalEntry[] = JSON.parse(localStorage.getItem('astro.journal') || '[]');
    const newEntry: JournalEntry = {
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      ...entry,
    };
    localStorage.setItem('astro.journal', JSON.stringify([newEntry, ...entries]));
    return newEntry;
  },

  async getReminders(): Promise<Reminder[]> {
    const user = await getCurrentUser();
    if (user && supabase) {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('event_time', { ascending: true });
      if (error) console.error('[storage] getReminders:', error);
      return data || [];
    }
    return JSON.parse(localStorage.getItem('astro.reminders') || '[]');
  },

  async saveReminder(reminder: Reminder): Promise<Reminder | null> {
    const user = await getCurrentUser();
    if (user && supabase) {
      const { data, error } = await supabase
        .from('reminders')
        .insert({ ...reminder, user_id: user.id })
        .select()
        .single();
      if (error) console.error('[storage] saveReminder:', error);
      return data;
    }
    const reminders: Reminder[] = JSON.parse(localStorage.getItem('astro.reminders') || '[]');
    const newReminder: Reminder = {
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      ...reminder,
    };
    localStorage.setItem('astro.reminders', JSON.stringify([...reminders, newReminder]));
    return newReminder;
  },

  async saveSession(session: SessionRecord): Promise<SessionRecord | null> {
    const user = await getCurrentUser();
    if (user && supabase) {
      const { data, error } = await supabase
        .from('sessions')
        .insert({ ...session, user_id: user.id })
        .select()
        .single();
      if (error) console.error('[storage] saveSession:', error);
      return data;
    }
    const sessions: SessionRecord[] = JSON.parse(localStorage.getItem('astro.sessions') || '[]');
    const newSession: SessionRecord = {
      id: 'local-' + Date.now(),
      started_at: new Date().toISOString(),
      ...session,
    };
    localStorage.setItem('astro.sessions', JSON.stringify([newSession, ...sessions]));
    return newSession;
  },

  // Migrate guest localStorage → Supabase after first sign-in.
  async upgradeGuest(): Promise<{ migrated: number }> {
    const user = await getCurrentUser();
    if (!user || !supabase) return { migrated: 0 };

    const journal: JournalEntry[] = JSON.parse(localStorage.getItem('astro.journal') || '[]');
    const reminders: Reminder[] = JSON.parse(localStorage.getItem('astro.reminders') || '[]');
    const sessions: SessionRecord[] = JSON.parse(localStorage.getItem('astro.sessions') || '[]');

    let migrated = 0;

    if (journal.length) {
      const rows = journal.map(({ id: _id, ...rest }) => ({ ...rest, user_id: user.id }));
      const { error } = await supabase.from('journal_entries').insert(rows);
      if (!error) migrated += rows.length;
    }
    if (reminders.length) {
      const rows = reminders.map(({ id: _id, ...rest }) => ({ ...rest, user_id: user.id }));
      const { error } = await supabase.from('reminders').insert(rows);
      if (!error) migrated += rows.length;
    }
    if (sessions.length) {
      const rows = sessions.map(({ id: _id, ...rest }) => ({ ...rest, user_id: user.id }));
      const { error } = await supabase.from('sessions').insert(rows);
      if (!error) migrated += rows.length;
    }

    if (migrated > 0) {
      localStorage.removeItem('astro.journal');
      localStorage.removeItem('astro.reminders');
      localStorage.removeItem('astro.sessions');
    }

    return { migrated };
  },

  // Email the user a JSON export via the 'export-me' edge function.
  async requestEmailExport(): Promise<{ ok: boolean; error?: string }> {
    const user = await getCurrentUser();
    if (!user || !supabase) return { ok: false, error: 'Sign in required.' };
    try {
      const { data, error } = await supabase.functions.invoke('export-me', { body: {} });
      if (error) return { ok: false, error: error.message || 'Export failed.' };
      return { ok: true, ...(data as object) };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: msg || 'Export service unavailable.' };
    }
  },

  // Delete every row the user owns.
  // Client-side row delete (RLS) + 'delete-me' edge function for auth.users.
  async deleteMyData(): Promise<{
    ok: boolean;
    mode?: 'guest' | 'account';
    authDeleted?: boolean;
    errors?: string[];
  }> {
    const user = await getCurrentUser();
    if (!user || !supabase) {
      // Guest path: nuke local data.
      try {
        localStorage.removeItem('astro.journal');
        localStorage.removeItem('astro.reminders');
        localStorage.removeItem('astro.sessions');
        localStorage.removeItem('astro_mic_notice_v1');
      } catch {
        /* ignore */
      }
      return { ok: true, mode: 'guest' };
    }

    const errors: string[] = [];
    for (const table of ['journal_entries', 'reminders', 'sessions'] as const) {
      const { error } = await supabase.from(table).delete().eq('user_id', user.id);
      if (error) errors.push(`${table}: ${error.message}`);
    }
    {
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) errors.push(`profiles: ${error.message}`);
    }

    let authDeleted = false;
    try {
      const { error } = await supabase.functions.invoke('delete-me', { body: {} });
      if (!error) authDeleted = true;
      else errors.push(`auth: ${error.message}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`auth: ${msg || 'service unavailable'}`);
    }

    try {
      localStorage.removeItem('astro.journal');
      localStorage.removeItem('astro.reminders');
      localStorage.removeItem('astro.sessions');
      localStorage.removeItem('astro_mic_notice_v1');
    } catch {
      /* ignore */
    }
    await supabase.auth.signOut();

    return { ok: errors.length === 0, mode: 'account', authDeleted, errors };
  },
};