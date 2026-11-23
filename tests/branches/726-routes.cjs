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
 for(const [choice,dest] of [[1,727],[2,410],[3,725],[4,720]]){
 await p.evaluate(()=>{const event='story:move:0726:01',r=stories[event];s.loc=726;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id:726,event,kind:'地點',book:'move',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),4);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===876).length),1);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),dest);
 }
 assert.deepEqual(errors,[]);console.log('726 四個方向與共通信物獎勵通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
