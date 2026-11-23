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
 for(const full of [false,true]){
 await p.evaluate(full=>{s.loc=581;s.used=[];s.grid=full?[1305,1306,1307,1308,s.grid[4],1309,1310,1040,1311]:s.grid.map((v,i)=>i===4?v:i===7?1040:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,6,0,0];s.stats=[4,4,4];s.boost[1040]=2;s.markers[1040]=1;s.occupied={};for(const q of cards[1040].slots)s.occupied[q.uid]='時間';s.phase='ready';save();choose(actions().findIndex(a=>a.event==='story:help:1040:01'));},full);
 const cost=await p.evaluate(()=>s.a.cost);await p.locator('#pay').selectOption(String(cost));await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.grid[7]),929);
 assert.equal(await p.evaluate(()=>s.grid.includes(1040)),false);
 assert.equal(await p.evaluate(()=>s.boost[1040]),undefined);
 assert.equal(await p.evaluate(()=>s.markers[1040]),undefined);
 assert.equal(await p.evaluate(()=>cards[1040].slots.some(q=>q.uid in s.occupied)),false);
 assert.equal(await p.evaluate(()=>s.unplaced.length),0);
 const boost=await p.evaluate(()=>s.boost[929]);await p.reload();assert.equal(await p.evaluate(()=>s.boost[929]),boost);
 }
 assert.deepEqual(errors,[]);console.log('1040 改造為929：空槽／滿槽、原位置、舊標記清理與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
