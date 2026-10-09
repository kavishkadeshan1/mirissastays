export interface FaqItem {
  question: string;
  answer: string;
}
export const defaultFaqs: FaqItem[] = [
  {
    question: "How do I arrange a stay?",
    answer:
      "Open a property to see its booking options. Participating hosts accept WhatsApp messages and inquiries. Some listings link to a booking provider, where you can check dates and make a reservation.",
  },
  {
    question: "Does an inquiry confirm my booking?",
    answer:
      "No. An inquiry is a request for information. Your host or booking provider must confirm availability, the final price, payment arrangements and cancellation terms.",
  },
  {
    question: "What does the nightly price include?",
    answer:
      "Prices shown are starting rates in the currency displayed. They may change with travel dates, room type, taxes and additional services. Confirm the full cost before making a booking.",
  },
  {
    question: "Which area should I explore?",
    answer:
      "Browse Mirissa for beachside stays, Weligama for a surf-town base, or Thalaramba for a quieter setting. Each property page includes an address so you can check the exact location before choosing.",
  },
  {
    question: "Why do some links take me to another website?",
    answer:
      "Some properties use external booking providers. Affiliate links are marked on the property page; we may earn a commission when you book through them, at no extra cost to you.",
  },
];
export const hostFaqs: FaqItem[] = [
  {
    question: "How can I list my property?",
    answer:
      "Choose List your place and register as a host. Once your account is approved, add your property details, photos and contact number. New listings are submitted for review before publication.",
  },
  {
    question: "Where can I see guest inquiries?",
    answer:
      "Sign in to your host account and open the inquiry inbox. You can review the requested dates and contact the guest to discuss availability.",
  },
  {
    question: "How are payments and cancellations handled?",
    answer:
      "Guests arrange payment and cancellation terms with you or the booking provider. MirissaStays does not collect accommodation payments through the inquiry form.",
  },
];
