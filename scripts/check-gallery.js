const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stays = await prisma.stay.findMany({
    select: { id: true, slug: true, title: true, featuredImage: true, galleryJson: true },
  });
  console.log('Total Stays:', stays.length);
  for (const s of stays) {
    let count = 0;
    try {
      const arr = JSON.parse(s.galleryJson || '[]');
      count = Array.isArray(arr) ? arr.length : 0;
    } catch (e) {
      count = -1;
    }
    console.log(`ID: ${s.id} | Slug: ${s.slug} | Gallery Count: ${count} | Raw: ${s.galleryJson?.slice(0, 80)}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
