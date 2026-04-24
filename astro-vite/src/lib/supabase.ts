// Supabase client singleton.
// Credentials come from Vite env vars — NEVER hardcode them here.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (url && anonKey && !url.includes('your-project')) {
  client = createClient(url, anonKey);
  // eslint-disable-next-line no-console
  console.log('[Astro] Supabase client ready');
} else {
  // eslint-disable-next-line no-console
  console.warn('[Astro] Supabase not configured — running in guest-only mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.');
}

export const supabase = client;
export const supabaseReady = (): boolean => !!client;