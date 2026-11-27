"use client";

import dynamic from "next/dynamic";
import { useId, useState } from "react";
import { catalogProducts, catalogCounts, getProductVariant } from "./catalog-data";
import ProductVariants from "./ProductVariants";
import type { ViewAction, ViewCommand } from "./Product3DScene";
import type { ProductModelId } from "./three/product-models";

const ProductScene=dynamic(()=>import("./Product3DScene"),{ssr:false,loading:()=> <div className="product-scene-loading">Menyiapkan model 3D…</div>});
const groups = [
  {id:"barrier",label:"Road Barrier",image:"/products/road-barrier-2.webp",count:catalogCounts.barrier},
  {id:"cone",label:"Traffic Cone",image:"/products/traffic-cone-mathes.webp",count:catalogCounts.cone},
  {id:"stick",label:"Stick Cone",image:"/products/stick-cone-2.webp",count:catalogCounts.stick},
];

type Props = { productId?: string; variantId?: string; onVariantChange?: (id:string)=>void };
export default function HeroProductExplorer({productId,variantId,onVariantChange}:Props){
  const [selected,setSelected]=useState("road-barrier-2"),[mode,setMode]=useState<"3d"|"photo">("3d"),[autoRotate,setAutoRotate]=useState(false);
  const [variantIds,setVariantIds]=useState<Record<string,string>>({});
  const [command,setCommand]=useState<ViewCommand>({action:"reset",sequence:0});
  const current=catalogProducts.find(model=>model.id===(productId??selected))??catalogProducts[0];
  const variant=getProductVariant(current,variantId??variantIds[current.id]);
  const modelSelectId=useId();
  const categoryModels=catalogProducts.filter(model=>model.category===current.category);
  const selectModel=(id:string)=>{setSelected(id);setAutoRotate(false);setMode("3d");};
  const selectVariant=(id:string)=>{setAutoRotate(false);if(onVariantChange)onVariantChange(id);else setVariantIds(previous=>({...previous,[current.id]:id}));};
  const view=(action:ViewAction)=>{setAutoRotate(false);setCommand(previous=>({action,sequence:previous.sequence+1}));};
  return <div className="hero-card-wrap hero-product-explorer" id={productId?undefined:"product-explorer"}>
    <div className="hero-card-label"><span>PRODUCT EXPLORER</span><span>DRAG TO EXPLORE · 360°</span></div>
    <div className="product-explorer-shell">
      {!productId&&<>
        <div className="product-explorer-tabs" role="group" aria-label="Kategori model 3D">
          {groups.map(group=><button type="button" key={group.id} aria-pressed={current.category===group.id} className={current.category===group.id?"explorer-tab active":"explorer-tab"}
            onClick={()=>selectModel(catalogProducts.find(model=>model.category===group.id)!.id)}>
            <img src={group.image} alt=""/><span><small>{group.count} MODEL</small><strong>{group.label}</strong></span>
          </button>)}
        </div>
        <div className="explorer-model-picker">
          <label htmlFor={modelSelectId}>PILIH MODEL <span>{catalogCounts.all} model · {catalogCounts.variants} pilihan</span></label>
          <div><select id={modelSelectId} value={current.id} onChange={event=>selectModel(event.target.value)}>
            {groups.map(group=><optgroup label={group.label} key={group.id}>{catalogProducts.filter(model=>model.category===group.id).map(model=><option key={model.id} value={model.id}>{model.title}{model.bestSeller?" · Best seller":""}</option>)}</optgroup>)}
          </select><span className="explorer-model-position">{categoryModels.findIndex(model=>model.id===current.id)+1} / {categoryModels.length}</span></div>
        </div>
      </>}
      <div className="explorer-variant-picker"><ProductVariants product={current} variant={variant} onChange={selectVariant}/></div>
      <div className={`product-explorer-stage${mode === "photo" ? " is-photo" : ""}`}>
        <div className="explorer-stage-heading"><span><i/> {mode==="3d"?"MODEL 3D INTERAKTIF":"FOTO PRODUK ASLI"}</span>
          <button type="button" className="explorer-mode-toggle" aria-pressed={mode==="photo"} onClick={()=>{setMode(mode==="3d"?"photo":"3d");setAutoRotate(false);}}>{mode==="3d"?"Lihat foto asli ↗":"Kembali ke 3D ↗"}</button>
        </div>
        {mode==="3d"?<ProductScene product={current.id as ProductModelId} variant={variant.id} label={`${current.title} — ${variant.label}`} fallbackImage={variant.image} autoRotate={autoRotate} command={command} onInteraction={()=>setAutoRotate(false)}/>:<div className="explorer-reference"><img src={variant.image} alt={`Foto asli ${current.title} — ${variant.label} dari aset Produk Trijaya`} width="800" height="800"/></div>}
        <div className="explorer-stage-caption" aria-hidden="true">{mode==="3d"?<><span>↔ Geser untuk memutar</span><span>Pinch / ± untuk zoom</span></>:<span>Foto asli sebagai pembanding bentuk produk</span>}</div>
      </div>
      <div className="explorer-product-copy" aria-live="polite"><h3>{current.title}</h3><p>{current.categoryLabel} · {variant.label}{current.bestSeller?" · Best seller":""}</p></div>
      {mode==="3d"&&<div className="explorer-controls" aria-label="Kontrol tampilan 3D">
        <div className="explorer-view-buttons">{[["front","Depan"],["side","Samping"],["back","Belakang"]].map(([action,text])=><button type="button" key={action} onClick={()=>view(action as ViewAction)}>{text}</button>)}</div>
        <div className="explorer-zoom-buttons"><button type="button" aria-label="Perkecil model" onClick={()=>view("zoom-out")}>−</button><button type="button" aria-label="Perbesar model" onClick={()=>view("zoom-in")}>+</button><button type="button" aria-label="Reset tampilan 3D" onClick={()=>view("reset")}>↺</button></div>
        <button type="button" className="explorer-auto" aria-pressed={autoRotate} onClick={()=>setAutoRotate(value=>!value)}><span aria-hidden="true">{autoRotate?"Ⅱ":"▷"}</span> {autoRotate?"Jeda putaran":"Putar otomatis"}</button>
      </div>}
      <div className="explorer-source-note">Model visual berdasarkan foto produk. {!productId&&<a href={`/katalog/?produk=${current.id}&varian=${variant.id}`}>Detail produk ↗</a>}</div>
    </div>
  </div>;
}
