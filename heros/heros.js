(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tracks = Array.prototype.slice.call(document.querySelectorAll("[data-scroll]"));

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  function progress(el) {
    if (reduce) return 1;
    var r = el.getBoundingClientRect();
    var total = el.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total) : clamp(-r.top / el.offsetHeight);
  }

  function update() {
    tracks.forEach(function (el) {
      var p = progress(el);
      el.style.setProperty("--p", p.toFixed(4));
      el.querySelectorAll("[data-at]").forEach(function (n) {
        n.classList.toggle("is-on", p >= parseFloat(n.getAttribute("data-at")));
      });
      el.querySelectorAll("[data-range]").forEach(function (n) {
        var r = n.getAttribute("data-range").split(",");
        n.classList.toggle("is-active", p >= parseFloat(r[0]) && p < parseFloat(r[1]));
      });
      el.querySelectorAll("[data-counter]").forEach(function (n) {
        var from = parseFloat(n.getAttribute("data-from") || 0);
        var k = clamp((p - from) / (1 - from));
        n.textContent = Math.round(k * parseFloat(n.getAttribute("data-counter"))).toLocaleString("es-AR");
      });
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-pointer]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
    });
  }

  document.querySelectorAll("[data-rotator]").forEach(function (el) {
    var items = el.querySelectorAll("span");
    var i = 0;
    items[0].classList.add("is-on");
    if (reduce || items.length < 2) return;
    setInterval(function () {
      items[i].classList.remove("is-on");
      i = (i + 1) % items.length;
      items[i].classList.add("is-on");
    }, 2200);
  });
})();
