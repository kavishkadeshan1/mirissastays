import fs from 'node:fs';
const edit=(file,fn)=>fs.writeFileSync(file,fn(fs.readFileSync(file,'utf8')));
const write=(file,text)=>fs.writeFileSync(file,text);
write('src/components/ui/Photo.tsx',`"use client";
import Image from 'next/image';
import {useState} from 'react';
export default function Photo({src,alt,sizes='(max-width: 700px) 100vw, 33vw',priority=false}:{src:string;alt:string;sizes?:string;priority?:boolean}){
 const [failure,setFailure]=useState<{src:string;direct:boolean}|null>(null);
 const failed=failure?.src===src;const remote=/^https?:\\/\\//i.test(src);
 if(!src||(failed&&(!remote||failure.direct)))return <div className="photo-fallback" role="img" aria-label={alt+': photo unavailable'}><span>MirissaStays</span><small>Photo unavailable</small></div>;
 return <Image key={src+(failed?'-direct':'')} src={src.startsWith('http')||src.startsWith('/')?src:'/'+src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={remote&&!!failed} className="object-cover" onError={()=>setFailure({src,direct:!!failed})}/>;
}
`);
edit('src/components/stays/StayCard.tsx',s=>s.replace('export default function StayCard',"import {stayMedia} from '@/lib/stay-media';import {bookingPartnerUrl} from '@/lib/presentation';\nexport default function StayCard").replace('src={stay.featuredImage}','src={stayMedia(stay).featuredImage}').replace("stay.affiliateUrl?'Partner link'","bookingPartnerUrl(stay.affiliateUrl)?'Partner link'"));
edit('src/lib/presentation.ts',s=>s.replace('s.latitude===null','s.latitude==null').replace('s.longitude===null','s.longitude==null')+`\nexport function bookingPartnerUrl(value:string|null|undefined){const url=safeExternalUrl(value);if(!url)return null;const host=new URL(url).hostname;return /(^|\\.)google\\.[a-z.]+$|(^|\\.)goo\\.gl$|(^|\\.)share\\.google$/.test(host)?null:url;}\n`);
edit('src/app/stay/[slug]/page.tsx',s=>s.replace("export const dynamic=", "import {stayMedia} from '@/lib/stay-media';import {renderRichContent} from '@/lib/rich-content';import {bookingPartnerUrl} from '@/lib/presentation';\nexport const dynamic=")
 .replace("image:s?.featuredImage", "image:s?stayMedia(s).featuredImage:undefined")
 .replace("const partner=external&&!isMap?external:null;", "const partner=bookingPartnerUrl(stay.affiliateUrl);const media=stayMedia(stay);")
 .replace('image:stay.featuredImage','image:media.featuredImage')
 .replace('featuredImage={stay.featuredImage} galleryJson={stay.galleryJson}','featuredImage={media.featuredImage} galleryJson={media.galleryJson}')
 .replace('__html:stay.fullContent','__html:renderRichContent(stay.fullContent)'));
edit('src/app/guides/[slug]/page.tsx',s=>s.replace("export const dynamic=", "import {renderRichContent} from '@/lib/rich-content';\nexport const dynamic=").replace('const content=g.content.replace(', 'const content=renderRichContent(g.content).replace('));
edit('src/components/stays/StayGallery.tsx',s=>s.replace('{useRef,useState}', '{useEffect,useRef,useState}').replace('function open(i:number',"useEffect(()=>()=>{document.body.style.overflow='';},[]);function open(i:number"));
edit('src/app/page.tsx',s=>s.replace("import Link from 'next/link';", "import Link from 'next/link';import {redirect} from 'next/navigation';").replace('async function HomePage(){',`async function HomePage({searchParams}:{searchParams:Record<string,string|string[]|undefined>}){
const legacy=new URLSearchParams();for(const key of ['location','category','q','minPrice','maxPrice','sort']){const value=searchParams[key];if(typeof value==='string'&&value)legacy.set(key,value);}if(legacy.size)redirect('/stays?'+legacy.toString());`));
edit('src/components/stays/StayCollection.tsx',s=>s.replace("const min=Number(filters.minPrice)","filters=Object.fromEntries(Object.entries(filters).filter(([,v])=>typeof v==='string'));const min=Number(filters.minPrice)"));
edit('src/app/api/upload/route.ts',s=>s.replace('if (!file) {',`if (!['stays','guides','hero','authors'].includes(folder)) return NextResponse.json({error:'Invalid upload folder'}, {status:400});
    if (!file) {`).replace('const ext = path.extname(file.name) || ".jpg";',`const ext = ({'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/avif':'.avif'} as Record<string,string>)[file.type];`));
