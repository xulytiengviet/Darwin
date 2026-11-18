import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {Script} from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("page has all required static module and styles",()=>{
  const html=read("index.html");
  assert.ok(html.includes('lang="vi"'));
  for(const p of ["assets/style.css","assets/app.js","src/core.mjs","src/cvnss-adapter.mjs"])
    assert.ok(existsSync(new URL("../"+p,import.meta.url)),"Missing "+p);
});
test("every directly referenced UI id exists",()=>{
  const html=read("index.html"),app=read("assets/app.js");
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const direct=[...app.matchAll(/el\("([^"]+)"\)/g)].map(m=>m[1]);
  for(const id of direct)assert.ok(ids.has(id),"Undeclared element: "+id);
  for(const id of ["populationValue","generationsValue","mutationValue","shiftValue"])
    assert.ok(ids.has(id));
});
test("browser controller is parseable with ESM imports removed",()=>{
  const app=read("assets/app.js").replace(/^import .*?;$/gm,"");
  assert.doesNotThrow(()=>new Script(app,{filename:"assets/app.js"}));
});
