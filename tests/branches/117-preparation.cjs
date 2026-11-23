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
 const events=['story:look:0117:01'];
 for(const event of events)for(let choice=1;choice<=12;choice++){
 await p.evaluate(event=>{const r=stories[event];s.loc=r[0];s.grid=[1305,1306,1307,1308,s.grid[4],1309,1310,1311,1312];s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.occupied={};for(const n of s.grid){s.boost[n]=0;for(const q of cards[n].slots)s.occupied[q.uid]='時間';}s.stats=[4,4,4];s.a={id:r[0],event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},event);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),12);
 await p.evaluate(choice=>{const original=throwDice;throwDice=()=>[0];selectBranch(choice);throwDice=original;diceTray.close();},choice);await p.reload();
 if(choice<=6)assert.deepEqual(await p.evaluate(()=>s.skill),Array.from({length:6},(_,i)=>(i===0?1:0)+(i===choice-1?1:0)));
 else if(choice<=9){assert.equal(await p.evaluate(choice=>s.grid.every((n,i)=>cards[n].slots.every(q=>(q.uid in s.occupied)!==(Math.floor(i/3)===choice-7))),choice),true,event);}
 else assert.deepEqual(await p.evaluate(()=>s.grid.map(n=>s.boost[n])),Array.from({length:9},(_,i)=>i%3===choice-10?1:0));
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),1);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),1);
 await p.locator('button[onclick="finish(true)"]').click();
 assert.deepEqual(await p.evaluate(()=>actions().map(a=>a.key)),['action:0117:05']);
 await p.evaluate(()=>choose(0));assert.equal(await p.evaluate(()=>s.a.event),'story:take:0117:01');
 }
 console.log(await p.evaluate(()=>preparationChoices.size)+' 個條目使用此準備流程');
 assert.deepEqual(errors,[]);console.log('117 十二種準備選擇與限定後續行動通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
