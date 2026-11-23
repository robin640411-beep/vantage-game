const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const files=fs.readdirSync(__dirname).filter(n=>n.endsWith('.cjs')&&n!=='run.cjs').sort();
let failures=0;
for(const file of files){
 console.log('TEST '+file);
 const result=spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit',timeout:['preparation-options.cjs','element-preparation.cjs'].includes(file)?180000:60000});
 if(result.status!==0){failures++;console.error('FAIL '+file,result.error?.message||result.status);}
}
console.log(`${files.length-failures}/${files.length} suites passed`);
process.exitCode=failures?1:0;
