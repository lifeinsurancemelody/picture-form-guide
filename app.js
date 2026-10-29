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
  { id: "push-cable-pushdown", day: "push", name: "Cable Pushdowns", photo: "assets/photos/cable-pushdown.jpg", load: "cable", sets: 3, repMin: 12, repMax: 15, weight: 50, display: "50 lbs", cues: "Push-day press: elbows pinned to your ribs, full lockout, slow return. Tracked separately from the arms-day pushdown." },
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
/* CoD-style rank insignia as inline SVG (pure, testable). Enlisted chevrons
   build stripe by stripe with rockers below; First Sergeant adds a diamond,
   Sergeant Major a star, Command Sergeant Major star + wreath. Officers: gold
   bar (2nd Lt), silver bar (1st Lt), double silver bars (Captain), gold oak
   leaf (Major), silver oak leaf (Lt Col), eagle (Colonel), 1-4 silver stars
   (Brigadier General through Commander). All badges share a 60x92 frame. */
function starPts(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    pts.push((cx + rad * Math.cos(a)).toFixed(1) + "," + (cy + rad * Math.sin(a)).toFixed(1));
  }
  return pts.join(" ");
}
function rankInsigniaSvg(level, size) {
  const G = "#c8a84a", S = "#d7d7d7", D = "#0e1110";
  const chev = (y) => `<polyline points="15,${y} 30,${y - 12} 45,${y}" fill="none" stroke="${G}" stroke-width="5" stroke-linejoin="miter"/>`;
  const rock = (y) => `<path d="M15,${y} Q30,${y + 10} 45,${y}" fill="none" stroke="${G}" stroke-width="4"/>`;
  const star = (cx, cy, r, fill) => `<polygon points="${starPts(cx, cy, r)}" fill="${fill}" stroke="${D}" stroke-width="1"/>`;
  const diamond = `<polygon points="30,46 39,56 30,66 21,56" fill="${G}" stroke="${D}" stroke-width="1"/>`;
  const wreath = `<path d="M17,66 Q11,56 17,46" fill="none" stroke="${G}" stroke-width="3"/><path d="M43,66 Q49,56 43,46" fill="none" stroke="${G}" stroke-width="3"/>`;
  const bar = (x, fill) => `<rect x="${x}" y="28" width="8" height="36" fill="${fill}" stroke="${D}" stroke-width="1"/>`;
  const leaf = (fill) => `<ellipse cx="30" cy="46" rx="10" ry="17" fill="${fill}" stroke="${D}" stroke-width="1"/><line x1="30" y1="30" x2="30" y2="62" stroke="${D}" stroke-width="1.5"/><line x1="30" y1="40" x2="22" y2="46" stroke="${D}" stroke-width="1"/><line x1="30" y1="40" x2="38" y2="46" stroke="${D}" stroke-width="1"/><line x1="30" y1="50" x2="22" y2="56" stroke="${D}" stroke-width="1"/><line x1="30" y1="50" x2="38" y2="56" stroke="${D}" stroke-width="1"/>`;
  const eagle = `<polygon points="30,28 12,20 20,32 13,42 30,36 47,42 40,32 48,20" fill="${S}" stroke="${D}" stroke-width="1"/><ellipse cx="30" cy="44" rx="6" ry="10" fill="${S}" stroke="${D}" stroke-width="1"/><circle cx="30" cy="34" r="3" fill="${S}" stroke="${D}" stroke-width="1"/>`;
  const chev3 = chev(20) + chev(32) + chev(44);
  let inner = "";
  if (level === 1) inner = chev(44);
  else if (level === 2) inner = chev(36) + rock(56);
  else if (level === 3) inner = chev(32) + chev(44);
  else if (level === 4) inner = chev(28) + chev(40) + rock(56);
  else if (level === 5) inner = chev(24) + chev(36) + chev(48);
  else if (level === 6) inner = chev(24) + chev(36) + chev(48) + rock(62);
  else if (level === 7) inner = chev(24) + chev(36) + chev(48) + rock(62) + rock(72);
  else if (level === 8) inner = chev3 + rock(60) + rock(70) + rock(80);
  else if (level === 9) inner = chev3 + diamond + rock(70) + rock(80);
  else if (level === 10) inner = chev3 + star(30, 56, 10, G) + rock(70) + rock(80);
  else if (level === 11) inner = chev3 + star(30, 56, 10, G) + wreath + rock(70) + rock(80);
  else if (level === 12) inner = bar(26, G);
  else if (level === 13) inner = bar(26, S);
  else if (level === 14) inner = bar(19, S) + bar(33, S);
  else if (level === 15) inner = leaf(G);
  else if (level === 16) inner = leaf(S);
  else if (level === 17) inner = eagle;
  else if (level === 18) inner = star(30, 46, 13, S);
  else if (level === 19) inner = star(20, 46, 10, S) + star(40, 46, 10, S);
  else if (level === 20) inner = star(20, 34, 10, S) + star(40, 34, 10, S) + star(20, 58, 10, S) + star(40, 58, 10, S);
  const px = size || 44;
  return `<svg viewBox="0 0 60 92" width="${px}" height="${Math.round(px * 92 / 60)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Level ${level} insignia">${inner}</svg>`;
}
/* 4-day shop shelf: the catalog splits into 4 near-even groups, rotating
   daily from the anchor. The next rotation is always at midnight. With the
   current 40-item catalog the groups are 10/10/10/10. */
const SHELF_ANCHOR = Date.UTC(2026, 9, 27);
function shelfDayIndex(d) {
  const day = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return ((Math.floor((day - SHELF_ANCHOR) / 86400000) % 4) + 4) % 4;
}
function shelfGroups() {
  const n = SHOP_ITEMS.length, base = Math.floor(n / 4), rem = n % 4;
  const groups = [];
  let start = 0;
  for (let i = 0; i < 4; i++) {
    const size = base + (i < rem ? 1 : 0);
    groups.push(SHOP_ITEMS.slice(start, start + size));
    start += size;
  }
  return groups;
}
function shelfItems(idx) { return shelfGroups()[((idx % 4) + 4) % 4]; }
function rotationInfo(now) {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const minsLeft = Math.max(0, Math.round((midnight - now) / 60000));
  return { idx: shelfDayIndex(now), minsLeft, dayFrac: 1 - minsLeft / 1440 };
}
/* Strength board tallies from session history by progression LABEL,
   regardless of XP attribution — synced lifts carry labels but xp:null and
   are counted, and the four seeded sessions now carry artifact-record labels
   too. Lifts with no progression label (first-time "Logged" lifts) can't be
   categorized and aren't counted; the board has no first-time column. */
function boardCounts(sessions) {
  let progress = 0, held = 0, reset = 0;
  (sessions || []).forEach((s) => Object.values(s.lifts || {}).forEach((l) => {
    if (l.label === "Move-up") progress++;
    else if (l.label === "Held") held++;
    else if (l.label === "Reset") reset++;
  }));
  return { progress, held, reset };
}
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
/* Lift scoring vs the previous session's same lift, aligned to the artifact
   ledger: move-up +1, goal/milestone hit (the goal checkbox) +1, held or
   reset +0, first-time lift +1. A goal hit pays even on a held or reset lift
   (artifact evidence: Oct 16 legs and Oct 21 overhead press both paid a
   milestone on non-move-up lifts). Top-of-range alone (no checkbox) rolls
   the target and pays coins but is not a milestone for XP. */
