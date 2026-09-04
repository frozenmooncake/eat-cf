// Worker API 基础地址
// 默认同域（配合静态站 + Worker 反代 /leaderboard /window /vote 路径）
// 部署到独立 Worker 域名时，用环境变量覆盖: VITE_API_BASE=https://xxx.workers.dev
export const API_BASE = import.meta.env.VITE_API_BASE || '';