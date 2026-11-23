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
 for(const [event,id,book,companion,dest] of [['story:move:0183:01',183,'move',1305,184],['story:move:0183:02',183,'move',1305,184],['story:take:0146:01',146,'take',1329,140]])for(const choice of [1,2]){
 await p.evaluate(({event,id,book})=>{const r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];s.a={id,event,kind:'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{event,id,book});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.equal(await p.evaluate(n=>[...s.grid,...s.reserve].includes(n),companion),choice===1);
 if(id===183)assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===1469).length),1);
 await p.locator('button[onclick="finish()"]').click();
 assert.equal(await p.evaluate(()=>s.loc),choice===1?dest:id);
 }
 assert.deepEqual(errors,[]);console.log('183 兩個入口及 146 同行與拒絕六條分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
