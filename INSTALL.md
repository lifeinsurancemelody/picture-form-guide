# Picture Form Guide — iPhone install (Stage 2 refined)

Stage 2 refined matches the shop, XP bars, rank ladder, and prestige
emblems to the original app: a two-row header with a centered rank/XP
module and CLAIM 2× button, the full 20-level rank ladder with CoD-style
insignia, the prestige vault with emblems cut from the Call of Duty 5
prestige reference sheet, a depot-console shop with a 4-day rotating
shelf, and the Progress / Held / Reset strength board. Everything lives
on your phone — no server, no account.

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
- **Header** — two rows on phones: week, coins, and sound up top; the
  centered rank module below (rank insignia, rank name, XP bar) with a
  short CLAIM 2× button. The button glows when a charge is claimable and
  grays out when not; claiming plays the claim sting with a spark burst.
  The stacked ×N counter sits at the bottom of the button and on the
  shop coin bar. Claim/Activate rules are unchanged.
- **Rank ladder** — Progress → Rank Ladder (collapsible): all 20 levels,
  Private through Commander, each with its own CoD-style insignia
  (chevrons and rockers building stripe by stripe; First Sergeant's
  diamond, Sergeant Major's star, Command Sergeant Major's star +
  wreath; officer bars, oak leaves, colonel's eagle, generals' stars),
  with earned / current / locked states.
- **Prestige vault** — Progress → Prestige Vault (collapsible): all ten
  prestige emblems, cut directly from the Call of Duty 5 prestige
  reference sheet. You are at Prestige 0, so all ten show LOCKED; the
  Preview button plays the boom-and-chord prestige stinger without
  changing any state. Private personal use only.
- **Shop console** — the shop now has a left console (desktop) with the
  three supply drops (Rare lit green), an Armory / Collections / Ledger
  menu, and a next-rotation bar. Clicking a crate selects it and its
  odds turn green. The shelf rotates daily: 9 items a day over 4 days
  from the 36-item catalog; "Full armory" shows everything. Buy, equip,
  UNLOCKED reveal, crate prices/odds, and the airtight duplicate rule
  are unchanged.
- **Strength board** — Progress → Strength Board tallies Progress
  (move-ups), Held, and Reset from scored history. First-time lifts and
  seeded lifts aren't counted.
- **Sounds** — claim sting, unlock sound, crate sounds, prestige
  stinger, and a gunshot-style celebration when a lift scores a
  move-up or rolls a target up. Level-up still plays your own MP3, with
  the mute toggle remembered.
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

## 2026-10-29 artifact snapshot sync

The PWA now syncs to the Muse artifact app's dashboard (91 XP, level 10, 802 WC, 4 banked 2× charges with one active, all sessions through the Oct 29 Pull day, weights through Oct 28, food days back to Sep 28, 11 owned items, character equipped with Run the Race tank + dog tags + Field Bible, clean shaven). Rules: sessions/weights/food are added by date only (never duplicated, never overwriting); synced sessions carry xp:null lifts so deleting one never moves the total, and they bank no new 2× charges. Totals/coins/character/targets apply only when the stored state still matches the Oct 28 snapshot (83 XP, 1,160 WC, no session after Oct 14) — if he logged in the PWA since, only the missing dated records are added. Known gaps vs the artifact: dogtag-micah, figure-night, hoodie-camo-verse, and joggers-charcoal have no PWA catalog match and were not invented; hair/skin options don't exist in the PWA character, so those stay default; the PWA has one cable-pushdown slot (arms page) while the artifact tracks push (50) and arms (60) separately — the synced target is 60. Weight note: the artifact logs 151.4 lbs on the night of Oct 15 while the PWA seed holds 148.6 lbs that day; the PWA value was NOT overwritten. Service worker bumped to pfg-pwa-v4 so this update propagates whether it ships with the refinement text push or after it.
