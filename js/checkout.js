/* =========================================================
   POSTERS CLUB - CHECKOUT PAGE LOGIC
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderCartList();
  renderSummary();
  document.getElementById("place-order-btn").addEventListener("click", handlePlaceOrder);
});

function renderCartList() {
  const cart = getCart();
  const wrap = document.getElementById("cart-list");
  const formWrap = document.getElementById("order-form-wrap");

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is feeling empty</h3>
        <p>Grab a poster from the shop or make your own to get started.</p>
        <div style="display:flex; gap:12px; justify-content:center; margin-top:10px;">
          <a href="products.html" class="btn btn-primary">Browse the Shop</a>
          <a href="custom.html" class="btn btn-outline">Make Your Own</a>
        </div>
      </div>`;
    formWrap.style.display = "none";
    document.getElementById("place-order-btn").disabled = true;
    return;
  }

  wrap.innerHTML = cart.map((item) => `
    <div class="cart-item" data-line="${item.lineId}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="info">
        <h4>${item.name}</h4>
        <div class="meta-row">
          <span class="meta-chip">${item.size}</span>
          <span class="meta-chip">${item.type}</span>
        </div>
        <div style="margin-top:8px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          ${item.isCustom
            ? `<span class="meta-chip">Qty: ${item.qty} (1 per uploaded photo)</span>`
            : `<div class="qty-stepper">
                 <button type="button" data-step="-1">–</button>
                 <input type="number" value="${item.qty}" min="${item.type === "Unframed" ? 10 : 1}" data-qty-input />
                 <button type="button" data-step="1">+</button>
               </div>`
          }
          <a href="#" class="remove-link" data-remove="${item.lineId}">Remove</a>
        </div>
      </div>
      <div style="text-align:right; font-weight:800;">${formatMoney(item.qty * item.unitPrice)}</div>
    </div>
  `).join("");

  wrap.querySelectorAll(".qty-stepper").forEach((stepper) => {
    const item = cart.find((i) => i.lineId === stepper.closest("[data-line]").dataset.line);
    const input = stepper.querySelector("[data-qty-input]");
    const min = parseInt(input.min, 10);
    stepper.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        let val = (parseInt(input.value, 10) || min) + parseInt(btn.dataset.step, 10);
        if (val < min) val = min;
        input.value = val;
        updateCartQty(item.lineId, val);
        renderCartList();
        renderSummary();
      });
    });
    input.addEventListener("change", () => {
      let val = parseInt(input.value, 10) || min;
      if (val < min) val = min;
      updateCartQty(item.lineId, val);
      renderCartList();
      renderSummary();
    });
  });

  wrap.querySelectorAll("[data-remove]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      removeFromCart(link.dataset.remove);
      renderCartList();
      renderSummary();
    });
  });
}

function depositFor(total) {
  return Math.ceil((total * SITE_CONFIG.depositPercent) / 100);
}

function renderSummary() {
  const subtotal = cartSubtotal();
  const cart = getCart();
  const delivery = cart.length ? SITE_CONFIG.deliveryFeeEGP : 0;
  const total = subtotal + delivery;
  document.getElementById("sum-subtotal").textContent = formatMoney(subtotal);
  document.getElementById("sum-delivery").textContent = formatMoney(delivery);
  document.getElementById("sum-total").textContent = formatMoney(total);
  const depositText = formatMoney(depositFor(total));
  document.getElementById("sum-deposit-label").textContent = `${SITE_CONFIG.depositPercent}% deposit`;
  document.getElementById("sum-deposit").textContent = depositText;
  document.querySelectorAll("[data-deposit-pct]").forEach((el) => { el.textContent = SITE_CONFIG.depositPercent; });
  document.querySelectorAll("[data-deposit-amount]").forEach((el) => { el.textContent = depositText; });
  document.getElementById("deposit-banner").style.display = cart.length ? "flex" : "none";
}

const REQUIRED_FIELDS = ["fullName", "phone", "whatsapp", "building", "apartment", "street", "area", "city"];
const PHONE_RE = /^01[0-25]\d{8}$/;

// Accepts 01XXXXXXXXX, +2010..., 002010..., with spaces or dashes
function normalizePhone(value) {
  let v = (value || "").replace(/[\s\-()]/g, "");
  if (v.startsWith("+20")) v = "0" + v.slice(3);
  else if (v.startsWith("0020")) v = "0" + v.slice(4);
  else if (v.startsWith("20") && v.length === 12) v = "0" + v.slice(2);
  return v;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  const phoneInput = form.querySelector('[name="phone"]');
  const waInput = form.querySelector('[name="whatsapp"]');
  const same = document.getElementById("same-as-phone");
  if (!same) return;
  const sync = () => { if (same.checked) waInput.value = phoneInput.value; };
  same.addEventListener("change", sync);
  phoneInput.addEventListener("input", sync);
  waInput.addEventListener("input", () => {
    if (same.checked && waInput.value !== phoneInput.value) same.checked = false;
  });
});

async function handlePlaceOrder() {
  const cart = getCart();
  if (cart.length === 0) return;

  const form = document.getElementById("order-form");
  const data = Object.fromEntries(new FormData(form).entries());

  let valid = true;
  REQUIRED_FIELDS.forEach((name) => {
    const fieldWrap = form.querySelector(`[name="${name}"]`).closest(".field");
    const filled = (data[name] || "").trim().length > 0;
    fieldWrap.classList.toggle("invalid", !filled);
    if (!filled) valid = false;
  });

  const phoneWrap = document.getElementById("f-phone");
  const phoneValid = PHONE_RE.test(normalizePhone(data.phone));
  phoneWrap.classList.toggle("invalid", !phoneValid);
  if (!phoneValid) valid = false;

  const waWrap = document.getElementById("f-whatsapp");
  const waValid = PHONE_RE.test(normalizePhone(data.whatsapp));
  waWrap.classList.toggle("invalid", !waValid);
  if (!waValid) valid = false;

  if (!valid) {
    showToast("Oops, a few required fields are still empty.");
    document.querySelector(".field.invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const orderNumber = nextOrderNumber();
  const subtotal = cartSubtotal();
  const delivery = SITE_CONFIG.deliveryFeeEGP;

  const order = {
    orderNumber,
    createdAt: new Date().toLocaleString(),
    customer: {
      fullName: data.fullName.trim(),
      phone: normalizePhone(data.phone),
      whatsapp: normalizePhone(data.whatsapp),
      building: data.building.trim(),
      apartment: data.apartment.trim(),
      street: data.street.trim(),
      area: data.area.trim(),
      city: data.city.trim(),
      mapsLink: (data.mapsLink || "").trim(),
      notes: (data.notes || "").trim(),
    },
    items: cart,
    subtotal,
    delivery,
    total: subtotal + delivery,
    depositPercent: SITE_CONFIG.depositPercent,
    deposit: depositFor(subtotal + delivery),
    paymentStatus: "Pending",
  };

  const placeBtn = document.getElementById("place-order-btn");
  const statusEl = document.getElementById("place-order-status");
  placeBtn.disabled = true;
  placeBtn.textContent = "Placing your order...";
  if (statusEl) statusEl.textContent = "";

  let notifyResult = { emailSent: false, imagesUploaded: false };
  try {
    if (typeof notifyOrder === "function") {
      notifyResult = await notifyOrder(order);
    }
  } catch (e) {
    // Never block the order on a failed notification - the customer
    // still gets their confirmation and download fallback either way.
  }
  order.emailSent = notifyResult.emailSent;
  order.imagesUploaded = notifyResult.imagesUploaded;

  saveOrderRecord(order);
  sessionStorage.setItem("pc_last_order", JSON.stringify(order));
  clearCart();

  window.location.href = "confirmation.html";
}
