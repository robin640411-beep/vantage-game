const faceNames={c:['空白','空白','生命','挫折','士氣','時間'],s:['移動','查看','接觸','幫助','獲取','壓制']};
function faceImg(type,i){return '<img class="faceIcon" alt="'+faceNames[type][i]+'" src="tabletop/'+type+i+'.webp">'}
let rollTimer;
const queuedRolls=[];
function cast(type,values,title){
 if(!values.length)return;
 const tray=document.getElementById('diceTray');
 if(tray.open){queuedRolls.push([type,values.slice(),title]);return}
 tray.onclose=()=>{clearTimeout(rollTimer);if(queuedRolls.length)cast(...queuedRolls.shift())};
 clearTimeout(rollTimer);
 const angles=[[0,0],[0,90],[0,180],[0,-90],[-90,0],[90,0]];
 tray.innerHTML='<strong>'+esc(title)+'</strong><div class="cast">'+values.map((v,i)=>{
 const [x,y]=angles[v];
 return '<div class="landing" style="--delay:'+((i%4)*45)+'ms;--drift:'+((i%3-1)*55)+'px"><div class="cube" style="--rx:'+(-x)+'deg;--ry:'+(-y)+'deg">'+angles.map(([a,b],f)=>'<div class="side" style="transform:rotateY('+b+'deg) rotateX('+a+'deg) translateZ(var(--half))">'+faceImg(type,f)+'</div>').join('')+'</div><small>'+faceNames[type][v]+'</small></div>'}).join('')+'</div>';
 if(!tray.open)tray.showModal();rollTimer=setTimeout(()=>tray.close(),2000)
}
function throwDice(type,count,title){const values=Array.from({length:count},()=>rng(6));cast(type,values,title);return values}
function mapFace(name){return faceNames.c.indexOf(name)}
function boardView(){
 const back=!!s.boardBack,flip=back?'back':'front',top=back?36:39;
 function token(label,x,y,fn,cls=''){return '<button class="pin '+cls+'" style="left:'+x+'%;top:'+y+'%" onclick="'+esc(fn)+'">'+esc(label)+'</button>'}
 const fate=s.fates.at(-1);
 return '<section class="playerBoard"><div class="boardHead"><h2>玩家輔助板</h2>'+btn('翻到'+(back?'正':'背')+'面','s.boardBack=!s.boardBack;save()')+btn('放大板面','enlargeBoard()')+btn('📖 骰子與規則指南','showRuleGuide()')+'</div><div class="mat"><img src="tabletop/'+flip+'.webp" alt="繁中玩家輔助板'+(back?'背':'正')+'面">'+
 statNames.map((v,i)=>'<button class="trackPiece" aria-label="'+v+' '+s.stats[i]+'" style="left:'+(5+s.stats[i]*14)+'%;top:'+(top+i*6)+'%" onclick="document.getElementById(\'bagSection\')?.scrollIntoView({behavior:\'smooth\'})">'+statArt(i)+'<b>'+s.stats[i]+'</b></button>').join('')+
 token('使命 '+s.mission,17,back?84:20,'showMission()')+(fate?token('命運 '+fate,49,back?84:20,"show(cardShelf(s.fates,'當前命運'))"):'')+
 token(s.penalty+' 顆懲罰',84,back?88:24,"showPoolHelp()")+token('骰池 '+pool()+' / 10',29,back?15:87,"showPoolHelp()")+token(s.grid.filter(Boolean).length+' / 9 網格',78,back?16:88,"document.getElementById('bagSection')?.scrollIntoView({behavior:'smooth'})")+'</div></section>'
}
const hints=[
 ['研究 檢視 檢查 破解','仔細分析眼前的構造或線索。'],['詢問 交談 商討','向對方打聽消息，或討論眼前的事。'],['製作 組裝 建立 釀製','利用眼前的材料或工具動手製作。'],['修復 治癒 救助 協助','介入眼前的困難，試著使情況好轉。'],['搜索 掃視 觀察 尋找','查看周圍，尋找值得注意的目標。'],['監視 傾聽 嗅聞','留在原處，從動靜中辨認線索。'],['偷取 扒竊','趁對方未察覺時取走東西。'],['收集 採摘 搜刮 挖掘','從環境中採集或找出可用的東西。'],['學習 掌握','練習卡牌所代表的知識或技巧。'],['購買 交易','向對方提出交易；依條目確認交換內容。'],['裝備','準備使用這張卡牌對應的裝備。'],['對決','向對手提出較量，依條目進入對決。'],['攀登 攀爬 下潛 上浮','改變所在高度，接近不同位置。'],['狩獵 捕魚 捕獲','追尋生物並嘗試將牠捕獲。'],['提供 分享 餵養','主動給予對象所需的東西。'],['攻擊 擊殺 制服 劫掠','直接以武力對付眼前的目標。'],['說服 誘哄 欺詐','透過言語影響對方的選擇。'],['進入 漫步 接近 探訪','走近眼前的區域，探索當地情況。']
];
function actionButton(a,i){
 if(a.isCardAbility){
  return '<button class="actionTile cardAbilityTile" onclick="choose('+i+')"><small>✨ 卡牌異能 · '+a.id+'</small><b>'+esc(a.name)+'</b><span>'+esc(a.ability?.hint||'消耗強化啟動卡面異能。')+'</span></button>';
 }
 const k=keys.indexOf(a.book),skill=skills[k]||'卡面',target=a.kind==='卡牌'?'卡牌 '+a.id:'地點 '+pad(a.id);
 let hint=a.kind==='離開'?(a.dest?'沿此出口前往地點 '+pad(a.dest)+'。':'沿此方向離開，宣告後揭示路線。'):hints.find(([words])=>words.split(' ').includes(a.name))?.[1];
 if(!hint)hint='在'+target+'執行「'+a.name+'」。'+(['藉由移動改變所處位置。','調查現場以獲取資訊。','與遇到的對象互動。','主動支援對象或操作設施。','嘗試取得或使用資源。','以力量或技巧克服阻礙。'][k]||'依卡面說明處理。');
 return '<button class="actionTile" onclick="choose('+i+')"><small>'+(k>=0?tokenArt('skill-'+k):'')+esc(skill+(a.kind==='卡牌'?' · '+a.id:''))+'</small><b>'+esc(a.name)+'</b><span>'+esc(hint)+'</span></button>'
}

