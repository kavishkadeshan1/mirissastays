require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const fs = require('node:fs');
const db = new PrismaClient();
async function main() {
  const stays = await db.stay.findMany({select:{id:true,slug:true,title:true,featuredImage:true,galleryJson:true,affiliateUrl:true,fullContent:true,shortDesc:true,address:true}});
  fs.mkdirSync('reports',{recursive:true});
  fs.writeFileSync('reports/property-media-audit.json',JSON.stringify(stays,null,2));
  console.log(JSON.stringify(stays.map(({fullContent,galleryJson,...s})=>({...s,contentPreview:fullContent.slice(0,400),galleryCount: (()=>{try{return JSON.parse(galleryJson).length}catch{return 0}})()})),null,2));
}
main().finally(()=>db.$disconnect());
