const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    status: u.status,
    hash: u.passwordHash.slice(0, 20),
  })));
}

main().finally(() => prisma.$disconnect());
