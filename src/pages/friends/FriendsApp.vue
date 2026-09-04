<script setup>
import GlobalHeader from '../../components/GlobalHeader.vue';
import { copyText, showToast } from '../../utils.js';

const friends = [
  {
    name: '华水打印室',
    desc: '提供华水校内高质量打印服务',
    avatar: 'https://s21.ax1x.com/2025/06/05/pVPXHQH.png',
    wechat: '华水打印室',
  },
  {
    name: '华水校帮帮',
    desc: '分享校园信息，服务华水同学，你的声音，我来倾听！',
    avatar: 'https://s21.ax1x.com/2025/02/28/pE8N6je.jpg',
    wechat: '华水校帮帮',
  },
];

function tryOpenWeChat(accountName) {
  setTimeout(() => {
    try {
      window.location.href = 'weixin://';
      setTimeout(() => {
        if (!document.hidden) showToast('📱 未检测到微信，请手动打开');
      }, 1000);
    } catch {
      showToast(`⚠️ 请手动打开微信搜索 "${accountName}"`);
    }
  }, 300);
}

async function copyWeChat(friend) {
  const ok = await copyText(friend.wechat);
  if (ok) {
    showToast(`✅ 已复制公众号: ${friend.wechat}`);
    tryOpenWeChat(friend.wechat);
  } else {
    showToast(`❌ 复制失败，请手动复制 "${friend.wechat}"`);
  }
}
</script>

<template>
  <GlobalHeader />
  <main class="page page-friends">
    <header class="page-heading">
      <span class="page-kicker">友链空间</span>
      <h1>发现更多精彩</h1>
      <p>华水周边的公众号与网站。</p>
    </header>

    <div class="friend-links">
      <article v-for="friend in friends" :key="friend.name" class="friend-card">
        <img :src="friend.avatar" :alt="friend.name" class="avatar" loading="lazy" />
        <div class="friend-info">
          <div class="friend-name">{{ friend.name }}</div>
          <p class="friend-desc">{{ friend.desc }}</p>
          <button type="button" class="btn btn--primary friend-btn" @click="copyWeChat(friend)">添加公众号</button>
        </div>
      </article>
    </div>

    <div class="friends-footer">
      <a href="../index.html" class="btn return-home">返回首页</a>
      <a href="mailto:xyrct301@outlook.com?subject=友联申请" class="btn btn--primary apply-btn">📮 申请友联</a>
    </div>
  </main>
</template>

<style scoped>
.page-heading {
  margin-bottom: var(--spacing-xl);
  text-align: left;
}

.page-heading h1 {
  margin: 0.15rem 0 0.35rem;
  text-align: left;
}

.page-heading p {
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.page-kicker {
  color: var(--color-accent-strong);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.friend-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.friend-card {
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.friend-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: var(--spacing-lg);
  object-fit: cover;
  flex-shrink: 0;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  color: var(--color-text);
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.friend-desc {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.friend-btn {
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
}

.friends-footer {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.return-home {
  padding: 0.7rem 2rem;
  font-size: 1rem;
}

.apply-btn {
  padding: 0.7rem 2rem;
  font-size: 1rem;
}

@media (max-width: 480px) {
  .friend-links {
    grid-template-columns: 1fr;
  }

  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
