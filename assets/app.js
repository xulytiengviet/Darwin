import "../vendor/cvnss-converter.js";
import {indexToTrits,encodeGenome,audioToGenome,runExperiment,simulatedOutlook,MODE_NAMES} from "../src/core.mjs";
import {cvnssToGenome} from "../src/cvnss-adapter.mjs";
const el=id=>document.getElementById(id);
const tracks={
  alife:{description:"Tiến hóa bộ gen trên benchmark tổng hợp về phối hợp cục bộ, khớp mẫu mục tiêu và tính nhất quán giữa các ký hiệu liên tiếp.",hypothesis:"Bộ gen có cấu trúc và chọn lọc cải thiện fitness trên mục tiêu thử nghiệm hơn random search với cùng ngân sách.",controls:"Random search, mutation-only, fixed grammar, binary vs ternary, đa seed.",limitation:"Chỉ có hàm fitness toán học; chưa có chuyển hóa, sinh sản và môi trường Artificial Life vật lý."},
  science:{description:"Tìm cấu hình hình thái trong một surrogate hình học. Xenobot-inspired toy proxy, không có tế bào sống hay điều khiển sinh học.",hypothesis:"Chọn lọc với ràng buộc hình thái có thể giảm số lần gọi bộ đánh giá surrogate đắt đỏ.",controls:"Random search, Bayesian optimization, evolution strategies, chi phí đánh giá.",limitation:"Không mô phỏng mô hình tế bào, dòng chảy, sinh hóa, hình thái thật hoặc khả năng điều khiển xenobot."},
  open:{description:"Bài toán hai mục tiêu tổng hợp với môi trường thay đổi; phiên bản này CHƯA gọi LLM hoặc tự sửa code.",hypothesis:"Lưu trữ nhiều dòng biến thể và kiểm thử độc lập giúp cải thiện năng lực thích nghi trong một số tác vụ.",controls:"Random search, no-LLM evolution, LLM-only search ở backend tương lai, matched budgets.",limitation:"Chưa có LLM-driven mutation thực; chỉ là proxy có kiểm chứng."},
  culture:{description:"Đánh giá toy codebook trên Base27: tính khác biệt tín hiệu và khớp mục tiêu. Chưa có đa tác tử tương tác thật.",hypothesis:"Giao thức được truyền lại, có grounding, có thể nâng hiệu quả phối hợp giữa tác tử.",controls:"No communication, static protocol, random protocol, synthetic-only replay.",limitation:"Chưa mô phỏng hiểu ngữ nghĩa, ngữ pháp phát sinh hoặc truyền văn hóa thực."},
  universal:{description:"Bộ benchmark có phân phối mục tiêu thay đổi theo chu kỳ; thử nghiệm độ bền của quần thể trong môi trường phi tĩnh.",hypothesis:"Giữ đa dạng và đánh giá đa môi trường có thể giảm suy giảm khi mục tiêu thay đổi.",controls:"Single-best optimizer, diversity preservation, no-drift, hidden environment changes.",limitation:"Goodhart/reward hacking chưa được tạo thành adversarial evaluator độc lập."}
};
let mode="alife",genome=null,provenance="",lastRun=null,lastForecast=null,recorder=null,stream=null;
function renderMode(){
 const t=tracks[mode];el("modeTitle").textContent=MODE_NAMES[mode];el("resultTitle").textContent=MODE_NAMES[mode];
 for(const [id,key] of [["modeDescription","description"],["hypothesis","hypothesis"],["controls","controls"],["limitation","limitation"]])el(id).textContent=t[key];
 document.querySelectorAll(".track").forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));});
 lastRun=null;lastForecast=null;el("runStatus").textContent="CHƯA CHẠY";
 for(const id of ["fitnessMetric","holdoutMetric","diversityMetric","evalMetric","finalGenome"])el(id).textContent="—";
 el("exportBtn").disabled=true;el("forecastText").textContent="Chưa chạy Monte Carlo. Dải chỉ phản ánh biến thiên trong mô hình tổng hợp.";
 drawChart([]);drawForecast([]);
}
function setGenome(g,p){
 genome=g;provenance=p;el("genomeDisplay").textContent=encodeGenome(g);
 el("tritDisplay").textContent=g.slice(0,8).map(i=>indexToTrits(i).map(v=>v===-1?"−":v===1?"+":"0").join("")).join("  ")+" …";
 el("seedStatus").textContent=p+" · 24 symbols, 72 trits. Không mặc nhiên có ngữ nghĩa.";
}
function makeTextSeed(){
 try{const cv=window.CVNSSConverter;
 const fn=cv&&typeof cv.convert==="function"?(text)=>cv.convert(text,"cqn").cvss:null;
 const r=cvnssToGenome(el("seedText").value,fn);setGenome(r.genome,r.provenance);}
 catch(e){el("seedStatus").textContent="Lỗi seed: "+e.message;}
}
function options(){
 return {mode,seed:Number(el("numericSeed").value)||0,population:Number(el("population").value),
 generations:Number(el("generations").value),mutation:Number(el("mutation").value)/100,
 shift:Number(el("shift").value),...(genome?{initialGenome:genome.slice()}:{})};
}
function drawChart(rows){
 const s=el("fitnessChart"),x=i=>43+642*(rows.length<2?0:i/(rows.length-1)),y=v=>14+240*(1-v);
 let h="";
 for(let i=0;i<=4;i++){const v=i/4;h+='<line x1="43" y1="'+y(v)+'" x2="685" y2="'+y(v)+'" stroke="#e9eef3"/><text x="34" y="'+(y(v)+4)+'" text-anchor="end" font-size="11" fill="#8796a5">'+v.toFixed(2)+'</text>';}
 h+='<text x="685" y="280" text-anchor="end" font-size="11" fill="#8796a5">generation →</text>';
 if(rows.length){
   for(const [name,color] of [["random","#b2c5cf"],["mean","#d6b26d"],["holdout","#5274d1"],["best","#148f7c"]]){
     const d=rows.map((r,i)=>(i?"L":"M")+x(i).toFixed(2)+" "+y(r[name]).toFixed(2)).join(" ");
     h+='<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+(name==="best"?3:2)+'" stroke-linecap="round"/>';
   }
   h+='<circle cx="'+x(rows.length-1)+'" cy="'+y(rows[rows.length-1].best)+'" r="4" fill="#148f7c"/>';
 }else h+='<text x="350" y="142" fill="#9eacb9" text-anchor="middle" font-size="14">No experimental data yet</text>';
 s.innerHTML=h;
}
function drawForecast(rows){
 const s=el("forecastChart");
 if(!rows.length){s.innerHTML='<text x="350" y="64" text-anchor="middle" font-size="12" fill="#9aa9b7">No Monte Carlo results</text>';return;}
 const x=i=>43+643*i/Math.max(1,rows.length-1),y=v=>10+95*(1-v);
 const up=rows.map((r,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(r.p90).toFixed(1)).join(" ");
 const lo=rows.map((r,i)=>"L"+x(rows.length-1-i).toFixed(1)+" "+y(rows[rows.length-1-i].p10).toFixed(1)).join(" ");
 const mean=rows.map((r,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(r.mean).toFixed(1)).join(" ");
 s.innerHTML='<path d="'+up+" "+lo+' Z" fill="#b8e5d9" opacity=".73"/><path d="'+mean+'" stroke="#118270" stroke-width="2.5" fill="none"/><text x="5" y="'+(y(.5)+4)+'" font-size="10" fill="#8da0b0">.50</text>';
}
async function simulate(kind){
 if(!genome)makeTextSeed();if(!genome)return;
 el("runBtn").disabled=true;el("outlookBtn").disabled=true;
 el("runStatus").textContent=kind==="outlook"?"MONTE CARLO…":"ĐANG TÍNH…";
 await new Promise(r=>setTimeout(r,20));
 try{
  if(kind==="evolution"){
    lastRun=runExperiment(options());lastForecast=null;
    const v=lastRun.final;
    el("fitnessMetric").textContent=v.best.toFixed(3);el("holdoutMetric").textContent=v.holdout.toFixed(3);
    el("diversityMetric").textContent=v.diversity.toFixed(3);el("evalMetric").textContent=lastRun.evaluations.toLocaleString("vi-VN");
    el("finalGenome").textContent=lastRun.champion;el("exportBtn").disabled=false;
    el("chartCaption").textContent="Fitness theo hàm synthetic. Hold-out là mục tiêu nhiễu trong cùng họ benchmark, không phải dữ liệu thực.";
    drawChart(lastRun.history);drawForecast([]);el("runStatus").textContent="MÔ PHỎNG XONG";
  }else{
    lastForecast=simulatedOutlook(options(),24);const v=lastForecast.final;
    drawForecast(lastForecast.history);
    el("forecastText").textContent="Sau "+lastForecast.history.length+" thế hệ giả lập: mean held-out = "+v.mean.toFixed(3)+", phân vị 10–90% = ["+v.p10.toFixed(3)+", "+v.p90.toFixed(3)+"]. Không phải confidence interval từ dữ liệu thực hoặc dự báo thành công.";
    el("runStatus").textContent="24 LẦN CHẠY MÔ PHỎNG";
  }
 }catch(e){el("runStatus").textContent="LỖI";el("chartCaption").textContent="Simulation error: "+e.message;}
 finally{el("runBtn").disabled=false;el("outlookBtn").disabled=false;}
}
function exportData(){
 if(!lastRun)return;
 const data={schema:"darwin-evodna-v0.1",createdAt:new Date().toISOString(),provenance,configuration:options(),experiment:lastRun,monteCarlo:lastForecast,disclaimer:"Synthetic only; no model training or biological validation"};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="darwin-evodna-experiment.json";document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function toggleMic(){
 if(recorder&&recorder.state==="recording"){recorder.stop();el("micBtn").textContent="🎙 Ghi tiếng nói";el("seedStatus").textContent="Đang giải mã bản ghi cục bộ…";return;}
 try{
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error("Cần HTTPS/localhost và MediaRecorder");
  stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const chunks=[];recorder=new MediaRecorder(stream);
  recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data);};
  recorder.onerror=()=>{el("seedStatus").textContent="Không thể ghi âm.";stream?.getTracks().forEach(t=>t.stop());};
  recorder.onstop=async()=>{
    stream?.getTracks().forEach(t=>t.stop());stream=null;
    const Ctx=window.AudioContext||window.webkitAudioContext;let ctx;
    try{
      ctx=new Ctx();
      const ab=await new Blob(chunks,{type:chunks[0]?.type||"audio/webm"}).arrayBuffer();
      const decoded=await ctx.decodeAudioData(ab);
      let samples=decoded.getChannelData(0);
      if(decoded.numberOfChannels>1){const right=decoded.getChannelData(1);samples=Float32Array.from(samples,(v,i)=>(v+right[i])*.5);}
      setGenome(audioToGenome(samples,decoded.sampleRate),"Audio-derived lossy spectral seed (NOT ASR / CVNSS4.0)");
    }catch(e){el("seedStatus").textContent="Giải mã âm thanh thất bại: "+e.message;}
    finally{if(ctx)await ctx.close();}
  };
  recorder.start();el("micBtn").textContent="■ Dừng ghi";
  el("seedStatus").textContent="Ghi âm trên trình duyệt; nhấn Dừng ghi để tạo acoustic seed. Không tải audio lên máy chủ.";
 }catch(e){stream?.getTracks().forEach(t=>t.stop());stream=null;el("seedStatus").textContent="Microphone: "+e.message;}
}
document.querySelectorAll(".track").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;renderMode();}));
for(const [id,fmt] of [["population",x=>x],["generations",x=>x],["mutation",x=>x+"%"],["shift",x=>x]])el(id).addEventListener("input",e=>el(id+"Value").textContent=fmt(e.target.value));
el("textSeedBtn").addEventListener("click",makeTextSeed);el("micBtn").addEventListener("click",toggleMic);
el("runBtn").addEventListener("click",()=>simulate("evolution"));el("outlookBtn").addEventListener("click",()=>simulate("outlook"));
el("exportBtn").addEventListener("click",exportData);
el("copyGenome").addEventListener("click",async()=>{if(!genome)return;try{await navigator.clipboard.writeText(encodeGenome(genome));el("copyGenome").textContent="Đã sao chép";setTimeout(()=>el("copyGenome").textContent="Sao chép",1200);}catch(e){el("seedStatus").textContent="Clipboard unavailable: "+e.message;}});
renderMode();makeTextSeed();
