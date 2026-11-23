const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

console.log('=== 全面卡牌標記系統單元測試 ===');

const files = [
  'boost-slots.js', 'tabletop.js', 'world.js', 'book-index.js', 'duel.js', 'response-text.js',
  'story.js', 'rewards.js', 'missions.js', 'location-captions.js',
  'card-flow.js', 'voyage.js', 'map.js', 'lava-maze.js', 'rules.js', 'auto.js', 'game.js'
];

let savedData = null;
const ctx = {
  console,
  app: { innerHTML: '' },
  detail: { innerHTML: '' },
  zoomBody: { innerHTML: '' },
  localStorage: {
    getItem: () => savedData,
    setItem: (k, v) => { savedData = v; },
    removeItem: () => { savedData = null; }
  },
  document: {
    getElementById: (id) => ({ value: '0', innerHTML: '', style: {}, showModal: () => {}, close: () => {} })
  },
  cardZoom: { open: false, showModal: () => {}, close: () => {} },
  diceTray: { open: false, showModal: () => {}, close: () => {} },
  viewer: { open: false, showModal: () => {}, close: () => {} }
};
vm.createContext(ctx);

for (const f of files) {
  const code = fs.readFileSync(path.resolve(__dirname, '../dist/' + f), 'utf8');
  vm.runInContext(code, ctx);
}

// Setup clean game state
vm.runInContext(`
  s = {
    hero: 0,
    turn: 1,
    loc: 117,
    phase: 'ready',
    stats: [5, 5, 5],
    skill: [1, 0, 0, 0, 0, 0],
    grid: [0, 0, 0, 0, 1435, 0, 0, 0, 0],
    reserve: [],
    supply: [],
    boost: { 1435: 2 },
    markers: {},
    occupied: {},
    penalty: 0,
    money: 2,
    log: [],
    used: [],
    once: [],
    fates: [1705, 1598, 1603],
    mission: 1585,
    full: false
  };
`, ctx);

console.log('--- 測試 1：驗證所有關鍵卡牌均已配置 cardMarkerPins 與 markerCardLimits ---');
const expectedCards = [
  1585, 1592, 1598, 1603, 1631, 1634, 1635, 1638,
  1642, 1643, 1659, 1669, 1673, 1680, 1695, 1696,
  1702, 1705, 1706, 1707, 1266
];

for (const id of expectedCards) {
  const hasPins = vm.runInContext(`Boolean((cardMarkerPins[${id}] || cardBoostPins[${id}]) && (cardMarkerPins[${id}] || cardBoostPins[${id}]).length > 0)`, ctx);
  const hasLimits = vm.runInContext(`Boolean(markerCardLimits[${id}] || (cards[${id}] && cards[${id}].cap > 0))`, ctx);
  assert.ok(hasPins, `卡牌 ${id} 必須配置標記槽座標`);
  assert.ok(hasLimits, `卡牌 ${id} 必須配置標記限額`);
  const pinCount = vm.runInContext(`(cardMarkerPins[${id}] || cardBoostPins[${id}]).length`, ctx);
  const cardName = vm.runInContext(`markerCardLimits[${id}]?.name || cards[${id}]?.name`, ctx);
  console.log(`✓ 卡牌 ${id} (${cardName}): ${pinCount} 個槽位`);
}

console.log('--- 測試 2：驗證命運卡 1598 (信號標記) 物理方塊渲染 ---');
vm.runInContext(`
  s.markers[1598] = 2;
  html1598 = flowCard(1598);
`, ctx);
const html1598 = ctx.html1598;
assert.ok(html1598.includes('slotMarkerPin'), '1598 必須包含已放置方塊 slotMarkerPin');
assert.ok(html1598.includes('slotMarkerGhost'), '1598 必須包含待放置幽靈槽 slotMarkerGhost');
assert.ok(html1598.includes('信號標記 2 / 3'), '1598 必須包含進度徽章');
console.log('✓ 1598 物理方塊渲染驗證通過');

