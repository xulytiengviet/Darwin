/**
 * Darwin EvoDNA — deterministic, dependency-free educational evolution engine.
 * No AI model is trained here. All modes are synthetic benchmark proxies.
 * MIT License.
 */
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
export const MODES = Object.freeze(["alife","science","open","culture","universal"]);
export const MODE_NAMES = Object.freeze({
  alife:"EC / Artificial Life",
  science:"AI for Science (in-silico proxy)",
  open:"Open-ended / Model-guided search proxy",
  culture:"Cultural evolution / communication proxy",
  universal:"Universal evolutionary reasoning"
});
export const GENOME_SIZE = 24;
const cap=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));

export function hash32(input) {
  let h=2166136261;
  const b=new TextEncoder().encode(String(input));
  for(const v of b){h^=v;h=Math.imul(h,16777619);}
  return h>>>0;
}
export function prng(seed) {
  let s=(Number(seed)>>>0)||0x9e3779b9;
  return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};
}
export function indexToTrits(index) {
  if(!Number.isInteger(index)||index<0||index>26)throw new RangeError("Base27 index must be 0..26");
  let n=index-13; const a=[0,0,0];
  for(let p=2;p>=0;p--){const d=((n+1)%3+3)%3-1;a[p]=d;n=(n-d)/3;}
  return a;
}
export function tritsToIndex(trits) {
  if(!Array.isArray(trits)||trits.length!==3||!trits.every(t=>Number.isInteger(t)&&t>=-1&&t<=1))throw new RangeError("Expected three balanced trits");
  return 13+9*trits[0]+3*trits[1]+trits[2];
}
export function validateGenome(g) {return Array.isArray(g)&&g.length===GENOME_SIZE&&g.every(v=>Number.isInteger(v)&&v>=0&&v<=26);}
export function encodeGenome(g) {if(!validateGenome(g))throw new TypeError("Invalid genome");return g.map(x=>ALPHABET[x]).join("");}
export function decodeGenome(s) {
  if(typeof s!=="string"||s.length!==GENOME_SIZE)throw new TypeError("Expected exactly "+GENOME_SIZE+" symbols");
  const g=[...s].map(ch=>ALPHABET.indexOf(ch));
  if(!validateGenome(g))throw new TypeError("Unknown genome symbol");
  return g;
}
/** Stable Unicode-derived initialization; explicitly NOT a CVNSS4.0 converter or encryption. */
export function textToGenome(text) {
  if(typeof text!=="string"||!text.trim())throw new TypeError("Nonempty text required");
  const rnd=prng(hash32("darwin-v1/text/"+text.normalize("NFC")));
  return Array.from({length:GENOME_SIZE},()=>Math.floor(rnd()*27));
}
export function randomGenome(rnd) {return Array.from({length:GENOME_SIZE},()=>Math.floor(rnd()*27));}
/** Fixed-duration windows: dominant Goertzel frequency bucket -> 27 states.
 * Very lossy, timing-sensitive acoustic fingerprint. NOT speech recognition. */
