import sharp from 'sharp';
import {readdir, mkdir} from 'node:fs/promises';
await mkdir('deployment/drive-inspect',{recursive:true});
const files=(await readdir('assets/drive-products')).filter(f=>/\.(png|jpg)$/.test(f));
const cells=[];
for(let i=0;i<files.length;i++) {
 const name=files[i], input='assets/drive-products/'+name;
 const m=await sharp(input).metadata();
 console.log(JSON.stringify({name,width:m.width,height:m.height,alpha:m.hasAlpha}));
 await sharp(input).resize(1200,1200,{fit:'inside'}).toFile('deployment/drive-inspect/'+name+'.png');
 const label=Buffer.from(`<svg width="400" height="38"><rect width="400" height="38" fill="white"/><text x="10" y="25" font-size="17">${i+1}. ${name}</text></svg>`);
 const photo=await sharp(input).resize(380,320,{fit:'contain',background:'#e6e9eb'}).png().toBuffer();
 const cell=await sharp({create:{width:400,height:360,channels:3,background:'white'}}).composite([{input:photo,left:10,top:38},{input:label,left:0,top:0}]).png().toBuffer();
 cells.push({input:cell,left:(i%4)*400,top:Math.floor(i/4)*360});
}
await sharp({create:{width:1600,height:Math.ceil(files.length/4)*360,channels:3,background:'white'}}).composite(cells).png().toFile('deployment/drive-contact-sheet.png');
