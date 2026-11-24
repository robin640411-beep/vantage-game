const { chromium } = require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const url = require('node:url');

(async () => {
  const b = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  try {
    const p = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true });
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    await p.goto(url.pathToFileURL(path.resolve(__dirname, '../dist/index.html')).href);
    await p.getByRole('button', { name: '開始探險' }).click();
    await p.evaluate(() => {
      if (s.phase === 'mission') confirmMission();
      escapePod();
      if (s.phase === 'crash') land();
      diceTray.close();
    });

    const runStory = async (event, choice = null, money = 50) => {
      return await p.evaluate(({ event, choice, money }) => {
        const r = stories[event];
        const book = event.split(':')[1];
        s.grid = s.grid.map((v, i) => i === 4 ? v : 0);
        s.reserve = []; s.unplaced = []; s.supply = []; s.fates = [];
        s.money = money; s.stats = [4, 4, 4]; s.skill = [0, 0, 0, 0, 0, 0];
        s.a = { id: r[0], event, kind: '地點', book, name: r[5], title: r[5], text: r[1], dice: [] };
        s.phase = 'result';
        save();
        if (choice != null) selectBranch(choice);
        settleRewards();
        fillAcquiredCards();
        return {
          owned: [...s.grid, ...s.reserve, ...s.supply, ...s.fates, ...(s.unplaced || [])].filter(Boolean),
          fates: [...s.fates],
          boost: { ...s.boost },
          stats: [...s.stats],
          text: r[1]
        };
      }, { event, choice, money });
    };

    // 1. 引號前綴命運獎勵（之前因前綴為 ” 被跳過）
    let res = await runStory('story:engage:0116:01');
    assert.ok(res.fates.includes(1604), 'engage:0116:01 should grant Fate 1604');
    console.log('✓ 引號前綴命運獎勵（engage:0116 -> 命運 1604）驗證通過');

    // 2. 括號內物品獎勵（depart:0551 -> 物品 955）
    res = await runStory('story:depart:0551:01');
    assert.ok(res.owned.includes(955), 'depart:0551:01 should grant Item 955');
    console.log('✓ 句中括號獎勵（depart:0551 -> 物品 955）驗證通過');

    // 3. 符文投射器智慧生物（且其放置時只有1點強化，而非2點強化）
    res = await runStory('story:engage:0107:01');
    assert.ok(res.owned.includes(1345), 'engage:0107:01 should grant Sentient 1345');
    assert.equal(res.boost[1345], 1, 'Sentient 1345 from rune projector must start with 1 boost (not 2)');
    console.log('✓ 符文投射器智慧生物（engage:0107 -> 1345，初始 1 強化）驗證通過');

    // 4. 含「士氣值」之複合獎勵（engage:0176 -> 能力 1469 + 1 士氣）
    res = await runStory('story:engage:0176:01');
    assert.ok(res.owned.includes(1469), 'engage:0176:01 should grant Ability 1469');
    assert.equal(res.stats[1], 5, 'engage:0176:01 should grant +1 morale');
    console.log('✓ 「士氣值」複合獎勵（engage:0176 -> 能力 1469 + 1 士氣）驗證通過');

    // 5. 多物品連列 + 補齊截斷構築物（engage:0204 選項 2 -> 907, 912, 1040, 1158, 1688）
    res = await runStory('story:engage:0204:01', 2, 40);
    for (const cid of [907, 912, 1040, 1158, 1688]) {
      assert.ok(res.owned.includes(cid), 'engage:0204:01#2 should grant card ' + cid);
    }
    console.log('✓ 多物品連列與截斷補齊（engage:0204 -> 907/912/1040/1158/1688）驗證通過');

    // 6. 原書補齊之截斷條目（engage:0158 -> 1340 + 任務 1628；look:0600 -> 三學派課程選擇）
    res = await runStory('story:engage:0158:01');
    assert.ok(res.owned.includes(1340) && res.owned.includes(1628), 'engage:0158:01 should grant 1340 and 1628');
    res = await runStory('story:look:0600:01', 2);
    assert.ok(res.owned.includes(1424), 'look:0600:01#2 should grant Lesson 1424');
    console.log('✓ 截斷條目補齊（engage:0158 -> 1340+1628；look:0600 -> 課程 1424）驗證通過');

    // 7. 亂碼牌號修復（help:0137 -> 1092；help:0480 -> 848；overpower:0264 -> 937）
    for (const [ev, cid] of [['story:help:0137:01', 1092], ['story:help:0480:01', 848], ['story:overpower:0264:01', 937]]) {
      res = await runStory(ev);
      assert.ok(res.owned.includes(cid), ev + ' should grant card ' + cid);
    }
    console.log('✓ 亂碼牌號修復（help:0137 -> 1092；help:0480 -> 848；overpower:0264 -> 937）驗證通過');

    assert.deepEqual(errors, [], 'No page errors');
    console.log('🎉 全部故事文字修復與對應卡牌獲取測試通過！');
  } finally {
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
