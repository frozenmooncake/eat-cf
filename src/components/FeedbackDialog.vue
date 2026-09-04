<script setup>
import { computed, ref, watch } from 'vue';
import { submitFeedback } from '../api.js';
import { showToast } from '../utils.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  target: { type: Object, default: null },
  title: { type: String, default: '' },
});

const emit = defineEmits(['close', 'submitted']);

const FEEDBACK_TYPES = [
  { key: 'price', name: '价格错误' },
  { key: 'type', name: '类型错误' },
  { key: 'closed', name: '已停业/搬走' },
  { key: 'name', name: '店名/菜名有误' },
  { key: 'dish_addition', name: '菜品补充' },
  { key: 'dish', name: '菜品信息不符' },
  { key: 'other', name: '其他' },
];

const MESSAGE_REQUIRED_TYPES = new Set(['price', 'type', 'name', 'dish_addition', 'dish', 'other']);
const TYPE_HINTS = {
  price: '请写明实际价格，例如：XX 菜 12 元',
  type: '请写明正确类型，例如：应属于米饭/面食/早餐',
  name: '请写明正确的店名或菜名',
  dish_addition: '请写明需要补充的菜名和价格（如知道）',
  dish: '请说明与菜单实际不一致的地方',
  closed: '如果搬走了，可补充新位置或新店名（选填）',
  other: '请描述具体情况，方便管理员定位',
};

const selectedType = ref('');
const message = ref('');
const submitting = ref(false);
const requiresMessage = computed(() => MESSAGE_REQUIRED_TYPES.has(selectedType.value));

watch(() => props.open, (value) => {
  if (value) {
    selectedType.value = '';
    message.value = '';
  }
});

async function submit() {
  if (!selectedType.value) {
    showToast('请先选择问题类型');
    return;
  }
  if (requiresMessage.value && !message.value.trim()) {
    showToast('请填写补充说明，方便管理员定位问题');
    return;
  }
  submitting.value = true;
  try {
    await submitFeedback(props.target, selectedType.value, message.value.trim());
    showToast('反馈已提交，感谢帮助');
    emit('submitted');
    emit('close');
  } catch (err) {
    showToast(err.message || '提交失败，请稍后再试');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div v-if="open" class="fb-overlay" @click.self="emit('close')">
    <div class="fb-dialog" role="dialog" aria-modal="true" aria-label="数据反馈">
      <div class="fb-head">
        <h3>报告数据问题</h3>
        <button type="button" class="fb-close" aria-label="关闭" @click="emit('close')">×</button>
      </div>
      <p class="fb-target">{{ title }}</p>

      <div class="fb-label">问题类型</div>
      <div class="fb-options">
        <button
          v-for="t in FEEDBACK_TYPES"
          :key="t.key"
          type="button"
          class="chip fb-chip"
          :aria-pressed="selectedType === t.key"
          @click="selectedType = t.key"
        >{{ t.name }}</button>
      </div>

      <label class="fb-label" for="fb-message">补充说明{{ requiresMessage ? '（必填）' : '（选填）' }}</label>
      <textarea
        id="fb-message"
        v-model="message"
        class="fb-message"
        rows="3"
        maxlength="300"
        :placeholder="TYPE_HINTS[selectedType] || '补充说明可以帮助管理员更快更正数据'"
        :aria-required="requiresMessage ? 'true' : 'false'"
      ></textarea>

      <div class="fb-actions">
        <button type="button" class="btn" @click="emit('close')">取消</button>
        <button type="button" class="btn btn--primary" :disabled="submitting" @click="submit">
          {{ submitting ? '提交中…' : '提交反馈' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fb-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.5);
  animation: fb-fade var(--transition-base);
}

@keyframes fb-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fb-dialog {
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: fb-pop var(--transition-base);
}

@keyframes fb-pop {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.fb-head h3 {
  font-size: 1.15rem;
  color: var(--color-text);
}

.fb-close {
  border: 0;
  background: none;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0 var(--spacing-xs);
}

.fb-close:hover {
  color: var(--color-text);
}

.fb-target {
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.95rem;
  word-break: break-all;
}

.fb-label {
  display: block;
  margin: var(--spacing-md) 0 var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

.fb-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.fb-chip {
  background: var(--color-bg);
}

.fb-chip[aria-pressed='true'] {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.fb-message {
  width: 100%;
  min-height: 4.5rem;
  padding: var(--spacing-sm);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
}

.fb-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}
</style>
