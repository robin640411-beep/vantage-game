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
 for(const boost of [0,2])for(const choice of [1,2]){
 await p.evaluate(boost=>{const event='story:move:0306:01',r=stories[event];s.loc=306;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.boost[s.grid[4]]=boost;s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id:306,event,kind:'地點',book:'move',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},boost);
 if(boost===0&&choice===1){await p.evaluate(()=>selectBranch(1));assert.equal(await p.evaluate(()=>s.a.choice??null),null);continue;}
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),boost-(choice===1?2:0));
 assert.equal(await p.evaluate(()=>s.skill[4]),choice===2?1:0);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1216)),choice===1);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),choice===2?1:0);
 assert.equal(await p.evaluate(()=>resultText().includes('第44頁')),false);
 }
 assert.deepEqual(errors,[]);console.log('306 碎片分支、強化限制與混入獎勵排除通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
