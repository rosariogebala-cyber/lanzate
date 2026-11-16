/* Medición: Google Analytics 4 y Píxel de Meta.
   Solo se carga si hay IDs en window.SITE.medicion (js/config.js).
   Eventos que se registran:
   - Clic en "Pedí tu boceto gratis"  → GA4: generate_lead · Meta: Lead
   - Clic en cualquier WhatsApp        → GA4: contact       · Meta: Contact
   - Clic en "Pagar con Mercado Pago"  → GA4: begin_checkout · Meta: InitiateCheckout
   - Llegada a gracias.html?plan=...   → GA4: purchase      · Meta: Purchase */
(function () {
  "use strict";

  var site = window.SITE || {};
  var cfg = site.medicion || {};
  var ga4 = (cfg.ga4 || "").trim();
  var pixel = (cfg.metaPixel || "").trim();

  document.querySelectorAll("[data-medicion-on]").forEach(function (el) { el.hidden = !(ga4 || pixel); });
  document.querySelectorAll("[data-medicion-off]").forEach(function (el) { el.hidden = !!(ga4 || pixel); });
  document.querySelectorAll("[data-medicion-lista]").forEach(function (el) {
    el.textContent = ga4 && pixel ? "Google Analytics y el Píxel de Meta" : ga4 ? "Google Analytics" : "el Píxel de Meta";
  });
  if (!ga4 && !pixel) return;

  if (ga4) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ga4);
  }

  if (pixel) {
    /* Código base del Píxel de Meta */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixel);
    window.fbq("track", "PageView");
  }

  function track(gaName, metaName, params) {
    params = params || {};
    if (ga4 && window.gtag) window.gtag("event", gaName, params);
    if (pixel && window.fbq) window.fbq("track", metaName, params);
  }

  var rubro = (location.pathname.match(/\/rubros\/([^/]+)/) || [])[1] || "home";

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    if (a.hasAttribute("data-wa-boceto")) {
      track("generate_lead", "Lead", { content_name: "boceto_gratis", rubro: rubro });
    } else if (a.href.indexOf("wa.me") !== -1) {
      track("contact", "Contact", { content_name: "whatsapp", rubro: rubro });
    } else if (a.closest(".plan")) {
      var plan = a.closest(".plan").querySelector("h3");
      track("begin_checkout", "InitiateCheckout", { content_name: plan ? plan.textContent : "", currency: "ARS", rubro: rubro });
    }
  });

  /* Compra: gracias.html?plan=express|negocio|pro */
  if (/gracias\.html$/.test(location.pathname)) {
    var id = new URLSearchParams(location.search).get("plan");
    var p = (site.planes || []).filter(function (x) { return x.id === id; })[0];
    if (p) track("purchase", "Purchase", { value: p.inicial, currency: "ARS", content_name: p.nombre });
  }
})();
