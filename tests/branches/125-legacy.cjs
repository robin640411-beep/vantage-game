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
 for(const mode of ['pending','paid','credited']){
 await p.evaluate(mode=>{const event='story:look:0125:01',r=stories[event];s.loc=125;s.closedArtifactLocations=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.boost[s.grid[4]]=4;s.a={id:125,event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[],choice:mode==='paid'?1:2};s.phase='result';if(mode==='credited'){s.a.receipts={'ar0:0':'獲得2點隨機技能'};s.skill=[1,1,0,0,0,0]}if(mode==='paid'){s.a.paidBranch=1;s.a.receipts={'ac1:0':'獲得物品998'};s.a.revealedCards=[998];s.grid[0]=998;s.boost[s.grid[4]]=0;s.closedArtifactLocations=[125]}localStorage.setItem(slotKey,JSON.stringify(s));},mode);
 await p.reload();
 assert.equal(await p.locator('.lavaBoard').count(),mode==='pending'?1:0);
 assert.deepEqual(await p.evaluate(()=>s.skill),mode==='credited'?[1,1,0,0,0,0]:[0,0,0,0,0,0]);
 if(mode==='pending'){
  assert.doesNotMatch(await p.locator('#app').innerText(),/如果你選擇了隧道2/);
  await p.evaluate(()=>enterLavaTunnel(2));await p.reload();
  assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===998).length),1);
 }else if(mode==='paid')assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===998).length),1);
 await p.reload();assert.equal(await p.locator('.lavaBoard').count(),0);
 }
 assert.deepEqual(errors,[]);console.log('125 舊存檔：未完成解謎遷移、已付費與已入帳結果不重開或重發通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
