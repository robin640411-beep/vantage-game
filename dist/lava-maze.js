// Card 532: source-image rectangles, top movable row first. The entrance row is fixed.
const lavaTileColumns=[[32,169],[181,317],[321,463]];
const lavaTileRows=[[209,310],[310,411],[411,510],[510,608]];
function newLavaLayout(){return Array.from({length:4},()=>[0,1,2])}
function validLavaLayout(layout){return Array.isArray(layout)&&layout.length===4&&layout.every(row=>Array.isArray(row)&&row.length===3&&[...row].sort().join(',')==='0,1,2')}
function exchangeLavaTiles(layout,row,left,right){
 if(!validLavaLayout(layout)||!Number.isInteger(row)||row<0||row>3||![left,right].every(n=>Number.isInteger(n)&&n>=0&&n<=2))return null;
 const next=layout.map(r=>r.slice());[next[row][left],next[row][right]]=[next[row][right],next[row][left]];return next
}
function lavaTileImage(row,column){
 const [x0,x1]=lavaTileColumns[column],[y0,y1]=lavaTileRows[row];
 return '<svg viewBox="'+[x0,y0,x1-x0,y1-y0].join(' ')+'" role="img" aria-label="道路方塊"><image href="cards/532.webp" width="500" height="750"/></svg>'
}
function lavaBoardMarkup(layout){
 if(!validLavaLayout(layout))return '';
 return '<div class="lavaBoard"><p>目標：左上方的神器。每次點選同一橫行的兩個方塊來交換位置；不能旋轉或跨行移動。</p>'+layout.map((row,r)=>'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">'+row.map((original,c)=>'<button style="min-width:0;padding:0" aria-label="第'+(r+1)+'行第'+(c+1)+'格" onclick="pickLavaTile('+r+','+c+')">'+lavaTileImage(r,original)+'</button>').join('')+'</div>').join('')+'<svg viewBox="30 608 434 137" role="img" aria-label="固定入口：隧道一、二、三"><image href="cards/532.webp" width="500" height="750"/></svg></div>'
}
// Each pair is a continuous road. Crossings in the illustration are overpasses, not junctions.
const lavaRoads=[
 [['N0W0'],['N0W0','E0S0','W1S1'],['N0E1','S0E0']],
 [['N0W1','N1S1','W0E0'],['N0E0','S1E1'],['W0S0']],
 [['S0E0','N1E1'],['N0W0','W1S0'],['N1S0']],
 [['N0S0','W0E0','W1E1'],['N0E0','S1E1'],['N0W1','W0S1']],
 [['N1E0','S0E1'],['N0W1','W0S1'],['N1S0']]
];
function lavaConnected(layout,entrance){
 if(!validLavaLayout(layout)||![1,2,3].includes(entrance))return false;
 const start='4,'+(entrance-1)+','+(entrance===2?'S1':'S0'),queue=[start],seen=new Set();
 const opposite={N:'S',S:'N',W:'E',E:'W'},delta={N:[-1,0],S:[1,0],W:[0,-1],E:[0,1]};
 while(queue.length){
  const key=queue.pop();if(seen.has(key))continue;seen.add(key);
  const [rs,cs,port]=key.split(','),r=Number(rs),c=Number(cs),roads=lavaRoads[r][r===4?c:layout[r][c]];
  for(const road of roads){const ends=[road.slice(0,2),road.slice(2)];if(ends.includes(port))for(const end of ends)queue.push(r+','+c+','+end)}
  if(r===0&&c===0&&port[0]==='N')return true;
  const [dr,dc]=delta[port[0]],rr=r+dr,cc=c+dc,other=opposite[port[0]]+port[1];
  if(rr<0||rr>4||cc<0||cc>2)continue;
  const neighbor=lavaRoads[rr][rr===4?cc:layout[rr][cc]];
  if(neighbor.some(road=>road.slice(0,2)===other||road.slice(2)===other))queue.push(rr+','+cc+','+other);
 }
 return false
}
function lavaPending(){return s.phase==='result'&&s.a?.event==='story:look:0125:01'&&s.a.lavaLayout&&!s.a.lavaOutcome}
function pickLavaTile(row,column){
 if(!activePlayer()||!lavaPending()||!Number.isInteger(row)||row<0||row>3||!Number.isInteger(column)||column<0||column>2)return;
 const a=s.a,previous=a.lavaSelected;
 if(previous&&previous[0]===row){a.lavaLayout=exchangeLavaTiles(a.lavaLayout,row,previous[1],column);delete a.lavaSelected}
 else a.lavaSelected=[row,column];
 save()
}
function enterLavaTunnel(entrance){
 if(!activePlayer()||!lavaPending()||![1,2,3].includes(entrance))return;
 const a=s.a,connected=lavaConnected(a.lavaLayout,entrance),success=entrance===2||connected;
 a.lavaOutcome={entrance,connected,success};delete a.lavaSelected;
 noteDecision('選擇熔岩隧道 '+entrance+'，'+(success?'成功抵達神器。':'未能抵達神器。'));
 if(success){closeArtifactLocation(125);a.text='你成功穿過熔岩迷宮。獲得物品998。不能在此處執行其他地點行動。你仍位於地點125。'}
 else a.text='這條道路未能通往神器。獲得2點隨機技能。你仍位於地點125。';
 delete a.choice;save()
}
function lavaPuzzlePanel(a){
 const selected=a.lavaSelected;
 return '<div class="storyMessage"><h2>熔岩迷宮</h2>'+lavaBoardMarkup(a.lavaLayout)+(selected?'<p>已選第 '+(selected[0]+1)+' 行第 '+(selected[1]+1)+' 格，請點選同一行的另一格。</p>':'')+'<p>決定道路後，選擇要進入的隧道：</p>'+[1,2,3].map(n=>btn('從隧道 '+n+' 進入','enterLavaTunnel('+n+')')).join('')+'</div>'
}
function restoreLegacyLavaPuzzle(){
 const a=s?.a;
 if(s?.phase!=='result'||a?.event!=='story:look:0125:01'||a.choice!==2||a.lavaLayout||a.lavaOutcome)return;
 // Only migrate the old unresolved offer; never infer a fresh attempt from a completed result.
 if(!/熔岩迷宮/.test(a.text)||!a.text.includes('532'))return;
 const credited=Object.values(a.receipts||{}).some(v=>/998|2點隨機技能/.test(String(v)))||a.revealedCards?.includes(998)||a.applied?.length;
 if(credited){a.lavaOutcome={legacy:true};return}
 a.lavaLayout=newLavaLayout();a.text='排列熔岩迷宮的道路，然後選擇入口。';delete a.choice;delete a.reading;
}
