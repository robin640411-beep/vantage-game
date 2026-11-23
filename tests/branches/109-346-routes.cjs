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
 for(const [id,choice,dest] of [[109,1,114],[109,2,433],[109,3,104],[109,4,108],[346,1,76],[346,2,77]]){
 await p.evaluate(id=>{const event='story:move:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.boost[s.grid[4]]=0;s.a={id,event,kind:'地點',book:'move',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 if(id===346&&choice===2){
  await p.evaluate(()=>selectBranch(2));assert.equal(await p.evaluate(()=>s.a.choice),undefined);
  await p.evaluate(()=>{s.boost[s.grid[4]]=1;save()});
 }
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),0);
 if(id===109)assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===1075).length),1);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),dest);
 }
 assert.deepEqual(errors,[]);console.log('109 四條路線與植物、346 兩條入口與強化支付通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
