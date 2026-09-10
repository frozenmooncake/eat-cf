import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PREFIX = 'hsj_huashui_meishimanghe_jianghuai_';
const key = (name) => `${PREFIX}${name}`;
const here = dirname(fileURLToPath(import.meta.url));
const apply = process.argv.includes('--apply');

const LEVELS = ['bang', 'top', 'elite', 'npc', 'bad'];
const TAGS = ['tasty', 'value', 'filling'];
// 小吃街摊位编号迁移 v2
// 旧布局(20 家，v1 迁移后的线上数据) -> 新布局(43 家，2026-09 导入补充数据后)
//   - 1..16 号摊位编号不变（部分改名，如 酥饼/合子摊->香酥烧饼、手工水饺->席胖胖）
//   - 旧 17(芝士火鸡面烤冷面) + 旧 18(烤冷面/蛋包火鸡面) 合并为新 17(罗山第一家...)
//   - 旧 19 -> 新 18，旧 20 -> 新 19
//   - 新增 20..43 号摊位（旧数据无票）
// 菜品按名称并集合并，旧 18 号的菜品下标需重映射到合并后的新 17 号
const WINDOW_RE = /^snack:1:(\d+)$/;
const DISH_RE = /^dish:snack:1:(\d+):(\d+)$/;
const OLD_MIN = 1;
const OLD_MAX = 20;
const MERGED_NUM = 17;
const MERGED_SRC_MIN = 17;
const MERGED_SRC_MAX = 18;
const OLD18_NUM = 18;
const OLD18_INDEX_MAP = [6, 14, 9, 15, 16, 17, 8, 18, 19, 20, 21, 12, 22, 23, 24, 25, 26, 27];
const MERGED_WINDOW_NAME = '罗山第一家（芝士火鸡面·烤冷面）';
const MARKER = key('migration:snack-vote-ids:v2');

function loadVars() {
  const raw = readFileSync(join(here, '.dev.vars'), 'utf8');
  const vars = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (match) vars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return vars;
}

const vars = loadVars();
const URL = String(vars.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
const TOKEN = String(vars.UPSTASH_REDIS_REST_TOKEN || '');
if (!URL || !TOKEN) throw new Error('worker/.dev.vars 缺少 UPSTASH_REDIS_REST_URL 或 UPSTASH_REDIS_REST_TOKEN');

async function command(args) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `Upstash 请求失败 (${res.status})`);
  return data.result;
}

