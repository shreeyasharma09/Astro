# Astro — Roadmap

A prioritized checklist of what's left after Phase 1B + the Vite migration. Check items off as they ship.

---

## Priority 1 — Finish deploy

### Merge `development` → `main`
- [ ] Open PR with the short description
- [ ] Review diff one more time
- [ ] Merge (or self-approve)
- [ ] Confirm Vercel picks up main automatically

### Verify Vercel production deploy
- [ ] Vercel root dir is `astro-vite`
- [ ] Env vars set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] Build succeeds (check Vercel → Deployments log)
- [ ] Open prod URL, console shows `[Astro] Supabase client ready`
- [ ] Copy the production URL for the next step

### Update Supabase redirect URLs for prod
- [ ] Supabase dashboard → Authentication → URL Configuration
- [ ] Add: `https://<your-prod-url>.vercel.app/**`
- [ ] Optionally set **Site URL** to the prod URL so emails default to it
- [ ] Remove old ngrok URLs

### Full smoke test on prod
- [ ] Guest flow: Splash → Welcome → Account → Continue as guest → Home
- [ ] Sign-up flow: magic link via prod URL, lands signed in
- [ ] Roleplay: Tap + Type + Speak all work
- [ ] Mic works on phone (Safari iOS / Chrome Android)
- [ ] Export email arrives in inbox
- [ ] Delete flow removes auth.users and rows
- [ ] Crisis keyword routes to Crisis screen

---

## Priority 2 — Make it portfolio-ready

### Write a real README
Replace the minimal README with:
- [ ] One-line pitch ("Astro is a social-anxiety practice app — gentle, private, speech-enabled")
- [ ] Live demo link to the Vercel URL
- [ ] Screenshots (3–5 key screens: Home, Mode Picker, Speak mode, Privacy page, Delete flow)
- [ ] Optional demo GIF (record with Kap or CleanShot)
- [ ] Tech stack: React + TS + Vite + Tailwind + Supabase (Postgres + RLS + Edge Functions + Auth) + Web Speech API + Resend
- [ ] "What I learned" section — honest about decisions
- [ ] Architecture diagram (ASCII is fine)
- [ ] Local dev instructions (clone → `.env.local` → `npm install` → `npm run dev`)

### Add a `screenshots/` folder
Captured at 1440×900 desktop + 390×844 mobile:
- [ ] Home (light + dark)
- [ ] Mode Picker
- [ ] Roleplay Tap mode
- [ ] Roleplay Speak mode with orb pulsing
- [ ] Journal with entries
- [ ] Privacy & Data page

### Clean up repo root
- [ ] Move or delete the two top-level PDFs (`Astro — Hi-fi Design (Print).pdf`, `Astro — Roleplay Modes (Print).pdf`)
- [ ] Update top-level `CHANGELOG.md` with Phase 1B entry
- [ ] Confirm `.gitignore` is clean

---

## Priority 3 — Phase 2: LLM-powered replies

Turns scripted `DEMO_TURNS` into real conversations via Gemini.

### Backend
- [ ] New Edge Function `chat-reply` — accepts scenario id + conversation history, returns next NPC reply
- [ ] System prompt per scenario (barista / professor / friend / etc.)
- [ ] Safety rails: short replies, stay in character, redirect on harmful content
- [ ] Rate limit per user (basic — 20 turns/hr)
- [ ] Gemini API key via `supabase secrets set GEMINI_API_KEY`

### Frontend
- [ ] New service method `chatReply(scenarioId, history)`
- [ ] Replace scripted-advance logic in Roleplay with async LLM call
- [ ] Typing indicator during the ~500–1500ms wait
- [ ] Handle errors gracefully (fall back to "sorry, let's continue" canned reply)
- [ ] Keep the scripted `DEMO_TURNS` for offline / cost-free fallback

### Testing
- [ ] Every scenario can run 5+ turns without going off-rails
- [ ] Crisis keywords in user input still route to Crisis before calling Gemini
- [ ] Rate limit kicks in after threshold
- [ ] Fallback works if Gemini fails

---

## Priority 4 — Make the privacy copy true

Right now we tell Chrome users "Google transcribes your audio." True, but we said we'd work on fixing it.