function enlargeBoard(){show('<img src="tabletop/'+(s.boardBack?'back':'front')+'.webp" alt="玩家輔助板" onclick="this.classList.toggle(\'zoomed\')">')}

function tokenArt(key){return '<img class="tokenArt" src="tabletop/tokens/'+key+'.webp" alt="">'}
function statArt(i){return tokenArt('stat-'+s.hero+'-'+i)}
function cubeArt(){const colors=['#38a9ff','#a96cff','#ff9f2f','#48c66d','#f1c441','#ff5a5f'];return '<i class="countCube" aria-hidden="true" style="--cube-color:'+colors[s.hero]+'"></i>'}
const markerCardLimits={
 1585:{max:2,label:'地圖標記',name:'繪製這顆未知星球的地圖'},
 1592:{max:3,label:'征服標記',name:'征服一整座城市'},
 1598:{max:3,label:'信號標記',name:'三角定位求救信號'},
 1603:{max:7,target:2,label:'對決讚譽',name:'贏得傳奇般的讚譽'},
 1631:{max:4,label:'水域標記',name:'繪製未知的水域地圖'},
 1634:{max:1,label:'寶箱標記',name:'取得上鎖的箱子'},
 1635:{max:8,label:'倒數標記',name:'殺死靈魂之王'},
 1638:{max:4,label:'遞送標記',name:'遞送包裹'},
 1642:{max:3,label:'征服進度',name:'支持一場征服'},
 1643:{max:5,label:'冒險標記',name:'引導孩童進行冒險'},
 1659:{max:9,label:'保衛標記',name:'保護被圍攻的堡壘'},
 1669:{max:6,target:3,label:'旗幟標記',name:'放置一系列旗幟'},
 1673:{max:9,label:'站點標記',name:'跟隨9站之路'},
 1680:{max:2,label:'巡邏標記',name:'在東橋巡邏一夜'},
 1695:{max:3,label:'圖紙標記',name:'分享宇宙飛船設計圖'},
 1696:{max:3,label:'採摘標記',name:'稜鏡樹'},
 1702:{max:4,label:'巨獸標記',name:'將逃跑的動物驅趕回來'},
 1705:{max:6,label:'救援標記',name:'生存直至救援抵達'},
 1706:{max:18,label:'符文標記',name:'找到隱藏的符文'},
 1707:{max:3,label:'著迷標記',name:'親和之石'}
};
for(let id=1266;id<=1293;id++){
 markerCardLimits[id]={max:3,isStructure:true,label:'構築物方塊',name:'構築物'};
}

