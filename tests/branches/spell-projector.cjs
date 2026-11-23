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
 for(const [id,book,items] of [[733,"look",[1236,1237,1238]],[525,"move",[1028,1030,1026,1029,1031,1027]]])for(let choice=1;choice<=items.length;choice++){
 await p.evaluate(({id,book})=>{const event='story:'+book+':'+String(id).padStart(4,'0')+':01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.stats=[4,4,4];s.a={id,event,kind:'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{id,book});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),items.length);
 assert.deepEqual(await p.evaluate(items=>items.filter(n=>[...s.grid,...s.reserve].includes(n)),items),[]);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 for(let reload=0;reload<2;reload++){
 await p.reload();
 assert.deepEqual(await p.evaluate(items=>[...s.grid,...s.reserve].filter(n=>items.includes(n)),items),[items[choice-1]]);
 }
 }
 assert.deepEqual(errors,[]);console.log('733、525 九種法術與投射器選擇通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
