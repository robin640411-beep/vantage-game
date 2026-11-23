const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  console.log('=== 測試開始：驗證卡牌啟動式異能與左側選單互動 ===');

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
    if (s.phase === 'crash' || s.phase === 'escape') land();
  });
  await page.waitForTimeout(300);

  console.log('--- 測試 1：卡牌 1353（玫瑰，慈善家）進入網格，擁有 2 點強化 ---');
  await page.evaluate(() => {
    s.loc = 117;
    s.phase = 'ready';
    s.used = [];
    s.unplaced = [];
    // 放置 1353 在網格槽位 0，並放置卡牌 884 在相鄰槽位 1
    s.grid[0] = 1353;
    s.boost[1353] = 2;
    s.grid[1] = 884;
    s.boost[884] = 0;
    save();
  });
  await page.waitForTimeout(200);

  // 驗證 actions() 中包含 1353 異能
  const acts = await page.evaluate(() => actions());
  const abilityAct = acts.find(a => a.id === 1353 && a.isCardAbility);
  assert.ok(abilityAct, 'actions() 應包含卡牌 1353 的啟動異能');
  console.log('✓ actions() 成功檢索到卡牌異能：', abilityAct.name);

  // 驗證左側按鈕是否存在
  const tileCount = await page.locator('.cardAbilityTile').count();
  assert.ok(tileCount >= 1, '左側選單中應渲染出 .cardAbilityTile 按鈕');
  const tileText = await page.locator('.cardAbilityTile').first().textContent();
  assert.ok(tileText.includes('玫瑰，慈善家') || tileText.includes('1353'), '按鈕應包含卡牌名稱或編號');
  console.log('✓ 左側選單渲染正確：', tileText.slice(0, 50));

  console.log('--- 測試 2：點選卡牌 1353 異能按鈕，扣除 1 強化並進入選擇面板 ---');
  await page.evaluate(() => {
    const idx = actions().findIndex(a => a.id === 1353 && a.isCardAbility);
    choose(idx);
  });
  await page.waitForTimeout(200);

  const phaseAfterChoose = await page.evaluate(() => s.phase);
  assert.equal(phaseAfterChoose, 'result', '啟動異能後應直接進入 result 結算面板');
  const boostAfterChoose = await page.evaluate(() => s.boost[1353]);
  assert.equal(boostAfterChoose, 1, '已扣除 1 點強化，剩餘 1 點強化');
  console.log('✓ 成功扣除 1 點強化，剩餘強化：', boostAfterChoose);

  // 驗證選項按鈕
  const branchBtn1 = await page.locator('button:has-text("在一張相鄰卡牌上獲得強化")').count();
  const branchBtn2 = await page.locator('button:has-text("獲得任務1665")').count();
  const branchBtn3 = await page.locator('button:has-text("跟隨前往地點390")').count();
  assert.ok(branchBtn1 > 0, '應存在相鄰強化選項');
  assert.ok(branchBtn2 > 0, '應存在獲得任務1665選項');
  assert.ok(branchBtn3 > 0, '應存在前往地點390選項');
  console.log('✓ 三項選項按鈕皆完整渲染');

  console.log('--- 測試 3：選擇「獲得任務1665」---');
  await page.locator('button:has-text("獲得任務1665")').click();
  await page.waitForTimeout(200);

  const hasMission1665 = await page.evaluate(() => s.supply.includes(1665));
  assert.ok(hasMission1665, 's.supply 應成功獲得任務 1665');
  console.log('✓ 成功獲得任務 1665 並加入供應區');

  // 完成行動回到 ready
  await page.evaluate(() => finish());
  await page.waitForTimeout(200);

  console.log('--- 測試 3.1：測試 1353 選項 1「在一張相鄰卡牌上獲得強化」---');
  // 給 1353 補 1 強化，並確保相鄰卡牌 884 在網格中且強化為 0
  await page.evaluate(() => {
    s.boost[1353] = 2;
    s.grid[0] = 1353;
    s.grid[1] = 884;
    s.boost[884] = 0;
    save();
    const idx = actions().findIndex(a => a.id === 1353 && a.isCardAbility);
    choose(idx);
  });
  await page.waitForTimeout(200);

  await page.locator('button:has-text("在一張相鄰卡牌上獲得強化")').click();
  await page.waitForTimeout(200);

  const boost884 = await page.evaluate(() => s.boost[884]);
  assert.equal(boost884, 1, '相鄰卡牌 884 應成功獲得 1 點強化');
  console.log('✓ 相鄰卡牌 884 成功獲得 1 點強化：', boost884);

  await page.evaluate(() => finish());
  await page.waitForTimeout(200);

  console.log('--- 測試 4：再次使用 1353 異能（現有 1 強化，空了失去此牌）---');
  const boostBeforeSecond = await page.evaluate(() => s.boost[1353]);
  assert.equal(boostBeforeSecond, 1, '目前強化應為 1');

  await page.evaluate(() => {
    const idx = actions().findIndex(a => a.id === 1353 && a.isCardAbility);
    choose(idx);
  });
  await page.waitForTimeout(200);

  const boostAfterSecond = await page.evaluate(() => s.boost[1353]);
  assert.equal(boostAfterSecond, 0, '扣除後強化應為 0');

  // 選擇第三項：跟隨前往 390
  await page.locator('button:has-text("跟隨前往地點390")').click();
  await page.waitForTimeout(200);

  // 驗證卡牌 1353 因空了而從網格移除
  const gridHas1353 = await page.evaluate(() => s.grid.includes(1353));
  assert.equal(gridHas1353, false, '強化耗盡後，卡牌 1353 應依規則從網格失去');
  console.log('✓ 卡牌 1353 強化耗盡，已從網格成功移除');

  // 點擊完成行動，抵達 390
  await page.evaluate(() => finish());
  await page.waitForTimeout(200);
  const locAfterTravel = await page.evaluate(() => s.loc);
  assert.equal(locAfterTravel, 390, '抵達地點應為 390');
  console.log('✓ 成功跟隨前往地點 390');

  console.log('--- 測試 5：測試食物消耗品（肉 1217）食用回血與空了失去 ---');
  await page.evaluate(() => {
    s.grid[0] = 1217;
    s.boost[1217] = 1;
    s.stats[2] = 3; // 生命 3
    s.phase = 'ready';
    save();
  });
  await page.waitForTimeout(200);

  const meatActs = await page.evaluate(() => actions());
  const meatAct = meatActs.find(a => a.id === 1217 && a.isCardAbility);
  assert.ok(meatAct, '應有食用肉的異能行動');

  await page.evaluate(() => {
    const idx = actions().findIndex(a => a.id === 1217 && a.isCardAbility);
    choose(idx);
  });
  await page.waitForTimeout(200);

  const lifeAfterMeat = await page.evaluate(() => s.stats[2]);
  assert.equal(lifeAfterMeat, 4, '食用肉後生命應增加 1 點');
  const gridHasMeat = await page.evaluate(() => s.grid.includes(1217));
  assert.equal(gridHasMeat, false, '強化耗盡後肉應被移除');
  console.log('✓ 食用肉回血成功，耗盡後卡牌自動失去');

  await browser.close();
  console.log('=== 所有卡牌啟動異能測試全部通過！ ===');
})();
