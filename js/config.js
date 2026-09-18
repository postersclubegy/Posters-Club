/* =========================================================
   POSTERS CLUB - SITE CONFIG
   Every value in this file is marked TEMPORARY DUMMY VALUE
   where relevant. This is the ONLY file you should need to
   edit to update contact info and the delivery fee.
   ========================================================= */

const SITE_CONFIG = {
  businessName: "Posters Club",
  instagramUrl: "https://www.instagram.com/postersclub.egy",
  instagramHandle: "@postersclub.egy",

  // Real WhatsApp number
  whatsappNumber: "201099945707",

  // Real owner email
  ownerEmail: "postersclubeg@gmail.com",

  // Fixed delivery fee in EGP - change this one number to update the whole site
  deliveryFeeEGP: 85,

  // Deposit the owner asks for on WhatsApp, as a percent of the order total
  depositPercent: 40,

  currency: "EGP",

  // ── PHASE 2: automatic order emails ──────────────────────────────
  // Leave these blank and the site works exactly as it does now (orders
  // save in the browser + the customer can download a copy). Fill all
  // three in and the site will automatically email every order - with
  // customer details, product list, and custom poster images - to
  // ownerEmail above. See README.md → "Turning on automatic order
  // emails" for the exact free signup steps.
  emailjs: {
    serviceId: "service_h6v6u92",
    templateId: "template_c100hjb",
    publicKey: "bXDYd8HMUG-0RpCde",
  },

  // ── PHASE 2: reliable storage for custom poster images ───────────
  // Leave blank and custom poster images stay attached to the order
  // email as compressed inline images (fine for a few, unreliable for
  // many/large ones). Fill in and images upload to your own free
  // Supabase storage bucket instead, with permanent links included in
  // the order email - the reliable, recommended option.
  supabase: {
    url: "https://fqzgbcibdaovsmwfuedk.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemdiY2liZGFvdnNtd2Z1ZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMjQ2ODcsImV4cCI6MjEwNDgwMDY4N30.Oom0rr6V4NK6W4YmpBEu25wHq1qpmshKw07ECcX_8jg",
    bucket: "posters-club-orders",
  },
};
