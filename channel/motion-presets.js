/* Scene-local motion recipes. Sample inside ChannelMotion.mount's draw callback. */
(function (global) {
  'use strict';
  const M = global.ChannelMotion;
  if (!M) throw new Error('Load channel/motion.js before motion-presets.js');
  const number = (value, name) => {
    if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
    return value;
  };
  const window = (at, duration) => {
    number(at, 'at'); number(duration, 'duration');
    if (at < 0 || duration <= 0) throw new RangeError('Motion window must be nonnegative and positive');
  };
  const point = (value, name) => {
    if (!value || typeof value !== 'object') throw new TypeError(`${name} must be a point`);
    return {x: number(value.x, `${name}.x`), y: number(value.y, `${name}.y`)};
  };
  const phase = (t, at, duration, direction = 'travel') => {
    const u = M.clamp((number(t, 'time') - at) / duration);
    return direction === 'enter' ? M.smooth(1 - (1 - u) ** 2)
      : direction === 'exit' ? M.smooth(u ** 2) : M.smooth(u);
  };
  const mix = (a, b, u) => a + (b - a) * u;

  function entrance({at, duration = .28, from = {x: 0, y: 32}, scale = .96,
    kind = 'slide', arc = 0} = {}) {
    window(at, duration); from = point(from, 'from');
    number(scale, 'scale'); number(arc, 'arc');
    if (!(scale > 0) || !['slide', 'scale', 'mask', 'arc', 'impact', 'foreground'].includes(kind)) throw new Error('Invalid entrance');
    return t => {
      const u = phase(t, at, duration, 'enter');
      const pose = {
        x: u === 1 ? 0 : from.x * (1 - u), y: u === 1 ? 0 : from.y * (1 - u) - (kind === 'arc' ? 4 * arc * u * (1 - u) : 0),
        scale: kind === 'slide' || kind === 'arc' ? 1 : mix(scale, 1, u), opacity: u,
      };
      if (kind === 'impact') pose.scale *= 1 - .02 * Math.sin(Math.PI * u);
      if (kind === 'mask') pose.clipPath = `inset(0 ${100 * (1 - u)}% 0 0)`;
      return pose;
    };
  }
  function exit({at, duration = .19, to = {x: 0, y: -32}, scale = .96,
    kind = 'directional'} = {}) {
    window(at, duration); to = point(to, 'to'); number(scale, 'scale');
    if (!(scale > 0) || !['directional', 'collapse', 'transfer', 'mask', 'accelerated', 'foreground'].includes(kind)) throw new Error('Invalid exit');
    return t => {
      const u = phase(t, at, duration, 'exit');
      const pose = {x: to.x * u, y: to.y * u,
        scale: kind === 'collapse' || kind === 'transfer' ? mix(1, scale, u) : 1, opacity: 1 - u};
      if (kind === 'mask') pose.clipPath = `inset(0 0 0 ${100 * u}%)`;
      return pose;
    };
  }
  function stagger({count, at, gap = .045, order = 'sequential', seed = 0} = {}) {
    window(at, gap);
    if (!Number.isInteger(count) || count < 1 || count > 100 || !Number.isInteger(seed)) throw new RangeError('Invalid stagger count or seed');
    if (!['sequential', 'reverse', 'center-out', 'wave', 'organic'].includes(order)) throw new Error('Invalid stagger order');
    const indices = Array.from({length: count}, (_, i) => i);
    if (order === 'reverse') indices.reverse();
    if (order === 'center-out') indices.sort((a, b) => Math.abs(a - (count - 1) / 2) - Math.abs(b - (count - 1) / 2) || a - b);
    if (order === 'wave') indices.sort((a, b) => Math.sin(a * Math.PI / Math.max(1, count - 1)) - Math.sin(b * Math.PI / Math.max(1, count - 1)) || a - b);
    if (order === 'organic') indices.sort((a, b) => (((a + seed) * 2654435761) >>> 0) - (((b + seed) * 2654435761) >>> 0));
    const times = M.stagger(count, at, gap);
    return Object.freeze(indices.map((index, rank) => [index, times[rank]])
      .sort((a, b) => a[0] - b[0]).map(([, time]) => time));
  }
  function emphasis({at, duration = .3, kind = 'pulse', amount = .04} = {}) {
    window(at, duration); number(amount, 'amount');
    if (amount < 0 || amount > .1 || !['pulse', 'impact', 'success', 'warning', 'receive', 'ripple', 'shake', 'glow', 'highlight'].includes(kind)) throw new Error('Invalid emphasis');
    return t => {
      const u = phase(t, at, duration), envelope = Math.sin(Math.PI * u), active = t >= at;
      if (kind === 'impact' || kind === 'receive') return {scale: M.impact(t, at, amount)};
      if (kind === 'shake' || kind === 'warning') return {x: active ? 8 * amount / .04 * envelope * Math.sin(u * Math.PI * 4) : 0,
        scale: 1, opacity: 1};
      if (kind === 'glow' || kind === 'highlight') return {scale: 1, opacity: 1, glow: envelope};
      if (kind === 'ripple') return {scale: 1 + amount * u, opacity: active ? 1 - u : 0};
      return {scale: 1 + amount * envelope, opacity: 1};
    };
  }
  function stateChange({at, duration = .3, from, to, profile = 'FAST'} = {}) {
    window(at, duration);
    if (!from || !to || Object.keys(from).length !== Object.keys(to).length ||
      Object.keys(from).some(key => !(key in to))) throw new Error('State shapes must match');
    const sample = M.state(from, [[at, to, profile, duration]]);
    return t => sample(number(t, 'time'));
  }
  function route({path, at, duration = .35, from = 0, to = 1, rotate = false} = {}) {
    window(at, duration); number(from, 'from'); number(to, 'to');
    if (from < 0 || from > 1 || to < 0 || to > 1 || !path) throw new RangeError('Route endpoints must be in [0,1]');
    const progress = M.travel(at, at + duration, from, to);
    const position = M.path(path, progress, {rotate});
    return t => ({packet: position(number(t, 'time')), route: {start: Math.min(from, progress(t)), end: Math.max(from, progress(t))}, progress: progress(t)});
  }
  function transfer({path, at, duration = .4, receiverAt = at + duration,
    receiverAmount = .025, from = 0, to = 1} = {}) {
    const journey = route({path, at, duration, from, to, rotate: true});
    window(receiverAt, .16); number(receiverAmount, 'receiverAmount');
    if (receiverAmount < 0 || receiverAmount > .08) throw new RangeError('Invalid receiver amount');
    return t => ({...journey(t), receiver: {scale: M.impact(t, receiverAt, receiverAmount)}});
  }
  function requestResponse({path, requestAt, requestDuration = .4, responseAt,
    responseDuration = .4} = {}) {
    const request = transfer({path, at: requestAt, duration: requestDuration});
    const response = route({path, at: responseAt, duration: responseDuration, from: 1, to: 0, rotate: true});
    if (responseAt < requestAt + requestDuration) throw new RangeError('Response cannot precede request arrival');
    return t => ({request: request(t), response: response(t)});
  }
  function broadcast({paths, at, duration = .4, gap = .045, order = 'sequential'} = {}) {
    if (!Array.isArray(paths) || !paths.length) throw new TypeError('Broadcast requires paths');
    const times = stagger({count: paths.length, at, gap, order});
    const legs = paths.map((path, i) => route({path, at: times[i], duration}));
    return t => legs.map(leg => leg(t));
  }
  function camera({at, duration = .45, from, to, center} = {}) {
    window(at, duration);
    const startScale = number(from?.scale ?? 1, 'from.scale');
    const endScale = number(to?.scale ?? 1, 'to.scale');
    from = point(from, 'from'); to = point(to, 'to');
    if (startScale <= 0 || endScale <= 0) throw new RangeError('Camera scale must be positive');
    const focus = t => {
      const u = phase(t, at, duration);
      return {x: mix(from.x, to.x, u), y: mix(from.y, to.y, u), scale: mix(startScale, endScale, u)};
    };
    return M.camera(focus, center);
  }
  function transition({kind, at, duration = .4, ...options} = {}) {
    window(at, duration);
    const supported = ['hard-cut', 'match-morph', 'directional-push', 'route-continuation', 'camera-reveal', 'zoom-reveal', 'iris'];
    if (!supported.includes(kind)) throw new Error('Invalid transition');
    if (kind === 'match-morph' && (!options.from || !options.to ||
      Object.keys(options.from).length !== Object.keys(options.to).length ||
      Object.keys(options.from).some(key => !Number.isFinite(options.from[key]) || !Number.isFinite(options.to[key])))) {
      throw new Error('Match morph requires matching numeric states');
    }
    if (kind === 'route-continuation' && typeof options.route !== 'function') throw new TypeError('Route continuation requires route sampler');
    if (kind === 'camera-reveal' && typeof options.focus !== 'function') throw new TypeError('Camera reveal requires focus sampler');
    if (kind === 'directional-push' && (![1, -1].includes(options.direction ?? 1) ||
      !Number.isFinite(options.distance ?? 1080))) throw new Error('Invalid directional push');
    return t => M.transition(kind, number(t, 'time'), at, duration, options);
  }
  function counter({hero, ratio = -.2} = {}) {
    if (typeof hero !== 'function' || !Number.isFinite(ratio) || Math.abs(ratio) > 1) throw new Error('Invalid counter-motion');
    return t => { const p = hero(t); return {x: (p.x ?? 0) * ratio, y: (p.y ?? 0) * ratio, scale: 1}; };
  }
  function ambient({at = 0, period = 3, amount = .01, phaseOffset = 0} = {}) {
    window(at, period); number(amount, 'amount'); number(phaseOffset, 'phaseOffset');
    if (amount < 0 || amount > .03) throw new RangeError('Ambient amplitude must be at most 3%');
    return t => ({scale: t < at ? 1 : 1 + amount * Math.sin(2 * Math.PI * ((number(t, 'time') - at) / period + phaseOffset))});
  }
  function compose(parts) {
    if (!parts || typeof parts !== 'object' || Object.values(parts).some(p => typeof p !== 'function')) throw new TypeError('Recipe parts must be samplers');
    return t => Object.fromEntries(Object.entries(parts).map(([name, sample]) => [name, sample(number(t, 'time'))]));
  }
  global.ChannelMotionPresets = Object.freeze({entrance, exit, stagger, emphasis, stateChange, route, transfer, requestResponse, broadcast, camera, transition, counter, ambient, compose});
})(globalThis);
