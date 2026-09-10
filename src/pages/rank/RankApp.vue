<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import GlobalHeader from '../../components/GlobalHeader.vue';
import VotePanel from '../../components/VotePanel.vue';
import { canteens, getAllWindows, snackStalls } from '../../data.js';
import { getAllDishes, getMenuWindow } from '../../menu-data.js';
import { getLeaderboard } from '../../api.js';
import { fuzzyMatchAny } from '../../search.js';
import { LEVEL_MAP, rankScore, summarizeTags, summarizeVotes, starsText } from '../../levels.js';

const rows = ref([]);
const loading = ref(true);
const error = ref('');
const activeList = ref('window');
const selectedRegion = ref('canting1');
const selectedFloor = ref('1');
const selectedNum = ref('1');
const selectedDishId = ref('');
const rankKeyword = ref('');
const voteKeyword = ref('');
const dishKeyword = ref('');

// 窗口榜列表上限：当前勾选区域存在未评分窗口时最多 36 条，全部有评分后最多 50 条
const WINDOW_RANK_LIMIT_UNSCORED = 36;
const WINDOW_RANK_LIMIT_SCORED = 50;

const rankRegions = [
  ...Object.values(canteens),
  { id: 'snack', name: '小吃街', floors: { 1: {} } },
];
const rankingRegionOptions = [
  ...Object.values(canteens).map(({ id, name }) => ({ id, name })),
  { id: 'snack', name: '小吃街' },
];
const selectedRankingRegions = ref(Object.keys(canteens));
const availableCanteens = computed(() => rankRegions);
const availableFloors = computed(() => selectedRegion.value === 'snack'
  ? [1]
  : Object.keys(canteens[selectedRegion.value]?.floors || {}).map(Number));
const availableWindows = computed(() => {
  if (selectedRegion.value === 'snack') {
    return snackStalls.map((name, index) => ({ num: index + 1, name }));
  }
  const windows = canteens[selectedRegion.value]?.floors[selectedFloor.value] || {};
  return Object.entries(windows).map(([num, name]) => ({ num: Number(num), name: name.replace(/\n/g, ' / ') }));
});

const regionLabel = (regionId) => (regionId === 'snack' ? '小吃街' : canteens[regionId]?.name || regionId);

const scoringWindows = computed(() => {
  const list = [];
  for (const canteen of Object.values(canteens)) {
    for (const [floorKey, windows] of Object.entries(canteen.floors || {})) {
      for (const [num, name] of Object.entries(windows)) {
        list.push({
          regionId: canteen.id,
          floor: Number(floorKey),
          num: Number(num),
          name: name.replace(/\n/g, ' / '),
          label: `${canteen.name} · ${floorKey}楼${num}号`,
        });
      }
    }
  }
  snackStalls.forEach((name, index) => list.push({
    regionId: 'snack',
    floor: 1,
    num: index + 1,
    name,
    label: `小吃街 · ${index + 1}号`,
  }));
  return list;
});

const matchedWindows = computed(() => {
  const kw = voteKeyword.value.trim();
  if (!kw) return [];
  return scoringWindows.value
    .filter((win) => fuzzyMatchAny([win.name, win.label], kw))
    .slice(0, 40);
});

function pickScoringWindow(win) {
  selectedRegion.value = win.regionId;
  selectedFloor.value = String(win.floor);
  selectedNum.value = String(win.num);
  selectedDishId.value = '';
  voteKeyword.value = '';
}

const selectedWindow = computed(() => {
  const floor = Number(selectedFloor.value);
  const num = Number(selectedNum.value);
  const name = selectedRegion.value === 'snack'
    ? snackStalls[num - 1]
    : canteens[selectedRegion.value]?.floors[floor]?.[num];
  if (!name) return null;
  return {
    id: `${selectedRegion.value}:${floor}:${num}`,
    name: name.replace(/\n/g, ' / '),
    meta: {
      regionId: selectedRegion.value,
      floor,
      num,
      kind: selectedRegion.value === 'snack' ? 'snack' : 'window',
      windowName: name.replace(/\n/g, ' / '),
    },
  };
});

