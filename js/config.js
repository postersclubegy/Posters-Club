/* =========================================================
   POSTERS CLUB — SITE CONFIG
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

  // Fixed delivery fee in EGP — change this one number to update the whole site
  deliveryFeeEGP: 85,

  currency: "EGP",

  // ── PHASE 2: automatic order emails ──────────────────────────────
  // Leave these blank and the site works exactly as it does now (orders
  // save in the browser + the customer can download a copy). Fill all
  // three in and the site will automatically email every order — with
  // customer details, product list, and custom poster images — to
  // ownerEmail above. See README.md → "Turning on automatic order
  // emails" for the exact free signup steps.
  emailjs: {
    serviceId: "",   // TEMPORARY EMPTY — from EmailJS → Email Services
    templateId: "",  // TEMPORARY EMPTY — from EmailJS → Email Templates
    publicKey: "",   // TEMPORARY EMPTY — from EmailJS → Account → General
  },

  // ── PHASE 2: reliable storage for custom poster images ───────────
  // Leave blank and custom poster images stay attached to the order
  // email as compressed inline images (fine for a few, unreliable for
  // many/large ones). Fill in and images upload to your own free
  // Supabase storage bucket instead, with permanent links included in
  // the order email — the reliable, recommended option.
  supabase: {
    url: "",       // TEMPORARY EMPTY — from Supabase → Project Settings → API
    anonKey: "",   // TEMPORARY EMPTY — from Supabase → Project Settings → API
    bucket: "posters-club-orders",
  },
};
