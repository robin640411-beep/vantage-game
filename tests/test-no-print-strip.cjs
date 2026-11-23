const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 測試：驗證所有卡牌下方不再有多餘的截圖切片（printStrip / 牌面文字）===');

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

  console.log('--- 測試 1：設定命運 1705、1598 與使命 1585 ---');
  await page.evaluate(() => {
    s.fates = [1705, 1598];
    s.mission = 1585;
    s.supply = [1706, 1266];
    save();
    render();
  });
  await page.waitForTimeout(300);

  // 檢查 DOM 中是否完全不存在 .printStrip 與 .stripLabel
  const printStripCount = await page.locator('.printStrip').count();
  const stripLabelCount = await page.locator('.stripLabel').count();
  console.log(`頁面中 .printStrip 數量: ${printStripCount}, .stripLabel 數量: ${stripLabelCount}`);
  assert.strictEqual(printStripCount, 0, '頁面中不應存在任何 .printStrip 截圖切片');
  assert.strictEqual(stripLabelCount, 0, '頁面中不應存在任何 .stripLabel「牌面文字」');

  // 檢查 flowCard 1705 的結構
  const flow1705Html = await page.locator('.flowCard[data-card="1705"]').innerHTML();
  assert(!flow1705Html.includes('牌面文字'), '1705 卡牌下方不應再有牌面文字');
  assert(!flow1705Html.includes('printStrip'), '1705 卡牌下方不應再有多餘截圖');

  // 確保所有彈窗關閉
  await page.evaluate(() => {
    diceTray.close();
    viewer.close();
    cardZoom.close();
  });
  await page.waitForTimeout(200);

  // 截圖確認 flowCard 1705 乾淨整潔
  const card1705El = page.locator('.flowCard[data-card="1705"]');
  await card1705El.screenshot({ path: path.resolve(__dirname, 'flow_1705_no_strip.png') });
  console.log('已儲存乾淨版 1705 卡牌截圖：flow_1705_no_strip.png');

  console.log('=== 所有卡牌無多餘截圖切片驗證通過！ ===');
  await browser.close();
})().catch(err => {
  console.error('測試失敗:', err);
  process.exit(1);
});
