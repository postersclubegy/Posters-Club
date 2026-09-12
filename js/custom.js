/* =========================================================
   POSTERS CLUB — CUSTOM POSTER DESIGNER
   Each uploaded image becomes its own poster. Customer chooses
   Framed (A3 black frame) or Unframed (A3/A4/A5), Stretch or
   Crop, and — when cropping — can drag to reposition and use a
   zoom slider. A live "wall preview" shows the whole set mocked
   up together on a wall.

   Bundle offers (from the homepage "Offers & Bundles" section)
   arrive via a `?bundle=` URL param and lock the mode + count:
     ?bundle=framed3    -> exactly 3 framed A3 posters, 540 EGP flat
     ?bundle=unframed10 -> exactly 10 unframed posters, priced by size
   Visiting custom.html directly (no bundle param) gives the
   flexible, uncapped Framed flow at 200 EGP/poster, same as before.

   NOTE FOR PHASE 2: right now the finished poster images are
   compressed and stored in the browser only. Once real image
   storage is connected, `finalizePoster()` will upload the
   full-resolution file instead — no other code changes needed.
   ========================================================= */

const POSTER_W = 900;                 // individual-card canvas raster width (A3 ratio)
const POSTER_H = Math.round(POSTER_W * (420 / 297));
const LOW_RES_MIN_SIDE = 1500;        // px — below this we warn about print quality
const UNFRAMED_BUNDLE_COUNT = 10;
const FRAMED_BUNDLE_COUNT = 3;
const FRAMED_BUNDLE_TOTAL = 540;      // flat price for the 3-poster framed bundle
const UNFRAMED_SIZES = CATALOG_PRODUCTS.find((p) => p.id === "unframed-poster").sizes; // [{size,price}]

// Real paper sizes in mm (portrait) — used only to scale the wall preview realistically
const SIZE_MM = { A3: { w: 297, h: 420 }, A4: { w: 210, h: 297 }, A5: { w: 148, h: 210 } };

let posters = []; // { id, img, naturalW, naturalH, fit, zoom, offsetX, offsetY }
let posterMode = "framed";     // "framed" | "unframed"
let framedIsBundle = false;    // true only when arrived via ?bundle=framed3
let unframedSize = "A3";       // "A3" | "A4" | "A5"

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const bundle = params.get("bundle");
  if (bundle === "framed3") framedIsBundle = true;

  buildSizeSelector();
  setPosterMode(bundle === "unframed10" ? "unframed" : "framed");

  const fileInput = document.getElementById("file-input");
  const uploadZone = document.getElementById("upload-zone");
  const uploadBtn = document.getElementById("upload-btn");
  const addMoreBtn = document.getElementById("add-more-btn");
  const addOrderBtn = document.getElementById("add-order-btn");

  uploadBtn.addEventListener("click", () => fileInput.click());
  addMoreBtn.addEventListener("click", () => fileInput.click());
  uploadZone.addEventListener("click", () => fileInput.click());

  ["dragenter", "dragover"].forEach((evt) =>
    uploadZone.addEventListener(evt, (e) => { e.preventDefault(); uploadZone.classList.add("dragover"); })
  );
  ["dragleave", "drop"].forEach((evt) =>
    uploadZone.addEventListener(evt, (e) => { e.preventDefault(); uploadZone.classList.remove("dragover"); })
  );
  uploadZone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));

  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

  addOrderBtn.addEventListener("click", addCustomOrderToCart);

  document.getElementById("mode-group").addEventListener("click", (e) => {
    const card = e.target.closest("[data-mode-card]");
    if (!card) return;
    setPosterMode(card.dataset.modeCard);
  });
});

/* ---------- mode / size selection ---------- */

function getCap() {
  if (posterMode === "unframed") return UNFRAMED_BUNDLE_COUNT;
  if (posterMode === "framed" && framedIsBundle) return FRAMED_BUNDLE_COUNT;
  return Infinity;
}

