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
 for(const [food,zone,curse,choice] of [[1075,'grid',true,0],[1075,'reserve',false,0],[1181,'grid',false,0],[1181,'reserve',true,0],[0,'grid',false,0],[0,'grid',true,1],[0,'reserve',true,1],[0,'grid',true,2]]){
 await p.evaluate(({food,zone,curse})=>{const event='story:help:0493:recovered:0129',r=stories[event];s.loc=493;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];if(food){if(zone==='grid')s.grid[0]=food;else s.reserve=[food]}if(curse){if(zone==='grid')s.grid[1]=1387;else s.reserve.push(1387)}s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id:493,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{food,zone,curse});
 if(choice){assert.equal(await p.locator('button[onclick="finish()"]').count(),0);await p.evaluate(choice=>selectBranch(choice,1387),choice)}
 await p.reload();
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(822)),Boolean(food));
 if(food)assert.equal(await p.evaluate(food=>[...s.grid,...s.reserve].includes(food),food),true);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1387)),curse&&choice!==1);
 assert.equal(await p.evaluate(()=>s.stats[1]),!food&&choice!==1?5:4);
 await p.reload();assert.equal(await p.evaluate(()=>s.stats[1]),!food&&choice!==1?5:4);
 }
 assert.deepEqual(errors,[]);console.log('493 八種植物／食物／詛咒條件與互斥獎勵、重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
