/* Picture Form Guide PWA — Stage 1 (training + food only).
   All data lives on-device in localStorage. No server, no accounts.
   Pure logic is written dependency-free so it can be verified outside a browser. */
"use strict";

/* ---------------- Reference data ---------------- */
const DAYS = [
  { id: "arms",  short: "D1 Arms",  name: "Arms + Laterals", weekday: "Tuesday" },
  { id: "push",  short: "D2 Push",  name: "Push",            weekday: "Wednesday" },
  { id: "pull",  short: "D3 Pull",  name: "Pull",            weekday: "Thursday" },
  { id: "legs",  short: "D4 Legs",  name: "Legs",            weekday: "Friday" }
];
const DAY_BY_WEEKDAY = { 2: "arms", 3: "push", 4: "pull", 5: "legs" }; // JS getDay(): Tue=2..Fri=5

const EXERCISES = [
  // Arms + Laterals
  { id: "cable-lateral-raise", day: "arms", name: "Cable Lateral Raises", photo: "assets/photos/cable-lateral-raise.jpg", load: "cable", sets: 4, repMin: 12, repMax: 12, weight: 20, display: "20 lbs", cues: "Stand sideways to the stack, lead with your elbow, stop at shoulder height. No swinging." },
  { id: "db-lateral-raise", day: "arms", name: "DB Lateral Raises", photo: "assets/photos/db-lateral-raise.jpg", load: "db", sets: 3, repMin: 10, repMax: 12, weight: 10, display: "10s", cues: "Slight lean forward, pour the pitchers at the top, control the way down." },
  { id: "bicep-curl", day: "arms", name: "Bicep Curls", photo: "assets/photos/bicep-curl.jpg", load: "db", sets: 3, repMin: 10, repMax: 12, weight: 25, display: "25s", cues: "Elbows pinned at your sides, no swinging. Full stretch at the bottom." },
  { id: "cable-pushdown", day: "arms", name: "Cable Pushdowns", photo: "assets/photos/cable-pushdown.jpg", load: "cable", sets: 3, repMin: 12, repMax: 15, weight: 50, display: "50 lbs", cues: "Elbows locked to your ribs, press to full lockout, slow return." },
  { id: "incline-curl", day: "arms", name: "Incline Curls", photo: "assets/photos/incline-curl.jpg", load: "db", sets: 2, repMin: 12, repMax: 15, weight: 15, display: "15s", cues: "Bench at about 60 degrees, arms hang straight down, curl without moving your upper arm." },
  { id: "overhead-extension", day: "arms", name: "Overhead Cable Extensions", photo: "assets/photos/overhead-extension.jpg", load: "cable", sets: 2, repMin: 12, repMax: 15, weight: 40, display: "40 lbs", cues: "Face away from the stack, elbows pointing up, stretch deep then lock out." },
  // Push
  { id: "bench-press", day: "push", name: "Bench Press", photo: "assets/photos/bench-press.jpg", load: "db", sets: 4, repMin: 8, repMax: 12, weight: 40, display: "40 lbs", cues: "Shoulder blades pinched, slight arch, touch and press without bouncing." },
  { id: "overhead-press", day: "push", name: "Overhead Press", photo: "assets/photos/overhead-press.jpg", load: "db", sets: 3, repMin: 10, repMax: 15, weight: 20, display: "20s", cues: "Ribs down, press straight up, head through at the top." },
  { id: "incline-press", day: "push", name: "Incline Press", photo: "assets/photos/incline-press.jpg", load: "db", sets: 3, repMin: 10, repMax: 15, weight: 20, display: "20s", cues: "Bench at about 30 degrees, touch upper chest, press up and slightly back." },
  // Pull
  { id: "lat-pulldown", day: "pull", name: "Lat Pulldown", photo: "assets/photos/lat-pulldown.jpg", load: "cable", sets: 4, repMin: 8, repMax: 12, weight: 80, display: "80 lbs", cues: "Chest up, pull elbows to your ribs, full stretch at the top." },
  { id: "single-arm-row", day: "pull", name: "Single-Arm Rows", photo: "assets/photos/single-arm-row.jpg", load: "db", sets: 3, repMin: 10, repMax: 12, weight: 40, display: "40 lbs", cues: "One hand on the bench, pull to your hip, no twisting." },
  { id: "face-pull", day: "pull", name: "Face Pulls", photo: "assets/photos/face-pull.jpg", load: "cable", sets: 3, repMin: 12, repMax: 15, weight: 40, display: "40 lbs", cues: "Rope to your forehead, elbows high, squeeze your shoulder blades." },
  { id: "hammer-curl", day: "pull", name: "Hammer Curls", photo: "assets/photos/hammer-curl.jpg", load: "db", sets: 3, repMin: 12, repMax: 15, weight: 20, display: "20s", cues: "Neutral grip, thumbs up, curl slightly across your body." },
  // Legs
  { id: "goblet-squat", day: "legs", name: "Goblet Squats", photo: "assets/photos/goblet-squat.jpg", load: "db", sets: 4, repMin: 12, repMax: 15, weight: 35, display: "35 lbs", cues: "Weight at your chest, elbows inside knees, chest tall." },
  { id: "romanian-deadlift", day: "legs", name: "Romanian Deadlifts", photo: "assets/photos/romanian-deadlift.jpg", load: "db", sets: 3, repMin: 12, repMax: 15, weight: 20, display: "20s", cues: "Hips back, soft knees, feel the hamstrings load, flat back." },
  { id: "walking-lunge", day: "legs", name: "Walking Lunges", photo: "assets/photos/walking-lunge.jpg", load: "db", sets: 2, repMin: 10, repMax: 12, weight: 15, display: "15s", cues: "Long steps, torso tall, back knee kisses the floor." },
  { id: "calf-raise", day: "legs", name: "Calf Raises", photo: "assets/photos/calf-raise.jpg", load: "db", sets: 2, repMin: 15, repMax: 20, weight: 10, display: "10s", cues: "Full stretch at the bottom, pause at the top of every rep." }
];
const EX_BY_ID = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
const CABLE_STACK = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 140, 160, 180, 200];
const RANKS = ["Private", "Private First Class", "Lance Corporal", "Corporal", "Sergeant",
  "Staff Sergeant", "Sergeant First Class", "Master Sergeant", "First Sergeant", "Sergeant Major",
  "Command Sergeant Major", "Second Lieutenant", "First Lieutenant", "Captain", "Major",
  "Lieutenant Colonel", "Colonel", "Brigadier General", "Major General", "Commander"];
const XP_CAP = 200, XP_PER_LEVEL = 10;
const CAL_TARGET = 3200, PROTEIN_TARGET = 140;

