const test = require("node:test");
const assert = require("node:assert");
const { z } = require("zod");

// Test Zod validation schemas
const inquirySchema = z.object({
  stayId: z.number().int().positive(),
  guestName: z.string().min(2).max(120),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6).max(30),
  checkinDate: z.string().min(1),
  checkoutDate: z.string().min(1),
  guestsCount: z.coerce.number().int().min(1).max(30).default(2),
  honeypot: z.string().max(0).optional(),
});

test("inquirySchema validates valid inquiry", () => {
  const validData = {
    stayId: 4,
    guestName: "Sarah Jenkins",
    guestEmail: "sarah@example.com",
    guestPhone: "+447911123456",
    checkinDate: "2026-11-15",
    checkoutDate: "2026-11-20",
    guestsCount: 2,
    honeypot: "",
  };
  const result = inquirySchema.safeParse(validData);
  assert.strictEqual(result.success, true);
});

test("inquirySchema catches invalid email", () => {
  const invalidData = {
    stayId: 4,
    guestName: "Sarah Jenkins",
    guestEmail: "not-an-email",
    guestPhone: "+447911123456",
    checkinDate: "2026-11-15",
    checkoutDate: "2026-11-20",
    guestsCount: 2,
  };
  const result = inquirySchema.safeParse(invalidData);
  assert.strictEqual(result.success, false);
});

test("inquirySchema flags bot filled honeypot", () => {
  const botData = {
    stayId: 4,
    guestName: "Spam Bot",
    guestEmail: "bot@spam.com",
    guestPhone: "+123456789",
    checkinDate: "2026-11-15",
    checkoutDate: "2026-11-20",
    honeypot: "http://spam.ru",
  };
  const result = inquirySchema.safeParse(botData);
  assert.strictEqual(result.success, false);
});

test("WhatsApp phone sanitizer strips non-digits", () => {
  function sanitizeWhatsApp(phone) {
    if (!phone) return "";
    return phone.replace(/[^0-9]/g, "");
  }

  assert.strictEqual(sanitizeWhatsApp("+94 76 022 4529"), "94760224529");
  assert.strictEqual(sanitizeWhatsApp("076-022-4529"), "0760224529");
  assert.strictEqual(sanitizeWhatsApp(null), "");
});

test("slugify correctly formats title to URL slug", () => {
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  assert.strictEqual(slugify("Sandy Coconut Guest House"), "sandy-coconut-guest-house");
  assert.strictEqual(slugify("10 Best Hotels in Mirissa, Sri Lanka!"), "10-best-hotels-in-mirissa-sri-lanka");
});
