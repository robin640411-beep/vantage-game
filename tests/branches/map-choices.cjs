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
 for(const id of [526,788])for(const choice of [1,2]){
 await p.evaluate(id=>{const event='story:take:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.money=0;s.stats=[4,4,4];s.a={id,event,kind:'地點',book:'take',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[1260,1339,1264].includes(n))),id===526?(choice===1?[1260]:[]):(choice===1?[1339]:[1264]));
 assert.equal(await p.evaluate(()=>s.money),id===526&&choice===2?15:0);
 if(id===526&&choice===1||id===788&&choice===2){
 const text=await p.evaluate(()=>resultText());assert.ok(text.includes(id===526?'第17頁':'第21頁'));assert.ok(text.includes(id===526?'地區K':'地區I'));
 }
 }
 assert.deepEqual(errors,[]);console.log('526、788 四條地圖分支與書頁提示通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
