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
 for(const effort of [1,3,4,6])for(const choice of effort>=4?[1,2]:[0]){
 await p.evaluate(effort=>{const event='story:help:0585:01',r=stories[event];s.loc=585;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];s.a={id:585,event,effort,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},effort);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),effort>=4?2:0);
 if(choice)await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 const expected=[996];if(choice)expected.push(choice===1?1044:1209);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[996,1044,1209].includes(n)).sort((a,b)=>a-b)),expected.sort((a,b)=>a-b));
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),681);
 }
 assert.deepEqual(errors,[]);console.log('585 費用門檻及六種獎勵路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
