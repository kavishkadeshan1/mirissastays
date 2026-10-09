const test = require("node:test");
const assert = require("node:assert");

const BASE_URL = "http://localhost:3000";

test("E2E - Public Pages Response Check", async (t) => {
  const pages = [
    "/",
    "/stays",
    "/guides",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
    "/sitemap.xml",
    "/robots.txt",
  ];

  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert.strictEqual(
      res.status,
      200,
      `Expected ${page} to return status 200, got ${res.status}`
    );
  }
});

test("E2E - Stay Detail Page and Slug Resolution", async (t) => {
  const res = await fetch(`${BASE_URL}/stays`);
  assert.strictEqual(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes("Mirissa") || html.includes("Stays"), "Page should contain Mirissa content");

  // Test dynamic stay
  const stayRes = await fetch(`${BASE_URL}/stay/sandy-coconut-guest`);
  assert.ok(
    stayRes.status === 200 || stayRes.status === 404,
    "Should return 200 for valid stay or 404 cleanly"
  );
});

test("E2E - Admin Authentication Flow", async (t) => {
  // 1. Login with seeded super admin
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@mirissastays.com",
      password: "Kavishka#2003",
    }),
  });

  assert.strictEqual(loginRes.status, 200, "Admin login should succeed");
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.user.role, "admin");

  const setCookieHeader = loginRes.headers.get("set-cookie");
  assert.ok(setCookieHeader, "Login response should include set-cookie header");
  const tokenMatch = setCookieHeader.match(/mirissa_token=([^;]+)/);
  assert.ok(tokenMatch, "Cookie should contain mirissa_token");
  const token = tokenMatch[1];

  // 2. Query /api/auth/me with cookie
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: {
      Cookie: `mirissa_token=${token}`,
    },
  });
  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert.strictEqual(meData.user.email, "admin@mirissastays.com");
  assert.strictEqual(meData.user.role, "admin");

  // 3. Query protected admin API /api/admin/stays-list
  const adminStaysRes = await fetch(`${BASE_URL}/api/admin/stays-list`, {
    headers: {
      Cookie: `mirissa_token=${token}`,
    },
  });
  assert.strictEqual(adminStaysRes.status, 200);
  const adminStaysData = await adminStaysRes.json();
  assert.ok(Array.isArray(adminStaysData.stays), "Should return stays array");
  assert.ok(adminStaysData.stays.length > 0, "Should have seeded stays in database");
});

test("E2E - Inquiry Lead Creation API", async (t) => {
  // Fetch an existing stay ID
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@mirissastays.com",
      password: "Kavishka#2003",
    }),
  });
  const cookie = loginRes.headers.get("set-cookie").match(/mirissa_token=([^;]+)/)[1];

  const adminStaysRes = await fetch(`${BASE_URL}/api/admin/stays-list`, {
    headers: { Cookie: `mirissa_token=${cookie}` },
  });
  const { stays } = await adminStaysRes.json();
  const stayId = stays[0].id;

  const inquiryRes = await fetch(`${BASE_URL}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stayId,
      guestName: "Sophie Dupont",
      guestEmail: "sophie.dupont@example.com",
      guestPhone: "+33612345678",
      checkinDate: "2026-12-10",
      checkoutDate: "2026-12-17",
      guestsCount: 2,
      specialRequests: "Looking forward to our holiday in Mirissa! Is late check-in available?",
      honeypot: "",
    }),
  });

  assert.ok(
    inquiryRes.status === 200 || inquiryRes.status === 201,
    `Inquiry creation should succeed, got ${inquiryRes.status}`
  );
  const inquiryData = await inquiryRes.json();
  assert.ok(inquiryData.success, "Inquiry response should indicate success");
  assert.ok(inquiryData.leadId, "Inquiry response should return leadId");
});
