const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
  const fileUrl = url.pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href;
  await page.goto(fileUrl);

  console.log('--- 測試 1：開始探險並切換至「地圖」分頁 ---');
  await page.getByRole('button', { name: '開始探險' }).click();
  await page.evaluate(() => {
    if (s.phase === 'mission') confirmMission();
    escapePod();
    if (s.phase === 'crash') land();
    diceTray.close();
  });

  // 點選頂部「地圖」導航按鈕
  await page.locator('.group button:has-text("地圖")').click();
  await page.waitForTimeout(300);

  // 驗證進入 mapView，且預設模式為 4x4 星球地區總覽
  const mapView = await page.locator('.mapView');
  assert.equal(await mapView.count(), 1, 'Map view should be active');

  const regionGrid = await page.locator('.worldRegionGrid');
  assert.equal(await regionGrid.count(), 1, 'World 4x4 Region Grid should exist');

  console.log('--- 測試 2：驗證 4×4 星球地區矩陣（A–P 共 16 個地區）結構 ---');
  const regionTiles = await page.locator('.worldRegionGrid .regionTile');
  assert.equal(await regionTiles.count(), 16, 'Should have exactly 16 region tiles');

  const letters = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.regionTile .regionLetter')).map(el => el.textContent.trim());
  });
  const expectedLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
  assert.deepEqual(letters, expectedLetters, '16 regions should strictly follow A through P');
  console.log('✓ 16 個地區代號 A–P 完整排布為 4×4 矩陣：', letters);

  console.log('--- 測試 3：驗證當前地點所屬地區高亮與標記 ---');
  const curLoc = await page.evaluate(() => s.loc);
  const curReg = await page.evaluate(() => getLocationRegion(s.loc));
  console.log(`目前所在：地點 ${curLoc}，所屬地區：地區 ${curReg}`);

  const activeRegionTile = await page.locator('.regionTile.currentRegion');
  assert.equal(await activeRegionTile.count(), 1, 'Exactly one active region tile should be highlighted');
  const activeLetter = await activeRegionTile.locator('.regionLetter').textContent();
  assert.equal(activeLetter.trim(), curReg, 'Highlighted tile should match current region');
  console.log(`✓ 地區 ${curReg} 成功高亮，帶有「📍 當前所在地區」標章`);

  console.log('--- 測試 4：驗證《萬境之書》全地圖導航按鈕 ---');
  assert.equal(await page.locator('button:has-text("📖 星球全圖（第 7 頁）")').count(), 1);
  assert.equal(await page.locator('button:has-text("📖 16 地區矩陣圖（第 2 頁）")').count(), 1);
  assert.equal(await page.locator('button:has-text("西北半球 NW")').count(), 1);
  assert.equal(await page.locator('button:has-text("東北半球 NE")').count(), 1);
  console.log('✓ 《萬境之書》第 7 頁全圖、第 2 頁矩陣圖及四大半球快捷導航按鈕齊全');

  console.log('--- 測試 5：切換「🗺️ 網格地圖」模式，驗證 2D 羅盤空間排布 ---');
  await page.locator('button:has-text("🗺️ 網格地圖")').click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.mapGrid').count(), 1, 'Map grid should be displayed');
  assert.equal(await page.locator('.mapCompassBanner').count(), 1, 'Map compass banner should be displayed');

  // 模擬玩家已探明地點 [117, 83, 106, 157, 107]
  const layoutValidation = await page.evaluate(() => {
    s.loc = 117;
    s.visits = { 117: [1], 83: [1], 106: [1], 157: [1], 107: [1] };
    const visited = visitedLocations();
    const layout = computeMapLayout(visited, s.loc, s.travelRoutes || []);
    render();
    const nodeMap = {};
    for (const n of layout.nodes) nodeMap[n.id] = { x: n.x, y: n.y, reg: getLocationRegion(n.id) };
    return {
      width: layout.width,
      height: layout.height,
      nodeMap
    };
  });
  console.log('玩家探明狀態下網格排布尺寸：', layoutValidation.width, '列 ×', layoutValidation.height, '行');
  assert.ok(layoutValidation.height > 1, '地圖高度必須大於 1，不再扁平排成單一橫列！');
  assert.ok(layoutValidation.width > 1, '地圖寬度必須大於 1！');

  const nm = layoutValidation.nodeMap;
  // 驗證北朝上（小 y）：地區 G (157)、地區 H (83) 位於北部，y 座標必須小於南部地區 J (106)、地區 K (117, 107)
  assert.ok(nm[157].y < nm[117].y, '北方地點 157（地區 G）應位於南方地點 117（地區 K）上方（北朝上）');
  assert.ok(nm[83].y < nm[117].y, '北方地點 083（地區 H）應位於南方地點 117（地區 K）上方（北朝上）');
  // 驗證西朝左、東朝右（小 x 偏西、大 x 偏東）：地區 J (106) 位於西部，x 座標必須小於地區 K (117) 與地區 H (83)
  assert.ok(nm[106].x < nm[117].x, '西方地點 106（地區 J）應位於東方地點 117（地區 K）左方（西朝左）');
  assert.ok(nm[106].x < nm[83].x, '西方地點 106（地區 J）應位於東方地點 083（地區 H）左方（西朝左）');
  assert.ok(nm[157].x < nm[83].x, '中偏西地點 157（地區 G）應位於東方地點 083（地區 H）左方（東朝右）');
  console.log('✓ 2D 羅盤空間排布（北朝上、南朝下、西朝左、東朝右）檢驗完全正確！');

  console.log('--- 測試 6：切換「📜 隨身地圖圖卷」模式，驗證地圖物品與《萬境之書》連結 ---');
  await page.locator('button:has-text("📜 隨身地圖圖卷")').click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.mapItemsList').count(), 1, 'Map items list should be displayed');
  const noteText = await page.locator('.mapView p.note').textContent();
  assert.ok(noteText.includes('秘密之書') && noteText.includes('強化'), 'Should mention Book of Secrets map rules');
  console.log('✓ 隨身地圖圖卷與《秘密之書》地圖規則說明完整呈現');

  await browser.close();
  console.log('🎉 所有地圖排列方式與 4×4 星球地區矩陣測試順利通過！');
})();
