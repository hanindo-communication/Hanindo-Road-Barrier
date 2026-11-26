import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';

// Cutouts retain opaque reflectors; fit their alpha bounds to one shared canvas.
const directory = 'assets/drive-products';
const outputs = JSON.parse(await readFile(directory + '/outputs.json', 'utf8'));
await mkdir('public/products', {recursive:true});
for (const {source:name,output} of outputs) {
  const input = directory + '/' + name;
  const {data, info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width, top=info.height, right=0, bottom=0;
  let transparent=0;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const alpha=data[(y*info.width+x)*4+3];
    if(alpha < 10) transparent++;
    if(alpha > 32) {left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  if(transparent < info.width*info.height*.1) throw new Error('Missing transparency: '+name);
  await sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1})
    .resize(640,640,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}})
    .extend({top:80,bottom:80,left:80,right:80,background:{r:0,g:0,b:0,alpha:0}})
    .webp({quality:92,alphaQuality:100}).toFile('public/products/'+output+'.webp');
  console.log(name+': transparent 800x800');
}
