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
 await p.evaluate(()=>{const event='story:overpower:0518:01',r=stories[event];s.loc=518;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[1517];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id:518,event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 assert.equal(await p.evaluate(()=>s.stats[1]),4);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.stats[1]),choice===1?6:4);
 assert.equal(await p.locator('button[onclick="beginDuel()"]').count(),choice===2?1:0);
 if(choice===2){
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 await p.getByRole('button',{name:'進入交鋒快速對決'}).click();await p.evaluate(()=>diceTray.close());await p.locator('#duelist').selectOption('1517');await p.evaluate(()=>revealDuel());assert.equal(await p.evaluate(()=>s.duel.foe),1518);
 await p.evaluate(()=>{s.duel.win=false;closeDuel();});
 }
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),518);
 }
 assert.deepEqual(errors,[]);console.log('518 協助與交鋒兩條路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