const availableDishes = computed(() => {
  const target = selectedWindow.value;
  const meta = target?.meta;
  if (!meta) return [];
  const targetNum = meta.regionId === 'snack'
    ? meta.num
    : Number(getMenuWindow(meta.regionId, meta.floor, meta.num)?.num);
  if (!Number.isInteger(targetNum)) return [];
  return getAllDishes()
    .filter((dish) => dish.regionId === meta.regionId)
    .filter((dish) => Number(dish.floor) === Number(meta.floor))
    .filter((dish) => Number(dish.num) === targetNum)
    .map((dish) => ({
      ...dish,
      meta: {
        kind: 'dish',
        regionId: meta.regionId,
        floor: Number(meta.floor),
        num: targetNum,
        dishIndex: dish.dishIndex,
        dishName: dish.dish,
        windowName: dish.windowName,
      },
    }));
});

const selectedDish = computed(() =>
  availableDishes.value.find((dish) => dish.id === selectedDishId.value) || null);

const filteredDishes = computed(() => {
  const kw = dishKeyword.value.trim();
  if (!kw) return availableDishes.value;
  return availableDishes.value.filter((dish) => fuzzyMatchAny([dish.dish, dish.price], kw));
});

watch([selectedRegion, selectedFloor, selectedNum], () => {
  selectedDishId.value = '';
});

const visibleRows = computed(() => {
  const filtered = rows.value.filter((row) =>
    row.kind === activeList.value
    && selectedRankingRegions.value.includes(row.regionId)
    && fuzzyMatchAny([row.name, row.windowName, regionLabel(row.regionId)], rankKeyword.value));
  if (activeList.value !== 'window' || !filtered.length) return filtered;
  const allScored = filtered.every((row) => row.total > 0);
  return filtered.slice(0, allScored ? WINDOW_RANK_LIMIT_SCORED : WINDOW_RANK_LIMIT_UNSCORED);
});

function toggleRankingRegion(regionId) {
  selectedRankingRegions.value = selectedRankingRegions.value.includes(regionId)
    ? selectedRankingRegions.value.filter((id) => id !== regionId)
    : [...selectedRankingRegions.value, regionId];
}

function syncFloor() {
  selectedFloor.value = String(availableFloors.value[0] ?? '');
  syncWindow();
}

function syncWindow() {
  selectedNum.value = String(availableWindows.value[0]?.num ?? '');
}

function windowName(regionId, floor, num) {
  if (regionId === 'snack') return snackStalls[Number(num) - 1] || '未知摊位';
  return canteens[regionId]?.floors[floor]?.[num]?.replace(/\n/g, ' / ') || '未知窗口';
}

