<script setup>
import { computed, onMounted, ref } from 'vue';
import GlobalHeader from '../../components/GlobalHeader.vue';
import { getComments, likeComment, reportComment, submitComment } from '../../api.js';

const NICKNAME_STORAGE_KEY = 'guestbook-nickname';
const nickname = ref(localStorage.getItem(NICKNAME_STORAGE_KEY) || '');
const content = ref('');
const sort = ref('newest');
const comments = ref([]);
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const notice = ref('');
const nextOffset = ref(null);
const replyTo = ref(null);
const replyContent = ref('');
const replySubmitting = ref(false);

const nicknameLength = computed(() => [...nickname.value].length);
const contentLength = computed(() => [...content.value].length);
const replyContentLength = computed(() => [...replyContent.value].length);

function formatTime(ts) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts));
}

async function load(reset = true) {
  loading.value = true;
  error.value = '';
  try {
    const offset = reset ? 0 : nextOffset.value;
    const data = await getComments(sort.value, offset || 0);
    comments.value = reset ? data.items : [...comments.value, ...data.items];
    nextOffset.value = data.nextOffset;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function publish() {
  error.value = '';
  notice.value = '';
  if (!content.value.trim()) return;
  submitting.value = true;
  try {
    await submitComment(nickname.value, content.value);
    localStorage.setItem(NICKNAME_STORAGE_KEY, nickname.value);
    content.value = '';
    replyTo.value = null;
    notice.value = '留言发布成功';
    sort.value = 'newest';
    await load();
  } catch (e) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
}

function startReply(item) {
  replyTo.value = item;
  replyContent.value = '';
  error.value = '';
  notice.value = '';
}

function cancelReply() {
  replyTo.value = null;
  replyContent.value = '';
}

function isReplyingTo(item) {
  return replyTo.value?.id === item.id;
}

async function publishReply() {
  const target = replyTo.value;
  if (!target || !replyContent.value.trim()) return;
  error.value = '';
  notice.value = '';
  replySubmitting.value = true;
  try {
    await submitComment(nickname.value, replyContent.value, target.id);
    localStorage.setItem(NICKNAME_STORAGE_KEY, nickname.value);
    replyTo.value = null;
    replyContent.value = '';
    notice.value = '回复发布成功';
    sort.value = 'newest';
    await load();
  } catch (e) {
    error.value = e.message;
  } finally {
    replySubmitting.value = false;
  }
}

async function toggleLike(item) {
  try {
    const data = await likeComment(item.id);
    Object.assign(item, data.item, { liked: data.liked });
    if (sort.value === 'hot') comments.value.sort((a, b) => b.likes - a.likes || b.ts - a.ts);
  } catch (e) {
    error.value = e.message;
  }
}

async function report(item) {
  if (!confirm('确定举报这条留言？管理员会尽快审核。')) return;
  try {
    const data = await reportComment(item.id);
    Object.assign(item, data.item);
    notice.value = '举报已提交';
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(() => load());
</script>

<template>
  <GlobalHeader />
  <main class="page guestbook">
    <header class="guestbook-head">
      <span>食堂留言簿</span>
      <h1>今天吃得怎么样？</h1>
      <p>分享你的发现、建议和校园食堂故事。</p>
    </header>

    <form class="comment-form" @submit.prevent="publish">
      <div class="form-row">
        <label>
          <span>昵称 <small>可选</small></span>
          <input v-model="nickname" maxlength="16" placeholder="匿名食客" />
          <small>{{ nicknameLength }}/16</small>
        </label>
      </div>
      <label class="content-field">
        <span>留言内容</span>
        <textarea v-model="content" maxlength="256" rows="4" required placeholder="写下想说的话……"></textarea>
        <small>{{ contentLength }}/256</small>
      </label>
      <div class="form-foot">
        <span>每分钟最多发布 3 条</span>
        <button class="btn" :disabled="submitting || !content.trim()">{{ submitting ? '发布中…' : '发布留言' }}</button>
      </div>
    </form>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="notice" class="message success">{{ notice }}</p>

    <div class="comment-toolbar">
      <h2>全部留言</h2>
      <div class="sorts" aria-label="留言排序">
        <button v-for="option in [{ key: 'newest', name: '倒序' }, { key: 'oldest', name: '正序' }, { key: 'hot', name: '热门' }]"
          :key="option.key" type="button" :class="{ active: sort === option.key }" @click="sort = option.key; load()">
          {{ option.name }}
        </button>
      </div>
    </div>

    <div v-if="comments.length" class="comment-list">
      <article v-for="item in comments" :key="item.id" class="comment-card">
        <div class="comment-meta">
          <strong>
            {{ item.nickname }}
            <small v-if="item.publicId">ID {{ item.publicId }}</small>
            <small v-if="item.isMine" class="identity-badge">本人</small>
            <small v-if="item.isAdmin" class="identity-badge admin">管理员</small>
          </strong>
          <span>#{{ item.floor }}楼 · {{ formatTime(item.ts) }}</span>
        </div>
        <p v-if="item.replyTo" class="reply-line">回复 <strong>@{{ item.replyToNickname || '留言' }}</strong></p>
        <p class="comment-content">{{ item.content }}</p>
        <div class="comment-actions">
          <button type="button" :class="{ liked: item.liked }" @click="toggleLike(item)">
            {{ item.liked ? '已赞' : '点赞' }} {{ item.likes || 0 }}
          </button>
          <button type="button" :class="{ active: isReplyingTo(item) }"
            @click="isReplyingTo(item) ? cancelReply() : startReply(item)">回复</button>
          <button type="button" @click="report(item)">举报</button>
        </div>
        <form v-if="isReplyingTo(item)" class="reply-form" @submit.prevent="publishReply">
          <div class="reply-head">
            <span>回复 {{ item.nickname }}</span>
            <button class="text-button" type="button" @click="cancelReply">收起</button>
          </div>
          <textarea v-model="replyContent" maxlength="256" rows="2" required
            placeholder="写下回复内容……"></textarea>
          <div class="reply-foot">
            <small>{{ replyContentLength }}/256</small>
            <button class="btn" type="submit" :disabled="replySubmitting || !replyContent.trim()">
              {{ replySubmitting ? '回复中…' : '发送回复' }}
            </button>
          </div>
        </form>
      </article>
    </div>
    <p v-else-if="!loading" class="empty">还没有留言，来坐第一楼。</p>
    <button v-if="nextOffset !== null" class="load-more" type="button" :disabled="loading" @click="load(false)">
      {{ loading ? '加载中…' : '加载更多' }}
    </button>
  </main>
</template>

<style scoped>
.guestbook { max-width: 780px; }
.guestbook-head { padding: 1.5rem 0 1rem; border-bottom: 3px double var(--color-accent-border); }
.guestbook-head > span { color: var(--color-accent-strong); font-size: .78rem; font-weight: 800; letter-spacing: .18em; }
.guestbook-head h1 { margin: .3rem 0; text-align: left; }
.guestbook-head p { color: var(--color-text-secondary); }
.comment-form { margin: 1.5rem 0; padding: 1.25rem; background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.comment-form label { display: grid; gap: .4rem; font-weight: 700; }
.comment-form label > small, .comment-form label > span small { color: var(--color-text-secondary); font-weight: 400; }
.comment-form label > small { justify-self: end; }
.form-row { max-width: 18rem; }
.content-field { margin-top: 1rem; }
input, textarea { width: 100%; padding: .7rem .8rem; color: var(--color-text); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); font: inherit; resize: vertical; }
input:focus, textarea:focus { outline: 2px solid color-mix(in srgb, var(--color-primary) 25%, transparent); border-color: var(--color-primary); }
.form-foot { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-top: .8rem; color: var(--color-text-secondary); font-size: .82rem; }
.message { padding: .7rem 1rem; border-radius: var(--radius-md); }
.message.error { color: var(--color-error); background: var(--color-accent-soft); }
.message.success { color: var(--color-primary); background: var(--color-bg-secondary); }
.comment-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin: 2rem 0 .75rem; }
.comment-toolbar h2 { margin: 0; font-size: 1.15rem; }
.sorts { display: flex; padding: .2rem; background: var(--color-bg-secondary); border-radius: 999px; }
.sorts button, .comment-actions button { padding: .4rem .75rem; color: var(--color-text-secondary); background: transparent; border: 0; border-radius: 999px; cursor: pointer; }
.sorts button.active { color: var(--color-primary); background: var(--color-bg); box-shadow: var(--shadow-sm); font-weight: 700; }
.comment-list { display: grid; gap: .75rem; }
.comment-card { padding: 1rem 1.1rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
.comment-meta { display: flex; justify-content: space-between; gap: 1rem; color: var(--color-text-secondary); font-size: .78rem; }
.comment-meta strong { font-family: var(--font-family-serif); color: var(--color-primary); font-size: .95rem; }
.comment-meta strong small { margin-left: .35rem; color: var(--color-text-secondary); font-family: var(--font-family-sans); font-size: .72rem; font-weight: 500; }
.comment-meta strong .identity-badge { padding: .1rem .35rem; color: var(--color-primary); background: var(--color-bg-secondary); border-radius: 999px; font-weight: 700; }
.comment-meta strong .identity-badge.admin { color: var(--color-accent-strong); }
.comment-card p { margin: .75rem 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.comment-card .reply-line { margin: .65rem 0 0; color: var(--color-accent-strong); font-size: .8rem; }
.comment-card .reply-line strong { color: var(--color-accent-strong); font-weight: 700; }
.comment-card .comment-content { margin-top: .35rem; }
.comment-actions { display: flex; justify-content: flex-end; gap: .25rem; }
.comment-actions button:hover, .comment-actions button.liked, .comment-actions button.active { color: var(--color-primary); background: var(--color-bg-secondary); }
.comment-actions button.active { color: var(--color-accent-strong); }
.reply-form { display: grid; gap: .6rem; margin-top: .8rem; padding-top: .8rem; border-top: 1px dashed var(--color-border); }
.reply-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; color: var(--color-accent-strong); font-size: .85rem; font-weight: 700; }
.text-button { padding: 0; color: var(--color-text-secondary); background: transparent; border: 0; cursor: pointer; }
.reply-foot { display: flex; justify-content: space-between; align-items: center; gap: 1rem; color: var(--color-text-secondary); font-size: .8rem; }
.empty { padding: 3rem 0; text-align: center; color: var(--color-text-secondary); }
.load-more { display: block; margin: 1.25rem auto; padding: .65rem 1.5rem; color: var(--color-primary); background: transparent; border: 1px solid var(--color-border); border-radius: 999px; cursor: pointer; }
@media (max-width: 560px) {
  .comment-form { padding: 1rem; }
  .form-row { max-width: none; }
  .comment-toolbar, .comment-meta { align-items: flex-start; }
  .comment-toolbar { flex-direction: column; }
  .form-foot { align-items: stretch; flex-direction: column; }
  .form-foot .btn { width: 100%; }
  .reply-foot { align-items: stretch; flex-direction: column; }
  .reply-foot .btn { width: 100%; }
}
</style>
