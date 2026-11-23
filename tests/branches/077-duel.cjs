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
 for(const outcome of ['loss','win']){
 await p.evaluate(()=>{const event='story:overpower:0077:01',r=stories[event];s.loc=77;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[1517];s.unplaced=[];s.supply=[];s.stats=[4,4,4];delete s.boost[826];s.a={id:77,event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();selectBranch(3);});
 assert.equal(await p.locator('button[onclick^="chooseRoute("]').count(),0);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 await p.getByRole('button',{name:'進入交鋒快速對決'}).click();await p.evaluate(()=>diceTray.close());
 await p.locator('#duelist').selectOption('1517');await p.evaluate(()=>revealDuel());
 assert.equal(await p.evaluate(()=>s.duel.foe),1518);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 await p.evaluate(outcome=>{s.duel.win=outcome!=='loss';closeDuel();},outcome);await p.reload();
 assert.equal(await p.evaluate(()=>s.a.duelWon),outcome!=='loss');
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 await p.locator(outcome==='loss'?'button[onclick="finish(true)"]':'button[onclick="finish()"]').click();
 assert.equal(await p.evaluate(()=>s.loc),outcome==='loss'?346:78);

 }
 assert.deepEqual(errors,[]);console.log('077 指定對手與勝負路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
