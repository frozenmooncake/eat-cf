<script setup>
import { ref, computed } from 'vue';
import GlobalHeader from '../../components/GlobalHeader.vue';
import VotePanel from '../../components/VotePanel.vue';
import VoteSummary from '../../components/VoteSummary.vue';
import FeedbackDialog from '../../components/FeedbackDialog.vue';
import { canteens, getWindowName, isNoodle, isOther, isRice, pickFrom, snackStalls } from '../../data.js';
import { dishTypeMatches, dishVoteId, getAllDishes, getMenuWindow, priceInRange, windowHasDishInRange } from '../../menu-data.js';
import { showToast } from '../../utils.js';

const regions = ref(['canting1', 'canting2', 'snack']);
const floors = ref([1, 2]);
const type = ref('all');
const minPrice = ref('');
const maxPrice = ref('');

const result = ref(null);
const selectedDish = ref(null);
const hasPickedWindow = ref(false);

const feedbackOpen = ref(false);
const feedbackTarget = ref(null);
const feedbackTitle = ref('');

function openFeedback(target, title) {
  feedbackTarget.value = target;
  feedbackTitle.value = title;
  feedbackOpen.value = true;
}

function openResultFeedback() {
  if (!result.value) return;
  if (result.value.kind === 'dish') {
    openDishFeedback();
    return;
  }
  if (result.value.kind === 'snack') {
    openFeedback(
      {
        kind: 'snack',
        regionId: 'snack',
        floor: 1,
        num: result.value.num,
        name: result.value.plainName || result.value.name,
      },
      `小吃街 · ${result.value.plainName || result.value.name}`,
    );
  } else {
    const windowName = result.value.plainName || result.value.name;
    openFeedback(
      { kind: 'window', regionId: result.value.regionId, floor: result.value.floor, num: result.value.num, windowName },
      `${result.value.info} · ${windowName}`,
    );
  }
}

function openDishFeedback() {
  if (!selectedDish.value || !result.value) return;
  const windowName = result.value.plainName || result.value.name;
  openFeedback(
    {
      kind: 'dish',
      regionId: selectedDish.value.regionId,
      floor: selectedDish.value.floor,
      num: selectedDish.value.num,
      dishIndex: selectedDish.value.index,
      dishName: selectedDish.value.dish,
      windowName,
    },
    `${result.value.info} · ${windowName} · ${selectedDish.value.dish}`,
  );
}
const windowId = computed(() => {
  if (!result.value || !['window', 'snack'].includes(result.value.kind)) return null;
  return `${result.value.regionId}:${result.value.floor}:${result.value.num}`;
});

const windowMeta = computed(() => {
  if (!result.value || !['window', 'snack'].includes(result.value.kind)) return null;
  return {
    regionId: result.value.regionId,
    floor: result.value.floor,
    num: result.value.num,
    kind: result.value.kind,
    windowName: result.value.plainName || result.value.name,
  };
});

const menuWindow = computed(() => {
  if (!result.value || result.value.kind !== 'window') return null;
  return getMenuWindow(result.value.regionId, result.value.floor, result.value.num);
});

const dishId = computed(() => {
  if (!selectedDish.value || !result.value) return null;
  return dishVoteId(
    selectedDish.value.regionId,
    selectedDish.value.floor,
    selectedDish.value.num,
    selectedDish.value.index,
  );
});

const dishMeta = computed(() => {
  if (!selectedDish.value || !result.value) return null;
  return {
    kind: 'dish',
    regionId: selectedDish.value.regionId,
    floor: selectedDish.value.floor,
    num: selectedDish.value.num,
    dishIndex: selectedDish.value.index,
    dishName: selectedDish.value.dish,
    windowName: selectedDish.value.windowName || menuWindow.value?.name || result.value.plainName || result.value.name,
  };
});

