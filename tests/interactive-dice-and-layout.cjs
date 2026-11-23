const {chromium}=require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');

(async()=>{
  const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try{
    const p=await b.newPage({viewport:{width:1024,height:800}}), errors=[];
    p.on('pageerror',e=>errors.push(String(e)));
    await p.goto(require('node:url').pathToFileURL(require('node:path').resolve(__dirname,'../dist/index.html')).href);
    await p.getByRole('button',{name:'開始探險'}).click();
    await p.evaluate(()=>{
      if(s.phase==='mission')confirmMission();
      escapePod();
      if(s.phase==='crash')land();
      diceTray.close();
    });

    console.log('--- 驗證 1：新 UI 佈局（頂部數值欄兩行佈局：第一行屬性與骰池懲罰，第二行技能與錢幣；移除輔助板、全寬地點卡、行囊移除技能資源欄） ---');
    // 檢查頂部數值欄第一行（時間、士氣、生命、強化、骰池、懲罰）
    const mainRowText = await p.locator('.stats .statsMainRow').innerText();
    assert.match(mainRowText, /時間/);
    assert.match(mainRowText, /士氣/);
    assert.match(mainRowText, /生命/);
    assert.match(mainRowText, /強化/);
    assert.match(mainRowText, /骰池/);
    assert.match(mainRowText, /懲罰/);

    // 檢查頂部數值欄第二行（6項技能與錢幣）
    const subRowText = await p.locator('.stats .statsSubRow').innerText();
    assert.match(subRowText, /移動/);
    assert.match(subRowText, /查看/);
    assert.match(subRowText, /接觸/);
    assert.match(subRowText, /幫助/);
    assert.match(subRowText, /獲取/);
    assert.match(subRowText, /壓制/);
    assert.match(subRowText, /錢幣/);

    // 驗證行囊中已移除原本底部的技能與資源區塊
    assert.equal(await p.locator('#bagSection').getByText('技能與資源').count(), 0, 'Skills and resources moved out of bag');

    // 驗證地點卡全寬放大置頂
    const fullLoc = p.locator('.locationPanel.fullWidthLocation');
    assert.equal(await fullLoc.count(), 1, 'Full-width location panel should exist above play area');

    // 驗證玩家輔助板 (.playerBoard) 已被移除
    assert.equal(await p.locator('.playerBoard').count(), 0, 'Player board should be removed');

    // 驗證下方雙欄佈局：左欄為行動選單 (.actionPanel)，右欄為隨身行囊 (#bagSection)
    const leftCol = p.locator('.play .leftCol');
    const rightCol = p.locator('.play .rightCol');
    assert.equal(await leftCol.count(), 1, 'Left column should exist');
    assert.equal(await rightCol.count(), 1, 'Right column should exist');
    assert.equal(await leftCol.locator('.actionPanel').count(), 1, 'Left column should contain action panel');
    assert.equal(await rightCol.locator('#bagSection').count(), 1, 'Right column should contain bag section');

    // 驗證按鈕與自動傷害文字已被移除
    assert.equal(await p.locator('button:has-text("查看探索地圖")').count(), 0, 'No map button');
    assert.equal(await p.locator('button:has-text("探索地圖")').count(), 0, 'No explore map button');
    assert.equal(await p.locator('button:has-text("旅行見聞")').count(), 0, 'No voyage button');
    assert.equal(await p.locator('text=上一步見聞回顧').count(), 0, 'No previous journal toggle');
    assert.equal(await p.locator('text=抵達時的高溫、寒冷或缺氧傷害已自動結算').count(), 0, 'No auto-settled hazard text');
    console.log('✓ UI 佈局驗證通過：頂部包含強化與懲罰、地點卡全寬放大、輔助板及冗餘按鈕文字均已移除');

    console.log('--- 驗證 2：進入擲骰階段，提示可放置骰子數量與骰槽提示 ---');
    await p.evaluate(()=>{
      s.loc = 172;
      s.grid[4] = 1435; // 角色卡，槽 1 限士氣
      s.boost[1435] = 2; // 2 點強化，可用於重擲
      s.occupied = {};
      s.penalty = 0;
      s.stats = [4, 4, 4];
      s.a = {
        id: 172,
        origin: 172,
        kind: '地點',
        book: 'look',
        name: '導航',
        title: '導航將船駛離火山',
        cost: 3,
        text: '測試故事文字。',
        dice: ['時間', '士氣', '生命'],
        selectedDie: 0
      };
      s.phase = 'dice';
      save();
    });

    // 檢查提示文字：共 3 顆挑戰骰，1 顆有可用骰槽（士氣可放 1435）
    const promptNotice = await p.locator('.dicePromptNotice').innerText();
    assert.match(promptNotice, /本次擲出 3 顆挑戰骰/);
    assert.match(promptNotice, /1 顆/);
    console.log('✓ 骰子數量與可放置骰子統計提示正確：', promptNotice.trim());

    console.log('--- 驗證 3：自由選擇想處理的骰子（自由挑選非強制左到右），並觸發右側 3x3 網格卡牌高亮 ---');
    // 點選第 2 顆骰子（索引 1：「士氣」骰）
    await p.locator('.dicePickBtn:has-text("士氣")').click();
    assert.equal(await p.evaluate(()=>s.a.selectedDie), 1);

    // 驗證右側 3x3 網格中，卡牌 1435 是否出現可放此骰高亮與標記
    assert.equal(await rightCol.locator('.slotEligibleCard').count(), 1);
    assert.equal(await rightCol.locator('.eligibleBadge').innerText(), '可放此骰');
    console.log('✓ 點選「士氣」骰時，右側網格中對應的卡牌 1435 即時高亮並標註「可放此骰」');

    // 驗證左側操作卡中顯示放入卡牌 1435 的按鈕
    const slotBtn = p.locator('button:has-text("放入 朱爾斯，艦長 骰槽")');
    assert.equal(await slotBtn.count(), 1);

    console.log('--- 驗證 4：角色重擲（Hero Reroll）功能 ---');
    // 點選「時間」骰（索引 0）
    await p.locator('.dicePickBtn:has-text("時間")').click();
    assert.equal(await p.evaluate(()=>s.a.selectedDie), 0);
    const initialBoost = await p.evaluate(()=>s.boost[1435]);
    assert.equal(initialBoost, 2);

    // 點擊支付 1 角色強化重擲
    await p.locator('button:has-text("支付 1 角色強化重擲")').click();
    const afterBoost = await p.evaluate(()=>s.boost[1435]);
    assert.equal(afterBoost, 1, 'Hero boost should decrease by 1');
    console.log('✓ 成功消耗 1 角色強化進行重擲');

    console.log('--- 驗證 5：自由放置骰子到選定的卡牌格子 ---');
    // 重新選取「士氣」骰
    await p.locator('.dicePickBtn:has-text("士氣")').first().click();
    // 點擊放入 1435 骰槽
    await p.locator('button:has-text("放入 朱爾斯，艦長 骰槽")').click();

    // 驗證 1435 槽位已被佔用
    assert.equal(await p.evaluate(()=>s.occupied['slot:1435:01']), '士氣');
    // 驗證骰子清單剩下 2 顆
    assert.equal(await p.evaluate(()=>s.a.dice.length), 2);
    console.log('✓ 成功將「士氣」骰放入指定卡牌骰槽');

    console.log('--- 驗證 6：結算剩餘骰子並完成挑戰骰階段 ---');
    // 點擊「承受所有剩餘骰子並結算結果」
    await p.locator('button:has-text("承受所有剩餘骰子並結算結果")').click();
    assert.equal(await p.evaluate(()=>s.phase), 'result');

    // 驗證故事結果面板出現結算明細
    const summaryList = await p.locator('.diceSummaryList li').allInnerTexts();
    console.log('結算明細：', summaryList);
    assert.ok(summaryList.length >= 2);
    assert.ok(summaryList.some(t => t.includes('朱爾斯，艦長')));
    console.log('✓ 剩餘骰子結算完畢，順暢推進至結果階段');

    assert.deepEqual(errors, []);

    console.log('--- 驗證 7：環境傷害恢復由玩家自主選擇（失去 1 生命 vs 同時失去 1 時間與 1 士氣） ---');
    // 抵達地點 8（受到 1 點缺氧傷害）
    await p.evaluate(()=>{
      s.phase = 'ready';
      s.a = null;
      s.stats = [4, 4, 4];
      s.grid = Array(9).fill(null);
      s.grid[4] = 1435;
      travel(8);
      save();
    });

    const hazardBox = p.locator('.hazardChoiceBox');
    assert.equal(await hazardBox.count(), 1, 'Hazard choice box should appear');
    assert.match(await hazardBox.innerText(), /受到【缺氧】傷害/);

    // 選擇「失去 1 點生命」
    await hazardBox.locator('button:has-text("失去 1 點生命")').click();
    assert.equal(await p.evaluate(()=>s.stats[2]), 3, 'Life should be reduced to 3');
    assert.equal(await hazardBox.count(), 0, 'Hazard box should disappear after choice');

    // 再次測試：抵達地點 16（受到 1 點高溫傷害）
    await p.evaluate(()=>{
      travel(16);
      save();
    });
    assert.equal(await p.locator('.hazardChoiceBox').count(), 1, 'Hazard choice box should appear for heat');
    // 選擇「同時失去 1 點時間與 1 點士氣」
    await p.locator('.hazardChoiceBox button:has-text("同時失去 1 點時間與 1 點士氣")').click();
    assert.deepEqual(await p.evaluate(()=>s.stats), [3, 3, 3], 'Time and Morale should be reduced by 1');
    assert.equal(await p.locator('.hazardChoiceBox').count(), 0);
    console.log('✓ 環境傷害自主選擇機制（失去生命 或 失去時間+士氣）驗證通過');

    console.log('--- 驗證 8：頂部包含「探險」、「地圖」、「日記」、「手冊」四個導航分頁 ---');
    const tabButtons = await p.locator('.group button').allInnerTexts();
    console.log('頂部導航按鈕：', tabButtons);
    assert.deepEqual(tabButtons, ['探險', '地圖', '日記', '手冊'], 'Top tab group must be [探險, 地圖, 日記, 手冊]');

    // 點擊「日記」分頁
    await p.locator('.group button:has-text("日記")').click();
    assert.equal(await p.evaluate(()=>tab), '日記');
    assert.equal(await p.locator('.diaryView').count(), 1, 'Diary view panel should be displayed');
    assert.match(await p.locator('.diaryHeader').innerText(), /旅程日記/);

    // 切換詳細日誌與隨筆
    await p.locator('button:has-text("📜 行動詳細日誌")').click();
    assert.equal(await p.locator('.diaryLogContainer').count(), 1, 'Log container should be displayed');
    await p.locator('button:has-text("✍️ 探險隨筆")').click();
    assert.equal(await p.locator('#customDiaryNote').count(), 1, 'Notes textarea should be displayed');
    console.log('✓ 頂部日記導航與旅程日記各子分頁功能驗證通過');

    // 點擊「地圖」分頁
    await p.locator('.group button:has-text("地圖")').click();
    assert.equal(await p.evaluate(()=>tab), '地圖');
    assert.equal(await p.locator('.mapView').count(), 1, 'Map view panel should be displayed');
    assert.match(await p.locator('.mapHeader').innerText(), /探索地圖/);

    // 切換探索足跡與地點圖鑑
    await p.locator('button:has-text("👣 探索足跡")').click();
    assert.equal(await p.locator('.trailList').count(), 1, 'Trail list should be displayed');
    await p.locator('button:has-text("📑 地點圖鑑")').click();
    assert.equal(await p.locator('.mapCardList').count(), 1, 'Card list should be displayed');
    await p.locator('button:has-text("🗺️ 網格地圖")').click();
    assert.equal(await p.locator('.mapGrid').count(), 1, 'Map grid should be displayed');

    // 點擊切回「探險」分頁
    await p.locator('.group button:has-text("探險")').click();
    assert.equal(await p.evaluate(()=>tab), '探險');
    console.log('✓ 頂部地圖導航與探索地圖切換驗證通過');

    console.log('--- 驗證 9：卡牌 1259（高塔地圖）相鄰放置強化、異能與《萬境之書》第 16 頁查閱 ---');
    await p.evaluate(()=>{
      // 網格佈局：slot 4 為角色 (1435)，slot 1 為卡牌 1259，slot 0 為卡牌 1179（石頭）
      // slot 1 的正交相鄰為 slot 0 和 slot 4，因此相鄰卡牌數為 2
      s.grid = Array(9).fill(null);
      s.grid[4] = 1435;
      s.grid[0] = 1179;
      s.unplaced = [1259];
      s.boost = { 1435: 2 };
      fillAcquiredCards();
      save();
    });

    // 驗證 1259 放入網格後獲得 2 點相鄰強化
    const boost1259 = await p.evaluate(()=>s.boost[1259]);
    assert.equal(boost1259, 2, 'Card 1259 should gain 2 boost from 2 adjacent cards');
    console.log('✓ 卡牌 1259 放置時正確獲得相鄰卡牌強化：', boost1259);

    // 檢查隨身行囊中的「高塔地圖（1259）」異能面板
    const mapPowerBox = p.locator('.cardAbilities:has-text("高塔地圖")');
    assert.equal(await mapPowerBox.count(), 1, 'Card abilities panel should exist for 1259');

    // 驗證異能：支付 2 強化換 1 時間
    const timeBefore = await p.evaluate(()=>s.stats[0]);
    await mapPowerBox.locator('button:has-text("支付 2 強化獲得 1 時間")').click();
    const timeAfter = await p.evaluate(()=>s.stats[0]);
    const boostAfterTime = await p.evaluate(()=>s.boost[1259]);
    assert.equal(timeAfter, timeBefore + 1, 'Time should increase by 1');
    assert.equal(boostAfterTime, 0, 'Card 1259 boost should decrease by 2');
    console.log('✓ 支付 2 強化換 1 時間驗證通過');

    // 重新補給 1 點強化給 1259，測試「支付 1 強化並查閱第 16 頁」
    await p.evaluate(()=>{
      s.boost[1259] = 1;
      save();
    });
    await mapPowerBox.locator('button:has-text("支付 1 強化並查閱第 16 頁")').click();
    assert.equal(await p.evaluate(()=>s.boost[1259]), 0, 'Card 1259 boost should decrease by 1');

    // 驗證彈出視窗顯示《萬境之書》第 16 頁（books/09_016.webp）
    const bookImg = p.locator('#viewer img');
    assert.equal(await bookImg.count(), 1);
    const imgSrc = await bookImg.getAttribute('src');
    assert.equal(imgSrc, 'books/09_016.webp', 'Book page image must be books/09_016.webp');
    console.log('✓ 查閱《萬境之書》第 16 頁（高塔地圖）驗證通過，圖片為：', imgSrc);
    await p.evaluate(()=>viewer.close());

    // 測試點擊卡牌彈出詳情（card(1259)），點擊其中的查閱按鈕
    await p.evaluate(()=>card(1259));
    const cardModal = p.locator('#cardZoom');
    assert.equal(await cardModal.isVisible(), true);
    await cardModal.locator('button:has-text("立即查閱《萬境之書》第 16 頁")').click();
    assert.equal(await p.locator('#viewer img').getAttribute('src'), 'books/09_016.webp');
    console.log('✓ 卡牌詳情彈窗中的「立即查閱《萬境之書》第 16 頁」功能驗證通過');
    await p.evaluate(()=>viewer.close());

    console.log('--- 驗證 10：官方 FAQ 與官方勘誤（Rulepop / Stonemaier Games）機制驗證 ---');
    // 1. 空白骰與挫折骰結算規則驗證
    await p.evaluate(()=>{
      s.phase = 'dice';
      s.stats = [4, 4, 4];
      s.penalty = 0;
      s.a = {
        id: s.loc,
        kind: '地點',
        name: '查看',
        book: 'look',
        text: '這是官方FAQ空白與挫折骰測試。',
        dice: ['空白', '挫折'],
        selectedDie: 0,
        dicePlaced: []
      };
      // 結算空白骰
      acceptSelectedDie();
      // 結算挫折骰
      acceptSelectedDie();
    });
    // 驗證：空白骰移至中央懲罰區（penalty=1），屬性不扣（4,4,4）；挫折骰歸還骰池（不增加 penalty）
    const penaltyAfter = await p.evaluate(()=>s.penalty);
    const statsAfter = await p.evaluate(()=>s.stats);
    assert.equal(penaltyAfter, 1, 'Blank die should increment penalty by 1; setback die should not');
    assert.deepEqual(statsAfter, [4, 4, 4], 'Blank and setback dice do not deduct stats');
    console.log('✓ 空白骰進入中央懲罰區（佔用骰子且不扣屬性）、挫折骰安全歸還骰池驗證通過');

    // 2. 卡牌 957（滑翔翼）與 962（火焰噴射器）官方勘誤：骰槽吸納挑戰骰時即時獲得 1 點強化
    const boostReward957 = await p.evaluate(()=>cards['957'].slots[0].boost_reward);
    const boostReward962 = await p.evaluate(()=>cards['962'].slots[0].boost_reward);
    assert.equal(boostReward957, 1, 'Card 957 slot should yield 1 boost');
    assert.equal(boostReward962, 1, 'Card 962 slot should yield 1 boost');
    console.log('✓ 卡牌 957 與 962 骰槽獲取強化勘誤驗證通過');

    // 3. 地點 267 官方勘誤：成分為 wind（風）
    const comp267 = await p.evaluate(()=>cards['267'].composition);
    assert.equal(comp267, 'wind', 'Card 267 composition should be wind');
    console.log('✓ 地點 267 風成分勘誤驗證通過');

    // 4. 卡牌 1013（海龜出租車）官方勘誤載具異能驗證（支付 1 強化乘坐至相鄰地點，無需消耗主行動）
    await p.evaluate(()=>{
      s.grid[1] = 1013;
      s.boost[1013] = 1;
      s.loc = 100;
      cards[100].exits = { north: { destination: 101 } };
      useTurtleTaxi(101);
    });
    const locAfterTaxi = await p.evaluate(()=>s.loc);
    const boost1013After = await p.evaluate(()=>s.boost[1013]);
    const gridAfterTaxi = await p.evaluate(()=>s.grid[1]);
    assert.equal(locAfterTaxi, 101, 'Should travel to 101 via Turtle Taxi');
    assert.equal(boost1013After || 0, 0, 'Boost should be reduced to 0');
    assert.equal(gridAfterTaxi, 0, 'Card should be lost/discarded when boost reaches 0');
    console.log('✓ 卡牌 1013（海龜出租車）勘誤乘坐異能及耗盡移除驗證通過');

    // 5. 卡牌 1088（鋸齒斧）官方勘誤異能驗證（支付 2 強化獲得 1 點幫助標記）
    await p.evaluate(()=>{
      s.grid[1] = 1088;
      s.boost[1088] = 2;
      s.skill[3] = 0; // 幫助標記
      useSawAxe();
    });
    const helpAfterAxe = await p.evaluate(()=>s.skill[3]);
    const boost1088After = await p.evaluate(()=>s.boost[1088]);
    assert.equal(helpAfterAxe, 1, 'Should gain 1 help marker from Saw Axe');
    assert.equal(boost1088After, 0, 'Saw Axe boost should be consumed by 2');
    console.log('✓ 卡牌 1088（鋸齒斧）勘誤獲得幫助異能驗證通過');

    // 6. 卡牌 1101 正式名稱與所有 13 張地圖卡《萬境之書》頁面對應驗證
    const card1101Name = await p.evaluate(()=>cards['1101'].name);
    assert.equal(card1101Name, '「奇思妙物」熔岩');
    console.log('✓ 卡牌 1101 官方名稱「「奇思妙物」熔岩」驗證通過');

    // 驗證地圖卡 1254（骸骨地圖 ➔ 第 11 頁）
    await p.evaluate(()=>{
      s.grid[2] = 1254;
      s.boost[1254] = 1;
      useMapCard(1254, 1);
    });
    const boneMapImg = await p.locator('#viewer img').getAttribute('src');
    assert.equal(boneMapImg, 'books/09_011.webp', 'Bone map should open book 9 page 11');
    console.log('✓ 卡牌 1254（骸骨地圖 ➔ 萬境之書第 11 頁）驗證通過');
    await p.evaluate(()=>viewer.close());

    // 7. 進階英雄（1441-1452）支付 1 強化刷新卡牌挑戰骰異能驗證
    await p.evaluate(()=>{
      s.grid[4] = 1444; // 進階角色
      s.boost[1444] = 1;
      s.occupied['slot:0957:01'] = '生命';
      refreshCardDie('slot:0957:01');
    });
    const occupiedAfterRefresh = await p.evaluate(()=>s.occupied['slot:0957:01']);
    const heroBoostAfterRefresh = await p.evaluate(()=>s.boost[1444]);
    assert.equal(occupiedAfterRefresh, undefined, 'Slot die should be cleared');
    assert.equal(heroBoostAfterRefresh, 0, 'Hero boost should decrease by 1');
    console.log('✓ 進階角色支付 1 強化刷新卡牌骰子異能驗證通過');

    assert.deepEqual(errors, []);
    console.log('全套自選放置、英雄重擲、卡牌槽位提示、環境傷害自主選擇、地圖導航、官方FAQ與勘誤驗證全數通過！');
  }finally{
    await b.close();
  }
})().catch(e=>{console.error(e);process.exit(1)});
