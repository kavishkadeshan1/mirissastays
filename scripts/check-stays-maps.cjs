const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function resolveMapEmbedUrl(stay) {
  if (stay.mapEmbed) {
    const match = stay.mapEmbed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
    if (stay.mapEmbed.trim().startsWith('http')) {
      return stay.mapEmbed.trim();
    }
  }
  if (stay.latitude && stay.longitude) {
    return `https://maps.google.com/maps?q=${stay.latitude},${stay.longitude}&hl=en&z=16&output=embed`;
  }
  const query = encodeURIComponent(`${stay.title} ${stay.address}`);
  return `https://maps.google.com/maps?q=${query}&hl=en&z=15&output=embed`;
}

async function main() {
  const stays = await prisma.stay.findMany({
    select: {
      id: true,
      title: true,
      address: true,
      latitude: true,
      longitude: true,
      mapEmbed: true
    }
  });

  for (const s of stays) {
    const embedUrl = resolveMapEmbedUrl(s);
    console.log(`[${s.id}] ${s.title.padEnd(35)} => ${embedUrl.substring(0, 65)}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
