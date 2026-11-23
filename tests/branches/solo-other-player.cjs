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
 const events=await p.evaluate(()=>Object.entries(stories).filter(([k,r])=>/^另一位玩家選擇一項/.test(r[1])).map(([k])=>k));
 assert.equal(events.length,15);
 for(const event of events){
 await p.evaluate(event=>{const r=stories[event];s.loc=r[0]<800?r[0]:109;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.boost[s.grid[4]]=0;s.occupied={};s.occupied[cards[s.grid[4]].slots[0].uid]='時間';s.a={id:r[0],event,kind:r[0]<800?'地點':'卡牌',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},event);
 assert.match(await p.locator('.storyMessage .story').innerText(),/單人遊戲沒有另一位玩家/);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),0);
 await p.reload();
 assert.deepEqual(await p.evaluate(()=>s.skill),[0,0,0,0,0,0]);
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),0);
 assert.equal(await p.evaluate(()=>Object.keys(s.occupied).length),1);
 assert.equal(await p.evaluate(()=>s.stats[1]),5);
 assert.equal(await p.locator('button[onclick="finish(true)"]').count(),1);
 assert.equal(await p.locator('button[onclick="finish()"]').count(),0);
 }
 assert.deepEqual(errors,[]);console.log('15 個單人通訊條目：略過他人效果、只領士氣、保留繼續與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
