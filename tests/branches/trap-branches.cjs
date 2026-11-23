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
 for(const id of [923,926,947])for(const choice of [1,2,3])for(const success of [false,true]){
 await p.evaluate(({id,choice,success})=>{const event='story:overpower:0'+id+':01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[0]=id;s.grid[1]=810;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,1,0,0];s.boost[s.grid[4]]=0;s.boost[810]=0;s.stats=[4,4,4];s.a={id,event,kind:'卡牌',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();const original=throwDice;throwDice=()=>[success?[5,4,2][choice-1]:0,0,0];selectBranch(choice);throwDice=original;diceTray.close();},{id,choice,success});
 await p.reload();
 if(!success)assert.equal(await p.evaluate(()=>s.skill[5]),1);
 else if(choice===1)assert.deepEqual(await p.evaluate(()=>[s.boost[s.grid[4]],s.boost[810]]),[1,1]);
 else if(choice===3)assert.equal(await p.evaluate(()=>s.grid.includes(1217)),true);
 else{assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),6);await p.locator('button[onclick="selectBranch(2)"]').click();assert.equal(await p.evaluate(()=>s.skill[3]),0);assert.equal(await p.evaluate(id=>s.grid.includes(id),id),true);}
 }
 assert.deepEqual(errors,[]);console.log('三種陷阱十八種目的與擲骰結果通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
