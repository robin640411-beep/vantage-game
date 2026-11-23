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
 for(const choice of [1,2,3])for(const zone of ['grid','reserve']){
 await p.evaluate(zone=>{const event='story:engage:0178:01',r=stories[event];s.loc=178;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];if(zone==='grid')s.grid[0]=972;else s.reserve=[972];s.unplaced=[];s.supply=[];s.money=2;s.stats=[4,4,4];s.a={id:178,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},zone);
 await p.locator('button[onclick="selectBranch('+choice+(choice===2?',972':'')+')"]').click();await p.reload();
 assert.equal(await p.evaluate(()=>s.money),choice===1?0:2);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(972)),choice!==2);
 assert.deepEqual(await p.evaluate(()=>[1076,1212].filter(n=>[...s.grid,...s.reserve].includes(n))),[choice===3?1212:1076]);
 }
 assert.deepEqual(errors,[]);console.log('178 付錢、交牌與拒絕六種組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
