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

  // 1. 0400 Balloon 4 destinations (endsTurn: true)
  for(let c=1;c<=4;c++){
   const expectedDest=[234,616,606,199][c-1];
   await p.evaluate(()=>{
    const event='story:engage:0400:01',r=stories[event];
    s.loc=400;s.money=5;s.stats=[4,4,4];s.skill=[0,0,0,0,0,0];s.used=[];
    s.a={id:400,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};
    s.phase='result';save();
   });
   assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),4);
   await p.locator('button[onclick="selectBranch('+c+')"]').click();
   assert.equal(await p.evaluate(()=>s.loc),expectedDest);
  }

  // 2. 0356 Warehouse 2 choices (endsTurn: true)
  for(let c=1;c<=2;c++){
   const expectedDest=c===1?578:497;
   await p.evaluate(()=>{
    const event='story:depart:0356:02',r=stories[event];
    s.loc=356;s.money=5;s.stats=[4,4,4];s.skill=[0,0,0,0,0,0];s.used=[];
    s.a={id:356,event,kind:'離開',book:'depart',name:r[5],title:r[5],text:r[1],dice:[]};
    s.phase='result';save();
   });
   assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
   await p.locator('button[onclick="selectBranch('+c+')"]').click();
   assert.equal(await p.evaluate(()=>s.loc),expectedDest);
  }

  // 3. 0161 Companion 1315 vs $5 (endsTurn: false)
  for(let c=1;c<=2;c++){
   await p.evaluate(()=>{
    const event='story:engage:0161:01',r=stories[event];
    s.loc=161;s.money=0;s.stats=[4,4,4];s.skill=[0,0,0,0,0,0];s.supply=[];s.used=[];
    s.a={id:161,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};
    s.phase='result';save();
   });
   assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
   await p.locator('button[onclick="selectBranch('+c+')"]').click();
   await p.locator('button[onclick="finish()"]').click();
   if(c===1)assert.equal(await p.evaluate(()=>s.money),5);
   if(c===2)assert.equal(await p.evaluate(()=>[...s.grid,...s.reserve,...s.supply].includes(1315)),true);
  }

  // 4. 0640 Bribe Guard (endsTurn: true)
  for(let c=1;c<=2;c++){
   const expectedDest=c===1?641:582;
   await p.evaluate(()=>{
    const event='story:engage:0640:01',r=stories[event];
    s.loc=640;s.money=0;s.stats=[4,4,4];s.skill=[0,0,0,0,0,0];s.supply=[];s.used=[];
    s.a={id:640,event,kind:'地點',book:'engage',name:r[5],title:r[5],text:r[1],dice:[]};
    s.phase='result';save();
   });
   assert.equal(await p.locator('button[onclick^="selectBranch("]').count(),2);
   await p.locator('button[onclick="selectBranch('+c+')"]').click();
   assert.equal(await p.evaluate(()=>s.loc),expectedDest);
  }

  assert.deepEqual(errors,[]);
  console.log('新修復故事分支（400氣球、356倉庫、161服務、640守衛）驗證通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
