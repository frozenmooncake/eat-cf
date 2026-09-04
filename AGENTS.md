# AGENTS.md

面向 AI 编码代理的项目说明。修改本项目前请先阅读本文件与 `PLANS.md`。

## 项目简介

华水美食盲盒-江淮是华水江淮餐厅抽菜小站，用于随机抽选餐厅窗口、面食/米饭、小吃街，展示菜单价位，并为窗口打分投票形成排行榜。前端为 Vite 多页面 Vue 3 应用（无路由），部署到 Cloudflare Pages；排行榜后端为 Cloudflare Worker + Upstash Redis。另有独立的本地后台项目 `../feedback-admin`，直连 Upstash 查看/处理用户提交的数据纠错反馈。

## 技术栈

- 前端：Vue 3（Composition API, `<script setup>`）+ Vite 多页面构建
- 样式：`src/style.css` 全局变量/基础样式 + 组件内 scoped 样式
- 后端：Cloudflare Worker（`worker/` 目录）+ Upstash Redis REST API
- 部署：Cloudflare Pages（静态输出 `dist/`）+ Workers

## 常用命令

- `npm run dev`：启动本地开发服务器，默认 `http://localhost:5173`
- `npm run build`：构建到 `dist/`
- `npm run preview`：预览构建产物，默认 `http://localhost:4173`
- `cd worker && npm run dev`：本地运行 Worker（需先配 `worker/.dev.vars`）
- `cd worker && npm run deploy`：部署 Worker
- 如果 Windows PowerShell 阻止 `npm.ps1`，使用对应的 `npm.cmd` 命令

## 目录结构

- `index.html`：首页入口（挂载 `HomeApp.vue`）
- `pages/`：`add`、`friends`、`note`、`menu`、`rank` 子页面（各自一个 HTML 入口）
- `404.html`：404 页（Vite 入口）
- `src/`
  - `style.css`：全局变量、reset、基础与组件样式
  - `config.js`：`API_BASE`（Worker 地址，可用 `VITE_API_BASE` 覆盖）
  - `api.js`：排行榜与反馈 API 封装（leaderboard / window / vote / feedback）
  - `levels.js`：等级定义与星级映射、票数汇总（众数定级）
  - `data.js`：餐厅/小吃街/米面数据与辅助函数
  - `menu-data.js`：菜单与价位数据
  - `utils.js`：`copyText` / `showToast`
  - `composables/useVote.js`：打分状态管理
  - `components/GlobalHeader.vue`、`components/VotePanel.vue`、`components/FeedbackDialog.vue`
  - `pages/*/main.js`：各页面入口，`createApp(App).mount('#app')`
  - `pages/*/*App.vue`：各页面组件
- `worker/`：后端（`index.js`、`wrangler.toml`、`package.json`），提供 `/leaderboard` `/window` `/vote` `/feedback`
- `public/`：Cloudflare Pages 的 `_headers` 和 `_redirects`
- `vite.config.js`：多页面入口 + Vue 插件
- `PLANS.md`：待实现功能和产品规划
- `../feedback-admin/`：独立本地反馈后台（直连 Upstash 读取 /feedback 写入的数据）

## 数据约定

- 餐厅数据按 `canteens` 组织，当前包含江淮餐厅和暂时为空的 2 餐厅
- 窗口数据位于 `canteens.<餐厅>.floors[楼层][窗口号]`，窗口名中的 `\n` 表示一窗多品
- 小吃街数据使用 `snackStalls`
- 米/面分类使用 `riceWindows` / `noodleWindows`（目前仅对江淮生效）
- 菜单与价格填写到 `menu-data.js`
- 等级定义在 `levels.js`：`bang`(夯/5星) > `top`(顶级/4星) > `elite`(人上人/3星) > `npc`(NPC/2星) > `bad`(拉完了/1星)
- 最终等级取票数众数（票数相同取星级高的），星级由等级映射

## 约定与注意事项

- 保持 Vue 3 `<script setup>` + 原生 JS 风格，不引入 UI 框架
- 新页面 = `pages/xxx.html` + `src/pages/xxx/main.js` + `src/pages/xxx/XxxApp.vue`，并把入口加入 `vite.config.js` 的 `input`
- 公共头部用 `GlobalHeader.vue`，打分用 `VotePanel.vue` 或复用 `useVote`
- 新增交互优先复用 `utils.js` 的 `copyText` / `showToast`
- Worker 前端通过 `src/config.js` 的 `API_BASE` 访问，默认同域 `/leaderboard`、`/window`、`/vote`、`/feedback`；本地 Vite 会代理到 `127.0.0.1:8787`，生产也可用 `VITE_API_BASE` 指向 Worker 域名
- 用户数据纠错反馈：前端用 `FeedbackDialog.vue` 提交到 Worker `POST /feedback`，存储到 Upstash（`feedback:index` ZSet + `feedback:{id}` JSON），查看/处理用独立本地项目 `../feedback-admin`
- Upstash 所有键统一带前缀 `hsj_huashui_meishimanghe_jianghuai_`，可安全复用其他项目的 Redis 数据库
- 修改抽选数据模型时同步检查 `data.js`、`menu-data.js`、首页抽选逻辑与 Worker 的等级键
- 排行榜需要 Worker + Upstash，纯静态托管无法实现限流与持久化
