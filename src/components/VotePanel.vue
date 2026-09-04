<script setup>
import { ref } from 'vue';
import { LEVELS, LEVEL_MAP, VOTE_TAGS, starsText } from '../levels.js';
import { useVote } from '../composables/useVote.js';

const props = defineProps({
  voteId: { type: String, required: true },
  meta: { type: Object, default: null },
  label: { type: String, default: '评分' },
});

const selectedTags = ref([]);
const { loading, remaining, summary, tags, submit } = useVote(props.voteId, props.meta);

function toggleTag(tagKey) {
  selectedTags.value = selectedTags.value.includes(tagKey)
    ? selectedTags.value.filter((key) => key !== tagKey)
    : [...selectedTags.value, tagKey];
}

async function submitVote(levelKey) {
  const succeeded = await submit(levelKey, selectedTags.value);
  if (succeeded) selectedTags.value = [];
}
</script>

<template>
  <div class="vote-panel">
    <div class="vote-title">{{ label }}</div>
    <div class="vote-head">
      <template v-if="summary.level">
        <span class="vote-level">{{ LEVEL_MAP[summary.level].name }}</span>
        <span class="vote-stars">{{ starsText(summary.stars) }}</span>
        <span class="vote-count">{{ summary.total }} 票</span>
      </template>
      <span v-else class="vote-empty">暂无评分</span>
    </div>
    <div v-if="tags.length" class="vote-tag-stats" aria-label="热门标签">
      <span v-for="tag in tags" :key="tag.key">{{ tag.name }} {{ tag.count }}</span>
    </div>
    <fieldset class="vote-tag-picker">
      <legend>这次评价（可多选）</legend>
      <div class="vote-tags">
        <button
          v-for="tag in VOTE_TAGS"
          :key="tag.key"
          type="button"
          class="vote-tag"
          :aria-pressed="selectedTags.includes(tag.key)"
          :disabled="loading"
          @click="toggleTag(tag.key)"
        >{{ tag.name }}</button>
      </div>
    </fieldset>
    <div class="vote-action-label">选择星级评价并提交</div>
    <div class="vote-actions">
      <button
        v-for="level in LEVELS"
        :key="level.key"
        type="button"
        class="vote-btn"
        :disabled="loading"
        @click="submitVote(level.key)"
      ><span>{{ level.name }}</span><small>{{ level.stars }}星</small></button>
    </div>
    <div v-if="remaining !== null && remaining > 0" class="vote-remain">今日还可评分 {{ remaining }} 次</div>
    <div v-else-if="remaining === 0" class="vote-remain vote-remain--full">今日评分次数已用完</div>
  </div>
</template>

<style scoped>
.vote-panel {
  margin-top: var(--spacing-lg);
  padding: 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.vote-head {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  min-height: 1.8rem;
}

.vote-title {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

.vote-level {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.vote-stars {
  font-size: 1.1rem;
  color: var(--color-warning);
}

.vote-count {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.vote-empty {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.vote-actions {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.4rem;
}

.vote-btn {
  display: grid;
  place-items: center;
  min-height: 3.25rem;
  padding: 0.35rem 0.25rem;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.vote-btn small {
  color: var(--color-text-secondary);
  font-size: 0.7rem;
}

.vote-btn:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.vote-tag-stats,
.vote-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.vote-tag-stats {
  margin: -0.15rem 0 var(--spacing-md);
}

.vote-tag-stats span {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent-border);
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
}

.vote-tag-picker {
  min-width: 0;
  margin: 0 0 var(--spacing-md);
  padding: 0;
  border: 0;
}

.vote-tag-picker legend,
.vote-action-label {
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
}

.vote-tag {
  padding: 0.3rem 0.7rem;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
}

.vote-tag[aria-pressed='true'] {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  border-color: var(--color-accent-border);
  font-weight: 600;
}

.vote-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vote-remain {
  margin-top: var(--spacing-sm);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.vote-remain--full {
  color: var(--color-error);
}

@media (max-width: 520px) {
  .vote-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
