const {chromium}=require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');

(async()=>{
  const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try{
    const p=await b.newPage({viewport:{width:375,height:812},isMobile:true}), errors=[];
    p.on('pageerror',e=>errors.push(String(e)));
    await p.goto(require('node:url').pathToFileURL(require('node:path').resolve(__dirname,'../dist/index.html')).href);
    await p.getByRole('button',{name:'開始探險'}).click();
    await p.evaluate(()=>{
      if(s.phase==='mission')confirmMission();
      escapePod();
      if(s.phase==='crash')land();
      diceTray.close();
    });

    console.log('--- 測試 1：可放入骰槽的骰子（1435 槽 1 限士氣）自動放置並結算，無需確認 ---');
    await p.evaluate(()=>{
      s.grid[4] = 1435;
      s.boost[1435] = 0;
      s.occupied = {};
      s.penalty = 0;
      s.stats = [4, 4, 4];
      s.a = {
        id: s.loc,
        origin: s.loc,
        kind: '地點',
        book: 'look',
        name: '測試查看',
        title: '自動放槽測試',
        cost: 1,
        text: '這是自動放槽測試故事。',
        dice: ['士氣']
      };
      s.phase = 'dice';
      autoResolveDice();
      save();
    });

    // 驗證 phase 自動切換到 result
    assert.equal(await p.evaluate(()=>s.phase), 'result');
    // 驗證骰槽已被自動佔用，放著「士氣」
    const occupied = await p.evaluate(()=>Object.values(s.occupied));
    assert.deepEqual(occupied, ['士氣']);
    // 驗證士氣值未受扣減（因為被槽位吸收了）
    assert.equal(await p.evaluate(()=>s.stats[1]), 4);
    // 驗證畫面出現結算摘要
    const summaryText = await p.locator('.diceSummaryPanel').innerText();
    assert.match(summaryText, /士氣/);
    assert.match(summaryText, /骰槽/);
    console.log('✓ 可放骰槽的骰子成功自動放置，吸收傷害');

    console.log('--- 測試 2：無法放入骰槽的骰子自動承受結果，無需確認 ---');
    await p.evaluate(()=>{
      // 1435 沒有時間槽，時間骰無法被 1435 吸收
      s.occupied = {};
      s.penalty = 0;
      s.stats = [4, 4, 4];
      s.a = {
        id: s.loc,
        origin: s.loc,
        kind: '地點',
        book: 'look',
        name: '測試查看',
        title: '自動承受測試',
        cost: 1,
        text: '這是自動承受測試故事。',
        dice: ['時間']
      };
      s.phase = 'dice';
      autoResolveDice();
      save();
    });

    assert.equal(await p.evaluate(()=>s.phase), 'result');
    // 驗證時間屬性自動扣減 1 (4 -> 3)
    assert.equal(await p.evaluate(()=>s.stats[0]), 3);
    // 驗證懲罰區增加 1 顆
    assert.equal(await p.evaluate(()=>s.penalty), 1);
    // 驗證骰槽仍為空
    assert.equal(await p.evaluate(()=>Object.keys(s.occupied).length), 0);
    const summaryText2 = await p.locator('.diceSummaryPanel').innerText();
    assert.match(summaryText2, /時間/);
    assert.match(summaryText2, /失去 1 點時間/);
    console.log('✓ 無法放入骰槽的骰子成功自動承受並扣屬性與增懲罰');

    console.log('--- 測試 3：混合多顆骰子（時間、士氣、空白）混合自動分配 ---');
    await p.evaluate(()=>{
      s.occupied = {};
      s.penalty = 0;
      s.boost[1435] = 0;
      s.stats = [4, 4, 4];
      s.a = {
        id: s.loc,
        origin: s.loc,
        kind: '地點',
        book: 'look',
        name: '測試混合',
        title: '混合骰子測試',
        cost: 3,
        text: '這是混合骰子測試故事。',
        dice: ['時間', '士氣', '空白']
      };
      s.phase = 'dice';
      autoResolveDice();
      save();
    });

    assert.equal(await p.evaluate(()=>s.phase), 'result');
    // 士氣放入 1435 槽位
    assert.deepEqual(await p.evaluate(()=>Object.values(s.occupied)), ['士氣']);
    // 時間扣 1，士氣不扣（被槽吸收），空白不扣
    assert.equal(await p.evaluate(()=>s.stats[0]), 3); // 時間扣 1
    assert.equal(await p.evaluate(()=>s.stats[1]), 4); // 士氣不扣
    assert.equal(await p.evaluate(()=>s.stats[2]), 4); // 生命不扣
    // 根據官方FAQ與規則書，時間骰與空白骰均進入中央懲罰區（時間骰扣屬性，空白骰不扣屬性但佔用骰子）
    assert.equal(await p.evaluate(()=>s.penalty), 2);

    const summaryItems = await p.locator('.diceSummaryList li').allInnerTexts();
    console.log('結算摘要列表：', summaryItems);
    assert.equal(summaryItems.length, 3);
    console.log('✓ 混合多顆骰子一次性自動結算完成');

    console.log('--- 測試 4：真實執行行動點擊 roll() 流程進入 dice 階段，並可一鍵自動分配結算 ---');
    await p.evaluate(()=>{
      s.loc = 172;
      s.used = [];
      s.grid[4] = 1435;
      s.occupied = {};
      s.penalty = 0;
      s.boost[1435] = 0;
      s.stats = [4, 4, 4];
      s.phase = 'ready';
      save();
      const idx = actions().findIndex(a => a.event === 'story:look:0172:01');
      if (idx >= 0) choose(idx);
    });
    // 進入 cost 階段
    assert.equal(await p.evaluate(()=>s.phase), 'cost');
    // 點擊 roll() 按鈕，進入 dice 階段，提示玩家可放骰子並供自由操作
    await p.locator('button[onclick="roll()"]').click();
    assert.equal(await p.evaluate(()=>s.phase), 'dice');
    assert.equal(await p.locator('.dicePromptNotice').count(), 1);
    // 點擊結算按鈕直達 result
    await p.locator('button:has-text("承受所有剩餘骰子並結算結果")').click();
    assert.equal(await p.evaluate(()=>s.phase), 'result');
    console.log('✓ 透過 UI 點擊 roll() 進入 dice 階段，可自由決定或一鍵結算，直達 result 階段');

    assert.deepEqual(errors, []);
    console.log('所有自動放置與自動結算測試順利通過！');
  }finally{
    await b.close();
  }
})().catch(e=>{console.error(e);process.exit(1)});
