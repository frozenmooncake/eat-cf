<script setup>
import { computed, onMounted, ref } from 'vue';
import GlobalHeader from '../../components/GlobalHeader.vue';
import FeedbackDialog from '../../components/FeedbackDialog.vue';
import { dishTypeMatches, menuData, dishVoteId, parsePrice } from '../../menu-data.js';
import { getLeaderboard } from '../../api.js';
import { LEVEL_MAP, VOTE_TAGS, summarizeTags, summarizeVotes, starsText } from '../../levels.js';

const availableRegions = [
  ...menuData.canteens,
  { id: 'snack', label: menuData.snackStreet.label, floors: [{ floor: 1 }] },
];
const availableFloors = menuData.canteens.flatMap((c) => c.floors.map((f) => f.floor)).filter((v, i, a) => a.indexOf(v) === i);

const regions = ref(availableRegions.map((c) => c.id));
const floors = ref([...availableFloors]);
const type = ref('all');
const selectedStars = ref([]);
const selectedTags = ref([]);
const minPrice = ref('');
const maxPrice = ref('');

const loading = ref(false);
const apiError = ref(false);
const voteMap = ref(new Map());

const feedbackOpen = ref(false);
const feedbackTarget = ref(null);
const feedbackTitle = ref('');

function openFeedback(target, title) {
  feedbackTarget.value = target;
  feedbackTitle.value = title;
  feedbackOpen.value = true;
}

function openWindowFeedback(canteenId, group, entry) {
  openFeedback(
    { kind: 'window', regionId: canteenId, floor: group.floor, num: entry.num, windowName: entry.name },
    `${menuData.canteens.find((c) => c.id === canteenId)?.label || canteenId} · ${group.floor}楼${entry.num}号窗口 · ${entry.name}`,
  );
}

function openSnackFeedback(entry) {
  openFeedback(
    { kind: 'snack', regionId: 'snack', floor: 1, num: entry.num, name: entry.name },
    `小吃街 · ${entry.name}`,
  );
}

