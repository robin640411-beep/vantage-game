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
 for(const zone of ['grid','reserve'])for(const sale of [false,true])for(const purchase of [1,2,3]){
 const value=await p.evaluate(({zone})=>{const event='story:engage:0476:01',r=stories[event];s.loc=476;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];if(zone==='grid')s.grid[0]=1180;else s.reserve=[1180];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.money=2;s.boost[s.grid[4]]=0;s.a={id:476,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();return ruleFacts.value[1180];},{zone});
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),1);
 if(sale)await p.evaluate(()=>sellItem(1,1180));else await p.evaluate(()=>selectBranch(2));
 await p.reload();
 assert.equal(await p.evaluate(()=>s.money),2+(sale?value+2:0));
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1180)),!sale);
 await p.locator('button[onclick="selectBranch('+purchase+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.money),2+(sale?value+2:0)-(purchase===3?0:purchase));
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1419)),purchase===1);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(858)),purchase===2);
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),1);
 }
 assert.deepEqual(errors,[]);console.log('476 網格／儲備出售、保留、三種購買選擇共十二種組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
