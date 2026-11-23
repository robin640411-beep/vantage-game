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
 for(const id of [873,962,1128,1253,1409])for(const choice of [1,2,3])for(const craft of (id===1409?[0]:[0,1,2])){
 await p.evaluate(({id,craft})=>{const event=id===873?'story:overpower:0873:recovered:0204':'story:overpower:'+String(id).padStart(4,'0')+':01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[977];if(craft||id===1409)s.grid[0]=1180;s.unplaced=[];s.supply=[];s.boost[977]=0;s.skill=[0,0,0,0,0,0];s.occupied={};const q=cards[s.grid[4]].slots[0];s.occupied[q.uid]='生命';s.a={id,event,kind:'物品',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{id,craft});
 assert.equal(await p.evaluate(()=>s.skill[1]),0);
 await p.evaluate(choice=>selectBranch(choice,choice===3?977:0),choice);
 await p.reload();
 assert.equal(await p.evaluate(()=>s.skill[1]),choice===2?1:0);
 assert.equal(await p.evaluate(()=>Object.keys(s.occupied).length),choice===1?0:1);
 assert.equal(await p.evaluate(()=>s.boost[977]),choice===3?1:0);
 if(craft)assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 if(craft)await p.evaluate(craft=>selectBranch(craft),craft);await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1180)),craft===2||id===1409);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1084)),craft===1);
 assert.equal(await p.evaluate(()=>s.skill[1]),choice===2?1:0);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),1);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),0);
 }
 assert.deepEqual(errors,[]);console.log('873、962、1128、1253、1409 火焰分支 39 種組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
