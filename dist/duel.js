const duelCards=[
 [5,3,4],[11,0,2],[10,1,0],[6,4,5],[1,2,3],[2,5,4],
 [8,4,1],[12,0,3],[3,2,5],[7,3,1],[4,5,2],[9,1,0]
];
function duelDeck(){return duelCards.map((_,i)=>1517+i).filter(n=>!s.reserve.includes(n)&&!s.grid.includes(n))}
function sixSkills(){return Array.from({length:6},()=>rng(6))}
function beginDuel(){
 if(s.duel)return duelView();
 if(!s.fates.includes(1603)&&!s.hasDueled)s.fates.push(1603);
 s.hasDueled=true;let deck=duelDeck();if(deck.length){let reward=deck[rng(deck.length)];s.reserve.push(reward)}
 s.duel={mine:sixSkills(),opponent:sixSkills()};save();duelView()
}
function duelView(){let d=s.duel;if(!d)return;
 let mine=s.reserve.concat(s.grid).filter(n=>n>=1517&&n<=1528);
 let info='<h2>交鋒 · 快速對決</h2><p>你的技能骰　'+d.mine.map(i=>skills[i]).join('、')+'</p><p>對手技能骰　'+d.opponent.map(i=>skills[i]).join('、')+'</p>';
 if(!d.player){show(info+'<label>出戰牌 '+select('duelist',mine.map(n=>opt(n,n+' · '+cards[n].name.split(/[：:]/)[0])).join(''))+'</label><label>對手 '+select('foe',opt(0,'從劇透包隨機抽牌')+duelCards.map((_,i)=>opt(i+1517,'條目指定 '+(1517+i))).join(''))+'</label>'+btn('揭曉對手','revealDuel()',true));return}
 let [p,o]=[d.player,d.foe].map(n=>duelCards[n-1517]);let count=(dice,card)=>dice.filter(f=>card.slice(1).includes(f)).length;
 let a=count(d.mine,p),b=count(d.opponent,o);d.win=a>b||(a===b&&p[0]<o[0]);
 show(info+'<p>你的牌 '+d.player+'（速度 '+p[0]+'）　對手 '+d.foe+'（速度 '+o[0]+'）</p><h3>相符骰數　'+a+' 比 '+b+'</h3>'+(p[0]>o[0]&&!d.rerolled?btn('重擲自己的全部技能骰','s.duel.mine=sixSkills();s.duel.rerolled=true;save();duelView()'):'')+btn(d.win?'領取 2 錢幣並結束對決':'結束對決','closeDuel()',true))
}
function revealDuel(){let d=s.duel,player=+val('duelist'),specified=+val('foe');if(player===specified)return;let deck=duelDeck().filter(n=>n!==player);if(!deck.length)deck=duelCards.map((_,i)=>1517+i).filter(n=>n!==player);d.player=player;d.foe=specified||deck[rng(deck.length)];save();duelView()}
function closeDuel(){let d=s.duel;if(!d)return;if(d.win)s.money+=2;s.log.push('交鋒快速對決：'+(d.win?'獲勝，獲得 2 錢幣':'落敗'));s.duel=null;if(s.a)s.a.duelDone=true;viewer.close();save()}
