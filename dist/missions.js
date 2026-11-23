// The printed goals use a base quantity plus one increment per player.
// These quantities are the resulting requirements for a solo game.
const missionBriefs={
 1577:['以戲劇性的方式拯救世界','徹底擊殺一個元素體。',1603],
 1578:['發現這顆星球生命的起源','在行動結果中找到「生命的起源」這句話。',1608],
 1579:['發揮自己的全部潛能','取得自己角色的替代版本，並填滿該角色牌上的強化。'],
 1580:['收集植物樣本','在網格及儲備區合計持有至少 2 株植物。'],
 1581:['尋找治癒困擾你世界的枯萎病的解藥','在網格或儲備區持有解毒劑牌。',1604],
 1582:['召集一群智慧生物','在網格及儲備區合計持有至少 2 名智慧生物。'],
 1583:['積累無價的收藏品','網格與儲備區內的卡牌價值合計達到 30 或以上。'],
 1584:['收集一批動物','在網格及儲備區合計持有至少 2 隻忠誠的動物。'],
 1585:['繪製這顆未知星球的地圖','依故事指示參閱《萬境之書》至少 2 個不同的頁面。在使命牌上放置標記，記錄進度。'],
 1586:['傳播友好和慈善','完成至少 1 項任務。'],
 1587:['獲得巨大的財富','累積至少 15 錢幣。'],
 1588:['追求個人成長','在網格或儲備區持有已完成的最終個人目標。'],
 1589:['釣捕海怪','在網格或儲備區持有海怪屍體。',1606],
 1590:['擺脫困擾自己的過去','切斷引導你來到這顆星球的信號。',1600],
 1591:['建立新的定居點','擁有至少 1 座庇護所。'],
 1592:['征服一整座城市','抵達城市地點後，可執行使命牌上的「征服某座城市的一部分」行動。這是費用 9 的壓制行動，依《壓制》條目 1592 記錄進度。',0],
 1593:['建立外交關係','在網格或儲備區持有至少 1 個陣營徽章，或在行動結果中找到「外交關係」這句話。'],
 1594:['開發星球的自然資源','在網格及儲備區合計持有至少 2 塊不同顏色的水晶。'],
 1595:['解放自己的家園','在網格及儲備區合計持有至少 4 張符合條件的卡牌：牌上有壓制挑戰骰槽（通用或效果），或有「壓制之前」效果。'],
 1596:['幫助旅行者','在行動結果中找到「你是我唯一的希望」這句話，藉此找到並營救旅行者。',0],
 1597:['進行最後一場劫案','在網格或儲備區持有一件價值至少 15 的物品。']
};
function missionBrief(id,preview=false){
 const [name,goal,next]=missionBriefs[id];
 const after=next===undefined?'達成後，依《秘密之書》條目 '+id+' 結算。':next?'達成後可選擇使命勝利，或取得命運 '+next+' 並繼續探索。':'';
 return '<section class="missionBrief"><small>'+(preview?'本次擲出的使命':'你的使命')+'　'+id+'</small><h3>'+esc(name)+'</h3>'+art(id)+'<h4>單人目標</h4><p>'+esc(!preview&&s?.simplerMission===id?s.simplerGoal:goal)+'</p>'+(after?'<p>'+esc(after)+'</p>':'')+'</section>'
}
function showMission(){show(missionBrief(s.mission))}
function simplerMissionAction(){
 const id=s.mission,event='story:move:'+id+':01';
 if(!missionBriefs[id]||s.missionDone||s.simplerMission===id||s.once.includes(event)||!stories[event])return null;
 return {id,kind:'卡牌',key:event,name:'轉變使命',event,book:'move'}
}
function resolveMissionChange(a){
 if(a.book==='help'&&a.id===1579&&a.event?.startsWith('story:help:1579:')&&!a.trainingOptions){
  const owned=[...new Set([...s.grid,...s.reserve,...s.supply])].filter(n=>n>=1454&&n<=1459);
  a.trainingOptions=owned.flatMap(id=>[1,2].filter(n=>n+(s.boost[id]||0)<=cards[id].cap).map(n=>({id,n})));
  const intro=a.text.split('如果你擁有')[0];
  if(!owned.length)a.text=intro+'你尚未擁有經驗牌。獲得2點查看。';
  else if(!a.trainingOptions.length)a.text=intro+'經驗牌的強化已滿。';
  else if(a.trainingOptions.length===1){
   const {id,n}=a.trainingOptions[0];s.boost[id]=(s.boost[id]||0)+n;
   a.text=intro+'經驗牌 '+id+' 已增加 '+n+' 點強化。'
  }else a.text=intro+'選擇一項：'+a.trainingOptions.map(({id,n})=>'·在經驗牌 '+id+' 添加 '+n+' 點強化：經驗牌 '+id+' 增加 '+n+' 點強化。').join('')
 }
 if(a.event==='story:help:1588:01'){
  a.missionSkills=skills.slice();a.missionSkillAmount=2
 }
 if(a.event==='story:help:1582:01')a.text=a.text.replace('：獲得是$5','。獲得$5');
 if(a.event==='story:look:1579:01'&&a.text===stories[a.event][1]){
  const mastery=stories['story:look:'+(1435+s.hero)+':01'];
  a.text=a.text.split('選擇一名玩家')[0]+'你的角色獲得「掌握」的結果。'+mastery[1]
 }
 if(a.event==='story:look:1588:01'&&a.choice==null&&a.text===stories[a.event][1]){
  const item=1299+s.hero,owned=[...s.grid,...s.reserve,...s.supply].includes(item);
  a.text=a.text.split('獲得該物品')[0]+(owned?'你已持有自己的個人物品。選一種技能，獲得2點。':'獲得物品'+item+'。');
  if(owned){a.missionSkills=skills.slice();a.missionSkillAmount=2}
 }
 if(a.id!==s.mission||a.event!=='story:move:'+s.mission+':01'||a.missionChanged)return;
 a.missionChanged=true;
 const text=a.text.replace(/\s/g,''),gate=text.match(/如果你位於地點(\d{3})(?:或(\d{3}))?/);
 if(gate&&[gate[1],gate[2]].filter(Boolean).some(v=>Number(v)===s.loc)){
  const row=stories['story:secrets:'+a.id+':01'];
  a.text=row[1];a.secretEntry=a.id;
  if(a.id===1577){
   const old=s.grid[4],armor=1447+s.hero;
   if(old!==armor){s.boost[armor]=Math.min(cards[armor].cap,s.boost[old]||0);delete s.boost[old];for(const q of cards[old].slots)delete s.occupied[q.uid];s.grid[4]=armor}
  }else if(a.id===1589){
   a.text='選擇一件其他角色的裝備。選擇一項：'+['艦長的軍刀','領航員的雙筒望遠鏡','學者的筆記本','醫務官的急救包','工程師的多功能工具','陸戰隊員的斧頭'].map((name,i)=>i===s.hero?'':'·'+name+'：獲得物品'+(1299+i)+'。').join('')
  }else if(a.id===1590){
   a.text='選擇一名未使用的角色加入儲備區。選擇一項：'+roleNames.map((name,i)=>i===s.hero||[...s.grid,...s.reserve].includes(1435+i)?'':'·'+name+'：將角色牌 '+(1435+i)+' 加入儲備區。').join('')
  }
  return
 }
 const start=text.indexOf('作為原目標的替代');
 const goal=a.id===1578?'進入創始者神殿內部（地點 589）。':start>=0?text.slice(start).split('。')[0].replace(/^作為原目標的替代，/,'')+'。':'';
 if(!goal)return;
 s.simplerMission=a.id;s.simplerGoal=goal;a.text=goal;
 const reward=text.match(/獲得1點(移動|查看|接觸|幫助|獲取|壓制)(?:或1點(移動|查看|接觸|幫助|獲取|壓制))?/);
 if(reward&&reward[2])a.missionSkills=[reward[1],reward[2]];
 else if(reward)a.text+='獲得1點'+reward[1]+'。';
 else if(/獲得1點(?:任意)?技能/.test(text))a.missionSkills=skills.slice();
 if(a.missionSkills)a.text+='選擇獲得 1 點'+a.missionSkills.join('或')+'。';
 if(a.id===1592)s.markers[1592]=Math.max(2,s.markers[1592]||0)
}
function pastLocationAction(j){
 if(j.kind)return j.kind==='地點';
 // Older journals predate the source fields. Match an action printed at the recorded place.
 return cards[j.loc]?.actions.some(a=>a.action===j.action&&stories[a.event_uid]?.[5]===j.title)
}
function interactedWith(j,who){
 const title=(j.title||'').replace(/\s/g,'');
 if(who==='智慧生物'&&j.kind==='卡牌'&&cards[j.sourceCard]?.home==='sentient')return true;
 if(!pastLocationAction(j))return false;
 const at=title.indexOf(who);if(at<0)return false;
 // Topics and destinations merely mentioned after the actual interaction target do not count.
 return !/關於|有關|前往|遠處的|尋找線索/.test(title.slice(0,at))
}
function finishedPersonalGoal(){
 const done=n=>n>=1609&&n<=1626;
 return (s.journal||[]).some(j=>(j.readEntries||[]).some(id=>id.startsWith('secrets:')&&done(+id.slice(8))))||
  [...s.grid,...s.reserve].some(n=>n>=1615&&n<=1626)
}
function simplerGoalMet(owned){
 const log=s.journal||[],held=f=>owned.some(n=>f(cards[n],n)),count=f=>owned.filter(n=>f(cards[n],n)).length;
 const locations=word=>new Set(log.filter(j=>interactedWith(j,word)).map(j=>j.loc));
 switch(s.mission){
 case 1577:return log.some(j=>pastLocationAction(j)&&locationCaptions[j.loc]?.includes('元素體'));
 case 1578:return s.loc===589||Object.hasOwn(s.visits||{},589);
 case 1579:return s.grid[4]>=1441&&s.grid[4]<=1452&&(s.grid[4]-1435)%6===s.hero;
 case 1580:return held(c=>c.home==='flora');
 case 1581:return held(c=>c.home==='item'&&c.name.includes('藥物'));
 case 1582:return held(c=>c.home==='sentient');
 case 1583:return owned.reduce((sum,n)=>sum+(ruleFacts.value[n]||0),0)>20;
 case 1584:return count(c=>c.home==='animal')>=2;
 case 1585:return !!s.atlasPages?.length;
 case 1586:return [...s.supply,...log.flatMap(j=>j.cardIds||[])].some(n=>n>=1627&&n<=1686&&cards[n]?.orientation==='landscape'&&cards[n]?.home==='other');
 case 1587:return s.money>=10;
 case 1588:return finishedPersonalGoal();
 case 1589:return log.some(j=>j.action==='捕魚'&&j.cardIds?.some(n=>n!==1705));
 case 1590:return log.some(j=>/破解|劈砍/.test(j.action)&&j.title.includes('高塔'));
 case 1591:return s.supply.some(n=>cards[n].home==='structure');
 case 1592:return Object.values(s.conquests||{}).some(n=>n>=1);
 case 1593:return new Set(log.filter(j=>interactedWith(j,'智慧生物')&&!j.cardIds?.some(n=>n>=1385&&n<=1396)).map(j=>j.kind==='卡牌'?'card'+j.sourceCard:'location'+j.loc)).size>=2;
 case 1594:return held(c=>c.name.includes('水晶'));
 case 1595:return count((c,n)=>c.slots.some(q=>q.action==='壓制')||ruleFacts.beforeOverpower.includes(n))>=3;
 case 1596:return locations('旅行者').size>=2;
 case 1597:return held((c,n)=>c.home==='item'&&ruleFacts.value[n]>=10);
 }
}
