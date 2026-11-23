const duelCards=[
 [5,3,4],[11,0,2],[10,1,0],[6,4,5],[1,2,3],[2,5,4],
 [8,4,1],[12,0,3],[3,2,5],[7,3,1],[4,5,2],[9,1,0]
];
function duelDeck(){return duelCards.map((_,i)=>1517+i).filter(n=>!s.reserve.includes(n)&&!s.grid.includes(n))}
function sixSkills(){return Array.from({length:6},()=>rng(6))}
function beginDuel(){
 if(s.duel)return duelView();
 if(!canDuel())return;
 if(!s.fates.includes(1603)&&!s.hasDueled)s.fates.push(1603);
 let first=!s.hasDueled;s.hasDueled=true;let deck=duelDeck(),reward=0;if(deck.length){reward=deck[rng(deck.length)];s.reserve.push(reward)}
 if(s.a){s.a.revealedCards=[...new Set([...(s.a.revealedCards||[]),reward,first?1603:0].filter(Boolean))]}
 s.duel={first,reward,mine:sixSkills(),opponent:sixSkills()};save();duelView();cast("s",[...s.duel.mine,...s.duel.opponent],"交鋒 · 前六顆為你的技能骰")
}
function duelView(){let d=s.duel;if(!d)return;
 let mine=s.reserve.concat(s.grid).filter(n=>n>=1517&&n<=1528);
 let info='<h2>交鋒 · 快速對決</h2><p>你的技能骰　'+d.mine.map(i=>skills[i]).join('、')+'</p><p>對手技能骰　'+d.opponent.map(i=>skills[i]).join('、')+'</p>';
 if(!d.player){show(info+'<p>選擇出戰牌，計算兩種卡面技能的相符骰數。速度較高者可重擲全部自己的骰子一次；相符數平手時，速度較低者勝。</p>'+cardShelf([d.reward,...mine],'你的交鋒收藏')+(d.first?flowCard(1603,'首次交鋒取得的命運'):'')+'<label>出戰牌 '+select('duelist',mine.map(n=>opt(n,n+' · '+cards[n].name.split(/[：:]/)[0])).join(''))+'</label>'+btn('揭曉對手','revealDuel()',true));return}
 let [p,o]=[d.player,d.foe].map(n=>duelCards[n-1517]);let count=(dice,card)=>dice.filter(f=>card.slice(1).includes(f)).length;
 let a=count(d.mine,p),b=count(d.opponent,o);d.win=a>b||(a===b&&p[0]<o[0]);
 const mayReroll=p[0]>o[0]&&!d.rerolled;
 if(!mayReroll&&d.win&&!d.credited){s.money+=2;d.credited=true;save()}
 show(info+flowCard(d.player,'你的出戰牌')+flowCard(d.foe,'對手出戰牌')+(d.credited?'<p>已入帳　2 錢幣</p>':'')+'<p>你的牌 '+d.player+'（速度 '+p[0]+'）　對手 '+d.foe+'（速度 '+o[0]+'）</p><h3>相符骰數　'+a+' 比 '+b+'</h3>'+(p[0]>o[0]&&!d.rerolled?btn('重擲自己的全部技能骰','s.duel.mine=sixSkills();s.duel.rerolled=true;save();duelView();cast("s",s.duel.mine,"交鋒重擲")'):'')+btn(mayReroll?'保留骰面並結束對決':'返回探險','closeDuel()',true))
}
function revealDuel(){let d=s.duel;if(!d||d.player)return;let player=+val('duelist');if(![...s.reserve,...s.grid].includes(player)||player<1517||player>1528)return;let deck=duelDeck().filter(n=>n!==player);if(!deck.length)deck=duelCards.map((_,i)=>1517+i).filter(n=>n!==player);d.player=player;const fixed=Number(resultText().replace(/\s/g,'').match(/對手使用卡牌(15(?:1[7-9]|2[0-8]))/)?.[1]);d.foe=fixed||deck[rng(deck.length)];tripEvent('交鋒出戰','選擇卡牌 '+d.player+'，對手揭曉 '+d.foe+'。');save();duelView()}
function closeDuel(){let d=s.duel;if(!d?.player||!d.foe)return;if(d.win){s.duelWins=(s.duelWins||0)+1;s.markers[1603]=s.duelWins}if(d.win&&!d.credited)s.money+=2;tripEvent('交鋒結果',d.win?'獲勝，獲得 2 錢幣。':'落敗。');s.log.push('交鋒快速對決：'+(d.win?'獲勝，獲得 2 錢幣':'落敗'));s.duel=null;if(s.a){s.a.duelDone=true;s.a.duelWon=Boolean(d.win);}viewer.close();save()}
