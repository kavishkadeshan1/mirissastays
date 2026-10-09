import fs from 'node:fs/promises';
import path from 'node:path';
const stays=JSON.parse(await fs.readFile('reports/property-media-audit.json','utf8'));
const pages={
 'the-nine-mirissa':'https://www.booking.com/hotel/lk/the-nine-mirissa-mirissa.en-gb.html',
 'asaya-sands-mirissa':'https://www.booking.com/hotel/lk/asaya-sands.en-gb.html',
 'mandara-resort-mirissa':'https://www.booking.com/hotel/lk/mandara-boutique-resort.html',
 'paradise-beach-club':'https://www.booking.com/hotel/lk/paradise-beach-club.pt-pt.html'
};
await fs.mkdir('public/uploads/property-media',{recursive:true});
await fs.mkdir('src/data',{recursive:true});
let manifest={};try{manifest=JSON.parse(await fs.readFile('src/data/property-media.json','utf8'));}catch{}
async function fetchRetry(url){let last;for(let i=0;i<2;i++){try{const res=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error('HTTP '+res.status);return res;}catch(e){last=e;}}throw last;}
const excluded=new Set(['sunrise-villa-mirissa','cozy-guest-house','weligama-surf-hotel','thalaramba-ocean-villa','kamburugamuwa-coastal-retreat','sandy-coconut-guest','mirissa-hills']);
for(const stay of stays.filter(s=>!excluded.has(s.slug))){
 const sourcePage=pages[stay.slug]||(/booking\.com/.test(stay.affiliateUrl||'')?stay.affiliateUrl:null);
 let urls=[];
 // Booking pages require an interactive bot check. Keep existing property photos
 // for those four verified properties rather than attempting to bypass it.
 if(!urls.length){let gallery=[];try{gallery=JSON.parse(stay.galleryJson||'[]');if(typeof gallery==='string')gallery=JSON.parse(gallery);}catch{}urls=Array.from(new Set([stay.featuredImage,...gallery].filter(Boolean)));}
 const photos=[];const failures=[];
 for(let start=0;start<urls.length;start+=3){await Promise.all(urls.slice(start,start+3).map(async(url,offset)=>{const i=start+offset;const relative='/uploads/property-media/'+stay.slug+'-'+(i+1)+'.jpg';try{const file=path.join('public',relative);let exists=false;try{exists=(await fs.stat(file)).size>1000;}catch{}if(!exists){const response=await fetchRetry(url);if(!response.headers.get('content-type')?.startsWith('image/'))throw Error('Not an image');const data=Buffer.from(await response.arrayBuffer());if(data.length<1000)throw Error('Image too small');await fs.writeFile(file,data);}photos.push({index:i,src:relative,original:url});}catch(e){failures.push({url,error:e.message});}}));}
 photos.sort((a,b)=>a.index-b.index);
 manifest[stay.slug]={originalFeaturedImage:stay.featuredImage,sourcePage,checkedAt:'2026-10-09',photos:photos.map(({index,...p})=>p),failures,stockPhoto:urls.some(u=>u.includes('unsplash.com'))};
 await fs.writeFile('src/data/property-media.json',JSON.stringify(manifest,null,2)+'\n');
 console.log(stay.slug,photos.length+' cached',failures.length+' failed');
}
