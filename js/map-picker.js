/* =========================================================
   POSTERS CLUB - LOCATION PICKER (checkout page)
   Free OpenStreetMap map via Leaflet. The customer opens the map,
   drops a pin (tap, drag, search, or "use my location"), confirms,
   and a Google Maps link to that exact spot is saved into the order.
   ========================================================= */

(function () {
  const CAIRO = [30.0444, 31.2357];

  const modal = document.getElementById("map-modal");
  const openBtn = document.getElementById("open-map-btn");
  const closeBtn = document.getElementById("map-close");
  const cancelBtn = document.getElementById("map-cancel");
  const confirmBtn = document.getElementById("map-confirm");
  const searchInput = document.getElementById("map-search");
  const searchBtn = document.getElementById("map-search-btn");
  const locateBtn = document.getElementById("map-locate-btn");
  const hint = document.getElementById("map-hint");
  const linkInput = document.getElementById("maps-link");
  const status = document.getElementById("map-status");
  if (!modal || !openBtn || typeof L === "undefined") return;

  let map = null;
  let marker = null;
  let pending = null; // { lat, lng } chosen in the map but not yet confirmed
  let saved = null;   // { lat, lng } confirmed by the customer

  const DEFAULT_HINT = "Tap the map or drag the pin so it sits right on your door.";

  function pinIcon() {
    return L.divIcon({ className: "map-pin", html: "📍", iconSize: [34, 34], iconAnchor: [17, 32] });
  }

  function setPin(lat, lng, zoomTo) {
    pending = { lat, lng };
    if (!marker) {
      marker = L.marker([lat, lng], { icon: pinIcon(), draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        pending = { lat: p.lat, lng: p.lng };
      });
    } else {
      marker.setLatLng([lat, lng]);
    }
    if (zoomTo) map.setView([lat, lng], Math.max(map.getZoom(), zoomTo));
    confirmBtn.disabled = false;
  }

  function ensureMap() {
    if (map) return;
    map = L.map("map-canvas", { zoomControl: true }).setView(saved ? [saved.lat, saved.lng] : CAIRO, saved ? 17 : 11);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map);
    map.on("click", (e) => setPin(e.latlng.lat, e.latlng.lng));
    if (saved) setPin(saved.lat, saved.lng);
  }

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    hint.textContent = DEFAULT_HINT;
    ensureMap();
    setTimeout(() => map.invalidateSize(), 60);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showSaved() {
    if (!saved) return;
    const link = `https://www.google.com/maps?q=${saved.lat.toFixed(6)},${saved.lng.toFixed(6)}`;
    linkInput.value = link;
    status.style.display = "block";
    status.innerHTML = `✓ <strong>Location pinned.</strong> <a href="${link}" target="_blank" rel="noopener">See it on the map</a>`;
    openBtn.textContent = "📍 Change my pinned location";
  }

  async function search() {
    const q = searchInput.value.trim();
    if (!q) return;
    hint.textContent = "Searching...";
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=eg&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!data.length) {
        hint.textContent = "We couldn't find that place. Try a nearby landmark, or just tap the map.";
        return;
      }
      setPin(parseFloat(data[0].lat), parseFloat(data[0].lon), 16);
      hint.textContent = "Found it! Drag the pin to fine-tune the spot, then confirm.";
    } catch (e) {
      hint.textContent = "Search isn't working right now. You can still tap the map to drop your pin.";
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      hint.textContent = "Your browser can't share your location. Tap the map to drop your pin instead.";
      return;
    }
    hint.textContent = "Finding you...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPin(pos.coords.latitude, pos.coords.longitude, 17);
        hint.textContent = "Got you! Drag the pin if it's slightly off, then confirm.";
      },
      () => {
        hint.textContent = "We couldn't get your location. Allow location access, or tap the map to drop your pin.";
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  searchBtn.addEventListener("click", search);
  searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); search(); } });
  locateBtn.addEventListener("click", locate);
  confirmBtn.addEventListener("click", () => {
    if (!pending) return;
    saved = { lat: pending.lat, lng: pending.lng };
    showSaved();
    closeModal();
  });
})();
