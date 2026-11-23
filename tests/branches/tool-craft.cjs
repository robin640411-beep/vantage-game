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
 for(const full of [false,true])for(const [source,cost,choice,target] of [[881,4,1,880],[881,4,2,902],[882,5,1,880],[882,5,2,937],[883,5,1,880],[883,5,2,923],[884,5,1,904],[884,5,2,944],[890,4,1,904],[890,4,2,901]]){
 await p.evaluate(({source,cost,full})=>{s.loc=581;s.used=[];s.grid=s.grid.map((v,i)=>i===4?v:full?858+i:0);s.grid[7]=source;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,cost,0,0];s.stats=[4,4,4];s.boost[source]=0;s.phase='ready';save();},{source,cost,full});
 const event='story:help:'+String(source).padStart(4,'0')+':printed:craft';
 assert.equal(await p.evaluate(event=>actions().some(a=>a.event===event),event),false);
 await p.evaluate(({source,event})=>{s.boost[source]=2;s.markers[source]=1;for(const q of cards[source].slots)s.occupied[q.uid]='空白';save();choose(actions().findIndex(a=>a.event===event))},{source,event});
 assert.equal(await p.evaluate(()=>s.a.cost),cost);
 await p.locator('#pay').selectOption(String(cost));await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 assert.equal(await p.evaluate(source=>s.boost[source],source),1);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(source=>s.grid.includes(source),source),false);
 assert.equal(await p.evaluate(source=>s.reserve.filter(n=>n===source).length,source),1);
 assert.equal(await p.evaluate(source=>s.boost[source],source),1);
 assert.equal(await p.evaluate(source=>s.markers[source],source),1);
 assert.equal(await p.evaluate(source=>cards[source].slots.some(q=>s.occupied[q.uid]),source),false);
 assert.equal(await p.evaluate(target=>s.grid.includes(target),target),true);
 if(full)assert.equal(await p.evaluate(()=>s.grid[7]),target);
 assert.equal(await p.evaluate(()=>s.unplaced.length),0);

 }
 assert.deepEqual(errors,[]);console.log('881/882/883/884/890 十種製作結果，空網格與滿網格共20案例通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
