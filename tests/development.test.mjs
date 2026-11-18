import test from "node:test";
import assert from "node:assert/strict";
import {textToGenome,encodeGenome} from "../src/core.mjs";
import {developAgent,executeAgent} from "../src/development.mjs";

test("developmental interpreter reproducibly generates an executable phenotype",()=>{
 const genotype=textToGenome("Darwin genome test");
 const a=developAgent(genotype),b=developAgent(genotype);
 assert.deepEqual(a,b);
 assert.equal(a.transitionTable.length,3);
 assert.equal(a.transitionTable[0].length,3);
 const x=executeAgent(a,[0,1,2,0,2,1]),y=executeAgent(b,[0,1,2,0,2,1]);
 assert.deepEqual(x,y);assert.ok(x.executed>0);
 assert.equal(a.genotype,encodeGenome(genotype));
 for(const e of x.trace){assert.ok(e.newState>=0&&e.newState<=2);assert.ok([-1,0,1].includes(e.message));}
});
test("finite state agent rejects invalid observations",()=>{
 assert.throws(()=>executeAgent(developAgent(textToGenome("x")),[3]),RangeError);
});
