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
 for(const [choice,dest] of [[1,251],[2,253],[3,168],[4,166],[5,172]]){
 await p.evaluate(()=>{const event='story:engage:0172:01',r=stories[event];s.loc=172;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id:172,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),5);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.stats[2]),5);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),dest);
 }
 assert.deepEqual(errors,[]);console.log('172 四個目的地及留在原地、共通生命獎勵通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
