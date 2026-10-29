# Picture Form Guide — iPhone install (Stage 2)

Stage 2 is the standalone PWA: training + food logging, plus the shop,
supply crates, and the character figure — all in the CoD depot style, over
an animated hangar backdrop. Everything lives on your phone — no server,
no account. The prestige vault and full rank-insignia artwork come in a
later stage.

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
- **Progress** — XP, level, rank, War Coins (now earned, not display-only),
  2× XP stack with Claim/Activate, bodyweight tracker, full workout history
  with per-lift and per-session delete (XP recalculates; War Coins earned
  are never clawed back once paid).
- **Shop** — MULTIPLAYER/DEPOT header, supply drops, and the Armory.
  Tops are cut like the Saint Script jacket, bottoms like the baggy camo
  cargos; garments show only the verse reference at the hem, with the full
  verse and its meaning behind the ! button. Buying pops an UNLOCKED reveal
  with a futuristic unlock sound. Owned items equip onto your character.
- **Supply crates** — Supply (100 WC), Rare (250 WC), Epic (500 WC).
  Rewards can be gear, coins, or a double-XP token. A duplicate crate
  reward never stacks: a blocking notice with only a scrap/sell-back
  button appears, no other crate can open until it is scrapped, and the
  notice comes back on next open if the app is closed mid-notice.
- **Character** — cartoon action-figure style. Base kit is plain shorts, a
  basic olive fatigues shirt, and ankle boots; everything else is earned
  and equipped. Facial hair: Clean shaven (bare face), Stubble, Beard —
  the mouth always shows. Hand-held items sit in a solid fist that never
  clips the item's top. Mass follows your weigh-ins.
- **War Coins** — earned from sessions (+10), sets (+1 each), reps (+1 per
  5), move-ups (+20), target hits (+30), protein days (+20), calorie days
  (+20), weigh-ins (+15), weekly gains (+30). Weigh-ins, weekly gains,
  and fuel days pay 1.5× through Nov 10, 2026.
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
