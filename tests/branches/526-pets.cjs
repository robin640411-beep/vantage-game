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
 for(const money of [0,1])for(const choice of [1,2,3,4]){
 await p.evaluate(money=>{const event='story:move:0526:01',r=stories[event];s.loc=526;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.money=money;s.boost[s.grid[4]]=0;s.stats=[4,4,4];s.a={id:526,event,kind:'地點',book:'move',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},money);
 if(money===0&&choice<4){
 assert.equal(await p.locator('button[onclick="selectBranch('+choice+')"]').count(),0);
 await p.evaluate(choice=>selectBranch(choice),choice);
 assert.equal(await p.evaluate(()=>s.a.choice??null),null);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[816,823,820].includes(n))),[]);
 continue;
 }
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.equal(await p.evaluate(()=>s.money),money-(choice<4?1:0));
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>[816,823,820].includes(n))),choice<4?[[816,823,820][choice-1]]:[]);
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),choice===4?1:0);
 }
 assert.deepEqual(errors,[]);console.log('526 寵物店八種資金與選擇組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
