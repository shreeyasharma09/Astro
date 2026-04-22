# Astro — Master Specification

> A single source of truth for the Astro app: product vision, frontend, backend, design system, content, safety, costs, and roadmap.
>
> **Brand identity:** Astro Tulip (outlined kawaii, pink). **Companion:** Momo the Panda (closed-eye chibi).

**Document version:** 0.2
**Prototype:** `astro-app/index.html` (single-file React, runs anywhere)
**Status:** Interactive web prototype ready for user testing; real app not yet built.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users](#2-target-users)
3. [Core Features](#3-core-features)
4. [Screen Inventory (All 22 Pages)](#4-screen-inventory-all-22-pages)
5. [User Flows](#5-user-flows)
6. [Design System](#6-design-system)
7. [Mascots — Astro Tulip & Momo the Panda](#7-mascots--astro-tulip--momo-the-panda)
8. [Content: The 10 Starter Scenarios](#8-content-the-10-starter-scenarios)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Backend Architecture](#10-backend-architecture)
11. [Data Model](#11-data-model)
12. [LLM Integration](#12-llm-integration)
13. [Safety, Privacy & Ethics](#13-safety-privacy--ethics)
14. [Cost Analysis](#14-cost-analysis)
15. [Roadmap & Milestones](#15-roadmap--milestones)
16. [File Structure](#16-file-structure)
17. [Open Decisions](#17-open-decisions)

---

## 1. Product Overview

**Astro** is a mobile app that helps people with social anxiety practice real-world interactions before, during, and after they happen — through AI-powered roleplay, situational reminders, and a gentle wins journal.

**Problem.** People with social anxiety avoid everyday interactions (ordering food, making phone calls, speaking up in class, joining conversations). Existing anxiety apps focus on meditation or general CBT, but don't help with the *specific moment* someone is about to do the hard thing.

**Solution.** A pocket companion that:
- Lets users **practice the interaction first** via chatbot roleplay
- **Reminds and preps** users before real scheduled events ("dinner with friends at 7 PM Friday")
- Helps them **reflect and track small wins** afterward

**Positioning.** A supportive tool, not therapy. Warm, non-clinical, low-pressure. Can be used alongside professional care.

**Primary differentiator.** Situational specificity + lived-in roleplay. Most anxiety apps are generic; Astro knows you're dreading *this* specific coffee order on *Thursday*.

---

## 2. Target Users

Primary: **teens (13–17), college students (18–24), and young adults (25–34)** who experience social anxiety that limits daily functioning but isn't at acute-crisis level.

Secondary: Older adults, neurodivergent users (particularly autistic users who prefer explicit scripts), users in recovery from more severe anxiety working on exposure.

**Not for:** Users in crisis (app surfaces crisis resources instead), users seeking formal therapy or diagnosis, very young children.

**Business model (phase 1):** Free, self-funded. Phase 2: institutional sponsorship (schools, employers, health systems).

---

## 3. Core Features

| Feature | Status in Prototype | Description |
|---|---|---|
| Onboarding (guest-first) | ✅ Full | 3-step onboarding with age, situation selection, reminder preference |
| Scenario library | ✅ 10 scenarios | Browsable, filterable practice library |
| Roleplay chat | ✅ Scripted demo (Coffee) | Tap-to-respond chat; LLM in production |
| Prep flow (3-step) | ✅ Full | Breathing orb → script preview → pre-anxiety rating |
| Grounding / breathing | ✅ Full with setup | User picks 1–5 rounds; repeat/exit when done |
| Reminders | ✅ Mocked | List + add; real build uses local notifications |
| Wins journal | ✅ Mocked | List, entry view, new entry |
| Mood check-in | ✅ UI only | 5-emoji home tile; persists to DB in real build |
| Crisis resources | ✅ Full | Always-reachable, phone/text lines, safe exit |
| Dark mode | ✅ Full | System-wide toggle; every token has dark variant |
| Guest mode | ✅ | Data stays on device; upgrade anytime |

---

## 4. Screen Inventory (All 22 Pages)

Each page exists in `bao-app/index.html` as a React component. Component names in **bold**.

### Onboarding & Auth (7 screens)

1. **Splash** — Astro Tulip brand mark, wordmark "Astro", tagline "A kinder way to practice.", CTA "Get started."
2. **Welcome** — 3 swipeable slides introducing the app's value, varying mascot moods.
3. **AccountChoice** — "Continue as guest" (primary), "Sign up with email", "Sign in" link.
4. **GuestConfirm** — Reassurance screen explaining guest mode + privacy lock card.
5. **Onboarding Step 1** — Age range selector.
6. **Onboarding Step 2** — Multi-select "what feels hardest" from the 10 scenarios.
7. **Onboarding Step 3** — Reminder intensity (Gentle / Balanced / Full support).

### Tab Screens (5 persistent tabs)

8. **Home** — Date, greeting, gradient mascot card, mood check-in, suggested scenario, upcoming reminder, quick help (Grounding / Journal).
9. **Practice** — Category filter pills, scenario cards with difficulty dots.
10. **Reminders** — Intro card, reminder list with "Prep" shortcuts.
11. **Journal** — Intro card, wins entry cards with tags.
12. **Me** — Guest profile, streak card, settings (dark mode, privacy, crisis, delete), disclaimer.

### Stack Screens (10 modal/pushed screens)

13. **ScenarioDetail** — Emoji hero, title, difficulty, "You'll practice" + "Who you'll meet" cards, CTA "Start prep".
14. **Prep Step 1** — Breathing orb, "Let's breathe for a moment.", CTA "I'm ready".
15. **Prep Step 2** — Script preview in tinted card, "You don't have to say it word-for-word."
16. **Prep Step 3** — Pre-anxiety rating (1–10 grid), CTA "Start roleplay" (disabled until rated).
17. **Roleplay** — Chat with mascot avatar, tap-to-respond choices, typing indicator, "Finish & reflect" on completion.
18. **Reflection** — Cheering mascot, post-anxiety rating, "One thing that went okay?" textarea, CTA "Save to journal".
19. **AddReminder** — Event label, date, time, related scenario chips.
20. **JournalNew** — Title input + body textarea.
21. **Crisis** — Crisis-red header, 988 / Crisis Text Line / 911 rows, grounding offer. **No crisis chip, no nav.**
22. **Breathing** — Setup (pick 1–5 rounds) → Running (animated orb + round counter) → Done (repeat or exit).

---

## 5. User Flows

### Flow A — First-time user (core test path)
Splash → Welcome (3 slides) → Account Choice → Continue as guest → Guest Confirm → Onboarding 1 → 2 → 3 → Home → tap suggested scenario (Coffee) → Scenario Detail → Prep 1 → 2 → 3 → Roleplay (3 exchanges) → Reflection → Home

### Flow B — Schedule a real event
Home → Reminders tab → + → Add Reminder (label, date, time, scenario) → Save → back to list

### Flow C — Crisis access (must work from every non-modal screen)
Any tab screen → tap coral "I'm not okay" chip → Crisis resources → back

### Flow D — Grounding exercise (quick help)
Home → Quick help → Grounding → pick rounds (1–5) → Start → animated breathing → Done → Go again / I feel steadier

### Flow E — Free-form journal entry
Home → Journal tab → + → Journal New → save → back to list

### Flow F — Dark mode
Any tab → Me → tap Dark mode toggle → all screens re-theme

---

## 6. Design System

### 6.1 Color Palette

**Light mode**

| Token | Hex | Use |
|---|---|---|
| `bg/page` | `#FBF8FF` | App background |
| `bg/surface` | `#FFFFFF` | Cards, nav |
| `text/primary` | `#2D2A3E` | Body text, icons |
| `text/secondary` | `#6B6880` | Metadata, captions |
| `brand/primary` | `#8E78D0` | Primary buttons, active states |
| `brand/primary-soft` | `#E8E0FB` | Secondary buttons, subtle fills |
| `accent/sage` | `#7FAE7F` | Success, streak elements |
| `accent/sky` | `#6FA5D1` | Calming / breathing |
| `warn/soft` | `#F2B5B5` | "I'm not okay" chip, soft warnings |
| `crisis` | `#E8655C` | Crisis-only screens |

**Dark mode** — Matched inversion with `bg/page = #1A1826`, `bg/surface = #252236`, `text/primary = #F0EEF8`. All branded hues lifted (`brand/primary = #C9BAF5`) for contrast.

All token pairs verified at WCAG AA (≥ 4.5:1 body text).

### 6.2 Typography

**Nunito** (Google Fonts, free). Weights 400 / 600 / 700 / 800.

| Style | Size | Use |
|---|---|---|
| Display XL | 30pt/800 | Welcome titles, reflection hero |
| Display LG | 26pt/800 | Onboarding titles, scenario detail |
| Title MD | 20pt/700 | Section headers |
| Title SM | 16pt/700 | Card titles |
| Body MD | 16pt/400 | Main body |
| Body SM | 14pt/400 | Secondary |
| Caption | 13pt/400 | Metadata |
| Overline | 11pt/800 1.2 tracking | All-caps labels |
| Button | 16pt/700 | Button labels |

Minimum tap target: 44×44pt. Dynamic type supported.

### 6.3 Spacing, Radius, Elevation

- **Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64
- **Screen padding:** 20pt horizontal, 24pt top/bottom
- **Card padding:** 16pt internal, 12pt between cards
- **Radius:** card 16 / button 12 / modal 20 / pill 999
- **Shadow:** single soft `0 4 16 rgba(45,42,62,0.08)` on cards only
- **Motion:** 220ms ease-out default, 3000ms for breathing phases, 120ms press scale 0.98. No bouncy springs.

### 6.4 Component Library

13 reusable components — Button, Card, TopBar, BottomNav, ScenarioCard, DifficultyDots, ChatBubble, CrisisChip, RatingGrid, ChoiceButton, BreathingOrb, Input, Toggle/Chip.

Full anatomies in `bao-app/FIGMA-HANDOFF.md` Section 5.

### 6.5 Iconography

Custom inline SVG icon set (14 icons) styled after **Phosphor Icons** (duotone weight). Stroke 1.8pt, rounded caps/joins, 22pt default size.

---

## 7. Mascots — Astro Tulip & Momo the Panda

Astro uses a **dual-mascot system**. Each has a clearly-defined role to avoid brand confusion. Placeholder SVGs in the prototype; final art to be commissioned.

### 7.1 Astro Tulip — the brand mark

The primary identity of the app. Used wherever the app introduces itself.

**Personality (visual):** Calm, symbolic, minimal. Not a character — a symbol. Blooming, gentle, warm.

**Visual language:**
- Classic tulip silhouette: three rounded petal bumps at the top, narrow base
- Bold dark outline (`#2D2A3E`, 2.2pt stroke)
- Pink gradient fill (`#FBC9D6` → `#ED8FA3`)
- Brown stem (`#8B5E3C`)
- Two sage green teardrop leaves curling outward from the base (`#A8C9A8` → `#7AA67A`)
- Closed-crescent eyes, small pink cheek dots, tiny smile
- Middle petal peak is softened/rounded — not sharply pointed

**Where it appears:**
- App icon on the phone home screen
- Splash screen (first frame at launch)
- Brand lockup in the top bar of every tab screen (28pt + "Astro" wordmark)
- Welcome slide 1 (first-run onboarding)
- Journal entry icons (16-22pt tulip mark — "wins bloom" metaphor)
- Empty states ("Your wins bloom here")
- Celebration / milestone moments
- All external marketing, pitch decks, App Store listing

**Deliverables:**
- SVG master with `showLeaves` / `showStem` / `showFace` toggles
- App icon master: 1024×1024 with rounded-square lilac-to-sky gradient background
- Sizes used in-app: 16, 22, 28, 48, 56, 120, 180 pt

### 7.2 Momo the Panda — the companion

The in-app companion the user interacts with. Has a name (Momo) and a face that can emote. Not the brand — just the friend.

**Personality:** Warm, calm, slightly shy, supportive. Thinks with the user, not at them. Think Finch / Headspace — not Duolingo.

**Visual language:**
- Closed-crescent eyes by default (peaceful, non-staring)
- Rounded chibi head + small body peek + tiny paws
- Pink cheek blush always present
- Sage green leaf accent on one ear
- Black dot nose, small content smile
- White body (`#FFFFFF` → `#F5F0FC` subtle gradient, not pure white)
- No dark eye mask / no eye patches on the face

**Required moods (5):**
| Mood | Used on | Visual distinction |
|---|---|---|
| `calm` | Default, home mascot card | Small content smile, standard cheeks |
| `listen` | Roleplay chat avatar | Same as calm; subtle head-tilt optional |
| `cheer` | Post-reflection wins, streak milestones | Slightly wider closed smile, slightly rosier cheeks |
| `concern` | Near crisis chip, high pre-anxiety ratings | Soft eyebrows appear, neutral-line mouth, paler cheeks |
| `breathing` | Grounding exercise screen | Small parted-O mouth mimicking breath |

All moods share the same peaceful closed-crescent eyes — emotion is carried by mouth and cheek intensity only.

**Where Momo appears:**
- Welcome slides 2 & 3 (introduced by name: "Meet Momo")
- Home screen mascot greeting card
- Roleplay chat avatar (32pt) next to each assistant message
- Breathing / grounding screen
- Post-session reflection hero (cheer mood)
- Crisis screen subtle accent (concern mood)

**Deliverables per mood:** SVG + PNG @ 1x/2x/3x, at sizes 32, 56, 72, 110, 130, 160, 200 pt.

Full illustration brief with AI-image-tool prompt seed in `FIGMA-HANDOFF.md` Section 8.

### 7.3 Visual consistency between the two

- Both mascots use **closed-crescent eyes** by default — same eye language unifies them as a family
- Both use the same **pink cheek blush** aesthetic
- Both use the same **sage green accent** (leaf on panda ear, leaves on tulip stem)
- Both use the same **dark outline color** (`#1A1826` – `#2D2A3E`)

This means when the user sees Momo during a roleplay and the Astro Tulip on the splash, they feel like siblings, not strangers.

---

## 8. Content: The 10 Starter Scenarios

Each scenario has: `id`, `emoji`, `title`, `short`, `difficulty` (1–5), `category`, `summary`, `character`, `opener`, `script`.

| # | Emoji | Title | Diff | Category |
|---|---|---|---|---|
| 1 | ☕ | Ordering Coffee at a Counter | 1 | Food & Drink |
| 2 | 🧭 | Asking a Stranger for Directions | 1 | Out & About |
| 3 | 🍽️ | Asking a Server About the Menu | 2 | Food & Drink |
| 4 | 📞 | Calling to Book an Appointment | 2 | Phone Calls |
| 5 | 🛍️ | Returning an Item to a Store | 3 | Out & About |
| 6 | 🎓 | Asking a Professor After Class | 3 | School & Work |
| 7 | 💬 | Small Talk with a Classmate | 3 | School & Work |
| 8 | 🎉 | Joining a Group Conversation at a Party | 4 | Social Events |
| 9 | 👥 | Speaking Up in a Group Meeting | 4 | School & Work |
| 10 | 🫶 | Declining an Invitation Kindly | 5 | Social Events |

**Status:** All 10 are drafted. **Pending clinical review** before public ship. Full data lives in `index.html` (`SCENARIOS` constant and `getScript()`).

Human-written assets for each scenario (to be produced): 3-step prep flow text, reflection prompts, AI roleplay system prompt.

---

## 9. Frontend Architecture

### 9.1 Prototype (this file)
- **Stack:** Single HTML file, React 18 UMD via CDN, Tailwind CDN (JIT), Babel Standalone for in-browser JSX.
- **Why:** Zero build step, runs on any static host or locally with `python3 -m http.server`.
- **Served by:** `python3 -m http.server 4173 --directory bao-app` (see `.claude/launch.json`).
- **Entry:** `bao-app/index.html` — one file, one React tree, router via `useState`.

### 9.2 Production build (planned)
- **Framework:** React Native + Expo (iOS + Android from one codebase)
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind for React Native) — reuses all design tokens
- **State:** Zustand or React Context for local app state; TanStack Query for server state
- **Navigation:** React Navigation (native stack + bottom tabs)
- **Storage:** `expo-secure-store` for tokens, AsyncStorage for non-sensitive preferences, Supabase client for server-synced data
- **Push & local notifications:** `expo-notifications`
- **Build & ship:** Expo EAS for build, TestFlight / Play internal testing for early users

**Why Expo:** One codebase, over-the-air updates, managed push, simple builds, already-bundled permissions handling for notifications.

### 9.3 Routing map
```
AuthStack (until onboarded):
  Splash → Welcome → AccountChoice → [Guest | Auth] → Onboarding (1/2/3)

AppTabs (once onboarded):
  Home | Practice | Reminders | Journal | Me

Modal/Pushed (from any tab):
  ScenarioDetail → Prep → Roleplay → Reflection
  AddReminder
  JournalNew
  Crisis
  Breathing
  Settings sub-screens
```

### 9.4 Component architecture

```
App
├── ThemeProvider (light/dark)
├── AuthProvider (guest or user)
├── Router
│   ├── AuthStack
│   └── AppTabs
│       └── StackScreens (modals)
└── CrisisOverlay (global listener for crisis keywords)
```

---

## 10. Backend Architecture

### 10.1 Stack

**Supabase** (recommended — see PANS-style comparison below).

| Component | Service | Purpose |
|---|---|---|
| Auth | Supabase Auth | Email magic link, guest→upgrade flow, OAuth optional later |
| Database | Supabase Postgres | All app data, versioned via migrations |
| Security | Row-Level Security (RLS) | Per-user data isolation |
| Storage | Supabase Storage | Optional — not used in MVP |
| LLM proxy | Supabase Edge Functions (Deno) | Hides API key, enforces rate limits, logs tokens |
| Realtime | Supabase Realtime | Not used in MVP (reserved for future co-practice features) |
| Push | Expo Push Service | FCM/APNS via Expo, backend-agnostic |
| Local reminders | `expo-notifications` on-device | No server involvement |

### 10.2 Why Supabase over Firebase
- Postgres fits relational data (users, sessions, messages) naturally
- RLS is one clean SQL policy per table, vs. Firebase rules gotchas
- Edge Functions count is generous (500K/mo free)
- Open-source and self-hostable — no lock-in
- Easier path to data-export/privacy features required by Apple/Google

### 10.3 Edge Function: `/roleplay-turn`

Single function handles every roleplay turn. Responsibilities:
1. Validate JWT (or guest token)
2. Rate-limit (per user + per IP)
3. Load session + last N messages from DB
4. Run **crisis classifier** on user message (local regex → escalate to LLM only if ambiguous)
5. If crisis: return pre-written crisis card + log to `crisis_flags`, do NOT call LLM
6. Otherwise: call LLM (Gemini Flash / Claude Haiku) with scenario system prompt + history
7. Log both user and assistant messages to DB with token counts
8. Return assistant reply

Hard limits enforced: 20-turn cap per session, 200-token output, 400-token system prompt.

---

## 11. Data Model

All tables have RLS: users can read/write only their own rows.

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | FK → `auth.users.id` |
| `age_range` | text | '13-17' / '18-24' / '25-34' / '35+' / null |
| `reminder_pref` | text | 'gentle' / 'balanced' / 'full' |
| `onboarding_scenarios` | text[] | IDs selected during onboarding |
| `is_guest` | boolean | True until upgraded |
| `created_at` | timestamptz | |

### `scenarios` (read-only, seeded)
| Column | Type |
|---|---|
| `id` | text (pk) |
| `title` | text |
| `short` | text |
| `emoji` | text |
| `difficulty` | int (1–5) |
| `category` | text |
| `summary` | text |
| `character` | text |
| `opener` | text |
| `script` | text |
| `system_prompt` | text |
| `is_active` | boolean |

### `sessions`
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `scenario_id` | text → scenarios |
| `started_at` | timestamptz |
| `ended_at` | timestamptz |
| `turn_count` | int |
| `pre_anxiety` | int (1–10) |
| `post_anxiety` | int (1–10) |
| `completed` | boolean |

### `messages`
| Column | Type |
|---|---|
| `id` | uuid |
| `session_id` | uuid → sessions |
| `role` | text ('user' / 'assistant' / 'system') |
| `content` | text |
| `tokens_in` | int |
| `tokens_out` | int |
| `created_at` | timestamptz |

### `journal_entries`
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `title` | text |
| `body` | text (**encrypted at rest client-side**) |
| `session_id` | uuid → sessions (nullable) |
| `tag` | text (nullable) |
| `created_at` | timestamptz |

### `reminders`
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `label` | text |
| `event_time` | timestamptz |
| `scenario_id` | text (nullable) |
| `notification_schedule` | jsonb |

### `mood_logs`
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `rating` | int (1–5 emoji index) |
| `note` | text (nullable) |
| `logged_at` | timestamptz |

### `crisis_flags`
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `session_id` | uuid (nullable) |
| `message_excerpt` | text |
| `detected_at` | timestamptz |
| `reviewed` | boolean (internal) |

---

## 12. LLM Integration

### 12.1 Model choice by phase

| Phase | Users | Model | Cost/session | Notes |
|---|---|---|---|---|
| Prototype | 20 testers | None (scripted) | $0 | Current state |
| Alpha | 20–100 | Gemini 2.5 Flash | ~$0.002 | Free tier for small volume |
| Beta | 100–1,000 | Claude Haiku 4.5 + prompt caching | ~$0.012 | Better roleplay quality |
| v1 | 1,000+ | Haiku + routing to Sonnet for heavy convos | ~$0.015 avg | Hybrid to manage cost |

### 12.2 System prompt template (per scenario)

Stored in `scenarios.system_prompt`. Structure:

```
You are playing {character} in a roleplay to help a user practice: {title}.

Character behavior:
- {character description}
- Stay in character. Do not break the fourth wall.
- Keep replies 1-2 sentences, natural and casual.
- If the user says something unclear, ask for clarification naturally.

Boundaries:
- If the user expresses distress, crisis, or wanting to harm themselves, immediately break character with exactly this message: "It sounds like this is hard right now. Let's pause — would you like to see some grounding options or crisis resources?"
- Never give medical, legal, or therapeutic advice.
- Never claim to apply a specific therapy protocol.
- If the user asks who you are, you're a roleplay character, not a therapist.

Scene opener (already shown to user):
{opener}
```

### 12.3 Token budget per session

- System prompt: ~400 tokens (cached)
- Per user turn: ~100 tokens
- Per AI turn: ~150 tokens (max_tokens: 200)
- Hard cap: 20 turns
- With caching: ~3K real input + ~2K output = ~5K billable tokens/session

### 12.4 Rate limits (enforced in Edge Function)

- Free tier: 3 roleplays/day, 20 free-form chat messages/day
- Cooldown: 30s between messages
- Monthly cap per guest: 90 sessions

---

## 13. Safety, Privacy & Ethics

### 13.1 Non-negotiables

1. **Crisis detection.** Multi-layer:
   - On-device keyword list (runs before every LLM call)
   - Edge Function regex check (server-side, redundant)
   - LLM itself instructed to break character on distress signals
   - Crisis resources always reachable within 2 taps
2. **Scope disclaimer.** "Astro is a supportive tool, not therapy or a medical device." Shown during onboarding and in Me tab. Keeps product outside FDA/Health Canada medical-device territory.
3. **No data sale. Ever.** Stated in privacy policy and onboarding.
4. **Journal encryption.** Client-side encryption with user-controlled key for `journal_entries.body`. Even a database breach doesn't expose content.
5. **Guest mode first.** No sign-up required to use core features. Anxiety users shouldn't face friction to get help.
6. **No dark patterns.** No streaks that shame missed days ("gentle streaks" that don't reset). No manipulative notifications. No upgrade-paywall on core safety features.

### 13.2 Compliance targets

- **COPPA** (under-13): age gate at onboarding blocks under-13 accounts.
- **GDPR / CCPA:** Data export + delete in Me tab.
- **Apple App Store guidelines 5.1.1 (data), 5.4 (VPN/crypto), 1.4.1 (mental health claims):** met via disclaimers + no diagnostic claims.
- **Google Play mental-health content policies:** met via sensitive content labeling and non-prescriptive tone.

### 13.3 Clinical validation path

- Drafted scenarios (all 10) to be reviewed by a licensed therapist (target: CBT/exposure specialist)
- Prep flow text and reflection prompts also reviewed
- System prompts for roleplays reviewed before alpha
- Citations to published protocols in a "Behind the content" in-app page (not in the live chat)

---

## 14. Cost Analysis

### 14.1 Testing phase (20 users)

| Item | Cost |
|---|---|
| Supabase (free tier) | $0 |
| Gemini Flash free tier | $0 |
| Expo / EAS hobby | $0 |
| Apple Developer (TestFlight) | $99 / year |
| Google Play Console | $25 one-time |
| Illustrator (5 panda moods) | $200–500 one-time (optional) |
| **Monthly run rate** | **$0–10** |

### 14.2 Scale projections

| Users | Supabase | LLM (Haiku cached) | Total /mo |
|---|---|---|---|
| 100 | $0 (free tier) | ~$20 | **~$20** |
| 1,000 | $25 (Pro) | ~$180 | **~$205** |
| 10,000 | $25–100 | ~$1,800 | **~$1,900** |
| 100,000 | $599+ | ~$18,000 | **~$18,600** |

Cost-per-user at scale: ~$0.19/MAU/month. Target for institutional funding: break even at ~$1.50/MAU/month in sponsorship.

### 14.3 Token optimization strategy

Already baked into the architecture:
1. Prompt caching (cuts cost ~60%)
2. Haiku 4.5 as default (10× cheaper than Sonnet)
3. Context cap at 15 turns
4. `max_tokens: 200`
5. Static scenario openers (no LLM call for first turn)
6. Static prep / reflection content (zero LLM cost)
7. Local crisis classifier (saves a classification call per message)
8. Per-user rate limits

---

## 15. Roadmap & Milestones

### M0 — Prototype (DONE)
Interactive web prototype in `bao-app/index.html`. All 22 screens, all flows wired, placeholder mascot, 10 scenarios with one fully-scripted demo.

### M1 — User Validation (1–2 weeks)
- Share web prototype with 20 testers
- Collect feedback on tone, pacing, clarity
- Iterate on copy and flow
- Clinical review of the 10 scenarios in parallel

### M2 — Design Polish (1–2 weeks)
- Designer rebuilds in Figma from the handoff doc
- Commission real panda mascot (5 moods)
- Final color tuning with actual illustrations in context

### M3 — Alpha Build (3–4 weeks)
- Scaffold Expo / React Native app
- Port prototype screens to native components (reuse tokens)
- Wire Supabase auth + DB + RLS
- Build Edge Function for roleplay (Gemini Flash first)
- Local notifications via expo-notifications
- TestFlight / Play internal — same 20 testers move onto the real app

### M4 — Beta (2 months)
- Clinical reviewer signs off on content
- Expand to 100–500 users via TestFlight / invite link
- Switch Gemini → Haiku 4.5 when roleplay quality needs to improve
- Add mood trend charts
- Add voice practice (optional scope)

### M5 — Public Launch
- App Store + Play submission
- Privacy policy + terms published
- Landing page with institutional-sponsor pitch
- Begin outreach to schools / employee-assistance programs

---

## 16. File Structure

### Current (prototype)
```
/Users/shreeyasharma/Documents/Python_Projects/Social_Test/
├── .claude/
│   └── launch.json            # Preview server config (Python http.server)
├── bao-app/
│   ├── index.html             # Single-file React prototype
│   ├── FIGMA-HANDOFF.md       # Designer spec document
│   └── BAO-MASTER-SPEC.md     # THIS FILE
├── PANS-Tooling-Suggestions.md
└── patient_sample.json
```

### Planned (production)
```
bao/
├── apps/
│   └── mobile/                # Expo React Native app
│       ├── app/               # Expo Router screens (match prototype 1:1)
│       ├── components/        # Reused UI kit
│       ├── lib/
│       │   ├── supabase.ts
│       │   ├── theme.ts
│       │   └── crisis-detector.ts
│       ├── assets/
│       │   ├── tulip/         # Astro Tulip brand mark variants
│       │   └── momo/          # Momo the Panda moods (SVG/PNG)
│       └── app.config.ts
├── supabase/
│   ├── migrations/            # SQL migrations
│   ├── functions/
│   │   └── roleplay-turn/     # Edge Function
│   └── seed.sql               # Scenarios seed data
├── content/
│   ├── scenarios/             # 10 scenarios as individual YAML
│   └── prep-flows/            # Per-scenario static content
├── docs/
│   ├── BAO-MASTER-SPEC.md     # This file
│   ├── FIGMA-HANDOFF.md
│   ├── CLINICAL-REVIEW.md
│   └── PRIVACY-POLICY.md
└── README.md
```

---

## 17. Open Decisions

Decisions that should be made before M2:

| # | Decision | Options | Default recommendation |
|---|---|---|---|
| 1 | Clinical reviewer | Licensed therapist (paid) / research partnership / volunteer | Licensed CBT therapist, paid engagement, ~$500–1,500 |
| 2 | Mascot illustrator | Freelance (Fiverr/Upwork) / AI-generated + edited / in-house | Freelance illustrator, brief ready |
| 3 | iOS-first or Android-first | iOS ($99/yr TestFlight) / Android ($25 once) / both | Both; Android-first for cheaper iteration |
| 4 | Analytics | PostHog / Mixpanel / none | PostHog free tier, strict PII-free events |
| 5 | Error tracking | Sentry / bare logs | Sentry free tier |
| 6 | Journal encryption scheme | Client-side with user key / server-side only | Client-side, user-derived key |
| 7 | Crisis support regions | US/Canada only / US+CA+UK / global | US/Canada first; localize with each market |
| 8 | Mood check-in frequency | Only on Home tap / push-prompted / both | Home tap only (no push pressure) |
| 9 | Name: "Astro" | Stick / change | Stick — short, universal, warm |
| 10 | Branding for teens vs adults | One brand / two subpages / two apps | One brand, age-appropriate copy variants |

---

## Appendix A — Glossary

- **Scenario** — A practice scene (e.g., "Ordering Coffee"). Has a character, opener, script, difficulty.
- **Session** — One user run-through of a scenario, including prep and reflection.
- **Roleplay** — The chat portion of a session.
- **Prep flow** — The 3-step screen before roleplay: breathing, script, pre-rating.
- **Reflection** — Post-roleplay: post-rating + journal prompt.
- **Wins journal** — Lightweight journal specifically for noting small brave acts.
- **Crisis chip** — The coral "I'm not okay" sticky button on non-modal tab screens.
- **Guest mode** — Using the app without an account; data stays on device until upgrade.
- **Gentle streak** — Day-streak counter that never resets to zero, to avoid shame.

---

## Appendix B — Changelog

**v0.1 (current)**
- Initial master spec
- Interactive web prototype scaffolded
- 10 scenarios drafted
- Figma handoff document
- Breathing screen: user-selectable rounds (1–5) with repeat/exit
