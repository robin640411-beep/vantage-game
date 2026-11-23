const {chromium}=require('/Users/robin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const p=await b.newPage({viewport:{width:375,height:812},isMobile:true}), errors=[];
 p.on('pageerror',e=>errors.push(String(e)));
 await p.goto(require('node:url').pathToFileURL(require('node:path').resolve(__dirname,'../../dist/index.html')).href);
 await p.getByRole('button',{name:'開始探險'}).click();
 await p.evaluate(()=>{if(s.phase==='mission')confirmMission();escapePod();if(s.phase==='crash')land();diceTray.close();});
 for(const [entrance,layout,win] of [[1,null,false],[2,null,true],[3,null,false],[1,[[2,1,0],[1,0,2],[0,2,1],[1,0,2]],true],[3,[[2,1,0],[1,0,2],[0,2,1],[0,1,2]],true]]){
 await p.evaluate(()=>{const event='story:look:0125:01',r=stories[event];s.loc=125;s.closedArtifactLocations=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.a={id:125,event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();selectBranch(2);});
 assert.equal(await p.locator('.lavaBoard button').count(),12);
 if(entrance===1&&!layout){await p.evaluate(()=>diceTray.close());await p.locator('.lavaBoard').screenshot({path:'/tmp/wan-lava-mobile.png'});}
 assert.doesNotMatch(await p.locator('#app').innerText(),/答案：|如果你選擇了隧道2/);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 await p.evaluate(()=>{finish();pickLavaTile(0,0);pickLavaTile(0,1)});await p.reload();
 assert.deepEqual(await p.evaluate(()=>s.a.lavaLayout[0]),[1,0,2]);
 await p.evaluate(()=>{pickLavaTile(0,0);pickLavaTile(0,1)});
 if(layout)for(let r=0;r<4;r++)for(let c=0;c<3;c++){
  const at=await p.evaluate(({r,value})=>s.a.lavaLayout[r].indexOf(value),{r,value:layout[r][c]});
  if(at!==c){await p.getByRole('button',{name:'第'+(r+1)+'行第'+(c+1)+'格',exact:true}).click();await p.getByRole('button',{name:'第'+(r+1)+'行第'+(at+1)+'格',exact:true}).click();}
 }
 await p.evaluate(()=>{throwDice=()=>[0,1]});
 await p.getByRole('button',{name:'從隧道 '+entrance+' 進入',exact:true}).click();await p.reload();
 assert.equal(await p.evaluate(()=>s.a.lavaOutcome.success),win);
 assert.equal(await p.evaluate(()=>s.closedArtifactLocations.includes(125)),win);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===998).length),win?1:0);
 assert.deepEqual(await p.evaluate(()=>s.skill),win?[0,0,0,0,0,0]:[1,1,0,0,0,0]);
 assert.equal(await p.evaluate(()=>s.loc),125);
 await p.evaluate(()=>enterLavaTunnel(2));assert.equal(await p.evaluate(()=>s.a.lavaOutcome.entrance),entrance);
 }
 assert.deepEqual(errors,[]);console.log('125 解謎：官方入口、兩條替代道路、兩個失敗入口、同行交換、重載與一次結算通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