function getMinRequired() {
  if (posterMode === "unframed") return UNFRAMED_BUNDLE_COUNT;
  if (posterMode === "framed" && framedIsBundle) return FRAMED_BUNDLE_COUNT;
  return 1;
}

function getUnitPrice() {
  if (posterMode === "unframed") {
    return UNFRAMED_SIZES.find((s) => s.size === unframedSize).price;
  }
  if (framedIsBundle) return FRAMED_BUNDLE_TOTAL / FRAMED_BUNDLE_COUNT;
  return CUSTOM_FRAMED_PRICE;
}

function buildSizeSelector() {
  const group = document.getElementById("size-group");
  group.innerHTML = UNFRAMED_SIZES.map((s, i) => `
    <label class="radio-card${i === 0 ? " selected" : ""}" data-size-card="${s.size}">
      <input type="radio" name="unframed-size" ${i === 0 ? "checked" : ""} />
      <strong>${s.size}</strong>
      <div style="font-size:.8rem; color:var(--text-dim); margin-top:4px;">${s.price} EGP each</div>
    </label>
  `).join("");
  group.addEventListener("click", (e) => {
    const card = e.target.closest("[data-size-card]");
    if (!card) return;
    unframedSize = card.dataset.sizeCard;
    group.querySelectorAll("[data-size-card]").forEach((c) => {
      c.classList.toggle("selected", c === card);
      c.querySelector("input").checked = c === card;
    });
    renderDesigner();
  });
}

function setPosterMode(mode) {
  posterMode = mode;
  document.querySelectorAll("[data-mode-card]").forEach((c) => {
    const active = c.dataset.modeCard === mode;
    c.classList.toggle("selected", active);
    c.querySelector("input").checked = active;
  });
  document.getElementById("size-bar").style.display = mode === "unframed" ? "block" : "none";

  const isUnframed = mode === "unframed";
  document.getElementById("mode-card-framed-sub").textContent = framedIsBundle
    ? `A3 · Black frame · Bundle of ${FRAMED_BUNDLE_COUNT} for ${FRAMED_BUNDLE_TOTAL} EGP`
    : "A3 · Black frame · 200 EGP each";

  document.getElementById("mode-intro").innerHTML = isUnframed
    ? `Upload exactly <strong>${UNFRAMED_BUNDLE_COUNT} photos</strong> — each becomes its own <strong>unframed</strong> poster in your chosen size, and you'll see them all mocked up together on a wall.`
    : framedIsBundle
      ? `Upload exactly <strong>${FRAMED_BUNDLE_COUNT} photos</strong> for this bundle — each becomes an <strong>A3, black-framed</strong> poster, previewed hanging together on a wall.`
      : `Upload your photos — each image becomes its own <strong>A3, black-framed</strong> poster. Preview every poster before you order.`;

  document.getElementById("mode-subline").textContent = isUnframed
    ? `All posters are unframed, in your chosen size. Choose how each image fits.`
    : "All posters are A3 · Black Frame. Choose how each image fits inside the frame.";

  renderDesigner();
}

/* ---------- upload handling ---------- */

function handleFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
  if (files.length === 0) return;

  const cap = getCap();
  const remaining = cap - posters.length;
  if (remaining <= 0) {
    showToast(`This bundle only takes ${cap} photos. Remove one first if you'd like to swap it.`);
    return;
  }
  const accepted = files.slice(0, remaining);
  if (accepted.length < files.length) {
    showToast(`Only added ${accepted.length} — this bundle is capped at ${cap} photos.`);
  }

  accepted.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        posters.push({
          id: "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
          img,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
          fit: "crop",
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        });
        renderDesigner();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- rendering ---------- */

