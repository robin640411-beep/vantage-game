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
 for(const choice of [1,2]){
 await p.evaluate(()=>{s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[7]=954;s.boost[954]=2;s.occupied={};for(const q of cards[954].slots)s.occupied[q.uid]='時間';s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,6,0,0];s.stats=[4,4,4];s.phase='ready';save();const i=actions().findIndex(a=>a.event==='story:help:0954:01');if(i<0)throw Error('missing craft action');choose(i);});
 const cost=await p.evaluate(()=>s.a.cost);await p.locator('#pay').selectOption(String(cost));await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(957)),choice===1);
 assert.equal(await p.evaluate(()=>s.grid.includes(954)),choice===2);
 assert.equal(await p.evaluate(()=>s.grid[7]),choice===1?957:954);
 if(choice===1)assert.equal(await p.evaluate(()=>cards[954].slots.some(q=>q.uid in s.occupied)),false);
 else assert.equal(await p.evaluate(()=>s.boost[954]),3);
 }
 assert.deepEqual(errors,[]);console.log('954 改造與保留兩條路線、原槽位替換與舊骰槽清理通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
