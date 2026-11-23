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
 for(const full of [false,true])for(const [source,choice,target] of [[985,0,1010],[989,1,1010],[989,2,1253]]){
 await p.evaluate(({full,source})=>{s.loc=581;s.used=[];s.grid=full?[1305,1306,1307,1308,s.grid[4],1309,1310,source,1311]:s.grid.map((v,i)=>i===4?v:i===7?source:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,6,0,0];s.stats=[4,4,4];s.boost[source]=2;s.markers[source]=1;s.occupied={};for(const q of cards[source].slots)s.occupied[q.uid]='時間';s.phase='ready';save();choose(actions().findIndex(a=>a.event==='story:help:'+String(source).padStart(4,'0')+':01'));},{full,source});
 const cost=await p.evaluate(()=>s.a.cost);assert.equal(cost,6);await p.locator('#pay').selectOption('6');await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();
 if(choice){assert.equal(await p.locator('button[onclick="finish()"]').count(),0);await p.locator('button[onclick="selectBranch('+choice+')"]').click()}
 await p.reload();assert.equal(await p.evaluate(()=>s.grid[7]),target);
 assert.equal(await p.evaluate(source=>s.grid.includes(source),source),false);
 assert.equal(await p.evaluate(source=>s.boost[source],source),undefined);
 assert.equal(await p.evaluate(source=>s.markers[source],source),undefined);
 assert.equal(await p.evaluate(source=>cards[source].slots.some(q=>q.uid in s.occupied),source),false);
 assert.equal(await p.evaluate(()=>s.unplaced.length),0);
 const boost=await p.evaluate(target=>s.boost[target],target);await p.reload();assert.equal(await p.evaluate(target=>s.boost[target],target),boost);
 }
 assert.deepEqual(errors,[]);console.log('985、989 三種升級結果：空槽／滿槽、互斥選擇、原位置與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
