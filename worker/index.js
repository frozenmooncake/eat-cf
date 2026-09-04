// 华水美食盲盒-江淮 打分后端 (Cloudflare Worker + Upstash Redis)
//
// 限流规则:
//   - 窗口、菜品分开限流：每个 IP 每天每类最多打 3 次分
//   - 每类内部两次打分间隔至少 3 小时
//   - 每个 IP 每天最多提交 20 条数据反馈
//
// 数据模型 (Redis，所有键统一带前缀 KEY_PREFIX 防止与其他项目冲突):
//   {PREFIX}vote:counts:{targetId}    -> Hash 各等级票数 { bang, top, elite, npc, bad }
//   {PREFIX}vote:tags:{targetId}      -> Hash 标签票数 { tasty, value, filling }
//   {PREFIX}vote:meta:{targetId}      -> String 窗口或菜品元信息 JSON
//   {PREFIX}vote:index                -> Set 已被评分的对象 id
//   {PREFIX}vote:record:index         -> ZSet 评分记录 id，score=提交时间戳(ms)
//   {PREFIX}vote:record:{id}          -> String 评分事实 JSON
//   {PREFIX}rate:{scope}:{ipHash}:{YYYY-MM-DD} -> String 该类别当日已投票次数 (scope=window/dish)
//   {PREFIX}rate:{scope}:{ipHash}:last -> String 该类别上次投票时间戳 (ms)
//   {PREFIX}feedback:index             -> ZSet 反馈 id，score=提交时间戳(ms)
//   {PREFIX}feedback:{id}              -> String 反馈详情 JSON
//   {PREFIX}comment:time                -> ZSet 留言 id，score=提交时间戳(ms)
//   {PREFIX}comment:hot                 -> ZSet 留言 id，score=点赞数
//   {PREFIX}comment:{id}                -> String 留言详情 JSON
//   {PREFIX}comment:reports             -> ZSet 被举报留言 id，score=举报数

const LEVELS = ['bang', 'top', 'elite', 'npc', 'bad'];
const VOTE_TAGS = ['tasty', 'value', 'filling'];
const FEEDBACK_TYPES = ['price', 'type', 'closed', 'name', 'dish', 'other'];
const DAILY_LIMIT = 3; // 每个 IP 每天每类（窗口/菜品）最多 3 次
const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 每类内部间隔 3 小时
const RATE_TTL_SECONDS = 2 * 24 * 60 * 60; // 48 小时
const FEEDBACK_DAILY_LIMIT = 20;
const COMMENT_MINUTE_LIMIT = 3;
const COMMENT_NICKNAME_LIMIT = 16;
const COMMENT_CONTENT_LIMIT = 256;
const COMMENT_PAGE_LIMIT = 50;

// 唯一前缀：华水美食盲盒-江淮 (huashui jianghuai)
const KEY_PREFIX = 'hsj_huashui_meishimanghe_jianghuai_';

// 给任意 Redis 键加统一前缀
const key = (name) => `${KEY_PREFIX}${name}`;

function createRedis(env) {
  async function command(args) {
    const res = await fetch(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || `Upstash 请求失败 (${res.status})`);
    }
    return data.result;
  }

  return {
    command,
    get: (name) => command(['GET', name]),
    smembers: (name) => command(['SMEMBERS', name]),
    eval: (script, keys, args) => command(['EVAL', script, keys.length, ...keys, ...args]),
    async hgetall(name) {
      const result = await command(['HGETALL', name]);
      if (!result) return {};
      const counts = {};
      for (let i = 0; i < result.length; i += 2) {
        counts[result[i]] = Number(result[i + 1]);
      }
      return counts;
    },
  };
}

function textLength(value) {
  return [...value].length;
}