async function pipeline(commands) {
  if (!commands.length) return [];
  const res = await fetch(`${URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  const data = await res.json();
  if (!res.ok || (data && !Array.isArray(data) && data.error)) {
    throw new Error((data && data.error) || `Upstash pipeline 请求失败 (${res.status})`);
  }
  if (!Array.isArray(data)) throw new Error('Upstash pipeline 响应格式错误');
  const results = data.map((item) => {
    if (item && item.error) throw new Error(item.error);
    return item && 'result' in item ? item.result : item;
  });
  return results;
}

function hashToObject(result) {
  const obj = {};
  if (!Array.isArray(result)) return obj;
  for (let i = 0; i < result.length; i += 1) {
    const value = Number(result[i + 1]);
    if (result[i] !== undefined && !Number.isNaN(value)) obj[result[i]] = value;
    i += 1;
  }
  return obj;
}

function windowDestNum(oldNum) {
  const n = Number(oldNum);
  if (!Number.isInteger(n) || n < OLD_MIN || n > OLD_MAX) return null;
  if (n >= MERGED_SRC_MIN && n <= MERGED_SRC_MAX) return MERGED_NUM;
  if (n > MERGED_SRC_MAX) return n - 1;
  return n;
}

function targetInfo(id) {
  let match = WINDOW_RE.exec(id);
  if (match) {
    const destNum = windowDestNum(match[1]);
    if (destNum === null) return null;
    return { kind: 'window', num: destNum, newId: `snack:1:${destNum}` };
  }

  match = DISH_RE.exec(id);
  if (match) {
    const oldNum = Number(match[1]);
    const oldIndex = Number(match[2]);
    const destNum = windowDestNum(oldNum);
    if (destNum === null) return null;

    let destIndex = oldIndex;
    if (oldNum === OLD18_NUM) {
      if (oldIndex < 0 || oldIndex >= OLD18_INDEX_MAP.length) return null;
      destIndex = OLD18_INDEX_MAP[oldIndex];
    } else if (oldIndex < 0) {
      return null;
    }

    return {
      kind: 'dish',
      num: destNum,
      dishIndex: destIndex,
      newId: `dish:snack:1:${destNum}:${destIndex}`,
    };
  }
  return null;
}

function cloneTargetMeta(raw, info) {
  if (!raw) return null;
  let obj;
  try {
    obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;
  const next = { ...obj, regionId: 'snack', floor: 1, num: info.num, kind: info.kind };
  if (info.kind === 'dish') {
    next.dishIndex = info.dishIndex;
    if (next.windowName && info.num === MERGED_NUM) next.windowName = MERGED_WINDOW_NAME;
  }
  return next;
}

function canonicalMeta(info) {
  const base = { regionId: 'snack', floor: 1, num: info.num };
  if (info.kind === 'window') return { ...base, kind: 'window' };
  return { ...base, kind: 'dish', dishIndex: info.dishIndex };
}

async function main() {
  const marker = await command(['GET', MARKER]);
  if (marker) {
    console.log('migration marker exists, nothing to do');
    return;
  }

  const indexIds = (await command(['SMEMBERS', key('vote:index')])) || [];
  const recordIndex = (await command(['ZRANGE', key('vote:record:index'), 0, -1])) || [];
  const records = [];
  for (let i = 0; i < recordIndex.length; i += 100) {
    const chunk = recordIndex.slice(i, i + 100);
    const rawRecords = await pipeline(chunk.map((id) => ['GET', key(`vote:record:${id}`)]));
    for (let j = 0; j < chunk.length; j += 1) {
      const raw = rawRecords[j];
      if (raw) {
        try {
          records.push(JSON.parse(raw));
        } catch {
          throw new Error(`评分记录 JSON 解析失败: ${chunk[j]}`);
        }
      }
    }
  }

  const aggregateMoves = [];
  const changedSourceIds = new Set();
  for (const id of indexIds) {
    const info = targetInfo(id);
    if (info && info.newId !== id) {
      aggregateMoves.push({ id, info });
      changedSourceIds.add(id);
    }
  }

  const recordMoves = [];
  for (const record of records) {
    const id = String(record.targetId || '');
    const info = targetInfo(id);
    if (info && info.newId !== id) recordMoves.push({ record, id, info });
  }

  const destIds = new Set(aggregateMoves.map((move) => move.info.newId));
  const snapshotIds = new Set([...changedSourceIds, ...destIds]);
  const snapshots = new Map();
  const snapshotIdList = [...snapshotIds];
  for (let i = 0; i < snapshotIdList.length; i += 100) {
    const chunk = snapshotIdList.slice(i, i + 100);
    const results = await pipeline(chunk.flatMap((id) => [
      ['HGETALL', key(`vote:counts:${id}`)],
      ['HGETALL', key(`vote:tags:${id}`)],
      ['GET', key(`vote:meta:${id}`)],
    ]));
    for (let j = 0; j < chunk.length; j += 1) {
      snapshots.set(chunk[j], {
        counts: hashToObject(results[j * 3]),
        tags: hashToObject(results[j * 3 + 1]),
        meta: results[j * 3 + 2] || null,
      });
    }
  }

  const destData = new Map();
  for (const move of aggregateMoves) {
    const old = snapshots.get(move.id);
    if (!destData.has(move.info.newId)) {
      destData.set(move.info.newId, { info: move.info, oldIds: [], counts: {}, tags: {} });
    }
    const dest = destData.get(move.info.newId);
    dest.oldIds.push(move.id);
    for (const field of Object.keys(old.counts)) {
      dest.counts[field] = (dest.counts[field] || 0) + old.counts[field];
    }
    for (const field of Object.keys(old.tags)) {
      dest.tags[field] = (dest.tags[field] || 0) + old.tags[field];
    }
  }

  const totalOldVotes = [...destData.values()]
    .reduce((sum, item) => sum + Object.values(item.counts).reduce((a, b) => a + b, 0), 0);
  const totalOldRecords = recordMoves.length;
  const commands = [];

  for (const sourceId of [...changedSourceIds].sort()) {
    commands.push(['DEL', key(`vote:counts:${sourceId}`), key(`vote:tags:${sourceId}`), key(`vote:meta:${sourceId}`)]);
  }
  if (changedSourceIds.size) {
    commands.push(['SREM', key('vote:index'), ...[...changedSourceIds].sort()]);
  }
  for (const [destId, item] of destData) {
    for (const field of LEVELS) {
      if (item.counts[field] > 0) commands.push(['HINCRBY', key(`vote:counts:${destId}`), field, item.counts[field]]);
    }
    for (const field of TAGS) {
      if (item.tags[field] > 0) commands.push(['HINCRBY', key(`vote:tags:${destId}`), field, item.tags[field]]);
    }
  }
  if (destData.size) {
    commands.push(['SADD', key('vote:index'), ...[...destData.keys()].sort()]);
  }
  for (const [destId, item] of [...destData].sort((a, b) => a[0].localeCompare(b[0]))) {
    const destWasSource = changedSourceIds.has(destId);
    const existing = snapshots.get(destId);
    let meta = null;
    if (!destWasSource && existing?.meta) {
      meta = existing.meta;
    } else {
      const sourceMeta = [...item.oldIds].sort().map((id) => snapshots.get(id)?.meta).find(Boolean);
      meta = JSON.stringify(cloneTargetMeta(sourceMeta, item.info) || canonicalMeta(item.info));
    }
    commands.push(['SET', key(`vote:meta:${destId}`), meta]);
  }
  for (const move of recordMoves) {
    const next = { ...move.record, targetId: move.info.newId };
    if (next.targetMeta && typeof next.targetMeta === 'object') {
      next.targetMeta = {
        ...next.targetMeta,
        num: move.info.num,
        ...(move.info.kind === 'dish' ? { dishIndex: move.info.dishIndex } : {}),
      };
    }
    commands.push(['SET', key(`vote:record:${move.record.id}`), JSON.stringify(next)]);
  }

  console.log(`mode: ${apply ? 'apply' : 'dry-run'}${apply ? '' : ' (no writes)'}`);
  console.log(`snack window/dish aggregate moves: ${aggregateMoves.length}`);
  console.log(`snack vote records to rewrite: ${recordMoves.length}`);
  console.log(`old aggregate votes: ${totalOldVotes}`);
  for (const move of [...aggregateMoves].sort((a, b) => a.id.localeCompare(b.id))) {
    const old = snapshots.get(move.id);
    const votes = Object.values(old.counts).reduce((a, b) => a + b, 0);
    console.log(`  ${move.id} (${votes} votes) -> ${move.info.newId}`);
  }
  for (const [destId, item] of [...destData].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  dest ${destId}: sources=${item.oldIds.join(',')} votes=${Object.values(item.counts).reduce((a, b) => a + b, 0)}`);
  }
  if (!aggregateMoves.length && !recordMoves.length) {
    console.log('nothing to migrate');
    return;
  }
  console.log(`planned pipeline commands: ${commands.length}`);
  if (!apply) {
    console.log('run with --apply to execute');
    return;
  }

  const markerPayload = JSON.stringify({
    at: new Date().toISOString(),
    aggregateMoves: aggregateMoves.length,
    recordMoves: recordMoves.length,
  });
  await pipeline([...commands, ['SET', MARKER, markerPayload]]);
  console.log('migration applied');
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
