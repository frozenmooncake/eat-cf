<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '照片' },
  photos: { type: [Array, String], default: () => [] },
});

const items = computed(() => {
  const photos = Array.isArray(props.photos) ? props.photos : [props.photos];
  return photos.filter(Boolean).map((photo, index) => (
    typeof photo === 'string'
      ? { src: photo, alt: `${props.title}${index + 1}` }
      : { src: photo.src, alt: photo.alt || `${props.title}${index + 1}` }
  )).filter((photo) => photo.src);
});
</script>

<template>
  <details class="photo-gallery">
    <summary>{{ title }}（{{ items.length }}）</summary>
    <div v-if="items.length" class="photo-grid">
      <img
        v-for="photo in items"
        :key="photo.src"
        :src="photo.src"
        :alt="photo.alt"
        loading="lazy"
      />
    </div>
    <p v-else class="photo-empty">暂无照片</p>
  </details>
</template>

<style scoped>
.photo-gallery {
  margin-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
  padding-top: var(--spacing-sm);
  text-align: left;
}

.photo-gallery summary {
  width: fit-content;
  color: var(--color-primary);
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.photo-grid img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.photo-empty {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}
</style>
