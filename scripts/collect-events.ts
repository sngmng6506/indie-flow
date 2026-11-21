import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {SOURCES,extractEvents,dedupe,type Candidate} from './collect-events-lib.ts';
const MAX_BYTES=1_000_000;
const timeout=12000;
const args=process.argv.slice(2);
const dryRun=!args.includes('--import-json');
const output=args.includes('--output')?args[args.indexOf('--output')+1]:'data/collected-events.json';
const mappingPath=args.includes('--venues')?args[args.indexOf('--venues')+1]:'data/venue-ids.json';
const selected=args.includes('--source')?args[args.indexOf('--source')+1]:null;
if(selected&&!SOURCES.some(s=>s.id===selected))throw Error('Unknown source: '+selected);
const mappings:Record<string,number>=await readFile(mappingPath,'utf8').then(JSON.parse).catch(()=>({}));
const candidates:Candidate[]=[];
const report:{source:string;status:string;count:number;reason?:string}[]=[];
for(const source of SOURCES.filter(s=>!selected||s.id===selected)){
  try{
    const response=await fetch(source.url,{signal:AbortSignal.timeout(timeout),redirect:'follow',headers:{'user-agent':'IndieFlowEventResearch/0.1 (+https://github.com/sngmng6506/indie-flow)','accept':'text/html'}});
    if(!response.ok)throw Error('HTTP '+response.status);
    if(!response.headers.get('content-type')?.includes('text/html'))throw Error('Unexpected content-type');
    const html=await response.text();
    if(Buffer.byteLength(html)>MAX_BYTES)throw Error('Page exceeds 1MB');
    const extracted=extractEvents(html,source);
    candidates.push(...extracted);
    report.push({source:source.id,status:'ok',count:extracted.length,reason:extracted.length===0?'No unambiguous JSON-LD MusicEvent with timezone; manual review required':undefined});
  }catch(e){report.push({source:source.id,status:'error',count:0,reason:e instanceof Error?e.message:String(e)});}
}
const unique=dedupe(candidates);
const importable=unique.filter(e=>Number.isSafeInteger(mappings[e.venue])&&mappings[e.venue]>0);
const missing=unique.filter(e=>!Number.isSafeInteger(mappings[e.venue])||mappings[e.venue]<=0);
const payload=importable.map(e=>({
  venueId:mappings[e.venue],title:e.title,startsAt:e.startsAt,
  sourceUrl:e.sourceUrl,sourceName:e.sourceName,lineup:e.lineup,summary:e.summary,
  doorPrice:e.doorPrice,advancePrice:e.advancePrice,ticketUrl:e.ticketUrl,
  previewUrl:e.previewUrl,posterUrl:e.posterUrl
}));
await mkdir('data',{recursive:true});
await writeFile('data/collection-report.json',JSON.stringify({collectedAt:new Date().toISOString(),sources:report,candidates:unique,missingVenueMappings:missing.map(e=>e.venue)},null,2));
if(!dryRun){
  await mkdir(new URL('.',new URL(output,'file://'+process.cwd()+'/')).pathname,{recursive:true});
  await writeFile(output,JSON.stringify(payload,null,2));
}
console.log(JSON.stringify({sources:report,candidates:unique.length,importable:payload.length,missingVenueMappings:[...new Set(missing.map(e=>e.venue))],report:'data/collection-report.json',output:dryRun?null:output},null,2));
if(report.every(r=>r.status==='error'))process.exitCode=1;
