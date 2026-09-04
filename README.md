# 华水美食盲盒-江淮

面向华水江淮校区的随机抽菜、菜单查询、评分排行榜和数据纠错站点。

## 区域与楼层

- `canting1`：一餐厅，一楼和二楼
- `canting2`：二餐厅，仅一楼；没有真实数据时保持空状态，不创建占位窗口或菜品
- `snack`：小吃街，仅一楼

`canting1`、`canting2`、`snack` 是持久化评分、反馈和排行榜目标使用的内部区域标识，不随展示名称变化。

## 数据约定

- 餐厅窗口维护在 `src/data.js` 的 `canteens` 中
- 菜单维护在 `src/menu-data.js` 的 `menuData` 中
- 小吃街摊位使用 `snackStalls`，菜单使用 `menuData.snackStreet.entries`
- 普通窗口评分目标为 `<regionId>:<floor>:<num>`
- 小吃街摊位评分目标为 `snack:1:<num>`，元数据 `kind` 为 `snack`
- 菜品评分目标为 `dish:<regionId>:<floor>:<num>:<dishIndex>`，元数据 `kind` 为 `dish`
- 菜品类型统一由 `inferDishType` 推导为 `rice`、`noodle` 或 `other`，首页和菜单页共用该规则
- 反馈类型白名单包括 `price`、`type`、`closed`、`name`、`dish_addition`、`dish`、`other`

## 留言板

留言板使用 Worker + Upstash Redis 独立存储，不迁移旧留言。昵称最多 16 个字符，留言内容最多 256 个字符，同一 IP 每分钟最多发布 3 条。留言按正序、倒序或点赞数排序，楼号按当前公开留言动态编号，删除后自动顺延；点赞可以取消，举报对同一 IP 和留言只接受一次。

内容命中敏感词/联系方式等疑似广告时先进入待审，不进入公开时间或热门索引；后台通过后才展示。Worker 可通过 `COMMENT_SENSITIVE_WORDS` 环境变量覆盖默认敏感词，用英文逗号分隔。留言使用 `comment:time`、`comment:hot`、`comment:pending`、`comment:reports` 和 `comment:{id}` Redis 键。后台按待审 → 举报数 → 最新的顺序处理，可审核通过、清除举报或删除留言。

## 评分与菜单缓存

- 菜单页的评分摘要使用本地缓存，最多每 6 小时刷新一次，期间直接读取缓存，不再请求 Worker
- Worker 的 `/leaderboard` 读缓存为 100 秒；单个 `/window` 查询缓存保持 15 秒
- 窗口综合评分 = 窗口直接评分按 3 倍权重 + 该窗口各菜品评分按 1 倍权重，再进行众数定级与标签汇总

## 本地验证

```powershell
node --check worker/index.js
node --check ..\feedback-admin\server.js
npm.cmd run build
```

排行榜和评分持久化依赖 Cloudflare Worker 与 Upstash Redis。Redis 键继续使用既有前缀 `hsj_huashui_meishimanghe_jianghuai_`，以保留现有评分和反馈数据。