console.log('--- 測試 3：驗證使命卡 1585 (地圖標記) 與 1592 (征服標記) 渲染 ---');
vm.runInContext(`
  s.atlasPages = [12, 15];
  syncCardMarkersState();
  html1585 = flowCard(1585);
  s.markers[1592] = 1;
  s.mission = 1592;
  html1592 = flowCard(1592);
`, ctx);
assert.equal(ctx.s.markers[1585], 2, '1585 應依 atlasPages 同步為 2 個標記');
assert.ok(ctx.html1585.includes('地圖標記 2 / 2'), '1585 應顯示地圖標記進度');
assert.ok(ctx.html1592.includes('征服標記 1 / 3'), '1592 應顯示征服標記進度');
console.log('✓ 1585 與 1592 驗證通過');

console.log('--- 測試 4：驗證倒數任務 1635 (殺死靈魂之王，8標記) 與回合遞減 ---');
vm.runInContext(`
  s.supply.push(1635);
  syncCardMarkersState();
`, ctx);
assert.equal(ctx.s.markers[1635], 8, '任務 1635 初次加入應賦予 8 個倒數標記');
vm.runInContext(`
  handleTurnAdvance();
`, ctx);
assert.equal(ctx.s.markers[1635], 7, '任務 1635 進入下一回合應遞減為 7 個標記');
const html1635 = vm.runInContext(`flowCard(1635)`, ctx);
assert.ok(html1635.includes('倒數標記 7 / 8'), '1635 應顯示 7 / 8');
console.log('✓ 1635 倒數機制驗證通過');

console.log('--- 測試 5：驗證任務 1643 (引導孩童進行冒險，5標記) 與地點移動遞減 ---');
vm.runInContext(`
  s.supply.push(1643);
  syncCardMarkersState();
`, ctx);
assert.equal(ctx.s.markers[1643], 5, '任務 1643 初次加入應賦予 5 個標記');
vm.runInContext(`
  travel(118);
`, ctx);
assert.equal(ctx.s.markers[1643], 4, '任務 1643 抵達新地點 118 應遞減為 4 個標記');
console.log('✓ 1643 地點移動遞減機制驗證通過');

console.log('--- 測試 6：驗證任務 1706 (找到隱藏的符文，18槽位矩陣) ---');
vm.runInContext(`
  s.supply.push(1706);
  s.markers[1706] = 5;
  html1706 = flowCard(1706);
`, ctx);
const html1706 = ctx.html1706;
const pinCount1706 = (html1706.match(/class="slotMarkerPin"/g) || []).length;
const ghostCount1706 = (html1706.match(/class="slotMarkerGhost"/g) || []).length;
assert.equal(pinCount1706, 5, '1706 應渲染 5 個已放置方塊');
assert.equal(ghostCount1706, 13, '1706 應渲染 13 個待放置幽靈槽 (共 18 槽)');
console.log('✓ 1706 符文 18 槽位矩陣驗證通過');

console.log('--- 測試 7：驗證構築物卡牌 (1266 穀倉) 方塊槽位投影 ---');
vm.runInContext(`
  s.grid[0] = 1266;
  s.boost[1266] = 2;
  html1266 = cardMarkers(1266);
`, ctx);
const html1266 = ctx.html1266;
const pinCount1266 = (html1266.match(/slotMarkerPin/g) || []).length;
const ghostCount1266 = (html1266.match(/slotMarkerGhost/g) || []).length;
assert.equal(pinCount1266, 2, '構築物 1266 應有 2 個強化方塊');
assert.equal(ghostCount1266, 1, '構築物 1266 應有 1 個待放置幽靈槽');
console.log('✓ 構築物 1266 驗證通過');

console.log('--- 測試 8：驗證卡牌詳情彈窗 card(n) 標記狀態顯示 ---');
vm.runInContext(`
  card(1603);
`, ctx);
const modalHtml = ctx.zoomBody.innerHTML;
assert.ok(modalHtml.includes('🎯 對決讚譽'), '彈窗內應顯示標記狀態標題');
assert.ok(modalHtml.includes('目前已放置'), '彈窗內應顯示放置進度');
console.log('✓ 卡牌詳情彈窗驗證通過');

console.log('=== 所有全卡牌標記測試全數通過！ ===');
