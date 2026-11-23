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
 for(const choice of [1,2]){
 await p.evaluate(()=>{const event='story:help:0340:01',r=stories[event];s.loc=340;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id:340,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 assert.equal(await p.evaluate(()=>s.skill[0]),0);
 assert.equal(await p.evaluate(()=>s.supply.includes(1676)),false);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.skill[0]),choice===1?1:0);
 assert.equal(await p.evaluate(()=>s.supply.includes(1676)),choice===1);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1151)),choice===2);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),340);
 }
 assert.deepEqual(errors,[]);console.log('340 任務與寶箱報酬兩條互斥路線通過，任務不會誤觸移動');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
