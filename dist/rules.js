const ruleFacts={"shelters":[1265,1283,1289,1290,1687,1688,1689,1690,1691,1692,1701],"loyal":[805,809,811,815,818,833,835,839,842,844,849,852,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,1129,1130,1131,1132,1133,1134,1222],"business":[1266,1267,1268,1269,1271,1272,1273,1275,1276,1277,1278,1279,1280,1282,1284,1285,1286,1287,1288,1291,1293],"beforeOverpower":[],"teleport":[1369],"value":{"803":6,"804":4,"805":8,"806":3,"807":15,"808":5,"809":10,"810":3,"811":6,"812":6,"813":5,"814":2,"815":4,"816":4,"817":3,"818":6,"819":4,"820":2,"821":4,"822":5,"824":4,"825":5,"826":2,"827":5,"828":3,"829":5,"831":2,"833":14,"835":3,"836":4,"837":4,"838":2,"839":4,"840":6,"841":4,"842":8,"844":2,"845":3,"846":8,"848":3,"849":6,"850":4,"851":5,"852":10,"853":2,"854":4,"855":6,"858":2,"860":3,"861":8,"862":5,"863":4,"864":2,"865":9,"866":5,"867":2,"868":4,"869":2,"870":5,"872":4,"873":5,"874":5,"875":4,"876":4,"877":6,"878":6,"880":4,"881":2,"882":2,"883":2,"884":5,"885":6,"886":10,"887":10,"888":10,"889":10,"890":5,"891":6,"892":10,"893":10,"897":5,"898":4,"899":2,"900":10,"902":2,"903":8,"904":3,"906":5,"907":3,"908":4,"909":3,"910":5,"911":3,"912":5,"913":3,"914":4,"915":5,"916":5,"918":5,"919":5,"920":5,"921":4,"922":5,"923":5,"924":6,"925":6,"927":4,"929":6,"930":6,"932":5,"933":4,"934":10,"938":5,"940":5,"942":6,"943":5,"945":5,"947":3,"949":8,"950":10,"951":2,"954":2,"955":5,"956":4,"958":4,"959":5,"963":3,"964":5,"965":8,"966":5,"967":6,"968":5,"969":4,"970":6,"971":5,"972":5,"973":5,"974":5,"976":5,"977":13,"978":13,"979":13,"980":10,"981":12,"982":6,"988":9,"990":15,"991":15,"992":15,"993":15,"994":15,"995":15,"996":9,"997":20,"998":20,"999":20,"1000":20,"1001":20,"1003":20,"1004":20,"1005":20,"1006":20,"1007":20,"1008":20,"1009":15,"1011":15,"1018":3,"1019":4,"1021":3,"1025":15,"1035":20,"1036":6,"1038":8,"1039":3,"1041":4,"1042":4,"1043":6,"1044":3,"1045":6,"1046":6,"1047":5,"1048":3,"1049":6,"1050":4,"1051":5,"1052":6,"1053":5,"1054":3,"1055":3,"1056":7,"1057":3,"1058":8,"1059":6,"1060":5,"1061":8,"1062":6,"1063":3,"1064":5,"1065":6,"1066":3,"1067":4,"1068":6,"1069":5,"1070":6,"1071":6,"1072":5,"1073":6,"1074":3,"1075":5,"1076":6,"1077":3,"1078":3,"1079":5,"1080":4,"1081":3,"1082":5,"1083":11,"1084":9,"1085":5,"1086":4,"1088":6,"1089":8,"1090":8,"1091":2,"1107":4,"1108":12,"1109":6,"1111":12,"1112":10,"1113":8,"1114":8,"1115":4,"1116":8,"1117":10,"1118":8,"1119":8,"1120":10,"1121":4,"1123":6,"1124":4,"1125":8,"1126":8,"1127":12,"1128":3,"1129":16,"1130":14,"1131":8,"1132":4,"1133":8,"1134":12,"1136":3,"1141":20,"1152":5,"1153":8,"1155":13,"1157":20,"1158":3,"1159":4,"1160":5,"1161":5,"1162":5,"1163":5,"1164":5,"1165":5,"1172":9,"1173":9,"1174":9,"1175":9,"1176":9,"1177":9,"1179":2,"1180":2,"1181":2,"1182":2,"1183":2,"1184":2,"1185":2,"1186":2,"1187":2,"1188":3,"1189":6,"1190":2,"1191":8,"1192":6,"1193":4,"1194":2,"1195":15,"1196":15,"1197":15,"1198":15,"1199":15,"1200":15,"1201":15,"1202":15,"1203":15,"1204":15,"1205":15,"1206":15,"1207":2,"1210":3,"1211":2,"1212":2,"1214":6,"1215":6,"1216":15,"1221":4,"1222":8,"1223":3,"1225":15,"1227":4,"1229":4,"1230":4,"1231":4,"1232":8,"1233":5,"1234":2,"1235":2,"1299":2,"1301":2,"1302":2,"1303":2,"1304":2,"1410":2,"1411":2,"1412":2,"1413":2,"1414":2,"1415":2,"1416":2,"1417":2,"1418":2,"1475":3,"1265":25,"1266":15,"1267":25,"1268":25,"1269":25,"1270":20,"1271":25,"1272":25,"1273":20,"1274":20,"1275":15,"1276":25,"1277":25,"1278":25,"1279":15,"1280":20,"1281":20,"1282":25,"1283":20,"1284":25,"1285":25,"1286":20,"1287":25,"1288":15,"1289":20,"1290":25,"1291":20,"1292":20,"1293":20,"1687":35,"1688":35,"1689":35,"1690":35,"1691":35,"1692":35,"1701":35,"1696":8,"1698":8}};
const cityLocations=new Set(Object.values(WORLD.stories).flatMap(row=>Array.from(row[1].matchAll(/(?:前往|進入|返回)城市\s*(\d{3})(?!\d)/g),m=>Number(m[1]))));
// Mutations originate from the current action, an owned card or a pending placement.
function activePlayer(){
 return s && ['ready','cost','dice','result'].includes(s.phase) && !s.stats.includes(0) && !s.duel
}
function closeArtifactLocation(id){
 s.closedArtifactLocations??=[];
 if(!s.closedArtifactLocations.includes(id))s.closedArtifactLocations.push(id)
}
function actionEligible(id,a){
 if(id===1657&&!(s.loc===690&&s.grid.includes(1657)))return false;
 if(id===1676&&s.loc!==274)return false;
 if(printedReplacementRecipes[a.event_uid]&&(s.boost[printedReplacementRecipes[a.event_uid].source]||0)<printedCraftBoost(a.event_uid))return false;
 if(a.event_uid==='story:help:0646:scan:01'&&!offering646Cards().length)return false;
 if(cards[id]?.home==='location'&&s.closedArtifactLocations?.includes(id))return false;
 const limit=s.restrictedResidence;
 if(limit?.id===id&&limit.turn===s.turn&&a.book==='engage'&&limit.action===a.action)return false;
 const event=stories[a.event_uid];
 return !!event && event[0]===id && event[2]!=null && keys.includes(a.book)
}
function reserveLimit(){return reserveSources().reduce((total,n)=>total+reserveIcons[n],0)}
function reserveNew(n){
 if(s.unplaced?.[0]!==n||s.grid.includes(0))return;
 s.unplaced.shift();s.reserve.push(n);save()
}
function discardOverflow(n){
 const i=s.reserve.indexOf(n);
 if(i<0||reserveSize()<=reserveLimit())return;
 s.reserve.splice(i,1);delete s.boost[n];delete s.markers[n];
 for(const q of cards[n].slots)delete s.occupied[q.uid];
 tripEvent('儲備超出容量','選擇失去卡牌 '+n+'。');save()
}
function heroTransferControls(){
 const hero=s.grid[4],options=s.reserve.filter(n=>cards[n]?.orientation==='portrait');
 if(!activePlayer()||!options.length)return '';
 const boost=s.boost[hero]||0;
 if(boost>=1){
  return '<div class="heroTransferBox">'+
   '<button type="button" class="btnTransferTrigger primary" onclick="openTransferModal()">🔄 轉移儲備卡牌至網格（消耗 1 角色強化，現有 '+boost+' 強化）</button>'+
  '</div>';
 }
 return '<div class="heroTransferBox">'+
  '<button type="button" class="btnTransferTrigger disabled" disabled title="角色需要 1 點強化">🔒 轉移儲備卡牌至網格（角色需要 1 點強化，目前為 0）</button>'+
 '</div>';
}
function openTransferModal(preselectedId){
 const hero=s.grid[4],options=s.reserve.filter(n=>cards[n]?.orientation==='portrait');
 if(!options.length)return warn('儲備區中沒有可裝備至網格的垂直卡牌。');
 if((s.boost[hero]||0)<1)return warn('角色需要 1 點強化才能將儲備卡牌轉入網格。');
 const selId=(preselectedId&&options.includes(preselectedId))?preselectedId:options[0];
 renderTransferModal(selId);
 const modal=document.getElementById('transferModal');
 if(modal&&typeof modal.showModal==='function'){
  if(!modal.open)modal.showModal();
 }
}
function renderTransferModal(selId){
 const hero=s.grid[4],heroBoost=s.boost[hero]||0;
 const options=s.reserve.filter(n=>cards[n]?.orientation==='portrait');
 const selCard=cards[selId];
 let html='<div class="transferModalContent">'+
  '<div class="transferModalHead">'+
    '<h3>🔄 裝備儲備卡牌至 3×3 行囊網格</h3>'+
    '<button type="button" class="btnModalClose" onclick="transferModal.close()">關閉 ×</button>'+
  '</div>'+
  '<p class="transferModalDesc">消耗 <b>1 點角色強化</b>（角色現有 <b>'+heroBoost+'</b> 點強化）。請點選下方<b>角色周圍的網格卡牌以替換</b>，或點選<b>空位放入</b>：</p>';
 if(options.length>1){
  html+='<div class="transferStepSection">'+
   '<span class="pickerLabel">選擇要裝備的儲備牌：</span>'+
   '<div class="transferReservePicker">'+options.map(n=>{
     const isSel=n===selId;
     return '<button type="button" class="pickerBtn '+(isSel?'active':'')+'" onclick="renderTransferModal('+n+')">'+
       '<img src="cards/'+n+'.webp" alt="卡牌 '+n+'" class="pickerImg">'+
       '<b>'+esc(cards[n]?.name||('卡牌 '+n))+'</b>'+
     '</button>';
   }).join('')+'</div>'+
  '</div>';
 }
 html+='<div class="transferSelectedPreview">'+
   '<div class="selectedCardThumbWrap"><img src="cards/'+selId+'.webp" alt="卡牌 '+selId+'" class="selectedCardImg"></div>'+
   '<div class="selectedCardMeta">'+
     '<b class="selectedCardName">'+esc(selCard?.name||('卡牌 '+selId))+'</b>'+
     '<small class="selectedCardId">卡牌編號 '+selId+'</small>'+
     '<span class="readyBadge">👉 準備裝備：請在下方 3×3 網格中點選要替換的卡牌或空位</span>'+
   '</div>'+
 '</div>';
 html+='<div class="transferStepSection">'+
  '<div class="gridPickerNotice"><b>3×3 行囊網格位置選擇（點擊卡牌進行替換）：</b></div>'+
  '<div class="transferGridBoard">'+
    s.grid.map((n,i)=>{
      if(i===4){
        return '<div class="transferSlot centerHeroSlot">'+
          '<span class="slotIndexBadge">第 5 格</span>'+
          '<div class="slotCardThumb"><img src="cards/'+n+'.webp" alt="角色"></div>'+
          '<b class="slotHeroTitle">★ 角色</b>'+
          '<small class="slotLockNote">核心卡（不可替換）</small>'+
        '</div>';
      }
      if(!n){
        return '<button type="button" class="transferSlot emptySlotBtn" onclick="executeTransfer('+selId+','+i+')">'+
          '<span class="slotIndexBadge">第 '+(i+1)+' 格</span>'+
          '<div class="emptySlotAction">＋ 空位</div>'+
          '<span class="slotPutPrompt">點擊放入此格</span>'+
        '</button>';
      }
      return '<button type="button" class="transferSlot occupiedSlotBtn" onclick="executeTransfer('+selId+','+i+')">'+
        '<span class="slotIndexBadge">第 '+(i+1)+' 格</span>'+
        '<div class="slotCardThumb"><img src="cards/'+n+'.webp" alt="卡牌 '+n+'"></div>'+
        '<b class="slotOccupiedTitle">'+esc(cards[n]?.name||('卡牌 '+n))+'</b>'+
        '<div class="slotSwapPrompt">🔄 替換此卡<br><small>原卡移入儲備區</small></div>'+
      '</button>';
    }).join('')+
  '</div>'+
 '</div>'+
 '<div class="transferModalFoot">'+
   '<button type="button" class="btnModalCancel" onclick="transferModal.close()">取消</button>'+
 '</div>'+
 '</div>';
 const body=document.getElementById('transferModalBody');
 if(body)body.innerHTML=html;
}
function executeTransfer(n,i){
 const hero=s.grid[4],source=s.reserve.indexOf(n);
 if(!activePlayer()||source<0||cards[n]?.orientation!=='portrait'||!(s.boost[hero]>=1))return;
 if(!Number.isInteger(i)||i<0||i>8||i===4)return;
 const old=s.grid[i];
 s.boost[hero]--;
 s.reserve.splice(source,1);
 if(old){
  s.reserve.push(old);
  for(const q of cards[old].slots)delete s.occupied[q.uid];
 }
 s.grid[i]=n;
 if(n===1259){
  const adjCount=(typeof gridAdjacentSlots==='function'?gridAdjacentSlots(i):[]).filter(j=>s.grid[j]&&j!==i).length;
  s.boost[n]=Math.min(cards[n].cap,adjCount);
 }
 checkGridMilestone();
 const transferDesc='支付 1 角色強化，將卡牌 '+n+' 裝備至第 '+(i+1)+' 格'+(old?'，原卡牌 '+old+' 移入儲備區':'')+'。';
 tripEvent('轉入網格',transferDesc);
 s.log.push(transferDesc);
 const modal=document.getElementById('transferModal');
 if(modal&&modal.open)modal.close();
 save();
 render();
}
function heroTransfer(n,i){
 if(Number.isInteger(n)&&Number.isInteger(i)){
  executeTransfer(n,i);
  return;
 }
 if(document.getElementById('transferCard')){
  const cardVal=Number(val('transferCard')),slotVal=Number(document.getElementById('transferSlot')?.value);
  let target=s.grid.findIndex((v,j)=>j!==4&&!v);
  if(target<0&&Number.isInteger(slotVal))target=slotVal;
  if(Number.isInteger(cardVal)&&Number.isInteger(target)&&target>=0&&target<=8&&target!==4){
   executeTransfer(cardVal,target);
   return;
  }
 }
 openTransferModal();
}
function resultText(){
 if(s?.phase!=='result'||!s.a||s.stats.includes(0))return '';
 const part=storyParts(s.a.text,s.a.choice);
 if(!part.branched)return [part.shown,...referencedOutcomes(s.a).texts].join('。');
 if(!s.a.choice)return '';
 const selected=part.parts[s.a.choice].slice(1),i=selected.search(/[：:]/);
 return [i<0?selected:selected.slice(i+1),...referencedOutcomes(s.a).texts].join('。')
}
function travelTargets(t){
 const destinations=[];
 for(const m of t.replace(/\s+/g,'').matchAll(/(?:前往|退出至|返回至|移動至|抵達)(?:地點|洞穴|城市|地城|內部|地底|水下)?(\d{3})(?!\d)/g)){
  const n=+m[1];if((n===1||cards[n]?.home==='location')&&!destinations.includes(n))destinations.push(n)
 }
 return destinations
}
const skyLocations=new Set(Object.values(WORLD.stories).filter(r=>/返回(?:到)?你的地面地點/.test(r[1].replace(/\s/g,''))).map(r=>r[0]));
function lastTakeoff(){
 if(!skyLocations.has(s.loc))return null;
 let trip=s.lastActionTravel;
 if(trip===undefined){
  const last=s.journal?.at(-1),arrival=s.voyage?.at(-1);
  if(last&&arrival?.title==='抵達地點 '+pad(s.loc)&&arrival.turn===last.turn)trip={from:last.loc,to:s.loc}
 }
 if(trip?.to!==s.loc||skyLocations.has(trip.from)||cards[trip.from]?.home!=='location')return null;
 return trip.from
}
function skyLandingOptions(t){
 if(!t.includes('降落在西北'))return [];
 return Array.from(t.matchAll(/(西北|東北|東南|西南)方?[（(](\d{3})[）)]/g),m=>({direction:m[1],id:+m[2]}))
}
function storyTravel(t){
 t=t.replace(/\s/g,'');
 if(t.includes('返回你最初進入地城的洞穴地點')&&s.dungeonEntrance)return [s.dungeonEntrance];
 const sky=skyLandingOptions(t);
 if(sky.length===4)return sky.map(o=>o.id);
 if(/(?:返回|前往)你剛[才剛]起飛的地點/.test(t)&&lastTakeoff())return [lastTakeoff()];
 if(s.a?.sold&&t.includes('獲得其價值加$1'))t=t.slice(t.indexOf('獲得其價值加$1')+'獲得其價值加$1'.length);
 const targets=travelTargets(t);
 if(!targets.length)return [];
 const relevant=t.split(/[。！？]/).filter(x=>travelTargets(x).length).join('。');
 if(/如果|否則|僅當|只有|若|支付|擲|至少|參閱|除非|失去.{0,6}(?:卡|牌)|每[個張]/.test(relevant))return [];
 if(targets.length>1&&!/選擇|或者|或向|或前往/.test(relevant))return [];
 return targets
}
function chooseRoute(i){
 if(pendingStoryDuel())return;
 const a=s.a,t=resultText(),options=storyTravel(t);
 if(!t||a.dest||!options[i]||options.length<2)return;
 a.dest=options[i];noteDecision('選擇前往地點 '+pad(a.dest)+'。');save()
}
const eggFaces={
 977:[807,807,807,807,807,807],978:[813,813,814,814,816,816],
 979:[837,837,837,838,838,838],1155:[810,810,824,824,825,825],
 1213:[803,816,820,820,826,826]
};
function ownedEggs(){return [...s.grid,...s.reserve].filter(n=>eggFaces[n])}
function hatchEgg(n,a){
 const slot=s.grid.indexOf(n),animal=eggFaces[n][n===977?0:throwDice('s',1,'孵化蛋 '+n)[0]];
 if(slot>=0)s.grid[slot]=0;else s.reserve.splice(s.reserve.indexOf(n),1);
 delete s.boost[n];delete s.markers[n];
 for(const q of cards[n].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
 if(![...s.grid,...s.reserve].includes(animal)){
  if(slot>=0){s.grid[slot]=animal;s.boost[animal]=Math.min(cards[animal].initial,cards[animal].cap)}
  else s.reserve.push(animal);
 }
 a.hatchedEgg=n;(a.revealedCards??=[]).push(animal);
 noteDecision('蛋 '+n+' 孵化為動物 '+animal+'。')
}
function branchTerms(text){
 if(s.a?.trapAnimalStage&&/^·帶走動物\d+，失去陷阱：/.test(text))return {};
 let title=text.slice(1).split(/[：:]/)[0].replace(/\s/g,'').replace(/^如果你未支付移動$/,'不支付1點移動').replace(/支付(\d+)(移動|查看|接觸|幫助|獲取|壓制)/,'支付$1點$2');
 if(title==='支付1點查看，或已解除甲蟲威脅'){
  const cleared=s.used.some(key=>['action:0684:04','action:0684:05','action:0684:06'].includes(key));
  return cleared?{}:{'查看':1}
 }
 if(s.a?.event==='story:engage:1588:01'){
  const item=1299+s.hero,owned=[...s.grid,...s.reserve,...s.supply];
  const hasGoal=[1609,1615,1621].some(first=>owned.includes(first+s.hero));
  if(title==='如果你尚未裝備角色的個人物品')return s.grid.includes(item)?null:{};
  if(title==='如果你擁有角色的個人物品而沒有個人目標')return owned.includes(item)&&!hasGoal?{}:null;
  if(title==='如果你擁有角色的個人目標')return hasGoal?{}:null
 }
 if(s.a?.event==='story:help:0310:recovered:0089'&&title.startsWith('交出')){
  const crystal=Number(title.slice(-4));
  return s.a.tradedCrystal===crystal||[...s.grid,...s.reserve].includes(crystal)?{}:null
 }
 if(title==='出售此構築物（需3點強化）'){
  const a=s.a;
  return a?.serviceIncome!==undefined&&(a.soldStructure||((s.boost[a.id]||0)>=3&&[...s.supply,...s.grid].includes(a.id)))?{}:null
 }
 if(title==='如果你沒有蛋')return ownedEggs().length?null:{};
 if(title==='如果你擁有一個蛋')return ownedEggs().length||s.a?.hatchedEgg?{}:null;
 if(/^返回(?:到)?你的地面地點/.test(title))return lastTakeoff()?{}:null;
 if(/^.*長期騙局[（(]失去1點時間[）)]$/.test(title))return {'時間':1};
 if(title.endsWith('（失去這名智慧生物）')&&sentientTradeoffs.has(s.a?.event))return s.grid.includes(s.a.id)?{}:null;
 if(/^(?:如果你|若你|你)?(?:不支付|不購買|拒絕)/.test(title))return {};
 title=title.replace(/^(?:如果你|若你)(?=支付)/,'');
 const matches=[...title.matchAll(/(?:支付|花費)(?:[$＄](\d+)|(\d+)(?:點|枚)?(強化|錢幣|移動|查看|接觸|幫助|獲取|壓制|生命|時間|士氣))/g)];
 const rest=title.replace(/(?:支付|花費)(?:[$＄]\d+|\d+(?:點|枚)?(?:強化|錢幣|移動|查看|接觸|幫助|獲取|壓制|生命|時間|士氣))/g,'');
 if(/支付|花費|失去|如果|僅當|若你|只有|必須擁有|出售物品/.test(rest))return null;
 const costs={};
 for(const m of matches){const unit=m[3]||'錢幣';costs[unit]=(costs[unit]||0)+Number(m[1]||m[2])}
 return costs
}
function resourceAccount(kind){
 if(kind==='錢幣')return [s,'money'];
 if(kind==='強化')return [s.boost,s.a.kind==='卡牌'&&s.grid.includes(s.a.id)?s.a.id:s.grid[4]];
 if(skills.includes(kind))return [s.skill,skills.indexOf(kind)];
 return [s.stats,statNames.indexOf(kind)]
}
function affordable(costs){
 return costs!==null&&Object.entries(costs).every(([k,v])=>{const [o,key]=resourceAccount(k);return (o[key]||0)>=v})
}
function isItemSale(part){
 return part.startsWith('·按卡牌價值出售一張牌：')||part.startsWith('·出售物品、動物或植物：')||part.replace(/\s/g,'').includes('向其出售物品：智慧生物欣然接受你的提議。失去1張牌並獲得其價值加$1')
}
function saleBonus(){if(s.a.event==='story:engage:0476:01')return 2;return ['story:engage:0568:01','story:look:0568:01','story:engage:0258:01','story:engage:0504:01'].includes(s.a.event)?0:1}
function sellableItems(){
 const types=s.a.event==='story:engage:0568:01'?['item','animal','flora']:['item'];
 const stock=s.a.event==='story:engage:0504:01'?[...s.grid,...s.reserve,...s.supply]:[...s.grid,...s.reserve];
 return [...new Set(stock)].filter(n=>(['story:look:0568:01','story:engage:0258:01','story:engage:0504:01','story:engage:0476:01'].includes(s.a.event)||types.includes(cards[n]?.home))&&Number.isFinite(ruleFacts.value[n]))
}
function sellItem(index,n){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||a.choice!=null||!sellableItems().includes(n))return;
 const {parts,branched}=storyParts(a.text);
 if(!branched||!parts[index]||!isItemSale(parts[index]))return;
 const slot=s.grid.indexOf(n);
 if(slot>=0)s.grid[slot]=0;
 else if(s.reserve.includes(n))s.reserve.splice(s.reserve.indexOf(n),1);
 else s.supply.splice(s.supply.indexOf(n),1);
 for(const q of cards[n].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
 delete s.boost[n];delete s.markers[n];
 const price=ruleFacts.value[n]+saleBonus();
 s.money+=price;a.choice=index;a.sold=n;
 (a.receipts??={}).sale='出售卡牌 '+n+'，獲得 '+price+' 錢幣';
 noteDecision(a.receipts.sale);
 if(a.event==='story:engage:0476:01'){a.residentSaleDone=true;a.text=resident476Shop;delete a.applied;delete a.choice}
 if(a.event==='story:look:0568:01'||(a.event==='story:engage:0258:01'&&!a.peddlerBought)){
  a.text=a.event==='story:look:0568:01'?goggleAfterSale:peddlerAfterSale;delete a.choice
 }
 save()
}
function discardFedCard(n){
 const slot=s.grid.indexOf(n);
 if(slot>=0)s.grid[slot]=0;else s.reserve.splice(s.reserve.indexOf(n),1);
 delete s.boost[n];delete s.markers[n];
 for(const q of cards[n].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
}
function spendFeedBoost(n){
 s.boost[n]--;
 if(s.boost[n]===0&&[1217,1224,1226].includes(n)){
  discardFedCard(n);noteDecision('食物耗盡，失去卡牌 '+n+'。')
 }
}
function turtleFoodCards(){
 return [...s.grid,...s.reserve].filter(n=>cards[n]?.home==='flora'||cards[n]?.name.includes('食物')||[1181,1232].includes(n))
}
function spiderFoodCards(){
 return s.grid.filter(n=>s.boost[n]>0&&(cards[n]?.home==='animal'||[1181,1186,1217,1224,1226,1232,1244].includes(n)))
}
const syncColumnEvents=new Set(Object.entries(WORLD.stories).filter(([,row])=>
 row[1].replace(/\s/g,'').includes('你和另一位玩家可以刷新各自網格任意1列的所有挑戰骰')
).map(([event])=>event));
function syncColumnButtons(a){
 if(!syncColumnEvents.has(a.event)||a.syncColumn!=null||a.choice!=null)return '';
 return [0,1,2].filter(c=>syncColumnSlots(c).length)
  .map(c=>btn('刷新第 '+(c+1)+' 列','refreshSyncColumn('+c+')')).join('')
}
function syncColumnSlots(column){
 return s.grid.flatMap((n,i)=>i%3===column?(cards[n]?.slots||[]).filter(q=>s.occupied[q.uid]):[])
}
function refreshSyncColumn(column){
 if(!activePlayer()||s.phase!=='result'||!syncColumnEvents.has(s.a?.event)||s.a.syncColumn!=null||s.a.choice!=null||![0,1,2].includes(column))return;
 const slots=syncColumnSlots(column);if(!slots.length)return;
 for(const q of slots)delete s.occupied[q.uid];
 s.a.syncColumn=column;noteDecision('刷新第 '+(column+1)+' 列的挑戰骰。');save()
}
function ritualCompanions(){return [...new Set([...s.grid,...s.reserve])].filter(n=>cards[n]?.home==='sentient'&&(n<1325||n>1329))}
function fireDiceSlots(){return s.grid.flatMap(n=>(cards[n]?.slots||[]).filter(q=>s.occupied[q.uid]!=null).map(q=>({id:n,uid:q.uid})))}
function branchButtons(parts){
 if(s.a?.chest?.hazard)return '';
 return parts.slice(1).map((p,i)=>{
  const label=p.slice(1).split(/[：:；。]/)[0],costs=branchTerms(p);
  if(printedReplacementRecipes[s.a.event]?.floraBrew&&i===1&&(s.boost[printedReplacementRecipes[s.a.event].source]||0)<1)return '<button disabled>'+esc(label)+'（需要植物上有 1 點強化）</button>';
  if(fireEvents.has(s.a.event)){
   if(!s.a.fireBenefit&&i===0){const slots=fireDiceSlots();return slots.length?slots.map((q,k)=>btn('刷新卡牌 '+q.id+' 的挑戰骰（'+(k+1)+'）','selectBranch(1,'+k+')')).join(''):'<button disabled>沒有可刷新的挑戰骰</button>'}
   if(!s.a.fireBenefit&&i===2){const eggs=ownedEggs();return eggs.length?eggs.map(n=>flowCard(n,'蛋')+btn('在蛋 '+n+' 上添加 1 點強化','selectBranch(3,'+n+')')).join(''):'<button disabled>沒有蛋可強化</button>'}
   if(s.a.fireBenefit&&i===0&&![...s.grid,...s.reserve].includes(1180))return '<button disabled>沒有木頭 1180</button>';
  }

  if(s.a.event==='story:engage:0301:01'&&i===1){
   const stock=ritualCompanions();
   return stock.length?stock.map(n=>flowCard(n,'可獻出的智慧生物')+btn('獻出卡牌 '+n+'，取得物品並解除能量詛咒','selectBranch(2,'+n+')')).join(''):'<button disabled>沒有非能量智慧生物</button>';
  }
  if(s.a.event==='story:engage:0178:01'&&i===1){
   const stock=[...new Set([...s.grid,...s.reserve])].filter(n=>Number.isFinite(ruleFacts.value[n]));
   return stock.length?stock.map(n=>flowCard(n,'可交換')+btn('交出卡牌 '+n+'，換取花朵','selectBranch(2,'+n+')')).join(''):'<button disabled>沒有可交換的有價值卡牌</button>';
  }
  if(curseReliefOutcomes.has(s.a?.event)&&label==='解除一個詛咒'){
   const curses=[...s.grid,...s.reserve,...s.supply].filter(n=>n>=1385&&n<=1396);
   return curses.length?curses.map(n=>flowCard(n,'詛咒')+btn('解除詛咒 '+n,'selectBranch(1,'+n+')')).join(''):'<button disabled>解除詛咒（目前沒有詛咒）</button>'
  }
  if(s.a.event==='story:engage:0381:01'&&i===1){
   const food=turtleFoodCards().filter(n=>s.boost[n]>0);
   return food.length?food.map(n=>flowCard(n,'可用強化')+btn('從卡牌 '+n+' 取下1點強化','selectBranch(2,'+n+')')).join(''):'<button disabled>沒有帶強化的植物或食物牌</button>'
  }
  if(['story:take:0381:01','story:engage:0381:01'].includes(s.a.event)&&i===0){
   const food=turtleFoodCards();
   return food.length?food.map(n=>flowCard(n,'可餵食')+btn('餵食卡牌 '+n,'selectBranch(1,'+n+')')).join(''):'<button disabled>餵食海龜（沒有植物或食物牌）</button>'
  }
  const follow=preparationChoices.has(s.a?.event)&&!s.a.preparationResolved?null:discountedFollowups.get(s.a?.event)?.[i];
  if(follow&&!follow.allowRepeat&&s.used.includes(follow.action_uid))return '<button disabled>'+esc(label)+'（已在此地點執行）</button>';
  if(s.a?.event==='story:overpower:0681:01'&&i===1){
   const food=spiderFoodCards();
   return food.length?food.map(n=>flowCard(n,'可用於餵養')+btn('從 '+n+' 支付 1 點強化，餵養蜘蛛（幫助 2）','selectBranch(2,'+n+')')).join(''):'<button disabled>餵養蜘蛛（需要食物、動物或肌腱牌上的 1 點強化）</button>'
  }
  if(s.a?.serviceIncome!==undefined&&label==='收取營業收入')return btn('收取 '+s.a.serviceIncome+' 錢幣並保留構築物','selectBranch('+(i+1)+')');
  if(s.a?.serviceIncome!==undefined&&label==='出售此構築物（需3點強化）'){
   const title='出售構築物，收取 '+serviceValues[s.a.id]+' 錢幣';
   return affordable(costs)?btn(title+'（消耗 3 點強化）','selectBranch('+(i+1)+')'):'<button disabled>'+title+'（需要構築物上有 3 點強化）</button>'
  }
  if(label==='強化一個蛋')return ownedEggs().map(n=>btn('在蛋 '+n+' 上添加 2 點強化','selectBranch('+(i+1)+','+n+')')).join('');
  if(label==='如果你擁有一個蛋')return ownedEggs().map(n=>btn('孵化蛋 '+n+'（士氣 +1）','selectBranch('+(i+1)+','+n+')')).join('');
  if(label==='如果你沒有蛋'&&ownedEggs().length)return '';
  if(/^返回(?:到)?你的地面地點/.test(label)){
   const ground=lastTakeoff();
   return ground?btn('返回起飛地點 '+pad(ground)+'（獲得 1 點強化）','selectBranch('+(i+1)+')'):'<button disabled>返回起飛地點（限上一個行動從地面飛抵時）</button>'
  }
  if(isItemSale(p)){
   const items=sellableItems();
   return items.length?'<details><summary>'+esc(label)+'</summary>'+items.map(n=>flowCard(n,'可出售')+btn('出售 '+n+'（獲得 '+(ruleFacts.value[n]+saleBonus())+' 錢幣）','sellItem('+(i+1)+','+n+')')).join('')+'</details>':'<button disabled>'+esc(label)+'（沒有可出售的卡牌）</button>'
  }
  const button=affordable(costs)?btn(label,'selectBranch('+(i+1)+')'):'<button disabled>'+esc(label)+'（'+(costs?'資源不足':'條件尚未核實')+'）</button>'
  return choiceWithCards(p,button)
 }).join('')
}
function selectBranch(index,egg){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||!a||a.choice!=null)return;
 if(a.chest?.hazard)return;
 const {parts,branched,endsTurn}=storyParts(a.text);
 if(!branched||!Number.isInteger(index)||index<=0||index>=parts.length)return;
 const costs=branchTerms(parts[index]);if(!affordable(costs))return;
 if(a.isCardAbility&&typeof resolveCardAbilityBranch==='function')return resolveCardAbilityBranch(a,index,egg);
 if(printedReplacementRecipes[a.event])return finishCircuitCraft(index);

 if(a.event==='story:help:1020:01')return chooseOceanSeed(index);

 if(a.event==='story:help:0989:01'){if(upgradeVehicle(a,index===1?1010:1253))save();return}

 if(a.event==='story:help:0581:01'&&!a.workshop581Done)return selectWorkshop581(index);

 if(a.event==='story:help:0954:01'&&index===1){
  const slot=s.grid.indexOf(954);if(slot<0)return;
  discardFedCard(954);
  if(![...s.grid,...s.reserve,...s.supply,...(s.unplaced||[])].includes(957)){
   s.grid[slot]=957;s.boost[957]=Math.min(cards[957].initial,cards[957].cap);
   (a.revealedCards??=[]).push(957);checkGridMilestone();
  }else creditReward({card:957,label:'滑翔翼957'},a);
  (a.receipts??={}).hammock='已將吊床954替換為滑翔翼957';
  noteDecision('將吊床替換為滑翔翼。');
 }

 if(a.event==='story:engage:0476:01'&&!a.residentSaleDone&&index===2){a.residentSaleDone=true;a.text=resident476Shop;delete a.applied;save();return}

 if(a.event==='story:look:0125:01'&&index===2){a.lavaLayout=newLavaLayout();a.text='排列熔岩迷宮的道路，然後選擇入口。';delete a.choice;save();return}

 if(fireEvents.has(a.event)){
  if(!a.fireBenefit){
   if(index===1){const q=fireDiceSlots()[egg];if(!q)return;delete s.occupied[q.uid];noteDecision('刷新卡牌 '+q.id+' 的一顆挑戰骰。')}
   if(index===2){s.skill[1]++;noteDecision('取得1點查看。')}
   if(index===3){if(!ownedEggs().includes(egg))return;const old=s.boost[egg]||0;s.boost[egg]=Math.min(cards[egg].cap,old+1);noteDecision('蛋 '+egg+' 添加 '+(s.boost[egg]-old)+' 點強化。');if(s.boost[egg]===cards[egg].cap)hatchEgg(egg,a)}
   a.fireBenefit=index;a.text=a.event!=='story:overpower:1409:01'&&[...s.grid,...s.reserve].includes(1180)?fireWoodChoice:'火焰效果已結算。'+fireAftermath(a);save();return
  }
  if(a.text!==fireWoodChoice)return;
  if(index===1){if(![...s.grid,...s.reserve].includes(1180))return;discardFedCard(1180);a.text='獲得物品1084。'+fireAftermath(a);noteDecision('將木頭製作成荊棘火把。')}
  else a.text='你保留了木頭。'+fireAftermath(a);
  save();return
 }

 if(preparationChoices.has(a.event)&&!a.preparationResolved){
  a.preparationResolved=true;
  const label=parts[index].slice(1).split('：')[0];
  if(index<=6){
   const face=throwDice('s',1,'準備：獲得隨機技能')[0];
   s.skill[index-1]++;s.skill[face]++;
   a.text='已取得1點'+skills[index-1]+'與1點'+skills[face]+'。繼續。';
  }else if(index<=9){
   for(const n of s.grid.slice((index-7)*3,(index-6)*3))for(const slot of cards[n]?.slots||[])delete s.occupied[slot.uid];
   a.text='已'+label+'。繼續。';
  }else{
   for(const n of s.grid.filter((n,i)=>n&&i%3===index-10))s.boost[n]=Math.min(cards[n].cap,(s.boost[n]||0)+1);
   a.text='已'+label+'。繼續。';
  }
  if(a.event==='story:look:0117:01')a.text=a.text.replace(/繼續。$/,'你可以繼續執行獲取－取出行動。');
  if(elementPreparationIds.includes(a.id)){a.text=a.text.replace(/繼續。$/,'')+'選擇一項：·幫助－釋放：執行指定行動。·壓制－擊殺：執行指定行動。';}
  noteDecision(label);save();return;
 }
 if(a.event==='story:take:1073:01'&&index===1)s.ignoreMoraleTurn=s.turn;
 if(a.event==='story:take:1072:02'&&!a.plantInsightResolved){
  a.plantInsightResolved=true;
  if(index<=6){
   a.plantInsightDice=throwDice('s',4,'植物靈感：尋找'+skills[index-1]);
   const amount=a.plantInsightDice.filter(face=>face===index-1).length;
   s.skill[index-1]+=amount;
   a.text='你選擇'+skills[index-1]+'，擲出'+a.plantInsightDice.map(face=>skills[face]).join('、')+'。已取得'+amount+'點'+skills[index-1]+'。繼續。';
   noteDecision(a.text);
  }else{
   s.boost[1072]=Math.min(cards[1072].cap,(s.boost[1072]||0)+1);
   a.text='你加深了對植物營養特性的理解，已在植物1072上添加1點強化。';
   noteDecision(a.text);
  }
  save();return;
 }
 if(locationTrapStories[a.id]&&a.event==='story:overpower:'+String(a.id).padStart(4,'0')+':01'&&!a.trapRoll){
  const cfg=locationTrapStories[a.id],target=['時間','士氣','生命'][index-1];if(!target)return;
  a.trapRoll=throwDice('c',3,'陷阱：尋找'+target+'骰面').map(i=>faces[i]);
  noteDecision('陷阱設定為'+target+'，擲出'+a.trapRoll.join('、')+'。');
  if(!a.trapRoll.includes(target))a.text='陷阱沒有得到預期結果。獲得1點壓制。';
  else if(index===1){
   for(const n of s.grid.filter(Boolean)){
    if(n===s.grid[4]||(cards[n]?.slots||[]).some(q=>q.type==='element_specific')||cards[n]?.name?.includes(cfg.elem)){
     s.boost[n]=Math.min(cards[n].cap,(s.boost[n]||0)+1);
    }
   }
   a.text='你觀察了一會兒生物的行為後將其放生。角色與相關'+cfg.elem+'成分牌已獲得1點強化。'+(cfg.bonus?'獲得物品'+cfg.bonus+'。':'');
  }else if(index===2){
   a.text=cfg.vehicle?'巨型海龜感到害怕但順從。獲得載具'+cfg.vehicle+'。':'動物感到害怕但順從。獲得動物'+cfg.animal+'。';
   if(cfg.vehicle)s.boost[cfg.vehicle]=1;
  }else{
   a.text='陷阱立即殺死了動物。獲得物品'+cfg.food+'。'+(cfg.bonus?'獲得物品'+cfg.bonus+'。':'');
  }
  save();return;
 }
 if(a.event?.endsWith(':printed:learn')&&index===2){
  discardFedCard(a.id);noteDecision('失去課程牌 '+a.id+'。');
 }
 if(animalTrapChoices[a.id]&&a.event==='story:overpower:0'+a.id+':01'&&!a.trapRoll){
  const target=['時間','士氣','生命'][index-1];if(!target)return;
  a.trapRoll=throwDice('c',3,'陷阱：尋找'+target+'骰面').map(i=>faces[i]);
  noteDecision('陷阱設定為'+target+'，擲出'+a.trapRoll.join('、')+'。');
  if(!a.trapRoll.includes(target))a.text='陷阱沒有得到預期結果。獲得1點壓制。';
  else if(index===1){
   for(const n of s.grid.filter(n=>n===s.grid[4]||cards[n]?.home==='animal'))s.boost[n]=Math.min(cards[n].cap,(s.boost[n]||0)+1);
   a.text='你觀察動物後將其放生。角色與網格中的每張動物牌已各獲得1點強化。';
  }else if(index===3)a.text='陷阱捕獲了食物。獲得物品1217。';
  else{
   a.trapAnimalStage=true;
   a.text='陷阱捕獲了一隻動物。選擇動物，並決定是否支付1點幫助保留陷阱。選擇一項：'+animalTrapChoices[a.id].flatMap(n=>[
    '·帶走動物'+n+'，失去陷阱：獲得動物'+n+'。',
    '·支付1點幫助，帶走動物'+n+'並保留陷阱：獲得動物'+n+'。'
   ]).join('');
  }
  save();return;
 }
 if(a.trapAnimalStage&&index%2===1){discardFedCard(a.id);noteDecision('失去陷阱 '+a.id+'。');}
 if(a.event==='story:engage:0301:01'&&index===2){
  if(!ritualCompanions().includes(egg))return;
  discardFedCard(egg);noteDecision('獻出智慧生物 '+egg+'。');
  if([...s.grid,...s.reserve].includes(1395)){discardFedCard(1395);noteDecision('解除能量詛咒 1395。');}
 }
 if(a.event==='story:engage:0178:01'&&index===2){
  if(![...s.grid,...s.reserve].includes(egg)||!Number.isFinite(ruleFacts.value[egg]))return;
  discardFedCard(egg);noteDecision('交出卡牌 '+egg+'，換取花朵。');
 }
 if(a.event==='story:engage:0381:01'&&index===2){
  if(!turtleFoodCards().includes(egg)||!(s.boost[egg]>0))return;
  noteDecision('從卡牌 '+egg+' 取下1點強化餵食海龜。');spendFeedBoost(egg)
 }
 if(['story:take:0381:01','story:engage:0381:01'].includes(a.event)&&index===1){
  if(!turtleFoodCards().includes(egg))return;
  discardFedCard(egg);
  noteDecision('餵食海龜，失去卡牌 '+egg+'。')
 }
 if(a.event==='story:take:0762:01'&&index===1)s.promisedExit762=true;
 const follow=discountedFollowups.get(a.event)?.[index-1];
 if(follow){
  if(!follow.allowRepeat&&s.used.includes(follow.action_uid))return;
  const row=stories[follow.event_uid];a.choice=index;noteDecision(parts[index].slice(1).split('：')[0]);rememberStory(a);
  s.used.push(follow.action_uid);
  s.a={id:a.id,origin:s.loc,event:follow.event_uid,key:follow.action_uid,kind:'地點',book:follow.book,name:follow.action,title:row[5],cost:row[2],discount:follow.discount??3,text:row[1],dice:[]};
  s.phase='cost';save();return
 }
 if(immediateEncounters[a.event]?.[index-1]){
  if(s.unplaced?.length||reserveSize()>reserveLimit())return warn('請先完成目前的卡牌取捨。');
  const [name,book,cost,text]=immediateEncounters[a.event][index-1];
  if(a.event==='story:overpower:0681:01'&&index===2){
   if(!spiderFoodCards().includes(egg))return;
   noteDecision('從卡牌 '+egg+' 支付1點強化餵養蜘蛛。');spendFeedBoost(egg)
  }
  a.choice=index;noteDecision(name);rememberStory(a);if(a.event==='story:overpower:0091:01')delete s.clearExit;
  s.a={id:a.id,origin:s.loc,kind:'地點',book,name,title:name,cost,text,dice:[]};
  if(a.event==='story:move:0453:01'&&index===2)s.a.foundryPayment=true;
  if(a.event==='story:depart:0681:01'&&index===2)s.a.defeatsSpider=true;
  if(a.event==='story:engage:0681:01'&&index===2){s.a.event='story:overpower:0681:after-engage';s.a.defeatsSpider=true}
  if(a.event==='story:overpower:0681:01'){s.a.event='story:overpower:0681:after-engage';s.a.defeatsSpider=index===1}
  if(a.defeatsSpider)s.spiderDefeated=true;
  s.phase='cost';save();return
 }
 if(curseReliefOutcomes.has(a.event)&&a.text!==curseReliefOutcomes.get(a.event)){
  if(index===1){
   if(!Number.isInteger(egg)||egg<1385||egg>1396||![...s.grid,...s.reserve,...s.supply].includes(egg))return;
   const slot=s.grid.indexOf(egg);if(slot>=0)s.grid[slot]=0;
   s.reserve=s.reserve.filter(n=>n!==egg);s.supply=s.supply.filter(n=>n!==egg);
   delete s.boost[egg];delete s.markers[egg];
   for(const q of cards[egg].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
   noteDecision('解除詛咒 '+egg+'。')
  }else{creditReward({kind:'士氣',delta:1},a);noteDecision('獲得1點士氣。')}
  a.text=curseReliefOutcomes.get(a.event);save();return
 }
 if(a.event==='story:depart:0094:01'&&index===2&&a.text!==cityGateSearch){
  noteDecision('尋找城市的後門入口。');a.text=cityGateSearch;save();return
 }
 if(a.event==='story:move:0225:01'&&index===2&&a.text!==largeTentText){
  noteDecision('進入較大的帳篷。');a.text=largeTentText;save();return
 }
 if(index===2&&a.serviceIncome!==undefined){
  const n=a.id;
  if(s.supply.includes(n))s.supply.splice(s.supply.indexOf(n),1);
  else if(s.grid.includes(n))s.grid[s.grid.indexOf(n)]=0;
  else return;
  delete s.boost[n];delete s.markers[n];
  for(const q of cards[n].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
  a.soldStructure=true
 }
 if(a.event==='story:overpower:1285:01'){
  const target=index===1?1285:egg;
  if(index===2&&!ownedEggs().includes(target))return;
  const old=s.boost[target]||0;
  s.boost[target]=Math.min(cards[target].cap,old+(index===1?1:2));
  const message='卡牌 '+target+' 增加 '+(s.boost[target]-old)+' 點強化';
  (a.receipts??={}).incubation=message;noteDecision(message);
  if(index===2&&s.boost[target]===cards[target].cap)hatchEgg(target,a)
 }
 if(parts[index].startsWith('·如果你擁有一個蛋：')){
  if(!ownedEggs().includes(egg))return;
  hatchEgg(egg,a)
 }
 for(const [k,v] of Object.entries(costs)){const [o,key]=resourceAccount(k);o[key]-=v}
 if(a.secretEntry===1590){
  const cardId=Number(parts[index].match(/角色牌 (143[5-9]|1440)/)?.[1]);
  if(!cardId||cardId===1435+s.hero||[...s.grid,...s.reserve].includes(cardId))return;
  s.reserve.push(cardId);(a.revealedCards??=[]).push(cardId)
 }
 if(index===3&&sentientTradeoffs.has(a.event)){
  const slot=s.grid.indexOf(a.id);if(slot<0||slot===4)return;
  s.grid[slot]=0;delete s.boost[a.id];delete s.markers[a.id];
  for(const q of cards[a.id].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
 }
 if(index===1&&a.kind==='地點'&&artifactDecisions.has(a.event))closeArtifactLocation(a.id);
 if(a.trainingOptions?.length>1){
  const {id,n}=a.trainingOptions[index-1];s.boost[id]=Math.min(cards[id].cap,(s.boost[id]||0)+n)
 }
 if(index===2&&['story:move:0513:02','story:move:0213:01','story:depart:0213:01'].includes(a.event)){
  const guard=s.grid.find(id=>[965,966,967,984,1453].includes(id));
  if(guard)(a.receipts??={}).hazard='卡牌 '+guard+' 忽略了這次高溫傷害';
  else a.chest={done:true,hazard:'高溫'}
 }
 if(a.event==='story:help:0529:recovered:0134'&&index===2&&[...s.grid,...s.reserve,...s.supply].includes(1393)){
  const slot=s.grid.indexOf(1393);if(slot>=0)s.grid[slot]=0;
  s.reserve=s.reserve.filter(n=>n!==1393);s.supply=s.supply.filter(n=>n!==1393);
  delete s.boost[1393];delete s.markers[1393];
  for(const q of cards[1393].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
  (a.receipts??={}).goldCurse='已移除黃金詛咒 1393'
 }
 if(a.event==='story:help:0310:recovered:0089'&&index>=2){
  const n=1160+index-2,slot=s.grid.indexOf(n);a.tradedCrystal=n;
  if(slot>=0)s.grid[slot]=0;else s.reserve.splice(s.reserve.indexOf(n),1);
  delete s.boost[n];delete s.markers[n];
  for(const q of cards[n].slots){delete s.occupied[q.uid];if(s.freeResponseSlots)delete s.freeResponseSlots[q.uid]}
 }
 a.choice=index;a.paidBranch=index;noteDecision(parts[index].slice(1).split(/[：:；。]/)[0]);
 if(a.event==='story:engage:0258:01'&&!a.sold&&!a.peddlerBought&&index>=2&&index<=5){
  settleRewards();
  a.peddlerBought=true;
  if(sellableItems().length){
   a.text='商販也願意收購一張牌。選擇一項：·按卡牌價值出售一張牌：商販建議你向東或向南前行。·離開攤位：商販建議你向東或向南前行。';
   delete a.choice;delete a.paidBranch
  }
 }
 if(a.event==='story:engage:0656:01'&&index>=2){
  const start=(index-2)*3;
  for(const id of s.grid.slice(start,start+3)){
   for(const slot of cards[id]?.slots||[])delete s.occupied[slot.uid]
  }
 }
 if(a.event==='story:engage:1588:01'&&index===2){
  const item=1299+s.hero,current=s.boost[item]||0;
  const gain=Math.min(2,Math.max(0,cards[item].cap-current));
  s.boost[item]=current+gain;
  (a.receipts??={}).personalItem='個人物品 '+item+' 增加 '+gain+' 點強化'
 }
 if(a.event==='story:engage:1577:01'&&index===2){
  for(const id of s.grid)for(const slot of cards[id]?.slots||[])delete s.occupied[slot.uid]
 }
 if(a.event==='story:overpower:0221:01'&&!a.huntRoute){
  settleRewards();
  a.huntRoute=true;
  a.text='狩獵結束，你要往哪裡走？選擇一項：·向北前往602：前往602。·支付1點移動，進入洞穴022：前往洞穴022。';
  delete a.choice;delete a.paidBranch
 }
 if((endsTurn||a.event==='story:look:0627:01'&&index>=4)&&!rescueTurnEnd()){
  settleRewards();fillAcquiredCards();
  if(!s.unplaced?.length&&reserveSize()<=reserveLimit())return finish(a.event==='story:take:0658:01'&&index===3)
 }
 save()
}
function canDuel(){
 return /(?:找到|將|拿取)卡牌798|進行一場.{0,15}卡牌和骰子遊?戲|進行一場交鋒/.test(resultText().replace(/\s/g,'').replace(/游戲/g,'遊戲'))&&!s.a.duelDone
}
function pendingStoryDuel(){
 return !s.a?.duelDone&&(duelStoryPrizes[s.a?.event]||s.a?.event==='story:overpower:0252:01'||s.a?.event==='story:overpower:0077:01'&&s.a.choice===3||s.a?.event==='story:overpower:0518:01'&&s.a.choice===2);
}
function checkObjectives(){
 if(!s?.loc||s.phase==='ended')return;
 const owned=[...s.grid,...s.reserve].filter(Boolean),all=[...owned,...s.supply],has=n=>owned.includes(n);
 const shelters=all.some(n=>ruleFacts.shelters.includes(n)),count=f=>owned.filter(f).length;
 const texts=(s.journal||[]).map(j=>j.body.split(/\n/)[0].replace(/\s/g,''));
 const found=t=>texts.some(v=>v.includes(t)),hero=s.grid[4];
 const goals={
  1578:found('生命的起源'),1579:hero>=1441&&hero<=1452&&(hero-1435)%6===s.hero&&s.boost[hero]===cards[hero].cap,
  1580:count(n=>cards[n].home==='flora')>=2,1581:has(865),1582:count(n=>cards[n].home==='sentient')>=2,
  1583:owned.reduce((sum,n)=>sum+(ruleFacts.value[n]||0),0)>=30,
  1584:count(n=>ruleFacts.loyal.includes(n))>=2,1585:(s.atlasPages||[]).length>=2||(s.markers?.[1585]||0)>=2,
  1587:s.money>=15,1589:has(1232),1591:shelters,1592:(s.markers?.[1592]||0)>=3||Object.values(s.conquests||{}).some(v=>v>=3),
  1593:owned.some(n=>n>=1239&&n<=1250)||found('外交關係'),
  1594:new Set(owned.map(n=>cards[n].name.match(/水晶[（(]([紅黃藍綠紫橙])/ )?.[1]).filter(Boolean)).size>=2,
  1595:count(n=>cards[n].slots.some(q=>q.action==='壓制')||ruleFacts.beforeOverpower.includes(n))>=4,
  1596:found('你是我唯一的希望'),1597:owned.some(n=>cards[n].home==='item'&&ruleFacts.value[n]>=15),
  1598:(s.markers?.[1598]||0)>=3,
  1600:shelters,1601:all.some(n=>ruleFacts.business.includes(n)),1603:(s.markers?.[1603]||0)>=2||(s.duelWins||0)>=2,
  1604:owned.some(n=>ruleFacts.teleport.includes(n)),1608:has(1381),
  1705:(s.markers?.[1705]||0)>=6
 };
 if(!s.ruleTracking){s.missionDone=false;s.fateDone=false;s.ruleTracking=true}
 if(s.simplerMission===s.mission?simplerGoalMet(owned):goals[s.mission])s.missionDone=true;
 if(!s.fateDone)s.fateDone=s.fates.find(n=>goals[n])||false
}
function rescueActions(){
 return keys.map(book=>{
  const event='story:'+book+':1705:01',row=stories[event];
  return {id:1705,kind:'卡牌',name:row[5],book,event,key:event}
 })
}
function rescueTurnEnd(){
 return s?.fates?.includes(1705)&&(s.markers?.[1705]||0)<6&&s.a?.id!==1705
}
function actionNameByUid(uid){
 if(!uid)return '';
 for(const card of Object.values(cards)){
  const act=(card.actions||[]).find(x=>x.action_uid===uid);
  if(act){
   const bookName=skills[keys.indexOf(act.book)]||'';
   return (bookName?bookName+'－':'')+act.action;
  }
 }
 return uid;
}

function getContinuationInfo(a, text){
 if(!a)return null;
 const full = ((a.title||'') + ' ' + (text||'')).replace(/\s/g,'');
 
 if(/如果你已經有(?:5或6|[56])點士氣[，,]?執行另一個行動/.test(full)){
  if((s.stats[1]||0)>=5){
   return { available:true, required:false, label:'執行另一個行動（士氣充沛）', type:'extra' };
  }
  return null;
 }

 const specific = full.match(/(?:你可以|然後|並)?(?:繼續)?(?:在那裡)?執行(?:一個|另一個)?(?:「([^」]+)」|([一-龥]+)[-－](?:[0-9]+[-－])?([一-龥/]+?)(?:的?行動|[，。；（(]|$))/);
 if(specific){
  const rawBook = specific[2];
  const rawAction = specific[1] || specific[3];
  const bookKey = rawBook ? keys[skills.indexOf(rawBook)] : null;
  const isRequired = !/可以|若|如果|可選|或者/.test(full.slice(Math.max(0, specific.index - 10), specific.index + specific[0].length));
  
  let targetUid = null;
  let targetName = (rawBook ? rawBook + '－' : '') + rawAction;
  
  const searchIds = [s.loc, a.id, ...(s.grid||[]), ...(s.supply||[]), ...(s.reserve||[])].filter(Boolean);
  for(const id of searchIds){
   const card = cards[id];
   if(!card?.actions)continue;
   const found = card.actions.find(act => {
    if(bookKey && act.book !== bookKey)return false;
    if(rawAction && (act.action === rawAction || act.family === rawAction || rawAction.includes(act.action) || act.action.includes(rawAction)))return true;
    return false;
   });
   if(found){
    targetUid = found.action_uid;
    const bk = skills[keys.indexOf(found.book)] || rawBook;
    targetName = (bk ? bk + '－' : '') + found.action;
    break;
   }
  }
  
  if(!targetUid && bookKey){
   const bookMatches = (cards[s.loc]?.actions||[]).filter(act => act.book === bookKey);
   if(bookMatches.length === 1){
    targetUid = bookMatches[0].action_uid;
    targetName = rawBook + '－' + bookMatches[0].action;
   }
  }
  
  let discount = null;
  const discMatch = full.match(/費用減少(\d+)點/);
  if(discMatch) discount = Number(discMatch[1]);
  else if(/費用減少至1點/.test(full)) discount = 'to1';
  else if(/費用減半/.test(full)) discount = 'half';

  return {
   available: true,
   required: isRequired,
   label: targetName,
   targetUid,
   book: bookKey,
   rawBook,
   actionName: rawAction,
   discount,
   type: 'named'
  };
 }

 if(practiceActions[a.event]){
  const option = practiceActions[a.event][a.choice - 1];
  if(option){
   return { available:true, required:false, label:option[1]||'練習行動', targetUid:option[0], type:'practice' };
  }
 }

 if(full.includes('與所選類型匹配的行動')){
  return { available:true, required:false, label:'所選類型行動', type:'selected_type' };
 }

 const typedSkill = full.match(/(?:一個|另一個)(移動|查看|接觸|幫助|獲取|壓制)行動/);
 if(typedSkill){
  const bk = keys[skills.indexOf(typedSkill[1])];
  return { available:true, required:false, label:typedSkill[1]+'行動', book:bk, type:'book' };
 }

 if(/你可以繼續|並繼續|然後繼續|可繼續|選擇如何繼續|繼續。|繼續：|繼續執行/.test(full)){
  const isRequired = !/可以|若|如果|可選|或者/.test(full);
  return { available:true, required:isRequired, label:'繼續行動', type:'general' };
 }

 return null;
}

function finishControls(a,continuation,required,contInfo){
 if(pendingStoryDuel())return '<p>請先完成交鋒，再依勝負結算故事。</p>';
 if(a.chest&&(!a.chest.done||a.chest.loseSkill||a.chest.hazard))return '';
 if(resultSkillChoices().length&&a.rewardChoice==null)return '';
 if(a.skillFaces?.length===0){continuation=false;required=false}
 if(storyTravel(resultText()).length>1&&!a.dest)return '';
 if(referencedOutcomes(a).pending)return '<p>請先選擇故事中的下一步。</p>';
 if(s.unplaced?.length)return '';
 if(reserveSize()>reserveLimit())return capacityView();
 if(a.repairStage!=null&&a.repairStage<3)return repairOptions(a);
 if(a.id===1705&&a.book==='overpower'&&s.grid[4]!==1447+s.hero&&a.takeArmor==null)
  return btn('換上動力裝甲','rescueArmor(true)')+btn('保留現有角色牌','rescueArmor(false)');
 const endLabel=s.rescueArrived&&a.id===1705&&['look','engage','help'].includes(a.book)?'結算旅程結局':'進入下一回合';
 const contLabel=contInfo?.label?('繼續行動：'+contInfo.label):'繼續行動';
 return (required?'':btn(endLabel,'finish()',!continuation)+(rescueTurnEnd()?btn('結束回合並等待救援（角色獲得 1 強化）','finish(false,true)'):''))+
 (continuation?btn(contLabel,'finish(true)',true):'')
}
function rescueArmor(accept){
 if(!activePlayer()||s.phase!=='result'||s.a.event!=='story:overpower:1705:01'||s.a.takeArmor!=null)return;
 s.a.takeArmor=accept;
 if(accept){
  const old=s.grid[4],n=1447+s.hero;
  s.boost[n]=Math.min(cards[n].cap,s.boost[old]||0);delete s.boost[old];
  for(const slot of cards[old].slots)delete s.occupied[slot.uid];
  s.grid[4]=n;noteDecision('換上動力裝甲 '+n+'。')
 }
 save()
}
function settleRescue(a){
 if(a.id!==1705||!s.rescueArrived)return false;
 if(['look','engage','help'].includes(a.book)){
  s.fateDone=1705;endGame(s.missionDone?'史詩勝利':'命運勝利');return true
 }
 if(a.book==='overpower'&&s.grid[4]===1447+s.hero&&a.takeArmor==null)creditReward({kind:'強化',delta:3},{kind:'地點'});
 if(a.book==='take')creditReward({card:1033,type:'載具'},a);
 s.fates=s.fates.filter(n=>n!==1705);
 if(!s.fates.includes(1600))s.fates.push(1600);
 s.rescueArrived=false;return false
}
function settleLosses(text,a){
 const plain=text.replace(/\s+/g,'');
 if(/[·•●]|如果|否則|若|可以|支付|選擇|或者|擲|失去所有/.test(plain))return;
 for(const [i,m] of [...plain.matchAll(/(?:^|[。；：，])失去(\d+)(?:點|枚)?(生命值?|時間|士氣|錢幣|移動|查看|接觸|幫助|獲取|壓制|強化)/g)].entries()){
  const k='loss'+i;if(a.receipts?.[k])continue;
  const kind=m[2].replace('生命值','生命'),[o,key]=resourceAccount(kind);
  if(!a.applied?.some(j=>a.effects?.[j]?.kind===kind&&a.effects[j].delta===-Number(m[1])))o[key]=Math.max(0,(o[key]||0)-Number(m[1]));
  (a.receipts??={})[k]='失去'+m[1]+'點'+kind
 }
}
function resultSkillChoices(){
 if(s.phase!=='result'||!s.a)return [];
 const a=s.a;
 if(a.event==='story:engage:1588:01'&&a.choice===3)return skills.map(name=>[name,2]);
 if(a.event==='story:take:0785:01'&&[3,4].includes(a.choice))return skills.map(name=>[name,2]);
 if(a.missionSkills)return a.missionSkills.map(name=>[name,a.missionSkillAmount||1]);
 if(a.skillFaces)return [...new Set(a.skillFaces)].map(i=>[skills[i],a.skillFaces.filter(k=>k===i).length]);
 const part=storyParts(a.text,a.choice),text=(part.branched?(part.parts[a.choice]||''):part.shown).replace(/\s/g,'');
 const offer=endingSkillOffer(text);if(offer)return offer.choices;
 if(/如果|否則|若|依據|擲出/.test(text))return [];
 const pair=text.match(/獲得(\d+)點(移動|查看|接觸|幫助|獲取|壓制)(?:或者|或)(?:(\d+)點)?(移動|查看|接觸|幫助|獲取|壓制)(?=[。；：，]|$)/);
 return pair?[[pair[2],+pair[1]],[pair[4],Number(pair[3]||pair[1])]]:[]
}
function skillChoiceView(){
 if(s.a.skillFaces?.length===0)return '<p>本次擲 0 顆技能骰，沒有可領取的技能或追加行動。</p>';
 if(s.a.rewardChoice!=null)return '';
 return resultSkillChoices().map(([kind,v],i)=>btn('選擇 '+v+' 點'+kind,'selectRewardSkill('+i+')')).join('')
}
function selectRewardSkill(i){
 const a=s.a;if(!activePlayer()||a.rewardChoice!=null)return;
 const choice=resultSkillChoices()[i];if(!choice)return;
 const [kind,delta]=choice;a.rewardChoice=i;creditReward({kind,delta},a);
 (a.receipts??={}).choice='獲得'+delta+'點'+kind;noteDecision(a.receipts.choice);save()
}

function offering646Cards(){return [...new Set([...s.grid.filter((n,i)=>n&&i!==4),...s.reserve])].filter(n=>n!==s.grid[4])}
function offer646(n){
 if(!activePlayer()||s.phase!=='cost'||s.a?.event!=='story:help:0646:scan:01'||s.a.offering646||!offering646Cards().includes(n))return;
 discardFedCard(n);s.a.offering646=n;noteDecision('獻上卡牌 '+n+'，向智慧生物致敬。');save()
}
// Help 581 grants crafting outcomes, not another action or its challenge cost.
const workshop581Recipes={874:[948,982],952:[988],954:[957,'keep'],961:[962],971:[929,1040],1040:[929],1063:[1415],1066:[1013],1074:[917],1077:[860],1078:[1415],1083:[988],1098:[1234,869,1041],1228:[988]};
function workshop581Options(){
 const owned=[...new Set([...s.grid,...s.reserve,...s.supply])];
 return [{source:0,target:1098},...owned.flatMap(source=>(workshop581Recipes[source]||[]).map(target=>({source,target,replace:(source===954&&target===957)||source===1040||source===1098||source===874})))];
}
function prepareWorkshop581(a){
 if(a.event!=='story:help:0581:01'||a.workshop581Done)return;
 a.workshop581Options=workshop581Options();
 a.text='機器人接受你的製作指令。選擇一項製作收益，完成後退出至492。選擇一項：'+a.workshop581Options.map(o=>'·'+(!o.source?'製作簡易電路1098':o.target==='keep'?'借用954的結果，保留吊床並強化角色':'借用卡牌'+o.source+'，'+(o.replace?'改造為':'製作')+'卡牌'+o.target)+'：完成製作後退出。').join('');
}
function selectWorkshop581(index){
 const a=s.a,o=a.workshop581Options?.[index-1];
 if(!o||a.workshop581Done||!workshop581Options().some(x=>x.source===o.source&&x.target===o.target))return;
 a.workshop581Done=true;
 if(o.target==='keep')creditReward({kind:'強化',delta:1},a);
 else if(o.replace){
  const slot=s.grid.indexOf(o.source),reserve=s.reserve.indexOf(o.source);
  if(slot<0&&reserve<0){delete a.workshop581Done;return}
  discardFedCard(o.source);
  const held=[...s.grid,...s.reserve,...s.supply,...(s.unplaced||[])].includes(o.target);
  if(!held){
   if(slot>=0){s.grid[slot]=o.target;s.boost[o.target]=Math.min(cards[o.target].initial,cards[o.target].cap);checkGridMilestone()}
   else s.reserve.splice(reserve,0,o.target);
   (a.revealedCards??=[]).push(o.target)
  }else creditReward({card:o.target},a);
 }else{
  a.workshop581Product=o.target;creditReward({card:o.target},a);
 }
 const message=o.target==='keep'?'角色已取得1點強化':(o.replace?'已改造':'已製作')+'卡牌'+o.target;
 (a.receipts??={}).workshop581=message;noteDecision(message+(o.source?'（借用卡牌'+o.source+'的製作收益）':'')+'。');
 a.text=message+'。前往492。';a.dest=492;delete a.choice;save()
}
function resolveBedrollCraft(a){
 if(a.event!=='story:help:1040:01'||a.bedrollCraftDone)return;
 const slot=s.grid.indexOf(1040);if(slot<0)return;
 a.bedrollCraftDone=true;discardFedCard(1040);
 if(![...s.grid,...s.reserve,...s.supply,...(s.unplaced||[])].includes(929)){
  s.grid[slot]=929;s.boost[929]=Math.min(cards[929].initial,cards[929].cap);(a.revealedCards??=[]).push(929);checkGridMilestone();
 }else creditReward({card:929},a);
 a.text='已將大鋪蓋卷1040替換為冬季外套929。';
 (a.receipts??={}).bedrollCraft='大鋪蓋卷已改造成冬季外套';noteDecision(a.receipts.bedrollCraft+'。')
}

function upgradeVehicle(a,target){
 if(a.vehicleUpgradeDone||!(['story:help:0985:01','story:help:0989:01'].includes(a.event))||![1010,1253].includes(target))return false;
 const source=a.event==='story:help:0985:01'?985:989,slot=s.grid.indexOf(source);
 if(slot<0||source===985&&target!==1010)return false;
 a.vehicleUpgradeDone=target;discardFedCard(source);
 if(![...s.grid,...s.reserve,...s.supply,...(s.unplaced||[])].includes(target)){
  s.grid[slot]=target;s.boost[target]=Math.min(cards[target].initial,cards[target].cap);(a.revealedCards??=[]).push(target);checkGridMilestone();
 }else creditReward({card:target},a);
 const message='已將卡牌'+source+'升級為'+(target===1010?'飄浮立方體':'噴氣揹包')+target;
 a.text=message+'。';delete a.choice;(a.receipts??={}).vehicleUpgrade=message;noteDecision(message+'。');return true
}
function prepareOceanSeed(a){
 if(a.event!=='story:help:1020:01'||a.seedPrepared)return;
 a.seedPrepared=true;
 a.text=s.loc===740?'智慧生物邀請你尋找這個地點的未來版本。選擇一項：·接受邀請：交出海洋種子1020，取得智慧生物1364與任務1699。·保留種子：在海洋種子上獲得1點強化。':'種子中夾著秘密通道的指引。選擇一項：·遵循指引：執行查看－導航，費用4，前往746。·不遵循指引：保留種子，可在此處或之後種植。';
}
function chooseOceanSeed(index){
 const a=s.a;if(!s.grid.includes(1020)||a.seedResolved)return;
 a.seedResolved=true;
 if(s.loc===740){
  if(index===1){discardFedCard(1020);a.text='獲得智慧生物1364和任務1699（將其橫向添加到你的供應區中）。';noteDecision('接受邀請，交出海洋種子。')}
  else {s.boost[1020]=Math.min(cards[1020].cap,(s.boost[1020]||0)+1);a.text='你保留海洋種子，已在種子上添加1點強化。';noteDecision('保留海洋種子並強化。')}
 }else if(index===1){
  noteDecision('遵循種子中的指引，執行查看－導航。');rememberStory(a);
  s.a={id:1020,origin:s.loc,kind:'卡牌',event:'story:help:1020:navigation',book:'look',name:'導航',title:'沿秘密通道前往746',cost:4,text:'你遵循秘密通道的指引。前往746。聖林就在西側。',dice:[]};s.phase='cost';save();return
 }else {a.text='你沒有遵循指引。保留海洋種子1020，可在此處或之後種植；種植後仍將卡牌留在網格中，直到網格填滿。';noteDecision('不遵循秘密通道指引，保留海洋種子。')}
 delete a.choice;delete a.applied;save()
}

function finishCircuitCraft(index){
 const a=s.a,recipe=printedReplacementRecipes[a.event],source=recipe.source,target=recipe.targets[index-1],slot=s.grid.indexOf(source);
 if(!target||slot<0||a.circuitCraftDone)return;
 if(recipe.floraBrew&&index===2&&(s.boost[source]||0)<1)return;
 a.circuitCraftDone=true;
 if(recipe.discardOnly){
  discardFedCard(source);
  a.text='已淨化並失去卡牌'+source+'。';
  (a.receipts??={}).circuitCraft=a.text;noteDecision(a.text);delete a.choice;save();return
 }
 if(recipe.keep||(recipe.floraBrew&&index===2)){
  if(recipe.floraBrew&&index===2)s.boost[source]--;
  creditReward({card:target},a);
  a.text='已保留卡牌'+source+'並獲得卡牌'+target+'。';
  (a.receipts??={}).circuitCraft=a.text;noteDecision(a.text);delete a.choice;save();return
 }
 if(recipe.reserve){
  for(const q of cards[source].slots)delete s.occupied[q.uid];
  s.grid[slot]=0;s.reserve.push(source);creditReward({card:target},a);
  a.text='已儲備卡牌'+source+'並製作卡牌'+target+'。';
  (a.receipts??={}).circuitCraft=a.text;noteDecision(a.text);delete a.choice;save();return
 }
 discardFedCard(source);
 if(cards[target]?.orientation==='landscape'){
  creditReward({card:target},a);
 }else if(![...s.grid,...s.reserve,...s.supply,...(s.unplaced||[])].includes(target)){
  s.grid[slot]=target;s.boost[target]=Math.min(cards[target].initial,cards[target].cap);(a.revealedCards??=[]).push(target);checkGridMilestone();
 }else creditReward({card:target},a);
 if(recipe.fate)creditReward({card:recipe.fate,type:'命運',label:'獲得命運'+recipe.fate},a);
 a.text='已將卡牌'+source+'改造成卡牌'+target+(recipe.fate?'，並獲得命運'+recipe.fate:'')+'。';(a.receipts??={}).circuitCraft=a.text;noteDecision(a.text);delete a.choice;save()
}
