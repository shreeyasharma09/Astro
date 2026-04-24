// delete-me
// Verifies the caller's JWT, then uses the service-role key to delete the
// corresponding auth.users row. Client-side code has already deleted the
// user's rows across tables; this is the final step that removes the
// account itself.
//
// Never shipped to the browser. Runs on Supabase's Deno edge runtime.
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'missing_auth' }, 401);
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // 1. Verify the caller using the anon key + their JWT.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ error: 'invalid_auth' }, 401);
    }
    const userId = userData.user.id;

    // 2. Admin client to delete the auth row.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Belt-and-suspenders: re-run row deletes server-side so nothing lingers
    // even if a client call failed silently.
    for (const table of ['journal_entries', 'reminders', 'sessions', 'profiles']) {
      const col = table === 'profiles' ? 'id' : 'user_id';
      await adminClient.from(table).delete().eq(col, userId);
    }

    // 3. Delete the auth user.
    const { error: delErr } = await adminClient.auth.admin.deleteUser(userId);
    if (delErr) {
      return json({ error: 'delete_failed', detail: delErr.message }, 500);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: 'server_error', detail: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}