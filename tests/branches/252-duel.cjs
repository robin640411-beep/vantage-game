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
 for(const outcome of ['loss','bird','companion']){
 await p.evaluate(()=>{const event='story:overpower:0252:01',r=stories[event];s.loc=252;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[1517];s.unplaced=[];s.supply=[];s.stats=[4,4,4];delete s.boost[826];s.a={id:252,event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();beginDuel();diceTray.close();});
 await p.locator('#duelist').selectOption('1517');await p.evaluate(()=>revealDuel());
 assert.equal(await p.evaluate(()=>s.duel.foe),1522);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 await p.evaluate(outcome=>{s.duel.win=outcome!=='loss';closeDuel();},outcome);await p.reload();
 assert.equal(await p.evaluate(()=>s.a.duelWon),outcome!=='loss');
 if(outcome==='loss')assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 else{await p.locator('button[onclick="selectBranch('+(outcome==='bird'?1:2)+')"]').click();await p.reload();}
 assert.deepEqual(await p.evaluate(()=>[826,1331].filter(n=>[...s.grid,...s.reserve].includes(n))),outcome==='loss'?[]:[outcome==='bird'?826:1331]);
 if(outcome==='bird')assert.equal(await p.evaluate(()=>s.boost[826]),1);
 }
 assert.deepEqual(errors,[]);console.log('252 指定交鋒對手、勝負與獎勵分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
