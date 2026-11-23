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
 for(const [book,id,task,dest] of [['engage',785,1680,785],['help',677,1636,519]])for(const choice of [1,2]){
 await p.evaluate(({book,id})=>{const event='story:'+book+':'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];s.boost[s.grid[4]]=0;s.a={id,event,kind:'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{book,id});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.equal(await p.evaluate(task=>s.supply.includes(task),task),choice===1);
 assert.equal(await p.evaluate(task=>s.grid.includes(task)||s.reserve.includes(task),task),false);
 if(id===785){assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),choice===2?1:0);assert.equal(await p.locator('button[onclick="finish(true)"]').count(),choice===2?1:0);}
 await p.locator(id===785&&choice===2?'button[onclick="finish(true)"]':'button[onclick="finish()"]').click();
 assert.equal(await p.evaluate(()=>s.loc),choice===1?id:dest);
 }
 assert.deepEqual(errors,[]);console.log('677、785 接受與拒絕任務四條分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
