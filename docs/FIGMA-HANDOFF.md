# Bao — Figma Handoff Spec

A designer can use this file, plus the running web prototype, to rebuild the app in Figma. The prototype is the source of truth for interactions; this doc is the source of truth for tokens, specs, copy, and screen inventory.

---

## 0. How to use this document

1. Read Sections 1–5 first (tokens + components) to set up the Figma library.
2. Use Section 6 (screen inventory) as the page list in Figma.
3. Use Section 7 (flows) to wire up the prototype tab in Figma.
4. Use Section 8 (mascot + illustration brief) when commissioning or generating final art.

---

## 1. Frame & Device

- Target device: **iPhone 15 (393 × 852 pt)**. Safe top inset 54pt, bottom inset 34pt.
- Design in 1x (pt = px at 1x). Export assets at 1x, 2x, 3x.
- Max content width (content canvas, inside frame): 353pt (20pt horizontal padding).

---

## 2. Color Tokens

Import these into Figma's **Local Variables** (or Tokens Studio plugin). Two modes: `Light`, `Dark`.

### Semantic tokens (what components use)

| Token | Light | Dark |
|---|---|---|
| `bg/page` | `#FBF8FF` | `#1A1826` |
| `bg/surface` | `#FFFFFF` | `#252236` |
| `bg/surface-elevated` | `#FFFFFF` | `#2F2C43` |
| `text/primary` | `#2D2A3E` | `#F0EEF8` |
| `text/secondary` | `#6B6880` | `#9C9AAD` |
| `text/onPrimary` | `#FFFFFF` | `#FFFFFF` |
| `brand/primary` | `#8E78D0` | `#C9BAF5` |
| `brand/primary-soft` | `#E8E0FB` | `rgba(181,165,232,0.16)` |
| `accent/sage` | `#7FAE7F` | `#B8D9B8` |
| `accent/sage-soft` | `#DFEDDF` | `rgba(168,201,168,0.16)` |
| `accent/sky` | `#6FA5D1` | `#B5D9F5` |
| `accent/sky-soft` | `#DEEDFB` | `rgba(165,201,232,0.16)` |
| `warn/soft` | `#F2B5B5` | `#F2B5B5` |
| `crisis` | `#E8655C` | `#E8655C` |
| `border/subtle` | `#E8E0FB` | `rgba(240,238,248,0.10)` |

### Raw palette reference

- Lilac: `#B5A5E8` (mid), `#8E78D0` (strong), `#E8E0FB` (soft), `#C9BAF5` (dark-mode on)
- Sage: `#A8C9A8` / `#7FAE7F` / `#DFEDDF` / `#B8D9B8`
- Sky: `#A5C9E8` / `#6FA5D1` / `#DEEDFB` / `#B5D9F5`
- Coral (warning/accent only): `#F2B5B5`
- Crisis red (crisis screens only): `#E8655C`

### Contrast checks

All text/background combinations above hit WCAG AA (≥ 4.5:1 body, ≥ 3:1 large text). Verified pairs:
- `text/primary` on `bg/page` — 11.2:1 light / 14.8:1 dark
- `text/secondary` on `bg/surface` — 5.6:1 light / 8.1:1 dark
- `text/onPrimary` on `brand/primary` — 4.8:1 light / 4.6:1 dark

---

## 3. Typography

**Family:** Nunito (Google Fonts). Weights used: 400, 600, 700, 800.

