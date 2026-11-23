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
 for(const [id,dest,book,skill,amount] of [[162,525,"look",1,1],[186,518,"take",4,2],[206,522,"engage",2,2],[238,520,"move",0,2],[332,530,"take",4,2],[342,529,"help",3,2],[473,526,"take",4,1],[677,519,"look",1,2],[641,528,"look",1,2],[738,527,"engage",2,1],[727,523,"engage",2,2],[748,531,"look",1,2]])for(const choice of [1,2]){
 await p.evaluate(id=>{const event='story:look:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id,event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();

 assert.equal(await p.evaluate(()=>s.loc),dest);
 assert.equal(await p.evaluate(()=>s.phase),choice===1?'cost':'ready');
 assert.equal(await p.evaluate(skill=>s.skill[skill],skill),choice===1?amount:0);
 if(choice===1){assert.equal(await p.evaluate(()=>s.a.book),book);assert.equal(await p.evaluate(()=>s.a.id),dest);assert.equal(await p.evaluate(()=>s.a.cost),await p.evaluate(()=>stories[s.a.event][2]));}
 }
 assert.deepEqual(errors,[]);console.log('12 個城市入口、24 條分支及重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
