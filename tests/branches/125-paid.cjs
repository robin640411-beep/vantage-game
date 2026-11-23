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
 await p.evaluate(()=>{const event='story:look:0125:01',r=stories[event];s.loc=125;s.closedArtifactLocations=[];s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.supply=[];s.boost[s.grid[4]]=3;s.a={id:125,event,kind:'地點',book:'look',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),1);
 await p.evaluate(()=>selectBranch(1));assert.equal(await p.evaluate(()=>s.a.choice),undefined);
 await p.evaluate(()=>{s.boost[s.grid[4]]=4;save();selectBranch(1)});await p.reload();
 assert.equal(await p.evaluate(()=>s.boost[s.grid[4]]),0);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].filter(n=>n===998).length),1);
 assert.equal(await p.evaluate(()=>s.closedArtifactLocations.includes(125)),true);
 assert.deepEqual(errors,[]);console.log('125 支付路線：不足禁止、四點扣費、神器取得與關閉地點行動通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
