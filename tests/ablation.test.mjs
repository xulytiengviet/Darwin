import test from "node:test";
import assert from "node:assert/strict";
import {CONDITIONS,PROMPTS,seedFor,runSeedAblation} from "../src/ablation.mjs";
test("preregistered seed conditions include random, Unicode and authentic CVNSS4.0 controls",()=>{
  assert.equal(CONDITIONS.length,5);assert.ok(PROMPTS.length>=5);
  for(const condition of CONDITIONS){
    const g=seedFor(condition,PROMPTS[0],314159);
    if(condition==="unseeded")assert.equal(g,undefined);
    else {assert.equal(g.length,24);assert.ok(g.every(n=>n>=0&&n<27));}
  }
  assert.notDeepEqual(seedFor("cvnss-seed",PROMPTS[0],12),seedFor("unicode-seed",PROMPTS[0],12));
});
test("paired ablation is deterministic, fixed budget, with valid uncertainty summaries",()=>{
  const opts={mode:"alife",trials:3,population:8,generations:7,mutation:.13,seed:37};
  const a=runSeedAblation(opts),b=runSeedAblation(opts);
  assert.deepEqual(a,b);assert.equal(a.rows.length,3*5);
  for(const condition of CONDITIONS){
    const s=a.summaries[condition];
    assert.equal(s.n,3);assert.equal(s.evaluationsPerArm,3*8*7);
    assert.ok(Number.isFinite(s.meanHeldout));
    assert.ok(s.pairedDeltaVsUnseeded.ci95[0]<=s.pairedDeltaVsUnseeded.ci95[1]);
  }
  assert.equal(a.summaries.unseeded.pairedDeltaVsUnseeded.estimate,0);
  assert.equal(a.status,"SYNTHETIC_ONLY");
});
test("no false genome claim when requested condition or mode is invalid",()=>{
  assert.throws(()=>seedFor("magical-ai",PROMPTS[0],1),RangeError);
  assert.throws(()=>runSeedAblation({mode:"invalid",trials:2}),RangeError);
});
