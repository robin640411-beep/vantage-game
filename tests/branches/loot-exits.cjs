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
 const cases=[['overpower',583,1,1034,777],['overpower',583,2,965,777],['overpower',582,1,877,641],['overpower',582,2,887,641],['overpower',582,3,1090,641]];
 for(const [book,id,choice,card,dest] of cases){
 await p.evaluate(({book,id})=>{const event=id===582?'story:overpower:0582:recovered:0147':'story:overpower:0583:01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];s.a={id,event,kind:book==='depart'?'離開':'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{book,id});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),id===583?2:3);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.deepEqual(await p.evaluate(()=>[1034,965,877,887,1090].filter(n=>[...s.grid,...s.reserve].includes(n))),[card]);
 assert.equal(await p.evaluate(()=>s.loc),dest);
 assert.equal(await p.evaluate(()=>s.phase),'ready');
 }
 assert.deepEqual(errors,[]);console.log('582、583 五個物品選項及離開路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