function renderDesigner() {
  document.getElementById("upload-step").style.display = posters.length ? "none" : "block";
  document.getElementById("designer-step").style.display = posters.length ? "block" : "none";
  document.getElementById("poster-count").textContent = posters.length;
  document.getElementById("add-more-btn").style.display = posters.length >= getCap() ? "none" : "inline-flex";

  const isUnframed = posterMode === "unframed";
  const grid = document.getElementById("poster-grid");
  grid.innerHTML = posters.map((p, i) => `
    <div class="poster-card" data-poster-id="${p.id}">
      <div class="frame-preview${isUnframed ? " no-frame" : ""}"><canvas width="${POSTER_W}" height="${POSTER_H}"></canvas></div>
      <div style="font-weight:700; font-size:.85rem; margin-bottom:8px;">Poster ${i + 1}</div>
      <div class="fit-toggle">
        <button type="button" data-fit="crop" class="${p.fit === "crop" ? "active" : ""}">Crop</button>
        <button type="button" data-fit="stretch" class="${p.fit === "stretch" ? "active" : ""}">Stretch</button>
      </div>
      <div class="crop-adjust" style="display:${p.fit === "crop" ? "block" : "none"};">
        <div class="crop-controls">
          <label><span>Zoom</span><span data-zoom-val>${p.zoom.toFixed(2)}×</span></label>
          <input type="range" min="1" max="2.5" step="0.05" value="${p.zoom}" data-zoom-input />
        </div>
        <div class="crop-hint">🖐️ Drag the image to reposition it</div>
      </div>
      <div class="res-note"></div>
      <a href="#" class="remove-poster" data-remove="${p.id}">Remove</a>
    </div>
  `).join("");

  posters.forEach((p) => {
    const card = grid.querySelector(`[data-poster-id="${p.id}"]`);
    const canvas = card.querySelector("canvas");
    drawPoster(canvas, p);
    renderResNote(card.querySelector(".res-note"), p);
    wirePanning(canvas, p);
    updateCanvasCursor(canvas, p);

    card.querySelectorAll("[data-fit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        p.fit = btn.dataset.fit;
        card.querySelectorAll("[data-fit]").forEach((b) => b.classList.toggle("active", b === btn));
        card.querySelector(".crop-adjust").style.display = p.fit === "crop" ? "block" : "none";
        updateCanvasCursor(canvas, p);
        drawPoster(canvas, p);
        renderWallPreview();
      });
    });

    const zoomInput = card.querySelector("[data-zoom-input]");
    zoomInput.addEventListener("input", () => {
      p.zoom = parseFloat(zoomInput.value);
      card.querySelector("[data-zoom-val]").textContent = p.zoom.toFixed(2) + "×";
      drawPoster(canvas, p);
      renderWallPreview();
    });

    card.querySelector("[data-remove]").addEventListener("click", (e) => {
      e.preventDefault();
      posters = posters.filter((x) => x.id !== p.id);
      renderDesigner();
    });
  });

  updateSummary();
  renderWallPreview();
}

function updateCanvasCursor(canvas, p) {
  canvas.classList.toggle("pannable", p.fit === "crop");
  canvas.classList.remove("panning");
}

