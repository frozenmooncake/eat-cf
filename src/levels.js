// 打分等级定义 — 等级映射星级（从高到低）
export const LEVELS = [
  { key: 'bang', name: '夯', stars: 5 },
  { key: 'top', name: '顶级', stars: 4 },
  { key: 'elite', name: '人上人', stars: 3 },
  { key: 'npc', name: 'NPC', stars: 2 },
  { key: 'bad', name: '拉完了', stars: 1 },
];

export const LEVEL_MAP = Object.fromEntries(LEVELS.map((level) => [level.key, level]));

export const VOTE_TAGS = [
  { key: 'tasty', name: '好吃' },
  { key: 'value', name: '实惠' },
  { key: 'filling', name: '量大' },
];

export const VOTE_TAG_MAP = Object.fromEntries(VOTE_TAGS.map((tag) => [tag.key, tag]));

export function summarizeTags(tagCounts) {
  return VOTE_TAGS
    .map((tag) => ({ ...tag, count: Number(tagCounts?.[tag.key]) || 0 }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count);
}

// 合并多个评分对象的标签票数（窗口 + 各菜品）
export function summarizeMergedTags(countGroups) {
  const merged = {};
  for (const tag of VOTE_TAGS) {
    merged[tag.key] = (countGroups || []).reduce(
      (sum, counts) => sum + (Number(counts?.[tag.key]) || 0),
      0,
    );
  }
  return summarizeTags(merged);
}

// 根据票数分布算出最终等级（众数，票相同则取星级高的）与星级
export function summarizeVotes(counts) {
  let bestKey = null;
  let bestCount = -1;
  let bestStars = -1;
  let total = 0;

  for (const level of LEVELS) {
    const count = counts?.[level.key] ?? 0;
    total += count;
    if (count > bestCount || (count === bestCount && level.stars > bestStars)) {
      bestCount = count;
      bestStars = level.stars;
      bestKey = level.key;
    }
  }

  if (!bestKey || total === 0) {
    return { level: null, stars: 0, total: 0 };
  }

  return { level: bestKey, stars: LEVEL_MAP[bestKey].stars, total };
}

// 窗口综合评分：窗口直接票按 3 倍权重计，每道菜品票按 1 倍权重计
export function summarizeWeightedVotes(windowCounts, dishCountsList = [], windowWeight = 3) {
  const merged = {};
  let windowTotal = 0;
  let dishTotal = 0;

  for (const level of LEVELS) {
    const direct = Number(windowCounts?.[level.key]) || 0;
    const dishes = (dishCountsList || []).reduce(
      (sum, counts) => sum + (Number(counts?.[level.key]) || 0),
      0,
    );
    windowTotal += direct;
    dishTotal += dishes;
    merged[level.key] = direct * windowWeight + dishes;
  }

  const summary = summarizeVotes(merged);
  return {
    ...summary,
    windowTotal,
    dishTotal,
    weightedTotal: windowTotal * windowWeight + dishTotal,
  };
}

// 生成星级文案，如 '★★★★☆'
export function starsText(stars) {
  const full = '★'.repeat(stars);
  const empty = '☆'.repeat(5 - stars);
  return `${full}${empty}`;
}
