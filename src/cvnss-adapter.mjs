/**
 * Adapter contract for the independently maintained, audited CVNSS4.0 converter.
 * A converter MUST be explicitly supplied; this file does not silently pretend
 * that a hash or Unicode normalization is CVNSS4.0.
 */
import {textToGenome,hash32,prng,GENOME_SIZE} from "./core.mjs";
export function cvnssToGenome(text,converter) {
  if(typeof converter!=="function")return {genome:textToGenome(text),provenance:"Unicode seed hash (fallback; NOT CVNSS4.0)"};
  const encoded=converter(String(text));
  if(typeof encoded!=="string"||!encoded.length)throw new TypeError("Converter must return nonempty CVNSS4.0 string");
  const rnd=prng(hash32("darwin-v1/cvnss/"+encoded));
  return {genome:Array.from({length:GENOME_SIZE},()=>Math.floor(rnd()*27)),provenance:"CVNSS4.0 converter supplied by host; symbolic hash"};
}
