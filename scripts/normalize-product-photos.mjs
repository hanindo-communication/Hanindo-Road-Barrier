import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

if (existsSync('assets/product-cutouts')) {
  await import('./prepare-transparent-products.mjs');
  process.exit(0);
}

// Official archive photos; crop only surrounding whitespace, preserving product proportions.
const sources = {
  'road-barrier-mathes': '2022/04/road-barrier-type-mathes-768x768.webp',
  'road-barrier-1': '2022/03/road-barrier-1-768x768.webp',
  'road-barrier-2': '2022/03/RB2-e1676952922484-768x532.webp',
  'road-barrier-3': '2022/04/roadbarrier3-768x768.webp',
  'traffic-cone-mathes': '2022/03/Traffic-Cone-Mathes-768x747.webp',
  'traffic-cone-50': '2022/03/tc-50.webp',
  'traffic-cone-75': '2022/03/traffic-cone-75-min-768x768.webp',
  'stick-cone': '2022/03/stick-cone-min-768x768.webp',
  'stick-cone-2': '2022/04/STC2.webp',
};
await mkdir('public/products', { recursive: true });
for (const [id, source] of Object.entries(sources)) {
  const input = 'public/legacy-assets/wp-content/uploads/' + source;
  const {data, info} = await sharp(input).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width, top=info.height, right=0, bottom=0;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const i=(y*info.width+x)*info.channels;
    if(data[i]>70 && data[i]>data[i+1]*1.3 && data[i]>data[i+2]*1.3) {
      left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y);
    }
  }
  if(right<=left || bottom<=top) throw new Error('No product found: '+id);
  left=Math.max(0,left-5); top=Math.max(0,top-5);
  right=Math.min(info.width-1,right+5); bottom=Math.min(info.height-1,bottom+5);
  await sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1})
    .resize(640,640,{fit:'contain',background:'#ffffff'})
    .extend({top:80,bottom:80,left:80,right:80,background:'#ffffff'})
    .webp({quality:92}).toFile('public/products/'+id+'.webp');
  console.log(id);
}
