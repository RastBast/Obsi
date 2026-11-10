/* Карточки собеседования MAX — локальный плагин Obsidian. FSRS: ts-fsrs (MIT). */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  CardsMaxPlugin: () => CardsMaxPlugin,
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/view.ts
var import_obsidian = require("obsidian");

// node_modules/ts-fsrs/dist/index.mjs
var u = ((r) => (r[r.New = 0] = "New", r[r.Learning = 1] = "Learning", r[r.Review = 2] = "Review", r[r.Relearning = 3] = "Relearning", r))(u || {});
var l = ((r) => (r[r.Manual = 0] = "Manual", r[r.Again = 1] = "Again", r[r.Hard = 2] = "Hard", r[r.Good = 3] = "Good", r[r.Easy = 4] = "Easy", r))(l || {});
var h = class _h {
  static card(t) {
    return { ...t, state: _h.state(t.state), due: _h.time(t.due), last_review: t.last_review ? _h.time(t.last_review) : void 0 };
  }
  static rating(t) {
    if (typeof t == "string") {
      const e = t.charAt(0).toUpperCase(), i = t.slice(1).toLowerCase(), a = l[`${e}${i}`];
      if (a === void 0) throw new Error(`Invalid rating:[${t}]`);
      return a;
    } else if (typeof t == "number") return t;
    throw new Error(`Invalid rating:[${t}]`);
  }
  static state(t) {
    if (typeof t == "string") {
      const e = t.charAt(0).toUpperCase(), i = t.slice(1).toLowerCase(), a = u[`${e}${i}`];
      if (a === void 0) throw new Error(`Invalid state:[${t}]`);
      return a;
    } else if (typeof t == "number") return t;
    throw new Error(`Invalid state:[${t}]`);
  }
  static time(t) {
    if (typeof t == "object" && t instanceof Date) return t;
    if (typeof t == "string") {
      const e = Date.parse(t);
      if (isNaN(e)) throw new Error(`Invalid date:[${t}]`);
      return new Date(e);
    } else if (typeof t == "number") return new Date(t);
    throw new Error(`Invalid date:[${t}]`);
  }
  static review_log(t) {
    return { ...t, due: _h.time(t.due), rating: _h.rating(t.rating), state: _h.state(t.state), review: _h.time(t.review) };
  }
};
var A = 0.9;
var L = 36500;
var D = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 46e-4, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
var G = false;
var k = true;
var M = (r) => {
  let t = D;
  return r?.w && (r.w.length === 19 ? t = r?.w : r.w.length === 17 && (t = r?.w.concat([0, 0]), t[4] = +(t[5] * 2 + t[4]).toFixed(8), t[5] = +(Math.log(t[5] * 3 + 1) / 3).toFixed(8), t[6] = +(t[6] + 0.5).toFixed(8), console.debug("[FSRS V5]auto fill w to 19 length"))), { request_retention: r?.request_retention || A, maximum_interval: r?.maximum_interval || L, w: t, enable_fuzz: r?.enable_fuzz ?? G, enable_short_term: r?.enable_short_term ?? k };
};
function w(r, t) {
  const e = { due: r ? h.time(r) : /* @__PURE__ */ new Date(), stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: 0, lapses: 0, state: u.New, last_review: void 0 };
  return t && typeof t == "function" ? t(e) : e;
}
Date.prototype.scheduler = function(r, t) {
  return N(this, r, t);
}, Date.prototype.diff = function(r, t) {
  return z(this, r, t);
}, Date.prototype.format = function() {
  return I(this);
}, Date.prototype.dueFormat = function(r, t, e) {
  return q(this, r, t, e);
};
function N(r, t, e) {
  return new Date(e ? _(r).getTime() + t * 24 * 60 * 60 * 1e3 : _(r).getTime() + t * 60 * 1e3);
}
function z(r, t, e) {
  if (!r || !t) throw new Error("Invalid date");
  const i = _(r).getTime() - _(t).getTime();
  let a = 0;
  switch (e) {
    case "days":
      a = Math.floor(i / (24 * 60 * 60 * 1e3));
      break;
    case "minutes":
      a = Math.floor(i / (60 * 1e3));
      break;
  }
  return a;
}
function I(r) {
  const t = _(r), e = t.getFullYear(), i = t.getMonth() + 1, a = t.getDate(), s = t.getHours(), n = t.getMinutes(), d = t.getSeconds();
  return `${e}-${g(i)}-${g(a)} ${g(s)}:${g(n)}:${g(d)}`;
}
function g(r) {
  return r < 10 ? `0${r}` : `${r}`;
}
var S = [60, 60, 24, 31, 12];
var E = ["second", "min", "hour", "day", "month", "year"];
function q(r, t, e, i = E) {
  r = _(r), t = _(t), i.length !== E.length && (i = E);
  let a = r.getTime() - t.getTime(), s;
  for (a /= 1e3, s = 0; s < S.length && !(a < S[s]); s++) a /= S[s];
  return `${Math.floor(a)}${e ? i[s] : ""}`;
}
function _(r) {
  return h.time(r);
}
var C = [l.Again, l.Hard, l.Good, l.Easy];
var W = [{ start: 2.5, end: 7, factor: 0.15 }, { start: 7, end: 20, factor: 0.1 }, { start: 20, end: 1 / 0, factor: 0.05 }];
function T(r, t, e) {
  let i = 1;
  for (const n of W) i += n.factor * Math.max(Math.min(r, n.end) - n.start, 0);
  r = Math.min(r, e);
  let a = Math.max(2, Math.round(r - i));
  const s = Math.min(Math.round(r + i), e);
  return r > t && (a = Math.max(a, t + 1)), a = Math.min(a, s), { min_ivl: a, max_ivl: s };
}
function p(r, t, e) {
  return Math.min(Math.max(r, t), e);
}
var J = class {
  constructor(t) {
    __publicField(this, "c");
    __publicField(this, "s0");
    __publicField(this, "s1");
    __publicField(this, "s2");
    const e = K();
    this.c = 1, this.s0 = e(" "), this.s1 = e(" "), this.s2 = e(" "), t == null && (t = +/* @__PURE__ */ new Date()), this.s0 -= e(t), this.s0 < 0 && (this.s0 += 1), this.s1 -= e(t), this.s1 < 0 && (this.s1 += 1), this.s2 -= e(t), this.s2 < 0 && (this.s2 += 1);
  }
  next() {
    const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
    return this.s0 = this.s1, this.s1 = this.s2, this.s2 = t - (this.c = t | 0), this.s2;
  }
  set state(t) {
    this.c = t.c, this.s0 = t.s0, this.s1 = t.s1, this.s2 = t.s2;
  }
  get state() {
    return { c: this.c, s0: this.s0, s1: this.s1, s2: this.s2 };
  }
};
function K() {
  let r = 4022871197;
  return function(t) {
    t = String(t);
    for (let e = 0; e < t.length; e++) {
      r += t.charCodeAt(e);
      let i = 0.02519603282416938 * r;
      r = i >>> 0, i -= r, i *= r, r = i >>> 0, i -= r, r += i * 4294967296;
    }
    return (r >>> 0) * 23283064365386963e-26;
  };
}
function Q(r) {
  const t = new J(r), e = () => t.next();
  return e.int32 = () => t.next() * 4294967296 | 0, e.double = () => e() + (e() * 2097152 | 0) * 11102230246251565e-32, e.state = () => t.state, e.importState = (i) => (t.state = i, e), e;
}
var R = -0.5;
var H = 19 / 81;
var U = class {
  constructor(t) {
    __publicField(this, "param");
    __publicField(this, "intervalModifier");
    __publicField(this, "_seed");
    this.param = new Proxy(M(t), this.params_handler_proxy()), this.intervalModifier = this.calculate_interval_modifier(this.param.request_retention);
  }
  get interval_modifier() {
    return this.intervalModifier;
  }
  set seed(t) {
    this._seed = t;
  }
  calculate_interval_modifier(t) {
    if (t <= 0 || t > 1) throw new Error("Requested retention rate should be in the range (0,1]");
    return +((Math.pow(t, 1 / R) - 1) / H).toFixed(8);
  }
  get parameters() {
    return this.param;
  }
  set parameters(t) {
    this.update_parameters(t);
  }
  params_handler_proxy() {
    const t = this;
    return { set: function(e, i, a) {
      return i === "request_retention" && Number.isFinite(a) && (t.intervalModifier = t.calculate_interval_modifier(Number(a))), Reflect.set(e, i, a), true;
    } };
  }
  update_parameters(t) {
    const e = M(t);
    for (const i in e) if (i in this.param) {
      const a = i;
      this.param[a] = e[a];
    }
  }
  init_stability(t) {
    return Math.max(this.param.w[t - 1], 0.1);
  }
  init_difficulty(t) {
    return this.constrain_difficulty(this.param.w[4] - Math.exp((t - 1) * this.param.w[5]) + 1);
  }
  apply_fuzz(t, e) {
    if (!this.param.enable_fuzz || t < 2.5) return Math.round(t);
    const i = Q(this._seed)(), { min_ivl: a, max_ivl: s } = T(t, e, this.param.maximum_interval);
    return Math.floor(i * (s - a + 1) + a);
  }
  next_interval(t, e) {
    const i = Math.min(Math.max(1, Math.round(t * this.intervalModifier)), this.param.maximum_interval);
    return this.apply_fuzz(i, e);
  }
  linear_damping(t, e) {
    return +(t * (10 - e) / 9).toFixed(8);
  }
  next_difficulty(t, e) {
    const i = -this.param.w[6] * (e - 3), a = t + this.linear_damping(i, t);
    return this.constrain_difficulty(this.mean_reversion(this.init_difficulty(l.Easy), a));
  }
  constrain_difficulty(t) {
    return Math.min(Math.max(+t.toFixed(8), 1), 10);
  }
  mean_reversion(t, e) {
    return +(this.param.w[7] * t + (1 - this.param.w[7]) * e).toFixed(8);
  }
  next_recall_stability(t, e, i, a) {
    const s = l.Hard === a ? this.param.w[15] : 1, n = l.Easy === a ? this.param.w[16] : 1;
    return +p(e * (1 + Math.exp(this.param.w[8]) * (11 - t) * Math.pow(e, -this.param.w[9]) * (Math.exp((1 - i) * this.param.w[10]) - 1) * s * n), 0.01, 36500).toFixed(8);
  }
  next_forget_stability(t, e, i) {
    return +p(this.param.w[11] * Math.pow(t, -this.param.w[12]) * (Math.pow(e + 1, this.param.w[13]) - 1) * Math.exp((1 - i) * this.param.w[14]), 0.01, 36500).toFixed(8);
  }
  next_short_term_stability(t, e) {
    return +p(t * Math.exp(this.param.w[17] * (e - 3 + this.param.w[18])), 0.01, 36500).toFixed(8);
  }
  forgetting_curve(t, e) {
    return +Math.pow(1 + H * t / e, R).toFixed(8);
  }
};
function $() {
  const r = this.review_time.getTime(), t = this.current.reps, e = this.current.difficulty * this.current.stability;
  return `${r}_${t}_${e}`;
}
var v = ((r) => (r.SCHEDULER = "Scheduler", r.SEED = "Seed", r))(v || {});
var F = class {
  constructor(t, e, i, a = { seed: $ }) {
    __publicField(this, "last");
    __publicField(this, "current");
    __publicField(this, "review_time");
    __publicField(this, "next", /* @__PURE__ */ new Map());
    __publicField(this, "algorithm");
    __publicField(this, "initSeedStrategy");
    this.algorithm = i, this.initSeedStrategy = a.seed.bind(this), this.last = h.card(t), this.current = h.card(t), this.review_time = h.time(e), this.init();
  }
  init() {
    const { state: t, last_review: e } = this.current;
    let i = 0;
    t !== u.New && e && (i = this.review_time.diff(e, "days")), this.current.last_review = this.review_time, this.current.elapsed_days = i, this.current.reps += 1, this.algorithm.seed = this.initSeedStrategy();
  }
  preview() {
    return { [l.Again]: this.review(l.Again), [l.Hard]: this.review(l.Hard), [l.Good]: this.review(l.Good), [l.Easy]: this.review(l.Easy), [Symbol.iterator]: this.previewIterator.bind(this) };
  }
  *previewIterator() {
    for (const t of C) yield this.review(t);
  }
  review(t) {
    const { state: e } = this.last;
    let i;
    switch (e) {
      case u.New:
        i = this.newState(t);
        break;
      case u.Learning:
      case u.Relearning:
        i = this.learningState(t);
        break;
      case u.Review:
        i = this.reviewState(t);
        break;
    }
    if (i) return i;
    throw new Error("Invalid grade");
  }
  buildLog(t) {
    const { last_review: e, due: i, elapsed_days: a } = this.last;
    return { rating: t, state: this.current.state, due: e || i, stability: this.current.stability, difficulty: this.current.difficulty, elapsed_days: this.current.elapsed_days, last_elapsed_days: a, scheduled_days: this.current.scheduled_days, review: this.review_time };
  }
};
var O = class extends F {
  newState(t) {
    const e = this.next.get(t);
    if (e) return e;
    const i = h.card(this.current);
    switch (i.difficulty = this.algorithm.init_difficulty(t), i.stability = this.algorithm.init_stability(t), t) {
      case l.Again:
        i.scheduled_days = 0, i.due = this.review_time.scheduler(1), i.state = u.Learning;
        break;
      case l.Hard:
        i.scheduled_days = 0, i.due = this.review_time.scheduler(5), i.state = u.Learning;
        break;
      case l.Good:
        i.scheduled_days = 0, i.due = this.review_time.scheduler(10), i.state = u.Learning;
        break;
      case l.Easy: {
        const s = this.algorithm.next_interval(i.stability, this.current.elapsed_days);
        i.scheduled_days = s, i.due = this.review_time.scheduler(s, true), i.state = u.Review;
        break;
      }
      default:
        throw new Error("Invalid grade");
    }
    const a = { card: i, log: this.buildLog(t) };
    return this.next.set(t, a), a;
  }
  learningState(t) {
    const e = this.next.get(t);
    if (e) return e;
    const { state: i, difficulty: a, stability: s } = this.last, n = h.card(this.current), d = this.current.elapsed_days;
    switch (n.difficulty = this.algorithm.next_difficulty(a, t), n.stability = this.algorithm.next_short_term_stability(s, t), t) {
      case l.Again: {
        n.scheduled_days = 0, n.due = this.review_time.scheduler(5, false), n.state = i;
        break;
      }
      case l.Hard: {
        n.scheduled_days = 0, n.due = this.review_time.scheduler(10), n.state = i;
        break;
      }
      case l.Good: {
        const c = this.algorithm.next_interval(n.stability, d);
        n.scheduled_days = c, n.due = this.review_time.scheduler(c, true), n.state = u.Review;
        break;
      }
      case l.Easy: {
        const c = this.algorithm.next_short_term_stability(s, l.Good), f = this.algorithm.next_interval(c, d), y = Math.max(this.algorithm.next_interval(n.stability, d), f + 1);
        n.scheduled_days = y, n.due = this.review_time.scheduler(y, true), n.state = u.Review;
        break;
      }
      default:
        throw new Error("Invalid grade");
    }
    const o = { card: n, log: this.buildLog(t) };
    return this.next.set(t, o), o;
  }
  reviewState(t) {
    const e = this.next.get(t);
    if (e) return e;
    const i = this.current.elapsed_days, { difficulty: a, stability: s } = this.last, n = this.algorithm.forgetting_curve(i, s), d = h.card(this.current), o = h.card(this.current), c = h.card(this.current), f = h.card(this.current);
    this.next_ds(d, o, c, f, a, s, n), this.next_interval(d, o, c, f, i), this.next_state(d, o, c, f), d.lapses += 1;
    const y = { card: d, log: this.buildLog(l.Again) }, x = { card: o, log: super.buildLog(l.Hard) }, m = { card: c, log: super.buildLog(l.Good) }, b = { card: f, log: super.buildLog(l.Easy) };
    return this.next.set(l.Again, y), this.next.set(l.Hard, x), this.next.set(l.Good, m), this.next.set(l.Easy, b), this.next.get(t);
  }
  next_ds(t, e, i, a, s, n, d) {
    t.difficulty = this.algorithm.next_difficulty(s, l.Again);
    const o = n / Math.exp(this.algorithm.parameters.w[17] * this.algorithm.parameters.w[18]);
    t.stability = Math.min(+o.toFixed(8), this.algorithm.next_forget_stability(s, n, d)), e.difficulty = this.algorithm.next_difficulty(s, l.Hard), e.stability = this.algorithm.next_recall_stability(s, n, d, l.Hard), i.difficulty = this.algorithm.next_difficulty(s, l.Good), i.stability = this.algorithm.next_recall_stability(s, n, d, l.Good), a.difficulty = this.algorithm.next_difficulty(s, l.Easy), a.stability = this.algorithm.next_recall_stability(s, n, d, l.Easy);
  }
  next_interval(t, e, i, a, s) {
    let n, d;
    n = this.algorithm.next_interval(e.stability, s), d = this.algorithm.next_interval(i.stability, s), n = Math.min(n, d), d = Math.max(d, n + 1);
    const o = Math.max(this.algorithm.next_interval(a.stability, s), d + 1);
    t.scheduled_days = 0, t.due = this.review_time.scheduler(5), e.scheduled_days = n, e.due = this.review_time.scheduler(n, true), i.scheduled_days = d, i.due = this.review_time.scheduler(d, true), a.scheduled_days = o, a.due = this.review_time.scheduler(o, true);
  }
  next_state(t, e, i, a) {
    t.state = u.Relearning, e.state = u.Review, i.state = u.Review, a.state = u.Review;
  }
};
var P = class extends F {
  newState(t) {
    const e = this.next.get(t);
    if (e) return e;
    this.current.scheduled_days = 0, this.current.elapsed_days = 0;
    const i = h.card(this.current), a = h.card(this.current), s = h.card(this.current), n = h.card(this.current);
    this.init_ds(i, a, s, n);
    const d = 0;
    return this.next_interval(i, a, s, n, d), this.next_state(i, a, s, n), this.update_next(i, a, s, n), this.next.get(t);
  }
  init_ds(t, e, i, a) {
    t.difficulty = this.algorithm.init_difficulty(l.Again), t.stability = this.algorithm.init_stability(l.Again), e.difficulty = this.algorithm.init_difficulty(l.Hard), e.stability = this.algorithm.init_stability(l.Hard), i.difficulty = this.algorithm.init_difficulty(l.Good), i.stability = this.algorithm.init_stability(l.Good), a.difficulty = this.algorithm.init_difficulty(l.Easy), a.stability = this.algorithm.init_stability(l.Easy);
  }
  learningState(t) {
    return this.reviewState(t);
  }
  reviewState(t) {
    const e = this.next.get(t);
    if (e) return e;
    const i = this.current.elapsed_days, { difficulty: a, stability: s } = this.last, n = this.algorithm.forgetting_curve(i, s), d = h.card(this.current), o = h.card(this.current), c = h.card(this.current), f = h.card(this.current);
    return this.next_ds(d, o, c, f, a, s, n), this.next_interval(d, o, c, f, i), this.next_state(d, o, c, f), d.lapses += 1, this.update_next(d, o, c, f), this.next.get(t);
  }
  next_ds(t, e, i, a, s, n, d) {
    t.difficulty = this.algorithm.next_difficulty(s, l.Again), t.stability = Math.min(n, this.algorithm.next_forget_stability(s, n, d)), e.difficulty = this.algorithm.next_difficulty(s, l.Hard), e.stability = this.algorithm.next_recall_stability(s, n, d, l.Hard), i.difficulty = this.algorithm.next_difficulty(s, l.Good), i.stability = this.algorithm.next_recall_stability(s, n, d, l.Good), a.difficulty = this.algorithm.next_difficulty(s, l.Easy), a.stability = this.algorithm.next_recall_stability(s, n, d, l.Easy);
  }
  next_interval(t, e, i, a, s) {
    let n, d, o, c;
    n = this.algorithm.next_interval(t.stability, s), d = this.algorithm.next_interval(e.stability, s), o = this.algorithm.next_interval(i.stability, s), c = this.algorithm.next_interval(a.stability, s), n = Math.min(n, d), d = Math.max(d, n + 1), o = Math.max(o, d + 1), c = Math.max(c, o + 1), t.scheduled_days = n, t.due = this.review_time.scheduler(n, true), e.scheduled_days = d, e.due = this.review_time.scheduler(d, true), i.scheduled_days = o, i.due = this.review_time.scheduler(o, true), a.scheduled_days = c, a.due = this.review_time.scheduler(c, true);
  }
  next_state(t, e, i, a) {
    t.state = u.Review, e.state = u.Review, i.state = u.Review, a.state = u.Review;
  }
  update_next(t, e, i, a) {
    const s = { card: t, log: this.buildLog(l.Again) }, n = { card: e, log: super.buildLog(l.Hard) }, d = { card: i, log: super.buildLog(l.Good) }, o = { card: a, log: super.buildLog(l.Easy) };
    this.next.set(l.Again, s), this.next.set(l.Hard, n), this.next.set(l.Good, d), this.next.set(l.Easy, o);
  }
};
var Z = class {
  constructor(t) {
    __publicField(this, "fsrs");
    this.fsrs = t;
  }
  replay(t, e, i) {
    return this.fsrs.next(t, e, i);
  }
  handleManualRating(t, e, i, a, s, n, d) {
    if (typeof e > "u") throw new Error("reschedule: state is required for manual rating");
    let o, c;
    if (e === u.New) o = { rating: l.Manual, state: e, due: d ?? i, stability: t.stability, difficulty: t.difficulty, elapsed_days: a, last_elapsed_days: t.elapsed_days, scheduled_days: t.scheduled_days, review: i }, c = w(i), c.last_review = i;
    else {
      if (typeof d > "u") throw new Error("reschedule: due is required for manual rating");
      const f = d.diff(i, "days");
      o = { rating: l.Manual, state: t.state, due: t.last_review || t.due, stability: t.stability, difficulty: t.difficulty, elapsed_days: a, last_elapsed_days: t.elapsed_days, scheduled_days: t.scheduled_days, review: i }, c = { ...t, state: e, due: d, last_review: i, stability: s || t.stability, difficulty: n || t.difficulty, elapsed_days: a, scheduled_days: f, reps: t.reps + 1 };
    }
    return { card: c, log: o };
  }
  reschedule(t, e) {
    const i = [];
    let a = w(t.due);
    for (const s of e) {
      let n;
      if (s.review = h.time(s.review), s.rating === l.Manual) {
        let d = 0;
        a.state !== u.New && a.last_review && (d = s.review.diff(a.last_review, "days")), n = this.handleManualRating(a, s.state, s.review, d, s.stability, s.difficulty, s.due ? h.time(s.due) : void 0);
      } else n = this.replay(a, s.review, s.rating);
      i.push(n), a = n.card;
    }
    return i;
  }
  calculateManualRecord(t, e, i, a) {
    if (!i) return null;
    const { card: s, log: n } = i, d = h.card(t);
    return d.due.getTime() === s.due.getTime() ? null : (d.scheduled_days = s.due.diff(d.due, "days"), this.handleManualRating(d, s.state, h.time(e), n.elapsed_days, a ? s.stability : void 0, a ? s.difficulty : void 0, s.due));
  }
};
var V = class extends U {
  constructor(t) {
    super(t);
    __publicField(this, "strategyHandler", /* @__PURE__ */ new Map());
    __publicField(this, "Scheduler");
    const { enable_short_term: e } = this.parameters;
    this.Scheduler = e ? O : P;
  }
  params_handler_proxy() {
    const t = this;
    return { set: function(e, i, a) {
      return i === "request_retention" && Number.isFinite(a) ? t.intervalModifier = t.calculate_interval_modifier(Number(a)) : i === "enable_short_term" && (t.Scheduler = a === true ? O : P), Reflect.set(e, i, a), true;
    } };
  }
  useStrategy(t, e) {
    return this.strategyHandler.set(t, e), this;
  }
  clearStrategy(t) {
    return t ? this.strategyHandler.delete(t) : this.strategyHandler.clear(), this;
  }
  getScheduler(t, e) {
    const i = this.strategyHandler.get(v.SEED), a = this.strategyHandler.get(v.SCHEDULER) || this.Scheduler, s = i || $;
    return new a(t, e, this, { seed: s });
  }
  repeat(t, e, i) {
    const a = this.getScheduler(t, e).preview();
    return i && typeof i == "function" ? i(a) : a;
  }
  next(t, e, i, a) {
    const s = this.getScheduler(t, e), n = h.rating(i);
    if (n === l.Manual) throw new Error("Cannot review a manual rating");
    const d = s.review(n);
    return a && typeof a == "function" ? a(d) : d;
  }
  get_retrievability(t, e, i = true) {
    const a = h.card(t);
    e = e ? h.time(e) : /* @__PURE__ */ new Date();
    const s = a.state !== u.New ? Math.max(e.diff(a.last_review, "days"), 0) : 0, n = a.state !== u.New ? this.forgetting_curve(s, +a.stability.toFixed(8)) : 0;
    return i ? `${(n * 100).toFixed(2)}%` : n;
  }
  rollback(t, e, i) {
    const a = h.card(t), s = h.review_log(e);
    if (s.rating === l.Manual) throw new Error("Cannot rollback a manual rating");
    let n, d, o;
    switch (s.state) {
      case u.New:
        n = s.due, d = void 0, o = 0;
        break;
      case u.Learning:
      case u.Relearning:
      case u.Review:
        n = s.review, d = s.due, o = a.lapses - (s.rating === l.Again && s.state === u.Review ? 1 : 0);
        break;
    }
    const c = { ...a, due: n, stability: s.stability, difficulty: s.difficulty, elapsed_days: s.last_elapsed_days, scheduled_days: s.scheduled_days, reps: Math.max(0, a.reps - 1), lapses: Math.max(0, o), state: s.state, last_review: d };
    return i && typeof i == "function" ? i(c) : c;
  }
  forget(t, e, i = false, a) {
    const s = h.card(t);
    e = h.time(e);
    const n = s.state === u.New ? 0 : e.diff(s.last_review, "days"), d = { rating: l.Manual, state: s.state, due: s.due, stability: s.stability, difficulty: s.difficulty, elapsed_days: 0, last_elapsed_days: s.elapsed_days, scheduled_days: n, review: e }, o = { card: { ...s, due: e, stability: 0, difficulty: 0, elapsed_days: 0, scheduled_days: 0, reps: i ? 0 : s.reps, lapses: i ? 0 : s.lapses, state: u.New, last_review: s.last_review }, log: d };
    return a && typeof a == "function" ? a(o) : o;
  }
  reschedule(t, e = [], i = {}) {
    const { recordLogHandler: a, reviewsOrderBy: s, skipManual: n = true, now: d = /* @__PURE__ */ new Date(), update_memory_state: o = false } = i;
    s && typeof s == "function" && e.sort(s), n && (e = e.filter((b) => b.rating !== l.Manual));
    const c = new Z(this), f = c.reschedule(i.first_card || w(), e), y = f.length, x = h.card(t), m = c.calculateManualRecord(x, d, y ? f[y - 1] : void 0, o);
    return a && typeof a == "function" ? { collections: f.map(a), reschedule_item: m ? a(m) : null } : { collections: f, reschedule_item: m };
  }
};
var tt = (r) => new V(r || {});

