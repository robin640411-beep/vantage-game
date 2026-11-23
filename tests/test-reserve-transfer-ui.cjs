const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 瀏覽器測試：驗證儲備區整合 UI 與 3×3 網格視覺化卡牌替換彈窗 ===');

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

  console.log('--- 測試 1：驗證舊版下拉選單已徹底移除，改用直觀面板 ---');
  const oldDropdownCount = await page.evaluate(() => {
    return document.querySelectorAll('select#transferCard, select#transferSlot').length;
  });
  assert.equal(oldDropdownCount, 0, '舊版下拉選單 (transferCard / transferSlot) 應已被完全移除');

  console.log('--- 測試 2：驗證儲備區卡牌清晰展示在「儲備容量」正下方 ---');
  await page.evaluate(() => {
    // 設置英雄為 1435，給予 3 點強化
    s.grid = [1165, 0, 0, 0, 1435, 0, 0, 0, 0];
    s.boost[1435] = 3;
    // 放入儲備牌 1454
    s.reserve = [1454];
    save();
  });
  await page.waitForTimeout(200);

  const reservePanelCheck = await page.evaluate(() => {
    const panel = document.querySelector('.reservePanel');
    if (!panel) return { found: false };
    const title = panel.querySelector('.reserveTitleRow h3')?.textContent || '';
    const cardsSection = panel.querySelector('.reserveCardsSection');
    const cardItems = panel.querySelectorAll('.reserveCardItem');
    const card1454 = panel.querySelector('.reserveCardItem .reserveSubtitle')?.textContent || '';
    const transferBtn = panel.querySelector('.btnTransferCard');
    return {
      found: true,
      title,
      hasCardsSection: !!cardsSection,
      cardCount: cardItems.length,
      cardText: card1454,
      hasTransferBtn: !!transferBtn && transferBtn.textContent.includes('裝備至網格')
    };
  });

  assert.ok(reservePanelCheck.found, '應渲染 .reservePanel');
  assert.ok(reservePanelCheck.title.includes('儲備容量'), '應包含儲備容量標題');
  assert.ok(reservePanelCheck.hasCardsSection, '儲備容量下方應有 .reserveCardsSection');
  assert.equal(reservePanelCheck.cardCount, 1, '應有一張儲備卡');
  assert.ok(reservePanelCheck.cardText.includes('1454'), '應正確顯示儲備卡 1454');
  assert.ok(reservePanelCheck.hasTransferBtn, '儲備卡應有「裝備至網格」按鈕');
  console.log('✔ 儲備區卡牌已正確展示在儲備容量下方，且具備快捷裝備按鈕');

  console.log('--- 測試 3：驗證點擊儲備卡「裝備至網格」彈出視覺化 3×3 網格彈窗 ---');
  await page.click('.btnTransferCard');
  await page.waitForTimeout(200);

  const modalCheck = await page.evaluate(() => {
    const modal = document.getElementById('transferModal');
    if (!modal || !modal.open) return { open: false };
    const title = modal.querySelector('.transferModalHead h3')?.textContent || '';
    const gridBoard = modal.querySelector('.transferGridBoard');
    const slots = modal.querySelectorAll('.transferSlot');
    const centerSlot = modal.querySelector('.centerHeroSlot');
    const centerHeroText = centerSlot?.querySelector('.slotLockNote')?.textContent || '';
    const occupiedSlot = modal.querySelector('.occupiedSlotBtn');
    const occupiedText = occupiedSlot?.querySelector('.slotOccupiedTitle')?.textContent || '';
    const emptySlots = modal.querySelectorAll('.emptySlotBtn');

    return {
      open: true,
      title,
      hasGridBoard: !!gridBoard,
      slotCount: slots.length,
      centerHeroText,
      occupiedText,
      emptySlotCount: emptySlots.length
    };
  });

  assert.ok(modalCheck.open, '點擊後 #transferModal 應處於開啟狀態');
  assert.ok(modalCheck.title.includes('裝備儲備卡牌至 3×3 行囊網格'), '彈窗標題應清晰正確');
  assert.equal(modalCheck.slotCount, 9, '應有 9 個網格槽位供直觀點選');
  assert.ok(modalCheck.centerHeroText.includes('不可替換'), '中間英雄卡應標註不可替換');
  assert.ok(modalCheck.occupiedText.length > 0, '已有卡牌的槽位應顯示卡牌名稱與替換標籤');
  assert.equal(modalCheck.emptySlotCount, 7, '其餘 7 個槽位應為空位');
  console.log('✔ 彈窗成功開啟，3×3 網格視覺化面板正確展示角色不可替換、已有卡牌及空位');

  console.log('--- 測試 4：在彈窗中點擊替換佔用卡牌（第 1 格，1165）---');
  // 截圖彈窗畫面
  await page.screenshot({ path: path.resolve(__dirname, 'transfer_modal_preview.png') });

  // 點擊替換第 1 格 (1165)
  await page.click('.occupiedSlotBtn');
  await page.waitForTimeout(300);

  const transferResult = await page.evaluate(() => {
    const modal = document.getElementById('transferModal');
    return {
      modalOpen: modal ? modal.open : false,
      heroBoost: s.boost[1435],
      grid0: s.grid[0],
      reserve: s.reserve,
      lastLog: s.log[s.log.length - 1]
    };
  });

  assert.equal(transferResult.modalOpen, false, '替換完成後彈窗應自動關閉');
  assert.equal(transferResult.heroBoost, 2, '英雄應扣除 1 點強化 (3 -> 2)');
  assert.equal(transferResult.grid0, 1454, '第 1 格卡牌應被替換為 1454');
  assert.deepEqual(transferResult.reserve, [1165], '原卡牌 1165 應自動移入儲備區');
  assert.ok(transferResult.lastLog.includes('支付 1 角色強化，將卡牌 1454 裝備至第 1 格，原卡牌 1165 移入儲備區'), '日誌應清晰記錄轉移與替換');
  console.log('✔ 成功替換網格卡牌！舊卡移入儲備區、新卡裝備至網格、扣除 1 點角色強化');

  console.log('--- 測試 5：驗證替換後儲備區立即展示原卡 1165 ---');
  const updatedReserveCheck = await page.evaluate(() => {
    const cardItem = document.querySelector('.reservePanel .reserveCardItem .reserveSubtitle');
    return cardItem?.textContent || '';
  });
  assert.ok(updatedReserveCheck.includes('1165'), '儲備區現在應即時顯示卡牌 1165');
  console.log('✔ 儲備區即時響應更新');

  console.log('--- 測試 6：將儲備區 1165 放入空位（第 2 格）---');
  await page.click('.btnTransferCard');
  await page.waitForTimeout(200);

  // 點擊第一個空位按鈕 (第 2 格)
  await page.click('.emptySlotBtn');
  await page.waitForTimeout(300);

  const emptySlotResult = await page.evaluate(() => {
    return {
      heroBoost: s.boost[1435],
      grid1: s.grid[1],
      reserve: s.reserve,
      lastLog: s.log[s.log.length - 1]
    };
  });

  assert.equal(emptySlotResult.heroBoost, 1, '英雄應扣除 1 點強化 (2 -> 1)');
  assert.equal(emptySlotResult.grid1, 1165, '第 2 格應裝備 1165');
  assert.equal(emptySlotResult.reserve.length, 0, '儲備區應已變空');
  assert.ok(emptySlotResult.lastLog.includes('支付 1 角色強化，將卡牌 1165 裝備至第 2 格'), '日誌應記錄放入空位');
  console.log('✔ 成功將儲備卡放入空位，儲備區與網格正確同步');

  // 截圖最終隨身行囊畫面
  await page.screenshot({ path: path.resolve(__dirname, 'reserve_transfer_bag_verified.png') });

  await browser.close();
  console.log('=== 所有儲備區與卡牌替換 UI 測試通過！ ===');
})();
