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

// 生成星级文案，如 '★★★★☆'
export function starsText(stars) {
  const full = '★'.repeat(stars);
  const empty = '☆'.repeat(5 - stars);
  return `${full}${empty}`;
}
