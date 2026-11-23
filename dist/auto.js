'use strict';
// 自動結算：原本需要玩家手動處理的規則簿記（環境傷害、陷阱扣技能、儲備超量、放置挑戰骰、開局確認）。
const heatGuards=[965,966,967,984,1453],oxygenGuards=[964,984,1013,1447,1448,1449,1450,1451,1452],coldGuards=[984];
function autoDamageLife(){const [t,m,h]=s.stats;return Math.min(t,m,h-1)>=Math.min(t-1,m-1,h)}
function autoTakeDamage(type,source){
 const life=autoDamageLife();
 if(life)stat(2,-1);else{stat(0,-1);stat(1,-1)}
 if(type==='缺氧')s.lastOxygenDamageTurn=s.turn;
 const msg=type+'傷害：'+(life?'失去1點生命':'失去1點時間與1點士氣')+'（自動結算）';
 noteDecision(msg);return msg
}
function arrivalHazards(caption){
 for(const m of caption.matchAll(/受到\s*(\d)\s*點(高溫|寒冷|缺氧)傷害/g)){
  const type=m[2],n=+m[1];
  if(type==='寒冷'&&s.ignoreColdOnArrival)continue;
  const list=type==='高溫'?heatGuards:type==='缺氧'?oxygenGuards:coldGuards,guard=s.grid.find(id=>list.includes(id));
  if(guard){noteDecision('卡牌 '+guard+' 忽略了抵達時的'+type+'傷害。');continue}
  for(let i=0;i<n;i++){
   s.pendingHazards??=[];
   s.pendingHazards.push({type,source:'抵達地點'});
  }
 }
 for(const m of caption.matchAll(/失去\s*(\d)\s*點生命/g)){
  const n=+m[1];
  for(let i=0;i<n&&!s.stats.includes(0);i++){stat(2,-1);noteDecision('抵達效果：失去1點生命')}
 }
 delete s.ignoreColdOnArrival
}
function chooseHazardDamage(life){
 if(!s||!s.pendingHazards?.length)return;
 const h=s.pendingHazards.shift();
 const type=h.type;
 if(life){
  stat(2,-1);
  if(type==='缺氧')s.lastOxygenDamageTurn=s.turn;
  noteDecision(type+'傷害：選擇失去1點生命');
 }else{
  stat(0,-1);
  stat(1,-1);
  if(type==='缺氧')s.lastOxygenDamageTurn=s.turn;
  noteDecision(type+'傷害：選擇失去1點時間與1點士氣');
 }
 save();
 render();
}
const magicLessonSpells={1419:1236,1420:1373,1421:1382,1422:1378,1423:1370,1424:1237,1425:1372,1426:1374,1427:1384,1428:1369,1429:1238,1430:1376,1431:1366,1432:1365,1433:1381};
function grantLessonSpell(id,uid){
 const spell=magicLessonSpells[id];
 if(spell&&uid==='slot:'+id+':01'){
  creditReward({card:spell,type:'法術',label:'獲得法術'+spell},s.a);
  noteDecision('課程 '+id+' 骰槽效果：獲得法術 '+spell+'。')
 }
}
let autoBusy=false;
function autoResolve(){
 if(!s||autoBusy)return;autoBusy=true;
 try{
  // 開局：成對技能骰直接接受，不需確認。
  if(s.phase==='mission')confirmMissionAuto();
  if(s.phase==='crash')landAuto();
  // 儲備超出容量：失去價值最低的儲備牌。
  while(s.phase==='ready'&&s.reserve?.length&&reserveSize()>reserveLimit()){
   const curse=n=>n>=1385&&n<=1396,pool=s.reserve.filter(n=>!curse(n));if(!pool.length)break;
   const v=n=>ruleFacts.value[n]??0,n=[...pool].sort((a,b)=>v(a)-v(b))[0];
   s.reserve.splice(s.reserve.indexOf(n),1);delete s.boost[n];delete s.markers[n];
   for(const q of cards[n].slots)delete s.occupied[q.uid];
   tripEvent('儲備超出容量','自動失去價值最低的卡牌 '+n+'。')
  }
  const a=s.a;
  // 結果階段的傷害與陷阱。
  if(s.phase==='result'&&a?.chest?.hazard&&!s.stats.includes(0)){
   const type=a.chest.hazard;
   const skin=type==='高溫'&&[857,858].find(n=>s.grid.includes(n)&&s.boost[n]>0);
   if(skin){s.boost[skin]--;const msg='水袋 '+skin+' 消耗1點強化，忽略高溫傷害';noteDecision(msg);delete a.chest.hazard;(a.receipts??={}).hazard=msg}
  }
  if(s.phase==='result'&&a?.chest?.loseSkill){
   const i=s.skill.indexOf(Math.max(...s.skill));delete a.chest.loseSkill;
   if(s.skill[i]>0){s.skill[i]--;const msg='陷阱自動扣除1點'+skills[i];(a.receipts??={}).trap=msg;noteDecision(msg)}
  }
 }finally{autoBusy=false}
}
function confirmMissionAuto(){s.mission=mission[pairKey(s.pair)];tripEvent('接收使命',missionBriefs[s.mission][0]+'。'+missionBriefs[s.mission][1]);s.pair.forEach(i=>s.skill[i]++);s.phase='escape'}
function landAuto(){s.pair.forEach(i=>s.skill[i]++);travel(crashRows[s.pod][Object.keys(mission).indexOf(pairKey(s.pair))]);s.phase='ready'}
