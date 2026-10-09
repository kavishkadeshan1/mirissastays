require('@next/env').loadEnvConfig(process.cwd());
const {PrismaClient}=require('@prisma/client');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const db=new PrismaClient();
const base=process.env.SMOKE_BASE_URL||'http://127.0.0.1:3000';
const results=[];
async function check(route,expected=200){const response=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(30000)});const body=await response.text();assert.equal(response.status,expected,route+' returned '+response.status);assert(!body.includes('Application error:'),route+' application error');results.push({route,status:response.status});return {response,body};}
async function main(){
 const [stays,guides,locations,categories]=await Promise.all([db.stay.findMany({where:{status:'published'},select:{slug:true,featuredImage:true}}),db.guide.findMany({where:{status:'published'},select:{slug:true}}),db.location.findMany({select:{slug:true}}),db.category.findMany({select:{slug:true}})]);
 for(const route of ['/','/stays','/destinations','/guides','/about','/contact','/faq','/privacy','/terms','/cookies','/login','/register','/forgot-password','/reset-password','/robots.txt','/sitemap.xml'])await check(route);
 const manifest=JSON.parse(fs.readFileSync('src/data/property-media.json','utf8'));
 for(const stay of stays){const {body}=await check('/stay/'+stay.slug);const media=manifest[stay.slug];assert(media?.photos.length>0,'Missing media: '+stay.slug);assert.equal(media.originalFeaturedImage,stay.featuredImage);assert(body.includes('/uploads/property-media/'),'Cached photo missing '+stay.slug);assert(!body.includes('### '),'Unrendered Markdown on '+stay.slug);for(const photo of media.photos){const r=await fetch(base+photo.src);assert.equal(r.status,200,photo.src);assert((r.headers.get('content-type')||'').startsWith('image/'),photo.src);assert((await r.arrayBuffer()).byteLength>1000,photo.src);}const optimized=await fetch(base+'/_next/image?url='+encodeURIComponent(media.photos[0].src)+'&w=640&q=75');assert.equal(optimized.status,200,'Optimizer '+stay.slug);results.push({property:stay.slug,photos:media.photos.length,optimized:200});}
 for(const g of guides)await check('/guides/'+g.slug);
 for(const l of locations)await check('/location/'+l.slug);
 for(const c of categories)await check('/category/'+c.slug);
 await check('/stays?q=no-such-property-qa-check');await check('/stays?sort=price_asc&currency=LKR');await check('/stays?sort=one&sort=two');
 for(const slug of ['sunrise-villa-mirissa','cozy-guest-house','weligama-surf-hotel','thalaramba-ocean-villa','kamburugamuwa-coastal-retreat','sandy-coconut-guest','mirissa-hills'])await check('/stay/'+slug,404);
 for(const [route,destination] of [['/about.php','/about'],['/stay.php?slug=the-nine-mirissa','/stay/the-nine-mirissa'],['/places','/stays']]){const {response}=await check(route,308);assert(response.headers.get('location').includes(destination));}
 for(const route of ['/host','/admin'])await check(route,307);
 for(const route of ['/api/inquiries','/api/contact','/api/auth/reset-password']){const r=await fetch(base+route,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(r.status,400,route);results.push({route,invalidInput:400});}
 fs.writeFileSync('reports/redesign-smoke.json',JSON.stringify({checkedAt:new Date().toISOString(),publishedStays:stays.length,results},null,2));
 console.log('PASS:',results.length,'checks;',stays.length,'published properties; all local and optimized property photos load.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