const cardMarkerPins={
 1585:[
  {x:81.5,y:53.6},{x:91.6,y:53.6}
 ],
 1592:[
  {x:71.2,y:59.8},{x:81.4,y:59.8},{x:91.6,y:59.8}
 ],
 1598:[
  {x:71.2,y:52.8},{x:81.4,y:52.8},{x:91.6,y:52.8}
 ],
 1603:[
  {x:71.2,y:21.4},
  {x:71.2,y:37.4},{x:81.4,y:37.4},{x:91.6,y:37.4},
  {x:71.2,y:53.4},{x:81.4,y:53.4},{x:91.6,y:53.4}
 ],
 1631:[
  {x:62.0,y:38.0},{x:72.2,y:38.0},
  {x:62.0,y:53.4},{x:72.2,y:53.4}
 ],
 1634:[
  {x:72.5,y:53.4}
 ],
 1635:[
  {x:41.4,y:38.0},{x:51.6,y:38.0},{x:61.8,y:38.0},{x:72.0,y:38.0},
  {x:41.4,y:53.4},{x:51.6,y:53.4},{x:61.8,y:53.4},{x:72.0,y:53.4}
 ],
 1638:[
  {x:62.5,y:38.0},{x:72.8,y:38.0},
  {x:62.5,y:53.4},{x:72.8,y:53.4}
 ],
 1642:[
  {x:52.0,y:56.8},{x:62.2,y:56.8},{x:72.4,y:56.8}
 ],
 1643:[
  {x:62.2,y:38.0},{x:72.4,y:38.0},
  {x:52.0,y:53.4},{x:62.2,y:53.4},{x:72.4,y:53.4}
 ],
 1659:[
  {x:14.8,y:27.4},{x:25.0,y:27.4},{x:35.2,y:27.4},
  {x:14.8,y:42.8},{x:25.0,y:42.8},{x:35.2,y:42.8},
  {x:14.8,y:58.2},{x:25.0,y:58.2},{x:35.2,y:58.2}
 ],
 1669:[
  {x:14.3,y:28.6},{x:24.5,y:28.6},{x:34.7,y:28.6},
  {x:14.3,y:44.8},{x:24.5,y:44.8},{x:34.7,y:44.8}
 ],
 1673:[
  {x:5.5,y:89.0},{x:12.8,y:89.0},{x:21.0,y:89.0},
  {x:30.2,y:89.0},{x:39.5,y:89.0},{x:47.8,y:89.0},
  {x:55.8,y:89.0},{x:64.2,y:89.0},{x:72.8,y:89.0}
 ],
 1680:[
  {x:15.5,y:37.4},
  {x:15.5,y:53.4}
 ],
 1695:[
  {x:51.6,y:54.0},{x:61.8,y:54.0},{x:72.0,y:54.0}
 ],
 1696:[
  {x:71.5,y:67.6},{x:81.7,y:67.6},{x:91.9,y:67.6}
 ],
 1702:[
  {x:14.8,y:33.5},{x:25.0,y:33.5},
  {x:14.8,y:49.0},{x:25.0,y:49.0}
 ],
 1705:[
  {x:82.7,y:12.0},{x:92.0,y:12.0},
  {x:82.7,y:28.0},{x:92.0,y:28.0},
  {x:82.7,y:44.0},{x:92.0,y:44.0}
 ],
 1706:[
  {x:16.1,y:18.0},{x:25.9,y:18.0},{x:35.6,y:18.0},{x:45.3,y:18.0},{x:55.1,y:18.0},{x:64.8,y:18.0},
  {x:16.1,y:32.8},{x:25.9,y:32.8},{x:35.6,y:32.8},{x:45.3,y:32.8},{x:55.1,y:32.8},{x:64.8,y:32.8},
  {x:16.1,y:47.6},{x:25.9,y:47.6},{x:35.6,y:47.6},{x:45.3,y:47.6},{x:55.1,y:47.6},{x:64.8,y:47.6}
 ],
 1707:[
  {x:29.5,y:54.5},
  {x:29.5,y:69.5},
  {x:29.5,y:84.5}
 ]
};
const structurePins=[{x:67.5,y:7.7},{x:67.5,y:17.7},{x:67.5,y:27.7}];

