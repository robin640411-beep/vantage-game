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
 for(const choice of [1,2,3]){
 await p.evaluate(()=>{const event='story:help:0723:01',r=stories[event];s.loc=723;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];delete s.practiceAction;s.a={id:723,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),3);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 const ids=[1486,1503,1512];
 assert.deepEqual(await p.evaluate(ids=>ids.filter(n=>[...s.grid,...s.reserve].includes(n)),ids),[ids[choice-1]]);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),choice===2?1:0);
 if(choice===2){
  await p.locator('button[onclick="finish(true)"]').click();
  assert.deepEqual(await p.evaluate(()=>actions().map(a=>a.key)),['action:0723:01']);
  await p.evaluate(()=>choose(0));
  assert.deepEqual(await p.evaluate(()=>[s.phase,s.a.event,s.a.cost]),['cost','story:move:0723:01',4]);
 }
 }
 assert.deepEqual(errors,[]);console.log('723 三種選擇、存檔重載、攀登限定與費用通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
