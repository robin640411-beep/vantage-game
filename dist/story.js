const volumes={move:'移動',look:'查看',engage:'接觸',help:'幫助',take:'獲取',overpower:'壓制',depart:'離開',secrets:'秘密之書',atlas:'萬境之書'};
const volumeNumbers={move:8,look:5,engage:4,help:3,take:6,overpower:2,depart:10,secrets:7,atlas:9};
// The north exit's transcription splits the same encounter across two rows.
const beetleEncounter=WORLD.stories['story:move:0684:01'][1];
for(const key of ['story:depart:0684:01','story:depart:0684:02'])WORLD.stories[key][1]=beetleEncounter;
const westCanyon=WORLD.stories['story:depart:0200:02'];
if(westCanyon[1].endsWith('前往'))westCanyon[1]+='393。獲得1點士氣。';
for(const [event,row] of Object.entries(WORLD.stories)){
 if(event.startsWith('story:depart:')&&Number.isInteger(row[2])){
  row[5]=row[5].replace(new RegExp('^[MV]'+row[2]+'(?=向|避開)'), '')
 }
}
// Move p. 9. These actions have unconditional outcomes distinct from their exits.
WORLD.stories['story:move:0201:01'][1]='智慧生物在半空中旋轉，對你的突然出現感到驚訝。「報上你的姓名和意圖！」他要求道。由於沒能在他的資料庫中找到你，他解釋說自己負責在東北邊盜賊之王周邊的地區巡邏，希望你去那裡時別惹麻煩。獲得1點強化。';
const rescuedHostage=WORLD.stories['story:move:0203:01'];
if(rescuedHostage[1].endsWith('獲得智慧生物'))rescuedHostage[1]+='1349和詛咒1391。';
const severedMagnet=WORLD.stories['story:overpower:0210:01'];
severedMagnet[1]=severedMagnet[1].replace('士氣；','士氣。');
// Help p. 8: the transcription joined entries 206 and 207 under 061.
WORLD.stories['story:help:0206:recovered:0061'][1]='他正吃力地搬運兩幅巨大的畫作，自豪地說這是他偷來的，打算獻給鑄錠鎮的大博物館。你心情矛盾地伸手穩住畫作。獲得$2並前往城市522。';
const cheerKing=WORLD.stories['story:help:0207:scan:01'];
cheerKing[5]='令國王振奮';
cheerKing[1]='他歡呼並歡迎你參加試煉。繼續執行獲取－繞過行動。';
const rootBattle=WORLD.stories['story:overpower:0691:01'];
rootBattle[1]=rootBattle[1].replace(/\s/g,'').replace('(獲得物品1225)','。獲得物品1225');
const graveBattle=WORLD.stories['story:take:0659:01'];
graveBattle[1]=graveBattle[1].replace('（獲得詛咒1385）併發起攻擊','並發起攻擊。獲得詛咒1385');
WORLD.stories['story:help:0157:recovered:0040'][1]='這裡很安靜，適合冥想。製作項鍊時，你任思緒漫遊。精美的成品讓你心生喜悅。獲得物品1096。';
const portalEssence=WORLD.stories['story:take:0664:01'];
if(portalEssence[1].endsWith('獲得課程'))portalEssence[1]=portalEssence[1].replace('失去1點生命值，獲得課程','失去1點生命值。獲得課程1428和1點強化。');
const cavePassage=WORLD.stories['story:depart:0083:01'];
if(cavePassage[1].endsWith('前往地城'))cavePassage[1]+='016。保留此地點作為參考。';
const cityRockWall=WORLD.stories['story:overpower:0094:01'];
if(cityRockWall[1].endsWith('前往地城'))cityRockWall[1]+='595。保留此地點作為參考。';
const glowingDeposit=WORLD.stories['story:overpower:0088:01'];
if(glowingDeposit[1].endsWith('前往地城'))glowingDeposit[1]+='017。保留此地點作為參考。';
const collapsedSoil=WORLD.stories['story:depart:0088:02'];
collapsedSoil[1]=collapsedSoil[1].replace('你出現在星球內部更深處的地城017','你落入一條更深的通道。前往地城017');
const crystalPassage=WORLD.stories['story:move:0088:01'];
crystalPassage[1]=crystalPassage[1].replace('獲得物品1161，','獲得物品1161。');
const crystalFruit=WORLD.stories['story:look:0089:01'];
if(crystalFruit[1].endsWith('獲得物品'))crystalFruit[1]+='1224。繼續。';
for(const row of Object.values(WORLD.stories)){
 row[1]=row[1]
  .replace(/(\d+)\s*點\s*土\s*氣/g,'$1點士氣')
  .replace(/如\s+果/g,'如果')
  .replace(/否\s+則/g,'否則')
  .replace(/智慧生(?!\s*物)(\d{3,4})/g,'智慧生物$1')
  .replace(/智慧生\s+物/g,'智慧生物')
  .replace(/智\s+慧生物/g,'智慧生物')
  .replace(/智慧生3只物/g,'智慧生物')
  .replace(/智慧生熱切/g,'智慧生物熱切')
  .replace(/智慧生很著迷/g,'智慧生物很著迷')
  .replace(/智慧生\s*([。，；])/g,'智慧生物$1')
  .replace(/物\s+品/g,'物品')
  .replace(/動\s+物/g,'動物')
  .replace(/植\s+物/g,'植物')
  .replace(/載\s+具/g,'載具')
  .replace(/能\s+力/g,'能力')
  .replace(/課\s+程/g,'課程')
  .replace(/任\s+務/g,'任務')
  .replace(/命\s+運/g,'命運')
  .replace(/構\s*築\s+物|構\s+築物/g,'構築物')
  .replace(/詛\s+咒/g,'詛咒')
  .replace(/法\s+術/g,'法術')
  .replace(/獲\s+得/g,'獲得')
  .replace(/失\s+去/g,'失去')
  .replace(/前\s+往/g,'前往')
  .replace(/退\s+出至/g,'退出至')
  .replace(/獲27得物品874/g,'獲得物品874')
  .replace(/獲20得/g,'獲得')
  .replace(/獲可以得/g,'獲得')
  .replace(/獲57得/g,'獲得')
  .replace(/獲5得/g,'獲得')
  .replace(/獲LE麼在得物品973/g,'獲得物品973')
  .replace(/獲得\s*術(1238)/g,'獲得法術$1')
  .replace(/。物$/,'。');
}
if(WORLD.stories['story:depart:0726:02']&&WORLD.stories['story:depart:0726:02'][1].endsWith('選擇：向北前往')){
 WORLD.stories['story:depart:0726:02'][1]='智慧生物們為了表達感謝送給你一個小信物（獲得物品876），然後迅速離開了。選擇：向北前往727、向東前往410、向南前往725或向西南前往720。';
}
if(WORLD.stories['story:engage:0788:01']&&WORLD.stories['story:engage:0788:01'][1].endsWith('獲得智慧生物')){
 WORLD.stories['story:engage:0788:01'][1]='如果你支付$2，獲得智慧生物1339。如果你不支付，智慧生物向你展示自己是如何賺錢的。獲得搶劫能力(1481)或偷取能力(1482)；你可以繼續。';
}
WORLD.stories['story:help:0090:01'][1]='你一邊製作，一邊任思緒漫遊。看著自己在不知不覺間做出的成品，你感到很驚訝。獲得物品1099。';
// --- Verified Card & Story Data Patches ---
// 1. Ocean Locations 56-61 cyclic shift fix
for(const [id,acts] of [
 [56,[['move','下潛','移動','story:move:0056:01'],['take','招募','探訪','story:take:0056:01']]],
 [57,[['move','下潛','移動','story:move:0057:01'],['overpower','保衛','對決','story:overpower:0057:01']]],
 [58,[['move','駕駛','移動','story:move:0058:01'],['move','下潛','移動','story:move:0058:02']]],
 [59,[['move','下潛','移動','story:move:0059:01'],['look','導航','導航','story:look:0059:01']]],
 [60,[['move','下潛','移動','story:move:0060:01'],['help','放鬆','提供','story:help:0060:01']]],
 [61,[['move','下潛','移動','story:move:0061:01'],['look','搜索','導航','story:look:0061:01']]]
]){
 WORLD.cards[id].actions=acts.map(([book,action,family,event_uid],i)=>({action_uid:'action:00'+id+':0'+(i+1),action,family,event_uid,book,entry:id,repeatable:true}));
}
// 2. Broken :02 suffix links & strip duplicate scene-action:* entries
for(const [id,book,ev] of [[541,'take','story:take:0541:01'],[559,'engage','story:engage:0559:01'],[589,'move','story:move:0589:01']]){
 const act=WORLD.cards[id]?.actions?.find(a=>a.book===book&&!a.action_uid.startsWith('scene-action:'));
 if(act)act.event_uid=ev;
}
for(const c of Object.values(WORLD.cards)){
 if(c?.actions)c.actions=c.actions.filter(a=>!a.action_uid?.startsWith('scene-action:'));
}
// 3. 74 Missing printed location actions (engage & overpower)
for(const [id,action] of [[100,'戰鬥'],[361,'拆毀']]){
 const ev='story:overpower:'+String(id).padStart(4,'0')+':01';
 if(WORLD.cards[id]&&!WORLD.cards[id].actions.some(a=>a.book==='overpower'))WORLD.cards[id].actions.push({action_uid:'action:'+String(id).padStart(4,'0')+':06',action,family:'對決',event_uid:ev,book:'overpower',entry:id,repeatable:false});
}
for(const [id,action] of [[374,'模仿'],[375,'招呼'],[376,'交談'],[377,'低語'],[378,'交易'],[380,'交談'],[382,'同步'],[384,'挑/撬'],[386,'詢問'],[388,'交易'],[390,'商討'],[392,'詢問'],[393,'問候'],[394,'聯接'],[395,'詢問'],[396,'說服'],[397,'詢問'],[398,'僱傭'],[400,'招呼'],[402,'僱傭'],[403,'說服'],[404,'商討'],[405,'激活'],[406,'誘哄'],[410,'問候'],[411,'詢問'],[412,'同步'],[413,'詢問'],[414,'僱傭'],[415,'激活'],[421,'誘哄'],[423,'僱傭'],[425,'激活'],[427,'呼喊'],[439,'詢問'],[441,'啟發'],[443,'威嚇'],[445,'商討'],[447,'僱傭'],[449,'詢問'],[451,'說服'],[453,'互動'],[455,'說服'],[457,'挑/撬'],[459,'聯接'],[461,'誘哄'],[463,'問候'],[465,'呼喊'],[469,'激活'],[471,'挑/撬'],[473,'詢問'],[495,'招呼'],[497,'娛樂'],[501,'激活'],[503,'互動'],[505,'玩'],[507,'招呼'],[511,'威嚇'],[513,'詢問'],[530,'玩'],[567,'交談'],[581,'激活'],[583,'溝通'],[589,'詢問'],[592,'詢問'],[597,'交易'],[603,'誘哄'],[613,'激活'],[621,'說服'],[622,'同步'],[623,'交談'],[624,'溝通'],[625,'同步'],[642,'招呼']]){
 const ev='story:engage:'+String(id).padStart(4,'0')+':01';
 if(WORLD.cards[id]&&!WORLD.cards[id].actions.some(a=>a.book==='engage'))WORLD.cards[id].actions.splice(2,0,{action_uid:'action:'+String(id).padStart(4,'0')+':03',action,family:'溝通',event_uid:ev,book:'engage',entry:id,repeatable:false});
}
// 4. Fix corrupted action verb names
for(const c of Object.values(WORLD.cards)){
 for(const a of c?.actions||[]){
  if(a.action==='卡')a.action='戰鬥';
  else if(a.action==='+掠')a.action='劫掠';
  else if(a.action==='噢聞')a.action='嗅聞';
  else if(a.action==='切砍')a.action='切/砍';
  else if(a.action==='JINA')a.action='進入';
  else if(a.action==='大')a.action='漫步';
  else if(a.action==='恩求'||a.action==='懸求')a.action='懇求';
 }
}
// 5. All 36 Structure Cards (1265-1293, 1687-1692, 1701) & Missing Help Stories
for(const [id,cost,title,body] of [
 [1266,4,'創造食物','如果此構築物上有1點強化，獲得物品1217。如果有2點強化，獲得物品1224。如果有3點強化，獲得物品1136。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1270,4,'創造地圖','如果此構築物上有1點強化，獲得物品1154。如果有2點強化，獲得物品1259。如果有3點強化，獲得物品1262。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1273,4,'創造風物品','如果此構築物上有1點強化，獲得物品1102。如果有2點強化，獲得物品1417。如果有3點強化，獲得物品1189。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1278,4,'創造衣物','如果此構築物上有1點強化，獲得物品928。如果有2點強化，獲得物品955。如果有3點強化，獲得物品936。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1279,4,'救助動物並在馬廄中照料','如果此構築物上有1點強化，獲得動物817。如果有2點強化，獲得動物821。如果有3點強化，獲得動物846。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1280,4,'向學生們傳授一堂重要的課程','在此構築物上獲得1點強化。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1281,2,'與經過的旅者分享新聞','高塔讓你能夠遠距離溝通，使你可以輕鬆獲取來自世界各地的新聞。人們為此聯繫支付高額的費用。獲得$X（X為此構築物上的強化數量）。'],
 [1282,4,'創造載具','如果此構築物上有1點強化，獲得載具1014和$4。如果有2點強化，獲得載具1022。如果有3點強化，獲得載具1010。所有強化保留在此構築物上。'],
 [1283,2,'治癒你自己（如果你已經有5或6點生命值，執行其他行動）','你在安全的家中照料自己的傷口。獲得2點生命值。'],
 [1285,4,'照料未孵化的蛋','如果此構築物上有1點強化，獲得物品1155。如果有2點強化，獲得物品978。如果有3點強化，獲得物品977。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1286,4,'治癒受傷的動物','你不使用高塔進行狩獵，而是用它來幫助附近的動物們。如果此構築物上有1點強化，獲得動物804。如果有2點強化，獲得動物828。如果有3點強化，獲得動物836。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。'],
 [1288,3,'照料花園中危險植物的生長','如果此構築物上有1點強化，獲得植物1054。如果有2點強化，獲得植物1055。如果有3點強化，獲得植物1058。以此方法獲得的植物會疊放在此構築物下方，不在你的網格中——你無法使用該植物。所有強化保留在此構築物上。或者，你可以在這些牆壁中創建一個生活空間；如果這麼做，此構築物對於所有相關目標視為庇護所。']
]){
 WORLD.stories['story:help:'+id+':01']=[id,body,cost,'',1,title];
}
WORLD.stories['story:look:1293:01'][1]='如果此構築物上有1點強化，獲得能力1498。如果有2點強化，獲得能力1514。如果有3點強化，獲得能力1502。所有強化保留在該構築物上。';
{
 const structureVerbs={
  1265:['儲藏','反思','娛樂','治癒','沐浴','對決'],1266:['平衡','研究','出售','創造','獲得','對決'],1267:['平衡','研究','出售','創造','獲得','對決'],
  1268:['平衡','研究','出售','釀製','獲得','對決'],1269:['平衡','研究','出售','創造','獲得','對決'],1270:['攀登','研究','出售','創造','獲得','對決'],
  1271:['平衡','研究','玩','稱讚','獲得','對決'],1272:['平衡','研究','出售','釀製','獲得','對決'],1273:['攀登','研究','出售','創造','獲得','對決'],
  1274:['隱藏','翻譯','化解','照料','獲得','保衛'],1275:['許願','許願','許願','許願','許願','許願'],1276:['跳舞','偵察','娛樂','贊助','扒竊','對決'],
  1277:['平衡','研究','出售','創造','欺詐','對決'],1278:['平衡','研究','出售','創造','獲得','對決'],1279:['平衡','研究','誘哄','救助','尋找','保衛'],
  1280:['平衡','學習','魅惑','傳授','收集','對決'],1281:['攀登','傾聽','發送','分享','破解','對決'],1282:['平衡','研究','出售','創造','獲得','對決'],
  1283:['儲藏','反思','娛樂','治癒','沐浴','對決'],1284:['平衡','研究','出售','創造','獲得','對決'],1285:['平衡','研究','出售','照料','獲得','燃燒'],
  1286:['攀登','掃視','出售','治癒','收集','瞄準'],1287:['引導','探索','出售','提煉','取出','開鑿'],1288:['平衡','嗅聞','出售','照料','獲得','採摘'],
  1289:['儲藏','反思','娛樂','治癒','沐浴','對決'],1290:['儲藏','反思','娛樂','治癒','沐浴','對決'],1291:['平衡','嗅聞','出售','照料','獲得','採摘'],
  1292:['儲藏','掃視','同步','練習','獲得','武器'],1293:['平衡','學習','出售','傳授','獲得','打破'],1687:['儲藏','反思','娛樂','治癒','沐浴','對決'],
  1688:['儲藏','反思','娛樂','治癒','沐浴','對決'],1689:['儲藏','反思','娛樂','治癒','沐浴','對決'],1690:['儲藏','反思','娛樂','治癒','沐浴','對決'],
  1691:['儲藏','反思','娛樂','治癒','沐浴','對決'],1692:['儲藏','反思','娛樂','治癒','沐浴','對決'],1701:['儲藏','反思','娛樂','治癒','沐浴','對決']
 };
 const books=['move','look','engage','help','take','overpower'],fams=['移動','導航','溝通','提供','探訪','對決'];
 for(const [idStr,verbs] of Object.entries(structureVerbs)){
  const id=Number(idStr);
  WORLD.cards[id].actions=verbs.map((action,i)=>{
   const book=books[i],ev=Object.keys(WORLD.stories).find(k=>k.startsWith('story:'+book+':'+id+':'))||'story:'+book+':'+id+':01';
   return {action_uid:'action:'+id+':0'+(i+1),action,family:fams[i],event_uid:ev,book,entry:id,repeatable:id!==1275&&!(id===1281&&book==='engage')};
  });
 }
}
// 6. All 60 Sentient Cards (1305-1364)
WORLD.stories['story:look:1318:01'][1]='智慧生物耐心地傳授你如何搜尋人們丟失的東西，或者在哪裡出售這些東西。獲得能力1510或前往洞穴094。';
for(let id=1305;id<=1364;id++){
 const acts=[
  ['look','學習','導航',true],
  ['engage',id===1346?'戲弄':'調情','溝通',true],
  ['take','欺詐','探訪',false],
  ['overpower','對決','對決',true]
 ];
 WORLD.cards[id].actions=acts.map(([book,action,family,repeatable],i)=>{
  const ev=Object.keys(WORLD.stories).find(k=>k.startsWith('story:'+book+':'+id+':'))||'story:'+book+':'+id+':01';
  return {action_uid:'action:'+id+':0'+(i+1),action,family,event_uid:ev,book,entry:id,repeatable};
 });
}
// 7. Missing Storybook-Backed Card Actions & Related Story Fixes
WORLD.stories['story:overpower:0870:scan:01']=[870,'選擇一項：刷新你網格中的1顆挑戰骰；獲得1點查看；添加1點強化到一個蛋上。此外，如果你擁有木頭資源（1180），你可以失去它來獲得荊棘火把（1084）。',3,'',1,'燃燒一小團火焰'];
WORLD.stories['story:help:1442:recovered:0213'][1]='獲得物品1300。';
WORLD.stories['story:help:1444:recovered:0214'][1]='獲得物品1302。';
WORLD.stories['story:overpower:1473:01']=[1473,'你關注自然界的跡象來識別動物，隱藏自己的存在並做好準備發起攻擊。動物癱倒在地，靈魂石在屍體中發出光芒。擲1顆技能骰並獲得相應顏色的水晶（藍色：1160；紫色：1161；橙色：1162；綠色：1163；黃色：1164；紅色：1165）；如果你已有該顏色的水晶，改為獲得詛咒（戶外：1392；水下：1385）。',4,'',1,'狩獵野生動物（僅限位於戶外或水下地點）'];
WORLD.stories['story:take:1490:01']=[1490,'基於你所在地點上能看到的東西選擇一項：·小船（划艇1014）：獲得載具1014。·小船（帆船1156）：獲得載具1156。·其他類型的船隻：獲得1點獲取並繼續。·被招呼來的搭乘物（若上一個行動是招呼）：獲得載具1156。·藍色符文投射器：獲得物品1028。·紫色符文投射器：獲得物品1030。·橙色符文投射器：獲得物品1026。·綠色符文投射器：獲得物品1029。·黃色符文投射器：獲得物品1031。·紅色符文投射器：獲得物品1027。·城市041建築物：獲得構築物1284。·城市518建築物：獲得構築物1276。·城市519建築物：獲得構築物1278。·城市520建築物：獲得構築物1266。·城市521建築物：獲得構築物1287。·城市522建築物：獲得構築物1280。·城市523建築物：獲得構築物1277。·城市524建築物：獲得構築物1291。·城市525建築物：獲得構築物1285。·城市526建築物：獲得構築物1268。·城市527建築物：獲得構築物1272。·城市528建築物：獲得構築物1290。·城市529建築物：獲得構築物1274。·城市530建築物：獲得構築物1271。·城市531建築物：獲得構築物1293。',4,'',1,'劫持你地點上的小船、被招呼來的搭乘物、符文投射器或城市建築物'];
WORLD.stories['story:look:1603:01'][1]='你渴望證明自己的價值並贏得這顆星球上居民們的讚譽。獲得物品1260和1點壓制。';
WORLD.stories['story:look:1605:01'][1]='你檢查了推進系統的構造並研究如何將它與其他殘骸部件組裝在一起。獲得2點幫助。';
WORLD.stories['story:move:1657:01']=[1657,'選擇一項：·進入傳送門前往洞穴083：前往洞穴083。·進入傳送門前往地點106：前往106。·進入傳送門前往地點157：前往157。·進入傳送門前往地點664：前往664。',1,'',1,'進入傳送門（僅限位於地點690）'];
for(const [id,book,action,family,ev,repeatable] of [
 [872,'overpower','劈砍','對決','story:overpower:0872:01',true],
 [911,'overpower','捕魚','對決','story:overpower:0911:01',true],
 [913,'overpower','捕魚','對決','story:overpower:0913:01',true],
 [921,'overpower','捕魚','對決','story:overpower:0921:01',true],
 [923,'overpower','設陷','對決','story:overpower:0923:01',true],
 [926,'overpower','設陷','對決','story:overpower:0926:01',true],
 [947,'overpower','設陷','對決','story:overpower:0947:01',true],
 [957,'move','駕駛','移動','story:move:0957:01',true],
 [1032,'help','放鬆','提供','story:help:1032:01',true],
 [1033,'move','乘坐','移動','story:move:1033:01',true],
 [1034,'take','拆卸','探訪','story:take:1034:01',true],
 [1067,'take','食用','探訪','story:take:1067:01',true],
 [1128,'overpower','燃燒','對決','story:overpower:1128:01',true],
 [1449,'engage','購買','溝通','story:engage:1449:01',true],
 [1450,'help','裝備','提供','story:help:1450:01',true],
 [1461,'overpower','捕魚','對決','story:overpower:1461:01',true],
 [1473,'overpower','狩獵','對決','story:overpower:1473:01',true],
 [1490,'take','劫持','探訪','story:take:1490:01',true],
 [1550,'move','撤退','移動','story:move:1550:01',true],
 [1550,'overpower','擊殺','對決','story:overpower:1550:01',true],
 [1585,'engage','懇求','溝通','story:engage:1585:01',false],
 [1603,'look','探究','導航','story:look:1603:01',false],
 [1605,'look','探究','導航','story:look:1605:01',false],
 [1657,'move','進入','移動','story:move:1657:01',true],
 [1676,'move','跳/躍','移動','story:move:1676:01',true]
]){
 if(WORLD.cards[id]&&!WORLD.cards[id].actions.some(a=>a.event_uid===ev)){
  WORLD.cards[id].actions.push({action_uid:'action:'+String(id).padStart(4,'0')+':'+book,action,family,event_uid:ev,book,entry:id,repeatable});
 }
}
// 8. 15 Magic Lesson Cards (1419-1433)
for(let id=1419;id<=1433;id++){
 const ev='story:look:'+id+':printed:learn',isMax=[1423,1428,1433].includes(id);
 const penalty=id===1423?'失去1點生命值。':id===1428?'失去1點士氣。':id===1433?'失去1點時間。':'';
 const nextGain=isMax?'':'獲得課程'+(id+1)+'。';
 WORLD.stories[ev]=[id,penalty+'選擇一項：·保留此課程牌'+(isMax?'':'並獲得下一階課程')+'：'+nextGain+'·失去此課程牌'+(isMax?'':'並獲得下一階課程')+'：'+nextGain,'X','',1,'學習魔法課程'];
 WORLD.cards[id].actions=[{action_uid:'action:'+id+':learn',action:'學習',family:'導航',event_uid:ev,book:'look',entry:id,repeatable:true}];
}
// 9. Truncated Story Restorations (Move, Look, Take, Engage, Help, Overpower, Depart)
for(const [ev,suffix] of [
 ['story:move:0094:01','1501並前往城市041。'],
 ['story:move:0108:01','1082和詛咒1388。'],
 ['story:move:0158:recovered:0042','1176。'],
 ['story:move:0253:01','1160。'],
 ['story:move:0267:01','272。'],
 ['story:move:0289:01','294並獲得1點士氣。'],
 ['story:move:0302:01','1213）；當你這麼做時，你看到了一個直接穿過山脈的出口。你可以向北前往307。'],
 ['story:move:0329:01','1313和任務1670（將其橫向添加到你的供應區中）。'],
 ['story:move:0416:01','1034並前往地點150）。否則，獲得1點強化並繼續。'],
 ['story:move:0496:01','1706，則獲得該任務（將其橫向添加到你的供應區中並在上面放置第一個標記）。'],
 ['story:move:0550:01','1041。你還能獲得1點士氣。'],
 ['story:move:0583:01','1034並退出至778。'],
 ['story:move:0680:01','384。擲2顆技能骰並獲得所有的接觸結果。如果你支付1點接觸，獲得動物854；否則，動物歡快地跳走了。'],
 ['story:move:0735:01','941）。'],
 ['story:look:0049:01','991和1點移動。'],
 ['story:look:0145:01','1483、2點強化和1點幫助；你可以繼續。'],
 ['story:look:0237:01','1425和1點士氣。'],
 ['story:look:0303:01','1237；如果選擇藍色圖標，獲得法術1238。'],
 ['story:look:0701:01','1430和1點強化。'],
 ['story:take:0348:01','1030和2點強化。'],
 ['story:take:0352:01','1361。'],
 ['story:take:0361:01','1031和2點強化。'],
 ['story:take:0364:01','1029和2點強化。'],
 ['story:take:0369:01','1374，並繼續執行壓制-擊殺行動。'],
 ['story:take:0380:01','1209和1點士氣。'],
 ['story:take:0393:01','1375，並繼續執行壓制-擊殺行動。'],
 ['story:take:0400:01','1472、$3和1點強化。'],
 ['story:take:0405:01','1030和2點強化。'],
 ['story:take:0410:01','573並失去1點士氣）。'],
 ['story:take:0414:01','960，並繼續執行除查看-搜索以外的任何行動。'],
 ['story:take:0415:01','1028和2點強化。'],
 ['story:take:0425:01','1029和2點強化。'],
 ['story:take:0431:01','1382，並繼續執行壓制-擊殺行動。'],
 ['story:take:0436:01','1028和2點強化。'],
 ['story:take:0446:01','1372，並繼續執行壓制-擊殺行動。'],
 ['story:take:0454:01','1028和2點強化。'],
 ['story:take:0463:01','1379，並繼續執行壓制-擊殺行動。'],
 ['story:take:0469:01','1030和2點強化。'],
 ['story:take:0474:01','1028和2點強化。'],
 ['story:take:0478:01','1031和2點強化。'],
 ['story:take:0482:01','1252和2點士氣；智慧生物在地圖上標出了你當前的地點（參見《萬境之書》第10頁；你位於地區G）。你還可以失去1點時間來獲得符文投射器（1029）。'],
 ['story:take:0498:01','1378，並繼續執行壓制-擊殺行動。'],
 ['story:take:0499:01','579並失去1點士氣）。'],
 ['story:take:0501:01','1031和2點強化。'],
 ['story:take:0514:01','1035和詛咒1393。'],
 ['story:take:0515:01','1428並獲得1點強化。'],
 ['story:take:0583:01','965並迅速退出至777。'],
 ['story:take:0613:01','1030和2點強化。'],
 ['story:take:0615:01','1030和2點強化。'],
 ['story:take:0616:01','1371，並繼續執行壓制-擊殺行動。'],
 ['story:take:0636:01','1347並前往430。'],
 ['story:take:0657:01','1380，並繼續執行壓制-擊殺行動。'],
 ['story:take:0682:01','586並失去1點士氣）。'],
 ['story:take:0686:01','1180）。'],
 ['story:take:0712:01','1031和2點強化。'],
 ['story:take:0729:01','1368，並繼續執行壓制-擊殺行動。'],
 ['story:take:0737:01','588並失去1點士氣）。'],
 ['story:take:0750:01','899、1點生命值和1點獲取。'],
 ['story:take:0752:01','1381，並繼續執行壓制-擊殺行動。'],
 ['story:take:0789:01','1199和詛咒1393。'],
 ['story:engage:0054:01','819）；一名瘦長的智慧生物也試圖打開你的錢袋，向你出售稀有的龍葉草（支付$5獲得植物1081）或漩渦龍舌蘭（支付$6獲得植物1046）。'],
 ['story:engage:0181:01','1470和2點強化。'],
 ['story:engage:0320:01','1598，則獲得該命運。無論如何，在該命運上添加1個信號標記。'],
 ['story:engage:0479:01','1358並前往743。否則，獲得物品940以幫助你留意威脅。'],
 ['story:engage:0515:01','1344並繼續。'],
 ['story:engage:0517:01','1033和智慧生物1316。'],
 ['story:engage:0788:01','1339。如果你不支付，智慧生物向你展示自己是如何賺錢的。獲得搶劫能力（1481）或偷取能力（1482）；你可以繼續。'],
 ['story:help:0116:01','1192，並向西前往115或繼續。'],
 ['story:help:0136:01','1153和構築物1286。'],
 ['story:help:0169:01','1367和1點生命值。否則，僅需跪拜即可獲得1點士氣。無論如何，繼續。'],
 ['story:help:0183:01','1305。'],
 ['story:help:0251:01','967；你可以繼續。'],
 ['story:help:0252:01','1331。'],
 ['story:help:0392:01','864。'],
 ['story:help:0418:scan:01','1092。'],
 ['story:help:0435:01','926；你可以向東前往734。'],
 ['story:help:0438:01','153）；如果拒絕，他給你一枚錢幣並祝你好運（獲得$1）。'],
 ['story:help:0495:scan:01','912；你可以向北前往354或向東前往496。'],
 ['story:help:0505:01','1686（將其橫向添加到你的供應區中）。如果你擁有載具，還能獲得智慧生物1320。'],
 ['story:help:0517:01','1033和智慧生物1316。'],
 ['story:help:0577:01','1045）。然後向北退出至465。'],
 ['story:help:0639:01','1092。'],
 ['story:help:0732:recovered:0182','命運1605（將其放置在中央區）和1點強化。'],
 ['story:help:0753:01','958）並載著你北行（前往754）。'],
 ['story:overpower:0044:01','1186。如果你支付2點強化，還能獲得物品991。'],
 ['story:overpower:0193:01','1136。'],
 ['story:overpower:0235:01','1136。'],
 ['story:overpower:0310:01','1136。'],
 ['story:overpower:0319:01','1163。否則，獲得物品1185。'],
 ['story:overpower:0372:01','927和1點士氣；你可以向北前往302。'],
 ['story:overpower:0391:01','1136。'],
 ['story:overpower:0398:01','1136。'],
 ['story:overpower:0418:01','1136。'],
 ['story:overpower:0428:01','1066和詛咒1385。'],
 ['story:overpower:0489:01','1186。如果你支付1點強化，還能獲得物品1161。'],
 ['story:overpower:0671:01','1136。'],
 ['story:overpower:0692:01','1163。否則，獲得物品1181。'],
 ['story:overpower:0702:01','1159時嗚咽起來。'],
 ['story:overpower:0705:01','1162。否則，獲得物品1179。'],
 ['story:overpower:0726:01','876和1點士氣。'],
 ['story:overpower:0739:01','984。'],
 ['story:overpower:0740:01','1136。'],
 ['story:overpower:0741:01','1136。'],
 ['story:overpower:0750:01','899、1點士氣和1點壓制。'],
 ['story:depart:0130:01','135。'],
 ['story:depart:0150:03','416。'],
 ['story:depart:0155:scan:02','150並獲得1點士氣。'],
 ['story:depart:0168:01','173；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0197:01','227；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0203:01','1505和1點士氣；前往208。'],
 ['story:depart:0211:02','1491和1點士氣；選擇一項：·保持在城市外：前往206。·當你靠近時，進入城市：前往城市522。'],
 ['story:depart:0222:01','1496並前往603。'],
 ['story:depart:0227:02','1491和1點士氣；前往232。'],
 ['story:depart:0260:01','265；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0286:01','291；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0430:04','429。'],
 ['story:depart:0435:01','1263）。向東前往734。'],
 ['story:depart:0442:01','443。'],
 ['story:depart:0462:02','279並獲得1點士氣。'],
 ['story:depart:0464:02','463；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0471:02','145並獲得1點士氣。'],
 ['story:depart:0495:02','496並獲得1點士氣。'],
 ['story:depart:0496:02','355並獲得1點士氣。'],
 ['story:depart:0553:01','1257並退出至120。'],
 ['story:depart:0583:01','1034並退出至778。'],
 ['story:depart:0597:01','1251並退出至310。'],
 ['story:depart:0614:03','613。'],
 ['story:depart:0648:01','478。否則，失去1點生命值並前往478。'],
 ['story:depart:0705:01','706並獲得1點士氣。'],
 ['story:depart:0714:01','715。'],
 ['story:depart:0718:01','202。'],
 ['story:depart:0723:02','722並獲得1點士氣。'],
 ['story:depart:0726:02','727、向東前往410、向南前往725或向西前往720。'],
 ['story:depart:0734:03','1263）。向西前往435。'],
 ['story:depart:0751:01','750；如果此行動的費用未減少至1點，還能獲得1點士氣。'],
 ['story:depart:0752:01','753；如果此行動的費用未減少至1點，還能獲得1點士氣。']
]){
 const r=WORLD.stories[ev];
 if(r&&!r[1].endsWith(suffix))r[1]+=suffix;
}
WORLD.stories['story:move:0762:01'][1]='選擇跟隨的對象：·跟隨智慧生物向南：前往761並獲得智慧生物1328且其「放置時」的效果只有1點強化（而非2點強化）。·跟隨道路向北：這條道路通向首都城市。前往763。·跟隨道路向東：這條道路通向首都城市的正門。前往768。';
WORLD.stories['story:move:0763:01'][1]='如果你擁有至少1件物品，前往內部589。否則，守衛因你沒有任何可以獻給創始者的東西而將你拒之門外；獲得1點強化並繼續。';
WORLD.stories['story:take:0577:01'][1]='你等待適當時機，當房間空無一人時，取走了一支裝滿納米技術的注射劑。獲得物品869並退出至464。';
WORLD.stories['story:take:0672:01'][1]='智慧生物懇求你不要拿走他的釣竿，因為這是他的生計來源。選擇一項：·無視智慧生物的請求，拿走釣竿：失去1點士氣。獲得物品921。·尊重他的意願，同意不偷釣竿：智慧生物送給你一袋魚和一些舊卡牌。獲得1點生命值和1張來自《交鋒》劇透包中的隨機牌。';
WORLD.stories['story:help:0437:01'][1]='你涉水走向這些動物們。它們吃驚地看到你從海浪中浮現，但還是膽怯地爬上了你的背，你將它們安全地送到岸邊。動物們的母親在你腳邊放下一顆藍色水晶以示感謝。獲得物品1160。';
WORLD.stories['story:help:0543:01']=[543,'該區域豐富的原材料加速了修復過程，你驚歎不已地發現一座鐵匠鋪從遺蹟中拔地而起。退出至264，然後獲得構築物1269。',5,'',1,'從遺蹟中組裝建築，恢復其昔日的輝煌（你可以支付當地智慧生物$X來減少此費用X點）'];
WORLD.stories['story:help:0545:01']=[545,'該區域豐富的原材料加速了修復過程，你驚歎不已地發現一座現代化前哨站從遺蹟中拔地而起。退出至404，然後獲得構築物1292。',5,'',1,'從遺蹟中組裝建築，恢復其昔日的輝煌（你可以支付當地智慧生物$X來減少此費用X點）'];
WORLD.stories['story:overpower:0666:recovered:0171']=[666,'選擇一項：·砍倒樹木：當你將它砍成兩半時，樹木發出痛苦的低吼。在裡面你發現了一塊發光的水晶，但看到攤在森林地面上那張毫無生氣的面孔時，你有一種絕望的感覺。獲得物品1165和詛咒1386。·使用創造工具（需擁有物品997）：在幾分鐘的雕刻之後，一個從樹木中浮現的身影擁抱了你並稱讚了你的技藝。獲得智慧生物1363。',4,'',1,'砍倒樹木或使用創造工具雕刻樹木'];
WORLD.stories['story:overpower:0686:01'][1]='這些樹枝非常柔韌，你可以選擇用它們製作彈簧陷阱（獲得物品926）或弓箭套件（獲得物品956）。你可以繼續。';
WORLD.stories['story:overpower:0777:01']=[777,'那個大智慧生物很容易成為靶子，不過一道力場將你的攻擊偏轉了。他俯身撲向你並要求查看身份證明。選擇一項：·如果你擁有任何金屬成分牌或支付$2：守衛將你作為發言人護送至長者議會。前往內部583。·如果你沒有任何金屬成分牌並且不支付：守衛將你從道路上推開，為「更高貴的出席者」讓路。獲得1點強化。',3,'',1,'瞄準哨兵'];
WORLD.stories['story:overpower:0782:01']=[782,'選擇要攻擊的智慧生物：·攻擊附近的綠色智慧生物：智慧生物被輕鬆擊敗。獲得$5。·攻擊岩架上的紫色智慧生物：他過分專注在綠色智慧生物身上，你打了他一個措手不及。他承諾不再糾纏綠色智慧生物，你嚇得他落荒而逃。安心下來後，綠色智慧生物通過一系列氣味與你交流，這些氣味不知為何讓你能夠理解。他正在被追捕而你拯救了他。他願意以朋友的身份加入你。獲得智慧生物1353。',3,'',1,'攻擊一名智慧生物'];
WORLD.stories['story:overpower:0784:01']=[784,'石頭重重地摔在地上，周圍的智慧生物們感到極度惶恐。儘管這是個不敬的行為，你卻高興地看到一根華麗的魔杖在灰塵中閃耀。獲得物品981和詛咒1388。',3,'',1,'劈砍腐朽的支柱'];
WORLD.stories['story:overpower:0785:recovered:0193']=[785,'擲4顆技能骰並獲得所有的移動結果。除非你支付1點移動，否則失去1點生命值。向東北前往389。',3,'',1,'瞄準橋上的智慧生物們'];
WORLD.stories['story:overpower:0787:01']=[787,'選擇一項：·從他腰帶上扯下一臺設備：獲得物品860和詛咒1391。·道歉並復位他脫臼的關節：獲得物品1264。',3,'',1,'在智慧生物疾馳而過時猛推他'];
WORLD.stories['story:overpower:0788:01']=[788,'獲得物品1264。',3,'',1,'制服智慧生物'];
WORLD.stories['story:overpower:0789:recovered:0198']=[789,'像這樣的商人根本沒有受過戰鬥訓練，你很快就擊垮了他。「求你了，」他乞求道，「拿走這些錢別來煩我了。」獲得$8。',2,'',1,'攻擊智慧生物'];
WORLD.stories['story:overpower:0790:recovered:0200']=[790,'獲得物品901。',3,'',1,'砍斷樹枝'];
for(const [ev,r] of Object.entries(WORLD.stories)){
 if(ev.startsWith('story:depart:')&&/前往$/.test(r[1])){
  const ex=Object.values(WORLD.cards[r[0]]?.exits||{}).find(e=>e.event_uid===ev);
  if(ex?.destination)r[1]+=ex.destination+'。';
 }
}
// Remove stray mid-sentence bullets and normalize bullet markers
for(const ev of ['story:depart:0044:01','story:depart:0251:01','story:depart:0486:02','story:help:0235:01','story:help:0463:01','story:overpower:0281:01','story:take:0174:01']){
 if(WORLD.stories[ev])WORLD.stories[ev][1]=WORLD.stories[ev][1].replace(/\s*·-?\s*/g,'，');
}
WORLD.stories['story:depart:0124:01'][1]='選擇一項：·進入（費用X）：一名守衛因你的傲慢而感到震驚，他試圖將你猛推回去，你趁機抓住破綻。擲X顆技能骰；如果結果中包含至少1點查看，守衛被你的假動作騙過了，前往內部554。否則，獲得1點強化並繼續。·跋涉（費用2）：你試圖與金屬智慧生物保持良好的關係以及適當的距離。前往485。';
WORLD.stories['story:depart:0707:01'][1]=WORLD.stories['story:depart:0707:01'][1].replace('選擇：uo','選擇一項：');
WORLD.stories['story:engage:1228:01'][1]='選擇一項：·支付$3獲得護目鏡（改善查看）：獲得物品968。·支付$2獲得玻璃飾品（改善接觸）：獲得物品1091。·支付$4獲得工具套件（改善幫助）：獲得物品880。·支付$5獲得粘合劑（改善獲取）：獲得物品866。·支付$4獲得小型捕魚籠（改善壓制）：獲得物品910。';
for(const r of Object.values(WORLD.stories)){
 if(r?.[1])r[1]=r[1].replace(/[•●▪]/g,'·');
}
const entryIndex=new Map();
for(const [event,row] of Object.entries(WORLD.stories)){
 if(event==='story:help:0061:01'||event==='story:move:1104:01')continue;
 const [,book]=event.split(':');const id=book+':'+row[0];
 if(!entryIndex.has(id))entryIndex.set(id,[]);
 const list=entryIndex.get(id);
 if(!list.some(r=>r[1]===row[1]))list.push(row)
}
function inlineOption(raw){
 const label=raw.trim(),compact=label.replace(/\s/g,'');
 const cost='(?:支付(?:[$＄]\\d+|\\d+點(?:強化|士氣|移動|查看|接觸|幫助|獲取|壓制)))';
 const effect='(?:獲得(?:\\d+點(?:強化|生命值?|士氣|時間|隨機技能)|(?:智慧生物|載具|物品|動物|植物)\\d{3,4})|前往(?:城市|洞穴|內部)?\\d{3})';
 // Only extract a literal consequence when every other word describes the choice.
 const literal=compact.match(new RegExp('^(?:'+cost+'(?:以|來|並)?)?('+effect+')$'));
 if(literal)return '·'+label+'：'+literal[1]+'。';
 if(/支付|失去|獲得.*獲得|如果|除非|或者|每|傷害|忽略|擲|任務|至少|繼續/.test(compact))return null;
 const named=compact.match(new RegExp('(?:[（(]|並|以)('+effect+')[）)]?$'));
 if(named)return '·'+label+'：'+named[1]+'。';
 const route=compact.match(/^向[東西南北]{1,2}[^，；。或]*前往(\d{3})$/);
 return route?'·'+label+'：前往'+route[1]+'。':null
}
// These entries share consequences across choices or express costs and travel in opposite orders.
// Look p. 4: OCR appended entries 108 and 109 to the rune action.
const rune107Original=WORLD.stories['story:look:0107:01'][1];
const rune107Text='每位玩家——包括你——位於含有任意符文（其視野內的技能圖標）的地點上就獲得1點強化。然後你擲X顆技能骰並獲得所有與此地點符文匹配的結果。如果還沒有玩家獲得任務1706，則獲得該任務（將其橫向添加到你的供應區中並在上面放置第一個標記）。';
WORLD.stories['story:look:0107:01'][1]=rune107Text;
// Help p. 6: entry 160 was assigned an unrelated workshop result.
const workshop160Old=WORLD.stories['story:help:0160:recovered:0047'][1];
const workshop160Text='首席鐵匠被你臨時創造的東西稍稍逗樂了，並挑戰你製作更困難的物品。獲得任務1644（將其橫向添加到你的供應區中）。';
WORLD.stories['story:help:0160:recovered:0047'][1]=workshop160Text;
WORLD.stories['story:help:0160:recovered:0047'][5]='製作物品來吸引經營者的注意';
const printedBranches=new Map();
// Printed card 1098; rules p. 8: challenge cost 3 plus one boost on this card.
const circuitCraftEvent='story:help:1098:printed:craft';
const batteryCraftEvent='story:help:0874:printed:craft';
const printedReplacementRecipes={[circuitCraftEvent]:{source:1098,targets:[1234,869,1041]},[batteryCraftEvent]:{source:874,targets:[948,982]}};
WORLD.stories[batteryCraftEvent]=[874,'選擇一項：·製作換能器：將此牌替換為948。·製作力場盾：將此牌替換為982。',5,'',0,'製作更高級的物品'];
WORLD.cards[874].actions.push({action_uid:'action:0874:printed:craft',action:'製作',family:'提供',event_uid:batteryCraftEvent,book:'help',entry:874,repeatable:true});
WORLD.stories[circuitCraftEvent]=[1098,'選擇一項：·製作電路管：將此牌替換為1234。·製作納米技術：將此牌替換為869。·製作電能火把：將此牌替換為1041。',3,'',0,'製作成更高級的物品'];
// Visually verified printed crafting actions: challenge cost plus one boost; reserve the source.
for(const [source,cost,targets] of [[875,4,[943,918]],[876,4,[943,895]],[881,4,[880,902]],[882,5,[880,937]],[883,5,[880,923]],[884,5,[904,944]],[890,4,[904,901]]]){
 const event='story:help:'+String(source).padStart(4,'0')+':printed:craft';
 printedReplacementRecipes[event]={source,targets,reserve:true};
 WORLD.stories[event]=[source,'選擇一項：'+targets.map(target=>'·製作'+({943:'撬鎖工具',918:'金屬鑰匙',895:'鏟子',880:'工具套件',902:'工具繩',937:'鐐銬',923:'捕獸夾',904:'攀岩揹帶',944:'束縛銬',901:'牽引索'}[target])+'（'+target+'）：儲備此牌，獲得卡牌'+target+'。').join(''),cost,'',0,'製作更高級的物品'];
 WORLD.cards[source].actions.push({action_uid:'action:'+source+':printed:craft',action:'製作',family:'提供',event_uid:event,book:'help',entry:source,repeatable:true});
}
// Cards 909, 911, 913 and 914: only 909 prints an extra boost cost.
for(const [source,cost,boost,reserve,products] of [
 [909,3,1,true,[[882,'鋼夾鉗'],[1209,'小刀'],[908,'煎鍋']]],
 [911,3,0,true,[[910,'小型捕魚籠'],[926,'彈簧陷阱'],[967,'通風夾克']]],
 [913,3,0,true,[[1411,'骨箭'],[921,'釣竿']]],
 [914,4,0,false,[[963,'攀岩鞋'],[915,'骨制砍刀'],[1231,'匕首']]]
]){
 const event='story:help:'+String(source).padStart(4,'0')+':printed:craft';
 printedReplacementRecipes[event]={source,targets:products.map(p=>p[0]),reserve,boost};
 WORLD.stories[event]=[source,'選擇一項：'+products.map(([target,name])=>'·製作'+name+'（'+target+'）：'+(reserve?'儲備此牌，獲得卡牌':'將此牌替換為')+target+'。').join(''),cost,'',0,'製作更高級的物品'];
 WORLD.cards[source].actions.push({action_uid:'action:'+source+':printed:craft',action:'製作',family:'提供',event_uid:event,book:'help',entry:source,repeatable:true});
}
function printedCraftBoost(event){const recipe=printedReplacementRecipes[event];return recipe?(recipe.boost??1):0}
WORLD.cards[1098].name='「吶尼吶尼」電路';
if(!WORLD.cards[1098].actions.some(a=>a.event_uid===circuitCraftEvent))WORLD.cards[1098].actions.push({action_uid:'action:1098:printed:craft',action:'製作',family:'提供',event_uid:circuitCraftEvent,book:'help',entry:1098,repeatable:true});
// Complete printed card craft / brew / refine / upgrade / spores / blueprint actions
function addPrintedRecipe(source,book,action,cost,boost,reserve,targets,extra={}){
 const event='story:'+book+':'+String(source).padStart(4,'0')+':printed:'+action;
 printedReplacementRecipes[event]={source,targets,reserve,boost,...extra};
 let text;
 if(extra.discardOnly){
  text='選擇一項：·淨化並失去此牌：失去此牌。';
 }else if(extra.floraBrew){
  const t=targets[0];
  text='選擇一項：·釀製卡牌'+t+'（替換此植物）：將此牌替換為'+t+'。·支付此植物上的1點強化，釀製卡牌'+t+'並保留植物：獲得卡牌'+t+'。';
 }else if(extra.keep){
  text='選擇一項：'+targets.map(t=>'·'+action+'卡牌'+t+'：保留此牌，獲得卡牌'+t+'。').join('');
 }else{
  text='選擇一項：'+targets.map(t=>'·'+action+'卡牌'+t+'：'+(reserve?'儲備此牌，獲得卡牌':'將此牌替換為')+t+(extra.fate?'，並獲得命運'+extra.fate:'')+'。').join('');
 }
 WORLD.stories[event]=[source,text,cost,'',0,action+'更高級的卡牌'];
 if(WORLD.cards[source]&&!WORLD.cards[source].actions.some(a=>a.event_uid===event)){
  WORLD.cards[source].actions.push({action_uid:'action:'+source+':printed:'+action,action,family:book==='take'?'探訪':'提供',event_uid:event,book,entry:source,repeatable:true});
 }
}
// Spores (867 -> 1103 -> 1104 -> 1105 -> 1106 -> purify)
for(const [src,next] of [[867,1103],[1103,1104],[1104,1105],[1105,1106]])addPrintedRecipe(src,'take','食用',1,1,false,[next]);
addPrintedRecipe(1106,'help','淨化',6,1,false,[1106],{discardOnly:true});
// Trinkets (1091-1102, excluding 1098 already above)
for(const [src,targets] of [[1091,[1413]],[1092,[1411,881,914]],[1093,[1412,1231,875]],[1094,[1418,1039,898]],[1095,[1414,872,1227]],[1096,[1415,890]],[1097,[1235,1085]],[1099,[1410]],[1100,[1416]],[1101,[1409,879,900]],[1102,[1417]]]){
 addPrintedRecipe(src,'help','製作',3,1,false,targets);
}
// Flora Brewing (1046-1082, 1136, 1159, 1224)
{
 const floraPotions={1046:861,1047:859,1048:863,1049:864,1050:864,1051:862,1052:864,1053:862,1054:862,1055:866,1056:861,1057:862,1058:861,1059:864,1060:859,1061:864,1062:862,1063:861,1064:863,1065:862,1066:863,1067:863,1068:864,1069:864,1070:865,1071:866,1072:859,1073:866,1074:863,1075:866,1076:859,1077:859,1078:861,1079:861,1080:863,1081:866,1082:859,1136:868,1159:867};
 for(const [srcStr,potion] of Object.entries(floraPotions)){
  const src=Number(srcStr),cost=src===1070?6:src===1159?2:3;
  addPrintedRecipe(src,'help','釀製',cost,0,false,[potion,potion],{floraBrew:true});
 }
 addPrintedRecipe(1224,'help','釀製',4,1,false,[1158],{keep:true});
}
// Crystals Refining (1160-1177)
for(let i=0;i<6;i++){
 addPrintedRecipe(1160+i,'help','提煉',5,0,false,[1166+i]);
 addPrintedRecipe(1166+i,'help','提煉',7,0,false,[1172+i]);
 addPrintedRecipe(1172+i,'help','提煉',9,0,false,[[991,995,993,994,990,992][i]]);
}
// Resources Crafting (1179-1186, 1190, 1194, 1211, 1212)
for(const [src,targets] of [[1179,[1095,906]],[1180,[1094,947]],[1181,[1096,911,858]],[1182,[1101,1128]],[1183,[1100,857]],[1184,[1093,909]],[1185,[1099]],[1186,[1092,913]],[1190,[1098]],[1194,[1091]],[1211,[1097,856]],[1212,[1102]]]){
 addPrintedRecipe(src,'help','製作',2,0,false,targets);
}
// Blueprints (1294-1298)
for(const [src,targets] of [[1294,[1267,1268,1269,1278,1282,1284]],[1295,[1265,1289,1290,1283]],[1296,[1266,1272,1287,1273,1291,1279,1285,1286,1288]],[1297,[1270,1274,1281,1292]],[1298,[1271,1275,1276,1277,1280,1293]]]){
 addPrintedRecipe(src,'help','組裝',5,0,false,targets);
}
// Arrows (1234, 1235, 1409-1418)
for(const [src,targets] of [[1234,[1233,877]],[1235,[1233,860]],[1409,[1233,870]],[1410,[1233,1036]],[1411,[1152,959]],[1412,[1233,905]],[1413,[1152,972]],[1414,[1152,894]],[1415,[956,902]],[1416,[956,1089]],[1417,[956,964]],[1418,[956,916]]]){
 addPrintedRecipe(src,'help','製作',4,1,false,targets);
}
// Items & Vehicles Craft/Upgrade (Reserve source)
for(const [src,cost,boost,targets] of [[870,5,1,[962]],[872,4,1,[950]],[873,5,1,[962]],[877,5,1,[871]],[878,6,1,[1024]],[879,4,1,[877]],[880,4,1,[943]],[885,6,1,[1024]],[891,6,1,[1024]],[904,4,0,[973]],[906,3,0,[872]],[907,5,0,[946]],[908,4,0,[930]],[910,5,0,[912]],[912,5,0,[923]],[915,5,1,[1189]],[919,5,1,[1189]],[920,5,1,[1189]],[921,4,0,[903]],[925,6,1,[1024]],[927,4,0,[955]],[932,5,0,[1023]],[933,4,0,[958,931]],[938,5,1,[1151]],[942,5,0,[928]],[943,5,1,[936]],[945,5,1,[1151]],[947,3,0,[921,933,1084]],[955,5,0,[989]],[956,4,0,[960]],[959,5,0,[960]],[960,6,0,[1038]],[963,5,0,[989]],[964,5,0,[965,925]],[966,4,0,[973,932]],[968,5,1,[935]],[969,4,1,[970,1090]],[970,5,1,[1152]],[972,5,1,[925,945]],[982,6,1,[983]],[1036,5,1,[1228]],[1041,4,1,[1187,874]],[1084,4,1,[961,912]],[1085,5,1,[1187,860]],[1086,4,1,[870]],[1087,4,1,[961,1088]],[1128,3,0,[1409,879]],[1152,5,0,[1153]],[1209,4,1,[1210,919,951]],[1210,5,1,[1151]],[1227,4,0,[907,976]],[1229,4,1,[886]],[1231,4,1,[1229,920]],[1233,5,0,[1153]]]){
 addPrintedRecipe(src,'help','製作',cost,boost,true,targets);
}
// Items & Vehicles Craft/Upgrade (Replace source)
for(const [src,cost,boost,targets,act,fate] of [[860,5,1,[871]],[898,4,1,[897]],[899,4,1,[897]],[916,5,1,[996]],[918,5,1,[996]],[922,6,1,[984],'升級'],[929,5,0,[928]],[930,5,1,[931,946]],[931,5,0,[1022],'升級'],[946,6,1,[984],'升級'],[951,5,0,[1022],'升級'],[957,6,0,[985,1023],'升級'],[962,6,1,[1253],'升級'],[965,6,1,[984],'升級'],[967,4,0,[942,957]],[973,5,1,[975,965]],[974,5,1,[946]],[975,6,1,[984],'升級'],[976,5,1,[922]],[984,8,0,[1434],'升級',1606],[1014,4,0,[1156],'升級'],[1015,6,0,[1016],'升級'],[1016,7,0,[1017],'升級'],[1017,8,0,[1434],'升級',1606],[1018,3,1,[1014]],[1032,6,0,[1289],'升級'],[1156,5,0,[1015],'升級'],[1187,2,1,[953]],[1188,4,1,[1032,957]],[1189,6,1,[886,889]],[1230,4,0,[974]],[1253,8,0,[1434],'升級',1606],[1434,9,0,[1033],'升級']]){
 addPrintedRecipe(src,'help',act||'製作',cost,boost,false,targets,fate?{fate}:{});
}

// Help p. 32: upgrading 989 replaces it with one of two vehicles.
printedBranches.set(WORLD.stories['story:help:0989:01'][1],[
 '選擇要升級成的載具。',
 '·升級為飄浮立方體1010：將原卡替換為飄浮立方體。',
 '·升級為噴氣揹包1253：將原卡替換為噴氣揹包。'
]);

// Card 954 and Help p. 32: converting the hammock is optional.
if(!WORLD.cards[954].actions.some(a=>a.event_uid==='story:help:0954:01'))WORLD.cards[954].actions.push({action_uid:'action:0954:craft',action:'製作',family:'提供',event_uid:'story:help:0954:01',book:'help',entry:954,repeatable:true});
printedBranches.set(WORLD.stories['story:help:0954:01'][1],[
 '選擇將吊床改造成滑翔翼，或保留吊床。',
 '·改成滑翔翼：將吊床替換為滑翔翼957。',
 '·保留吊床：獲得1點強化。'
]);

// Card 971 prints a Help/Craft action; Help p. 32 offers two products.
if(!WORLD.cards[971].actions.some(a=>a.event_uid==='story:help:0971:01'))WORLD.cards[971].actions.push({action_uid:'action:0971:craft',action:'製作',family:'提供',event_uid:'story:help:0971:01',book:'help',entry:971,repeatable:true});
printedBranches.set(WORLD.stories['story:help:0971:01'][1],[
 '選擇要製作的物品。',
 '·製作冬季外套：獲得物品929。',
 '·製作大鋪蓋卷：獲得物品1040。'
]);

// Help p. 25: the offering precedes the challenge roll; the reward is a choice.
printedBranches.set(WORLD.stories['story:help:0646:scan:01'][1],[
 '智慧生物感謝你的供奉，稱讚你是最卓越的陸行者，並讓你選擇報酬。',
 '·參加北邊的力量試煉：獲得物品889並前往647。',
 '·取得機甲位置的信息：獲得任務1656（將其橫向添加到你的供應區中）。'
]);

// Help p. 14: the OCR lost the chest reward number at the end of entry 340.
printedBranches.set(WORLD.stories['story:help:0340:01'][1],[
 '你修好了緩慢下沉的舊帆船，船主擁抱你表示感謝，並讓你選擇報酬。',
 '·接受前往西邊角岩尋求寧靜的任務：獲得1點移動和任務1676（將其橫向添加到你的供應區中）。',
 '·從寶箱取得物品：獲得物品1151。'
]);

// Engage p. 20: optional sale at printed value +2, followed by a separate offer.
printedBranches.set(WORLD.stories['story:engage:0476:01'][1],[
 '智慧生物提到東北城市的商業機會。獲得1點強化。他願意以牌面價值加2枚錢幣購買你網格或儲備區的一張牌。',
 '·按卡牌價值出售一張牌：取得牌面價值加2枚錢幣，然後查看商品。',
 '·保留財產：直接查看商品。'
]);
const resident476Shop='智慧生物提供基礎魔法課程與水袋。選擇一項：·支付$1學習魔法：獲得課程1419。·支付$2購買水袋：獲得物品858。·不購買：結束交易。';

// Engage p. 7: the boat offers four destinations or staying, after a shared meal.
printedBranches.set(WORLD.stories['story:engage:0172:01'][1],[
 '船員將船駛向你並接你上船，給了你一些肉乾。獲得1點生命。選擇目的地，或留在此處。',
 '·前往西北的漂浮石251：前往251。',
 '·前往東北的寶箱253：前往253。',
 '·前往東南的元素體168：前往168。',
 '·前往西南的發光樹166：前往166。',
 '·留在此處：你留在地點172。'
]);

// Move pp. 5 and 14: restore truncated routes and the missing climbing cost.
for(const [event,intro,choices] of [
 ['story:move:0109:01','動物摔向葉智慧生物。你趁機偷走一株植物並溜走。獲得植物1075。',[[ '向北前往114','前往114。'],['向東前往433','前往433。'],['向南前往104','前往104。'],['向西前往108','前往108。']]],
 ['story:move:0346:01','你頂著大風，來到一座奇怪的高塔前。',[['進入前門','前往內部076。'],['支付1點強化，攀爬至二樓窗戶','前往內部077。']]]
]){
 const row=WORLD.stories[event],old=row[1],parts=[intro,...choices.map(([label,outcome])=>'·'+label+'：'+outcome)];
 row[1]=intro+'選擇一項：'+parts.slice(1).join('');
 printedBranches.set(old,parts);printedBranches.set(row[1],parts);
}

// Overpower p. 33: fire is one benefit, followed by an optional wood exchange.
const fire1128=WORLD.stories['story:overpower:1128:01'][1];
printedBranches.set(fire1128,[
 '火焰短暫照亮了虛空。選擇一項效果，之後可決定是否用木頭製作火把。',
 '·刷新一顆挑戰骰：選擇網格中已放置的一顆骰子。',
 '·取得查看技能：獲得1點查看。',
 '·強化一個蛋：選擇一個蛋，添加1點強化。'
]);
const caveFireEvents=new Set(['0024','0036','0039'].map(n=>'story:overpower:'+n+':01'));
const fireEvents=new Set(['story:overpower:0870:scan:01','story:overpower:0873:recovered:0204',...caveFireEvents,...['0962','1128','1253','1409'].map(n=>'story:overpower:'+n+':01')]);
for(const event of fireEvents)printedBranches.set(WORLD.stories[event][1],printedBranches.get(fire1128));
printedBranches.set(WORLD.stories['story:overpower:1409:01'][1],['選擇一項火焰效果。',...printedBranches.get(fire1128).slice(1)]);
function fireAftermath(a){return caveFireEvents.has(a.event)?'你可以繼續執行查看－探索行動。':''}
const fireWoodChoice='選擇一項：·製作荊棘火把：以木頭1180交換火把1084。·保留木頭：不進行交換。';
printedBranches.set(fireWoodChoice,['你可以用木頭資源製作荊棘火把。','·製作荊棘火把：以木頭1180交換火把1084。','·保留木頭：不進行交換。']);

function definePrintedBranches(event,start,choices){
 const text=WORLD.stories[event][1],offset=text.lastIndexOf(start);
 if(offset>=0)printedBranches.set(text,[text.slice(0,offset),...choices.map(([label,result])=>'·'+label+'：'+result)])
}
printedBranches.set(WORLD.stories['story:engage:0365:01'][1],[
 '一位眼尖的漁夫把你拉上甲板，建議你向南躲避暴風雨。獲得1點強化。',
 '·支付$2，向北冒險：前往063。',
 '·免費前往東南方的旅行者處：前往507。','·免費前往南方海面上的高塔：前往506。','·免費前往西南方的黃金智慧生物處：前往505。'
]);
printedBranches.set(WORLD.stories['story:engage:0630:01'][1],[
 '載具回應你的呼喚，輕輕降落在雪地上。它可以帶你前往北方山谷中的三個地方。獲得1點強化。',
 '·前往西北方的古橋：前往495。','·前往北方被冰雪覆蓋的蓮花：前往496。','·前往東北方的倉庫：前往497。'
]);
definePrintedBranches('story:engage:0278:01','你可以選擇',[
 ['穿過洞口向北走','前往283。'],['留在原地繼續行動','繼續。']
]);
definePrintedBranches('story:engage:1274:01','之後，你選擇',[
 ['與肌腱智慧生物交談','獲得智慧生物1333。'],['與葉智慧生物交談','獲得智慧生物1350。']
]);
printedBranches.set(WORLD.stories['story:engage:0282:01'][1],[
 '沙智慧生物直接在你的腦海中溝通：「很多人嘗試過，但只有少數能成功攀上北邊的記憶宮殿頂端。」\n獲得1點移動。',
 '·接受攀登記憶宮殿的目標：獲得任務1630。','·精進能力：獲得能力1515。'
]);
definePrintedBranches('story:help:0188:01','，他讓你選擇',[
 ['收下特殊寶石','獲得物品1168。'],['學習如何取得命運號角','獲得1點強化和2點接觸。']
]);
definePrintedBranches('story:help:0199:recovered:0057','，他讓你選擇',[
 ['成為學徒','獲得智慧生物1338。'],['收下釘錘','獲得物品1036。']
]);
printedBranches.set(WORLD.stories['story:help:0462:01'][1],[
 '這名智慧生物是族中的偉大戰士，正計劃攻擊北方的風元素體。',
 '·邀請戰士同行：獲得智慧生物1311。',
 '·請戰士協助配對附近的符文發射器：獲得物品1027。'
]);
definePrintedBranches('story:help:0352:01','事成之後',[
 ['保留漁網','獲得物品911。'],['收下新鮮的魚','獲得1點士氣和1點生命值。']
]);
const cavernSearch=WORLD.stories['story:look:0081:01'];
const cavernOptions=['在洞窟後方，伺服器另一側的沉積物十分稀薄，你能看見遠處的動靜。','·選擇移動技能：獲得1點移動。你可以繼續。','·選擇壓制技能：獲得1點壓制。你可以繼續。'];
printedBranches.set(cavernSearch[1],cavernOptions);
cavernSearch[1]=cavernOptions[0]+'獲得1點移動或1點壓制；你可以繼續。';
printedBranches.set(cavernSearch[1],cavernOptions);
definePrintedBranches('story:take:0234:01','你可以向北',[
 ['踏著水面向北走','前往239。'],['留在原地繼續行動','繼續。']
]);
definePrintedBranches('story:take:0280:01','；你可以向北',[
 ['沿秘密階梯向北走','前往285。'],['留在原地','獲得1點移動。']
]);
definePrintedBranches('story:take:0286:01','獲得以下之一',[
 ['取走火把','獲得物品1087。'],['取走水晶','獲得物品1160。'],['取走錢袋','獲得$6。']
]);
definePrintedBranches('story:take:0327:01','，獲得2點接觸',[
 ['準備撬鎖','獲得2點接觸。繼續。'],['準備強行開鎖','獲得2點壓制。繼續。']
]);
definePrintedBranches('story:take:0345:01','，獲得1點幫助',[
 ['獲得幫助','獲得1點幫助。繼續。'],['獲得壓制','獲得1點壓制。繼續。']
]);
printedBranches.set(WORLD.stories['story:take:0658:01'][1],[
 '你從線纜中取出一些空氣，可以用它游往北方或西方。',
 ...[['北','north'],['西','west']].map(([direction,key])=>{
  const destination=WORLD.cards[658].exits[key].destination;
  return '·向'+direction+'游往'+destination+'：前往'+destination+'。此次抵達忽略缺氧傷害。'
 }),
 '·留在原地繼續行動：繼續。'
]);
printedBranches.set(WORLD.stories['story:take:0762:01'][1],[
 '智慧生物願意加入你，條件是你離開這座城市時必須往西或往南走。',
 '·答應往西或往南離開：獲得智慧生物1328。','·保留其他路線：獲得1點強化。'
]);
definePrintedBranches('story:take:0619:01','你可以歸還工具',[
 ['歸還工具','獲得2點強化。繼續。'],['保留工具','獲得物品873和詛咒1396。']
]);
{
 const routes=WORLD.cards[294].exits;
 const options=['你可以抓起一件物品，然後往東或往西逃離。'];
 for(const [item,id] of [['帳篷',1032],['火把',1085]]){
  for(const [direction,exit] of [['東',routes.east],['西',routes.west]]){
   options.push('·帶著'+item+'向'+direction+'前往'+exit.destination+'：獲得物品'+id+'。前往'+exit.destination+'。')
  }
 }
 printedBranches.set(WORLD.stories['story:take:0294:01'][1],options)
}
printedBranches.set(WORLD.stories['story:take:0491:01'][1],[
 '你從殘骸中找到可以回收的零件。','·取走金屬廢料：獲得物品1184。','·取走電路板：獲得物品1190。'
]);
printedBranches.set(WORLD.stories['story:take:0492:01'][1],[
 '雪橇主人是一名靠載人下山維生的電路智慧生物。你劫持雪橇的舉動激怒了他。',
 '·保留雪橇自行下山：獲得載具931和詛咒1396。向北前往351。',
 '·支付$3請主人載你下山：向北前往351。'
]);
definePrintedBranches('story:take:0267:01','選擇獲得',[
 ['摘下綠葉橙花','獲得植物1072。'],['摘下帶粉色花蕾的綠花','獲得植物1078。']
]);
definePrintedBranches('story:take:0733:01','選擇並獲得',[
 ['觸碰生命符號','獲得法術1236。'],['觸碰靈魂符號','獲得法術1237。'],['觸碰心靈符號','獲得法術1238。']
]);
definePrintedBranches('story:help:0172:01','，並讓你選擇',[
 ['加入船員的北上之旅','獲得任務1671。將任務卡橫放在供應區。'],
 ['送船員到北岸，留下小船','獲得載具1156。']
]);
definePrintedBranches('story:help:0175:01','作為回報',[
 ['收下兩枚錢幣','獲得$2。'],['試用閃閃發光的物質','獲得物品867。']
]);
definePrintedBranches('story:move:0684:01','選擇一項',[
 ['支付 1 點查看，或已解除甲蟲威脅','前往689。'],
 ['不支付 1 點查看','你未能察覺樹上的甲蟲，從階梯上摔了下去。失去1點生命，並向東前往685。']
]);
// Keep the shared reward or destination after either outcome of a skill check.
for(const row of Object.values(WORLD.stories)){
 const body=row[1],compact=body.replace(/\s/g,'');
 if(/[·•●]/.test(compact))continue;
 const check=compact.match(/擲(\d+)顆技能骰並獲得所有的?(移動|查看|接觸|幫助|獲取|壓制)結果。(?:然後)?除非你支付(\d+)點\2，否則失去(\d+)點生命值?。((?:然後)?(?:獲得(?:物品|植物|動物|智慧生物)\d{3,4}(?:和詛咒\d{4})?|前往\d{3})。|)$/);
 if(!check)continue;
 const [,count,skill,price,loss,shared]=check;
 const intro=compact.slice(0,check.index)+'擲'+count+'顆技能骰並獲得所有的'+skill+'結果。';
 const tail=shared.replace(/^然後/,'');
 printedBranches.set(body,[intro,'·支付'+price+'點'+skill+'：避開攻擊。'+tail,
  '·承受攻擊（生命 −'+loss+'）：失去'+loss+'點生命。'+tail])
}
// Move p. 9 and Depart p. 8 both send the unpaid route to 205.
for(const event of ['story:depart:0205:02','story:depart:0200:01','story:move:0200:01'])definePrintedBranches(event,'你可以支付',[
 ['支付2點查看進入濃霧深處','前往內部563。獲得1點士氣。'],
 ['前往地點 205','前往205。獲得1點士氣。']
]);
for(const event of ['story:engage:0440:01','story:engage:0736:01']){
 definePrintedBranches(event,'獲得2點強化，或者',[
  ['獲得2點強化','獲得2點強化。'],
  ['支付1點強化追加行動','繼續。']
 ])
}
printedBranches.set(WORLD.stories['story:engage:0790:01'][1],[
 '路過的智慧生物似乎都不在意，因此你解開了繩索。獲得物品901。',
 '·支付1點強化追加行動：繼續。',
 '·結束本回合：本回合結束。'
]);
definePrintedBranches('story:overpower:0477:01','你可以選擇',[
 ['下潛追蹤野獸（地點 642）','前往水下642。此次抵達忽略缺氧傷害。'],
 ['支付1點強化留在原地','繼續。']
]);
// Engage p. 10 ends entry 239 before the message board in entry 240.
definePrintedBranches('story:engage:0239:01','你可以支付',[
 ['支付$6購買特別版燈籠','獲得物品953。獲得1點強化。'],
 ['婉拒購買','獲得1點強化。']
]);
definePrintedBranches('story:depart:0201:01','選擇你的跳躍方向',[
 ['躍過左邊的缺口','前往206。'],
 ['躍過右邊的缺口','智慧生物飛到你身邊進行例行檢查。如果你擁有武器，他會警告你，叫你向盜賊之王報到。向東北前往207。']
]);
definePrintedBranches('story:move:0210:01','你可以選',[
 ['向北離開','前往215。'],['向南離開','前往205。']
]);
for(const [event,start,options] of [
 ['story:depart:0158:01','你可以選擇',[['進入黑暗洞穴',39],['繼續向北徒步',163]]],
 ['story:depart:0267:02','前往城市524',[['進入城市',524],['前往俯瞰城市的觀景點',262]]],
 ['story:depart:0642:02','選擇前往',[['進入水下城市',528],['游向地點 641',641]]],
 ['story:depart:0611:02','選擇前往',[['進入洞穴',21],['面對智慧生物',606]]]
]){
 definePrintedBranches(event,start,options.map(([label,n])=>[label,'前往'+String(n).padStart(3,'0')+'。']))
}
definePrintedBranches('story:look:0269:01','你可以選擇',[
 ['往西北方','前往273。'],['往東北方','前往447。'],['留在原地繼續行動','繼續。']
]);
for(const [event,split,reward,routes] of [
 ['story:engage:0328:01','他同意帶你','獲得智慧生物1323。',[['西北方的城市',332],['北方的市場',333]]],
 ['story:engage:0766:01','獲得法術','獲得法術1379。',[['西北方的飛舞動物',461],['東北方的高塔',346]]],
 ['story:help:0087:01','獲得智慧生物','獲得智慧生物1362。',[['回到地表洞穴',27],['深入星球內部',49]]],
 ['story:move:0249:01','獲得1點士氣','獲得1點士氣。',[['向北',665],['向南',244]]],
 ['story:take:0181:01','獲得物品','獲得物品1021。',[['向東',182],['向西',180]]]
]){
 const body=WORLD.stories[event][1],intro=body.replace(/\s/g,'').split(split)[0];
 printedBranches.set(body,[intro+reward,...routes.map(([label,n])=>{
  const number=String(n).padStart(3,'0');
  return '·'+label+'（'+number+'）：前往'+number+'。'
 })])
}
definePrintedBranches('story:take:0504:01','你必須立刻',[
 ['向東逃離（505）','前往505。獲得1點士氣。'],
 ['向西逃離（503）','前往503。獲得1點士氣。']
]);
for(const event of ['story:move:0213:01','story:depart:0213:01']){
 definePrintedBranches(event,'選擇向北',[
  ['繞過哨兵，向北前往 218','向北前往218。'],
  ['進入內部 513（受到 1 點高溫傷害）','受到1點高溫傷害。前往內部513。']
 ])
}
definePrintedBranches('story:depart:0486:recovered:02','你可以選擇支付',[
 ...['移動','獲取','時間'].map(resource=>['支付1點'+resource+'，將船推入水中','獲得載具1014。獲得$4。前往275。']),
 ['留下船隻，繼續前進','前往275。']
]);
definePrintedBranches('story:depart:0486:03','你可以再失去',[
 ['支付1點生命穿越鏡面沙地','向南前往736。'],
 ['掉頭留在地點 486','你回到原地。']
]);
for(const book of ['help','take']){
 const rides=[['西北',476],['東北',478],['東南',647],['西南',635]].map(([direction,n])=>
  ['搭乘動物往'+direction+'（'+n+'）','前往'+n+'。此次抵達忽略缺氧傷害。']);
 definePrintedBranches('story:'+book+':0642:01','你可以搭乘',[...rides,['不搭乘，留在地點 642','你留在原地。']])
}
printedBranches.set(WORLD.stories['story:help:0659:01'][1],[
 '你跪在墓地邊緣。一束光芒從骸骨中飄進你的胸膛，你感到煥然新生。獲得1點生命值。',
 ...[['北',660],['南',658],['西',653]].map(([direction,n])=>
  '·向'+direction+'前往 '+n+'：前往'+n+'。此次抵達忽略缺氧傷害。'),
 '·留在墓地繼續行動：繼續。'
]);
definePrintedBranches('story:overpower:0458:01','向東前往',[
 ['往東過橋（764）','前往764。繼續。'],
 ['往南過橋（457）','前往457。繼續。']
]);
{
 const text=WORLD.stories['story:engage:0217:01'][1];
 printedBranches.set(text,[
  text.split('獲得2點強化')[0]+'。獲得2點強化。',
  '·向北通過柵欄（222）：前往222。','·向東查看磁石（218）：前往218。'
 ])
}
definePrintedBranches('story:engage:0157:01','選擇一項',[
 ['留在這個區域','智慧生物邀你去北邊的火焰之城。「那裡有天下最頂尖的紋身店。」\n獲得2點強化和1點移動。'],
 ['進入傳送門（664）','穿越漫長距離時，你的耳朵嗡嗡作響。前往664。']
]);
definePrintedBranches('story:look:0664:01','你可以選擇',[
 ['穿過門道，進入洞穴 083','前往洞穴083。'],
 ['留在地點 664（獲得1點強化）','獲得1點強化。']
]);
definePrintedBranches('story:overpower:0090:01','你可以打開它',[
 ['打開暗門，進入地城 593','前往地城593。保留此地點作為參考。'],
 ['留下暗門，留在洞穴 090','你留在原地。']
]);
{
 const guide=WORLD.stories['story:take:0099:01'][1];
 const dive='前往地城599。抵達時不失去生命值，保留此地點作為參考。';
 printedBranches.set(guide,[
  '兩位遊客結束了行程。嚮導精通符文，願意收取 2 枚錢幣與你同行。你也可以自行決定是否深入地城。',
  '·支付$2僱用嚮導並進入地城 599：獲得智慧生物1329。'+dive,
  '·支付$2僱用嚮導並留在洞穴：獲得智慧生物1329。你留在原地。',
  '·獨自進入地城 599：'+dive,
  '·獨自留在洞穴：你留在原地。'
 ])
}
for(const [event,row] of Object.entries(WORLD.stories)){
 const body=row[1],text=body.replace(/\s/g,'');
 if(WORLD.cards[row[0]]?.home!=='location'||printedBranches.has(body)||!event.startsWith('story:'))continue;
 const route=text.match(/[。；]你可以向([東西南北]{1,2})前往(\d{3})。$/);
 if(!route||WORLD.cards[Number(route[2])]?.home!=='location')continue;
 const intro=text.slice(0,route.index);
 if(/[·●•]|如果|否則|或者|或|選擇|失去|傷害|支付|擲|繼續|除非/.test(intro))continue;
 printedBranches.set(body,[intro+'。','·向'+route[1]+'前往 '+route[2]+'：前往'+route[2]+'。','·留在原地：你留在原地。'])
}
{
 const text=WORLD.stories['story:move:0747:01'][1];
 printedBranches.set(text,[text.split('；你可以向北')[0]+'。',
  '·向北前往 748：前往748。','·留在原地：你留在原地。'])
}
const hotTreeEvents=new Set(['story:move:0166:01','story:take:0166:recovered:0051']);
for(const event of hotTreeEvents){
 definePrintedBranches(event,'選擇向東',[
  ['向東離開（167）','前往167。'],['向西離開（165）','前往165。']
 ])
}
const heatBeforeRouteEvents=new Set([...hotTreeEvents,'story:overpower:0217:01']);
definePrintedBranches('story:overpower:0217:01','你可以向北',[
 ['向北通過柵欄（222）','向北前往222。'],['留在原地','你留在原地。']
]);
definePrintedBranches('story:look:0021:01','在此之前',[
 ['支付1點獲取拆下設備','獲得物品988。獲得1點移動。繼續。'],
 ['支付2點強化拆下設備','獲得物品988。獲得1點移動。繼續。'],
 ['留下設備','獲得1點移動。繼續。']
]);
// Look p. 19 carries the destination and the alternative onto the following lines.
printedBranches.set(WORLD.stories['story:look:0466:01'][1],[
 '在附近的巨石頂部，你看到兩個強盜埋伏在缺口的兩側。',
 '·支付1點壓制突襲強盜：獲得物品1209。向北前往467。',
 '·支付2點強化突襲強盜：獲得物品1209。向北前往467。',
 '·避開埋伏，繼續行動：獲得2點強化。繼續。'
]);
definePrintedBranches('story:move:0345:01','如果你支付',[
 ['支付1點幫助救援動物','獲得動物836。'],
 ['留在動物身旁','動物死在你懷中。失去1點士氣。獲得1點強化。']
]);
const cityGateSearch='你正在尋找城市的後門入口。擲3顆技能骰並獲得所有的查看結果。';
printedBranches.set(cityGateSearch,[cityGateSearch,
 '·支付1點查看進入城市 041：前往城市041。',
 '·轉往地城 595：前往地城595。保留此地點作為參考。'
]);
const snowPath='動物為你開闢了一條下山的路。選擇一項：·向北前往 352：前往352。·留在原地：你留在原地。';
const curseReliefOutcomes=new Map([['story:move:0493:01',snowPath],['story:look:0493:01','你可以繼續。']]);
for(const event of curseReliefOutcomes.keys())definePrintedBranches(event,'失去1個詛咒',[
 ['解除一個詛咒','失去選定的詛咒。'],['獲得1點士氣','獲得1點士氣。']
]);
curseReliefOutcomes.set('story:help:0493:recovered:0129','你仍然為這次相遇感到高興。');
const largeTentText=WORLD.stories['story:move:0225:01'][1].split('較大的帳篷：')[1];
for(const body of [WORLD.stories['story:move:0131:01'][1],WORLD.stories['story:move:0294:01'][1],largeTentText]){
 const offer=body.match(/如果你支付1點獲取，([^。]+)（獲得物品(\d+)）。$/);
 if(offer)printedBranches.set(body,[body.slice(0,offer.index),
  '·支付1點獲取拿走物品 '+offer[2]+'：'+offer[1]+'。獲得物品'+offer[2]+'。',
  '·空手離開帳篷：你離開了帳篷。'])
}
// A single printed sentence can offer named items without bullets.
for(const row of Object.values(WORLD.stories)){
 const body=row[1];
 const offer=body.match(/(?:^|[。！])(?:選擇)?獲得[：:]?([^。！？·]+?)[。！]?$/);
 if(!offer||!offer[1].includes('或')||/[·•●]/.test(body))continue;
 const entries=offer[1].split(/[、或]/).map(entry=>entry.replace(/\s/g,'').match(/^([\u3400-\u9fff]{1,14})\s*[(（]\s*(?:物品)?\s*(\d{3,4})\s*[）)]$/));
 const types={item:'物品',flora:'植物',fauna:'動物'};
 if(entries.length<2||entries.some(m=>!m||!types[WORLD.cards[m[2]]?.home]))continue;
 const intro=body.slice(0,offer.index)+(offer.index?'。':'');
 printedBranches.set(body,[intro,...entries.map(m=>'·'+m[1]+'（'+m[2]+'）：獲得'+types[WORLD.cards[m[2]].home]+m[2]+'。')])
}
for(const [event,start,routes] of [
 ['story:overpower:0765:01','你可以降落',[['北',175],['東',783],['南',762],['西',753]]],
 ['story:take:0766:01','選擇讓他將你送往',[['西北',461],['北',345],['東北',346]]]
]){
 definePrintedBranches(event,start,routes.map(([direction,n])=>['往'+direction+'（'+n+'）','前往'+n+'。']))
}
{
 const body=WORLD.stories['story:move:0745:01'][1];
 const routes=[['東',751],['南',744],['北',746],['西',739]];
 printedBranches.set(body,[body.split('獲得載具')[0]+'獲得載具1156。',...routes.map(([direction,id],i)=>{
  const effect=i<2?'獲得詛咒1386':'獲得1點隨機技能';
  return '·向'+direction+'航行至 '+id+'（'+effect+'）：前往'+id+'。'+(i<2?'獲得卡牌1386':effect)+'。'
 })])
}
definePrintedBranches('story:overpower:0730:01','選擇一項',[
 ['退出洞穴往東（414）','前往414。'],['退出洞穴往西（724）','前往724。'],
 ['前往洞穴 020（生命 −1、獲取 +1）','失去1點生命值。獲得1點獲取。前往洞穴020。']
]);
for(const row of Object.values(WORLD.stories)){
 const text=row[1];
 if(!text.includes('紋身師')||!text.includes('1316')||!text.includes('1695')||!text.includes('1317'))continue;
 printedBranches.set(text,['兩名智慧生物詢問你需要誰的服務。',
  '·支付$3僱用冶煉工：冶煉工抖落身上的熔岩，加入你的行列。獲得智慧生物1316和任務1695。',
  '·聽冶煉工的建議（強化 +1）：他建議你去西邊的火焰之城謀生。獲得1點強化。',
  '·邀請紋身師同行：紋身師自願陪伴你。獲得智慧生物1317。'])
}
const practiceActions={
 'story:help:0139:01':[['跳/躍',1486],['劈砍',1493],['搜尋',1510]],
 'story:help:0220:01':[['尋找',1487],['劈砍',1493]]
};
const preparationChoices=new Set();
const elementPreparationIds=[168,242,446,463,657,729];
for(const [event,row] of Object.entries(WORLD.stories)){
 const compact=row[1].replace(/\s/g,'').replace('挑戰般','挑戰骰');
 const suffix='選擇一項：獲得1點隨機技能和1點任意技能；刷新你網格一行的所有挑戰骰；在你網格一列的每張牌上獲得1點強化。繼續。';
 if(!event.startsWith('story:look:')||!compact.endsWith(suffix))continue;
 preparationChoices.add(event);
 printedBranches.set(row[1],[compact.slice(0,-suffix.length)+'選擇準備方式，然後繼續行動。',
  ...['移動','查看','接觸','幫助','獲取','壓制'].map(skill=>'·取得1點'+skill+'與1點隨機技能：完成準備。'),
  ...[1,2,3].map(n=>'·刷新第'+n+'橫行的挑戰骰：完成準備。'),
  ...[1,2,3].map(n=>'·強化第'+n+'直列的每張牌：完成準備。')
 ]);
}
definePrintedBranches('story:take:1073:01','你可以繼續',[
 ['鼓起勇氣，繼續行動','忽略本回合剩餘挑戰骰的士氣結果。繼續。'],
 ['停止，強化植物','獲得1點強化。']
]);
printedBranches.set(WORLD.stories['story:take:1072:02'][1],[
 '你靈光一現。可以選擇一項技能，再擲4顆技能骰取得所有符合的結果並繼續；也可以停止，在此植物上獲得1點強化。',
 ...['移動','查看','接觸','幫助','獲取','壓制'].map(skill=>'·選擇'+skill+'並繼續：擲骰判定。'),
 '·停止，強化植物：獲得1點強化。'
]);
{
 const event='story:overpower:0518:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='高聳的風車似乎是為了產生風而不是隨風移動而設計的。智慧生物們解釋說，他們負責在世界各地播種。選擇一項：使用你的力量協助風車員工，或與下班的智慧生物進行交鋒。';
 definePrintedBranches(event,'選擇一項',[
  ['協助風車員工','獲得2點士氣。'],
  ['與下班的智慧生物對決','風智慧生物因能玩最喜歡的遊戲而兩眼放光。將卡牌798放在桌面上並遵循其指示，對手使用卡牌1518。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:move:0759:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]=old.slice(0,old.indexOf('導師讓你'))+'導師讓你選擇一項：獲得法杖（物品934）；成為他的學生（智慧生物1343）；體驗魔法（課程1433）。';
 definePrintedBranches(event,'導師讓你',[
  ['收下法杖（934）','獲得物品934。'],
  ['成為導師的學生（1343）','獲得智慧生物1343。'],
  ['體驗魔法（1433）','獲得課程1433。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:move:0726:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='智慧生物為了表達感謝送給你一個小信物。獲得物品876。然後他們迅速離開了。選擇一項：向北前往727；向東前往410；向南前往725；向西前往720。';
 definePrintedBranches(event,'選擇一項',[
  ['向北（727）','前往727。'],['向東（410）','前往410。'],
  ['向南（725）','前往725。'],['向西（720）','前往720。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
preparationChoices.add('story:look:0117:01');
printedBranches.set(WORLD.stories['story:look:0117:01'][1],['圍繞暗之石的岩石上畫有符文。選擇準備方式，之後可以繼續執行獲取－取出。',...printedBranches.get(WORLD.stories['story:look:0040:01'][1]).slice(1)]);
for(const id of elementPreparationIds){const event='story:look:'+String(id).padStart(4,'0')+':01';preparationChoices.add(event);printedBranches.set(WORLD.stories[event][1],['選擇準備方式，然後必須繼續執行幫助－釋放或壓制－擊殺。',...printedBranches.get(WORLD.stories['story:look:0040:01'][1]).slice(1)]);}
const animalTrapChoices={923:[810,813,829],926:[819,825,827],947:[821,824,854]};
for(const id of Object.keys(animalTrapChoices)){
 printedBranches.set(WORLD.stories['story:overpower:0'+id+':01'][1],[
  '選擇陷阱的目的，接著擲3顆挑戰骰。至少一顆符合所選骰面便成功，否則獲得1點壓制。',
  '·時間：研究動物行為。','·士氣：嘗試獲得動物夥伴。','·生命：獵取食物。'
 ]);
}
const locationTrapStories={
 116:{elem:'葉',animal:845,food:1217},140:{elem:'能量',animal:823,food:1211},224:{elem:'金屬',animal:831,food:1217},
 287:{elem:'沙',animal:836,food:1217},291:{elem:'沙',animal:832,food:1217,bonus:991},343:{elem:'黃金',animal:817,food:1217},
 411:{elem:'石',animal:838,food:1217},434:{elem:'葉',animal:851,food:1217},447:{elem:'電路',animal:820,food:1217},
 486:{elem:'肌腱',animal:826,food:1217},507:{elem:'風',animal:806,food:1226},631:{elem:'水',animal:847,food:1226},
 661:{elem:'水',vehicle:1013,food:1217},665:{elem:'木',animal:853,food:1217},679:{elem:'葉',animal:843,food:1136},
 707:{elem:'風',animal:840,food:1217},725:{elem:'能量',animal:822,food:1211},767:{elem:'風',animal:803,food:1217},
 780:{elem:'木',animal:1221,food:1217}
};
for(const id of Object.keys(locationTrapStories)){
 const ev='story:overpower:'+String(id).padStart(4,'0')+':01';
 if(WORLD.stories[ev])printedBranches.set(WORLD.stories[ev][1],[
  '選擇陷阱的目的，接著擲3顆挑戰骰。至少一顆符合所選骰面便成功，否則獲得1點壓制。',
  '·時間：研究動物行為。','·士氣：嘗試獲得動物夥伴。','·生命：獵取食物。'
 ]);
}
definePrintedBranches('story:engage:0301:01','你可以選擇',[
 ['只觀看儀式','獲得1點強化。'],
 ['獻出一位非能量智慧生物','獲得物品1243。解除你持有的能量詛咒。']
]);
const duelStoryPrizes={
 'story:overpower:0211:01':'獲得智慧生物1336。',
 'story:overpower:0322:01':'獲得植物1071。',
 'story:overpower:0338:01':'前往內部570。',
 'story:overpower:0676:01':'獲得物品1223。'
};
{
 const event='story:overpower:0077:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='選擇你的決鬥方式：攻擊智慧生物們，或與他們進行一場卡牌和骰子遊戲的對決。';
 definePrintedBranches(event,'選擇你的決鬥方式',[
  ['攻擊，拿走十字弩後退出','獲得物品1152。退出至346。'],
  ['攻擊後歸還武器，邀請同行','獲得智慧生物1309。前往內部078。'],
  ['進行卡牌與骰子對決','智慧生物邀請你加入遊戲。將卡牌798放在桌面上並遵循其指示，對手使用卡牌1518。獲勝後前往內部078，落敗則退出至346並繼續。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
definePrintedBranches('story:engage:0178:01','如果你同意',[
 ['支付$2換取花朵','獲得植物1076。'],
 ['交出一張有價值的卡牌換取花朵','獲得植物1076。'],
 ['拒絕交換，接受清新的空氣','獲得物品1212。']
]);
{
 const event='story:move:0306:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='你沿著海岸線一路潛行，海浪向你濺起鹽水。成功來到碎片底部後，你可以支付2點強化來取出它（獲得物品1216）。如果不支付，獲得1點獲取並繼續。';
 definePrintedBranches(event,'你可以支付',[
  ['支付2點強化，取出碎片','獲得物品1216。'],
  ['不取碎片，繼續行動','獲得1點獲取。繼續。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:overpower:0427:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]=old.slice(0,old.indexOf('選擇獲得'))+'選擇獲得一副望遠鏡（物品972）或一朵海月花（植物1066）。';
 definePrintedBranches(event,'選擇獲得',[
  ['望遠鏡（972）','獲得物品972。'],
  ['海月花（1066）','獲得植物1066。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:help:0667:recovered:0172',old=WORLD.stories[event][1];
 WORLD.stories[event]=[667,'新婚夫婦很快就過了橋，婚約自此締結。選擇一項：·給予每位新人一枚幸運幣（支付$2）：智慧生物們被陌生人的贈禮深深觸動，邀請你共進新婚的第一餐。獲得2點生命值。·給予祝福：新人們樂於和所有人一同慶祝，給了你一個大大的擁抱。獲得1點士氣。',2,'',1,'向智慧生物們的傳統致敬'];
 definePrintedBranches(event,'選擇一項',[
  ['支付$2，贈送幸運幣','新人邀請你共進新婚的第一餐。獲得2點生命值。'],
  ['給予祝福','新人給了你一個大大的擁抱。獲得1點士氣。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
WORLD.stories['story:help:0586:01'][1]='確保區域安全後，你有時間環顧四周。附近的戒指對你來說很顯眼；獲得物品995。如果X為4+，門可以維持足夠長的時間以讓你再順走其他物品（獲得物品916）。然後向北退出至687。';
WORLD.stories['story:help:0586:01'][5]='建立路障';
for(const [event,row] of Object.entries(WORLD.stories)){
 if(!event.startsWith('story:overpower:')||!row[1].includes('符文投射器')||!row[1].includes('選擇獲得金屬廢料'))continue;
 const old=row[1],intro=old.slice(0,old.indexOf('選擇獲得金屬廢料')).replace(/[，,]\s*$/,'。');
 row[1]=intro+'選擇獲得金屬廢料（物品1184）或電路板（物品1190）。';
 definePrintedBranches(event,'選擇獲得金屬廢料',[
  ['金屬廢料（1184）','獲得物品1184。'],
  ['電路板（1190）','獲得物品1190。']
 ]);
 printedBranches.set(old,printedBranches.get(row[1]));
}
{
 const event='story:overpower:0772:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]=old.slice(0,old.indexOf('選擇獲得'))+'選擇獲得船隻（獲得載具1015）或智慧生物（獲得智慧生物1355）。';
 definePrintedBranches(event,'選擇獲得',[
  ['接受船隻（1015）','獲得載具1015。'],
  ['邀請智慧生物同行（1355）','獲得智慧生物1355。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
printedBranches.set(WORLD.stories['story:move:0252:01'][1],[
 '你可以接近旅行者，詢問逃離這顆星球的可能性，或接近智慧生物，詢問他的職業。',
 '·詢問旅行者：他建議你在北方或南方的城市重新開始生活。獲得1點強化。獲得命運1601。',
 '·詢問馴鷹者，接受骨髓禿鷹：馴鷹者向你展示他控制飛行生物的技藝。獲得動物826。這隻動物附帶1點強化。',
 '·詢問馴鷹者，邀請他同行：馴鷹者向你展示他控制飛行生物的技藝。獲得智慧生物1331。'
]);
{
 const event='story:engage:0252:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='智慧生物吹噓自己為馴鷹者，他控制著在周圍區域偵查的骨髓禿鷹。他身上佩戴的骨飾體現著他的技藝。你可以選擇獲得一隻骨髓禿鷹（動物826）並在其上附帶1點強化，或者獲得智慧生物1331。';
 definePrintedBranches(event,'你可以選擇',[
  ['骨髓禿鷹（826，附帶 1 點強化）','獲得動物826。這隻動物附帶1點強化。'],
  ['邀請馴鷹者同行（1331）','獲得智慧生物1331。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:help:0776:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='你可以向商販學習一些製作技巧（獲得能力1462），或者替他送一個包裹（獲得物品1034和任務1638；將任務橫向添加到你的供應區中）。無論如何，他都感謝你的熱心幫助，並為你提供一件長袍的折扣價；你可以支付$4獲得物品966。';
 definePrintedBranches(event,'你可以向商販',[
  ['學習製作技巧，不買長袍','獲得能力1462。'],
  ['學習製作技巧，支付$4買長袍','獲得能力1462。獲得物品966。'],
  ['替商販送包裹，不買長袍','獲得物品1034。獲得任務1638（將其橫向添加到你的供應區中）。'],
  ['替商販送包裹，支付$4買長袍','獲得物品1034。獲得任務1638（將其橫向添加到你的供應區中）。獲得物品966。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
{
 const event='story:help:0775:01',old=WORLD.stories[event][1];
 WORLD.stories[event][1]='智慧生物感激地點了點頭並痛飲了一大口。他評論了你的一件盔甲，在打量了你之後，他問你是否願意與他一起離開這座城市。如果你同意，獲得智慧生物1334並向西南前往768。';
 definePrintedBranches(event,'如果你同意',[
  ['與智慧生物一起離城','獲得智慧生物1334。向西南前往768。'],
  ['婉拒同行，留在原地','留在此處。']
 ]);
 printedBranches.set(old,printedBranches.get(WORLD.stories[event][1]));
}
definePrintedBranches('story:overpower:0583:01','選擇獲得',[
 ['包裹（1034）','獲得物品1034。退出至777。'],
 ['連體衣（965）','獲得物品965。退出至777。']
]);
definePrintedBranches('story:overpower:0582:recovered:0147','選擇獲得',[
 ['炸藥（877）','獲得物品877。向北前往641。'],
 ['劍（887）','獲得物品887。向北前往641。'],
 ['三叉戟（1090）','獲得物品1090。向北前往641。']
]);
definePrintedBranches('story:overpower:0619:01','如果你同意',[
 ['重新連接線纜，接受效忠','獲得智慧生物1310。'],
 ['拒絕效忠，取得物品','獲得物品873。']
]);
for(const event of ['story:move:0183:01','story:move:0183:02']){
 definePrintedBranches(event,'如果你同意',[
  ['陪同舞者前往生命試煉','獲得智慧生物1305。向東前往184。'],
  ['婉拒同行，留在原地','留在此處。']
 ]);
}
definePrintedBranches('story:take:0146:01','如果你同意',[
 ['答應前往西南方，邀請同行','獲得智慧生物1329。向西南前往140。'],
 ['不招募，留在原地','留在此處。']
]);
definePrintedBranches('story:move:0526:01','支付$1來選擇',[
 ['支付$1購買火天鵝（816）','獲得動物816。'],
 ['支付$1購買以太蛾（823）','獲得動物823。'],
 ['支付$1購買腐械鷗（820）','獲得動物820。'],
 ['不購買動物','獲得1點強化。']
]);
definePrintedBranches('story:look:0733:01','選擇獲得',[
 ['生命法術（1236）','獲得法術1236。'],
 ['靈魂法術（1237）','獲得法術1237。'],
 ['心靈法術（1238）','獲得法術1238。']
]);
definePrintedBranches('story:move:0525:01','選擇獲得',[
 ['藍色投射器（1028）','獲得物品1028。'],
 ['紫色投射器（1030）','獲得物品1030。'],
 ['橙色投射器（1026）','獲得物品1026。'],
 ['綠色投射器（1029）','獲得物品1029。'],
 ['黃色投射器（1031）','獲得物品1031。'],
 ['紅色投射器（1027）','獲得物品1027。']
]);
definePrintedBranches('story:take:0526:01','選擇獲得',[
 ['接受藏寶圖（1260）','獲得物品1260。智慧生物標出了你當前的地點（參見《萬境之書》第17頁；你位於地區K）。'],
 ['接受 15 枚錢幣','獲得$15。']
]);
definePrintedBranches('story:take:0788:01','如果你同意',[
 ['歸還地圖，邀請同行','獲得智慧生物1339。'],
 ['保留地圖（1264）','獲得物品1264。智慧生物在地圖上標出了你當前的地點（參見《萬境之書》第21頁；你位於地區I）。']
]);
definePrintedBranches('story:help:1274:01','選擇獲得',[
 ['邀請風智慧生物（1306）','獲得智慧生物1306。'],
 ['邀請能量智慧生物（1326）','獲得智慧生物1326。'],
 ['邀請石智慧生物（1347）','獲得智慧生物1347。']
]);
definePrintedBranches('story:engage:0785:01','如果你同意',[
 ['答應守橋','獲得任務1680（將其橫向添加到你的供應區中）。'],
 ['不接受守橋任務','獲得1點強化。繼續。']
]);
definePrintedBranches('story:help:0677:01','·如果你同意等待',[
 ['留下等待採集者','獲得任務1636（將其橫向添加到你的供應區中）。'],
 ['不等待，進入城市','前往城市519。']
]);
definePrintedBranches('story:depart:0577:01','你只有一瞬間',[
 ['帶走書本（1045）','獲得物品1045。退出至465。'],
 ['帶走地圖（1262）','獲得物品1262。退出至465。']
]);
definePrintedBranches('story:look:0580:01','選擇獲得',[
 ['紫色水晶（1161）','獲得物品1161。退出至613。'],
 ['冰鞋（951）','獲得物品951。退出至613。'],
 ['時間炸彈（871）','獲得物品871。退出至613。'],
 ['螺絲刀（875）','獲得物品875。退出至613。']
]);
for(const book of ['engage','help']){
 definePrintedBranches('story:'+book+':0728:01','如果你同意',[
  ['一同觀看信仰之躍','獲得智慧生物1347。向西前往722。'],
  ['尋找失蹤的懸尾獸','獲得任務1650（將其橫向添加到你的供應區中）。']
 ]);
}
definePrintedBranches('story:engage:0726:01','如果你同意',[
 ['加入朝聖之旅','獲得1點移動。向東北前往411。'],
 ['留在原地','獲得1點士氣。']
]);
definePrintedBranches('story:help:0771:01','他們讓你選擇',[
 ['收取 3 枚錢幣','獲得$3。你可以繼續。'],
 ['收下桶（1158）','獲得物品1158。你可以繼續。']
]);
definePrintedBranches('story:take:0342:01','如果你同意',[
 ['讓船主保留小船，接受進城與錢幣','前往城市529。獲得$5。'],
 ['取得小船','獲得載具1156。']
]);
const cityEntryFollowups={
 'story:look:0162:01':{destination:525,book:'look',skill:'查看',name:'導航',amount:1},
 'story:look:0186:01':{destination:518,book:'take',skill:'獲取',name:'探訪',amount:2},
 'story:look:0206:01':{destination:522,book:'engage',skill:'接觸',name:'交易',amount:2},
 'story:look:0238:01':{destination:520,book:'move',skill:'移動',name:'進入',amount:2},
 'story:look:0332:01':{destination:530,book:'take',skill:'獲取',name:'探訪',amount:2},
 'story:look:0342:01':{destination:529,book:'help',skill:'幫助',name:'提供',amount:2},
 'story:look:0473:01':{destination:526,book:'take',skill:'獲取',name:'探訪',amount:1},
 'story:look:0677:01':{destination:519,book:'look',skill:'查看',name:'導航',amount:2},
 'story:look:0641:01':{destination:528,book:'look',skill:'查看',name:'導航',amount:2},
 'story:look:0738:01':{destination:527,book:'engage',skill:'接觸',name:'交談',amount:1},
 'story:look:0727:01':{destination:523,book:'engage',skill:'接觸',name:'交易'},
 'story:look:0748:01':{destination:531,book:'look',skill:'查看',name:'導航'}
};
for(const [event,target] of Object.entries(cityEntryFollowups)){
 const amount=target.amount??2,body=WORLD.stories[event][1];
 const start=body.includes('如果你選擇進入')?'如果你選擇進入':body.includes('如果你跟隨他們')?'如果你跟隨他們':'如果你進入';
 definePrintedBranches(event,start,[
  [(start==='如果你跟隨他們'?'跟隨智慧生物':'從這個入口進入')+'（'+target.skill+' +'+amount+'，接著執行'+target.name+'）','獲得'+amount+'點'+target.skill+'。前往城市'+target.destination+'。繼續執行'+target.skill+'－'+target.name+'行動。'],
  ['直接進入城市 '+target.destination,'前往城市'+target.destination+'。']
 ]);
}
definePrintedBranches('story:help:0723:01','選擇獲得',[
 ['學習跳／躍（1486）','獲得能力1486。'],
 ['學習攀登（1503）','獲得能力1503。你可以繼續執行移動－攀登行動。'],
 ['學習強行（1512）','獲得能力1512。']
]);
for(const [event,options] of Object.entries(practiceActions)){
 definePrintedBranches(event,'選擇練習',options.map(([name,n])=>['練習'+name,'獲得能力'+n+'。你可以繼續執行「'+name+'」。']))
}
for(const [event,options] of [
 ['story:help:0269:01',[['避開',1485],['平衡',1501],['推／按',1502]]],
 ['story:help:0391:01',[['攀登',1503],['挖掘',1509]]],
 ['story:help:0430:01',[['游泳',1460],['導航',1464],['躲避',1466],['逃避',1485]]],
 ['story:help:0481:01',[['躲避',1466],['跳躍',1486],['涉水',1489]]]
]){
 definePrintedBranches(event,'選擇',options.map(([name,n])=>['練習'+name,'獲得能力'+n+'。你可以繼續。']))
}
for(const [event,start,routes] of [
 ['story:engage:0640:01','，並選擇向北',[['向北',641],['進入建築物',582]]],
 ['story:help:0278:01','，向東前往',[['向東',279],['向西',277]]]
]){
 const body=WORLD.stories[event][1],offset=body.lastIndexOf(start);
 if(offset>=0)printedBranches.set(body,[body.slice(0,offset)+'。',...routes.map(([label,id])=>'·'+label+'（'+id+'）：前往'+id+'。')])
}
definePrintedBranches('story:engage:0676:01','你可以選擇',[
 ['留下來（強化 +1，繼續行動）','獲得1點強化。繼續。'],['前往大使館（585）','前往內部585。']
]);
printedBranches.set(WORLD.stories['story:help:0314:01'][1],[
 '船主感謝你修復舊船，願意領你進入洞穴。他提醒你裡面有毒氣，並開價 2 枚錢幣出售面具。',
 '·支付$2買面具，進入洞穴：獲得物品964。前往洞穴097。',
 '·支付$2買面具，留在原地：獲得物品964。獲得1點士氣。',
 '·直接進入洞穴：前往洞穴097。',
 '·留在原地：獲得1點士氣。'
]);
definePrintedBranches('story:look:0314:01','你可以選擇',[
 ['帶走小船','獲得載具1014。'],['進入洞穴（037）','前往洞穴037。']
]);
definePrintedBranches('story:help:0144:01','獲得物品861',[
 ['收下物品 861','獲得物品861。'],['邀請智慧生物同行','獲得智慧生物1352。']
]);
definePrintedBranches('story:help:0380:01','獲得 小刀',[
 ['留下小刀','獲得物品1209。'],['讓怕刀的動物同行','獲得動物813。']
]);
definePrintedBranches('story:help:0777:01','你可以',[
 ['婉拒代班（強化 +1，繼續行動）','獲得1點強化。繼續。'],
 ['替他看守（時間 −1，錢幣 +5）','失去1點時間。獲得$5。']
]);
definePrintedBranches('story:depart:0276:02','根據你選擇的移動類型',[
 ['保持平衡向南通過','獲得能力1501。前往487。'],
 ['向南縱身飛躍','獲得能力1486。前往487。']
]);
definePrintedBranches('story:look:0045:01','；你可以深入',[
 ['留在洞穴 045','留在原地。'],['深入洞穴 040','前往洞穴040。']
]);
const serpentFight='你擊敗巨蛇，在破損的箱子裡發現一顆閃閃發光的大種子。獲得物品1020。選擇一項：·深入地城 594：前往地城594（保留此地點作為參考）。·返回洞穴 031：前往洞穴031。';
const immediateEncounters={
 'story:overpower:0091:01':[['飛奔出洞穴','move',3,'前往洞穴031。'],['迎戰巨蛇','overpower',8,serpentFight]],
 'story:overpower:0095:01':[['飛奔出洞穴','move',2,'前往洞穴035。'],['迎戰野獸','overpower',6,'野獸倒在洞窟地板上，你拾起一塊黃色水晶。獲得物品1164。水晶照亮洞穴後方的通道。前往地城596；保留此地點作為參考。']]
};
immediateEncounters['story:look:0251:01']=[
 ['下降到坑中取珠寶','move',2,'地面在你腳下劇烈晃動，隨後一切陷入黑暗。前往洞穴049。'],
 ['從外緣取出珠寶','take',4,'你謹慎地取出珠寶。獲得物品991。']
];
definePrintedBranches('story:look:0251:01','，接著你可以',[
 ['下降到坑中取珠寶（移動 2）','執行移動行動。'],
 ['從外緣取出珠寶（獲取 4）','執行獲取行動。'],
 ['不取珠寶，留在原地','留在原地。']
]);
const herdAttack='你擊退了包圍你的野獸。獲得物品1162和1點壓制。選擇一項：·向北前進（684）：前往684。·留在此處：留在原地。';
for(const [event,options] of Object.entries(immediateEncounters)){
 definePrintedBranches(event,'你必須立即',options.map(([name,book,cost])=>[name+'（'+volumes[book]+' '+cost+'）','立即執行'+volumes[book]+'行動。']))
}
for(const [event,start,actions] of [
 ['story:engage:0095:01','選擇一項',[
  ['觀察這隻動物','look',2,'這隻巨大的動物讓你想起章魚，只是體型更大，而且生活在陸地上。獲得1點強化並繼續。'],
  ['捕捉這隻動物','take',5,'動物的母性本能被徹底激發出來，拼命掙扎。你與它搏鬥，直到將其制服。獲得動物825。']
 ]],
 ['story:overpower:0382:01','你可以選擇',[
  ['推開巨石','move',2,'獲得物品889。'],['粉碎巨石','overpower',3,'獲得物品889。']
 ]]
]){
 immediateEncounters[event]=actions;
 const options=actions.map(([label,book,cost])=>[label+'（'+volumes[book]+' '+cost+'）','執行'+volumes[book]+'行動。']);
 if(event==='story:overpower:0382:01')options.push(['不取劍','留在原地。']);
 definePrintedBranches(event,start,options)
}
{
 const event='story:move:0453:01',raid=WORLD.stories[event][1].split('劫掠鑄造廠：')[1];
 const loot=[[874,'電池組'],[938,'鐮刀'],[976,'盔甲']];
 const options=[raid.split('選擇獲得')[0]];
 for(const [i,[id,name]] of loot.entries()){
  options.push('·取走'+name+'：獲得物品'+id+'。');
  for(const [other,second] of loot.slice(i+1)){
   options.push('·取走'+name+'與'+second+'，承受詛咒：獲得物品'+id+'。獲得物品'+other+'。獲得詛咒1394。')
  }
 }
 printedBranches.set(raid,options);
 const actions=[['拿起電池組衝出去','move',3,'獲得物品874。'],['說服工匠交出盔甲','engage',4,'獲得物品976。'],['劫掠鑄造廠','overpower',5,raid]];
 immediateEncounters[event]=actions;
 definePrintedBranches(event,'繼續執行',actions.map(([name,book,cost])=>[name+'（'+volumes[book]+' '+cost+'）','執行'+volumes[book]+'行動。']))
}
immediateEncounters['story:overpower:0642:01']=[null,['繼續狩獵','overpower',5,'野獸癱軟下來，沉入深淵。牠的精華隨潮水漂入你的意識。獲得法術1380。']];
definePrintedBranches('story:overpower:0642:01','你可以選擇停止',[
 ['停止狩獵','動物認可了你的悔意，贈予你一件信物。獲得物品1183。'],
 ['繼續狩獵（壓制 5）','執行壓制行動。']
]);
immediateEncounters['story:depart:0679:01']=[
 ['娛樂這些動物','engage',3,'你唱起歌，真菌生物們左右搖擺，跟著哼唱。一隻幼獸領你向北前進。獲得動物843。前往684。'],
 ['攻擊這些動物','overpower',6,herdAttack]
];
definePrintedBranches('story:depart:0679:01','你必須立即',[
 ['娛樂這些動物（接觸 3）','立即執行接觸行動。'],['攻擊這些動物（壓制 6）','立即執行壓制行動。']
]);
for(const [event,direct,name,book,cost,outcome] of [
 ['story:depart:0190:01',['向北繞過山丘（195）','前往195。'],'在洞口探索','look',4,'雙眼適應黑暗後，你看見前方的障礙。前往洞穴036。'],
 ['story:depart:0332:01',['從後門進入城市（530）','獲得1點隨機技能。前往城市530。'],'下降至北方山谷','move',6,'從尖塔下降讓你筋疲力盡。獲得能力1491和1點士氣。前往337。']
]){
 immediateEncounters[event]=[null,[name,book,cost,outcome]];
 definePrintedBranches(event,'選擇一項',[direct,[name+'（'+volumes[book]+' '+cost+'）','立即執行'+volumes[book]+'行動。']])
}
const spiderRoutes='你在與蜘蛛的戰鬥中佔了上風。獲得物品1164。選擇一項：·向北前進（686）：前往686。·向東離開（移動 1）：執行移動行動。·向南離開（移動 3）：執行移動行動。·向西離開（移動 3）：執行移動行動。';
immediateEncounters['story:engage:0681:01']=[
 ['飛奔穿過樹木左側','move',4,'蜘蛛離開了狩獵的位置，沒能抓住你。向北前往686。'],
 ['攻擊蜘蛛','overpower',4,spiderRoutes]
];
definePrintedBranches('story:engage:0681:01','·移動',[
 ['飛奔穿過樹木左側（移動 4）','立即執行移動行動。'],['攻擊蜘蛛（壓制 4）','立即執行壓制行動。']
]);
immediateEncounters['story:overpower:0681:after-engage']=[null,...['east','south','west'].map(dir=>{
 const exit=WORLD.cards[681].exits[dir],row=WORLD.stories[exit.event_uid];
 return ['向'+({east:'東',south:'南',west:'西'})[dir]+'離開','move',row?.[2]??exit.cost,row?.[1]??('前往'+exit.destination+'。')]
})];
immediateEncounters['story:overpower:0681:01']=[
 ['攻擊蜘蛛','overpower',2,spiderRoutes],
 ['餵養蜘蛛','help',2,'蜘蛛貪婪地吞下食物。'+spiderRoutes.slice(spiderRoutes.indexOf('選擇一項'))]
];
definePrintedBranches('story:overpower:0681:01','選擇一個行動',[
 ['攻擊蜘蛛（壓制 2）','立即執行壓制行動。'],['餵養蜘蛛（幫助 2）','從食物、動物或肌腱牌支付1點強化。']
]);
immediateEncounters['story:depart:0681:01']=[
 ['向西潛入海中','move',4,'野獸沒有跟你下水。前往451。'],
 ['抵禦蜘蛛攻擊','overpower',6,'你擊敗了蜘蛛。獲得物品1164。向北前往686。']
];
for(const [event,abilities,after] of [
 ['story:help:0654:01',[['導航',1464],['擠／壓',1507],['切／砍',1508]],'你可以繼續。'],
 ['story:help:0663:01',[['詢問',1470],['偷取',1482],['建立',1488]],''],
 ['story:help:0681:01',[['保衛',1478],['開闢',1484],['擠／壓',1507],['切／砍',1508]],'你可以繼續。']
]){
 definePrintedBranches(event,'選擇獲得',abilities.map(([name,id])=>['練習'+name,'獲得能力'+id+'。'+after]))
}
function resolveSpiderAmbush(a){
 if(a.event!=='story:depart:0681:01'||a.spiderResolved)return;
 a.spiderResolved=true;
 if(s.spiderDefeated){a.text='潛伏的蜘蛛已被擊敗。向北前往686。';return}
 a.text='當你穿過樹林，一隻巨大的蜘蛛從上方撲下，獠牙刺入你的頸部。選擇如何應對：·向西潛入海中（移動 4）：立即執行移動行動。·抵禦蜘蛛攻擊（壓制 6）：立即執行壓制行動。';
 settleLosses('失去1點生命值。',a)
}
function trialFollowup(a,outcome){
 const text=outcome.replace(/\s/g,'');
 if(!text.includes('歡迎你參加試煉。'))return;
 const instruction=text.match(/。繼續執行(移動|查看|接觸|幫助|獲取|壓制)[-－]?([^。]+)行動。*$/);
 if(!instruction)return;
 return WORLD.cards[a.id]?.actions.find(target=>volumes[target.book]===instruction[1]&&target.action===instruction[2]&&WORLD.stories[target.event_uid])
}
const discountedFollowups=new Map();
for(const id of elementPreparationIds)discountedFollowups.set('story:look:'+String(id).padStart(4,'0')+':01',['help','overpower'].map(book=>({...WORLD.cards[id].actions.find(a=>a.book===book),discount:0,allowRepeat:true}))); 
{
 const event='story:engage:0084:01',targets=['move','help'].map(book=>WORLD.cards[84].actions.find(a=>a.book===book));
 discountedFollowups.set(event,targets.map(a=>({...a,discount:0})));
 printedBranches.set(WORLD.stories[event][1],['你可以先刷新自己網格中任意一列的所有挑戰骰，再選擇行動。',
  ...targets.map(a=>'·執行'+volumes[a.book]+'－'+a.action+'（費用 '+WORLD.stories[a.event_uid][2]+'）：執行指定行動。')])
}

{
 const event='story:look:0210:01';
 const trapped=['move','overpower'].map(book=>({...WORLD.cards[210].actions.find(a=>a.book===book),discount:0,allowRepeat:true}));
 discountedFollowups.set(event,[null,null,...trapped]);
 definePrintedBranches(event,'你可以支付',[
  ['支付1點移動掙脫磁場','向北前往215。'],
  ['支付1點壓制掙脫磁場','向北前往215。'],
  ...trapped.map(a=>['執行'+volumes[a.book]+'－'+a.action+'（費用 '+WORLD.stories[a.event_uid][2]+'）','執行指定行動。'])
 ])
}
for(const [event,row] of Object.entries(WORLD.stories)){
 const t=row[1].replace(/\s/g,'');
 if(!event.startsWith('story:help:')||!t.includes('你可以選擇繼續執行')||!t.includes('且費用減少3點，或者'))continue;
 const item=t.includes('獲得物品1097')?1097:t.includes('獲得物品1099')?1099:0;
 if(!item)continue;
 const book=item===1097?'engage':'take';
 const target=WORLD.cards[row[0]]?.actions.find(a=>a.book===book);
 if(!target||!WORLD.stories[target.event_uid])continue;
 discountedFollowups.set(event,[target]);
 definePrintedBranches(event,'你可以選擇',[
  ['繼續執行'+target.action+'（費用減少 3 點）','執行指定行動。'],
  ['製作物品 '+item,'獲得物品'+item+'。']
 ])
}
{
 const event='story:take:0467:01';
 const targets=['engage','overpower'].map(book=>WORLD.cards[467].actions.find(action=>action.book===book));
 discountedFollowups.set(event,targets);
 definePrintedBranches(event,'繼續執行',targets.map(target=>[
  target.action+'（'+volumes[target.book]+' '+(WORLD.stories[target.event_uid][2]-3)+'）','執行指定行動。'
 ]))
}
definePrintedBranches('story:engage:1013:01','支付$1或$2',[
 ['支付$1替此牌添加1點強化','獲得1點強化。'],
 ['支付$2替此牌添加2點強化','獲得2點強化。'],
 ['不付款，繼續行動','繼續。']
]);
definePrintedBranches('story:engage:0378:01','支付$3',[
 ...[['爆炸物',879],['鏟子',900],['盔甲',946],['紅色花朵',1069],['橙色水晶',1162],['符文投射器地圖',1255]].map(([name,n])=>['支付$3購買'+name,'獲得'+(n===1069?'植物':'物品')+n+'。']),
 ['不購物（獲得 1 錢幣）','獲得$1。']
]);
for(const [event,labels] of [
 ['story:engage:0769:01',['支付$3僱用保鑣','接下向北追討欠款的任務']],
 ['story:engage:0770:01',['支付$10買下小船','接受船主同行的提議']]
]){
 const text=WORLD.stories[event][1],parts=text.split('·');
 printedBranches.set(text,[parts[0],...labels.map((label,i)=>
  '·'+label+'：'+parts[i+1].slice(parts[i+1].indexOf('：')+1).trim())])
}
const peddlerGoods=[
 ['支付$4購買釘錘','獲得物品969。'],
 ['支付$4購買里拉琴','獲得物品970。'],
 ['支付$8購買劍','獲得物品888。'],
 ['支付$3購買攀巖鞋','獲得物品963。'],
 ['離開攤位','商販建議你向東或向南前行。']
];
const peddlerAfterSale='商販付清了貨款。選擇一項：'+peddlerGoods.map(([label,result])=>'·'+label+'：'+result).join('');
definePrintedBranches('story:engage:0258:01','你可以支付',[
 ['按卡牌價值出售一張牌','商販願意收購網格或儲備區中的一張牌。'],...peddlerGoods
]);
const goggleChoices=[
 ['支付$3購買護目鏡','獲得物品941。退出至333。'],
 ['離開商店','退出至333。']
];
const goggleAfterSale='店主已按卡牌價值付款。選擇一項：'+goggleChoices.map(([label,result])=>'·'+label+'：'+result).join('');
definePrintedBranches('story:look:0568:01','他願意',[
 ['按卡牌價值出售一張牌','店主願意收購網格或儲備區中的一張牌。'],...goggleChoices
]);
definePrintedBranches('story:take:0568:01','你可支付',[
 ['支付$3買下焊接工具','獲得物品873。退出至333。'],
 ['離開商店','退出至333。']
]);
definePrintedBranches('story:engage:0568:01','你可以選擇',[
 ['支付$6購買通風夾克','獲得物品967。退出至333。'],
 ['出售物品、動物或植物','按卡牌價值收款。退出至333。'],
 ['婉拒交易','獲得1點強化。退出至333。']
]);
definePrintedBranches('story:engage:0321:01','歡迎你加入',[
 ['進入宇宙學院','前往內部600。'],
 ['留在學院外','獲得1點強化。']
]);
definePrintedBranches('story:help:0047:01','如果你接受',[
 ['跟隨獵人參加狩獵試煉','前往261。之後的回合可在當地執行壓制－狩獵。'],
 ['留在原地','獲得1點強化。']
]);
{
 const text=WORLD.stories['story:take:0056:01'][1];
 const [intro,...routes]=text.split('·');
 printedBranches.set(text,[intro.replace('1359，','1359。'),...routes.map(route=>'·'+route.trim())])
}
const turtleRide='獲得載具1013。海龜附帶1點強化。選擇向東北前往632或向東前往631。';
definePrintedBranches('story:engage:0381:01','選擇一項',[
 ['用一張植物或食物牌餵海龜',turtleRide],
 ['使用植物或食物牌上的1點強化餵海龜',turtleRide],
 ['讓海龜等候其他乘客','獲得1點強化。']
]);
definePrintedBranches('story:take:0381:01','你可以選擇',[
 ['用一張植物或食物牌餵海龜','獲得載具1013。海龜附帶1點強化。'],
 ['支付1點士氣，驅使海龜','獲得載具1013。海龜附帶1點強化。'],
 ['讓海龜留在原地','獲得1點強化。繼續。']
]);
definePrintedBranches('story:engage:0504:01','選擇一項',[
 ['加入船員，向西尋找寶箱','前往502。獲得1點獲取。'],
 ['按卡牌價值出售一張牌','可出售網格、儲備區或供應區中的一張牌。'],
 ['支付$15買下走私植物','獲得植物1070。'],
 ['收下海盜送的果汁','獲得物品1158。'],
 ['支付$40買下海盜船','獲得載具1017和物品1260。大副標出了你的位置：《萬境之書》第17頁，地區D。']
]);
definePrintedBranches('story:engage:0768:01','選擇一項',[
 ['支付$1購買一盤小吃','獲得2點士氣。'],
 ['支付$3購買城市地圖','獲得物品1154。'],
 ['支付$4購買小吃與地圖','獲得2點士氣和物品1154。'],
 ['什麼都不買','商販出於同情給了你一枚錢幣。獲得$1。']
]);
definePrintedBranches('story:engage:0775:01','選擇一項',[
 ['支付$2僱用保鑣','獲得智慧生物1334。'],
 ['先接受保鑣的任務','獲得任務1635。將其橫向添加到你的供應區中。']
]);
definePrintedBranches('story:engage:0776:01','選擇一項',[
 ['支付$5購買消暑長袍','獲得物品966。'],
 ['支付$5購買保暖外套','獲得物品922。'],
 ['接受向西北運送包裹的任務','獲得物品1034和任務1638。將任務橫向添加到你的供應區中。'],
 ['婉拒交易，繼續行動','獲得1點強化。繼續。']
]);
definePrintedBranches('story:engage:0773:01','向北前往',[
 ['支付$2小費，邀對方同行','獲得智慧生物1342。向北前往774。'],
 ['道謝後進入首都','向北前往774。']
]);
{
 const text=WORLD.stories['story:look:0492:01'][1];
 printedBranches.set(text,[
  '你看見一排覆著冰雪的茅屋，走近時在融雪上滑了一跤。一名住戶願意收取2枚錢幣，帶你安全下山。',
  '·支付$2，請住戶帶路：向北前往351。獲得1點士氣。',
  '·留在坡道：獲得1點強化。繼續。'
 ])
}
definePrintedBranches('story:engage:0665:01','如果你支付',[
 ['支付$29購買山丘公寓','獲得構築物1701。'],
 ['接受房東的任務','獲得任務1693。將其橫向添加到你的供應區中。']
]);
definePrintedBranches('story:engage:0759:01','如果你支付',[
 ['支付$2招募智慧生物','獲得智慧生物1343。'],['接受治療','獲得1點生命值。']
]);
definePrintedBranches('story:engage:0771:01','如果你支付',[
 ['支付$30購買船隻','獲得載具1016。'],['與船長喝麥酒','獲得1點士氣。繼續。']
]);
definePrintedBranches('story:move:0746:01','如果你支付',[
 ['支付1點查看，取得物品1018','獲得物品1018。'],['取走物品955','獲得物品955。']
]);
definePrintedBranches('story:move:0709:01','如果你支付',[
 ['支付1點幫助，解救智慧生物','獲得智慧生物1346。'],['繼續前行','獲得2點幫助。繼續。']
]);
definePrintedBranches('story:overpower:0300:01','如果你支付',[
 ['支付2點幫助，拔掉尖刺','獲得動物841。'],['繼續行動','獲得2點幫助。繼續。']
]);
definePrintedBranches('story:take:0079:01','如果你支付',[
 ['支付1點移動，把握落地時機','前往洞穴046。'],['繼續行動','獲得1點強化。繼續。']
]);
definePrintedBranches('story:engage:0417:01','如果你支付',[
 ['支付$2，請對方帶路','前往洞穴094。'],['留在原地','獲得1點強化。']
]);
definePrintedBranches('story:move:0216:01','如果你支付',[
 ['支付$1，進入博物館','前往內部564。'],['留在館外','獲得1點強化。繼續。']
]);
definePrintedBranches('story:move:0332:01','如果你支付',[
 ['支付1點接觸，進入城市','前往城市530。'],['支付$1，進入城市','前往城市530。'],
 ['留在城外','獲得1點強化。繼續。']
]);
definePrintedBranches('story:move:0455:01','如果你支付',[
 ['支付$2，向東北進入首都','前往762。獲得1點隨機技能。'],['留在城外','獲得1點強化。繼續。']
]);
definePrintedBranches('story:engage:0388:01','如果你支付',[
 ['支付$2通過守衛（780）','前往780。'],['留在此處（強化 +1，繼續行動）','獲得1點強化並繼續。']
]);
definePrintedBranches('story:engage:0391:01','如果你支付',[
 ['支付$1向西南前進（787）','前往787。'],['留在此處（強化 +1，繼續行動）','獲得1點強化並繼續。']
]);
definePrintedBranches('story:engage:0751:01','如果你支付',[
 ['支付$1僱用孩子，讓灰塵鼠同行','獲得動物835和任務1643。'],
 ['接受孩子的僱用（獲得 1 錢幣）','獲得$1和任務1643。']
]);
definePrintedBranches('story:depart:0191:02','進入小鎮',[
 ['進入小鎮（518）','前往城市518。'],['繞過小鎮（186）','前往186。']
]);
definePrintedBranches('story:depart:0243:02','你可以進入城市',[
 ['進入城市（520）','前往城市520。'],['繞過城市（238）','前往238。']
]);
definePrintedBranches('story:depart:0712:02','你可以選擇進入',[
 ['進入古老的遺蹟（547）','前往內部547。'],['繞過遺蹟（711）','前往711。']
]);
{
 const tip='住戶推薦你去欣賞東邊根之塔的景色。';
 definePrintedBranches('story:engage:0453:01','選擇一項',[
  ['與住戶交談，不購物',tip],
  ['與球體互動','球體的外部是一塊留言板。你可以透過 orb.stonemaiergames.com 閱讀其他旅人關於這一區域的留言，並幫助其他迷途的旅人。獲得1點強化。'],
  ['支付$5向住戶購買重型盔甲','獲得物品976。'+tip],
  ['支付$7向住戶購買電池組','獲得物品874。'+tip]
 ])
}
definePrintedBranches('story:take:0417:01','你可以選擇獲得',[
 ['留下木鑰匙','獲得物品916。'],['歸還木鑰匙，接受效忠','獲得智慧生物1318。']
]);
definePrintedBranches('story:overpower:0712:01','選擇獲得',[
 ['拿取金屬廢料','獲得物品1184。'],['拿取電路板','獲得物品1190。']
]);
definePrintedBranches('story:overpower:1285:01','選擇',[
 ['強化孵化場','在此構築物上添加1點強化。'],
 ['強化一個蛋','在選定的蛋上添加2點強化。']
]);
definePrintedBranches('story:engage:0376:01','選擇一項',[
 ['如果你擁有一個蛋','孵化該蛋並獲得1點士氣。'],
 ['如果你沒有蛋','智慧生物描述了加速孵化過程所需的熱量。獲得1點強化。'],
 ['支付$35購買家庭工坊','獲得物品860、物品870、物品978和構築物1691。'],
 ['詢問售價後放棄購買','屋主願意以$35出售家庭工坊。獲得1點強化。']
]);
definePrintedBranches('story:help:0525:01','選擇一項',[
 ['照料一顆蛋','獲得物品978。'],
 ['照料新孵化的生物','獲得動物814。'],
 ['留在城市，到鐵匠鋪工作','獲得構築物1269。'],
 ['留在城市，到孵化場工作','獲得構築物1285。']
]);
definePrintedBranches('story:engage:0254:01','你可以支付',[
 ['支付$2購買炒鍋','獲得物品907。獲得1點強化。'],['拒絕購買','獲得1點強化。']
]);
for(const event of ['story:move:0604:01','story:engage:0604:01']){
 definePrintedBranches(event,event.includes(':move:')?'你可以選擇支付':'你可以支付',[
  ['支付1點士氣陪伴智慧生物','獲得智慧生物1312。向西前往603。'],['繼續','繼續。']
 ])
}
definePrintedBranches('story:overpower:1190:01','你可以選擇',[
 ['向北前往602','前往602。'],['支付1點移動前往洞穴022','前往洞穴022。']
]);
definePrintedBranches('story:engage:0302:01','如果你支付',[
 ['支付$1寄送家書（士氣 +1）','獲得1點士氣。'],
 ['支付$3邀請智慧生物同行','獲得智慧生物1331。'],
 ['支付$4寄送家書並邀請同行','獲得1點士氣。獲得智慧生物1331。'],
 ['收下贈蛋（生命 +1）','獲得1點生命值。']
]);
definePrintedBranches('story:engage:0202:01','如果你支付',[
 ['支付$4邀請同行','獲得智慧生物1337。'],['按下符文投射器的按鈕','獲得1點強化。繼續。']
]);
definePrintedBranches('story:engage:0300:01','如果你支付',[
 ['支付2點幫助移除尖刺','獲得動物841。'],['讓動物休息','獲得2點幫助。繼續。']
]);
definePrintedBranches('story:take:0676:01','智慧生物主動提供',[
 ['收下食譜','獲得物品1223。'],['邀請草藥師同行','獲得智慧生物1350。'],['支付1點獲取換解毒劑','獲得物品865。']
]);
{
 const text=WORLD.stories['story:take:0302:01'][1],intro=text.slice(0,text.indexOf('選擇保留'));
 const parts=[intro];
 for(const [what,outcome] of [['保留蛋','獲得物品1213。'],['吃下蛋','獲得2點生命值。']]){
  parts.push('·'+what+'並留在原地：'+outcome,'·支付1點移動，'+what+'並向北前往307：'+outcome+'前往307。')
 }
 printedBranches.set(text,parts)
}
for(const [event,row] of Object.entries(WORLD.stories)){
 if(!/^story:overpower:\d{4}:\d+$/.test(event)||/[·：]/.test(row[1]))continue;
 const hunt=row[1].replace(/\s/g,'').match(/如果你支付1點強化，從(?:屍|戶)(?:11去)?體中獲得物品(\d{4})。(?:否則|如果不支付)，獲得物品(\d{4})。?(無論如何，獲得詛咒\d{4}。)?$/);
 if(!hunt||!WORLD.cards[hunt[1]]||!WORLD.cards[hunt[2]])continue;
 const shared=hunt[3]||'';
 definePrintedBranches(event,'如果你支付',[
  ['支付1點強化，取得物品'+hunt[1],'獲得物品'+hunt[1]+'。'+shared],
  ['直接取得物品'+hunt[2],'獲得物品'+hunt[2]+'。'+shared]
 ])
}
definePrintedBranches('story:help:1590:01','選擇獲得',[
 ['涉水（穿過水域）','獲得能力1489。'],
 ['切／砍（移除信號）','獲得能力1508。']
]);
definePrintedBranches('story:look:0262:01','選擇一項',[
 ['進入城市後方的洞穴','前往洞穴027。'],
 ['從骨飾大門進城，與商販交易','獲得1點接觸。前往城市524，並繼續執行接觸－交易行動。'],
 ['從主門進城','前往城市524。']
]);
cityEntryFollowups['story:look:0262:01']={destination:524,book:'engage',skill:'接觸',name:'交易',choice:2};
cityEntryFollowups['story:look:0627:01']={destination:521,book:'engage',skill:'接觸',name:'交易',choice:4};
{
 const body=WORLD.stories['story:look:0627:01'][1],parts=body.split(/(?=·)/);
 printedBranches.set(body,[...parts.slice(0,4),
  '·沿纜索進入水晶商店（接觸 +1，接著交易）：獲得1點接觸。前往城市521。繼續執行接觸－交易行動。',
  '·直接前往城市 521：前往城市521。'
 ]);
}
// Keep the terrain description on the button and give the travel resolver the printed location number.
for(const id of [1580,1583,1585,1586,1591,1594,1597]){
 const text=WORLD.stories['story:engage:'+id+':01'][1];
 const [intro,...options]=text.split('·');
 printedBranches.set(text,[intro,...options.map(option=>{
  const label=option.trim().replace(/。$/,'');
  const destination=label.match(/^前往[^。0-9]+(\d{3})$/);
  return '·'+label+'：'+(destination?'前往'+destination[1]:label)+'。'
 })])
}
definePrintedBranches('story:engage:1577:01','選擇一項',[
 ['尋找肌腱元素體','前往270。獲得1點生命值。'],
 ['尋找金屬元素體','前往392。刷新網格中的所有骰子。'],
 ['尋找葉元素體','前往430。獲得1點移動。'],
 ['尋找風元素體','前往462。獲得1點生命值。'],
 ['留在當前地點','獲得1點強化。']
]);
definePrintedBranches('story:depart:0641:01','選擇一項',[
 ['進入城市528','前往城市528。'],['向北游過城市','前往642。']
]);
definePrintedBranches('story:engage:0656:01','選擇一項',[
 ['免費聽取洞穴情報','獲得1點獲取或1點壓制。'],
 ...[1,2,3].map(row=>['支付$1，刷新第'+row+'橫行的挑戰骰','獲得1點獲取或1點壓制。你可以繼續。'])
]);
definePrintedBranches('story:move:0785:01','選擇一項',[
 ['挑釁守衛，執行壓制 3 的保衛行動','守衛察覺到你的敵意，向你發起攻擊。'],
 ['支付$2通行費，向西北進城','前往780。'],
 ['協助守衛看守橋樑','獲得任務1680。將其橫向添加到你的供應區中。']
]);
immediateEncounters['story:move:0785:01']=[
 ['抵擋橋上守衛的攻擊','overpower',3,'獲得物品891。向西北前往780。']
];
definePrintedBranches('story:take:0785:01','等待時',[
 ['前往城市西北側','前往780。'],
 ['沿城牆向北跟隨守衛','前往786。'],
 ['支付1點強化以獲得技能，前往城市西北側','獲得2點任意技能。前往780。'],
 ['支付1點強化以獲得技能，沿城牆向北跟隨守衛','獲得2點任意技能。前往786。']
]);
definePrintedBranches('story:take:0301:01','你可以支付',[
 ['留在原地','留在原地。'],
 ['支付1點強化，向北前進','前往306。']
]);
definePrintedBranches('story:overpower:0658:01','你可以支付',[
 ['支付2點強化，幫助智慧生物上浮','獲得智慧生物1318。前往451。'],
 ['讓他自行上浮','獲得1點強化。繼續。']
]);
definePrintedBranches('story:help:0652:recovered:0168','你可以支付',[
 ['留在原地並繼續行動','繼續。'],
 ['支付1點強化，向東前進','前往658。'],
 ['支付1點強化，向南前進','前往651。'],
 ['支付1點強化，向西前進','前往646。']
]);
definePrintedBranches('story:overpower:0172:01','；你可以支付',[
 ['留在原地','留在遠岸。'],
 ['支付1點移動，向西北前進','前往251。'],
 ['支付1點查看，向西北前進','前往251。']
]);
printedBranches.set(WORLD.stories['story:depart:0375:02'][1],[
 '你向南游往較平靜的水域。你要睜開眼睛，還是閉著眼睛游？',
 '·支付1點強化，睜眼游泳：鹽水刺痛雙眼，但你及時看見海蛇龍，繞過了牠。前往356。',
 '·閉眼游泳：你的腳被水中生物咬了一口。失去1點生命值。前往356。'
]);
definePrintedBranches('story:move:0375:01','船長的注意力',[
 ['趁船長專心掌舵，準備劫持或劫掠船隻','獲得1點獲取或1點壓制。繼續。'],
 ['遠離小船','獲得1點移動。']
]);
definePrintedBranches('story:engage:0505:01','你可以選擇',[
 ['邀智慧生物同行','獲得智慧生物1320。'],
 ['和智慧生物玩交鋒','找到卡牌798，將其放在桌面上並遵循指示。']
]);
definePrintedBranches('story:depart:0627:01','選擇一項',[
 ['進入城市521','前往城市521。獲得1點隨機技能和1點士氣。'],
 ['保持平衡向北經過城市','前往493。獲得1點士氣。']
]);
definePrintedBranches('story:overpower:0254:01','並選擇一項',[
 ['停下來評估情況','前往443。獲得1點隨機技能並繼續。'],
 ['展開狩獵，直接取得物品1185','前往443。你迅速解決了野獸。獲得物品1185。'],
 ['展開狩獵，支付1點強化取得物品1161','前往443。你迅速解決了野獸。獲得物品1161。']
]);
for(const [id,cost,paid,free] of [
 [48,'2點強化','物品991','物品1160'],
 [227,'1點強化','載具985','1點強化並繼續'],
 [607,'1點強化','物品1160','物品1190'],
 [746,'1點查看','物品1018','物品955']
]){
 definePrintedBranches('story:overpower:'+String(id).padStart(4,'0')+':01','如果你支付',[
  ['支付'+cost+'，獲得'+paid,'獲得'+paid+'。'],
  ['直接獲得'+free,'獲得'+free+'。']
 ])
}
// Look p.23. The first item is collected before deciding whether to search farther.
for(const [id,intro,item,name,exit] of [
 [569,'在箱頂你發現了一把十字鎬。獲得物品896。',929,'冬季外套',335],
 [584,'走進房間後，你發現了弓箭套件。獲得物品956。',926,'彈簧陷阱',662]
]){
 const text=WORLD.stories['story:look:0'+id+':01'][1];
 printedBranches.set(text,[intro,'·支付2點強化，取得'+name+'：獲得物品'+item+'。退出至'+exit+'。','·停止搜索，退出至'+exit+'：退出至'+exit+'。'])
}
for(const [event,row] of Object.entries(WORLD.stories)){
 if(!event.startsWith('story:look:')||printedBranches.has(row[1]))continue;
 const text=row[1].replace(/\s/g,'');
 const search=text.match(/^([^。]+[；，]獲得物品\d{3,4}。)如果你支付(\d+)點強化，[^。·]+?[（(]獲得(物品\d{3,4}|\$\d+)[)）]。(?:冷靜地(?:向北)?|無論如何，|若無其事地)退出至(\d{3})。$/);
 if(!search)continue;
 const [,intro,fee,reward,exit]=search,route='退出至'+exit+'。';
 printedBranches.set(row[1],[intro.replace(/[；，]獲得物品/,'。獲得物品'),'·支付'+fee+'點強化，取得'+reward+'：獲得'+reward+'。'+route,'·停止搜索，退出至'+exit+'：'+route])
}
{
 const text=WORLD.stories['story:look:0575:01'][1];
 const parts=['走進房間後，你發現了一副束縛銬。獲得物品944。'];
 for(const [label,to] of [['退出至外面',455],['進入城市',762]]){
  const route='前往'+to+'。';
  parts.push('·'+label+to+'：'+route,'·支付2點強化取得長矛，'+label+to+'：獲得物品1229。'+route)
 }
 printedBranches.set(text,parts)
}
printedBranches.set(WORLD.stories['story:help:0587:recovered:0149'][1],[
 '你用房樑上掛著的果實和香料煙燻了魚。智慧生物們很高興能品嚐不同的菜色，請你挑選一份離別禮物。',
 '·收下圖騰：獲得物品899。獲得1點士氣。退出至744。',
 '·收下氧氣面罩：獲得物品964。獲得1點士氣。退出至744。'
]);
printedBranches.set(WORLD.stories['story:look:0587:01'][1],[
 '在小屋裡，你發現了一個圖騰。獲得物品899。',
 '·停止搜索，退出至744：退出至744。',
 '·支付1點強化，取走魚：獲得物品1226。退出至744。',
 '·支付1點強化，取走果實：獲得物品1224。退出至744。'
]);
for(const [book,exit] of [['move',216],['depart',221]]){
 const route='退出至'+exit+'。';
 const text=WORLD.stories['story:'+book+':0564:01'][1];
 printedBranches.set(text,['附近的護甲看起來很適合你，但安保護盾讓你無法觸碰它。',
  '·支付1點強化解除護盾，取走護甲：獲得物品975。'+route,
  '·留下護甲，獲得1點強化：獲得1點強化。'+route])
}
definePrintedBranches('story:look:0227:01','如果你支付',[
 ['支付1點強化取得飛毯','獲得載具985。'],['留下飛毯，繼續行動','繼續。']
]);
definePrintedBranches('story:look:0252:01','如果你支付',[
 ['支付1點接觸邀請同行','獲得智慧生物1331。'],['讓對方繼續工作','你可以繼續。']
]);
for(const [id,ability] of [[290,1473],[307,1487]]){
 definePrintedBranches('story:engage:0'+id+':01','選擇一項',[
  ['釋放靈魂','伴隨著感激，動物消失於黑暗之中。獲得1點士氣和1點生命。'],
  ['吸收靈魂','伴隨著認可，動物邁入你的意識之中。獲得能力'+ability+'。']
 ])
}
definePrintedBranches('story:take:0324:01','，然後選擇一項',[
 ['支付1點幫助，救起動物','你拯救了動物的性命。獲得動物822。'],
 ['支付1點接觸，呼叫援助','一名葉智慧生物穩定了動物的狀況，邀請你前往學院。前往內部600。'],
 ['什麼也不做','動物漸漸消失，留下橙色水晶。獲得物品1162。']
]);
definePrintedBranches('story:move:0513:02','選擇一項',[
 ['尊重智慧生物的選擇','他傳授分享與創造能量的知識以表謝意。獲得課程1427。'],
 ['解開智慧生物的束縛','智慧生物憤怒地釋放出能量波。受到1點高溫傷害。獲得智慧生物1327。']
]);
definePrintedBranches('story:look:0530:01','選擇一項',[
 ['傾聽傷心的智慧生物','他為成年子女背負的債務嘆息。獲得任務1682。將任務牌橫放在供應區。'],
 ['參加婚禮','你為一名富有的智慧生物慶祝婚禮。獲得2點士氣和$3。']
]);
definePrintedBranches('story:move:0519:01','選擇一項',[
 ['練習攀爬技巧','石智慧生物正在為北方的儀式做準備。獲得能力1468。'],
 ['趁空摘下植物','你從城裡的樹上摘下一株漂亮的植物，放進口袋。獲得植物1047。']
]);
definePrintedBranches('story:move:0520:01','選擇一項',[
 ['了解全球通訊如何運作','能量智慧生物透過遍布世界的高塔快速傳遞消息。獲得課程1428。'],
 ['接下無人認領的請求','獲得1點隨機技能和任務1658。將任務牌橫放在供應區。']
]);
const rainbowRings=[991,995,993,994,990,992];
printedBranches.set(WORLD.stories['story:help:0310:recovered:0089'][1],[
 '在彩虹的盡頭，你可以留下水晶換取一枚戒指。',
 '·不交換水晶：獲得1點強化。你可以繼續。',
 ...rainbowRings.map((ring,i)=>'·交出'+['藍','紫','橙','綠','黃','紅'][i]+'色水晶 '+(1160+i)+'：水晶融入彩虹，化為戒指。獲得物品'+ring+'。')
]);
printedBranches.set(WORLD.stories['story:help:0529:recovered:0134'][1],[
 '黃金智慧生物掌管著大使館。你看見許多不同的智慧生物聚集在這裡。',
 '·磨練說服技巧：獲得能力1463。',
 '·與黃金智慧生物結盟：獲得物品1242。若持有黃金詛咒，移除該詛咒。',
 '·在大使館工作：你四處打聽工作機會，大使館正在招聘。獲得構築物1274。'
]);
printedBranches.set(WORLD.stories['story:help:0788:recovered:0195'][1],[
 '一名智慧生物請你分散廣場上其他商販的注意力五秒鐘。他說這就足夠他搶遍商販，並答應與你平分贓物。',
 '·同意參與劫案：你假裝暈倒。等人群發現你沒事，你在一旁與智慧生物會合，他稱讚了你的表現。獲得能力1481和$5。',
 '·告發竊賊：商販們聽了你的警告後驅逐了竊賊。他在離開前詛咒了你，商販們則向你道謝。獲得詛咒1391、1點士氣和1點生命值。'
]);
definePrintedBranches('story:help:0145:01','選擇一項',[
 ['治癒自己','獲得3點生命。'],
 ['治癒其他船員','每位其他玩家獲得1點生命。獲得1點士氣。']
]);
definePrintedBranches('story:look:0525:01','選擇一項',[
 ['學習修理與修補的魔法','獲得法術1367。'],
 ['學習用意念控制火焰','獲得法術1383。']
]);
definePrintedBranches('story:look:0564:01','你可以支付',[
 ['支付1點強化解除護盾，取走面具','獲得物品1002。退出至216。'],
 ['留下面具，獲得1點強化','獲得1點強化。退出至216。']
]);
definePrintedBranches('story:overpower:0221:01','如果你支付',[
 ['支付1點強化，取得物品1160','獲得物品1160。'],
 ['直接取得物品1190','獲得物品1190。']
]);
// These source rows have damaged OCR in the reward sentence (Overpower pages 10 and 25).
for(const [event,paid,free] of [
 ['story:overpower:0259:01',1163,1186],
 ['story:overpower:0633:01',1164,1212],
 ['story:overpower:0651:recovered:0167',1165,1183]
]){
 definePrintedBranches(event,'如果你支付',[
  ['支付1點強化，取得物品'+paid,'獲得物品'+paid+'。'],
  ['直接取得物品'+free,'獲得物品'+free+'。']
 ])
}
// The item is optional after either decision. Entry 421's item number wraps onto a separate line.
for(const [location,item] of [[277,1161],[308,1162],[380,1162],[421,1165],[444,1162],[461,1161],[480,1162],[706,null],[711,1165]]){
 const choices=[];
 for(const [action,reward] of [['吃掉動物','獲得1點生命值。'],[location===480?'將動物海葬':'埋葬動物','獲得1點士氣。']]){
  choices.push([action+'（'+reward.slice(0,-1)+'）',reward]);
  if(item)choices.push(['支付1點強化，'+action+'並取得物品'+item,reward+'獲得物品'+item+'。'])
 }
 definePrintedBranches('story:overpower:'+String(location).padStart(4,'0')+':01','你可以選擇',choices)
}
definePrintedBranches('story:depart:0627:03','你可以選擇',[
 ['面對智慧生物','前往622。'],
 ['向東南繞行','前往623。'],
 ['向西南繞行','前往621。']
]);
definePrintedBranches('story:engage:0610:01','你可以選擇',[
 ['騎著生物欣賞沿途景色','獲得1點查看。前往604，抵達時忽略寒冷傷害。'],
 ['留下來享受這份情誼','獲得1點士氣和1點生命值。']
]);
definePrintedBranches('story:help:0479:01','你可以自告奮勇',[
 ['獨自前去保護島嶼珍珠','獲得任務1681。將其橫向添加到你的供應區中。'],
 ['加入智慧生物','獲得智慧生物1358。']
]);
definePrintedBranches('story:engage:0336:01','你可以使用',[
 ['沿繩索向北越過峽谷','前往341並獲得1點士氣。'],
 ['割斷魚叉，留在原地','獲得物品959。你無法在此處向北移動。']
]);
const artifactDecisions=new Set();
// Look p. 5: two distinct ways to reach the lava artifact.
artifactDecisions.add('story:look:0125:01');
printedBranches.set(WORLD.stories['story:look:0125:01'][1],[
 '你面對熔岩迷宮，可以支付強化穿過隧道，或嘗試解謎。',
 '·支付4點強化，取得神器：獲得物品998。不能在此處執行其他地點行動。',
 '·嘗試解開謎題：找到卡牌532並放在桌面上。目標是選擇三條隧道之一，沿連續路徑抵達左後方的神器。第一橫行是固定且正確的入口；其餘方塊只能在原橫行內左右重排，不能旋轉。決定入口後，參閱《秘密之書》條目125。'
]);

for(const [event,row] of Object.entries(WORLD.stories)){
 const compact=row[1].replace(/\s/g,'');
 const offer=compact.match(/如果你支付(\d+)點強化，([^。]+?)獲得物品(\d+)，並且不能在此處執行其他地點行動[）)]?。如果不支付，(.+?)[；;，,](獲得[^。]+)。$/);
 if(!offer||!WORLD.cards[offer[3]])continue;
 const success=offer[2].replace(/[（(;；]$/,'');
 printedBranches.set(row[1],[compact.slice(0,offer.index),
  '·支付'+offer[1]+'點強化，取得神器：'+success+'。獲得物品'+offer[3]+'。不能在此處執行其他地點行動。',
  '·讓神器溜走：'+offer[4].replace(/^則/,'')+'。'+offer[5]+'。']);
 artifactDecisions.add(event)
}
const sentientTradeoffs=new Set();
for(const [event,row] of Object.entries(WORLD.stories)){
 const compact=row[1].replace(/\s/g,'');
 if(!event.startsWith('story:take:')||!compact.includes('長期騙局')||WORLD.cards[row[0]]?.home!=='sentient')continue;
 const offers=compact.split(/[·•●]/).slice(1,4);
 if(offers.length!==3||!offers[1].includes('失去1點時間')||!offers[2].includes('失去該智慧生物'))continue;
 const parts=offers.map(o=>o.match(/^(.+?)[：:]([^。]*獲得\$(\d+))。/));
 if(parts.some(p=>!p))continue;
 printedBranches.set(row[1],['選擇一項。',...parts.map((p,i)=>{
  const label=i===2?p[1]+'（失去這名智慧生物）':p[1].replace(/([（(]失去1點時間)$/,'$1）');
  return '·'+label+'：獲得$'+p[3]+'。'
 })]);
 sentientTradeoffs.add(event)
}
definePrintedBranches('story:move:0563:01','然後，在沒有額外信息', [706,200,393,201,205].map(n=>['退出至地點 '+n,'前往'+n+'。']));
for(const [event,row] of Object.entries(WORLD.stories)){
 const text=row[1].replace(/\s/g,'');
 if(!event.startsWith('story:engage:')||!text.includes('向其出售物品：智慧生物欣然接受你的提議'))continue;
 const head=text.indexOf('選擇一項：');if(head<0)continue;
 let body=text.slice(head+5).replace(/^[·●•：，]+/,'').replace(/[·●•：，]*(?=向其出售物品：|支付[$＄]?\d+購買)/g,'');
 if(row[0]===560)body=body.replace('支付3購買火把','支付$3購買火把');
 if(row[0]===587)body=body.split('支付$1購買一些果實或魚')[0]+'支付$1購買果實：獲得物品1224。退出至744。支付$1購買魚：獲得物品1226。退出至744。支付$4購買捕魚籠：獲得物品910。退出至744。';
 const parts=body.split(/(?=向其出售物品：|支付[$＄]\d+購買)/);
 if(parts.length<3)continue;
 const options=parts.map((v,i)=>{
  if(i===0&&!v.includes('：'))return '·和店主聊天：'+v;
  return '·'+v
 });
 printedBranches.set(row[1],[text.slice(0,head)+'選擇一項。',...options])
}
function ferryTicket(fare,label,id,extra=''){
 return '·支付$'+fare+'搭船至'+label+'（'+String(id).padStart(3,'0')+'）：獲得'+fare+'點強化。前往'+String(id).padStart(3,'0')+'。'+extra
}
for(const [event,row] of Object.entries(WORLD.stories)){
 const text=row[1].replace(/\s/g,'');
 if(!event.startsWith('story:engage:')||!text.includes('船長')||!text.includes('搭乘前往：'))continue;
 const list=text.split('搭乘前往：')[1].split(/[。·●•]/)[0];
 const stops=list.split(/[、或]/).map(s=>s.match(/^(.+?)(?:[（(]前往(?:地點|城市)?)?(\d{3})[）)]?$/));
 const refusal=text.split('如果你不支付：')[1],reward=refusal?.match(/[（(](獲得1點(?:生命值?|強化))[）)]/);
 if(!stops.every(Boolean)||!reward)continue;
 const options=stops.map(m=>ferryTicket(1,m[1],+m[2]));
 const description=refusal.split(/[（(]/)[0];
 options.push('·不搭船：'+description+'。'+reward[1]+'。'+(refusal.includes('你可以繼續')?'你可以繼續。':''));
 printedBranches.set(row[1],[text.split('選擇一項')[0].split('·')[0]||'船長同意載你一程。',...options])
}
{
 const r=WORLD.stories['story:engage:0368:01'];
 const shallow=[['東北方健談的樹木',666],['東南方發光的沼澤',245],['西南方無助的動物',508]];
 printedBranches.set(r[1],['船長同意載你一程。','·不搭船：水手提醒你注意西北方的元素體。獲得1點強化。',
  ferryTicket(1,'西北方的海面之下',655,'此次抵達忽略缺氧傷害。'),...shallow.map(([label,id])=>ferryTicket(1,label,id)),
  ferryTicket(2,'西北方的海面',60),...shallow.map(([label,id])=>ferryTicket(2,label,id))])
}
{
 const r=WORLD.stories['story:engage:0507:01'];
 printedBranches.set(r[1],[r[1].split('選擇一項')[0],
  ...[['西北方的海洋邊緣',365],['東北方的寶箱',367],['東南方的天際',344],['西南方的城市',342]].map(([label,id])=>ferryTicket(1,label,id)),
  '·不搭船：船長提醒你留意住在海底的生物。獲得1點強化。'])
}
definePrintedBranches('story:engage:0289:01','如果你正要去',[
 ['登上氣球前往東北方','前往466。'],['留在此處聽船長的建議','船長提起西南方令人印象深刻的骸骨。獲得1點強化。']
]);
definePrintedBranches('story:engage:0438:01','並讓你選擇',[
 ['向西北拜訪火智慧生物','獲得1點強化。前往159。'],['向西南查看寶箱','獲得1點強化。前往485。'],['留在此處繼續行動','獲得1點強化。繼續。']
]);
const constructionOffers=new Map();
for(const row of Object.values(WORLD.stories)){
 const text=row[1].replace(/\s/g,''),fee=text.match(/收費\$(\d+)/);
 if(!fee||!text.includes('能力1488、$2或1點強化'))continue;
 const original=text.replace('選擇一項：：如果你支付','選擇一項：·如果你支付').split(/(?=[·●•])/),offer=original[1]||'',teaching=original[2]||'';
 const buildings=Array.from(offer.matchAll(/([^：:、或（(，]+)[（(](12\d{2})[）)]/g),m=>[m[1],+m[2]]);
 const single=offer.match(/獲得構築物(12\d{2})/);
 if(single)buildings.push([{'1290':'空氣供應穹頂','1286':'狩獵塔'}[single[1]]||'構築物',+single[1]]);
 if(!buildings.length||!buildings.every(([,id])=>WORLD.cards[id]?.home==='structure'))continue;
 const more=teaching.includes('你可以繼續')?'你可以繼續。':'';
 const paid=buildings.map(([name,id])=>['建造'+({1275:'許願井',1279:'馬廄'}[id]||name)+'（卡牌 '+id+'）','獲得構築物'+id+'。']);
 const free=[['學習能力 1488','獲得能力1488。'],['領取 2 錢幣','獲得$2。'],['獲得強化','獲得1點強化。']].map(([label,result])=>[label,result+more]);
 const intro=original[0].split('選擇')[0];
 const format=(items,prefix)=>items.map(([label,result])=>'·'+prefix+label+'：'+result);
 const options=[intro,...format(paid,'支付$'+fee[1]),...format(free,'聽取建議，')];
 printedBranches.set(row[1],options);
 constructionOffers.set(row[1],{paid,free,intro,format,quotedInLabel:/支付\$\d+/.test(offer.split(/[：:]/)[0])})
}
function restoreConstructionChoice(a){
 const offer=constructionOffers.get(a.text);
 if(!offer||a.constructionFormat)return;
 a.constructionFormat=true;
 if(a.choice==null||Object.keys(a.receipts||{}).length)return;
 const alreadyPaid=a.choice===1&&a.paidBranch===1&&offer.quotedInLabel;
 if(alreadyPaid||a.choice===2){
  const items=alreadyPaid?offer.paid:offer.free;
  a.text=offer.intro+'選擇一項：'+offer.format(items,'').join('');
 }
 delete a.choice;delete a.paidBranch
}
const residenceRules={
 204:{inside:556,item:1040,curse:1391,restricted:'交易'},
 410:{inside:573,item:1164,curse:1389,restricted:'化解'},
 499:{inside:579,item:982,curse:1394,restricted:'化解'}
};
const serviceValues={1277:25,1285:25,1286:20,1293:20};
function resolveServiceIncome(a){
 if(!serviceValues[a.id]||a.event!=='story:engage:'+a.id+':01'||a.serviceIncome!==undefined)return;
 const boost=s.boost[a.id]||0;
 const abilities=new Set([...s.grid,...s.reserve,...s.supply].filter(n=>n>=1460&&n<=1516)).size;
 a.serviceIncome=a.id===1277?boost:a.id===1293?boost+abilities:a.effort;
 if(!Number.isInteger(a.serviceIncome)){delete a.serviceIncome;return}
 a.text=a.text.split('或者')[0]+' 選擇一項： ·收取營業收入：獲得$'+a.serviceIncome+'。 ·出售此構築物（需3點強化）：獲得$'+serviceValues[a.id]+'。'
}
function resolveResidence(a){
 const rule=residenceRules[a.id];
 if(!rule||a.residenceResolved||!['move','overpower'].includes(a.book)||!a.text.replace(/\s/g,'').startsWith('你進入建築物的結果取決於其當前的居住狀態'))return;
 const homes=s.residences??={};
 if(!Object.hasOwn(homes,a.id))homes[a.id]=faces[throwDice('c',1,'決定屋內是否有人')[0]]!=='空白';
 const occupied=homes[a.id];a.residenceResolved=true;
 if(occupied&&a.book==='move'){
  const dice=throwDice('s',3,'避開關上的門'),take=keys.indexOf('take'),earned=dice.filter(v=>v===take).length;
  s.skill[take]+=earned;
  a.text='屋裡有人。受驚的一家人將你推回門外，鎖上了門。技能骰擲出'+dice.map(v=>skills[v]).join('、')+'，取得 '+earned+' 點獲取。選擇一項：·支付1點獲取拿取物品：獲得物品'+rule.item+'。·離開門口：你留在原地。';
  return
 }
 let text='屋內無人。';
 if(occupied){
  homes[a.id]=false;creditReward({card:rule.curse,type:'詛咒'},a);
  text='你闖入房屋，嚇跑了屋內的一家人。獲得詛咒'+rule.curse+'。'
 }
 a.dest=rule.inside;
 if(a.book==='overpower'||a.id!==410){
  s.restrictedResidence={id:rule.inside,turn:s.turn+1,action:rule.restricted};
  text+='進屋後的下一回合不能執行「接觸－'+rule.restricted+'」。'
 }
 a.text=text+'前往內部'+rule.inside+'。'
}
function resolvePrintedResponse(a){
 if(a.responseBoost!=null||a.kind!=='卡牌')return;
 const parts=a.text.split(/[·•●]/),intro=parts.shift().replace(/\s/g,'');
 if(!intro.includes('該智慧生物上的強化數量')||!s.grid.includes(a.id)||!parts.length)return;
 const rows=parts.map(t=>t.trim().match(/^(\d+)\s*點\s*強化\s*[：:]\s*([\s\S]+)$/));
 if(rows.some(r=>!r))return;
 const count=s.boost[a.id]||0,match=rows.find(r=>Number(r[1])===count);
 a.responseBoost=count;
 const printed=printedResponses[a.id],narrative=printed?.lines[count];
 if(count>=1&&count<=3&&(match||narrative)){
  const dice=throwDice('s',count+2,'與智慧生物調情'),success=dice.includes(keys.indexOf('engage'));
  a.responseDice=dice;
  let outcome='這次沒有擲出接觸。';
  if(success){
   outcome=narrative||(match[2].match(/智慧生\s*物以([^（(]+)/)?.[0]||'智慧生物回應了你。');
   if(count<3){s.boost[a.id]=Math.min(cards[a.id].cap,count+1);outcome+=' 此智慧生物增加 1 點強化。'}
   else {
    const slot=cards[a.id].slots.filter(q=>q.boost_cost>0).sort((a,b)=>a.position[0]+a.position[1]-b.position[0]-b.position[1])[0];
    if(slot)(s.freeResponseSlots??={})[slot.uid]=true;
    outcome+=' 此智慧生物左上骰槽從此免付強化。'
   }
  }
  a.text='此智慧生物有 '+count+' 點強化。擲出'+dice.map(i=>skills[i]).join('、')+'。'+outcome
 }else {
  a.text='此智慧生物有 '+count+' 點強化。現有條目未列出這個數量的回應。';
  a.printPage=printed?.page||bookIndex[storySource(a)+':'+a.id]?.[1]
 }
}
function printedChoiceIntro(text){
 const intro=text.replace(/\s/g,'');
 return /選擇一項|洗擇一項|選擇其中|選擇以下|選擇離開路線|選擇跟隨的對象|選擇保衛一名智慧生物|選擇一個目標|選擇採摘的花朵|選擇要攻擊的智慧生物|選擇偷取哪名智慧生物的骰子|選擇你的命運|根據樹木的狀態|根據你的選擇|根據門道是否被你解除了武裝|決定接下來如何行動|你是否要鬆手脫離|你是否接受|從你的網格或儲備區中選擇|閱讀X對應的一項|如果你擁有植物或食物/.test(intro)||
  /(?:選擇|選一項|選擇項|選擇(?:你的(?:跳躍方向|回答|回應|話題)|如何(?:繼續|應對)|在岔路口向左或向右走|一條向[南北]的路線|一名智慧生物與其談起高塔的相關話題|一個數字|作弊者|那項特質|三條路徑中的一條（[^）]*）|專注於某一個目標|一頂帳篷進入))[：:]$/.test(intro)
}
definePrintedBranches('story:look:0303:01','如果選擇',[
 ['選擇綠色圖標','獲得法術1236。'],
 ['選擇粉色圖標','獲得法術1237。'],
 ['選擇藍色圖標','獲得法術1238。']
]);
definePrintedBranches('story:overpower:0686:01','你可以選擇',[
 ['製作彈簧陷阱（926）','獲得物品926。你可以繼續。'],
 ['製作弓箭套件（956）','獲得物品956。你可以繼續。']
]);
// 1. Accept / Refuse choices
definePrintedBranches('story:engage:0119:01','如果你接受',[
 ['接受嚮導（獲得智慧生物1353）','獲得智慧生物1353。'],
 ['拒絕','獲得1點強化並繼續。']
]);
definePrintedBranches('story:engage:0782:01','如果你接受',[
 ['接受贈予（獲得$5）','獲得$5。'],
 ['拒絕','獲得1點強化並繼續。']
]);
definePrintedBranches('story:secrets:1693:01','如果你接受',[
 ['接受提議購買山丘住宅（支付$15）','支付$15獲得構築物1701。旋轉此任務並將其添加到你的網格中。'],
 ['拒絕提議','獲得$10。旋轉此任務並將其添加到你的網格中。']
]);
definePrintedBranches('story:look:0646:02','如果你接受',[
 ['接受試煉（前往647）','前往647。你可以繼續在那裡執行壓制-戰鬥的行動。'],
 ['拒絕試煉','獲得1點強化並繼續。']
]);
definePrintedBranches('story:engage:0227:01','如果你購買飛毯',[
 ['購買飛毯（支付$8）','支付$8獲得載具985。'],
 ['接受搭車前往懸崖底部（232）','前往232。'],
 ['拒絕','獲得1點強化並繼續。']
]);
definePrintedBranches('story:engage:0047:01','如果你接受',[
 ['接受邀請（獲得智慧生物1333）','獲得智慧生物1333。'],
 ['拒絕邀請','獲得1點強化並繼續。']
]);
definePrintedBranches('story:help:0438:01','如果你願意',[
 ['協助划船前往尋找護身符（153）','前往153。'],
 ['拒絕協助','獲得$1。']
]);
definePrintedBranches('story:help:0783:01','如果你接受',[
 ['接受委託前往洞穴（030）','前往洞穴030。'],
 ['拒絕委託','留在原地。獲得1點強化。']
]);
definePrintedBranches('story:overpower:0775:01','如果你接受',[
 ['接受冒險夥伴','獲得智慧生物1334和任務1635（將其橫向添加到你的供應區中）。'],
 ['拒絕','獲得1點強化並繼續。']
]);
definePrintedBranches('story:secrets:1697:01','如果你接受轉換',[
 ['接受記憶與靈魂轉換','將你的角色牌替換為1453。旋轉此任務並將其添加到你的網格中。'],
 ['拒絕轉換','保留原角色牌。旋轉此任務並將其添加到你的網格中。']
]);
definePrintedBranches('story:secrets:1649:01','如果你仍然擁有智慧生物1333',[
 ['保留智慧生物1333','保留智慧生物1333。旋轉此任務並將其添加到你的網格中。'],
 ['換取頭骨重錘（物品950）','失去智慧生物1333，獲得物品950。旋轉此任務並將其添加到你的網格中。']
]);

// 2. Pay / Buy / Trade choices
definePrintedBranches('story:engage:0188:01','如果你支付',[
 ['支付$5購買葉片刀','支付$5獲得物品1189。'],
 ['不支付（領取金屬廢料）','獲得物品1184。']
]);
definePrintedBranches('story:engage:0197:01','可以以$5的價格',[
 ['支付$5購買高塔地圖（1259）','支付$5獲得物品1259。'],
 ['不支付','獲得2點強化。']
]);
definePrintedBranches('story:engage:0788:01','如果你支付$2',[
 ['支付$2僱傭智慧生物','支付$2獲得智慧生物1339。'],
 ['不支付（展示賺錢技能）','獲得能力1481或能力1482。你可以繼續。']
]);
definePrintedBranches('story:depart:0450:01','如果你支付1點壓制',[
 ['支付1點壓制（向北前往451）','支付1點壓制，向北前往451。'],
 ['不支付壓制（被拖入水下）','失去1點生命值並前往657。抵達時忽略缺氧傷害。']
]);
definePrintedBranches('story:overpower:0650:scan:01','如果你支付1點強化',[
 ['支付1點強化搜尋（獲得物品1165）','支付1點強化獲得物品1165。'],
 ['不支付強化（獲得物品1183）','獲得物品1183。']
]);
definePrintedBranches('story:move:0773:01','你可以選擇支付1點壓制',[
 ['支付1點壓制向前挖掘（向北前往774）','支付1點壓制，向北前往774。'],
 ['掙扎等待救援','失去1點士氣，獲得1點隨機技能並繼續。']
]);
definePrintedBranches('story:look:0258:01','你可以選擇購買其中一件',[
 ['購買攀巖鞋（支付$3）','支付$3獲得物品963。'],
 ['購買釘錘（支付$4）','支付$4獲得物品969。'],
 ['購買里拉琴（支付$6）','支付$6獲得物品970。'],
 ['購買劍（支付$8）','支付$8獲得物品888。'],
 ['不購買（獲得$1）','獲得$1。']
]);
definePrintedBranches('story:look:0403:01','如果你選擇進入',[
 ['進入隱蔽側門（內部581）','前往內部581。'],
 ['不進入','獲得1點強化，並從你的網格中刷新1顆挑戰骰；你可以繼續。']
]);
definePrintedBranches('story:engage:0098:01','深入星球內部',[
 ['前往洞穴044並招募智慧生物（支付1點強化）','支付1點強化前往洞穴044並獲得智慧生物1363。'],
 ['僅前往洞穴044','前往洞穴044。']
]);
definePrintedBranches('story:help:0146:01','如果你支付1點強化',[
 ['支付1點強化招募智慧生物1329','支付1點強化獲得智慧生物1329。'],
 ['不支付強化','獲得1點強化。']
]);
definePrintedBranches('story:help:0252:01','如果你支付2點接觸',[
 ['支付2點接觸招募智慧生物1331','支付2點接觸獲得智慧生物1331。'],
 ['不支付接觸','獲得1點強化並繼續。']
]);
definePrintedBranches('story:take:0077:01','在另一名智慧生物拾起',[
 ['支付1點強化繳獲十字弩（物品1152）','支付1點強化獲得物品1152。退出至346並繼續。'],
 ['略過十字弩','退出至346並繼續。']
]);
definePrintedBranches('story:take:0770:01','如果你支付1點獲取',[
 ['支付1點獲取劫走小船（載具1156）','支付1點獲取獲得載具1156。你可以繼續。'],
 ['不劫走小船','你可以繼續。']
]);
definePrintedBranches('story:take:0724:01','如果你支付1點獲取',[
 ['支付1點獲取捕捉石皮蜥蜴（動物837）','支付1點獲取獲得動物837。'],
 ['不捕捉蜥蜴','保留現狀。']
]);

// 3. Directions & Destinations
definePrintedBranches('story:depart:0726:02','選擇：',[
 ['向北前往727','前往727。'],
 ['向東前往410','前往410。'],
 ['向南前往725','前往725。'],
 ['向西南前往720','前往720。']
]);
definePrintedBranches('story:take:1661:01','選擇向東前往167',[
 ['向東前往167','前往167。'],
 ['向西前往165','前往165。']
]);
definePrintedBranches('story:engage:0063:01','選擇前往：',[
 ['前往東南邊的旅行者處（507）','前往507。'],
 ['前往南邊海面上的高塔（506）','前往506。'],
 ['前往西南邊的黃金智慧生物處（505）','前往505。']
]);
definePrintedBranches('story:engage:0375:01','你可以選擇搭乘前往：',[
 ['前往西北邊的舊堡壘處（304）','前往304。'],
 ['前往東北邊的傳說之石處（125）','前往125。'],
 ['前往東南邊的燃燒建築物（357）','前往357。'],
 ['前往西南邊的飛船殘骸處（355）','前往355。']
]);
definePrintedBranches('story:engage:0655:01','選擇前往：',[
 ['駛向海面（前往060）','前往060。'],
 ['前往東北邊健談的樹木處（666）','前往666。'],
 ['前往東南邊的發光沼澤地（245）','前往245。'],
 ['前往西南邊弱勢無助的動物處（508）','前往508。']
]);
definePrintedBranches('story:secrets:0325:01','然後選擇前往相鄰的列出地點：',[
 ['前往東邊326','前往326。'],
 ['前往南邊295','前往295。'],
 ['前往西邊444','前往444。']
]);
definePrintedBranches('story:take:0575:01','無論如何，',[
 ['退出至外面（455）','前往455。'],
 ['進入城市（762）','前往762。']
]);

// 4. Epic Victories
for(const [event,row] of Object.entries(WORLD.stories)){
 if(row[1].includes('以追求史詩勝利，或者直接以使命勝利結束遊戲')){
  const fate=row[1].match(/獲得命運(\d{4})/)?.[1];
  definePrintedBranches(event,'你可以選擇',[
   ['追求史詩勝利（獲得命運'+fate+'）','獲得命運'+fate+'。每位玩家獲得1點隨機技能。從現在起，忽略使命牌上的行動和指示。'],
   ['直接以使命勝利結束遊戲','使命勝利！恭喜你達成使命勝利。']
  ]);
 }
}

// 5. Plant cards continuation vs boost
for(const [event,row] of Object.entries(WORLD.stories)){
 if(event.startsWith('story:take:10')&&row[1].includes('在此植物上獲得1點強化')){
  const idx=row[1].lastIndexOf('你可以繼續');
  if(idx>=0){
   const rest=row[1].slice(idx),m=rest.match(/^(你可以繼續[^。]*?)。否則[，,]\s*(?:因對其營養特性的理解加深[，,]\s*)?在此植物上獲得1點強化。?$/);
   if(m){
    definePrintedBranches(event,'你可以繼續',[
     ['享用加成並繼續',m[1]+'。'],
     ['停止並在此植物上獲得1點強化','在此植物上獲得1點強化。']
    ]);
   }
  }
 }
}
for(const row of Object.values(WORLD.stories)){
 const text=row[1],offer=text.match(/選擇一項，?或獲得1點強化[：:]\s*·/);
 if(!offer||printedBranches.has(text))continue;
 const options=text.slice(offer.index+offer[0].length).split('·').map(v=>'·'+v.trim().replace('物品1263；商人','物品1263。商人'));
 printedBranches.set(text,[text.slice(0,offer.index),...options,'·'+(text.includes('旅行商人')?'不購買':'略過這些選項')+'，獲得1點強化：獲得1點強化。'])
}
const routesEndingAction=new Set(['story:overpower:0583:01','story:overpower:0582:recovered:0147','story:depart:0577:01','story:look:0580:01',...Object.keys(cityEntryFollowups).filter(event=>event!=='story:look:0627:01'),'story:take:0658:01','story:take:0642:01','story:help:0642:01','story:take:0294:01','story:take:0491:01','story:take:0492:01','story:help:0314:01','story:depart:0375:02','story:depart:0486:recovered:02','story:engage:0630:01','story:engage:0365:01'].map(event=>WORLD.stories[event][1]));
function autoExtractChoiceBranches(body){
 if(!body||typeof body!=='string')return null;
 const epic=body.match(/你可以選擇獲得命運(\d{4})或任意其他命運[^。]*以追求史詩勝利，或者直接以使命勝利結束遊戲。?$/);
 if(epic){
  const fate=epic[1],intro=body.slice(0,epic.index);
  return [intro,
   '·追求史詩勝利（獲得命運'+fate+'）：獲得命運'+fate+'。每位玩家獲得1點隨機技能。從現在起，忽略使命牌上的行動和指示。',
   '·直接以使命勝利結束遊戲：使命勝利！'
  ];
 }
 const accept=body.match(/([。！？\s]|^)如果你接受[，,：:]\s*([^；。]+)[；。]如果(?:你)?拒絕[，,：:]\s*([^。]+)。?$/);
 if(accept){
  const intro=body.slice(0,accept.index+(accept[1]?1:0));
  return [intro,'·接受提議：'+accept[2].trim()+'。','·拒絕：'+accept[3].trim()+'。'];
 }
 const plant=body.match(/([。！？\s]|^)(你可以繼續[^。]*?)。否則[，,]\s*(?:因對其營養特性的理解加深[，,]\s*)?在此植物上獲得1點強化。?$/);
 if(plant){
  const intro=body.slice(0,plant.index+(plant[1]?1:0));
  return [intro,'·享用加成並繼續：'+plant[2].trim()+'。','·停止並在此植物上獲得1點強化：在此植物上獲得1點強化。'];
 }
 const dir=body.match(/選擇向([東西南北])前往(\d{3})或向([東西南北])前往(\d{3})。?$/);
 if(dir){
  const intro=body.slice(0,dir.index);
  return [intro,'·向'+dir[1]+'前往 '+dir[2]+'：前往'+dir[2]+'。','·向'+dir[3]+'前往 '+dir[4]+'：前往'+dir[4]+'。'];
 }
 return null;
}
function storyParts(body,choice){
 if(body===workshop160Old)body=workshop160Text;
 if(body===rune107Original)body=rune107Text;
 const printed=printedBranches.get(body);
 if(printed)return {parts:printed,branched:true,endsTurn:routesEndingAction.has(body),shown:printed[0]+(choice?printed[choice].slice(1):'請選擇一項。')};
 const auto=autoExtractChoiceBranches(body);
 if(auto)return {parts:auto,branched:true,endsTurn:routesEndingAction.has(body),shown:auto[0]+(choice?auto[choice].slice(1):'請選擇一項。')};
 if(body.includes('另一位玩家')){
  const compact=body.replace(/\s/g,'');
  if(/^另一位玩家選擇一項：獲得1點隨機技能；刷新自[己已]+網格中1張牌上的1顆挑戰骰；獲得1點強化。獲得1點士氣並繼續。$/.test(compact)){
   const shown='單人遊戲沒有另一位玩家，因此略過給予其他玩家的效果。獲得1點士氣並繼續。';
   return {parts:[shown],branched:false,shown}
  }
  const solo=compact.replace('你和另一位玩家可以刷新各自網格任意1列的所有挑戰骰。直到回合結束，你可以將挑戰骰放置在那名船員網格中的卡牌上。繼續。','你可以刷新自己網格中任意一列的所有挑戰骰，或略過刷新。繼續。');
  if(solo!==compact)return {parts:[solo],branched:false,shown:solo}
 }
 // The two portal entries print the decision inline, without the usual bullets.
 const portal=body.match(/你可以抗拒著留在此處(?:（獲得1點強化）|並獲\s*得1點強化)，或者(爬進洞裡|進入門道內)[(（]前往(\d{3})[)）]。$/);
 if(portal){
  const destination=portal[2],parts=[body.slice(0,portal.index),
   '·留在原地（獲得 1 點強化）：獲得1點強化。',
   '·'+portal[1]+'（前往 '+destination+'）：前往'+destination+'。'];
  return {parts,branched:true,endsTurn:true,shown:parts[0]+(choice==null?'你要留在原地，還是'+portal[1]+'？':' '+parts[choice].slice(1).split('：')[0]+'。')}
 }
 const pair=body.match(/(?:^|[。！])你可以(?:選擇)?([^。·•●；]+?)，或者([^。·•●；]+)。?$/);
 if(pair){
  const options=pair.slice(1).map(inlineOption);
  if(options.every(Boolean)){
   const parts=[body.slice(0,pair.index)+(pair.index?'。':''),...options];
   return {parts,branched:true,shown:parts[0]+(choice?parts[choice].slice(1).split('：')[0]:'請選擇一項。')}
  }
 }
 body=body
  .replace(/(選擇(?:一項|以下一項|其中一項|其一|二選一|三選一|下列一項)[：:\s]\s*)[：，、]\s*([^：:。]{1,25}[：:])/g,'$1·$2')
  .replace(/([。！？\n]\s*)[：，、]\s*([^：:。]{1,25}[：:])/g,'$1·$2')
  .replace(/選擇一項\s*：\s*([^·•●\s]{1,25}[：:])/g,'選擇一項： ·$1');
 if(/^[·•●]/.test(body.trim()))body='選擇一項： '+body.trim();
 const parts=body.split(/(?=[·•●])/);
 const waterRoutes=parts.length>1&&parts[0].trim()===''&&parts.slice(1).every(p=>/^[·•●]\s*[^：:。]{1,28}[：:]/.test(p));
 const branched=parts.length>1&&(waterRoutes||printedChoiceIntro(parts[0]));
 return {parts,branched,shown:branched?parts[0]+(choice!=null?' '+parts[choice]:''):body}
}
function bookLabel(book){return volumes[book]||'卡面'}
function storySource(a){if(a.secretEntry)return 'secrets';if(a.repairStage>0)return 'help';let key=a.event?.split(':')[1];return key in volumes?key:a.book}
function bookPage(book,page){return '<img class="inlinePage" alt="'+esc(bookLabel(book))+' 第 '+page+' 頁" src="books/'+String(volumeNumbers[book]).padStart(2,'0')+'_'+String(page).padStart(3,'0')+'.webp" onclick="pageView('+volumeNumbers[book]+','+page+')">'}
function entryReferences(body,source){
 const out=[];
 const pattern=/《([^》]+)》(?:故事書)?(?:中|的|上|裡|內|所示|關於|對應|見|參閱|\s)*(條\s*目|第)\s*([0-9]{1,4})\s*(頁)?/g;
 for(const m of body.replace(/方境之書/g,'萬境之書').replace(/條自/g,'條目').matchAll(pattern)){
 const book=Object.keys(volumes).find(k=>m[1].includes(volumes[k]));
 if(!book)continue;
 const context=body.slice(0,m.index).split(/[。！？·•]/).pop();
 out.push({book,id:+m[3],page:!!m[4],gate:/如果|若|當|完成|答案|謎|解開|之後|結束時|一旦|選擇|至少|擲出|支付/.test(context)||/答案|謎底/.test(body.slice(m.index+m[0].length,m.index+m[0].length+10))})
 }
 if(/關於該命運的條目/.test(body)&&s.fateDone)out.push({book:'secrets',id:s.fateDone,gate:true});
 return out
}
function storyRefs(body,source,state,path,seen=[],transcript=[],collect=null){
 return entryReferences(body,source).map((ref,i)=>{
 const key=path+'r'+i,tag=ref.book+':'+ref.id,label=bookLabel(ref.book)+' · '+(ref.page?'第 '+ref.id+' 頁':'條目 '+ref.id);
 if(seen.includes(tag))return '';
 if(ref.gate||seen.length>=12){
  const page=ref.page?ref.id:bookIndex[tag]?.[1];
  return page?btn('查閱條件與原文 · '+label,'pageView('+volumeNumbers[ref.book]+','+page+')'):''
 }
 let rows=entryIndex.get(tag)||[],idx=state[key+'row'];
 let page=ref.page?ref.id:bookIndex[tag]?.[1];
 if(ref.page||!rows.length){if(page)transcript.push(label+'（第 '+page+' 頁）');return page?'<article class="nextStory"><h4>'+esc(label)+'</h4>'+bookPage(ref.book,page)+'</article>':'';}
 if(rows.length>1)return '<article class="nextStory"><h4>'+esc(label)+'</h4>'+rows.map(row=>'<details><summary>'+esc(row[5]||label)+'</summary><p>'+esc(row[1])+'</p></details>').join('')+'</article>';
 let row=rows[0],choice=state[key+'choice'],{parts,branched,shown}=storyParts(row[1],choice);
 transcript.push(label+'　'+shown);if(collect)collect(key,parts,branched,choice,shown,ref);
 return '<article class="nextStory"><h4>'+esc(label)+'</h4><p class="story">'+esc(shown)+'</p>'+tableInstructions(shown)+(branched&&choice==null?parts.slice(1).map((v,j)=>choiceWithCards(v,affordable(branchTerms(v))?btn(v.slice(1).split(/[：:；。]/)[0],'storySet('+JSON.stringify(key+'choice')+','+(j+1)+')'):'<button disabled>'+esc(v.slice(1).split(/[：:；。]/)[0])+'</button>')).join(''):storyRefs(shown,ref.book,state,key,seen.concat(tag),transcript,collect))+'</article>'
 }).join('')
}
function referencedOutcomes(a){
 const root=storyParts(a.text,a.choice),out={pending:false,texts:[]};
 if(root.branched&&a.choice==null)return out;
 storyRefs(root.shown,storySource(a),a.reading||{},'a',[],[],(_,parts,branched,choice,shown)=>{
  if(branched&&choice==null){out.pending=true;return}
  const selected=branched?parts[choice].slice(1):shown;
  const colon=branched?selected.search(/[：:]/):-1;
  out.texts.push(colon<0?selected:selected.slice(colon+1))
 });
 return out
}
function storySet(key,value){
 if(!activePlayer()||s.phase!=='result'||!key.endsWith('choice'))return;
 const a=s.a,state=a.reading??={};if(state[key]!=null)return;
 const shown=storyParts(a.text,a.choice).shown;
 let selected;
 storyRefs(shown,storySource(a),state,'a',[],[],(path,parts,branched)=>{if(path+'choice'===key&&branched)selected=parts[value]});
 if(!selected||value<1)return;
 const costs=branchTerms(selected);if(!affordable(costs))return;
 for(const [k,v] of Object.entries(costs)){const [o,id]=resourceAccount(k);o[id]-=v}
 state[key]=value;(a.paidReadings??={})[key]=value;noteDecision(selected.slice(1).split(/[：:；。]/)[0]);save()
}
function rememberStory(a){
 const timeline=voyageEntries(),journal=s.journal??=[];
 timeline.push({turn:s.turn,story:journal.length});
 journal.push(revealedStory(a))
}
function resultFromPrint(a){
 const rows=entryIndex.get(a.book+':'+a.id)||[];
 const match=rows.find(r=>r[5]===a.name)||rows.find(r=>r[5]?.includes(a.name))||(rows.length===1?rows[0]:null);
 if(match){a.text=match[1];a.cost=match[2];a.title=match[5]||a.name;return}
 const page=bookIndex[a.book+':'+a.id];if(page)a.printPage=page[1]
}
function journalPanel(){
 if(!s.journal?.length)return '';
 if(s.phase==='ended'){
  return '<section class="panel journal"><h2>探險旅程回顧</h2>'+s.journal.slice(-1).map(x=>'<h3>'+esc(x.title)+'</h3><p class="story">'+esc(x.body)+'</p>'+cardShelf(x.cardIds||[],'已取得')).join('')+(s.journal.length>1?'<details><summary>更早的故事</summary>'+s.journal.slice(0,-1).reverse().map(x=>'<details><summary>第 '+x.turn+' 回合 · '+esc(x.title)+'</summary><p class="story">'+esc(x.body)+'</p>'+cardShelf(x.cardIds||[],'已取得')+'</details>').join('')+'</details>':'')+'</section>';
 }
 return '';
}
function repairPassage(a){
 const original=stories[a.event]?.[1]?.replace(/\s/g,'')||'';
 if(!original.includes('載具1434')||!original.includes('下一條結果')||!/修復的?行動/.test(original))return;
 if(a.id===791&&s.mission===1596){a.text=original.split('否則')[0];return}
 const depart=a.event.startsWith('story:depart:'),traveller=a.id===791;
 if(a.repairStage==null)a.repairStage=depart||traveller?0:1;
 const stage=a.repairStage,stop=depart?(a.id===152?483:152):traveller&&stage===0?732:0;
 const scenes=original.split(/(?=在修補了支離破碎|你退後一步|燈光閃爍)/);
 const cut=t=>(t||'').split(/你可以選擇|獲得命運|獲得1點士氣|獲得2點強化|如果你擁有使命/)[0];
 const last=scenes.find(t=>t.startsWith('燈光閃爍'));
 if(!last){delete a.repairStage;return}
 const intro=stage===0?cut(scenes[0]):stage===1?cut(scenes.find(t=>t.startsWith('在修補'))||scenes[0]):stage===2?cut(scenes.find(t=>t.startsWith('你退後'))):last.split('獲得載具1434')[0];
 const reward=stage===0?(traveller?'獲得1點強化和命運1605。':''):stage===1?(traveller?'獲得2點強化。':'獲得命運1605。獲得1點強化。'):stage===2?'獲得1點士氣和1點幫助。':'獲得載具1434。';
 a.text=intro+reward;
 if(stage===3&&traveller)a.text+=last.split('獲得載具1434')[1].replace(/^，/,'');
 if(stop)a.dest=stop
}
function repairOptions(a){
 const cost=[3,5,7][a.repairStage];
 return btn(a.dest?'停止修復，前往 '+pad(a.dest):'停止修復，進入下一回合','finish()',true)+
 (rescueTurnEnd()?btn('停止修復並等待救援','finish(false,true)'):'')+
 btn('繼續修復（幫助費用 '+cost+'）','nextRepair()')
}
function nextRepair(){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||!Number.isInteger(a.repairStage)||a.repairStage>=3||s.unplaced?.length||reserveSize()>reserveLimit())return;
 const stage=a.repairStage+1,cost=[0,3,5,7][stage];
 noteDecision('繼續修復，支付幫助行動費用 '+cost+'。');rememberStory(a);
 s.a={id:a.id,origin:a.origin,event:a.event,kind:a.kind,book:'help',name:'修復',title:'修復飛船殘骸',repairStage:stage,cost,dice:[],text:''};
 s.phase='cost';save()
}
