import { ref } from 'vue';
import { voteWindow, getWindowVote } from '../api.js';
import { summarizeTags, summarizeVotes } from '../levels.js';
import { showToast } from '../utils.js';

// 打分状态管理：加载当前票数、提交等级票
export function useVote(voteId, meta = null) {
  const loading = ref(false);
  const remaining = ref(null);
  const summary = ref({ level: null, stars: 0, total: 0 });
  const tags = ref([]);

  function applyState(data) {
    summary.value = summarizeVotes(data.counts || {});
    tags.value = summarizeTags(data.tagCounts || {});
  }

  async function load() {
    try {
      const data = await getWindowVote(voteId);
      applyState(data);
    } catch {
      // 排行榜服务未连接时静默
    }
  }

  async function submit(levelKey, selectedTags = []) {
    if (loading.value) return;
    loading.value = true;
    try {
      const res = await voteWindow(voteId, levelKey, meta, selectedTags);
      applyState(res);
      remaining.value = typeof res.remaining === 'number' ? res.remaining : null;
      showToast(res.message || '评分成功');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  load();

  return { loading, remaining, summary, tags, load, submit };
}
