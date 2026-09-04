// Worker API 基础地址
// 本地开发留空，由 Vite 代理到本地 Worker；生产默认指向已绑定的 Worker 自定义域名。
const DEFAULT_WORKER_BASE = 'https://eat-cf-worker.xks3.eu.org';

function normalizeBase(value) {
  if (typeof value !== 'string') return '';
  const raw = value.trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    // 忽略误带空格/换行的无效 VITE_API_BASE，回退到默认 Worker 域名
    return '';
  }
}

// 如改用其他部署方式，可设置 VITE_API_BASE 覆盖默认 Worker 域名
export const API_BASE =
  normalizeBase(import.meta.env.VITE_API_BASE) ||
  (import.meta.env.PROD ? DEFAULT_WORKER_BASE : '');