function cardMarkers(n){
 n=Number(n);
 const boost=s?.boost?.[n]||0;
 const isStructure=(n>=1266&&n<=1293);
 const mark=s?.markers?.[n]||0;
 const cardList=typeof cards!=='undefined'?cards:(typeof WORLD!=='undefined'?WORLD.cards:{});
 const occupied=(cardList[n]?.slots||[]).filter(q=>s?.occupied?.[q.uid]).map(q=>({uid:q.uid,pos:q.position,die:s.occupied[q.uid]}));
 const pinDice=occupied.map(o=>'<div class="slotDiePin" style="left:'+(o.pos[0]*100)+'%;top:'+(o.pos[1]*100)+'%" title="骰槽放入 '+o.die+' 骰">'+faceImg('c',mapFace(o.die))+'</div>').join('');
 
 const bPins=(typeof cardBoostPins!=='undefined'?cardBoostPins[n]:null)||(isStructure?structurePins:null);
 const isInPlay=s&&([...(s.grid||[]),...(s.reserve||[]),...(s.supply||[])].includes(n)||(s.heroRoleCard===n)||(n>=1435&&n<=1440&&s.grid?.includes(n)));
 
 let boostPinsHtml='';
 if(bPins){
  boostPinsHtml=bPins.map((p,idx)=>{
   if(idx<boost){
    return '<div class="slotMarkerPin slotBoostPin" style="left:'+p.x+'%;top:'+p.y+'%;" title="強化 '+(idx+1)+' / '+bPins.length+'">'+cubeArt()+'</div>';
   }else if(boost>0||isInPlay||isStructure){
    return '<div class="slotMarkerGhost slotBoostGhost" style="left:'+p.x+'%;top:'+p.y+'%;" title="待放置強化槽 '+(idx+1)+'"></div>';
   }
   return '';
  }).join('');
 }

 const info=markerCardLimits[n];
 const isTracked=info&&s&&([...(s.fates||[]),...(s.supply||[]),...(s.grid||[]),...(s.reserve||[])].includes(n)||s.mission===n);
 
 let markerPinsHtml='';
 if(cardMarkerPins[n]){
  const pins=cardMarkerPins[n];
  const maxGoal=info?.target||info?.max||pins.length;
  markerPinsHtml=pins.map((p,idx)=>{
   if(idx<mark){
    return '<div class="slotMarkerPin" style="left:'+p.x+'%;top:'+p.y+'%;" title="'+(info?.label||'標記')+' '+(idx+1)+(info?' / '+maxGoal:'')+'">'+cubeArt()+'</div>';
   }else if(isTracked||mark>0||isStructure){
    return '<div class="slotMarkerGhost" style="left:'+p.x+'%;top:'+p.y+'%;" title="待放置標記槽 '+(idx+1)+'"></div>';
   }
   return '';
  }).join('');
 }
 
 // 當卡面已有實體強化槽/骰子標記時，不再於左下角文字堆疊重複標籤；若無實體槽位則作為備用顯示
 const boostBadge=(!bPins&&boost)?'<span aria-label="強化 '+boost+'">'+cubeArt()+'強 '+boost+'</span>':'';
 const dicePills=(!pinDice&&occupied.length)?occupied.map(o=>'<span class="diceBadge" title="骰槽放入 '+o.die+' 骰">'+faceImg('c',mapFace(o.die))+' '+o.die+'</span>').join(''):'';
 const markBadge=(!isStructure&&(mark>0||isTracked)&&info)?
  '<span class="markerBadge" style="background:#8b3a1aeb;border:1px solid #d97843;" aria-label="'+(info?.label||'進度標記')+' '+mark+(info?' / '+(info.target||info.max):'')+'">'+cubeArt()+(info?.label||'標記')+' '+mark+(info?' / '+(info.target||info.max):'')+'</span>':'';

 const showCounters=boostBadge||markBadge||dicePills;
 return (showCounters?'<span class="cardCounters">'+boostBadge+markBadge+dicePills+'</span>':'')+pinDice+boostPinsHtml+markerPinsHtml;
}
function coinStack(total){
 let rest=total,html='';
 for(const d of [10,5,2,1]){
 const count=Math.floor(rest/d);rest%=d;
 if(count||total===0&&d===1)html+='<span class="coinUnit" aria-label="'+d+' 點錢幣 '+count+' 枚">'+tokenArt('coin-'+d)+'×'+count+'</span>'
 }
 return html
}

