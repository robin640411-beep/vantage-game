// Only settle literal rewards. Conditions, costs, alternatives and variable quantities require a decision.
const rewardUnit=/隨機技能|移動|查看|接觸|幫助|獲取|壓制|強化|錢幣|生命值?|士氣值?|時間/;
const rewardCard=/藍圖|法術|詛咒|物品|動物|植物|能力|載具|建築|構築物|課程|命運|任務|智慧生物|智慧生|元素體|卡牌|經驗牌|經驗|同伴|盟友|裝備/;
const rewardPattern=new RegExp('(?:(\\d+)(?:點|枚|個)?('+rewardUnit.source+')|[$＄](\\d+)|(?:一張|1張)?('+rewardCard.source+')[(（]?(\\d{3,4})[)）]?)','y');
function endingSkillOffer(text){
 const compact=text.replace(/\s/g,'')
  .replace(/([。！？])[”」](?=獲得)/g,'$1')
  .replace(/(獲得(?:能力|物品)\d+(?:和\d+點士氣)?|獲得\d+點士氣)，並?(?=獲得\d+點(?:移動|查看|接觸|幫助|獲取|壓制)(?:或者|或))/g,'$1。');
 const offer=compact.match(/(?:^|[。！？])(?:獲得(\d+)點?強化[，、]並?)?(?:選擇)?獲得[：:]?((?:\d+點?(?:移動|查看|接觸|幫助|獲取|壓制)、)*\d+點?(?:移動|查看|接觸|幫助|獲取|壓制)(?:或者|或)(?:\d+點?)?(?:移動|查看|接觸|幫助|獲取|壓制))(?:[；：，。]?(?:你可以)?繼續|；前往(?:內部|地點|洞穴|城市|地城|地底|水下)?\d{3})?[。，]?$/);
 if(!offer)return null;
 let amount;
 const choices=offer[2].split(/或者|或|、/).map(entry=>{
  const [,n,kind]=entry.match(/^(?:(\d+)點?)?(移動|查看|接觸|幫助|獲取|壓制)$/);
  if(n)amount=Number(n);
  return [kind,amount]
 });
 return {choices,boost:Number(offer[1]||0),start:offer.index,compact}
}
function directRewards(text){
 const offer=endingSkillOffer(text);
 if(offer)text=offer.compact.slice(0,offer.start)+(offer.boost?'。獲得'+offer.boost+'點強化。':'');
 const found=[];
 const condRe=/如果|若|否則|或者|或|可以|可獲|支付|花費|選擇|選一|至少|至多|最多|根據|每(?:有|獲|個|張|點)|時[，：]|而非|改為|隨機抽|擲出|比.{0,4}多|[·•●]/;
 const parseClause=(sentence)=>{
  let initBoostOverride=null;
  if(/且其[“「]?放置時[”」]?的效果只有1點強化[（(]而非2點強化[）)]/.test(sentence)){
   initBoostOverride=1;
   sentence=sentence.replace(/且其[“「]?放置時[”」]?的效果只有1點強化[（(]而非2點強化[）)]/g,'');
  }
  const attachBoost=sentence.match(/並在其上附帶(\d+)點強化/);
  if(attachBoost){
   initBoostOverride=Number(attachBoost[1]);
   sentence=sentence.replace(/並在其上附帶\d+點強化/g,'');
  }
  sentence=sentence.replace(/[；;]?你可以逐個選擇將這些物品放置在你的儲備區或網格中/g,'');
  if(condRe.test(sentence))return;
  sentence=sentence.replace(/[（(][^）)]*(?:供應區|中央區|網格)[^）)]*[）)]/g,'').replace(/[；，]?(?:將其|將任務)?(?:橫向)?添加到你的(?:供應區|中央區|網格)[^）)]*[）)]?/g,'');
  const mGain=sentence.match(/獲得|獲取(?=(?:一張|1張)?(?:藍圖|法術|詛咒|物品|動物|植物|能力|載具|建築|構築物|課程|命運|任務|智慧生物|智慧生|元素體|卡牌)\d{3,4})/);
  if(!mGain)return;
  const start=mGain.index;
  const prefix=sentence.slice(0,start);
  if(prefix&&!/[，；;並且再後也”」“「"：:中以]$/.test(prefix))return;
  if(/[·•●]|(?:^|[，；;])[0-9]+[：:]/.test(prefix))return;
  let rest=sentence.slice(start+2).replace(/[.。]+$/,''),items=[],lastCardType=null;
  const named=rest.match(/^([^（(，；;。！？]{1,12})[（(](\d{3,4})[）)](.*)$/);
  if(named&&cards[named[2]]&&cards[named[2]].home!=='location'&&(!named[3]||/^[；;，,]/.test(named[3])||/^(?:你可以繼續|並|然後|繼續|參閱|參見|前往|退出至)/.test(named[3]))){
   const e={card:Number(named[2]),type:named[1]==='藥劑鋪'?'構築物':'物品',label:'獲得'+named[1]+'（'+named[2]+'）'};
   if(initBoostOverride!=null)e.initialBoost=initBoostOverride;
   found.push(e);
   return
  }
  while(rest){
   rewardPattern.lastIndex=0;const m=rewardPattern.exec(rest);
   let e=null,consumed=0;
   if(m){
    e=m[5]?{card:+m[5],type:m[4]}:{kind:(m[2]||'錢幣').replace('生命值','生命').replace('士氣值','士氣'),delta:Number(m[1]||m[3])};
    if(e.card)lastCardType=m[4];
    consumed=m[0].length;
    if(e.card&&!cards[e.card])break;
    e.label='獲得'+m[0];
   }else if(lastCardType){
    const bare=rest.match(/^(\d{3,4})/);
    if(!bare||!cards[+bare[1]]||cards[+bare[1]].home==='location')break;
    e={card:+bare[1],type:lastCardType,label:'獲得'+lastCardType+bare[1]};
    consumed=bare[0].length;
   }else break;
   if(e.card&&initBoostOverride!=null)e.initialBoost=initBoostOverride;
   items.push(e);rest=rest.slice(consumed);
   rest=rest.replace(/^[（(][^）)]*[）)]/,'');
   if(!rest||/^[；;，,.]/.test(rest)||/^(?:你可以繼續|並繼續|繼續|參閱|參見|(?:然後|並)?(?:前往|退出至)|並且|並(?:在|增加|駕駛|向[東西南北]前往))/.test(rest)){
    const next=rest.match(/^(?:[，、；;]\s*)?(?:以及|和|與|及|並)(?:獲得|增加|在你的角色上獲得)?|^[，、；;](?:獲得|增加|在你的角色上獲得)?/);
    if(next&&rest.length>next[0].length){
     const probe=rest.slice(next[0].length);
     rewardPattern.lastIndex=0;
     if(rewardPattern.exec(probe)||(lastCardType&&/^\d{3,4}/.test(probe))){rest=probe;continue}
    }
    found.push(...items);break
   }
   const next=rest.match(/^(?:[，、；;]\s*)?(?:以及|和|與|及|並)(?:獲得|增加|在你的角色上獲得)?|^[，、；;](?:獲得|增加|在你的角色上獲得)?/);if(!next)break;rest=rest.slice(next[0].length)
  }
 };
 for(let sentence of text.split(/[。！？\n]|，然後(?=(?:你)?可以選擇回到外面（退出至\d{3}）或進入城市（前往\d{3}）)/)){
  sentence=sentence.replace(/\s+/g,'').replace(/^為了幫助你找到(?:可以發現植物|能夠回答此問題)的地點，(?=獲得)/,'');
  if(!sentence)continue;
  const beforeCount=found.length;
  parseClause(sentence);
  // 也解析無條件句中括號內的（獲得物品XXX）等獎勵，例如「你順走了羅盤（獲得物品968），然後...」
  if(found.length===beforeCount&&/[（(]獲得/.test(sentence)){
   const outer=sentence.replace(/[（(]獲得[^）)]+[）)]/g,'');
   if(!condRe.test(outer)&&!/失去|替換|交換|出售/.test(outer)){
    for(const pm of sentence.matchAll(/[（(](獲得[^）)]+)[）)]/g)){
     parseClause(pm[1]);
    }
   }
  }
 }
 return found
}
function creditReward(e,a){
 if(e.card){
  const n=e.card;
  if(a){a.revealedCards??=[];if(!a.revealedCards.includes(n))a.revealedCards.push(n)}
  if(s.grid.includes(n))s.boost[n]=Math.min(cards[n].cap,(s.boost[n]||0)+1);
  else if(![...s.reserve,...s.supply,...s.fates,...(s.unplaced||[])].includes(n)){
   if(e.type==='命運'||/^獲得(?:一張|1張)?命運/.test(e.label||''))s.fates.push(n);
   else if(cards[n].orientation==='landscape')s.supply.push(n);
   else {
    (s.unplaced??=[]).push(n);
    if(e.initialBoost!=null&&a){(a.customInitBoost??={})[n]=e.initialBoost}
    if(n===1013&&['story:take:0381:01','story:engage:0381:01'].includes(a?.event))s.boost[n]=1
    if(n===826&&['story:engage:0252:01','story:move:0252:01','story:overpower:0252:01'].includes(a?.event))s.boost[n]=1
   }
  }
 }else{
  let k=skills.indexOf(e.kind),v=statNames.indexOf(e.kind);
  if(k>=0)s.skill[k]+=e.delta;
  else if(v>=0)for(let j=0;j<e.delta;j++)stat(v,1);
  else if(e.kind==='錢幣')s.money+=e.delta;
  else if(e.kind==='強化'){let id=a.kind==='卡牌'&&s.grid.includes(a.id)?a.id:s.grid[4];s.boost[id]=Math.min(cards[id].cap,(s.boost[id]||0)+e.delta)}
  else if(e.kind==='隨機技能')for(let f of throwDice('s',e.delta,'獲得隨機技能'))s.skill[f]++
 }
}
function settleTravelDice(a,path,text){
 const compact=text.replace(/\s/g,'');
 const ocean=compact.match(/獲得1[點個項]隨機技能，?(?:並|然後)(?:前往|退出至)[^。·●•：:]{1,24}海洋地點[：:]([^。·●•]+)/);
 const funnel=compact.match(/擲[1一]顆(?:則，)?技能骰，?並根據結果前往(?:相應的|對應)地點[：:]([^。·●•]+)/);
 if(!a.routeRoll&&(ocean||funnel)){
  const table=new Map();let fallback;
  for(const m of (ocean||funnel)[1].matchAll(/([移動查看接觸幫助獲取壓制其他技能／/]+)[（(](\d{3})[)）]/g)){
   const n=Number(m[2]);if(cards[n]?.home!=='location')continue;
   if(m[1].startsWith('其他'))fallback=n;
   else for(const skill of m[1].replace('幫助獲取','幫助/獲取').split(/[/／]/))table.set(skill,n)
  }
  if(skills.every(k=>table.has(k)||fallback)){
   const face=throwDice('s',1,ocean?'海洋航線':'水龍捲決定落點')[0];
   a.dest=table.get(skills[face])??fallback;a.routeRoll={face,dest:a.dest,ocean:!!ocean};
   if(ocean)s.skill[face]++;
   noteDecision('擲出'+skills[face]+'，前往地點 '+pad(a.dest)+'。')
  }
 }
 const roll=compact.match(/(?:^|[。！])擲(\d+)顆技能骰並獲得所有的?(移動|查看|接觸|幫助|獲取|壓制)結果[。；]/);
 if(!roll||a.skillChecks?.[path]||a.foundryDice||/除非|如果|否則|依據/.test(compact.slice(0,roll.index)))return;
 const count=Number(roll[1]);if(count<1||count>10)return;
 const index=skills.indexOf(roll[2]),dice=throwDice('s',count,'故事技能檢定'),earned=dice.filter(f=>f===index).length;
 (a.skillChecks??={})[path]=dice;s.skill[index]+=earned;
 (a.receipts??={})[path+'roll']='擲出'+dice.map(f=>skills[f]).join('、')+'，獲得'+earned+'點'+skills[index]
}
const animalFoodAlternatives=new Map([
 ['story:help:0101:recovered:0010',[853,'你微笑著讓動物蹭了蹭你。獲得1點士氣。']],
 ['story:help:0150:recovered:0037',[814,'動物飛向你，讓你感到一絲溫暖。獲得1點生命值。']],
 ['story:help:0260:scan:01',[825,'動物蹭了蹭你，讓你感到溫暖而安心。獲得1點士氣。']],
 ['story:help:0475:scan:01',[831,'動物幫你發現了灌木叢中的美味漿果。獲得1點生命值。']],
 ['story:help:0489:01',[826,'動物在你附近扇動翅膀驅散暑氣，讓你恢復了些許體力。獲得1點生命值。']],
 ['story:help:0288:01',[834,'動物扯了扯你的褲子，領你向西走。選擇一項：·跟隨動物向西走：前往287。·留在原地：你目送動物離開。']],
 ['story:help:0326:01',[819,'動物從河裡滾了一顆金色的球給你。獲得物品1185。']],
 ['story:help:0420:recovered:0118',[810,'動物蹭了蹭你，讓你感到一絲溫暖。獲得1點生命值。']],
 ['story:help:0603:01',[820,'獲得1點強化。']],
 ['story:help:0689:01',[827,'你也可以用強化招呼貓咪。選擇一項：·支付2點強化：獲得動物827。·讓貓咪離開：你目送貓咪離開。']],
 ['story:help:0692:recovered:0175',[841,'動物從長滿葉子的鬃毛中抖落藍色和紅色的漿果，請你享用。獲得1點生命值。']],
 ['story:help:0316:01',[843,'動物領你走向北邊的建築物。選擇一項：·跟隨動物往北：前往321。·留在原地：你目送動物離開。']],
 ['story:help:0651:01',[850,'動物試圖咬你的手臂。選擇一項：·支付1點強化避開攻擊：你躲開了。·支付1點移動避開攻擊：你躲開了。·承受咬傷：失去1點生命值。']],
 ['story:help:0470:recovered:0125',[821,'動物示意這裡的水可以安全飲用。獲得1點生命值。']]
]);
function resolveAnimalFood(a){
 if(a.event==='story:take:0620:01'&&a.text===WORLD.stories[a.event][1]){
  const qualifies=[...s.grid,...s.reserve,...s.supply].some(n=>cards[n]?.home==='animal'||cards[n]?.name.includes('食物')||[1181,1232].includes(n));
  a.text='你拔除電線並移走盒子。獲得物品948。智慧生物掙脫束縛，癱倒在地。'+(qualifies?'你帶著食物或動物。獲得智慧生物1326。':'');
  return
 }
 if(!a.event?.startsWith('story:help:'))return;
 if(a.event==='story:help:0493:recovered:0129'&&a.text.startsWith('如果你擁有植物或食物')){
  if(turtleFoodCards().length)a.text='動物吃了幾口。獲得動物822。';
  else if([...s.grid,...s.reserve,...s.supply].some(n=>n>=1385&&n<=1396)){
   a.text='你仍然為這次相遇感到高興。選擇一項：·解除一個詛咒：失去選定的詛咒。·獲得1點士氣：獲得1點士氣。'
  }else a.text='你仍然為這次相遇感到高興。獲得1點士氣。';
  return
 }
 if(a.event==='story:help:0660:01'&&a.text.startsWith('如果你擁有植物或食物')){
  const tookDamage=s.lastOxygenDamageTurn===s.turn||(s.journal||[]).some(entry=>entry.turn===s.turn&&entry.choices?.some(line=>line.startsWith('缺氧傷害：失去')));
  if(turtleFoodCards().length)a.text='動物啃食了一部分。獲得動物848。';
  else a.text=tookDamage?'你本回合曾承受缺氧傷害。獲得1點生命值。':'你本回合未承受缺氧傷害。';
  return
 }
 if(a.event==='story:help:0633:01'&&a.text.startsWith('如果你擁有植物或食物')){
  if(turtleFoodCards().length)a.text='動物啃食了一部分。獲得動物806。';
  else{
   s.ignoreOxygenOnArrival=true;
   a.text='動物向你的肺部吹氣。下次抵達地點時，忽略缺氧傷害。'
  }
  return
 }
 if(a.event==='story:help:0724:01'&&a.text.startsWith('如果你擁有植物或食物')){
  a.fedChestAnimal=turtleFoodCards().length>0;
  a.text=a.fedChestAnimal?'動物吃了幾口。獲得動物837。繼續執行接觸－挑/撬行動，費用減少2點。':'動物緩緩離開寶箱。獲得1點接觸。';
  return
 }
 if(a.text.startsWith('如果你擁有植物或食物')&&a.event==='story:help:0440:01'){
  a.text=turtleFoodCards().length?'動物啃食了一部分。獲得命運1607。將其放置在中央區。':'獲得1點強化。';
  return
 }
 if(a.text.startsWith('如果你擁有植物或食物')&&a.event==='story:help:0291:01'){
  const skip='什麼也沒有發生。獲得1點強化。繼續。';
  const fed='深坑閉合，消失在沙子底下。獲得1點士氣。';
  a.text=turtleFoodCards().length?'你可以把一部分植物或食物丟進深坑。選擇一項：·餵食後向北前進：'+fed+'前往296。·餵食後留在原地：'+fed+'·不餵食，繼續行動：'+skip:skip;
  return
 }
 const special=animalFoodAlternatives.get(a.event);
 if(special&&a.text===WORLD.stories[a.event][1]){
  a.text=turtleFoodCards().length?'你帶著植物或食物，動物吃了幾口。獲得動物'+special[0]+'。':special[1];
  return
 }
 const match=a.text.replace(/\s/g,'').match(/^如果你擁有植物或食物，(?:讓)?動物啃食[^。]+?獲得動物(\d+)。如果沒有，([^。]+?)[（(](獲得[^）)]+)[）)]。?$/);
 if(!match||!directRewards(match[3]).length)return;
 a.text=turtleFoodCards().length?'你帶著植物或食物，動物吃了幾口。獲得動物'+match[1]+'。':match[2].replace(/蹭了蹭1$/,'蹭了蹭你')+'。'+match[3]+'。'
}
function resolveWaterBadgeGate(a){
 if(a.event!=='story:depart:0640:01'||!a.text.includes('如果你擁有水之徽章'))return;
 const hasBadge=[...s.grid,...s.reserve,...s.supply].includes(1249);
 a.text='守衛要求你出示身份。'+(hasBadge?'你出示水之徽章，守衛放行。前往641。':'你沒有水之徽章，留在此處。獲得1點強化。繼續。')
}
function resolveDepartureMorale(a){
 if(!a.event?.startsWith('story:depart:')||!Number.isInteger(a.effort))return;
 const condition=/如果此行動的費用未減少至1點，還能獲得1點士氣。/;
 const compact=a.text.replace(/\s/g,'');
 if(!condition.test(compact))return;
 const result=a.effort===1?'此行動的費用已減至1點。':'獲得1點士氣。';
 a.text=compact.replace(/[；，]?如果此行動的費用未減少至1點，還能獲得1點士氣。/,match=>(/^[；，]/.test(match)?'。':'')+result)
}
function settleChest(a){
 if(a.chest?.done)return false;
 if(!a.chest){
  const compact=a.text.replace(/\s/g,'');
  const match=compact.match(/[擲鄭](\d+)顆技能[骰般](?:以揭示箱子裡的內容)?；(每顆骰子可以重[擲鄭]一次|你可以重擲任意骰子最多2次)。如果你至少[擲鄭]出3顆相同結果，獲得((?:物品|載具|植物)\d+)(?:，你的直覺認為這東西應該被放置在某個特定地點)?[。；]過?或者，如果你(?:至少)?[擲鄭]出一對相同結果，獲得((?:物品|載具|植物)\d+)。否則，(獲得\$\d+|寶箱突然[進迸]發出火焰，灼傷了你的手（受到1點高溫傷害）|箱子裡彈出一個陷阱，把你肺裡的空氣都撞了出來（受到1點缺氧傷害）|箱子像陷阱一樣夾住了你的腿；獲得1點強化並失去1點技能（如果可能）|箱子啪的一聲合上夾住了你的手指；失去1點生命值並獲得1點強化|箱子夾住了你的手指不放（結束你的回合）|箱子試圖吃了你[，；]失去\d+點生命值|一隻爪子從寶箱中伸出並抓走了你的一些錢幣（失去\$\d+）)。(?:你可以繼續。)?$/);
  if(!match)return false;
  const loss=match[5].match(/失去(?:\$(\d+)|(\d+)點生命值)/);
  const fallback=match[5].includes('並獲得1點強化')?'箱子夾住了你的手指。失去1點生命值。獲得1點強化':loss?(loss[1]?'失去'+loss[1]+'枚錢幣':'失去'+loss[2]+'點生命值'):match[5];
  a.chest={faces:throwDice('s',+match[1],'開箱'),limit:match[2].startsWith('每顆')?1:2,spent:[],selected:[],round:0,outcomes:[fallback,'獲得'+match[4],'獲得'+match[3]],intro:compact.slice(0,match.index)}

 }
 const c=a.chest,best=Math.max(...c.faces.map(f=>c.faces.filter(v=>v===f).length));
 if(best<3&&!c.keep&&(c.limit===1?c.spent.length<c.faces.length:c.round<c.limit))return true;
 let reward=c.outcomes?c.outcomes[Math.min(3,best)-1]:best>=3?'獲得物品'+c.triple:best===2?'獲得物品'+c.pair:'獲得$'+c.money;
 const hazard=reward.match(/受到1點(高溫|缺氧)傷害/);
 if(hazard){
  const type=hazard[1],guard=s.grid.find(n=>type==='高溫'?[965,966,967,984,1453].includes(n):[964,984,1013,1447,1448,1449,1450,1451,1452].includes(n));
  if(guard)reward+='。卡牌 '+guard+' 忽略了這次'+type+'傷害';
  else c.hazard=type
 }
 if(reward.includes('夾住了你的腿')){
  reward='箱子夾住了你的腿。獲得1點強化';
  const held=skills.map((_,i)=>i).filter(i=>s.skill[i]>0);
  if(held.length===1){s.skill[held[0]]--;reward+='。已扣除1點'+skills[held[0]]}
  if(held.length>1)c.loseSkill=true
 }
 c.done=true;a.text=(c.intro??a.text.slice(0,a.text.search(/擲\s*\d+\s*顆/)))+'開箱骰面：'+c.faces.map(f=>skills[f]).join('、')+'。'+reward+'。'+(/你可以繼續/.test(a.text)?'你可以繼續。':'');
 return false
}
function useWaterskin(n){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||a?.chest?.hazard!=='高溫'||![857,858].includes(n)||!s.grid.includes(n)||!(s.boost[n]>0))return;
 s.boost[n]--;delete a.chest.hazard;
 const message='水袋 '+n+' 消耗1點強化，忽略高溫傷害';(a.receipts??={}).hazard=message;noteDecision(message);save()
}
function avoidFoundryHeat(){
 const a=s.a,move=keys.indexOf('move');
 if(!activePlayer()||s.phase!=='result'||!a?.foundryDice||a.chest?.hazard!=='高溫'||s.skill[move]<1)return;
 s.skill[move]--;delete a.chest.hazard;
 (a.receipts??={}).hazard='支付1點移動避開高溫';noteDecision(a.receipts.hazard);save()
}
function takeChestDamage(life){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||!a?.chest?.hazard)return;
 const type=a.chest.hazard;delete a.chest.hazard;
 if(life)stat(2,-1);else{stat(0,-1);stat(1,-1)}
 if(type==='缺氧')s.lastOxygenDamageTurn=s.turn;
 const receipt=type+'傷害：'+(life?'失去1點生命':'失去1點時間與1點士氣');
 (a.receipts??={}).hazard=receipt;noteDecision(receipt);save()
}
function payChestSkill(i){
 const a=s.a;if(!activePlayer()||s.phase!=='result'||!a?.chest?.loseSkill||!Number.isInteger(i)||!(s.skill[i]>0))return;
 s.skill[i]--;delete a.chest.loseSkill;
 const message='陷阱扣除1點'+skills[i];(a.receipts??={}).trap=message;noteDecision(message);save()
}
function chestInput(index){
 const c=s.a?.chest;if(!activePlayer()||s.phase!=='result'||!c||c.done)return;
 if(index===-2)c.keep=true;
 else if(index===-1){
  if(!c.selected.length)return;
  const dice=throwDice('s',c.selected.length,'重擲開箱骰');
  c.selected.forEach((i,j)=>{c.faces[i]=dice[j];if(c.limit===1)c.spent.push(i)});
  c.selected=[];c.round++
 }else{
  if(!Number.isInteger(index)||index<0||index>=c.faces.length||c.spent.includes(index))return;
  c.selected=c.selected.includes(index)?c.selected.filter(i=>i!==index):[...c.selected,index]
 }
 save()
}
function chestControls(c){
 return '<p>點選要重擲的骰子，或保留目前結果。</p>'+c.faces.map((f,i)=>'<button aria-pressed="'+c.selected.includes(i)+'" '+(c.spent.includes(i)?'disabled':'onclick="chestInput('+i+')"')+'>'+faceImg('s',f)+esc(skills[f])+'</button>').join('')+(c.selected.length?btn('重擲已選的 '+c.selected.length+' 顆骰子','chestInput(-1)'):'')+btn('保留骰面並開箱','chestInput(-2)')
}
function settleStoryMarkers(a,path,text){
 if(!a||!text)return;
 const compact=text.replace(/\s/g,'');
 const key='marker:'+path;
 if(a.receipts?.[key])return;
 if(/(?:在該命運上|在上面|命運1598[^。；！]*?)(?:添加|放置)(\d+|[一1])個信號標記/.test(compact)){
  const count=Number(compact.match(/(?:添加|放置)(\d+|[一1])個信號標記/)?.[1]?.replace('一','1')||1);
  if(!s.fates.includes(1598)){s.fates.push(1598);(a.revealedCards??=[]).push(1598)}
  s.markers??={};s.markers[1598]=(s.markers[1598]||0)+count;
  (a.receipts??={})[key]='命運 1598 放置 '+count+' 個信號標記（現有 '+s.markers[1598]+' 個）';
  noteDecision('命運 1598 放置 '+count+' 個信號標記（現有 '+s.markers[1598]+' 個）。');return
 }
 if(/(?:獲得(?:該)?任務\s*(?:1706)?|在任務\s*1706上)[^。；！]*?(?:放置第一個標記|放置(\d+|[一1])個標記)/.test(compact)){
  const count=Number(compact.match(/放置(\d+|[一1])個標記/)?.[1]?.replace('一','1')||1);
  if(!s.supply.includes(1706)&&!s.grid.includes(1706)&&!s.reserve.includes(1706)){s.supply.push(1706);(a.revealedCards??=[]).push(1706)}
  s.markers??={};s.markers[1706]=(s.markers[1706]||0)+count;
  (a.receipts??={})[key]='任務 1706 放置 '+count+' 個標記（現有 '+s.markers[1706]+' 個）';
  noteDecision('任務 1706 放置 '+count+' 個標記（現有 '+s.markers[1706]+' 個）。');return
 }
 if(/在此處放置8個標記|任務1635/.test(compact)&&(a.id===1635||compact.includes('1635'))){
  s.markers??={};s.markers[1635]=8;
  (a.receipts??={})[key]='任務 1635 放置 8 個倒數標記';
  noteDecision('任務 1635 放置 8 個倒數標記。');return
 }
 if(/在此處放置4個標記|任務1638/.test(compact)&&(a.id===1638||compact.includes('1638'))){
  s.markers??={};s.markers[1638]=4;
  (a.receipts??={})[key]='任務 1638 放置 4 個遞送標記';
  noteDecision('任務 1638 放置 4 個遞送標記。');return
 }
 if(/此處放置5個標記|任務1643/.test(compact)&&(a.id===1643||compact.includes('1643'))){
  s.markers??={};s.markers[1643]=5;
  (a.receipts??={})[key]='任務 1643 放置 5 個冒險標記';
  noteDecision('任務 1643 放置 5 個冒險標記。');return
 }
 if(/在此處放置一個標記/.test(compact)&&a.id===1634){
  s.markers??={};s.markers[1634]=1;
  (a.receipts??={})[key]='任務 1634 放置 1 個寶箱標記';
  noteDecision('任務 1634 放置 1 個寶箱標記。');return
 }
 if(/添加(\d+|[一1])個標記到任務(\d{4})上/.test(compact)){
  const m=compact.match(/添加(\d+|[一1])個標記到任務(\d{4})上/);
  const count=Number(m[1].replace('一','1')),cid=Number(m[2]);
  s.markers??={};s.markers[cid]=(s.markers[cid]||0)+count;
  (a.receipts??={})[key]='任務 '+cid+' 添加 '+count+' 個標記（現有 '+s.markers[cid]+' 個）';
  noteDecision('任務 '+cid+' 添加 '+count+' 個標記（現有 '+s.markers[cid]+' 個）。');return
 }
 if(/將(\d+|[一1])個標記放置在任務(\d{4})上/.test(compact)){
  const m=compact.match(/將(\d+|[一1])個標記放置在任務(\d{4})上/);
  const count=Number(m[1].replace('一','1')),cid=Number(m[2]);
  s.markers??={};s.markers[cid]=(s.markers[cid]||0)+count;
  (a.receipts??={})[key]='任務 '+cid+' 放置 '+count+' 個標記（現有 '+s.markers[cid]+' 個）';
  noteDecision('任務 '+cid+' 放置 '+count+' 個標記（現有 '+s.markers[cid]+' 個）。');return
 }
 if(/在該使命上放置(\d+|[一12兩])個標記|將(\d+|[一1])個標記放置在此使命上/.test(compact)){
  const count=/2|兩/.test(compact)?2:1;
  s.markers??={};s.markers[1592]=(s.markers[1592]||0)+count;
  (a.receipts??={})[key]='使命 1592 放置 '+count+' 個標記（現有 '+s.markers[1592]+' 個）';
  noteDecision('使命 1592 放置 '+count+' 個標記（現有 '+s.markers[1592]+' 個）。');return
 }
 if(/在任務(\d{4})上獲得(\d+|[一1])個標記/.test(compact)){
  const m=compact.match(/在任務(\d{4})上獲得(\d+|[一1])個標記/);
  const cid=Number(m[1]),count=Number(m[2].replace('一','1'));
  s.markers??={};s.markers[cid]=(s.markers[cid]||0)+count;
  (a.receipts??={})[key]='任務 '+cid+' 獲得 '+count+' 個標記（現有 '+s.markers[cid]+' 個）';
  noteDecision('任務 '+cid+' 獲得 '+count+' 個標記（現有 '+s.markers[cid]+' 個）。');return
 }
 if(/在任務1669上[^。；！]*?放置一個標記/.test(compact)){
  s.markers??={};s.markers[1669]=(s.markers[1669]||0)+1;
  (a.receipts??={})[key]='任務 1669 放置 1 個標記（現有 '+s.markers[1669]+' 個）';
  noteDecision('任務 1669 放置 1 個標記（現有 '+s.markers[1669]+' 個）。');return
 }
 if(/在任務1702上放置1個標記/.test(compact)){
  const count=Math.max(1,(a.diceLog||a.dice||[]).filter(d=>d==='移動').length||1);
  s.markers??={};s.markers[1702]=(s.markers[1702]||0)+count;
  (a.receipts??={})[key]='任務 1702 放置 '+count+' 個標記（現有 '+s.markers[1702]+' 個）';
  noteDecision('任務 1702 放置 '+count+' 個標記（現有 '+s.markers[1702]+' 個）。');return
 }
 if(/在(?:任務|使命|命運|卡牌)\s*(\d{4})上(?:添加|放置|獲得)(\d+|[一1])個標記/.test(compact)){
  const m=compact.match(/在(?:任務|使命|命運|卡牌)\s*(\d{4})上(?:添加|放置|獲得)(\d+|[一1])個標記/);
  const cid=Number(m[1]),count=Number(m[2].replace('一','1'));
  s.markers??={};s.markers[cid]=(s.markers[cid]||0)+count;
  (a.receipts??={})[key]='卡牌 '+cid+' 放置 '+count+' 個標記（現有 '+s.markers[cid]+' 個）';
  noteDecision('卡牌 '+cid+' 放置 '+count+' 個標記（現有 '+s.markers[cid]+' 個）。');return
 }
}
function settleRewards(){
 if(s?.phase!=='result'||s.stats.includes(0)||!s.a)return;
 const a=s.a;
 prepareOceanSeed(a);
 prepareWorkshop581(a);
 resolveBedrollCraft(a);
 if(!a.fishingResolved&&a.event?.startsWith('story:overpower:')&&/根據最終結果中的壓制數量|依最終壓制數量結算/.test(a.text)){
  a.fishingResolved=true;
  const base=a.event==='story:overpower:0063:01'?5:a.event==='story:overpower:1461:01'?4:3;
  const gearBonus={897:2,898:1,899:1,910:1,911:1,912:2,913:1,921:2,932:2};
  const bonus=s.grid.filter(Boolean).reduce((sum,id)=>sum+(gearBonus[id]||0),0);
  const count=base+bonus,op=keys.indexOf('overpower');
  const dice=throwDice('s',count,'捕魚：尋找壓制結果'),hits=dice.filter(f=>f===op).length;
  let reward;
  if(a.event==='story:overpower:1660:01'){
   reward=hits===0?'除了魚的身影之外什麼也沒捕獲到。獲得1點強化。':hits===1?'捕獲一條小而美味的魚。獲得1點生命值。參閱《秘密之書》中的條目1660。':hits===2?'捕獲一條中等大小的魚。獲得2點生命值。參閱《秘密之書》中的條目1660。':'捕獲一條大魚。獲得物品1226。參閱《秘密之書》中的條目1660。';
  }else{
   reward=hits===0?'除了魚的身影之外什麼也沒捕獲到。獲得1點強化。':hits===1?'捕獲一條小而美味的魚。獲得1點生命值。':hits===2?'捕獲一條中等大小的魚。獲得1點生命值和1點強化。':hits===3?'捕獲一條大魚。獲得物品1226。':'捕獲一隻大型怪物。獲得物品1232。';
  }
  const tide=a.event==='story:overpower:0063:01'?'捕魚之後，擲1顆技能骰，並根據結果前往相應的地點：移動（054）；查看（062）；接觸（479）；幫助（449）；獲取（363）；壓制（430）。':'';
  a.text='捕魚擲出'+dice.map(f=>skills[f]).join('、')+'（共 '+hits+' 個壓制）。'+reward+tide;
  noteDecision(a.text);
 }
 if(a.event==='story:take:1034:01'&&!a.package1034Resolved){
  a.package1034Resolved=true;
  if([...s.grid,...s.reserve].includes(1034))discardFedCard(1034);
  const face=throwDice('s',1,'拆卸包裹 1034')[0];
  if(face===0){
   stat(2,-1);
   const dice=throwDice('s',3,'追捕包裹中的昆蟲'),moves=dice.filter(f=>f===0).length;
   s.skill[0]+=moves;
   a.text='包裹擲出移動：大昆蟲劃傷你的肩膀（已扣除1點生命），追捕擲出'+dice.map(f=>skills[f]).join('、')+'。選擇一項：·支付1點移動，捕獲昆蟲：獲得動物1221。·讓昆蟲逃脫：獲得1點強化。';
  }else if(face===1){
   a.text='包裹擲出查看：獲得載具1253。';
  }else if(face===2){
   const skirm=[1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528].filter(id=>!s.reserve.includes(id));
   const pick=skirm.length?skirm[rng(skirm.length)]:1517;
   if(!s.reserve.includes(pick)){s.reserve.push(pick);(a.revealedCards??=[]).push(pick)}
   a.text='包裹擲出接觸：獲得《交鋒》卡牌'+pick+'（已放入儲備區）。';
  }else if(face===3){
   a.text='包裹擲出幫助：獲得植物1056。';
  }else if(face===4){
   a.text='包裹擲出獲取：獲得詛咒1387和$5。';
  }else{
   a.text='包裹擲出壓制：獲得物品1413。';
  }
  noteDecision('拆卸包裹1034（失去物品1034）：'+a.text);
 }
 if(a.event==='story:overpower:1473:01'&&!a.hunt1473Resolved){
  a.hunt1473Resolved=true;
  const face=throwDice('s',1,'狩獵：靈魂石水晶')[0],crystal=1160+face;
  const owned=[...s.grid,...s.reserve,...s.supply].includes(crystal);
  const underwater=(locationCaptions[s.loc]||'').includes('缺氧')||s.loc>=631&&s.loc<=660;
  const curse=underwater?1385:1392;
  a.text='靈魂石發出'+['藍色','紫色','橙色','綠色','黃色','紅色'][face]+'光芒。'+(owned?'你已擁有水晶'+crystal+'，改為獲得詛咒'+curse+'。':'獲得物品'+crystal+'。');
  noteDecision(a.text);
 }
 if(a.event==='story:help:0985:01')upgradeVehicle(a,1010);
 if(duelStoryPrizes[a.event]){
  if(!a.duelDone)a.text=WORLD.stories[a.event][1].split('如果你獲勝')[0].replace('卡牌798放6','卡牌798放').replace(/。6$/,'。')+'請完成對決，再結算勝負結果。';
  else if(typeof a.duelWon==='boolean'&&!a.duelPrizeResolved){
   a.duelPrizeResolved=true;
   a.text=a.duelWon?'你贏得對決。'+duelStoryPrizes[a.event]:'你輸掉了對決，未獲得額外獎勵。';
   delete a.dest;
  }
 }
 if(a.event==='story:overpower:0077:01'&&a.duelDone&&typeof a.duelWon==='boolean'&&!a.towerDuelResolved){
  a.towerDuelResolved=true;
  a.text=a.duelWon?'你贏得對決，智慧生物允許你進入頂層。前往內部078。':'你輸掉了對決。退出至346。繼續。';
  delete a.choice;delete a.paidBranch;delete a.dest;
 }
 if(a.event==='story:overpower:0252:01'&&a.duelDone&&typeof a.duelWon==='boolean'&&!a.falconDuelResolved){
  a.falconDuelResolved=true;
  a.text=a.duelWon?'你贏得了對決。選擇一項：·接受骨髓禿鷹（826，附帶1點強化）：獲得動物826。這隻動物附帶1點強化。·邀請馴鷹者同行（1331）：獲得智慧生物1331。':'你輸掉了對決，未獲得馴鷹者的獎勵。';
  delete a.choice;delete a.paidBranch;
 }
 if(a.event==='story:help:0586:01'&&!a.barricadeResolved&&Number.isInteger(a.effort)){
  a.barricadeResolved=true;
  a.text='你建立路障，趁機取得附近的戒指。獲得物品995。'+(a.effort>=4?'門維持開啟，讓你再取得一件物品。獲得物品916。':'')+'向北退出至687。';
 }
 if(a.event==='story:help:0585:01'&&!a.barricadeResolved&&Number.isInteger(a.effort)){
  a.barricadeResolved=true;
  a.text='你建立路障，趁機取得附近的鑰匙。獲得物品996。'+(a.effort>=4?
   '門維持開啟，讓你再取得一件物品。選擇一項：·取得書本（1044）：獲得物品1044。向北退出至681。·取得小刀（1209）：獲得物品1209。向北退出至681。':
   '向北退出至681。');
 }
 if(['story:look:0715:01','story:move:0715:01','story:help:0715:01'].includes(a.event)&&a.text===WORLD.stories[a.event][1]){
  const face=throwDice('s',1,'靈魂守護者選擇水晶')[0];
  a.soulStoneFace=face;
  const crystal=1160+face;
  const owned=[...s.grid,...s.reserve,...s.supply].includes(crystal);
  const reward=a.event==='story:help:0715:01'&&owned?'你已有相同水晶，守護者向你說明它的用法。獲得2點'+skills[face]+'。':'獲得物品'+crystal+'。';
  a.text='靈魂守護者為你挑選靈魂石。技能骰擲出'+['藍色','紫色','橙色','綠色','黃色','紅色'][face]+'。'+reward
 }
 if(a.event==='story:take:0142:01'&&a.text===WORLD.stories[a.event][1]){
  const available=[1299,1300,1301,1302,1303,1304].filter(id=>!s.grid.includes(id)&&!s.reserve.includes(id));
  a.text=available.length?'你在飛船上找到一件基本物品。獲得物品'+available[rng(available.length)]+'。':'基本物品已全數取走。你使用營養艙。獲得1點生命值。'
 }
 if(heatBeforeRouteEvents.has(a.event)&&!a.chest&&!a.receipts?.hazard){
  const guard=s.grid.find(id=>[965,966,967,984,1453].includes(id));
  if(guard)(a.receipts??={}).hazard='卡牌 '+guard+' 忽略了這次高溫傷害';
  else a.chest={done:true,hazard:'高溫'}
 }
 if(a.event==='story:engage:0265:01')a.text=a.coinsPaid>0?'賞金獵人釋放了俘虜。獲得智慧生物1314。':'獲得2點幫助。繼續。';
 if(settleChest(a))return;resolveSpiderAmbush(a);resolveDepartureMorale(a);resolveWaterBadgeGate(a);resolveAnimalFood(a);resolveServiceIncome(a);resolveMissionChange(a);restoreConstructionChoice(a);repairPassage(a);resolveResidence(a);resolvePrintedResponse(a);
 if(a.id===453&&a.name==='劫掠鑄造廠'&&!a.foundryDice){
  a.foundryDice=throwDice('s',5,'劫掠鑄造廠：取得移動骰面');
  const move=keys.indexOf('move'),gained=a.foundryDice.filter(face=>face===move).length;
  const guard=s.grid.find(id=>[965,966,967,984,1453].includes(id));
  if(guard)(a.receipts??={}).hazard='卡牌 '+guard+' 忽略了這次高溫傷害';
  else a.chest={done:true,hazard:'高溫'};
  s.skill[move]+=gained;
  (a.receipts??={}).foundryDice='技能骰：'+a.foundryDice.map(face=>skills[face]).join('、')+'。取得 '+gained+' 點移動'
 }
 if(a.event==='story:engage:1579:01'&&!a.receipts?.heroBoost){
  const hero=s.grid[4],current=s.boost[hero]||0;
  const gain=Math.min(6,Math.max(0,cards[hero].cap-current));
  s.boost[hero]=current+gain;
  (a.receipts??={}).heroBoost=gain?'角色獲得'+gain+'點強化':'角色的強化已滿'
 }
 const {parts,branched,shown}=storyParts(a.text,a.choice);
 if(['story:move:0747:01','story:depart:0486:03','story:look:0210:01','story:overpower:0642:01','story:overpower:0607:01'].includes(a.event))settleLosses(parts[0],a);
 if(a.kind==='地點'&&['story:engage:0187:01','story:overpower:0231:01','story:take:0128:01'].includes(a.event))closeArtifactLocation(a.id);
 const sources=[];
 function collect(path,parts,branched,choice,shown){
  if(!branched){if(!/[·•●]/.test(shown))sources.push([path,shown]);return}
  sources.push([path,parts[0]]);
  if(choice!=null){if(branchTerms(parts[choice])===null||Object.keys(branchTerms(parts[choice])).length&&(path==='a'?a.paidBranch:a.paidReadings?.[path+'choice'])!==choice)return;let selected=parts[choice].slice(1);let colon=selected.search(/[：:]/);if(colon>=0){const label=selected.slice(0,colon),body=selected.slice(colon+1);
   const bodyRewards=directRewards(body);
   const missing=directRewards(label).filter(reward=>!bodyRewards.some(existing=>reward.card?existing.card===reward.card:existing.kind===reward.kind&&existing.delta===reward.delta));
   selected=missing.map(reward=>reward.label+'。').join('')+body}sources.push([path+'c'+choice,selected])}
 }
 const vision=a.text.replace(/\s/g,'').match(/[擲挪]([X義3])顆技能[骰般]。從結果中選擇並獲得1種類型的所有技能/);
 if(!a.skillFaces&&vision){
  const count=vision[1]==='3'?3:a.effort;
  if(Number.isInteger(count)&&count>=0)a.skillFaces=count?throwDice('s',count,'擲技能骰，選擇一種結果'):[]
 }

 if(!branched||a.choice!=null)settleLosses(resultText(),a);
 collect('a',parts,branched,a.choice,shown);
 if(!branched||a.choice!=null)storyRefs(shown,storySource(a),a.reading||{},'a',[],[],collect);
 for(const [path,text] of sources)settleTravelDice(a,path,text);
 const legacy=listedEffects(shown),claimed=new Set();
 for(const [path,t] of sources)for(const [i,e] of directRewards(t).entries()){
  // Occupied residences grant the curse on entry, including in older result saves.
  if(a.residenceResolved&&e.type==='詛咒'&&a.revealedCards?.includes(e.card))continue;
  if(a.routeRoll?.ocean&&e.kind==='隨機技能'&&/隨機技能，?(?:並|然後)(?:前往|退出至)/.test(t.replace(/\s/g,'')))continue;
  const key=path+':'+i,already=a.receipts?.[key];
  const old=path==='a'||/^ac\d+$/.test(path)?legacy.findIndex((x,j)=>!claimed.has(j)&&(e.card?x.card===e.card:x.kind===e.kind&&x.delta===e.delta)):-1;
  if(old>=0)claimed.add(old);
  if(!already){
   if(!(old>=0&&a.applied?.includes(old)))creditReward(e,a);
   (a.receipts??={})[key]=e.label
  }
  if(old>=0&&!a.applied?.includes(old))(a.applied??=[]).push(old)
 }
 for(const [path,t] of sources){
  settleStoryMarkers(a,path,t);
  const m=t.replace(/\s/g,'').match(/旋轉(?:並添加)?(?:此)?任務(\d{4})?(?:並將其|到你的)?(?:添加到你的)?網格中/);
  if(!m)continue;
  const qid=Number(m[1])||([a.id,...(a.revealedCards||[]),...s.supply].find(id=>id>=1630&&id<=1706));
  if(qid&&!a.rotatedQuest){
   a.rotatedQuest=qid;
   if(s.supply.includes(qid))s.supply.splice(s.supply.indexOf(qid),1);
   if(!s.grid.includes(qid)&&!s.reserve.includes(qid)&&!(s.unplaced||[]).includes(qid))(s.unplaced??=[]).push(qid);
   (a.receipts??={}).rotateQuest='任務 '+qid+' 已旋轉並加入網格';
   noteDecision('旋轉任務 '+qid+' 並加入網格。');
  }
 }
}
function rewardReceipt(a){const rows=Object.values(a.receipts||{});return rows.length?'<p class="rewardReceipt" role="status">已入帳　'+rows.map(esc).join('、')+'</p>'+cardShelf(revealCards(a),'本次取得'):cardShelf(revealCards(a),'本次取得')}
function checkGridMilestone(){
 if(s.full||!s.grid.every(Boolean))return;
 s.full=true;if(!s.fates.includes(1705))s.fates.push(1705);if(s.a){(s.a.revealedCards??=[]).push(1705)}else s.gridFateNotice=true;
 notice='首次填滿網格，獲得命運 1705。'
}
function gridAdjacentSlots(i){
 const r=Math.floor(i/3),c=i%3,res=[];
 if(r>0)res.push((r-1)*3+c);
 if(r<2)res.push((r+1)*3+c);
 if(c>0)res.push(r*3+c-1);
 if(c<2)res.push(r*3+c+1);
 return res;
}
function fillAcquiredCards(){
 if(!s?.grid)return;
 const mapIds=[1251,1252,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264];
 for(const mid of mapIds){
  if(s.grid.includes(mid)&&s.boost[mid]==null){
   const idx=s.grid.indexOf(mid);
   const adjCount=gridAdjacentSlots(idx).filter(j=>s.grid[j]&&j!==idx).length;
   s.boost[mid]=Math.min(cards[mid]?.cap||3,adjCount);
  }
 }
 // Earlier saves may have stopped between claiming a conditional reward and placing it.
 if(s.pendingCard&&s.a){
  const {n,index}=s.pendingCard;
  if(!s.a.applied?.includes(index)&&cards[n]){creditReward({card:n,label:s.a.effects?.[index]?.label||''},s.a);(s.a.applied??=[]).push(index)}
  s.pendingCard=null
 }
 while(s.unplaced?.length){
  const n=s.unplaced[0],slot=s.grid.findIndex((v,i)=>!v&&i!==4);
  if(s.grid.includes(n)||s.reserve.includes(n)||s.supply.includes(n)||s.fates.includes(n)){s.unplaced.shift();continue}
  if(slot<0)break;
  s.unplaced.shift();s.grid[slot]=n;
  let initBoost=cards[n].initial;
  if(s.a?.customInitBoost?.[n]!=null)initBoost=s.a.customInitBoost[n];
  else if(mapIds.includes(n))initBoost=gridAdjacentSlots(slot).filter(idx=>s.grid[idx]&&idx!==slot).length;
  else if(n===1013&&(s.a?.workshop581Product===1013||['story:take:0381:01','story:engage:0381:01'].includes(s.a?.event)))initBoost=1;
  else if(n===826&&['story:engage:0252:01','story:move:0252:01','story:overpower:0252:01'].includes(s.a?.event))initBoost=1;
  s.boost[n]=Math.min(initBoost,cards[n].cap);
  s.log.push('卡牌 '+n+' 已放入網格 '+(slot+1)+(mapIds.includes(n)?'（獲得 '+s.boost[n]+' 點相鄰強化）':''));checkGridMilestone()
 }
}
function makeRoom(n,i){
 if(s.unplaced?.[0]!==n||s.grid.includes(0)||i===4||!s.grid[i])return;
 const old=s.grid[i];for(const q of cards[old].slots)delete s.occupied[q.uid];
 s.reserve.push(old);s.grid[i]=0;save()
}
function placementChoices(){
 const n=s.unplaced?.[0];if(!n)return '';
 return '<fieldset><legend>網格已滿 · 新卡 '+n+'</legend>'+flowCard(n,'新取得')+btn('將新卡放入儲備','reserveNew('+n+')')+
 '<p>或選一張原有卡移入儲備，新卡會放進騰出的格子。</p>'+s.grid.map((v,i)=>i!==4?flowCard(v,'可移入儲備')+btn('儲備 '+v+'（格 '+(i+1)+'）','makeRoom('+n+','+i+')'):'').join('')+'</fieldset>'
}
