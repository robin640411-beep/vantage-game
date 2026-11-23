const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 瀏覽器端到端測試：驗證卡牌標記（Card Markers）渲染 ===');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
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

  console.log('--- 測試 1：設定命運 1705 並放置 3 個救援標記 ---');
  await page.evaluate(() => {
    s.fates = [1705];
    s.markers[1705] = 3;
    s.fates.push(1598);
    s.markers[1598] = 2;
    s.supply.push(1706);
    s.markers[1706] = 5;
    save();
    render();
  });
  await page.waitForTimeout(300);

  // 檢查 flowCard 1705 是否渲染了 3 個實體標記方塊 (slotMarkerPin) 以及 3 個待放置虛線格 (slotMarkerGhost)
  const pinCount = await page.locator('.flowCard[data-card="1705"] .slotMarkerPin').count();
  const ghostCount = await page.locator('.flowCard[data-card="1705"] .slotMarkerGhost').count();
  const badgeText = await page.locator('.flowCard[data-card="1705"] .markerBadge').innerText();

  console.log(`Card 1705: pins=${pinCount}, ghosts=${ghostCount}, badge="${badgeText}"`);
  assert.strictEqual(pinCount, 3, '應渲染 3 個放置的標記方塊');
  assert.strictEqual(ghostCount, 3, '應渲染 3 個待放置的虛線槽');
  assert(badgeText.includes('救援標記 3 / 6'), '徽章應顯示 救援標記 3 / 6');

  console.log('--- 測試 2：點擊卡牌 1705 查看詳情彈窗 ---');
  await page.locator('.flowCard[data-card="1705"] img.art').click();
  await page.waitForTimeout(200);

  const modalHtml = await page.locator('#zoomBody').innerHTML();
  assert(modalHtml.includes('目前已放置 <b>3</b> 個標記（目標共 <b>6</b> 個）'), '彈窗內應有標記進度說明');
  assert(modalHtml.includes('slotMarkerPin'), '彈窗圖片上也應標注標記');
  await page.locator('#cardZoom button:has-text("返回")').click();
  await page.waitForTimeout(200);

  console.log('--- 測試 3：設定 result 結算階段並點擊「結束回合並等待救援」按鈕 ---');
  await page.evaluate(() => {
    s.phase = 'result';
    s.a = { id: 119, origin: 119, kind: '地點', book: 'look', text: '探險故事完成。', dice: [] };
    save();
    render();
  });
  await page.waitForTimeout(200);

  const rescueBtn = page.locator('button', { hasText: '結束回合並等待救援' });
  assert(await rescueBtn.isVisible(), '應顯示「結束回合並等待救援」按鈕');
  await rescueBtn.click();
  await page.waitForTimeout(300);

  const newMarkers = await page.evaluate(() => s.markers[1705]);
  console.log(`點擊等待救援後，1705 標記數: ${newMarkers}`);
  assert.strictEqual(newMarkers, 4, '標記應增加至 4 個');

  const newPinCount = await page.locator('.flowCard[data-card="1705"] .slotMarkerPin').count();
  console.log(`新放置方塊數: ${newPinCount}`);
  assert.strictEqual(newPinCount, 4, 'UI 上應即時渲染 4 個實體標記方塊');

  console.log('ALL BROWSER TESTS PASSED!');
  await browser.close();
})();
