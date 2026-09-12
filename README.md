# Posters Club — Website (Dummy Version 1)

Welcome! This is your Posters Club website. This file explains, in plain
language, how to look at it, how to change things yourself, and what's
coming next. You don't need to know how to code to follow this.

---

## 1. How to view your website right now

Your website lives in this folder:
`C:\Users\abdul\Documents\PostersClub`

It's made of plain web files (HTML/CSS/JavaScript) — no special software
required to view it. Just ask me ("Claude") in this chat to "preview the
website" any time, and it will open in the browser panel next to our chat.

Later, when you're ready to put it live on the internet so real customers
can visit it, I'll walk you through free hosting (Step 9 below).

---

## 2. What's in this dummy version

✅ Homepage with a slideshow of "previous work" (placeholder photos)
✅ Shop page — ready-made designs, unframed posters (A3/A4/A5, minimum 10),
   and A3 framed posters
✅ Custom Poster Designer — upload your own photos, each becomes its own
   poster; choose Framed or Unframed, Stretch or Crop, and drag/zoom to
   adjust exactly what's visible when cropping
✅ Offers & Bundles section — 1/2/3 framed A3 poster deals + a 10-custom-
   unframed-poster bundle
✅ Shopping cart, checkout form (name, phones, address, Google Maps link)
✅ Fixed 85 EGP delivery fee, automatically added
✅ Order confirmation page with an order number (PC-0001, PC-0002, …)
✅ Real WhatsApp number, email, previous-work photos, and pricing for
   framed/unframed posters (ready-made design photos are still placeholders)
✅ Fully mobile-friendly, click-to-enlarge photo viewer

Ready-made design **photos and prices are still a TEMPORARY DUMMY
VALUE** until you send real ones — everything else above is real.

### Automatic order emails (optional — see Section 8)
The code for emailing every order (with custom poster images) straight
to your inbox is built and ready, but switched off until you complete
two short free signups (EmailJS + Supabase). Until then, or if you skip
Supabase:
- Orders are **not yet emailed to you automatically**. Right now, after a
  customer places an order, the confirmation page lets them (or you, when
  testing) download the order details and any custom poster images as
  files.
- Card payments aren't connected yet (see Section 9 — this needs research
  specific to Egypt before we pick a provider).
- There's no real database — if you clear your browser's data, saved
  test orders disappear.

None of this is a problem for showing you what the site looks and feels
like. Once you approve the design and content, I'll help you set up the
real backend (Section 8) so orders land in your inbox automatically.

---

## 3. The file map (so you know where things live)

```
PostersClub/
├── index.html          → Homepage
├── products.html        → Shop page
├── custom.html          → Custom poster designer
├── checkout.html         → Cart + order form
├── confirmation.html     → "Order received" page
├── css/style.css         → All the site's visual styling (colors, spacing…)
├── js/config.js          → Contact info, delivery fee  ← MOST IMPORTANT FILE FOR YOU
├── js/products-data.js   → Product list, prices, images ← EDIT THIS FOR PRODUCTS
├── js/cart.js            → Shopping cart logic (don't need to touch)
├── js/checkout.js        → Checkout form logic (don't need to touch)
├── js/custom.js          → Custom poster designer logic (don't need to touch)
├── js/main.js            → Shared site behavior (don't need to touch)
└── server.ps1            → The tiny local preview server (don't need to touch)
```

