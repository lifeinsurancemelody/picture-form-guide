# Picture Form Guide — iPhone install (Stage 1)

Stage 1 is the standalone PWA: training + food logging only. Shop, crates,
character figure, and the prestige vault come in later stages. Everything
lives on your phone — no server, no account.

## Install on iPhone

1. Host these files somewhere (any static host works — this build is not
   published yet, so this step happens when hosting is chosen).
2. On your iPhone, open the site in **Safari**.
3. Tap **Share** (the square with the arrow pointing up).
4. Tap **Add to Home Screen**, then **Add**.
5. Open it from the new **Form Guide** icon. It opens full-screen like a
   real app, and works offline after the first visit.

## How it works

- **Days** — D1 Arms + Laterals (Tue), D2 Push (Wed), D3 Pull (Thu),
  D4 Legs (Fri). Each exercise card has a real photo, target sets/reps,
  form cues, and a "Log this lift" button.
- **Log** — save each lift on its own; saving one lift never wipes the
  others from today's session. Hitting a goal (checkbox, or top of the rep
  range on every set) rolls the next target up using real gym loads:
  dumbbells +5 lbs (skipping 7.5s and 22.5s), cables to the next stack
  setting (40 → 50, never 45).
- **Nutrition** — log food as you go. The day shows "Today" with a
  countdown to midnight; each entry saves immediately onto the running
  total. Anything logged after midnight counts for the next day, and an
  app left open across midnight rolls over on its own.
- **Progress** — XP, level, rank, War Coins (display only for now), 2× XP
  stack with Claim/Activate, bodyweight tracker, full workout history
  with per-lift and per-session delete (XP recalculates).
- **Backup** — Progress → Backup → Export saves all data as JSON.
  Import it back any time. Do this before clearing Safari data.

## Seeded state

XP 83, Level 9, 2× stack 2 with one bonus active, 1,160 War Coins.
Last full sessions seeded from the real record (Arms 2026-10-13, Push
2026-10-14, Pull 2026-10-08, Legs 2026-10-09). Today's food for
2026-10-28 is seeded (Taco Bell items, ~1,720 cal / ~53g protein).
Week 12 is recorded as completed without lift numbers — none were
invented. All calorie and protein figures are estimates.

## Updating

This is a static site: new versions are published by replacing these
files on the host. The phone picks up the new version on next launch
(the service worker cache version is bumped per release).
