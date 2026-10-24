import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { readConfig } from '../../server/config.ts';
import { openVisuals } from '../../server/visual-store.ts';
import { openMotion, hashMotionSource } from '../../server/motion-store.ts';
import { hydrateMotion, validateMotion, scheduleMotion, expandMotionShot } from '../../workflow/motion.ts';
import { compileMotion } from '../../engine/compile-motion.ts';
import { inspectCreativeMotion } from '../../engine/quality/inspect-motion.ts';

const root = '.planning/deepseek-v41-flash-short/';
const receiptPath = root + 'receipt.json';
const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
const config = readConfig();
const visuals = openVisuals(config.dataDirectory, config.videosDirectory);
const store = openMotion(config.dataDirectory, config.videosDirectory);
try {
  const board = visuals.read(receipt.projectId, receipt.storyboardId);
  assert.equal(visuals.acceptance(receipt.projectId).stale, false);
  const baseId = store.latest(receipt.projectId);
  assert.equal(baseId, receipt.motionId ?? null, 'Inspect any newer motion proposal before replacing it.');
  const durations = [240, 300, 225, 330, 300, 180, 540];
  const shots = board.output.shots.map((source, index) => {
    const start = source.startFrame.shapes, end = source.endFrame.shapes;
    const available = new Set(end.map((_, i) => i));
    const objects = start.map((shape, startIndex) => {
      const candidates = [...available].filter(i => end[i].type === shape.type && end[i].label === shape.label);
      candidates.sort((a, b) => Math.abs(end[a].x - shape.x) + Math.abs(end[a].y - shape.y) - Math.abs(end[b].x - shape.x) - Math.abs(end[b].y - shape.y));
      const endIndex = candidates[0] ?? null;
      if (endIndex !== null) available.delete(endIndex);
      return { id: `object-${startIndex + 1}`, startIndex, endIndex };
    });
    for (const endIndex of available) objects.push({ id: `object-${objects.length + 1}`, startIndex: null, endIndex });
    assert(objects.length <= 16);
    const beats = [];
    const actor = object => object.startIndex === null ? end[object.endIndex] : start[object.startIndex];
    const final = object => end[object.endIndex];
    const byLabel = label => objects.find(o => actor(o).label === label || final(o)?.label === label);
    const atStart = i => objects.find(o => o.startIndex === i);
    const atEnd = i => objects.find(o => o.endIndex === i);
    const beat = (presetId, type, targetIds, from, to, parameters, purpose, importance = 'supporting') => {
      beats.push({ id: `beat-${beats.length + 1}`, presetId, type, targetIds, startFrame: from, endFrame: to, parameters, purpose, importance, narrationAnchor: null, continuity: null });
    };
    const snap = (o, from, to, values, purpose) => beat('snap-overshoot@1', 'transformation', [o.id], from, to, { to: values, anticipation: .94, overshoot: 1.035 }, purpose);
    const settle = (o, from, to, purpose) => {
      const target = final(o), initial = actor(o);
      const state = Object.fromEntries(['x', 'y', 'width', 'height', 'color'].filter(k => initial[k] !== target[k]).map(k => [k, target[k]]));
      if (Object.keys(state).length) snap(o, from, to, state, purpose);
    };
    const cascade = (actors, from, to, purpose) => {
      if (actors.length) beat('cascade@1', 'entry', actors.map(o => o.id), from, to, { staggerFrames: 2, offsetY: -2, overshoot: 1.035 }, purpose);
    };
    const hold = (from, to, purpose) => beat('hold@1', 'hold', ['camera'], from, to, {}, purpose);
    const punch = (o, from, to, purpose) => beat('punch-zoom@1', 'emphasis', ['camera'], from, to, { focusId: o.id, zoom: 1.09 }, purpose, 'primary');
    const exits = objects.filter(o => o.endIndex === null);
    const entries = objects.filter(o => o.startIndex === null);
    const changed = objects.filter(o => o.startIndex !== null && o.endIndex !== null && JSON.stringify(start[o.startIndex]) !== JSON.stringify(end[o.endIndex]));
    const handled = new Set();
    let exitTime = 24, entryTime = 60, changedTime = 36;
    if (index === 0) {
      changedTime = 6; entryTime = 60;
      hold(84, 132, 'Read the prepared reply at the owner desk');
      punch(atEnd(2), 138, 162, 'Emphasize the service deliverable');
    }
    if (index === 1) {
      changedTime = 48; entryTime = 122;
      hold(76, 112, 'Identify the repeated questions');
      hold(156, 220, 'Compare questions with the approved FAQ');
    }
    if (index === 2) {
      exitTime = 22; changedTime = 44;
      const sheet = atEnd(2), row = atEnd(3), n8n = atEnd(5);
      cascade([row, byLabel('Google Sheets')], 76, 94, 'The form becomes a new spreadsheet row');
      cascade([n8n, byLabel('n8n')], 120, 138, 'The new row activates the n8n station');
      for (const o of [row, byLabel('Google Sheets'), n8n, byLabel('n8n')]) handled.add(o.id);
      beat('flow-handoff@1', 'transformation', [row.id], 146, 166, { destinationId: n8n.id, reactionScale: 1.035 }, 'Pass the inquiry from the sheet into n8n', 'primary');
      snap(row, 174, 188, { x: final(row).x, y: final(row).y, opacity: 1 }, 'Keep the original sheet row as the stored record');
      hold(190, 224, 'Read the connected intake and automation stations');
    }
    if (index === 3) {
      const packet = atStart(3), n8n = atStart(5);
      beat('flow-handoff@1', 'transformation', [packet.id], 8, 28, { destinationId: n8n.id, reactionScale: 1.035 }, 'n8n receives the inquiry before the model call', 'primary');
      handled.add(packet.id); exitTime = 36;
      const inputActors = [atEnd(2), atEnd(3), atEnd(4), atEnd(5)];
      cascade(inputActors, 76, 98, 'Supply the customer question and approved FAQ');
      const modelActors = [atEnd(6), atEnd(7)];
      cascade(modelActors, 138, 156, 'Select the exact DeepSeek API model');
      const outputActors = [atEnd(8), atEnd(9), atEnd(10)];
      cascade(outputActors, 230, 250, 'Unpack the category and draft as structured fields');
      for (const o of [...inputActors, ...modelActors, ...outputActors]) handled.add(o.id);
      hold(104, 132, 'Read the question and approved knowledge source');
      punch(atEnd(6), 174, 198, 'Focus attention on the model call');
      hold(202, 226, 'Read the exact model identifier');
      hold(256, 329, 'Inspect structured output before accepting it');
    }
    if (index === 4) {
      const sheet = atEnd(2);
      beat('converge-assemble@1', 'transformation', exits.map(o => o.id), 20, 48, { resultId: sheet.id, overshoot: 1.035 }, 'Commit checked model output to the sheet', 'primary');
      for (const o of [...exits, sheet]) handled.add(o.id);
      changedTime = 76;
      for (const o of [atEnd(0), atEnd(1)]) handled.add(o.id);
      cascade([atEnd(3), atEnd(4)], 110, 128, 'Mark the original sheet row updated');
      cascade([atEnd(6), atEnd(7)], 154, 172, 'Notify the owner that a draft needs review');
      for (const i of [3, 4, 6, 7]) handled.add(atEnd(i).id);
      settle(atEnd(0), 220, 236, 'The owner checks and approves the reply');
      settle(atEnd(1), 242, 258, 'Only human approval opens the gate');
      hold(178, 210, 'Leave time for human review and editing');
      hold(266, 299, 'Hold the explicit human approval state');
    }
    if (index === 5) {
      changedTime = 36; entryTime = 94;
      hold(122, 179, 'Compare a draft with a question requiring owner input');
    }
    if (index === 6) {
      changedTime = 420; exitTime = 350; entryTime = 458;
      hold(6, 100, 'Present the setup and handover offer');
      punch(byLabel('Support?'), 118, 142, 'Show maintenance as an optional service');
      punch(atStart(6), 242, 266, 'Draw attention to hosting and API running costs');
      hold(160, 230, 'Explain the service scope before discussing costs');
      hold(280, 340, 'Agree responsibility for usage and hosting bills');
      hold(490, 539, 'Return to owner control of every reply');
    }
    const remainingExits = exits.filter(o => !handled.has(o.id));
    if (remainingExits.length) beat('snap-overshoot@1', 'exit', remainingExits.map(o => o.id), exitTime, exitTime + 14, { to: { opacity: 0 }, anticipation: .95, overshoot: 1.02 }, 'Clear the previous workflow state');
    for (const o of changed.filter(o => !handled.has(o.id))) settle(o, changedTime, changedTime + 18, 'Transform the inquiry into its next useful state');
    cascade(entries.filter(o => !handled.has(o.id)), entryTime, entryTime + 22, 'Reveal the next step of the business process');
    if ([0, 1].includes(index)) hold(durations[index] - 60, durations[index] - 1, 'Read the completed teaching state');
    beats.sort((a, b) => a.startFrame - b.startFrame);
    const incoming = { type: source.transition, overlapFrames: source.transition === 'reveal' ? 15 : 0, presentation: source.transition === 'continuous' ? 'shared' : source.transition === 'reveal' ? 'wipe' : 'cut', anchor: source.transition === 'continuous' ? { previousObjectId: 'object-1', objectId: 'object-1' } : null };
    return { durationFrames: durations[index], objects, beats, camera: { x: 0, y: 0, scale: 1, rotation: 0 }, incoming };
  });
  const plan = hydrateMotion({ shots }, board, hashMotionSource, undefined, '3', 'energetic');
  validateMotion(plan, board, hashMotionSource);
  const compiled = compileMotion(plan, board);
  const quality = inspectCreativeMotion(plan, board);
  const reviewedFindings = quality.findings.filter(finding => {
    if (finding.ruleId !== 'text-crowding') return false;
    const shotIndex = plan.shots.findIndex(shot => shot.id === finding.shotId);
    const [a, b] = finding.targetId.split('/').map(id => board.output.shots[shotIndex].endFrame.shapes[plan.shots[shotIndex].objects.find(object => object.id === id).endIndex]);
    return Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) === 0;
  }).map(finding => ({ id: finding.id, conclusion: 'Source label boxes only touch at an edge; floating-point world bounds trigger the overlap heuristic.' }));
  assert.equal(quality.findings.length, reviewedFindings.length, JSON.stringify(quality.findings));
  const schedule = scheduleMotion(plan);
  const validation = { frames: schedule.durationFrames, seconds: schedule.durationFrames / 30, objects: plan.shots.map(s => s.objects.length), expandedActions: plan.shots.map(s => expandMotionShot(s).actions.length), groups: compiled.groups.map(g => ({ actors: g.actors.length, expandedTargets: g.shots.reduce((n, x) => n + x.shot.actions.reduce((m, a) => m + a.targetIds.length, 0), 0) })), findings: quality.findings, reviewedFindings };
  writeFileSync(root + 'motion-validation.json', JSON.stringify(validation, null, 2) + '\n');
  const request = { storyboardId: board.id, baseId, shotId: null, interpreterVersion: '3', energyProfile: 'energetic', instruction: 'Codex-authored motion update for approved mobile readability board. Preserve choreography and estimated timing, shorten the flagged entrance. No narration anchors or production approval.' };
  const id = store.begin(receipt.projectId, request, 'codex-authored-motion-correction');
  try { store.complete(receipt.projectId, id, plan); } catch (error) { store.fail(receipt.projectId, id); throw error; }
  receipt.previousMotionId = receipt.motionId;
  receipt.motionId = id;
  receipt.motionModel = 'codex-authored-motion-correction';
  receipt.motionAuthorship = 'Directly authored using the installed interpreter and presets after two rejected gateway outputs.';
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  assert.equal(store.acceptance(receipt.projectId), null);
  assert(store.current(receipt.projectId, id));
  appendFileSync(root + 'progress.md', `Saved Codex-authored validated motion proposal ${id}; exact source/state/continuity/action-budget checks passed. ${validation.frames} frames / ${validation.seconds}s. Motion remains pending, no production authorization.\n`);
  console.log(JSON.stringify({ id, ...validation }));
} finally { store.close(); visuals.close(); }
