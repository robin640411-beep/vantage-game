// dist/card-abilities.js - 萬境奇旅 卡牌啟動式異能與互動系統
(function(root) {
  // 啟動式卡牌異能資料庫
  const cardActiveAbilities = {
    // 智慧生物 1353：玫瑰，慈善家
    1353: {
      id: 1353,
      name: '玫瑰，慈善家 · 支付 1 強化選擇一項',
      actionName: '援助（異能）',
      title: '玫瑰，慈善家（智慧生物 1353）',
      hint: '消耗此卡 1 點強化，選擇：相鄰卡牌獲得強化、獲得任務 1665、或跟隨前往 390。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '玫瑰，慈善家為你提供幫助。已支付此卡上的 1 點強化。請選擇一項：·在一張相鄰卡牌上獲得強化：在一張相鄰的卡牌上獲得1點強化。·獲得任務1665：將任務1665加入供應區。·跟隨前往地點390：跟隨此智慧生物前往首都城市的東部外側（390）。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const slot = s.grid.indexOf(1353);
          const adjSlots = typeof gridAdjacentSlots === 'function' ? gridAdjacentSlots(slot) : [];
          const adjCards = adjSlots.map(i => s.grid[i]).filter(n => n && n !== 1353 && cards[n]);
          const target = egg && adjCards.includes(egg) ? egg : (adjCards.find(n => (s.boost[n] || 0) < cards[n].cap) || adjCards[0] || s.grid[4]);
          if (target) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '玫瑰，慈善家給予支援，已在卡牌 ' + target + '（' + (cards[target]?.name || ('卡牌 ' + target)) + '）上添加 1 點強化。';
            noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
          } else {
            a.text = '網格中沒有可接受強化的相鄰卡牌。';
          }
        } else if (index === 2) {
          creditReward({ card: 1665, type: '任務', label: '獲得任務1665' }, a);
          a.text = '玫瑰，慈善家將重要使命託付予你，已獲得任務 1665（加入供應區）。';
          noteDecision('獲得任務 1665。');
        } else if (index === 3) {
          a.dest = 390;
          a.text = '你跟隨玫瑰，慈善家啟程，前往首都城市的東部外側（地點 390）。點選完成後抵達。';
          noteDecision('跟隨玫瑰，慈善家前往地點 390。');
        }
      }
    },

    // 智慧生物 1305：陣風，喚風者
    1305: {
      id: 1305,
      name: '陣風，喚風者 · 支付 1 強化選擇一項',
      actionName: '駕駛（異能）',
      title: '陣風，喚風者（智慧生物 1305）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點缺氧傷害、刷新網格中1顆挑戰骰、或獲得能力 1469。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '陣風，喚風者為你提供支援。已支付此卡上的 1 點強化。請選擇一項：·忽略1點缺氧傷害：抵達時忽略1點缺氧傷害。·刷新網格中的1顆挑戰骰：刷新你網格中的1顆挑戰骰。·獲得能力1469：獲得能力1469。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreOxygenOnArrival = true;
          a.text = '陣風召喚清風環繞，本回合抵達時忽略 1 點缺氧傷害。';
          noteDecision('抵達時忽略 1 點缺氧傷害。');
        } else if (index === 2) {
          const occ = Object.keys(s.occupied);
          if (occ.length) {
            delete s.occupied[occ[0]];
            a.text = '陣風吹散了卡牌上的挑戰骰，已刷新網格中的 1 顆挑戰骰。';
            noteDecision('刷新網格中的 1 顆挑戰骰。');
          } else {
            a.text = '網格中目前沒有被佔用的挑戰骰。';
          }
        } else if (index === 3) {
          creditReward({ card: 1469, type: '能力', label: '獲得能力1469' }, a);
          a.text = '陣風將呼吸術傳授於你，已獲得能力 1469。';
          noteDecision('獲得能力 1469。');
        }
      }
    },

    // 智慧生物 1306：微風，園丁
    1306: {
      id: 1306,
      name: '微風，園丁 · 支付 1 強化選擇一項',
      actionName: '低語（異能）',
      title: '微風，園丁（智慧生物 1306）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點缺氧傷害、刷新網格中1顆挑戰骰、或獲得能力 1019。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '微風，園丁為你提供支援。已支付此卡上的 1 點強化。請選擇一項：·忽略1點缺氧傷害：抵達時忽略1點缺氧傷害。·刷新網格中的1顆挑戰骰：刷新你網格中的1顆挑戰骰。·獲得能力1019：獲得能力1019。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreOxygenOnArrival = true;
          a.text = '微風輕撫，本回合抵達時忽略 1 點缺氧傷害。';
          noteDecision('抵達時忽略 1 點缺氧傷害。');
        } else if (index === 2) {
          const occ = Object.keys(s.occupied);
          if (occ.length) {
            delete s.occupied[occ[0]];
            a.text = '微風吹散了卡牌上的挑戰骰，已刷新網格中的 1 顆挑戰骰。';
            noteDecision('刷新網格中的 1 顆挑戰骰。');
          } else {
            a.text = '網格中目前沒有被佔用的挑戰骰。';
          }
        } else if (index === 3) {
          creditReward({ card: 1019, type: '能力', label: '獲得能力1019' }, a);
          a.text = '園丁向你傳授種植智慧，已獲得能力 1019。';
          noteDecision('獲得能力 1019。');
        }
      }
    },

    // 智慧生物 1307：阿特拉斯，制圖師
    1307: {
      id: 1307,
      name: '阿特拉斯，制圖師 · 支付 1 強化選擇一項',
      actionName: '導航（異能）',
      title: '阿特拉斯，制圖師（智慧生物 1307）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點缺氧傷害、刷新網格中1顆挑戰骰、或參見植物地圖。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '阿特拉斯，制圖師為你指路。已支付此卡上的 1 點強化。請選擇一項：·忽略1點缺氧傷害：抵達時忽略1點缺氧傷害。·刷新網格中的1顆挑戰骰：刷新你網格中的1顆挑戰骰。·參見植物地圖：在本回合結束前參見植物地圖（《萬境之書》第20頁）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreOxygenOnArrival = true;
          a.text = '制圖師為你指明安全通風路徑，本回合抵達時忽略 1 點缺氧傷害。';
          noteDecision('抵達時忽略 1 點缺氧傷害。');
        } else if (index === 2) {
          const occ = Object.keys(s.occupied);
          if (occ.length) {
            delete s.occupied[occ[0]];
            a.text = '已刷新網格中的 1 顆挑戰骰。';
            noteDecision('刷新網格中的 1 顆挑戰骰。');
          } else {
            a.text = '網格中目前沒有被佔用的挑戰骰。';
          }
        } else if (index === 3) {
          a.printPage = 20;
          if (typeof unlockVantagePage === 'function') unlockVantagePage(20, true);
          a.text = '阿特拉斯展開了珍貴的植物地圖（《萬境之書》第20頁）。';
          noteDecision('參見植物地圖（《萬境之書》第20頁）。');
        }
      }
    },

    // 智慧生物 1308：狂風，護風者
    1308: {
      id: 1308,
      name: '狂風，護風者 · 支付 1 強化選擇一項',
      actionName: '提供（異能）',
      title: '狂風，護風者（智慧生物 1308）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點缺氧傷害、刷新網格中1顆挑戰骰、或獲得任務1669並前往180。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '狂風，護風者為你提供支援。已支付此卡上的 1 點強化。請選擇一項：·忽略1點缺氧傷害：抵達時忽略1點缺氧傷害。·刷新網格中的1顆挑戰骰：刷新你網格中的1顆挑戰骰。·獲得任務1669並跟隨前往地點180：獲得任務1669，跟隨此智慧生物前往他的帳篷處（地點 180）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreOxygenOnArrival = true;
          a.text = '護風者為你阻擋烈風，本回合抵達時忽略 1 點缺氧傷害。';
          noteDecision('抵達時忽略 1 點缺氧傷害。');
        } else if (index === 2) {
          const occ = Object.keys(s.occupied);
          if (occ.length) {
            delete s.occupied[occ[0]];
            a.text = '已刷新網格中的 1 顆挑戰骰。';
            noteDecision('刷新網格中的 1 顆挑戰骰。');
          } else {
            a.text = '網格中目前沒有被佔用的挑戰骰。';
          }
        } else if (index === 3) {
          creditReward({ card: 1669, type: '任務', label: '獲得任務1669' }, a);
          a.dest = 180;
          a.text = '護風者託付重要任務，已獲得任務 1669，並跟隨前往他的帳篷（地點 180）。點選完成後抵達。';
          noteDecision('獲得任務 1669，跟隨前往地點 180。');
        }
      }
    },

    // 智慧生物 1309：風暴，孢子販
    1309: {
      id: 1309,
      name: '風暴，孢子販 · 支付 1 強化選擇一項',
      actionName: '避開（異能）',
      title: '風暴，孢子販（智慧生物 1309）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點缺氧傷害、刷新網格中1顆挑戰骰、或獲得物品 867。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '風暴，孢子販為你提供商品。已支付此卡上的 1 點強化。請選擇一項：·忽略1點缺氧傷害：抵達時忽略1點缺氧傷害。·刷新網格中的1顆挑戰骰：刷新你網格中的1顆挑戰骰。·獲得物品867：獲得孢子小瓶（物品 867）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreOxygenOnArrival = true;
          a.text = '本回合抵達時忽略 1 點缺氧傷害。';
          noteDecision('抵達時忽略 1 點缺氧傷害。');
        } else if (index === 2) {
          const occ = Object.keys(s.occupied);
          if (occ.length) {
            delete s.occupied[occ[0]];
            a.text = '已刷新網格中的 1 顆挑戰骰。';
            noteDecision('刷新網格中的 1 顆挑戰骰。');
          } else {
            a.text = '網格中目前沒有被佔用的挑戰骰。';
          }
        } else if (index === 3) {
          creditReward({ card: 867, type: '物品', label: '獲得物品867' }, a);
          a.text = '孢子販遞給你一瓶旋轉氣體，已獲得物品 867。';
          noteDecision('獲得物品 867。');
        }
      }
    },

    // 智慧生物 1315：燃燒，鐵匠
    1315: {
      id: 1315,
      name: '燃燒，鐵匠 · 支付 1 強化選擇一項',
      actionName: '製作（異能）',
      title: '燃燒，鐵匠（智慧生物 1315）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、獲得1點隨機技能、或獲得物品 895。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '燃燒，鐵匠為你提供鍛造支援。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·獲得1點隨機技能：獲得1點隨機技能。·獲得物品895：獲得鐵鏟（物品 895）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '鐵匠的爐火溫暖了你，本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '鐵匠傳授鍛造心法，已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        } else if (index === 3) {
          creditReward({ card: 895, type: '物品', label: '獲得物品895' }, a);
          a.text = '鐵匠打造了一把堅固鐵鏟，已獲得物品 895。';
          noteDecision('獲得物品 895。');
        }
      }
    },

    // 智慧生物 1316：灰煙，冶煉工
    1316: {
      id: 1316,
      name: '灰煙，冶煉工 · 支付 1 強化選擇一項',
      actionName: '組裝（異能）',
      title: '灰煙，冶煉工（智慧生物 1316）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、獲得1點隨機技能、或獲得藍圖 1294。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '灰煙，冶煉工為你提供冶煉支援。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·獲得1點隨機技能：獲得1點隨機技能。·獲得藍圖1294：獲得建築藍圖（卡牌 1294）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        } else if (index === 3) {
          creditReward({ card: 1294, type: '藍圖', label: '獲得藍圖1294' }, a);
          a.text = '冶煉工贈予結構藍圖，已獲得藍圖 1294。';
          noteDecision('獲得藍圖 1294。');
        }
      }
    },

    // 智慧生物 1317：灼痕，紋身師
    1317: {
      id: 1317,
      name: '灼痕，紋身師 · 支付 1 強化選擇一項',
      actionName: '稱讚（異能）',
      title: '灼痕，紋身師（智慧生物 1317）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、或獲得1點隨機技能。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '灼痕，紋身師為你紋刻守護符文。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·獲得1點隨機技能：獲得1點隨機技能。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '符文護體，本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '紋身激發潛能，已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        }
      }
    },

    // 智慧生物 1318：爐窯，拾荒者
    1318: {
      id: 1318,
      name: '爐窯，拾荒者 · 支付 1 強化選擇一項',
      actionName: '搜尋（異能）',
      title: '爐窯，拾荒者（智慧生物 1318）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、獲得1點隨機技能、或獲得物品 1101。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '爐窯，拾荒者分享廢土蒐集成果。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·獲得1點隨機技能：獲得1點隨機技能。·獲得物品1101：獲得熔岩奇物（物品 1101）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        } else if (index === 3) {
          creditReward({ card: 1101, type: '物品', label: '獲得物品1101' }, a);
          a.text = '拾荒者找到了珍稀礦物，已獲得物品 1101。';
          noteDecision('獲得物品 1101。');
        }
      }
    },

    // 智慧生物 1319：火焰，火把製造師
    1319: {
      id: 1319,
      name: '火焰，火把製造師 · 支付 1 強化選擇一項',
      actionName: '探索（異能）',
      title: '火焰，火把製造師（智慧生物 1319）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、獲得1點隨機技能、或獲得物品 1086。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '火焰，火把製造師點燃火光。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·獲得1點隨機技能：獲得1點隨機技能。·獲得物品1086：獲得火焰火把（物品 1086）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '火把驅散寒意，本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        } else if (index === 3) {
          creditReward({ card: 1086, type: '物品', label: '獲得物品1086' }, a);
          a.text = '火把製造師遞給你一支明亮火把，已獲得物品 1086。';
          noteDecision('獲得物品 1086。');
        }
      }
    },

    // 智慧生物 1350：珊瑚，草藥師
    1350: {
      id: 1350,
      name: '珊瑚，草藥師 · 支付 1 強化選擇一項',
      actionName: '治癒（異能）',
      title: '珊瑚，草藥師（智慧生物 1350）',
      hint: '消耗此卡 1 點強化，選擇：相鄰卡牌獲得強化、或參見《萬境之書》第30頁。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '珊瑚，草藥師為你提供藥草調理。已支付此卡上的 1 點強化。請選擇一項：·在一張相鄰卡牌上獲得強化：在一張相鄰的卡牌上獲得1點強化。·參見萬境之書第30頁：參閱《萬境之書》第30頁。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const slot = s.grid.indexOf(1350);
          const adjSlots = typeof gridAdjacentSlots === 'function' ? gridAdjacentSlots(slot) : [];
          const adjCards = adjSlots.map(i => s.grid[i]).filter(n => n && n !== 1350 && cards[n]);
          const target = egg && adjCards.includes(egg) ? egg : (adjCards.find(n => (s.boost[n] || 0) < cards[n].cap) || adjCards[0] || s.grid[4]);
          if (target) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '草藥師調製藥水，已在卡牌 ' + target + ' 上添加 1 點強化。';
            noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
          }
        } else if (index === 2) {
          a.printPage = 30;
          if (typeof unlockVantagePage === 'function') unlockVantagePage(30, true);
          a.text = '草藥師引導你參閱《萬境之書》第30頁。';
          noteDecision('參閱《萬境之書》第30頁。');
        }
      }
    },

    // 智慧生物 1351：洋紅，植物學家
    1351: {
      id: 1351,
      name: '洋紅，植物學家 · 支付 1 強化選擇一項',
      actionName: '照料（異能）',
      title: '洋紅，植物學家（智慧生物 1351）',
      hint: '消耗此卡 1 點強化，選擇：相鄰卡牌獲得強化、或參見《萬境之書》第26頁。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '洋紅，植物學家為你培育植物。已支付此卡上的 1 點強化。請選擇一項：·在一張相鄰卡牌上獲得強化：在一張相鄰的卡牌上獲得1點強化。·參見萬境之書第26頁：參閱《萬境之書》第26頁。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const slot = s.grid.indexOf(1351);
          const adjSlots = typeof gridAdjacentSlots === 'function' ? gridAdjacentSlots(slot) : [];
          const adjCards = adjSlots.map(i => s.grid[i]).filter(n => n && n !== 1351 && cards[n]);
          const target = egg && adjCards.includes(egg) ? egg : (adjCards.find(n => (s.boost[n] || 0) < cards[n].cap) || adjCards[0] || s.grid[4]);
          if (target) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '植物學家精心培育，已在卡牌 ' + target + ' 上添加 1 點強化。';
            noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
          }
        } else if (index === 2) {
          a.printPage = 26;
          if (typeof unlockVantagePage === 'function') unlockVantagePage(26, true);
          a.text = '植物學家為你翻開《萬境之書》第26頁。';
          noteDecision('參閱《萬境之書》第26頁。');
        }
      }
    },

    // 智慧生物 1352：青綠，園藝師
    1352: {
      id: 1352,
      name: '青綠，園藝師 · 支付 1 強化選擇一項',
      actionName: '釀製（異能）',
      title: '青綠，園藝師（智慧生物 1352）',
      hint: '消耗此卡 1 點強化，選擇：相鄰卡牌獲得強化、或參見《萬境之書》第14頁。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '青綠，園藝師為你修剪枝葉。已支付此卡上的 1 點強化。請選擇一項：·在一張相鄰卡牌上獲得強化：在一張相鄰的卡牌上獲得1點強化。·參見萬境之書第14頁：參閱《萬境之書》第14頁。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const slot = s.grid.indexOf(1352);
          const adjSlots = typeof gridAdjacentSlots === 'function' ? gridAdjacentSlots(slot) : [];
          const adjCards = adjSlots.map(i => s.grid[i]).filter(n => n && n !== 1352 && cards[n]);
          const target = egg && adjCards.includes(egg) ? egg : (adjCards.find(n => (s.boost[n] || 0) < cards[n].cap) || adjCards[0] || s.grid[4]);
          if (target) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '園藝師修剪枝葉，已在卡牌 ' + target + ' 上添加 1 點強化。';
            noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
          }
        } else if (index === 2) {
          a.printPage = 14;
          if (typeof unlockVantagePage === 'function') unlockVantagePage(14, true);
          a.text = '園藝師指引你參見《萬境之書》第14頁。';
          noteDecision('參見《萬境之書》第14頁。');
        }
      }
    },

    // 智慧生物 1355：貝殼，官員
    1355: {
      id: 1355,
      name: '貝殼，官員 · 支付 1 強化選擇一項',
      actionName: '練習（異能）',
      title: '貝殼，官員（智慧生物 1355）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點高溫傷害、重擲1顆挑戰骰、或獲得能力 1474。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '貝殼，官員為你行使職權。已支付此卡上的 1 點強化。請選擇一項：·忽略1點高溫傷害：抵達時忽略1點高溫傷害。·重擲1顆挑戰骰：允許重擲1顆挑戰骰。·獲得能力1474：獲得官員能力（卡牌 1474）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreHeatOnArrival = true;
          a.text = '官員提供防護通行證，本回合抵達時忽略 1 點高溫傷害。';
          noteDecision('抵達時忽略 1 點高溫傷害。');
        } else if (index === 2) {
          a.text = '官員准許你重擲骰子。';
          noteDecision('官員准許重擲挑戰骰。');
        } else if (index === 3) {
          creditReward({ card: 1474, type: '能力', label: '獲得能力1474' }, a);
          a.text = '官員傳授治理智慧，已獲得能力 1474。';
          noteDecision('獲得能力 1474。');
        }
      }
    },

    // 智慧生物 1357：飛濺，騎士
    1357: {
      id: 1357,
      name: '飛濺，騎士 · 支付 1 強化選擇一項',
      actionName: '擊殺（異能）',
      title: '飛濺，騎士（智慧生物 1357）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點高溫傷害、重擲1顆挑戰骰、或參閱《萬境之書》第19頁。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '飛濺，騎士拔劍出擊。已支付此卡上的 1 點強化。請選擇一項：·忽略1點高溫傷害：抵達時忽略1點高溫傷害。·重擲1顆挑戰骰：重擲1顆挑戰骰。·參見萬境之書第19頁：參閱《萬境之書》第19頁。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreHeatOnArrival = true;
          a.text = '騎士護送，本回合抵達時忽略 1 點高溫傷害。';
          noteDecision('抵達時忽略 1 點高溫傷害。');
        } else if (index === 2) {
          a.text = '騎士助戰，重擲 1 顆挑戰骰。';
          noteDecision('重擲 1 顆挑戰骰。');
        } else if (index === 3) {
          a.printPage = 19;
          if (typeof unlockVantagePage === 'function') unlockVantagePage(19, true);
          a.text = '騎士為你展示《萬境之書》第19頁。';
          noteDecision('參見《萬境之書》第19頁。');
        }
      }
    },

    // 智慧生物 1358：利爪，海岸警衛
    1358: {
      id: 1358,
      name: '利爪，海岸警衛 · 支付 1 強化選擇一項',
      actionName: '劫掠（異能）',
      title: '利爪，海岸警衛（智慧生物 1358）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點高溫傷害、重擲1顆挑戰骰、或獲得任務 1681 並前往 738。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '利爪，海岸警衛發起巡航。已支付此卡上的 1 點強化。請選擇一項：·忽略1點高溫傷害：抵達時忽略1點高溫傷害。·重擲1顆挑戰骰：重擲1顆挑戰骰。·獲得任務1681並跟隨前往地點738：獲得任務1681，跟隨此智慧生物前往島嶼珍珠的東南側（地點 738）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreHeatOnArrival = true;
          a.text = '本回合抵達時忽略 1 點高溫傷害。';
          noteDecision('抵達時忽略 1 點高溫傷害。');
        } else if (index === 2) {
          a.text = '重擲 1 顆挑戰骰。';
          noteDecision('重擲 1 顆挑戰骰。');
        } else if (index === 3) {
          creditReward({ card: 1681, type: '任務', label: '獲得任務1681' }, a);
          a.dest = 738;
          a.text = '獲得任務 1681，並跟隨警衛前往島嶼珍珠東南側（地點 738）。點選完成後抵達。';
          noteDecision('獲得任務 1681，跟隨前往地點 738。');
        }
      }
    },

    // 智慧生物 1360：橡樹，攀登者
    1360: {
      id: 1360,
      name: '橡樹，攀登者 · 支付 1 強化選擇一項',
      actionName: '攀爬（異能）',
      title: '橡樹，攀登者（智慧生物 1360）',
      hint: '消耗此卡 1 點強化，選擇：查看相鄰地點、參閱行動費用、或獲得物品 884。然後角色獲得 1 強化。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '橡樹，攀登者登高遠眺。已支付此卡上的 1 點強化。請選擇一項：·查看相鄰地點：查看一個相鄰的列出地點。·參閱行動費用：參閱一個地點行動的費用。·獲得物品884：獲得攀爬裝備（物品 884）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          a.text = '攀登者眺望遠方，為你探明了相鄰地點的地形與出口。';
          noteDecision('查看相鄰地點。');
        } else if (index === 2) {
          a.text = '攀登者為你指明了地點行動的費用與挑戰。';
          noteDecision('參閱地點行動費用。');
        } else if (index === 3) {
          creditReward({ card: 884, type: '物品', label: '獲得物品884' }, a);
          a.text = '攀登者分享了攀爬裝備，已獲得物品 884。';
          noteDecision('獲得物品 884。');
        }
        // 然後，在你的角色上獲得強化
        const heroSlot = s.grid[4];
        if (heroSlot && cards[heroSlot]) {
          s.boost[heroSlot] = Math.min(cards[heroSlot].cap, (s.boost[heroSlot] || 0) + 1);
          a.text += ' 然後，你的角色獲得了 1 點強化。';
        }
      }
    },

    // 智慧生物 1363：雲杉，鞋匠
    1363: {
      id: 1363,
      name: '雲杉，鞋匠 · 支付 1 強化選擇一項',
      actionName: '徒步（異能）',
      title: '雲杉，鞋匠（智慧生物 1363）',
      hint: '消耗此卡 1 點強化，選擇：查看相鄰地點、參閱行動費用、或獲得物品 993。然後角色獲得 1 強化。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '雲杉，鞋匠為你縫製行裝。已支付此卡上的 1 點強化。請選擇一項：·查看相鄰地點：查看一個相鄰的列出地點。·參閱行動費用：參閱一個地點行動的費用。·獲得物品993：獲得鞋匠特製裝備（物品 993）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          a.text = '鞋匠為你標記了相鄰地點的道路。';
          noteDecision('查看相鄰地點。');
        } else if (index === 2) {
          a.text = '鞋匠為你說明了前方的步履費用。';
          noteDecision('參閱行動費用。');
        } else if (index === 3) {
          creditReward({ card: 993, type: '物品', label: '獲得物品993' }, a);
          a.text = '鞋匠交付特製鞋具，已獲得物品 993。';
          noteDecision('獲得物品 993。');
        }
        const heroSlot = s.grid[4];
        if (heroSlot && cards[heroSlot]) {
          s.boost[heroSlot] = Math.min(cards[heroSlot].cap, (s.boost[heroSlot] || 0) + 1);
          a.text += ' 然後，你的角色獲得了 1 點強化。';
        }
      }
    },

    // 智慧生物 1364：白樺，造船工
    1364: {
      id: 1364,
      name: '白樺，造船工 · 支付 1 強化選擇一項',
      actionName: '升級（異能）',
      title: '白樺，造船工（智慧生物 1364）',
      hint: '消耗此卡 1 點強化，選擇：查看相鄰地點、參閱行動費用、或獲得載具 1014。然後角色獲得 1 強化。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '白樺，造船工為你打造航行工具。已支付此卡上的 1 點強化。請選擇一項：·查看相鄰地點：查看一個相鄰的列出地點。·參閱行動費用：參閱一個地點行動的費用。·獲得載具1014：獲得划艇（載具 1014）。',
      resolve: (s, a, index) => {
        if (index === 1) {
          a.text = '造船工探查水域與相鄰地點。';
          noteDecision('查看相鄰地點。');
        } else if (index === 2) {
          a.text = '造船工為你評估水陸航行費用。';
          noteDecision('參閱行動費用。');
        } else if (index === 3) {
          creditReward({ card: 1014, type: '載具', label: '獲得載具1014' }, a);
          a.text = '造船工交付一艘堅固划艇，已獲得載具 1014。';
          noteDecision('獲得載具 1014。');
        }
        const heroSlot = s.grid[4];
        if (heroSlot && cards[heroSlot]) {
          s.boost[heroSlot] = Math.min(cards[heroSlot].cap, (s.boost[heroSlot] || 0) + 1);
          a.text += ' 然後，你的角色獲得了 1 點強化。';
        }
      }
    },

    // 智慧生物 1354：水藍，美容師
    1354: {
      id: 1354,
      name: '水藍，美容師 · 支付 1 強化選擇一項',
      actionName: '致敬（異能）',
      title: '水藍，美容師（智慧生物 1354）',
      hint: '消耗此卡 1 點強化，選擇：相鄰卡牌獲得強化、或調整技能骰面結果。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '水藍，美容師為你梳理修飾。已支付此卡上的 1 點強化。請選擇一項：·在一張相鄰卡牌上獲得強化：在一張相鄰的卡牌上獲得1點強化。·調整技能骰面：將新擲出的一顆技能骰結果更改為與你擁有的技能相匹配的結果。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const slot = s.grid.indexOf(1354);
          const adjSlots = typeof gridAdjacentSlots === 'function' ? gridAdjacentSlots(slot) : [];
          const adjCards = adjSlots.map(i => s.grid[i]).filter(n => n && n !== 1354 && cards[n]);
          const target = egg && adjCards.includes(egg) ? egg : (adjCards.find(n => (s.boost[n] || 0) < cards[n].cap) || adjCards[0] || s.grid[4]);
          if (target) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '美容師為你提供支援，已在卡牌 ' + target + ' 上添加 1 點強化。';
            noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
          }
        } else if (index === 2) {
          a.text = '美容師為你調整狀態，允許調整新擲出的技能骰面。';
          noteDecision('允許調整技能骰面。');
        }
      }
    },

    // 智慧生物 1356：船板，發明家
    1356: {
      id: 1356,
      name: '船板，發明家 · 支付 1 強化選擇一項',
      actionName: '製作（異能）',
      title: '船板，發明家（智慧生物 1356）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點高溫傷害、或重擲1顆挑戰骰。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '船板，發明家啟動特製裝置。已支付此卡上的 1 點強化。請選擇一項：·忽略1點高溫傷害：抵達時忽略1點高溫傷害。·重擲1顆挑戰骰：允許重擲1顆挑戰骰。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreHeatOnArrival = true;
          a.text = '特製裝置防護高溫，本回合抵達時忽略 1 點高溫傷害。';
          noteDecision('抵達時忽略 1 點高溫傷害。');
        } else if (index === 2) {
          a.text = '發明家裝置調整了骰子軌跡，允許重擲挑戰骰。';
          noteDecision('允許重擲 1 顆挑戰骰。');
        }
      }
    },

    // 智慧生物 1359：礁石，招募員
    1359: {
      id: 1359,
      name: '礁石，招募員 · 支付 1 強化選擇一項',
      actionName: '招募（異能）',
      title: '礁石，招募員（智慧生物 1359）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點高溫傷害、或重擲1顆挑戰骰。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '礁石，招募員為你安排接應。已支付此卡上的 1 點強化。請選擇一項：·忽略1點高溫傷害：抵達時忽略1點高溫傷害。·重擲1顆挑戰骰：允許重擲1顆挑戰骰。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreHeatOnArrival = true;
          a.text = '接應隊伍掩護，本回合抵達時忽略 1 點高溫傷害。';
          noteDecision('抵達時忽略 1 點高溫傷害。');
        } else if (index === 2) {
          a.text = '招募員隊伍協助重擲挑戰骰。';
          noteDecision('允許重擲 1 顆挑戰骰。');
        }
      }
    },

    // 智慧生物 1361：柳樹，漁夫
    1361: {
      id: 1361,
      name: '柳樹，漁夫 · 支付 1 強化選擇一項',
      actionName: '捕魚（異能）',
      title: '柳樹，漁夫（智慧生物 1361）',
      hint: '消耗此卡 1 點強化，選擇：查看相鄰地點、或參閱行動費用。然後角色獲得 1 強化。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '柳樹，漁夫分享水文觀察。已支付此卡上的 1 點強化。請選擇一項：·查看相鄰地點：查看一個相鄰的列出地點。·參閱行動費用：參閱一個地點行動的費用。',
      resolve: (s, a, index) => {
        if (index === 1) {
          a.text = '漁夫為你指明了相鄰水域與地點。';
          noteDecision('查看相鄰地點。');
        } else if (index === 2) {
          a.text = '漁夫為你介紹了周圍行動的費用。';
          noteDecision('參閱行動費用。');
        }
        const heroSlot = s.grid[4];
        if (heroSlot && cards[heroSlot]) {
          s.boost[heroSlot] = Math.min(cards[heroSlot].cap, (s.boost[heroSlot] || 0) + 1);
          a.text += ' 然後，你的角色獲得了 1 點強化。';
        }
      }
    },

    // 智慧生物 1362：楓樹，雕刻師
    1362: {
      id: 1362,
      name: '楓樹，雕刻師 · 支付 1 強化選擇一項',
      actionName: '提煉（異能）',
      title: '楓樹，雕刻師（智慧生物 1362）',
      hint: '消耗此卡 1 點強化，選擇：查看相鄰地點、或參閱行動費用。然後角色獲得 1 強化。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '楓樹，雕刻師雕琢標記。已支付此卡上的 1 點強化。請選擇一項：·查看相鄰地點：查看一個相鄰的列出地點。·參閱行動費用：參閱一個地點行動的費用。',
      resolve: (s, a, index) => {
        if (index === 1) {
          a.text = '雕刻師在木牌上刻畫出相鄰地點的方向。';
          noteDecision('查看相鄰地點。');
        } else if (index === 2) {
          a.text = '雕刻師說明了地點行動的費用。';
          noteDecision('參閱行動費用。');
        }
        const heroSlot = s.grid[4];
        if (heroSlot && cards[heroSlot]) {
          s.boost[heroSlot] = Math.min(cards[heroSlot].cap, (s.boost[heroSlot] || 0) + 1);
          a.text += ' 然後，你的角色獲得了 1 點強化。';
        }
      }
    },

    // 動物坐騎 809：利維坦九頭蛇
    809: {
      id: 809,
      name: '利維坦九頭蛇 · 乘坐前往相鄰陸地點',
      actionName: '乘坐（利維坦九頭蛇）',
      title: '利維坦九頭蛇（動物 809）',
      hint: '消耗此卡 1 點強化，乘坐九頭蛇移動到一個相鄰的陸地點。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '',
      setupText: (s) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        if (!dests.length) return '當前地點沒有列出的出口目的地。';
        return '乘坐利維坦九頭蛇：請選擇要前往的相鄰陸地點：' +
          dests.map(d => '·前往地點 ' + d + '：乘坐九頭蛇穿越陸地前往地點 ' + d + '。').join('');
      },
      resolve: (s, a, index) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        const dest = dests[index - 1];
        if (dest) {
          a.dest = dest;
          a.text = '九頭蛇載著你大步穿越陸地，前往地點 ' + dest + '。點選完成後抵達。';
          noteDecision('乘坐利維坦九頭蛇前往地點 ' + dest + '。');
        }
      }
    },

    // 動物坐騎 833：沙蜈
    833: {
      id: 833,
      name: '沙蜈 · 乘坐前往相鄰或地下地點',
      actionName: '乘坐（沙蜈）',
      title: '沙蜈（動物 833）',
      hint: '消耗此卡 1 點強化，乘坐沙蜈移動到一個相鄰地點，或地下移動至 043~048。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '',
      setupText: (s) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        const under = [43, 44, 45, 46, 47, 48].filter(d => d !== s.loc);
        const allDests = [...new Set([...dests, ...under])];
        return '乘坐沙蜈：請選擇要前往的地點：' +
          allDests.map(d => '·前往地點 ' + d + '：沙蜈鑽入地底帶你前往地點 ' + d + '。').join('');
      },
      resolve: (s, a, index) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        const under = [43, 44, 45, 46, 47, 48].filter(d => d !== s.loc);
        const allDests = [...new Set([...dests, ...under])];
        const dest = allDests[index - 1];
        if (dest) {
          a.dest = dest;
          a.text = '沙蜈破開砂石，帶你抵達地點 ' + dest + '。點選完成後抵達。';
          noteDecision('乘坐沙蜈前往地點 ' + dest + '。');
        }
      }
    },

    // 動物坐騎 1134：海藻蛇龍
    1134: {
      id: 1134,
      name: '海藻蛇龍 · 乘坐前往陸地/海洋/水下地點',
      actionName: '乘坐（海藻蛇龍）',
      title: '海藻蛇龍（動物 1134）',
      hint: '消耗此卡 1 點強化，移動到一個相鄰的陸地、海洋或水下地點。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '',
      setupText: (s) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        if (!dests.length) return '當前地點沒有列出的出口目的地。';
        return '乘坐海藻蛇龍：請選擇相鄰目的地：' +
          dests.map(d => '·前往地點 ' + d + '：海藻蛇龍破浪載你前往地點 ' + d + '。').join('');
      },
      resolve: (s, a, index) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        const dest = dests[index - 1];
        if (dest) {
          a.dest = dest;
          a.text = '海藻蛇龍在波濤中潛行，帶你抵達地點 ' + dest + '。點選完成後抵達。';
          noteDecision('乘坐海藻蛇龍前往地點 ' + dest + '。');
        }
      }
    },

    // 角色卡 1441~1446：生存者角色異能
    1441: {
      id: 1441,
      name: '朱爾斯，艦長 · 支付 1 強化選擇一項',
      actionName: '角色（異能）',
      title: '朱爾斯，艦長（角色 1441）',
      hint: '消耗角色 1 點強化，選擇：在任意1張卡牌上獲得強化、或將儲備卡牌轉入網格。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid[4] === id,
      text: '朱爾斯，艦長指揮全局。已支付角色上的 1 點強化。請選擇一項：·在任意卡牌上獲得強化：在你的任意1張卡牌上獲得1點強化。·轉移儲備卡牌：將你儲備區中的1張卡牌轉移到網格中。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const eligible = s.grid.filter(n => n && cards[n] && (s.boost[n] || 0) < cards[n].cap);
          const target = egg || eligible[0] || 1441;
          s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
          a.text = '艦長調配資源，已在卡牌 ' + target + ' 上添加 1 點強化。';
          noteDecision('在卡牌 ' + target + ' 上添加 1 點強化。');
        } else if (index === 2) {
          a.text = '請從儲備區挑選卡牌轉入網格。';
          noteDecision('啟動艦長轉移儲備卡牌。');
        }
      }
    },

    1442: {
      id: 1442,
      name: '索倫，領航員 · 支付 1 強化選擇一項',
      actionName: '角色（異能）',
      title: '索倫，領航員（角色 1442）',
      hint: '消耗角色 1 點強化，選擇：獲得1點隨機技能、或將儲備卡牌轉入網格。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid[4] === id,
      text: '索倫，領航員演算星圖。已支付角色上的 1 點強化。請選擇一項：·獲得隨機技能：獲得1點隨機技能。·轉移儲備卡牌：將你儲備區中的1張卡牌轉移到網格中。',
      resolve: (s, a, index) => {
        if (index === 1) {
          creditReward({ kind: '隨機技能', delta: 1 }, a);
          a.text = '領航員感應環境，已獲得 1 點隨機技能。';
          noteDecision('獲得 1 點隨機技能。');
        } else if (index === 2) {
          a.text = '請從儲備區挑選卡牌轉入網格。';
          noteDecision('啟動領航員轉移儲備卡牌。');
        }
      }
    },

    // 載具 1013：海龜出租車
    1013: {
      id: 1013,
      name: '海龜出租車 · 乘坐前往相鄰地點',
      actionName: '乘坐海龜出租車',
      title: '海龜出租車（載具 1013）',
      hint: '消耗此卡 1 點強化，乘坐海龜出租車移動到一個相鄰的列出地點。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '', // 動態產生出口選項
      setupText: (s) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        if (!dests.length) return '當前地點沒有列出的出口目的地。';
        return '乘坐海龜出租車：選擇一個相鄰的出口地點前往。如果空了，失去此牌。請選擇一項：' +
          dests.map(d => '·前往地點 ' + d + '：海龜載著你渡水前往地點 ' + d + '。').join('');
      },
      resolve: (s, a, index) => {
        const dests = Object.values(cards[s.loc]?.exits || {}).filter(e => e.destination).map(e => e.destination);
        const dest = dests[index - 1];
        if (dest) {
          a.dest = dest;
          a.text = '你乘坐海龜出租車啟程，前往地點 ' + dest + '。點選完成後抵達。';
          noteDecision('乘坐海龜出租車前往地點 ' + dest + '。');
        }
      }
    },

    // 物品 1207：肥皂
    1207: {
      id: 1207,
      name: '肥皂 · 沐浴洗淨污垢（獲得 1 士氣）',
      actionName: '沐浴（異能）',
      title: '肥皂（物品 1207）',
      hint: '消耗此卡 1 點強化，沐浴洗淨污垢，獲得 1 點士氣。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '肥皂和水洗淨污垢。你的身心為之一振，獲得 1 點士氣。'
    },

    // 物品 1208：牙刷
    1208: {
      id: 1208,
      name: '牙刷 · 刷洗牙齒（獲得 1 士氣）',
      actionName: '刷洗（異能）',
      title: '牙刷（物品 1208）',
      hint: '消耗此卡 1 點強化，刷洗牙齒，獲得 1 點士氣。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '刷洗牙齒：你的口腔感覺好多了，周圍的人也更開心了。獲得 1 點士氣。'
    },

    // 物品 1217：肉
    1217: {
      id: 1217,
      name: '肉 · 食用一些肉（獲得 1 生命值）',
      actionName: '食用（異能）',
      title: '肉（物品 1217）',
      hint: '消耗此卡 1 點強化，食用一些肉，獲得 1 點生命值。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '食用一些肉：鮮美肉質為你補充體力。獲得 1 點生命值。'
    },

    // 物品 1224：果實
    1224: {
      id: 1224,
      name: '果實 · 食用一些果實（獲得 1 生命值）',
      actionName: '食用（異能）',
      title: '果實（物品 1224）',
      hint: '消耗此卡 1 點強化，食用一些果實，獲得 1 點生命值。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '食用一些果實：甘甜汁液滋養身體。獲得 1 點生命值。'
    },

    // 物品 1226：魚
    1226: {
      id: 1226,
      name: '魚 · 食用一些魚（獲得 1 生命值）',
      actionName: '食用（異能）',
      title: '魚（物品 1226）',
      hint: '消耗此卡 1 點強化，食用一些魚，獲得 1 點生命值。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '食用一些魚：豐富營養使你恢復元氣。獲得 1 點生命值。'
    },

    // 物品 865：解毒劑
    865: {
      id: 865,
      name: '解毒劑 · 刷新網格中所有挫折骰',
      actionName: '解毒（異能）',
      title: '解毒劑（物品 865）',
      hint: '消耗此卡 1 點強化，刷新你網格中所有的挫折骰槽。如果空了，失去此牌。',
      boostCost: 1,
      emptyLose: true,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '解毒劑發揮療效，清除了體內積累的毒素與挫折。已刷新網格中所有的挫折骰槽。',
      directEffect: (s, a) => {
        let cleared = 0;
        for (const [uid, die] of Object.entries(s.occupied)) {
          if (die === '挫折') {
            delete s.occupied[uid];
            cleared++;
          }
        }
        noteDecision('使用解毒劑，刷新了 ' + cleared + ' 個挫折骰槽。');
      }
    },

    // 魔法 897：動物圖騰
    897: {
      id: 897,
      name: '動物圖騰 · 支付 1 強化選擇一項',
      actionName: '圖騰（異能）',
      title: '動物圖騰（物品 897）',
      hint: '消耗此卡 1 點強化，選擇：在一隻動物上獲得強化、或使動物互動費用減少 1 點。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && (s.grid.includes(id) || s.reserve.includes(id)),
      text: '動物圖騰散發自然靈光。已支付此卡上的 1 點強化。請選擇一項：·在動物牌上獲得強化：在一張動物牌上獲得1點強化。·減免互動費用：將下一次與動物互動的費用減少1點。',
      resolve: (s, a, index, egg) => {
        if (index === 1) {
          const animals = s.grid.filter(n => cards[n]?.home === 'animal');
          const target = egg || animals[0];
          if (target && cards[target]) {
            s.boost[target] = Math.min(cards[target].cap, (s.boost[target] || 0) + 1);
            a.text = '圖騰靈光籠罩，已在動物卡牌 ' + target + ' 上添加 1 點強化。';
            noteDecision('在動物牌 ' + target + ' 上添加 1 點強化。');
          } else {
            a.text = '網格中目前沒有動物牌可接受強化。';
          }
        } else if (index === 2) {
          s.nextDiscount = (s.nextDiscount || 0) + 1;
          a.text = '圖騰庇佑，下一次與動物互動的費用減少 1 點。';
          noteDecision('動物互動費用減少 1 點。');
        }
      }
    },

    // 法術 1376：記憶控制術
    1376: {
      id: 1376,
      name: '記憶控制術 · 支付 1 強化選擇一項',
      actionName: '法術（異能）',
      title: '記憶控制術（法術 1376）',
      hint: '消耗此卡 1 點強化，選擇：失去1個詛咒、角色獲得1點強化、或智慧生物獲得1點強化。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '記憶控制術逆轉心靈。已支付此卡上的 1 點強化。請選擇一項：·解除詛咒：失去1個詛咒。·角色獲得強化：在你的角色上獲得1點強化。·智慧生物獲得強化：在一名智慧生物上獲得1點強化。',
      resolve: (s, a, index) => {
        if (index === 1) {
          const curses = [...s.grid, ...s.reserve, ...s.supply].filter(n => n >= 1385 && n <= 1396);
          if (curses.length) {
            discardFedCard(curses[0]);
            a.text = '記憶法術抹去了詛咒印記，已解除詛咒 ' + curses[0] + '。';
            noteDecision('解除詛咒 ' + curses[0] + '。');
          } else {
            a.text = '目前沒有需要解除的詛咒。';
          }
        } else if (index === 2) {
          const hero = s.grid[4];
          if (hero && cards[hero]) {
            s.boost[hero] = Math.min(cards[hero].cap, (s.boost[hero] || 0) + 1);
            a.text = '心靈能量湧入，角色上獲得 1 點強化。';
            noteDecision('角色上獲得 1 點強化。');
          }
        } else if (index === 3) {
          const sents = s.grid.filter(n => cards[n]?.home === 'sentient' && n !== 1376);
          if (sents.length) {
            s.boost[sents[0]] = Math.min(cards[sents[0]].cap, (s.boost[sents[0]] || 0) + 1);
            a.text = '已在智慧生物 ' + sents[0] + ' 上添加 1 點強化。';
            noteDecision('智慧生物 ' + sents[0] + ' 獲得 1 點強化。');
          } else {
            a.text = '網格中沒有其他智慧生物。';
          }
        }
      }
    },

    // 法術 1383：控火術
    1383: {
      id: 1383,
      name: '控火術 · 支付 1 強化選擇一項',
      actionName: '法術（異能）',
      title: '控火術（法術 1383）',
      hint: '消耗此卡 1 點強化，選擇：忽略1點寒冷傷害、在一個蛋上添加強化、或壓制費用減少1點。',
      boostCost: 1,
      emptyLose: false,
      condition: (s, id) => (s.boost[id] || 0) >= 1 && s.grid.includes(id),
      text: '控火術操控熾烈元素。已支付此卡上的 1 點強化。請選擇一項：·忽略1點寒冷傷害：抵達時忽略1點寒冷傷害。·在蛋上添加強化：在一個蛋上添加1點強化。·減少壓制費用：將一個壓制行動的費用減少1點。',
      resolve: (s, a, index) => {
        if (index === 1) {
          s.ignoreColdOnArrival = true;
          a.text = '烈焰環繞，本回合抵達時忽略 1 點寒冷傷害。';
          noteDecision('抵達時忽略 1 點寒冷傷害。');
        } else if (index === 2) {
          const eggs = typeof ownedEggs === 'function' ? ownedEggs() : [];
          if (eggs.length) {
            s.boost[eggs[0]] = Math.min(cards[eggs[0]].cap, (s.boost[eggs[0]] || 0) + 1);
            a.text = '火焰溫暖了蛋，已在蛋 ' + eggs[0] + ' 上添加 1 點強化。';
            noteDecision('在蛋 ' + eggs[0] + ' 上添加 1 點強化。');
          } else {
            a.text = '目前沒有蛋牌可接受強化。';
          }
        } else if (index === 3) {
          s.nextDiscount = (s.nextDiscount || 0) + 1;
          a.text = '下一個壓制行動的費用減少 1 點。';
          noteDecision('壓制行動費用減少 1 點。');
        }
      }
    }
  };

  function getCardActiveAbility(id) {
    return cardActiveAbilities[id] || null;
  }

  function isCardAbilityEligible(id, ability) {
    if (!ability) return false;
    if (typeof ability.condition === 'function') {
      return ability.condition(s, id);
    }
    return (s.boost[id] || 0) >= (ability.boostCost || 1);
  }

  function executeCardAbility(a) {
    const ability = a.ability;
    if (!ability) return;

    // 扣除強化費用
    const cost = ability.boostCost || 1;
    s.boost[a.id] = Math.max(0, (s.boost[a.id] || 0) - cost);

    // 檢查是否空了失去此牌
    let willLose = false;
    if (ability.emptyLose && (s.boost[a.id] || 0) <= 0) {
      willLose = true;
    }

    let initialText = typeof ability.setupText === 'function' ? ability.setupText(s) : ability.text;
    if (willLose) {
      a.emptyLostCard = a.id;
    }

    s.a = {
      ...a,
      cost: null,
      title: ability.title || a.name,
      text: initialText,
      dice: [],
      isCardAbility: true,
      ability
    };

    // 若非分支選擇異能（如食用/沐浴/解毒等直接生效異能），立即結算卡牌移除
    if (!ability.resolve) {
      if (typeof ability.directEffect === 'function') {
        ability.directEffect(s, s.a);
      }
      if (willLose) {
        discardFedCard(a.id);
        s.a.text += ' 卡牌上的強化已耗盡，依卡面說明已失去此牌。';
        noteDecision('卡牌 ' + a.id + ' 強化已空，失去此牌。');
        delete s.a.emptyLostCard;
      }
    }

    s.phase = 'result';
    noteDecision('啟動卡牌 ' + a.id + ' 異能：' + (a.name || '支付強化結算'));
    save();
  }

  function resolveCardAbilityBranch(a, index, egg) {
    const ability = a.ability || getCardActiveAbility(a.id);
    if (!ability || typeof ability.resolve !== 'function') return;

    ability.resolve(s, a, index, egg);
    a.choice = index;

    if (a.emptyLostCard) {
      discardFedCard(a.emptyLostCard);
      a.text += ' 卡牌 ' + a.emptyLostCard + ' 上的強化已耗盡，依卡面說明已失去此牌。';
      noteDecision('卡牌 ' + a.emptyLostCard + ' 強化已空，失去此牌。');
      delete a.emptyLostCard;
    }

    save();
  }

  // 匯出到全域
  root.cardActiveAbilities = cardActiveAbilities;
  root.getCardActiveAbility = getCardActiveAbility;
  root.isCardAbilityEligible = isCardAbilityEligible;
  root.executeCardAbility = executeCardAbility;
  root.resolveCardAbilityBranch = resolveCardAbilityBranch;

})(typeof window !== 'undefined' ? window : global);
