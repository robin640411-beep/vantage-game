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
 await p.evaluate(()=>{const event='story:engage:0252:01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];delete s.boost[826];s.supply=[];s.stats=[4,4,4];s.a={id:252,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 assert.deepEqual(await p.evaluate(()=>[826,1331].filter(n=>[...s.grid,...s.reserve].includes(n))),[]);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 for(let reload=0;reload<2;reload++){
 await p.reload();
 if(choice===1)assert.equal(await p.evaluate(()=>s.boost[826]),1);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[826,1331].includes(n))),[[826,1331][choice-1]]);
 }
 }
 assert.deepEqual(errors,[]);console.log('252 馴鷹者兩條分支、動物強化與重載通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
