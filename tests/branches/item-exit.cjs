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
 const cases=[['depart',577,1,1045,465],['depart',577,2,1262,465],['look',580,1,1161,613],['look',580,2,951,613],['look',580,3,871,613],['look',580,4,875,613]];
 for(const [book,id,choice,card,dest] of cases){
 await p.evaluate(({book,id})=>{const event='story:'+book+':'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.stats=[4,4,4];s.a={id,event,kind:book==='depart'?'離開':'地點',book,name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},{book,id});
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),id===577?2:4);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();
 await p.reload();
 assert.deepEqual(await p.evaluate(()=>[1045,1262,1161,951,871,875].filter(n=>[...s.grid,...s.reserve].includes(n))),[card]);
 assert.equal(await p.evaluate(()=>s.loc),dest);
 assert.equal(await p.evaluate(()=>s.phase),'ready');
 }
 assert.deepEqual(errors,[]);console.log('577、580 六個物品選項及離開路線通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