function showPoolHelp(){
 const occupiedCount=Object.keys(s.occupied||{}).length;
 const diceInGrid=(typeof cards!=='undefined'?Object.entries(s.occupied||{}).map(([uid,d])=>{
  const cardId=uid.split(':')[1];
  return '<li><b>卡牌 '+cardId+'</b>（'+(cards[cardId]?.name||'網格卡牌')+'）骰槽：'+faceImg('c',mapFace(d))+' 放入了 <b>「'+d+'」骰</b></li>';
 }).join(''):'');
 const currentPool=pool();
 show('<section class="helpModal"><h2>🎲 挑戰骰池與刷新機制說明</h2>'+
 '<div class="poolStatusBox">'+
  '<div><b>公共骰池可用</b><p class="poolNum">'+currentPool+' / 10 顆</p></div>'+
  '<div><b>卡牌骰槽佔用</b><p class="poolNum">'+occupiedCount+' 顆</p></div>'+
  '<div><b>懲罰區滯留</b><p class="poolNum">'+s.penalty+' 顆</p></div>'+
 '</div>'+
 (diceInGrid?'<h3>📌 目前卡在卡牌上的骰子</h3><ul>'+diceInGrid+'</ul>':'<p style="color:#666;">目前沒有骰子放在卡牌骰槽中。</p>')+
 '<div class="ruleGuideSec">'+
  '<h3>1. 什麼是挑戰骰池（共 10 顆）？</h3>'+
  '<p>在《萬境奇旅》中，黑色挑戰骰一共只有 10 顆，是整場探險公共流通的骰子庫存。當你宣告行動並擲骰時，所需的挑戰骰都從這 10 顆骰池中拿取擲出。</p>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>2. 擲出的骰子會去哪裡？</h3>'+
  '<ul>'+
   '<li><b>放入卡牌骰槽</b>：如果你將骰子放入 3×3 網格中卡牌的骰槽，這顆骰子會<b>直接吸附留在該卡牌上</b>（抵消扣血/扣士氣傷害，或獲得強化獎勵），骰槽被佔用，骰子暫時不會回到骰池。</li>'+
   '<li><b>承受此骰結果</b>：如果你選擇直接承受結果，該骰子會移入輔助板右上角的<b>懲罰骰區</b>（扣除生命/士氣/時間）。</li>'+
  '</ul>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>3. 什麼時候會「刷新（Refresh）」收回所有骰子？</h3>'+
  '<p>當你需要擲出 X 顆骰子，但<b>目前骰池中剩下的可用骰子不足 X 顆時</b>，系統會<b>自動觸發「刷新」</b>！</p>'+
  '<p><b>刷新效果：</b>所有卡在卡牌骰槽上的骰子、以及懲罰區的所有骰子，會<b>全數收回骰池</b>（所有卡牌的骰槽全部重新恢復為空位），可用骰池重置為滿額 10 顆，然後才擲出本次行動所需的骰子！</p>'+
  '<p class="note">💡 戰術要訣：把骰子放進卡牌骰槽能擋住大量傷害，而且完全不用擔心永遠卡死——只要骰池用光觸發刷新，所有骰槽就會自動重置釋放！</p>'+
 '</div>'+
 btn('關閉說明','viewer.close()',true)+
 '</section>');
}

