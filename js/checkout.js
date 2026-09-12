/* =========================================================
   POSTERS CLUB — CHECKOUT PAGE LOGIC
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
        <h3>Your cart is empty</h3>
        <p>Add a poster from the shop or create a custom one to get started.</p>
        <div style="display:flex; gap:12px; justify-content:center; margin-top:10px;">
          <a href="products.html" class="btn btn-primary">Browse Designs</a>
          <a href="custom.html" class="btn btn-outline">Create Custom Poster</a>
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

function renderSummary() {
  const subtotal = cartSubtotal();
  const cart = getCart();
  const delivery = cart.length ? SITE_CONFIG.deliveryFeeEGP : 0;
  document.getElementById("sum-subtotal").textContent = formatMoney(subtotal);
  document.getElementById("sum-delivery").textContent = formatMoney(delivery);
  document.getElementById("sum-total").textContent = formatMoney(subtotal + delivery);
}

const REQUIRED_FIELDS = ["fullName", "phone", "building", "apartment", "street", "area", "city"];
const PHONE_RE = /^01[0-25]\d{8}$/;

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
  const phoneValid = PHONE_RE.test((data.phone || "").trim());
  phoneWrap.classList.toggle("invalid", !phoneValid);
  if (!phoneValid) valid = false;

  if (!valid) {
    showToast("Please fill in all required fields.");
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
      phone: data.phone.trim(),
      phone2: (data.phone2 || "").trim(),
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
    // Never block the order on a failed notification — the customer
    // still gets their confirmation and download fallback either way.
  }
  order.emailSent = notifyResult.emailSent;
  order.imagesUploaded = notifyResult.imagesUploaded;

  saveOrderRecord(order);
  sessionStorage.setItem("pc_last_order", JSON.stringify(order));
  clearCart();

  window.location.href = "confirmation.html";
}
