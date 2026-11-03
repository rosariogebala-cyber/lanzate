(function () {
  "use strict";

  var site = window.SITE || {};
  var money = new Intl.NumberFormat("es-AR");
  function price(n) { return "$" + money.format(n); }
  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function waUrl(text) {
    return "https://wa.me/" + site.whatsapp + "?text=" + encodeURIComponent(text);
  }
  function buyUrl(plan) {
    if (plan.mp) return plan.mp;
    return "mailto:" + site.email + "?subject=" + encodeURIComponent("Quiero el plan " + plan.nombre) +
      "&body=" + encodeURIComponent("Hola, quiero contratar el plan " + plan.nombre + " (" + price(plan.inicial) + " + " + price(plan.mensual) + "/mes).\n\nNegocio:\nRubro:\nWhatsApp:");
  }

  /* Aviso de promo */
  var promo = document.querySelector("[data-promo]");
  var promoKey = "lanzate-promo-cerrada";
  if (promo && site.promo && site.promo.activa && !sessionStorage.getItem(promoKey)) {
    promo.querySelector("[data-promo-text]").textContent = site.promo.texto + (site.promo.hasta ? ", hasta el " + site.promo.hasta + "." : ".");
    promo.hidden = false;
    promo.querySelector("[data-promo-close]").addEventListener("click", function () {
      promo.hidden = true;
      sessionStorage.setItem(promoKey, "1");
    });
  }

  /* Menú en celular */
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    document.body.classList.toggle("nav-open", open);
  }
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });

  /* Sombra del header al bajar; botón de WhatsApp visible al bajar y frenado arriba del footer */
  var header = document.querySelector("[data-header]");
  var waFloat = document.querySelector(".wa-float");
  var footer = document.querySelector(".site-footer");
  var heroScroll = document.querySelector("[data-hero-scroll]");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    var inHero = heroScroll ? heroScroll.getBoundingClientRect().bottom > header.offsetHeight : false;
    header.classList.toggle("is-hero", inHero);
    if (!waFloat) return;
    waFloat.classList.toggle("is-visible", window.scrollY > 300 && !inHero);
    var lift = footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top) : 0;
    waFloat.style.setProperty("--wa-lift", lift + "px");
    waFloat.classList.toggle("is-docked", lift > 0);
  }
  window.addEventListener("resize", onScroll);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Planes */
  var plans = site.planes || [];
  var plansEl = document.querySelector("[data-plans]");
  if (plansEl) {
    plansEl.innerHTML = plans.map(function (p) {
      var off = p.antes ? Math.round((1 - p.inicial / p.antes) * 100) : 0;
      return '<article class="plan' + (p.destacado ? " is-featured" : "") + '">' +
        (p.destacado ? '<span class="plan-badge"><i class="bi bi-star-fill"></i> Más elegido</span>' : "") +
        '<header class="plan-head"><h3>' + esc(p.nombre) + "</h3>" +
        (off ? '<span class="plan-off">' + off + "% off</span>" : "") + "</header>" +
        '<p class="plan-for">' + esc(p.para) + "</p>" +
        '<div class="plan-price">' +
        (p.antes ? '<s class="plan-before">' + price(p.antes) + "</s>" : "") +
        '<strong>' + price(p.inicial) + '</strong><span>pago único</span></div>' +
        '<p class="plan-monthly">+ <b>' + price(p.mensual) + "</b>/mes · hosting, dominio y soporte</p>" +
        '<a class="btn ' + (p.destacado ? "btn-primary" : "btn-dark") + ' btn-block" href="' + esc(buyUrl(p)) + '"' + (p.mp ? ' target="_blank" rel="noopener"' : "") + '>' +
        "Pagar con Mercado Pago</a>" +
        '<p class="plan-delivery"><i class="bi bi-rocket-takeoff"></i> ' + esc(p.entrega) + "</p>" +
        '<ul class="plan-list">' + p.incluye.map(function (f) { return '<li><i class="bi bi-check2"></i>' + esc(f) + "</li>"; }).join("") + "</ul>" +
        "</article>";
    }).join("");
  }

  var from = document.querySelector("[data-from-price]");
  if (from && plans.length) from.textContent = price(Math.min.apply(null, plans.map(function (p) { return p.inicial; })));

  var compareEl = document.querySelector("[data-compare]");
  if (compareEl && site.comparar) {
    var cell = function (v) {
      if (v === true) return '<td><i class="bi bi-check-circle-fill is-yes" aria-label="Incluido"></i></td>';
      if (v === false) return '<td><i class="bi bi-dash is-no" aria-label="No incluido"></i></td>';
      return "<td>" + esc(v) + "</td>";
    };
    compareEl.innerHTML = "<thead><tr><th scope=\"col\"><span class=\"sr-only\">Función</span></th>" +
      plans.map(function (p) { return '<th scope="col"' + (p.destacado ? ' class="is-featured"' : "") + ">" + esc(p.nombre) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      site.comparar.map(function (row) {
        return '<tr><th scope="row">' + esc(row[0]) + "</th>" + row.slice(1).map(cell).join("") + "</tr>";
      }).join("") +
      '<tr class="compare-price"><th scope="row">Precio</th>' + plans.map(function (p) {
        return "<td><strong>" + price(p.inicial) + "</strong><small>+ " + price(p.mensual) + "/mes</small></td>";
      }).join("") + "</tr></tbody>";
  }

  /* Contacto */
  document.querySelectorAll("[data-wa-link]").forEach(function (a) {
    a.href = waUrl("Hola, quiero consultar por una landing para mi negocio.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-wa-rubro]").forEach(function (a) {
    a.href = waUrl("Hola, quiero una landing para " + a.getAttribute("data-wa-rubro") + ". ¿Cómo quedaría?");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-mail-link]").forEach(function (a) {
    a.href = "mailto:" + site.email;
    a.lastChild.textContent = " " + site.email;
  });
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* Datos estructurados para buscadores: servicio, planes y preguntas frecuentes */
  var pageUrl = document.querySelector('link[rel="canonical"]');
  pageUrl = pageUrl ? pageUrl.href : location.href;
  var schema = [{
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": site.marca,
    "url": pageUrl,
    "image": new URL("img/og-lanzate.jpg", pageUrl).href,
    "logo": new URL("img/apple-touch-icon.png", pageUrl).href,
    "description": document.querySelector('meta[name="description"]').content,
    "email": site.email,
    "telephone": "+" + site.whatsapp,
    "areaServed": { "@type": "Country", "name": "Argentina" },
    "priceRange": "$" + money.format(Math.min.apply(null, plans.map(function (p) { return p.inicial; }))) + " - $" + money.format(Math.max.apply(null, plans.map(function (p) { return p.inicial; }))),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Planes de landing pages",
      "itemListElement": plans.map(function (p) {
        return {
          "@type": "Offer",
          "name": "Plan " + p.nombre,
          "description": p.para,
          "price": p.inicial,
          "priceCurrency": "ARS",
          "itemOffered": { "@type": "Service", "name": "Landing page plan " + p.nombre }
        };
      })
    }
  }, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Array.prototype.map.call(document.querySelectorAll(".faq details"), function (d) {
      return {
        "@type": "Question",
        "name": d.querySelector("summary").textContent.trim(),
        "acceptedAnswer": { "@type": "Answer", "text": d.querySelector("p").textContent.trim() }
      };
    })
  }];
  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify(schema);
  document.head.appendChild(ld);

  /* Aparición suave al hacer scroll */
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !calm) {
    var targets = document.querySelectorAll(".section-head, .step, .plan, .plans-note, .compare, .example, .rubros, .vs-col, .feature, .quote, .guarantee-row, .faq details, .final-box");
    targets.forEach(function (el) {
      var group = Array.prototype.filter.call(el.parentNode.children, function (sib) { return sib.matches(".step, .plan, .example, .vs-col, .feature, .quote, .faq details"); });
      var index = group.indexOf(el);
      el.style.setProperty("--i", index > 0 ? Math.min(index, 6) : 0);
      el.classList.add("reveal");
      el.addEventListener("transitionend", function done(e) {
        if (e.target !== el || e.propertyName !== "opacity") return;
        el.classList.add("is-done");
        el.removeEventListener("transitionend", done);
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Hero: la landing se arma y despega según el scroll */
  if (heroScroll) {
    heroScroll.querySelectorAll("[data-hero-price]").forEach(function (el) {
      var plan = plans.filter(function (p) { return p.id === el.getAttribute("data-hero-price"); })[0];
      if (plan) el.textContent = price(plan.inicial);
    });
    var atEls = heroScroll.querySelectorAll("[data-at]");
    var rangeEls = heroScroll.querySelectorAll("[data-range]");
    var clamp01 = function (v) { return Math.max(0, Math.min(1, v)); };
    var heroTick = false;
    var updateHero = function () {
      heroTick = false;
      var total = heroScroll.offsetHeight - window.innerHeight;
      var p = calm || total <= 0 ? 1 : clamp01(-heroScroll.getBoundingClientRect().top / total);
      heroScroll.style.setProperty("--p", p.toFixed(4));
      atEls.forEach(function (n) { n.classList.toggle("is-on", p >= parseFloat(n.getAttribute("data-at"))); });
      rangeEls.forEach(function (n) {
        var r = n.getAttribute("data-range").split(",");
        n.classList.toggle("is-active", p >= parseFloat(r[0]) && p < parseFloat(r[1]));
      });
    };
    var queueHero = function () {
      if (heroTick) return;
      heroTick = true;
      requestAnimationFrame(updateHero);
    };
    window.addEventListener("scroll", queueHero, { passive: true });
    window.addEventListener("resize", queueHero);
    updateHero();
  }
})();
