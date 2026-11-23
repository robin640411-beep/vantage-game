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
 const events=await p.evaluate(()=>Object.entries(stories).filter(([e,r])=>e.startsWith('story:overpower:')&&r[1].includes('符文投射器')&&r[1].includes('選擇獲得金屬廢料')).map(([e])=>e));
 for(const event of events)for(const choice of [1,2]){
 await p.evaluate(event=>{const r=stories[event];s.loc=r[0];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.boost[s.grid[4]]=0;s.a={id:r[0],event,kind:'地點',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},event);
 // Lava damage must be resolved before reward selection.
 if(await p.locator('button[onclick="takeChestDamage(true)"]').count())await p.locator('button[onclick="takeChestDamage(true)"]').click();
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2,event);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[1184,1190].includes(n))),[choice===1?1184:1190],event);
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),1,event);
 }
 console.log(events.length+' 個拆毀設備事件');
 assert.deepEqual(errors,[]);console.log('拆毀設備的兩種獎勵、共通強化與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
