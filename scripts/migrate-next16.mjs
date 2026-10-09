import fs from 'node:fs';
import path from 'node:path';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of files('src/app').filter(f=>/\.(ts|tsx)$/.test(f))){
 let text=fs.readFileSync(file,'utf8');
 if(/params: \{ (slug|id): string \}/.test(text)){
  text=text.replace(/params: (\{ (?:slug|id): string \})/g,'params: Promise<$1>').replace(/\bparams\.(slug|id)\b/g,'(await params).$1');
 }
 if(/searchParams:/.test(text)){
  text=text.replace(/searchParams: Filters/g,'searchParams: Promise<Filters>')
   .replace(/searchParams: (\{ (?:token|status)\?: string \})/g,'searchParams: Promise<$1>')
   .replace('searchParams: Record<string, string | string[] | undefined>','searchParams: Promise<Record<string, string | string[] | undefined>>')
   .replace(/\bsearchParams\.(token|status)\b/g,'(await searchParams).$1')
   .replace('searchParams[key]','(await searchParams)[key]')
   .replace('...searchParams,','...(await searchParams),')
   .replace('filters={searchParams}','filters={await searchParams}')
   .replace('export default function StaysPage','export default async function StaysPage')
   .replace('export default function Reset','export default async function Reset');
 }
 fs.writeFileSync(file,text);
}
const auth='src/lib/auth.ts';fs.writeFileSync(auth,fs.readFileSync(auth,'utf8').replace('const cookieStore = cookies();','const cookieStore = await cookies();'));
const middleware='src/middleware.ts';
if(fs.existsSync(middleware)){fs.renameSync(middleware,'src/proxy.ts');fs.writeFileSync('src/proxy.ts',`import { NextResponse, type NextRequest } from 'next/server';
// The layouts and API handlers verify the signed session and database account.
// This early redirect only improves the unauthenticated navigation experience.
export function proxy(request: NextRequest) {
 if (!request.cookies.get('mirissa_token')?.value) {
  const login=new URL('/login',request.url);
  login.searchParams.set('callbackUrl',request.nextUrl.pathname);
  return NextResponse.redirect(login);
 }
 return NextResponse.next();
}
export const config={matcher:['/admin/:path*','/host/:path*']};
`);}
const p=JSON.parse(fs.readFileSync('package.json','utf8'));
delete p.scripts.lint;
p.scripts.check='tsc --noEmit';p.scripts.test='node --test tests/redesign.test.cjs';p.scripts['test:smoke']='node scripts/smoke-redesign.cjs';p.engines={node:'>=20.9.0'};
fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');
for(const page of ['login','register','forgot-password','reset-password']){
 const file='src/app/'+page+'/page.tsx';let text=fs.readFileSync(file,'utf8');
 if(!text.includes('export const metadata'))text+='\nexport const metadata={robots:{index:false,follow:false}};\n';
 fs.writeFileSync(file,text);
}
