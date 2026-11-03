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

  /* Datos fiscales: solo se muestran los que están completos */
  document.querySelectorAll("[data-legal]").forEach(function (el) {
    var value = legal[el.getAttribute("data-legal")];
    if (value) el.textContent = value;
    else if (el.hasAttribute("data-legal-optional")) el.hidden = true;
  });
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

  /* Botón de arrepentimiento: arma el pedido y lo envía por mail o WhatsApp */
  var form = document.querySelector("[data-regret-form]");
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
    document.querySelector("[data-regret-ok]").classList.add("is-on");
  }
  var plans = form.querySelector("select[name=plan]");
  (site.planes || []).forEach(function (p) {
    var o = document.createElement("option");
    o.textContent = "Plan " + p.nombre;
    plans.appendChild(o);
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); send("mail"); });
  form.querySelector("[data-regret-wa]").addEventListener("click", function () { send("wa"); });
})();
