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

The PWA now syncs to the Muse artifact app's dashboard (91 XP, level 10, 802 WC, 4 banked 2× charges with one active, all sessions through the Oct 29 Pull day, weights through Oct 28, food days back to Sep 28, 15 owned items (11 original + the 4 parity-build catalog additions, owned with no charge), character equipped with Run the Race tank + dog tags + Field Bible, clean shaven). Rules: sessions/weights/food are added by date only (never duplicated, never overwriting); synced sessions carry xp:null lifts so deleting one never moves the total, and they bank no new 2× charges. Totals/coins/character/targets apply only when the stored state still matches the Oct 28 snapshot (83 XP, 1,160 WC, no session after Oct 14) — if he logged in the PWA since, only the missing dated records are added. Known gaps vs the artifact: hair/skin options don't exist in the PWA character, so those stay default. Weight note: the artifact logs 151.4 lbs on the night of Oct 15 while the PWA seed holds 148.6 lbs that day; the PWA value was NOT overwritten. Service worker bumped to pfg-pwa-v4 so this update propagates whether it ships with the refinement text push or after it.

## Parity build (local, not yet deployed — sw.js pfg-pwa-v5)

Closes the gaps vs the Muse artifact app: Push day now has its own
cable-pushdown exercise (target 50, own history) and the Oct 14 / 21 / 28
push sessions' pushdowns (50 lbs) were migrated to it from the arms-day
slot; arms-day pushdown history (60 lbs) is untouched, and phones that
already synced get the same move via migrateState. XP now scores move-up
+1, goal/milestone +1, held/reset +0, first-time +1 (artifact ledger).
War Coins now pay session +25, move-up +15, target hit +10 (sets +1,
reps +1 per 5 unchanged); the 1.5× boost on weigh-ins, weekly gains, and
fuel days through Nov 10, 2026 stays. History gains copy-to-today and
load-back-to-form; re-saving a lift now replaces its XP instead of
double-counting. Food delete recalculates the day's bonus flags and claws
back the bonus XP (coins stay permanent). Shop gains era badges + filter
('90s / 2026 / timeless), 4 catalog additions (dogtag-micah,
hoodie-camo-verse, joggers-charcoal, Night Ops figure) taking the catalog
to 40 items, so the 4-day shelf is now 4×10 anchored 2026-10-27. The
Strength Board tallies progression labels regardless of xp:null (seeded
+ synced lifts count; only first-time "Logged" lifts have no progression label
and aren't counted; there is no first-time board column). Locker "!"
buttons, a Sounds tab, CSS crate-opening + muzzle-flash animations, and
a figure-variant selector are in. Prestige is now earnable: at 200 XP
the PRESTIGE button banks one prestige and resets XP to 0 / Level 1;
coins, gear, history, and double-XP charges carry over; vault emblems
light per prestige count. Achievements (14) and quests (6, weekly) are a
new draft for approval — recognition only, no XP or WC rewards. Phone
fixes: sticky header + sticky chips use safe-area-inset-top, bottom nav
keeps safe-area-inset-bottom, weigh-in Date/Weight rows wrap and stack
under 480px, all 12 Progress cards collapse with persisted state, and
the character is reworked to the 'GIVE 'EM LEAD' reference style
(bold-outline cel-shaded muscular cartoon; base = military tee +
fatigue shorts + ankle boots; moustache is a toggleable facial-hair
option; full gear via equipped items; mass scales visibly with
weigh-ins). Seeded/synced history is never rescored. Achievements,
quests, and the prestige-earning trigger from the old plan are now
built as specified above; nothing in this section is deferred except
on-phone confirmation of rendering, taps, sounds, and the safe-area
header on a real notched iPhone.

## Follow-up: owned union + seeded labels (local, not yet deployed — sw.js pfg-pwa-v6)

The four parity-build catalog additions are now marked owned with no
charge (proven artifact-owned): Micah Dog Tags (dogtag-micah), Camo Verse
Hoodie (hoodie-camo-verse), Charcoal Joggers (joggers-charcoal), Night Ops
Figure (figure-night). The snapshot sync unions them into the owned set on
existing phones (unguarded, like the original owned union) and the
fresh-install seed owns all 15 items; a second run is a no-op. The Camo
Verse Hoodie's verse/word stays blank pending the user's call — nothing
invented. The four seeded sessions now carry artifact-record progression
labels (Oct 8 pull: Move-up/Move-up/Held/Held; Oct 9 legs:
Move-up/Move-up/Move-up/Held; Oct 13 arms:
Move-up/Move-up/Move-up/Move-up/Held/Reset; Oct 14 push: 4× Move-up under
the push-day pushdown exercise), so the Strength Board counts full history:
44 Progress / 7 Held / 7 Reset (seeded 13/4/1 + synced 31/3/6). Lifts stay
xp:null — labeling never moves any XP total. Phones that already synced
get the same seeded labels via a backfill in the sync (only lifts still
saying "Seeded" are relabeled; re-saved lifts untouched). Service worker
bumped to v6 so this app.js change propagates to phones that installed v5.

## Shop + character polish round (local only, NOT deployed)
- Verses: all 16 scripture items now carry the FULL KJV verse + plain-language
  meaning + reference in the Details ("!") panel; garments still show only the
  reference at the hem. Saint -> Dan 7:18, Camo Verse Hoodie -> 2 Tim 2:3
  (wordmark SOLDIER), both user-approved delegated picks (2026-10-29).
  Shepherd expanded to the full Psalm 23; Armor expanded to Eph 6:10-17.
  FAITH -> Heb 11:1, FEAR NOT -> Isa 41:10 (classic fills, flagged pending
  his correction); dogtag-micah -> Mic 6:8 (inferred from the name, flagged).
  Night Ops Tank stays verse-less by design; non-scripture gear has no verse.
- Item previews reskinned (modest): Saint-jacket boxy cuts, baggy cargo cuts,
  richer cel shading, crisper gear detail. Names, prices, IDs, verses, eras
  unchanged.
- Character v2: rebuilt to the 'GIVE 'EM LEAD' reference (bold outlines,
  layered cel shading, muscular proportions, expressive face, gold-trim
  jacket, crisscross-laced tall boots). Base stays tee + shorts + ankle
  boots; moustache stays toggleable with the mouth always visible; mass
  formula unchanged (1.000 / 1.101 / 1.160). Also fixed: the Night Ops
  Figure variant now actually renders the night palette (the app stored
  "figure-night" but the builder only matched "night").