function toggle(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function itemMatches(item) {
  if (!dishTypeMatches(item, type.value, item)) return false;
  if (selectedStars.value.length && !selectedStars.value.includes(item.stars)) return false;
  if (selectedTags.value.length && !selectedTags.value.some((key) => item.tags.some((tag) => tag.key === key))) return false;
  if (minPrice.value !== '' && (item.priceValue === null || item.priceValue < Number(minPrice.value))) return false;
  if (maxPrice.value !== '' && (item.priceValue === null || item.priceValue > Number(maxPrice.value))) return false;
  return true;
}

function buildWindow(canteen, group, entry) {
  const items = (entry.items || [])
    .map((item, dishIndex) => {
      const vote = voteMap.value.get(dishVoteId(canteen.id, group.floor, entry.num, dishIndex));
      const counts = vote?.counts || {};
      const tagCounts = vote?.tagCounts || {};
      return {
        ...item,
        regionId: canteen.id,
        floor: group.floor,
        num: entry.num,
        priceValue: parsePrice(item.price),
        tags: summarizeTags(tagCounts),
        ...summarizeVotes(counts),
      };
    })
    .filter(itemMatches);
  return { ...entry, items };
}

function buildFloor(canteen, group) {
  const windows = group.windows
    .map((entry) => buildWindow(canteen, group, entry))
    .filter((entry) => entry.items.length > 0)
    .sort((a, b) => a.num - b.num);
  return { ...group, windows };
}

const groups = computed(() =>
  menuData.canteens
    .filter((c) => regions.value.includes(c.id))
    .map((canteen) => ({
      ...canteen,
      floors: canteen.floors
        .filter((group) => floors.value.includes(group.floor))
        .map((group) => buildFloor(canteen, group))
        .filter((group) => group.windows.length > 0),
    }))
    .filter((canteen) => canteen.floors.length > 0)
);

const snackGroups = computed(() => {
  if (!regions.value.includes('snack') || !floors.value.includes(1)) return [];
  return menuData.snackStreet.entries
    .map((entry, stallIndex) => {
      const items = (entry.items || [])
        .map((item, dishIndex) => {
          const vote = voteMap.value.get(dishVoteId('snack', 1, stallIndex + 1, dishIndex));
          return {
            ...item,
            regionId: 'snack',
            floor: 1,
            num: stallIndex + 1,
            priceValue: parsePrice(item.price),
            tags: summarizeTags(vote?.tagCounts || {}),
            ...summarizeVotes(vote?.counts || {}),
          };
        })
        .filter(itemMatches);
      return { ...entry, num: stallIndex + 1, items };
    })
    .filter((entry) => entry.items.length > 0);
});

const hasSelectedRegion = computed(() => regions.value.length > 0);
const hasVisibleContent = computed(() => groups.value.length > 0 || snackGroups.value.length > 0);

async function load() {
  loading.value = true;
  try {
    const data = await getLeaderboard();
    voteMap.value = new Map((data.items || []).map((item) => [item.id, item]));
  } catch {
    apiError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <GlobalHeader />
  <main class="page page-menu">
    <h1>菜单与价位</h1>

    <section class="menu-filter" aria-label="菜单筛选">
      <div class="filter-group">
        <span class="filter-label">区域</span>
        <div class="filter-options">
          <button
            v-for="c in availableRegions"
            :key="c.id"
            type="button"
            class="chip"
            :aria-pressed="regions.includes(c.id)"
            @click="regions = toggle(regions, c.id)"
          >{{ c.label }}</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">楼层</span>
        <div class="filter-options">
          <button
            v-for="f in availableFloors"
            :key="f"
            type="button"
            class="chip"
            :aria-pressed="floors.includes(f)"
            @click="floors = toggle(floors, f)"
          >{{ f }}楼</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">类型</span>
        <div class="filter-options">
          <button
            v-for="t in [['all', '全部'], ['rice', '米饭'], ['noodle', '面食'], ['other', '其他']]"
            :key="t[0]"
            type="button"
            class="chip"
            :aria-pressed="type === t[0]"
            @click="type = t[0]"
          >{{ t[1] }}</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">星级</span>
        <div class="filter-options">
          <button
            v-for="s in [5, 4, 3, 2, 1]"
            :key="s"
            type="button"
            class="chip"
            :aria-pressed="selectedStars.includes(s)"
            @click="selectedStars = toggle(selectedStars, s)"
          >{{ s }}星</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">标签</span>
        <div class="filter-options">
          <button
            v-for="t in VOTE_TAGS"
            :key="t.key"
            type="button"
            class="chip"
            :aria-pressed="selectedTags.includes(t.key)"
            @click="selectedTags = toggle(selectedTags, t.key)"
          >{{ t.name }}</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">价格</span>
        <div class="filter-options filter-price">
          <input v-model="minPrice" type="number" min="0" step="0.1" placeholder="最低价" aria-label="最低价" />
          <span class="filter-price-sep">—</span>
          <input v-model="maxPrice" type="number" min="0" step="0.1" placeholder="最高价" aria-label="最高价" />
        </div>
      </div>
    </section>

    <p v-if="loading" class="menu-empty">加载中...</p>
    <p v-else-if="apiError" class="menu-empty">排行榜服务未连接，星级与标签暂不可用</p>

    <template v-else>
      <section v-for="canteen in groups" :key="canteen.id" class="menu-canteen">
        <h2>{{ canteen.label }}</h2>
        <section v-for="group in canteen.floors" :key="group.floor" class="menu-group">
          <h3>{{ group.label }}</h3>
          <section v-for="entry in group.windows" :key="entry.num" class="menu-window">
            <div class="menu-window-head">
              <h4>{{ entry.num }}号窗口 · {{ entry.name }}</h4>
              <button type="button" class="btn fb-trigger" @click="openWindowFeedback(canteen.id, group, entry)">报告问题</button>
            </div>
            <span v-if="entry.range" class="menu-range">{{ entry.range }}</span>
            <ul v-if="entry.items.length" class="menu-items">
              <li v-for="item in entry.items" :key="item.dish">
                <div class="menu-item-main">
                  <span>{{ item.dish }}</span>
                  <span class="menu-price">{{ item.price }}</span>
                </div>
                <div v-if="item.level || item.tags.length" class="menu-item-meta">
                  <template v-if="item.level">
                    <span class="menu-level">{{ LEVEL_MAP[item.level].name }}</span>
                    <span class="menu-stars">{{ starsText(item.stars) }}</span>
                  </template>
                  <span v-else class="menu-empty-score">暂无评分</span>
                  <div v-if="item.tags.length" class="menu-tags" aria-label="热门标签">
                    <span v-for="tag in item.tags" :key="tag.key">{{ tag.name }} {{ tag.count }}</span>
                  </div>
                </div>
              </li>
            </ul>
            <p v-else class="menu-empty">菜单数据整理中，敬请期待</p>
          </section>
        </section>
      </section>

      <section v-if="snackGroups.length" class="menu-canteen">
        <h2>{{ menuData.snackStreet.label }}</h2>
        <section v-for="entry in snackGroups" :key="entry.num" class="menu-window">
          <div class="menu-window-head">
            <h4>{{ entry.name }}</h4>
            <button type="button" class="btn fb-trigger" @click="openSnackFeedback(entry)">报告问题</button>
          </div>
          <span v-if="entry.range" class="menu-range">{{ entry.range }}</span>
          <ul class="menu-items">
            <li v-for="item in entry.items" :key="`${entry.num}-${item.dish}`">
              <div class="menu-item-main">
                <span>{{ item.dish }}</span>
                <span class="menu-price">{{ item.price }}</span>
              </div>
              <div v-if="item.level || item.tags.length" class="menu-item-meta">
                <template v-if="item.level">
                  <span class="menu-level">{{ LEVEL_MAP[item.level].name }}</span>
                  <span class="menu-stars">{{ starsText(item.stars) }}</span>
                </template>
                <span v-else class="menu-empty-score">暂无评分</span>
                <div v-if="item.tags.length" class="menu-tags" aria-label="热门标签">
                  <span v-for="tag in item.tags" :key="tag.key">{{ tag.name }} {{ tag.count }}</span>
                </div>
              </div>
            </li>
          </ul>
          <p v-if="entry.note" class="menu-note">{{ entry.note }}</p>
        </section>
      </section>

      <p v-if="hasSelectedRegion && !hasVisibleContent" class="menu-empty">所选区域暂无符合条件的菜品</p>
      <p v-else-if="!hasSelectedRegion" class="menu-empty">请至少选择一个区域</p>
    </template>

    <FeedbackDialog
      :open="feedbackOpen"
      :target="feedbackTarget"
      :title="feedbackTitle"
      @close="feedbackOpen = false"
    />
  </main>
</template>

<style scoped>
.menu-empty {
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.menu-canteen {
  margin-bottom: var(--spacing-xl);
}

.menu-group {
  margin-bottom: var(--spacing-lg);
}

.menu-canteen > h2,
.menu-group > h2 {
  color: var(--color-primary);
  font-size: 1.4rem;
  border-bottom: 2px solid var(--color-accent-border);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.menu-group > h3 {
  color: var(--color-text);
  font-size: 1.15rem;
  margin: var(--spacing-md) 0;
}

.menu-window {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
}

.menu-window h4 {
  display: inline;
  font-size: 1.05rem;
  margin-right: var(--spacing-sm);
}

.menu-window-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.menu-window-head h4 {
  margin-right: 0;
}

.fb-trigger {
  flex-shrink: 0;
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.menu-range {
  display: inline-block;
  margin-left: var(--spacing-sm);
  font-size: 0.85rem;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 2px 10px;
  border-radius: 999px;
}

.menu-items {
  list-style: none;
  margin-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
  padding-top: var(--spacing-sm);
}

.menu-items > li {
  padding: var(--spacing-sm) 0;
}

.menu-items > li + li {
  border-top: 1px dashed var(--color-border);
}

.menu-item-main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-md);
}

.menu-price {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.menu-item-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.menu-level {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.menu-stars {
  color: var(--color-warning);
  font-size: 0.9rem;
}

.menu-empty-score {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.menu-note {
  margin-top: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.menu-tags span {
  padding: 0.1rem 0.45rem;
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent-border);
  border-radius: 999px;
  font-size: 0.72rem;
}

.menu-filter {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.filter-group {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-label {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-price {
  align-items: center;
}

.filter-price input {
  width: 5.5rem;
  min-height: 2.4rem;
  padding: 0.4rem 0.6rem;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.filter-price-sep {
  color: var(--color-text-secondary);
}

@media (max-width: 600px) {
  .menu-filter {
    padding: var(--spacing-md);
  }

  .filter-group {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }

  .menu-window h4 {
    display: block;
    margin-bottom: var(--spacing-sm);
  }

  .menu-window-head {
    flex-wrap: wrap;
  }

  .menu-window-head h4 {
    display: inline;
    margin-bottom: 0;
  }

  .fb-trigger {
    margin-left: auto;
  }

  .menu-range {
    margin-left: 0;
  }
}
</style>
