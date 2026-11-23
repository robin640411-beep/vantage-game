'use strict';
const {cards,stories,mission}=WORLD, keys=['move','look','engage','help','take','overpower'], skills=['移動','查看','接觸','幫助','獲取','壓制'], directions={north:'北',east:'東',south:'南',west:'西'}, faces=['空白','空白','生命','挫折','士氣','時間'], statNames=['時間','士氣','生命'], crashRows=[[761,691,770,683,694,780,787,387,385,709,301,676,667,664,680,705,316,351,773,668,305],[126,308,357,725,374,405,115,471,140,354,146,722,112,148,411,137,359,314,408,136,106],[426,476,134,631,479,734,144,433,362,456,449,751,452,364,366,368,119,428,737,755,739],[601,221,346,622,194,777,228,249,192,349,400,397,237,225,180,183,205,402,177,784,245],[613,223,610,501,267,258,203,417,423,153,123,212,270,482,414,629,419,150,172,496,163],[298,297,269,747,759,278,508,338,469,464,460,506,437,444,275,286,336,334,288,441,447]];
const slotKey='wanjing.solo.1', rng=n=>Math.floor(Math.random()*n), pad=n=>String(n).padStart(3,'0'), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])), opt=(v,t)=>'<option value="'+esc(v)+'">'+esc(t)+'</option>', btn=(t,fn,primary=false)=>'<button '+(primary?'class="primary" ':'')+'onclick="'+esc(fn)+'">'+esc(t)+'</button>', select=(id,opts)=>'<select id="'+id+'">'+opts+'</select>', val=id=>document.getElementById(id).value;
var s=null;try{s=JSON.parse(localStorage.getItem(slotKey))}catch{};if(s){syncCardMarkersState()};let available=[],tab='探險',notice='';
function syncCardMarkersState(){
 if(!s)return;
 s.markers??={};s.boost??={};s.fates??=[];s.reserve??=[];s.supply??=[];
 if(s.mission===1585&&s.atlasPages?.length)s.markers[1585]=Math.min(2,s.atlasPages.length);
 if(s.duelWins!=null&&s.duelWins>0)s.markers[1603]=Math.max(s.markers[1603]||0,s.duelWins);
 const activeTasks=[...(s.supply||[]),...(s.grid||[]),...(s.reserve||[])];
 if(activeTasks.includes(1635)&&s.markers[1635]==null)s.markers[1635]=8;
 if(activeTasks.includes(1638)&&s.markers[1638]==null)s.markers[1638]=4;
 if(activeTasks.includes(1643)&&s.markers[1643]==null)s.markers[1643]=5;
}
function handleTurnAdvance(){
 if(!s)return;
 const activeTasks=[...(s.supply||[]),...(s.grid||[]),...(s.reserve||[])];
 if(activeTasks.includes(1635)&&(s.markers?.[1635]||0)>0){
  s.markers[1635]--;
  noteDecision('任務 1635 回合開始移除 1 個倒數標記（剩餘 '+s.markers[1635]+' 個）。');
  if(s.markers[1635]===0){
   s.supply=s.supply.filter(x=>x!==1635);
   s.grid=s.grid.map(x=>x===1635?0:x);
   noteDecision('任務 1635 倒數結束，失去此任務。');
  }
 }
 if(activeTasks.includes(1638)&&(s.markers?.[1638]||0)>0){
  s.markers[1638]--;
  noteDecision('任務 1638 回合開始移除 1 個遞送標記（剩餘 '+s.markers[1638]+' 個）。');
  if(s.markers[1638]===0){
   s.supply=s.supply.filter(x=>x!==1638);
   s.grid=s.grid.map(x=>x===1638?0:x);
   noteDecision('任務 1638 倒數結束，失去此任務。');
  }
 }
}
function save(){if(s){s.markers??={};s.boost??={}};restoreLegacyLavaPuzzle();settleRewards();fillAcquiredCards();autoResolve();checkObjectives();try{if(s)localStorage.setItem(slotKey,JSON.stringify(s));else localStorage.removeItem(slotKey)}catch{notice='此瀏覽器無法儲存進度。'}render()}
function pair(){return throwDice("s",2,"擲技能骰")}
function pairKey(p){let a=keys[p[0]],b=keys[p[1]];return a+'|'+b in mission?a+'|'+b:b+'|'+a}
function start(){if(s)return;let hero=+val('hero'),diff=+val('diff');s={phase:'mission',hero,turn:1,stats:[diff,diff,diff],skill:Array(6).fill(0),pair:pair(),grid:Array(9).fill(0),reserve:[],supply:[],boost:{},markers:{},occupied:{},penalty:0,money:0,log:[],used:[],once:[],fates:[],full:false};tripEvent('登上旅者號','選擇'+roleNames[hero]+'，初始時間、士氣與生命各 '+diff+' 點。');s.skill[hero]++;s.grid[4]=1435+hero;s.boost[1435+hero]=2;if(s.pair[0]!==s.pair[1])return confirmMission();save()}
function rerollSetup(){if(!['mission','crash'].includes(s.phase)||s.pair[0]!==s.pair[1])return;tripEvent('重擲技能骰',s.phase==='mission'?'選擇重新決定使命。':'選擇重新決定墜落航線。');s.pair=pair();if(s.pair[0]!==s.pair[1])return s.phase==='mission'?confirmMission():land();save()}
function confirmMission(){if(s.phase!=='mission')return;s.mission=mission[pairKey(s.pair)];tripEvent('接收使命',missionBriefs[s.mission][0]+'。'+missionBriefs[s.mission][1]);s.pair.forEach(i=>s.skill[i]++);s.phase='escape';save()}
function escapePod(){if(s.phase!=='escape')return;let i=+val('pod');s.pod=i;tripEvent('選擇逃生艙','搭乘'+skills[i]+'逃生艙。');s.skill[i]++;s.pair=pair();s.phase='crash';if(s.pair[0]!==s.pair[1])return land();save()}
function land(){if(s.phase!=='crash')return;s.pair.forEach(i=>s.skill[i]++);travel(crashRows[s.pod][Object.keys(mission).indexOf(pairKey(s.pair))]);s.phase='ready';save()}
function travel(n){if(s.loc===762&&+n!==762)delete s.promisedExit762;delete s.clearExit;s.visits??={};if(s.loc)s.visits[s.loc]=s.used;const fromLoc=s.loc;s.loc=+n;
 if(fromLoc&&fromLoc!==s.loc){
  (s.travelRoutes??=[]).push({from:fromLoc,to:s.loc,turn:s.turn});
  const activeTasks=[...(s.supply||[]),...(s.grid||[]),...(s.reserve||[])];
  if(activeTasks.includes(1643)&&!s.visits[n]&&(s.markers?.[1643]||0)>0){
   s.markers[1643]--;
   noteDecision('任務 1643 抵達新地點，移除 1 個冒險標記（剩餘 '+s.markers[1643]+' 個）。');
  }
 }
 s.used=s.visits[n]??[];s.extra=false;
 let caption=locationCaptions[n]||'';
 if(s.ignoreOxygenOnArrival){
  caption=caption.replace(/受到\s*1\s*點缺氧傷害。/,'此次抵達免受缺氧傷害。');
  delete s.ignoreOxygenOnArrival
 }
 tripEvent('抵達地點 '+pad(n),caption);s.log.push('抵達地點 '+pad(n));arrivalHazards(caption)}
