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
 for(const choice of [1,2]){
 await p.evaluate(()=>{const event='story:take:1073:01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[0]=1073;s.reserve=[];s.unplaced=[];s.supply=[];s.boost[1073]=0;delete s.ignoreMoraleTurn;s.penalty=0;s.stats=[4,4,4];s.a={id:1073,event,kind:'卡牌',book:'take',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.boost[1073]),choice===2?1:0);
 if(choice===1){
 await p.locator('button[onclick="finish(true)"]').click();
 await p.evaluate(()=>{s.a={id:1073,kind:'卡牌',book:'take',name:'驗證',text:'',dice:['士氣']};s.phase='dice';assign(-1);});
 assert.equal(await p.evaluate(()=>s.stats[1]),4);assert.equal(await p.evaluate(()=>s.penalty),0);
 await p.evaluate(()=>{s.turn++;s.a={id:1073,kind:'卡牌',book:'take',name:'驗證',text:'',dice:['士氣']};s.phase='dice';assign(-1);});
 assert.equal(await p.evaluate(()=>s.stats[1]),3);assert.equal(await p.evaluate(()=>s.penalty),1);
 }
 }
 assert.deepEqual(errors,[]);console.log('1073 停止與勇氣效果、回合期限通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