- Shop polish: item windows much more transparent (blur + translucent wash)
  over the animated green shop background; details panels keep a darker wash
  for readability. Logic untouched.
- sw.js bumped v6 -> v7. The eventual deploy push MUST include sw.js.
- CHARACTER SHIPS ONLY AFTER THE USER APPROVES THE PREVIEW
  (~/workspace/char-preview.html — preview only, never deploys).

- Realistic character photos (slightly-cartoonish style, user-approved):
  Character tab now shows generated photos instead of the code-drawn SVG
  figure (the SVG builder is retained but no longer rendered). 8 photos in
  assets/character/: base, base-moustache, fullkit, fullkit-moustache,
  base-dogtags, base-bible, base-loadout, base-saint-jacket. Tier is
  full-kit if a jacket, bandolier, pouch, cap, goggles, or tall boots are
  equipped, else base; slot photos override the tier photo for clean
  faces only (Saint jacket > dogtags+bible > dogtags > bible), with an
  onerror fallback to the tier photo. Moustache toggle still works;
  stubble/beard fall back to the clean photo of the tier. Mass uses the
  same formula as a CSS scale (1.000 / 1.101 / 1.160 at 140 / 152.6 /
  165 lbs). Night Ops Figure ("figure-night" or "night") applies a dark
  blue-tinted CSS filter. Shop thumbnails keep the SVG reskin.
- sw.js bumped v7 -> v8 (character photos added to the precache). The
  eventual deploy push MUST include sw.js, and the 8 character photos
  are binaries: they need the browser upload route BEFORE the text push,
  or the v8 service worker precache fails.
- Preview: ~/workspace/char-preview.html (preview only, never deploys).

## Shop upgrade round (local only, NOT deployed)
- Shop background is now a generated depot scene (assets/shop/depot-scene.webp, 366KB, precached, sw.js v10): sergeant at a crate-table with a glowing laptop, mug, bullets, papers, hangar + aircraft behind. It breathes via CSS (shopBreathe), the laptop area glows in a slow pulse, fine dust drifts; all disabled under prefers-reduced-motion.
- Typing video: attempted once via media.generate_video; it failed with a local worker file-access error and was NOT retried (per instruction). The CSS-animated static scene ships instead — breathing + glow + dust give the alive feel; true typing motion would need a video and remains a future option.
- Layout toward the MULTIPLAYER DEPOT reference: left-side glass menu panels, glassy supply-drop cards (Rare glows green), title + counters head with a NEXT DEPOT CREDIT progress bar. Items still overlay and scroll over the scene.
- Clothes reskin toward camo urban street: tops are boxier/oversized with denser camo prints and a hem tag; bottoms are wider baggy street cargos with bigger bellows pockets, side stripe, and drawstrings. Names, prices, IDs, verses, and eras untouched.
- Deploy note: depot-scene.webp is a binary — upload via the browser route BEFORE the text push (styles.css, sw.js v10, app.js, index.html), or the v10 precache fails.
