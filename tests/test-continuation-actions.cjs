const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 測試開始：驗證所有繼續行動（Continuation Actions）功能 ===');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
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

  console.log('--- 測試 1：驗證地點 117「攀爬」行動結算後的繼續行動按鈕 ---');
  await page.evaluate(() => {
    s.loc = 117;
    s.turn = 1;
    s.used = [];
    s.phase = 'ready';
    save();
    render();
  });
  await page.waitForTimeout(300);

  // 點擊「攀爬」行動
  await page.locator('button.actionTile:has-text("攀爬")').click();
  await page.waitForTimeout(300);

  // 擲骰並承受所有挑戰骰
  await page.locator('button:has-text("擲")').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("承受所有剩餘骰子")').click();
  await page.waitForTimeout(400);

  // 檢查故事結果畫面
  const storyText = await page.locator('.storyMessage .story').textContent();
  assert.ok(storyText.includes('你可以繼續執行獲取-取出行動'), '故事應包含取出行動提示');

  const actionButtons = await page.locator('.actionPanel button').allTextContents();
  console.log('地點 117 結算按鈕：', actionButtons);
  assert.ok(actionButtons.some(b => b.includes('繼續行動：獲取－取出')), '應有明確標註「繼續行動：獲取－取出」的按鈕');
  assert.ok(actionButtons.some(b => b.includes('進入下一回合')), '可選結束回合按鈕');

  // 驗證「繼續行動：獲取－取出」為 primary 按鈕
  const continueBtn = page.locator('button:has-text("繼續行動：獲取－取出")');
  const btnClass = await continueBtn.getAttribute('class');
  assert.ok(btnClass && btnClass.includes('primary'), '繼續行動按鈕應具備 primary 高亮樣式');

  console.log('--- 測試 2：點擊「繼續行動：獲取－取出」進入追加行動準備狀態 ---');
  await continueBtn.click();
  await page.waitForTimeout(400);

  // 驗證進入追加行動提示
  const noticeText = await page.locator('.continuationNotice').textContent();
  console.log('追加行動提示：', noticeText);
  assert.ok(noticeText.includes('獲取－取出'), '應顯示「可繼續執行『獲取－取出』」提示');

  // 驗證行動清單已被精確篩選為「取出」
  const displayedActionNames = await page.locator('.actionPanel .actionTile b').allTextContents();
  console.log('當前可選行動清單：', displayedActionNames);
  assert.equal(displayedActionNames.length, 1, '應僅顯示 1 個被指定的追加行動');
  assert.equal(displayedActionNames[0], '取出', '該行動名稱應為「取出」');

  // 驗證回合數未被增加（同回合繼續）
  const curTurn = await page.evaluate(() => s.turn);
  assert.equal(curTurn, 1, '回合數不應增加（同回合繼續）');

  console.log('--- 測試 3：點擊「取出」行動並確認進入其費用階段 ---');
  await page.locator('button.actionTile:has-text("取出")').click();
  await page.waitForTimeout(300);

  const titleInCost = await page.locator('.actionPanel h2').textContent();
  console.log('進入取出行動費用階段標題：', titleInCost);
  assert.ok(titleInCost.includes('取出水晶或划艇') || titleInCost.includes('取出'), '應成功進入「取出」行動');

  console.log('--- 測試 4：驗證地點 117 其他行動（如「詢問」「分享」「劫掠」）皆能正確觸發繼續取出行動 ---');
  for (const [actionName, eventUid] of [
    ['詢問', 'story:engage:0117:01'],
    ['分享', 'story:help:0117:01'],
    ['劫掠', 'story:overpower:0117:01']
  ]) {
    await page.evaluate(({ evt }) => {
      s.loc = 117;
      s.phase = 'ready';
      s.used = [];
      delete s.practiceAction;
      delete s.extraBook;
      save();
      render();
    }, { evt: eventUid });
    await page.waitForTimeout(200);

    const btn = page.locator(`button.actionTile:has-text("${actionName}")`);
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text("擲")').click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text("承受所有剩餘骰子")').click();
      await page.waitForTimeout(300);

      const contBtn = page.locator('button:has-text("繼續行動：獲取－取出")');
      assert.equal(await contBtn.count(), 1, `行動「${actionName}」結算後應有「繼續行動：獲取－取出」按鈕`);
      console.log(`✓ 地點 117「${actionName}」成功觸發「繼續行動：獲取－取出」`);
    }
  }

  console.log('--- 測試 5：驗證浴室卡（士氣 5/6 執行另一個行動）解析 ---');
  await page.evaluate(() => {
    s.stats[1] = 6; // 士氣設為 6
    s.phase = 'result';
    s.a = {
      id: 1687,
      kind: '卡牌',
      key: 'action:1687:01',
      name: '沐浴',
      book: 'take',
      event: 'story:take:1687:01',
      title: '沐浴並洗去疲憊身軀上的汙垢（如果你已經有5或6點士氣，執行另一個行動）',
      text: '浴缸裡溫暖的泡泡水讓你感覺很棒。獲得2點士氣。',
      cost: 1,
      dice: []
    };
    save();
    render();
  });
  await page.waitForTimeout(300);

  const bathContBtn = page.locator('button:has-text("繼續行動：執行另一個行動（士氣充沛）")');
  assert.equal(await bathContBtn.count(), 1, '士氣充足時應有追加另一個行動的按鈕');
  console.log('✓ 浴室卡士氣充足時成功顯示追加行動按鈕');

  await browser.close();
  console.log('=== 所有繼續行動測試全數通過！ ===');
})();
