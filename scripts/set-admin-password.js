const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Kavishka#2003", 10);
  const updated = await prisma.user.updateMany({
    where: { email: "admin@mirissastays.com" },
    data: {
      passwordHash,
      status: "active",
      role: "admin",
    },
  });
  console.log("Updated admin password to Kavishka#2003:", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
