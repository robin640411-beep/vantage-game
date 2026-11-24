const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(dist,'world.js'),'utf8')+'\n'+fs.readFileSync(path.join(dist,'story.js'),'utf8'),context);
const data=JSON.parse(vm.runInContext(`JSON.stringify({stories:WORLD.stories,cards:WORLD.cards,parts:Object.fromEntries(Object.entries(WORLD.stories).map(([id,row])=>{try{return [id,storyParts(row[1])]}catch(e){return [id,{error:String(e)}]}}))})`,context));
const evidenceFile=path.join(__dirname,'review-evidence.json'),evidence=fs.existsSync(evidenceFile)?JSON.parse(fs.readFileSync(evidenceFile,'utf8')):{};
const actionRefs={};
for(const [card,c]of Object.entries(data.cards))for(const a of c.actions||[])(actionRefs[a.event_uid]??=[]).push({card:Number(card),action:a.action_uid,name:a.action});
const inventory=Object.entries(data.stories).map(([id,row])=>{
 const parts=data.parts[id],text=row[1],record=evidence[id],hash=crypto.createHash('sha256').update(text).digest('hex');
 return {id,book:id.split(':')[1],entry:row[0],title:row[5],cost:row[2],actionReferences:actionRefs[id]||[],text,sha256:hash,choiceLanguage:/選擇|或者|或是|你可以|是否|如果|否則|若/.test(text),parsedChoices:parts.branched?parts.parts.slice(1):[],parserError:parts.error||null,review:record?{...record,textChanged:record.sha256!==hash}:{status:'unreviewed'}};
});
const stats={total:inventory.length,withDirectAction:inventory.filter(x=>x.actionReferences.length).length,choiceLanguage:inventory.filter(x=>x.choiceLanguage).length,parsedBranch:inventory.filter(x=>x.parsedChoices.length).length,parserErrors:inventory.filter(x=>x.parserError).length,evidenceRecords:Object.keys(evidence).length,unreviewed:inventory.filter(x=>x.review.status==='unreviewed').length};
fs.writeFileSync(path.join(__dirname,'story-inventory.json'),JSON.stringify({notice:'Inventory only. Parser matches, test references and absence of flags do not prove rules correctness or completion.',stats,stories:inventory},null,2)+'\n');
console.log(JSON.stringify(stats,null,2));
