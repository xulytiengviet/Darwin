#!/usr/bin/env node
/** Offline, deterministic, no network calls. Run from Node.js >=20. */
import {mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {runSeedAblation} from "../src/ablation.mjs";
const args=process.argv.slice(2);
function get(name,def){const i=args.indexOf("--"+name);return i<0?def:args[i+1];}
const options={
 mode:get("mode","alife"),
 trials:Number(get("trials","20")),
 population:Number(get("population","28")),
 generations:Number(get("generations","35")),
 mutation:Number(get("mutation","0.13")),
 seed:Number(get("seed","2026"))
};
const result=runSeedAblation(options);
const summary={schema:result.schema,status:result.status,configuration:result.configuration,summaries:result.summaries,limitations:result.limitations};
const out=get("out",null);
if(out){
 const path=resolve(out);await mkdir(dirname(path),{recursive:true});
 await writeFile(path,JSON.stringify(result,null,2)+"\n","utf8");
 console.log("Wrote reproducibility artifact:",path);
}
console.log(JSON.stringify(summary,null,2));
