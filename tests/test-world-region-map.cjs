const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    const fileUrl = url.pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
    await page.goto(fileUrl);

    console.log('--- 測試 1：開始探險並切換至「地圖」分頁，驗證未知地區與無劇透預設畫面 ---');
    await page.getByRole('button', { name: '開始探險' }).click();
    await page.evaluate(() => {
      if (s.phase === 'mission') confirmMission();
      escapePod();
      if (s.phase === 'crash') land();
      diceTray.close();
    });

    await page.locator('.group button:has-text("地圖")').click();
    await page.waitForTimeout(200);

    assert.equal(await page.locator('.mapView').count(), 1, 'Map view should be active');
    assert.equal(await page.locator('.mapGrid').count(), 1, 'Default map view should be 2D grid');
    const headerStats = await page.locator('.mapStats').textContent();
    assert.ok(headerStats.includes('地區 未知'), 'Current region must be 未知 before discovery, got: ' + headerStats);
    console.log('✓ 初始預設顯示羅盤網格地圖，且所在地區正確標示為「地區 未知」');

    console.log('--- 測試 2：切換至 4×4 星球地區總覽，驗證全部 16 個地區皆處於未知迷霧且禁止查閱《萬境之書》 ---');
    await page.locator('button:has-text("🌍 4×4 星球地區總覽")').click();
    await page.waitForTimeout(200);

    assert.equal(await page.locator('.worldRegionGrid .regionTile.unknownRegion').count(), 16, 'All 16 regions must be unknown initially');
    assert.equal(await page.locator('.regionTile.currentRegion').count(), 0, 'No region should be highlighted before discovery');
    assert.equal(await page.locator('button[onclick^="pageView(9,"]').count(), 0, 'No Book of Vantages buttons should be clickable before unlocking');
    console.log('✓ 16 個地區皆為未知狀態，且無任何未解鎖的《萬境之書》按鈕');

    console.log('--- 測試 3：驗證直接呼叫 pageView(9, p) 查閱未解鎖《萬境之書》頁面會被阻擋 ---');
    for (const p of [2, 7, 16, 31]) {
      const blocked = await page.evaluate(pg => {
        notice = '';
        if (viewer.open) viewer.close();
        pageView(9, pg);
        return { open: viewer.open, notice };
      }, p);
      assert.equal(blocked.open, false, `Book of Vantages page ${p} must not open when locked`);
      assert.ok(blocked.notice.includes('無法查閱《萬境之書》'), `Should warn when blocking page ${p}`);
    }
    console.log('✓ 未解鎖前嘗試翻閱《萬境之書》第 2、7、16、31 頁皆被正確阻擋');

    console.log('--- 測試 4：切換「📜 隨身地圖圖卷」，驗證未取得地圖卡時無法查閱任何頁面 ---');
    await page.locator('button:has-text("📜 隨身地圖圖卷")').click();
    await page.waitForTimeout(200);
    assert.equal(await page.locator('button[onclick^="pageView(9,"]').count(), 0, 'Items tab must not allow viewing unacquired Book of Vantages pages');
    console.log('✓ 隨身地圖圖卷在未持有地圖卡時不提供任何《萬境之書》查閱按鈕');

    console.log('--- 測試 5：持有地圖卡 1259（高塔地圖）並驗證必須支付 1 點強化方可於本回合查閱第 16 頁 ---');
    await page.evaluate(() => {
      s.grid[0] = 1259;
      s.boost[1259] = 1;
      save();
    });
    await page.waitForTimeout(150);
    assert.equal(await page.locator('button[onclick^="pageView(9,"]').count(), 0, 'Owning 1259 without paying 1 boost must not allow free viewing');
    assert.equal(await page.locator('button[onclick="useMapCard(1259, 1)"]').count(), 1, 'Should offer pay-1-boost button for 1259');

    await page.locator('button[onclick="useMapCard(1259, 1)"]').click();
    await page.waitForTimeout(200);
    const afterPay = await page.evaluate(() => ({
      open: viewer.open,
      boost: s.boost[1259],
      can16: canViewVantagePage(16),
      can17: canViewVantagePage(17),
      atlasPages: s.atlasPages || [],
      hasPrevNext: /上一頁|下一頁/.test(viewer.innerHTML)
    }));
    assert.equal(afterPay.open, true, 'Paying 1 boost should open Book of Vantages page 16');
    assert.equal(afterPay.boost, 0, 'Should deduct 1 boost from 1259');
    assert.equal(afterPay.can16, true, 'Page 16 should be unlocked for this turn');
    assert.equal(afterPay.can17, false, 'Page 17 must remain locked');
    assert.ok(afterPay.atlasPages.includes(16), 'Page 16 should count toward Mission 1585 atlasPages');
    assert.equal(afterPay.hasPrevNext, false, 'Book of Vantages viewer must not allow free prev/next flipping');
    console.log('✓ 支付 1 點強化後正確解鎖並開啟第 16 頁，且禁止自由上下翻頁至其他未解鎖頁');

    // 下一回合應重新鎖定第 16 頁
    const nextTurnCan16 = await page.evaluate(() => {
      if (viewer.open) viewer.close();
      s.turn += 1;
      return canViewVantagePage(16);
    });
    assert.equal(nextTurnCan16, false, 'Map card page unlock must expire at end of turn');
    console.log('✓ 進入下一回合後，高塔地圖第 16 頁依卡面規則（「在本回合結束之前」）重新鎖定');

    console.log('--- 測試 6：透過故事結果揭曉地區後，4×4 總覽僅揭曉該地區，其餘 15 個地區仍保持未知 ---');
    await page.evaluate(() => {
      s.loc = 743;
      (s.journal ??= []).push({
        turn: s.turn,
        loc: 743,
        book: 'engage',
        title: '威嚇智慧生物',
        body: '智慧生物在地圖上標出了你當前的地點（參見《萬境之書》第9頁；你位於地區L，波浪之城位於地區P）。'
      });
      save();
    });
    await page.locator('button:has-text("🌍 4×4 星球地區總覽")').click();
    await page.waitForTimeout(200);
    const knownState = await page.evaluate(() => ({
      unknownCount: document.querySelectorAll('.regionTile.unknownRegion').length,
      currentCount: document.querySelectorAll('.regionTile.currentRegion').length,
      currentLetter: document.querySelector('.regionTile.currentRegion .regionLetter')?.textContent?.trim(),
      header: document.querySelector('.mapStats')?.textContent || '',
      can9: canViewVantagePage(9),
      can42: canViewVantagePage(42)
    }));
    assert.equal(knownState.unknownCount, 14, 'Only regions L and P should be revealed (14 remain unknown)');
    assert.equal(knownState.currentCount, 1, 'Current region L should be highlighted');
    assert.equal(knownState.currentLetter, 'L', 'Highlighted region should be L');
    assert.ok(knownState.header.includes('地區 L'), 'Header should now show 地區 L');
    assert.equal(knownState.can9, true, 'Story-referenced page 9 should be unlocked');
    assert.equal(knownState.can42, false, 'Region L map page 42 was not referenced and must stay locked');
    console.log('✓ 故事揭曉地區 L 與 P 後，僅該兩區顯示於總覽，其餘 14 區維持未知，且未指示之第 42 頁仍鎖定');

    assert.deepEqual(errors, [], 'Should have no page errors');
    console.log('🎉 所有《萬境之書》查閱權限與未知地區迷霧規則測試全數通過！');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
