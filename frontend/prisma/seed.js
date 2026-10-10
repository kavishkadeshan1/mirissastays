const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database seeds...");

  // Ensure Admin User exists and password is set to Kavishka#2003
  const adminPasswordHash = await bcrypt.hash("Kavishka#2003", 10);
  const existingAdmin = await prisma.user.findFirst({
    where: { email: "admin@mirissastays.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@mirissastays.com",
        fullName: "Super Admin",
        phone: "+94760224529",
        passwordHash: adminPasswordHash,
        role: "admin",
        status: "active",
      },
    });
    console.log("Admin user created: admin@mirissastays.com / Kavishka#2003");
  } else {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { passwordHash: adminPasswordHash, status: "active", role: "admin" },
    });
    console.log("Admin password updated: admin@mirissastays.com / Admin@Mirissa2026!");
  }

  // Ensure Host User exists and password is set to Host@Mirissa2026!
  const hostPasswordHash = await bcrypt.hash("Host@Mirissa2026!", 10);
  const existingHost = await prisma.user.findFirst({
    where: { email: "host@mirissastays.com" },
  });

  if (!existingHost) {
    await prisma.user.create({
      data: {
        email: "host@mirissastays.com",
        fullName: "Mirissa Local Host",
        phone: "+94760224529",
        passwordHash: hostPasswordHash,
        role: "host",
        status: "active",
      },
    });
    console.log("Host user created: host@mirissastays.com / Host@Mirissa2026!");
  } else {
    await prisma.user.update({
      where: { id: existingHost.id },
      data: { passwordHash: hostPasswordHash, status: "active", role: "host" },
    });
    console.log("Host password updated: host@mirissastays.com / Host@Mirissa2026!");
  }

  // Ensure Core Categories exist
  const categories = [
    { name: "Villa", slug: "villa", metaTitle: "Luxury Villas in Mirissa | MirissaStays", metaDescription: "Discover luxury and boutique private beachfront villas with private pools in Mirissa and Southern Sri Lanka." },
    { name: "Guesthouse", slug: "guesthouse", metaTitle: "Top Guesthouses in Mirissa | MirissaStays", metaDescription: "Affordable, verified guesthouses and surf lodges in Mirissa with AC, breakfast, and direct host WhatsApp booking." },
    { name: "Hotel", slug: "hotel", metaTitle: "Boutique Hotels in Mirissa | MirissaStays", metaDescription: "Top-rated beachfront hotels and boutique resorts in Mirissa Bay and Weligama." },
    { name: "Hostel", slug: "hostel", metaTitle: "Best Hostels in Mirissa for Backpackers | MirissaStays", metaDescription: "Budget-friendly, high-vibe hostels and dorms for backpackers, surfers, and solo travelers." },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Ensure Core Locations exist
  const locations = [
    { name: "Mirissa", slug: "mirissa", metaTitle: "Mirissa Hotels, Villas & Stays | MirissaStays", metaDescription: "Find the best hotels, beachfront villas, and guesthouses in Mirissa Beach and Mirissa Bay." },
    { name: "Weligama", slug: "weligama", metaTitle: "Weligama Surf Stays & Hotels | MirissaStays", metaDescription: "Top-rated surf camps, boutique hotels, and guesthouses located right on Weligama Bay." },
    { name: "Madiha", slug: "madiha", metaTitle: "Madiha Coastal Stays & Villas | MirissaStays", metaDescription: "Quiet boutique stays, private villas, and surf spots in picturesque Madiha." },
    { name: "Midigama", slug: "midigama", metaTitle: "Midigama Surf Stays & Hostels | MirissaStays", metaDescription: "Epic surf breaks, eco-lodges, and guesthouses in Midigama." },
    { name: "Thalaramba", slug: "thalaramba", metaTitle: "Thalaramba Stays & Beach Villas | MirissaStays", metaDescription: "Discover peaceful beachfront villas and boutique guesthouses in Thalaramba, Mirissa." },
    { name: "Kamburugamuwa", slug: "kamburugamuwa", metaTitle: "Kamburugamuwa Accommodation | MirissaStays", metaDescription: "Explore serene coastal retreats, budget guesthouses, and luxury stays in Kamburugamuwa." },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });
  }

  // Ensure Default Settings exist
  const heroSlides = JSON.stringify([
    { image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1920&q=80", title: "Coconut Tree Hill & Mirissa Bay", subtitle: "Scenic Southern Province Coastline" },
    { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80", title: "Secret Beaches & Coral Reefs", subtitle: "Pristine Secluded Coastal Havens" },
    { image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1920&q=80", title: "Luxury Oceanfront Villas & Pools", subtitle: "Direct Host Bookings with Zero Fees" },
    { image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80", title: "Golden Hour at Weligama Bay", subtitle: "World-Class Surf Breaks & Sunsets" },
  ]);

  await prisma.setting.upsert({
    where: { keyName: "hero_slides" },
    update: {},
    create: { keyName: "hero_slides", valueText: heroSlides },
  });

  await prisma.setting.upsert({
    where: { keyName: "site_announcement" },
    update: {},
    create: { keyName: "site_announcement", valueText: "Direct bookings now open for the 2026/2027 Southern Sri Lanka sunny season!" },
  });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
