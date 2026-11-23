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
 for(const location of [740,109])for(const choice of [1,2]){
 await p.evaluate(location=>{const event='story:help:1020:01',r=stories[event];s.loc=location;s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[0]=1020;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,4,0,0,0,0];s.stats=[4,4,4];s.boost[1020]=0;s.a={id:1020,event,kind:'卡牌',book:'help',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();},location);
 assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
 await p.locator('button[onclick="selectBranch('+choice+')"]').click();await p.reload();
 if(location===109&&choice===1){assert.equal(await p.evaluate(()=>s.a.cost),4);assert.equal(await p.evaluate(()=>s.a.book),'look');await p.locator('#pay').selectOption('4');await p.evaluate(()=>updatePayment());await p.locator('button[onclick="roll()"]').click();}
 assert.equal(await p.evaluate(()=>s.supply.includes(1699)),location===740&&choice===1);
 assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve].includes(1364)),location===740&&choice===1);
 assert.equal(await p.evaluate(()=>s.grid.includes(1020)),!(location===740&&choice===1));
 if(location===740&&choice===2)assert.equal(await p.evaluate(()=>s.boost[1020]),1);
 await p.locator('button[onclick="finish()"]').click();assert.equal(await p.evaluate(()=>s.loc),location===109&&choice===1?746:location);
 }
 assert.deepEqual(errors,[]);console.log('1020 地點條件、邀請／保留、指定導航四條分支通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
