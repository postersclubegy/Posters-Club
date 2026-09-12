/* =========================================================
   POSTERS CLUB — PRODUCT DATA (DUMMY)
   Every price/image here is a TEMPORARY DUMMY VALUE.
   To update later: change the text/numbers below, or replace
   the image URLs with links to your own photos.
   See README.md → "How to update products" for exact steps.
   ========================================================= */

// All images on this site are now real photos pulled from the live
// @postersclub.egy Instagram feed (assets/previous-work/instagram/).
// Prices below are still TEMPORARY DUMMY VALUEs — only unframed/framed/
// custom base pricing further down is real. Swap any image by changing
// its file name here; swap the whole photo pool by re-running the
// Instagram pull (ask me) since those signed image links expire.

// Ready-made designs — each is a real product customers can add straight to cart.
// All framed designs are a flat 200 EGP (matches the standalone framed poster price).
// Each image (except Vini Jr, kept as the original photo per your note) is the
// actual design cropped from your Instagram post — or, where the Instagram
// photo was too small/angled to look good, a high-quality version of that same
// design — composited into the same A3 black-frame look used in the custom
// poster designer. More designs to come once you send the next batch.
const READY_MADE_DESIGNS = [
  { id: "rm-01", name: "Vini Jr. Framed Poster", image: "assets/previous-work/instagram/ig-01.jpg", size: "A3", type: "Framed", price: 200, tag: "Bestseller" },
  { id: "rm-02", name: "Motivational Print", image: "assets/designs/motivational-framed.jpg", size: "A3", type: "Framed", price: 200, tag: null },
  { id: "rm-03", name: "Music Is The Answer Poster", image: "assets/designs/music-framed.jpg", size: "A3", type: "Framed", price: 200, tag: "New" },
  { id: "rm-04", name: "Joker Poster", image: "assets/designs/joker-framed.jpg", size: "A3", type: "Framed", price: 200, tag: "Bestseller" },
  { id: "rm-05", name: "Pulp Fiction Poster", image: "assets/designs/pulpfiction-framed.jpg", size: "A3", type: "Framed", price: 200, tag: null },
  { id: "rm-06", name: "Porsche Racing Poster", image: "assets/designs/porsche-framed.jpg", size: "A3", type: "Framed", price: 200, tag: "New" },
  { id: "rm-07", name: "Scarface Poster", image: "assets/designs/scarface-framed.jpg", size: "A3", type: "Framed", price: 200, tag: null },
  { id: "rm-08", name: "Al Ahly Club Poster", image: "assets/designs/alahly-framed.jpg", size: "A3", type: "Framed", price: 200, tag: null },
];

// Base catalog products (unframed + framed) — these drive the size/qty logic
const CATALOG_PRODUCTS = [
  {
    id: "unframed-poster",
    name: "Unframed Poster",
    material: "Crochet Paper",
    image: "assets/previous-work/instagram/ig-13.jpg",
    type: "Unframed",
    minQty: 10,
    sizes: [
      { size: "A3", price: 40 },
      { size: "A4", price: 30 },
      { size: "A5", price: 20 },
    ],
  },
  {
    id: "framed-poster",
    name: "Framed Poster",
    material: "A3 · Black Frame",
    image: "assets/previous-work/instagram/ig-05.jpg",
    type: "Framed",
    minQty: 1,
    sizes: [
      { size: "A3", price: 200 },
    ],
    // Bundle offers for A3 framed posters — SUGGESTED discount tiers, tell me
    // if you'd rather set different bundle prices.
    offers: [
      { label: "1 Poster", qty: 1, total: 200 },
      { label: "2 Posters", qty: 2, total: 380 },
      { label: "3 Posters", qty: 3, total: 540 },
    ],
  },
];

// Custom poster pricing (per finished poster, A3)
const CUSTOM_FRAMED_PRICE = 200;   // A3, black frame — matches the single framed poster price
const CUSTOM_UNFRAMED_PRICE = 40;  // A3, unframed — matches the unframed A3 price, min. 10

// Previously-sold posters for the homepage trust slideshow
// Pulled from the real @postersclub.egy Instagram feed.
const PREVIOUS_WORK = [
  { image: "assets/previous-work/instagram/ig-01.jpg", caption: "Framed Vini Jr. poster" },
  { image: "assets/previous-work/instagram/ig-02.jpg", caption: "Custom football poster wall" },
  { image: "assets/previous-work/instagram/ig-05.jpg", caption: "Framed poster corner setup" },
  { image: "assets/previous-work/instagram/ig-06.jpg", caption: "Custom movie poster set" },
  { image: "assets/previous-work/instagram/ig-07.jpg", caption: "Music & vinyl-themed poster wall" },
  { image: "assets/previous-work/instagram/ig-08.jpg", caption: "Football legends poster collection" },
  { image: "assets/previous-work/instagram/ig-09.jpg", caption: "Movie & TV poster wall" },
  { image: "assets/previous-work/instagram/ig-10.jpg", caption: "Classic film poster wall" },
  { image: "assets/previous-work/instagram/ig-12.jpg", caption: "Retro & pop culture poster wall" },
  { image: "assets/previous-work/instagram/ig-13.jpg", caption: "Fashion & streetwear poster wall" },
  { image: "assets/previous-work/instagram/ig-14.jpg", caption: "Football & film poster mix" },
  { image: "assets/previous-work/instagram/ig-16.jpg", caption: "Icons & motorsport poster set" },
  { image: "assets/previous-work/instagram/ig-20.jpg", caption: "Movie & anime poster wall" },
  { image: "assets/previous-work/instagram/ig-24.jpg", caption: "Classic cinema poster wall" },
  { image: "assets/previous-work/instagram/ig-32.jpg", caption: "Al Ahly club poster set" },
  { image: "assets/previous-work/instagram/ig-34.jpg", caption: "Football legends poster wall" },
];

// Featured offers shown in the homepage "Offers & Bundles" section
const OFFERS = [
  { title: "3 Framed A3 Posters", desc: "Upload 3 of your own photos — see them framed side by side on a wall before you order.", price: 540, link: "custom.html?bundle=framed3" },
  { title: "10 Unframed Posters", desc: "Upload 10 of your own photos — see the whole collection mocked up on a wall. Price depends on size (A3/A4/A5).", price: 400, link: "custom.html?bundle=unframed10" },
];

// Instagram gallery section at the bottom of the homepage
const INSTAGRAM_GALLERY = [
  "assets/previous-work/instagram/ig-17.jpg",
  "assets/previous-work/instagram/ig-18.jpg",
  "assets/previous-work/instagram/ig-19.jpg",
  "assets/previous-work/instagram/ig-22.jpg",
  "assets/previous-work/instagram/ig-23.jpg",
  "assets/previous-work/instagram/ig-25.jpg",
  "assets/previous-work/instagram/ig-26.jpg",
  "assets/previous-work/instagram/ig-27.jpg",
  "assets/previous-work/instagram/ig-29.jpg",
  "assets/previous-work/instagram/ig-30.jpg",
  "assets/previous-work/instagram/ig-33.jpg",
];
