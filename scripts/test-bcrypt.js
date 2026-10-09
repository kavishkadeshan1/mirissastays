const bcrypt = require("bcryptjs");

async function check() {
  const hash = "$2y$10$AVXBnEIJaUEISM5bwUDgj.upMhAAaGqKrEK5mXIJMHxAyQH453sPi";
  const candidates = [
    "admin",
    "admin123",
    "Admin123",
    "admin@123",
    "password",
    "Admin@Mirissa2026!",
    "mirissastays",
    "123456",
    "12345678",
    "kavishka",
    "mirissa",
  ];

  for (const c of candidates) {
    if (await bcrypt.compare(c, hash)) {
      console.log("MATCH FOUND:", c);
      return;
    }
  }
  console.log("No match found in candidates");
}

check();
