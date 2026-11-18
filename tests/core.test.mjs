import test from "node:test";
import assert from "node:assert/strict";
import {ALPHABET,indexToTrits,tritsToIndex,encodeGenome,decodeGenome,textToGenome,audioToGenome,scoreGenome,runExperiment,simulatedOutlook,MODES} from "../src/core.mjs";
import {cvnssToGenome} from "../src/cvnss-adapter.mjs";
test("Base27 alphabet is 27 distinct symbols",()=>assert.equal(new Set(ALPHABET).size,27));
test("balanced ternary bijection for all 27 values",()=>{
  for(let i=0;i<27;i++){const t=indexToTrits(i);assert.equal(t.length,3);assert.ok(t.every(x=>[-1,0,1].includes(x)));assert.equal(tritsToIndex(t),i);}
});
test("text-derived seed is deterministic and has provenance",()=>{
  const a=textToGenome("Tiếng Việt - Darwin");assert.deepEqual(a,textToGenome("Tiếng Việt - Darwin"));assert.equal(decodeGenome(encodeGenome(a)).length,24);
  assert.match(cvnssToGenome("Tiếng Việt").provenance,/NOT CVNSS4.0/);
  assert.match(cvnssToGenome("Tiếng Việt",()=> "EXAMPLE").provenance,/supplied/);
});
test("audio-derived seed produces valid 27-state fingerprint",()=>{
  const sr=16000;const f=new Float32Array(sr);for(let i=0;i<f.length;i++)f[i]=Math.sin(2*Math.PI*440*i/sr)*.4;
  const g=audioToGenome(f,sr);assert.equal(g.length,24);assert.equal(encodeGenome(g).length,24);
});
test("five benchmark tracks are finite and reproducible",()=>{
  for(const mode of MODES){
    const opts={mode,seed:15,population:20,generations:12,mutation:.15,shift:4};
    const a=runExperiment(opts),b=runExperiment(opts);
    assert.deepEqual(a.history,b.history);
    assert.equal(a.history.length,12);
    assert.equal(a.evaluations,240);
    assert.ok(a.history.every(h=>Number.isFinite(h.best)&&h.best>=0&&h.best<=1&&h.diversity>=0&&h.diversity<=1));
    assert.ok(Number.isFinite(scoreGenome(decodeGenome(a.champion),mode,0,true)));
  }
});
test("Monte Carlo intervals are ordered",()=>{
  const out=simulatedOutlook({mode:"alife",seed:5,generations:9,population:12,mutation:.12},6);
  assert.equal(out.replicates,6);
  assert.ok(out.history.every(h=>h.p10<=h.mean && h.mean<=h.p90));
});
