/* Channel motion v1. Pure scene-local seconds; GSAP owns playback and seeking.
 * Motion principles studied in Barty-Bart/motion-graphics (MIT); implementation
 * is independent and uses the channel's DOM, SVG routes and HyperFrames registry.
 */
(function (global) {
  'use strict';
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const finite = (v, name) => {
    if (!Number.isFinite(v)) throw new TypeError(`${name} must be finite`);
    return v;
  };
  const personalities = Object.freeze({
    MORPH: [18, .92], FAST: [28, .94], SLOW: [12, 1],
    SOFT: [15, 1], CAMERA: [9, 1], IMPACT: [26, .86],
  });
  function spring(seconds, profile = 'MORPH') {
    const p = personalities[profile];
    if (!p) throw new Error(`Unknown motion personality: ${profile}`);
    finite(seconds, 'seconds');
    if (seconds <= 0) return 0;
    const [w, z] = p, t = w * seconds;
    if (z === 1) return 1 - (1 + t) * Math.exp(-t);
    const d = Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * t) * (Math.cos(d * t) + z / d * Math.sin(d * t));
  }
  const smooth = u => { u = clamp(u); return u * u * u * (10 + u * (-15 + 6 * u)); };
  // A spring settles exactly at its declared end, with a smooth final correction.
  function response(t, duration, profile) {
    if (!(duration > 0)) throw new RangeError('duration must be positive');
    const u = clamp(t / duration), settle = smooth((u - .7) / .3);
    return spring(clamp(t, 0, duration), profile) * (1 - settle) + settle;
  }
  function track(initial, keys = [], profile = 'MORPH') {
    finite(initial, 'initial value');
    let previous = initial, lastTime = -Infinity;
    const changes = keys.map(([at, value, kind = profile, duration = 1]) => {
      finite(at, 'key time'); finite(value, 'key value'); finite(duration, 'duration');
      if (at < 0 || at < lastTime || duration <= 0 || !personalities[kind]) throw new Error('Invalid motion key');
      const delta = value - previous;
      previous = value; lastTime = at;
      return {at, delta, kind, duration};
    });
    return t => {
      finite(t, 'time');
      return changes.reduce((v, k) => v + k.delta * response(t - k.at, k.duration, k.kind), initial);
    };
  }
  function color(initial, keys = [], profile = 'SOFT') {
    const rgb = hex => {
      if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error('Colors must be six-digit hex');
      return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    };
    const start = rgb(initial), parsed = keys.map(([at, value, ...rest]) => [at, rgb(value), ...rest]);
    const channels = start.map((v, i) => track(v, parsed.map(([at, c, ...rest]) => [at, c[i], ...rest]), profile));
    return t => `rgb(${channels.map(f => Math.round(clamp(f(t), 0, 255))).join(',')})`;
  }
  function state(initial, keys = [], profile = 'MORPH') {
    for (const [, values] of keys) for (const key of Object.keys(values)) {
      if (!(key in initial)) throw new Error(`Missing initial property: ${key}`);
    }
    const channels = Object.entries(initial).map(([key, value]) => {
      const changes = keys.filter(k => key in k[1]).map(([at, values, ...rest]) => [at, values[key], ...rest]);
      return [key, (typeof value === 'number' ? track : color)(value, changes, profile)];
    });
    return t => Object.fromEntries(channels.map(([key, f]) => [key, f(t)]));
  }
  // Same-topology point sets. Arbitrary SVG path topology conversion is not implied.
  function geometry(from, to, progress) {
    if (from.length !== to.length || from.some((p, i) => p.length !== to[i].length)) throw new Error('Geometry topology differs');
    return from.map((p, i) => p.map((v, j) => finite(v, 'coordinate') + (finite(to[i][j], 'coordinate') - v) * progress));
  }
  function path(svgPath, progress, {rotate = false, stretch = 0} = {}) {
    const length = svgPath.getTotalLength();
    if (!(length > 0)) throw new Error('Route must have length');
    return t => {
      const u = clamp(progress(t)), p = svgPath.getPointAtLength(u * length);
      const a = svgPath.getPointAtLength(clamp(u - .001) * length);
      const b = svgPath.getPointAtLength(clamp(u + .001) * length);
      const speed = Math.abs(progress(t + .001) - progress(t - .001)) / .002;
      const s = 1 + Math.min(.045, speed * stretch);
      return {x: p.x, y: p.y, rotation: rotate ? Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI : 0, scaleX: s, scaleY: 1 / s};
    };
  }
  function travel(start, end, from = 0, to = 1) {
    if (![start, end, from, to].every(Number.isFinite) || end <= start) throw new Error('Invalid travel window');
    return t => from + (to - from) * smooth((t - start) / (end - start));
  }
  function visibility(t, enter = null, exit = null, duration = .24, blur = 0) {
    const a = enter === null ? 1 : smooth((t - enter) / duration);
    const b = exit === null ? 0 : smooth((t - exit) / duration);
    const opacity = a * (1 - b);
    return {opacity, blur: blur * (1 - opacity), scale: .97 + .03 * opacity};
  }
  function swap(t, at, duration = .36) {
    return {
      old: visibility(t, null, at, duration / 2, 7),
      next: visibility(t, at + duration / 2, null, duration / 2, 7),
    };
  }
  function impact(t, at, amount = .025) {
    return 1 - amount * (response(t - at, .16, 'FAST') - response(t - at - .16, .55, 'IMPACT'));
  }
  function camera(focus, center = {x: 540, y: 960}) {
    return t => {
      const {x, y, scale = 1} = focus(t);
      if (!(scale > 0)) throw new Error('Camera scale must be positive');
      return {x: center.x - x * scale, y: center.y - y * scale, scale, origin: '0 0'};
    };
  }
  // Leading/trailing endpoints can reverse direction independently.
  function edges(initial, keys) {
    const lead = track(initial, keys.map(([t, v]) => [t, v, 'FAST', .7]));
    const tail = track(initial, keys.map(([t, v]) => [t, v, 'SLOW', .95]));
    return t => ({start: Math.min(lead(t), tail(t)), end: Math.max(lead(t), tail(t))});
  }
  const stagger = (count, at, gap = .08) => Array.from({length: count}, (_, i) => at + i * gap);
  function transition(kind, t, at, duration = .6, options = {}) {
    const u = smooth((t - at) / duration), distance = options.distance ?? 1080;
    switch (kind) {
      case 'hard-cut': return {opacity: t >= at ? 1 : 0};
      case 'match-morph': return {...options.from, ...Object.fromEntries(Object.keys(options.from).map(k => [k, options.from[k] + (options.to[k] - options.from[k]) * u]))};
      case 'directional-push': return {x: (options.direction ?? 1) * distance * (1 - u)};
      case 'route-continuation': return options.route(t);
      case 'camera-reveal': return camera(options.focus, options.center)(t);
      case 'zoom-reveal': return {scale: 1.08 - .08 * u, opacity: u};
      case 'iris': return {clipPath: `circle(${u * 150}% at ${options.origin ?? '50% 50%'})`};
      default: throw new Error(`Unknown transition: ${kind}`);
    }
  }
  function apply(el, v) {
    if (!el) throw new Error('Motion target is missing');
    const s = el.style;
    if ('x' in v || 'y' in v || 'scale' in v || 'rotation' in v || 'scaleX' in v || 'scaleY' in v) {
      s.transform = `translate(${v.x ?? 0}px,${v.y ?? 0}px) rotate(${v.rotation ?? 0}deg) scale(${v.scaleX ?? v.scale ?? 1},${v.scaleY ?? v.scale ?? 1})`;
    }
    if ('origin' in v) s.transformOrigin = v.origin;
    if ('opacity' in v) s.opacity = clamp(v.opacity);
    if ('blur' in v) s.filter = v.blur > .01 ? `blur(${v.blur}px)` : 'none';
    for (const key of ['width', 'height', 'borderRadius']) if (key in v) s[key] = `${Math.max(0, v[key])}px`;
    for (const key of ['color', 'backgroundColor', 'borderColor', 'clipPath']) if (key in v) s[key] = v[key];
  }
  function routeReveal(el, start, end) {
    const length = el.getTotalLength(), a = clamp(start), b = clamp(end);
    el.style.strokeDasharray = `${Math.max(0, b - a) * length} ${length}`;
    el.style.strokeDashoffset = -a * length;
  }
  function mount(timeline, duration, draw) {
    finite(duration, 'scene duration');
    if (duration <= 0) throw new Error('Scene duration must be positive');
    // A setter is evaluated even when HyperFrames suppresses GSAP callbacks.
    // onUpdate alone silently freezes under seek(t, true).
    let current = 0;
    timeline.channelSeek = t => draw(clamp(finite(t, 'time'), 0, duration));
    const clock = {get time() { return current; }, set time(t) { current = t; timeline.channelSeek(t); }};
    timeline.fromTo(clock, {time: 0}, {time: duration, duration, ease: 'none', immediateRender: true, lazy: false}, 0);
    draw(0);
    return timeline;
  }
  global.ChannelMotion = Object.freeze({personalities, clamp, smooth, spring, track, color, state, geometry, path, travel, visibility, swap, impact, camera, edges, stagger, transition, apply, routeReveal, mount});
})(globalThis);
