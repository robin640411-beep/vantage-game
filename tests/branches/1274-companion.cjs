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
 for(const choice of [1,2,3]){
 await p.evaluate(()=>{const event='story:help:1274:01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id:1274,event,kind:'卡牌',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),3);
 assert.deepEqual(await p.evaluate(()=>[1306,1326,1347].filter(n=>[...s.grid,...s.reserve].includes(n))),[]);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 for(let reload=0;reload<2;reload++){
 await p.reload();
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[1306,1326,1347].includes(n))),[[1306,1326,1347][choice-1]]);
 }
 }
 assert.deepEqual(errors,[]);console.log('1274 三種夥伴選擇與重載不重複發牌通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