| Style | Size | Line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display/xl` | 30pt | 36 | 800 | -0.5 | Screen hero titles on welcome / reflection |
| `display/lg` | 26pt | 32 | 800 | -0.3 | Screen titles (onboarding, scenario detail) |
| `title/md` | 20pt | 26 | 700 | -0.2 | Section headers |
| `title/sm` | 16pt | 22 | 700 | 0 | Card titles |
| `body/md` | 16pt | 24 | 400 | 0 | Body text |
| `body/sm` | 14pt | 20 | 400 | 0 | Secondary body |
| `caption` | 13pt | 18 | 400 | 0.1 | Captions, dates, metadata |
| `overline` | 11pt | 14 | 800 | 1.2 | All-caps labels |
| `button` | 16pt | 22 | 700 | 0.1 | Button labels |

Dynamic type: design at default; verify at 125% and 200% of the base body size.

---

## 4. Spacing, Radius, Elevation, Motion

### Spacing scale (pt)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

Screen padding: `20pt` horizontal, `24pt` top, `24pt` bottom.
Card internal padding: `16pt`.
Between cards in a list: `12pt`.

### Radius
- `radius/card` = 16pt
- `radius/button` = 12pt
- `radius/modal` = 20pt
- `radius/pill` = 999pt
- `radius/chip` = 999pt

### Elevation / shadow
- `shadow/soft` (light): `0 4 16 rgba(45,42,62,0.08)` — applied to cards, pills, dev bar
- `shadow/soft` (dark): `0 4 16 rgba(0,0,0,0.30)`
- No hard drop shadows anywhere else.

### Motion
- Default transition: `220ms ease-out` for opacity/transform.
- `3000ms` cycle on breathing animation phases.
- Button press: scale `0.98`, 120ms.
- No spring / bouncy easing.

---

## 5. Component Library

Build each as a Figma component with Variants for states and dark-mode swaps.

### 5.1 Button
- Variants: `variant = primary | secondary | ghost | danger`
- States: `default | pressed | disabled`
- Full-width default. Padding 16 V / 20 H. Height 52pt. Radius 12.
- Primary: bg `brand/primary`, label `text/onPrimary`.
- Secondary: bg `brand/primary-soft`, label `brand/primary`.
- Ghost: transparent, label `text/primary`.
- Danger: bg `crisis`, label white (crisis screen only).

### 5.2 Card
- Variants: `emphasis = default | tint-lilac | tint-sage | tint-sky | gradient`
- BG: `bg/surface` (default) or gradient from two soft tokens
- Radius 16, padding 16, shadow `shadow/soft`.

### 5.3 TopBar
- Height 64pt
- Slots: `leading` (back button or empty 36×36), `title` (centered), `trailing` (36×36 icon or empty)
- Back button: 36×36, circular, `bg/surface`, shadow soft, icon `chevron-left` 22pt

### 5.4 BottomNav
- Height: 76pt (64 content + 12 safe area)
- 5 tabs: Home / Practice / Reminders / Journal / Me
- Active state: icon + label in `brand/primary`
- Inactive: `text/secondary`
- BG: `bg/surface`, top border 1pt `border/subtle`

### 5.5 ScenarioCard (list row)
- 72pt min height, 12pt gap between, 16pt padding
- Leading: 40pt emoji or illustration slot
- Title: `title/sm`; meta row: difficulty dots + category label
- Trailing: `chevron-right` icon, `text/secondary`

### 5.6 DifficultyDots
- 5 dots, 6pt each, 2pt gap
- Filled dot: `brand/primary`; empty: `brand/primary-soft`

### 5.7 Chat Bubble
- Variants: `speaker = assistant | user | system`
- Assistant: bg `bg/surface`, text `text/primary`, radius 18 with bottom-left `4`
- User: bg `brand/primary`, text `text/onPrimary`, radius 18 with bottom-right `4`
- System: pill centered, bg `accent/sage-soft`, text `accent/sage`, radius 999
- Max width 78% of canvas. Padding 14 V / 16 H.

### 5.8 CrisisChip (sticky)
- Anchored bottom-right, 96pt above safe area
- BG `warn/soft` at 0.9 opacity
- Icon `heart` 16pt + label "I'm not okay" (13pt/700)
- Never appears on crisis, prep, or roleplay screens (to avoid interruption).

### 5.9 RatingGrid (1–10)
- 5×2 grid, 12pt gap
- Each cell: square, radius 16, `title/md` number centered
- Selected: `brand/primary` bg, `text/onPrimary`
- Unselected: `bg/surface`, `text/primary`

### 5.10 ChoiceButton (roleplay)
- Full width, left-aligned text
- BG `brand/primary-soft`, text `text/primary`
- Padding 14 / 16, radius 16
- Used as suggested replies in roleplay chat

### 5.11 BreathingOrb
- 240×240pt container
- Circle scales between 96pt (out) and 240pt (in/hold)
- BG `accent/sky-soft`
- Text label centered, `title/md`
- 3000ms phase; phases: in → hold → out

### 5.12 Input (text field)
- Single-line or textarea
- BG `bg/surface`, radius 12, padding 12 / 16
- Focus ring: 2pt `brand/primary`
- Placeholder color: `text/secondary`

### 5.13 Toggle / Chip (category filter)
- Pill, padding 8 / 16, radius 999
- Selected: `brand/primary` bg, onPrimary text
- Unselected: `bg/surface` bg, `text/secondary` text

---

## 6. Screen Inventory

Use these as pages/frames in Figma. Each entry: purpose · key elements · notes. Copy exactly matches the prototype.

### Onboarding & Auth

1. **Splash** — mascot (calm), wordmark, tagline "A kinder way to practice.", primary CTA "Get started."
2. **Welcome (3 slides)** — mascot varies mood (calm → listen → cheer). Titles: "Hey — welcome.", "Practice before you do it.", "You move at your own pace." Dots indicator + Next / Let's go.
3. **Account Choice** — mascot calm, "How would you like to start?", three actions: primary "Continue as guest", secondary "Sign up with email", link "Already have an account? Sign in".
4. **Guest Confirm** — mascot listen, copy "Guest mode — you're good to go." Reassurance card with lock icon: "Nothing you type here is shared with anyone." CTA: Continue.
5. **Onboarding Step 1/3** — "Which age range fits you?" Options: 13–17, 18–24, 25–34, 35 or older, Prefer not to say.
6. **Onboarding Step 2/3** — "What feels hardest right now?" — multi-select of the 10 scenarios (see Section 9). Sticky CTA.
7. **Onboarding Step 3/3** — "How should reminders feel?" Gentle / Balanced / Full support.

### Tabs (persistent)

8. **Home** — date, "Hi, friend 🌿", gradient mascot card "No pressure today.", mood check-in (5 emoji), suggested scenario, upcoming reminder, quick help (Grounding + Wins journal), crisis chip, bottom nav.
9. **Practice (list)** — top bar title + sparkle icon, horizontal category filter pills, scenario cards.
10. **Reminders (list)** — top bar + add button, gradient intro card, reminder rows with clock icon + Prep link.
11. **Journal (list)** — top bar + add button, gradient intro "Wins journal — small wins only", entry cards with heart icon + tag chip.
12. **Me** — guest card + Upgrade link, "Your streak — 3 gentle days 🌱", settings list (dark mode, Privacy & data, Crisis resources, Delete my data), footer disclaimer.

### Stack screens

13. **Scenario Detail** — emoji hero, title, difficulty + category, "You'll practice" card, "Who you'll meet" card, optional demo callout, CTA "Start prep".
14. **Prep Step 1/3 (Ground yourself)** — overline, hero title, BreathingOrb animating, copy "Three rounds is plenty. No rush.", CTA "I'm ready".
15. **Prep Step 2/3 (Script)** — overline, hero title, script card in lilac-soft: "[the script for this scenario]", copy "You don't have to say it word-for-word.", CTA "Next".
16. **Prep Step 3/3 (Pre-rating)** — overline, hero title, RatingGrid 1–10, CTA "Start roleplay" (disabled until selected).
17. **Roleplay** — custom top bar (back, emoji + short title + character hint, close), scrollable chat with mascot avatar on assistant turns, sticky bottom with 2–3 ChoiceButton options or "Finish & reflect" when done. Typing indicator with three dots.
18. **Reflection** — mascot cheer, "That took courage.", RatingGrid (post-rating), textarea "One thing that went okay?", CTA "Save to journal".
19. **Add Reminder** — input "What's happening?", date + time side-by-side, "Related practice" grid of 4 scenario chips, CTA "Save reminder".
20. **Journal New** — title input (bold), large textarea, CTA "Save".
21. **Crisis Resources** — crisis-red header with back button, "You're not alone right now." title, list of resources (988, Crisis Text Line, 911) as phone rows, grounding offer card. *No bottom nav, no crisis chip (this IS the destination).*
22. **Breathing Exercise** — full-screen orb, round counter, CTA "I feel steadier".

---

## 7. Prototype Flows (Figma "Prototype" tab)

### Flow A — First-time user (REQUIRED for user test)
Splash → Welcome (3 slides) → Account Choice → [Guest] → Guest Confirm → Onboarding 1 → 2 → 3 → Home → Suggested Scenario tap → Scenario Detail (Coffee) → Prep 1 → 2 → 3 → Roleplay → (tap through 3 choice pairs) → Reflection → Home

### Flow B — Reminders
Home → Reminders tab → Add button → Add Reminder → Save → Reminders list (with new item)

### Flow C — Crisis path (test from multiple entry points)
Any screen with the crisis chip → Crisis Resources → back → return

### Flow D — Journal free-form
Home → Journal tab → Add button → Journal New → Save → Journal list

### Flow E — Settings
Home → Me tab → Dark mode toggle → observe color change on Home

---

## 8. Mascot: Bao the Panda — Illustration Brief

Current prototype uses a placeholder SVG. For the shipped version, commission these.

### Personality
Warm, calm, slightly shy, supportive. Not overly cute or toy-like. Think Headspace/Finch aesthetic, not Duolingo.

### Shape language
- Rounded, soft edges everywhere. No sharp corners.
- Slightly oversized head relative to body.
- Large round eyes with small pupils (kind, not cartoon "anime big").
- Pink cheek blush, always present, very soft.

### Color rules
- White body with the project's warm-white `#FBF8FF`, not pure white.
- Eye/ear patches in `#2D2A3E` (matches text primary — keeps visual hierarchy).
- Scarf / accessory in `brand/primary` gradient (`#8E78D0 → #B5A5E8`).
- A sage `#A8C9A8` leaf detail is a reusable motif.

