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
 for(const id of [775,776])for(let choice=1;choice<=(id===775?2:4);choice++){
 await p.evaluate(id=>{const event='story:help:'+String(id).padStart(4,'0')+':01',r=stories[event];s.loc=id;s.grid=s.grid.map((v,i)=>i===4?v:0);s.reserve=[];s.unplaced=[];s.used=[];s.supply=[];s.money=4;s.stats=[4,4,4];s.a={id,event,kind:'地點',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},id);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 const expected=id===775?(choice===1?[1334]:[]):choice<=2?[1462]:[1034,1638];if(id===776&&choice%2===0)expected.push(966);
 assert.deepEqual(await p.evaluate(()=>[...s.grid,...s.reserve,...s.supply].filter(n=>[1334,1462,1034,1638,966].includes(n)).sort((a,b)=>a-b)),expected.sort((a,b)=>a-b));
 assert.equal(await p.evaluate(()=>s.money),id===776&&choice%2===0?0:4);
 if(id===776)assert.equal(await p.evaluate(()=>s.supply.includes(1638)),choice>=3);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),id===775&&choice===1?768:id);
 }
 assert.deepEqual(errors,[]);console.log('775、776 六條復原分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
