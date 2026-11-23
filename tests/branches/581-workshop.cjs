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
 const cases=await p.evaluate(()=>[{source:0,target:1098},...Object.entries(workshop581Recipes).flatMap(([n,targets])=>targets.map(target=>({source:Number(n),target}))) ]);
 for(const zone of ['grid','reserve'])for(const {source,target} of cases){
 await p.evaluate(({zone,source})=>{const event='story:help:0581:01',r=stories[event];s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];if(source){if(zone==='grid')s.grid[7]=source;else s.reserve=[source]}s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.boost={};s.a={id:581,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{zone,source});
 const index=await p.evaluate(({source,target})=>s.a.workshop581Options.findIndex(o=>o.source===source&&o.target===target)+1,{source,target});assert.ok(index>0);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 await p.locator('button[onclick="selectBranch('+index+')"]').click();await p.reload();
 if(target==='keep'){assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),1);assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(954)),true)}
 else{
  assert.equal(await p.evaluate(target=>[...s.grid,...s.reserve].filter(n=>n===target).length,target),1);
  const replacement=source===874||source===1040||source===954||source===1098;
  if(source)assert.equal(await p.evaluate(source=>[...s.grid,...s.reserve].includes(source),source),!replacement);
  if(replacement)assert.equal(await p.evaluate(({zone,target})=>zone==='grid'?s.grid[7]===target:s.reserve.includes(target),{zone,target}),true);
  if(target===1013)assert.equal(await p.evaluate(()=>s.boost[1013]),1);
 }
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),492);
 }
 assert.deepEqual(errors,[]);console.log('581 全部已列製作來源、兩種持有區域、改造與返回492通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
