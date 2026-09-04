// Worker API 基础地址
// 本地开发留空，由 Vite 代理到本地 Worker；生产默认指向已绑定的 Worker 自定义域名。
// 如改用其他部署方式，可通过环境变量覆盖：VITE_API_BASE=https://eat-cf-worker.xks3.eu.org
const DEFAULT_WORKER_BASE = 'https://eat-cf-worker.xks3.eu.org';
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.PROD ? DEFAULT_WORKER_BASE : '');
