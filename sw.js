const SITE_CACHE = "site-v1";

self.addEventListener("paymentrequest", e => {
  console.log("Payment Request event")
  e.respondWith(handlePaymentResponse(e));
});

async function handlePaymentResponse(event) {
  const client = await event.openWindow("/sheet.html");
  if (client === null) {
    throw new Error("Failed to open payment window");
  }
}

// Service worker lifecycle management below...
self.addEventListener("install", ev => {
  ev.waitUntil(populateCache());
});

async function populateCache() {
  const keys = await caches.keys();

  for (const key of keys) {
    await caches.delete(key);
  }

  const resources = [
    "/",
    "/assets/style.css",
    "/icons/icon_200.png",
    "/icons/icon.png",
    "/icons/visa.png",
    "/manifest.json",
  ];
  const cache = await caches.open(SITE_CACHE);
  await cache.addAll(resources);
}

self.addEventListener("activate", async () => {
  const keys = await caches.keys();
  await keys.filter(key => key !== SITE_CACHE).map(key => caches.delete(key));
});

self.addEventListener("fetch", ev => {
  ev.respondWith(aCachedResponse(ev));
});

async function aCachedResponse(ev) {
  const response = await caches.match(ev.request);
  if (response) {
    return response;
  }
  console.warn("No caches match for?:", ev.request.url);
  // go to network instead
  try {
    const netResponse = await fetch(ev.request);
    if (netResponse.ok) {
      return netResponse;
    }
  } catch (err) {
    // just return the index if all goes bad.
    console.error(err);
  }
  return await caches.match("/");
}

self.addEventListener("message", event => {
  const {
    data: { action },
  } = event;
  switch (action) {
    case "skipWaiting":
      self.skipWaiting();
      break;
    default:
      console.error("Unhandled message", event);
  }
});