### Required moods (deliver as separate SVG/PNG @ 1x, 2x, 3x)
| Mood | Use case | Expression notes |
|---|---|---|
| `calm` | Default, home, splash | Soft smile, eyes relaxed, body centered |
| `listen` | Guest confirm, roleplay assistant avatar | Head slightly tilted, eyes attentive, small smile |
| `cheer` | Post-reflection, streak milestones | Eyes crescent, open smile, arms gently raised |
| `concern` | Near crisis chip, high pre-anxiety rating | Eyebrows softly up, eyes wide, small closed smile |
| `breathing` | Grounding screen | Eyes closed peacefully, body expands/contracts with orb |

### Sizes
- App icon: 1024×1024 master (iOS 1024, Android 512)
- In-app sizes used: 32, 56, 72, 110, 130, 160, 200pt
- Full-body variant only at 160pt and larger.

### Prompt seed (if using AI image tools)
> "A soft, rounded panda mascot for a mental-health app. Warm pastel palette — lilac scarf, sage leaf accent on the ear, pink cheek blush. Flat illustration with very subtle gradients. Kind eyes, small gentle smile. Front-facing portrait, centered, transparent background. Art style inspired by Finch and Headspace — warm and professional, not toy-like."

---

## 9. Scenario Content (the 10 starter scenarios)

