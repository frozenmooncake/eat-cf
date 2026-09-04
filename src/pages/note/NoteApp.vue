<script setup>
import GlobalHeader from '../../components/GlobalHeader.vue';
</script>

<template>
  <GlobalHeader />
  <main class="page page-note">
    <header class="page-heading">
      <span class="page-kicker">作者手记</span>
      <h1>网站更新与反馈</h1>
      <p>数据、意见与建议，都可以在这里留言。</p>
    </header>

    <div class="card notice">
      <p>📢 网站初建，有任何问题记得及时反馈哦！<br />
      如果有其他校区餐厅窗口的数据的话我会考虑开设其他的抽奖系统的。</p>
    </div>

    <h2>数据提交格式</h2>
    <pre><code>餐厅名：
1楼：
窗口号,窗口名
窗口号,窗口名
...
2楼：
窗口号,窗口名
窗口号,窗口名
...</code></pre>

    <p>请将数据发送至：<br />
    📧 <a href="mailto:xyrct301@outlook.com">xyrct301@outlook.com</a></p>

    <hr />

    <p class="note-end"><em>您的反馈对我们非常重要，期待收到大家的宝贵建议！</em> 😊</p>

    <div class="note-actions">
      <a href="../index.html" class="btn return-home">返回首页</a>
    </div>
  </main>
</template>

<style scoped>
.page-heading { margin-bottom: var(--spacing-xl); text-align: left; }
.page-heading h1 { margin: 0.15rem 0 0.35rem; text-align: left; }
.page-heading p { color: var(--color-text-secondary); font-size: 0.92rem; }
.page-kicker { color: var(--color-accent-strong); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.18em; }
.notice { font-size: 0.95rem; }
.notice p { margin: 0; }
.page-note h2 { color: var(--color-primary); font-size: 1.3rem; border-bottom: 2px solid var(--color-accent-border); padding-bottom: var(--spacing-sm); margin: var(--spacing-xl) 0 var(--spacing-md); }
.page-note p { margin: var(--spacing-md) 0; line-height: 1.8; }
.page-note hr { border: none; border-top: 1px solid var(--color-border); margin: var(--spacing-xl) 0; }
pre { background-color: var(--color-bg-secondary); padding: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow-x: auto; font-size: 0.95rem; }
code { color: var(--color-primary); font-family: Consolas, Monaco, monospace; }
.note-end { color: var(--color-text-secondary); }
.note-actions { margin-top: var(--spacing-xl); display: flex; justify-content: center; }
.return-home { padding: 0.7rem 2rem; font-size: 1rem; }
</style>
