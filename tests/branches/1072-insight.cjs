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
 for(let choice=1;choice<=7;choice++){
 await p.evaluate(()=>{const event='story:take:1072:02',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.loc=723;s.grid[0]=1072;s.reserve=[];s.unplaced=[];s.supply=[];s.used=['action:0723:02'];s.skill=[0,0,0,0,0,0];s.boost[1072]=0;s.stats=[4,4,4];s.a={id:1072,event,kind:'卡牌',book:'take',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),7);
 await p.evaluate(choice=>{const original=throwDice;throwDice=()=>[0,1,1,5];selectBranch(choice);throwDice=original;diceTray.close();},choice);await p.reload();
 assert.deepEqual(await p.evaluate(()=>s.skill),Array.from({length:6},(_,i)=>choice===i+1?[1,2,0,0,0,1][i]:0));
 assert.equal(await p.evaluate(()=>s.boost[1072]),choice===7?1:0);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),choice<=6?1:0);
 if(choice<=6){
 const turn=await p.evaluate(()=>s.turn);
 await p.locator('button[onclick="finish(true)"]').click();
 assert.equal(await p.evaluate(()=>s.turn),turn);
 assert.equal(await p.evaluate(()=>actions().some(a=>a.key==='action:0723:01')),false,'非地點行動的繼續不解除地點限制');
 assert.ok(await p.evaluate(()=>actions().some(a=>a.kind==='卡牌'||a.kind==='離開')),'仍可選擇合法的後續行動');
 assert.equal(await p.evaluate(()=>actions().some(a=>a.key==='action:0723:02')),false);
 }
 }
 assert.deepEqual(errors,[]);console.log('1072 六種技能與停止七個分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
