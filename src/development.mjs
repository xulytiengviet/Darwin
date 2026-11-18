/**
 * Minimal, executable *developmental interpreter* for a Base27 trit genome.
 * Toy discrete finite-state phenotype; not a language model, real robot policy,
 * biological organism, or demonstration of autonomous intelligence.
 */
import {validateGenome,indexToTrits,encodeGenome} from "./core.mjs";

export function developAgent(genome) {
  if(!validateGenome(genome))throw new TypeError("Expected 24-symbol Base27 genome");
  const transitionTable=[];
  // Nine triples (3 internal states × 3 quantized observations).
  // Each instruction uses two base27 genes with 6 trits altogether.
  for(let state=0;state<3;state++){
    const row=[];
    for(let observation=0;observation<3;observation++){
      const i=2*(state*3+observation);
      const a=indexToTrits(genome[i]),b=indexToTrits(genome[i+1]);
      row.push(Object.freeze({
        action:a[0],                    // -1, 0, 1: left, stay, right
        nextState:(state+a[1]+3)%3,
        message:a[2],                   // symbolic, not grounded semantics
        energyCost:1+(b[0]+1),          // cost in artificial units 1..3
        confidence:b[1],                // auxiliary ternary output
        flag:b[2]                       // auxiliary ternary output
      }));
    }
    transitionTable.push(Object.freeze(row));
  }
  const context=indexToTrits(genome[18]);
  const energyBudget=20+Math.floor(genome[19]/3);
  return Object.freeze({
    genotype:encodeGenome(genome),
    interpreter:"3-state ternary finite-state agent v1",
    transitionTable:Object.freeze(transitionTable),
    initialState:context[1]+1,
    initialEnergy:energyBudget,
    policyParams:Object.freeze({adaptation:genome[20],memory:genome[21],threshold:genome[22],reserved:genome[23]})
  });
}
export function executeAgent(phenotype,observations) {
  if(!phenotype?.transitionTable||!Array.isArray(observations))throw new TypeError("Missing phenotype or observations");
  let state=phenotype.initialState,energy=phenotype.initialEnergy,position=0;
  const trace=[];
  for(const observation of observations) {
    if(!Number.isInteger(observation)||observation<0||observation>2)throw new RangeError("Observation must be 0..2");
    if(energy<=0)break;
    const instruction=phenotype.transitionTable[state][observation];
    if(instruction.energyCost>energy)break;
    energy-=instruction.energyCost;
    position+=instruction.action;
    trace.push({observation,oldState:state,newState:instruction.nextState,position,message:instruction.message,energy});
    state=instruction.nextState;
  }
  return {position,state,energy,trace,executed:trace.length};
}
