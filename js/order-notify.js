/* =========================================================
   POSTERS CLUB — ORDER NOTIFICATIONS (Phase 2, optional)
   Sends the order to the owner by email (via EmailJS) and,
   if configured, uploads custom poster images to Supabase
   Storage first so the email can include permanent links.

   Both integrations are OFF by default — see js/config.js.
   Nothing here runs, and nothing breaks, until you fill in
   the emailjs/supabase values. See README.md for setup steps.
   ========================================================= */

function isEmailConfigured() {
  const c = SITE_CONFIG.emailjs;
  return !!(c && c.serviceId && c.templateId && c.publicKey);
}

function isSupabaseConfigured() {
  const c = SITE_CONFIG.supabase;
  return !!(c && c.url && c.anonKey);
}

let _supabaseClient = null;
function getSupabaseClient() {
  if (!isSupabaseConfigured() || !window.supabase) return null;
  if (!_supabaseClient) {
    _supabaseClient = window.supabase.createClient(SITE_CONFIG.supabase.url, SITE_CONFIG.supabase.anonKey);
  }
  return _supabaseClient;
}

async function uploadCustomImages(order) {
  const client = getSupabaseClient();
  if (!client) return false;

  let anyUploaded = false;
  for (const item of order.items) {
    if (!item.isCustom || !item.customPosters) continue;
    for (let i = 0; i < item.customPosters.length; i++) {
      const poster = item.customPosters[i];
      try {
        const blob = await (await fetch(poster.dataUrl)).blob();
        const path = `${order.orderNumber}/${(item.lineId || "item").replace(/[^a-z0-9_-]/gi, "")}-${i + 1}.jpg`;
        const { error } = await client.storage
          .from(SITE_CONFIG.supabase.bucket)
          .upload(path, blob, { contentType: "image/jpeg", upsert: true });
        if (!error) {
          const { data } = client.storage.from(SITE_CONFIG.supabase.bucket).getPublicUrl(path);
          poster.url = data.publicUrl;
          anyUploaded = true;
        }
      } catch (e) {
        // Skip this one image and keep going — the customer's download
        // fallback on the confirmation page still has every image.
      }
    }
  }
  return anyUploaded;
}

function buildItemsSummary(order) {
  return order.items.map((it) => `${it.qty} x ${it.name} (${it.size}, ${it.type}) - ${it.unitPrice} EGP each`).join("\n");
}

function buildImagesList(order) {
  const lines = [];
  order.items.forEach((it, idx) => {
    if (it.isCustom && it.customPosters) {
      it.customPosters.forEach((p, i) => {
        lines.push(`Item ${idx + 1}, Poster ${i + 1}: ${p.url ? p.url : "(not uploaded - image storage not connected)"}`);
      });
    }
  });
  return lines.length ? lines.join("\n") : "-";
}

async function sendOrderEmail(order) {
  if (!isEmailConfigured() || !window.emailjs) return false;
  try {
    emailjs.init({ publicKey: SITE_CONFIG.emailjs.publicKey });
    await emailjs.send(SITE_CONFIG.emailjs.serviceId, SITE_CONFIG.emailjs.templateId, {
      order_number: order.orderNumber,
      created_at: order.createdAt,
      customer_name: order.customer.fullName,
      customer_phone: order.customer.phone,
      customer_phone2: order.customer.phone2 || "-",
      customer_address: `Building ${order.customer.building}, Apt ${order.customer.apartment}, ${order.customer.street}, ${order.customer.area}, ${order.customer.city}`,
      maps_link: order.customer.mapsLink || "-",
      notes: order.customer.notes || "-",
      items_summary: buildItemsSummary(order),
      images_list: buildImagesList(order),
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
    });
    return true;
  } catch (e) {
    console.error("EmailJS send failed:", e);
    return false;
  }
}

// Orchestrates both steps. Always resolves (never throws) so a failed or
// unconfigured integration never blocks the customer from completing
// their order — the download fallback on the confirmation page always
// still works regardless of what happens here.
async function notifyOrder(order) {
  const result = { imagesUploaded: false, emailSent: false };
  try {
    if (isSupabaseConfigured()) {
      result.imagesUploaded = await uploadCustomImages(order);
    }
    if (isEmailConfigured()) {
      result.emailSent = await sendOrderEmail(order);
    }
  } catch (e) {
    console.error("notifyOrder failed:", e);
  }
  return result;
}
