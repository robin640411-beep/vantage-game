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
 for(const id of [24,36,39])for(const choice of [1,2,3])for(const craft of [0,1,2]){
 await p.evaluate(({id,craft})=>{const event='story:overpower:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.used=['action:'+String(id).padStart(4,'0')+':02'];delete s.practiceAction;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[977];if(craft)s.grid[0]=1180;s.unplaced=[];s.supply=[];s.boost[977]=0;s.skill=[0,0,0,0,0,0];s.occupied={};const q=cards[s.grid[4]].slots[0];s.occupied[q.uid]='生命';s.a={id,event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{id,craft});
 assert.equal(await p.evaluate(()=>s.skill[1]),0);
 await p.evaluate(choice=>selectBranch(choice,choice===3?977:0),choice);
 await p.reload();
 assert.equal(await p.evaluate(()=>s.skill[1]),choice===2?1:0);
 assert.equal(await p.evaluate(()=>Object.keys(s.occupied).length),choice===1?0:1);
 assert.equal(await p.evaluate(()=>s.boost[977]),choice===3?1:0);
 if(craft)assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 if(craft)await p.evaluate(craft=>selectBranch(craft),craft);await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1180)),craft===2);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1084)),craft===1);
 assert.equal(await p.evaluate(()=>s.skill[1]),choice===2?1:0);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),1);
 await p.locator('button[onclick="finish(true)"]').click();
 assert.deepEqual(await p.evaluate(()=>actions().map(a=>a.key)),['action:'+String(id).padStart(4,'0')+':02']);
 await p.evaluate(()=>choose(0));assert.equal(await p.evaluate(()=>s.phase),'cost');
 assert.equal(await p.evaluate(()=>s.a.event),'story:look:'+String(id).padStart(4,'0')+':01');
 }
 assert.deepEqual(errors,[]);console.log('24、36、39 火焰效果、木頭交換及指定探索 27 種組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
