// 餐厅窗口数据 — 手工维护

// 楼层 -> 窗口号 -> 窗口名
// 名字含 \n 表示该窗口同时经营两种食物
export const canteens = {
  canting1: {
    id: 'canting1',
    name: '1餐厅',
    floors: {
   1: {
    1: '油饼母鸡汤/砂锅土豆粉',
    2: '中式套餐饭',
    3: '潮汕猪肘饭',
    4: '韩式滑蛋饭/手工水饺',
    5: '豫老饕肉酱面',
    6: '辉夫人猪肚鸡',
    7: '手撕烩面',
    8: '川锦汇',
    9: '掉渣饼',
    10: '茄煌饭\n红米家饭',
    11: '馋嘴鱼',
    12: '知麦现炒浇头面',
    13: '王小撒炸鸡腿',
    14: '好粥道',
    15: '麦多馅饼',
    16: '麻辣烫',
    17: '自选餐',
    18: '重庆小面',
    19: '花小甲老碗面',
    20: '鸡蛋灌饼/山东杂粮煎饼',
    21: '秘制铁板炒饭/面',
    22: '玖灵猫土豆泥拌饭',
    23: '面世家',
    24: '0090汉堡工厂',
  },
   2: {
    1: '学长自选菜',
    3: '奉天朱家小馆',
    4: '奉天朱家小馆',
    5: '奉天朱家小馆',
    6: '麻辣香锅',
    7: '麻辣拌粉/面',
    8: '炒鸡拌饭\n麻辣香锅',
    9: '椒麻鸡汤/粉/面',
    10: '自选水饺\n烤盘饭',
    11: '烤鸭拌饭',
    12: '盖浇饭\n套餐饭',
    13: '大盘鸡',
    14: '锡纸炒鸡/牛羊肉水饺',
    15: '派乐汉堡',
    16: '牛羊肉汤',
    17: '茶香鸡',
    18: '烤肉拌饭',
    19: '姥姥家面饭馆',
    20: '王小胖自助小火锅',
    21: '螺蛳粉/螺当铺',
    22: '王小胖麻辣烫',
    23: '螺簸箕螺蛳粉',
    24: '姥姥家面饭馆',
  },
    },
  },
  canting2: {
    id: 'canting2',
    name: '2餐厅',
    floors: { 1: {} },
  },
};

// 米饭类窗口（[楼层, 窗口号]，部分窗口双分类）
export const riceWindows = [
  // 一楼
  [1, 3], // 潮汕猪肘饭
  [1, 4], // 韩式滑蛋饭
  [1, 6], // 辉夫人猪肚鸡
  [1, 10], // 茄煌饭/红米家饭
  [1, 11], // 馋嘴鱼
  [1, 17], // 自选餐
  [1, 5], // 天下好面/蹦蹦鸡米饭（双分类）
  [1, 21], // 秘制铁板炒饭/面（双分类）
  // 二楼
  [2, 1], // 学长自选菜
  [2, 3], // 奉天朱家小馆（3至5号共用一个抽奖代表）
  [2, 8], // 炒鸡拌饭\n麻辣香锅
  [2, 10], // 自选水饺\n烤盘饭
  [2, 11], // 烤鸭拌饭
  [2, 12], // 盖浇饭\n套餐饭
  [2, 13], // 大盘鸡
  [2, 14], // 锡纸炒鸡/牛羊肉水饺
  [2, 17], // 茶香鸡
  [2, 18], // 烤肉拌饭
  [2, 20], // 王小胖自助小火锅
  [2, 24], // 姥姥家面饭馆
];

// 面食类窗口（[楼层, 窗口号]，部分窗口双分类）
export const noodleWindows = [
  // 一楼
  [1, 7], // 粗粮渔粉
  [1, 12], // 知麦现炒浇头面
  [1, 18], // 重庆小面
  [1, 19], // 花小甲老碗面
  [1, 23], // 面世家
  [1, 5], // 天下好面/蹦蹦鸡米饭（双分类）
  [1, 16], // 麻辣烫
  [1, 21], // 秘制铁板炒饭/面（双分类）
  // 二楼
  [2, 3], // 奉天朱家小馆（3至5号共用一个抽奖代表）
  [2, 6], // 麻辣香锅
  [2, 7], // 麻辣拌粉/面
  [2, 9], // 椒麻鸡汤/粉/面
  [2, 14], // 锡纸炒鸡/牛羊肉水饺
  [2, 16], // 牛羊肉汤
  [2, 19], // 姥姥家面饭馆
  [2, 21], // 螺蛳粉/螺当铺
  [2, 22], // 王小胖麻辣烫
  [2, 23], // 螺簸箕螺蛳粉
  [2, 24], // 姥姥家面饭馆
];

// 小吃街摊位名单（随机抽选用）
export const snackStalls = [
  '沈阳喷醋鸡架',
  '酥饼/合子摊',
  '烧烤串摊A',
  '烧烤串摊B',
  '烧烤串摊C',
  '搞杯喝嘞（柠檬茶）',
  '福鼎肉片',
  '牛大嘴炒饭',
  '小陈大福馄饨',
  '手工水饺/千里香馄饨',
  '华水老字号肉夹馍',
  '口口香炒饭',
  '方家炒饭',
  '华姐炒馅小笼包',
  '哇噻柠檬（冰粉奶茶果汁）',
  '陈记爆汁黄焖鸡',
  '张记酱肉小笼包',
  '小廖鸡叉骨',
  '芝士火鸡面烤冷面（罗山首家）',
  '烤冷面/蛋包火鸡面',
  '杂粮煎饼果子',
  '小厨十里香馄饨',
];

// 全部门店列表（随机抽选用）
export function getAllWindows() {
  const windows = [];
  for (const regionId in canteens) {
    for (const floor in canteens[regionId].floors) {
      for (const num in canteens[regionId].floors[floor]) {
        windows.push({ regionId, floor: Number(floor), num: Number(num) });
      }
    }
  }
  return windows;
}

// 取窗口名（含换行则转为 <br>）
export function getWindowName(regionId, floor, num) {
  return canteens[regionId].floors[floor][num].replace(/\n/g, '<br>');
}

// 从给定列表中随机抽一个 [楼层, 窗口号]
export function pickFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 全局随机抽一个窗口
export function isRice(regionId, floor, num) {
  return regionId === 'canting1' && riceWindows.some(([itemFloor, itemNum]) => itemFloor === floor && itemNum === num);
}

export function isNoodle(regionId, floor, num) {
  return regionId === 'canting1' && noodleWindows.some(([itemFloor, itemNum]) => itemFloor === floor && itemNum === num);
}

export function isOther(regionId, floor, num) {
  return !isRice(regionId, floor, num) && !isNoodle(regionId, floor, num);
}
