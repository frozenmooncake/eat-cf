<script setup>
import { LEVEL_MAP, starsText } from '../levels.js';
import { useVote } from '../composables/useVote.js';

const props = defineProps({
  voteId: { type: String, required: true },
  meta: { type: Object, default: null },
});

const { summary } = useVote(props.voteId, props.meta);
</script>

<template>
  <div class="vote-summary" aria-label="当前评分">
    <template v-if="summary.level">
      <span class="vote-summary__level">{{ LEVEL_MAP[summary.level].name }}</span>
      <span class="vote-summary__stars">{{ starsText(summary.stars) }}</span>
    </template>
    <span v-else class="vote-summary__empty">暂无评分</span>
  </div>
</template>

<style scoped>
.vote-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 1.8rem;
  margin-top: var(--spacing-md);
}

.vote-summary__level {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 600;
}

.vote-summary__stars {
  color: var(--color-warning);
  font-size: 1.1rem;
  letter-spacing: 0;
}

.vote-summary__empty {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}
</style>
