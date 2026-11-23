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
 const cases=[['engage',728,1,1347,722],['engage',728,2,1650,728],['help',728,1,1347,722],['help',728,2,1650,728],['engage',726,1,0,411],['engage',726,2,0,726],['help',771,1,0,771],['help',771,2,1158,771],['take',342,1,0,529],['take',342,2,1156,342]];
 for(const [book,id,choice,card,dest] of cases){
 await p.evaluate(({book,id})=>{const event='story:'+book+':'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.money=0;s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id,event,kind:'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{book,id});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 if(card)assert.equal(await p.evaluate(card=>[...s.grid,...s.reserve,...s.supply].includes(card),card),true);
 if(id===728)assert.equal(await p.evaluate(card=>[...s.grid,...s.reserve,...s.supply].includes(card),choice===1?1650:1347),false);
 if(id===726)assert.deepEqual(await p.evaluate(()=>[s.skill[0],s.stats[1]]),choice===1?[1,4]:[0,5]);
 if(id===771)assert.equal(await p.locator('button[onclick="finish(true)"]').count(),1);
 await p.locator('button[onclick="finish()"]').click();
 assert.equal(await p.evaluate(()=>s.loc),dest);
 }
 assert.deepEqual(errors,[]);console.log('五個故事十條互斥分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
