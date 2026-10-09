require('@next/env').loadEnvConfig(process.cwd());
const required=[['typescript','typescript/lib/typescript.js'],['@types/react','@types/react/index.d.ts'],['@types/node','@types/node/index.d.ts']];
require('next/dist/lib/has-necessary-dependencies').hasNecessaryDependencies(process.cwd(),required.map(([pkg,file])=>({pkg,file,exportsRestrict:true}))).then(x=>console.log('Dependencies:',x));
const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.stay.count().then(n=>console.log('Local stays:',n)).catch(e=>console.log('Database check:',e.code||e.name)).finally(()=>p.$disconnect());
