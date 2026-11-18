/**
 * Darwin EvoDNA v0.2 — pre-registered synthetic seed ablation.
 * All results are CONDITIONAL ON THE ARTIFICIAL TASK GENERATOR.
 * No semantic understanding or scientific advantage is established here.
 */
import {GENOME_SIZE, MODES, hash32, prng, randomGenome, textToGenome, runExperiment} from "./core.mjs";
import {cvnssToGenome} from "./cvnss-adapter.mjs";
import "../vendor/cvnss-converter.js";

export const CONDITIONS=Object.freeze(["unseeded","random-seed","unicode-seed","cvnss-seed","cvnss-shuffled-control"]);
export const PROMPTS=Object.freeze([
  "Tiến hóa một hệ thống biết thích nghi với môi trường thay đổi",
  "Học cách phối hợp để giải quyết nhiệm vụ mới",
  "Bảo toàn sự đa dạng của quần thể khi môi trường biến đổi",
  "Tối ưu hóa hành vi với chi phí thử nghiệm giới hạn",
  "Hệ thống tạo ra ký hiệu và học bằng phản hồi",
  "Kiểm chứng kết quả tiến hóa trên dữ liệu độc lập",
  "Mô hình cần có khả năng sửa sai và học liên tục",
  "Cấu trúc gen phát triển thông qua chọn lọc và đột biến"
]);

const round=(n)=>Math.round(n*1000000)/1000000;
const average=a=>a.reduce((s,v)=>s+v,0)/a.length;
const sort=a=>[...a].sort((x,y)=>x-y);
const percentile=(a,p)=>{const sorted=sort(a),v=(sorted.length-1)*p,i=Math.floor(v),f=v-i;return sorted[i]*(1-f)+sorted[Math.min(i+1,sorted.length-1)]*f;};
const normalize=(v,d,min,max)=>Math.max(min,Math.min(max,Number.isFinite(+v)?Math.floor(+v):d));
function shuffledWords(text) {return text.trim().split(/\s+/).reverse().join(" ");}
function authenticConverter(text) {
  const cv=globalThis.CVNSSConverter;
  if(!cv||typeof cv.convert!=="function")throw new Error("Audited CVNSS4.0 converter unavailable");
  return cv.convert(text,"cqn").cvss;
}
export function seedFor(condition,prompt,trialSeed) {
  if(!CONDITIONS.includes(condition))throw new RangeError("Unknown condition");
  if(condition==="unseeded")return undefined;
  if(condition==="random-seed")return randomGenome(prng(hash32("darwin-abl/random/"+trialSeed)));
  if(condition==="unicode-seed")return textToGenome(prompt);
  if(condition==="cvnss-seed")return cvnssToGenome(prompt,authenticConverter).genome;
  return cvnssToGenome(shuffledWords(prompt),authenticConverter).genome;
}
function bootstrapMeanDelta(deltas,seed=12345,repetitions=1000) {
  if(!deltas.length)throw new RangeError("Empty paired results");
  const rnd=prng(seed),values=[];
  for(let k=0;k<repetitions;k++){
    let s=0;for(let i=0;i<deltas.length;i++)s+=deltas[Math.floor(rnd()*deltas.length)];
    values.push(s/deltas.length);
  }
  return {estimate:round(average(deltas)),ci95:[round(percentile(values,.025)),round(percentile(values,.975))]};
}
export function runSeedAblation(options={}) {
  const mode=options.mode||"alife";
  if(!MODES.includes(mode))throw new RangeError("Invalid benchmark");
  const trials=normalize(options.trials,20,2,150);
  const population=normalize(options.population,28,8,100);
  const generations=normalize(options.generations,35,2,120);
  const mutation=options.mutation===undefined?.13:Number(options.mutation);
  if(!Number.isFinite(mutation)||mutation<=0||mutation>.75)throw new RangeError("Mutation 0..0.75");
  const baseSeed=normalize(options.seed,2026,0,4294967295);
  const conditions=options.conditions||CONDITIONS;
  if(!Array.isArray(conditions)||!conditions.includes("unseeded")||!conditions.every(c=>CONDITIONS.includes(c)))throw new TypeError("At least unseeded and valid conditions required");
  const rows=[];
  for(let trial=0;trial<trials;trial++){
    const prompt=PROMPTS[trial%PROMPTS.length], trialSeed=hash32("darwin-abl/trial/"+baseSeed+"/"+trial);
    for(const condition of conditions){
      const initialGenome=seedFor(condition,prompt,trialSeed);
      const run=runExperiment({mode,seed:trialSeed,population,generations,mutation,shift:Math.max(2,Math.floor(generations/3)),
        ...(initialGenome?{initialGenome}:{})});
      rows.push({trial,condition,mode,seed:trialSeed,promptIndex:trial%PROMPTS.length,
        best:round(run.final.best),holdout:round(run.final.holdout),
        diversity:round(run.final.diversity),evaluations:run.evaluations});
    }
  }
  const grouped=Object.fromEntries(conditions.map(c=>[c,rows.filter(r=>r.condition===c)]));
  const reference=grouped.unseeded;
  const summaries=Object.fromEntries(conditions.map(c=>{
    const subset=grouped[c],deltas=subset.map((r,i)=>r.holdout-reference[i].holdout);
    return [c,{n:subset.length,meanHeldout:round(average(subset.map(r=>r.holdout))),
      medianHeldout:round(percentile(subset.map(r=>r.holdout),.5)),
      meanTraining:round(average(subset.map(r=>r.best))),
      meanDiversity:round(average(subset.map(r=>r.diversity))),
      pairedDeltaVsUnseeded:bootstrapMeanDelta(deltas,hash32("bootstrap/"+baseSeed+"/"+mode+"/"+c)),
      evaluationsPerArm:subset.reduce((s,r)=>s+r.evaluations,0)}];
  }));
  return {
    schema:"darwin-seed-ablation-v1", status:"SYNTHETIC_ONLY",
    preRegistration:"docs/PREREGISTRATION.md", code:"src/ablation.mjs",
    conditions, configuration:{mode,trials,population,generations,mutation,seed:baseSeed,genomeSymbols:GENOME_SIZE},
    summaries, rows, limitations:[
      "The task generator is artificial, not a grounded language or world task.",
      "Held-out is a target perturbation in the SAME synthetic task family, not independently collected data.",
      "Hashing CVNSS4.0 output destroys linguistic compositional information; this tests initialization, NOT semantic inheritance.",
      "Balanced ternary is a bijective recoding of Base27 here, not physical ternary hardware.",
      "Bootstrap intervals quantify stochastic variation of this benchmark only; repeated prompts are not independent linguistic samples.",
      "Fitness is not evidence of LLM self-generation, actual cultural evolution, or xenobot control."
    ]
  };
}
