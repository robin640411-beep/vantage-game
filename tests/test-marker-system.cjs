const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const files = [
  'boost-slots.js', 'tabletop.js', 'world.js', 'book-index.js', 'duel.js', 'response-text.js',
  'story.js', 'rewards.js', 'missions.js', 'location-captions.js',
  'card-flow.js', 'voyage.js', 'map.js', 'lava-maze.js', 'rules.js', 'auto.js', 'game.js'
];

let savedData = null;
const ctx = {
  console,
  app: { innerHTML: '' },
  localStorage: {
    getItem: () => savedData,
    setItem: (k, v) => { savedData = v; },
    removeItem: () => { savedData = null; }
  },
  document: {
    getElementById: (id) => ({ value: '0', innerHTML: '', style: {}, showModal: () => {}, close: () => {} })
  },
  cardZoom: { showModal: () => {}, close: () => {} },
  zoomBody: {},
  diceTray: { showModal: () => {}, close: () => {} },
  viewer: { showModal: () => {}, close: () => {} }
};
vm.createContext(ctx);

for (const f of files) {
  const code = fs.readFileSync('萬境奇旅/手機網頁遊戲/dist/' + f, 'utf8');
  vm.runInContext(code, ctx);
}

// 1. Initial test for Card 1705 with wait for rescue
vm.runInContext(`
s = {
  phase: 'result',
  hero: 0,
  loc: 119,
  turn: 1,
  stats: [4, 4, 4],
  skill: [0, 0, 0, 0, 0, 0],
  grid: [803, 804, 805, 806, 1435, 807, 808, 809, 810],
  fates: [1705],
  markers: {},
  boost: { 1435: 2 },
  reserve: [],
  supply: [],
  occupied: {},
  used: [],
  once: [],
  log: [],
  a: { id: 119, origin: 119, kind: '地點', book: 'look', text: '探險故事。', dice: [] }
};
`, ctx);

console.log('--- Test 1: FlowCard 1705 initial view ---');
const flow1 = vm.runInContext('flowCard(1705)', ctx);
assert(flow1.includes('slotMarkerGhost'), 'Should have ghost slots initially on 1705');
assert(flow1.includes('救援標記 0 / 6'), 'Should display 救援標記 0 / 6 badge');

console.log('--- Test 2: Finish and wait for rescue ---');
assert(vm.runInContext('rescueTurnEnd()', ctx), 'rescueTurnEnd should be true');
vm.runInContext('finish(false, true)', ctx);
assert.strictEqual(vm.runInContext('s.markers[1705]', ctx), 1, 'Markers on 1705 should be 1');
assert.strictEqual(vm.runInContext('s.boost[1435]', ctx), 3, 'Character should gain 1 boost');

const flow2 = vm.runInContext('flowCard(1705)', ctx);
assert(flow2.includes('slotMarkerPin'), 'Should render placed slotMarkerPin on 1705');
assert(flow2.includes('救援標記 1 / 6'), 'Should display 救援標記 1 / 6 badge');

console.log('--- Test 3: Card modal zoom for 1705 ---');
vm.runInContext('card(1705)', ctx);
assert(ctx.zoomBody.innerHTML.includes('目前已放置 <b>1</b> 個標記（目標共 <b>6</b> 個）'), 'Card modal should detail marker progress');

console.log('--- Test 4: Settle story markers for Fate 1598 ---');
vm.runInContext(`
s.phase = 'result';
s.a = {
  id: 138, origin: 138, kind: '地點', book: 'engage',
  text: WORLD.stories['story:engage:0138:01'][1],
  dice: []
};
settleRewards();
`, ctx);
assert(vm.runInContext('s.fates.includes(1598)', ctx), 'Fate 1598 should be added to fates');
assert.strictEqual(vm.runInContext('s.markers[1598]', ctx), 1, 'Fate 1598 should have 1 marker');
const flow1598 = vm.runInContext('flowCard(1598)', ctx);
assert(flow1598.includes('信號標記 1 / 3'), 'FlowCard 1598 should display 信號標記 1 / 3 badge');

console.log('--- Test 5: Settle story markers for Task 1706 ---');
vm.runInContext(`
s.a = {
  id: 107, origin: 107, kind: '地點', book: 'look',
  text: WORLD.stories['story:look:0107:01'][1],
  dice: []
};
settleRewards();
`, ctx);
assert(vm.runInContext('s.supply.includes(1706)', ctx), 'Task 1706 should be added to supply');
assert.strictEqual(vm.runInContext('s.markers[1706]', ctx), 1, 'Task 1706 should have 1 marker');
const flow1706 = vm.runInContext('flowCard(1706)', ctx);
assert(flow1706.includes('符文標記 1 / 18'), 'FlowCard 1706 should display 符文標記 1 / 18 badge');

console.log('--- Test 6: Settle story markers for Task 1680 ---');
vm.runInContext(`
s.a = {
  id: 1680, origin: 785, kind: '卡牌', book: 'engage',
  text: WORLD.stories['story:engage:1680:01'][1],
  dice: []
};
settleRewards();
`, ctx);
assert.strictEqual(vm.runInContext('s.markers[1680]', ctx), 1, 'Task 1680 should have 1 marker');
const flow1680 = vm.runInContext('flowCard(1680)', ctx);
assert(flow1680.includes('巡邏標記 1 / 2'), 'FlowCard 1680 should display 巡邏標記 1 / 2 badge');

console.log('--- Test 7: Settle story markers for Mission 1592 ---');
vm.runInContext(`
s.a = {
  id: 1592, origin: 522, kind: '卡牌', book: 'move',
  text: WORLD.stories['story:move:1592:01'][1],
  dice: []
};
settleRewards();
`, ctx);
assert.strictEqual(vm.runInContext('s.markers[1592]', ctx), 2, 'Mission 1592 should have 2 markers');
const flow1592 = vm.runInContext('flowCard(1592)', ctx);
assert(flow1592.includes('征服標記 2 / 3'), 'FlowCard 1592 should display 征服標記 2 / 3 badge');

console.log('--- Test 8: Skip practice with wait for rescue ---');
vm.runInContext(`
s.phase = 'ready';
s.practiceAction = 'action:0117:05';
skipPractice(true);
`, ctx);
assert.strictEqual(vm.runInContext('s.markers[1705]', ctx), 2, 'Markers on 1705 should be 2 after skipPractice with rescue');

console.log('--- Test 9: Rescue arrived at 6 markers ---');
vm.runInContext(`
s.markers[1705] = 5;
s.phase = 'result';
s.a = { id: 119, origin: 119, kind: '地點', book: 'look', text: '探險故事。', dice: [] };
finish(false, true);
`, ctx);
assert.strictEqual(vm.runInContext('s.markers[1705]', ctx), 6, 'Markers on 1705 should be 6');
assert.strictEqual(vm.runInContext('s.rescueArrived', ctx), true, 'rescueArrived should be true at 6 markers');

console.log('ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