edit('src/app/api/host/stays/route.ts',s=>s.replace('isFeatured: false,','isFeatured: false,\n        rating: null,\n        reviewCount: 0,'));
edit('src/lib/listing-validation.ts',s=>s.replace('.max(500)', '.max(255)').replace('z.array(z.string().max(1000))',"z.array(z.string().max(1000).refine(v=>v.startsWith('/uploads/')||/^https?:\\/\\//.test(v),'Use an uploaded photo or a full image URL.'))"));
edit('src/app/api/inquiries/route.ts',s=>s.replace("!stay.whatsappNumber.replace(/[^0-9]/g, '')", "stay.whatsappNumber.replace(/[^0-9]/g, '').length < 6"));
edit('src/app/faq/page.tsx',s=>s.replace('import { defaultFaqs }','import { defaultFaqs, hostFaqs }').replace(/const hostFaqs = \[[\s\S]*?\];/,'').replace('with zero booking commissions.','including direct inquiries and booking partner links.'));
edit('src/app/admin/stays/page.tsx',s=>s.replaceAll('backdrop-blur-sm',''));
edit('src/app/host/page.tsx',s=>s.replace('formatPrice(Number(stay.pricePerNight))',"formatPrice(Number(stay.pricePerNight),stay.currency||'USD')"));
for(const slug of ['privacy','terms','cookies'])edit('src/app/'+slug+'/page.tsx',s=>s.replace('className="max-w-4xl','className="legal-content max-w-4xl'));
edit('src/lib/seo.ts',s=>s.replace('verified guesthouses','coastal guesthouses').replace('Book direct with local hosts with zero booking fees.','Explore property details, contact participating hosts, and discover local travel guides.').replace('`${title} | ${SITE_NAME}`','title.includes(" | ") ? title : `${title} | ${SITE_NAME}`').replace('location={search_term_string}','q={search_term_string}').replace('rating = 4.9','rating = 0').replace('reviewCount = 10','reviewCount = 0').replace('aggregateRating: {','...(reviewCount > 0 && rating > 0 ? {aggregateRating: {').replace('reviewCount: Math.max(1, reviewCount)','reviewCount').replace('worstRating: "1",\n    },','worstRating: "1",\n    }} : {}),'));
edit('src/app/sitemap.ts',s=>s.replace('const staticPages: MetadataRoute.Sitemap = [','const staticPages: MetadataRoute.Sitemap = [\n    {url: `${SITE_URL}/destinations`,changeFrequency:"weekly",priority:0.8},'));
edit('tsconfig.json',s=>{const j=JSON.parse(s);j.exclude.push('.redesign-backup');return JSON.stringify(j,null,2)+'\n';});
write('src/lib/faqs.ts',`export interface FaqItem {question:string;answer:string}
export const defaultFaqs:FaqItem[]=[
 {question:'How do I arrange a stay?',answer:'Open a property to see its booking options. Participating hosts accept WhatsApp messages and inquiries. Some listings link to a booking provider, where you can check dates and make a reservation.'},
 {question:'Does an inquiry confirm my booking?',answer:'No. An inquiry is a request for information. Your host or booking provider must confirm availability, the final price, payment arrangements and cancellation terms.'},
 {question:'What does the nightly price include?',answer:'Prices shown are starting rates in the currency displayed. They may change with travel dates, room type, taxes and additional services. Confirm the full cost before making a booking.'},
 {question:'Which area should I explore?',answer:'Browse Mirissa for beachside stays, Weligama for a surf-town base, or Thalaramba for a quieter setting. Each property page includes an address so you can check the exact location before choosing.'},
 {question:'Why do some links take me to another website?',answer:'Some properties use external booking providers. Affiliate links are marked on the property page; we may earn a commission when you book through them, at no extra cost to you.'}
];
export const hostFaqs:FaqItem[]=[
 {question:'How can I list my property?',answer:'Choose List your place and register as a host. Once your account is approved, add your property details, photos and contact number. New listings are submitted for review before publication.'},
 {question:'Where can I see guest inquiries?',answer:'Sign in to your host account and open the inquiry inbox. You can review the requested dates and contact the guest to discuss availability.'},
 {question:'How are payments and cancellations handled?',answer:'Guests arrange payment and cancellation terms with you or the booking provider. MirissaStays does not collect accommodation payments through the inquiry form.'}
];
`);
fs.appendFileSync('src/app/editorial.css',`\n.article-content h2,.article-content h3,.article-content h4{margin:1.6em 0 .7em;line-height:1.3}.article-content h4{font-size:21px;color:var(--ink)}.article-content ul,.article-content ol{padding-left:1.4em;margin:1em 0 1.5em;list-style:revert}.article-content li{margin:.5em 0}.article-content strong{font-weight:700;color:var(--ink)}.article-content a{text-decoration:underline;text-underline-offset:3px}.article-content blockquote{border-left:3px solid var(--ocean);padding:1em 1.5em;background:var(--sand)}.article-content table{max-width:100%;border-collapse:collapse}.article-content td,.article-content th{padding:12px;border:1px solid var(--line)}.article-content pre{overflow-x:auto}.article-content{overflow-wrap:anywhere}.inbox-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.inbox-card{padding:26px;border:1px solid var(--line);border-radius:12px;background:white}.inbox-card h2{font:24px Georgia,serif;margin:16px 0}.inbox-card dl{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-block:24px}.inbox-card dt{font-size:11px;color:var(--muted);margin-bottom:6px}.inbox-card dd{font-size:14px;overflow-wrap:anywhere}.inbox-actions{display:flex;gap:10px;flex-wrap:wrap}.inbox-status{font-size:11px;background:var(--sand);border-radius:30px;padding:6px 10px;text-transform:capitalize}@media(max-width:700px){.inbox-grid{grid-template-columns:1fr}}\n`);
