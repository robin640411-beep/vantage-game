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
 for(const zone of ['grid','reserve'])for(const choice of [1,2]){
 await p.evaluate(zone=>{s.loc=646;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];if(zone==='grid')s.grid[0]=1180;else s.reserve=[1180];s.unplaced=[];s.supply=[];s.skill=[0,0,0,1,0,0];s.stats=[4,4,4];s.phase='ready';save();const index=actions().findIndex(a=>a.event==='story:help:0646:scan:01');if(index<0)throw Error('missing offering action');choose(index);},zone);
 assert.equal(await p.locator('button[onclick="roll()"]').count(),0);
 await p.evaluate(()=>roll());assert.equal(await p.evaluate(()=>s.phase),'cost');
 await p.getByRole('button',{name:'獻上卡牌 1180',exact:true}).click();await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1180)),false);
 await p.locator('#pay').selectOption('1');await p.evaluate(()=>updatePayment());
 await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.supply.includes(1656)),choice===2);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(889)),choice===1);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),choice===1?647:646);
 }
 assert.deepEqual(errors,[]);console.log('646 網格／儲備獻禮、擲骰前付款、兩種報酬與路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