function wirePanning(canvas, p) {
  let drag = null;

  canvas.addEventListener("pointerdown", (e) => {
    if (p.fit !== "crop") return;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("panning");
    drag = { x: e.clientX, y: e.clientY, offsetX: p.offsetX, offsetY: p.offsetY };
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const dx = (e.clientX - drag.x) * scaleX;
    const dy = (e.clientY - drag.y) * scaleY;

    const scale = Math.max(canvas.width / p.img.naturalWidth, canvas.height / p.img.naturalHeight) * p.zoom;
    const maxOffXpx = Math.max(0, (p.img.naturalWidth - canvas.width / scale) / 2);
    const maxOffYpx = Math.max(0, (p.img.naturalHeight - canvas.height / scale) / 2);
    const srcDx = dx / scale;
    const srcDy = dy / scale;

    p.offsetX = maxOffXpx > 0 ? clamp(drag.offsetX - srcDx / maxOffXpx, -1, 1) : 0;
    p.offsetY = maxOffYpx > 0 ? clamp(drag.offsetY - srcDy / maxOffYpx, -1, 1) : 0;
    drawPoster(canvas, p);
    renderWallPreview();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((evt) =>
    canvas.addEventListener(evt, () => { drag = null; canvas.classList.remove("panning"); })
  );
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/* ---------- drawing (shared by individual cards + the wall preview) ---------- */

function getCropRect(p, destW, destH) {
  const scale = Math.max(destW / p.img.naturalWidth, destH / p.img.naturalHeight) * p.zoom;
  const sw = destW / scale, sh = destH / scale;
  const maxOffX = Math.max(0, (p.img.naturalWidth - sw) / 2);
  const maxOffY = Math.max(0, (p.img.naturalHeight - sh) / 2);
  let sx = (p.img.naturalWidth - sw) / 2 + p.offsetX * maxOffX;
  let sy = (p.img.naturalHeight - sh) / 2 + p.offsetY * maxOffY;
  sx = clamp(sx, 0, Math.max(0, p.img.naturalWidth - sw));
  sy = clamp(sy, 0, Math.max(0, p.img.naturalHeight - sh));
  return { sx, sy, sw, sh };
}

function drawPosterInto(ctx, p, dx, dy, dw, dh) {
  if (p.fit === "stretch") {
    ctx.drawImage(p.img, dx, dy, dw, dh);
    return;
  }
  const r = getCropRect(p, dw, dh);
  ctx.drawImage(p.img, r.sx, r.sy, r.sw, r.sh, dx, dy, dw, dh);
}

function drawPoster(canvas, p) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPosterInto(ctx, p, 0, 0, canvas.width, canvas.height);
}

function renderResNote(el, p) {
  const shortSide = Math.min(p.naturalW, p.naturalH);
  if (shortSide < LOW_RES_MIN_SIDE) {
    el.innerHTML = `<div class="res-warning">⚠️ This image (${p.naturalW}×${p.naturalH}px) may look low quality when printed. It will still print, but a higher-resolution photo will look sharper.</div>`;
  } else {
    el.innerHTML = `<div class="res-ok">✓ Good resolution for print</div>`;
  }
}

/* ---------- wall preview ---------- */

// The scale is always calibrated off the A3 layout for this poster count —
// NOT off whichever size is currently selected, and NOT re-fit separately
// per size. That's what makes A4/A5 render genuinely, proportionally
// smaller than A3 instead of each just independently filling the
// container width (which is what was hiding the size difference before).
function computeWallLayout() {
  const count = posters.length;
  if (count < 2) return null;

  const isFramed = posterMode === "framed";
  const frameBorderMM = isFramed ? 14 : 0;
  const cols = count <= 3 ? count : count <= 6 ? 3 : 5;
  const rows = Math.ceil(count / cols);
  const gapMM = 22;
  const marginMM = 30;

  function dimsFor(sizeMM) {
    const slotW = sizeMM.w + frameBorderMM * 2;
    const slotH = sizeMM.h + frameBorderMM * 2;
    return {
      slotW, slotH,
      totalWmm: marginMM * 2 + cols * slotW + (cols - 1) * gapMM,
      totalHmm: marginMM * 2 + rows * slotH + (rows - 1) * gapMM,
    };
  }

  const wrap = document.getElementById("wall-preview-wrap");
  const containerPx = (wrap && wrap.clientWidth) || 1100;
  const refDims = dimsFor(SIZE_MM.A3); // reference size — always A3, regardless of what's selected
  const scale = containerPx / refDims.totalWmm; // calibrated so an A3 layout exactly fills the container

  const sizeMM = isFramed ? SIZE_MM.A3 : SIZE_MM[unframedSize];
  const dims = dimsFor(sizeMM); // the ACTUAL selected size, drawn at the SAME scale

  return { cols, rows, slotW: dims.slotW, slotH: dims.slotH, gapMM, marginMM, scale, totalWmm: dims.totalWmm, totalHmm: dims.totalHmm, frameBorderMM, isFramed };
}

function renderWallPreview() {
  const wrap = document.getElementById("wall-preview-wrap");
  const layout = computeWallLayout();
  if (!layout) { wrap.style.display = "none"; return; }
  wrap.style.display = "block";

  const canvas = document.getElementById("wall-canvas");
  canvas.width = Math.round(layout.totalWmm * layout.scale);
  canvas.height = Math.round(layout.totalHmm * layout.scale);
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#d9d3c8");
  grad.addColorStop(1, "#c2bbac");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  posters.forEach((p, i) => {
    const col = i % layout.cols;
    const row = Math.floor(i / layout.cols);
    const sx = (layout.marginMM + col * (layout.slotW + layout.gapMM)) * layout.scale;
    const sy = (layout.marginMM + row * (layout.slotH + layout.gapMM)) * layout.scale;
    const sw = layout.slotW * layout.scale;
    const sh = layout.slotH * layout.scale;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 14 * layout.scale * 0.3;
    ctx.shadowOffsetY = 6 * layout.scale * 0.3;

    if (layout.isFramed) {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(sx, sy, sw, sh);
      ctx.restore();
      const bw = layout.frameBorderMM * layout.scale;
      drawPosterInto(ctx, p, sx + bw, sy + bw, sw - 2 * bw, sh - 2 * bw);
    } else {
      drawPosterInto(ctx, p, sx, sy, sw, sh);
      ctx.restore();
    }
  });
}

/* ---------- summary + add to cart ---------- */

function updateSummary() {
  const count = posters.length;
  const cap = getCap();
  const minRequired = getMinRequired();
  const unitPrice = getUnitPrice();
  const isBundle = cap !== Infinity;

  document.getElementById("summary-qty-label").textContent = `${count} custom poster${count === 1 ? "" : "s"} (${posterMode})`;
  document.getElementById("summary-unit-price").textContent = `${Math.round(unitPrice)} EGP each`;
  document.getElementById("summary-total").textContent = formatMoney(Math.round(count * unitPrice));

  const btn = document.getElementById("add-order-btn");
  if (count === 0) {
    btn.disabled = true;
    btn.textContent = "Add to Order";
  } else if (count < minRequired) {
    btn.disabled = true;
    btn.textContent = isBundle
      ? `Upload ${minRequired - count} more photo${minRequired - count === 1 ? "" : "s"} (exactly ${minRequired} needed)`
      : `Upload ${minRequired - count} more photo${minRequired - count === 1 ? "" : "s"} (min. ${minRequired})`;
  } else {
    btn.disabled = false;
    btn.textContent = "Add to Order";
  }
}

function addCustomOrderToCart() {
  const minRequired = getMinRequired();
  if (posters.length < minRequired) return;

  const unitPrice = getUnitPrice();
  const isUnframed = posterMode === "unframed";
  const sizeLabel = isUnframed ? unframedSize : "A3";

  const customPosters = posters.map((p) => {
    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W;
    canvas.height = POSTER_H;
    drawPoster(canvas, p);
    return {
      dataUrl: canvas.toDataURL("image/jpeg", 0.82),
      fit: p.fit,
      lowRes: Math.min(p.naturalW, p.naturalH) < LOW_RES_MIN_SIDE,
    };
  });

  try {
    addToCart({
      name: `Custom ${sizeLabel} ${isUnframed ? "Unframed" : "Framed"} Poster${framedIsBundle || isUnframed ? " (Bundle)" : ""}`,
      image: customPosters[0].dataUrl,
      size: sizeLabel,
      type: isUnframed ? "Unframed (Custom)" : "Framed (Custom)",
      qty: customPosters.length,
      unitPrice: Math.round(unitPrice * 100) / 100,
      isCustom: true,
      customPosters,
    });
    window.location.href = "checkout.html";
  } catch (err) {
    showToast("Couldn't save all images — try fewer photos for this demo version.");
  }
}