function showRuleGuide(){
 show('<section class="helpModal"><h2>📖 萬境奇旅 · 新手速查指引</h2>'+
 '<p class="note" style="margin-bottom:12px;">專為沒有閱讀過繁中說明書的玩家設計，快速掌握行動、擲骰、卡牌骰槽與骰池的核心玩法！</p>'+
 '<div class="ruleGuideSec">'+
  '<h3>一、行動必定成功！擲骰到底是在擲什麼？</h3>'+
  '<p>在《萬境奇旅》中，<b>你的所有行動是必定成功的</b>！</p>'+
  '<p>行動標註的費用（如 2 點）代表起始要擲出的<b>挑戰骰數量</b>。擲骰不是為了看成功失敗，而是代表冒險過程中的<b>體力代價、險阻與壓力（傷害）</b>。</p>'+
  '<p><b>💡 怎麼免受傷害？</b> 每次行動前，你每支付 1 枚對應的<b>技能標記</b>，就能<b>少擲 1 顆骰子</b>。如果全額付清，你甚至能<b>擲 0 顆骰</b>，完全無傷直接達成行動並看故事！</p>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>二、挑戰骰的 6 個骰面與含義</h3>'+
  '<div class="diceFaceGrid">'+
   '<div class="diceFaceCard">'+faceImg('c',0)+'<div><b>空白（×2面）</b><small>安全！無任何損失</small></div></div>'+
   '<div class="diceFaceCard">'+faceImg('c',2)+'<div><b>生命</b><small>受傷，承受失去1生命</small></div></div>'+
   '<div class="diceFaceCard">'+faceImg('c',3)+'<div><b>挫折</b><small>阻礙，特定故事判定</small></div></div>'+
   '<div class="diceFaceCard">'+faceImg('c',4)+'<div><b>士氣</b><small>壓力，承受失去1士氣</small></div></div>'+
   '<div class="diceFaceCard">'+faceImg('c',5)+'<div><b>時間</b><small>延宕，承受失去1時間</small></div></div>'+
  '</div>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>三、如何使用卡牌骰槽（核心技巧）</h3>'+
  '<p>卡牌上的方框就是<b>骰槽（Slot）</b>。當你擲出危險的骰子時，你可以把它放入符合條件的卡牌骰槽中：</p>'+
  '<ul>'+
   '<li><b>100% 抵消傷害</b>：放入骰槽的骰子，<b>完全不會扣減</b>你的生命、士氣或時間！</li>'+
   '<li><b>賺取強化充能</b>：很多骰槽標有「得 1 強化」，放入骰子還能直接幫卡牌添加強化方塊！</li>'+
   '<li><b>放入條件</b>：卡牌必須放在 3×3 隨身網格中；骰槽需相符（例如「士氣專用槽」限士氣骰，「移動槽」限移動行動）；每個槽位同時限放 1 顆。</li>'+
   '<li><b>視覺呈現</b>：放入後，卡面上會直接吸附顯示該骰子圖標，行囊中也會清楚標記！</li>'+
  '</ul>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>四、挑戰骰池（10 顆）與「刷新重置」</h3>'+
  '<p>公共骰池一共只有 10 顆骰子。放在卡牌上的骰子和懲罰區的骰子會暫時留在外面。當骰池剩餘骰數不足以進行下一次擲骰時，系統會<b>自動刷新</b>：<b>所有卡牌骰槽清空、懲罰區清空，全部 10 顆骰子收回骰池</b>，讓所有卡牌骰槽滿血復活！</p>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>五、角色重擲（Hero Reroll）</h3>'+
  '<p>當擲出嚴重的骰面（如快沒血時擲出生命骰），只要主角卡上有 1 點強化方塊，即可點選<b>「支付 1 角色強化重擲」</b>來改寫命運！若重擲出主角的專長面，還能免費獎勵 1 點技能標記！</p>'+
 '</div>'+
 '<div class="ruleGuideSec">'+
  '<h3>六、官方 FAQ 與線上規則澄清</h3>'+
  '<p>若遇到罕見的卡牌互動、特殊疑難或邊界情況，可直接查閱出版社官方 FAQ 與勘誤：</p>'+
  '<ul>'+
   '<li><b>官方 FAQ & 規則澄清</b>：<a href="https://stonemaiergames.com/games/vantage/rules-faq" target="_blank" rel="noopener">stonemaiergames.com/games/vantage/rules-faq</a></li>'+
   '<li><b>Rulepop 數位規則庫</b>：<a href="https://vantage.rulepop.com" target="_blank" rel="noopener">vantage.rulepop.com</a></li>'+
   '<li><b>原書對應頁面</b>：規則手冊第 15 頁（可點擊下方按鈕直接翻閱）。</li>'+
  '</ul>'+
  '<div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">'+
   btn('🌐 開啟官方 FAQ 網頁','window.open("https://stonemaiergames.com/games/vantage/rules-faq","_blank")')+
   btn('📖 查閱規則書第 15 頁 (FAQ)','pageView(1,15)')+
  '</div>'+
 '</div>'+
 btn('了解，開始冒險！','viewer.close()',true)+
 '</section>');
}