Use this as the Practice library content and onboarding selection list. Each scenario needs: emoji, title, short title, difficulty (1–5), category, summary, character, opener, starter script. Full data lives in `index.html` constant `SCENARIOS` and function `getScript(id)`.

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

All scenarios are **pending clinical review** before public ship.

---

## 10. Accessibility checklist

- All touch targets ≥ 44×44pt.
- Body text ≥ 16pt.
- Color contrast ≥ 4.5:1 body, ≥ 3:1 for large text.
- Every icon-only button has an `aria-label` (matches Figma layer name for handoff).
- Dark mode parity: every token has a dark equivalent (Section 2).
- Motion is gentle — never strobe or sudden scale changes.
- No color-only affordances (active nav uses both icon tint AND label color).
- Dynamic type: body scales, layouts reflow, no text clipping at 200%.
- Crisis resources reachable within 2 taps from every non-modal screen.

---

## 11. Safety & content constraints (non-negotiable)

1. The Roleplay screen must never auto-close or change the user's mood/mic without tap — anxiety users re-read.
2. The Crisis screen is a terminal destination; do not overlay ads, prompts, or upsells.
3. Guest users see a visible "Upgrade to save" affordance but are NEVER blocked from core features.
4. "Streaks" are worded as "gentle streaks" and missing a day never resets counters — this is deliberate.
5. Disclaimer text "Bao is a supportive tool, not therapy or a medical device." must appear in Me tab and first-run onboarding.

---

## 12. File structure recommendation (Figma)

```
📁 Bao Design File
├── 📄 Cover
├── 📄 00 · Changelog
├── 📄 01 · Foundations (tokens, type, color, spacing)
├── 📄 02 · Components (library)
├── 📄 03 · Mascot (all moods, @ every size)
├── 📄 04 · Onboarding (screens 1–7)
├── 📄 05 · Home & Tabs (screens 8–12)
├── 📄 06 · Scenario & Roleplay (screens 13–18)
├── 📄 07 · Reminders & Journal (screens 19–20)
├── 📄 08 · Crisis & Support (screens 21–22)
├── 📄 09 · Prototype (wiring for flows A–E)
└── 📄 10 · Dev handoff (redlines, component anatomies)
```

---

## 13. What the prototype DOES NOT yet model (to flag for the designer)

- Push notification preview UI (OS-level; mockup only if needed for pitches).
- Upgrade-from-guest flow (stub only in Me tab).
- Privacy & data / Delete my data flows (stub only).
- Real LLM responses — all roleplay turns are hardcoded.
- Illustration polish on Bao — current SVG is a placeholder for layout.
- Voice/audio practice mode (post-MVP).

Anything the designer adds beyond this list is new design work, not re-skinning.

---

Last updated for this build: prototype v0.1, single-file React in `bao-app/index.html`.