You will realistically only ever need to open **`js/config.js`** and
**`js/products-data.js`** yourself — and honestly, it's easiest to just
tell me what to change in chat ("update the WhatsApp number to
01234567890") and I'll edit the file for you correctly.

---

## 4. How to update things later (once you have real content)

Just tell me in chat, for example:
- "Here's our real logo" → attach the file, I'll swap it in on every page.
- "Change the WhatsApp number to 01xxxxxxxxx" → I edit `js/config.js`.
- "Here are our real prices: A3 unframed = 150 EGP…" → I edit
  `js/products-data.js`.
- "Here are 6 photos of posters we've actually sold" → I replace the
  placeholder slideshow images with your real ones.
- "Add a new ready-made design called…" → I add it to the product list.

You will never need to touch code yourself unless you want to.

---

## 5. About the "dummy" placeholder images

Right now, product photos and the "previous work" slideshow use a free
placeholder photo service (so the site doesn't look empty). They are
clearly not your real posters. Send me your actual photos whenever
you're ready and I'll swap them in — this takes a few minutes, not a
rebuild.

---

## 6. About the logo

No logo file actually reached me in our conversation, so I used a simple
text logo ("P" + "Posters Club") for now. When you send me the real logo
file (PNG or SVG, ideally with a transparent background), I'll drop it
into every page in a few minutes.

---

## 7. Recommended technology (explained simply)

Since your computer doesn't currently have "Node.js" installed (a common
developer tool), I built this dummy version using **plain HTML, CSS, and
JavaScript** — the most basic building blocks of every website. Benefits
for you specifically:
- Nothing to install on your PC.
- Opens instantly, loads fast for customers.
- Can still be hosted professionally for free (Section 9).

For **Phase 2** (real order emails, image storage, and eventually
payments), I recommend adding these free-to-start services — all
configured through simple websites, no coding required from you:

| Need | Recommended tool | Free tier? |
|---|---|---|
| Store custom poster images reliably | **Supabase** or **Cloudinary** | Yes, generous free tier |
| Send you an order email automatically | **Resend** (or a simple form service like Web3Forms) | Yes, free tier |
| Host the website live on the internet | **Netlify** or **Vercel** | Yes, free for a small business site |
| Save orders somewhere permanent | **Supabase** (includes a simple database) | Yes, free tier |

Total realistic monthly cost to run Posters Club online at your current
size: **$0/month**, until you get enough traffic/orders that free tiers
run out — I'll flag that clearly if it ever gets close.

---

## 8. Turning on automatic order emails (optional, free, ~15 minutes)

The site can already email every order straight to postersclubeg@gmail.com
automatically — the code is built and tested, it's just switched off
until you connect two free accounts. Until then, orders keep working
exactly as they do now (saved in the browser + downloadable).

**You need two free accounts:**
- **EmailJS** — actually sends the email, no server needed.
- **Supabase** — stores the custom poster images reliably and gives
  each one a permanent link to put in the email (skip this one if you
  only sell ready-made/unframed/framed posters for now — custom orders
  will still email the text details, just without image links).

### Step-by-step: EmailJS (sends the order email)
1. Go to **https://www.emailjs.com** → click **Sign Up** → sign up free
   (200 emails/month free, plenty to start).
2. In the dashboard, click **Email Services** → **Add New Service** →
   choose **Gmail** → connect postersclubeg@gmail.com → click **Create
   Service**. Copy the **Service ID** it gives you.
3. Click **Email Templates** → **Create New Template**. Set the template
   content to something like:
   ```
   Subject: New Posters Club Order {{order_number}}

   NEW POSTERS CLUB ORDER
   Order #: {{order_number}}
   Date: {{created_at}}

   Customer: {{customer_name}}
   Phone: {{customer_phone}}
   Second phone: {{customer_phone2}}
   Address: {{customer_address}}
   Google Maps: {{maps_link}}
   Notes: {{notes}}

   PRODUCTS:
   {{items_summary}}

   CUSTOM POSTER IMAGES:
   {{images_list}}

   Subtotal: {{subtotal}} EGP
   Delivery: {{delivery}} EGP
   TOTAL: {{total}} EGP
   Payment Status: Pending
   ```
   Save it, then copy the **Template ID**.
4. Click your account name (top right) → **General** → copy your
   **Public Key**.
5. Tell me the 3 values (Service ID, Template ID, Public Key) — I'll
   paste them into `js/config.js` for you. Don't post them anywhere
   public; sending them to me in this chat is fine.

### Step-by-step: Supabase (stores custom poster images)
1. Go to **https://supabase.com** → **Start your project** → sign up
   free → create a new project (pick any name/password/region).
2. In your project, go to **Storage** (left sidebar) → **New bucket** →
   name it `posters-club-orders` → toggle **Public bucket** ON → **Create**.
3. Go to **Project Settings** (gear icon) → **API** → copy the **Project
   URL** and the **anon public** key.
4. Tell me those 2 values — I'll paste them into `js/config.js`.

Once both are filled in, every order will automatically email you the
full details plus links to the custom poster images — no more manual
downloading needed. If you only fill in EmailJS (skip Supabase), you'll
still get the order details by email, just without image links.

## 9. Publishing the site live on the internet

When you're happy with the site, I'll walk you through hosting it for
free with **Netlify** or **Vercel** so it gets a real web address you
can put in your Instagram bio — no installs needed, just drag-and-drop
or connect a GitHub account, and I'll guide each click.

---

## 10. Payment research (card payments in Egypt) — not started yet

You asked me to research whether Posters Club can accept card payments
online affordably in Egypt. I haven't done this research yet — it's a
meaningful investigation (setup fees, transaction %, whether a business
license is required, etc. for providers like **Paymob**, **Fawry**, or
**PayTabs**). Say the word and I'll do this research properly and come
back with real numbers and a recommendation, rather than guessing.

**Until then**, the site is wired for the fallback plan you asked for:
the customer places the order, sees "Payment: Pending," and you contact
them afterward to arrange an **InstaPay** transfer. This is already
working in the dummy site.

---

## 11. Quick summary of what to do next

1. Look through the site with me in this chat and tell me what to change.
2. Whenever ready, send me: real product photos for the ready-made
   designs, and the exact logo file (attached, not pasted) if you want
   the precise original instead of my recreation.
3. Tell me when you want to do the EmailJS/Supabase signup (Section 8)
   so orders start emailing you automatically.
4. Tell me when you want me to research Egypt card-payment options.
5. Tell me when you're ready to publish the site live (Section 9).

No rush — we'll do this at whatever pace works for you.
