(function () {
  "use strict";
  var S = window.SITE;
  var app = document.getElementById("app");
  var page = document.body.getAttribute("data-page");
  if (!S || !S.person) {
    app.innerHTML = '<div class="wrap page"><p>content.js did not load. Keep it in the same folder as the HTML files.</p></div>';
    return;
  }
  var P = S.person;
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }
  function parseYM(s) { var p = String(s).split("-"); return { y: Number(p[0]), m: p[1] ? Number(p[1]) : 1 }; }
  function idx(s) { var d = parseYM(s); return d.y * 12 + (d.m - 1); }
  function fmt(s) { var d = parseYM(s); return MONTHS[d.m - 1] + " " + d.y; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var now = new Date();
  var nowIdx = now.getFullYear() * 12 + now.getMonth();

  var TYPES = { paper: "Paper", talk: "Talk", milestone: "Milestone", teaching: "Teaching", award: "Award", travel: "Travel", other: "Other" };
  var PUB_TYPES = { journal: "Journal", conference: "Conference", preprint: "Preprint", working: "Working paper", review: "Under review", thesis: "Thesis", other: "Other" };

  var titles = { home: "", cv: "CV · ", publications: "Publications · ", calendar: "Calendar · " };
  document.title = (titles[page] || "") + P.name;
  var brand = document.getElementById("brand");
  if (brand) brand.textContent = P.name;
  var up = document.getElementById("updated");
  if (up) up.textContent = S.updated ? "Last updated " + S.updated : "";

  /* ---------- home ---------- */
  function home() {
    var links = (P.links || []).map(function (l) {
      var u = safeUrl(l.url);
      return u ? '<a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + "</a>" : "";
    }).join("");
    var bio = (P.bio || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
    var notes = (P.outside || []).map(function (o) {
      return '<div><p class="about-label">' + esc(o.label) + "</p><p>" + esc(o.text) + "</p></div>";
    }).join("");
    app.innerHTML = '<div class="wrap page"><div class="hero"><div>' +
      '<p class="eyebrow">' + esc(P.title) + (P.institution ? " · " + esc(P.institution) : "") + "</p>" +
      "<h1>" + esc(P.name) + "</h1>" +
      '<div class="bio">' + bio + "</div>" +
      ((P.interests || []).length ? '<ul class="interests" aria-label="Research interests">' + P.interests.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
      (links ? '<div class="links">' + links + "</div>" : "") +
      (P.email ? '<div class="contact"><span class="addr">' + esc(P.email) + '</span><button class="btn" type="button" data-copy="' + esc(P.email) + '">Copy email</button></div>' : "") +
      '</div><div class="side"><div id="portrait"></div>' + (notes ? '<div class="sidenotes">' + notes + "</div>" : "") + "</div></div></div>";
    var holder = document.getElementById("portrait");
    function mono() { holder.innerHTML = '<div class="monogram" aria-hidden="true">' + esc(P.initials || "") + "</div>"; }
    if (P.photo) {
      var img = new Image();
      img.className = "portrait";
      img.alt = "Portrait of " + P.name;
      img.onload = function () { holder.innerHTML = ""; holder.appendChild(img); };
      img.onerror = mono;
      img.src = P.photo;
    } else { mono(); }
  }

  /* ---------- CV (PDF preview) ---------- */
  function cv() {
    var file = (S.cv && S.cv.file) || "cv.pdf";
    app.innerHTML = '<div class="wrap page"><div class="page-head"><h2>Curriculum vitae</h2><p class="lede">Preview of the current CV. Use the buttons to open or save the PDF.</p></div>' +
      '<div class="cv-actions"><a class="btn primary" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">Open PDF</a><a class="btn" href="' + esc(file) + '" download>Download</a></div>' +
      '<div class="pdfbox"><div id="pdfpages" class="pdfpages"><p class="pdfmsg">Loading the CV…</p></div></div></div>';
    var box = document.getElementById("pdfpages");
    function fail(msg) { box.innerHTML = '<p class="pdfmsg">' + msg + "</p>"; }
    if (!window.pdfjsLib) { fail("The PDF viewer did not load. Use Open PDF instead."); return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
    var doc = null, token = 0;
    function draw() {
      if (!doc) return;
      var my = ++token;
      var width = Math.max(240, box.parentNode.clientWidth - 24);
      var ratio = window.devicePixelRatio || 1;
      var frag = document.createDocumentFragment();
      var chain = Promise.resolve();
      for (var n = 1; n <= doc.numPages; n++) {
        (function (num) {
          chain = chain.then(function () {
            if (my !== token) return;
            return doc.getPage(num).then(function (pg) {
              var v1 = pg.getViewport({ scale: 1 });
              var scale = Math.min(width, 900) / v1.width;
              var vp = pg.getViewport({ scale: scale * ratio });
              var c = document.createElement("canvas");
              c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
              c.style.width = Math.floor(vp.width / ratio) + "px";
              c.setAttribute("role", "img");
              c.setAttribute("aria-label", "CV page " + num + " of " + doc.numPages);
              return pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () { frag.appendChild(c); });
            });
          });
        })(n);
      }
      chain.then(function () {
        if (my !== token) return;
        box.innerHTML = ""; box.appendChild(frag);
      });
    }
    pdfjsLib.getDocument(file).promise.then(function (d) {
      doc = d; draw();
      var t, lastW = box.parentNode.clientWidth;
      window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          var w = box.parentNode.clientWidth;
          if (Math.abs(w - lastW) > 8) { lastW = w; draw(); }
        }, 250);
      });
    }, function () {
      fail("The CV file (" + esc(file) + ") has not been added yet.");
    });
  }

  /* ---------- publications ---------- */
  var pubFilter = "all";
  var cites = {};
  function isMe(a) { return (P.authorAliases || [P.name]).indexOf(a) !== -1; }
  function pubsInner() {
    var pubs = (S.publications || []).slice().sort(function (a, b) { return idx(b.date) - idx(a.date); });
    if (!pubs.length) return '<p class="empty">No publications are listed yet.</p>';
    var counts = {};
    pubs.forEach(function (p) { counts[p.type] = (counts[p.type] || 0) + 1; });
    var first = pubs.filter(function (p) { return p.authors && isMe(p.authors[0]); }).length;
    var chips = '<button class="btn" type="button" data-pf="all" aria-pressed="' + (pubFilter === "all") + '">All ' + pubs.length + "</button>";
    Object.keys(PUB_TYPES).forEach(function (t) {
      if (counts[t]) chips += '<button class="btn" type="button" data-pf="' + t + '" aria-pressed="' + (pubFilter === t) + '">' + PUB_TYPES[t] + " " + counts[t] + "</button>";
    });
    var stats = '<div class="pubstats"><span><b>' + pubs.length + "</b> total</span><span><b>" + first + "</b> first-author</span></div>";
    var shown = pubs.filter(function (p) { return pubFilter === "all" || p.type === pubFilter; });
    var byYear = {};
    shown.forEach(function (p) { var y = parseYM(p.date).y; (byYear[y] = byYear[y] || []).push(p); });
    var list = Object.keys(byYear).sort(function (a, b) { return b - a; }).map(function (y) {
      return '<div class="pubyear"><h3>' + y + "</h3>" + byYear[y].map(function (p) {
        var key = "p" + pubs.indexOf(p);
        var authors = (p.authors || []).map(function (a) { return isMe(a) ? "<b>" + esc(a) + "</b>" : esc(a); }).join(", ");
        cites[key] = (p.authors || []).join(", ") + ". " + p.title + ". " + p.venue + ", " + parseYM(p.date).y + ".";
        var links = [["PDF", p.pdf], ["DOI", p.doi ? "https://doi.org/" + p.doi : ""], ["Code", p.code], ["Link", p.url]].map(function (l) {
          var u = safeUrl(l[1]);
          return u ? '<a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + l[0] + "</a>" : "";
        }).join("");
        return '<article class="pub"><h4>' + esc(p.title) + '</h4><p class="authors">' + authors + '</p><p class="venue"><em>' + esc(p.venue) + "</em>" +
          (p.status ? " · " + esc(p.status) : "") + '<span class="tag">' + esc(PUB_TYPES[p.type] || "Other") + "</span></p>" +
          '<div class="pub-actions">' + links + '<button class="btn" type="button" data-cite="' + key + '">Copy citation</button></div>' +
          (p.abstract ? "<details><summary>Abstract</summary><p>" + esc(p.abstract) + "</p></details>" : "") + "</article>";
      }).join("") + "</div>";
    }).join("");
    return '<div class="filters" role="group" aria-label="Filter publications by type">' + chips + "</div>" + stats + list;
  }
  function publications() {
    app.innerHTML = '<div class="wrap page"><div class="page-head"><h2>Publications</h2><p class="lede">Working papers, theses, and published work, newest first.</p></div><div id="pubs-root"></div></div>';
    renderPubs();
  }
  function renderPubs() { document.getElementById("pubs-root").innerHTML = pubsInner(); }

  /* ---------- retrospective calendar ---------- */
  var calOff = {};
  function allEvents() {
    var ev = (S.calendar || []).map(function (e) { return { date: e.date, type: TYPES[e.type] ? e.type : "other", title: e.title, note: e.note || "" }; });
    (S.publications || []).forEach(function (p) {
      if (p.calendar !== false && p.date) ev.push({ date: p.date, type: "paper", title: p.title, note: p.venue + (p.status ? " · " + p.status : "") });
    });
    return ev;
  }
  function progressCard(start, years) {
    var total = years * 12;
    var elapsed = clamp(nowIdx - start + 1, 0, total);
    var curYear = clamp(Math.floor((nowIdx - start) / 12) + 1, 1, years);
    var monthIn = (clamp(nowIdx - start, 0, total - 1) % 12) + 1;
    var segs = "";
    for (var i = 0; i < years; i++) {
      var f = clamp((elapsed - i * 12) / 12, 0, 1);
      segs += '<div class="seg' + (i + 1 === curYear && elapsed > 0 ? " cur" : "") + '"><span class="track"><span class="fill" style="--w:' + (f * 100).toFixed(0) + '%"></span></span><span class="sl">Y' + (i + 1) + "</span></div>";
    }
    var line = nowIdx < start ? "Starts " + fmt(S.phd.start) : "Year " + curYear + " of " + years + ", month " + monthIn;
    return '<aside class="card progress" aria-label="Program progress"><h3>Program progress</h3><div class="pbar" style="--n:' + years + '">' + segs + '</div><p class="pnow">' + esc(line) + "</p></aside>";
  }
  function calInner() {
    var ph = S.phd || {};
    if (!ph.start) return '<p class="empty">Set phd.start in content.js to build the calendar.</p>';
    var start = idx(ph.start), years = ph.years || 5;
    var events = allEvents();
    var present = {};
    events.forEach(function (e) { present[e.type] = true; });
    var chips = Object.keys(TYPES).filter(function (t) { return present[t]; }).map(function (t) {
      return '<button class="btn" type="button" data-cf="' + t + '" aria-pressed="' + (!calOff[t]) + '"><span class="chip" data-type="' + t + '" style="padding:0"><i></i>' + TYPES[t] + "</span></button>";
    }).join("");
    var visible = events.filter(function (e) { return !calOff[e.type]; });
    var out = "";
    for (var n = years; n >= 1; n--) {
      var ys = start + (n - 1) * 12, ye = ys + 11;
      if (ys > nowIdx) continue;
      var inYear = visible.filter(function (e) { var i = idx(e.date); return i >= ys && i <= ye; }).sort(function (a, b) { return idx(b.date) - idx(a.date); });
      var perMonth = {}, max = 0;
      inYear.forEach(function (e) { var i = idx(e.date); perMonth[i] = (perMonth[i] || 0) + 1; max = Math.max(max, perMonth[i]); });
      var strip = "";
      for (var k = 11; k >= 0; k--) {
        var mi = ys + k, c = perMonth[mi] || 0, mo = mi % 12;
        strip += '<div class="mcell' + (c ? " has" : "") + (mi === nowIdx ? " now" : "") + '" title="' + MONTHS[mo] + " " + Math.floor(mi / 12) + ": " + c + (c === 1 ? " entry" : " entries") + '"><span class="bar" style="--h:' + (c ? Math.max(14, (c / max) * 100).toFixed(0) : 0) + '%"></span><span class="ml">' + MONTHS[mo] + "</span></div>";
      }
      var groups = "", last = null;
      inYear.forEach(function (e) {
        var i = idx(e.date);
        if (i !== last) {
          if (last !== null) groups += "</ul></div>";
          groups += '<div class="mgroup"><div class="mlabel">' + esc(MONTHS[i % 12] + " " + Math.floor(i / 12)) + '</div><ul class="evs">';
          last = i;
        }
        groups += '<li class="ev"><span class="chip" data-type="' + e.type + '"><i></i>' + TYPES[e.type] + '</span><div><p class="ev-title">' + esc(e.title) + (i > nowIdx ? '<span class="planned">Planned</span>' : "") + "</p>" + (e.note ? '<p class="ev-note">' + esc(e.note) + "</p>" : "") + "</div></li>";
      });
      if (last !== null) groups += "</ul></div>";
      if (!inYear.length) groups = '<p class="empty">No entries for this year yet.</p>';
      out += '<details class="year" open><summary><span class="yname">Year ' + n + '</span><span class="yrange">' + esc(MONTHS[ys % 12] + " " + Math.floor(ys / 12)) + " – " + esc(MONTHS[ye % 12] + " " + Math.floor(ye / 12)) + '</span><span class="ycount">' + inYear.length + (inYear.length === 1 ? " entry" : " entries") + '</span></summary><div class="ybody"><div class="strip" aria-label="Entries per month, newest month first">' + strip + "</div>" + groups + "</div></details>";
    }
    return progressCard(start, years) + (chips ? '<div class="filters calfilters" role="group" aria-label="Filter calendar by type">' + chips + "</div>" : "") + '<div class="years">' + out + "</div>";
  }
  function calendar() {
    app.innerHTML = '<div class="wrap page"><div class="page-head"><h2>Calendar</h2><p class="lede">The program read backwards, from the current year to Year 1. Bars show how many entries each month holds, newest month first.</p></div><div id="cal-root"></div></div>';
    renderCal();
  }
  function renderCal() { document.getElementById("cal-root").innerHTML = calInner(); }

  ({ home: home, cv: cv, publications: publications, calendar: calendar }[page] || home)();

  /* ---------- interactions ---------- */
  function copyText(text, btn) {
    var label = btn.textContent;
    function done(ok) {
      var box = btn.parentNode.querySelector(".citebox");
      if (ok) {
        if (box) box.remove();
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = label; }, 1400);
      } else if (!box) {
        var inp = document.createElement("input");
        inp.className = "citebox"; inp.readOnly = true; inp.value = text;
        btn.parentNode.appendChild(inp); inp.focus(); inp.select();
      }
    }
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        done(ok);
      } catch (e) { done(false); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else { fallback(); }
  }
  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  try {
    var saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-theme-toggle")) {
      var next = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("portfolio-theme", next); } catch (e) {}
    } else if (t.hasAttribute("data-copy")) {
      copyText(t.getAttribute("data-copy"), t);
    } else if (t.hasAttribute("data-cite")) {
      copyText(cites[t.getAttribute("data-cite")] || "", t);
    } else if (t.hasAttribute("data-pf")) {
      pubFilter = t.getAttribute("data-pf"); renderPubs();
      var a = document.querySelector('[data-pf="' + pubFilter + '"]'); if (a) a.focus();
    } else if (t.hasAttribute("data-cf")) {
      var k = t.getAttribute("data-cf"); calOff[k] = !calOff[k]; renderCal();
      var b = document.querySelector('[data-cf="' + k + '"]'); if (b) b.focus();
    }
  });
})();
