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
 for(const money of [0,2])for(const choice of [1,2]){
 await p.evaluate(money=>{const event='story:help:0667:recovered:0172',r=stories[event];s.loc=667;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.money=money;s.stats=[4,4,4];s.a={id:667,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},money);
 if(money===0&&choice===1){await p.evaluate(()=>selectBranch(1));assert.equal(await p.evaluate(()=>s.a.choice??null),null);continue;}
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.money),money-(choice===1?2:0));
 assert.deepEqual(await p.evaluate(()=>s.stats),choice===1?[4,4,6]:[4,5,4]);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[996,1044,1209].includes(n))),[]);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),667);
 }
 assert.deepEqual(errors,[]);console.log('667 婚禮贈禮、祝福與資金限制通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
