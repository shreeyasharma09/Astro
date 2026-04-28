# About Astro

*A plain-language overview of what Astro is, why it exists, how it started, and how it's built.*

---

## 1. What Astro is

Astro is a gentle practice space for social anxiety — a pocket companion for the small, everyday interactions that many people quietly dread: ordering a coffee, making a phone call, joining a conversation at a party, saying "no" to an invitation, speaking up in a meeting.

It's organised around three moments:

1. **Before** the interaction — practice it through a soft AI roleplay, walk through a prep flow (breathing → script preview → anxiety rating).
2. **During** — quick grounding, breathing exercises, and reminder nudges.
3. **After** — reflect, rate how it actually went, and log a small win in a journal.

Astro is positioned as a *supportive tool, not therapy or a medical device.* Crisis resources (988 Lifeline, Crisis Text Line) are reachable within two taps from any non-modal screen, and the app never attempts to diagnose or prescribe.

**Target users:** teens (13–17), college students (18–24), and young adults (25–34) who experience social anxiety that limits day-to-day life but isn't at acute-crisis level. Secondary: neurodivergent users who prefer explicit scripts, older adults, and users working on exposure therapy alongside professional care.

---

## 2. Why it exists

Existing anxiety apps focus on general meditation or broad CBT programs. They don't help with *the specific moment someone is about to do the hard thing.* The thesis behind Astro is **situational specificity + lived-in roleplay**: knowing you're dreading *this* specific coffee order on *Thursday* is very different from a generic "mindfulness" nudge.

Core design commitments that fall out of that thesis:

- **Guest-first.** No sign-up required to use the core features. Anxiety users shouldn't face friction to get help.
- **No dark patterns.** No shaming streaks, no manipulative notifications, no upgrade paywall on safety features.
- **Warm, non-clinical tone.** Closed-crescent eyes on every mascot, pastel palette, Nunito typography — nothing sharp or clinical.
- **Clinical review in the loop.** All 10 starter scenarios are drafted but pending licensed-therapist review before public ship.

---

## 3. How it started

The repository intentionally documents the drafting process rather than presenting a polished retcon. The trajectory so far:

1. **Master spec written first** (`docs/ASTRO-MASTER-SPEC.md`) — product, design, backend, data model, cost analysis, and roadmap all in one source-of-truth document.
2. **Single-file HTML prototype** built in `prototype/index.html` — React via CDN, Tailwind via CDN, Babel in the browser. Zero build step so it can run anywhere Python's `http.server` can serve static files. All 22 screens, all user flows, one fully-scripted Coffee roleplay demo.
3. **Mascot exploration** in `prototype/logo-lab.html` and `prototype/refinement-lab.html` — iteration between the Astro Tulip (brand mark) and Momo the Panda (in-app companion). Both share closed-crescent eyes, pink cheek blush, and a sage-green accent so they read as siblings.
4. **Figma handoff** (`docs/FIGMA-HANDOFF.md`) written so a designer can rebuild the app in Figma from the prototype.
5. **Migration to Vite + TypeScript** (`astro-vite/`) — the prototype graduated from a single HTML file into a proper component tree under `src/components/`, `src/screens/`, `src/hooks/`, `src/lib/`, `src/services/`.
6. **Phase 1B backend wiring** — Supabase project configured, two first Edge Functions shipped: `delete-me` and `export-me` (GDPR/CCPA data rights). Privacy-and-data screen + delete/export flow added to the app.

The commit history reads as a draft log on purpose; `CHANGELOG.md` tracks the 0.1.0 milestone.

---

## 4. How the app works (feature map)

**Twenty-two screens** across five areas:

