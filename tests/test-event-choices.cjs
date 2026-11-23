const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 測試開始：驗證故事事件選項（Story Event Choices）功能 ===');

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

  console.log('--- 測試 1：驗證使用者截圖中的地點 119「詢問」事件（story:engage:0119:01）出現選項 ---');
  await page.evaluate(() => {
    s.loc = 119;
    s.turn = 22;
    s.phase = 'ready';
    s.used = [];
    save();
    render();
  });
  await page.waitForTimeout(200);

  // 執行「詢問」行動
  await page.locator('button.actionTile:has-text("詢問")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("擲")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("承受所有剩餘骰子")').click();
  await page.waitForTimeout(300);

  // 驗證選項按鈕是否存在
  const rawStoryText = await page.evaluate(() => WORLD.stories['story:engage:0119:01'][1]);
  assert.ok(rawStoryText.includes('智慧生物1353'), '原始故事文字中應為「智慧生物1353」');
  assert.ok(!rawStoryText.includes('智慧生1353'), '原始故事文字中不應出現殘缺的「智慧生1353」');
  console.log('✓ 地點 119 故事資料庫文字正確修復為「智慧生物1353」');

  const optionAccept = page.locator('button:has-text("接受嚮導（獲得智慧生物1353）")');
  const optionRefuse = page.locator('button:has-text("拒絕")');

  assert.ok(await optionAccept.isVisible(), '「接受嚮導（獲得智慧生物1353）」選項按鈕應可見');
  assert.ok(await optionRefuse.isVisible(), '「拒絕」選項按鈕應可見');
  console.log('✓ 地點 119 成功顯示「接受」與「拒絕」選項按鈕');

  // 測試點擊選項 1：接受嚮導
  console.log('--- 測試 2：點擊「接受嚮導」，驗證獲得智慧生物 1353 ---');
  await optionAccept.click();
  await page.waitForTimeout(300);

  const has1353 = await page.evaluate(() => {
    return s.grid.includes(1353) || s.supply.includes(1353) || s.reserve.includes(1353) || (s.unplaced || []).includes(1353);
  });
  assert.ok(has1353, '點擊接受後玩家應獲得智慧生物 1353');
  const postChoiceStoryText = await page.locator('.storyMessage .story').textContent();
  assert.ok(postChoiceStoryText.includes('獲得智慧生物1353'), '點選接受後故事訊息應完整顯示「獲得智慧生物1353」');
  console.log('✓ 成功獲得智慧生物 1353，畫面故事訊息完整呈現「獲得智慧生物1353」');

  // 測試選項 2：拒絕，驗證獲得 1 點強化並可繼續
  console.log('--- 測試 3：重新模擬地點 119「詢問」並點擊「拒絕」，驗證獲得 1 點強化與繼續行動 ---');
  await page.evaluate(() => {
    delete s.a;
    s.loc = 119;
    s.turn = 22;
    s.phase = 'ready';
    s.used = [];
    s.boost[s.grid[4]] = 0;
    save();
    render();
  });
  await page.waitForTimeout(200);

  await page.locator('button.actionTile:has-text("詢問")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("擲")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("承受所有剩餘骰子")').click();
  await page.waitForTimeout(300);

  const initialBoost = await page.evaluate(() => s.boost[s.grid[4]] || 0);
  await page.locator('button:has-text("拒絕")').click();
  await page.waitForTimeout(300);

  const finalBoost = await page.evaluate(() => s.boost[s.grid[4]] || 0);
  assert.equal(finalBoost, initialBoost + 1, '拒絕後角色應獲得 1 點強化');
  console.log('✓ 拒絕後角色強化增加 1 點 (目前強化: ' + finalBoost + ')');

  // 驗證是否顯示繼續行動按鈕
  const contBtn = page.locator('button:has-text("繼續行動")');
  assert.ok(await contBtn.isVisible(), '拒絕後應顯示繼續行動按鈕');
  console.log('✓ 拒絕後成功顯示「繼續行動」按鈕');

  // 測試 4：方向選擇事件（story:take:1661:01）
  console.log('--- 測試 4：方向分支事件驗證（story:take:1661:01）---');
  const branches1661 = await page.evaluate(() => {
    const text = WORLD.stories['story:take:1661:01'][1];
    return storyParts(text, null);
  });
  assert.ok(branches1661.branched, 'story:take:1661:01 應標記為分支故事');
  assert.equal(branches1661.parts.length, 3, '應包含 2 個方向分支');
  assert.ok(branches1661.parts[1].includes('167'), '選項 1 應前往 167');
  assert.ok(branches1661.parts[2].includes('165'), '選項 2 應前往 165');
  console.log('✓ 方向分支事件 story:take:1661:01 驗證通過');

  // 測試 5：史詩勝利與使命勝利分支（story:secrets:1579:01）
  console.log('--- 測試 5：史詩勝利與使命勝利分支驗證（story:secrets:1579:01）---');
  const branchesEpic = await page.evaluate(() => {
    const text = WORLD.stories['story:secrets:1579:01'][1];
    return storyParts(text, null);
  });
  assert.ok(branchesEpic.branched, '使命故事應標記為分支');
  assert.ok(branchesEpic.parts[1].includes('追求史詩勝利'), '選項 1 應追求史詩勝利');
  assert.ok(branchesEpic.parts[2].includes('直接以使命勝利結束遊戲'), '選項 2 應結束遊戲');
  console.log('✓ 史詩勝利分支驗證通過');

  // 測試 6：植物卡加成 vs 強化分支（story:take:1049:01）
  console.log('--- 測試 6：植物卡享用加成 vs 添加強化分支驗證（story:take:1049:01）---');
  const branchesPlant = await page.evaluate(() => {
    const text = WORLD.stories['story:take:1049:01'][1];
    return storyParts(text, null);
  });
  assert.ok(branchesPlant.branched, '植物卡應標記為分支');
  assert.ok(branchesPlant.parts[1].includes('享用加成並繼續'), '選項 1 應享用加成');
  assert.ok(branchesPlant.parts[2].includes('停止並在此植物上獲得1點強化'), '選項 2 應添加強化');
  console.log('✓ 植物卡分支驗證通過');

  await browser.close();
  console.log('=== 所有故事事件選項測試全數通過！ ===');
})();