### Self-hosted Whisper option
- [ ] Spin up a lightweight Whisper endpoint (Replicate, Modal, or your own Docker on Fly.io)
- [ ] New service method `transcribeAudio(audioBlob)` that hits our endpoint instead of browser
- [ ] Roleplay: when mode is Speak, record mic via `MediaRecorder`, send chunks to our endpoint
- [ ] Fall back to `useSpeechRecognition` if our endpoint is down
- [ ] Update Mode Picker copy: "Your voice is transcribed on Astro's server, not sent to third parties"
- [ ] Add a toggle in Privacy settings: "Use Astro's transcription (private) vs browser's (faster)"

---

## Priority 5 — Account & email polish

### Verify a custom Resend domain
- [ ] Buy a cheap domain (if needed)
- [ ] Verify in Resend (DNS TXT records)
- [ ] Change `from: 'onboarding@resend.dev'` → `from: 'Astro <noreply@yourdomain.com>'` in `export-me`
- [ ] Email export now works for any user, not just the account owner

### Onboarding → profile update
Currently `profiles.age_range` and `reminder_pref` stay NULL forever:
- [ ] After Onboarding, call `supabase.from('profiles').update({ age_range, reminder_pref }).eq('id', user.id)`
- [ ] Reflect saved prefs in Me tab

### Email verification nudge
- [ ] If user signs in but `email_confirmed_at` is null, show a banner
- [ ] Resend confirmation link option

---

## Priority 6 — Data & analytics (optional)

### Session completion stats in Me tab
Currently "3 gentle days" is hardcoded. Wire to real data:
- [ ] Query `sessions` table for this week
- [ ] Compute streak (consecutive days with any session)
- [ ] Show real count

### Journal entry count, favorite scenario
- [ ] Top scenario by completion
- [ ] Average anxiety score (pre vs post)
- [ ] Weekly summary card on Home

### Gentle analytics (privacy-friendly)
- [ ] Plausible or PostHog for anonymous usage
- [ ] No PII, no cross-site tracking

---

## Priority 7 — Nice-to-haves

### Features
- [ ] Push notifications for reminders (web push API)
- [ ] iOS/Android PWA support (manifest.json + service worker)
- [ ] Offline mode — scenarios cached, sync when online
- [ ] Multi-language (i18n via react-intl)
- [ ] Accessibility pass — WCAG AA for color contrast, keyboard nav everywhere

### UX polish
- [ ] Real illustrations for empty states (journal, reminders)
- [ ] Better loading skeletons instead of "Loading…"
- [ ] Success toasts instead of inline cards where appropriate
- [ ] Undo button after delete (30-second grace period before edge function fires)
- [ ] Haptic feedback on mobile buttons

### Code quality
- [ ] Stricter TypeScript — replace the `any` placeholders
- [ ] ESLint + Prettier config
- [ ] Basic unit tests (Vitest) for `containsCrisisLanguage`, `useSpeechRecognition` state machine
- [ ] Playwright e2e test for the guest → roleplay → journal flow

---

## Known technical debt

- `any` sprinkled in `Roleplay.tsx` message types (Turn union is awkward)
- `@ts-nocheck` in edge functions (Deno types not installed locally)
- `useEffect` dependency warnings silenced with `eslint-disable-next-line` — proper fix is to move helpers out of the component
- Dev-bar select in top-right of `App.tsx` should hide in production (`import.meta.env.PROD`)

---

## Suggested sequence

**This week:**
1. Priority 1 (deploy)
2. Priority 2 (README + screenshots)
3. Push, share the Vercel URL in your portfolio

**Next 2 weeks:**
4. Priority 3 (Gemini LLM) — the feature that makes it feel alive
5. Priority 5 items (email domain, onboarding profile writes) — quick wins

**Longer term:**
6. Priority 4 (self-hosted Whisper)
7. Priority 6 (real analytics)
8. Priority 7 as scope allows

---

## Time budget

| priority | time | impact |
|---|---|---|
| P1 Deploy | 30 min | Unblocks sharing |
| P2 Portfolio polish | 1–2 hrs | High — recruiter-facing |
| P3 LLM | 3–4 hrs | Very high — makes app real |
| P4 Whisper | 4–6 hrs | Medium — privacy credibility |
| P5 Email/profile | 2 hrs | Medium |
| P6 Analytics | 3 hrs | Low — nice-to-have |
| P7 Polish | variable | Low unless a specific bug bites |

**Minimum viable portfolio state:** P1 + P2 → ~2–3 hrs of work
**Impressive portfolio state:** + P3 → ~6–7 hrs total
**Real product state:** + P4 + P5 → ~15 hrs total