- **Onboarding & auth (7):** Splash, Welcome (3 slides), Account Choice, Guest Confirm, Onboarding 1/2/3 (age range, pick what's hardest, reminder intensity).
- **Persistent tabs (5):** Home, Practice, Reminders, Journal, Me.
- **Stack/modal screens (10):** Scenario Detail, Prep 1/2/3, Roleplay, Reflection, Add Reminder, Journal New, Crisis, Breathing (setup → running → done), plus privacy/data sub-screens.

**Key flows:**

- **Flow A (core test path):** Splash → Welcome → Guest → Onboarding 1/2/3 → Home → tap suggested scenario → Scenario Detail → Prep → Roleplay → Reflection → Home.
- **Flow C (crisis):** Any tab → coral "I'm not okay" chip → Crisis resources. Must work from every non-modal screen.
- **Flow D (grounding):** Home → Quick help → Grounding → pick 1–5 rounds → animated breathing orb → repeat or exit.

**The 10 starter scenarios** (all drafted, pending clinical review): ordering coffee, asking for directions, asking a server about the menu, booking an appointment by phone, returning an item, asking a professor after class, small talk with a classmate, joining a group at a party, speaking up in a meeting, declining an invitation kindly.

---

## 5. Tech stack

### Prototype (current, shipped)

| Layer | Choice |
|---|---|
| App shell (original) | Single `prototype/index.html` — React 18 UMD + Tailwind CDN + Babel Standalone |
| App shell (current) | `astro-vite/` — Vite + React 19 + TypeScript + Tailwind + PostCSS |
| Hosting | Static hosting (any); local dev via `vite` dev server or `python3 -m http.server --directory prototype` |
| Icons | Custom inline SVG set (14 icons) styled after Phosphor duotone weight |
| Typography | Nunito (Google Fonts) |
| Mascots | Inline SVG — `Tulip.tsx` (brand) and `Panda.tsx` (companion, 5 moods) |

The Vite app is organised as:

```
astro-vite/
├── src/
│   ├── App.tsx
│   ├── components/   Button, Card, TopBar, BottomNav, Panda, Tulip, DesktopFrame, …
│   ├── screens/      Splash, Welcome, Home, Practice, Roleplay, Reflection, Crisis, …
│   ├── hooks/        useAuth, useKeyboardShortcuts, useSpeechRecognition
│   ├── lib/          supabase, crisis, privacy, scenarios
│   └── services/     storage
```

### Browser APIs in use

- **Web Speech API** (`window.SpeechRecognition` / `webkitSpeechRecognition`) — wrapped in `src/hooks/useSpeechRecognition.ts`. Lets the user dictate roleplay responses instead of typing. Falls back gracefully when unsupported (e.g. non-Chromium browsers).
- **localStorage / sessionStorage** — guest-mode data lives on-device via `src/services/storage.ts` until the user chooses to upgrade to an account.
- **Custom `DesktopFrame`** that scales the phone-sized app into a gradient desktop viewport with keyboard shortcuts, for preview/testing on a laptop.

### Backend (Supabase)

Configured in `supabase/config.toml`; client wired in `src/lib/supabase.ts` via `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars. The app runs in guest-only mode when those aren't set.

| Component | Service | Purpose |
|---|---|---|
| Auth | Supabase Auth | Email magic link, guest → upgrade path, OAuth optional later |
| Database | Supabase Postgres | Profiles, scenarios, sessions, messages, journal entries, reminders, mood logs, crisis flags |
| Security | Row-Level Security | Per-user data isolation — one SQL policy per table |
| LLM proxy (planned) | Supabase Edge Functions (Deno) | Hides the LLM API key, enforces rate limits, logs token usage |
| Data rights (shipped) | Edge Functions `delete-me` + `export-me` | GDPR/CCPA export and delete, triggered from the in-app Privacy & Data screen |

**Why Supabase over Firebase:** Postgres fits the relational shape of the data, RLS is cleaner than Firebase rules, Edge Functions have a generous free tier (500K invocations/month), and it's open-source and self-hostable if needed later.

The `export-me` function collects every row the user owns across `profiles`, `journal_entries`, `reminders`, and `sessions`, packages it as JSON, and emails it via **Resend** as an attachment. (Currently in Resend sandbox mode, so it only delivers to the developer's verified address until a domain is verified.)

### LLM (planned, not yet wired)

| Phase | Users | Model | ~Cost/session |
|---|---|---|---|
| Prototype | 20 testers | None — scripted | $0 |
| Alpha | 20–100 | Gemini 2.5 Flash | ~$0.002 |
| Beta | 100–1,000 | Claude Haiku 4.5 + prompt caching | ~$0.012 |
| v1 | 1,000+ | Haiku with hybrid routing to Sonnet | ~$0.015 |

A single Edge Function (`/roleplay-turn`) handles every turn: validate JWT → rate-limit → load recent session → run local crisis classifier → if triggered, short-circuit to a pre-written crisis card; otherwise call the LLM with the scenario's system prompt + history → log both messages → return the reply. Hard limits: 20-turn cap, 200-token output, 400-token system prompt.

### Production target

- **React Native + Expo** for a single iOS/Android codebase, with NativeWind so the design tokens carry over unchanged.
- **TanStack Query** for server state, Zustand or Context for local state, React Navigation for the stack/tabs.
- **`expo-secure-store`** for tokens, **`expo-notifications`** for local and push notifications.
- **Expo EAS** for builds; TestFlight and Play internal testing for early users.
- **Vercel is not currently part of the stack** — the prototype is a static app and the backend is Supabase. If a marketing site or companion web build is added later, Vercel would be a natural host for it.

### Safety & privacy baked in

- On-device keyword-based crisis classifier (`src/lib/crisis.ts`) runs before any LLM call.
- Crisis resources reachable from every non-modal screen within two taps.
- Journal entries are designed to be client-side-encrypted at rest, so a database breach doesn't expose content.
- GDPR/CCPA export + delete shipped in Phase 1B via the Edge Functions above.
- COPPA age gate at onboarding.

---

## 6. Where it's going

Short-term, per `CHANGELOG.md` and the master spec's roadmap:

- Apply the refined Momo panda (black closed eyes) to the main prototype.
- Write the first Architecture Decision Records.
- Stand up the React Native production build on Expo.
- Complete clinical review of the 10 starter scenarios.

Longer-term milestones: M2 design polish in Figma with commissioned mascot art; M3 alpha build with Supabase + Gemini Flash; M4 beta with Haiku 4.5 + 100–500 users; M5 public launch with institutional-sponsor outreach (schools, EAPs, health systems).

---

## 7. Where to look next

- [`README.md`](../README.md) — quick-start and project status at a glance.
- [`docs/ASTRO-MASTER-SPEC.md`](./ASTRO-MASTER-SPEC.md) — the authoritative spec (product, design, backend, data model, costs, roadmap).
- [`docs/FIGMA-HANDOFF.md`](./FIGMA-HANDOFF.md) — designer-facing spec.
- [`prototype/index.html`](../prototype/index.html) — the original single-file prototype.
- [`astro-vite/`](../astro-vite/) — the current Vite + TS build.
- [`supabase/functions/`](../supabase/functions/) — shipped Edge Functions (`delete-me`, `export-me`).
