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
 for(const full of [false,true])for(const [source,cost,choice,target,boost,reserve,count] of [
 [909,3,1,882,1,true,3],[909,3,2,1209,1,true,3],[909,3,3,908,1,true,3],
 [911,3,1,910,0,true,3],[911,3,2,926,0,true,3],[911,3,3,967,0,true,3],
 [913,3,1,1411,0,true,2],[913,3,2,921,0,true,2],
 [914,4,1,963,0,false,3],[914,4,2,915,0,false,3],[914,4,3,1231,0,false,3]]){
 await p.evaluate(({source,cost,full})=>{s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:full?858+i:0);s.grid[7]=source;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,cost,0,0];s.stats=[4,4,4];s.boost[source]=0;s.phase='ready';save();},{source,cost,full});
 const event='story:help:'+String(source).padStart(4,'0')+':printed:craft';
 assert.equal(await p.evaluate(event=>actions().some(a=>a.event===event),event),boost===0);
 await p.evaluate(({source,event,boost})=>{s.boost[source]=boost;s.markers[source]=1;for(const q of cards[source].slots)s.occupied[q.uid]='空白';save();choose(actions().findIndex(a=>a.event===event))},{source,event,boost});
 assert.equal(await p.evaluate(()=>s.a.cost),cost);
 await p.locator('#pay').selectOption(String(cost));await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.evaluate(source=>s.boost[source],source),0);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),count);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(source=>s.grid.includes(source),source),false);
 assert.equal(await p.evaluate(source=>s.reserve.filter(n=>n===source).length,source),reserve?1:0);
 assert.equal(await p.evaluate(source=>s.boost[source]||0,source),0);
 assert.equal(await p.evaluate(source=>s.markers[source]||0,source),reserve?1:0);
 assert.equal(await p.evaluate(source=>cards[source].slots.some(q=>s.occupied[q.uid]),source),false);
 assert.equal(await p.evaluate(target=>s.grid.includes(target),target),true);
 if(full)assert.equal(await p.evaluate(()=>s.grid[7]),target);
 assert.equal(await p.evaluate(()=>s.unplaced.length),0);

 }
 assert.deepEqual(errors,[]);console.log('909/911/913/914 十一種製作結果、不同強化費用及儲備/替換共22案例通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