function scoreLift(prev, curWeight, curReps, goalHit) {
  if (!prev) return { label: "Logged", xp: 1 };
  const prevTotal = totalReps(prev.reps), curTotal = totalReps(curReps);
  const movedUp = curWeight > prev.weight || (curWeight === prev.weight && curTotal > prevTotal);
  const label = movedUp ? "Move-up" : (curWeight === prev.weight && curTotal === prevTotal ? "Held" : "Reset");
  return { label, xp: (movedUp ? 1 : 0) + (goalHit ? 1 : 0) };
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

/* ---------------- Artifact snapshot sync (2026-10-29) ----------------
   One-way sync from the Muse artifact app's dashboard, so the PWA lands
   current (91 XP, level 10, 802 WC) instead of the Oct 28 seed. Sessions,
   weights, and food days are added BY DATE (never duplicated, never
   overwriting an existing date). Added sessions carry xp:null lifts — their
   XP is already inside the 91 total — so deleting one never moves the
   total, exactly like the original seeded lifts. Synced sessions bank NO
   new claimable double-XP charges.
   GUARD: totals/coins/character/targets are applied ONLY when the stored
   state still matches the known Oct 28 snapshot (xpTotal 83 AND coins 1160
   AND no session dated after 2026-10-14). If he logged anything in the
   PWA since, totals/coins/character/targets are left alone and only the
   missing dated records are added. The whole sync is idempotent: running
   it twice changes nothing the second time.
   NOTE: push-day pushdown history now lives under the distinct
   "push-cable-pushdown" exercise (user-confirmed split 2026-10-29): the
   Oct 14 / 21 / 28 push sessions' pushdowns (50 lbs) were re-keyed from
   the arms-day slot, and migrateState moves them on phones that already
   synced. Arms-day pushdown history (e.g. 60 lbs entries) stays under
   "cable-pushdown" untouched. */
const SYNC_LABEL = { progress: "Move-up", held: "Held", reset: "Reset" };
function syncLift(weight, reps, status, extra) {
  return Object.assign({ weight, reps, goalHit: false, xp: null, label: SYNC_LABEL[status] }, extra || {});
}
const SYNC_SESSIONS = [
  { date: "2026-10-15", dayId: "pull", doubled: false, strengthXp: 8, lifts: {
    "lat-pulldown": syncLift(80, [15, 15, 15], "progress"),
    "single-arm-row": syncLift(40, [12, 12, 12], "progress"),
    "face-pull": syncLift(40, [12, 12, 15], "progress"),
    "hammer-curl": syncLift(20, [12, 12, 12], "progress") } },
  { date: "2026-10-16", dayId: "legs", doubled: false, strengthXp: 5, lifts: {
    "goblet-squat": syncLift(35, [15, 15, 15], "reset"),
    "romanian-deadlift": syncLift(20, [12, 12, 12], "reset"),
    "walking-lunge": syncLift(15, [12, 12], "held"),
    "calf-raise": syncLift(15, [20, 20], "progress") } },
  { date: "2026-10-20", dayId: "arms", doubled: false, strengthXp: 10, lifts: {
    "cable-lateral-raise": syncLift(20, [15, 12, 12, 10], "progress"),
    "db-lateral-raise": syncLift(10, [15, 12, 12], "progress"),
    "bicep-curl": syncLift(25, [12, 10, 10], "held"),
    "cable-pushdown": syncLift(50, [15, 15, 15], "progress"),
    "incline-curl": syncLift(15, [12, 12, 12], "progress"),
    "overhead-extension": syncLift(40, [12, 12, 12], "progress") } },
  { date: "2026-10-21", dayId: "push", doubled: false, strengthXp: 5, lifts: {
    "bench-press": syncLift(35, [12, 12, 12, 12], "progress"),
    "overhead-press": syncLift(20, [12, 12, 12], "reset"),
    "incline-press": syncLift(20, [15, 12, 12], "progress"),
    "push-cable-pushdown": syncLift(50, [12, 12, 12], "held") } },
  { date: "2026-10-22", dayId: "pull", doubled: false, strengthXp: 5, lifts: {
    "lat-pulldown": syncLift(90, [12, 12, 10, 12], "progress"),
    "single-arm-row": syncLift(45, [12, 12, 12], "progress"),
    "face-pull": syncLift(50, [12, 10, 12], "progress"),
    "hammer-curl": syncLift(25, [10, 12, 10], "progress") } },
  { date: "2026-10-23", dayId: "legs", doubled: false, strengthXp: 7, lifts: {
    "goblet-squat": syncLift(40, [12, 12, 12, 12], "progress"),
    "romanian-deadlift": syncLift(25, [12, 12, 12], "progress"),
    "walking-lunge": syncLift(20, [13, 13], "progress"),
    "calf-raise": syncLift(20, [20, 20], "progress") } },
  { date: "2026-10-27", dayId: "arms", doubled: true, strengthXp: 10, lifts: {
    "cable-lateral-raise": syncLift(20, [12, 12, 12, 12], "reset"),
    "db-lateral-raise": syncLift(15, [10, 8, 10], "progress"),
    "bicep-curl": syncLift(25, [12, 12, 10], "progress"),
    "cable-pushdown": syncLift(60, [12, 10, 10], "progress"),
    "incline-curl": syncLift(20, [12, 10, 10], "progress"),
    "overhead-extension": syncLift(50, [10, 10], "progress") } },
  { date: "2026-10-28", dayId: "push", doubled: true, strengthXp: 6, lifts: {
    "bench-press": syncLift(40, [8, 8, 8], "progress"),
    "overhead-press": syncLift(25, [8, 8, 8], "progress"),
    "incline-press": syncLift(25, [9, 8, 8], "progress"),
    "push-cable-pushdown": syncLift(50, [12, 11, 12], "reset") } },
  { date: "2026-10-29", dayId: "pull", doubled: true, strengthXp: 8, lifts: {
    "lat-pulldown": syncLift(90, [12, 12, 12, 12], "progress", { goalHit: true, note: "Milestone · target hit" }),
    "single-arm-row": syncLift(50, [10, 10, 12], "progress"),
    "face-pull": syncLift(50, [12, 12, 12], "progress"),
    "hammer-curl": syncLift(25, [10, 10, 8], "reset", { note: "Failed on last set" }) } }
];
const SYNC_WEIGHTS = [
  { date: "2026-10-16", weight: 149 }, { date: "2026-10-20", weight: 149.8 },
  { date: "2026-10-21", weight: 151.8 }, { date: "2026-10-22", weight: 152.6 },
  { date: "2026-10-24", weight: 150.4 }, { date: "2026-10-25", weight: 151.4 },
  { date: "2026-10-26", weight: 154.4 }, { date: "2026-10-27", weight: 151.4 },
  { date: "2026-10-28", weight: 152.6 }
];
function syncFoodDay(cal, protein, proteinBonus, calBonus) {
  return { entries: [{ id: "sync-day", name: "Synced day total", cal, protein, time: "12:00" }],
    bonus: { protein: proteinBonus, cal: calBonus } };
}
const SYNC_FOOD_DAYS = {
  "2026-09-28": syncFoodDay(2215, 177, true, false),
  "2026-09-29": syncFoodDay(2040, 144, true, false),
  "2026-09-30": syncFoodDay(2110, 114, false, false),
  "2026-10-01": syncFoodDay(1720, 129, false, false),
  "2026-10-02": syncFoodDay(1870, 159, true, false),
  "2026-10-09": syncFoodDay(1940, 160, true, false),
  "2026-10-10": syncFoodDay(2060, 180, true, false),
  "2026-10-13": syncFoodDay(890, 58, false, false),
  "2026-10-14": syncFoodDay(3430, 167, true, true),
  "2026-10-15": syncFoodDay(1770, 157, true, false),
  "2026-10-16": syncFoodDay(2230, 116, false, false),
  "2026-10-19": syncFoodDay(1297, 121, false, false),
  "2026-10-21": syncFoodDay(2520, 154, true, false),
  "2026-10-22": syncFoodDay(2060, 110, false, false),
  "2026-10-27": syncFoodDay(1410, 126, false, false)
};
Object.entries(SYNC_FOOD_DAYS).forEach(([d, day]) => { day.entries[0].id = "sync-" + d; });
// Artifact owned items mapped to PWA catalog ids by name. The four items the
// parity build added to the catalog (Micah Dog Tags, Camo Verse Hoodie,
// Charcoal Joggers, Night Ops Figure) are included here, so the snapshot sync
// unions them into the owned set on existing phones (no charge — they are
// proven artifact-owned) and the fresh-install seed owns them too. The union
// is idempotent: a second run adds nothing. Artifact tee-eph610 maps to the
// PWA Armor of God tee (Eph 6); the PWA item cites Eph 6:11, the artifact id
// cites 6:10. The Camo Verse Hoodie's verse/word stays blank (pending the
// user's call) — nothing is invented for it.
const SYNC_OWNED = ["dogtags", "bible", "wooden-cross", "pith-helmet", "saint-jacket",
  "field-pouch", "run-tank", "heartily-tee", "armor-tee", "faith-tee", "courage-crew",
  "dogtag-micah", "hoodie-camo-verse", "joggers-charcoal", "figure-night"];
const SYNC_EQUIPPED = { top: "run-tank", neck: "dogtags", hand: "bible" };
const SYNC_TARGETS = { "lat-pulldown": 100, "single-arm-row": 50, "face-pull": 50,
  "hammer-curl": 25, "bench-press": 40, "overhead-press": 25, "incline-press": 25,
  "cable-pushdown": 60, "cable-lateral-raise": 20, "db-lateral-raise": 15,
  "bicep-curl": 25, "incline-curl": 20, "overhead-extension": 50, "goblet-squat": 40,
  "romanian-deadlift": 25, "walking-lunge": 20, "calf-raise": 20 };
const SYNC_TOTALS = { xpTotal: 91, coins: 802, stack: 4, active: true, claimable: 0 };
// Two completed gain weeks = 4 weight XP (artifact total). The week of
// 2026-10-26 is still open, so it stays unpaid here.
const SYNC_WEIGHT_XP_WEEKS = ["2026-10-12", "2026-10-19"];
// Artifact-record labels for the four seeded sessions (2026-10-29 follow-up).
// Shared by the fresh-install seed and the backfill in syncArtifactSnapshot.
const SEED_LABELS = {
  "2026-10-08": { "lat-pulldown": "Move-up", "single-arm-row": "Move-up", "face-pull": "Held", "hammer-curl": "Held" },
  "2026-10-09": { "goblet-squat": "Move-up", "romanian-deadlift": "Move-up", "walking-lunge": "Move-up", "calf-raise": "Held" },
  "2026-10-13": { "cable-lateral-raise": "Move-up", "db-lateral-raise": "Move-up", "bicep-curl": "Move-up", "cable-pushdown": "Move-up", "incline-curl": "Held", "overhead-extension": "Reset" },
  "2026-10-14": { "bench-press": "Move-up", "overhead-press": "Move-up", "incline-press": "Move-up", "push-cable-pushdown": "Move-up" }
};
function syncArtifactSnapshot(state) {
  const info = { guardPassed: false, addedSessions: [], addedWeights: [], addedFoodDays: [], addedOwned: [], skippedDates: [], relabeledSeeded: [] };
  if (!state || !state.targets || !Array.isArray(state.sessions)) return info;
  const guard = state.xpTotal === 83 && state.coins === 1160 &&
    !state.sessions.some((s) => s.date > "2026-10-14");
  SYNC_SESSIONS.forEach((s) => {
    if (findSession(state, s.date)) { info.skippedDates.push(s.date); return; }
    state.sessions.push(JSON.parse(JSON.stringify(s)));
    info.addedSessions.push(s.date);
  });
  SYNC_WEIGHTS.forEach((w) => {
    if (state.weights.some((x) => x.date === w.date)) { info.skippedDates.push(w.date); return; }
    state.weights.push({ date: w.date, weight: w.weight });
    info.addedWeights.push(w.date);
  });
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  Object.entries(SYNC_FOOD_DAYS).forEach(([date, day]) => {
    if (state.foodDays[date]) { info.skippedDates.push(date); return; }
    state.foodDays[date] = JSON.parse(JSON.stringify(day));
    info.addedFoodDays.push(date);
  });
  if (!Array.isArray(state.owned)) state.owned = [];
  SYNC_OWNED.forEach((id) => {
    if (!state.owned.includes(id)) { state.owned.push(id); info.addedOwned.push(id); }
  });
  // Seeded-session label backfill (artifact record, 2026-10-29 follow-up):
  // the four seeded sessions shipped with label "Seeded", so the board
  // skipped them. Relabel any phone whose seeded lifts still say "Seeded".
  // Label-only: xp stays null, totals never move. Idempotent — a second run
  // finds no "Seeded" labels and changes nothing. Re-saved lifts (real
  // labels) are never touched. Not under guard: labels don't affect totals.
  Object.entries(SEED_LABELS).forEach(([date, labels]) => {
    const sess = findSession(state, date);
    if (!sess || !sess.lifts) return;
    Object.entries(labels).forEach(([exId, label]) => {
      const l = sess.lifts[exId];
      if (l && l.label === "Seeded") { l.label = label; info.relabeledSeeded.push(date + ":" + exId); }
    });
  });
  if (guard) {
    state.xpTotal = SYNC_TOTALS.xpTotal;
    state.coins = SYNC_TOTALS.coins;
    state.doubleXp = { stack: SYNC_TOTALS.stack, active: SYNC_TOTALS.active, claimable: SYNC_TOTALS.claimable };
    state.equipped = Object.assign({}, EMPTY_EQUIPPED, SYNC_EQUIPPED);
    state.facialHair = "clean";
    state.weightXpWeeks = SYNC_WEIGHT_XP_WEEKS.slice();
    Object.entries(SYNC_TARGETS).forEach(([exId, weight]) => {
      if (state.targets[exId]) state.targets[exId].weight = weight;
    });
    info.guardPassed = true;
  }
  return info;
}

/* ---------------- Seed state (verified values only) ---------------- */
function seedState() {
  const targets = {};
  EXERCISES.forEach((e) => { targets[e.id] = { weight: e.weight, sets: e.sets, repMin: e.repMin, repMax: e.repMax }; });
  Object.entries(SYNC_TARGETS).forEach(([exId, weight]) => { if (targets[exId]) targets[exId].weight = weight; });
  const lift = (weight, reps, extra) => Object.assign({ weight, reps, goalHit: false, xp: null, label: "Seeded" }, extra || {});
  return {
    version: 2,
    profile: { name: "Anthony", age: 31, height: "5'11\"", startWeight: 140, goalWeight: 165, creatine: 5 },
    xpTotal: 91,
    coins: 802,
    doubleXp: { stack: 4, active: true, claimable: 0 },
    owned: SYNC_OWNED.slice(),
    equipped: Object.assign({}, EMPTY_EQUIPPED, SYNC_EQUIPPED),
    facialHair: "clean",
    figureVariant: "standard",
    prestige: 0,
    achievements: [],
    questEvents: [],
    questNotified: {},
    collapsed: {},
    purchaseCount: 0,
    crateCount: 0,
    scrapCount: 0,
    pendingDuplicate: null,
    weights: [
      { date: "2026-09-22", weight: 140 },
      { date: "2026-10-15", weight: 148.6 },
      ...SYNC_WEIGHTS.map((w) => ({ date: w.date, weight: w.weight }))
    ],
    weightXpWeeks: SYNC_WEIGHT_XP_WEEKS.slice(),
    targets,
    sessions: [
      { date: "2026-10-08", dayId: "pull", doubled: null, lifts: {
        "lat-pulldown": lift(80, [15, 8, 8, 8], { note: "First set at 70 lbs", label: "Move-up" }),
        "single-arm-row": lift(40, [10, 10, 12], { label: "Move-up" }),
        "face-pull": lift(40, [12, 12, 12], { label: "Held" }),
        "hammer-curl": lift(15, [15, 12, 13], { label: "Held" }) } },
      { date: "2026-10-09", dayId: "legs", doubled: null, lifts: {
        "goblet-squat": lift(35, [12, 12, 12, 12], { label: "Move-up" }),
        "romanian-deadlift": lift(20, [15, 15, 15], { label: "Move-up" }),
        "walking-lunge": lift(15, [12, 12], { label: "Move-up" }),
        "calf-raise": lift(10, [20, 20], { label: "Held" }) } },
      { date: "2026-10-13", dayId: "arms", doubled: null, lifts: {
        "cable-lateral-raise": lift(20, [12, 12, 12, 12], { label: "Move-up" }),
        "db-lateral-raise": lift(10, [10, 10, 10], { label: "Move-up" }),
        "bicep-curl": lift(25, [12, 10, 10], { label: "Move-up" }),
        "cable-pushdown": lift(50, [15, 15, 10], { label: "Move-up" }),
        "incline-curl": lift(15, [15, 15], { label: "Held" }),
        "overhead-extension": lift(40, [12, 12], { label: "Reset" }) } },
      { date: "2026-10-14", dayId: "push", doubled: null, lifts: {
        "bench-press": lift(35, [12, 10, 10, 10], { label: "Move-up" }),
        "overhead-press": lift(20, [15, 12, 10], { label: "Move-up" }),
        "incline-press": lift(20, [12, 11, 15], { label: "Move-up" }),
        "push-cable-pushdown": lift(50, [12, 12, 12], { label: "Move-up" }) } },
      ...JSON.parse(JSON.stringify(SYNC_SESSIONS))
    ],
    // Training week 12 (all four days) is recorded as completed without lift numbers.
    completedWeeks: ["2026-10-19"],
    foodDays: {
      "2026-10-28": { entries: [
        { id: "seed1", name: "Taco Bell cheesy bean and rice burrito ×3", cal: 1260, protein: 39, time: "13:40" },
        { id: "seed2", name: "Taco Bell spicy potato soft taco ×2", cal: 460, protein: 14, time: "13:40" }
      ], bonus: { protein: false, cal: false } },
      ...JSON.parse(JSON.stringify(SYNC_FOOD_DAYS))
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
  // XP caps at 200 until a prestige is claimed; excess is discarded.
  state.xpTotal = Math.min(XP_CAP, state.xpTotal + n);
  return { leveledUp: levelForXp(state.xpTotal) > before, newLevel: levelForXp(state.xpTotal) };
}
/* Prestige: at 200 XP the cycle banks one prestige and restarts at 0 XP /
   Level 1. ONLY the XP/level cycle resets — War Coins, owned items,
   equipped/character, history, weights, and banked/active double-XP charges
   all carry over, as do weeks that already paid weight XP. */
function prestigeToState(state) {
  if (!state || state.xpTotal < XP_CAP) return false;
  state.prestige = (state.prestige || 0) + 1;
  state.xpTotal = 0;
  return true;
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
  const scored = scoreLift(prevForScore ? prevForScore.lifts[exId] : null, weight, reps, goalHit);
  const doubled = session.doubled === true;
  const earned = scored.xp * (doubled ? 2 : 1);
  // Re-saving a lift replaces it: subtract the old lift's XP first so a
  // re-save never double-counts (delete-then-save semantics). Coins are
  // permanent ledger entries and are not subtracted, matching deletes.
  const oldLift = session.lifts[exId] || null;
  const oldXp = oldLift && typeof oldLift.xp === "number" ? oldLift.xp : 0;
  if (oldXp) state.xpTotal -= oldXp;
  session.lifts[exId] = { weight, reps, goalHit, xp: earned, label: scored.label };
  const xpInfo = addXp(state, earned);
  // War Coins: new session +25, +1 per set, +1 per 5 reps, +15 on a move-up.
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
  return { scored, earned, xpDelta: earned - oldXp, replaced: !!oldLift, doubled, rolled, sessionWasNew, leveledUp: xpInfo.leveledUp, newLevel: xpInfo.newLevel, coinsEarned };
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
/* Food delete matches the artifact: removing an entry recalculates the
   day's protein/calorie bonus flags and claws back the bonus XP they paid
   (+1 per lost bonus). War Coins are NOT clawed back — they are permanent
   ledger entries that may already be spent, matching lift/session deletes.
   Only today's entries are removable in the UI; closed days stay final. */
function removeFoodFromState(state, dateStr, entryId) {
  const day = state.foodDays[dateStr];
  if (!day) return { removed: false, xpLost: 0, lostProtein: false, lostCal: false };
  const before = day.entries.length;
  day.entries = day.entries.filter((e) => e.id !== entryId);
  if (day.entries.length === before) return { removed: false, xpLost: 0, lostProtein: false, lostCal: false };
  const totals = dayTotals(day);
  let xpLost = 0, lostProtein = false, lostCal = false;
  if (day.bonus.protein && totals.protein < PROTEIN_TARGET) { day.bonus.protein = false; xpLost += 1; lostProtein = true; }
  if (day.bonus.cal && totals.cal < CAL_TARGET) { day.bonus.cal = false; xpLost += 1; lostCal = true; }
  if (xpLost) state.xpTotal = Math.max(0, state.xpTotal - xpLost);
  if (day.entries.length === 0) delete state.foodDays[dateStr];
  return { removed: true, xpLost, lostProtein, lostCal };
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

/* ---------------- Achievements (lifetime badges) + Quests (weekly goals) ----------------
   DRAFT lists for the user's approval (he doesn't remember the old app's).
   Recognition only: NO XP or War Coin rewards are attached in this draft.
   Achievements evaluate from state, so synced history counts for session /
   move-up / target / food / weigh-in badges; shop-action badges (purchase,
   crate, scrap) need real PWA actions, since the PWA has no record of the
   artifact's shop history. Quests measure the CURRENT week (Monday-anchored)
   and refresh automatically when the week rolls over. */
const ACHIEVEMENTS = [
  { id: "first-session", name: "First Session", desc: "Log your first workout session." },
  { id: "first-moveup", name: "Moving Up", desc: "Log your first move-up lift." },
  { id: "first-target", name: "Target Hit", desc: "Hit a goal on a lift for the first time." },
  { id: "sessions-10", name: "10 Sessions", desc: "Log 10 workout sessions." },
  { id: "sessions-25", name: "25 Sessions", desc: "Log 25 workout sessions." },
  { id: "sessions-50", name: "50 Sessions", desc: "Log 50 workout sessions." },
  { id: "first-purchase", name: "First Purchase", desc: "Buy your first shop item." },
  { id: "first-crate", name: "First Drop", desc: "Open your first supply crate." },
  { id: "first-scrap", name: "Scrap Dealer", desc: "Scrap your first duplicate reward." },
  { id: "protein-streak-3", name: "Protein Streak ×3", desc: "Hit the protein target 3 days in a row." },
  { id: "calorie-day", name: "Fuelled Up", desc: "Hit the 3,200-calorie target on a day." },
  { id: "first-weighin", name: "On the Scale", desc: "Log your first weigh-in." },
  { id: "weekly-gain", name: "Gaining", desc: "Finish a week with a higher average weigh-in." },
  { id: "first-prestige", name: "First Prestige", desc: "Prestige for the first time." }
];
function achievementEarned(state, id) {
  const sessions = state.sessions || [];
  const hasLift = (pred) => sessions.some((s) => Object.values(s.lifts || {}).some(pred));
  switch (id) {
    case "first-session": return sessions.length > 0;
    case "first-moveup": return hasLift((l) => l.label === "Move-up");
    case "first-target": return hasLift((l) => l.goalHit === true);
    case "sessions-10": return sessions.length >= 10;
    case "sessions-25": return sessions.length >= 25;
    case "sessions-50": return sessions.length >= 50;
    case "first-purchase": return (state.purchaseCount || 0) > 0;
    case "first-crate": return (state.crateCount || 0) > 0;
    case "first-scrap": return (state.scrapCount || 0) > 0;
    case "protein-streak-3": {
      const days = Object.keys(state.foodDays || {}).filter((d) => state.foodDays[d].bonus && state.foodDays[d].bonus.protein).sort();
      for (let i = 0; i + 2 < days.length; i++) {
        if (parseDate(days[i + 1]) - parseDate(days[i]) === 86400000 && parseDate(days[i + 2]) - parseDate(days[i + 1]) === 86400000) return true;
      }
      return false;
    }
    case "calorie-day": return Object.values(state.foodDays || {}).some((d) => d.bonus && d.bonus.cal);
    case "first-weighin": return (state.weights || []).length > 0;
    case "weekly-gain": return (state.weightXpWeeks || []).length > 0;
    case "first-prestige": return (state.prestige || 0) > 0;
  }
  return false;
}
/* Awards every newly-earned achievement; returns the fresh ones (for banners). */
function awardAchievements(state) {
  if (!Array.isArray(state.achievements)) state.achievements = [];
  const fresh = [];
  ACHIEVEMENTS.forEach((a) => {
    if (!state.achievements.includes(a.id) && achievementEarned(state, a.id)) {
      state.achievements.push(a.id);
      fresh.push(a);
    }
  });
  return fresh;
}
const QUESTS = [
  { id: "week-4-days", name: "Full Week", desc: "Log all 4 training days in a week.", target: 4 },
  { id: "week-protein-5", name: "Protein Week", desc: "Hit the protein target on 5 days in a week.", target: 5 },
  { id: "week-weighins-3", name: "Check In", desc: "Log 3 weigh-ins in a week.", target: 3 },
  { id: "week-crate", name: "Supply Run", desc: "Open a supply crate this week.", target: 1 },
  { id: "week-equip", name: "Fresh Kit", desc: "Equip a new item this week.", target: 1 },
  { id: "week-moveups-5", name: "Moving Week", desc: "Log 5 move-up lifts in a week.", target: 5 }
];
function questProgress(state, quest, weekKey) {
  const wk = weekKey || weekKeyOf(dateKey(new Date()));
  let current = 0;
  if (quest.id === "week-4-days") {
    current = new Set((state.sessions || []).filter((s) => weekKeyOf(s.date) === wk).map((s) => s.dayId)).size;
  } else if (quest.id === "week-protein-5") {
    current = Object.entries(state.foodDays || {}).filter(([d, day]) => weekKeyOf(d) === wk && day.bonus && day.bonus.protein).length;
  } else if (quest.id === "week-weighins-3") {
    current = (state.weights || []).filter((w) => weekKeyOf(w.date) === wk).length;
  } else if (quest.id === "week-crate") {
    current = (state.questEvents || []).filter((e) => e.type === "crate" && e.week === wk).length;
  } else if (quest.id === "week-equip") {
    current = (state.questEvents || []).filter((e) => e.type === "equip" && e.week === wk).length;
  } else if (quest.id === "week-moveups-5") {
    (state.sessions || []).filter((s) => weekKeyOf(s.date) === wk).forEach((s) => {
      Object.values(s.lifts || {}).forEach((l) => { if (l.label === "Move-up") current++; });
    });
  }
  return { current: Math.min(current, quest.target), target: quest.target, done: current >= quest.target };
}
/* Returns quests newly completed this week (bannered once per week each). */
function checkQuests(state) {
  if (!state.questNotified || typeof state.questNotified !== "object") state.questNotified = {};
  const wk = weekKeyOf(dateKey(new Date()));
  const fresh = [];
  QUESTS.forEach((q) => {
    if (questProgress(state, q, wk).done && state.questNotified[q.id] !== wk) {
      state.questNotified[q.id] = wk;
      fresh.push(q);
    }
  });
  return fresh;
}

/* ---------------- Stage 2: shop catalog, War Coins, crates, character ---------------- */
/* War Coins economy. Awards are permanent ledger entries: deleting a lift or
   session recalculates XP but never claws coins back (they may already be spent). */
const WC_MULT_END = "2026-11-10"; // 1.5x on weigh-ins, weekly gains, fuel days through this date
const WC_SESSION = 25, WC_PER_SET = 1, WC_PER_5_REPS = 1, WC_MOVEUP = 15, WC_ROLLUP = 10;
const WC_PROTEIN_DAY = 20, WC_CAL_DAY = 20, WC_WEIGHIN = 15, WC_WEEKLY_GAIN = 30;
function wcMult(dateStr) { return dateStr <= WC_MULT_END ? 1.5 : 1; }
function wcBoosted(n, dateStr) { return Math.round(n * wcMult(dateStr)); }

/* Shop catalog. Tops are all cut like the Saint Script jacket (wide boxy body,
   dropped shoulders, cropped ribbed hem, small script wordmark). Bottoms are all
   cut like the baggy camo cargos (wide legs, bellows pockets, pooled hem).
   Scripture rule: garments show ONLY the verse reference, printed small at the
   hem. The full verse and its plain-language meaning live in the description.
   Saint (Dan 7:18) and the Camo Verse Hoodie (2 Tim 2:3, wordmark SOLDIER) are
   user-approved picks (delegated choice, 2026-10-29). Night Ops stays verse-less
   by design; non-scripture gear carries no verse. */
const SHOP_ITEMS = [
  // ---- Tops ----
  { id: "saint-jacket", name: "Saint Script Jacket", slot: "top", price: 300, cut: "jacket", main: "#e8ddc0", dark: "#c9b98f", accent: "#3a3a3a", word: "Saint", wordStyle: "script", verseRef: "Dan 7:18", verse: "But the saints of the most High shall take the kingdom, and possess the kingdom for ever, even for ever and ever.", meaning: "The saints don't just survive the fight — they take the kingdom and hold it forever.", desc: "Cream cropped script jacket with a boxy body, dropped shoulders, and a ribbed hem." },
  { id: "faith-tee", name: "Faith Over Fear Tee", slot: "top", price: 150, cut: "tee", main: "#2e2e2e", dark: "#1c1c1c", accent: "#c8a84a", word: "FAITH", wordStyle: "gothic", verseRef: "Heb 11:1", verse: "Now faith is the substance of things hoped for, the evidence of things not seen.", meaning: "Faith is trusting what you can't see yet — like gains before they show.", desc: "Black oversized gothic tee with a bold FAITH chest print and a cracked vintage wash." },
  { id: "fearnot-tee", name: "Fear Not Gothic Tee", slot: "top", price: 150, cut: "tee", main: "#3a3f2a", dark: "#242816", accent: "#e8e6df", word: "FEAR NOT", wordStyle: "gothic", verseRef: "Isa 41:10", verse: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", meaning: "When the weight feels heavy, you're not facing it alone.", desc: "Olive gothic tee with dripping FEAR NOT lettering across the chest." },
  { id: "strength-cover", name: "Strength Pump Cover", slot: "top", price: 180, cut: "tee", main: "#4a4a44", dark: "#2c2c28", accent: "#c8a84a", word: "Strength", wordStyle: "bold", verseRef: "Phil 4:13", verse: "I can do all things through Christ which strengtheneth me.", meaning: "Your strength for the hard sets comes from beyond yourself.", desc: "Boxy pump cover with a cropped raw hem, made to come off after warm-ups." },
  { id: "shepherd-anorak", name: "Shepherd Anorak", slot: "top", price: 220, cut: "anorak", main: "#6b6f3f", dark: "#4a4d2a", accent: "#e8ddc0", word: "Shepherd", wordStyle: "script", verseRef: "Ps 23", verse: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.", meaning: "Guided and provided for — nothing missing.", desc: "Olive hooded anorak with a roomy boxy cut and a chest pocket." },
  { id: "bestill-tee", name: "Be Still Tee", slot: "top", price: 150, cut: "tee", main: "#d8d2c0", dark: "#b0a888", accent: "#3a3a3a", word: "Be Still", wordStyle: "script", verseRef: "Ps 46:10", verse: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.", meaning: "Stop striving for a second and remember who's in charge.", desc: "Cream boxy tee with a small script wordmark and a soft washed finish." },
  { id: "armor-tee", name: "Armor of God Tee", slot: "top", price: 160, cut: "tee", main: "#23241f", dark: "#14150f", accent: "#c8a84a", word: "Armor", wordStyle: "gothic", verseRef: "Eph 6:10–17", verse: "Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil. For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places. Wherefore take unto you the whole armour of God, that ye may be able to withstand in the evil day, and having done all, to stand. Stand therefore, having your loins girt about with truth, and having on the breastplate of righteousness; And your feet shod with the preparation of the gospel of peace; Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked. And take the helmet of salvation, and the sword of the Spirit, which is the word of God:", meaning: "Suit up daily — training is a battle too.", desc: "Black gothic tee with gold Armor lettering and a faded cracked print." },
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
  { id: "dumbbells", name: "Iron Dumbbell Pair", slot: "hand", price: 150, glyph: "dumbbells", held: "dumbbells", desc: "A pair of iron dumbbells, one gripped in each fist." },
  // ---- Artifact-owned additions (no PWA equivalent existed) ----
  { id: "dogtag-micah", name: "Micah Dog Tags", slot: "neck", price: 100, glyph: "dogtags", verseRef: "Mic 6:8", verse: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?", meaning: "The whole job in one line: do right, love mercy, walk humbly with God.", desc: "Second dog-tags item — Micah edition, on a long chain, hanging low so it never covers a chest print." },
  { id: "hoodie-camo-verse", name: "Camo Verse Hoodie", slot: "top", price: 220, cut: "hoodie", camo: "woodland", main: "#5a6136", dark: "#3d4426", accent: "#e8ddc0", word: "SOLDIER", wordStyle: "bold", verseRef: "2 Tim 2:3", verse: "Thou therefore endure hardness, as a good soldier of Jesus Christ.", meaning: "A good soldier doesn't get to pick easy days — he endures the hard ones.", desc: "Woodland camo pullover hoodie with a roomy boxy cut and a kangaroo pocket." },
  { id: "joggers-charcoal", name: "Charcoal Joggers", slot: "bottom", price: 150, camo: null, main: "#3a3a3a", dark: "#222222", accent: "#000000", desc: "Charcoal joggers with a tapered leg and cuffed hem." },
  // ---- Figure variants ----
  { id: "figure-night", name: "Night Ops Figure", slot: "figure", price: 250, glyph: "figure-night", desc: "Night Ops figure variant — blacked-out kit for night sessions. Same bulk, same lifts." }
];
/* Era badges: '90s gym bro vs 2026 gym bro, inferred from cut and style.
   Unlisted items default to "both" (timeless gear, or ambiguous — see the
   build notes: camo hoodie, figure variant, vintage head/eyewear). */
const ITEM_ERA = {
  "saint-jacket": "2026", "shepherd-anorak": "2026", "bestill-tee": "2026", "armor-tee": "2026",
  "eagles-tee": "2026", "courage-crew": "2026", "heartily-tee": "2026", "endure-hoodie": "2026",
  "purpose-pullover": "2026", "nightops-tank": "2026", "joggers-charcoal": "2026",
  "faith-tee": "90s", "fearnot-tee": "90s", "strength-cover": "90s", "run-tank": "90s",
  "shield-stringer": "90s", "woodland-cargos": "90s", "duck-cargos": "90s", "olive-cargos": "90s",
  "black-cargos": "90s", "desert-cargos": "90s", "beanie": "90s", "bandolier": "90s",
  "tall-boots": "90s", "aviator-cap": "90s"
};
SHOP_ITEMS.forEach((it) => { it.era = ITEM_ERA[it.id] || "both"; });
function eraBadge(it) { return it.era === "90s" ? "’90s" : it.era === "2026" ? "2026" : ""; }
function eraMatches(it, era) { return era === "all" || it.era === era || it.era === "both"; }
const ITEM_BY_ID = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));
const EMPTY_EQUIPPED = { top: null, bottom: null, head: null, eyes: null, neck: null, waist: null, chest: null, shoulder: null, hip: null, socks: null, feet: null, hand: null, figure: null };
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
  { id: "supply", name: "Supply Drop", price: 100, gear: 0.65, coinMin: 50, coinMax: 150, token: 0.15 },
  { id: "rare", name: "Rare Supply Drop", price: 250, gear: 0.75, coinMin: 100, coinMax: 300, token: 0.10 },
  { id: "epic", name: "Epic Supply Drop", price: 500, gear: 0.85, coinMin: 200, coinMax: 500, token: 0.05 }
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
  // Always: fill targets for exercises added after the state was created
  // (e.g. the push-day pushdown split) and default the figure variant.
  // This never touches sessions, totals, coins, or the sync records.
  EXERCISES.forEach((e) => { if (!state.targets[e.id]) state.targets[e.id] = { weight: e.weight, sets: e.sets, repMin: e.repMin, repMax: e.repMax }; });
  if (!state.figureVariant) state.figureVariant = (state.equipped && state.equipped.figure) || "standard";
  if (state.prestige === undefined) state.prestige = 0;
  if (!Array.isArray(state.achievements)) state.achievements = [];
  if (!Array.isArray(state.questEvents)) state.questEvents = [];
  if (!state.questNotified || typeof state.questNotified !== "object") state.questNotified = {};
  if (!state.collapsed || typeof state.collapsed !== "object") state.collapsed = {};
  if (state.purchaseCount === undefined) state.purchaseCount = 0;
  if (state.crateCount === undefined) state.crateCount = 0;
  if (state.scrapCount === undefined) state.scrapCount = 0;
  // Push-pushdown split (user-confirmed 2026-10-29): move push-day sessions'
  // pushdown entries from the arms-day slot to the distinct push-day slot,
  // so phones that already synced get the same history as fresh installs.
  // Arms-day sessions are never touched, and nothing is overwritten: the
  // move only happens when the push slot is empty on that session.
  (state.sessions || []).forEach((s) => {
    if (s.dayId === "push" && s.lifts && s.lifts["cable-pushdown"] && !s.lifts["push-cable-pushdown"]) {
      s.lifts["push-cable-pushdown"] = s.lifts["cable-pushdown"];
      delete s.lifts["cable-pushdown"];
    }
  });
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
/* The figure v2: rebuilt to the 'GIVE 'EM LEAD' reference — bold outlines,
   layered cel shading, realistic-proportioned muscular cartoon soldier.
   Broad shoulders, thick limbs with muscle curves, expressive face (heavy
   brows, big eyes, strong nose and jaw), detailed kit. Base kit is NOTHING
   but a military T-shirt, fatigue shorts, and ankle boots; everything else
   comes from equipped items. The mouth (full lips + mouth line) is ALWAYS
   drawn after facial hair, so it stays visible — including under the big
   reference-style handlebar moustache. Hand-held items sit in one solid
   fist with curled fingers as arcs — the fist grips the item's lower part
   and never overlaps the item's top. Mass scales with weigh-ins exactly as
   before: 140 lbs = 1.000x, 152.6 = 1.101x, 165 = 1.160x. */
/* ---- Character photos (slightly-cartoonish realistic set) ----
   The Character tab now shows generated photos instead of the code-drawn
   SVG figure (buildCharacterSvg below is retained but no longer rendered).
   Tier: full-kit if a jacket, bandolier, pouch, cap, goggles, or tall boots
   are equipped; otherwise base. Slot photos override the tier photo for
   clean-shaven faces only — moustache + slot combos fall back to the core
   moustache tier photo (no moustache worn photos exist). Clean-face
   precedence: Saint jacket > worn top > worn bottom > worn head > worn
   eyes > dogtags+bible loadout > dogtags > bible > tier. Worn photos are
   one generated photo per wearable item, loaded network-first (never
   precached) with the tier photo shown while loading and on error, so a
   missing worn photo never leaves a broken image. Cross, dumbbells,
   towel, shaker, and socks have no worn photo — the equipped list still
   tracks them. Night (variant "night" or "figure-night") is a CSS filter,
   not a separate photo. Mass uses the same formula as before, as a CSS
   scale. */
const CHAR_PHOTO_DIR = "assets/character/";
/* Worn-photo map: item id -> file in assets/character/. Saint jacket keeps
   its own earlier photo (base-saint-jacket.webp) and is not listed here. */
const WORN_PHOTO = {
  "faith-tee": "worn-faith-tee.webp", "fearnot-tee": "worn-fearnot-tee.webp",
  "strength-cover": "worn-strength-cover.webp", "shepherd-anorak": "worn-shepherd-anorak.webp",
  "bestill-tee": "worn-bestill-tee.webp", "armor-tee": "worn-armor-tee.webp",
  "eagles-tee": "worn-eagles-tee.webp", "courage-crew": "worn-courage-crew.webp",
  "run-tank": "worn-run-tank.webp", "shield-stringer": "worn-shield-stringer.webp",
  "heartily-tee": "worn-heartily-tee.webp", "endure-hoodie": "worn-endure-hoodie.webp",
  "purpose-pullover": "worn-purpose-pullover.webp", "nightops-tank": "worn-nightops-tank.webp",
  "hoodie-camo-verse": "worn-hoodie-camo-verse.webp",
  "woodland-cargos": "worn-woodland-cargos.webp", "duck-cargos": "worn-duck-cargos.webp",
  "olive-cargos": "worn-olive-cargos.webp", "black-cargos": "worn-black-cargos.webp",
  "desert-cargos": "worn-desert-cargos.webp", "joggers-charcoal": "worn-joggers-charcoal.webp",
  "pith-helmet": "worn-pith-helmet.webp", "beret": "worn-beret.webp",
  "aviator-cap": "worn-aviator-cap.webp", "beanie": "worn-beanie.webp",
  "aviators": "worn-aviators.webp"
};
function charTier(equipped) {
  const ids = new Set(Object.values(equipped || {}).filter(Boolean));
  const top = equipped && equipped.top ? ITEM_BY_ID[equipped.top] : null;
  if (top && top.cut === "jacket") return "fullkit";
  if (["bandolier", "field-pouch", "aviator-cap", "goggles", "tall-boots"].some((id) => ids.has(id))) return "fullkit";
  return "base";
}
function charImageFor(equipped, facialHair, variant) {
  const eq = equipped || {};
  const night = variant === "night" || variant === "figure-night";
  const tier = charTier(eq);
  const moustache = facialHair === "moustache";
  const tierSrc = CHAR_PHOTO_DIR + (moustache ? tier + "-moustache" : tier) + ".webp";
  let src = tierSrc, fallback = null, worn = null;
  if (!moustache) {
    const hasDogtags = eq.neck === "dogtags" || eq.neck === "dogtag-micah";
    const hasBible = eq.hand === "bible";
    const wornTop = eq.top && WORN_PHOTO[eq.top] ? CHAR_PHOTO_DIR + WORN_PHOTO[eq.top] : null;
    const wornBottom = eq.bottom && WORN_PHOTO[eq.bottom] ? CHAR_PHOTO_DIR + WORN_PHOTO[eq.bottom] : null;
    const wornHead = eq.head && WORN_PHOTO[eq.head] ? CHAR_PHOTO_DIR + WORN_PHOTO[eq.head] : null;
    const wornEyes = eq.eyes && WORN_PHOTO[eq.eyes] ? CHAR_PHOTO_DIR + WORN_PHOTO[eq.eyes] : null;
    if (eq.top === "saint-jacket") { src = CHAR_PHOTO_DIR + "base-saint-jacket.webp"; fallback = tierSrc; }
    else if (wornTop) { src = wornTop; fallback = tierSrc; worn = wornTop; }
    else if (wornBottom) { src = wornBottom; fallback = tierSrc; worn = wornBottom; }
    else if (wornHead) { src = wornHead; fallback = tierSrc; worn = wornHead; }
    else if (wornEyes) { src = wornEyes; fallback = tierSrc; worn = wornEyes; }
    else if (hasDogtags && hasBible) { src = CHAR_PHOTO_DIR + "base-loadout.webp"; fallback = tierSrc; }
    else if (hasDogtags) { src = CHAR_PHOTO_DIR + "base-dogtags.webp"; fallback = tierSrc; }
    else if (hasBible) { src = CHAR_PHOTO_DIR + "base-bible.webp"; fallback = tierSrc; }
  }
  return { src, fallback, night, worn };
}
function charBulk(weight) {
  return 1 + Math.min(0.16, Math.max(-0.06, (weight - 140) * 0.008));
}
/* ---- end character photo selection ---- */
function buildCharacterSvg(equipped, facialHair, weight, variant) {
  const eq = equipped || {};
  const night = variant === "night" || variant === "figure-night"; // app state stores the item id "figure-night"
  const top = eq.top ? ITEM_BY_ID[eq.top] : null;
  const bottom = eq.bottom ? ITEM_BY_ID[eq.bottom] : null;
  const head = eq.head ? ITEM_BY_ID[eq.head] : null;
  const eyes = eq.eyes ? ITEM_BY_ID[eq.eyes] : null;
  const hand = eq.hand ? ITEM_BY_ID[eq.hand] : null;
  // Mass scales VISIBLY with weigh-ins: broader as weight rises above the
  // 140 lb start, leaner as it falls. 152.6 lbs renders at 1.10x, 165 at 1.16x.
  const bulk = 1 + Math.min(0.16, Math.max(-0.06, (weight - 140) * 0.008));
  const SKIN = "url(#figSkin)", OUT = "#1a1a1a", GOLD = "#c8a84a";
  const SHIRT = night ? "#23241f" : "#6b6f3f", SHORTS = night ? "#2c2f1c" : "#7d7f57";
  const SHORTS_DARK = "#5c5e3d";
  const topMain = top ? top.main : SHIRT, topDark = top ? top.dark : "#4a4d2a";
  const isLongSleeve = top && (top.cut === "jacket" || top.cut === "anorak" || top.cut === "hoodie");
  const isTank = top && top.cut === "tank";
  let s = `<svg viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Character figure" style="width:100%;max-width:320px;display:block;margin:0 auto">`;
  // Cel-shading gradients (skin + base shirt).
  s += `<defs><linearGradient id="figSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f6d3a8"/><stop offset="55%" stop-color="#e8b98a"/><stop offset="100%" stop-color="#cf9a66"/></linearGradient><linearGradient id="figShirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7d8149"/><stop offset="100%" stop-color="#5c6040"/></linearGradient></defs>`;
  s += `<ellipse cx="160" cy="420" rx="100" ry="10" fill="#000" opacity="0.35"/>`;
  // ---- Legs / bottoms (bulk-scaled) ----
  s += `<g transform="translate(160,0) scale(${bulk.toFixed(3)},1) translate(-160,0)">`;
  if (bottom && bottom.camo) {
    const blobs = CAMO_BLOBS[bottom.camo];
    const legL = "M122,236 L160,236 L158,352 L126,352 Z", legR = "M160,236 L198,236 L194,352 L162,352 Z";
    s += `<defs><clipPath id="legL"><path d="${legL}"/></clipPath><clipPath id="legR"><path d="${legR}"/></clipPath></defs>`;
    s += `<path d="${legL}" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="${legR}" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<g clip-path="url(#legL)"><ellipse cx="132" cy="258" rx="20" ry="13" fill="${blobs[0]}"/><ellipse cx="150" cy="300" rx="16" ry="11" fill="${blobs[1]}"/><ellipse cx="130" cy="332" rx="14" ry="9" fill="${blobs[2]}"/><ellipse cx="148" cy="276" rx="10" ry="7" fill="${blobs[2]}"/></g>`;
    s += `<g clip-path="url(#legR)"><ellipse cx="188" cy="262" rx="18" ry="12" fill="${blobs[1]}"/><ellipse cx="170" cy="306" rx="15" ry="10" fill="${blobs[0]}"/><ellipse cx="190" cy="334" rx="13" ry="9" fill="${blobs[2]}"/></g>`;
    s += `<rect x="122" y="236" width="76" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<line x1="138" y1="236" x2="138" y2="246" stroke="${OUT}" stroke-width="1.5"/><line x1="182" y1="236" x2="182" y2="246" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `<rect x="126" y="272" width="28" height="36" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="126" y1="282" x2="154" y2="282" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="166" y="272" width="28" height="36" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="166" y1="282" x2="194" y2="282" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M122,352 q9.5,6 19,0 t19,0 M160,352 q9.5,6 19,0 t19,0" fill="none" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M124,310 L158,310 M162,310 L196,310" stroke="${OUT}" stroke-width="1.5" opacity="0.3"/>`;
  } else if (bottom && bottom.id === "joggers-charcoal") {
    s += `<path d="M124,236 L158,236 L152,344 L130,344 Z" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M162,236 L196,236 L190,344 L168,344 Z" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="124" y="236" width="72" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="128" y="334" width="26" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><rect x="166" y="334" width="26" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M128,254 L140,254 M180,254 L192,254" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
  } else if (bottom) {
    s += `<rect x="122" y="236" width="38" height="116" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="160" y="236" width="38" height="116" fill="${bottom.main}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="122" y="236" width="76" height="10" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="126" y="272" width="28" height="36" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="126" y1="282" x2="154" y2="282" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="166" y="272" width="28" height="36" fill="${bottom.dark}" stroke="${OUT}" stroke-width="2"/><line x1="166" y1="282" x2="194" y2="282" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M122,352 q9.5,6 19,0 t19,0 M160,352 q9.5,6 19,0 t19,0" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  } else {
    // Base fatigue shorts + bare muscular legs.
    s += `<path d="M124,236 L196,236 L192,282 Q160,290 128,282 Z" fill="${SHORTS}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<rect x="124" y="236" width="72" height="10" fill="${SHORTS_DARK}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="124" y="250" width="13" height="18" fill="${SHORTS_DARK}" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `<rect x="183" y="250" width="13" height="18" fill="${SHORTS_DARK}" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `<path d="M160,246 L160,284" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
    // Thigh-to-calf leg paths: thick, with calf bulges and knee lines.
    s += `<path d="M130,282 L158,282 L156,330 Q163,346 155,362 L137,362 Q129,346 134,330 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M162,282 L190,282 L186,330 Q191,346 183,362 L165,362 Q157,346 164,330 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="139" cy="346" rx="5" ry="13" fill="#fff" opacity="0.16"/>`;
    s += `<ellipse cx="171" cy="346" rx="5" ry="13" fill="#fff" opacity="0.16"/>`;
    s += `<path d="M135,330 Q144,334 153,330 M167,330 Q176,334 185,330" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
  }
  if (bottom) {
    // Skin shows only below the hem when boots are ankle-height.
    s += `<rect x="134" y="352" width="18" height="8" fill="${SKIN}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="168" y="352" width="18" height="8" fill="${SKIN}" stroke="${OUT}" stroke-width="2"/>`;
  }
  // Socks (down the shin, over skin/above boots)
  if (eq.socks) {
    s += `<rect x="132" y="316" width="20" height="46" fill="#d8d2c0" stroke="${OUT}" stroke-width="2"/><line x1="132" y1="326" x2="152" y2="326" stroke="#7a7d4f" stroke-width="3"/><line x1="132" y1="334" x2="152" y2="334" stroke="#7a7d4f" stroke-width="3"/>`;
    s += `<rect x="168" y="316" width="20" height="46" fill="#d8d2c0" stroke="${OUT}" stroke-width="2"/><line x1="168" y1="326" x2="188" y2="326" stroke="#7a7d4f" stroke-width="3"/><line x1="168" y1="334" x2="188" y2="334" stroke="#7a7d4f" stroke-width="3"/>`;
  }
  // Boots
  if (eq.feet === "tall-boots") {
    // Tall lace-up combat boots in the reference style: crisscross laces.
    s += `<rect x="128" y="296" width="28" height="102" fill="#2e2114" stroke="${OUT}" stroke-width="3"/><rect x="128" y="296" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M132,312 L152,326 M152,312 L132,326 M132,334 L152,348 M152,334 L132,348 M132,356 L152,370 M152,356 L132,370" stroke="#8a7a5c" stroke-width="2"/>`;
    s += `<rect x="124" y="398" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/><path d="M128,388 Q142,380 156,388" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
    s += `<rect x="164" y="296" width="28" height="102" fill="#2e2114" stroke="${OUT}" stroke-width="3"/><rect x="164" y="296" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M168,312 L188,326 M188,312 L168,326 M168,334 L188,348 M188,334 L168,348 M168,356 L188,370 M188,356 L168,370" stroke="#8a7a5c" stroke-width="2"/>`;
    s += `<rect x="160" y="398" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/><path d="M164,388 Q178,380 192,388" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
  } else {
    // Base ankle boots.
    s += `<rect x="128" y="360" width="28" height="38" fill="#3a2a1a" stroke="${OUT}" stroke-width="3"/><rect x="124" y="398" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M132,368 L152,368 M132,376 L152,376 M132,384 L152,384" stroke="#8a7a5c" stroke-width="1.5"/><path d="M128,390 Q142,382 156,390" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
    s += `<rect x="164" y="360" width="28" height="38" fill="#3a2a1a" stroke="${OUT}" stroke-width="3"/><rect x="160" y="398" width="36" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M168,368 L188,368 M168,376 L188,376 M168,384 L188,384" stroke="#8a7a5c" stroke-width="1.5"/><path d="M164,390 Q178,382 192,390" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
  }
  s += `</g>`; // close the legs bulk group
  // ---- Torso + arms (bulk-scaled) ----
  s += `<g transform="translate(160,0) scale(${bulk.toFixed(3)},1) translate(-160,0)">`;
  const sleeve = top ? topMain : SHIRT;
  // Upper arms: sleeves per cut, or bare deltoids for tanks.
  if (isTank || !top) {
    s += `<ellipse cx="116" cy="134" rx="19" ry="15" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="204" cy="134" rx="19" ry="15" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M106,144 L128,144 L126,198 L108,198 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M192,144 L214,144 L212,198 L194,198 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="117" cy="172" rx="13" ry="19" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<ellipse cx="203" cy="172" rx="13" ry="19" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  } else if (isLongSleeve) {
    s += `<path d="M102,126 L132,126 L128,248 L104,248 Z" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M188,126 L218,126 L216,248 L192,248 Z" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="117" cy="132" rx="17" ry="13" fill="${sleeve}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<ellipse cx="203" cy="132" rx="17" ry="13" fill="${sleeve}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<rect x="104" y="238" width="24" height="10" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="192" y="238" width="24" height="10" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
  } else {
    // Tee: short sleeves to mid-bicep, then bare forearms.
    s += `<path d="M104,126 L132,126 L130,178 L106,178 Z" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M188,126 L216,126 L214,178 L190,178 Z" fill="${sleeve}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="117" cy="132" rx="17" ry="13" fill="${sleeve}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<ellipse cx="203" cy="132" rx="17" ry="13" fill="${sleeve}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<rect x="106" y="170" width="24" height="8" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="190" y="170" width="24" height="8" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
  }
  // Hood sits behind the neck for hoodie/anorak cuts.
  if (top && (top.cut === "hoodie" || top.cut === "anorak")) {
    s += `<path d="M134,128 Q160,100 186,128 Q160,114 134,128 Z" fill="${topDark}" stroke="${OUT}" stroke-width="3"/>`;
  }
  const torsoPath = isLongSleeve || (top && top.cut === "jacket")
    ? "M102,124 L218,124 L204,240 L116,240 Z" : "M110,124 L210,124 L200,240 L120,240 Z";
  s += `<path d="${torsoPath}" fill="${topMain}" stroke="${OUT}" stroke-width="3"/>`;
  // Layered cel shading, clipped to the torso: highlight left, shade right,
  // under-pec shadow band, plus pec arcs for the muscular chest.
  s += `<defs><clipPath id="figTorso"><path d="${torsoPath}"/></clipPath></defs>`;
  s += `<g clip-path="url(#figTorso)"><ellipse cx="124" cy="180" rx="16" ry="58" fill="#fff" opacity="0.14"/><ellipse cx="198" cy="182" rx="14" ry="58" fill="#000" opacity="0.13"/><rect x="110" y="186" width="100" height="8" fill="#000" opacity="0.08"/></g>`;
  s += `<path d="M126,162 Q143,176 160,166 Q177,176 194,162" fill="none" stroke="${OUT}" stroke-width="2" opacity="0.5"/>`;
  s += `<path d="M160,168 L160,196" stroke="${OUT}" stroke-width="1.5" opacity="0.25"/>`;
  // Collar + cut details.
  if (top && top.cut === "jacket") {
    // Reference-style olive jacket: gold-trim lapels, epaulettes, buttons, ribbed hem.
    s += `<path d="M146,124 L160,178 L174,124" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
    s += `<path d="M146,124 L160,178 M174,124 L160,178" fill="none" stroke="${OUT}" stroke-width="1" opacity="0.6"/>`;
    s += `<rect x="106" y="124" width="24" height="9" fill="${GOLD}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<rect x="190" y="124" width="24" height="9" fill="${GOLD}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<circle cx="148" cy="158" r="3" fill="${GOLD}" stroke="${OUT}" stroke-width="1.5"/><circle cx="172" cy="158" r="3" fill="${GOLD}" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `<circle cx="148" cy="188" r="3" fill="${GOLD}" stroke="${OUT}" stroke-width="1.5"/><circle cx="172" cy="188" r="3" fill="${GOLD}" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `<rect x="116" y="224" width="88" height="16" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    for (let x = 124; x < 200; x += 11) s += `<line x1="${x}" y1="224" x2="${x}" y2="240" stroke="${OUT}" stroke-width="1.5"/>`;
  } else if (top && top.cut === "hoodie") {
    s += `<rect x="138" y="206" width="44" height="30" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M150,128 L146,160 M170,128 L174,160" stroke="${topDark}" stroke-width="2.5"/>`;
    s += `<path d="M146,124 Q160,138 174,124" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  } else if (top && top.cut === "anorak") {
    s += `<rect x="168" y="150" width="26" height="30" fill="${topDark}" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M160,128 L160,240" stroke="${OUT}" stroke-width="2" opacity="0.6"/>`;
    s += `<path d="M146,124 Q160,138 174,124" fill="none" stroke="${OUT}" stroke-width="3"/>`;
  } else if (isTank) {
    s += `<path d="M142,124 Q160,148 178,124" fill="none" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M110,124 Q126,150 122,174 M210,124 Q194,150 198,174" fill="none" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<path d="M120,232 L200,232" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
  } else {
    s += `<path d="M146,124 Q160,138 174,124" fill="none" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M146,124 Q160,132 174,124" fill="none" stroke="${topDark}" stroke-width="1.5"/>`;
    s += `<path d="M120,232 L200,232" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
  }
  if (top && top.camo) {
    const blobs = CAMO_BLOBS[top.camo];
    s += `<g clip-path="url(#figTorso)"><ellipse cx="136" cy="200" rx="16" ry="10" fill="${blobs[0]}"/><ellipse cx="184" cy="206" rx="14" ry="9" fill="${blobs[1]}"/><ellipse cx="160" cy="224" rx="12" ry="8" fill="${blobs[2]}"/></g>`;
  }
  if (top && top.word) {
    s += `<text x="160" y="182" text-anchor="middle" font-size="${top.wordStyle === "script" ? 20 : 15}" fill="${top.accent}" stroke="${OUT}" stroke-width="0.4" ${wordFont(top.wordStyle)}>${escXml(top.word)}</text>`;
  }
  if (top && top.verseRef) {
    s += `<text x="160" y="236" text-anchor="middle" font-size="7" fill="${top.accent}" opacity="0.85" font-family="Arial, Helvetica, sans-serif">${escXml(top.verseRef)}</text>`;
  }
  // Bandolier (chest slot): diagonal strap with bullet loops.
  if (eq.chest === "bandolier") {
    s += `<g transform="rotate(38 160 175)"><rect x="102" y="166" width="116" height="18" fill="#3a2f1c" stroke="${OUT}" stroke-width="2"/>`;
    for (let x = 110; x < 212; x += 12) s += `<rect x="${x}" y="164" width="6" height="22" fill="${GOLD}" stroke="${OUT}" stroke-width="1.5"/>`;
    s += `</g>`;
  }
  // Dog tags (neck slot) — any neck item renders the dog-tags graphic,
  // since the neck slot only holds dog-tags variants.
  if (eq.neck) {
    s += `<path d="M138,118 Q160,158 182,118" fill="none" stroke="#888" stroke-width="1.5"/>`;
    s += `<g transform="rotate(-8 152 154)"><rect x="144" y="148" width="16" height="22" rx="3" fill="#1c1c1c" stroke="${GOLD}" stroke-width="1.5"/><line x1="148" y1="152" x2="148" y2="166" stroke="${GOLD}" stroke-width="1" opacity="0.7"/></g>`;
    s += `<g transform="rotate(10 170 162)"><rect x="162" y="156" width="16" height="22" rx="3" fill="#1c1c1c" stroke="${GOLD}" stroke-width="1.5"/><line x1="166" y1="160" x2="166" y2="174" stroke="${GOLD}" stroke-width="1" opacity="0.7"/></g>`;
  }
  // Field pouch (waist slot)
  if (eq.waist === "field-pouch") {
    s += `<rect x="198" y="212" width="30" height="38" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/><line x1="198" y1="222" x2="228" y2="222" stroke="${OUT}" stroke-width="2"/><path d="M213,230 v10 M208,235 h10" stroke="${GOLD}" stroke-width="2"/><circle cx="222" cy="218" r="2.5" fill="${GOLD}" stroke="${OUT}" stroke-width="1"/>`;
  }
  // Gym towel (shoulder slot)
  if (eq.shoulder === "gym-towel") {
    s += `<path d="M110,124 L100,200 L124,200 L128,124 Z" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="106" y1="152" x2="122" y2="152" stroke="#7a7d4f" stroke-width="4"/><line x1="104" y1="172" x2="123" y2="172" stroke="#7a7d4f" stroke-width="4"/><path d="M100,200 l-2,8 M106,200 l-2,8 M112,200 l-2,8" stroke="${OUT}" stroke-width="1.5"/>`;
  }
  // Shaker (hip slot)
  if (eq.hip === "shaker") {
    s += `<rect x="92" y="214" width="20" height="38" rx="4" fill="#b8bcc0" stroke="${OUT}" stroke-width="2.5"/><rect x="96" y="208" width="12" height="8" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><line x1="92" y1="234" x2="112" y2="234" stroke="${GOLD}" stroke-width="3"/><line x1="92" y1="224" x2="112" y2="224" stroke="${OUT}" stroke-width="1" opacity="0.5"/>`;
  }
  // Forearms: thick, with muscle curves and shading, hanging at the sides.
  if (isLongSleeve) {
    s += `<rect x="106" y="248" width="20" height="14" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<rect x="194" y="248" width="20" height="14" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  } else {
    s += `<path d="M106,196 L128,196 L126,258 L110,258 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<path d="M192,196 L214,196 L210,258 L194,258 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
    s += `<ellipse cx="117" cy="226" rx="10" ry="18" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<ellipse cx="203" cy="226" rx="10" ry="18" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<ellipse cx="112" cy="232" rx="3.5" ry="12" fill="#fff" opacity="0.16"/>`;
    s += `<ellipse cx="198" cy="232" rx="3.5" ry="12" fill="#fff" opacity="0.16"/>`;
  }
  s += `</g>`;
  // ---- Head: expressive face, strong jaw, heavy brows ----
  s += `<path d="M146,102 L174,102 L172,128 L148,128 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<path d="M166,104 L172,104 L172,128 L166,128 Z" fill="#000" opacity="0.10"/>`;
  s += `<ellipse cx="122" cy="76" rx="7" ry="12" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<ellipse cx="198" cy="76" rx="7" ry="12" fill="${SKIN}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<path d="M124,76 Q124,82 128,84" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
  s += `<path d="M196,76 Q196,82 192,84" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
  // Face: squarer jaw and chin than the old oval.
  s += `<path d="M128,42 Q126,26 160,24 Q194,26 192,42 L192,78 Q192,104 176,112 Q160,119 144,112 Q128,104 128,78 Z" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<path d="M184,60 Q190,84 178,106 Q172,112 166,112 L176,112 Q190,102 192,78 Z" fill="#000" opacity="0.08"/>`;
  s += `<ellipse cx="152" cy="108" rx="10" ry="4" fill="#fff" opacity="0.14"/>`;
  // Short military hair with a fringe edge + sideburns.
  s += `<path d="M128,54 Q124,20 160,18 Q196,20 192,54 Q190,40 178,36 Q170,30 160,34 Q150,28 140,38 Q130,42 128,54 Z" fill="#241a12" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<path d="M128,54 L134,54 L134,72 L128,72 Z M186,54 L192,54 L192,72 L186,72 Z" fill="#241a12" stroke="${OUT}" stroke-width="1.5"/>`;
  // Heavy brows, big eyes with pupils + highlights, strong nose.
  s += `<path d="M136,60 Q148,53 159,58" fill="none" stroke="${OUT}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M161,58 Q172,53 184,60" fill="none" stroke="${OUT}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<ellipse cx="147" cy="73" rx="9" ry="10" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="147" cy="74" r="4.5" fill="#1a1a1a"/><circle cx="149" cy="71" r="1.5" fill="#fff"/>`;
  s += `<ellipse cx="173" cy="73" rx="9" ry="10" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="173" cy="74" r="4.5" fill="#1a1a1a"/><circle cx="175" cy="71" r="1.5" fill="#fff"/>`;
  s += `<path d="M137,66 Q147,62 157,66 M163,66 Q173,62 183,66" fill="none" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<path d="M160,76 Q165,83 161,89 Q158,92 155,90" fill="none" stroke="${OUT}" stroke-width="2"/>`;
  // Facial hair FIRST — the mouth is drawn after, so it always stays visible.
  if (facialHair === "beard") {
    s += `<path d="M128,66 Q126,108 146,118 Q160,123 174,118 Q194,108 192,66 Q188,96 176,104 Q168,110 160,110 Q152,110 144,104 Q132,96 128,66 Z" fill="#2a2018" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M134,90 Q146,80 160,85 Q174,80 186,90 Q182,98 170,95 Q160,93 150,95 Q138,98 134,90 Z" fill="#2a2018" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M140,108 Q150,112 146,116 M180,108 Q170,112 174,116" stroke="${OUT}" stroke-width="1" opacity="0.5"/>`;
  } else if (facialHair === "stubble") {
    s += `<path d="M130,96 Q132,112 148,117 Q160,120 172,117 Q188,112 190,96 Q186,110 172,114 Q160,117 148,114 Q134,110 130,96 Z" fill="#000" opacity="0.14"/>`;
    s += `<path d="M142,90 Q160,84 178,90 Q170,95 160,94 Q150,95 142,90 Z" fill="#2a2018" stroke="${OUT}" stroke-width="1.5"/>`;
  } else if (facialHair === "moustache") {
    // Big reference-style handlebar: thick, wide, curled ends, sitting above
    // the mouth — the mouth itself is drawn after, so it stays visible.
    s += `<path d="M130,88 Q140,77 160,83 Q180,77 190,88 Q193,96 186,99 Q180,102 173,98 Q167,94 160,95 Q153,94 147,98 Q140,102 134,99 Q127,96 130,88 Z" fill="#2a2018" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M132,92 Q125,100 132,105 M188,92 Q195,100 188,105" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round"/>`;
    s += `<path d="M140,84 Q160,79 180,84" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.18"/>`;
  }
  // Mouth — full lips + mouth line, ALWAYS visible.
  s += `<path d="M146,100 Q160,95 174,100 Q160,108 146,100 Z" fill="#b96a5a" stroke="${OUT}" stroke-width="1.5"/>`;
  s += `<ellipse cx="160" cy="105" rx="8" ry="4" fill="#c97a68" stroke="${OUT}" stroke-width="1.5"/>`;
  s += `<path d="M146,101 Q160,105 174,101" fill="none" stroke="#7a3a2e" stroke-width="1.5"/>`;
  // Head items
  if (head && head.id === "beanie") {
    s += `<path d="M126,56 Q128,20 160,18 Q192,20 194,56 Q180,46 160,46 Q140,46 126,56 Z" fill="#3a3f2a" stroke="${OUT}" stroke-width="2.5"/>`;
    for (let x = 136; x < 188; x += 12) s += `<line x1="${x}" y1="48" x2="${x}" y2="56" stroke="${OUT}" stroke-width="1.5"/>`;
  } else if (head && head.id === "pith-helmet") {
    s += `<ellipse cx="160" cy="36" rx="30" ry="14" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="160" cy="50" rx="48" ry="10" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><line x1="132" y1="36" x2="188" y2="36" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
  } else if (head && head.id === "beret") {
    s += `<g transform="rotate(-8 158 40)"><ellipse cx="158" cy="40" rx="34" ry="12" fill="#1c2438" stroke="${OUT}" stroke-width="2.5"/></g><path d="M184,34 l10,-4 l-3,6 l8,1 l-11,3 z" fill="${GOLD}" stroke="${OUT}" stroke-width="1"/>`;
  } else if (head && head.id === "aviator-cap") {
    s += `<path d="M124,58 Q126,20 160,18 Q194,20 196,58 L186,58 Q186,34 160,32 Q134,34 134,58 Z" fill="#4a3220" stroke="${OUT}" stroke-width="2.5"/>`;
    s += `<path d="M134,32 Q160,26 186,32" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
    s += `<rect x="120" y="56" width="12" height="34" fill="#4a3220" stroke="${OUT}" stroke-width="2"/><rect x="188" y="56" width="12" height="34" fill="#4a3220" stroke="${OUT}" stroke-width="2"/>`;
    s += `<path d="M132,88 Q160,100 188,88" fill="none" stroke="${OUT}" stroke-width="2"/>`;
  }
  // Eyes items
  if (eyes && eyes.id === "aviators") {
    s += `<circle cx="147" cy="73" r="12" fill="#1a1a1a" opacity="0.88" stroke="${GOLD}" stroke-width="2"/><circle cx="173" cy="73" r="12" fill="#1a1a1a" opacity="0.88" stroke="${GOLD}" stroke-width="2"/><line x1="159" y1="71" x2="161" y2="71" stroke="${GOLD}" stroke-width="2"/><path d="M141,68 l6,-4 M167,68 l6,-4" stroke="#fff" stroke-width="1.5" opacity="0.5"/>`;
  } else if (eyes && eyes.id === "goggles") {
    s += `<line x1="122" y1="44" x2="198" y2="44" stroke="#3a2f1c" stroke-width="4"/><circle cx="146" cy="44" r="14" fill="#9fc4d8" opacity="0.7" stroke="${GOLD}" stroke-width="3"/><circle cx="174" cy="44" r="14" fill="#9fc4d8" opacity="0.7" stroke="${GOLD}" stroke-width="3"/><path d="M140,38 q6,-4 12,0 M168,38 q6,-4 12,0" stroke="#fff" stroke-width="1.5" opacity="0.6" fill="none"/>`;
  }
  // ---- Hands + hand-held items ----
  // Item first, then ONE solid fist with curled-finger arcs gripping its lower
  // part. The item's top always stays fully above the fist — nothing clips.
  function fist(cx, cy) {
    return `<rect x="${cx - 16}" y="${cy - 16}" width="32" height="34" rx="11" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>` +
      `<path d="M${cx - 9},${cy - 2} q9,7 18,0 M${cx - 9},${cy + 7} q9,7 18,0" fill="none" stroke="${OUT}" stroke-width="2"/>` +
      `<path d="M${cx - 16},${cy + 4} q-4,8 2,12" fill="none" stroke="${OUT}" stroke-width="2"/>`;
  }
  function openHand(cx, cy) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="14" ry="15" fill="${SKIN}" stroke="${OUT}" stroke-width="3"/>` +
      `<path d="M${cx - 10},${cy - 14} v-9 M${cx - 4},${cy - 15} v-10 M${cx + 4},${cy - 15} v-10 M${cx + 10},${cy - 14} v-9" stroke="${OUT}" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (hand && hand.held === "bible") {
    s += `<g transform="rotate(8 214 238)"><rect x="196" y="208" width="36" height="58" rx="3" fill="#2a1f14" stroke="${OUT}" stroke-width="2.5"/><line x1="202" y1="212" x2="202" y2="262" stroke="${GOLD}" stroke-width="1.5"/><line x1="228" y1="212" x2="228" y2="262" stroke="#c9b98f" stroke-width="1.5" opacity="0.7"/><path d="M214,220 v18 M207,227 h14" stroke="${GOLD}" stroke-width="2.5"/></g>`;
    s += openHand(116, 276) + fist(214, 276);
  } else if (hand && hand.held === "cross") {
    s += `<rect x="208" y="196" width="11" height="76" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><rect x="194" y="220" width="40" height="11" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><line x1="211" y1="200" x2="211" y2="268" stroke="${OUT}" stroke-width="1" opacity="0.4"/>`;
    s += openHand(116, 276) + fist(214, 276);
  } else if (hand && hand.held === "dumbbells") {
    s += `<rect x="76" y="272" width="66" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="68" y="260" width="10" height="32" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="142" y="260" width="10" height="32" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><line x1="68" y1="268" x2="78" y2="268" stroke="${OUT}" stroke-width="1" opacity="0.5"/><line x1="142" y1="268" x2="152" y2="268" stroke="${OUT}" stroke-width="1" opacity="0.5"/>`;
    s += `<rect x="178" y="272" width="66" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="170" y="260" width="10" height="32" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="244" y="260" width="10" height="32" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/>`;
    s += fist(109, 276) + fist(211, 276);
  } else {
    s += openHand(116, 276) + openHand(204, 276);
  }
  s += `</svg>`;
  return s;
}

/* Small shop-card preview SVG for an item. */
/* Small shop-card preview SVG for an item — reskinned to match the artifact's
   item art: Saint-jacket boxy cuts on tops (dropped shoulders, ribbed or raw
   hems, collar detail), baggy camo cargo cuts on bottoms (wide legs, bellows
   pockets, pooled hems), richer cel shading (highlight + shade strips) and
   crisper gear detail. Names, prices, IDs, verses, and eras are untouched. */
function previewSvg(item) {
  const OUT = "#1a1a1a";
  if (item.slot === "top") {
    // Boxy oversized street body; tanks get a narrower body with armholes.
    const body = item.cut === "tank"
      ? `<path d="M36,24 L84,24 L82,98 L38,98 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/>`
      : `<path d="M26,24 L94,24 L90,98 L30,98 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/>`;
    const shade = item.cut === "tank"
      ? `<path d="M76,24 L84,24 L82,98 L74,98 Z" fill="#000" opacity="0.13"/>`
      : `<path d="M82,24 L94,24 L90,98 L78,98 Z" fill="#000" opacity="0.13"/>`;
    const light = item.cut === "tank"
      ? `<path d="M36,24 L44,24 L42,98 L38,98 Z" fill="#fff" opacity="0.14"/>`
      : `<path d="M26,24 L36,24 L34,98 L30,98 Z" fill="#fff" opacity="0.14"/>`;
    const sleeves = item.cut === "tank" ? "" :
      `<path d="M18,28 L30,28 L28,58 L18,58 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2"/><path d="M90,28 L102,28 L102,58 L92,58 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2"/>` +
      `<line x1="18" y1="38" x2="28" y2="38" stroke="${OUT}" stroke-width="1" opacity="0.5"/><line x1="92" y1="38" x2="102" y2="38" stroke="${OUT}" stroke-width="1" opacity="0.5"/>` +
      `<rect x="18" y="52" width="10" height="6" fill="${item.dark}" stroke="${OUT}" stroke-width="1"/><rect x="92" y="52" width="10" height="6" fill="${item.dark}" stroke="${OUT}" stroke-width="1"/><path d="M30,26 L36,34 M90,26 L84,34" stroke="${OUT}" stroke-width="1" opacity="0.6"/>`;
    const collar = `<path d="M50,24 Q60,34 70,24" fill="none" stroke="${OUT}" stroke-width="2"/>`;
    let cut = "";
    if (item.cut === "jacket") {
      cut = `<rect x="32" y="90" width="56" height="8" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/>` +
        `<path d="M48,24 L60,52 M72,24 L60,52" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.7"/>` +
        `<circle cx="60" cy="62" r="1.8" fill="${OUT}"/><circle cx="60" cy="76" r="1.8" fill="${OUT}"/>`;
      for (let x = 36; x < 88; x += 8) cut += `<line x1="${x}" y1="90" x2="${x}" y2="98" stroke="${OUT}" stroke-width="1"/>`;
    } else if (item.cut === "hoodie") {
      cut = `<path d="M44,24 Q60,10 76,24 Q60,18 44,24 Z" fill="${item.dark}" stroke="${OUT}" stroke-width="2"/>` +
        `<rect x="42" y="72" width="36" height="22" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/>` +
        `<path d="M52,26 L49,40 M68,26 L71,40" stroke="${item.dark}" stroke-width="1.5"/>`;
    } else if (item.cut === "anorak") {
      cut = `<path d="M44,24 Q60,10 76,24 Q60,18 44,24 Z" fill="${item.dark}" stroke="${OUT}" stroke-width="2"/>` +
        `<rect x="62" y="52" width="20" height="18" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/>` +
        `<line x1="60" y1="24" x2="60" y2="98" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`;
    } else if (item.cut === "tank") {
      cut = `<path d="M36,24 Q44,40 40,52 M84,24 Q76,40 80,52" fill="none" stroke="${OUT}" stroke-width="2"/>` +
        `<path d="M38,92 L82,92" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
    } else {
      cut = `<path d="M30,92 L90,92" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/>`;
    }
    const camo = item.camo ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) =>
      `<ellipse cx="${30 + (i % 6) * 13}" cy="${40 + Math.floor(i / 6) * 34 + (i % 2) * 8}" rx="13" ry="9" fill="${CAMO_BLOBS[item.camo][i % 3]}" opacity="0.9"/>`).join("") : "";
    const camoSleeve = item.camo && item.cut !== "tank" ? `<ellipse cx="23" cy="44" rx="7" ry="6" fill="${CAMO_BLOBS[item.camo][0]}" opacity="0.9"/><ellipse cx="97" cy="44" rx="7" ry="6" fill="${CAMO_BLOBS[item.camo][1]}" opacity="0.9"/>` : "";
    const word = item.word ? `<text x="60" y="66" text-anchor="middle" font-size="${item.wordStyle === "script" ? 15 : 11}" fill="${item.accent}" ${wordFont(item.wordStyle)}>${escXml(item.word)}</text>` : "";
    const wordBar = item.word ? `<rect x="42" y="70" width="36" height="2.5" fill="${item.accent}" opacity="0.85"/>` : "";
    const ref = item.verseRef ? `<text x="60" y="96" text-anchor="middle" font-size="5" fill="${item.accent}" font-family="Arial, Helvetica, sans-serif">${escXml(item.verseRef)}</text>` : "";
    const hemTag = `<rect x="${item.cut === "tank" ? 72 : 80}" y="86" width="9" height="7" fill="${item.accent}" stroke="${OUT}" stroke-width="1"/>`;
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block"><defs><clipPath id="clip-top-${item.id}"><path d="${item.cut === "tank" ? "M36,24 L84,24 L82,98 L38,98 Z" : "M26,24 L94,24 L90,98 L30,98 Z"}"/></clipPath></defs>${body}${shade}${light}<g clip-path="url(#clip-top-${item.id})">${camo}</g>${camoSleeve}${sleeves}${collar}${cut}${word}${wordBar}${ref}${hemTag}</svg>`;
  }
  if (item.slot === "bottom") {
    if (item.id === "joggers-charcoal") {
      return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block"><rect x="34" y="16" width="52" height="10" fill="${item.dark}" stroke="${OUT}" stroke-width="2"/><path d="M34,26 L58,26 L54,92 L38,92 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/><path d="M62,26 L86,26 L82,92 L66,92 Z" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/><path d="M52,26 L54,92 L50,92 L48,26 Z" fill="#000" opacity="0.10"/><line x1="38" y1="30" x2="38" y2="82" stroke="${item.accent}" stroke-width="2" opacity="0.55"/><rect x="36" y="84" width="18" height="8" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><rect x="66" y="84" width="18" height="8" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><line x1="38" y1="30" x2="38" y2="82" stroke="${item.accent}" stroke-width="2" opacity="0.55"/><path d="M56,26 L54,40 M64,26 L66,40" stroke="${item.accent}" stroke-width="1.5"/></svg>`;
    }
    const blobs = item.camo ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<ellipse cx="${30 + (i % 6) * 12}" cy="${36 + Math.floor(i / 6) * 34 + (i % 2) * 8}" rx="13" ry="9" fill="${CAMO_BLOBS[item.camo][i % 3]}" opacity="0.9"/>`).join("") : "";
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block"><defs><clipPath id="clip-bot-${item.id}"><rect x="26" y="26" width="34" height="74"/><rect x="60" y="26" width="34" height="74"/></clipPath></defs><rect x="26" y="16" width="68" height="10" fill="${item.dark}" stroke="${OUT}" stroke-width="2"/><line x1="40" y1="16" x2="40" y2="26" stroke="${OUT}" stroke-width="1.5"/><line x1="80" y1="16" x2="80" y2="26" stroke="${OUT}" stroke-width="1.5"/><path d="M58,26 L55,44 M62,26 L65,44" stroke="${item.dark}" stroke-width="1.5"/><circle cx="55" cy="45" r="1.6" fill="${item.dark}"/><circle cx="65" cy="45" r="1.6" fill="${item.dark}"/><rect x="26" y="26" width="34" height="74" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/><rect x="60" y="26" width="34" height="74" fill="${item.main}" stroke="${OUT}" stroke-width="2.5"/><path d="M56,26 L60,100 L54,100 L50,26 Z" fill="#000" opacity="0.10"/><path d="M30,26 L36,26 L34,100 L26,100 Z" fill="#fff" opacity="0.12"/><g clip-path="url(#clip-bot-${item.id})">${blobs}</g><rect x="28" y="42" width="26" height="32" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><line x1="28" y1="52" x2="54" y2="52" stroke="${OUT}" stroke-width="1.5"/><circle cx="41" cy="47" r="1.8" fill="${OUT}"/><rect x="66" y="42" width="26" height="32" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><line x1="66" y1="52" x2="92" y2="52" stroke="${OUT}" stroke-width="1.5"/><circle cx="79" cy="47" r="1.8" fill="${OUT}"/><rect x="20" y="58" width="8" height="22" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><rect x="92" y="58" width="8" height="22" fill="${item.dark}" stroke="${OUT}" stroke-width="1.5"/><line x1="29" y1="30" x2="29" y2="96" stroke="${item.accent}" stroke-width="3" opacity="0.55"/><line x1="91" y1="30" x2="91" y2="96" stroke="${item.accent}" stroke-width="3" opacity="0.55"/><path d="M26,100 q8.5,5 17,0 t17,0 M60,100 q8.5,5 17,0 t17,0" fill="none" stroke="${OUT}" stroke-width="2"/></svg>`;
  }
  const g = {
    dogtags: `<path d="M40,20 Q60,50 80,20" fill="none" stroke="#888" stroke-width="1.5"/><circle cx="48" cy="30" r="2" fill="none" stroke="#888" stroke-width="1"/><circle cx="60" cy="38" r="2" fill="none" stroke="#888" stroke-width="1"/><circle cx="72" cy="30" r="2" fill="none" stroke="#888" stroke-width="1"/><rect x="50" y="48" width="14" height="20" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/><line x1="54" y1="52" x2="54" y2="64" stroke="#c8a84a" stroke-width="1" opacity="0.7"/><rect x="66" y="56" width="14" height="20" rx="3" fill="#1c1c1c" stroke="#c8a84a" stroke-width="1.5"/><line x1="70" y1="60" x2="70" y2="72" stroke="#c8a84a" stroke-width="1" opacity="0.7"/>`,
    pouch: `<rect x="36" y="40" width="48" height="44" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/><line x1="36" y1="52" x2="84" y2="52" stroke="${OUT}" stroke-width="2"/><path d="M60,62 v12 M54,68 h12" stroke="#c8a84a" stroke-width="2.5"/><rect x="36" y="40" width="48" height="4" fill="#000" opacity="0.15"/><rect x="54" y="58" width="12" height="8" fill="none" stroke="#c8a84a" stroke-width="1.5"/>`,
    aviators: `<circle cx="44" cy="58" r="14" fill="#1a1a1a" stroke="#c8a84a" stroke-width="2.5"/><circle cx="76" cy="58" r="14" fill="#1a1a1a" stroke="#c8a84a" stroke-width="2.5"/><line x1="58" y1="56" x2="62" y2="56" stroke="#c8a84a" stroke-width="2.5"/><path d="M38,52 l7,-5 M70,52 l7,-5" stroke="#fff" stroke-width="1.5" opacity="0.5"/><path d="M30,58 L22,50 M90,58 L98,50" stroke="#c8a84a" stroke-width="2"/>`,
    goggles: `<line x1="28" y1="56" x2="92" y2="56" stroke="#3a2f1c" stroke-width="4"/><circle cx="44" cy="56" r="15" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/><circle cx="76" cy="56" r="15" fill="#9fc4d8" opacity="0.7" stroke="#c8a84a" stroke-width="3"/><path d="M38,48 q6,-4 12,0 M70,48 q6,-4 12,0" stroke="#fff" stroke-width="1.5" opacity="0.6" fill="none"/><line x1="28" y1="56" x2="14" y2="56" stroke="#3a2f1c" stroke-width="4"/><line x1="92" y1="56" x2="106" y2="56" stroke="#3a2f1c" stroke-width="4"/>`,
    pith: `<ellipse cx="60" cy="48" rx="26" ry="13" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="60" cy="60" rx="40" ry="9" fill="#c8b98a" stroke="${OUT}" stroke-width="2.5"/><line x1="36" y1="48" x2="84" y2="48" stroke="${OUT}" stroke-width="1.5" opacity="0.5"/><circle cx="60" cy="40" r="2.5" fill="${OUT}"/><path d="M30,62 Q60,78 90,62" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/>`,
    beret: `<g transform="rotate(-8 60 56)"><ellipse cx="60" cy="56" rx="32" ry="12" fill="#1c2438" stroke="${OUT}" stroke-width="2.5"/></g><path d="M86,48 l10,-4 l-3,6 l8,1 l-11,3 z" fill="#c8a84a" stroke="${OUT}" stroke-width="1"/><path d="M34,58 Q60,50 86,58" fill="none" stroke="${OUT}" stroke-width="1" opacity="0.5"/><line x1="60" y1="44" x2="60" y2="40" stroke="${OUT}" stroke-width="2"/>`,
    cap: `<path d="M30,60 Q32,28 60,26 Q88,28 90,60 L80,60 Q80,38 60,36 Q40,38 40,60 Z" fill="#4a3220" stroke="${OUT}" stroke-width="2.5"/><rect x="28" y="58" width="10" height="26" fill="#4a3220" stroke="${OUT}" stroke-width="2"/><rect x="82" y="58" width="10" height="26" fill="#4a3220" stroke="${OUT}" stroke-width="2"/><path d="M40,40 Q60,32 80,40" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/><circle cx="60" cy="27" r="2.5" fill="${OUT}"/>`,
    beanie: `<path d="M30,66 Q32,28 60,26 Q88,28 90,66 Q75,54 60,54 Q45,54 30,66 Z" fill="#3a3f2a" stroke="${OUT}" stroke-width="2.5"/><line x1="40" y1="52" x2="40" y2="62" stroke="${OUT}" stroke-width="1.5"/><line x1="52" y1="50" x2="52" y2="62" stroke="${OUT}" stroke-width="1.5"/><line x1="64" y1="50" x2="64" y2="62" stroke="${OUT}" stroke-width="1.5"/><line x1="76" y1="52" x2="76" y2="62" stroke="${OUT}" stroke-width="1.5"/><rect x="32" y="58" width="56" height="8" fill="#000" opacity="0.15"/>`,
    socks: `<rect x="44" y="24" width="16" height="52" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><rect x="44" y="70" width="26" height="12" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="44" y1="36" x2="60" y2="36" stroke="#7a7d4f" stroke-width="3"/><rect x="66" y="24" width="16" height="52" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><rect x="66" y="70" width="26" height="12" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="66" y1="36" x2="82" y2="36" stroke="#7a7d4f" stroke-width="3"/><rect x="44" y="26" width="16" height="6" fill="#000" opacity="0.15"/><rect x="66" y="26" width="16" height="6" fill="#000" opacity="0.15"/><rect x="44" y="70" width="8" height="12" fill="#000" opacity="0.12"/><rect x="66" y="70" width="8" height="12" fill="#000" opacity="0.12"/>`,
    towel: `<path d="M36,26 L52,96 L76,92 L62,22 Z" fill="#d8d2c0" stroke="${OUT}" stroke-width="2.5"/><line x1="44" y1="52" x2="66" y2="50" stroke="#7a7d4f" stroke-width="4"/><line x1="48" y1="70" x2="70" y2="68" stroke="#7a7d4f" stroke-width="4"/><path d="M52,96 l-2,6 M58,95 l-2,6 M64,94 l-2,6" stroke="${OUT}" stroke-width="1.5"/><line x1="50" y1="84" x2="68" y2="82" stroke="#7a7d4f" stroke-width="4"/>`,
    shaker: `<rect x="48" y="36" width="24" height="48" rx="4" fill="#b8bcc0" stroke="${OUT}" stroke-width="2.5"/><rect x="54" y="28" width="12" height="10" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><line x1="48" y1="60" x2="72" y2="60" stroke="#c8a84a" stroke-width="3"/><line x1="48" y1="48" x2="72" y2="48" stroke="${OUT}" stroke-width="1" opacity="0.5"/><line x1="48" y1="70" x2="72" y2="70" stroke="${OUT}" stroke-width="1" opacity="0.5"/><line x1="52" y1="54" x2="56" y2="54" stroke="${OUT}" stroke-width="1"/><line x1="52" y1="66" x2="56" y2="66" stroke="${OUT}" stroke-width="1"/>`,
    boots: `<rect x="40" y="28" width="20" height="60" fill="#2e2114" stroke="${OUT}" stroke-width="2.5"/><rect x="36" y="84" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/><rect x="64" y="28" width="20" height="60" fill="#2e2114" stroke="${OUT}" stroke-width="2.5"/><rect x="60" y="84" width="28" height="8" fill="#1a120a" stroke="${OUT}" stroke-width="2"/><path d="M44,36 L56,44 M56,36 L44,44 M44,52 L56,60 M56,52 L44,60 M68,36 L80,44 M80,36 L68,44 M68,52 L80,60 M80,52 L68,60" stroke="#8a7a5c" stroke-width="1.5"/><path d="M40,78 Q50,72 60,78 M64,78 Q74,72 84,78" fill="none" stroke="${OUT}" stroke-width="1.5" opacity="0.6"/><line x1="36" y1="90" x2="64" y2="90" stroke="#8a7a5c" stroke-width="1"/><line x1="60" y1="90" x2="88" y2="90" stroke="#8a7a5c" stroke-width="1"/>`,
    bandolier: `<g transform="rotate(38 60 60)"><rect x="16" y="52" width="88" height="14" fill="#3a2f1c" stroke="${OUT}" stroke-width="2"/>${[22, 34, 46, 58, 70, 82, 94].map((x) => `<rect x="${x}" y="50" width="5" height="18" fill="#c8a84a" stroke="${OUT}" stroke-width="1"/>`).join("")}</g><line x1="20" y1="52" x2="100" y2="52" stroke="#000" stroke-width="1" opacity="0.25"/><line x1="20" y1="56" x2="100" y2="56" stroke="#fff" stroke-width="1" opacity="0.12"/>`,
    cross: `<rect x="55" y="18" width="10" height="84" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><rect x="38" y="42" width="44" height="10" fill="#6b4a26" stroke="${OUT}" stroke-width="2.5"/><line x1="58" y1="22" x2="58" y2="98" stroke="${OUT}" stroke-width="1" opacity="0.4"/><line x1="42" y1="45" x2="78" y2="45" stroke="${OUT}" stroke-width="1" opacity="0.4"/><path d="M58,26 Q62,50 58,74" fill="none" stroke="${OUT}" stroke-width="1" opacity="0.35"/>`,
    bible: `<rect x="40" y="28" width="40" height="64" rx="3" fill="#2a1f14" stroke="${OUT}" stroke-width="2.5"/><line x1="47" y1="32" x2="47" y2="88" stroke="#c8a84a" stroke-width="1.5"/><line x1="74" y1="32" x2="74" y2="88" stroke="#c9b98f" stroke-width="1.5" opacity="0.7"/><path d="M60,44 v20 M52,52 h16" stroke="#c8a84a" stroke-width="2.5"/><line x1="40" y1="84" x2="80" y2="84" stroke="${OUT}" stroke-width="1" opacity="0.5"/><rect x="68" y="88" width="4" height="10" fill="#a33333" stroke="${OUT}" stroke-width="1"/>`,
    dumbbells: `<rect x="14" y="56" width="40" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="8" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="54" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="58" y="56" width="40" height="7" fill="#3a3a3a" stroke="${OUT}" stroke-width="2"/><rect x="98" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><rect x="52" y="46" width="8" height="26" fill="#2c2c28" stroke="${OUT}" stroke-width="2"/><line x1="14" y1="59" x2="54" y2="59" stroke="#000" stroke-width="1" opacity="0.4"/><line x1="58" y1="59" x2="98" y2="59" stroke="#000" stroke-width="1" opacity="0.4"/><line x1="10" y1="52" x2="10" y2="66" stroke="#000" stroke-width="1" opacity="0.5"/><line x1="104" y1="52" x2="104" y2="66" stroke="#000" stroke-width="1" opacity="0.5"/>`,
    "figure-night": `<circle cx="60" cy="32" r="14" fill="#e8b98a" stroke="${OUT}" stroke-width="2.5"/><rect x="44" y="48" width="32" height="46" fill="#23241f" stroke="${OUT}" stroke-width="2.5"/><rect x="48" y="94" width="10" height="18" fill="#2c2f1c" stroke="${OUT}" stroke-width="2"/><rect x="62" y="94" width="10" height="18" fill="#2c2f1c" stroke="${OUT}" stroke-width="2"/><path d="M44,56 L76,56" stroke="#000" stroke-width="1.5" opacity="0.4"/><circle cx="60" cy="30" r="3" fill="#1a1a1a"/><path d="M52,26 L56,22" stroke="#fff" stroke-width="1.5" opacity="0.6"/>`
  }[item.glyph] || `<circle cx="60" cy="60" r="20" fill="#4a4430" stroke="${OUT}" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:110px;display:block">${g}</svg>`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DAYS, EXERCISES, EX_BY_ID, CABLE_STACK, RANKS, dateKey, parseDate, fmtDate,
    weekFor, levelForXp, rankForLevel, rankInsigniaSvg, shelfDayIndex, shelfItems, shelfGroups,
    rotationInfo, boardCounts, nextLoad, fmtWeight, totalReps, scoreLift, dayTotals,
    weekKeyOf, seedState, findSession, prevLift, saveLiftToState, deleteLiftFromState,
    deleteSessionFromState, addFoodToState, removeFoodFromState, addWeightToState,
    claimDoubleToState, activateDoubleToState, addXp,
    SHOP_ITEMS, ITEM_BY_ID, EMPTY_EQUIPPED, CRATES, CRATE_BY_ID, scrapValue,
    resolveCrateReward, wcMult, wcBoosted, WC_MULT_END, migrateState,
    syncArtifactSnapshot, SYNC_TARGETS, SYNC_SESSIONS, SEED_LABELS,
    charImageFor, charTier, charBulk, WORN_PHOTO,
    buildCharacterSvg, previewSvg, slotFilter, eraBadge, eraMatches,
    prestigeToState, ACHIEVEMENTS, QUESTS, achievementEarned, awardAchievements,
    questProgress, checkQuests };
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
    else syncArtifactSnapshot(state);
  } catch (e) { state = seedState(); }
  function persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }

  let currentDay = DAY_BY_WEEKDAY[new Date().getDay()] || "arms";
  let logDay = currentDay;
  // Log-form prefill from history tools (copy-to-today / load-back). Nothing
  // is written to state until the user hits Save on a lift; a prefill entry
  // is cleared when its lift is saved. Copy-to-today fills only lifts not
  // yet logged today; load-back overrides the form (override: true) for
  // editing — re-saving subtracts the old lift's XP first, so it can't
  // double-count (see saveLiftToState).
  let logPrefill = {};
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
  /* ----- Shop ambience: procedural depot-hangar sound, no audio files. -----
     Soft brown noise through a lowpass filter plus a low sine hum, kept
     quiet. Tune with the SHOP_AMB_* constants. The 5.6s levelup stinger is
     never looped as ambience — far too short and repetitive. */
  const SHOP_AMB_MASTER = 0.08, SHOP_AMB_NOISE = 0.6, SHOP_AMB_HUM = 0.2,
        SHOP_AMB_HUM_FREQ = 55, SHOP_AMB_LOWPASS = 320;
  let shopAmb = null;
  function startShopAmbience() {
    if (state.muted || shopAmb) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const t = audioCtx.currentTime;
      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.0001, t);
      master.gain.linearRampToValueAtTime(SHOP_AMB_MASTER, t + 1.5);
      master.connect(audioCtx.destination);
      const len = audioCtx.sampleRate * 2;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = audioCtx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = SHOP_AMB_LOWPASS;
      const ng = audioCtx.createGain(); ng.gain.value = SHOP_AMB_NOISE;
      src.connect(lp); lp.connect(ng); ng.connect(master);
      src.start();
      const hum = audioCtx.createOscillator();
      hum.type = "sine"; hum.frequency.value = SHOP_AMB_HUM_FREQ;
      const hg = audioCtx.createGain(); hg.gain.value = SHOP_AMB_HUM;
      hum.connect(hg); hg.connect(master);
      hum.start();
      shopAmb = { src, hum, master };
    } catch (e) {}
  }
  function stopShopAmbience() {
    if (!shopAmb) return;
    const nodes = shopAmb;
    shopAmb = null;
    try {
      const t = audioCtx.currentTime;
      nodes.master.gain.cancelScheduledValues(t);
      nodes.master.gain.setValueAtTime(nodes.master.gain.value, t);
      nodes.master.gain.linearRampToValueAtTime(0.0001, t + 0.4);
      setTimeout(() => {
        try { nodes.src.stop(); } catch (e) {}
        try { nodes.hum.stop(); } catch (e) {}
        try { nodes.master.disconnect(); } catch (e) {}
      }, 500);
    } catch (e) {}
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
  /* Award + quest notifications (recognition only — no XP or WC attached). */
  function notifyAwards() {
    const freshA = awardAchievements(state);
    const freshQ = checkQuests(state);
    if (freshA.length || freshQ.length) {
      persist();
      const bits = [];
      freshA.forEach((a) => bits.push("🏆 Achievement: <b>" + esc(a.name) + "</b> — " + esc(a.desc)));
      freshQ.forEach((q) => bits.push("✅ Quest complete: <b>" + esc(q.name) + "</b>"));
      showBanner(bits.join("<br>"));
    }
  }
  /* Progress-card collapse: tap a card header to collapse/expand; the
     open/closed state persists in localStorage; default is expanded. */
  function applyCollapse() {
    document.querySelectorAll("#tab-progress .card.collapsible").forEach((card) => {
      const collapsed = !!(state.collapsed && state.collapsed[card.id]);
      card.classList.toggle("collapsed", collapsed);
    });
  }
  $("tab-progress").addEventListener("click", (e) => {
    const head = e.target.closest("[data-collapse]");
    if (!head) return;
    const id = head.dataset.collapse;
    if (!state.collapsed) state.collapsed = {};
    state.collapsed[id] = !state.collapsed[id];
    persist();
    applyCollapse();
  });

  /* ----- Header / tabs: two rows on phones (week/coins/sound up top, the
     centered rank/XP module with a short CLAIM 2x button below) ----- */
  function renderHeader() {
    const level = levelForXp(state.xpTotal);
    $("weekBadge").textContent = "Week " + weekFor(new Date());
    $("coinsChip").textContent = "🪙 " + state.coins.toLocaleString();
    $("muteBtn").textContent = state.muted ? "🔇" : "🔊";
    $("rankMini").innerHTML = rankInsigniaSvg(level, 28);
    const pfx = state.prestige > 0 ? "P" + state.prestige + " · " : "";
    $("rankName").textContent = pfx + "Lv " + level + " · " + rankForLevel(level) + (state.xpTotal >= XP_CAP ? " · PRESTIGE READY" : "");
    const into = state.xpTotal - (level - 1) * XP_PER_LEVEL;
    $("headXpMeter").style.width = Math.min(100, into / XP_PER_LEVEL * 100) + "%";
    $("headXpText").textContent = state.xpTotal + " / " + XP_CAP + " XP";
    const dx = state.doubleXp;
    const hb = $("headClaimBtn");
    hb.disabled = dx.claimable <= 0;
    hb.classList.toggle("glow", dx.claimable > 0);
    $("headStackCount").textContent = "Stacked ×" + dx.stack + (dx.active ? " · 2× ON" : "");
    $("sideXp").innerHTML = (state.prestige > 0 ? "Prestige " + state.prestige + "<br>" : "") + "Level " + level + " · " + esc(rankForLevel(level)) + "<br>" + state.xpTotal + " / " + XP_CAP + " XP<br>" + state.coins.toLocaleString() + " War Coins";
  }
  function doClaim(sourceEl) {
    if (claimDoubleToState(state)) {
      persist();
      claimSting();
      sparkBurst(sourceEl);
      renderProgress(); renderHeader();
      showBanner("2× XP charge claimed — banked. Activate it when your next session starts.");
    }
  }
  function switchTab(tab) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + tab));
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    document.body.classList.toggle("shop-active", tab === "shop");
    if (tab === "progress") renderProgress();
    if (tab === "log") renderFood();
    if (tab === "shop") renderShop();
    if (tab === "character") renderCharacter();
    if (tab === "shop") startShopAmbience(); else stopShopAmbience();
  }
  document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopShopAmbience(); return; }
    const shopTab = document.getElementById("tab-shop");
    if (shopTab && shopTab.classList.contains("active")) startShopAmbience();
  });

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
      // History prefill (copy-to-today / load-back): shown when it fills an
      // unlogged lift, or when load-back overrides for editing.
      const pf = logPrefill[ex.id];
      const show = pf && (pf.override || !saved);
      const setInputs = Array.from({ length: t.sets }, (_, i) =>
        `<div class="set-row"><span>Set ${i + 1}</span><input type="number" inputmode="numeric" min="0" data-set="${i}" placeholder="${t.repMax} reps" value="${show ? pf.reps[i] ?? "" : saved ? saved.reps[i] ?? "" : ""}"></div>`).join("");
      return `<div class="card" id="logform-${ex.id}">
        <h3>${esc(ex.name)} <span class="muted">· target ${t.sets} × ${t.repMin === t.repMax ? t.repMin : t.repMin + "–" + t.repMax} · ${fmtWeight(ex, t.weight)}</span></h3>
        <p class="last">${lastLiftText(ex.id)}${show ? ` <span class="badge active">Filled from ${esc(pf.fromDate)}</span>` : ""}</p>
        <label>Weight lifted (lbs)</label>
        <input type="number" inputmode="decimal" min="0" data-weight value="${show ? pf.weight : saved ? saved.weight : t.weight}">
        ${setInputs}
        <label class="goal-row"><input type="checkbox" data-goal ${show ? pf.goalHit ? "checked" : "" : saved && saved.goalHit ? "checked" : ""}> I hit my goal on this lift</label>
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
      delete logPrefill[exId]; // a saved prefill is spent
      persist();
      const cls = res.scored.label === "Move-up" ? "up" : res.scored.label === "Held" ? "flat" : "reset";
      const xpTxt = res.replaced
        ? `XP updated (${res.xpDelta >= 0 ? "+" : ""}${res.xpDelta}) · ${res.scored.label}`
        : `+${res.earned} XP · ${res.scored.label}`;
      let html = `<span class="${cls}">${xpTxt}${goalHit ? " + goal hit" : ""}${res.doubled ? " · 2× doubled" : ""}</span>`;
      if (res.coinsEarned > 0) html += ` · <span class="gold">+${res.coinsEarned} WC</span>`;
      if (res.rolled !== null) html += ` · 🎯 Target rolled up to ${fmtWeight(ex, res.rolled)} — a 2× charge is banked, claim it in Progress.`;
      card.querySelector("[data-result]").innerHTML = "Saved: " + fmtWeight(ex, weight) + " × " + reps.join("/") + " — " + html;
      afterXp(res, null);
      if (!res.leveledUp) {
        if (res.scored.label === "Move-up" || res.rolled !== null) { gunshotSound(); muzzleFlash(); }
        else blip();
      }
      renderHeader();
      notifyAwards();
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
      if (!confirm("Remove this food entry? Totals and bonus XP will recalculate.")) return;
      const info = removeFoodFromState(state, k, id);
      if (info.removed) {
        persist(); renderFood(); renderHeader();
        if (info.xpLost > 0) showBanner("Entry removed — the day no longer hits the " + (info.lostProtein ? "protein" : "") + (info.lostProtein && info.lostCal ? " and calorie" : info.lostCal ? "calorie" : "") + " target, so " + info.xpLost + " bonus XP was removed. War Coins are never clawed back.");
      }
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
    notifyAwards();
  });

  /* ----- Progress ----- */
  function renderProgress() {
    const level = levelForXp(state.xpTotal);
    $("rankLine").textContent = "Level " + level + " · " + rankForLevel(level);
    $("xpLine").textContent = state.xpTotal + " / " + XP_CAP + " XP";
    $("xpMeter").style.width = Math.min(100, (state.xpTotal - (level - 1) * XP_PER_LEVEL) / XP_PER_LEVEL * 100) + "%";
    $("xpCapLine").textContent = state.xpTotal >= XP_CAP
      ? "200 / 200 XP — prestige ready! Hit PRESTIGE below to bank it and restart at Level 1."
      : "Progress toward the 200 XP cap: " + Math.round(state.xpTotal / XP_CAP * 100) + "%.";
    $("coinsLine").textContent = "💰 " + state.coins.toLocaleString() + " War Coins — earned from sessions, move-ups, target hits, sets, reps, fuel days, and weigh-ins." + (dateKey(new Date()) <= WC_MULT_END ? " 1.5× boost active through Nov 10 on weigh-ins, weekly gains, and fuel days." : "");
    const pCount = state.prestige || 0;
    $("prestigeStatus").innerHTML = pCount > 0
      ? "Prestige <b>" + pCount + "</b> · " + pCount + " of 10 vault emblems lit."
      : "Prestige <b>0</b> — reach 200 XP to unlock your first prestige.";
    $("prestigeBtn").disabled = state.xpTotal < XP_CAP;
    $("prestigeBtn").classList.toggle("glow", state.xpTotal >= XP_CAP);
    const dx = state.doubleXp;
    $("doubleLine").innerHTML = "Stack: <b>" + dx.stack + " banked</b> · Active: " + (dx.active ? `<span class="badge active">ON — next session pays double</span>` : `<span class="badge closed">OFF</span>`) + " · Claimable: <b>" + dx.claimable + "</b>";
    $("claimBtn").disabled = dx.claimable <= 0;
    $("claimBtn").classList.toggle("glow", dx.claimable > 0);
    $("activateBtn").disabled = dx.stack <= 0 || dx.active;
    // Strength board: Progress / Held / Reset tallies from scored history.
    const bc = boardCounts(state.sessions);
    $("strengthBoard").innerHTML = `<div class="board-col"><b>${bc.progress}</b><span>Progress</span></div><div class="board-col"><b>${bc.held}</b><span>Held</span></div><div class="board-col"><b>${bc.reset}</b><span>Reset</span></div>`;
    // Rank ladder: earned / current / locked states with per-level insignia.
    $("ladderCurrent").textContent = "You are Level " + level + " · " + rankForLevel(level) + " — " + state.xpTotal + " XP.";
    $("ladderBox").innerHTML = RANKS.map((name, i) => {
      const lv = i + 1;
      const st = lv < level ? "EARNED" : lv === level ? "CURRENT" : "LOCKED";
      const lo = (lv - 1) * XP_PER_LEVEL, hi = lv === 20 ? XP_CAP : lv * XP_PER_LEVEL - 1;
      return `<div class="ladder-row ${st.toLowerCase()}"><span class="ladder-ins">${rankInsigniaSvg(lv, 40)}</span><span class="ladder-lv">Lv ${lv}</span><b>${esc(name)}</b><span class="ladder-xp">${lo}–${hi} XP</span><span class="badge ${st === "CURRENT" ? "active" : st === "EARNED" ? "open" : "closed"}">${st}</span></div>`;
    }).join("");
    // Prestige vault: emblems light up per prestige count (prestige 1 lights
    // emblem 1, and so on; past 10, all ten stay lit).
    const ORD = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
    $("prestigeLine").textContent = pCount === 0
      ? "Prestige 0 — you haven't prestiged yet. All ten emblems are locked; they light up as prestige is earned."
      : pCount >= 10
        ? "Prestige " + pCount + " — all ten emblems earned. Keep climbing for the next prestige."
        : "Prestige " + pCount + " — " + pCount + " of 10 emblems lit; the next lights up at prestige " + (pCount + 1) + ".";
    $("vaultBox").innerHTML = `<div class="vault-grid">` + ORD.map((o, i) => {
      const lit = i < pCount;
      return `<div class="vault-item ${lit ? "earned" : "locked"}"><img src="./assets/prestige/prestige-${i + 1}.jpg" alt="${o} Prestige emblem" loading="lazy"><b>${o} Prestige</b><span class="badge ${lit ? "open" : "closed"}">${lit ? "EARNED" : "LOCKED"}</span></div>`;
    }).join("") + `</div><p class="muted">Emblems cut from your Call of Duty 5 prestige reference sheet. Private personal use only.</p>`;
    $("weightList").innerHTML = state.weights.map((w) => `<div class="food-entry"><span>${fmtDate(w.date)}</span><b>${w.weight} lbs</b></div>`).join("");
    const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
    $("historyList").innerHTML = sorted.length === 0 ? `<p class="muted">No sessions yet.</p>` : sorted.map((s) => {
      const day = DAYS.find((d) => d.id === s.dayId);
      const lifts = Object.entries(s.lifts).map(([exId, l]) => {
        const ex = EX_BY_ID[exId];
        const xpTxt = l.xp === null ? (l.label && l.label !== "Seeded" ? esc(l.label) + " (synced)" : "seeded") : "+" + l.xp + " XP (" + esc(l.label) + ")";
        return `<div class="lift-line"><span>${esc(ex.name)} — ${fmtWeight(ex, l.weight)} × ${l.reps.join("/")}${l.note ? " (" + esc(l.note) + ")" : ""}</span><span><span class="xp">${xpTxt}</span> <button class="small danger" data-del-lift="${s.date}:${exId}">Delete</button></span></div>`;
      }).join("");
      return `<div class="sess"><div class="sess-head"><b>${fmtDate(s.date)} · ${day ? day.name : s.dayId}${typeof s.strengthXp === "number" ? " · " + s.strengthXp + " XP" : ""}</b><span>${s.doubled === true ? `<span class="badge active">2× doubled</span> ` : ""}<button class="small secondary" data-copy="${s.date}">Copy as text</button> <button class="small secondary" data-copy-today="${s.date}">Copy to today</button> <button class="small secondary" data-load-back="${s.date}">Load to log</button> <button class="small danger" data-del-sess="${s.date}">Delete session</button></span></div>${lifts}</div>`;
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
    // History tools: copy-to-today merges a past session into today's log
    // (unscored until each lift is saved, and never overwriting a lift
    // already logged today); load-back fills the log forms with a past
    // session's weights/reps for editing. Neither writes state until Save,
    // so scored history is never duplicated by the tools themselves.
    function fillLogFromSession(s, override) {
      const today = dateKey(new Date());
      if (s.date === today) { showBanner("That's already today's session."); return; }
      const todaySess = findSession(state, today);
      let filled = 0;
      Object.entries(s.lifts).forEach(([exId, l]) => {
        if (!EX_BY_ID[exId]) return;
        if (!override && todaySess && todaySess.lifts[exId]) return;
        logPrefill[exId] = { weight: l.weight, reps: l.reps.slice(), goalHit: !!l.goalHit, override, fromDate: fmtDate(s.date) };
        filled++;
      });
      if (filled === 0) { showBanner("Nothing to fill — every lift from that session is already logged today."); return; }
      logDay = s.dayId;
      switchTab("log");
      renderLog();
      const day = DAYS.find((d) => d.id === s.dayId);
      showBanner((override ? "Loaded " : "Copied ") + fmtDate(s.date) + " · " + (day ? day.name : s.dayId) + " into today's log — save each lift to score it.");
    }
    $("historyList").querySelectorAll("[data-copy-today]").forEach((b) => b.addEventListener("click", () => {
      const s = findSession(state, b.dataset.copyToday);
      if (s) fillLogFromSession(s, false);
    }));
    $("historyList").querySelectorAll("[data-load-back]").forEach((b) => b.addEventListener("click", () => {
      const s = findSession(state, b.dataset.loadBack);
      if (s) fillLogFromSession(s, true);
    }));
    // Fuel summary: last 7 logged food days with bonus badges.
    const fkeys = Object.keys(state.foodDays || {}).sort().reverse().slice(0, 7);
    $("fuelBox").innerHTML = fkeys.length === 0 ? `<p class="muted">No food logged yet. Log food on the Log tab.</p>` : fkeys.map((k) => {
      const day = state.foodDays[k], t = dayTotals(day);
      return `<div class="food-entry"><span>${fmtDate(k)}</span><span>${t.cal.toLocaleString()} cal · ${t.protein}g protein ${day.bonus && day.bonus.protein ? `<span class="badge open">Protein ✓</span>` : ""} ${day.bonus && day.bonus.cal ? `<span class="badge open">Calories ✓</span>` : ""}</span></div>`;
    }).join("") + `<p class="muted">Targets: 3,200 cal · 140g protein. Log food on the Log tab.</p>`;
    // Achievements + quests (recognition only — no XP or War Coins attached).
    const earnedA = state.achievements || [];
    $("achievementsCount").textContent = earnedA.length + " / " + ACHIEVEMENTS.length + " earned";
    $("achievementsBox").innerHTML = `<div class="ach-grid">` + ACHIEVEMENTS.map((a) => {
      const got = earnedA.includes(a.id);
      return `<div class="ach-item ${got ? "earned" : "locked"}"><b>${esc(a.name)}</b><span>${esc(a.desc)}</span><span class="badge ${got ? "open" : "closed"}">${got ? "EARNED" : "LOCKED"}</span></div>`;
    }).join("") + `</div>`;
    const wk = weekKeyOf(dateKey(new Date()));
    $("questsBox").innerHTML = QUESTS.map((q) => {
      const pr = questProgress(state, q, wk);
      return `<div class="quest-row"><div><b>${esc(q.name)}</b> <span class="muted">· ${esc(q.desc)}</span></div><div class="meter"><div style="width:${pr.target ? Math.round(pr.current / pr.target * 100) : 0}%"></div></div><span>${pr.current}/${pr.target} ${pr.done ? `<span class="badge open">COMPLETED</span>` : ""}</span></div>`;
    }).join("") + `<p class="muted">Quests refresh every Monday. No XP or War Coins attached — recognition only.</p>`;
    applyCollapse();
  }
  $("claimBtn").addEventListener("click", () => doClaim($("claimBtn")));
  $("headClaimBtn").addEventListener("click", () => doClaim($("headClaimBtn")));
  $("prestigeBtn").addEventListener("click", () => {
    if (!prestigeToState(state)) return;
    const freshA = awardAchievements(state);
    const freshQ = checkQuests(state);
    persist();
    prestigeStinger();
    let msg = "🎖 Prestige " + state.prestige + "! XP reset to 0 — the climb starts again at Level 1. Coins, gear, history, and double-XP charges all carry over.";
    freshA.forEach((a) => { msg += "<br>🏆 Achievement: <b>" + esc(a.name) + "</b>"; });
    freshQ.forEach((q) => { msg += "<br>✅ Quest complete: <b>" + esc(q.name) + "</b>"; });
    showBanner(msg);
    renderProgress(); renderHeader(); renderCharacter();
  });
  $("activateBtn").addEventListener("click", () => { if (activateDoubleToState(state)) { persist(); renderProgress(); renderHeader(); blip(); showBanner("2× XP is ON — your next session pays double, then it switches off."); } });
  $("ladderToggle").addEventListener("click", () => {
    const b = $("ladderBox");
    b.classList.toggle("open");
    $("ladderToggle").textContent = b.classList.contains("open") ? "Hide ladder" : "Show ladder";
  });
  $("vaultToggle").addEventListener("click", () => {
    const b = $("vaultBox");
    b.classList.toggle("open");
    $("vaultToggle").textContent = b.classList.contains("open") ? "Hide vault" : "Show vault";
  });
  $("stingerBtn").addEventListener("click", () => prestigeStinger());
  /* ----- Sounds tab: one test button per sound function ----- */
  document.querySelectorAll("[data-sound]").forEach((b) => b.addEventListener("click", () => {
    const fn = { gunfire: gunshotSound, levelup: playLevelUp, claim: claimSting, unlock: unlockSound, crate: crateSound, reveal: revealSound, prestige: prestigeStinger }[b.dataset.sound];
    if (fn) fn();
  }));
  $("addWeightBtn").addEventListener("click", () => {
    const d = $("weightDate").value, w = parseFloat($("weightVal").value);
    if (!d || isNaN(w)) { alert("Enter a date and a weight."); return; }
    const res = addWeightToState(state, d, w);
    persist(); renderProgress(); renderHeader();
    afterXp(res, (res.gained ? "Weigh-in logged: " + w + " lbs — weekly average gain, +2 XP." : "Weigh-in logged: " + w + " lbs.") + (res.coinsEarned > 0 ? " · +" + res.coinsEarned + " WC" : ""));
    blip();
    notifyAwards();
  });
  $("muteBtn").addEventListener("click", () => { state.muted = !state.muted; persist(); renderHeader(); if (state.muted) stopShopAmbience(); else { const shopTab = document.getElementById("tab-shop"); if (shopTab && shopTab.classList.contains("active")) startShopAmbience(); } });

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
  function noiseBurst(delay, dur, freq, gain) {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime + delay;
      const len = Math.floor(audioCtx.sampleRate * dur), buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = audioCtx.createBufferSource(); src.buffer = buf;
      const flt = audioCtx.createBiquadFilter(); flt.type = "bandpass"; flt.frequency.value = freq;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(flt); flt.connect(g); g.connect(audioCtx.destination); src.start(t);
    } catch (e) {}
  }
  function claimSting() { // rising arpeggio + brass chord
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.09, i * 0.08));
    [523, 659, 784].forEach((f) => tone(f, 0.6, "sawtooth", 0.03, 0.34));
  }
  function prestigeStinger() { // boom + chord
    noiseBurst(0, 0.5, 180, 0.16);
    tone(110, 0.5, "sine", 0.14, 0);
    tone(55, 0.9, "sine", 0.12, 0.05);
    [262, 330, 392, 523].forEach((f) => tone(f, 1.1, "triangle", 0.08, 0.3));
  }
  function gunshotSound() { // three sharp cracks for a target hit
    [0, 0.16, 0.32].forEach((d) => { noiseBurst(d, 0.12, 1600, 0.12); tone(90, 0.1, "sine", 0.08, d); });
  }
  function sparkBurst(el) { // gold sparks flying out of a button
    if (!el) return;
    try {
      const r = el.getBoundingClientRect();
      const host = document.createElement("span");
      host.className = "spark-host";
      host.style.left = (r.left + r.width / 2) + "px";
      host.style.top = (r.top + r.height / 2) + "px";
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        const a = (Math.PI * 2 * i) / 10;
        s.style.setProperty("--dx", Math.cos(a) * 34 + "px");
        s.style.setProperty("--dy", Math.sin(a) * 26 + "px");
        host.appendChild(s);
      }
      document.body.appendChild(host);
      setTimeout(() => host.remove(), 800);
    } catch (e) {}
  }
  function muzzleFlash() { // CSS-only target-celebration flash, paired with the gunshot sound
    if (state.muted) return;
    try {
      const el = document.createElement("div");
      el.className = "muzzle-flash";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 500);
    } catch (e) {}
  }
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
    state.scrapCount = (state.scrapCount || 0) + 1;
    persist();
    hideModal("dupModal");
    renderShop(); renderHeader();
    showBanner("Scrapped <b>" + esc(item ? item.name : "duplicate") + "</b> for <b>+" + pend.scrap + " War Coins</b>.");
    notifyAwards();
  });

  /* ----- Shop: depot console (drops + Armory/Collections/Ledger menu),
     4-day rotating shelf (10 items a day), selectable crates ----- */
  let shopFilter = "shelf";
  let shopEra = "all";
  let shopMenu = "armory";
  let selectedCrate = "rare"; // Rare is lit green by default
  function ledgerHtml() {
    const today = dateKey(new Date());
    const boost = today <= WC_MULT_END;
    return `<p><b>Balance:</b> ${state.coins.toLocaleString()} War Coins · <b>Owned:</b> ${state.owned.length} items · <b>Stacked:</b> ×${state.doubleXp.stack}${state.doubleXp.active ? " · 2× ON" : ""}</p>`
      + `<p>${boost ? "1.5× boost active through Nov 10 on weigh-ins, weekly gains, and fuel days." : "No boost active."}</p>`
      + `<p class="muted">How coins are earned — session +25 · set +1 · every 5 reps +1 · move-up +15 · target hit +10 · protein day +20 · calorie day +20 · weigh-in +15 · weekly gain +30. Coins are never clawed back when a lift or session is deleted; food-day bonus XP is recalculated when a food entry is removed, but its coins stay.</p>`;
  }
  function crateSvg(crate) {
    const color = crate.id === "epic" ? "#c8a84a" : crate.id === "rare" ? "#7dd87d" : "#8a8f5c";
    const wood = crate.id === "epic" ? "#4a3b1c" : crate.id === "rare" ? "#37402a" : "#3a3524";
    const label = crate.id === "epic" ? "EPIC" : crate.id === "rare" ? "RARE" : "SUPPLY";
    return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:74px;display:block"><rect x="14" y="18" width="92" height="48" fill="${wood}" stroke="${color}" stroke-width="2.5"/><line x1="14" y1="32" x2="106" y2="32" stroke="${color}" stroke-width="1" opacity="0.6"/><line x1="14" y1="52" x2="106" y2="52" stroke="${color}" stroke-width="1" opacity="0.6"/><line x1="14" y1="42" x2="106" y2="42" stroke="#000" stroke-width="1" opacity="0.25"/><rect x="14" y="18" width="10" height="48" fill="#000" opacity="0.18"/><rect x="96" y="18" width="10" height="48" fill="#000" opacity="0.18"/><rect x="14" y="18" width="92" height="6" fill="#000" opacity="0.15"/><rect x="28" y="18" width="5" height="48" fill="${color}" opacity="0.35"/><rect x="87" y="18" width="5" height="48" fill="${color}" opacity="0.35"/><path d="M14,18 L24,28 M106,18 L96,28 M14,66 L24,56 M106,66 L96,56" stroke="${color}" stroke-width="2"/><rect x="38" y="34" width="44" height="14" fill="none" stroke="${color}" stroke-width="2"/><text x="60" y="44" text-anchor="middle" font-size="9" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-weight="bold">${label}</text><text x="60" y="61" text-anchor="middle" font-size="6" fill="${color}" opacity="0.8" font-family="Arial, Helvetica, sans-serif">— DEPOT —</text></svg>`;
  }
  function renderShop() {
    $("shopCoins").textContent = state.coins.toLocaleString();
    $("shopOwned").textContent = state.owned.length + " owned";
    $("shopStack").textContent = "Stacked ×" + state.doubleXp.stack + (state.doubleXp.active ? " · 2× ON" : "");
    const today = dateKey(new Date());
    $("shopBoost").textContent = today <= WC_MULT_END ? "1.5× BOOST ACTIVE through Nov 10 — weigh-ins, weekly gains, and fuel days pay 1.5× War Coins." : "";
    $("shopBoost").style.display = today <= WC_MULT_END ? "block" : "none";
    // Next-rotation bar: the shelf rotates at midnight.
    const ri = rotationInfo(new Date());
    $("rotationFill").style.width = (ri.dayFrac * 100) + "%";
    $("rotationText").textContent = "Shelf day " + (ri.idx + 1) + " of 4 · next rotation at midnight (" + Math.floor(ri.minsLeft / 60) + "h " + (ri.minsLeft % 60) + "m left).";
    $("shelfTitle").textContent = shopFilter === "shelf" ? "ARMORY — SHELF DAY " + (ri.idx + 1) + " OF 4" : "ARMORY";
    // Console menu.
    const menus = [["armory", "Armory"], ["collections", "Collections"], ["ledger", "Ledger"]];
    $("consoleMenu").innerHTML = menus.map(([m, label]) =>
      `<button class="chip ${shopMenu === m ? "on" : ""}" data-menu="${m}">${label}</button>`).join("");
    $("consoleMenu").querySelectorAll("[data-menu]").forEach((b) => b.addEventListener("click", () => {
      shopMenu = b.dataset.menu;
      if (shopMenu === "collections") shopFilter = "owned";
      if (shopMenu === "armory") shopFilter = "shelf";
      renderShop();
    }));
    $("ledgerPanel").innerHTML = shopMenu === "ledger" ? ledgerHtml() : "";
    $("ledgerPanel").classList.toggle("open", shopMenu === "ledger");
    $("crateRow").innerHTML = CRATES.map((c) => {
      const blocked = !!state.pendingDuplicate;
      const afford = state.coins >= c.price;
      const sel = selectedCrate === c.id;
      return `<div class="crate-card ${c.id === "rare" ? "rare-lit" : c.id === "epic" ? "epic-lit" : "supply-lit"} ${sel ? "selected" : ""} ${blocked ? "blocked" : ""}" data-select-crate="${c.id}" id="crate-${c.id}">
        ${crateSvg(c)}
        <b>${esc(c.name)}</b>
        <span class="odds ${sel ? "green" : ""}">${c.price} WC · Gear ${(c.gear * 100).toFixed(0)}% · Coins ${(Math.round((1 - c.gear - c.token) * 100))}% · 2× Token ${(c.token * 100).toFixed(0)}%</span>
        <button data-crate="${c.id}" ${!afford && !blocked ? "disabled" : ""}>${blocked ? "Finish duplicate first" : afford ? "Open — " + c.price + " WC" : "Need " + c.price + " WC"}</button>
      </div>`;
    }).join("");
    $("crateRow").querySelectorAll("[data-select-crate]").forEach((card) => card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      selectedCrate = card.dataset.selectCrate;
      renderShop();
    }));
    $("crateRow").querySelectorAll("[data-crate]").forEach((b) => b.addEventListener("click", () => openCrate(b.dataset.crate)));
    const filters = [["shelf", "Today's shelf"], ["all", "Full armory"], ["top", "Tops"], ["bottom", "Bottoms"], ["head", "Headwear"], ["gear", "Gear"], ["owned", "Owned"]];
    $("shopFilters").innerHTML = filters.map(([f, label]) =>
      `<button class="chip ${shopFilter === f ? "on" : ""}" data-filter="${f}">${label}</button>`).join("");
    $("shopFilters").querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => { shopFilter = b.dataset.filter; renderShop(); }));
    const eras = [["all", "All eras"], ["90s", "’90s gym bro"], ["2026", "2026 gym bro"]];
    $("eraFilters").innerHTML = eras.map(([e, label]) =>
      `<button class="chip ${shopEra === e ? "on" : ""}" data-era="${e}">${label}</button>`).join("");
    $("eraFilters").querySelectorAll("[data-era]").forEach((b) => b.addEventListener("click", () => { shopEra = b.dataset.era; renderShop(); }));
    let items;
    if (shopFilter === "shelf") items = shelfItems(ri.idx);
    else if (shopFilter === "owned") items = SHOP_ITEMS.filter((it) => state.owned.includes(it.id));
    else if (shopFilter === "all") items = SHOP_ITEMS;
    else items = SHOP_ITEMS.filter((it) => slotFilter(it.slot) === shopFilter);
    items = items.filter((it) => eraMatches(it, shopEra));
    $("shopGrid").innerHTML = items.length === 0 ? `<p class="muted">Nothing here yet.</p>` : items.map((it) => {
      const owned = state.owned.includes(it.id);
      const equippedId = state.equipped[it.slot];
      const isEquipped = equippedId === it.id;
      const badge = eraBadge(it);
      const action = !owned
        ? `<button data-buy="${it.id}" ${state.coins < it.price ? "disabled" : ""}>Buy — ${it.price} WC</button>`
        : isEquipped
          ? `<button class="secondary" data-unequip="${it.id}">Unequip ✓</button>`
          : `<button class="secondary" data-equip="${it.id}">Equip</button>`;
      return `<div class="card shop-card">
        <div class="shop-preview">${previewSvg(it)}</div>
        <div class="shop-title"><b>${esc(it.name)}</b><span>${badge ? `<span class="era-badge">${badge}</span> ` : ""}<button class="info-btn" data-info="${it.id}" aria-label="Item details">!</button></span></div>
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
    state.purchaseCount = (state.purchaseCount || 0) + 1;
    persist();
    unlockSound();
    $("unlockPreview").innerHTML = previewSvg(it);
    $("unlockName").textContent = it.name;
    $("unlockEquipBtn").dataset.equip = id;
    showModal("unlockModal");
    renderShop(); renderHeader();
    notifyAwards();
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
    if (it.slot === "figure") state.figureVariant = id;
    if (!Array.isArray(state.questEvents)) state.questEvents = [];
    state.questEvents.push({ type: "equip", week: weekKeyOf(dateKey(new Date())) });
    persist();
    renderShop(); renderCharacter(); renderHeader();
    blip();
    notifyAwards();
  }
  function unequipSlot(slot) {
    state.equipped[slot] = null;
    if (slot === "figure") state.figureVariant = "standard";
    persist();
    renderShop(); renderCharacter(); renderHeader();
  }
  function openCrate(crateId) {
    if (state.pendingDuplicate) { showDupModal(); return; }
    const crate = CRATE_BY_ID[crateId];
    if (!crate) return;
    if (state.coins < crate.price) { showBanner("Not enough War Coins — this drop costs " + crate.price + " WC."); return; }
    state.coins -= crate.price;
    state.crateCount = (state.crateCount || 0) + 1;
    if (!Array.isArray(state.questEvents)) state.questEvents = [];
    state.questEvents.push({ type: "crate", week: weekKeyOf(dateKey(new Date())) });
    persist();
    const card = document.getElementById("crate-" + crateId);
    if (card) card.classList.add("opening");
    // CSS-only opening overlay: a rattling crate with a popping lid for the
    // existing 950ms window. Purely visual — it is hidden before any result
    // or duplicate modal shows, so it can never block the scrap flow.
    const overlay = $("crateOverlay");
    if (overlay) overlay.classList.add("show");
    crateSound();
    notifyAwards(); // crate-open quest + first-drop badge banner now; the reward modal follows
    setTimeout(() => {
      if (overlay) overlay.classList.remove("show");
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
    const charImg = charImageFor(state.equipped, state.facialHair, state.figureVariant);
    const charScale = charBulk(latest).toFixed(3);
    // Worn photos load network-first (never precached): show the tier photo
    // immediately, swap to the worn photo once it loads, fall back to the
    // tier photo if the worn photo errors — never a broken image.
    const charImgTag = charImg.worn
      ? `<img class="char-photo${charImg.night ? " char-night" : ""}" src="${charImg.fallback}" data-worn="${charImg.worn}" data-fb="${charImg.fallback}" onload="if(this.dataset.worn){var w=this.dataset.worn;this.dataset.worn='';this.src=w;}" onerror="if(this.dataset.fb&&this.src.indexOf(this.dataset.fb)===-1){this.src=this.dataset.fb;}" alt="Character figure" style="transform:scale(${charScale})">`
      : `<img class="char-photo${charImg.night ? " char-night" : ""}" src="${charImg.src}"${charImg.fallback ? " data-fb=\"" + charImg.fallback + "\" onerror=\"if(this.dataset.fb){this.src=this.dataset.fb;this.dataset.fb='';}\"" : ""} alt="Character figure" style="transform:scale(${charScale})">`;
    $("charFigure").innerHTML = `<div class="char-photo-wrap">${charImgTag}</div>`;
    const level = levelForXp(state.xpTotal);
    $("charStats").innerHTML = "Weight: <b>" + latest + " lbs</b> (goal " + state.profile.goalWeight + ") · Level " + level + " " + esc(rankForLevel(level)) + " · " + state.xpTotal + " XP · " + state.coins.toLocaleString() + " WC";
    const faces = [["clean", "Clean shaven"], ["stubble", "Stubble"], ["beard", "Beard"], ["moustache", "Moustache"]];
    $("faceChips").innerHTML = faces.map(([f, label]) =>
      `<button class="chip ${state.facialHair === f ? "on" : ""}" data-face="${f}">${label}</button>`).join("");
    $("faceChips").querySelectorAll("[data-face]").forEach((b) => b.addEventListener("click", () => {
      state.facialHair = b.dataset.face;
      persist();
      renderCharacter();
    }));
    // Figure variants: Standard base plus owned variant items (e.g. Night Ops).
    const variants = [{ id: "standard", name: "Standard" }].concat(
      SHOP_ITEMS.filter((it) => it.slot === "figure").map((it) => ({ id: it.id, name: it.name })));
    $("variantChips").innerHTML = variants.map((v) => {
      const owned = v.id === "standard" || state.owned.includes(v.id);
      return `<button class="chip ${state.figureVariant === v.id ? "on" : ""}" data-variant="${v.id}" ${owned ? "" : "disabled"}>${esc(v.name)}${owned ? "" : " · Locked"}</button>`;
    }).join("");
    $("variantChips").querySelectorAll("[data-variant]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.variant;
      if (id !== "standard" && !state.owned.includes(id)) { showBanner("Buy it in the shop first."); return; }
      state.figureVariant = id;
      state.equipped.figure = id === "standard" ? null : id;
      persist();
      renderCharacter();
    }));
    const equippedEntries = Object.entries(state.equipped).filter(([, id]) => id);
    $("equippedList").innerHTML = equippedEntries.length === 0
      ? `<p class="muted">Base kit only: military T-shirt, fatigue shorts, ankle boots. Buy gear in the shop to build the kit.</p>`
      : equippedEntries.map(([slot, id]) => {
        const it = ITEM_BY_ID[id];
        return `<div class="food-entry"><span>${esc(it.name)} <span class="muted">· ${esc(slot)}</span></span><span><button class="info-btn" data-char-info="${slot}" aria-label="Item details">!</button> <button class="small secondary" data-unequip-slot="${slot}">Unequip</button></span></div><div class="shop-details" id="char-details-${slot}">${itemDetailsHtml(it)}</div>`;
      }).join("");
    $("equippedList").querySelectorAll("[data-unequip-slot]").forEach((b) => b.addEventListener("click", () => unequipSlot(b.dataset.unequipSlot)));
    $("equippedList").querySelectorAll("[data-char-info]").forEach((b) => b.addEventListener("click", () => {
      const el = document.getElementById("char-details-" + b.dataset.charInfo);
      if (el) el.classList.toggle("open");
    }));
    const ownedNotEquipped = state.owned.filter((id) => !Object.values(state.equipped).includes(id));
    $("ownedChips").innerHTML = ownedNotEquipped.length === 0
      ? `<p class="muted">No unequipped gear. Everything you own is already on the figure — or the shop is waiting.</p>`
      : ownedNotEquipped.map((id) => {
        const it = ITEM_BY_ID[id];
        return `<div class="owned-row"><button class="chip" data-equip="${id}">${esc(it.name)}</button><button class="info-btn" data-char-info-owned="${id}" aria-label="Item details">!</button><div class="shop-details" id="char-details-owned-${id}">${itemDetailsHtml(it)}</div></div>`;
      }).join("");
    $("ownedChips").querySelectorAll("[data-equip]").forEach((b) => b.addEventListener("click", () => equipItem(b.dataset.equip)));
    $("ownedChips").querySelectorAll("[data-char-info-owned]").forEach((b) => b.addEventListener("click", () => {
      const el = document.getElementById("char-details-owned-" + b.dataset.charInfoOwned);
      if (el) el.classList.toggle("open");
    }));
  }

  /* ----- Init + midnight rollover ----- */
  $("weightDate").value = dateKey(new Date());
  awardAchievements(state); // silently bank badges already earned by synced history
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