// src/types.ts
var VIEW_TYPE = "interview-cards-max-view";
var DEFAULT_CARDS_PATH = "Golang-Middle-Interview/Cards";
var HISTORY_LIMIT = 240;
var FEED_IMPRESSION_LIMIT = 6e3;
var DEFAULT_FEED_CYCLE_SIZE = 20;
var DECK_ORDER = [
  "Go",
  "Docker",
  "Kubernetes",
  "\u0421\u0435\u0442\u0438",
  "\u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B",
  "\u0411\u0414",
  "\u0420\u0430\u043D\u0442\u0430\u0439\u043C",
  "Redis",
  "Kafka"
];
var DECK_META = {
  Go: { icon: "braces", emoji: "\u{1F439}", color: "var(--color-cyan)" },
  Docker: { icon: "box", emoji: "\u{1F433}", color: "var(--color-blue)" },
  Kubernetes: { icon: "hexagon", emoji: "\u2638\uFE0F", color: "var(--color-purple)" },
  \u0421\u0435\u0442\u0438: { icon: "network", emoji: "\u{1F310}", color: "var(--color-green)" },
  \u0410\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u044B: { icon: "git-branch", emoji: "\u{1F9EE}", color: "var(--color-orange)" },
  \u0411\u0414: { icon: "database", emoji: "\u{1F5C4}\uFE0F", color: "var(--color-yellow)" },
  \u0420\u0430\u043D\u0442\u0430\u0439\u043C: { icon: "cpu", emoji: "\u2699\uFE0F", color: "var(--color-red)" },
  Redis: { icon: "zap", emoji: "\u26A1", color: "var(--color-pink)" },
  Kafka: { icon: "radio", emoji: "\u{1F4E1}", color: "var(--color-blue)" }
};
var DEFAULT_SETTINGS = {
  cardsPath: DEFAULT_CARDS_PATH,
  newPerDay: 20,
  requestRetention: 0.9,
  maximumInterval: 365,
  enableFuzz: true,
  enableShortTerm: true,
  showFullNoteOnDontKnow: true,
  countAnswerAfterRevealAsAgain: true,
  autoNext: true,
  groupByDeck: true,
  showStreakInStatusBar: true,
  feedCycleSize: DEFAULT_FEED_CYCLE_SIZE,
  feedShuffle: true
};
function emptyProgress(now) {
  return {
    due: now,
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: u.New,
    last_review: null,
    firstReviewed: null,
    reviewCount: 0,
    lastRating: null,
    effectiveRating: null,
    lastAnswer: "",
    answeredAfterReveal: false,
    dontKnow: false,
    typedAfterRevealCount: 0,
    dontKnowCount: 0
  };
}
function defaultFeed() {
  return { cycle: 1, index: 0, order: [], deck: null, impressions: {} };
}
function defaultData() {
  return {
    version: 2,
    settings: { ...DEFAULT_SETTINGS },
    cards: {},
    streak: { current: 0, best: 0, lastDate: null },
    daily: {},
    history: [],
    selectedDeck: null,
    selectedFilter: "due",
    feed: defaultFeed()
  };
}
function clampNumber(value, fallback, min, max) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
function normalizeProgress(raw, now) {
  const base = emptyProgress(now);
  if (!raw || typeof raw !== "object") return base;
  const p2 = raw;
  const due = typeof p2.due === "number" && Number.isFinite(p2.due) ? p2.due : now;
  return {
    ...base,
    ...p2,
    due,
    stability: clampNumber(p2.stability, 0, 0, 36500),
    difficulty: clampNumber(p2.difficulty, 0, 0, 10),
    elapsed_days: clampNumber(p2.elapsed_days, 0, 0, 36500),
    scheduled_days: clampNumber(p2.scheduled_days, 0, 0, 36500),
    reps: clampNumber(p2.reps, 0, 0, 1e6),
    lapses: clampNumber(p2.lapses, 0, 0, 1e6),
    state: typeof p2.state === "number" ? p2.state : u.New,
    last_review: typeof p2.last_review === "number" ? p2.last_review : null,
    firstReviewed: typeof p2.firstReviewed === "number" ? p2.firstReviewed : null,
    reviewCount: clampNumber(p2.reviewCount, 0, 0, 1e6),
    lastRating: typeof p2.lastRating === "number" ? p2.lastRating : null,
    effectiveRating: typeof p2.effectiveRating === "number" ? p2.effectiveRating : null,
    lastAnswer: typeof p2.lastAnswer === "string" ? p2.lastAnswer : "",
    answeredAfterReveal: Boolean(p2.answeredAfterReveal),
    dontKnow: Boolean(p2.dontKnow),
    typedAfterRevealCount: clampNumber(p2.typedAfterRevealCount, 0, 0, 1e6),
    dontKnowCount: clampNumber(p2.dontKnowCount, 0, 0, 1e6)
  };
}
function normalizeDaily(raw) {
  const base = {
    reviews: 0,
    newCards: 0,
    dontKnow: 0,
    afterReveal: 0,
    feedLikes: 0,
    feedComments: 0,
    feedSkips: 0
  };
  if (!raw || typeof raw !== "object") return base;
  const d = raw;
  return {
    reviews: clampNumber(d.reviews, 0, 0, 1e6),
    newCards: clampNumber(d.newCards, 0, 0, 1e6),
    dontKnow: clampNumber(d.dontKnow, 0, 0, 1e6),
    afterReveal: clampNumber(d.afterReveal, 0, 0, 1e6),
    feedLikes: clampNumber(d.feedLikes, 0, 0, 1e6),
    feedComments: clampNumber(d.feedComments, 0, 0, 1e6),
    feedSkips: clampNumber(d.feedSkips, 0, 0, 1e6)
  };
}
function normalizeFeedHintKind(raw) {
  return raw === "answer" || raw === "dont-know" ? raw : null;
}
function normalizeFeedOutcome(raw) {
  return raw === "skipped" || raw === "hint-only" || raw === "answered-after-reveal" || raw === "solved" ? raw : "pending";
}
function normalizeFeedComment(raw) {
  if (!raw || typeof raw !== "object") return null;
  const c = raw;
  const text = typeof c.text === "string" ? c.text.trim() : "";
  if (!text) return null;
  return {
    text,
    at: clampNumber(c.at, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    cycle: clampNumber(c.cycle, 1, 1, 1e6),
    outcome: normalizeFeedOutcome(c.outcome),
    answered: Boolean(c.answered),
    answeredBeforeReveal: Boolean(c.answeredBeforeReveal),
    usedHint: Boolean(c.usedHint),
    hintKind: normalizeFeedHintKind(c.hintKind),
    rating: typeof c.rating === "number" ? c.rating : null,
    effectiveRating: typeof c.effectiveRating === "number" ? c.effectiveRating : null,
    answeredAfterReveal: Boolean(c.answeredAfterReveal),
    skipped: Boolean(c.skipped)
  };
}
function normalizeFeedImpression(raw) {
  if (!raw || typeof raw !== "object") return null;
  const p2 = raw;
  const cardId = typeof p2.cardId === "string" ? p2.cardId : "";
  if (!cardId) return null;
  const cycle = clampNumber(p2.cycle, 1, 1, 1e6);
  const key = `${cycle}:${cardId}`;
  return {
    key,
    cardId,
    deck: typeof p2.deck === "string" ? p2.deck : "",
    title: typeof p2.title === "string" ? p2.title : cardId,
    cycle,
    at: clampNumber(p2.at, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    liked: Boolean(p2.liked),
    comment: normalizeFeedComment(p2.comment),
    outcome: normalizeFeedOutcome(p2.outcome),
    answered: Boolean(p2.answered),
    answeredBeforeReveal: Boolean(p2.answeredBeforeReveal),
    usedHint: Boolean(p2.usedHint),
    hintKind: normalizeFeedHintKind(p2.hintKind),
    rating: typeof p2.rating === "number" ? p2.rating : null,
    effectiveRating: typeof p2.effectiveRating === "number" ? p2.effectiveRating : null,
    answeredAfterReveal: Boolean(p2.answeredAfterReveal),
    skipped: Boolean(p2.skipped)
  };
}
function normalizeFeed(raw) {
  const base = defaultFeed();
  if (!raw || typeof raw !== "object") return base;
  const f = raw;
  const order = Array.isArray(f.order) ? f.order.filter((x) => typeof x === "string") : [];
  const impressions = {};
  if (f.impressions && typeof f.impressions === "object") {
    for (const value of Object.values(f.impressions)) {
      const normalized = normalizeFeedImpression(value);
      if (normalized) impressions[normalized.key] = normalized;
    }
    const keys = Object.keys(impressions);
    if (keys.length > FEED_IMPRESSION_LIMIT) {
      keys.sort((a, b) => impressions[b].at - impressions[a].at).slice(FEED_IMPRESSION_LIMIT).forEach((key) => delete impressions[key]);
    }
  }
  return {
    cycle: clampNumber(f.cycle, 1, 1, 1e6),
    index: clampNumber(f.index, 0, 0, Math.max(0, order.length - 1)),
    order,
    deck: typeof f.deck === "string" ? f.deck : null,
    impressions
  };
}
function normalizeData(raw) {
  const base = defaultData();
  if (!raw || typeof raw !== "object") return base;
  const r = raw;
  const now = Date.now();
  const s = r.settings ?? {};
  const settings = {
    ...base.settings,
    ...s,
    cardsPath: typeof s.cardsPath === "string" && s.cardsPath.trim() ? s.cardsPath.trim() : DEFAULT_CARDS_PATH,
    newPerDay: clampNumber(s.newPerDay, base.settings.newPerDay, 0, 1e3),
    requestRetention: clampNumber(s.requestRetention, base.settings.requestRetention, 0.7, 0.99),
    maximumInterval: clampNumber(s.maximumInterval, base.settings.maximumInterval, 7, 36500),
    enableFuzz: typeof s.enableFuzz === "boolean" ? s.enableFuzz : base.settings.enableFuzz,
    enableShortTerm: typeof s.enableShortTerm === "boolean" ? s.enableShortTerm : base.settings.enableShortTerm,
    showFullNoteOnDontKnow: typeof s.showFullNoteOnDontKnow === "boolean" ? s.showFullNoteOnDontKnow : base.settings.showFullNoteOnDontKnow,
    countAnswerAfterRevealAsAgain: typeof s.countAnswerAfterRevealAsAgain === "boolean" ? s.countAnswerAfterRevealAsAgain : base.settings.countAnswerAfterRevealAsAgain,
    autoNext: typeof s.autoNext === "boolean" ? s.autoNext : base.settings.autoNext,
    groupByDeck: typeof s.groupByDeck === "boolean" ? s.groupByDeck : base.settings.groupByDeck,
    showStreakInStatusBar: typeof s.showStreakInStatusBar === "boolean" ? s.showStreakInStatusBar : base.settings.showStreakInStatusBar,
    feedCycleSize: clampNumber(s.feedCycleSize, base.settings.feedCycleSize, 0, 1e3),
    feedShuffle: typeof s.feedShuffle === "boolean" ? s.feedShuffle : base.settings.feedShuffle
  };
  const cards = {};
  if (r.cards && typeof r.cards === "object") {
    for (const [id, p2] of Object.entries(r.cards)) {
      cards[id] = normalizeProgress(p2, now);
    }
  }
  const daily = {};
  if (r.daily && typeof r.daily === "object") {
    for (const [date, d] of Object.entries(r.daily)) daily[date] = normalizeDaily(d);
  }
  const streakRaw = r.streak ?? {};
  const streak = {
    current: clampNumber(streakRaw.current, 0, 0, 1e5),
    best: clampNumber(streakRaw.best, 0, 0, 1e5),
    lastDate: typeof streakRaw.lastDate === "string" ? streakRaw.lastDate : null
  };
  const history = Array.isArray(r.history) ? r.history.filter((x) => Boolean(x) && typeof x === "object").slice(0, HISTORY_LIMIT) : [];
  const selectedFilter = r.selectedFilter === "due" || r.selectedFilter === "new" || r.selectedFilter === "passed" || r.selectedFilter === "mastered" || r.selectedFilter === "all" ? r.selectedFilter : "due";
  return {
    version: 2,
    settings,
    cards,
    streak,
    daily,
    history,
    selectedDeck: typeof r.selectedDeck === "string" && DECK_ORDER.includes(r.selectedDeck) ? r.selectedDeck : null,
    selectedFilter,
    feed: normalizeFeed(r.feed)
  };
}
function deckRank(deck) {
  const i = DECK_ORDER.indexOf(deck);
  return i === -1 ? DECK_ORDER.length + 1 : i;
}

// src/cards.ts
function stripFrontmatter(raw) {
  return raw.replace(/^\uFEFF/, "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}
function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
  return [];
}
function questionKeyOf(question) {
  return question.replace(/\s+/g, " ").trim().toLocaleLowerCase("ru");
}
function deckFromPath(file, rootPath) {
  const prefix = `${rootPath.replace(/^\/+|\/+$/g, "")}/`;
  const rel = file.path.startsWith(prefix) ? file.path.slice(prefix.length) : file.path;
  const folder = rel.split("/")[0] ?? "";
  return DECK_ORDER.includes(folder) ? folder : folder || "\u0411\u0435\u0437 \u043A\u043E\u043B\u043E\u0434\u044B";
}
function orderFromFile(file) {
  const m = file.basename.match(/^(\d+)/);
  return m ? Number(m[1]) : 999999;
}
function parseSections(body) {
  const lines = body.split(/\r?\n/);
  let title = "";
  let current = null;
  let inFence = false;
  const buckets = {};
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      if (current) buckets[current].push(line);
      continue;
    }
    if (!inFence && !title && line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }
    if (!inFence) {
      const m = line.match(/^##\s+(.+?)\s*$/);
      if (m) {
        current = m[1].trim();
        buckets[current] = [];
        continue;
      }
    }
    if (current) buckets[current].push(line);
  }
  const sections = {};
  for (const [name, lines2] of Object.entries(buckets)) {
    sections[name] = lines2.join("\n").trim();
  }
  return { title, sections };
}
function pickSection(sections, exact, prefix = "") {
  if (sections[exact] !== void 0) return sections[exact];
  if (prefix) {
    const found = Object.entries(sections).find(([name]) => name.startsWith(prefix));
    if (found) return found[1];
  }
  return "";
}
function buildExplanationMarkdown(card) {
  const parts = [];
  const add = (heading, body) => {
    if (body.trim()) parts.push(`## ${heading}

${body.trim()}`);
  };
  add("\u041A\u0440\u0430\u0442\u043A\u0438\u0439 \u043E\u0442\u0432\u0435\u0442", card.shortAnswer);
  add("\u0420\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u043C\u0438\u0434\u043B\u0430", card.middle);
  add("\u0420\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u0441\u0435\u043D\u044C\u043E\u0440\u0430: \u0432\u0441\u0435 \u0442\u043E\u043D\u043A\u043E\u0441\u0442\u0438", card.senior);
  add("\u0415\u0441\u043B\u0438 \u0437\u0430\u0431\u044B\u043B / \u041F\u0440\u043E\u0441\u0442\u044B\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438", card.simple);
  return parts.join("\n\n---\n\n");
}
async function parseCard(app, file, rootPath) {
  const raw = await app.vault.cachedRead(file);
  const fullMarkdown = stripFrontmatter(raw);
  const parsed = parseSections(fullMarkdown);
  const cache = app.metadataCache.getFileCache(file);
  const fm = cache?.frontmatter ?? {};
  const declaredDeck = typeof fm.deck === "string" ? fm.deck.trim() : "";
  const deck = declaredDeck && DECK_ORDER.includes(declaredDeck) ? declaredDeck : deckFromPath(file, rootPath);
  const title = parsed.title || file.basename;
  const question = pickSection(parsed.sections, "\u0412\u043E\u043F\u0440\u043E\u0441") || title;
  const shortAnswer = pickSection(parsed.sections, "\u041A\u0440\u0430\u0442\u043A\u0438\u0439 \u043E\u0442\u0432\u0435\u0442");
  const middle = pickSection(parsed.sections, "\u0420\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u043C\u0438\u0434\u043B\u0430");
  const senior = pickSection(
    parsed.sections,
    "\u0420\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u0441\u0435\u043D\u044C\u043E\u0440\u0430: \u0432\u0441\u0435 \u0442\u043E\u043D\u043A\u043E\u0441\u0442\u0438",
    "\u0420\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u0441\u0435\u043D\u044C\u043E\u0440\u0430"
  );
  const simple = pickSection(parsed.sections, "\u0415\u0441\u043B\u0438 \u0437\u0430\u0431\u044B\u043B / \u041F\u0440\u043E\u0441\u0442\u044B\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438");
  const tags = normalizeTags(fm.tags);
  const topic = typeof fm.topic === "string" ? fm.topic.trim() : "";
  return {
    id: file.path,
    path: file.path,
    file,
    title,
    question,
    questionKey: questionKeyOf(question),
    shortAnswer,
    middle,
    senior,
    simple,
    fullMarkdown,
    deck,
    tags,
    topic,
    order: orderFromFile(file)
  };
}
async function loadCards(app, rootPath) {
  const prefix = `${rootPath.replace(/^\/+|\/+$/g, "")}/`;
  const files = app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(prefix));
  const cards = [];
  for (const file of files) {
    try {
      cards.push(await parseCard(app, file, rootPath));
    } catch (error) {
      console.error(`[\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX] \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C ${file.path}`, error);
    }
  }
  cards.sort((a, b) => {
    const dr = deckRank(a.deck) - deckRank(b.deck);
    if (dr !== 0) return dr;
    if (a.order !== b.order) return a.order - b.order;
    return a.path.localeCompare(b.path, "ru");
  });
  return cards;
}

// src/format.ts
var RATINGS = [
  { value: 1, ru: "\u0421\u043D\u043E\u0432\u0430", en: "Again", desc: "\u041D\u0435 \u0432\u0441\u043F\u043E\u043C\u043D\u0438\u043B", cls: "again", key: "1" },
  { value: 2, ru: "\u0422\u0440\u0443\u0434\u043D\u043E", en: "Hard", desc: "\u0421 \u0431\u043E\u043B\u044C\u0448\u0438\u043C \u0442\u0440\u0443\u0434\u043E\u043C", cls: "hard", key: "2" },
  { value: 3, ru: "\u0425\u043E\u0440\u043E\u0448\u043E", en: "Good", desc: "\u0412\u0441\u043F\u043E\u043C\u043D\u0438\u043B", cls: "good", key: "3" },
  { value: 4, ru: "\u041B\u0435\u0433\u043A\u043E", en: "Easy", desc: "\u0411\u0435\u0437 \u0443\u0441\u0438\u043B\u0438\u0439", cls: "easy", key: "4" }
];
var FILTERS = [
  { key: "due", label: "\u041A \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044E", hint: "Due + \u043D\u043E\u0432\u044B\u0435 \u043F\u043E \u043B\u0438\u043C\u0438\u0442\u0443" },
  { key: "new", label: "\u041D\u0435 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0435", hint: "\u0415\u0449\u0451 \u043D\u0438 \u0440\u0430\u0437\u0443 \u043D\u0435 \u043E\u0446\u0435\u043D\u0435\u043D\u044B" },
  { key: "passed", label: "\u041F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0435", hint: "\u0415\u0441\u0442\u044C \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0430 \u043E\u0446\u0435\u043D\u043A\u0430" },
  { key: "mastered", label: "\u041E\u0441\u0432\u043E\u0435\u043D\u043D\u044B\u0435", hint: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B" },
  { key: "all", label: "\u0412\u0441\u0435", hint: "\u0412\u0441\u0435 220 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A" }
];
var dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
var timeFmt = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
var dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
});
function plural(n, one, few, many) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs >= 11 && abs <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}
function cardsWord(n) {
  return `${n} ${plural(n, "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430", "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", "\u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A")}`;
}
function daysWord(n) {
  return `${n} ${plural(n, "\u0434\u0435\u043D\u044C", "\u0434\u043D\u044F", "\u0434\u043D\u0435\u0439")}`;
}
function reviewsWord(n) {
  return `${n} ${plural(n, "\u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435", "\u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F", "\u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0439")}`;
}
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dayOffsetKey(now, offset) {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return dateKey(d);
}
function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function formatDateTime(ts) {
  return dateTimeFmt.format(new Date(ts));
}
function formatDue(due, now) {
  if (!Number.isFinite(due) || due <= now) return "\u0421\u0435\u0439\u0447\u0430\u0441";
  const d = new Date(due);
  const n = new Date(now);
  const dayDiff = Math.round((startOfDay(due) - startOfDay(now)) / 864e5);
  if (dayDiff === 0) return `\u0421\u0435\u0433\u043E\u0434\u043D\u044F, ${timeFmt.format(d)}`;
  if (dayDiff === 1) return `\u0417\u0430\u0432\u0442\u0440\u0430, ${timeFmt.format(d)}`;
  if (dayDiff > 1 && dayDiff < 7) return `\u0427\u0435\u0440\u0435\u0437 ${daysWord(dayDiff)}`;
  return dateFmt.format(d);
}
function ratingLabel(value) {
  const r = RATINGS.find((x) => x.value === value);
  return r ? `${r.ru} / ${r.en}` : `\u041E\u0446\u0435\u043D\u043A\u0430 ${value}`;
}
function percent(part, total) {
  if (total <= 0) return 0;
  return Math.round(part / total * 100);
}
function truncate(text, max = 90) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}\u2026`;
}
function feedHintLabel(kind) {
  if (kind === "dont-know") return "\u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442";
  if (kind === "answer") return "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442";
  return "\u0411\u0435\u0437 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438";
}
function feedOutcomeLabel(outcome) {
  switch (outcome) {
    case "skipped":
      return "\u0421\u0432\u0430\u0439\u043F\u043D\u0443\u0442";
    case "hint-only":
      return "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430";
    case "answered-after-reveal":
      return "\u041E\u0442\u0432\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430";
    case "solved":
      return "\u0420\u0435\u0448\u0435\u043D\u0430";
    case "pending":
    default:
      return "\u0415\u0449\u0451 \u043D\u0435 \u0440\u0435\u0448\u0430\u043B";
  }
}
function feedAttemptBadges(comment) {
  const badges = [`\u041F\u0440\u043E\u0445\u043E\u0434 ${comment.cycle}`, feedOutcomeLabel(comment.outcome)];
  if (comment.answeredBeforeReveal) badges.push("\u041E\u0442\u0432\u0435\u0442\u0438\u043B \u0441\u0430\u043C");
  else if (comment.answered) badges.push("\u041E\u0442\u0432\u0435\u0442 \u0432\u0432\u0435\u0434\u0451\u043D \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430");
  else badges.push("\u0411\u0435\u0437 \u043E\u0442\u0432\u0435\u0442\u0430");
  if (comment.usedHint) badges.push("\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430");
  if (comment.hintKind) badges.push(`\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430: ${feedHintLabel(comment.hintKind)}`);
  if (comment.rating !== null) badges.push(`\u041E\u0446\u0435\u043D\u043A\u0430: ${ratingLabel(comment.rating)}`);
  if (comment.effectiveRating !== null && comment.effectiveRating !== comment.rating) {
    badges.push(`FSRS: ${ratingLabel(comment.effectiveRating)}`);
  }
  if (comment.answeredAfterReveal) badges.push("\u041E\u0442\u0432\u0435\u0442 \u0438\u0437\u043C\u0435\u043D\u0451\u043D \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430");
  if (comment.skipped) badges.push("\u041D\u0435 \u0440\u0435\u0448\u0430\u043B / \u0441\u0432\u0430\u0439\u043F");
  return badges;
}

// src/status.ts
function isPassed(progress) {
  return progress.reps > 0;
}
function isDue(progress, now) {
  return progress.reps > 0 && progress.due <= now;
}
function isMastered(progress, now) {
  const grade = progress.effectiveRating ?? progress.lastRating ?? 0;
  return progress.reps >= 2 && grade >= 3 && progress.stability >= 7 && progress.due > now;
}
function statusFor(progress, now) {
  const flags = [];
  if (progress.answeredAfterReveal) flags.push("\u041E\u0442\u0432\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430");
  if (progress.dontKnow) flags.push("\u041D\u0435 \u0437\u043D\u0430\u044E");
  if (progress.lapses > 0) flags.push(`\u041F\u0440\u043E\u0432\u0430\u043B\u043E\u0432: ${progress.lapses}`);
  if (!isPassed(progress)) {
    return { key: "new", label: "\u041D\u0435 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u0430", cls: "is-new", dueLabel: "\u041D\u043E\u0432\u0430\u044F", flags };
  }
  if (isDue(progress, now)) {
    return { key: "due", label: "\u041A \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044E", cls: "is-due", dueLabel: "\u0421\u0435\u0439\u0447\u0430\u0441", flags };
  }
  if (isMastered(progress, now)) {
    return {
      key: "mastered",
      label: "\u041E\u0441\u0432\u043E\u0435\u043D\u0430",
      cls: "is-mastered",
      dueLabel: formatDue(progress.due, now),
      flags
    };
  }
  return {
    key: "passed",
    label: "\u041F\u0440\u043E\u0439\u0434\u0435\u043D\u0430",
    cls: "is-passed",
    dueLabel: formatDue(progress.due, now),
    flags
  };
}

// src/view.ts
function setIconWithFallback(el, icon, fallback) {
  (0, import_obsidian.setIcon)(el, icon);
  if (!el.querySelector("svg")) el.textContent = fallback;
}
var CardsMaxView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.mode = "dashboard";
    this.review = null;
    this.answerBadge = null;
    this.schedulerWarning = null;
    this.answerTextarea = null;
    this.feedReturn = false;
    this.feedSolveCycle = 1;
    this.feedCommentsOpen = false;
    this.feedCommentDraft = "";
    this.pointerStart = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX";
  }
  getIcon() {
    return "flame";
  }
  async onOpen() {
    await super.onOpen();
    this.contentEl.classList.add("icm-root");
    this.contentEl.style.padding = "14px";
    this.addAction("refresh-cw", "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438", () => void this.plugin.refreshCards());
    this.addAction("smartphone", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443 \u0422\u0422", () => this.openFeed());
    this.addAction("settings", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430", () => this.plugin.openSettings());
    this.addAction("more-horizontal", "\u041C\u0435\u043D\u044E \u043F\u0430\u043D\u0435\u043B\u0438", (evt) => this.showMenu(evt));
    this.registerDomEvent(this.contentEl, "keydown", (evt) => this.onKeyDown(evt));
    this.render();
  }
  async onClose() {
    await super.onClose();
  }
  render() {
    this.contentEl.replaceChildren();
    this.answerBadge = null;
    this.schedulerWarning = null;
    this.answerTextarea = null;
    if (this.mode === "feed") {
      this.renderFeed();
      return;
    }
    if (this.mode === "review" && this.review && this.plugin.getCardById(this.review.cardId)) {
      this.renderReview();
    } else {
      this.mode = "dashboard";
      this.review = null;
      this.renderDashboard();
    }
  }
  openFeed() {
    this.mode = "feed";
    this.review = null;
    this.feedReturn = false;
    this.feedCommentsOpen = false;
    this.feedCommentDraft = "";
    this.render();
  }
  startReview(cardId) {
    const deck = this.plugin.getSelectedDeck();
    const filter = this.plugin.getSelectedFilter();
    const queue = this.plugin.getQueue(deck, filter);
    const card = cardId ? this.plugin.getCardById(cardId) : queue[0];
    if (!card) {
      new import_obsidian.Notice("\u0412 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A");
      return;
    }
    this.review = this.makeState(card.id);
    this.feedReturn = false;
    this.mode = "review";
    this.render();
  }
  startFeedSolve(cardId) {
    const card = this.plugin.getCardById(cardId);
    if (!card) return;
    this.feedSolveCycle = this.plugin.getFeedState().cycle;
    this.review = this.makeState(card.id, this.feedSolveCycle);
    this.feedReturn = true;
    this.mode = "review";
    this.render();
  }
  makeState(cardId, feedCycle) {
    return {
      cardId,
      answer: "",
      revealed: false,
      revealKind: null,
      answerAtReveal: "",
      typedAfterReveal: false,
      fullNoteOpen: false,
      feedCycle
    };
  }
  reveal(kind) {
    if (!this.review) return;
    this.review.answerAtReveal = this.review.answer;
    this.review.revealed = true;
    this.review.revealKind = kind;
    if (kind === "dont-know" && this.plugin.settings.showFullNoteOnDontKnow) {
      this.review.fullNoteOpen = true;
    }
    if (this.feedReturn) {
      this.plugin.recordFeedHint(this.feedSolveCycle, this.review.cardId, kind, this.review.answerAtReveal);
    }
    this.render();
  }
  async grade(rating) {
    const rs = this.review;
    if (!rs || !rs.revealed) return;
    const request = {
      cardId: rs.cardId,
      answer: rs.answer,
      rating,
      revealKind: rs.revealKind,
      answerAtReveal: rs.answerAtReveal,
      typedAfterReveal: rs.typedAfterReveal
    };
    if (this.feedReturn) request.feed = { cycle: this.feedSolveCycle };
    const next = await this.plugin.grade(request);
    if (this.feedReturn) {
      this.feedReturn = false;
      if (this.plugin.settings.autoNext) this.plugin.nextFeed();
      this.mode = "feed";
      this.review = null;
      this.render();
      new import_obsidian.Notice("\u041E\u0446\u0435\u043D\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430 \xB7 \u043B\u0435\u043D\u0442\u0430 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0435\u043D\u0430 \u{1F525}");
      return;
    }
    if (next && this.plugin.settings.autoNext) {
      this.review = this.makeState(next.id);
      this.render();
    } else {
      this.mode = "dashboard";
      this.review = null;
      this.render();
      new import_obsidian.Notice("\u041E\u0447\u0435\u0440\u0435\u0434\u044C \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 \xB7 \u0441\u0435\u0440\u0438\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u{1F525}");
    }
  }
  onKeyDown(evt) {
    const target = evt.target;
    const inTextarea = target?.tagName === "TEXTAREA";
    if (this.mode === "feed") {
      if (evt.key === "Escape" && this.feedCommentsOpen) {
        evt.preventDefault();
        this.feedCommentsOpen = false;
        this.render();
        return;
      }
      if (inTextarea || this.feedCommentsOpen) return;
      const key = evt.key.toLowerCase();
      if (evt.key === "ArrowDown" || evt.key === " ") {
        evt.preventDefault();
        this.plugin.skipFeed();
      } else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        this.plugin.prevFeed();
      } else if (key === "l") {
        evt.preventDefault();
        const liked = this.plugin.toggleFeedLike();
        new import_obsidian.Notice(liked ? "\u2764\uFE0F \u041B\u0430\u0439\u043A \u0432 \u044D\u0442\u043E\u043C \u043F\u0440\u043E\u0445\u043E\u0434\u0435" : "\u041B\u0430\u0439\u043A \u044D\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u0430 \u0443\u0431\u0440\u0430\u043D");
      } else if (key === "c") {
        evt.preventDefault();
        this.feedCommentsOpen = true;
        this.render();
      } else if (evt.key === "Enter") {
        evt.preventDefault();
        const card = this.plugin.getCurrentFeedCard();
        if (card) this.startFeedSolve(card.id);
      }
      return;
    }
    const rs = this.review;
    if (!rs) return;
    if (evt.key === "Enter" && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      if (!rs.revealed) this.reveal("answer");
      else void this.grade(3);
      return;
    }
    if (rs.revealed && !inTextarea && !evt.ctrlKey && !evt.metaKey && !evt.altKey && /^[1-4]$/.test(evt.key)) {
      evt.preventDefault();
      void this.grade(Number(evt.key));
    }
  }
  showMenu(evt) {
    const menu = new import_obsidian.Menu();
    menu.addItem(
      (item) => item.setTitle("\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443 \u0422\u0422").setIcon("smartphone").onClick(() => this.openFeed())
    );
    menu.addItem(
      (item) => item.setTitle("\u041D\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435").setIcon("play").onClick(() => this.startReview())
    );
    menu.addItem(
      (item) => item.setTitle("\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438").setIcon("refresh-cw").onClick(() => void this.plugin.refreshCards())
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B").setIcon("layers").onClick(() => void this.plugin.setSelectedDeck(null))
    );
    menu.addItem(
      (item) => item.setTitle("\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430").setIcon("settings").onClick(() => this.plugin.openSettings())
    );
    menu.addItem(
      (item) => item.setTitle("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u2026").setIcon("trash-2").onClick(() => this.plugin.confirmReset())
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle("\u041E \u043F\u043B\u0430\u0433\u0438\u043D\u0435").setIcon("info").onClick(
        () => new import_obsidian.Notice(`\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX \xB7 ${cardsWord(this.plugin.cards.length)} \xB7 9 \u043A\u043E\u043B\u043E\u0434 \xB7 FSRS \xB7 \u043B\u0435\u043D\u0442\u0430 \u0422\u0422`)
      )
    );
    if (import_obsidian.Platform.isMobile) {
      menu.showAtPosition({ x: evt.clientX, y: evt.clientY });
    } else {
      menu.showAtMouseEvent(evt);
    }
  }
  updateReviewBadges() {
    const rs = this.review;
    if (!rs || !this.answerBadge) return;
    const badge = this.answerBadge;
    badge.className = "icm-answer-badge";
    if (!rs.revealed) {
      badge.textContent = "\u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u043F\u043E \u043F\u0430\u043C\u044F\u0442\u0438";
      badge.classList.add("is-muted");
    } else if (rs.typedAfterReveal) {
      badge.textContent = "\u26A0 \u041E\u0442\u0432\u0435\u0442 \u0434\u0430\u043D \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430 \u043E\u0442\u0432\u0435\u0442\u0430";
      badge.classList.add("is-warn");
    } else if (rs.revealKind === "dont-know") {
      badge.textContent = "\u041E\u0442\u043C\u0435\u0447\u0435\u043D\u043E: \xAB\u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442\xBB";
      badge.classList.add("is-warn");
    } else {
      badge.textContent = "\u041E\u0442\u0432\u0435\u0442 \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D \u0434\u043E \u043F\u043E\u043A\u0430\u0437\u0430";
      badge.classList.add("is-ok");
    }
    if (this.schedulerWarning) {
      if (rs.revealed && rs.typedAfterReveal) {
        this.schedulerWarning.textContent = this.plugin.settings.countAnswerAfterRevealAsAgain ? "\u0422\u0430\u043A\u043E\u0439 \u043E\u0442\u0432\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435, \u043D\u043E FSRS \u043F\u043E\u043B\u0443\u0447\u0438\u0442 \u043E\u0446\u0435\u043D\u043A\u0443 \xAB\u0421\u043D\u043E\u0432\u0430\xBB (Again)." : "\u0422\u0430\u043A\u043E\u0439 \u043E\u0442\u0432\u0435\u0442 \u043F\u043E\u043C\u0435\u0447\u0435\u043D \u043A\u0430\u043A \xAB\u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430\xBB, \u043D\u043E \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430 \u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u0432 \u0441\u0438\u043B\u0435.";
        this.schedulerWarning.classList.remove("is-hidden");
      } else {
        this.schedulerWarning.classList.add("is-hidden");
      }
    }
  }
  renderDashboard() {
    const root = this.contentEl.createDiv({ cls: "icm-dashboard" });
    const overall = this.plugin.getOverallStats();
    const streak = this.plugin.getStreak();
    const daily = this.plugin.getDaily();
    const now = Date.now();
    const today = dateKey(new Date(now));
    const studiedToday = (daily[today]?.reviews ?? 0) > 0;
    this.renderHero(root, overall, streak, studiedToday, daily, now, today);
    this.renderStats(root, overall);
    this.renderProgress(root, overall);
    this.renderFeedTeaser(root, overall);
    this.renderDecks(root);
    this.renderFiltersAndCards(root);
    this.renderRecent(root);
  }
  renderHero(parent, overall, streak, studiedToday, daily, now, today) {
    const hero = parent.createDiv({ cls: "icm-hero" });
    const top = hero.createDiv({ cls: "icm-hero-top" });
    const text = top.createDiv({ cls: "icm-hero-text" });
    text.createDiv({ cls: "icm-eyebrow", text: "OBSIDIAN \xB7 FSRS \xB7 \u041B\u0415\u041D\u0422\u0410 \xB7 RU" });
    text.createEl("h1", { cls: "icm-hero-title", text: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX" });
    text.createDiv({
      cls: "icm-hero-subtitle",
      text: `${cardsWord(overall.total)} \xB7 9 \u043A\u043E\u043B\u043E\u0434 \xB7 \u0432\u0441\u0451 \u0432\u043D\u0443\u0442\u0440\u0438 Obsidian`
    });
    const flame = top.createDiv({ cls: `icm-flame-box${studiedToday ? " is-hot" : " is-cold"}` });
    const icon = flame.createDiv({ cls: "icm-flame-icon" });
    setIconWithFallback(icon, "flame", "\u{1F525}");
    flame.createDiv({ cls: "icm-flame-count", text: String(streak.current) });
    flame.createDiv({ cls: "icm-flame-label", text: daysWord(streak.current) });
    const streakRow = hero.createDiv({ cls: "icm-streak-row" });
    streakRow.createSpan({
      cls: studiedToday ? "is-active" : "is-muted",
      text: studiedToday ? `\u0421\u0435\u0433\u043E\u0434\u043D\u044F: ${reviewsWord(daily[today]?.reviews ?? 0)} \xB7 \u0441\u0435\u0440\u0438\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0430` : "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0435\u0449\u0451 \u043D\u0435\u0442 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0439"
    });
    streakRow.createSpan({ cls: "icm-streak-best", text: `\u0420\u0435\u043A\u043E\u0440\u0434: ${streak.best}` });
    const dots = hero.createDiv({ cls: "icm-dots" });
    for (let i = 6; i >= 0; i -= 1) {
      const key = dayOffsetKey(now, -i);
      const count = daily[key]?.reviews ?? 0;
      const dot = dots.createSpan({
        cls: `icm-dot${count > 0 ? " is-on" : ""}${key === today ? " is-today" : ""}`,
        text: count > 0 ? String(Math.min(count, 9)) : ""
      });
      dot.setAttribute("title", `${key}: ${reviewsWord(count)}`);
    }
    dots.createSpan({ cls: "icm-dots-caption", text: "7 \u0434\u043D\u0435\u0439" });
  }
  renderStats(parent, overall) {
    const grid = parent.createDiv({ cls: "icm-stat-grid" });
    const items = [
      { label: "\u041A \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044E", value: overall.due, cls: "is-due", hint: "\u0423\u0436\u0435 \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438" },
      { label: "\u041D\u0435 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E", value: overall.fresh, cls: "is-new", hint: "\u0415\u0449\u0451 \u043D\u0435 \u043E\u0446\u0435\u043D\u0435\u043D\u044B" },
      { label: "\u041F\u0440\u043E\u0439\u0434\u0435\u043D\u043E", value: overall.passed, cls: "is-passed", hint: "\u0415\u0441\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0438" },
      { label: "\u041E\u0441\u0432\u043E\u0435\u043D\u043E", value: overall.mastered, cls: "is-mastered", hint: "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B" }
    ];
    for (const item of items) {
      const card = grid.createDiv({ cls: `icm-stat-card ${item.cls}` });
      card.createDiv({ cls: "icm-stat-value", text: String(item.value) });
      card.createDiv({ cls: "icm-stat-label", text: item.label });
      card.createDiv({ cls: "icm-stat-hint", text: item.hint });
    }
  }
  renderProgress(parent, overall) {
    const section = parent.createDiv({ cls: "icm-progress-section" });
    const head = section.createDiv({ cls: "icm-section-head" });
    head.createSpan({ cls: "icm-section-title", text: "\u041E\u0431\u0449\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441" });
    head.createSpan({ cls: "icm-section-meta", text: `${overall.passed} / ${overall.total}` });
    const track = section.createDiv({ cls: "icm-progress-track" });
    const fill = track.createDiv({ cls: "icm-progress-fill" });
    fill.style.width = `${percent(overall.passed, overall.total)}%`;
    section.createDiv({
      cls: "icm-progress-caption",
      text: `\u041F\u0440\u043E\u0439\u0434\u0435\u043D\u043E ${percent(overall.passed, overall.total)}% \xB7 \xAB\u041D\u0435 \u0437\u043D\u0430\u044E\xBB ${overall.dontKnow} \xB7 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430 ${overall.afterReveal}`
    });
  }
  renderFeedTeaser(parent, overall) {
    const section = parent.createDiv({ cls: "icm-section icm-feed-teaser" });
    const head = section.createDiv({ cls: "icm-section-head" });
    head.createSpan({ cls: "icm-section-title", text: "\u{1F4F1} \u041B\u0435\u043D\u0442\u0430 \u0422\u0422" });
    head.createSpan({ cls: "icm-section-meta", text: `\u041F\u0440\u043E\u0445\u043E\u0434 ${overall.feedCycle}` });
    section.createDiv({
      cls: "icm-feed-teaser-text",
      text: `\u2764\uFE0F ${overall.feedLikes} \xB7 \u{1F4AC} ${overall.feedComments} \xB7 \u0441\u0432\u0430\u0439\u043F\u043E\u0432 ${overall.feedSkips}. \u041C\u043E\u0436\u043D\u043E \u0441\u0432\u0430\u0439\u043F\u043D\u0443\u0442\u044C, \u043D\u0435 \u0440\u0435\u0448\u0430\u044F; \u043B\u0430\u0439\u043A\u0438 \u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u043F\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u0430\u043C.`
    });
    const btn = section.createEl("button", {
      cls: "icm-primary-btn",
      text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443",
      attr: { type: "button" }
    });
    btn.addEventListener("click", () => this.openFeed());
  }
  renderDecks(parent) {
    const section = parent.createDiv({ cls: "icm-section" });
    const head = section.createDiv({ cls: "icm-section-head" });
    head.createSpan({ cls: "icm-section-title", text: "\u041A\u043E\u043B\u043E\u0434\u044B" });
    head.createSpan({ cls: "icm-section-meta", text: "\u0412\u044B\u0431\u0435\u0440\u0438 \u0442\u0435\u043C\u0443 \u2014 \u043E\u0447\u0435\u0440\u0435\u0434\u044C \u043F\u0435\u0440\u0435\u0441\u0442\u0430\u043D\u0435\u0442 \u043F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u0442\u044C\u0441\u044F" });
    const grid = section.createDiv({ cls: "icm-deck-grid" });
    const selected = this.plugin.getSelectedDeck();
    const overall = this.plugin.getOverallStats();
    this.createDeckButton(
      grid,
      "\u0412\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B",
      {
        name: overall.name,
        total: overall.total,
        due: overall.due,
        fresh: overall.fresh,
        passed: overall.passed,
        mastered: overall.mastered
      },
      selected === null,
      { icon: "layers", emoji: "\u{1F5C2}\uFE0F", color: "var(--interactive-accent)" },
      null
    );
    for (const stats of this.plugin.getDeckStats()) {
      this.createDeckButton(grid, stats.name, stats, selected === stats.name, DECK_META[stats.name], stats.name);
    }
  }
  createDeckButton(parent, label, stats, selected, meta, deckValue) {
    const btn = parent.createEl("button", {
      cls: `icm-deck-btn${selected ? " is-selected" : ""}`,
      attr: { type: "button" }
    });
    btn.style.setProperty("--icm-deck-color", meta?.color ?? "var(--interactive-accent)");
    const icon = btn.createDiv({ cls: "icm-deck-icon" });
    setIconWithFallback(icon, meta?.icon ?? "layers", meta?.emoji ?? "\u{1F5C2}\uFE0F");
    const body = btn.createDiv({ cls: "icm-deck-body" });
    body.createDiv({ cls: "icm-deck-name", text: label });
    body.createDiv({
      cls: "icm-deck-meta",
      text: `${cardsWord(stats.total)} \xB7 \u043A \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044E ${stats.due}`
    });
    const mini = btn.createDiv({ cls: "icm-deck-mini" });
    mini.createSpan({ cls: "icm-mini is-new", text: `\u043D\u043E\u0432\u044B\u0445 ${stats.fresh}`, title: "\u041D\u0435 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0435" });
    mini.createSpan({ cls: "icm-mini is-passed", text: `\u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E ${stats.passed}`, title: "\u041F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0435" });
    btn.addEventListener("click", () => void this.plugin.setSelectedDeck(deckValue));
  }
  renderFiltersAndCards(parent) {
    const section = parent.createDiv({ cls: "icm-section" });
    const deck = this.plugin.getSelectedDeck();
    const filter = this.plugin.getSelectedFilter();
    const head = section.createDiv({ cls: "icm-section-head" });
    head.createSpan({ cls: "icm-section-title", text: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438" });
    head.createSpan({ cls: "icm-section-meta", text: deck ?? "\u0412\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B" });
    const filterRow = section.createDiv({ cls: "icm-filter-row" });
    for (const item of FILTERS) {
      const count = this.plugin.getQueue(deck, item.key).length;
      const btn = filterRow.createEl("button", {
        cls: `icm-filter-btn${filter === item.key ? " is-active" : ""}`,
        attr: { type: "button", title: item.hint }
      });
      btn.createSpan({ text: item.label });
      btn.createSpan({ cls: "icm-filter-count", text: String(count) });
      btn.addEventListener("click", () => void this.plugin.setSelectedFilter(item.key));
    }
    const queue = this.plugin.getQueue(deck, filter);
    const actions = section.createDiv({ cls: "icm-actions" });
    const start = actions.createEl("button", {
      cls: "icm-primary-btn",
      text: "\u25B6 \u041D\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435",
      attr: { type: "button" }
    });
    if (!queue.length) start.disabled = true;
    start.addEventListener("click", () => this.startReview());
    actions.createSpan({
      cls: "icm-actions-hint",
      text: `\u0412 \u043E\u0447\u0435\u0440\u0435\u0434\u0438: ${cardsWord(queue.length)}`
    });
    const list = section.createDiv({ cls: "icm-card-list" });
    if (!queue.length) {
      list.createDiv({
        cls: "icm-empty",
        text: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u043E. \u0412\u044B\u0431\u0435\u0440\u0438 \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u043E\u043B\u043E\u0434\u0443 \u0438\u043B\u0438 \u0444\u0438\u043B\u044C\u0442\u0440 \u2014 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043D\u0438\u043A\u0443\u0434\u0430 \u043D\u0435 \u0434\u0435\u043B\u0438\u0441\u044C."
      });
      return;
    }
    const now = Date.now();
    for (const card of queue) this.renderCardRow(list, card, now);
  }
  renderCardRow(parent, card, now) {
    const progress = this.plugin.getProgress(card.id);
    const status = statusFor(progress, now);
    const row = parent.createEl("button", {
      cls: "icm-card-row",
      attr: { type: "button" }
    });
    const top = row.createDiv({ cls: "icm-card-row-top" });
    top.createSpan({ cls: "icm-card-row-title", text: truncate(card.title, 86) });
    top.createSpan({
      cls: "icm-card-row-num",
      text: card.order < 999999 ? String(card.order).padStart(3, "0") : ""
    });
    const meta = row.createDiv({ cls: "icm-card-row-meta" });
    meta.createSpan({ cls: "icm-deck-tag", text: card.deck });
    meta.createSpan({ cls: `icm-status-badge ${status.cls}`, text: status.label });
    meta.createSpan({ cls: "icm-due", text: status.dueLabel });
    if (card.tags.includes("go")) meta.createSpan({ cls: "icm-tag", text: "#go" });
    const likes = this.plugin.getFeedLikes(card.id);
    const comments = this.plugin.getFeedComments(card.id).length;
    if (likes > 0) meta.createSpan({ cls: "icm-tag is-like", text: `\u2764\uFE0F ${likes}` });
    if (comments > 0) meta.createSpan({ cls: "icm-tag", text: `\u{1F4AC} ${comments}` });
    if (status.flags.length) {
      const flags = row.createDiv({ cls: "icm-card-row-flags" });
      for (const flag of status.flags.slice(0, 2)) {
        flags.createSpan({ cls: "icm-flag", text: flag });
      }
    }
    row.addEventListener("click", () => this.startReview(card.id));
  }
  renderRecent(parent) {
    const logs = this.plugin.getRecentLogs(4);
    if (!logs.length) return;
    const section = parent.createDiv({ cls: "icm-section icm-recent" });
    section.createDiv({ cls: "icm-section-title", text: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F" });
    for (const log of logs) this.renderHistoryRow(section, log);
  }
  renderHistoryRow(parent, log) {
    const row = parent.createDiv({ cls: "icm-history-row" });
    const left = row.createDiv({ cls: "icm-history-left" });
    left.createDiv({ cls: "icm-history-title", text: truncate(log.title, 70) });
    left.createDiv({
      cls: "icm-history-meta",
      text: `${log.deck} \xB7 ${formatDateTime(log.at)} \xB7 \u0447\u0435\u0440\u0435\u0437 ${log.scheduledDays} \u0434\u043D.`
    });
    const right = row.createDiv({ cls: "icm-history-right" });
    right.createSpan({ cls: "icm-history-rating", text: ratingLabel(log.rating) });
    if (log.answeredAfterReveal) right.createSpan({ cls: "icm-flag is-warn", text: "\u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430" });
    if (log.dontKnow) right.createSpan({ cls: "icm-flag", text: "\u041D\u0435 \u0437\u043D\u0430\u044E" });
  }
  /* ---------------------------------- Лента ---------------------------------- */
  renderFeed() {
    const root = this.contentEl.createDiv({ cls: "icm-feed" });
    const feed = this.plugin.getFeedState();
    const card = this.plugin.getCurrentFeedCard();
    const impression = this.plugin.getCurrentFeedImpression();
    const top = root.createDiv({ cls: "icm-feed-top" });
    const back = top.createEl("button", {
      cls: "icm-ghost-btn",
      text: "\u2190 \u041A \u043A\u043E\u043B\u043E\u0434\u0430\u043C",
      attr: { type: "button" }
    });
    back.addEventListener("click", () => {
      this.mode = "dashboard";
      this.feedCommentsOpen = false;
      this.render();
    });
    top.createSpan({ cls: "icm-feed-top-title", text: "\u{1F4F1} \u041B\u0435\u043D\u0442\u0430" });
    top.createSpan({
      cls: "icm-feed-counter",
      text: feed.order.length ? `${feed.index + 1} / ${feed.order.length}` : "\u043F\u0443\u0441\u0442\u043E"
    });
    const shuffle = top.createEl("button", {
      cls: "icm-ghost-btn",
      text: "\u041D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u0445\u043E\u0434",
      attr: { type: "button" }
    });
    shuffle.addEventListener("click", () => this.plugin.regenerateFeed(true));
    if (!card || !impression) {
      root.createDiv({
        cls: "icm-empty",
        text: "\u041B\u0435\u043D\u0442\u0430 \u043F\u0443\u0441\u0442\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u044C \u043F\u0443\u0442\u044C \u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438 \u0434\u0440\u0443\u0433\u0443\u044E \u043A\u043E\u043B\u043E\u0434\u0443."
      });
      return;
    }
    const likes = this.plugin.getFeedLikes(card.id);
    const comments = this.plugin.getFeedComments(card.id);
    const stage = root.createDiv({ cls: "icm-feed-stage" });
    const cardEl = stage.createDiv({ cls: "icm-feed-card" });
    this.attachSwipe(cardEl);
    cardEl.createDiv({
      cls: "icm-feed-eyebrow",
      text: `\u041F\u0420\u041E\u0425\u041E\u0414 ${feed.cycle} \xB7 ${card.deck.toUpperCase()} \xB7 ${feed.deck ?? "\u0412\u0421\u0415 \u041A\u041E\u041B\u041E\u0414\u042B"}`
    });
    cardEl.createEl("h2", { cls: "icm-feed-title", text: card.title });
    if (card.topic) cardEl.createDiv({ cls: "icm-feed-topic", text: card.topic });
    const question = cardEl.createDiv({ cls: "icm-markdown icm-feed-question" });
    this.renderMarkdownInto(question, card.question, card.path);
    const status = cardEl.createDiv({ cls: "icm-feed-status" });
    status.createSpan({ cls: "icm-feed-status-item", text: `\u2764\uFE0F ${likes} \u0437\u0430 \u0432\u0441\u0435 \u043F\u0440\u043E\u0445\u043E\u0434\u044B` });
    status.createSpan({ cls: "icm-feed-status-item", text: `\u{1F4AC} ${comments.length}` });
    status.createSpan({
      cls: `icm-feed-status-item ${impression.outcome === "solved" ? "is-ok" : ""}`,
      text: feedOutcomeLabel(impression.outcome)
    });
    if (impression.liked) {
      status.createSpan({ cls: "icm-feed-status-item is-liked", text: "\u041B\u0430\u0439\u043A \u0432 \u044D\u0442\u043E\u043C \u043F\u0440\u043E\u0445\u043E\u0434\u0435 \u2713" });
    }
    if (impression.hintKind) {
      status.createSpan({
        cls: "icm-feed-status-item is-warn",
        text: impression.usedHint ? "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430" : "\u0411\u044B\u043B\u0430 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430"
      });
    }
    const rail = stage.createDiv({ cls: "icm-feed-rail" });
    this.renderFeedLikeButton(rail, impression, likes);
    this.renderFeedCommentButton(rail, comments.length);
    this.renderFeedActionButton(rail, "skip-forward", "\u23ED", "\u0421\u0432\u0430\u0439\u043F", "\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0431\u0435\u0437 \u0440\u0435\u0448\u0435\u043D\u0438\u044F", () => this.plugin.skipFeed());
    this.renderFeedActionButton(rail, "pencil", "\u270D\uFE0F", "\u0420\u0435\u0448\u0438\u0442\u044C", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0442\u0432\u0435\u0442 \u0438 \u043E\u0446\u0435\u043D\u043A\u0438", () => this.startFeedSolve(card.id));
    this.renderFeedActionButton(rail, "chevron-up", "\u2B06", "\u0414\u0430\u043B\u0435\u0435", "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0431\u0435\u0437 \u0440\u0435\u0448\u0435\u043D\u0438\u044F (\u0441\u0432\u0430\u0439\u043F \u0432\u0432\u0435\u0440\u0445)", () => this.plugin.skipFeed());
    this.renderFeedActionButton(rail, "chevron-down", "\u2B07", "\u041D\u0430\u0437\u0430\u0434", "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 (\u0441\u0432\u0430\u0439\u043F \u0432\u043D\u0438\u0437)", () => this.plugin.prevFeed());
    root.createDiv({
      cls: "icm-feed-hint",
      text: import_obsidian.Platform.isMobile ? "\u0421\u0432\u0430\u0439\u043F \u0432\u0432\u0435\u0440\u0445/\u0432\u043B\u0435\u0432\u043E \u2014 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \xB7 \u0432\u043D\u0438\u0437 \u2014 \u043D\u0430\u0437\u0430\u0434 \xB7 \u0432\u043F\u0440\u0430\u0432\u043E \u2014 \u043B\u0430\u0439\u043A. \u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u043F\u043E\u0434 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u043E\u0439: \u043B\u0430\u0439\u043A, \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439, \u0441\u0432\u0430\u0439\u043F, \u0440\u0435\u0448\u0438\u0442\u044C." : "\u0421\u0432\u0430\u0439\u043F \u0432\u0432\u0435\u0440\u0445/\u0432\u043B\u0435\u0432\u043E \u2014 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \xB7 \u0432\u043D\u0438\u0437 \u2014 \u043D\u0430\u0437\u0430\u0434 \xB7 \u0432\u043F\u0440\u0430\u0432\u043E \u2014 \u043B\u0430\u0439\u043A. \u041A\u043B\u0430\u0432\u0438\u0448\u0438: \u2193/\u2191, L, C, Enter, Esc."
    });
    if (this.feedCommentsOpen) {
      this.renderFeedComments(root, card, impression, comments);
    }
  }
  renderFeedLikeButton(parent, impression, total) {
    const btn = parent.createEl("button", {
      cls: `icm-feed-action is-like${impression.liked ? " is-active" : ""}`,
      attr: { type: "button", title: "\u041B\u0430\u0439\u043A \u0437\u0430 \u044D\u0442\u043E\u0442 \u043F\u0440\u043E\u0445\u043E\u0434. \u041F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0435 \u043D\u0430\u0436\u0430\u0442\u0438\u0435 \u0443\u0431\u0438\u0440\u0430\u0435\u0442 \u0438\u043C\u0435\u043D\u043D\u043E \u044D\u0442\u043E\u0442 \u043B\u0430\u0439\u043A." }
    });
    const icon = btn.createDiv({ cls: "icm-feed-action-icon" });
    setIconWithFallback(icon, "heart", impression.liked ? "\u2764\uFE0F" : "\u{1F90D}");
    btn.createDiv({ cls: "icm-feed-action-count", text: String(total) });
    btn.createDiv({ cls: "icm-feed-action-label", text: impression.liked ? "\u0423\u0431\u0440\u0430\u0442\u044C" : "\u041B\u0430\u0439\u043A" });
    btn.addEventListener("click", () => {
      const liked = this.plugin.toggleFeedLike();
      new import_obsidian.Notice(liked ? `\u2764\uFE0F \u041B\u0430\u0439\u043A \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \xB7 \u0432\u0441\u0435\u0433\u043E ${total + 1}` : `\u041B\u0430\u0439\u043A \u044D\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u0430 \u0443\u0431\u0440\u0430\u043D \xB7 \u0432\u0441\u0435\u0433\u043E ${Math.max(0, total - 1)}`);
    });
  }
  renderFeedCommentButton(parent, total) {
    const btn = parent.createEl("button", {
      cls: `icm-feed-action${this.feedCommentsOpen ? " is-active" : ""}`,
      attr: { type: "button", title: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438: \u043E\u0434\u0438\u043D \u043D\u0430 \u043F\u0440\u043E\u0445\u043E\u0434, \u0441 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u043F\u043E\u043F\u044B\u0442\u043A\u0438" }
    });
    const icon = btn.createDiv({ cls: "icm-feed-action-icon" });
    setIconWithFallback(icon, "message-circle", "\u{1F4AC}");
    btn.createDiv({ cls: "icm-feed-action-count", text: String(total) });
    btn.createDiv({ cls: "icm-feed-action-label", text: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442" });
    btn.addEventListener("click", () => {
      this.feedCommentsOpen = !this.feedCommentsOpen;
      if (!this.feedCommentsOpen) this.feedCommentDraft = "";
      this.render();
    });
  }
  renderFeedActionButton(parent, iconName, emoji, label, title, onClick) {
    const btn = parent.createEl("button", {
      cls: "icm-feed-action",
      attr: { type: "button", title }
    });
    const icon = btn.createDiv({ cls: "icm-feed-action-icon" });
    setIconWithFallback(icon, iconName, emoji);
    btn.createDiv({ cls: "icm-feed-action-label", text: label });
    btn.addEventListener("click", onClick);
  }
  handleSwipe(dx, dy) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 55) return;
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0) this.plugin.skipFeed();
      else this.plugin.prevFeed();
    } else {
      if (dx < 0) this.plugin.skipFeed();
      else {
        const liked = this.plugin.toggleFeedLike();
        new import_obsidian.Notice(liked ? "\u2764\uFE0F \u041B\u0430\u0439\u043A \u0432 \u044D\u0442\u043E\u043C \u043F\u0440\u043E\u0445\u043E\u0434\u0435" : "\u041B\u0430\u0439\u043A \u044D\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u0430 \u0443\u0431\u0440\u0430\u043D");
      }
    }
  }
  attachSwipe(cardEl) {
    const ignored = (target) => {
      const el = target;
      return Boolean(el?.closest("button, textarea, input, a, .icm-feed-comments"));
    };
    if (typeof PointerEvent !== "undefined") {
      cardEl.addEventListener("pointerdown", (evt) => {
        if (ignored(evt.target)) return;
        this.pointerStart = { x: evt.clientX, y: evt.clientY };
      });
      cardEl.addEventListener("pointerup", (evt) => {
        const start = this.pointerStart;
        this.pointerStart = null;
        if (!start) return;
        this.handleSwipe(evt.clientX - start.x, evt.clientY - start.y);
      });
      cardEl.addEventListener("pointercancel", () => {
        this.pointerStart = null;
      });
      return;
    }
    cardEl.addEventListener(
      "touchstart",
      (evt) => {
        if (ignored(evt.target)) return;
        const touch = evt.touches[0];
        if (touch) this.pointerStart = { x: touch.clientX, y: touch.clientY };
      },
      { passive: true }
    );
    cardEl.addEventListener(
      "touchend",
      (evt) => {
        const start = this.pointerStart;
        this.pointerStart = null;
        const touch = evt.changedTouches[0];
        if (!start || !touch) return;
        this.handleSwipe(touch.clientX - start.x, touch.clientY - start.y);
      },
      { passive: true }
    );
    cardEl.addEventListener("touchcancel", () => {
      this.pointerStart = null;
    });
  }
  renderFeedComments(parent, card, impression, comments) {
    const section = parent.createDiv({ cls: "icm-feed-comments" });
    const head = section.createDiv({ cls: "icm-section-head" });
    head.createSpan({ cls: "icm-section-title", text: `\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \xB7 ${comments.length}` });
    head.createSpan({ cls: "icm-section-meta", text: `\u041F\u0440\u043E\u0445\u043E\u0434 ${impression.cycle} \xB7 \u043E\u0434\u0438\u043D \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043D\u0430 \u043F\u043E\u043A\u0430\u0437` });
    const composer = section.createDiv({ cls: "icm-comment-composer" });
    const textarea = composer.createEl("textarea", {
      cls: "icm-textarea icm-comment-textarea",
      attr: {
        rows: "3",
        placeholder: "\u0427\u0442\u043E \u0434\u0443\u043C\u0430\u0435\u0448\u044C \u043E\u0431 \u044D\u0442\u043E\u043C \u0432\u043E\u043F\u0440\u043E\u0441\u0435? \u0412\u0438\u0434\u043D\u043E, \u043E\u0442\u0432\u0435\u0447\u0430\u043B \u043B\u0438 \u0442\u044B \u0438 \u043A\u0430\u043A\u0443\u044E \u043E\u0446\u0435\u043D\u043A\u0443 \u043F\u043E\u0441\u0442\u0430\u0432\u0438\u043B\u2026",
        spellcheck: "false"
      }
    });
    textarea.value = this.feedCommentDraft || impression.comment?.text || "";
    textarea.addEventListener("input", () => {
      this.feedCommentDraft = textarea.value;
    });
    const actions = composer.createDiv({ cls: "icm-comment-actions" });
    const save = actions.createEl("button", {
      cls: "icm-primary-btn",
      text: impression.comment ? "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
      attr: { type: "button" }
    });
    save.addEventListener("click", () => {
      if (this.plugin.saveFeedComment(textarea.value)) {
        this.feedCommentDraft = "";
        this.render();
      } else {
        new import_obsidian.Notice("\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043F\u0443\u0441\u0442\u043E\u0439");
      }
    });
    if (impression.comment) {
      const remove = actions.createEl("button", {
        cls: "icm-ghost-btn",
        text: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
        attr: { type: "button" }
      });
      remove.addEventListener("click", () => {
        this.plugin.deleteFeedComment();
        this.feedCommentDraft = "";
        this.render();
      });
    }
    const close = actions.createEl("button", {
      cls: "icm-ghost-btn",
      text: "\u0421\u043A\u0440\u044B\u0442\u044C",
      attr: { type: "button" }
    });
    close.addEventListener("click", () => {
      this.feedCommentsOpen = false;
      this.feedCommentDraft = "";
      this.render();
    });
    composer.createDiv({
      cls: "icm-comment-help",
      text: "\u0412 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F: \u043E\u0442\u0432\u0435\u0442\u0438\u043B \u0441\u0430\u043C / \u0441 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u043E\u0439 / \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u043B, \u0432\u0438\u0434 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438 \u0438 \u043E\u0446\u0435\u043D\u043A\u0430 Hard/Good/Easy/Again."
    });
    const list = section.createDiv({ cls: "icm-comment-list" });
    if (!comments.length) {
      list.createDiv({
        cls: "icm-empty",
        text: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u041D\u0430\u043F\u0438\u0448\u0438 \u043F\u0435\u0440\u0432\u044B\u0439 \u2014 \u043E\u043D \u043F\u0440\u0438\u0432\u044F\u0436\u0435\u0442\u0441\u044F \u043A \u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u043E\u0445\u043E\u0434\u0443 \u043B\u0435\u043D\u0442\u044B."
      });
      return;
    }
    for (const comment of comments) this.renderFeedCommentItem(list, comment, card);
  }
  renderFeedCommentItem(parent, comment, card) {
    const item = parent.createDiv({ cls: "icm-comment-item" });
    const top = item.createDiv({ cls: "icm-comment-item-top" });
    top.createSpan({ cls: "icm-comment-cycle", text: `\u041F\u0440\u043E\u0445\u043E\u0434 ${comment.cycle}` });
    top.createSpan({ cls: "icm-comment-date", text: formatDateTime(comment.at) });
    item.createDiv({ cls: "icm-comment-card-title", text: truncate(card.title, 80) });
    item.createDiv({ cls: "icm-comment-text", text: comment.text });
    const badges = item.createDiv({ cls: "icm-comment-badges" });
    for (const badge of feedAttemptBadges(comment)) {
      badges.createSpan({ cls: "icm-comment-badge", text: badge });
    }
  }
  /* -------------------------------- Повторение ------------------------------- */
  renderReview() {
    const rs = this.review;
    const card = rs ? this.plugin.getCardById(rs.cardId) : void 0;
    if (!rs || !card) return;
    const root = this.contentEl.createDiv({ cls: "icm-review" });
    const queue = this.plugin.getQueue(this.plugin.getSelectedDeck(), this.plugin.getSelectedFilter());
    const index = queue.findIndex((item) => item.id === card.id);
    const top = root.createDiv({ cls: "icm-review-top" });
    const back = top.createEl("button", {
      cls: "icm-ghost-btn",
      text: this.feedReturn ? "\u2190 \u0412 \u043B\u0435\u043D\u0442\u0443" : "\u2190 \u041A \u043A\u043E\u043B\u043E\u0434\u0430\u043C",
      attr: { type: "button" }
    });
    back.addEventListener("click", () => {
      this.review = null;
      if (this.feedReturn) {
        this.feedReturn = false;
        this.mode = "feed";
      } else {
        this.mode = "dashboard";
      }
      this.render();
    });
    top.createSpan({ cls: "icm-deck-pill", text: card.deck });
    top.createSpan({
      cls: "icm-counter",
      text: this.feedReturn ? `\u041B\u0435\u043D\u0442\u0430 \xB7 \u043F\u0440\u043E\u0445\u043E\u0434 ${this.feedSolveCycle}` : index >= 0 ? `${index + 1} / ${queue.length}` : "\u0412\u043D\u0435 \u043E\u0447\u0435\u0440\u0435\u0434\u0438"
    });
    const qCard = root.createDiv({ cls: "icm-question-card" });
    qCard.createDiv({ cls: "icm-eyebrow", text: `\u041A\u041E\u041B\u041E\u0414\u0410 \xB7 ${card.deck.toUpperCase()}` });
    qCard.createEl("h2", { cls: "icm-question-title", text: card.title });
    if (card.topic) qCard.createDiv({ cls: "icm-topic", text: card.topic });
    const qText = qCard.createDiv({ cls: "icm-markdown icm-question-text" });
    this.renderMarkdownInto(qText, card.question, card.path);
    const answerBox = root.createDiv({ cls: "icm-answer-box" });
    const labelRow = answerBox.createDiv({ cls: "icm-label-row" });
    labelRow.createSpan({ cls: "icm-label", text: "\u0422\u0432\u043E\u0439 \u043E\u0442\u0432\u0435\u0442" });
    this.answerBadge = labelRow.createSpan({ cls: "icm-answer-badge" });
    const textarea = answerBox.createEl("textarea", {
      cls: "icm-textarea",
      attr: {
        rows: "7",
        placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438 \u043E\u0442\u0432\u0435\u0442 \u0441\u0432\u043E\u0438\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438\u2026",
        spellcheck: "false"
      }
    });
    textarea.value = rs.answer;
    this.answerTextarea = textarea;
    textarea.addEventListener("input", () => {
      rs.answer = textarea.value;
      if (rs.revealed) rs.typedAfterReveal = true;
      if (this.feedReturn) {
        this.plugin.recordFeedAnswer(this.feedSolveCycle, rs.cardId, rs.answer, rs.typedAfterReveal);
      }
      this.updateReviewBadges();
    });
    textarea.addEventListener("blur", () => {
      if (this.feedReturn) void this.plugin.save();
    });
    if (!rs.revealed) window.setTimeout(() => textarea.focus(), 0);
    this.schedulerWarning = root.createDiv({ cls: "icm-scheduler-warning is-hidden" });
    if (!rs.revealed) {
      const actions = root.createDiv({ cls: "icm-review-actions" });
      const show = actions.createEl("button", {
        cls: "icm-primary-btn",
        text: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442",
        attr: { type: "button" }
      });
      show.addEventListener("click", () => this.reveal("answer"));
      const dont = actions.createEl("button", {
        cls: "icm-dontknow-btn",
        text: "\u{1F937} \u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442",
        attr: { type: "button" }
      });
      dont.addEventListener("click", () => this.reveal("dont-know"));
      root.createDiv({
        cls: "icm-hint",
        text: "Ctrl/\u2318 + Enter \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442. \u041D\u0435 \u0437\u043D\u0430\u0435\u0448\u044C \u2014 \u0436\u043C\u0438 \xAB\u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442\xBB: \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0432\u0441\u044F \u0437\u0430\u043C\u0435\u0442\u043A\u0430, \u043D\u043E \u043E\u0442\u0432\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430 \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u043C\u0435\u0447\u0435\u043D \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E."
      });
    } else {
      this.renderRevealed(root, card, rs);
    }
    this.updateReviewBadges();
  }
  renderRevealed(parent, card, rs) {
    const reveal = parent.createDiv({ cls: "icm-reveal" });
    const head = reveal.createDiv({ cls: "icm-reveal-head" });
    head.createEl("h3", {
      text: rs.revealKind === "dont-know" ? "\u0417\u0430\u043C\u0435\u0442\u043A\u0430 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u043E\u0442\u043A\u0440\u044B\u0442\u0430" : "\u042D\u0442\u0430\u043B\u043E\u043D \u0438 \u043E\u0431\u044A\u044F\u0441\u043D\u0435\u043D\u0438\u0435"
    });
    head.createSpan({
      cls: `icm-reveal-badge ${rs.revealKind === "dont-know" ? "is-warn" : "is-ok"}`,
      text: rs.revealKind === "dont-know" ? "\u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442" : "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442"
    });
    const user = reveal.createDiv({ cls: "icm-answer-block" });
    user.createDiv({ cls: "icm-label", text: "\u0422\u0432\u043E\u0439 \u043E\u0442\u0432\u0435\u0442" });
    user.createDiv({
      cls: `icm-user-answer${rs.answer.trim() ? "" : " is-empty"}`,
      text: rs.answer.trim() || "\u2014 \u043E\u0442\u0432\u0435\u0442 \u043D\u0435 \u0432\u0432\u0435\u0434\u0451\u043D \u2014"
    });
    if (rs.typedAfterReveal) {
      user.createDiv({
        cls: "icm-inline-warning",
        text: "\u042D\u0442\u043E\u0442 \u0442\u0435\u043A\u0441\u0442 \u0432\u0432\u0435\u0434\u0451\u043D \u0438\u043B\u0438 \u0438\u0437\u043C\u0435\u043D\u0451\u043D \u0443\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430 \u044D\u0442\u0430\u043B\u043E\u043D\u0430."
      });
    }
    const reference = reveal.createDiv({ cls: "icm-markdown icm-reference" });
    this.renderMarkdownInto(reference, buildExplanationMarkdown(card), card.path);
    const full = reveal.createDiv({ cls: "icm-full-note-section" });
    const toggle = full.createEl("button", {
      cls: "icm-ghost-btn",
      text: rs.fullNoteOpen ? "\u0421\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u043B\u043D\u0443\u044E \u0437\u0430\u043C\u0435\u0442\u043A\u0443" : "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E",
      attr: { type: "button" }
    });
    toggle.addEventListener("click", () => {
      rs.fullNoteOpen = !rs.fullNoteOpen;
      this.render();
    });
    const fullContainer = full.createDiv({ cls: "icm-markdown icm-full-note" });
    if (rs.fullNoteOpen) {
      this.renderMarkdownInto(fullContainer, card.fullMarkdown, card.path);
    } else {
      fullContainer.createDiv({
        cls: "icm-full-note-placeholder",
        text: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0438\u0441\u0445\u043E\u0434\u043D\u0430\u044F Markdown-\u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u0446\u0435\u043B\u0438\u043A\u043E\u043C."
      });
    }
    const open = reveal.createEl("button", {
      cls: "icm-ghost-btn icm-open-note",
      text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u0432 Obsidian",
      attr: { type: "button" }
    });
    open.addEventListener("click", () => this.openNote(card));
    const rating = reveal.createDiv({ cls: "icm-rating" });
    rating.createDiv({ cls: "icm-label", text: "\u041D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043B\u0435\u0433\u043A\u043E \u0432\u0441\u043F\u043E\u043C\u043D\u0438\u043B?" });
    rating.createDiv({
      cls: "icm-rating-hint",
      text: "\u041A\u043B\u0430\u0432\u0438\u0448\u0438 1\u20134 \xB7 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u043E\u0446\u0435\u043D\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435 \u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043B\u0435\u043D\u0442\u044B"
    });
    const row = rating.createDiv({ cls: "icm-rating-row" });
    for (const item of RATINGS) {
      const btn = row.createEl("button", {
        cls: `icm-rating-btn is-${item.cls}`,
        attr: { type: "button" }
      });
      btn.createDiv({ cls: "icm-rating-title", text: `${item.ru} / ${item.en}` });
      btn.createDiv({ cls: "icm-rating-desc", text: item.desc });
      btn.createDiv({ cls: "icm-rating-key", text: item.key });
      btn.addEventListener("click", () => void this.grade(item.value));
    }
  }
  openNote(card) {
    const file = this.app.vault.getAbstractFileByPath(card.path);
    if (file instanceof import_obsidian.TFile) {
      void this.app.workspace.getLeaf().openFile(file);
    } else {
      new import_obsidian.Notice("\u0418\u0441\u0445\u043E\u0434\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u0442\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
    }
  }
  renderMarkdownInto(container, markdown, sourcePath) {
    container.replaceChildren();
    const renderer = import_obsidian.MarkdownRenderer;
    void (async () => {
      try {
        if (typeof renderer.render === "function") {
          await renderer.render(this.app, markdown, container, sourcePath, this);
        } else if (typeof renderer.renderMarkdown === "function") {
          await renderer.renderMarkdown(markdown, container, sourcePath, this);
        } else {
          container.textContent = markdown;
        }
      } catch (error) {
        console.error("[\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX] \u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0435\u043D\u0434\u0435\u0440\u0430 Markdown", error);
        container.textContent = markdown;
      }
    })();
  }
};

// src/scheduler.ts
function fromFsrsCard(card, now) {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.getTime() : null,
    firstReviewed: null,
    reviewCount: 0,
    lastRating: null,
    effectiveRating: null,
    lastAnswer: "",
    answeredAfterReveal: false,
    dontKnow: false,
    typedAfterRevealCount: 0,
    dontKnowCount: 0
  };
}
function toFsrsCardInput(progress) {
  return {
    due: new Date(progress.due),
    stability: progress.stability,
    difficulty: progress.difficulty,
    elapsed_days: progress.elapsed_days,
    scheduled_days: progress.scheduled_days,
    reps: progress.reps,
    lapses: progress.lapses,
    state: progress.state,
    last_review: progress.last_review ? new Date(progress.last_review) : void 0
  };
}
function createEmptyProgress(now) {
  return fromFsrsCard(w(new Date(now)), now);
}
function createScheduler(settings) {
  const params = {
    request_retention: settings.requestRetention,
    maximum_interval: settings.maximumInterval,
    enable_fuzz: settings.enableFuzz,
    enable_short_term: settings.enableShortTerm
  };
  return tt(M(params));
}
function gradeCard(progress, rating, now, settings) {
  const scheduler = createScheduler(settings);
  const input = toFsrsCardInput(progress);
  const result = scheduler.next(input, new Date(now), rating);
  return {
    progress: fromFsrsCard(result.card, now),
    scheduledDays: result.card.scheduled_days,
    elapsedDays: result.card.elapsed_days,
    state: result.card.state
  };
}
var RATING_AGAIN = l.Again;
var RATING_GOOD = l.Good;

// src/main.ts
function setIconWithFallback2(el, icon, fallback) {
  (0, import_obsidian2.setIcon)(el, icon);
  if (!el.querySelector("svg")) el.textContent = fallback;
}
function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
var ConfirmModal = class extends import_obsidian2.Modal {
  constructor(app, heading, message, onConfirm) {
    super(app);
    this.heading = heading;
    this.message = message;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    this.contentEl.createEl("h3", { cls: "icm-modal-title", text: this.heading });
    this.contentEl.createEl("p", { cls: "icm-modal-text", text: this.message });
    const row = this.contentEl.createDiv({ cls: "icm-modal-actions" });
    const cancel = row.createEl("button", { text: "\u041E\u0442\u043C\u0435\u043D\u0430", attr: { type: "button" } });
    cancel.addEventListener("click", () => this.close());
    const ok = row.createEl("button", {
      text: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
      cls: "mod-warning",
      attr: { type: "button" }
    });
    ok.addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });
  }
};
var CardsMaxPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.data = normalizeData(null);
    this.settings = this.data.settings;
    this.cards = [];
    this.refreshTimer = null;
    this.statusItem = null;
    this.statusText = null;
  }
  async onload() {
    const raw = await this.loadData();
    this.data = normalizeData(raw);
    this.settings = this.data.settings;
    await this.refreshCards(false);
    this.ensureFeed(false);
    this.registerView(VIEW_TYPE, (leaf) => new CardsMaxView(leaf, this));
    const ribbon = this.addRibbonIcon("flame", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB", () => void this.activateView());
    ribbon.classList.add("icm-ribbon");
    const feedRibbon = this.addRibbonIcon("smartphone", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443 \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB", () => void this.openFeed());
    feedRibbon.classList.add("icm-ribbon-feed");
    this.addCommand({
      id: "open-cards-max-panel",
      name: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "open-cards-max-feed",
      name: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443 \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB",
      callback: () => void this.openFeed()
    });
    this.addCommand({
      id: "start-cards-max-review",
      name: "\u041D\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435 \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB",
      callback: () => void this.startReviewFromCommand()
    });
    this.addSettingTab(new CardsMaxSettingTab(this.app, this));
    this.setupStatusBar();
    this.registerVaultEvents();
    this.register(() => {
      if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    });
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }
  async save() {
    this.data.settings = this.settings;
    await this.saveData(this.data);
    this.updateStatusBar();
  }
  async setSetting(key, value) {
    this.settings[key] = value;
    await this.save();
    if (key === "cardsPath") await this.refreshCards(false);
    if (key === "cardsPath" || key === "feedCycleSize" || key === "feedShuffle") {
      this.regenerateFeed(true);
    }
    if (key === "showStreakInStatusBar") this.updateStatusBar();
    this.refreshAllViews();
  }
  async refreshCards(showNotice = true) {
    this.cards = await loadCards(this.app, this.settings.cardsPath);
    if (!this.cards.length) {
      new import_obsidian2.Notice(`\xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB: \u043F\u043E \u043F\u0443\u0442\u0438 ${this.settings.cardsPath} \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B`);
    } else if (showNotice) {
      new import_obsidian2.Notice(`\xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E ${cardsWord(this.cards.length)}`);
    }
    this.ensureFeed(false);
    this.refreshAllViews();
  }
  registerVaultEvents() {
    const prefix = () => `${this.settings.cardsPath.replace(/^\/+|\/+$/g, "")}/`;
    const relevant = (path) => path.startsWith(prefix());
    const handler = (file) => {
      if (relevant(file.path)) this.scheduleRefresh();
    };
    this.registerEvent(this.app.vault.on("modify", handler));
    this.registerEvent(this.app.vault.on("create", handler));
    this.registerEvent(this.app.vault.on("delete", handler));
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (relevant(file.path) || relevant(oldPath)) this.scheduleRefresh();
      })
    );
  }
  scheduleRefresh() {
    if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = null;
      void this.refreshCards(false);
    }, 350);
  }
  setupStatusBar() {
    if (this.statusItem) {
      this.updateStatusBar();
      return;
    }
    const item = this.addStatusBarItem();
    item.classList.add("icm-status-bar");
    item.setAttribute("aria-label", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 MAX\xBB");
    item.setAttribute("role", "button");
    const flame = item.createSpan({ cls: "icm-status-flame" });
    setIconWithFallback2(flame, "flame", "\u{1F525}");
    this.statusText = item.createSpan({ cls: "icm-status-text" });
    item.addEventListener("click", () => void this.activateView());
    this.statusItem = item;
    this.updateStatusBar();
  }
  updateStatusBar() {
    if (!this.statusItem || !this.statusText) return;
    const today = dateKey(/* @__PURE__ */ new Date());
    const active = this.data.streak.lastDate === today;
    const todayStat = this.data.daily[today]?.reviews ?? 0;
    this.statusItem.style.display = this.settings.showStreakInStatusBar ? "" : "none";
    this.statusItem.classList.toggle("is-cold", !active);
    this.statusText.textContent = String(this.data.streak.current);
    this.statusItem.setAttribute(
      "title",
      active ? `\u{1F525} \u0421\u0435\u0440\u0438\u044F: ${this.data.streak.current} \u0434\u043D. \xB7 \u0441\u0435\u0433\u043E\u0434\u043D\u044F ${reviewsWord(todayStat)} \xB7 \u0440\u0435\u043A\u043E\u0440\u0434 ${this.data.streak.best}` : `\u{1F525} \u0421\u0435\u0440\u0438\u044F: ${this.data.streak.current} \u0434\u043D. \xB7 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0435\u0449\u0451 \u043D\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u043B \xB7 \u0440\u0435\u043A\u043E\u0440\u0434 ${this.data.streak.best}`
    );
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    let leaf = existing ?? null;
    if (!leaf) {
      leaf = import_obsidian2.Platform.isMobile ? this.app.workspace.getLeaf(false) : this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new import_obsidian2.Notice("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u0435\u043A MAX\xBB");
        return;
      }
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }
  async openFeed() {
    await this.activateView();
    const view = this.getView();
    if (view) view.openFeed();
    else window.setTimeout(() => this.getView()?.openFeed(), 50);
  }
  getView() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof CardsMaxView) return leaf.view;
    }
    return null;
  }
  async startReviewFromCommand() {
    await this.activateView();
    const view = this.getView();
    if (view) view.startReview();
    else window.setTimeout(() => this.getView()?.startReview(), 50);
  }
  refreshAllViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof CardsMaxView) leaf.view.render();
    }
  }
  openSettings() {
    const host = this.app;
    if (host.setting?.open && host.setting?.openTabById) {
      host.setting.open();
      host.setting.openTabById(this.manifest.id);
    } else {
      new import_obsidian2.Notice("\u041E\u0442\u043A\u0440\u043E\u0439 \xAB\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u2192 \u0421\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u0435 \u043F\u043B\u0430\u0433\u0438\u043D\u044B \u2192 \u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F MAX\xBB");
    }
  }
  confirmReset() {
    new ConfirmModal(
      this.app,
      "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0435\u0441\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441?",
      "\u0423\u0434\u0430\u043B\u044F\u0442\u0441\u044F \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 FSRS, \u0441\u0435\u0440\u0438\u044F \u{1F525}, \u0438\u0441\u0442\u043E\u0440\u0438\u044F, \u043B\u0430\u0439\u043A\u0438, \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0438 \u0441\u0432\u0430\u0439\u043F\u044B \u043B\u0435\u043D\u0442\u044B. Markdown-\u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u043E\u0441\u0442\u0430\u043D\u0443\u0442\u0441\u044F \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439.",
      () => void this.resetProgress()
    ).open();
  }
  async resetProgress() {
    this.data.cards = {};
    this.data.streak = { current: 0, best: 0, lastDate: null };
    this.data.daily = {};
    this.data.history = [];
    this.data.feed = defaultFeed();
    this.ensureFeed(false);
    await this.save();
    this.refreshAllViews();
    new import_obsidian2.Notice("\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \xAB\u041A\u0430\u0440\u0442\u043E\u0447\u0435\u043A MAX\xBB \u0438 \u043B\u0435\u043D\u0442\u044B \u0441\u0431\u0440\u043E\u0448\u0435\u043D");
  }
  getSettings() {
    return this.settings;
  }
  getSelectedDeck() {
    return this.data.selectedDeck;
  }
  getSelectedFilter() {
    return this.data.selectedFilter;
  }
  async setSelectedDeck(deck) {
    this.data.selectedDeck = deck && DECK_ORDER.includes(deck) ? deck : null;
    await this.save();
    this.regenerateFeed(true);
    this.refreshAllViews();
  }
  async setSelectedFilter(filter) {
    this.data.selectedFilter = filter;
    await this.save();
    this.refreshAllViews();
  }
  getStreak() {
    return this.data.streak;
  }
  getDaily() {
    return this.data.daily;
  }
  getRecentLogs(limit = 5) {
    return this.data.history.slice(0, limit);
  }
  getCardById(id) {
    return this.cards.find((card) => card.id === id);
  }
  getProgress(id) {
    return this.data.cards[id] ?? emptyProgress(Date.now());
  }
  getQueue(deck, filter) {
    const now = Date.now();
    let pool = this.cards;
    if (deck) pool = pool.filter((card) => card.deck === deck);
    const today = dateKey(new Date(now));
    const introducedToday = this.data.daily[today]?.newCards ?? 0;
    const newLimit = this.settings.newPerDay > 0 ? Math.max(0, this.settings.newPerDay - introducedToday) : Number.POSITIVE_INFINITY;
    const fresh = pool.filter((card) => this.getProgress(card.id).reps === 0);
    const due = pool.filter((card) => isDue(this.getProgress(card.id), now));
    const passed = pool.filter((card) => isPassed(this.getProgress(card.id)));
    const mastered = pool.filter((card) => isMastered(this.getProgress(card.id), now));
    let queue;
    switch (filter) {
      case "new":
        queue = fresh;
        break;
      case "passed":
        queue = passed;
        break;
      case "mastered":
        queue = mastered;
        break;
      case "all":
        queue = [...pool];
        break;
      case "due":
      default:
        queue = [...due, ...fresh.slice(0, newLimit)];
        break;
    }
    return this.sortQueue(queue, deck, now);
  }
  sortQueue(queue, deck, now) {
    const rank = (card) => {
      const p2 = this.getProgress(card.id);
      if (p2.reps === 0) return 1;
      if (p2.due <= now) return 0;
      return 2;
    };
    return [...queue].sort((a, b) => {
      if (this.settings.groupByDeck && !deck) {
        const dr = deckRank(a.deck) - deckRank(b.deck);
        if (dr !== 0) return dr;
      }
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const pa = this.getProgress(a.id);
      const pb = this.getProgress(b.id);
      if (pa.reps > 0 && pb.reps > 0 && pa.due !== pb.due) return pa.due - pb.due;
      if (a.order !== b.order) return a.order - b.order;
      return a.path.localeCompare(b.path, "ru");
    });
  }
  statsFor(cards, name) {
    const now = Date.now();
    return {
      name,
      total: cards.length,
      due: cards.filter((card) => isDue(this.getProgress(card.id), now)).length,
      fresh: cards.filter((card) => !isPassed(this.getProgress(card.id))).length,
      passed: cards.filter((card) => isPassed(this.getProgress(card.id))).length,
      mastered: cards.filter((card) => isMastered(this.getProgress(card.id), now)).length
    };
  }
  getDeckStats() {
    return DECK_ORDER.map((name) => this.statsFor(this.cards.filter((card) => card.deck === name), name));
  }
  getFeedStats() {
    const impressions = Object.values(this.data.feed.impressions);
    return {
      likes: impressions.filter((item) => item.liked).length,
      comments: impressions.filter((item) => item.comment).length,
      skips: impressions.filter((item) => item.skipped).length,
      cycle: this.data.feed.cycle
    };
  }
  getOverallStats() {
    const base = this.statsFor(this.cards, "\u0412\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B");
    const dontKnow = Object.values(this.data.cards).filter((p2) => p2.dontKnow).length;
    const afterReveal = Object.values(this.data.cards).filter((p2) => p2.answeredAfterReveal).length;
    const feed = this.getFeedStats();
    return {
      ...base,
      name: "\u0412\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B",
      dontKnow,
      afterReveal,
      feedLikes: feed.likes,
      feedComments: feed.comments,
      feedSkips: feed.skips,
      feedCycle: feed.cycle
    };
  }
  /* ---------------------------------- Лента ---------------------------------- */
  getFeedState() {
    return this.data.feed;
  }
  getCurrentFeedCard() {
    const feed = this.data.feed;
    const id = feed.order[feed.index];
    return id ? this.getCardById(id) : void 0;
  }
  getCurrentFeedImpression() {
    const card = this.getCurrentFeedCard();
    if (!card) return null;
    return this.getFeedImpression(card.id, this.data.feed.cycle, true);
  }
  getFeedLikes(cardId) {
    return Object.values(this.data.feed.impressions).filter((item) => item.cardId === cardId && item.liked).length;
  }
  getFeedComments(cardId) {
    return Object.values(this.data.feed.impressions).filter((item) => item.cardId === cardId && item.comment).map((item) => item.comment).sort((a, b) => b.at - a.at);
  }
  buildFeedOrder(deck) {
    const pool = deck ? this.cards.filter((card) => card.deck === deck) : [...this.cards];
    const byQuestion = /* @__PURE__ */ new Map();
    for (const card of pool) {
      if (!byQuestion.has(card.questionKey)) byQuestion.set(card.questionKey, card);
    }
    let items = [...byQuestion.values()];
    if (this.settings.feedShuffle) {
      items = shuffled(items);
    } else {
      items.sort((a, b) => deckRank(a.deck) - deckRank(b.deck) || a.order - b.order || a.path.localeCompare(b.path, "ru"));
    }
    const size = this.settings.feedCycleSize > 0 ? Math.min(this.settings.feedCycleSize, items.length) : items.length;
    return items.slice(0, size).map((card) => card.id);
  }
  dedupeFeedOrder(order) {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    for (const id of order) {
      const card = this.getCardById(id);
      if (!card || seen.has(card.questionKey)) continue;
      seen.add(card.questionKey);
      result.push(id);
    }
    return result;
  }
  ensureFeed(incrementCycle) {
    const feed = this.data.feed;
    const deck = this.data.selectedDeck;
    const valid = new Set(this.cards.map((card) => card.id));
    let order = this.dedupeFeedOrder(feed.order.filter((id) => valid.has(id)));
    const deckChanged = feed.deck !== deck;
    if (order.length === 0 || deckChanged || incrementCycle) {
      if (incrementCycle || deckChanged) feed.cycle += 1;
      order = this.buildFeedOrder(deck);
      feed.index = 0;
      feed.deck = deck;
    }
    feed.order = this.dedupeFeedOrder(order);
    if (feed.index >= feed.order.length) feed.index = Math.max(0, feed.order.length - 1);
    if (feed.order.length) {
      this.getFeedImpression(feed.order[feed.index], feed.cycle, true);
    }
  }
  regenerateFeed(incrementCycle = true) {
    this.ensureFeed(incrementCycle);
    void this.save();
    this.refreshAllViews();
  }
  nextFeed(saveAndRefresh = true) {
    const feed = this.data.feed;
    if (!feed.order.length) {
      this.ensureFeed(false);
      if (saveAndRefresh) {
        void this.save();
        this.refreshAllViews();
      }
      return;
    }
    feed.index += 1;
    if (feed.index >= feed.order.length) {
      feed.cycle += 1;
      feed.order = this.buildFeedOrder(feed.deck);
      feed.index = 0;
    }
    if (feed.order.length) this.getFeedImpression(feed.order[feed.index], feed.cycle, true);
    if (saveAndRefresh) {
      void this.save();
      this.refreshAllViews();
    }
  }
  prevFeed() {
    const feed = this.data.feed;
    if (feed.index > 0) feed.index -= 1;
    if (feed.order.length) this.getFeedImpression(feed.order[feed.index], feed.cycle, true);
    void this.save();
    this.refreshAllViews();
  }
  toggleFeedLike() {
    const card = this.getCurrentFeedCard();
    if (!card) return false;
    const impression = this.getCurrentFeedImpression();
    if (!impression) return false;
    const wasLiked = impression.liked;
    impression.liked = !wasLiked;
    impression.at = Date.now();
    this.syncFeedComment(impression);
    this.adjustDaily("feedLikes", wasLiked ? -1 : 1);
    void this.save();
    this.refreshAllViews();
    return !wasLiked;
  }
  saveFeedComment(text) {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const impression = this.getCurrentFeedImpression();
    if (!impression) return false;
    const isNew = !impression.comment;
    impression.comment = this.makeFeedComment(impression, trimmed);
    impression.at = Date.now();
    if (isNew) this.adjustDaily("feedComments", 1);
    void this.save();
    this.refreshAllViews();
    return true;
  }
  deleteFeedComment() {
    const impression = this.getCurrentFeedImpression();
    if (!impression?.comment) return false;
    impression.comment = null;
    impression.at = Date.now();
    this.adjustDaily("feedComments", -1);
    void this.save();
    this.refreshAllViews();
    return true;
  }
  skipFeed() {
    const impression = this.getCurrentFeedImpression();
    if (impression && impression.rating === null) {
      const firstSkip = !impression.skipped;
      impression.skipped = true;
      if (impression.outcome === "pending" && !impression.answeredBeforeReveal) {
        impression.outcome = impression.usedHint ? "hint-only" : "skipped";
      }
      impression.at = Date.now();
      this.syncFeedComment(impression);
      if (firstSkip) this.adjustDaily("feedSkips", 1);
    }
    this.nextFeed(false);
    void this.save();
    this.refreshAllViews();
  }
  getFeedImpression(cardId, cycle, create) {
    const key = `${cycle}:${cardId}`;
    const existing = this.data.feed.impressions[key];
    if (existing) return existing;
    if (!create) return null;
    const card = this.getCardById(cardId);
    if (!card) return null;
    const impression = {
      key,
      cardId,
      deck: card.deck,
      title: card.title,
      cycle,
      at: Date.now(),
      liked: false,
      comment: null,
      outcome: "pending",
      answered: false,
      answeredBeforeReveal: false,
      usedHint: false,
      hintKind: null,
      rating: null,
      effectiveRating: null,
      answeredAfterReveal: false,
      skipped: false
    };
    this.data.feed.impressions[key] = impression;
    this.pruneFeedImpressions();
    return impression;
  }
  makeFeedComment(impression, text) {
    return {
      text,
      at: Date.now(),
      cycle: impression.cycle,
      outcome: impression.outcome,
      answered: impression.answered,
      answeredBeforeReveal: impression.answeredBeforeReveal,
      usedHint: impression.usedHint,
      hintKind: impression.hintKind,
      rating: impression.rating,
      effectiveRating: impression.effectiveRating,
      answeredAfterReveal: impression.answeredAfterReveal,
      skipped: impression.skipped
    };
  }
  syncFeedComment(impression) {
    if (!impression.comment) return;
    impression.comment.outcome = impression.outcome;
    impression.comment.answered = impression.answered;
    impression.comment.answeredBeforeReveal = impression.answeredBeforeReveal;
    impression.comment.usedHint = impression.usedHint;
    impression.comment.hintKind = impression.hintKind;
    impression.comment.rating = impression.rating;
    impression.comment.effectiveRating = impression.effectiveRating;
    impression.comment.answeredAfterReveal = impression.answeredAfterReveal;
    impression.comment.skipped = impression.skipped;
    impression.comment.cycle = impression.cycle;
  }
  pruneFeedImpressions() {
    const impressions = this.data.feed.impressions;
    const keys = Object.keys(impressions);
    if (keys.length <= FEED_IMPRESSION_LIMIT) return;
    keys.sort((a, b) => impressions[b].at - impressions[a].at).slice(FEED_IMPRESSION_LIMIT).forEach((key) => delete impressions[key]);
  }
  /** Обновить «ответил / не ответил» прямо во время ввода в режиме ленты. */
  recordFeedAnswer(cycle, cardId, answer, typedAfterReveal) {
    const impression = this.getFeedImpression(cardId, cycle, true);
    if (!impression || impression.rating !== null) return;
    impression.answered = answer.trim().length > 0;
    impression.answeredAfterReveal = typedAfterReveal;
    if (impression.answered && !impression.answeredBeforeReveal) {
      impression.outcome = "answered-after-reveal";
    } else if (!impression.answered && impression.usedHint) {
      impression.outcome = "hint-only";
    }
    impression.at = Date.now();
    this.syncFeedComment(impression);
  }
  /** Пользователь раскрыл подсказку в ленте, но ещё не поставил оценку. */
  recordFeedHint(cycle, cardId, hintKind, answerAtReveal) {
    const impression = this.getFeedImpression(cardId, cycle, true);
    if (!impression || impression.rating !== null) return;
    const before = answerAtReveal.trim().length > 0;
    impression.hintKind = hintKind;
    impression.answeredBeforeReveal = before;
    impression.answered = before;
    impression.usedHint = !before;
    impression.outcome = before ? "pending" : "hint-only";
    impression.skipped = false;
    impression.at = Date.now();
    this.syncFeedComment(impression);
    void this.save();
  }
  recordFeedSolve(request, effectiveRating) {
    if (!request.feed) return;
    const card = this.getCardById(request.cardId);
    if (!card) return;
    const impression = this.getFeedImpression(card.id, request.feed.cycle, true);
    if (!impression) return;
    const hintKind = request.revealKind;
    const answeredBeforeReveal = request.answerAtReveal.trim().length > 0;
    const hasAnswer = request.answer.trim().length > 0;
    impression.outcome = answeredBeforeReveal ? "solved" : hasAnswer ? "answered-after-reveal" : "hint-only";
    impression.skipped = false;
    impression.answered = hasAnswer;
    impression.answeredBeforeReveal = answeredBeforeReveal;
    impression.usedHint = !answeredBeforeReveal;
    impression.hintKind = hintKind;
    impression.rating = request.rating;
    impression.effectiveRating = effectiveRating;
    impression.answeredAfterReveal = request.typedAfterReveal;
    impression.at = Date.now();
    this.syncFeedComment(impression);
  }
  /* ------------------------------- Повторение -------------------------------- */
  async grade(request) {
    const card = this.getCardById(request.cardId);
    if (!card) return null;
    const now = Date.now();
    const previous = this.data.cards[card.id] ?? createEmptyProgress(now);
    const wasNew = previous.reps === 0;
    const afterRevealPenalty = request.typedAfterReveal && this.settings.countAnswerAfterRevealAsAgain;
    const chosenRating = request.rating;
    const effectiveRating = afterRevealPenalty ? RATING_AGAIN : chosenRating;
    const result = gradeCard(previous, effectiveRating, now, this.settings);
    const next = {
      ...previous,
      ...result.progress,
      firstReviewed: previous.firstReviewed ?? now,
      reviewCount: previous.reviewCount + 1,
      lastRating: chosenRating,
      effectiveRating,
      lastAnswer: request.answer,
      answeredAfterReveal: request.typedAfterReveal,
      dontKnow: request.revealKind === "dont-know" || request.answerAtReveal.trim().length === 0,
      typedAfterRevealCount: previous.typedAfterRevealCount + (request.typedAfterReveal ? 1 : 0),
      dontKnowCount: previous.dontKnowCount + (request.revealKind === "dont-know" ? 1 : 0)
    };
    this.data.cards[card.id] = next;
    this.recordDaily(now, wasNew, request);
    this.updateStreak(now);
    this.recordFeedSolve(request, effectiveRating);
    const entry = {
      cardId: card.id,
      deck: card.deck,
      title: card.title,
      at: now,
      rating: chosenRating,
      effectiveRating,
      answeredAfterReveal: request.typedAfterReveal,
      dontKnow: next.dontKnow,
      scheduledDays: result.scheduledDays,
      state: result.state
    };
    this.data.history.unshift(entry);
    this.data.history = this.data.history.slice(0, HISTORY_LIMIT);
    await this.save();
    this.refreshAllViews();
    if (afterRevealPenalty) {
      new import_obsidian2.Notice("\u041E\u0442\u0432\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D, \u043D\u043E \u0434\u043B\u044F FSRS \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u043D \u043A\u0430\u043A \xAB\u0421\u043D\u043E\u0432\u0430\xBB (Again)");
    }
    if (!this.settings.autoNext) return null;
    const queue = this.getQueue(this.data.selectedDeck, this.data.selectedFilter);
    return queue.find((candidate) => candidate.id !== card.id) ?? null;
  }
  dailyStat(key) {
    return this.data.daily[key] ?? {
      reviews: 0,
      newCards: 0,
      dontKnow: 0,
      afterReveal: 0,
      feedLikes: 0,
      feedComments: 0,
      feedSkips: 0
    };
  }
  adjustDaily(field, delta) {
    const key = dateKey(/* @__PURE__ */ new Date());
    const stat = this.dailyStat(key);
    stat[field] = Math.max(0, stat[field] + delta);
    this.data.daily[key] = stat;
  }
  recordDaily(now, wasNew, request) {
    const key = dateKey(new Date(now));
    const stat = this.dailyStat(key);
    stat.reviews += 1;
    if (wasNew) stat.newCards += 1;
    if (request.revealKind === "dont-know" || request.answerAtReveal.trim().length === 0) {
      stat.dontKnow += 1;
    }
    if (request.typedAfterReveal) stat.afterReveal += 1;
    this.data.daily[key] = stat;
  }
  updateStreak(now) {
    const today = dateKey(new Date(now));
    const streak = this.data.streak;
    if (streak.lastDate === today) return;
    const yesterday = dayOffsetKey(now, -1);
    streak.current = streak.lastDate === yesterday ? streak.current + 1 : 1;
    streak.best = Math.max(streak.best, streak.current);
    streak.lastDate = today;
  }
};
var CardsMaxSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.replaceChildren();
    containerEl.createEl("h2", { text: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F MAX" });
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "\u0420\u0443\u0441\u0441\u043A\u043E\u044F\u0437\u044B\u0447\u043D\u044B\u0435 \u043A\u043E\u043B\u043E\u0434\u044B, FSRS, \u0441\u0435\u0440\u0438\u044F, \u043B\u0435\u043D\u0442\u0430 \u0422\u0422 \u0438 \u0447\u0435\u0441\u0442\u043D\u0430\u044F \u043F\u043E\u043C\u0435\u0442\u043A\u0430 \u043E\u0442\u0432\u0435\u0442\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430."
    });
    new import_obsidian2.Setting(containerEl).setName("\u041F\u0443\u0442\u044C \u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C").setDesc("\u041F\u0430\u043F\u043A\u0430 \u0441 Markdown-\u0437\u0430\u043C\u0435\u0442\u043A\u0430\u043C\u0438 \u0432\u043D\u0443\u0442\u0440\u0438 vault.").addText(
      (text) => text.setPlaceholder(DEFAULT_CARDS_PATH).setValue(this.plugin.settings.cardsPath).onChange((value) => {
        void this.plugin.setSetting("cardsPath", value.trim() || DEFAULT_CARDS_PATH);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u041D\u043E\u0432\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0432 \u0434\u0435\u043D\u044C").setDesc("0 \u2014 \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F. \u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u043D\u0435 \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0443\u0436\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044B\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F.").addText((text) => {
      text.setPlaceholder("20").setValue(String(this.plugin.settings.newPerDay)).onChange((value) => {
        const n = Number.parseInt(value, 10);
        if (Number.isFinite(n) && n >= 0) void this.plugin.setSetting("newPerDay", n);
      });
      text.inputEl.type = "number";
      text.inputEl.min = "0";
    });
    new import_obsidian2.Setting(containerEl).setName("\u0416\u0435\u043B\u0430\u0435\u043C\u0430\u044F \u0437\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0435\u043C\u043E\u0441\u0442\u044C").setDesc("FSRS: 0.90 \u2014 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442. \u0412\u044B\u0448\u0435 \u2014 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u043E\u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0447\u0430\u0449\u0435.").addSlider(
      (slider) => slider.setLimits(0.8, 0.98, 0.01).setValue(this.plugin.settings.requestRetention).setDynamicTooltip().onChange((value) => void this.plugin.setSetting("requestRetention", value))
    );
    new import_obsidian2.Setting(containerEl).setName("\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B").setDesc("\u0412 \u0434\u043D\u044F\u0445. \u041F\u043E\u0441\u043B\u0435 \u044D\u0442\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0440\u0430\u0441\u0442\u0451\u0442.").addText((text) => {
      text.setPlaceholder("365").setValue(String(this.plugin.settings.maximumInterval)).onChange((value) => {
        const n = Number.parseInt(value, 10);
        if (Number.isFinite(n) && n >= 7) void this.plugin.setSetting("maximumInterval", n);
      });
      text.inputEl.type = "number";
      text.inputEl.min = "7";
    });
    new import_obsidian2.Setting(containerEl).setName("\u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u043E\u0432 (fuzz)").setDesc("\u041D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0440\u0430\u0437\u0431\u0440\u043E\u0441, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F \u043D\u0435 \u0441\u043A\u0430\u043F\u043B\u0438\u0432\u0430\u043B\u0438\u0441\u044C \u0432 \u043E\u0434\u0438\u043D \u0434\u0435\u043D\u044C.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableFuzz).onChange((value) => {
        void this.plugin.setSetting("enableFuzz", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0448\u0430\u0433\u0438 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F").setDesc("\u041C\u0438\u043D\u0443\u0442\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0434\u043B\u044F \u043D\u043E\u0432\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0438 \u043F\u043E\u0441\u043B\u0435 \xAB\u0421\u043D\u043E\u0432\u0430\xBB.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableShortTerm).onChange((value) => {
        void this.plugin.setSetting("enableShortTerm", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\xAB\u041D\u0435 \u0437\u043D\u0430\u044E \u043E\u0442\u0432\u0435\u0442\xBB \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0432\u0441\u044E \u0437\u0430\u043C\u0435\u0442\u043A\u0443").setDesc("\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u043B\u043D\u044B\u0439 Markdown \u0446\u0435\u043B\u0438\u043A\u043E\u043C: \u0432\u043E\u043F\u0440\u043E\u0441, \u044D\u0442\u0430\u043B\u043E\u043D \u0438 \u0432\u0441\u0435 \u0443\u0440\u043E\u0432\u043D\u0438 \u043E\u0431\u044A\u044F\u0441\u043D\u0435\u043D\u0438\u044F.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showFullNoteOnDontKnow).onChange((value) => {
        void this.plugin.setSetting("showFullNoteOnDontKnow", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u041E\u0442\u0432\u0435\u0442 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0430\u0437\u0430 \u2192 Again").setDesc(
      "\u0415\u0441\u043B\u0438 \u043F\u043E\u0441\u043B\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F \u043E\u0442\u0432\u0435\u0442 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C, \u043E\u043D \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B, \u043D\u043E FSRS \u043D\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u0435\u0442 \u0435\u0433\u043E \u043A\u0430\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E\u0435 \u0432\u043E\u0441\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.countAnswerAfterRevealAsAgain).onChange((value) => {
        void this.plugin.setSetting("countAnswerAfterRevealAsAgain", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u0410\u0432\u0442\u043E\u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435").setDesc("\u041F\u043E\u0441\u043B\u0435 \u043E\u0446\u0435\u043D\u043A\u0438 \u0441\u0440\u0430\u0437\u0443 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \u0438\u043B\u0438 \u043B\u0435\u043D\u0442\u044B.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoNext).onChange((value) => {
        void this.plugin.setSetting("autoNext", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u043A\u043E\u043B\u043E\u0434\u0430\u043C").setDesc("\u0412 \u0440\u0435\u0436\u0438\u043C\u0435 \xAB\u0412\u0441\u0435 \u043A\u043E\u043B\u043E\u0434\u044B\xBB \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0438\u0434\u0443\u0442 \u0431\u043B\u043E\u043A\u0430\u043C\u0438 \u043F\u043E \u0442\u0435\u043C\u0430\u043C, \u0430 \u043D\u0435 \u0432\u043F\u0435\u0440\u0435\u043C\u0435\u0436\u043A\u0443.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.groupByDeck).onChange((value) => {
        void this.plugin.setSetting("groupByDeck", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u041E\u0433\u043E\u043D\u0451\u043A \u0432 \u0441\u0442\u0440\u043E\u043A\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F").setDesc("\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u{1F525} \u0438 \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0441\u0435\u0440\u0438\u044E \u0432\u043D\u0438\u0437\u0443 \u043E\u043A\u043D\u0430 Obsidian.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showStreakInStatusBar).onChange((value) => {
        void this.plugin.setSetting("showStreakInStatusBar", value);
      })
    );
    containerEl.createEl("h3", { text: "\u041B\u0435\u043D\u0442\u0430 \u0422\u0422" });
    new import_obsidian2.Setting(containerEl).setName("\u041A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0432 \u043E\u0434\u043D\u043E\u043C \u043F\u0440\u043E\u0445\u043E\u0434\u0435 \u043B\u0435\u043D\u0442\u044B").setDesc(
      `0 \u2014 \u0432\u0441\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u043A\u043E\u043B\u043E\u0434\u044B. \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E ${DEFAULT_FEED_CYCLE_SIZE}. \u0412 \u043E\u0434\u043D\u043E\u043C \u043F\u0440\u043E\u0445\u043E\u0434\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043D\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0442\u0441\u044F.`
    ).addText((text) => {
      text.setPlaceholder(String(DEFAULT_FEED_CYCLE_SIZE)).setValue(String(this.plugin.settings.feedCycleSize)).onChange((value) => {
        const n = Number.parseInt(value, 10);
        if (Number.isFinite(n) && n >= 0) void this.plugin.setSetting("feedCycleSize", n);
      });
      text.inputEl.type = "number";
      text.inputEl.min = "0";
    });
    new import_obsidian2.Setting(containerEl).setName("\u041F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u0442\u044C \u043B\u0435\u043D\u0442\u0443").setDesc("\u0412\u044B\u043A\u043B. \u2014 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0438\u0434\u0443\u0442 \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0435 \u043A\u043E\u043B\u043E\u0434 \u0438 \u043D\u043E\u043C\u0435\u0440\u043E\u0432. \u0412\u043A\u043B. \u2014 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0431\u0435\u0437 \u043F\u043E\u0432\u0442\u043E\u0440\u043E\u0432 \u0432\u043D\u0443\u0442\u0440\u0438 \u043F\u0440\u043E\u0445\u043E\u0434\u0430.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.feedShuffle).onChange((value) => {
        void this.plugin.setSetting("feedShuffle", value);
      })
    );
    new import_obsidian2.Setting(containerEl).setName("\u041B\u0435\u043D\u0442\u0430").setDesc("\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443, \u043B\u0430\u0439\u043A\u0438, \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0438 \u0441\u0432\u0430\u0439\u043F\u044B.").addButton(
      (button) => button.setButtonText("\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043B\u0435\u043D\u0442\u0443").onClick(() => void this.plugin.openFeed())
    );
    new import_obsidian2.Setting(containerEl).setName("\u041F\u0430\u043D\u0435\u043B\u044C").setDesc("\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0431\u043E\u043A\u043E\u0432\u0443\u044E \u043F\u0430\u043D\u0435\u043B\u044C \u0441 \u043A\u043E\u043B\u043E\u0434\u0430\u043C\u0438 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435\u043C.").addButton(
      (button) => button.setButtonText("\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C").onClick(() => void this.plugin.activateView())
    );
    new import_obsidian2.Setting(containerEl).setName("\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441").setDesc("\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u0441\u0435\u0440\u0438\u044F, \u0438\u0441\u0442\u043E\u0440\u0438\u044F, \u043B\u0430\u0439\u043A\u0438 \u0438 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u0432 data.json \u043F\u043B\u0430\u0433\u0438\u043D\u0430. \u0417\u0430\u043C\u0435\u0442\u043A\u0438 \u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F.").addButton(
      (button) => button.setButtonText("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u2026").setWarning().onClick(() => this.plugin.confirmReset())
    );
    containerEl.createEl("hr");
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: `\u0412\u0435\u0440\u0441\u0438\u044F ${this.plugin.manifest.version} \xB7 ${cardsWord(this.plugin.cards.length)} \xB7 9 \u043A\u043E\u043B\u043E\u0434 \xB7 FSRS \u043E\u0442 ts-fsrs (MIT).`
    });
  }
};
var main_default = CardsMaxPlugin;
