/* =========================================================
   POSTERS CLUB — SHARED SITE BEHAVIOR
   Nav toggle, mobile menu, slideshow, WhatsApp link, footer.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
  }

  // Wire up WhatsApp float + any data-whatsapp elements
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  });
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = SITE_CONFIG.instagramUrl;
  });
  document.querySelectorAll("[data-instagram-handle]").forEach((el) => {
    el.textContent = SITE_CONFIG.instagramHandle;
  });

  initSlideshow();
  initInstagramGallery();
  initLightbox();
});

function initLightbox() {
  const overlay = document.getElementById("lightbox");
  if (!overlay) return;
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;
    img.src = trigger.dataset.lightbox;
    caption.textContent = trigger.dataset.lightboxCaption || "";
    overlay.classList.add("open");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".lightbox-close")) {
      overlay.classList.remove("open");
      img.src = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { overlay.classList.remove("open"); img.src = ""; }
  });
}

function initSlideshow() {
  const track = document.querySelector(".slideshow-track");
  if (!track) return;

  track.innerHTML = PREVIOUS_WORK.map(
    (item) => `
    <div class="slide">
      <img src="${item.image}" alt="${item.caption}" loading="lazy" data-lightbox="${item.image}" data-lightbox-caption="${item.caption}" />
      <div class="slide-caption">${item.caption} <span style="opacity:.7; font-weight:500;">· click to view full size</span></div>
    </div>`
  ).join("");

  const dotsWrap = document.querySelector(".slide-dots");
  dotsWrap.innerHTML = PREVIOUS_WORK.map((_, i) => `<button class="slide-dot${i === 0 ? " active" : ""}" data-i="${i}"></button>`).join("");

  let index = 0;
  const total = PREVIOUS_WORK.length;
  const dots = dotsWrap.querySelectorAll(".slide-dot");

  function go(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  document.querySelector(".slide-arrow.prev").addEventListener("click", () => go(index - 1));
  document.querySelector(".slide-arrow.next").addEventListener("click", () => go(index + 1));
  dots.forEach((d) => d.addEventListener("click", () => go(parseInt(d.dataset.i, 10))));

  let timer = setInterval(() => go(index + 1), 4500);
  const slideshow = document.querySelector(".slideshow");
  slideshow.addEventListener("mouseenter", () => clearInterval(timer));
  slideshow.addEventListener("mouseleave", () => (timer = setInterval(() => go(index + 1), 4500)));
}

function initInstagramGallery() {
  const grid = document.querySelector(".insta-grid");
  if (!grid) return;
  grid.innerHTML = INSTAGRAM_GALLERY.map(
    (src) => `
    <a class="insta-item" href="${SITE_CONFIG.instagramUrl}" target="_blank" rel="noopener">
      <img src="${src}" alt="Posters Club on Instagram" loading="lazy" />
      <div class="overlay">📷</div>
    </a>`
  ).join("");
}

function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}
