(function () {
  "use strict";

  var site = window.SITE || {};
  var legal = site.legal || {};
  var waBase = "https://wa.me/" + site.whatsapp;

  document.querySelectorAll("[data-wa-link]").forEach(function (a) {
    a.href = waBase;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-mail-link]").forEach(function (a) {
    a.href = "mailto:" + site.email;
    if (a.hasAttribute("data-mail-text")) a.textContent = site.email;
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var fiscal = document.querySelector("[data-fiscal]");
  if (fiscal) {
    var parts = [];
    if (legal.razonSocial) parts.push(legal.razonSocial);
    if (legal.cuit) parts.push("CUIT " + legal.cuit);
    if (legal.domicilio) parts.push(legal.domicilio);
    if (parts.length || legal.dataFiscal) {
      fiscal.innerHTML = "";
      if (parts.length) {
        var span = document.createElement("span");
        span.textContent = parts.join(" · ");
        fiscal.appendChild(span);
      }
      if (legal.dataFiscal) {
        var qr = document.createElement("a");
        qr.href = legal.dataFiscal;
        qr.target = "_blank";
        qr.rel = "noopener";
        qr.innerHTML = '<i class="bi bi-qr-code"></i> Data Fiscal';
        fiscal.appendChild(qr);
      }
      fiscal.hidden = false;
    }
  }

  /* Datos fiscales dentro de los textos: solo se muestran los que están completos */
  function fillLegal(root) {
    root.querySelectorAll("[data-legal]").forEach(function (el) {
      var value = legal[el.getAttribute("data-legal")];
      if (value) el.textContent = value;
      else if (el.hasAttribute("data-legal-optional")) el.hidden = true;
    });
  }

  /* Botón de arrepentimiento: arma el pedido y lo envía por mail o WhatsApp */
  function setupRegret(root) {
    var form = root.querySelector("[data-regret-form]");
    if (!form) return;
    function message() {
      var d = new FormData(form);
      return "Hola, quiero ejercer mi derecho de arrepentimiento y revocar la contratación.\n\n" +
        "Nombre y apellido: " + d.get("nombre") + "\n" +
        "DNI o CUIT: " + d.get("documento") + "\n" +
        "Mail: " + d.get("email") + "\n" +
        "Plan contratado: " + d.get("plan") + "\n" +
        "Fecha de pago: " + d.get("fecha") + "\n" +
        (d.get("detalle") ? "Comentarios: " + d.get("detalle") + "\n" : "") +
        "\nPor favor, envíenme el código de identificación del trámite.";
    }
    function send(channel) {
      if (!form.reportValidity()) return;
      var text = message();
      var url = channel === "wa"
        ? waBase + "?text=" + encodeURIComponent(text)
        : "mailto:" + site.email + "?subject=" + encodeURIComponent("Arrepentimiento de compra") + "&body=" + encodeURIComponent(text);
      window.open(url, channel === "wa" ? "_blank" : "_self");
      root.querySelector("[data-regret-ok]").classList.add("is-on");
    }
    var plans = form.querySelector("select[name=plan]");
    (site.planes || []).forEach(function (p) {
      var o = document.createElement("option");
      o.textContent = "Plan " + p.nombre;
      plans.appendChild(o);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); send("mail"); });
    form.querySelector("[data-regret-wa]").addEventListener("click", function () { send("wa"); });
  }

  fillLegal(document);
  setupRegret(document);

  /* Lightbox: los legales se abren sobre el sitio sin cambiar de página */
  var pages = /(?:^|\/)(terminos|privacidad|arrepentimiento)\.html$/;
  if (!window.fetch || !window.HTMLDialogElement) return;

  var box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Información legal");
  box.innerHTML =
    '<div class="lightbox-panel">' +
      '<button class="lightbox-close" type="button" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>' +
      '<div class="lightbox-body" tabindex="-1" autofocus></div>' +
    "</div>";
  document.body.appendChild(box);
  var body = box.querySelector(".lightbox-body");
  var cache = {};
  var opener = null;

  function close() {
    if (!box.open) return;
    box.classList.remove("is-open");
    document.documentElement.classList.remove("has-lightbox");
    setTimeout(function () { box.close(); if (opener) opener.focus(); }, 220);
  }

  function show(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var content = doc.querySelector(".legal-box");
    if (!content) return false;
    content.classList.remove("wrap");
    content.querySelectorAll('a[href^="index.html#"]').forEach(function (a) {
      a.setAttribute("href", a.getAttribute("href").replace("index.html", ""));
      a.setAttribute("data-lightbox-close", "");
    });
    body.innerHTML = "";
    body.appendChild(document.adoptNode(content));
    fillLegal(body);
    setupRegret(body);
    body.scrollTop = 0;
    box.showModal();
    document.documentElement.classList.add("has-lightbox");
    requestAnimationFrame(function () { box.classList.add("is-open"); });
    return true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || box.contains(a)) return;
    var href = a.getAttribute("href");
    if (!pages.test(href)) return;
    e.preventDefault();
    opener = a;
    var go = function (html) { if (!show(html)) location.href = href; };
    if (cache[href]) return go(cache[href]);
    fetch(href)
      .then(function (r) { if (!r.ok) throw r; return r.text(); })
      .then(function (html) { cache[href] = html; go(html); })
      .catch(function () { location.href = href; });
  });

  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.closest(".lightbox-close") || e.target.closest("[data-lightbox-close]")) close();
  });
  box.addEventListener("cancel", function (e) { e.preventDefault(); close(); });

  /* Lightbox de ejemplos: la web en vivo dentro de un iframe */
  var demo = document.createElement("dialog");
  demo.className = "lightbox lightbox-web";
  demo.innerHTML =
    '<div class="lightbox-panel">' +
      '<div class="web-bar">' +
        '<span class="web-title"><span class="tag" data-web-tag></span><strong data-web-name></strong></span>' +
        '<span class="web-views" role="group" aria-label="Vista">' +
          '<button type="button" data-web-view="desktop" aria-pressed="true"><i class="bi bi-laptop"></i><span>Computadora</span></button>' +
          '<button type="button" data-web-view="mobile" aria-pressed="false"><i class="bi bi-phone"></i><span>Celular</span></button>' +
        "</span>" +
        '<a class="web-open" data-web-open target="_blank" rel="noopener" aria-label="Abrir en otra pestaña"><i class="bi bi-box-arrow-up-right"></i><span>Abrir</span></a>' +
        '<button class="lightbox-close" type="button" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>' +
      "</div>" +
      '<div class="web-stage" data-view="desktop" tabindex="-1" autofocus><span class="web-loading"><span><i class="bi bi-arrow-repeat"></i> Cargando…</span></span><iframe title="Ejemplo de landing"></iframe></div>' +
    "</div>";
  document.body.appendChild(demo);
  var frame = demo.querySelector("iframe");
  var stage = demo.querySelector(".web-stage");
  var demoOpener = null;

  function setView(view) {
    stage.setAttribute("data-view", view);
    demo.querySelectorAll("[data-web-view]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-web-view") === view));
    });
  }

  function closeDemo() {
    if (!demo.open) return;
    demo.classList.remove("is-open");
    document.documentElement.classList.remove("has-lightbox");
    setTimeout(function () {
      demo.close();
      frame.removeAttribute("src");
      stage.classList.remove("is-loaded");
      if (demoOpener) demoOpener.focus();
    }, 220);
  }

  frame.addEventListener("load", function () { if (frame.getAttribute("src")) stage.classList.add("is-loaded"); });

  document.querySelectorAll(".examples .example").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      demoOpener = a;
      var tag = a.querySelector(".tag"), name = a.querySelector("strong");
      demo.querySelector("[data-web-tag]").textContent = tag ? tag.textContent : "";
      demo.querySelector("[data-web-name]").textContent = name ? name.textContent : "";
      demo.setAttribute("aria-label", "Ejemplo: " + (name ? name.textContent : "landing"));
      demo.querySelector("[data-web-open]").href = a.href;
      setView(window.matchMedia("(max-width: 700px)").matches ? "mobile" : "desktop");
      stage.classList.remove("is-loaded");
      frame.src = a.href;
      demo.showModal();
      document.documentElement.classList.add("has-lightbox");
      requestAnimationFrame(function () { demo.classList.add("is-open"); });
    });
  });

  demo.addEventListener("click", function (e) {
    var v = e.target.closest("[data-web-view]");
    if (v) return setView(v.getAttribute("data-web-view"));
    if (e.target === demo || e.target.closest(".lightbox-close")) closeDemo();
  });
  demo.addEventListener("cancel", function (e) { e.preventDefault(); closeDemo(); });
})();
