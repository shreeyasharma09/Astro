# Astro 🌿

A gentle practice space for social anxiety — a pocket companion for the moments before, during, and after real-world interactions. Ordering coffee, making phone calls, small talk, joining a conversation, saying no.

## Vercel Live Link
https://astro-sap.vercel.app/

## Status

🌱 **Interactive prototype complete.** Pending: clinical review of scenarios, commission of final mascot art, React Native build.

## What it does

Three modes for three moments:
1. **Before** — practice the interaction via gentle AI roleplay
2. **During** — quick grounding and reminder nudges
3. **After** — reflect and note small wins in a journal

## Try it

Open [`prototype/index.html`](./prototype/index.html) in any browser. Or run locally:

```bash
python3 -m http.server 4173 --directory prototype
```

Then visit http://localhost:4173.

## The Journey

This repo intentionally documents the thinking and drafting — not only the final output.

- [Master Spec](./docs/ASTRO-MASTER-SPEC.md) — full product, design, backend, and cost documentation
- [Figma Handoff](./docs/FIGMA-HANDOFF.md) — designer specification
- [Logo Lab](./prototype/logo-lab.html) — exploration of mascot directions
- [Refinement Lab](./prototype/refinement-lab.html) — mascot iteration
- [Decisions](./docs/decisions/) — short records of why we made key choices (growing over time)

## The 10 starter scenarios

All pending clinical review before public ship.

1. ☕ Ordering coffee at a counter
2. 🧭 Asking a stranger for directions
3. 🍽️ Asking a server about the menu
4. 📞 Calling to book an appointment
5. 🛍️ Returning an item to a store
6. 🎓 Asking a professor after class
7. 💬 Small talk with a classmate
8. 🎉 Joining a group conversation at a party
9. 👥 Speaking up in a group meeting
10. 🫶 Declining an invitation kindly

## Tech

- **Prototype:** single HTML file, React via CDN, Tailwind via CDN — zero build step
- **Planned production:** React Native (Expo) + Supabase + Gemini/Claude LLM
- **Design:** pastel palette (lilac / sage / sky), Nunito type, dark mode throughout
- **Mascot:** Astro the panda — peaceful closed-eye SVG

## Safety

Astro is a supportive tool, not therapy or a medical device. Crisis resources (988 Lifeline, Crisis Text Line) are reachable within 2 taps from any non-modal screen.

## License

MIT — see [LICENSE](./LICENSE)

## Notes

Built as a documented collaboration. Commit history intentionally reads as a draft log, not a polished retcon.
