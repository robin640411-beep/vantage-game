const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 瀏覽器測試：驗證隨身行囊 3×3 網格與全卡牌實體強化槽渲染 ===');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 440, height: 900 } });
  const fileUrl = url.pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  await page.goto(fileUrl);

  // 開始遊戲
  await page.getByRole('button', { name: '開始探險' }).click();
  await page.evaluate(() => {
    if (s.phase === 'mission') confirmMission();
    escapePod();
    if (s.phase === 'crash') land();
    diceTray.close();
  });
  await page.waitForTimeout(300);

  console.log('--- 測試 1：設定與使用者截圖完全一致的 6 張網格卡牌與強化數值 ---');
  await page.evaluate(() => {
    // 網格卡牌配置：軍刀(1299)、蒂娜(1440)、地圖/元素體(1404)、竹螳螂(851)、傳送(1411)、智慧生物(1353)
    s.grid = [1299, 1440, 1404, 851, 1411, 1353, 0, 0, 0];
    s.boost = {
      1299: 3,
      1440: 5,
      1404: 1,
      851: 2,
      1411: 1,
      1353: 2
    };

    // 模擬骰槽佔用
    const c1299 = WORLD.cards['1299']?.slots || [];
    if (c1299[0]) s.occupied[c1299[0].uid] = '空白';
    if (c1299[1]) s.occupied[c1299[1].uid] = '生命';

    const c1440 = WORLD.cards['1440']?.slots || [];
    if (c1440[0]) s.occupied[c1440[0].uid] = '士氣';

    const c1404 = WORLD.cards['1404']?.slots || [];
    if (c1404[0]) s.occupied[c1404[0].uid] = '挫折';

    const c851 = WORLD.cards['851']?.slots || [];
    if (c851[0]) s.occupied[c851[0].uid] = '士氣';

    const c1411 = WORLD.cards['1411']?.slots || [];
    if (c1411[0]) s.occupied[c1411[0].uid] = '時間';

    save();
    render();
  });
  await page.waitForTimeout(300);

  // 確保所有彈窗關閉並滾動到隨身行囊區域
  await page.evaluate(() => {
    diceTray.close();
    viewer.close();
    cardZoom.close();
    document.querySelector('.board')?.scrollIntoView();
  });
  await page.waitForTimeout(300);

  // 截取隨身行囊 .board 區域截圖供審查
  const boardEl = page.locator('.board');
  await boardEl.screenshot({ path: path.resolve(__dirname, 'grid_boost_verified.png') });
  console.log('已儲存網格強化槽實體渲染截圖：grid_boost_verified.png');

  // 驗證 1299 (軍刀)：3 個槽位，3 個強化，0 個虛線
  const pins1299 = await page.locator('.board button:nth-child(1) .slotBoostPin').count();
  const ghosts1299 = await page.locator('.board button:nth-child(1) .slotBoostGhost').count();
  console.log(`軍刀 1299: 強化方塊=${pins1299}, 待放虛線=${ghosts1299}`);
  assert.strictEqual(pins1299, 3, '軍刀應有 3 個實體強化方塊');
  assert.strictEqual(ghosts1299, 0, '軍刀所有槽位已滿，虛線應為 0');

  // 驗證 1440 (角色 蒂娜)：6 個槽位，5 個強化，1 個虛線
  const pins1440 = await page.locator('.board button:nth-child(2) .slotBoostPin').count();
  const ghosts1440 = await page.locator('.board button:nth-child(2) .slotBoostGhost').count();
  console.log(`角色 1440: 強化方塊=${pins1440}, 待放虛線=${ghosts1440}`);
  assert.strictEqual(pins1440, 5, '角色蒂娜應有 5 個實體強化方塊');
  assert.strictEqual(ghosts1440, 1, '角色蒂娜應有 1 個待放置虛線格');

  // 驗證 1404 (沙元素體)：3 個槽位，1 個強化，2 個虛線
  const pins1404 = await page.locator('.board button:nth-child(3) .slotBoostPin').count();
  const ghosts1404 = await page.locator('.board button:nth-child(3) .slotBoostGhost').count();
  console.log(`卡牌 1404: 強化方塊=${pins1404}, 待放虛線=${ghosts1404}`);
  assert.strictEqual(pins1404, 1, '卡牌 1404 應有 1 個實體強化方塊');
  assert.strictEqual(ghosts1404, 2, '卡牌 1404 應有 2 個待放置虛線格');

  // 驗證 851 (竹螳螂)：2 個槽位，2 個強化，0 個虛線
  const pins851 = await page.locator('.board button:nth-child(4) .slotBoostPin').count();
  const ghosts851 = await page.locator('.board button:nth-child(4) .slotBoostGhost').count();
  console.log(`竹螳螂 851: 強化方塊=${pins851}, 待放虛線=${ghosts851}`);
  assert.strictEqual(pins851, 2, '竹螳螂應有 2 個實體強化方塊');
  assert.strictEqual(ghosts851, 0, '竹螳螂應有 0 個待放置虛線格');

  // 驗證 1411 (傳送)：3 個槽位，1 個強化，2 個虛線
  const pins1411 = await page.locator('.board button:nth-child(5) .slotBoostPin').count();
  const ghosts1411 = await page.locator('.board button:nth-child(5) .slotBoostGhost').count();
  console.log(`傳送 1411: 強化方塊=${pins1411}, 待放虛線=${ghosts1411}`);
  assert.strictEqual(pins1411, 1, '傳送應有 1 個實體強化方塊');
  assert.strictEqual(ghosts1411, 2, '傳送應有 2 個待放置虛線格');

  // 驗證 1353 (智慧生物)：3 個槽位，2 個強化，1 個虛線
  const pins1353 = await page.locator('.board button:nth-child(6) .slotBoostPin').count();
  const ghosts1353 = await page.locator('.board button:nth-child(6) .slotBoostGhost').count();
  console.log(`智慧生物 1353: 強化方塊=${pins1353}, 待放虛線=${ghosts1353}`);
  assert.strictEqual(pins1353, 2, '智慧生物應有 2 個實體強化方塊');
  assert.strictEqual(ghosts1353, 1, '智慧生物應有 1 個待放置虛線格');

  // 驗證左下角不再有多餘重複的文字「強 X」堆疊
  const countersCount = await page.locator('.board button:nth-child(1) .cardCounters').count();
  if (countersCount > 0) {
    const cardCountersText = await page.locator('.board button:nth-child(1) .cardCounters').innerText();
    console.log('軍刀 cardCounters 文字內容:', JSON.stringify(cardCountersText));
    assert(!cardCountersText.includes('強 3'), '當卡面已有實體方塊時，左下角不應再顯示重複的文字標籤');
  } else {
    console.log('軍刀 cardCounters 已完全隱藏，左下角不再有任何多餘文字覆蓋！');
  }

  console.log('--- 測試 2：點擊角色卡 1440 查看卡牌放大詳情彈窗 ---');
  await page.locator('.board button:nth-child(2)').click();
  await page.waitForTimeout(200);

  const modalHtml = await page.locator('#zoomBody').innerHTML();
  assert(modalHtml.includes('目前已放置 <b>5</b> 個強化方塊（槽位共 <b>6</b> 個）'), '彈窗內應有精準的強化方塊與槽位說明');
  assert(modalHtml.includes('slotBoostPin'), '彈窗圖片上也應有實體強化方塊');
  await page.locator('#cardZoom button:has-text("返回")').click();
  await page.waitForTimeout(200);

  console.log('=== 全卡牌實體強化槽渲染測試全數通過！ ===');
  await browser.close();
})().catch(err => {
  console.error('測試失敗:', err);
  process.exit(1);
});