export function audioToGenome(samples,sampleRate) {
  if(!samples||typeof samples.length!=="number"||samples.length<512||!Number.isFinite(sampleRate)||sampleRate<4000)throw new RangeError("Need >=512 audio samples at >=4000 Hz");
  const g=[];
  for(let z=0;z<GENOME_SIZE;z++){
    const a=Math.floor(z*samples.length/GENOME_SIZE);
    const b=Math.floor((z+1)*samples.length/GENOME_SIZE);
    const step=Math.max(1,Math.floor((b-a)/384));
    const points=[];let peak=0;
    for(let i=a;i<b;i+=step){const v=Number(samples[i])||0;points.push(v);peak=Math.max(peak,Math.abs(v));}
    if(peak<0.002||points.length<16){g.push(13);continue;}
    let best=0,bestEnergy=-1;
    for(let k=0;k<27;k++){
      const f=110*Math.pow(2,k/6);
      if(f>=sampleRate/2)break;
      const w=2*Math.PI*f*step/sampleRate;
      const coeff=2*Math.cos(w);let q0=0,q1=0,q2=0;
      for(const v of points){q0=v+coeff*q1-q2;q2=q1;q1=q0;}
      const power=q1*q1+q2*q2-coeff*q1*q2;
      if(power>bestEnergy){bestEnergy=power;best=k;}
    }
    g.push(best);
  }
  return g;
}
function targetFor(mode,epoch=0,holdout=false) {
  const r=prng(hash32("task-v1/"+mode+"/"+epoch));
  const g=randomGenome(r);
  if(holdout){for(let i=0;i<g.length;i+=5)g[i]=cap(g[i]+(i%2?2:-2),0,26);}
  return g;
}
function baseFit(g,t) {let sum=0;for(let i=0;i<g.length;i++)sum+=1-Math.abs(g[i]-t[i])/26;return sum/g.length;}
/** Synthetic task-specific score, not a biological, linguistic, or scientific fitness claim. */
export function scoreGenome(g,mode="alife",epoch=0,holdout=false) {
  if(!validateGenome(g))throw new TypeError("Invalid genome");
  if(!MODES.includes(mode))throw new RangeError("Unknown track");
  const t=targetFor(mode,epoch,holdout), similarity=baseFit(g,t);
  let aux=0;
  if(mode==="alife"){
    // Local repeated coordination patterns as a resource/locomotion proxy.
    for(let i=1;i<g.length;i++) aux+=1-Math.abs((g[i]-g[i-1])-(t[i]-t[i-1]))/52;
    aux/=g.length-1;
    return cap(.72*similarity+.28*aux);
  }
  if(mode==="science"){
    // Abstract shape agreement + regularity; NOT cells, flow or material mechanics.
    for(let i=0;i<g.length/2;i++)aux+=1-Math.abs((g[i]+g[g.length-1-i])-(t[i]+t[t.length-1-i]))/52;
    aux/=g.length/2;
    return cap(.65*similarity+.35*aux);
  }
  if(mode==="open"){
    // Multi-task synthetic objective. Actual LLM-driven proposals are NOT integrated.
    const t2=targetFor(mode,epoch+1,holdout);
    return cap(.72*similarity+.28*baseFit(g,t2));
  }
  if(mode==="culture"){
    // Codebook separation proxy: reward distinct early message symbols, not true communication.
    const unique=new Set(g.slice(0,8)).size/8;
    return cap(.7*similarity+.3*unique);
  }
  // Universal: robustness across environments, with changing tasks.
  const adjacent=targetFor(mode,epoch+1,holdout);
  return cap(.65*similarity+.35*Math.min(similarity,baseFit(g,adjacent)));
}
function diversity(pop) {
  if(pop.length<2)return 0;
  let s=0,c=0;
  for(let i=0;i<pop.length;i++)for(let j=i+1;j<pop.length;j++){
    let d=0;for(let z=0;z<GENOME_SIZE;z++)d+=pop[i][z]!==pop[j][z]?1:0;
    s+=d/GENOME_SIZE;c++;
  }
  return s/c;
}
function evolveChild(a,b,r,rate) {
  const g=a.map((v,i)=>r()<.5?v:b[i]);
  for(let i=0;i<g.length;i++)if(r()<rate)g[i]=r()<.65?cap(g[i]+(r()<.5?-1:1)*(1+Math.floor(r()*4)),0,26):Math.floor(r()*27);
  return g;
}
export function runExperiment(options={}) {
  const mode=options.mode||"alife";
  if(!MODES.includes(mode))throw new RangeError("Unknown mode");
  const popN=Math.floor(cap(Number(options.population)||36,8,100));
  const generations=Math.floor(cap(Number(options.generations)||45,2,120));
  const mutation=cap(options.mutation===undefined?.13:Number(options.mutation),.001,.75);
  const shift=Math.floor(cap(Number(options.shift)||12,2,100));
  const seed=Number(options.seed)>>>0;
  const r=prng(hash32("evolution-v1/"+seed+"/"+mode));
  // Keep diagnostic random sampling separate so plots do not perturb evolution RNG.
  const diagnosticRng=prng(hash32("random-diagnostic-v1/"+seed+"/"+mode));
  let pop=Array.from({length:popN},()=>randomGenome(r));
  // A supplied seed is heritable: initialize most individuals near the seed, and
  // retain a random subpopulation so that diversity is not artificially suppressed.
  const initial=typeof options.initialGenome==="string"?decodeGenome(options.initialGenome):options.initialGenome;
  if(initial!==undefined){
    if(!validateGenome(initial))throw new TypeError("initialGenome must be 24 Base27 indices");
    for(let i=0;i<Math.floor(popN*.7);i++)
      pop[i]=i===0?initial.slice():evolveChild(initial,initial,r,Math.max(.12,mutation*1.8));
  }
  const history=[],baseline=[],champions=[];
  let totalEvals=0, bestRandom=0;
  const generationEpoch=g=> (mode==="universal"||mode==="open")?Math.floor(g/shift):0;
  for(let gen=0;gen<generations;gen++){
    const epoch=generationEpoch(gen);
    const ranked=pop.map(g=>({g,f:scoreGenome(g,mode,epoch,false)})).sort((a,b)=>b.f-a.f);
    totalEvals+=pop.length;
    // Equal-budget, per-generation naive random sampling baseline (not training).
    let randomBest=0;
    for(let i=0;i<popN;i++)randomBest=Math.max(randomBest,scoreGenome(randomGenome(diagnosticRng),mode,epoch));
    bestRandom=Math.max(bestRandom,randomBest);
    const champ=ranked[0];
    const mean=ranked.reduce((a,b)=>a+b.f,0)/ranked.length;
    const holdout=scoreGenome(champ.g,mode,epoch,true);
    history.push({generation:gen+1,best:champ.f,mean,holdout,diversity:diversity(pop),random:randomBest,epoch});
    champions.push(encodeGenome(champ.g));
    const elites=ranked.slice(0,Math.max(2,Math.ceil(popN*.24))).map(x=>x.g);
    const next=[...elites.slice(0,Math.max(1,Math.floor(popN*.06))).map(g=>g.slice())];
    while(next.length<popN){
      const parent=()=>elites[Math.floor(Math.pow(r(),1.7)*elites.length)];
      next.push(evolveChild(parent(),parent(),r,mutation));
    }
    pop=next;
  }
  const last=history.at(-1);
  return {mode,seed,population:popN,generations,mutation,shift,history,champion:champions.at(-1),evaluations:totalEvals,diagnosticEvaluations:popN*generations,final:{best:last.best,holdout:last.holdout,diversity:last.diversity,random:last.random},note:"Synthetic toy benchmark; holdout changes parts of a fixed target; no LLM, biological or physical validation."};
}
function quantile(sorted,q) {
  const x=q*(sorted.length-1),i=Math.floor(x),w=x-i;
  return sorted[i]*(1-w)+sorted[Math.min(i+1,sorted.length-1)]*w;
}
/** Repeated simulation trajectories, NOT an empirical future forecast. */
export function simulatedOutlook(options={},replicates=24) {
  const n=Math.floor(cap(replicates,4,80)),runs=[];
  for(let k=0;k<n;k++)runs.push(runExperiment({...options,seed:(Number(options.seed)||0)+7919*k+1}));
  const history=runs[0].history.map((h,i)=>{
    const values=runs.map(r=>r.history[i].holdout).sort((a,b)=>a-b);
    return {generation:h.generation,mean:values.reduce((a,b)=>a+b,0)/values.length,p10:quantile(values,.1),p90:quantile(values,.9)};
  });
  return {replicates:n,history,final:history.at(-1),kind:"Monte Carlo simulated band; conditional on this toy task and its assumptions."};
}
