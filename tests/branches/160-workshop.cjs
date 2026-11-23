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
 for(const legacy of [false,true]){
 await p.evaluate(legacy=>{s.loc=160;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,2,0,0];s.stats=[4,4,4];s.phase='ready';save();choose(actions().findIndex(a=>a.event==='story:help:0160:recovered:0047'));if(legacy)s.a.text=workshop160Old;},legacy);
 assert.equal(await p.evaluate(()=>s.a.cost),2);
 await p.locator('#pay').selectOption('2');await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.supply.filter(n=>n===1644).length),1);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 assert.match(await p.locator('.storyMessage .story').innerText(),/首席鐵匠/);
 assert.doesNotMatch(await p.locator('.storyMessage .story').innerText(),/你所控制的卡牌/);
 await p.reload();assert.equal(await p.evaluate(()=>s.supply.filter(n=>n===1644).length),1);
 }
 assert.deepEqual(errors,[]);console.log('160 原文對應、實際費用入口、任務1644及舊文字重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