async function load() {
  loading.value = true;
  try {
    const data = await getLeaderboard();
    const voteMap = new Map((data.items || []).map((item) => [item.id, item]));
    const windows = [
      ...getAllWindows(),
      ...snackStalls.map((name, index) => ({
        regionId: 'snack',
        floor: 1,
        num: index + 1,
        snackName: name,
      })),
    ].map((item) => {
      const id = `${item.regionId}:${item.floor}:${item.num}`;
      const counts = voteMap.get(id)?.counts || {};
      const tagCounts = voteMap.get(id)?.tagCounts || {};
      const name = item.snackName || windowName(item.regionId, item.floor, item.num);
      return {
        ...item,
        id,
        kind: 'window',
        name,
        windowName: name,
        meta: {
          kind: item.regionId === 'snack' ? 'snack' : 'window',
          regionId: item.regionId,
          floor: item.floor,
          num: item.num,
          windowName: name,
        },
        counts,
        tags: summarizeTags(tagCounts),
        ...summarizeVotes(counts),
      };
    });
    const localDishes = new Map(getAllDishes().map((dish) => [dish.id, dish]));
    const dishes = (data.items || [])
      .filter((item) => item.id.startsWith('dish:'))
      .map((item) => {
        const local = localDishes.get(item.id);
        const meta = item.meta || {};
        const counts = item.counts || {};
        return {
          ...local,
          ...meta,
          id: item.id,
          kind: 'dish',
          name: local?.dish || meta.dishName || '未命名菜品',
          windowName: local?.windowName || meta.windowName || windowName(meta.regionId, meta.floor, meta.num),
          counts,
          tags: summarizeTags(item.tagCounts || {}),
          ...summarizeVotes(counts),
        };
      });
    rows.value = [...windows, ...dishes].sort(
      (a, b) => rankScore(b) - rankScore(a) || b.total - a.total || b.stars - a.stars,
    );
    error.value = '';
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <GlobalHeader />
  <main class="page page-rank">
    <header class="rank-heading">
      <span class="rank-kicker">大家的真实评分</span>
      <h1>美食排行榜</h1>
      <p>按窗口或菜品查看评分，也可以直接为去过的窗口打分。</p>
    </header>

    <section class="manual-vote" aria-labelledby="manual-vote-title">
      <div class="manual-head">
        <h2 id="manual-vote-title">手动选择窗口评分</h2>
        <p>无需等待随机抽取，直接找到想评分的窗口。</p>
      </div>
      <div class="manual-search">
        <input
          v-model="voteKeyword"
          type="search"
          class="search-input"
          placeholder="搜索窗口或摊位（如：麻辣烫、3楼、小吃街）"
          aria-label="搜索窗口或摊位"
        />
        <ul v-if="voteKeyword.trim()" class="search-results">
          <li v-for="win in matchedWindows" :key="`${win.regionId}:${win.floor}:${win.num}`">
            <button type="button" class="search-result" @click="pickScoringWindow(win)">
              <strong>{{ win.name }}</strong>
              <span>{{ win.label }}</span>
            </button>
          </li>
          <li v-if="!matchedWindows.length" class="search-empty">没有找到匹配的窗口</li>
        </ul>
      </div>
      <div class="window-picker">
        <label>
          <span>餐厅</span>
          <select v-model="selectedRegion" @change="syncFloor">
            <option v-for="canteen in availableCanteens" :key="canteen.id" :value="canteen.id">{{ canteen.name }}</option>
          </select>
        </label>
        <label>
          <span>楼层</span>
          <select v-model="selectedFloor" @change="syncWindow">
            <option v-for="floor in availableFloors" :key="floor" :value="String(floor)">{{ floor }}楼</option>
          </select>
        </label>
        <label>
          <span>窗口</span>
          <select v-model="selectedNum">
            <option v-for="item in availableWindows" :key="item.num" :value="String(item.num)">{{ item.num }}号 · {{ item.name }}</option>
          </select>
        </label>
      </div>
      <div v-if="selectedWindow" class="selected-window">
        <strong>{{ selectedWindow.name }}</strong>
          <span v-if="selectedRegion === 'snack'">小吃街 · 一楼 · {{ selectedWindow.name }}</span>
          <span v-else>{{ canteens[selectedRegion]?.name }} · {{ selectedFloor }}楼{{ selectedNum }}号窗口</span>
      </div>
      <VotePanel
        v-if="selectedWindow"
        :key="selectedWindow.id"
        :vote-id="selectedWindow.id"
        :meta="selectedWindow.meta"
        label="窗口评分"
      />
      <div v-if="selectedWindow" class="dish-scoring">
        <div class="dish-head">
          <h3>单独菜品评分</h3>
          <span v-if="availableDishes.length">{{ availableDishes.length }} 道菜</span>
        </div>
        <div v-if="availableDishes.length" class="dish-filters">
          <label class="dish-select">
            <span>搜索菜品</span>
            <input
              v-model="dishKeyword"
              type="search"
              class="search-input"
              placeholder="搜索菜品（支持模糊匹配）"
              aria-label="搜索菜品"
            />
          </label>
          <label class="dish-select">
            <span>选择菜品</span>
            <select v-model="selectedDishId">
              <option value="" disabled>选择一个菜品</option>
              <option v-for="dish in filteredDishes" :key="dish.id" :value="dish.id">
                {{ dish.dish }}{{ dish.price ? `（${dish.price}）` : '' }}
              </option>
            </select>
          </label>
          <p v-if="!filteredDishes.length" class="dish-empty">没有匹配的菜品</p>
        </div>
        <p v-else class="dish-empty">这个窗口还没录入菜单，暂无菜品可评。</p>
        <VotePanel
          v-if="selectedDish"
          :key="`${selectedWindow.id}:${selectedDish.id}`"
          :vote-id="selectedDish.id"
          :meta="selectedDish.meta"
          label="菜品评分"
        />
      </div>
    </section>

    <div class="rank-tabs" role="tablist" aria-label="排行榜类型">
      <button type="button" role="tab" :aria-selected="activeList === 'window'" @click="activeList = 'window'">窗口榜</button>
      <button type="button" role="tab" :aria-selected="activeList === 'dish'" @click="activeList = 'dish'">菜品榜</button>
    </div>

    <div class="rank-search">
      <input
        v-model="rankKeyword"
        type="search"
        class="search-input"
        :placeholder="activeList === 'dish' ? '搜索菜品、窗口（支持模糊匹配）' : '搜索窗口、摊位（支持模糊匹配）'"
        :aria-label="activeList === 'dish' ? '搜索菜品' : '搜索窗口'"
      />
      <button v-if="rankKeyword" type="button" class="chip" @click="rankKeyword = ''">清除</button>
    </div>

    <div class="filter-group rank-region-filter" aria-label="榜单区域筛选">
      <span class="filter-label" id="rank-region-label">区域</span>
      <div class="filter-options" role="group" aria-labelledby="rank-region-label">
        <button
          v-for="region in rankingRegionOptions"
          :key="region.id"
          type="button"
          class="chip"
          :aria-pressed="selectedRankingRegions.includes(region.id)"
          @click="toggleRankingRegion(region.id)"
        >{{ region.name }}</button>
      </div>
    </div>

    <p v-if="loading" class="rank-hint">加载中...</p>
    <p v-else-if="error" class="rank-error">排行榜服务未连接：{{ error }}</p>
    <p v-else-if="!selectedRankingRegions.length" class="rank-hint">请至少选择一个区域后查看榜单。</p>

    <ol v-else-if="visibleRows.length" class="rank-list">
      <li v-for="(row, index) in visibleRows" :key="row.id" class="rank-item">
        <span class="rank-no">{{ index + 1 }}</span>
        <div class="rank-main">
          <strong class="rank-name">{{ row.name }}</strong>
          <span v-if="row.regionId === 'snack'" class="rank-meta">{{ row.windowName }} · 小吃街 · 一楼</span>
          <span v-else class="rank-meta">{{ row.windowName }} · {{ canteens[row.regionId]?.name }} · {{ row.floor }}楼{{ row.num }}号窗口</span>
          <div v-if="row.tags?.length" class="rank-tags" aria-label="热门标签">
            <span v-for="tag in row.tags" :key="tag.key">{{ tag.name }} {{ tag.count }}</span>
          </div>
        </div>
        <div class="rank-score">
          <template v-if="row.level">
            <span class="vote-level">{{ LEVEL_MAP[row.level].name }}</span>
            <span class="vote-stars">{{ starsText(row.stars) }}</span>
          </template>
          <span v-else class="rank-empty">暂无评分</span>
          <span class="rank-count">{{ row.total }} 票</span>
        </div>
      </li>
    </ol>
    <p v-else class="rank-hint">{{ rankKeyword.trim() ? '没有找到匹配的结果。' : (activeList === 'dish' ? '暂无菜品评分，先从菜单或抽取结果给菜品打分吧。' : '暂无窗口评分，先从抽选结果或手动选择给窗口打分吧。') }}</p>
  </main>
</template>

<style scoped>
.rank-heading { margin-bottom: var(--spacing-xl); text-align: left; }
.rank-heading h1 { margin: 0.15rem 0 0.35rem; text-align: left; }
.rank-heading p { color: var(--color-text-secondary); font-size: 0.92rem; }
.rank-kicker { color: var(--color-accent-strong); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.18em; }
.manual-vote { margin-bottom: var(--spacing-xl); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-lg); background: var(--color-bg-secondary); }
.manual-head h2 { font-size: 1.15rem; }
.manual-head h2::after { content: ''; display: block; width: 2.5rem; height: 2px; margin-top: var(--spacing-sm); background: var(--color-accent-strong); border-radius: 1px; }
.manual-head h2 { font-size: 1.15rem; }
.manual-head p, .selected-window span { color: var(--color-text-secondary); font-size: 0.85rem; }
.window-picker { display: grid; grid-template-columns: 1fr 0.75fr 2fr; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.window-picker label { display: grid; gap: var(--spacing-xs); color: var(--color-text-secondary); font-size: 0.8rem; }
.window-picker select { width: 100%; min-width: 0; min-height: 2.75rem; padding: 0.55rem 0.65rem; color: var(--color-text); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.selected-window { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.dish-scoring { margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px dashed var(--color-border); }
.dish-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); }
.dish-head h3 { margin: 0; font-size: 1rem; }
.dish-head span { color: var(--color-text-secondary); font-size: 0.78rem; }
.dish-select { display: grid; gap: var(--spacing-xs); color: var(--color-text-secondary); font-size: 0.8rem; }
.dish-select select { width: 100%; min-width: 0; min-height: 2.75rem; padding: 0.55rem 0.65rem; color: var(--color-text); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.dish-empty { margin: 0; padding: 0.8rem; color: var(--color-text-secondary); font-size: 0.85rem; background: var(--color-bg); border: 1px dashed var(--color-border); border-radius: var(--radius-md); }
.search-input { width: 100%; min-width: 0; min-height: 2.6rem; padding: 0.5rem 0.7rem; color: var(--color-text); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.manual-search { margin-top: var(--spacing-md); }
.dish-filters { display: grid; gap: var(--spacing-sm); }
.search-results { list-style: none; margin-top: var(--spacing-xs); max-height: 16rem; overflow-y: auto; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); }
.search-results > li + li { border-top: 1px solid var(--color-border); }
.search-result { display: flex; flex-direction: column; align-items: flex-start; gap: 0.15rem; width: 100%; padding: 0.55rem 0.7rem; color: var(--color-text); background: transparent; border: 0; text-align: left; cursor: pointer; }
.search-result:hover { background: var(--color-bg-secondary); }
.search-result strong { font-weight: 600; }
.search-result span { color: var(--color-text-secondary); font-size: 0.78rem; }
.search-empty { padding: 0.6rem 0.7rem; color: var(--color-text-secondary); font-size: 0.82rem; }
.rank-search { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-md); }
.rank-search .search-input { flex: 1; }
.rank-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; margin-bottom: var(--spacing-md); padding: 0.25rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-secondary); }
.rank-region-filter { margin-bottom: var(--spacing-md); }
.rank-tabs button { min-height: 2.6rem; padding: 0.55rem; color: var(--color-text-secondary); background: transparent; border: 0; border-radius: 6px; cursor: pointer; }
.rank-tabs button[aria-selected='true'] { color: var(--color-primary); background: var(--color-bg); box-shadow: var(--shadow-sm); font-weight: 700; }
.rank-hint, .rank-error { text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg) 0; }
.rank-error { color: var(--color-error); }
.rank-list { list-style: none; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.rank-item { display: grid; grid-template-columns: 2.25rem minmax(0, 1fr) auto; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); background: var(--color-bg); }
.rank-item + .rank-item { border-top: 1px solid var(--color-border); }
.rank-no { display: grid; place-items: center; width: 2rem; height: 2rem; color: var(--color-text-secondary); background: var(--color-bg-secondary); border-radius: 50%; font-size: 0.85rem; font-weight: 700; }
.rank-item:nth-child(-n+3) .rank-no { color: var(--color-accent-strong); background: var(--color-accent-soft); }
.rank-main { min-width: 0; }
.rank-name { display: block; overflow-wrap: anywhere; }
.rank-meta { display: block; color: var(--color-text-secondary); font-size: 0.8rem; overflow-wrap: anywhere; }
.rank-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.4rem; }
.rank-tags span { padding: 0.1rem 0.45rem; color: var(--color-accent-strong); background: var(--color-accent-soft); border: 1px solid var(--color-accent-border); border-radius: 999px; font-size: 0.72rem; }
.rank-score { display: grid; grid-template-columns: auto auto; align-items: center; gap: 0 var(--spacing-xs); white-space: nowrap; }
.vote-level { color: var(--color-primary); font-weight: 600; }
.vote-stars { color: var(--color-warning); }
.rank-count, .rank-empty { color: var(--color-text-secondary); font-size: 0.8rem; }
.rank-count { grid-column: 1 / -1; text-align: right; }

@media (max-width: 600px) {
  .rank-heading { margin-bottom: var(--spacing-lg); }
  .manual-vote { padding: var(--spacing-md); }
  .window-picker { grid-template-columns: 1fr 1fr; }
  .window-picker label:last-child { grid-column: 1 / -1; }
  .rank-item { grid-template-columns: 2rem minmax(0, 1fr); gap: var(--spacing-sm); padding: 0.85rem; }
  .rank-score { grid-column: 2; justify-self: start; margin-top: var(--spacing-xs); }
  .rank-count { text-align: left; }
}
</style>
