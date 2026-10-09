require('@next/env').loadEnvConfig(process.cwd());
const {PrismaClient}=require('@prisma/client');
const fs=require('node:fs');
const db=new PrismaClient();
const slugs=['sunrise-villa-mirissa','cozy-guest-house','weligama-surf-hotel','thalaramba-ocean-villa','kamburugamuwa-coastal-retreat','sandy-coconut-guest','mirissa-hills'];
async function main(){
 const records=await db.stay.findMany({where:{slug:{in:slugs}},select:{id:true,slug:true,status:true}});
 const backup='reports/archived-stays-before-redesign.json';
 if(!fs.existsSync(backup))fs.writeFileSync(backup,JSON.stringify(records,null,2));
 const result=await db.stay.updateMany({where:{slug:{in:slugs}},data:{status:'archived'}});
 console.log('Archived properties:',result.count);
}
main().finally(()=>db.$disconnect());
