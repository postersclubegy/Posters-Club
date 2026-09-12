/* =========================================================
   POSTERS CLUB — CART ENGINE
   Cart lives in the browser's localStorage for this dummy
   version (Phase 2 will move this to a real database).
   ========================================================= */

const CART_KEY = "pc_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  // item: { lineId, name, image, size, type, qty, unitPrice, isCustom, customPosters }
  item.lineId = item.lineId || ("li_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7));
  cart.push(item);
  saveCart(cart);
  return item.lineId;
}

function removeFromCart(lineId) {
  const cart = getCart().filter((i) => i.lineId !== lineId);
  saveCart(cart);
}

function updateCartQty(lineId, qty) {
  const cart = getCart();
  const line = cart.find((i) => i.lineId === lineId);
  if (line) {
    line.qty = qty;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
}

function cartTotal() {
  const cart = getCart();
  if (cart.length === 0) return 0;
  return cartSubtotal() + SITE_CONFIG.deliveryFeeEGP;
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function formatMoney(n) {
  return n.toLocaleString("en-US") + " " + SITE_CONFIG.currency;
}

/* Order numbers, e.g. PC-0001, incrementing in localStorage */
function nextOrderNumber() {
  let seq = parseInt(localStorage.getItem("pc_order_seq") || "0", 10);
  seq += 1;
  localStorage.setItem("pc_order_seq", String(seq));
  return "PC-" + String(seq).padStart(4, "0");
}

function saveOrderRecord(order) {
  const orders = JSON.parse(localStorage.getItem("pc_orders") || "[]");
  orders.push(order);
  localStorage.setItem("pc_orders", JSON.stringify(orders));
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
