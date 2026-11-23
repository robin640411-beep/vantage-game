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
 for(const effort of [1,3,4,6]){
 await p.evaluate(()=>{s.loc=586;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.skill=[0,0,0,6,0,0];s.stats=[4,4,4];s.phase='ready';s.a=null;save();const i=actions().findIndex(a=>a.event==='story:help:0586:01');if(i<0)throw Error('缺少路障入口');choose(i);});
 await p.locator('#xcost').selectOption(String(effort));
 await p.locator('#pay').selectOption(String(effort));
 await p.evaluate(()=>roll());
 await p.reload();
 assert.equal(await p.evaluate(()=>s.a.effort),effort);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[995,916,874,1093].includes(n)).sort((a,b)=>a-b)),effort>=4?[916,995]:[995]);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),687);
 }
 assert.deepEqual(errors,[]);console.log('586 真實費用入口、四種 X 值與退出路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
