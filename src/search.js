// 模糊搜索工具
// 规则：忽略大小写、空白与常见分隔符号；先做子串匹配，再退化为顺序子序列匹配。
// 多关键词（空格分隔）需全部命中。

export function normalizeKeyword(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[\s　]+/g, '')
    .replace(/[·、，,。.()（）［］\[\]【】{}<>/\\|+\-_~!！?？:：;；'"“”‘’]/g, '');
}

export function fuzzyMatch(text, keyword) {
  const q = normalizeKeyword(keyword);
  if (!q) return true;
  const t = normalizeKeyword(text);
  if (!t) return false;
  if (t.includes(q)) return true;

  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i += 1;
    if (i === q.length) return true;
  }
  return false;
}

export function fuzzyMatchAny(texts, keyword) {
  const raw = String(keyword || '').trim();
  if (!raw) return true;
  const tokens = raw.split(/[\s　]+/).filter(Boolean);
  const list = (texts || []).filter((text) => text !== null && text !== undefined && text !== '');
  return tokens.every((token) => list.some((text) => fuzzyMatch(text, token)));
}
