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
 for(const [id,animals] of [[923,[810,813,829]],[926,[819,825,827]],[947,[821,824,854]]])for(const help of [0,1])for(let option=1;option<=6;option++){
 await p.evaluate(({id,help})=>{const event='story:overpower:0'+id+':01',r=stories[event];s.grid=s.grid.map((v,i)=>i===4?v:0);s.grid[0]=id;s.reserve=[];s.unplaced=[];s.supply=[];s.skill=[0,0,0,help,0,0];s.boost[id]=1;s.stats=[4,4,4];s.a={id,event,kind:'卡牌',book:'overpower',name:r[5],title:r[5],text:r[1],dice:[]};s.phase='result';save();const original=throwDice;throwDice=()=>[4,0,0];selectBranch(2);throwDice=original;diceTray.close();},{id,help});
 await p.reload();
 if(help===0&&option%2===0){await p.evaluate(option=>selectBranch(option),option);assert.equal(await p.evaluate(()=>s.a.choice??null),null);continue;}
 await p.locator('button[onclick="selectBranch('+option+')"]').click();await p.reload();
 const animal=animals[Math.floor((option-1)/2)],keep=option%2===0;
 assert.deepEqual(await p.evaluate(animals=>[...s.grid,...s.reserve].filter(n=>animals.includes(n)),animals),[animal]);
 assert.equal(await p.evaluate(id=>s.grid.includes(id),id),keep);
 assert.equal(await p.evaluate(()=>s.skill[3]),help-(keep?1:0));
 if(!keep)assert.equal(await p.evaluate(id=>s.boost[id]??null,id),null);
 await p.evaluate(option=>selectBranch(option),option);await p.reload();
 assert.equal(await p.evaluate(()=>s.skill[3]),help-(keep?1:0));
 }
 assert.deepEqual(errors,[]);console.log('三種陷阱全部動物選項與幫助資源共三十六種組合通過');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)})
