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
 for(const [source,choice,target] of [[875,1,943],[875,2,918],[876,1,943],[876,2,895]]){
 await p.evaluate(source=>{s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[7]=source;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,4,0,0];s.stats=[4,4,4];s.boost[source]=0;s.phase='ready';save();},source);
 const event='story:help:'+String(source).padStart(4,'0')+':printed:craft';
 assert.equal(await p.evaluate(event=>actions().some(a=>a.event===event),event),false);
 await p.evaluate(({source,event})=>{s.boost[source]=2;s.markers[source]=1;for(const q of cards[source].slots)s.occupied[q.uid]='空白';save();choose(actions().findIndex(a=>a.event===event))},{source,event});
 assert.equal(await p.evaluate(()=>s.a.cost),4);
 await p.locator('#pay').selectOption('4');await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.evaluate(source=>s.boost[source],source),1);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(source=>s.grid.includes(source),source),false);
 assert.equal(await p.evaluate(source=>s.reserve.filter(n=>n===source).length,source),1);
 assert.equal(await p.evaluate(source=>s.boost[source],source),1);
 assert.equal(await p.evaluate(source=>s.markers[source],source),1);
 assert.equal(await p.evaluate(source=>cards[source].slots.some(q=>s.occupied[q.uid]),source),false);
 assert.equal(await p.evaluate(target=>s.grid.includes(target),target),true);

 }
 assert.deepEqual(errors,[]);console.log('875/876 四種製作結果、費用、儲備保留強化與標記、刷新骰子及重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