function toggle(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function buildPool() {
  const pool = [];
  if (regions.value.includes('snack')) {
    snackStalls.forEach((name, index) => pool.push({ kind: 'snack', name, num: index + 1 }));
  }
  regions.value
    .filter((r) => r !== 'snack')
    .forEach((regionId) => {
      const floorsData = canteens[regionId]?.floors ?? {};
      Object.keys(floorsData).forEach((fk) => {
        const floor = Number(fk);
        if (!floors.value.includes(floor)) return;
        Object.keys(floorsData[floor]).forEach((nk) => {
          const num = Number(nk);
          if (regionId === 'canting1' && floor === 2 && (num === 4 || num === 5)) return;
          if (type.value === 'rice' && !isRice(regionId, floor, num)) return;
          if (type.value === 'noodle' && !isNoodle(regionId, floor, num)) return;
          if (type.value === 'other' && !isOther(regionId, floor, num)) return;
          if (!windowHasDishInRange(getMenuWindow(regionId, floor, num), minPrice.value, maxPrice.value)) return;
          pool.push({ kind: 'window', regionId, floor, num });
        });
      });
    });
  return pool;
}

function draw() {
  selectedDish.value = null;
  const pool = buildPool();
  if (!pool.length) {
    showToast('没有符合条件的窗口，请调整筛选条件');
    return;
  }
  hasPickedWindow.value = true;
  const picked = pickFrom(pool);
  if (picked.kind === 'snack') {
    result.value = {
      kind: 'snack',
      regionId: 'snack',
      floor: 1,
      num: picked.num,
      title: '🍢 小吃街推荐',
      name: picked.name,
      plainName: picked.name,
      info: '小吃街摊位',
    };
  } else {
    const restaurant = canteens[picked.regionId];
    result.value = {
      kind: 'window',
      regionId: picked.regionId,
      floor: picked.floor,
      num: picked.num,
      title: '🎲 随机抽选结果',
      name: getWindowName(picked.regionId, picked.floor, picked.num),
      plainName: canteens[picked.regionId].floors[picked.floor][picked.num].replace(/\n/g, ' / '),
      info: `${restaurant.name} · ${picked.floor}楼${picked.num}号窗口`,
    };
  }
}

function dishMatchesActiveFilters(item) {
  return dishTypeMatches(item, type.value, item)
    && (minPrice.value === '' && maxPrice.value === ''
      ? true
      : priceInRange(item.price, minPrice.value, maxPrice.value));
}

function buildDishPool() {
  return getAllDishes()
    .filter((item) => regions.value.includes(item.regionId))
    .filter((item) => floors.value.includes(item.floor))
    .filter(dishMatchesActiveFilters)
    .map((item) => ({ ...item, index: item.dishIndex }));
}

function buildSelectedWindowDishPool() {
  const source = result.value;
  if (!source || !['window', 'snack'].includes(source.kind)) return [];

  let targetNum = Number(source.num);
  if (source.kind === 'window') {
    const menuWindowData = getMenuWindow(source.regionId, source.floor, source.num);
    if (!menuWindowData) return [];
    targetNum = Number(menuWindowData.num);
  }

  return getAllDishes()
    .filter((item) => item.regionId === source.regionId)
    .filter((item) => Number(item.floor) === Number(source.floor))
    .filter((item) => Number(item.num) === targetNum)
    .filter(dishMatchesActiveFilters)
    .map((item) => ({ ...item, index: item.dishIndex }));
}

function drawDish() {
  const useSelectedWindow = hasPickedWindow.value
    && result.value
    && ['window', 'snack'].includes(result.value.kind);
  const pool = useSelectedWindow ? buildSelectedWindowDishPool() : buildDishPool();
  if (!pool.length) {
    showToast('没有符合条件的菜品，请调整筛选条件');
    return;
  }
  const picked = pickFrom(pool);
  if (useSelectedWindow) {
    result.value.title = '🎲 随机窗口';
    selectedDish.value = { ...picked };
    return;
  }

  hasPickedWindow.value = false;
  const isSnack = picked.regionId === 'snack';
  const restaurant = canteens[picked.regionId];
  result.value = {
    kind: isSnack ? 'snack' : 'window',
    regionId: picked.regionId,
    floor: picked.floor,
    num: picked.num,
    title: '🎲 随机窗口',
    name: picked.windowName,
    plainName: picked.windowName,
    info: isSnack ? `小吃街 · ${picked.windowName}` : `${restaurant.name} · ${picked.floor}楼${picked.num}号窗口`,
  };
  selectedDish.value = { ...picked };
}
</script>

<template>
  <GlobalHeader />
  <main class="main">
    <header class="home-heading">
      <span>华水江淮校区</span>
      <h1 class="page-title">今天吃什么？</h1>
      <p>选好范围，交给盲盒决定这一餐。</p>
    </header>

    <section class="card filter-panel" aria-label="抽取筛选">
      <div class="filter-group">
        <span class="filter-label">区域</span>
        <div class="filter-options">
          <button
            v-for="r in [['canting1','一餐厅'],['canting2','二餐厅'],['snack','小吃街']]"
            :key="r[0]"
            type="button"
            class="chip"
            :aria-pressed="regions.includes(r[0])"
            @click="regions = toggle(regions, r[0])"
          >{{ r[1] }}</button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">楼层</span>
        <div class="filter-options">
          <button
            v-for="f in [1,2]"
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
            v-for="t in [['all','全部'],['rice','米饭'],['noodle','面食'],['other','其他']]"
            :key="t[0]"
            type="button"
            class="chip"
            :aria-pressed="type === t[0]"
            @click="type = t[0]"
          >{{ t[1] }}</button>
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

    <section class="card result-card" aria-live="polite">
      <template v-if="result">
        <div class="window-info">{{ result.title }}</div>
        <div class="window-name" v-html="result.name"></div>
        <div class="window-info">{{ result.info }}</div>
        <VoteSummary v-if="windowId" :key="windowId" :vote-id="windowId" :meta="windowMeta" />
        <button type="button" class="btn fb-trigger" @click="openResultFeedback">报告数据问题</button>
      </template>
      <template v-else>
        <div class="window-name">欢迎使用</div>
        <div class="window-info">点击下方按钮开始抽选</div>
      </template>
      <div v-if="selectedDish" class="dish-result">
        <div class="window-info">推荐菜品</div>
        <div class="dish-name">{{ selectedDish.dish }}</div>
        <div v-if="selectedDish.price" class="dish-price">{{ selectedDish.price }}</div>
        <VoteSummary v-if="dishId" :key="`summary-${dishId}`" :vote-id="dishId" :meta="dishMeta" />
        <button type="button" class="btn fb-trigger fb-trigger--sm" @click="openDishFeedback">菜品数据有误？</button>
      </div>
    </section>

    <div class="button-grid">
      <button type="button" class="btn btn--primary" @click="draw">🎲 开始抽选</button>
      <button type="button" class="btn btn--primary" @click="drawDish">🍽️ 抽一道菜</button>
    </div>

    <VotePanel v-if="windowId" :key="`panel-${windowId}`" :vote-id="windowId" :meta="windowMeta" label="窗口评分" />

    <VotePanel
      v-if="dishId"
      :key="`dish-${dishId}`"
      :vote-id="dishId"
      :meta="dishMeta"
      label="菜品评分"
    />

    <FeedbackDialog
      :open="feedbackOpen"
      :target="feedbackTarget"
      :title="feedbackTitle"
      @close="feedbackOpen = false"
    />

    <footer class="site-footer">
      <a href="./pages/friends.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M13.05 9.79L10 7.5a1 1 0 1 1 1-1.732l3.05 2.292a2.5 2.5 0 0 1 0 4.166L11 15.964a1 1 0 1 1-1-1.732l3.05-2.293a.5.5 0 0 0 0-.833zM7 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1z" /></svg>
        友链站
      </a>
      <a href="./pages/guestbook.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" /></svg>
        留言板
      </a>
      <a href="mailto:xyrct301@outlook.com?subject=%E5%8D%8E%E6%B0%B4%E7%BE%8E%E9%A3%9F%E7%9B%B2%E7%9B%92-%E6%B1%9F%E6%B7%AE%E9%97%AE%E9%A2%98%E5%8F%8D%E9%A6%88" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" /></svg>
        问题反馈
      </a>
      <a href="./pages/note.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
        作者手记
      </a>
      <a href="./pages/add.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" /><path d="M18 14h-4v4h4v-4z" fill="var(--color-primary)" /></svg>
        添加应用
      </a>
      <a href="./pages/menu.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" /></svg>
        菜单与价位
      </a>
      <a href="./pages/rank.html" class="footer-link">
        <svg class="link-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        排行榜
      </a>
      <div class="version-info">版本号 2.2<br />by 速冻月饼</div>
    </footer>
  </main>
</template>

<style scoped>
.home-heading {
  margin: var(--spacing-xl) 0 var(--spacing-lg);
  text-align: center;
}

.home-heading > span {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.home-heading p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.dish-result {
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
}

.dish-name {
  color: var(--color-text);
  font-size: 1.15rem;
  font-weight: 600;
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

.dish-price {
  color: var(--color-primary);
  font-size: 0.9rem;
}

.fb-trigger {
  margin-top: var(--spacing-md);
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.fb-trigger--sm {
  margin: var(--spacing-sm) 0 var(--spacing-md);
}
</style>
