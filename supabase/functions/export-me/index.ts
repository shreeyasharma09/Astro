// export-me
// Collects every row the authenticated user owns, builds a JSON blob,
// and emails it to them via Resend as an attachment.
//
// Sandbox mode: Resend only delivers to the address that owns the
// Resend account (shreeya0394@gmail.com). Good enough for Phase 1B
// since that's the only tester. Verify a domain later to unlock others.
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'missing_auth' }, 401);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

    // 1. Verify caller.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: 'invalid_auth' }, 401);

    const user = userData.user;
    const toEmail = user.email;
    if (!toEmail) return json({ error: 'no_email_on_account' }, 400);

    // 2. Admin client to read all their rows in one pass.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const [profile, journal, reminders, sessions] = await Promise.all([
      adminClient.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      adminClient.from('journal_entries').select('*').eq('user_id', user.id),
      adminClient.from('reminders').select('*').eq('user_id', user.id),
      adminClient.from('sessions').select('*').eq('user_id', user.id),
    ]);

    const blob = {
      exported_at: new Date().toISOString(),
      user: { id: user.id, email: user.email, created_at: user.created_at },
      profile: profile.data || null,
      journal_entries: journal.data || [],
      reminders: reminders.data || [],
      sessions: sessions.data || [],
    };

    const jsonString = JSON.stringify(blob, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));

    // 3. Send via Resend.
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Astro <onboarding@resend.dev>',
        to: [toEmail],
        subject: 'Your Astro data export',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #8E78D0;">Your Astro data</h2>
            <p>Hi — here's a copy of everything Astro stores about you, attached as a JSON file.</p>
            <p style="color: #6B6880; font-size: 14px;">You can open it in any text editor, or drop it into a JSON viewer. It includes your profile, journal entries, reminders, and scenario sessions.</p>
            <p style="color: #6B6880; font-size: 14px;">If you didn't request this, you can ignore this email. Nothing about your data has changed.</p>
            <p style="margin-top: 32px; color: #9C9AAD; font-size: 12px;">Astro — a supportive tool, not therapy or a medical device.</p>
          </div>
        `,
        attachments: [{ filename: 'astro-data.json', content: base64 }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return json({ error: 'email_failed', detail: body }, 500);
    }

    return json({ ok: true, sent_to: toEmail });
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