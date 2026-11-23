const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 瀏覽器端到端測試：驗證全卡牌標記槽與互動邏輯 ===');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
  const fileUrl = url.pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  await page.goto(fileUrl);

  // 開始遊戲進入探險
  await page.getByRole('button', { name: '開始探險' }).click();
  await page.evaluate(() => {
    if (s.phase === 'mission') confirmMission();
    escapePod();
    if (s.phase === 'crash') land();
    diceTray.close();
  });
  await page.waitForTimeout(300);

  console.log('--- 測試 1：設定多種標記卡牌（1585、1598、1603、1706、1266）---');
  await page.evaluate(() => {
    s.mission = 1585;
    s.markers[1585] = 1;

    s.fates = [1598, 1603];
    s.markers[1598] = 2;
    s.markers[1603] = 2;

    s.supply = [1706, 1266];
    s.markers[1706] = 5;
    s.boost[1266] = 2;

    save();
    render();
  });
  await page.waitForTimeout(300);

  // 驗證 1585 (使命：1 個 pin, 1 個 ghost)
  const pin1585 = await page.locator('.flowCard[data-card="1585"] .slotMarkerPin').count();
  const ghost1585 = await page.locator('.flowCard[data-card="1585"] .slotMarkerGhost').count();
  console.log(`Card 1585: pins=${pin1585}, ghosts=${ghost1585}`);
  assert.strictEqual(pin1585, 1, '1585 應有 1 個放置標記');
  assert.strictEqual(ghost1585, 1, '1585 應有 1 個待放置虛線格');

  // 驗證 1598 (命運：2 個 pins, 1 個 ghost)
  const pin1598 = await page.locator('.flowCard[data-card="1598"] .slotMarkerPin').count();
  const ghost1598 = await page.locator('.flowCard[data-card="1598"] .slotMarkerGhost').count();
  console.log(`Card 1598: pins=${pin1598}, ghosts=${ghost1598}`);
  assert.strictEqual(pin1598, 2, '1598 應有 2 個放置標記');
  assert.strictEqual(ghost1598, 1, '1598 應有 1 個待放置虛線格');

  // 驗證 1706 (18 格矩陣：5 個 pins, 13 個 ghost)
  const pin1706 = await page.locator('.flowCard[data-card="1706"] .slotMarkerPin').count();
  const ghost1706 = await page.locator('.flowCard[data-card="1706"] .slotMarkerGhost').count();
  console.log(`Card 1706: pins=${pin1706}, ghosts=${ghost1706}`);
  assert.strictEqual(pin1706, 5, '1706 應有 5 個放置標記');
  assert.strictEqual(ghost1706, 13, '1706 應有 13 個待放置虛線格');

  // 驗證 1266 (構築物：2 個 boost pins, 1 個 ghost)
  const pin1266 = await page.locator('.flowCard[data-card="1266"] .slotMarkerPin').count();
  const ghost1266 = await page.locator('.flowCard[data-card="1266"] .slotMarkerGhost').count();
  console.log(`Card 1266: pins=${pin1266}, ghosts=${ghost1266}`);
  assert.strictEqual(pin1266, 2, '1266 應有 2 個強化標記');
  assert.strictEqual(ghost1266, 1, '1266 應有 1 個待放置虛線格');

  console.log('--- 測試 2：倒數任務卡 1635 回合推進自動遞減 ---');
  await page.evaluate(() => {
    s.supply.push(1635);
    syncCardMarkersState();
    save();
    render();
  });
  await page.waitForTimeout(200);

  let initialCount1635 = await page.evaluate(() => s.markers[1635]);
  assert.strictEqual(initialCount1635, 8, '1635 初始標記應為 8');

  // 模擬前進回合
  await page.evaluate(() => {
    handleTurnAdvance();
    save();
    render();
  });
  await page.waitForTimeout(200);

  let afterTurn1635 = await page.evaluate(() => s.markers[1635]);
  console.log(`Card 1635 after 1 turn advance: markers=${afterTurn1635}`);
  assert.strictEqual(afterTurn1635, 7, '推進回合後 1635 標記應減少為 7');

  console.log('--- 測試 3：探險任務卡 1643 到訪新地點自動遞減 ---');
  await page.evaluate(() => {
    s.supply.push(1643);
    syncCardMarkersState();
    s.visited = [117];
    save();
    render();
  });
  await page.waitForTimeout(200);

  let initialCount1643 = await page.evaluate(() => s.markers[1643]);
  assert.strictEqual(initialCount1643, 5, '1643 初始標記應為 5');

  // 模擬移動到未到訪地點 118
  await page.evaluate(() => {
    travel(118);
    save();
    render();
  });
  await page.waitForTimeout(200);

  let afterTravel1643 = await page.evaluate(() => s.markers[1643]);
  console.log(`Card 1643 after traveling to new location: markers=${afterTravel1643}`);
  assert.strictEqual(afterTravel1643, 4, '前往新地點後 1643 標記應減少為 4');

  console.log('--- 測試 4：卡牌詳情彈窗點擊與標記展示 ---');
  await page.locator('.flowCard[data-card="1706"] img.art').click();
  await page.waitForTimeout(200);

  const modalHtml = await page.locator('#zoomBody').innerHTML();
  assert(modalHtml.includes('目前已放置 <b>5</b> 個標記（目標共 <b>18</b> 個）'), '彈窗內應顯示正確標記進度');
  assert(modalHtml.includes('slotMarkerPin'), '彈窗內圖片應有標記釘');
  await page.locator('#cardZoom button:has-text("返回")').click();

  console.log('=== 瀏覽器端到端測試全部通過！ ===');
  await browser.close();
})().catch(err => {
  console.error('測試失敗:', err);
  process.exit(1);
});
