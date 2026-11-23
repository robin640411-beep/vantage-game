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
 for(const [choice,target] of [[1,948],[2,982]]){
 await p.evaluate(()=>{s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[7]=874;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,5,0,0];s.stats=[4,4,4];s.boost[874]=0;s.phase='ready';save();});
 assert.equal(await p.evaluate(()=>actions().some(a=>a.event===batteryCraftEvent)),false);
 await p.evaluate(()=>{s.boost[874]=2;save();choose(actions().findIndex(a=>a.event===batteryCraftEvent))});
 assert.equal(await p.evaluate(()=>s.a.cost),5);
 await p.locator('#pay').selectOption('5');await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.evaluate(()=>s.boost[874]),1);await p.reload();assert.equal(await p.evaluate(()=>s.boost[874]),1);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.grid[7]),target);assert.equal(await p.evaluate(()=>s.grid.includes(874)),false);
 assert.equal(await p.evaluate(()=>s.a.circuitBoostPaid),true);
 }
 assert.deepEqual(errors,[]);console.log('874 兩種製作結果、1強化額外費用、費用5與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
