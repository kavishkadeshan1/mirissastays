const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stays = await prisma.stay.count();
  const guides = await prisma.guide.count();
  const users = await prisma.user.count();
  const categories = await prisma.category.count();
  const locations = await prisma.location.count();
  console.log('Database Status:', { stays, guides, users, categories, locations });
}

main().catch(console.error).finally(() => prisma.$disconnect());
