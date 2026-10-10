(function () {
  "use strict";
  var S = window.SITE;
  var app = document.getElementById("app");
  var page = document.body.getAttribute("data-page");
  if (!S || !S.person) {
    app.innerHTML = '<p>content.js did not load. Keep it in the same folder as the HTML files.</p>';
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

  /* ---------- sidebar (all pages) ---------- */
  function sidebar() {
    var el = document.getElementById("sidebar");
    if (!el) return;
    var links = (P.links || []).map(function (l) {
      var u = safeUrl(l.url);
      return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + "</a>" : "";
    }).join("");
    var mail = P.email ? '<span class="sb-email">' + esc(P.email) + "</span>" : "";
    el.innerHTML = '<div class="avatar-wrap" id="avatar"></div>' +
      '<p class="sb-name">' + esc(P.name) + "</p>" +
      '<p class="sb-title">' + esc(P.title) + "</p>" +
      '<p class="sb-place">' + esc([P.institution, P.location].filter(Boolean).join(", ")) + "</p>" +
      (links || mail ? '<div class="sb-links"><p class="sb-label">Links</p>' + links + mail + "</div>" : "");
    var holder = document.getElementById("avatar");
    function mono() { holder.innerHTML = '<div class="monogram" aria-hidden="true">' + esc(P.initials || "") + "</div>"; }
    if (P.photo) {
      var img = new Image();
      img.className = "avatar";
      img.alt = "Portrait of " + P.name;
      img.onload = function () { holder.innerHTML = ""; holder.appendChild(img); };
      img.onerror = mono;
      img.src = P.photo;
    } else { mono(); }
  }
  sidebar();

  /* ---------- home ---------- */
  function home() {
    var bio = (P.bio || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
    var notes = (P.outside || []).map(function (o) {
      return '<div><p class="about-label">' + esc(o.label) + "</p><p>" + esc(o.text) + "</p></div>";
    }).join("");
    app.innerHTML = '<div class="page-head"><h1 class="title">About</h1></div>' +
      '<div class="bio">' + bio + "</div>" +
      ((P.interests || []).length ? '<ul class="interests" aria-label="Research interests">' + P.interests.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "") +
      (notes ? '<div class="sidenotes">' + notes + "</div>" : "");
  }

  /* ---------- PDF preview (shared by CV and calendar) ---------- */
  function pdfViewer(box, file, hooks) {
    hooks = hooks || {};
    if (!window.pdfjsLib) { if (hooks.onFail) hooks.onFail(); return; }
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
              c.setAttribute("aria-label", "Page " + num + " of " + doc.numPages);
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
      doc = d;
      if (hooks.onReady) hooks.onReady();
      draw();
      var t, lastW = box.parentNode.clientWidth;
      window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          var w = box.parentNode.clientWidth;
          if (Math.abs(w - lastW) > 8) { lastW = w; draw(); }
        }, 250);
      });
    }, function () { if (hooks.onFail) hooks.onFail(); });
  }

  /* ---------- CV ---------- */
  function cv() {
    var file = (S.cv && S.cv.file) || "cv.pdf";
    app.innerHTML = '<div class="page-head"><h1 class="title">Curriculum vitae</h1><p class="lede">Preview of the current CV. Use the buttons to open or save the PDF.</p></div>' +
      '<div class="cv-actions"><a class="btn primary" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">Open PDF</a><a class="btn" href="' + esc(file) + '" download>Download</a></div>' +
      '<div class="pdfbox"><div id="pdfpages" class="pdfpages"><p class="pdfmsg">Loading the CV…</p></div></div>';
    var box = document.getElementById("pdfpages");
    pdfViewer(box, file, { onFail: function () {
      box.innerHTML = '<p class="pdfmsg">The CV file (' + esc(file) + ') has not been added yet. Use Open PDF to try the file directly.</p>';
    } });
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
    app.innerHTML = '<div class="page-head"><h1 class="title">Publications</h1><p class="lede">Working papers, theses, and published work, newest first.</p></div><div id="pubs-root"></div>';
    renderPubs();
  }
  function renderPubs() { document.getElementById("pubs-root").innerHTML = pubsInner(); }

  /* ---------- retrospective calendar ---------- */
  var calOff = {};
  var calSel = null;      // selected year number (1 = first year); null = newest
  var calDir = "";        // direction of the last move, used for the slide-in
  function allEvents() {
    var ev = (S.calendar || []).map(function (e) { return { date: e.date, type: TYPES[e.type] ? e.type : "other", title: e.title, note: e.note || "", planned: e.planned === true }; });
    (S.publications || []).forEach(function (p) {
      if (p.calendar !== false && p.date) ev.push({ date: p.date, type: "paper", title: p.title, note: p.venue + (p.status ? " · " + p.status : ""), planned: false });
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
  function yearRange(start, n) {
    var ys = start + (n - 1) * 12, ye = ys + 11;
    return { ys: ys, ye: ye, label: MONTHS[ys % 12] + " " + Math.floor(ys / 12) + " – " + MONTHS[ye % 12] + " " + Math.floor(ye / 12) };
  }
  // Year numbers shown, newest first. A year shows once it has started or holds an entry.
  function visibleYears(start, years, events) {
    var out = [];
    for (var n = years; n >= 1; n--) {
      var r = yearRange(start, n);
      var has = events.some(function (e) { var i = idx(e.date); return i >= r.ys && i <= r.ye; });
      if (r.ys <= nowIdx || has) out.push(n);
    }
    return out;
  }
  function calInner() {
    var ph = S.phd || {};
    if (!ph.start) return '<p class="empty">Set phd.start in content.js to build the calendar.</p>';
    var start = idx(ph.start), years = ph.years || 5;
    var events = allEvents();
    var list = visibleYears(start, years, events);       // newest first
    if (!list.length) return progressCard(start, years) + '<p class="empty">No years to show yet.</p>';
    if (calSel === null || list.indexOf(calSel) === -1) calSel = list[0];
    var pos = list.indexOf(calSel);
    var newer = pos > 0 ? list[pos - 1] : null;
    var older = pos < list.length - 1 ? list[pos + 1] : null;

    var present = {};
    events.forEach(function (e) { present[e.type] = true; });
    var chips = Object.keys(TYPES).filter(function (t) { return present[t]; }).map(function (t) {
      return '<button class="btn" type="button" data-cf="' + t + '" aria-pressed="' + (!calOff[t]) + '"><span class="chip" data-type="' + t + '" style="padding:0"><i></i>' + TYPES[t] + "</span></button>";
    }).join("");

    var r = yearRange(start, calSel);
    var inYear = events.filter(function (e) { return !calOff[e.type]; })
      .filter(function (e) { var i = idx(e.date); return i >= r.ys && i <= r.ye; })
      .sort(function (a, b) { return idx(b.date) - idx(a.date); });
    var perMonth = {}, max = 0;
    inYear.forEach(function (e) { var i = idx(e.date); perMonth[i] = (perMonth[i] || 0) + 1; max = Math.max(max, perMonth[i]); });
    var strip = "";
    for (var k = 11; k >= 0; k--) {
      var mi = r.ys + k, c = perMonth[mi] || 0, mo = mi % 12;
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
      groups += '<li class="ev"><span class="chip" data-type="' + e.type + '"><i></i>' + TYPES[e.type] + '</span><div><p class="ev-title">' + esc(e.title) + (e.planned ? '<span class="planned">Planned</span>' : "") + "</p>" + (e.note ? '<p class="ev-note">' + esc(e.note) + "</p>" : "") + "</div></li>";
    });
    if (last !== null) groups += "</ul></div>";
    if (!inYear.length) groups = '<p class="empty">No entries for this year yet.</p>';

    var nav = '<div class="yearnav">' +
      '<button class="btn" type="button" data-ynav="' + (newer || "") + '" aria-label="' + (newer ? "Newer year: Year " + newer : "No newer year") + '"' + (newer ? "" : " disabled") + '>← ' + (newer ? "Year " + newer : "Newer") + "</button>" +
      '<div class="ycur" aria-live="polite"><span class="yname">Year ' + calSel + '</span><span class="yrange">' + esc(r.label) + '</span><span class="ycount">' + inYear.length + (inYear.length === 1 ? " entry" : " entries") + "</span></div>" +
      '<button class="btn" type="button" data-ynav="' + (older || "") + '" aria-label="' + (older ? "Older year: Year " + older : "No older year") + '"' + (older ? "" : " disabled") + '>' + (older ? "Year " + older : "Older") + " →</button></div>";
    var tabs = list.length > 1 ? '<div class="ytabs" role="group" aria-label="Jump to a year">' + list.map(function (n) {
      return '<button class="btn" type="button" data-ynav="' + n + '" aria-pressed="' + (n === calSel) + '">Y' + n + "</button>";
    }).join("") + "</div>" : "";

    return progressCard(start, years) +
      (chips ? '<div class="filters calfilters" role="group" aria-label="Filter calendar by type">' + chips + "</div>" : "") +
      nav + tabs +
      '<section class="ypanel ' + (calDir ? "from-" + calDir : "") + '" aria-label="Year ' + calSel + '"><div class="ybody"><div class="strip" aria-label="Entries per month, newest month first">' + strip + "</div>" + groups + "</div></section>" +
      (list.length > 1 ? '<p class="keyhint">Use the ← and → keys to move between years.</p>' : "");
  }
  function calendar() {
    app.innerHTML = '<div class="page-head"><h1 class="title">Calendar</h1><p class="lede">The program read backwards, from the current year to Year 1. Move between years with the arrows. Bars show how many entries each month holds, newest month first.</p></div><div id="cal-root"></div>' +
      '<section class="pdfsec" id="calpdf" hidden><h2>Calendar as a PDF</h2><div class="cv-actions"><a class="btn primary" id="calpdf-open" target="_blank" rel="noopener noreferrer">Open PDF</a><a class="btn" id="calpdf-dl" download>Download</a></div><div class="pdfbox"><div id="calpdf-pages" class="pdfpages"><p class="pdfmsg">Loading…</p></div></div></section>';
    renderCal();
    var file = (S.calendarPdf && S.calendarPdf.file) || "";
    if (!file) return;
    var sec = document.getElementById("calpdf");
    document.getElementById("calpdf-open").setAttribute("href", file);
    document.getElementById("calpdf-dl").setAttribute("href", file);
    pdfViewer(document.getElementById("calpdf-pages"), file, { onReady: function () { sec.hidden = false; } });
  }
  function renderCal() { document.getElementById("cal-root").innerHTML = calInner(); }
  function calGo(n, focusKey) {
    var ph = S.phd || {};
    var start = idx(ph.start), years = ph.years || 5;
    var list = visibleYears(start, years, allEvents());
    if (list.indexOf(n) === -1) return;
    calDir = n < calSel ? "older" : "newer";
    calSel = n; renderCal();
    var el = document.querySelector(focusKey); if (el && !el.disabled) el.focus();
  }

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
    return t ? t === "dark" : true;
  }
  try {
    var saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  document.addEventListener("keydown", function (ev) {
    if (page !== "calendar") return;
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    var tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    var btn = document.querySelector('.yearnav > button[data-ynav]' + (ev.key === "ArrowLeft" ? ":first-child" : ":last-child"));
    if (btn && !btn.disabled && btn.getAttribute("data-ynav")) { ev.preventDefault(); btn.click(); }
  });

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
    } else if (t.hasAttribute("data-ynav")) {
      var yn = Number(t.getAttribute("data-ynav"));
      if (yn) {
        var wasTab = t.closest(".ytabs");
        var before = calSel;
        var dirNewer = yn > before;
        calGo(yn, wasTab ? '.ytabs [data-ynav="' + yn + '"]' : (dirNewer ? '.yearnav [data-ynav]:first-child' : '.yearnav > button:last-child'));
      }
    } else if (t.hasAttribute("data-cf")) {
      var k = t.getAttribute("data-cf"); calOff[k] = !calOff[k]; renderCal();
      var b = document.querySelector('[data-cf="' + k + '"]'); if (b) b.focus();
    }
  });
})();