function art(n){if(n===1)return '<img class="art" src="books/07_016.webp" alt="地點 001" onclick="pageView(7,16)">';return '<img class="art" alt="卡牌 '+n+'" src="cards/'+Number(n)+'.webp" onclick="card('+Number(n)+')">'}
function show(html){detail.innerHTML=html;if(!viewer.open)viewer.showModal()}
function card(n){
 if(!cards[n])return;
 n=Number(n);
 const c=cards[n];
 const mark=s?.markers?.[n]||0,boost=s?.boost?.[n]||0;
 const info=typeof markerCardLimits!=='undefined'?markerCardLimits[n]:null;
 const isTracked=info&&s&&([...(s.fates||[]),...(s.supply||[]),...(s.grid||[]),...(s.reserve||[])].includes(n)||s.mission===n);
 let markerSection='';
 if(mark>0||isTracked){
  const maxGoal=info?.target||info?.max;
  markerSection='<div class="cardStatusSection" style="margin:10px 0;padding:10px;background:#fff8ee;border:1px solid #d97843;border-radius:8px;">'+
   '<h3 style="margin:0 0 6px;color:#8b3a1a;font-size:1rem;">🎯 '+(info?.label||'標記狀態')+'</h3>'+
   '<p style="margin:0;font-size:0.95rem;">目前已放置 <b>'+mark+'</b> 個標記'+(info?'（目標共 <b>'+maxGoal+'</b> 個）':'')+'。'+
   (info&&mark>=maxGoal?' <b style="color:#206552">（目標已達成！）</b>':'')+'</p></div>';
 }
 let boostSection='';
 if(boost>0||c.cap>0){
  boostSection='<div class="cardStatusSection" style="margin:10px 0;padding:10px;background:#eef7f2;border:1px solid #539d7c;border-radius:8px;">'+
   '<h3 style="margin:0 0 6px;color:#18523e;font-size:1rem;">⚡ 強化狀態</h3>'+
   '<p style="margin:0;font-size:0.95rem;">目前已放置 <b>'+boost+'</b> 個強化方塊'+(c.cap?'（槽位共 <b>'+c.cap+'</b> 個）':'')+'。'+
   (c.cap&&boost>=c.cap?' <b style="color:#206552">（強化槽已滿）</b>':'')+'</p></div>';
 }
 const slotsInfo=(c.slots||[]).map((q,i)=>{
  const occupied=s?.occupied?.[q.uid];
  const type=q.type==='terrain_specific'?'地形相符':q.type==='element_specific'?'成分相符':q.action?'限「'+q.action+'」行動':q.result?({time:'時間',morale:'士氣',health:'生命',setback:'挫折'}[q.result]+'骰專用'):'一般骰槽';
  const reward=q.boost_reward?'（得 '+q.boost_reward+' 強化）':'';
  const cost=q.boost_cost?'（需消耗 '+q.boost_cost+' 強化）':'';
  const status=occupied?'<b style="color:#206552">'+faceImg('c',mapFace(occupied))+' 目前已放入「'+occupied+'」骰</b>':'<span style="color:#887755">○ 空位（可用）</span>';
  return '<li><b>骰槽 '+(i+1)+'</b>【'+type+'】'+reward+cost+' ➔ '+status+'</li>';
 }).join('');
 let extraActions='';
 if(typeof MAP_CARD_INFO!=='undefined'&&MAP_CARD_INFO[n]){
  const info=MAP_CARD_INFO[n];
  const inGrid=s?.grid?.includes(n);
  const b=s?.boost?.[n]||0;
  extraActions='<div class="cardModalActions" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">'+
    btn('📖 立即查閱《萬境之書》第 '+info.page+' 頁（'+info.name+'）','cardZoom.close();pageView(9,'+info.page+')',true)+
    (inGrid&&b>=1?btn('支付 1 強化並查閱《萬境之書》第 '+info.page+' 頁（現有 '+b+' 強化）','cardZoom.close();useMapCard('+n+',1)'):'')+
    (inGrid&&b>=2?btn('支付 2 強化獲得 1 點時間（現有 '+b+' 強化）','cardZoom.close();useMapCard('+n+',2)'):'')+
    '</div>';
 }
 const markersHtml=typeof cardMarkers==='function'?cardMarkers(n):'';
 zoomBody.innerHTML='<div class="cardMediaWrap" style="position:relative;display:inline-block;max-width:100%;margin-bottom:8px;">'+
  '<img src="cards/'+Number(n)+'.webp" alt="卡牌 '+n+'">'+
  markersHtml+
  '</div>'+
  markerSection+boostSection+
  '<p>'+esc(cardSummary(n))+'</p>'+
  (slotsInfo?'<h3>卡牌骰槽狀態</h3><ul class="cardSlotDetailList">'+slotsInfo+'</ul>':'')+
  extraActions;
 if(!cardZoom.open)cardZoom.showModal()
}
function home(){return '<div class="hero"><div><small>單人開放世界探險</small><h1>萬境奇旅</h1><p>旅者號抵達軌道。你的逃生艙將落向何方？</p></div></div><section class="panel"><h2>登上旅者號</h2><label>角色 '+previewSelect('hero',['朱爾斯','索倫','埃米利安','艾拉','愛麗兒','蒂娜'].map((n,i)=>opt(i,n+' · '+skills[i])).join(''),1435,'所選角色')+'</label>'+selectorPreview('preview-hero',1435,'所選角色')+'<label>初始屬性 '+select('diff',[4,5,6,3].map((v,i)=>opt(v,['無畏','務實','謹慎','莽撞'][i]+' · '+v)).join(''))+'</label>'+btn('開始探險','start()',true)+'</section>'}
function setup(){let p=s.phase;return '<div class="panel"><small>旅者號　／　開局</small><h2>'+({mission:'接收使命訊號',escape:'已接收使命',crash:'確認墜落航線'})[p]+'</h2>'+(p==='escape'?missionBrief(s.mission)+'<h3>選擇逃生艙</h3>選擇一項技能並獲得 1 點，搭乘對應的逃生艙。'+previewSelect('pod',skills.map((v,i)=>opt(i,v)).join(''),2,'所選逃生艙')+selectorPreview('preview-pod',2,'所選逃生艙')+btn('進入逃生艙','escapePod()',true):'<p>技能骰　'+s.pair.map(i=>tokenArt('skill-'+i)+skills[i]).join(' ＋ ')+'</p>'+(p==='mission'?missionBrief(mission[pairKey(s.pair)],true):flowCard(s.pod+2,'墜落航線'))+(s.pair[0]===s.pair[1]?btn('重擲這一對','rerollSetup()'):'')+btn(p==='mission'?'接受使命':'降落並開始第一回合',p==='mission'?'confirmMission()':'land()',true))+'</div>'}
function pool(){return 10-s.penalty-Object.keys(s.occupied).length-(s.a?.dice?.length||0)}
function refresh(){s.occupied={};s.penalty=0}
function stat(i,d){if(d>0&&s.stats[i]===6)s.skill[throwDice('s',1,'屬性已滿 · 隨機技能')[0]]++;else s.stats[i]=Math.max(0,Math.min(6,s.stats[i]+d))}
const compass={N:'北',S:'南',W:'西',E:'東',NE:'東北',SE:'東南',NW:'西北',SW:'西南','N/NW':'北或西北'};
const departures={};for(const [key,row] of Object.entries(stories)){if(key.startsWith('story:depart:'))(departures[row[0]]??={})[key]=row}
function actions(){if(s.rescueArrived)return rescueActions();let list=[];function add(id,kind){for(const a of cards[id]?.actions||[]){if(kind==='地點'&&a.action_uid!==s.practiceAction&&s.used.length&&!a.repeatable&&(!s.extra||s.used.includes(a.action_uid)))continue;if(id===1705||s.once.includes(a.action_uid)||!a.action||!actionEligible(id,a))continue;list.push({id,kind,key:a.action_uid,name:a.action||a.family||skills[keys.indexOf(a.book)],book:a.book,event:a.event_uid})}}
add(s.loc,'地點');for(const [dir,e] of Object.entries(cards[s.loc]?.exits||{})){if(e.destination&&e.cost!=null||e.event_uid&&stories[e.event_uid]?.[2]!=null)list.push({id:s.loc,kind:'離開',name:'向'+directions[dir]+'離開',book:'move',event:e.event_uid,dest:e.destination,cost:e.cost})}
for(const [event,row] of Object.entries(departures[s.loc]||{})){if(row[2]==null||!['NE','SE','NW','SW','N/NW'].includes(row[3])||list.some(x=>x.event===event))continue;list.push({id:s.loc,kind:'離開',name:'向'+(compass[row[3]]||row[3]||'特殊出口')+'離開',book:'move',event,cost:row[2]})}
if(s.loc===762&&s.promisedExit762)list=list.filter(a=>a.kind!=='離開'||a.event===cards[762].exits.west.event_uid||a.event===cards[762].exits.south.event_uid);
if(s.mission===1592&&cityLocations.has(s.loc)&&!s.missionDone)list.push({id:1592,kind:'卡牌',key:'conquest',name:'征服城市的一部分',book:'overpower',event:'story:overpower:1592:01'});
const change=simplerMissionAction();if(change)list.push(change);
for(const id of [...s.grid,...s.supply,s.mission,...s.fates].filter(Boolean))add(id,'卡牌');
if(typeof getCardActiveAbility==='function'){
 const abilityCards=[...new Set([...s.grid,...s.reserve,...s.supply])].filter(Boolean);
 for(const id of abilityCards){
  const ability=getCardActiveAbility(id);
  if(ability&&isCardAbilityEligible(id,ability)){
   list.push({id,kind:'卡牌',key:'card_ability:'+id,name:ability.name,book:'help',event:'card_ability:'+id,cost:null,isCardAbility:true,ability});
  }
 }
}
if(s.practiceAction&&!list.some(a=>a.name===s.practiceAction||a.key===s.practiceAction)){
 for(const [cId,card] of Object.entries(cards)){
  const act=(card.actions||[]).find(x=>x.action_uid===s.practiceAction||x.action===s.practiceAction);
  if(act&&actionEligible(Number(cId),act)){
   list.push({id:Number(cId),kind:card.home==='location'?'地點':'卡牌',key:act.action_uid,name:act.action||act.family||skills[keys.indexOf(act.book)],book:act.book,event:act.event_uid});
   break;
  }
 }
}
return s.practiceAction?list.filter(a=>a.name===s.practiceAction||a.key===s.practiceAction):s.extraBook?list.filter(a=>a.book===s.extraBook):list}
function choose(i){let a=actions()[i];if(!a||!activePlayer()||s.phase!=='ready'||s.unplaced?.length||reserveSize()>reserveLimit())return;delete s.pendingHazards;delete s.practiceAction;delete s.extraBook;delete s.turnActionExtra;if(a.isCardAbility&&typeof executeCardAbility==='function'){executeCardAbility(a);return;}let e=stories[a.event];s.a={...a,origin:s.loc,cost:e?.[2]??a.cost??null,title:e?.[5]||a.name,text:e?.[1]||(a.dest?'前往地點 '+pad(a.dest)+'。':'依卡面說明結算。'),dice:[]};if(s.nextDiscountTo1){s.a.cost=1;delete s.nextDiscountTo1}else if(s.nextDiscountHalf){s.a.cost=Math.ceil((Number.isInteger(s.a.cost)?s.a.cost:1)/2);delete s.nextDiscountHalf}else if(s.nextDiscount){s.a.discount=s.nextDiscount;delete s.nextDiscount}s.phase='cost';if(a.kind==='地點')s.used.push(a.key);if(a.name==='轉變使命'||/每場遊戲最多|每局.*一次/.test(s.a.title))s.once.push(a.key);s.extra=false;save()}
const coinDiscountEvents=new Set(Object.entries(stories).filter(([,row])=>{
 const instruction=(row[5]+row[1].slice(0,95)).replace(/\s/g,'');
 return /你可以支付(?:當[給結]?地智慧生物)?[$＄]X來(?:減少此費用X點|使此費用減少X點)/.test(instruction)
}).map(([event])=>event));
function canPayCoins(a){return a.foundryPayment||coinDiscountEvents.has(a.event)}
function chosenCost(a,x){
 let base=a.cost;
 if((s.clearExit&&a.event===s.clearExit)||(a.event==='story:depart:0210:01'&&s.magnetSevered))base=1;
 if(base==='X'){base=x??Number(val('xcost'));if(!Number.isInteger(base)||base<1||base>6)return NaN}
 if(base==null)return NaN;
 const coins=canPayCoins(a)?Number(document.getElementById('foundryCoins')?.value||0):0;
 if(!Number.isInteger(coins)||coins<0||coins>Math.min(s.money,base))return NaN;
 return Math.max(0,Number(base)-(a.discount||0)-coins)
}
function paymentControls(a,cost,preferred=0){
 if(printedReplacementRecipes[a.event]&&(s.boost[printedReplacementRecipes[a.event].source]||0)<printedCraftBoost(a.event))return '<p>此行動還需支付此卡上的1點強化，目前不足。</p>';
 const k=keys.indexOf(a.book),name=skills[k],held=s.skill[k]||0;
 if(!Number.isInteger(cost))return '<p>此條目的費用尚未核實。</p>';
 const max=Math.min(cost,held),pay=Math.min(preferred,max),remaining=cost-pay;
 const choice=Array.from({length:max+1},(_,i)=>'<option value="'+i+'" '+(i===pay?'selected':'')+'>'+i+' 枚</option>').join('');
 return (printedCraftBoost(a.event)?'<p>另須支付此卡上的1點強化；擲骰時自動扣除。</p>':'')+(a.discount?'<p>上一個行動使本次費用減少 '+a.discount+' 點。</p>':'')+'<p><strong>起始挑戰骰　'+cost+' 顆</strong></p>'+
 (name?'<label>'+tokenArt('skill-'+k)+'使用'+name+'標記 <select id="pay" onchange="updatePayment()">'+choice+'</select></label><small>持有 '+held+' 枚</small>':'')+
 '<p role="status">'+cost+' 顆起始骰 − '+pay+' 枚標記 ＝ <strong>'+remaining+' 顆挑戰骰</strong></p>'+
 btn(remaining?'擲 '+remaining+' 顆挑戰骰':'直接閱讀結果','roll()',true)
}
function updatePayment(){
 const current=document.getElementById('pay'),hadFocus=document.activeElement===current;
 document.getElementById('paymentControls').innerHTML=paymentControls(s.a,chosenCost(s.a),Number(current?.value||0));
 if(hadFocus)document.getElementById('pay')?.focus()
}
function costPanel(a){
 if(a.event==='story:help:0646:scan:01'&&!a.offering646){
  const options=offering646Cards();
  return '<h2>獻上禮物</h2><p>擲挑戰骰之前，必須失去網格或儲備區的一張牌。請選擇要獻出的卡牌。</p>'+(options.length?options.map(n=>flowCard(n,'可獻出的禮物')+btn('獻上卡牌 '+n,'offer646('+n+')')).join(''):'<p>目前沒有可獻出的卡牌。</p>')
 }

 const index=bookIndex[storySource(a)+':'+a.id];
 return '<small>故事訊息　／　'+esc(bookLabel(storySource(a)))+' '+pad(a.id)+'</small><h2>'+esc(a.title)+'</h2><section class="costHelp"><h3>這次要擲幾顆骰？</h3><p>行動費用就是起始的挑戰骰數。每用 1 枚對應的技能標記，就少擲 1 顆。選 0 枚可以保留標記，行動照常成功。骰子決定你可能承受的損失。</p><p>只有卡牌或故事另行要求時，才需要支付錢幣或強化。</p></section>'+
 (a.cost==='X'?'<label>本次投入的費用（X） <select id="xcost" onchange="updatePayment()">'+[1,2,3,4,5,6].map(n=>opt(n,n)).join('')+'</select></label>':'')+
 (canPayCoins(a)?'<label>每付 1 枚錢幣，少擲 1 顆挑戰骰 <select id="foundryCoins" onchange="updatePayment()">'+Array.from({length:Math.min(s.money,a.cost)+1},(_,i)=>opt(i,i+' 枚')).join('')+'</select></label>':'')+
 '<div id="paymentControls">'+paymentControls(a,chosenCost(a,1))+'</div>'
}
function roll(){if(!activePlayer()||s.phase!=='cost')return;if(s.a.event==='story:help:0646:scan:01'&&!s.a.offering646)return;let a=s.a,k=keys.indexOf(a.book),cost=chosenCost(a);if(!Number.isInteger(cost)||cost<0||cost>10)return warn('請先確認原文標示的行動費用。');if(printedReplacementRecipes[a.event]&&(!s.grid.includes(printedReplacementRecipes[a.event].source)||(s.boost[printedReplacementRecipes[a.event].source]||0)<printedCraftBoost(a.event)))return;a.effort=a.cost==='X'?Number(val('xcost')):cost;let pay=k<0?0:Number(val('pay'));if(!Number.isInteger(pay)||pay<0||pay>Math.min(cost,s.skill[k]))return;if(printedCraftBoost(a.event)){s.boost[printedReplacementRecipes[a.event].source]-=printedCraftBoost(a.event);a.circuitBoostPaid=true;noteDecision('支付此卡上的1點強化。')}noteDecision((pay?'使用 '+pay+' 枚'+skills[k]+'標記':'保留技能標記')+'，擲 '+(cost-pay)+' 顆挑戰骰。');if(canPayCoins(a)){const coins=Number(val('foundryCoins'));s.money-=coins;a.coinsPaid=coins;if(coins)noteDecision('支付 '+coins+' 枚錢幣降低行動費用。')}if(k>=0)s.skill[k]-=pay;let n=cost-pay;if(pool()<n)refresh();a.dice=throwDice('c',n,'擲挑戰骰').map(i=>faces[i]);a.selectedDie=0;a.dicePlaced=[];s.phase=n?'dice':'result';save()}
function slots(die=s.a?.dice?.[s.a?.selectedDie||0]){if(!s.a||!die)return [];let a=s.a,result={time:'時間',morale:'士氣',health:'生命',setback:'挫折'};return s.grid.filter(Boolean).flatMap(id=>cards[id].slots.map(q=>s.freeResponseSlots?.[q.uid]?{...q,boost_cost:0}:q).filter(q=>!(q.uid in s.occupied)&&!['terrain_specific','element_specific'].includes(q.type)&&(!q.result||result[q.result]===die)&&(!q.action||q.action===skills[keys.indexOf(a.book)])&&(!q.ability||q.ability.split(/\s*\|\s*|[/／]/).some(v=>(a.name||'').split(/[/／]/).includes(v)))&&(s.boost[id]||0)>=q.boost_cost).map(q=>({id,q})))}
function selectDie(i){if(s.phase!=='dice'||!s.a?.dice?.length)return;s.a.selectedDie=Math.max(0,Math.min(s.a.dice.length-1,i));save()}
function heroRerollSelected(){if(s.phase!=='dice'||!s.a?.dice?.length)return;const heroId=s.grid[4];if(!(s.boost[heroId]>=1))return warn('角色卡需要 1 點強化才可重擲。');s.boost[heroId]--;const idx=Math.max(0,Math.min(s.a.dice.length-1,s.a.selectedDie||0));const before=s.a.dice[idx];const newFace=faces[throwDice('c',1,'角色重擲')[0]];s.a.dice[idx]=newFace;const same=before===newFace;if(same)s.skill[s.hero]++;notice='重擲「'+before+'」骰 → 「'+newFace+'」'+(same?'（骰面相同，獲得 1 點'+skills[s.hero]+'標記！）':'');noteDecision('支付 1 角色強化重擲「'+before+'」骰 → 「'+newFace+'」'+(same?'（獲得 1 點技能標記）':'')+'。');save()}
function assignToSlot(slotUid){if(s.phase!=='dice'||!s.a?.dice?.length)return;const idx=Math.max(0,Math.min(s.a.dice.length-1,s.a.selectedDie||0));const d=s.a.dice[idx];const e=slots(d).find(x=>x.q.uid===slotUid);if(!e)return warn('此槽位不可放置該骰子。');const {id,q}=e;s.occupied[q.uid]=d;const diff=q.boost_reward-q.boost_cost;s.boost[id]=Math.min(cards[id].cap,(s.boost[id]||0)-q.boost_cost+q.boost_reward);if(typeof grantLessonSpell==='function')grantLessonSpell(id,q.uid);const cardName=cards[id]?.name||('卡牌 '+id);const diffText=diff>0?('，獲得 '+diff+' 點強化'):diff<0?('，支付 '+(-diff)+' 點強化'):'';const logMsg='將「'+d+'」骰放入'+cardName+'骰槽'+diffText+'。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'slot',card:id,cardName,diff,text:logMsg});s.a.dice.splice(idx,1);s.a.selectedDie=Math.min(s.a.selectedDie||0,Math.max(0,s.a.dice.length-1));if(!s.a.dice.length)finishDicePhase();else save()}
function acceptSelectedDie(){if(s.phase!=='dice'||!s.a?.dice?.length)return;const idx=Math.max(0,Math.min(s.a.dice.length-1,s.a.selectedDie||0));const d=s.a.dice[idx];if(d==='士氣'&&s.ignoreMoraleTurn===s.turn){noteDecision('植物的勇氣效果：忽略士氣骰面。');(s.a.dicePlaced??=[]).push({die:d,action:'ignore',text:'植物的勇氣效果：忽略士氣骰面'})}else if(statNames.includes(d)){s.penalty++;stat(statNames.indexOf(d),-1);const logMsg='承受「'+d+'」骰結果：失去 1 點'+d+'（移至懲罰區）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'penalty',stat:d,text:logMsg})}else if(d==='挫折'){const logMsg='承受「挫折」骰結果：挫折受阻（不扣屬性，歸還挑戰骰池）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'setback',text:logMsg})}else{s.penalty++;const logMsg='承受「空白」骰結果：安全無損失（移至中央懲罰區）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'blank',text:logMsg})}s.a.dice.splice(idx,1);s.a.selectedDie=Math.min(s.a.selectedDie||0,Math.max(0,s.a.dice.length-1));if(!s.a.dice.length)finishDicePhase();else save()}
function resolveRemainingDice(){if(s.phase!=='dice'||!s.a?.dice)return;while(s.a.dice.length){const d=s.a.dice[0];if(d==='士氣'&&s.ignoreMoraleTurn===s.turn){noteDecision('植物的勇氣效果：忽略士氣骰面。');(s.a.dicePlaced??=[]).push({die:d,action:'ignore',text:'植物的勇氣效果：忽略士氣骰面'})}else if(statNames.includes(d)){s.penalty++;stat(statNames.indexOf(d),-1);const logMsg='承受「'+d+'」骰結果：失去 1 點'+d+'（移至懲罰區）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'penalty',stat:d,text:logMsg})}else if(d==='挫折'){const logMsg='承受「挫折」骰結果：挫折受阻（不扣屬性，歸還挑戰骰池）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'setback',text:logMsg})}else{s.penalty++;const logMsg='承受「空白」骰結果：安全無損失（移至中央懲罰區）。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'blank',text:logMsg})}s.a.dice.shift()}finishDicePhase()}
function autoAssignAllSlottable(){if(s.phase!=='dice'||!s.a?.dice?.length)return;let changed=true;while(changed&&s.a.dice.length){changed=false;for(let i=0;i<s.a.dice.length;i++){const d=s.a.dice[i];const options=slots(d);if(options.length){const best=options.slice().sort((x,y)=>(y.q.boost_reward-y.q.boost_cost)-(x.q.boost_reward-x.q.boost_cost))[0];const {id,q}=best;s.occupied[q.uid]=d;const diff=q.boost_reward-q.boost_cost;s.boost[id]=Math.min(cards[id].cap,(s.boost[id]||0)-q.boost_cost+q.boost_reward);if(typeof grantLessonSpell==='function')grantLessonSpell(id,q.uid);const cardName=cards[id]?.name||('卡牌 '+id);const diffText=diff>0?('，獲得 '+diff+' 點強化'):diff<0?('，支付 '+(-diff)+' 點強化'):'';const logMsg='將「'+d+'」骰放入'+cardName+'骰槽'+diffText+'。';noteDecision(logMsg);(s.a.dicePlaced??=[]).push({die:d,action:'slot',card:id,cardName,diff,text:logMsg});s.a.dice.splice(i,1);changed=true;break}}}s.a.selectedDie=Math.min(s.a.selectedDie||0,Math.max(0,s.a.dice.length-1));if(!s.a.dice.length)finishDicePhase();else{notice='已自動分配所有可放骰子。請決定剩餘骰子（重擲或承受）。';save()}}
function finishDicePhase(){s.a.diceLog=s.a.dicePlaced||[];delete s.a.dicePlaced;delete s.a.selectedDie;s.a.dice=[];s.phase='result';save()}
function autoResolveDice(){autoAssignAllSlottable();resolveRemainingDice()}
function assign(i){if(s.phase!=='dice'||!s.a?.dice?.length)return;if(i===-1)acceptSelectedDie();else{const e=slots()[i];if(e)assignToSlot(e.q.uid)}}
function finish(extra=false,signal=false){
 if(lavaPending())return;
 if(!activePlayer()||s.phase!=='result'||s.unplaced?.length||reserveSize()>reserveLimit())return warn('請先完成目前的卡牌取捨。');
 const a=s.a;if(a.chest&&(!a.chest.done||a.chest.loseSkill||a.chest.hazard))return;
 if(pendingStoryDuel())return beginDuel();
 const {branched,shown}=storyParts(a.text,a.choice);
 if(branched&&a.choice==null||referencedOutcomes(a).pending)return;
 const cityEntry=cityEntryFollowups[a.event];
 if(cityEntry&&a.choice===(cityEntry.choice??1)){
  const target=cards[cityEntry.destination].actions.find(x=>x.book===cityEntry.book&&stories[x.event_uid]);
  const row=stories[target.event_uid];
  rememberStory(a);noteDecision('進入城市 '+cityEntry.destination+'，繼續執行'+cityEntry.skill+'－'+cityEntry.name+'。');
  travel(cityEntry.destination);
  if(!s.used.includes(target.action_uid))s.used.push(target.action_uid);
  s.a={id:s.loc,origin:s.loc,kind:'地點',key:target.action_uid,event:target.event_uid,book:target.book,name:cityEntry.name,title:row[5],cost:row[2],text:row[1],dice:[]};
  s.phase='cost';save();return
 }
 if(['story:overpower:0691:01','story:take:0659:01'].includes(a.event)){
  const cost=a.id===691?5:6;
  noteDecision('繼續執行壓制－保衛。');rememberStory(a);
  s.a={id:a.id,origin:s.loc,kind:'地點',event:a.event+'-defend',book:'overpower',name:'保衛',title:'抵擋攻擊',cost,text:'你完成了保衛行動。',dice:[]};
  s.phase='cost';save();return
 }
 const chestPick=a.event==='story:help:0724:01'&&a.fedChestAnimal;
 const trial=chestPick?cards[724].actions.find(target=>target.action_uid==='action:0724:03'):trialFollowup(a,resultText());
 if(trial){
  const row=stories[trial.event_uid];
  noteDecision((chestPick?'繼續開箱：':'參加試煉：')+volumes[trial.book]+'－'+trial.action+'。');rememberStory(a);
  if(!s.used.includes(trial.action_uid))s.used.push(trial.action_uid);
  s.a={id:a.id,origin:s.loc,kind:'地點',key:trial.action_uid,discount:chestPick?2:0,event:trial.event_uid,book:trial.book,name:trial.action,title:row[5],cost:row[2],text:row[1],dice:[]};
  s.phase='cost';save();return
 }
 if(a.id===563&&resultText().includes('繼續執行移動-退出行動')){
  const event='story:move:0563:01',row=stories[event];
  noteDecision('繼續執行移動－退出。');rememberStory(a);
  s.a={id:563,origin:s.loc,event,book:'move',kind:'地點',name:'退出',title:row[5],cost:row[2],text:row[1],dice:[]};s.phase='cost';save();return
 }
 if(resultSkillChoices().length&&a.rewardChoice==null)return warn('請選擇故事給予的技能。');
 const contInfo=getContinuationInfo(a,shown+' '+(a.title||''));
 if(extra&&!contInfo?.available&&!/繼續(?:[。！；，]|$)|繼續執行/.test(shown.replace(/\s/g,'')))return;
 if(canDuel()&&!/可以|選擇/.test(resultText()))return beginDuel();
 const routes=storyTravel(resultText());
 if(routes.length>1&&!a.dest)return warn('請選擇這次的離開路線。');
 if(!a.dest&&routes.length===1)a.dest=routes[0];
 if(signal){
  if(extra||!rescueTurnEnd())return;
  s.markers??={};
  s.markers[1705]=(s.markers[1705]||0)+1;
  creditReward({kind:'強化',delta:1},{kind:'地點'});
  s.rescueArrived=s.markers[1705]>=6;
  noteDecision('等待救援，放置第 '+s.markers[1705]+' 個救援標記（共 6 個）。')
 }
 if(settleRescue(a))return;
 if(a.event==='story:overpower:1592:01'){s.conquests??={};s.conquests[s.loc]=(s.conquests[s.loc]||0)+1;s.markers[1592]=s.conquests[s.loc]}
 for(const ref of entryReferences(resultText(),storySource(a))){if(ref.book==='atlas'&&ref.page&&!ref.gate)s.atlasPages=[...new Set([...(s.atlasPages||[]),ref.id])]}
 if(extra&&a.text.replace(/\s/g,'').includes('與所選類型匹配的行動')){
  const selected=resultSkillChoices()[a.rewardChoice];if(!selected)return;
  s.extraBook=keys[skills.indexOf(selected[0])]
 }
 if(extra&&practiceActions[a.event]){
  const option=practiceActions[a.event][a.choice-1];if(!option)return;
  s.practiceAction=option[0]
 }
 if(extra&&contInfo?.targetUid)s.practiceAction=contInfo.targetUid;
 if(extra&&contInfo?.book)s.extraBook=contInfo.book;
 if(extra&&contInfo?.discount!=null){
  if(contInfo.discount==='to1')s.nextDiscountTo1=true;
  else if(contInfo.discount==='half')s.nextDiscountHalf=true;
  else s.nextDiscount=contInfo.discount;
 }
 if(extra&&contInfo?.type==='extra')s.turnActionExtra=true;
 if(extra&&caveFireEvents.has(a.event))s.practiceAction=cards[a.id].actions.find(x=>x.book==='look'&&x.action==='探索').action_uid;
 if(extra&&(a.event==='story:look:0117:01'||a.event==='story:move:0117:01'||a.event==='story:engage:0117:01'||a.event==='story:help:0117:01'||a.event==='story:overpower:0117:01'))s.practiceAction='action:0117:05';
 if(extra&&a.event==='story:look:0262:01'&&a.choice===2)s.practiceAction='action:0524:03';
 if(extra&&a.event==='story:help:0723:01'&&a.choice===2)s.practiceAction='action:0723:01';
 if(a.defeatsSpider)s.spiderDefeated=true;
 if(a.event==='story:overpower:0210:01')s.magnetSevered=true;
 if(a.event==='story:move:0091:01')s.clearExit='story:depart:0091:01';
 if(a.event==='story:look:0045:01'||(a.event==='story:overpower:0045:01'&&a.choice!=null))s.clearExit='story:depart:0045:01';
 if(a.event==='story:overpower:0091:01')delete s.clearExit;
 if(extra&&/本回合的下一個行動，其費用減少X點/.test(shown.replace(/\s/g,''))&&Number.isInteger(a.effort))s.nextDiscount=a.effort;
 if(a.dest){
  const routeText=resultText().replace(/\s/g,'');
  if(routeText.includes('此次抵達忽略缺氧傷害'))s.ignoreOxygenOnArrival=true;if(routeText.includes('忽略寒冷傷害'))s.ignoreColdOnArrival=true;
  if(routeText.includes('保留此地點作為參考')&&routeText.includes('地城'))s.dungeonEntrance=s.loc;
  if(routeText.includes('返回你最初進入地城的洞穴地點'))delete s.dungeonEntrance
 }
 if(extra)noteDecision('依條目繼續行動'+(s.practiceAction?'：「'+actionNameByUid(s.practiceAction)+'」':s.extraBook?'：「'+skills[keys.indexOf(s.extraBook)]+'行動」':'')+'。');
 rememberStory(a);s.lastActionTravel=a.dest?{from:s.loc,to:a.dest}:null;if(a.dest)travel(a.dest);s.log.push(a.name+' · '+a.title);s.extra=extra;if(!extra){s.turn++;handleTurnAdvance()}s.pendingCard=null;s.a=null;s.phase='ready';save()}
function skipPractice(rescue=false){
 if(!activePlayer()||s.phase!=='ready'||(!s.practiceAction&&!s.extraBook&&!s.turnActionExtra))return;
 if(rescue&&rescueTurnEnd()){
  s.markers??={};
  s.markers[1705]=(s.markers[1705]||0)+1;
  creditReward({kind:'強化',delta:1},{kind:'地點'});
  s.rescueArrived=s.markers[1705]>=6;
  noteDecision('等待救援，放置第 '+s.markers[1705]+' 個救援標記（共 6 個）。')
 }
 delete s.practiceAction;delete s.extraBook;delete s.turnActionExtra;delete s.nextDiscount;delete s.nextDiscountTo1;delete s.nextDiscountHalf;s.extra=false;s.turn++;handleTurnAdvance();noteDecision('進入下一回合。');save()
}
function mainTurn(){
 let a=s.a;
 if(s.phase==='ready'){
  if(s.pendingHazards?.length){
   const h=s.pendingHazards[0];
   return '<div class="panel hazardChoiceBox">'+
    '<small style="color:#b83232;font-weight:700;">⚠️ 環境傷害結算</small>'+
    '<h2 style="color:#8a1f1f;margin:6px 0 10px;">受到【'+esc(h.type)+'】傷害！</h2>'+
    '<p>抵達地點時受到了 1 點'+esc(h.type)+'傷害。請依規則選擇承受方式：</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 6px;">'+
      btn('失去 1 點生命 ('+statArt(2)+'生命 '+s.stats[2]+' ➔ '+(s.stats[2]-1)+')','chooseHazardDamage(true)',true)+
      btn('同時失去 1 點時間與 1 點士氣 ('+statArt(0)+'時間 '+s.stats[0]+' ➔ '+(s.stats[0]-1)+'，'+statArt(1)+'士氣 '+s.stats[1]+' ➔ '+(s.stats[1]-1)+')','chooseHazardDamage(false)')+
    '</div>'+
    (s.pendingHazards.length>1?'<small class="note">尚有 '+(s.pendingHazards.length-1)+' 點傷害待結算。</small>':'')+
   '</div>';
  }
  if(s.unplaced?.length||reserveSize()>reserveLimit())return placementChoices()+capacityView();
  available=actions();
  const contPrompt = s.practiceAction ?
    '<div class="continuationNotice"><span><b>✨ 追加行動：</b>可繼續執行「' + esc(actionNameByUid(s.practiceAction)) + '」。</span>' + btn('放棄追加行動，進入下一回合', 'skipPractice()') + (rescueTurnEnd()?btn('放棄並等待救援（角色獲得 1 強化）','skipPractice(true)'):'') + '</div>' :
    s.extraBook ?
    '<div class="continuationNotice"><span><b>✨ 追加行動：</b>可繼續執行「' + esc(skills[keys.indexOf(s.extraBook)] + '」類型的行動。') + '</span>' + btn('放棄追加行動，進入下一回合', 'skipPractice()') + (rescueTurnEnd()?btn('放棄並等待救援（角色獲得 1 強化）','skipPractice(true)'):'') + '</div>' :
    (s.extra && s.turnActionExtra ?
    '<div class="continuationNotice"><span><b>✨ 追加行動：</b>士氣充足，可繼續執行本回合另一個行動。</span>' + btn('放棄追加行動，進入下一回合', 'skipPractice()') + (rescueTurnEnd()?btn('放棄並等待救援（角色獲得 1 強化）','skipPractice(true)'):'') + '</div>' : '');
  return contPrompt+(s.rescueArrived?goalStory(1705):'')+journalPanel()+'<h2>選擇行動</h2>'+(s.loc===1?btn('選擇逃生艙','s.phase="escape";save()'):'')+['地點','離開','卡牌'].map(availableGroup).join('')
 }
 if(s.phase==='cost')return originPanel(a)+costPanel(a);
if(s.phase==='dice')return originPanel(a)+dicePhasePanel(a);
return originPanel(a)+resultPanel(a)}
function dicePhasePanel(a){
 const dice=a.dice||[];
 if(!dice.length){finishDicePhase();return resultPanel(a)}
 const selIdx=Math.max(0,Math.min(dice.length-1,a.selectedDie||0));
 const selDie=dice[selIdx];
 const heroId=s.grid[4];
 const heroBoost=s.boost[heroId]||0;
 const eligibleSlots=slots(selDie);
 const slottableCount=dice.filter(d=>slots(d).length>0).length;
 const penaltyDesc=statNames.includes(selDie)?'失去 1 點'+selDie+'（移至懲罰區）':selDie==='空白'?'安全，不扣屬性':'挫折，不扣三項屬性';
 return '<div class="dicePhaseBox">'+
  '<small>故事訊息　／　'+esc(bookLabel(storySource(a)))+' '+pad(a.id)+'</small>'+
  '<h2>🎲 放置與重擲挑戰骰</h2>'+
  '<div class="dicePromptNotice">'+
    '<p><b>本次擲出 '+dice.length+' 顆挑戰骰</b>，其中 <b style="color:#1b5e20;">'+slottableCount+' 顆</b>有符合條件的卡牌骰槽可吸納！</p>'+
    '<p class="note">您可以自由點選下方任一顆骰子決定操作（放置或重擲）。右側卡牌網格已即時高亮可吸納當前選中骰子的卡片。</p>'+
  '</div>'+
  '<h3>1. 點選骰子決定操作（自由挑選）</h3>'+
  '<div class="diceSelectorGrid">'+
    dice.map((d,i)=>{
      const isSel=i===selIdx;
      const count=slots(d).length;
      return '<button type="button" class="dicePickBtn '+(isSel?'selected ':'')+(count?'canSlot':'noSlot')+'" onclick="selectDie('+i+')">'+
        faceImg('c',mapFace(d))+'<b>'+esc(d)+'</b>'+
        '<span class="slotBadge '+(count?'occupied':'empty')+'">'+(count?count+' 槽可用':'無可用槽')+'</span>'+
      '</button>';
    }).join('')+
  '</div>'+
  '<div class="selectedDieActionCard">'+
    '<h4>目前選取：'+faceImg('c',mapFace(selDie))+' <b>'+esc(selDie)+'</b> 骰</h4>'+
    '<div class="dieActionRow">'+
      '<b>🔄 英雄重擲：</b>'+
      (heroBoost>=1?btn('🎲 支付 1 角色強化重擲「'+selDie+'」骰（現有 '+heroBoost+' 強化）','heroRerollSelected()',true):'<span class="note" style="color:#8c6b43;">角色強化不足（需要 1 點強化，目前為 0）。</span>')+
    '</div>'+
    '<div class="dieActionRow">'+
      '<b>📥 放置到卡牌骰槽（右側網格對應卡牌已高亮）：</b>'+
      (eligibleSlots.length?'<div class="slotButtonsGrid">'+eligibleSlots.map(e=>{
        const cardName=cards[e.id]?.name||('卡牌 '+e.id);
        const diff=e.q.boost_reward-e.q.boost_cost;
        const diffText=diff>0?('（獲得 +'+diff+' 強化）'):diff<0?('（支付 '+(-diff)+' 強化）'):'（強化無變化）';
        const costText=e.q.boost_cost>0?('花費 '+e.q.boost_cost+' 強化，'):'';
        return btn('📥 放入 '+cardName+' 骰槽'+diffText+' — '+costText+'吸納「'+selDie+'」傷害','assignToSlot("'+e.q.uid+'")');
      }).join('')+'</div>':'<p class="note" style="color:#9e2a2b;">此「'+selDie+'」骰在當前卡牌中沒有符合條件的空骰槽。</p>')+
    '</div>'+
    '<div class="dieActionRow">'+
      '<b>💥 承受代價：</b>'+
      btn('承受此「'+selDie+'」骰結果（'+penaltyDesc+'）','acceptSelectedDie()')+
    '</div>'+
  '</div>'+
  '<div class="dicePhaseFooter">'+
    (slottableCount>0?btn('✨ 依推薦自動分配所有可放骰子 ('+slottableCount+' 顆)','autoAssignAllSlottable()'):'')+
    btn('✔️ 承受所有剩餘骰子並結算結果 ('+dice.length+' 顆)','resolveRemainingDice()',true)+
    btn('📖 骰子與規則指南','showRuleGuide()')+
  '</div>'+
 '</div>';
}
function autoAssignDice(){autoAssignAllSlottable()}
function diceSummary(a){if(!a?.diceLog?.length)return '';return '<div class="diceSummaryPanel"><div class="diceSummaryHead"><b>🎲 挑戰骰結算明細</b></div><ul class="diceSummaryList">'+a.diceLog.map(item=>'<li>'+faceImg('c',mapFace(item.die))+' <span>'+esc(item.text)+'</span></li>').join('')+'</ul></div>'}
function resultPanel(a){
 if(lavaPending())return lavaPuzzlePanel(a);
 let {parts,branched:branch,shown}=storyParts(a.text,a.choice);
 let options=syncColumnButtons(a)+(branch&&a.choice==null?branchButtons(parts):'');
 if(a.chest?.hazard&&branch&&a.choice==null)options=effectsView(shown);
 if(options&&immediateEncounters[a.event]&&(s.unplaced?.length||reserveSize()>reserveLimit()))options=placementChoices()+capacityView();
 if(branch&&a.choice==null)options=rewardReceipt(a)+options;
 let contInfo=getContinuationInfo(a,branch&&a.choice!=null?parts[a.choice]:shown);
 let continuation=!!contInfo?.available,required=!!contInfo?.required;
 if(syncColumnEvents.has(a.event)&&!branch&&continuation)required=true;
 return '<div class="storyMessage">'+diceSummary(a)+'<small>故事訊息　／　'+esc(bookLabel(storySource(a)))+' '+pad(a.id)+'</small><h2>'+esc(a.title)+'</h2>'+(a.cost==='X'?'<p>投入費用 '+a.effort+'</p>':'')+'<p class="story">'+esc(shown)+'</p>'+tableInstructions(shown)+(a.printPage?bookPage(a.book,a.printPage):'')+options+(branch&&a.choice==null?'':storyRefs(shown,storySource(a),a.reading||{},'a'))+'</div>'+
 (branch&&a.choice==null?'':effectsView(shown)+(canDuel()?btn('進入交鋒快速對決','beginDuel()'):'')+finishControls(a,continuation,required,contInfo))
}
function sourceButton(a){let book=a.event?.split(':')[1]||a.book;let page=bookIndex[book+':'+a.id];if(!page)return '';return btn('查看原書 · 第 '+page[1]+' 頁','pageView('+page[0]+','+page[1]+')')}
function listedEffects(t){
 let effects=[];
 for(const m of t.matchAll(/(獲得|失去|支付)([1-9])點?(隨機技能|移動|查看|接觸|幫助|獲取|壓制|強化|錢幣|生命|士氣|時間)/g))effects.push({label:m[0],kind:m[3],delta:(m[1]==='獲得'?1:-1)*Number(m[2]),paid:m[1]==='支付'});
 for(const m of t.matchAll(/(?:前往|移動至|抵達)[^。，；·0-9]{0,9}([0-9]{3})(?![0-9])/g))if((+m[1]===1||cards[+m[1]]?.home==='location')&&!s.a.dest)effects.push({label:m[0],dest:+m[1]});
 for(const m of t.matchAll(/獲得(?:一張|1張)?(?:物品|動物|植物|能力|載具|建築|構築物|課程|命運|任務|智慧生物|智慧生|詛咒|法術|卡牌|經驗|同伴|盟友|裝備)[（( ]*([0-9]{3,4})/g))if(cards[+m[1]])effects.push({label:m[0],card:+m[1]});
 return effects
}
function effectsView(t){
 if(pendingStoryDuel())return rewardReceipt(s.a);
 const a=s.a,targets=storyTravel(resultText());
 if(a.chest?.hazard)return '<p>承受 1 點'+esc(a.chest.hazard)+'傷害，選擇其一。</p>'+(a.foundryDice&&s.skill[0]>0?btn('支付 1 點移動避開高溫','avoidFoundryHeat()'):'')+btn('失去 1 點生命','takeChestDamage(true)')+btn('失去 1 點時間與 1 點士氣','takeChestDamage(false)')+(a.chest.hazard==='高溫'?[857,858].filter(n=>s.grid.includes(n)&&s.boost[n]>0).map(n=>btn('使用水袋 '+n+'（消耗 1 點強化）','useWaterskin('+n+')')).join(''):'');
 if(a.chest?.loseSkill)return rewardReceipt(a)+'<p>選擇失去的 1 點技能。</p>'+skills.map((k,i)=>s.skill[i]>0?btn('失去 1 點'+k,'payChestSkill('+i+')'):'').join('');
 if(a.chest&&!a.chest.done)return chestControls(a.chest);
 return (a.routeRoll?'<p>'+(a.routeRoll.ocean?'海洋航線獲得':'水龍捲擲出')+esc(skills[a.routeRoll.face])+'，將前往地點 '+pad(a.routeRoll.dest)+'。</p>':'')+rewardReceipt(a)+skillChoiceView()+placementChoices()+(targets.length>1&&!a.dest?'<p>選擇離開路線</p>'+targets.map((n,i)=>btn((skyLandingOptions(resultText())[i]?.direction||'')+'前往地點 '+pad(n),'chooseRoute('+i+')')).join(''):'')
}
function characterPower(resource){if(!activePlayer()||!['money','skill'].includes(resource))return;let n=s.grid[4];if((s.boost[n]||0)<2)return warn('角色需要 2 點強化。');s.boost[n]-=2;if(resource==='money')s.money++;else s.skill[s.hero]++;save()}
function reserveSize(){return s.reserve.filter(n=>n<1517||n>1528).length+Number(s.reserve.some(n=>n>=1517&&n<=1528))}
// Printed reserve symbols on the card faces (including sideways structure cards).
const reserveIcons={"803":1,"807":3,"808":3,"809":3,"812":3,"825":1,"832":3,"833":3,"840":1,"841":3,"842":3,"847":3,"855":1,"931":3,"984":3,"985":1,"1010":3,"1013":1,"1014":1,"1015":3,"1016":3,"1017":3,"1022":1,"1023":1,"1033":6,"1108":1,"1110":3,"1111":3,"1120":1,"1127":1,"1130":3,"1134":1,"1156":2,"1218":3,"1219":3,"1220":3,"1230":1,"1265":3,"1283":3,"1289":3,"1290":3,"1292":3,"1302":1,"1434":3,"1435":1,"1436":1,"1437":1,"1438":1,"1439":1,"1440":1,"1441":1,"1442":1,"1443":1,"1444":1,"1445":1,"1446":1,"1447":1,"1448":1,"1449":1,"1450":1,"1451":1,"1452":1,"1687":3,"1688":3,"1689":3,"1690":3,"1691":3,"1692":3,"1701":3};
function reserveSources(){return [...new Set([...s.grid,...s.supply])].filter(n=>reserveIcons[n])}
function capacityView(){
 const sources=reserveSources(),cap=sources.reduce((total,n)=>total+reserveIcons[n],0),used=reserveSize();
 const hero=s.grid[4],heroBoost=s.boost[hero]||0;
 const rows=sources.map(n=>'<li>'+btn('卡牌 '+n,'card('+n+')')+'　提供 '+reserveIcons[n]+' 格</li>').join('');
 const excess=used>cap?'<div class="reserveExcessWarning"><p>⚠️ 儲備超出容量 '+(used-cap)+' 格，請依規則選擇要失去的儲備牌：</p><div class="excessBtnRow">'+s.reserve.map(n=>btn('失去 '+n,'discardOverflow('+n+')')).join('')+'</div></div>':'';
 const reserveList=s.reserve.length?
  '<div class="reserveCardsGrid">'+s.reserve.map(n=>{
    const c=cards[n],isPortrait=c?.orientation==='portrait';
    const actionBtn=isPortrait?
      (heroBoost>=1?
        '<button type="button" class="btnTransferCard primary" onclick="openTransferModal('+n+')">🔄 裝備至網格</button>':
        '<button type="button" class="btnTransferCard disabled" disabled title="需要角色上有 1 點強化">🔒 裝備（需 1 強化）</button>'):
      '<span class="landscapeNote">（橫向卡不可裝備）</span>';
    return '<div class="reserveCardItem">'+
      '<div class="reserveCardMedia" onclick="card('+n+')">'+
        '<img src="cards/'+n+'.webp" alt="卡牌 '+n+'" class="reserveImg">'+
        cardMarkers(n)+
      '</div>'+
      '<div class="reserveCardMeta">'+
        '<b class="reserveTitle" onclick="card('+n+')">'+esc(c?.name||('卡牌 '+n))+'</b>'+
        '<small class="reserveSubtitle">卡牌 '+n+'</small>'+
        actionBtn+
      '</div>'+
    '</div>';
  }).join('')+'</div>':
  '<div class="emptyReserveNote">（目前儲備區為空，尚無儲備卡牌）</div>';

 return '<section class="panel reservePanel">'+
  '<div class="reserveHeader">'+
    '<div class="reserveTitleRow">'+
      '<h3>📦 儲備容量　'+used+' / '+cap+' 格</h3>'+
      '<span class="reserveStatusBadge '+(used>cap?'danger':'ok')+'">'+(used>cap?'超出容量':'容量正常')+'</span>'+
    '</div>'+
    '<details class="capacityDetails"><summary>容量來源（共 '+sources.length+' 張牌提供儲備格）</summary><p>已使用 '+used+' 格，上限 '+cap+' 格。每個網格或供應區卡牌上的儲備圖示提供 1 格。整套《交鋒》收藏共占 1 格。</p>'+(rows?'<ul>'+rows+'</ul>':'')+'</details>'+
  '</div>'+
  excess+
  '<div class="reserveCardsSection">'+
    '<div class="reserveSectionSubhead"><b>儲備區卡牌清單</b>（位於儲備容量下方，共 '+s.reserve.length+' 張）：</div>'+
    reserveList+
  '</div>'+
 '</section>';
}
function cardSlotStatus(n){
 const slots=cards[n]?.slots||[];
 if(!slots.length)return '';
 const items=slots.map((q,i)=>{
  const occupied=s.occupied?.[q.uid];
  const type=q.type==='terrain_specific'?'地形相符':q.type==='element_specific'?'成分相符':q.action?'限「'+q.action+'」':q.result?({time:'時間',morale:'士氣',health:'生命',setback:'挫折'}[q.result]+'專用'):'一般';
  if(occupied){
   return '<span class="slotBadge occupied">'+faceImg('c',mapFace(occupied))+' <b>槽 '+(i+1)+'：已放「'+occupied+'」骰</b></span>';
  }
  return '<span class="slotBadge empty">○ 槽 '+(i+1)+'：'+type+'（空）</span>';
 }).join(' ');
 return '<div class="cardSlotsList">'+items+'</div>';
}
function useMapCard(id,cost){
 if(!s||!s.grid.includes(id))return warn('地圖卡必須放置在網格中才能使用。');
 const info=typeof MAP_CARD_INFO!=='undefined'?MAP_CARD_INFO[id]:null;
 const name=info?info.name:'地圖卡';
 const page=info?info.page:16;
 const curBoost=s.boost[id]||0;
 if(curBoost<cost)return warn(name+'上的強化不足（需要 '+cost+' 點）。');
 if(cost===1){
  s.boost[id]-=1;
  noteDecision('支付'+name+'上的 1 點強化，查閱《萬境之書》第 '+page+' 頁。');
  save();
  pageView(9,page);
 }else if(cost===2){
  s.boost[id]-=2;
  stat(0,1);
  notice='已支付'+name+' 2 點強化，獲得 1 點時間！';
  noteDecision('支付'+name+'上的 2 點強化，獲得 1 點時間。');
  save();
 }
}
function useMap1259(cost){return useMapCard(1259,cost);}

function useTurtleTaxi(dest){
 if(!s||!s.grid.includes(1013))return warn('海龜出租車必須在網格中才能使用。');
 const b=s.boost[1013]||0;
 if(b<1)return warn('海龜出租車需要 1 點強化。');
 s.boost[1013]--;
 noteDecision('支付海龜出租車 1 點強化，乘坐前往地點 '+dest+'。');
 if(s.boost[1013]<=0){
  const idx=s.grid.indexOf(1013);
  if(idx>=0)s.grid[idx]=0;
  delete s.boost[1013];
  for(const q of (cards[1013]?.slots||[]))delete s.occupied[q.uid];
  notice='海龜出租車的強化方塊已空，依規則失去此牌！';
  noteDecision('海龜出租車強化耗盡，失去此牌。');
 }
 travel(dest);
 save();
}

function useSawAxe(){
 if(!s||!s.grid.includes(1088))return warn('鋸齒斧必須在網格中才能使用。');
 const b=s.boost[1088]||0;
 if(b<2)return warn('鋸齒斧需要 2 點強化。');
 s.boost[1088]-=2;
 s.skill[3]++; // 幫助標記
 notice='支付鋸齒斧 2 點強化，獲得 1 點幫助標記！';
 noteDecision('支付鋸齒斧 2 點強化，獲得 1 點幫助標記。');
 save();
}

function refreshCardDie(slotUid){
 const hero=s.grid[4];
 if(!hero||hero<1441)return;
 if((s.boost[hero]||0)<1)return warn('角色需要 1 點強化。');
 if(!s.occupied[slotUid])return warn('該槽位沒有挑戰骰。');
 const d=s.occupied[slotUid];
 delete s.occupied[slotUid];
 s.boost[hero]--;
 notice='已支付 1 角色強化，刷新卡牌槽位上的「'+d+'」骰回到挑戰骰池！';
 noteDecision('支付 1 角色強化，刷新卡牌槽位上的「'+d+'」骰。');
 save();
}

function showRefreshDieModal(){
 const occupiedEntries=Object.entries(s.occupied);
 if(!occupiedEntries.length)return warn('目前沒有卡牌槽位放有挑戰骰。');
 const list=occupiedEntries.map(([uid,die])=>{
  const cId=s.grid.find(n=>n&&cards[n]?.slots?.some(q=>q.uid===uid));
  const cardName=cId?cards[cId].name:'卡牌';
  return '<div style="margin:8px 0;padding:8px;background:#fbf9f4;border:1px solid #d5cdb8;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">'+
    '<span>'+cardName+'（放有「'+die+'」骰）</span>'+
    btn('刷新此骰歸還骰池','refreshCardDie("'+uid+'");viewer.close()',true)+
  '</div>';
 }).join('');
 show('<h2>🔄 刷新卡牌上的挑戰骰</h2><p>支付 1 角色強化，清空選定槽位的挑戰骰並歸還骰池：</p>'+list+btn('取消','viewer.close()'));
}

function cardAbilities(){
 if(!s)return '';
 let html='';
 if(typeof MAP_CARD_INFO!=='undefined'){
  for(const [midStr,info] of Object.entries(MAP_CARD_INFO)){
   const mid=Number(midStr);
   if(s.grid.includes(mid)){
    const b=s.boost[mid]||0;
    html+='<div class="cardAbilities" style="margin-top:12px;padding:10px;background:#f6f1e4;border:1px solid #d5cdb8;border-radius:8px;">'+
     '<h4 style="margin:0 0 6px;">🗺️ 卡牌異能：'+info.name+'（'+mid+'）<small style="margin-left:8px;font-weight:normal;color:#55695e;">現有 '+b+' 強化</small></h4>'+
     '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
     btn('📖 查閱《萬境之書》第 '+info.page+' 頁','pageView(9,'+info.page+')',true)+
     (b>=1?btn('支付 1 強化並查閱第 '+info.page+' 頁','useMapCard('+mid+',1)'):'')+
     (b>=2?btn('支付 2 強化獲得 1 時間','useMapCard('+mid+',2)'):'')+
     '</div></div>';
   }
  }
 }
 if(s.grid.includes(1013)){
  const b=s.boost[1013]||0;
  const dests=Object.values(cards[s.loc]?.exits||{}).map(e=>e.destination).filter(Boolean);
  html+='<div class="cardAbilities" style="margin-top:12px;padding:10px;background:#f6f1e4;border:1px solid #d5cdb8;border-radius:8px;">'+
   '<h4 style="margin:0 0 6px;">🐢 載具異能：海龜出租車（1013）<small style="margin-left:8px;font-weight:normal;color:#55695e;">現有 '+b+' 強化（官方勘誤）</small></h4>'+
   '<p style="font-size:0.85rem;margin:0 0 6px;">官方勘誤異能：支付 1 強化乘坐海龜出租車，移動到相鄰列出地點（無需消耗本回合行動，若強化耗盡則失去此牌）。</p>'+
   '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
   (b>=1&&dests.length?dests.map(d=>btn('乘坐前往地點 '+pad(d),'useTurtleTaxi('+d+')',true)).join(''):'<span class="note" style="color:#887755;">'+(b<1?'強化不足（需要 1 強化）':'當前地點無相鄰列出地點')+'</span>')+
   '</div></div>';
 }
 if(s.grid.includes(1088)){
  const b=s.boost[1088]||0;
  html+='<div class="cardAbilities" style="margin-top:12px;padding:10px;background:#f6f1e4;border:1px solid #d5cdb8;border-radius:8px;">'+
   '<h4 style="margin:0 0 6px;">🪓 工具異能：鋸齒斧（1088）<small style="margin-left:8px;font-weight:normal;color:#55695e;">現有 '+b+' 強化（官方勘誤）</small></h4>'+
   '<div style="display:flex;flex-wrap:wrap;gap:6px;">'+
   (b>=2?btn('支付 2 強化獲得 1 點幫助標記','useSawAxe()',true):'<span class="note" style="color:#887755;">需要 2 點強化（現有 '+b+'）</span>')+
   '</div></div>';
 }
 return html;
}

function heroAbilities(){
 const hero=s.grid[4];if(!hero)return '';
 const boost=s.boost[hero]||0;
 const isAdv=hero>=1441&&hero<=1452;
 const occupiedCount=Object.keys(s.occupied).length;
 return '<div class="heroAbilities"><h3>角色能力（'+(cards[hero]?.name||'角色')+'）</h3><div>'+
  btn('支付 2 強化換 1 錢幣（現有 '+boost+' 強化）','characterPower("money")')+
  btn('支付 2 強化換角色技能','characterPower("skill")')+
  (isAdv&&occupiedCount>0?btn('支付 1 強化刷新卡牌上的骰子 ('+occupiedCount+' 槽已放)','showRefreshDieModal()'):'')+
  heroTransferControls()+
 '</div></div>';
}
function bag(){const selDie=s.phase==='dice'?s.a?.dice?.[s.a?.selectedDie||0]:null;const eligibleIds=selDie?new Set(slots(selDie).map(e=>e.id)):new Set();return '<h2>隨身行囊</h2>'+(s.gridFateNotice?flowCard(1705,'填滿網格所得命運'):'')+placementChoices()+'<div class="board">'+s.grid.map((n,i)=>{const isEligible=n&&eligibleIds.has(n);const btnCls=isEligible?'slotEligibleCard':'';const badge=isEligible?'<span class="eligibleBadge">可放此骰</span>':'';return '<button class="'+btnCls+'" onclick="'+(n?'card('+n+')':'')+'" style="position:relative;padding:0;border:0;background:none;line-height:0;">'+(n?'<div class="cardMediaWrap"><img src="cards/'+n+'.webp" alt="卡牌 '+n+'">'+cardMarkers(n)+badge+'</div>':'<div style="line-height:normal;padding:14px 4px;color:#887755;font-weight:600;">空位 '+(i+1)+'</div>')+'</button>'}).join('')+'</div>'+cardShelf([s.mission],'使命')+cardShelf(s.fates,'命運')+capacityView()+cardShelf(s.supply,'供應')+heroAbilities()+cardAbilities()}

function warn(t){notice=t;render()}
function records(){return '<h2>探險手冊</h2>'+ (s.duel?btn('繼續交鋒','duelView()'):'')+'<p>回合依序為宣告行動、揭示費用、支付技能、擲骰、放置、承受懲罰、閱讀結果及結束。普通地點行動每局在同一地點限一次，重訪時仍受限制。</p><div>'+select('book',['規則','壓制','幫助','接觸','查看','獲取','秘密','移動','萬境','離開'].map((v,i)=>opt(i+1,v)).join(''))+' 第 <input id="page" value="1" type="number" min="1"> 頁'+btn('翻閱','pageView()')+btn('📖 查閱官方FAQ(第1書第15頁)','pageView(1,15)')+'</div><h3>指定條目</h3><input id="find" placeholder="牌號" type="number">'+btn('查卡','card(+val("find"))')+btn('查故事','lookup()')+'<h3>旅程紀錄</h3>'+s.log.slice(-20).reverse().map(l=>'<div>'+esc(l)+'</div>').join('')+'<hr>'+goalPanel()+btn('依規則結束探險','ending()')+btn('📖 骰子與規則指南','showRuleGuide()')+btn('🌐 官方 FAQ 與線上澄清','window.open("https://stonemaiergames.com/games/vantage/rules-faq","_blank")')+btn('開始一段新旅程','newJourney(true)')}
function lookup(){let id=+val('find');let list=Object.entries(stories).filter(([,v])=>v[0]===id);show('<h2>條目 '+id+'</h2>'+list.map(([k,v])=>'<details><summary>'+esc(k.split(':')[1])+' · '+esc(v[5])+'</summary><p>'+esc(v[1])+'</p></details>').join(''))}
function pageView(b,p){b=b??(document.getElementById('book')?+val('book'):1);p=p??(document.getElementById('page')?+val('page'):1);let max=[17,40,36,48,36,36,16,36,50,36][b-1]||50;if(!Number.isInteger(p)||p<1||p>max)return warn('此書共 '+max+' 頁。');show('<div>'+(p>1?btn('上一頁','pageView('+b+','+(p-1)+')'):'')+p+' / '+max+(p<max?btn('下一頁','pageView('+b+','+(p+1)+')'):'')+'</div><img onclick="this.classList.toggle(\'zoomed\')" alt="書頁 '+p+'" src="books/'+String(b).padStart(2,'0')+'_'+String(p).padStart(3,'0')+'.webp">')}
function ending(){let options=[];if(s.missionDone)options.push('使命勝利');if(s.fateDone)options.push(s.missionDone?'史詩勝利':'命運勝利');options.push('旅程告終');show('<h2>結算探險</h2>'+goalPanel()+'<p>依使命、命運或故事條目指示選擇結局。</p>'+options.map(v=>btn(v,'endGame('+JSON.stringify(v)+')')).join(''))}
function endGame(t){if(!['旅程告終','使命勝利','命運勝利','史詩勝利'].includes(t)||s.phase==='ended')return;if(t==='使命勝利'&&!s.missionDone||t==='命運勝利'&&!s.fateDone||t==='史詩勝利'&&!(s.fateDone&&s.missionDone))return;if(s.phase==='result'&&s.a&&!s.stats.includes(0))rememberStory(s.a);tripEvent(t,'選擇以此結局結束探險。');s.end=t;s.phase='ended';viewer.close();save()}
function crisis(){let e=stories['story:take:'+String(s.mission).padStart(4,'0')+':01'];return '<section class="panel storyMessage"><small>故事訊息　／　獲取 '+s.mission+'</small><h2>屬性歸零</h2>'+flowCard(s.mission,'本局使命')+'<p>'+esc(e?.[1]||'請閱讀《獲取》故事書中的使命條目。')+'</p>'+storyRefs(e?.[1]||'','take',s.reading||{},'crisis')+btn('依條目作最後一搏','lastStand()')+btn('結算探險','ending()')+'</section>'}
function lastStand(){if(!s.stats.includes(0)||s.phase==='ended')return;tripEvent('最後一搏','選擇擲出 10 顆挑戰骰，嘗試挽回旅程。');refresh();for(let f of throwDice('c',10,'最後一搏')){let d=statNames.indexOf(faces[f]);if(d>=0)stat(d,1)}if(s.stats.includes(0)){s.phase='ended';s.end='最後一搏未能挽回旅程';tripEvent(s.end)}save()}
function go(v){tab=v;notice='';save()}
function render(){if(tab==='行囊')tab='探險';let html;if(!s)html=home();else if(s.phase==='ended')html='<section class="hero"><div><small>第 '+s.turn+' 回合</small><h1>'+esc(s.end)+'</h1></div></section>'+goalPanel()+journalPanel()+btn('開始新的旅程','newJourney()',true);else if(['mission','escape','crash'].includes(s.phase))html=setup();else html='<div class="group">'+['探險','地圖','日記','手冊'].map(v=>btn(v,'go('+JSON.stringify(v)+')',v===tab)).join('')+'</div><div class="stats"><div class="statsRow statsMainRow">'+statNames.map((v,i)=>'<span>'+statArt(i)+v+' '+s.stats[i]+'</span>').join('')+'<span>'+cubeArt()+'強化 '+(s.boost[s.grid[4]]||0)+'</span><span onclick="showPoolHelp()" style="cursor:pointer;" title="點擊查看骰池規則">骰池 '+pool()+'/10</span><span onclick="showPoolHelp()" style="cursor:pointer;" title="點擊查看懲罰規則">⚠️ 懲罰 '+s.penalty+'</span></div><div class="statsRow statsSubRow">'+skills.map((v,i)=>'<span>'+tokenArt('skill-'+i)+v+' '+s.skill[i]+'</span>').join('')+'<span>'+tokenArt('coin-1')+'錢幣 '+s.money+'</span></div></div>'+(tab==='手冊'?records():tab==='地圖'?mapPanel():tab==='日記'?diaryPanel():s.stats.includes(0)&&s.phase!=='dice'?crisis():'<section class="panel locationPanel fullWidthLocation"><small>第 '+s.turn+' 回合</small><h2>地點 '+pad(s.loc)+'</h2>'+flowCard(s.loc,'當前地點',locationCaptions[s.loc]||cardSummary(s.loc))+'</section><div class="play"><div class="leftCol"><section class="panel actionPanel">'+mainTurn()+'</section></div><div class="rightCol playerCol"><section class="panel" id="bagSection">'+bag()+'</section></div></div>');if(s&&s.phase!=='ended')html='<div class="voyageNav">'+btn('開始一段新旅程','newJourney(true)')+'</div>'+html;app.innerHTML=(notice?'<p role="status">'+esc(notice)+'</p>':'')+html}
if(s?.phase==='cost'&&s.a?.cost==null){
 const row=Object.entries(stories).find(([k,r])=>k.split(':')[1]===s.a.book&&r[0]===s.a.id&&r[2]!=null&&r[5]===s.a.title);
 if(row)s.a.cost=row[1][2];else{s.used=s.used.filter(k=>k!==s.a.key);s.a=null;s.phase='ready';notice='舊版行動缺少費用，請重新選擇行動。'}
}
if(s?.a?.event==='story:look:0172:01'&&s.a.text?.includes('北邊的自的地')){
 s.a.text=stories['story:look:0172:01'][1];delete s.a.choice;delete s.a.receipts;delete s.a.applied;notice='已修復條目172的選擇分支。';
}
if(s)save();else render();
