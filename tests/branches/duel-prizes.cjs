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
 for(const [id,prize] of [[211,1336],[322,1071],[338,0],[676,1223]])for(const won of [false,true]){
 await p.evaluate(id=>{const event='story:overpower:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[1517];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id,event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 assert.deepEqual(await p.evaluate(()=>[1336,1071,1223].filter(n=>[...s.grid,...s.reserve].includes(n))),[]);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 await p.getByRole('button',{name:'進入交鋒快速對決'}).click();await p.evaluate(()=>diceTray.close());
 await p.locator('#duelist').selectOption('1517');await p.evaluate(()=>revealDuel());
 await p.evaluate(won=>{s.duel.win=won;closeDuel();},won);await p.reload();
 if(prize)assert.equal(await p.evaluate(prize=>[...s.grid,...s.reserve].includes(prize),prize),won);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),id===338&&won?570:id);
 }
 assert.deepEqual(errors,[]);console.log('四個交鋒故事八種勝負結果通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
