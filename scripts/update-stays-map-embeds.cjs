const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stays = await prisma.stay.findMany();
  console.log(`Checking ${stays.length} stays for mapEmbed...`);

  for (const s of stays) {
    if (!s.mapEmbed) {
      let embedUrl = '';
      if (s.latitude && s.longitude) {
        embedUrl = `https://maps.google.com/maps?q=${s.latitude},${s.longitude}&hl=en&z=16&output=embed`;
      } else {
        const q = encodeURIComponent(`${s.title} ${s.address}`);
        embedUrl = `https://maps.google.com/maps?q=${q}&hl=en&z=15&output=embed`;
      }
      await prisma.stay.update({
        where: { id: s.id },
        data: { mapEmbed: embedUrl }
      });
      console.log(`Updated [${s.id}] ${s.title} with mapEmbed: ${embedUrl}`);
    } else {
      console.log(`[${s.id}] ${s.title} already has mapEmbed`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
