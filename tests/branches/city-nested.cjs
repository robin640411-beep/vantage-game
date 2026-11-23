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
 for(const [id,choice,dest,enter] of [[262,2,524,true],[262,3,524,false],[627,4,521,true],[627,5,521,false]]){
 await p.evaluate(id=>{const event='story:look:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.skill=[0,0,0,0,0,0];s.stats=[4,4,4];s.a={id,event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),id===262?3:5);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 const book='engage';
 assert.equal(await p.evaluate(()=>s.loc),dest);
 assert.equal(await p.evaluate(()=>s.phase),enter?'cost':'ready');
 assert.equal(await p.evaluate(()=>s.skill[2]),enter?1:0);
 if(enter)assert.equal(await p.evaluate(()=>s.a.event),'story:'+book+':'+String(dest).padStart(4,'0')+':01');
 }
 assert.deepEqual(errors,[]);console.log('262、627 城市選擇與接續交易四條分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
