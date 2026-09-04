# 华水美食盲盒-江淮

面向华水江淮校区的随机抽菜、菜单查询、评分排行榜和数据纠错站点。

## 区域与楼层

- `jianghuai`：江淮，一楼和二楼
- `canting2`：2餐厅，仅一楼；没有真实数据时保持空状态，不创建占位窗口或菜品
- `snack`：小吃街，仅一楼

`jianghuai` 是持久化评分、反馈和排行榜目标使用的内部区域标识，不随展示名称变化。

## 数据约定

- 餐厅窗口维护在 `src/data.js` 的 `canteens` 中
- 菜单维护在 `src/menu-data.js` 的 `menuData` 中
- 小吃街摊位使用 `snackStalls`，菜单使用 `menuData.snackStreet.entries`
- 普通窗口评分目标为 `<regionId>:<floor>:<num>`
- 小吃街摊位评分目标为 `snack:1:<num>`，元数据 `kind` 为 `snack`
- 菜品评分目标为 `dish:<regionId>:<floor>:<num>:<dishIndex>`，元数据 `kind` 为 `dish`
- 菜品类型统一由 `inferDishType` 推导为 `rice`、`noodle` 或 `other`，首页和菜单页共用该规则
- 反馈类型白名单包括 `price`、`type`、`closed`、`name`、`dish`、`other`

## 留言板

留言板使用 Worker + Upstash Redis 独立存储，不迁移旧留言。昵称最多 16 个字符，留言内容最多 256 个字符，同一 IP 每分钟最多发布 3 条。留言按正序、倒序或点赞数排序，显示永久楼号；点赞可以取消，举报对同一 IP 和留言只接受一次。

留言使用 `comment:time`、`comment:hot`、`comment:reports` 和 `comment:{id}` Redis 键。后台的留言审核按举报数优先显示，可清除举报或永久删除留言。

## 本地验证

```powershell
node --check worker/index.js
node --check ..\feedback-admin\server.js
npm.cmd run build
```

排行榜和评分持久化依赖 Cloudflare Worker 与 Upstash Redis。Redis 键继续使用既有前缀 `hsj_huashui_meishimanghe_jianghuai_`，以保留现有评分和反馈数据。
