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
 for(const [id,book,choices,boost] of [[433,'look',[0,2,4],1],[620,'look',[3,4,5],2],[773,'look',[0,2,5],0],[488,'move',[2,4,5],0],[780,'move',[1,4,5],0]])for(let choice=0;choice<3;choice++){
 await p.evaluate(({id,book})=>{const event='story:'+book+':'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.boost[s.grid[4]]=0;s.stats=[4,4,4];s.a={id,event,kind:'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{id,book});
 assert.equal(await p.locator('button[onclick^="selectRewardSkill("]').count(),3,String(id));
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),0);
 await p.locator('button[onclick="selectRewardSkill('+choice+')"]').click();await p.reload();
 assert.deepEqual(await p.evaluate(()=>s.skill),Array.from({length:6},(_,i)=>i===choices[choice]?1:0));
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),boost,String(id));
 await p.evaluate(choice=>selectRewardSkill(choice),choice);
 assert.deepEqual(await p.evaluate(()=>s.skill),Array.from({length:6},(_,i)=>i===choices[choice]?1:0));
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),1);
 }
 assert.deepEqual(errors,[]);console.log('五個技能三選一事件共十五種選擇通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
