"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ViewAction, ViewCommand } from "./Product3DScene";
import type { ProductModelId } from "./three/product-models";

const ProductScene=dynamic(()=>import("./Product3DScene"),{ssr:false,loading:()=> <div className="product-scene-loading">Menyiapkan model 3D…</div>});
const models:Array<{id:ProductModelId;title:string;short:string;image:string;details:string}>=[
  {id:"road-barrier-2",title:"Road Barrier 2",short:"RB2",image:"/products/road-barrier-2.webp?v=20261126-drive",details:"Pengait bertingkat · 3 cekungan badan · reflektor panah"},
  {id:"traffic-cone-mathes",title:"Traffic Cone Mathes",short:"Cone Mathes",image:"/products/traffic-cone-mathes.webp?v=20261126-drive",details:"2 pita reflektif · kepala berongga · alas persegi"},
  {id:"stick-cone",title:"Stick Cone",short:"Stick Cone",image:"/products/stick-cone.webp?v=20261126-drive",details:"2 pita reflektif · lubang pengait kecil · alas segi delapan"},
];

export default function HeroProductExplorer(){
  const [selected,setSelected]=useState<ProductModelId>("road-barrier-2"),[mode,setMode]=useState<"3d"|"photo">("3d"),[autoRotate,setAutoRotate]=useState(false);
  const [command,setCommand]=useState<ViewCommand>({action:"reset",sequence:0});
  const current=models.find(model=>model.id===selected)!;
  const view=(action:ViewAction)=>{setAutoRotate(false);setCommand(previous=>({action,sequence:previous.sequence+1}));};
  return <div className="hero-card-wrap hero-product-explorer" id="product-explorer">
    <div className="hero-card-label"><span>PRODUCT EXPLORER</span><span>DRAG TO EXPLORE · 360°</span></div>
    <div className="product-explorer-shell">
      <div className="product-explorer-tabs" role="group" aria-label="Pilih model 3D">
        {models.map((model,index)=><button type="button" key={model.id} aria-pressed={selected===model.id} className={selected===model.id?"explorer-tab active":"explorer-tab"}
          onClick={()=>{setSelected(model.id);setAutoRotate(false);setMode("3d");}}>
          <img src={model.image} alt=""/><span><small>0{index+1}</small><strong>{model.short}</strong></span>
        </button>)}
      </div>
      <div className={`product-explorer-stage${mode === "photo" ? " is-photo" : ""}`}>
        <div className="explorer-stage-heading"><span><i/> {mode==="3d"?"MODEL 3D INTERAKTIF":"FOTO PRODUK ASLI"}</span>
          <button type="button" className="explorer-mode-toggle" aria-pressed={mode==="photo"} onClick={()=>{setMode(mode==="3d"?"photo":"3d");setAutoRotate(false);}}>{mode==="3d"?"Lihat foto asli ↗":"Kembali ke 3D ↗"}</button>
        </div>
        {mode==="3d"?<ProductScene product={selected} label={current.title} fallbackImage={current.image} autoRotate={autoRotate} command={command} onInteraction={()=>setAutoRotate(false)}/>:<div className="explorer-reference"><img src={current.image} alt={`Foto asli ${current.title} dari aset Produk Trijaya`}/></div>}
        <div className="explorer-stage-caption" aria-hidden="true">{mode==="3d"?<><span>↔ Geser untuk memutar</span><span>Pinch / ± untuk zoom</span></>:<span>Foto asli sebagai pembanding bentuk produk</span>}</div>
      </div>
      <div className="explorer-product-copy" aria-live="polite"><h3>{current.title}</h3><p>{current.details}</p></div>
      {mode==="3d"&&<div className="explorer-controls" aria-label="Kontrol tampilan 3D">
        <div className="explorer-view-buttons">{[["front","Depan"],["side","Samping"],["back","Belakang"]].map(([action,text])=><button type="button" key={action} onClick={()=>view(action as ViewAction)}>{text}</button>)}</div>
        <div className="explorer-zoom-buttons"><button type="button" aria-label="Perkecil model" onClick={()=>view("zoom-out")}>−</button><button type="button" aria-label="Perbesar model" onClick={()=>view("zoom-in")}>+</button><button type="button" aria-label="Reset tampilan 3D" onClick={()=>view("reset")}>↺</button></div>
        <button type="button" className="explorer-auto" aria-pressed={autoRotate} onClick={()=>setAutoRotate(value=>!value)}><span aria-hidden="true">{autoRotate?"Ⅱ":"▷"}</span> {autoRotate?"Jeda putaran":"Putar otomatis"}</button>
      </div>}
      <div className="explorer-source-note">Model visual berdasarkan foto produk. <a href={`/katalog/?produk=${selected}`}>Detail produk ↗</a></div>
    </div>
  </div>;
}
