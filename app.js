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
    version: 1,
    profile: { name: "Anthony", age: 31, height: "5'11\"", startWeight: 140, goalWeight: 165, creatine: 5 },
    xpTotal: 83,
    coins: 1160,
    doubleXp: { stack: 2, active: true, claimable: 0 },
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
    }
  }
  return { scored, earned, doubled, rolled, sessionWasNew, leveledUp: xpInfo.leveledUp, newLevel: xpInfo.newLevel };
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
  let leveledUp = false, newLevel = levelForXp(state.xpTotal);
  if (totals.protein >= PROTEIN_TARGET && !day.bonus.protein) {
    day.bonus.protein = true;
    const r = addXp(state, 1); leveledUp = leveledUp || r.leveledUp; newLevel = r.newLevel;
  }
  if (totals.cal >= CAL_TARGET && !day.bonus.cal) {
    day.bonus.cal = true;
    const r = addXp(state, 1); leveledUp = leveledUp || r.leveledUp; newLevel = r.newLevel;
  }
  return { totals, leveledUp, newLevel };
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
  const wk = weekKeyOf(dateStr);
  if (state.weightXpWeeks.includes(wk)) return { leveledUp: false, newLevel: levelForXp(state.xpTotal), gained: false };
  const weeks = {};
  state.weights.forEach((w) => { (weeks[weekKeyOf(w.date)] = weeks[weekKeyOf(w.date)] || []).push(w.weight); });
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const earlier = Object.keys(weeks).filter((k) => k < wk).sort();
  const prevAvg = earlier.length ? avg(weeks[earlier[earlier.length - 1]]) : null;
  if (prevAvg !== null && avg(weeks[wk]) > prevAvg) {
    state.weightXpWeeks.push(wk);
    const r = addXp(state, 2);
    return { leveledUp: r.leveledUp, newLevel: r.newLevel, gained: true };
  }
  return { leveledUp: false, newLevel: levelForXp(state.xpTotal), gained: false };
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

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DAYS, EXERCISES, EX_BY_ID, CABLE_STACK, RANKS, dateKey, parseDate, fmtDate,
    weekFor, levelForXp, rankForLevel, nextLoad, fmtWeight, totalReps, scoreLift, dayTotals,
    weekKeyOf, seedState, findSession, prevLift, saveLiftToState, deleteLiftFromState,
    deleteSessionFromState, addFoodToState, removeFoodFromState, addWeightToState,
    claimDoubleToState, activateDoubleToState };
}

/* ---------------- Browser layer (DOM, storage, sounds, events) ---------------- */
if (typeof document !== "undefined") {
  const LS_KEY = "pfg-pwa-v1";
  let state;
  try {
    const raw = localStorage.getItem(LS_KEY);
    state = raw ? JSON.parse(raw) : seedState();
    if (!state || state.version !== 1 || !state.targets) state = seedState();
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
    $("muteBtn").textContent = state.muted ? "🔇" : "🔊";
    $("sideXp").innerHTML = "Level " + level + " · " + esc(rankForLevel(level)) + "<br>" + state.xpTotal + " / " + XP_CAP + " XP<br>" + state.coins.toLocaleString() + " War Coins";
  }
  function switchTab(tab) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + tab));
    document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    if (tab === "progress") renderProgress();
    if (tab === "log") renderFood();
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
    afterXp(res, "Logged <b>" + esc(name) + "</b> — " + cal + " cal · " + protein + "g protein. Running total: " + res.totals.cal.toLocaleString() + " cal · " + res.totals.protein + "g protein.");
    blip();
  });

  /* ----- Progress ----- */
  function renderProgress() {
    const level = levelForXp(state.xpTotal);
    $("rankLine").textContent = "Level " + level + " · " + rankForLevel(level);
    $("xpLine").textContent = state.xpTotal + " / " + XP_CAP + " XP";
    $("xpMeter").style.width = Math.min(100, (state.xpTotal - (level - 1) * XP_PER_LEVEL) / XP_PER_LEVEL * 100) + "%";
    $("xpCapLine").textContent = "Progress toward the 200 XP cap: " + Math.round(state.xpTotal / XP_CAP * 100) + "%.";
    $("coinsLine").textContent = "💰 " + state.coins.toLocaleString() + " War Coins (display only in Stage 1 — the shop comes later).";
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
    afterXp(res, res.gained ? "Weigh-in logged: " + w + " lbs — weekly average gain, +2 XP." : "Weigh-in logged: " + w + " lbs.");
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
        if (!data || data.version !== 1 || !data.targets || !data.sessions || !data.foodDays) throw new Error("bad file");
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

  /* ----- Init + midnight rollover ----- */
  $("weightDate").value = dateKey(new Date());
  renderHeader(); renderDays(); renderLog(); renderFood(); renderProgress();
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