function normalizeComment(raw) {
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function getComments(redis, sort, offset, limit, ipHash, publicId, adminPublicIds) {
  const index = sort === 'hot' ? key('comment:hot') : key('comment:time');
  const command = sort === 'oldest' ? 'ZRANGE' : 'ZREVRANGE';
  const ids = (await redis.command([command, index, offset, offset + limit - 1])) || [];
  const timeIds = (await redis.command(['ZRANGE', key('comment:time'), 0, -1])) || [];
  const floorById = new Map(timeIds.map((id, position) => [id, position + 1]));
  const items = [];
  for (const id of ids) {
    const item = normalizeComment(await redis.get(key(`comment:${id}`)));
    if (item) {
      if (floorById.has(id)) item.floor = floorById.get(id);
      item.liked = Boolean(await redis.command(['EXISTS', key(`comment:like:${id}:${ipHash}`)]));
      item.isMine = Boolean(publicId && item.publicId && item.publicId === publicId);
      item.isAdmin = Boolean(item.publicId && adminPublicIds.has(item.publicId));
      items.push(item);
    }
  }
  return items;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function hashIp(ip) {
  const input = new TextEncoder().encode(`${KEY_PREFIX}${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function getPublicId(request, env) {
  const ip = request.headers.get('CF-Connecting-IP');
  const secret = String(env.COMMENT_ID_SECRET || '');
  if (!ip || !secret) return '';
  const keyData = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', keyData, new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)]
    .slice(0, 6)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getAdminPublicIds(env) {
  return new Set(String(env.ADMIN_PUBLIC_IDS || '').split(',').map((id) => id.trim()).filter(Boolean));
}

function cors(res) {
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return new Response(res.body, { status: res.status, headers });
}

function json(data, status = 200) {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

function error(msg, status = 400) {
  return json({ error: msg }, status);
}

async function getWindowMeta(redis, id) {
  const raw = await redis.get(key(`vote:meta:${id}`));
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function getCounts(redis, id) {
  const counts = await redis.hgetall(key(`vote:counts:${id}`));
  return counts || {};
}

async function getTagCounts(redis, id) {
  const counts = await redis.hgetall(key(`vote:tags:${id}`));
  return counts || {};
}

async function getVoteState(redis, id) {
  const [counts, tagCounts] = await Promise.all([getCounts(redis, id), getTagCounts(redis, id)]);
  const total = Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0);
  return { id, counts, tagCounts, total };
}

async function recordVote(redis, ip, ipHash, publicId, id, level, meta, tags, scope) {
  const now = Date.now();
  const scopeLabel = scope === 'dish' ? '菜品' : '窗口';
  const recordId = `vote_${now}_${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
  const record = {
    id: recordId,
    targetId: id,
    level,
    tags,
    targetMeta: meta,
    ts: now,
    status: 'approved',
    ip,
    publicId,
  };
  const script = `
    local last = redis.call('GET', KEYS[2])
    if last and tonumber(ARGV[1]) - tonumber(last) < tonumber(ARGV[2]) then
      return {-1, tonumber(ARGV[2]) - (tonumber(ARGV[1]) - tonumber(last))}
    end

    local count = tonumber(redis.call('GET', KEYS[1]) or '0')
    if count >= tonumber(ARGV[3]) then
      return {-2, 0}
    end

    count = redis.call('INCR', KEYS[1])
    if count == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[4])
    end
    redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[4])
    redis.call('HINCRBY', KEYS[3], ARGV[5], 1)
    redis.call('SADD', KEYS[4], ARGV[6])
    if ARGV[7] ~= '' and redis.call('EXISTS', KEYS[5]) == 0 then
      redis.call('SET', KEYS[5], ARGV[7])
    end
    local tags = cjson.decode(ARGV[8])
    for _, tag in ipairs(tags) do
      redis.call('HINCRBY', KEYS[6], tag, 1)
    end
    redis.call('ZADD', KEYS[7], ARGV[1], ARGV[9])
    redis.call('SET', KEYS[8], ARGV[10])
    return {tonumber(ARGV[3]) - count, 0}
  `;

  const result = await redis.eval(
    script,
    [
      key(`rate:${scope}:${ipHash}:${today()}`),
      key(`rate:${scope}:${ipHash}:last`),
      key(`vote:counts:${id}`),
      key('vote:index'),
      key(`vote:meta:${id}`),
      key(`vote:tags:${id}`),
      key('vote:record:index'),
      key(`vote:record:${recordId}`),
    ],
    [now, COOLDOWN_MS, DAILY_LIMIT, RATE_TTL_SECONDS, level, id, meta ? JSON.stringify(meta) : '', JSON.stringify(tags), recordId, JSON.stringify(record)],
  );

  const status = Number(result[0]);
  if (status === -1) {
    const waitMin = Math.ceil(Number(result[1]) / 60000);
    return { error: `${scopeLabel}评分间隔未到，请 ${Math.max(1, waitMin)} 分钟后再评分` };
  }
  if (status === -2) {
    return { error: `每个 IP 每天最多对${scopeLabel}评分 3 次，明天再来吧` };
  }
  return { remaining: status };
}

// 校验反馈目标对象，返回规范化结构或 null
function buildFeedbackTarget(t) {
  if (!t || typeof t !== 'object') return null;
  const kind = String(t.kind || '');
  if (kind === 'window') {
    const regionId = String(t.regionId || '');
    const floor = Number(t.floor);
    const num = Number(t.num);
    const windowName = String(t.windowName || '').trim().slice(0, 80);
    if (!/^[a-z0-9_-]+$/.test(regionId) || !Number.isInteger(floor) || !Number.isInteger(num) || !windowName) return null;
    return { kind, regionId, floor, num, windowName };
  }
  if (kind === 'dish') {
    const base = buildFeedbackTarget({ ...t, kind: 'window' });
    if (!base) return null;
    const dishIndex = Number(t.dishIndex);
    const dishName = String(t.dishName || '').trim().slice(0, 80);
    if (!Number.isInteger(dishIndex) || dishIndex < 0 || !dishName) return null;
    return { ...base, kind: 'dish', dishIndex, dishName };
  }
  if (kind === 'snack') {
    const name = String(t.name || '').trim().slice(0, 80);
    if (!name) return null;
    return { kind, name };
  }
  return null;
}

async function handleRequest(request, env) {
  const redis = createRedis(env);

  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return cors(new Response(null, { status: 204 }));
  }

  // 排行榜：返回所有有票窗口与菜品的汇总
  if (request.method === 'GET' && url.pathname === '/leaderboard') {
    const ids = (await redis.smembers(key('vote:index'))) || [];
    const items = [];
    for (const id of ids) {
      const [counts, tagCounts, meta] = await Promise.all([
        getCounts(redis, id),
        getTagCounts(redis, id),
        getWindowMeta(redis, id),
      ]);
      items.push({ id, counts, tagCounts, meta });
    }
    items.sort((a, b) => {
      const totalA = Object.values(a.counts).reduce((s, n) => s + (Number(n) || 0), 0);
      const totalB = Object.values(b.counts).reduce((s, n) => s + (Number(n) || 0), 0);
      return totalB - totalA;
    });
    return json({ items });
  }

  // 单个窗口或菜品票数
  if (request.method === 'GET' && url.pathname === '/window') {
    const id = url.searchParams.get('id');
    if (!id) return error('缺少 id 参数');
    const state = await getVoteState(redis, id);
    const meta = await getWindowMeta(redis, id);
    return json({ ...state, meta });
  }

  // 投票
  if (request.method === 'POST' && url.pathname === '/vote') {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体格式错误');
    }

    const id = String(body.id || '');
    const level = String(body.level || '');
    if (!id) return error('缺少 id');
    const isWindowId = /^[a-z0-9_-]+:\d+:\d+$/.test(id);
    const isDishId = /^dish:[a-z0-9_-]+:\d+:\d+:\d+$/.test(id);
    if (!isWindowId && !isDishId) return error('无效的评分对象 id');
    if (!LEVELS.includes(level)) return error('无效的等级');
    const tags = Array.isArray(body.tags) ? [...new Set(body.tags.map(String))] : [];
    if (tags.length > VOTE_TAGS.length || tags.some((tag) => !VOTE_TAGS.includes(tag))) {
      return error('无效的评分标签');
    }

    let targetMeta = null;
    if (body.meta && typeof body.meta === 'object') {
      const regionId = String(body.meta.regionId || '');
      const floor = Number(body.meta.floor);
      const num = Number(body.meta.num);
      if (/^[a-z0-9_-]+$/.test(regionId) && Number.isInteger(floor) && Number.isInteger(num)) {
        targetMeta = { regionId, floor, num, kind: isDishId ? 'dish' : 'window' };
        if (isDishId) {
          const dishIndex = Number(body.meta.dishIndex);
          const dishName = String(body.meta.dishName || '').trim().slice(0, 80);
          const windowName = String(body.meta.windowName || '').trim().slice(0, 80);
          if (!Number.isInteger(dishIndex) || dishIndex < 0 || !dishName) return error('无效的菜品信息');
          Object.assign(targetMeta, { dishIndex, dishName, windowName });
        }
      }
    }

    const ipHash = await hashIp(ip);
    const publicId = await getPublicId(request, env);
    const limit = await recordVote(
      redis,
      ip,
      ipHash,
      publicId,
      id,
      level,
      targetMeta,
      tags,
      isDishId ? 'dish' : 'window',
    );
    if (limit.error) return error(limit.error, 429);
    const state = await getVoteState(redis, id);
    return json({
      ok: true,
      message: '评分成功',
      remaining: limit.remaining,
      ...state,
    });
  }

  // 提交数据反馈
  if (request.method === 'POST' && url.pathname === '/feedback') {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体格式错误');
    }

    const target = buildFeedbackTarget(body.target);
    if (!target) return error('无效的反馈对象');
    const type = String(body.type || '');
    if (!FEEDBACK_TYPES.includes(type)) return error('无效的反馈类型');
    const message = String(body.message || '').trim().slice(0, 300);

    const ipHash = await hashIp(ip);
    const now = Date.now();
    const id = `fb_${now}_${Math.random().toString(36).slice(2, 8)}`;
    const publicId = await getPublicId(request, env);
    const record = { id, target, type, message, ts: now, status: 'open', publicId };

    const script = `
      local count = tonumber(redis.call('INCR', KEYS[1]))
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      if count > tonumber(ARGV[2]) then
        return {-1}
      end
      redis.call('ZADD', KEYS[2], ARGV[3], ARGV[4])
      redis.call('SET', KEYS[3], ARGV[5])
      return {1}
    `;

    const result = await redis.eval(
      script,
      [
        key(`rate:fb:${ipHash}:${today()}`),
        key('feedback:index'),
        key(`feedback:${id}`),
      ],
      [RATE_TTL_SECONDS, FEEDBACK_DAILY_LIMIT, now, id, JSON.stringify(record)],
    );

    if (Number(result[0]) === -1) {
      return error('今日反馈次数已达上限，明天再来吧', 429);
    }

    return json({ ok: true, message: '反馈已提交，感谢帮助' });
  }

  // 留言列表
  if (request.method === 'GET' && url.pathname === '/comments') {
    const sort = ['newest', 'oldest', 'hot'].includes(url.searchParams.get('sort'))
      ? url.searchParams.get('sort')
      : 'newest';
    const offset = Math.max(0, Number.parseInt(url.searchParams.get('offset') || '0', 10) || 0);
    const limit = Math.min(COMMENT_PAGE_LIMIT, Math.max(1, Number.parseInt(url.searchParams.get('limit') || '20', 10) || 20));
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const publicId = await getPublicId(request, env);
    const items = await getComments(redis, sort, offset, limit, await hashIp(ip), publicId, getAdminPublicIds(env));
    return json({ items, nextOffset: items.length === limit ? offset + limit : null });
  }

  // 发布留言
  if (request.method === 'POST' && url.pathname === '/comments') {
    let body;
    try {
      body = await request.json();
    } catch {
      return error('请求体格式错误');
    }
    const nickname = String(body.nickname || '').trim() || '匿名食客';
    const content = String(body.content || '').trim();
    if (textLength(nickname) > COMMENT_NICKNAME_LIMIT) return error('昵称最多 16 字');
    if (!content) return error('留言内容不能为空');
    if (textLength(content) > COMMENT_CONTENT_LIMIT) return error('留言内容最多 256 字');
    const replyTo = String(body.replyTo || '').trim();
    if (replyTo && !/^comment_[a-z0-9_]+$/.test(replyTo)) return error('无效的回复对象');

    const now = Date.now();
    const id = `comment_${now}_${crypto.randomUUID().replaceAll('-', '').slice(0, 10)}`;
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipHash = await hashIp(ip);
    const publicId = await getPublicId(request, env);
    const script = `
      local record = cjson.decode(ARGV[5])
      if ARGV[4] ~= '' then
        local parent = redis.call('GET', KEYS[5])
        if not parent then return {-2} end
        local parentItem = cjson.decode(parent)
        record.replyTo = ARGV[4]
        record.replyToNickname = parentItem.nickname
      end
      local count = tonumber(redis.call('INCR', KEYS[1]))
      if count == 1 then redis.call('EXPIRE', KEYS[1], 60) end
      if count > tonumber(ARGV[1]) then return {-1} end
      local encoded = cjson.encode(record)
      redis.call('SET', KEYS[2], encoded)
      redis.call('ZADD', KEYS[3], ARGV[2], ARGV[3])
      redis.call('ZADD', KEYS[4], 0, ARGV[3])
      return {1, encoded}
    `;
    const draft = { id, nickname, content, ts: now, likes: 0, reports: 0, publicId };
    const result = await redis.eval(
      script,
      [
        key(`rate:comment:${ipHash}`),
        key(`comment:${id}`),
        key('comment:time'),
        key('comment:hot'),
        replyTo ? key(`comment:${replyTo}`) : key('comment:none'),
      ],
      [COMMENT_MINUTE_LIMIT, now, id, replyTo, JSON.stringify(draft)],
    );
    if (Number(result[0]) === -1) return error('每分钟最多发布 3 条留言，请稍后再试', 429);
    if (Number(result[0]) === -2) return error('要回复的留言不存在或已被删除', 404);
    return json({ ok: true, item: normalizeComment(result[1]) }, 201);
  }

  const commentPath = url.pathname.match(/^\/comments\/([^/]+)\/(like|report)$/);
  if (request.method === 'POST' && commentPath) {
    const [, id, action] = commentPath;
    if (!/^comment_[a-z0-9_]+$/.test(id)) return error('无效的留言 id');
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipHash = await hashIp(ip);
    const isLike = action === 'like';
    const publicId = isLike ? '' : await getPublicId(request, env);
    const script = `
      if redis.call('EXISTS', KEYS[1]) == 0 then return {0, 'not_found'} end
      local item = cjson.decode(redis.call('GET', KEYS[1]))
      local field = ARGV[1]
      if ARGV[4] ~= '' then item.lastReportPublicId = ARGV[4] end
      local active = 1
      if ARGV[3] == 'toggle' and redis.call('EXISTS', KEYS[2]) == 1 then
        redis.call('DEL', KEYS[2])
        item[field] = math.max(0, tonumber(item[field] or 0) - 1)
        active = 0
      else
        local marked
        if ARGV[3] == 'once' then
          marked = redis.call('SET', KEYS[2], '1', 'NX', 'EX', 2592000)
        else
          marked = redis.call('SET', KEYS[2], '1', 'NX')
        end
        if marked == false then return {-1, 'duplicate'} end
        item[field] = tonumber(item[field] or 0) + 1
      end
      local encoded = cjson.encode(item)
      redis.call('SET', KEYS[1], encoded)
      redis.call('ZADD', KEYS[3], item[field], ARGV[2])
      return {1, encoded, active}
    `;
    const result = await redis.eval(
      script,
      [
        key(`comment:${id}`),
        key(`comment:${action}:${id}:${ipHash}`),
        key(isLike ? 'comment:hot' : 'comment:reports'),
      ],
      [isLike ? 'likes' : 'reports', id, isLike ? 'toggle' : 'once', publicId],
    );
    if (Number(result[0]) === 0) return error('留言不存在', 404);
    if (Number(result[0]) === -1) return error(isLike ? '你已经赞过这条留言' : '你已经举报过这条留言', 409);
    return json({ ok: true, item: normalizeComment(result[1]), liked: isLike ? Number(result[2]) === 1 : undefined });
  }

  return error('Not Found', 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      console.error('worker error:', err);
      return error(`内部错误: ${err.message}`, 500);
    }
  },
};