/* ---------------- Pure helpers ---------------- */
function dateKey(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function parseDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function fmtDate(key) {
  return parseDate(key).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
/* Training weeks auto-update from the calendar date, anchored on week 11 starting Mon 2026-10-12. */
function weekFor(d) {
  const anchor = Date.UTC(2026, 9, 12);
  const day = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return 11 + Math.floor((day - anchor) / (7 * 86400000));
}
function levelForXp(xp) { return Math.min(20, Math.floor(xp / XP_PER_LEVEL) + 1); }
function rankForLevel(level) { return RANKS[level - 1]; }
/* Real gym loads: dumbbells +5, skipping 7.5s and 22.5s (they don't exist at his gym);
   cables move to the next 10-lb stack setting, 40 -> 50, never 45. */
function nextLoad(ex, weight) {
  if (ex.load === "cable") {
    const n = CABLE_STACK.find((s) => s > weight);
    return n === undefined ? weight : n;
  }
  let n = weight + 5;
  if (n === 7.5) n = 10;
  if (n === 22.5) n = 25;
  return n;
}
function fmtWeight(ex, weight) {
  if (ex.load === "db" && ex.id !== "bench-press" && ex.id !== "goblet-squat" && ex.id !== "single-arm-row") return weight + "s";
  return weight + " lbs";
}
function totalReps(reps) { return reps.reduce((a, b) => a + b, 0); }
/* Lift scoring vs the previous session's same lift. */
function scoreLift(prev, curWeight, curReps) {
  if (!prev) return { label: "Logged", xp: 1 };
  const prevTotal = totalReps(prev.reps), curTotal = totalReps(curReps);
  if (curWeight > prev.weight) return { label: "Move-up", xp: 2 };
  if (curWeight === prev.weight && curTotal > prevTotal) return { label: "Move-up", xp: 2 };
  if (curWeight === prev.weight && curTotal === prevTotal) return { label: "Held", xp: 1 };
  return { label: "Reset", xp: 0 };
}
function dayTotals(day) {
  if (!day) return { cal: 0, protein: 0 };
  return day.entries.reduce((t, e) => ({ cal: t.cal + e.cal, protein: t.protein + e.protein }), { cal: 0, protein: 0 });
}
function weekKeyOf(dateStr) {
  const d = parseDate(dateStr);
  const monday = new Date(d);
  const shift = (d.getDay() + 6) % 7; // days since Monday
  monday.setDate(d.getDate() - shift);
  return dateKey(monday);
}
function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

/* ---------------- Seed state (verified values only) ---------------- */
function seedState() {
  const targets = {};
  EXERCISES.forEach((e) => { targets[e.id] = { weight: e.weight, sets: e.sets, repMin: e.repMin, repMax: e.repMax }; });
  const lift = (weight, reps, extra) => Object.assign({ weight, reps, goalHit: false, xp: null, label: "Seeded" }, extra || {});
  return {
    version: 2,
    profile: { name: "Anthony", age: 31, height: "5'11\"", startWeight: 140, goalWeight: 165, creatine: 5 },
    xpTotal: 83,
    coins: 1160,
    doubleXp: { stack: 2, active: true, claimable: 0 },
    owned: [],
    equipped: Object.assign({}, EMPTY_EQUIPPED),
    facialHair: "beard",
    pendingDuplicate: null,
    weights: [
      { date: "2026-09-22", weight: 140 },
      { date: "2026-10-15", weight: 148.6 }
    ],
    weightXpWeeks: [],
    targets,
    sessions: [
      { date: "2026-10-08", dayId: "pull", doubled: null, lifts: {
        "lat-pulldown": lift(80, [15, 8, 8, 8], { note: "First set at 70 lbs" }),
        "single-arm-row": lift(40, [10, 10, 12]),
        "face-pull": lift(40, [12, 12, 12]),
        "hammer-curl": lift(15, [15, 12, 13]) } },
      { date: "2026-10-09", dayId: "legs", doubled: null, lifts: {
        "goblet-squat": lift(35, [12, 12, 12, 12]),
        "romanian-deadlift": lift(20, [15, 15, 15]),
        "walking-lunge": lift(15, [12, 12]),
        "calf-raise": lift(10, [20, 20]) } },
      { date: "2026-10-13", dayId: "arms", doubled: null, lifts: {
        "cable-lateral-raise": lift(20, [12, 12, 12, 12]),
        "db-lateral-raise": lift(10, [10, 10, 10]),
        "bicep-curl": lift(25, [12, 10, 10]),
        "cable-pushdown": lift(50, [15, 15, 10]),
        "incline-curl": lift(15, [15, 15]),
        "overhead-extension": lift(40, [12, 12]) } },
      { date: "2026-10-14", dayId: "push", doubled: null, lifts: {
        "bench-press": lift(35, [12, 10, 10, 10]),
        "overhead-press": lift(20, [15, 12, 10]),
        "incline-press": lift(20, [12, 11, 15]),
        "cable-pushdown": lift(50, [12, 12, 12]) } }
    ],
    // Training week 12 (all four days) is recorded as completed without lift numbers.
    completedWeeks: ["2026-10-19"],
    foodDays: {
      "2026-10-28": { entries: [
        { id: "seed1", name: "Taco Bell cheesy bean and rice burrito ×3", cal: 1260, protein: 39, time: "13:40" },
        { id: "seed2", name: "Taco Bell spicy potato soft taco ×2", cal: 460, protein: 14, time: "13:40" }
      ], bonus: { protein: false, cal: false } }
    },
    muted: false
  };
}

/* ---------------- State actions (pure: take state, return info) ---------------- */
function findSession(state, dateStr) { return state.sessions.find((s) => s.date === dateStr); }
function prevLift(state, exId, beforeDate) {
  const sorted = state.sessions.filter((s) => s.date < beforeDate).sort((a, b) => b.date.localeCompare(a.date));
  for (const s of sorted) if (s.lifts[exId]) return s.lifts[exId];
  return null;
}
function addXp(state, n) {
  const before = levelForXp(state.xpTotal);
  state.xpTotal += n;
  return { leveledUp: levelForXp(state.xpTotal) > before, newLevel: levelForXp(state.xpTotal) };
}
/* Save one lift. Merges into the day's session; never wipes other lifts.
   A session captures its doubled flag when created: a session started before
   activation is never doubled, and only the next session logged while a bonus
   is on pays double, then the bonus switches off. */
function saveLiftToState(state, dateStr, dayId, exId, weight, reps, goalHit) {
  const ex = EX_BY_ID[exId];
  let session = findSession(state, dateStr);
  let sessionWasNew = false;
  if (!session) {
    session = { date: dateStr, dayId, doubled: state.doubleXp.active, lifts: {} };
    if (state.doubleXp.active) state.doubleXp.active = false;
    state.sessions.push(session);
    sessionWasNew = true;
  }
  const prevForScore = state.sessions
    .filter((s) => s.date < dateStr && s.lifts[exId])
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const scored = scoreLift(prevForScore ? prevForScore.lifts[exId] : null, weight, reps);
  const doubled = session.doubled === true;
  const earned = scored.xp * (doubled ? 2 : 1);
  session.lifts[exId] = { weight, reps, goalHit, xp: earned, label: scored.label };
  const xpInfo = addXp(state, earned);
  // War Coins: new session +10, +1 per set, +1 per 5 reps, +20 on a move-up.
  let coinsEarned = (sessionWasNew ? WC_SESSION : 0) + reps.length * WC_PER_SET + Math.floor(totalReps(reps) / 5) * WC_PER_5_REPS;
  if (scored.label === "Move-up") coinsEarned += WC_MOVEUP;
  state.coins += coinsEarned;
  // Auto-update target: goal checkbox OR top of rep range on every set.
  const target = state.targets[exId];
  const hitTop = reps.length > 0 && reps.every((r) => r >= target.repMax);
  let rolled = null;
  if (goalHit || hitTop) {
    const next = nextLoad(ex, target.weight);
    if (next !== target.weight) {
      target.weight = next;
      state.doubleXp.claimable += 1; // a target move-up banks a claimable 2x charge
      rolled = next;
      state.coins += WC_ROLLUP; // target hit pays War Coins too
      coinsEarned += WC_ROLLUP;
    }
  }
  return { scored, earned, doubled, rolled, sessionWasNew, leveledUp: xpInfo.leveledUp, newLevel: xpInfo.newLevel, coinsEarned };
}
function deleteLiftFromState(state, dateStr, exId) {
  const session = findSession(state, dateStr);
  if (!session || !session.lifts[exId]) return false;
  const xp = session.lifts[exId].xp;
  if (typeof xp === "number") state.xpTotal -= xp; // seeded lifts carry xp:null and never move the total
  delete session.lifts[exId];
  if (Object.keys(session.lifts).length === 0) {
    state.sessions = state.sessions.filter((s) => s !== session);
  }
  return true;
}
function deleteSessionFromState(state, dateStr) {
  const session = findSession(state, dateStr);
  if (!session) return false;
  Object.values(session.lifts).forEach((l) => { if (typeof l.xp === "number") state.xpTotal -= l.xp; });
  state.sessions = state.sessions.filter((s) => s !== session);
  return true;
}
/* Food: the day is resolved from the local clock at the moment of saving. */
function addFoodToState(state, name, cal, protein, dateStr, timeStr) {
  const day = state.foodDays[dateStr] || (state.foodDays[dateStr] = { entries: [], bonus: { protein: false, cal: false } });
  day.entries.push({ id: uid(), name, cal, protein, time: timeStr });
  const totals = dayTotals(day);
  let leveledUp = false, newLevel = levelForXp(state.xpTotal), coinsEarned = 0;
  if (totals.protein >= PROTEIN_TARGET && !day.bonus.protein) {
    day.bonus.protein = true;
    const r = addXp(state, 1); leveledUp = leveledUp || r.leveledUp; newLevel = r.newLevel;
    coinsEarned += wcBoosted(WC_PROTEIN_DAY, dateStr);
  }
  if (totals.cal >= CAL_TARGET && !day.bonus.cal) {
    day.bonus.cal = true;
    const r = addXp(state, 1); leveledUp = leveledUp || r.leveledUp; newLevel = r.newLevel;
    coinsEarned += wcBoosted(WC_CAL_DAY, dateStr);
  }
  state.coins += coinsEarned;
  return { totals, leveledUp, newLevel, coinsEarned };
}
function removeFoodFromState(state, dateStr, entryId) {
  const day = state.foodDays[dateStr];
  if (!day) return false;
  const before = day.entries.length;
  day.entries = day.entries.filter((e) => e.id !== entryId);
  if (day.entries.length === 0) delete state.foodDays[dateStr];
  return day.entries.length !== before;
}
/* Bodyweight: +2 XP per week of average gain, once per week. */
function addWeightToState(state, dateStr, weight) {
  state.weights.push({ date: dateStr, weight });
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  let coinsEarned = wcBoosted(WC_WEIGHIN, dateStr);
  state.coins += coinsEarned;
  const wk = weekKeyOf(dateStr);
  if (state.weightXpWeeks.includes(wk)) return { leveledUp: false, newLevel: levelForXp(state.xpTotal), gained: false, coinsEarned };
  const weeks = {};
  state.weights.forEach((w) => { (weeks[weekKeyOf(w.date)] = weeks[weekKeyOf(w.date)] || []).push(w.weight); });
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const earlier = Object.keys(weeks).filter((k) => k < wk).sort();
  const prevAvg = earlier.length ? avg(weeks[earlier[earlier.length - 1]]) : null;
  if (prevAvg !== null && avg(weeks[wk]) > prevAvg) {
    state.weightXpWeeks.push(wk);
    const gainCoins = wcBoosted(WC_WEEKLY_GAIN, dateStr);
    state.coins += gainCoins;
    coinsEarned += gainCoins;
    const r = addXp(state, 2);
    return { leveledUp: r.leveledUp, newLevel: r.newLevel, gained: true, coinsEarned };
  }
  return { leveledUp: false, newLevel: levelForXp(state.xpTotal), gained: false, coinsEarned };
}
function claimDoubleToState(state) {
  if (state.doubleXp.claimable <= 0) return false;
  state.doubleXp.claimable -= 1;
  state.doubleXp.stack += 1;
  return true;
}
function activateDoubleToState(state) {
  if (state.doubleXp.stack <= 0 || state.doubleXp.active) return false;
  state.doubleXp.stack -= 1;
  state.doubleXp.active = true;
  return true;
}

/* ---------------- Stage 2: shop catalog, War Coins, crates, character ---------------- */
/* War Coins economy. Awards are permanent ledger entries: deleting a lift or
   session recalculates XP but never claws coins back (they may already be spent). */
const WC_MULT_END = "2026-11-10"; // 1.5x on weigh-ins, weekly gains, fuel days through this date
const WC_SESSION = 10, WC_PER_SET = 1, WC_PER_5_REPS = 1, WC_MOVEUP = 20, WC_ROLLUP = 30;
const WC_PROTEIN_DAY = 20, WC_CAL_DAY = 20, WC_WEIGHIN = 15, WC_WEEKLY_GAIN = 30;
function wcMult(dateStr) { return dateStr <= WC_MULT_END ? 1.5 : 1; }
function wcBoosted(n, dateStr) { return Math.round(n * wcMult(dateStr)); }

/* Shop catalog. Tops are all cut like the Saint Script jacket (wide boxy body,
   dropped shoulders, cropped ribbed hem, small script wordmark). Bottoms are all
   cut like the baggy camo cargos (wide legs, bellows pockets, pooled hem).
   Scripture rule: garments show ONLY the verse reference, printed small at the
   hem. The full verse and its plain-language meaning live in the description. */
const SHOP_ITEMS = [
  // ---- Tops ----
  { id: "saint-jacket", name: "Saint Script Jacket", slot: "top", price: 300, cut: "jacket", main: "#e8ddc0", dark: "#c9b98f", accent: "#3a3a3a", word: "Saint", wordStyle: "script", verseRef: "1 Pet 2:9", verse: "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people;", meaning: "You were chosen and set apart — carry yourself like it.", desc: "Cream cropped script jacket with a boxy body, dropped shoulders, and a ribbed hem." },
  { id: "faith-tee", name: "Faith Over Fear Tee", slot: "top", price: 150, cut: "tee", main: "#2e2e2e", dark: "#1c1c1c", accent: "#c8a84a", word: "FAITH", wordStyle: "gothic", verseRef: "Heb 11:1", verse: "Now faith is the substance of things hoped for, the evidence of things not seen.", meaning: "Faith is trusting what you can't see yet — like gains before they show.", desc: "Black oversized gothic tee with a bold FAITH chest print and a cracked vintage wash." },
  { id: "fearnot-tee", name: "Fear Not Gothic Tee", slot: "top", price: 150, cut: "tee", main: "#3a3f2a", dark: "#242816", accent: "#e8e6df", word: "FEAR NOT", wordStyle: "gothic", verseRef: "Isa 41:10", verse: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", meaning: "When the weight feels heavy, you're not facing it alone.", desc: "Olive gothic tee with dripping FEAR NOT lettering across the chest." },
  { id: "strength-cover", name: "Strength Pump Cover", slot: "top", price: 180, cut: "tee", main: "#4a4a44", dark: "#2c2c28", accent: "#c8a84a", word: "Strength", wordStyle: "bold", verseRef: "Phil 4:13", verse: "I can do all things through Christ which strengtheneth me.", meaning: "Your strength for the hard sets comes from beyond yourself.", desc: "Boxy pump cover with a cropped raw hem, made to come off after warm-ups." },
  { id: "shepherd-anorak", name: "Shepherd Anorak", slot: "top", price: 220, cut: "anorak", main: "#6b6f3f", dark: "#4a4d2a", accent: "#e8ddc0", word: "Shepherd", wordStyle: "script", verseRef: "Ps 23:1", verse: "The LORD is my shepherd; I shall not want.", meaning: "Guided and provided for — nothing missing.", desc: "Olive hooded anorak with a roomy boxy cut and a chest pocket." },
  { id: "bestill-tee", name: "Be Still Tee", slot: "top", price: 150, cut: "tee", main: "#d8d2c0", dark: "#b0a888", accent: "#3a3a3a", word: "Be Still", wordStyle: "script", verseRef: "Ps 46:10", verse: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.", meaning: "Stop striving for a second and remember who's in charge.", desc: "Cream boxy tee with a small script wordmark and a soft washed finish." },
  { id: "armor-tee", name: "Armor of God Tee", slot: "top", price: 160, cut: "tee", main: "#23241f", dark: "#14150f", accent: "#c8a84a", word: "Armor", wordStyle: "gothic", verseRef: "Eph 6:11", verse: "Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.", meaning: "Suit up daily — training is a battle too.", desc: "Black gothic tee with gold Armor lettering and a faded cracked print." },
  { id: "eagles-tee", name: "Eagles Soar Tee", slot: "top", price: 160, cut: "tee", main: "#31404f", dark: "#1e2833", accent: "#e8e6df", word: "Eagles", wordStyle: "bold", verseRef: "Isa 40:31", verse: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", meaning: "Waiting on God renews strength instead of draining it.", desc: "Slate boxy tee with a bold Eagles chest print." },
  { id: "courage-crew", name: "Courage Crew", slot: "top", price: 160, cut: "tee", main: "#5c3a2a", dark: "#3d2418", accent: "#e8ddc0", word: "Courage", wordStyle: "bold", verseRef: "Josh 1:9", verse: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", meaning: "Courage isn't the absence of fear — it's moving anyway, with God with you.", desc: "Rust crew-neck tee with a wide boxy body and a cropped ribbed hem." },
  { id: "run-tank", name: "Run the Race Tank", slot: "top", price: 140, cut: "tank", main: "#1f2a22", dark: "#121a14", accent: "#c8a84a", word: "Run", wordStyle: "bold", verseRef: "1 Cor 9:24", verse: "Know ye not that they which run in a race run all, but one receiveth the prize? So run, that ye may obtain.", meaning: "Train like you're running to win, not just to finish.", desc: "Dark green stringer-style tank with a bold Run print." },
  { id: "shield-stringer", name: "Shield Stringer", slot: "top", price: 140, cut: "tank", main: "#3a3a3a", dark: "#222222", accent: "#c8a84a", word: "Shield", wordStyle: "bold", verseRef: "Ps 28:7", verse: "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.", meaning: "God guards you and gives you the strength to keep going.", desc: "Charcoal stringer with a gold Shield print and a faded gym-bro wash." },
  { id: "heartily-tee", name: "Heartily Work Tee", slot: "top", price: 150, cut: "tee", main: "#6b6250", dark: "#4a4436", accent: "#e8ddc0", word: "Heartily", wordStyle: "script", verseRef: "Col 3:23", verse: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;", meaning: "Every rep counts when it's done for God, not for show.", desc: "Taupe boxy tee with a script Heartily wordmark." },
  { id: "endure-hoodie", name: "Endure Hoodie", slot: "top", price: 220, cut: "hoodie", main: "#2c2c28", dark: "#1a1a16", accent: "#c8a84a", word: "Endure", wordStyle: "gothic", verseRef: "Heb 12:1", verse: "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us,", meaning: "Drop what's slowing you down and keep running your race.", desc: "Black oversized hoodie with gothic Endure lettering and a kangaroo pocket." },
  { id: "purpose-pullover", name: "Purpose Pullover", slot: "top", price: 200, cut: "hoodie", main: "#4a4d2a", dark: "#33351c", accent: "#e8ddc0", word: "Purpose", wordStyle: "script", verseRef: "Rom 8:28", verse: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", meaning: "Even the hard days are working together for good.", desc: "Olive pullover hoodie with a script Purpose wordmark." },
  { id: "nightops-tank", name: "Night Ops Camo Tank", slot: "top", price: 180, cut: "tank", main: "#23241f", dark: "#14150f", accent: "#8a8f5c", word: "Night Ops", wordStyle: "bold", verseRef: null, verse: null, meaning: null, desc: "Blackout camo tank. No verse — just the mission." },
  // ---- Bottoms ----
  { id: "woodland-cargos", name: "Woodland Camo Cargos", slot: "bottom", price: 200, camo: "woodland", main: "#5a6136", dark: "#3d4426", accent: "#2c2f1c", desc: "Baggy woodland camo cargos with bellows pockets, a chain belt loop, and a pooled hem." },
  { id: "duck-cargos", name: "Duck Camo Cargos", slot: "bottom", price: 200, camo: "duck", main: "#6b6250", dark: "#4a4436", accent: "#3a352a", desc: "Baggy duck camo cargos with bellows pockets and a pooled hem." },
  { id: "olive-cargos", name: "Olive Baggy Cargos", slot: "bottom", price: 180, camo: null, main: "#5c6040", dark: "#43452c", accent: "#33351c", desc: "Solid olive baggy cargos with bellows pockets and a pooled hem." },
  { id: "black-cargos", name: "Black Cargo Pants", slot: "bottom", price: 180, camo: null, main: "#23241f", dark: "#14150f", accent: "#000000", desc: "Solid black baggy cargos with bellows pockets and a pooled hem." },
  { id: "desert-cargos", name: "Desert Camo Cargos", slot: "bottom", price: 200, camo: "desert", main: "#a89a72", dark: "#8a7c58", accent: "#6e6248", desc: "Baggy desert camo cargos with bellows pockets and a pooled hem." },
  // ---- Gear / kit ----
  { id: "dogtags", name: "Blackened Flag & Cross Dog Tags", slot: "neck", price: 100, glyph: "dogtags", desc: "Blackened steel dog tags on a long chain, hanging low so they never cover a chest print." },
  { id: "field-pouch", name: "Cross & Medals Field Pouch", slot: "waist", price: 120, glyph: "pouch", desc: "Canvas field pouch with a cross-and-medals patch, worn at the hip." },
  { id: "aviators", name: "Silver Aviators", slot: "eyes", price: 120, glyph: "aviators", desc: "Silver-frame aviator sunglasses." },
  { id: "goggles", name: "Aviator Goggles", slot: "eyes", price: 120, glyph: "goggles", desc: "Brass aviator goggles, worn pushed up on the forehead." },
  { id: "pith-helmet", name: "Pith Helmet", slot: "head", price: 150, glyph: "pith", desc: "Classic pith helmet with a wide brim." },
  { id: "beret", name: "Navy Beret · Gold Wings", slot: "head", price: 150, glyph: "beret", desc: "Navy beret with a gold wings pin." },
  { id: "aviator-cap", name: "Aviator Cap", slot: "head", price: 120, glyph: "cap", desc: "Brown leather aviator cap with ear flaps." },
  { id: "beanie", name: "Watch Cap Beanie", slot: "head", price: 90, glyph: "beanie", desc: "Ribbed olive watch cap." },
  { id: "crew-socks", name: "Crew Socks", slot: "socks", price: 60, glyph: "socks", desc: "Olive crew socks, worn down the shin." },
  { id: "gym-towel", name: "Gym Towel", slot: "shoulder", price: 60, glyph: "towel", desc: "Striped gym towel, worn over the shoulder." },
  { id: "shaker", name: "Shaker Bottle", slot: "hip", price: 80, glyph: "shaker", desc: "Steel shaker bottle clipped at the hip." },
  { id: "tall-boots", name: "Tall Combat Boots", slot: "feet", price: 150, glyph: "boots", desc: "Tall lace-up combat boots, replacing the base ankle boots." },
  { id: "bandolier", name: "Bandolier", slot: "chest", price: 120, glyph: "bandolier", desc: "Canvas bandolier worn diagonally across the chest." },
  { id: "wooden-cross", name: "Carved Wooden Cross", slot: "hand", price: 100, glyph: "cross", held: "cross", desc: "Hand-carved wooden cross, carried in the fist." },
  { id: "bible", name: "Field Bible", slot: "hand", price: 100, glyph: "bible", held: "bible", desc: "Pocket field Bible with a gilt cross on the cover." },
  { id: "dumbbells", name: "Iron Dumbbell Pair", slot: "hand", price: 150, glyph: "dumbbells", held: "dumbbells", desc: "A pair of iron dumbbells, one gripped in each fist." }
];
const ITEM_BY_ID = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));
const EMPTY_EQUIPPED = { top: null, bottom: null, head: null, eyes: null, neck: null, waist: null, chest: null, shoulder: null, hip: null, socks: null, feet: null, hand: null };
function slotFilter(slot) {
  if (slot === "top") return "top";
  if (slot === "bottom") return "bottom";
  if (slot === "head") return "head";
  return "gear";
}

/* Supply crates. Rewards roll with crypto-grade randomness in the browser;
   this pure resolver takes rnd() so it stays testable. Odds: gear / coins /
   double-XP token. Gear is drawn from the whole catalog — owned items become
   duplicates and are handled by the blocking scrap flow, never stacked. */
const CRATES = [
  { id: "supply", name: "Supply Drop", price: 100, gear: 0.50, coinMin: 50, coinMax: 150, token: 0.20 },
  { id: "rare", name: "Rare Supply Drop", price: 250, gear: 0.60, coinMin: 100, coinMax: 300, token: 0.15 },
  { id: "epic", name: "Epic Supply Drop", price: 500, gear: 0.70, coinMin: 200, coinMax: 500, token: 0.10 }
];
const CRATE_BY_ID = Object.fromEntries(CRATES.map((c) => [c.id, c]));
function scrapValue(item) { return Math.max(10, Math.floor(item.price / 2)); }
function resolveCrateReward(crate, ownedIds, rnd) {
  const r = rnd();
  if (r < crate.gear) {
    const item = SHOP_ITEMS[Math.floor(rnd() * SHOP_ITEMS.length)];
    if (ownedIds.includes(item.id)) return { kind: "duplicate", item, scrap: scrapValue(item) };
    return { kind: "gear", item };
  }
  if (r < crate.gear + (1 - crate.gear - crate.token)) {
    const amount = crate.coinMin + Math.floor(rnd() * (crate.coinMax - crate.coinMin + 1));
    return { kind: "coins", amount };
  }
  return { kind: "token" };
}

/* Migrate a Stage 1 (v1) state to Stage 2 (v2) without touching seeded data. */
function migrateState(state) {
  if (!state || !state.targets) return null;
  if (state.version === 1 || state.version === undefined) {
    if (!Array.isArray(state.owned)) state.owned = [];
    if (!state.equipped || typeof state.equipped !== "object") state.equipped = Object.assign({}, EMPTY_EQUIPPED);
    else Object.keys(EMPTY_EQUIPPED).forEach((k) => { if (!(k in state.equipped)) state.equipped[k] = null; });
    if (!("pendingDuplicate" in state)) state.pendingDuplicate = null;
    if (!state.facialHair) state.facialHair = "beard";
    state.version = 2;
  }
  return state;
}

/* ---------------- Character figure (pure SVG builder) ---------------- */
function escXml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
const CAMO_BLOBS = {
  woodland: ["#3d4426", "#2c2f1c", "#6d7040"],
  duck: ["#4a4436", "#7a7260", "#3a352a"],
  desert: ["#8a7c58", "#c0b28a", "#6e6248"]
};
function wordFont(style) {
  if (style === "script") return 'font-style="italic" font-family="Segoe Script, Bradley Hand, cursive"';
  if (style === "gothic") return 'font-family="Georgia, serif" font-weight="bold" letter-spacing="2"';
  return 'font-family="Arial, Helvetica, sans-serif" font-weight="800" letter-spacing="1"';
}
/* The figure: cartoon action-figure style, bold outlines, olive-and-gold kit.
   Base kit is NOTHING but plain shorts, a basic olive fatigues shirt, and
   ankle boots; everything else comes from equipped items. The mouth (full lips
   + mouth line) is ALWAYS drawn; beard/stubble wrap around it, never over it.
   Hand-held items sit in one solid fist with curled fingers as arcs — the
   fist grips the item's lower part and never overlaps the item's top. */
function buildCharacterSvg(equipped, facialHair, weight) {
  const eq = equipped || {};
  const top = eq.top ? ITEM_BY_ID[eq.top] : null;
  const bottom = eq.bottom ? ITEM_BY_ID[eq.bottom] : null;
  const head = eq.head ? ITEM_BY_ID[eq.head] : null;
  const eyes = eq.eyes ? ITEM_BY_ID[eq.eyes] : null;
  const hand = eq.hand ? ITEM_BY_ID[eq.hand] : null;
  const bulk = 1 + Math.min(0.08, Math.max(0, (weight - 140)) * 0.004);
  const SKIN = "#e8b98a", OUT = "#1a1a1a", SHIRT = "#6b6f3f", SHORTS = "#7d7f57";
  const topMain = top ? top.main : SHIRT, topDark = top ? top.dark : "#4a4d2a";
  let s = `<svg viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Character figure" style="width:100%;max-width:320px;display:block;margin:0 auto">`;
  s += `<ellipse cx="160" cy="424" rx="95" ry="10" fill="#000" opacity="0.35"/>`;
  // ---- Legs / bottoms ----
  if (bottom && bottom.camo) {
    const blobs = CAMO_BLOBS[bottom.camo];
    s += `<defs><clipPath id="legL"><rect x="116" y="222" width="42" height="132"/></clipPath><clipPath id="legR"><rect x="162" y="222" width="42" height="132"/></clipPath></defs>`;
    s += `<rect x="116" y="222" width="42" height="132" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="162" y="222" width="42" height="132" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<g clip-path="url(#legL)"><ellipse cx="130" cy="250" rx="18" ry="12" fill="${blobs[0]}"/><ellipse cx="148" cy="300" rx="14" ry="10" fill="${blobs[1]}"/><ellipse cx="126" cy="330" rx="12" ry="8" fill="${blobs[2]}"/></g>`;
    s += `<g clip-path="url(#legR)"><ellipse cx="190" cy="255" rx="16" ry="11" fill="${blobs[1]}"/><ellipse cx="172" cy="305" rx="13" ry="9" fill="${blobs[0]}"/><ellipse cx="194" cy="332" rx="12" ry="8" fill="${blobs[2]}"/></g>`;
    s += `<rect x="116" y="222" width="42" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><rect x="162" y="222" width="42" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="120" y="258" width="26" height="38" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="120" y1="268" x2="146" y2="268" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="174" y="258" width="26" height="38" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="174" y1="268" x2="200" y2="268" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M116,354 q10,7 21,0 t21,0 M162,354 q10,7 21,0 t21,0" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  } else if (bottom) {
    s += `<rect x="116" y="222" width="42" height="132" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="162" y="222" width="42" height="132" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="116" y="222" width="42" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><rect x="162" y="222" width="42" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="120" y="258" width="26" height="38" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="120" y1="268" x2="146" y2="268" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="174" y="258" width="26" height="38" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="174" y1="268" x2="200" y2="268" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M116,354 q10,7 21,0 t21,0 M162,354 q10,7 21,0 t21,0" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  } else {
    s += `<rect x="126" y="222" width="68" height="40" fill="${SHORTS}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="126" y="222" width="68" height="8" fill="#5c5e3d" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="132" y="262" width="20" height="100" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="168" y="262" width="20" height="100" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  }
  if (bottom) {
    // Cargo legs end at the pooled hem; skin shows only below it when boots are ankle-height.
    s += `<rect x="132" y="354" width="20" height="8" fill="${SKIN}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="168" y="354" width="20" height="8" fill="${SKIN}" stroke="${OUT}" stroke-width="2"/>`;
  }
  // Socks (down the shin, over skin/above boots)
  if (eq.socks) {
    s += `<rect x="132" y="318" width="20" height="44" fill="#d8d2c0" stroke="${OUT}" stroke-width="2"/><line x1="132" y1="328" x2="152" y2="328" stroke="#7a7d4f" stroke-width="3"/><line x1="132" y1="336" x2="152" y2="336" stroke="#7a7d4f" stroke-width="3"/>`;
    s += `<rect x="168" y="318" width="20" height="44" fill="#d8d2c0" stroke="${OUT}" stroke-width="2"/><line x1="168" y1="328" x2="188" y2="328" stroke="#7a7d4f" stroke-width="3"/><line x1="168" y1="336" x2="188" y2="336" stroke="#7a7d4f" stroke-width="3"/>`;
  }
  // Boots
  if (eq.feet === "tall-boots") {
    s += `<rect x="128" y="300" width="28" height="98" fill="#2e2114" stroke="${OUT}" stroke-width="3"/><line x1="128" y1="330" x2="156" y2="330" stroke="${OUT}" stroke-width="2"/><line x1="128" y1="360" x2="156" y2="360" stroke="${OUT}" stroke-width="2"/><rect x="124" y="392" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="164" y="300" width="28" height="98" fill="#2e2114" stroke="${OUT}" stroke-width="3"/><line x1="164" y1="330" x2="192" y2="330" stroke="${OUT}" stroke-width="2"/><line x1="164" y1="360" x2="192" y2="360" stroke="${OUT}" stroke-width="2"/><rect x="160" y="392" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
  } else {
    s += `<rect x="128" y="360" width="28" height="38" fill="#3a2a1a" stroke="${OUT}" stroke-width="3"/><rect x="124" y="394" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="164" y="360" width="28" height="38" fill="#3a2a1a" stroke="${OUT}" stroke-width="3"/><rect x="160" y="394" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
  }
  // ---- Torso + arms (bulk-scaled) ----
  s += `<g transform="translate(160,0) scale(${bulk.toFixed(3)},1) translate(-160,0)">`;
  const sleeve = top ? topMain : SHIRT;
  if (!top || top.cut !== "tank") {
    const sleeveLen = top && (top.cut === "jacket" || top.cut === "anorak") ? 205 : 160;
    s += `<rect x="104" y="122" width="26" height="${sleeveLen - 122}" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="190" y="122" width="26" height="${sleeveLen - 122}" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
  }
  s += `<rect x="108" y="190" width="18" height="70" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<rect x="194" y="190" width="18" height="70" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  const torsoW = top && (top.cut === "jacket" || top.cut === "anorak" || top.cut === "hoodie") ? [104, 216] : [112, 208];
  s += `<path d="M${torsoW[0]},118 L${torsoW[1]},118 L198,228 L122,228 Z" fill="${topMain}" stroke="${OUT}" stroke-width="3"/>`;
  if (top && (top.cut === "hoodie" || top.cut === "anorak")) {
    s += `<path d="M132,118 Q160,96 188,118 Q160,108 132,118 Z" fill="${topDark}" stroke="${OUT}" stroke-width="3"/>`;
  }
  // Collar + buttons
  s += `<path d="M146,118 L160,134 L174,118" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  s += `<circle cx="160" cy="152" r="2.5" fill="${OUT}"/><circle cx="160" cy="178" r="2.5" fill="${OUT}"/><circle cx="160" cy="204" r="2.5" fill="${OUT}"/>`;
  if (top && top.cut === "jacket") {
    s += `<rect x="122" y="212" width="76" height="16" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    for (let x = 130; x < 196; x += 11) s += `<line x1="${x}" y1="212" x2="${x}" y2="228" stroke="${OUT}" stroke-width="1.5"/>`;
  }
  if (top && top.cut === "hoodie") {
    s += `<rect x="138" y="196" width="44" height="28" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
  }
  if (top && top.cut === "anorak") {
    s += `<rect x="168" y="150" width="26" height="30" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
  }
  if (top && top.word) {
    s += `<text x="160" y="172" text-anchor="middle" font-size="${top.wordStyle === "script" ? 20 : 15}" fill="${top.accent}" stroke="${OUT}" stroke-width="0.4" ${wordFont(top.wordStyle)}>${escXml(top.word)}</text>`;
  }
  if (top && top.verseRef) {
    s += `<text x="160" y="223" text-anchor="middle" font-size="7" fill="${top.accent}" opacity="0.85" font-family="Arial, Helvetica, sans-serif">${escXml(top.verseRef)}</text>`;
  }
  // Bandolier (chest slot)
  if (eq.chest === "bandolier") {
    s += `<g transform="rotate(38 160 170)"><rect x="105" y="162" width="110" height="16" fill="#3a2f1c" stroke="${OUT}" stroke-width="2"/>`;
    for (let x = 112; x < 208; x += 12) s += `<rect x="${x}" y="160" width="6" height="20" fill="#c8a84a" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `</g>`;
  }
  // Dog tags (neck slot)
  if (eq.neck === "dogtags") {
    s += `<path d="M140,112 Q160,152 180,112" fill="none" stroke="#888" stroke-width="1.5"/>`;
    s += `<g transform="rotate(-8 152 150)"><rect x="144" y="144" width="16" height="22" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/></g>`;
    s += `<g transform="rotate(10 170 158)"><rect x="162" y="152" width="16" height="22" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/></g>`;
  }
  // Field pouch (waist slot)
  if (eq.waist === "field-pouch") {
    s += `<rect x="196" y="208" width="30" height="38" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/><line x1="196" y1="218" x2="226" y2="218" stroke="${OUT}" stroke-width="2"/><path d="M211,226 v10 M206,231 h10" stroke="#c8a84a" stroke-width="2"/>`;
  }
  // Gym towel (shoulder slot)
  if (eq.shoulder === "gym-towel") {
    s += `<path d="M112,118 L104,196 L126,196 L128,118 Z" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="108" y1="150" x2="124" y2="150" stroke="#7a7d4f" stroke-width="4"/><line x1="106" y1="170" x2="125" y2="170" stroke="#7a7d4f" stroke-width="4"/>`;
  }
  // Shaker (hip slot)
  if (eq.hip === "shaker") {
    s += `<rect x="94" y="212" width="20" height="38" rx="4" fill="#b8bcc0" stroke="${OUT}" stroke-width="2.5"/><rect x="98" y="206" width="12" height="8" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><line x1="94" y1="232" x2="114" y2="232" stroke="#c8a84a" stroke-width="3"/>`;
  }
  s += `</g>`;
  // ---- Head ----
  s += `<rect x="148" y="100" width="24" height="22" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<ellipse cx="124" cy="72" rx="6" ry="10" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<ellipse cx="196" cy="72" rx="6" ry="10" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<ellipse cx="160" cy="72" rx="34" ry="40" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<path d="M126,62 Q128,26 160,24 Q192,26 194,62 Q180,44 160,44 Q140,44 126,62 Z" fill="#241a12" stroke="${OUT}" stroke-width="2.5"/>`;
  // Beard / stubble wrap AROUND the mouth — drawn before the mouth so the mouth always shows.
  if (facialHair === "beard") {
    s += `<path d="M126,66 Q124,112 145,124 Q160,130 175,124 Q196,112 194,66 Q190,100 178,106 Q170,112 160,112 Q150,112 142,106 Q130,100 126,66 Z" fill="#2a2018" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M140,86 Q160,78 180,86 Q172,92 160,91 Q148,92 140,86 Z" fill="#2a2018" stroke="${OUT}" stroke-width="2"/>`;
  } else if (facialHair === "stubble") {
    s += `<path d="M128,96 Q130,118 148,124 Q160,127 172,124 Q190,118 192,96 Q188,112 172,116 Q160,119 148,116 Q132,112 128,96 Z" fill="#000" opacity="0.14"/>`;
    s += `<path d="M142,88 Q160,82 178,88 Q170,93 160,92 Q150,93 142,88 Z" fill="#2a2018" stroke="${OUT}" stroke-width="1.5"/>`;
  }
  // Eyes, brows, nose — always drawn.
  s += `<ellipse cx="148" cy="68" rx="7" ry="8" fill="#fff" stroke="${OUT}" stroke-width="1.5"/><circle cx="148" cy="69" r="3.5" fill="#1a1a1a"/>`;
  s += `<ellipse cx="172" cy="68" rx="7" ry="8" fill="#fff" stroke="${OUT}" stroke-width="1.5"/><circle cx="172" cy="69" r="3.5" fill="#1a1a1a"/>`;
  s += `<path d="M140,56 Q148,52 156,56 M164,56 Q172,52 180,56" fill="none" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<path d="M160,72 q4,6 0,10" fill="none" stroke="${OUT}" stroke-width="2"/>`;
  // Mouth — full lips + mouth line, ALWAYS visible.
  s += `<path d="M146,94 Q160,89 174,94 Q160,100 146,94 Z" fill="#b96a5a" stroke="${OUT}" stroke-width="1.5"/>`;
  s += `<ellipse cx="160" cy="99" rx="8" ry="4" fill="#c97a68" stroke="${OUT}" stroke-width="1.5"/>`;
  s += `<path d="M146,95 Q160,99 174,95" fill="none" stroke="#7a3a2e" stroke-width="1.5"/>`;
  // Head items
  if (head && head.id === "beanie") {
    s += `<path d="M124,58 Q126,22 160,20 Q194,22 196,58 Q180,46 160,46 Q140,46 124,58 Z" fill="#3a3f2a" stroke="${OUT}" stroke-width="2.5"/>`;
    for (let x = 134; x < 190; x += 12) s += `<line x1="${x}" y1="50" x2="${x}" y2="58" stroke="${OUT}" stroke-width="1.5"/>`;
  } else if (head && head.id === "pith-helmet") {
    s += `<ellipse cx="160" cy="38" rx="30" ry="14" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="160" cy="50" rx="46" ry="10" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/>`;
  } else if (head && head.id === "beret") {
    s += `<g transform="rotate(-8 158 40)"><ellipse cx="158" cy="40" rx="34" ry="12" fill="#1c2438" stroke="${OUT}" stroke-width="2.5"/></g><path d="M184,34 l10,-4 l-3,6 l8,1 l-11,3 z" fill="#c8a84a" stroke="${OUT}" stroke-width="1"/>`;
  } else if (head && head.id === "aviator-cap") {
    s += `<path d="M124,60 Q126,24 160,22 Q194,24 196,60 L188,60 Q188,36 160,34 Q132,36 132,60 Z" fill="#4a3220" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<rect x="122" y="58" width="10" height="30" fill="#4a3220" stroke="${OUT}" stroke-width="2"/><rect x="188" y="58" width="10" height="30" fill="#4a3220" stroke="${OUT}" stroke-width="2"/>`;
  }
  // Eyes items
  if (eyes && eyes.id === "aviators") {
    s += `<circle cx="148" cy="68" r="11" fill="#1a1a1a" opacity="0.88" stroke="#c8a84a" stroke-width="2"/><circle cx="172" cy="68" r="11" fill="#1a1a1a" opacity="0.88" stroke="#c8a84a" stroke-width="2"/><line x1="159" y1="66" x2="161" y2="66" stroke="#c8a84a" stroke-width="2"/>`;
  } else if (eyes && eyes.id === "goggles") {
    s += `<line x1="124" y1="46" x2="196" y2="46" stroke="#3a2f1c" stroke-width="4"/><circle cx="146" cy="46" r="13" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/><circle cx="174" cy="46" r="13" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/>`;
  }
  // ---- Hands + hand-held items ----
  // Item first, then ONE solid fist with curled-finger arcs gripping its lower
  // part. The item's top always stays fully above the fist — nothing clips.
  function fist(cx, cy) {
    return `<rect x="${cx - 14}" y="${cy - 14}" width="28" height="30" rx="10" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>` +
      `<path d="M${cx - 8},${cy - 2} q8,6 16,0 M${cx - 8},${cy + 6} q8,6 16,0" fill="none" stroke="${OUT}" stroke-width="2"/>`;
  }
  function openHand(cx, cy) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="13" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>` +
      `<path d="M${cx - 8},${cy - 12} v-8 M${cx - 3},${cy - 13} v-9 M${cx + 3},${cy - 13} v-9 M${cx + 8},${cy - 12} v-8" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (hand && hand.held === "bible") {
    s += `<g transform="rotate(8 214 235)"><rect x="196" y="208" width="36" height="56" rx="3" fill="#2a1f14" stroke="${OUT}" stroke-width="2.5"/><line x1="202" y1="212" x2="202" y2="260" stroke="#c8a84a" stroke-width="1.5"/><path d="M214,220 v18 M207,227 h14" stroke="#c8a84a" stroke-width="2.5"/></g>`;
    s += openHand(117, 272) + fist(214, 272);
  } else if (hand && hand.held === "cross") {
    s += `<rect x="210" y="196" width="10" height="74" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><rect x="196" y="220" width="38" height="10" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/>`;
    s += openHand(117, 272) + fist(214, 272);
  } else if (hand && hand.held === "dumbbells") {
    s += `<rect x="78" y="268" width="62" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="70" y="256" width="10" height="30" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="140" y="256" width="10" height="30" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="180" y="268" width="62" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="172" y="256" width="10" height="30" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="242" y="256" width="10" height="30" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/>`;
    s += fist(110, 272) + fist(212, 272);
  } else {
    s += openHand(117, 272) + openHand(212, 272);
  }
  s += `</svg>`;
  return s;
}

/* Small shop-card preview SVG for an item. */
function previewSvg(item) {
  const OUT = "#1a1a1a";
  if (item.slot === "top") {
    const hem = item.cut === "jacket" ? `<rect x="38" y="88" width="44" height="8" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/>` : "";
    const sleeves = item.cut === "tank" ? "" : `<rect x="28" y="30" width="12" height="26" fill="${item.main}" stroke="${OUT}" stroke-width="2"/><rect x="80" y="30" width="12" height="26" fill="${item.main}" stroke="${OUT}" stroke-width="2"/>`;
    const word = item.word ? `<text x="60" y="62" text-anchor="middle" font-size="${item.wordStyle === "script" ? 13 : 10}" fill="${item.accent}" ${wordFont(item.wordStyle)}>${escXml(item.word)}</text>` : "";
    const ref = item.verseRef ? `<text x="60" y="94" text-anchor="middle" font-size="5" fill="${item.accent}" font-family="Arial, Helvetica, sans-serif">${escXml(item.verseRef)}</text>` : "";
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block"><path d="M32,26 L88,26 L84,96 L36,96 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/>${sleeves}${hem}${word}${ref}</svg>`;
  }
  if (item.slot === "bottom") {
    const blobs = item.camo ? CAMO_BLOBS[item.camo].map((c, i) => `<ellipse cx="${40 + i * 14}" cy="${52 + i * 12}" rx="10" ry="7" fill="${c}"/>`).join("") : "";
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block"><rect x="34" y="16" width="52" height="10" fill="${item.dark}" stroke="${OUT}" stroke-width="2"/><rect x="34" y="26" width="24" height="74" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/><rect x="62" y="26" width="24" height="74" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/>${blobs}<rect x="37" y="44" width="16" height="22" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><rect x="67" y="44" width="16" height="22" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><path d="M34,100 q12,5 24,0 M62,100 q12,5 24,0" fill="none" stroke="${OUT}" stroke-width="2"/></svg>`;
  }
  const g = {
    dogtags: `<path d="M40,20 Q60,50 80,20" fill="none" stroke="#888" stroke-width="1.5"/><rect x="50" y="48" width="14" height="20" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/><rect x="66" y="56" width="14" height="20" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/>`,
    pouch: `<rect x="36" y="40" width="48" height="44" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/><line x1="36" y1="52" x2="84" y2="52" stroke="${OUT}" stroke-width="2"/><path d="M60,62 v12 M54,68 h12" stroke="#c8a84a" stroke-width="2.5"/>`,
    aviators: `<circle cx="44" cy="58" r="14" fill="#1a1a1a" stroke="#c8a84a" stroke-width="2.5"/><circle cx="76" cy="58" r="14" fill="#1a1a1a" stroke="#c8a84a" stroke-width="2.5"/><line x1="58" y1="56" x2="62" y2="56" stroke="#c8a84a" stroke-width="2.5"/>`,
    goggles: `<line x1="28" y1="56" x2="92" y2="56" stroke="#3a2f1c" stroke-width="4"/><circle cx="44" cy="56" r="15" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/><circle cx="76" cy="56" r="15" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/>`,
    pith: `<ellipse cx="60" cy="48" rx="26" ry="13" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="60" cy="60" rx="40" ry="9" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/>`,
    beret: `<g transform="rotate(-8 60 56)"><ellipse cx="60" cy="56" rx="32" ry="12" fill="#1c2438" stroke="${OUT}" stroke-width="2.5"/></g><path d="M86,48 l10,-4 l-3,6 l8,1 l-11,3 z" fill="#c8a84a" stroke="${OUT}" stroke-width="1"/>`,
    cap: `<path d="M30,60 Q32,28 60,26 Q88,28 90,60 L80,60 Q80,38 60,36 Q40,38 40,60 Z" fill="#4a3220" stroke="${OUT}" stroke-width="2.5"/><rect x="28" y="58" width="10" height="26" fill="#4a3220" stroke="${OUT}" stroke-width="2"/><rect x="82" y="58" width="10" height="26" fill="#4a3220" stroke="${OUT}" stroke-width="2"/>`,
    beanie: `<path d="M30,66 Q32,28 60,26 Q88,28 90,66 Q75,54 60,54 Q45,54 30,66 Z" fill="#3a3f2a" stroke="${OUT}" stroke-width="2.5"/>`,
    socks: `<rect x="44" y="24" width="16" height="52" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><rect x="44" y="70" width="26" height="12" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="44" y1="36" x2="60" y2="36" stroke="#7a7d4f" stroke-width="3"/><rect x="66" y="24" width="16" height="52" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><rect x="66" y="70" width="26" height="12" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="66" y1="36" x2="82" y2="36" stroke="#7a7d4f" stroke-width="3"/>`,
    towel: `<path d="M36,26 L52,96 L76,92 L62,22 Z" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="44" y1="52" x2="66" y2="50" stroke="#7a7d4f" stroke-width="4"/><line x1="48" y1="70" x2="70" y2="68" stroke="#7a7d4f" stroke-width="4"/>`,
    shaker: `<rect x="48" y="36" width="24" height="48" rx="4" fill="#b8bcc0" stroke="${OUT}" stroke-width="2.5"/><rect x="54" y="28" width="12" height="10" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><line x1="48" y1="60" x2="72" y2="60" stroke="#c8a84a" stroke-width="3"/>`,
    boots: `<rect x="40" y="28" width="20" height="60" fill="#2e2114" stroke="${OUT}" stroke-width="2.5"/><rect x="36" y="84" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/><rect x="64" y="28" width="20" height="60" fill="#2e2114" stroke="${OUT}" stroke-width="2.5"/><rect x="60" y="84" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`,
    bandolier: `<g transform="rotate(38 60 60)"><rect x="16" y="52" width="88" height="14" fill="#3a2f1c" stroke="${OUT}" stroke-width="2"/>${[22, 34, 46, 58, 70, 82, 94].map((x) => `<rect x="${x}" y="50" width="5" height="18" fill="#c8a84a" stroke="${OUT}" stroke-width="1"/>`).join("")}</g>`,
    cross: `<rect x="55" y="18" width="10" height="84" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><rect x="38" y="42" width="44" height="10" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/>`,
    bible: `<rect x="40" y="28" width="40" height="64" rx="3" fill="#2a1f14" stroke="${OUT}" stroke-width="2.5"/><line x1="47" y1="32" x2="47" y2="88" stroke="#c8a84a" stroke-width="1.5"/><path d="M60,44 v20 M52,52 h16" stroke="#c8a84a" stroke-width="2.5"/>`,
    dumbbells: `<rect x="14" y="56" width="40" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="8" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="54" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="58" y="56" width="40" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="98" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="52" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/>`
  }[item.glyph] || `<circle cx="60" cy="60" r="20" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block">${g}</svg>`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DAYS, EXERCISES, EX_BY_ID, CABLE_STACK, RANKS, dateKey, parseDate, fmtDate,
    weekFor, levelForXp, rankForLevel, nextLoad, fmtWeight, totalReps, scoreLift, dayTotals,
    weekKeyOf, seedState, findSession, prevLift, saveLiftToState, deleteLiftFromState,
    deleteSessionFromState, addFoodToState, removeFoodFromState, addWeightToState,
    claimDoubleToState, activateDoubleToState,
    SHOP_ITEMS, ITEM_BY_ID, EMPTY_EQUIPPED, CRATES, CRATE_BY_ID, scrapValue,
    resolveCrateReward, wcMult, wcBoosted, WC_MULT_END, migrateState,
    buildCharacterSvg, previewSvg, slotFilter };
}

/* ---------------- Browser layer (DOM, storage, sounds, events) ---------------- */
if (typeof document !== "undefined") {
  const LS_KEY = "pfg-pwa-v1";
  let state;
  try {
    const raw = localStorage.getItem(LS_KEY);
    state = raw ? JSON.parse(raw) : seedState();
    if (!state || !state.targets) state = seedState();
    else if (!migrateState(state)) state = seedState();
  } catch (e) { state = seedState(); }
  function persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }

  let currentDay = DAY_BY_WEEKDAY[new Date().getDay()] || "arms";
  let logDay = currentDay;
  let lastRenderedDay = dateKey(new Date());
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  /* ----- Sounds: level-up uses his own MP3; other blips are synthesized. ----- */
  let audioCtx = null;
  function blip() {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = 660;
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.16);
    } catch (e) {}
  }
  function playLevelUp() {
    if (state.muted) return;
    try {
      const a = new Audio("./assets/levelup.mp3");
      const p = a.play();
      if (p && p.catch) p.catch(() => blip());
    } catch (e) { blip(); }
  }
  function showBanner(html) {
    const b = $("banner");
    b.innerHTML = html;
    clearTimeout(showBanner._t);
    showBanner._t = setTimeout(() => { b.innerHTML = ""; }, 8000);
  }
  function afterXp(info, extraHtml) {
    if (info && info.leveledUp) {
      playLevelUp();
      showBanner("🎉 Level up! You are now <b>Level " + info.newLevel + " · " + esc(rankForLevel(info.newLevel)) + "</b>" + (extraHtml || ""));
    } else if (extraHtml) {
      showBanner(extraHtml);
    }
  }

  /* ----- Header / tabs ----- */
  function renderHeader() {
    const level = levelForXp(state.xpTotal);
    $("weekBadge").textContent = "Week " + weekFor(new Date());
    $("xpChip").textContent = state.xpTotal + " XP · Lv " + level;
    $("coinsChip").textContent = "🪙 " + state.coins.toLocaleString();
    $("muteBtn").textContent = state.muted ? "🔇" : "🔊";
    $("sideXp").innerHTML = "Level " + level + " · " + esc(rankForLevel(level)) + "<br>" + state.xpTotal + " / " + XP_CAP + " XP<br>" + state.coins.toLocaleString() + " War Coins";
  }
  function switchTab(tab) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + tab));
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    document.body.classList.toggle("shop-active", tab === "shop");
    if (tab === "progress") renderProgress();
    if (tab === "log") renderFood();
    if (tab === "shop") renderShop();
    if (tab === "character") renderCharacter();
  }
  document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  /* ----- Days tab ----- */
  function lastLiftText(exId) {
    const s = state.sessions.filter((x) => x.lifts[exId]).sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!s) return "";
    const l = s.lifts[exId];
    return "Last: " + fmtDate(s.date) + " — " + fmtWeight(EX_BY_ID[exId], l.weight) + " × " + l.reps.join("/") + (l.note ? " (" + esc(l.note) + ")" : "");
  }
  function exCardHtml(ex, inLog) {
    const t = state.targets[ex.id];
    const range = t.repMin === t.repMax ? t.repMin + "" : t.repMin + "–" + t.repMax;
    return `<div class="card ex-card" id="ex-${ex.id}">
      <img src="./${ex.photo}" alt="${esc(ex.name)}" loading="lazy">
      <div class="ex-head"><h3>${esc(ex.name)}</h3><span class="target">${t.sets} × ${range} · ${fmtWeight(ex, t.weight)}</span></div>
      <p class="cues">${esc(ex.cues)}</p>
      <p class="last">${lastLiftText(ex.id)}</p>
      <button class="log-this" data-ex="${ex.id}" data-day="${ex.day}">Log this lift</button>
    </div>`;
  }
  function renderDays() {
    $("dayChips").innerHTML = DAYS.map((d) =>
      `<button class="chip ${d.id === currentDay ? "on" : ""}" data-day="${d.id}">${d.short} · ${d.weekday}</button>`).join("");
    $("dayChips").querySelectorAll("[data-day]").forEach((b) => b.addEventListener("click", () => { currentDay = b.dataset.day; renderDays(); }));
    const day = DAYS.find((d) => d.id === currentDay);
    const exs = EXERCISES.filter((e) => e.day === currentDay);
    $("jumpChips").innerHTML = exs.map((e) => `<button class="chip" data-jump="${e.id}">${esc(e.name)}</button>`).join("");
    $("jumpChips").querySelectorAll("[data-jump]").forEach((b) => b.addEventListener("click", () => {
      const el = document.getElementById("ex-" + b.dataset.jump);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    $("dayCards").innerHTML = `<h2 style="margin:0 0 12px">${day.short} · ${day.name} <span class="muted">(${day.weekday})</span></h2>` +
      exs.map((e) => exCardHtml(e, false)).join("");
    bindLogThis($("dayCards"));
  }
  function bindLogThis(root) {
    root.querySelectorAll(".log-this").forEach((b) => b.addEventListener("click", () => {
      logDay = b.dataset.day;
      switchTab("log");
      renderLog();
      const form = document.getElementById("logform-" + b.dataset.ex);
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  /* ----- Log tab: per-lift forms ----- */
  function renderLog() {
    $("logDayChips").innerHTML = DAYS.map((d) =>
      `<button class="chip ${d.id === logDay ? "on" : ""}" data-day="${d.id}">${d.short}</button>`).join("");
    $("logDayChips").querySelectorAll("[data-day]").forEach((b) => b.addEventListener("click", () => { logDay = b.dataset.day; renderLog(); }));
    const today = dateKey(new Date());
    const session = findSession(state, today);
    $("logCards").innerHTML = EXERCISES.filter((e) => e.day === logDay).map((ex) => {
      const t = state.targets[ex.id];
      const saved = session && session.lifts[ex.id];
      const setInputs = Array.from({ length: t.sets }, (_, i) =>
        `<div class="set-row"><span>Set ${i + 1}</span><input type="number" inputmode="numeric" min="0" data-set="${i}" placeholder="${t.repMax} reps" value="${saved ? saved.reps[i] ?? "" : ""}"></div>`).join("");
      return `<div class="card" id="logform-${ex.id}">
        <h3>${esc(ex.name)} <span class="muted">· target ${t.sets} × ${t.repMin === t.repMax ? t.repMin : t.repMin + "–" + t.repMax} · ${fmtWeight(ex, t.weight)}</span></h3>
        <p class="last">${lastLiftText(ex.id)}</p>
        <label>Weight lifted (lbs)</label>
        <input type="number" inputmode="decimal" min="0" data-weight value="${saved ? saved.weight : t.weight}">
        ${setInputs}
        <label class="goal-row"><input type="checkbox" data-goal ${saved && saved.goalHit ? "checked" : ""}> I hit my goal on this lift</label>
        <button data-save="${ex.id}">Save this lift</button>
        <div class="result" data-result="${ex.id}">${saved ? "Saved: " + fmtWeight(ex, saved.weight) + " × " + saved.reps.join("/") + (saved.xp !== null ? " · +" + saved.xp + " XP (" + esc(saved.label) + ")" : "") : ""}</div>
      </div>`;
    }).join("");
    $("logCards").querySelectorAll("[data-save]").forEach((b) => b.addEventListener("click", () => {
      const exId = b.dataset.save, ex = EX_BY_ID[exId];
      const card = document.getElementById("logform-" + exId);
      const weight = parseFloat(card.querySelector("[data-weight]").value);
      const reps = [...card.querySelectorAll("[data-set]")].map((i) => parseInt(i.value, 10)).filter((n) => !isNaN(n));
      const goalHit = card.querySelector("[data-goal]").checked;
      if (isNaN(weight) || reps.length === 0) { alert("Enter a weight and at least one set of reps."); return; }
      const res = saveLiftToState(state, dateKey(new Date()), logDay, exId, weight, reps, goalHit);
      persist();
      const cls = res.scored.label === "Move-up" ? "up" : res.scored.label === "Held" ? "flat" : "reset";
      let html = `<span class="${cls}">+${res.earned} XP · ${res.scored.label}${res.doubled ? " · 2× doubled" : ""}</span>`;
      if (res.coinsEarned > 0) html += ` · <span class="gold">+${res.coinsEarned} WC</span>`;
      if (res.rolled !== null) html += ` · 🎯 Target rolled up to ${fmtWeight(ex, res.rolled)} — a 2× charge is banked, claim it in Progress.`;
      card.querySelector("[data-result]").innerHTML = "Saved: " + fmtWeight(ex, weight) + " × " + reps.join("/") + " — " + html;
      afterXp(res, null);
      blip();
      renderHeader();
    }));
  }

  /* ----- Food ----- */
  function foodDayHtml(key, allowRemove) {
    const day = state.foodDays[key];
    if (!day) return `<p class="muted">Nothing logged.</p>`;
    const totals = dayTotals(day);
    const badge = key === dateKey(new Date()) ? `<span class="badge open">Open</span>` : `<span class="badge closed">Closed</span>`;
    return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><b>${fmtDate(key)}</b><span>${badge} · ${totals.cal.toLocaleString()} cal · ${totals.protein}g protein</span></div>` +
      day.entries.map((e) => `<div class="food-entry"><span>${esc(e.name)} <span class="muted">· ${esc(e.time)}</span></span><span style="white-space:nowrap">${e.cal} cal · ${e.protein}g ${allowRemove ? `<button class="small danger" data-remove-food="${key}:${e.id}">Remove</button>` : ""}</span></div>`).join("") + `</div>`;
  }
  function renderFood() {
    const today = dateKey(new Date());
    $("todayLabel").textContent = "Today · " + new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const mins = Math.max(0, Math.round((midnight - now) / 60000));
    $("countdown").textContent = "Day closes at midnight (" + Math.floor(mins / 60) + "h " + (mins % 60) + "m left). Anything logged after midnight counts for the next day.";
    const totals = dayTotals(state.foodDays[today]);
    $("calTotals").textContent = totals.cal.toLocaleString() + " / " + CAL_TARGET.toLocaleString() + " cal · " + Math.max(0, CAL_TARGET - totals.cal).toLocaleString() + " to go";
    $("proteinTotals").textContent = totals.protein + " / " + PROTEIN_TARGET + "g · " + Math.max(0, PROTEIN_TARGET - totals.protein) + "g to go";
    $("calMeter").style.width = Math.min(100, totals.cal / CAL_TARGET * 100) + "%";
    $("proteinMeter").style.width = Math.min(100, totals.protein / PROTEIN_TARGET * 100) + "%";
    const day = state.foodDays[today];
    $("todayFoodList").innerHTML = !day || day.entries.length === 0 ? `<p class="muted">Nothing logged yet today.</p>` :
      day.entries.map((e) => `<div class="food-entry"><span>${esc(e.name)} <span class="muted">· ${esc(e.time)}</span></span><span style="white-space:nowrap">${e.cal} cal · ${e.protein}g <button class="small danger" data-remove-food="${today}:${e.id}">Remove</button></span></div>`).join("");
    const keys = Object.keys(state.foodDays).sort().reverse();
    $("foodHistory").innerHTML = keys.map((k) => foodDayHtml(k, false)).join("") || `<p class="muted">No past days yet.</p>`;
    document.querySelectorAll("[data-remove-food]").forEach((b) => b.addEventListener("click", () => {
      const [k, id] = b.dataset.removeFood.split(":");
      if (!confirm("Remove this food entry? Totals will recalculate.")) return;
      if (removeFoodFromState(state, k, id)) { persist(); renderFood(); }
    }));
  }
  $("addFoodBtn").addEventListener("click", () => {
    const name = $("foodName").value.trim();
    const cal = parseInt($("foodCal").value, 10), protein = parseInt($("foodProtein").value, 10);
    if (!name || isNaN(cal) || isNaN(protein)) { alert("Enter a food name, calories, and protein."); return; }
    const now = new Date();
    const res = addFoodToState(state, name, cal, protein, dateKey(now), String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0"));
    persist();
    $("foodName").value = ""; $("foodCal").value = ""; $("foodProtein").value = "";
    renderFood(); renderHeader();
    afterXp(res, "Logged <b>" + esc(name) + "</b> — " + cal + " cal · " + protein + "g protein. Running total: " + res.totals.cal.toLocaleString() + " cal · " + res.totals.protein + "g protein." + (res.coinsEarned > 0 ? " · +" + res.coinsEarned + " WC" : ""));
    blip();
  });

  /* ----- Progress ----- */
  function renderProgress() {
    const level = levelForXp(state.xpTotal);
    $("rankLine").textContent = "Level " + level + " · " + rankForLevel(level);
    $("xpLine").textContent = state.xpTotal + " / " + XP_CAP + " XP";
    $("xpMeter").style.width = Math.min(100, (state.xpTotal - (level - 1) * XP_PER_LEVEL) / XP_PER_LEVEL * 100) + "%";
    $("xpCapLine").textContent = "Progress toward the 200 XP cap: " + Math.round(state.xpTotal / XP_CAP * 100) + "%.";
    $("coinsLine").textContent = "💰 " + state.coins.toLocaleString() + " War Coins — earned from sessions, move-ups, target hits, sets, reps, fuel days, and weigh-ins." + (dateKey(new Date()) <= WC_MULT_END ? " 1.5× boost active through Nov 10 on weigh-ins, weekly gains, and fuel days." : "");
    const dx = state.doubleXp;
    $("doubleLine").innerHTML = "Stack: <b>" + dx.stack + " banked</b> · Active: " + (dx.active ? `<span class="badge active">ON — next session pays double</span>` : `<span class="badge closed">OFF</span>`) + " · Claimable: <b>" + dx.claimable + "</b>";
    $("claimBtn").disabled = dx.claimable <= 0;
    $("activateBtn").disabled = dx.stack <= 0 || dx.active;
    $("weightList").innerHTML = state.weights.map((w) => `<div class="food-entry"><span>${fmtDate(w.date)}</span><b>${w.weight} lbs</b></div>`).join("");
    const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
    $("historyList").innerHTML = sorted.length === 0 ? `<p class="muted">No sessions yet.</p>` : sorted.map((s) => {
      const day = DAYS.find((d) => d.id === s.dayId);
      const lifts = Object.entries(s.lifts).map(([exId, l]) => {
        const ex = EX_BY_ID[exId];
        const xpTxt = l.xp === null ? "seeded" : "+" + l.xp + " XP (" + esc(l.label) + ")";
        return `<div class="lift-line"><span>${esc(ex.name)} — ${fmtWeight(ex, l.weight)} × ${l.reps.join("/")}${l.note ? " (" + esc(l.note) + ")" : ""}</span><span><span class="xp">${xpTxt}</span> <button class="small danger" data-del-lift="${s.date}:${exId}">Delete</button></span></div>`;
      }).join("");
      return `<div class="sess"><div class="sess-head"><b>${fmtDate(s.date)} · ${day ? day.name : s.dayId}</b><span>${s.doubled === true ? `<span class="badge active">2× doubled</span> ` : ""}<button class="small secondary" data-copy="${s.date}">Copy as text</button> <button class="small danger" data-del-sess="${s.date}">Delete session</button></span></div>${lifts}</div>`;
    }).join("");
    $("historyList").querySelectorAll("[data-del-lift]").forEach((b) => b.addEventListener("click", () => {
      const [d, exId] = b.dataset.delLift.split(":");
      if (!confirm("Delete this lift? XP will recalculate.")) return;
      if (deleteLiftFromState(state, d, exId)) { persist(); renderProgress(); renderHeader(); }
    }));
    $("historyList").querySelectorAll("[data-del-sess]").forEach((b) => b.addEventListener("click", () => {
      if (!confirm("Delete this whole session? XP will recalculate.")) return;
      if (deleteSessionFromState(state, b.dataset.delSess)) { persist(); renderProgress(); renderHeader(); }
    }));
    $("historyList").querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => {
      const s = findSession(state, b.dataset.copy);
      if (!s) return;
      const day = DAYS.find((d) => d.id === s.dayId);
      const text = (day ? day.name : s.dayId) + " — " + fmtDate(s.date) + "\n" +
        Object.entries(s.lifts).map(([exId, l]) => EX_BY_ID[exId].name + ": " + fmtWeight(EX_BY_ID[exId], l.weight) + " × " + l.reps.join("/")).join("\n");
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showBanner("Workout copied as text.")).catch(() => {});
      else showBanner("Copy not available in this browser.");
    }));
  }
  $("claimBtn").addEventListener("click", () => { if (claimDoubleToState(state)) { persist(); renderProgress(); blip(); } });
  $("activateBtn").addEventListener("click", () => { if (activateDoubleToState(state)) { persist(); renderProgress(); blip(); showBanner("2× XP is ON — your next session pays double, then it switches off."); } });
  $("addWeightBtn").addEventListener("click", () => {
    const d = $("weightDate").value, w = parseFloat($("weightVal").value);
    if (!d || isNaN(w)) { alert("Enter a date and a weight."); return; }
    const res = addWeightToState(state, d, w);
    persist(); renderProgress(); renderHeader();
    afterXp(res, (res.gained ? "Weigh-in logged: " + w + " lbs — weekly average gain, +2 XP." : "Weigh-in logged: " + w + " lbs.") + (res.coinsEarned > 0 ? " · +" + res.coinsEarned + " WC" : ""));
    blip();
  });
  $("muteBtn").addEventListener("click", () => { state.muted = !state.muted; persist(); renderHeader(); });

  /* ----- Backup ----- */
  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "form-guide-backup-" + dateKey(new Date()) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    $("backupMsg").textContent = "Backup exported.";
  });
  $("importFile").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || (data.version !== 1 && data.version !== 2) || !data.targets || !data.sessions || !data.foodDays) throw new Error("bad file");
        if (!migrateState(data)) throw new Error("bad file");
        if (!confirm("Replace all app data with this backup? This cannot be undone (export first if unsure).")) return;
        state = data;
        persist();
        $("backupMsg").textContent = "Backup imported. XP: " + state.xpTotal + ", sessions: " + state.sessions.length + ".";
        renderHeader(); renderDays(); renderLog(); renderFood(); renderProgress();
      } catch (e) { $("backupMsg").textContent = "That file is not a valid Form Guide backup."; }
    };
    reader.readAsText(file);
    ev.target.value = "";
  });

  /* ----- Stage 2 sounds ----- */
  function tone(freq, dur, type, gain, delay) {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime + (delay || 0);
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  function unlockSound() { // futuristic scan-and-chime
    [660, 880, 1320, 1760].forEach((f, i) => tone(f, 0.22, "sine", 0.07, i * 0.07));
    tone(2400, 0.4, "sine", 0.03, 0.3);
  }
  function crateSound() { // low thud + creak burst
    tone(90, 0.35, "sine", 0.12, 0);
    try {
      if (state.muted) return;
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const len = audioCtx.sampleRate * 0.4, buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = audioCtx.createBufferSource(); src.buffer = buf;
      const flt = audioCtx.createBiquadFilter(); flt.type = "bandpass"; flt.frequency.value = 400;
      const g = audioCtx.createGain(); g.gain.value = 0.08;
      src.connect(flt); flt.connect(g); g.connect(audioCtx.destination); src.start();
    } catch (e) {}
  }
  function revealSound() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.08, i * 0.09)); }
  function cryptoRnd() {
    try {
      const a = new Uint32Array(1);
      crypto.getRandomValues(a);
      return a[0] / 4294967296;
    } catch (e) { return Math.random(); }
  }

  /* ----- Modals ----- */
  function showModal(id) { const m = $(id); if (m) m.classList.add("show"); }
  function hideModal(id) { const m = $(id); if (m) m.classList.remove("show"); }
  function itemDetailsHtml(item) {
    let html = `<p>${esc(item.desc)}</p>`;
    if (item.verse) {
      html += `<p class="verse">“${esc(item.verse)}” <span class="muted">— ${esc(item.verseRef)} (KJV)</span></p>`;
      html += `<p><b>What this verse means:</b> ${esc(item.meaning)}</p>`;
    }
    html += `<p class="muted">Slot: ${esc(item.slot)} · Price: ${item.price} WC · Garments show only the verse reference at the hem; the full verse lives here.</p>`;
    return html;
  }

  /* ----- Duplicate scrap flow (blocking, no close path) ----- */
  function showDupModal() {
    const pend = state.pendingDuplicate;
    if (!pend) return;
    const item = ITEM_BY_ID[pend.itemId];
    if (!item) { state.pendingDuplicate = null; persist(); return; }
    $("dupPreview").innerHTML = previewSvg(item);
    $("dupName").textContent = item.name;
    $("dupScrapVal").textContent = pend.scrap;
    showModal("dupModal");
  }
  $("dupScrapBtn").addEventListener("click", () => {
    const pend = state.pendingDuplicate;
    if (!pend) { hideModal("dupModal"); return; }
    state.coins += pend.scrap;
    const item = ITEM_BY_ID[pend.itemId];
    state.pendingDuplicate = null;
    persist();
    hideModal("dupModal");
    renderShop(); renderHeader();
    showBanner("Scrapped <b>" + esc(item ? item.name : "duplicate") + "</b> for <b>+" + pend.scrap + " War Coins</b>.");
  });

  /* ----- Shop ----- */
  let shopFilter = "all";
  function crateSvg(crate) {
    const color = crate.id === "epic" ? "#c8a84a" : crate.id === "rare" ? "#7dd87d" : "#8a8f5c";
    return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:74px;display:block"><rect x="14" y="18" width="92" height="48" fill="#3a3524" stroke="${color}" stroke-width="2.5"/><line x1="14" y1="32" x2="106" y2="32" stroke="${color}" stroke-width="1.5"/><line x1="14" y1="52" x2="106" y2="52" stroke="${color}" stroke-width="1.5"/><rect x="52" y="34" width="16" height="14" fill="none" stroke="${color}" stroke-width="2"/><text x="60" y="44" text-anchor="middle" font-size="9" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-weight="bold">${crate.id === "epic" ? "EPIC" : crate.id === "rare" ? "RARE" : "SUPPLY"}</text></svg>`;
  }
  function renderShop() {
    $("shopCoins").textContent = state.coins.toLocaleString();
    $("shopOwned").textContent = state.owned.length + " owned";
    const today = dateKey(new Date());
    $("shopBoost").textContent = today <= WC_MULT_END ? "1.5× BOOST ACTIVE through Nov 10 — weigh-ins, weekly gains, and fuel days pay 1.5× War Coins." : "";
    $("shopBoost").style.display = today <= WC_MULT_END ? "block" : "none";
    $("crateRow").innerHTML = CRATES.map((c) => {
      const blocked = !!state.pendingDuplicate;
      const afford = state.coins >= c.price;
      return `<div class="crate-card ${blocked ? "blocked" : ""}" id="crate-${c.id}">
        ${crateSvg(c)}
        <b>${esc(c.name)}</b>
        <span class="muted">${c.price} WC · Gear ${(c.gear * 100).toFixed(0)}% · Coins ${(Math.round((1 - c.gear - c.token) * 100))}% · 2× Token ${(c.token * 100).toFixed(0)}%</span>
        <button data-crate="${c.id}" ${!afford && !blocked ? "disabled" : ""}>${blocked ? "Finish duplicate first" : afford ? "Open — " + c.price + " WC" : "Need " + c.price + " WC"}</button>
      </div>`;
    }).join("");
    $("crateRow").querySelectorAll("[data-crate]").forEach((b) => b.addEventListener("click", () => openCrate(b.dataset.crate)));
    const filters = [["all", "All"], ["top", "Tops"], ["bottom", "Bottoms"], ["head", "Headwear"], ["gear", "Gear"], ["owned", "Owned"]];
    $("shopFilters").innerHTML = filters.map(([f, label]) =>
      `<button class="chip ${shopFilter === f ? "on" : ""}" data-filter="${f}">${label}</button>`).join("");
    $("shopFilters").querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => { shopFilter = b.dataset.filter; renderShop(); }));
    const items = SHOP_ITEMS.filter((it) => {
      if (shopFilter === "all") return true;
      if (shopFilter === "owned") return state.owned.includes(it.id);
      return slotFilter(it.slot) === shopFilter;
    });
    $("shopGrid").innerHTML = items.length === 0 ? `<p class="muted">Nothing here yet.</p>` : items.map((it) => {
      const owned = state.owned.includes(it.id);
      const equippedId = state.equipped[it.slot];
      const isEquipped = equippedId === it.id;
      const action = !owned
        ? `<button data-buy="${it.id}" ${state.coins < it.price ? "disabled" : ""}>Buy — ${it.price} WC</button>`
        : isEquipped
          ? `<button class="secondary" data-unequip="${it.id}">Unequip ✓</button>`
          : `<button class="secondary" data-equip="${it.id}">Equip</button>`;
      return `<div class="card shop-card">
        <div class="shop-preview">${previewSvg(it)}</div>
        <div class="shop-title"><b>${esc(it.name)}</b><button class="info-btn" data-info="${it.id}" aria-label="Item details">!</button></div>
        <div class="shop-details" id="details-${it.id}">${itemDetailsHtml(it)}</div>
        <div class="shop-foot"><span class="price">${it.price} WC</span>${owned ? `<span class="owned-tag">${isEquipped ? "Equipped" : "Owned"}</span>` : ""}</div>
        ${action}
      </div>`;
    }).join("");
    $("shopGrid").querySelectorAll("[data-info]").forEach((b) => b.addEventListener("click", () => {
      const el = document.getElementById("details-" + b.dataset.info);
      if (el) el.classList.toggle("open");
    }));
    $("shopGrid").querySelectorAll("[data-buy]").forEach((b) => b.addEventListener("click", () => buyItem(b.dataset.buy)));
    $("shopGrid").querySelectorAll("[data-equip]").forEach((b) => b.addEventListener("click", () => equipItem(b.dataset.equip)));
    $("shopGrid").querySelectorAll("[data-unequip]").forEach((b) => b.addEventListener("click", () => unequipSlot(ITEM_BY_ID[b.dataset.unequip].slot)));
  }
  function buyItem(id) {
    const it = ITEM_BY_ID[id];
    if (!it || state.owned.includes(id)) return;
    if (state.coins < it.price) { showBanner("Not enough War Coins — this costs " + it.price + " WC and you have " + state.coins.toLocaleString() + "."); return; }
    state.coins -= it.price;
    state.owned.push(id);
    persist();
    unlockSound();
    $("unlockPreview").innerHTML = previewSvg(it);
    $("unlockName").textContent = it.name;
    $("unlockEquipBtn").dataset.equip = id;
    showModal("unlockModal");
    renderShop(); renderHeader();
  }
  $("unlockEquipBtn").addEventListener("click", () => {
    equipItem($("unlockEquipBtn").dataset.equip);
    hideModal("unlockModal");
  });
  $("unlockDoneBtn").addEventListener("click", () => hideModal("unlockModal"));
  function equipItem(id) {
    const it = ITEM_BY_ID[id];
    if (!it || !state.owned.includes(id)) return;
    state.equipped[it.slot] = id;
    persist();
    renderShop(); renderCharacter(); renderHeader();
    blip();
  }
  function unequipSlot(slot) {
    state.equipped[slot] = null;
    persist();
    renderShop(); renderCharacter(); renderHeader();
  }
  function openCrate(crateId) {
    if (state.pendingDuplicate) { showDupModal(); return; }
    const crate = CRATE_BY_ID[crateId];
    if (!crate) return;
    if (state.coins < crate.price) { showBanner("Not enough War Coins — this drop costs " + crate.price + " WC."); return; }
    state.coins -= crate.price;
    persist();
    const card = document.getElementById("crate-" + crateId);
    if (card) card.classList.add("opening");
    crateSound();
    setTimeout(() => {
      if (card) card.classList.remove("opening");
      const res = resolveCrateReward(crate, state.owned, cryptoRnd);
      revealSound();
      if (res.kind === "duplicate") {
        state.pendingDuplicate = { itemId: res.item.id, scrap: res.scrap };
        persist();
        renderShop(); renderHeader();
        showDupModal();
        return;
      }
      if (res.kind === "gear") {
        state.owned.push(res.item.id);
        persist();
        $("crateTitle").textContent = crate.name.toUpperCase() + " — NEW GEAR";
        $("crateBody").innerHTML = previewSvg(res.item) + `<p><b>${esc(res.item.name)}</b></p><p class="muted">${esc(res.item.desc)}</p>`;
        $("crateActions").innerHTML = `<button data-crate-equip="${res.item.id}">Equip it</button> <button class="secondary" id="crateCloseBtn">Collect</button>`;
        $("crateActions").querySelector("[data-crate-equip]").addEventListener("click", () => { equipItem(res.item.id); hideModal("crateModal"); });
        $("crateActions").querySelector("#crateCloseBtn").addEventListener("click", () => hideModal("crateModal"));
      } else if (res.kind === "coins") {
        state.coins += res.amount;
        persist();
        $("crateTitle").textContent = crate.name.toUpperCase() + " — WAR COINS";
        $("crateBody").innerHTML = `<p class="big-reward">+${res.amount} WC</p><p class="muted">Straight into your balance.</p>`;
        $("crateActions").innerHTML = `<button class="secondary" id="crateCloseBtn">Collect</button>`;
        $("crateActions").querySelector("#crateCloseBtn").addEventListener("click", () => hideModal("crateModal"));
      } else {
        state.doubleXp.stack += 1;
        persist();
        $("crateTitle").textContent = crate.name.toUpperCase() + " — 2× XP TOKEN";
        $("crateBody").innerHTML = `<p class="big-reward">2× XP Token banked!</p><p class="muted">Activate it in Progress when you want your next session doubled.</p>`;
        $("crateActions").innerHTML = `<button class="secondary" id="crateCloseBtn">Collect</button>`;
        $("crateActions").querySelector("#crateCloseBtn").addEventListener("click", () => hideModal("crateModal"));
      }
      showModal("crateModal");
      renderShop(); renderHeader();
    }, 950);
  }

  /* ----- Character ----- */
  function renderCharacter() {
    const latest = state.weights.length ? state.weights[state.weights.length - 1].weight : state.profile.startWeight;
    $("charFigure").innerHTML = buildCharacterSvg(state.equipped, state.facialHair, latest);
    const level = levelForXp(state.xpTotal);
    $("charStats").innerHTML = "Weight: <b>" + latest + " lbs</b> (goal " + state.profile.goalWeight + ") · Level " + level + " " + esc(rankForLevel(level)) + " · " + state.xpTotal + " XP · " + state.coins.toLocaleString() + " WC";
    const faces = [["clean", "Clean shaven"], ["stubble", "Stubble"], ["beard", "Beard"]];
    $("faceChips").innerHTML = faces.map(([f, label]) =>
      `<button class="chip ${state.facialHair === f ? "on" : ""}" data-face="${f}">${label}</button>`).join("");
    $("faceChips").querySelectorAll("[data-face]").forEach((b) => b.addEventListener("click", () => {
      state.facialHair = b.dataset.face;
      persist();
      renderCharacter();
    }));
    const equippedEntries = Object.entries(state.equipped).filter(([, id]) => id);
    $("equippedList").innerHTML = equippedEntries.length === 0
      ? `<p class="muted">Base kit only: plain shorts, basic olive fatigues shirt, ankle boots. Buy gear in the shop to build the kit.</p>`
      : equippedEntries.map(([slot, id]) => {
        const it = ITEM_BY_ID[id];
        return `<div class="food-entry"><span>${esc(it.name)} <span class="muted">· ${esc(slot)}</span></span><button class="small secondary" data-unequip-slot="${slot}">Unequip</button></div>`;
      }).join("");
    $("equippedList").querySelectorAll("[data-unequip-slot]").forEach((b) => b.addEventListener("click", () => unequipSlot(b.dataset.unequipSlot)));
    const ownedNotEquipped = state.owned.filter((id) => !Object.values(state.equipped).includes(id));
    $("ownedChips").innerHTML = ownedNotEquipped.length === 0
      ? `<p class="muted">No unequipped gear. Everything you own is already on the figure — or the shop is waiting.</p>`
      : ownedNotEquipped.map((id) => {
        const it = ITEM_BY_ID[id];
        return `<button class="chip" data-equip="${id}">${esc(it.name)}</button>`;
      }).join("");
    $("ownedChips").querySelectorAll("[data-equip]").forEach((b) => b.addEventListener("click", () => equipItem(b.dataset.equip)));
  }

  /* ----- Init + midnight rollover ----- */
  $("weightDate").value = dateKey(new Date());
  persist(); // saves the v1 -> v2 migration on first Stage 2 launch
  renderHeader(); renderDays(); renderLog(); renderFood(); renderProgress();
  if (state.pendingDuplicate) showDupModal(); // a duplicate left mid-notice blocks again on next open
  setInterval(() => {
    const today = dateKey(new Date());
    if (today !== lastRenderedDay) {
      lastRenderedDay = today;
      renderHeader(); renderFood();
      showBanner("It's past midnight — yesterday is closed. New entries count for today.");
    } else {
      renderFood(); // refreshes the countdown
    }
  }, 30000);
}
