(function () {
  "use strict";
  const DATA = window.MCQ_DATA;
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const yearNav = document.getElementById("yearNav");
  const gapList = document.getElementById("gapList");
  const LETTERS = ["A", "B", "C", "D"];
  const YEAR_STORE = "cssMcq.selectedYear";
  const PR = window.PRACTICE_DATA || { banks: [] };   // practice banks (js/practice-data.js)
  const PBANK = {};
  PR.banks.forEach(b => { PBANK[b.id] = b; b.packById = {}; b.packs.forEach(p => (b.packById[p.id] = p)); });
  let pview = null;                // id of the practice bank being shown (null = yearly papers)

  if (!DATA || !DATA.byYear) { app.innerHTML = "<p>Could not load js/quiz-data.js.</p>"; return; }
  const YEARS = DATA.years.map(String);
  let mode = "objective";          // "objective" (MCQ quiz) | "subjective" (Part-II past papers)
  let year = null;                 // selected exam year (string)
  let YD = null;                   // DATA.byYear[year]

  /* ---------- storage (namespaced per year, e.g. cssMcq2025.scores.v1; 2026 keeps the original key) ---------- */
  const storeKey = y => "cssMcq" + y + ".scores.v1";
  function loadScores(y) { try { return JSON.parse(localStorage.getItem(storeKey(y || year))) || {}; } catch (e) { return {}; } }
  // Practice-bank scores live under their own key (cssMcqPractice.<bank>.scores.v1) so yearly scores are never touched.
  const practiceKey = b => "cssMcqPractice." + b + ".scores.v1";
  function loadPracticeScores(b) { try { return JSON.parse(localStorage.getItem(practiceKey(b))) || {}; } catch (e) { return {}; } }
  function saveScore(id, score, total) {
    const k = state && state.practice ? practiceKey(state.practice.bank) : storeKey(year);
    let all = {}; try { all = JSON.parse(localStorage.getItem(k)) || {}; } catch (e) {}
    const prev = all[id] || { best: 0, attempts: 0 };
    all[id] = { best: Math.max(prev.best, score), total, attempts: prev.attempts + 1, last: score, lastAt: new Date().toISOString() };
    try { localStorage.setItem(k, JSON.stringify(all)); } catch (e) {}
    return { isNewBest: score > prev.best || prev.attempts === 0, prevBest: prev.best };
  }
  function yearStats(y) {
    const subs = DATA.byYear[y].subjects, sc = loadScores(y);
    const done = subs.filter(s => sc[s.id]);
    const avg = done.length ? Math.round(done.reduce((a, s) => a + sc[s.id].best / s.questionCount, 0) / done.length * 100) : null;
    return { subs, sc, done, avg };
  }

  /* ---------- year selection ---------- */
  function setHash(h) { try { history.replaceState(null, "", "#" + h); } catch (e) { /* file:// in some browsers */ } }
  function selectYear(y, opts) {
    y = String(y);
    if (!DATA.byYear[y]) y = String(DATA.defaultYear);
    year = y; YD = DATA.byYear[y];
    try { localStorage.setItem(YEAR_STORE, y); } catch (e) {}
    if (mode === "objective") document.getElementById("brandTitle").textContent = "CSS " + y;
    renderSidebar();
    if (!opts || !opts.silent) { app.className = "container"; renderHome(); }
  }
  function confirmLeave() {
    if (!state || !document.querySelector(".qcard")) return true;
    const n = state.answers.filter(Boolean).length;
    return n === 0 || n === state.answers.length || confirm("Leave this subject? Progress in this attempt will be lost.");
  }
  function renderSidebar() {
    yearNav.innerHTML = YEARS.map(y => {
      const { subs, done, avg } = yearStats(y);
      const on = y === year && !pview;
      return `<button class="year ${on ? "active" : ""}" data-y="${y}" aria-pressed="${on}" aria-label="CSS ${y}: ${done.length} of ${subs.length} subjects attempted">
        <span class="node" aria-hidden="true"></span>
        <span class="y-main"><strong>${y}</strong><small>${subs.length} subjects · ${done.length}/${subs.length} tried${avg === null ? "" : " · " + avg + "%"}</small></span>
      </button>`;
    }).join("");
    yearNav.querySelectorAll(".year").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.y === year && !state && !pview) return;
      if (!confirmLeave()) return;
      selectYear(b.dataset.y);
    }));
    renderPracticeRail();
    gapList.innerHTML = (DATA.gaps || []).map(g => `<div class="gap" title="${esc(g.note)}"><span class="node" aria-hidden="true"></span><span><strong>${esc(g.range)}</strong><small>${esc(g.note)}</small></span></div>`).join("");
  }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let toastTimer;
  function toast(msg, kind) {
    toastEl.textContent = msg; toastEl.className = "toast show " + kind;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (toastEl.className = "toast " + kind), 1300);
  }

  /* ---------- home ---------- */
  function renderHome() {
    state = null; pview = null;
    setMode("objective");
    document.title = "CSS " + year + " · MCQ Practice";
    setHash(year);
    renderSidebar();
    const { sc: scores, done, avg } = yearStats(year);
    app.innerHTML = `
      <section class="hero">
        <div class="year-chips" role="group" aria-label="Available years">
          <span class="chips-label">Years available:</span>
          ${YEARS.map(y => `<button class="chip ${y === year ? "active" : ""}" data-y="${y}" aria-pressed="${y === year}">${y}</button>`).join("")}
        </div>
        <h1>CSS ${year} — practice one subject at a time.</h1>
        <p>Pick a subject, answer its 20 Part-I MCQs, and get instant feedback — <b style="color:var(--green)">green</b> when you're right,
        <b style="color:var(--red)">red</b> when you're not. Your best score for each subject is saved in this browser.</p>
        <div class="overall">
          <span class="pill">CSS ${year} subjects attempted: <b>${done.length}/${YD.subjects.length}</b></span>
          <span class="pill">Average best: <b>${avg === null ? "—" : avg + "%"}</b></span>
        </div>
      </section>
      <section class="grid">
        ${YD.subjects.map(s => {
          const sc = scores[s.id];
          const pct = sc ? Math.round(sc.best / s.questionCount * 100) : 0;
          return `<button class="subject" data-id="${s.id}" aria-label="Start ${esc(s.title)} ${year}">
            <span class="year-badge">${year}</span>
            <div class="icon" aria-hidden="true">${s.icon}</div>
            <h3>${esc(s.title)}</h3>
            <p class="sub">${esc(s.subtitle)}</p>
            <div class="mini-bar"><span style="width:${pct}%"></span></div>
            <div class="meta">
              <span>${s.questionCount} MCQs${sc ? ` · ${sc.attempts} attempt${sc.attempts > 1 ? "s" : ""}` : ""}</span>
              <span class="best ${sc ? "" : "none"}">${sc ? `Best: ${sc.best}/${s.questionCount}` : "Not tried"}</span>
            </div>
          </button>`;
        }).join("")}
      </section>
      ${PR.banks.map(b => `<a class="bank-banner" href="#practice/${b.id}">
        <span class="bank-ic" aria-hidden="true">${b.icon}</span>
        <span class="bank-txt"><strong>Want more ${esc(b.shortName)}? Open the ${esc(b.name)} practice bank</strong>
        <small>${b.total} MCQs · CSS ${b.years[b.years.length - 1]}–${b.years[0]} papers, ${b.topics.length} topics and ${b.sets.length} mixed sets of ~20</small></span>
        <span class="bank-go" aria-hidden="true">→</span></a>`).join("")}
      <p class="help">Only 2024, 2025 and 2026 are here: Part-I MCQs for 2016–2023 aren't published on the free source we used
        (those PDFs carry Part-II only), and 2006–2015 aren't on it at all. ${esc(DATA.keyNote || "Answer keys are practice keys, not official FPSC keys.")}</p>`;
    app.querySelectorAll(".subject").forEach(b => b.addEventListener("click", () => startQuiz(b.dataset.id)));
    app.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => { if (b.dataset.y !== year) selectYear(b.dataset.y); }));
    window.scrollTo({ top: 0 });
  }

  /* ---------- quiz ---------- */
  let state = null;
  function startQuiz(id) {
    const subj = YD.byId[id];
    if (!subj) { renderHome(); return; }
    setMode("objective"); pview = null;
    state = { subj, year, tag: year, practice: null, i: 0, answers: new Array(subj.questions.length).fill(null) };
    document.title = subj.title + " · CSS " + year + " MCQs";
    setHash(year + "/" + id);
    renderQuestion();
  }

  function renderQuestion() {
    const { subj, i, answers } = state;
    const q = subj.questions[i];
    const total = subj.questions.length;
    const answered = answers[i];
    const correctCount = answers.filter((a, k) => a && a === subj.questions[k].answer).length;
    const wrongCount = answers.filter((a, k) => a && a !== subj.questions[k].answer).length;
    const doneCount = answers.filter(Boolean).length;

    const dir = subj.rtl ? ` dir="rtl" lang="pnb"` : "";
    app.className = "container" + (subj.rtl ? " rtl" : "");
    app.innerHTML = `
      <div class="quiz-head">
        <div><h2>${esc(subj.title)} <span class="year-tag">${esc(state.tag)}</span></h2><div class="sub"><bdi>${esc(subj.subtitle)}</bdi></div></div>
        <div class="counter">Question ${i + 1} / ${total}</div>
      </div>
      <div class="progress" aria-label="Progress"><span style="width:${doneCount / total * 100}%"></span></div>
      <div class="dots">${subj.questions.map((qq, k) => {
        const a = answers[k];
        const cls = a ? (a === qq.answer ? "ok" : "bad") : "";
        return `<button class="dot ${cls} ${k === i ? "current" : ""}" data-k="${k}" aria-label="Go to question ${k + 1}">${k + 1}</button>`;
      }).join("")}</div>
      <article class="qcard"${dir}>
        ${q.section ? `<span class="section-tag">${esc(q.section)}</span>` : ""}
        <p class="qtext"><bdi>${q.id}.</bdi> ${esc(q.text)}</p>
        <div class="options">
          ${LETTERS.map(L => `<button class="opt" data-l="${L}"><span class="key">${L}</span><span class="txt">${esc(q.options[L])}</span><span class="mark"></span></button>`).join("")}
        </div>
        <div class="feedback" id="fb"></div>
      </article>
      <div class="actions">
        <button class="btn secondary" id="quitBtn">${state.practice ? "← Practice bank" : "← Subjects"}</button>
        <span class="live-score">Correct <b>${correctCount}</b> · Wrong <i>${wrongCount}</i></span>
        <div style="display:flex;gap:10px">
          ${i > 0 ? `<button class="btn secondary" id="prevBtn">Back</button>` : ""}
          <button class="btn" id="nextBtn" ${answered ? "" : "disabled"}>${i === total - 1 ? "See score" : "Next →"}</button>
        </div>
      </div>
      <p class="note">${esc(subj.answerKeyNote)} Tip: press A–D (or 1–4) to answer, Enter for next.</p>`;

    app.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => choose(b.dataset.l)));
    app.querySelectorAll(".dot").forEach(b => b.addEventListener("click", () => { state.i = +b.dataset.k; renderQuestion(); }));
    document.getElementById("nextBtn").addEventListener("click", next);
    document.getElementById("quitBtn").addEventListener("click", () => {
      if (doneCount > 0 && doneCount < total && !confirm("Leave this subject? Progress in this attempt will be lost.")) return;
      leaveQuiz();
    });
    const prev = document.getElementById("prevBtn");
    if (prev) prev.addEventListener("click", () => { state.i--; renderQuestion(); });
    if (answered) paint(answered, false);
  }

  function paint(chosen, announce) {
    const q = state.subj.questions[state.i];
    const ok = chosen === q.answer;
    app.querySelectorAll(".opt").forEach(b => {
      const L = b.dataset.l;
      b.disabled = true;
      if (L === q.answer) { b.classList.add("correct"); b.querySelector(".mark").textContent = "✓"; }
      else if (L === chosen) { b.classList.add("wrong"); b.querySelector(".mark").textContent = "✗"; }
      else b.classList.add("dim");
    });
    const fb = document.getElementById("fb");
    fb.className = "feedback show " + (ok ? "ok" : "bad");
    fb.innerHTML = (ok ? "<bdi><b>Correct!</b></bdi>" : `<bdi><b>Not quite.</b> The answer is <b>${q.answer}</b>.</bdi>`) +
      (q.explanation ? `<span class="exp">${esc(q.explanation)}</span>` : "");
    if (announce) toast(ok ? "✓ Correct" : "✗ Wrong — answer is " + q.answer, ok ? "ok" : "bad");
  }

  function choose(L) {
    if (!state || state.answers[state.i]) return;
    state.answers[state.i] = L;
    renderQuestion();           // refresh dots / score / progress
    paint(L, true);
    document.getElementById("nextBtn").focus({ preventScroll: true });
  }

  function next() {
    if (!state.answers[state.i]) return;
    const total = state.subj.questions.length;
    if (state.i < total - 1) {
      // jump to next unanswered if any after current, else just next
      state.i++;
      renderQuestion();
    } else {
      const firstUnanswered = state.answers.findIndex(a => !a);
      if (firstUnanswered !== -1) { state.i = firstUnanswered; renderQuestion(); toast("Answer all questions first", "bad"); return; }
      renderResult();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- result ---------- */
  function renderResult() {
    const { subj, answers } = state;
    const dir = subj.rtl ? ` dir="rtl" lang="pnb"` : "";
    const total = subj.questions.length;
    const score = answers.filter((a, k) => a === subj.questions[k].answer).length;
    const pct = Math.round(score / total * 100);
    const { isNewBest, prevBest } = saveScore(subj.id, score, total);
    const color = pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--gold)" : "var(--red)";
    const msg = pct >= 85 ? "Excellent work!" : pct >= 70 ? "Great job!" : pct >= 50 ? "Good effort — review the misses below." : "Keep practicing — review the misses below.";
    const wrong = subj.questions.map((q, k) => ({ q, a: answers[k] })).filter(x => x.a !== x.q.answer);

    app.innerHTML = `
      <section class="result">
        <div class="ring" style="--p:${pct};--ring-color:${color}"><div><strong>${score}/${total}</strong><small>${pct}%</small></div></div>
        <h2>${esc(subj.title)}${state.practice ? "" : " " + state.year} — ${msg}</h2>
        <p>${isNewBest && prevBest < score ? "🎉 New best score!" : `Best so far: ${Math.max(prevBest, score)}/${total}`} · ${total - score} wrong</p>
        <div class="row">
          <button class="btn" id="retryBtn">↻ Retry ${esc(subj.title)}</button>
          ${state.practice && state.practice.nextId ? `<button class="btn" id="nextPackBtn">Next: ${esc(state.practice.nextLabel)} →</button>` : ""}
          <button class="btn secondary" id="backBtn">${state.practice ? "Back to practice bank" : "Back to subjects"}</button>
        </div>
        <div class="review">
          ${wrong.length ? `<h3>Review your mistakes (${wrong.length})</h3>` + wrong.map(({ q, a }) => `
            <div class="rv"${dir}>
              <div class="q"><bdi>${q.id}.</bdi> ${esc(q.text)}</div>
              <div class="a"><span class="yours">✗ Your answer: ${a}) ${esc(q.options[a])}</span><br>
              <span class="right">✓ Correct: ${q.answer}) ${esc(q.options[q.answer])}</span></div>
              ${q.explanation ? `<div class="exp">${esc(q.explanation)}</div>` : ""}
            </div>`).join("") : `<div class="perfect">Perfect score — every answer correct! 🌟</div>`}
        </div>
      </section>`;
    const pr = state.practice;
    document.getElementById("retryBtn").addEventListener("click", () => pr ? startPractice(pr.bank, pr.pack, pr.qidx) : startQuiz(subj.id));
    document.getElementById("backBtn").addEventListener("click", leaveQuiz);
    const np = document.getElementById("nextPackBtn");
    if (np) np.addEventListener("click", () => { state = null; go("practice/" + pr.bank + "/" + pr.nextId); });
    renderSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- global ---------- */
  document.getElementById("homeBtn").addEventListener("click", () => {
    if (mode === "dmc") { go("dmc"); return; }
    if (mode === "pms") { go("pms"); return; }
    if (mode === "syllabus") { go("syllabus"); return; }
    if (mode === "subjective") { go("subjective"); return; }
    if (!confirmLeave()) return;
    state = null;
    if (pview || location.hash.indexOf("#practice") === 0) go(year); else { app.className = "container"; renderHome(); }
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (pview) {
      const b = PBANK[pview];
      if (confirm("Clear saved best scores for the " + b.name + " practice bank? Yearly paper scores are kept.")) {
        try { localStorage.removeItem(practiceKey(b.id)); } catch (e) {}
        renderSidebar(); if (!state) renderPracticeHome(b.id);
      }
      return;
    }
    if (confirm("Clear saved best scores for CSS " + year + "? Other years are kept.")) {
      try { localStorage.removeItem(storeKey(year)); } catch (e) {}
      renderSidebar(); if (!state) renderHome();
    }
  });
  document.addEventListener("keydown", e => {
    if (!state || !document.querySelector(".qcard")) return;
    const k = e.key.toUpperCase();
    const map = { "1": "A", "2": "B", "3": "C", "4": "D" };
    const L = LETTERS.includes(k) ? k : map[k];
    if (L && !state.answers[state.i]) { e.preventDefault(); choose(L); }
    else if ((e.key === "Enter" || e.key === "ArrowRight") && state.answers[state.i]) { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft" && state.i > 0) { state.i--; renderQuestion(); }
  });


  /* ================= PRACTICE BANK (Objective › Practice) ================= */
  const practiceNav = document.getElementById("practiceNav");
  function packStats(b) {
    const sc = loadPracticeScores(b.id);
    const tried = b.packs.filter(p => sc[p.id]);
    const avg = tried.length ? Math.round(tried.reduce((a, p) => a + sc[p.id].best / sc[p.id].total, 0) / tried.length * 100) : null;
    return { sc, tried, avg };
  }
  function renderPracticeRail() {
    if (!practiceNav) return;
    practiceNav.innerHTML = PR.banks.map(b => {
      const { tried, avg } = packStats(b), on = pview === b.id;
      return `<button class="bank-item ${on ? "active" : ""}" data-b="${b.id}" aria-pressed="${on}" aria-label="${esc(b.name)} practice bank">
        <span class="sub-ic" aria-hidden="true">${b.icon}</span>
        <span class="sub-txt"><strong>${esc(b.name)}</strong><small>${b.total} MCQs · ${tried.length}/${b.packs.length} packs tried${avg === null ? "" : " · " + avg + "%"}</small></span>
      </button>`;
    }).join("");
    practiceNav.querySelectorAll(".bank-item").forEach(el => el.addEventListener("click", () => {
      if (pview === el.dataset.b && !state) return;
      go("practice/" + el.dataset.b);
    }));
  }
  const keyNote = b => String(b.answerKeyNote || "").replace(/^Practice answer key \(not an official FPSC key\)\.\s*/i, "");
  const pctOf = r => r ? Math.round(r.best / r.total * 100) : null;
  const lvl = p => p === null ? "" : p >= 70 ? "hi" : p >= 50 ? "mid" : "lo";
  function packBtn(b, p, sc, cls, inner) {
    const r = sc[p.id], pc = pctOf(r);
    return `<button class="${cls} ${lvl(pc)}" data-p="${p.id}" title="${esc(p.title)} · ${p.q.length} MCQs${r ? ` · best ${r.best}/${r.total}` : ""}" aria-label="Start ${esc(p.title)}">${inner(r, pc)}</button>`;
  }
  function renderPracticeHome(bid) {
    const b = PBANK[bid];
    state = null; pview = bid; setMode("objective");
    document.getElementById("brandTitle").textContent = "CSS Practice Bank";
    document.getElementById("brandSub").textContent = b.name + " · " + b.total + " MCQs";
    document.title = b.name + " practice bank · " + b.total + " CSS MCQs";
    if (location.hash.replace(/^#\/?/, "") !== "practice/" + bid) setHash("practice/" + bid);
    renderSidebar();
    const { sc, tried, avg } = packStats(b);
    const yearPacks = b.years.map(y => b.packById["css-" + y]);
    const chip = (r, pc) => r ? `<em>${pc}%</em>` : "";
    app.className = "container";
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#objective">Objective</a><span>›</span><span>Practice bank</span><span>›</span><b>${esc(b.name)}</b></nav>
      <section class="hero compact">
        <h1><span aria-hidden="true">${b.icon}</span> ${esc(b.name)} — practice bank</h1>
        <p>Go beyond the 2024–2026 papers: ${b.total} checked MCQs, carved into short packs of about 20 so you can practise in one sitting.
        Same quiz as the yearly papers — <b style="color:var(--green)">green</b> when you're right, <b style="color:var(--red)">red</b> plus the correct answer when you're not.</p>
        <div class="overall">
          <span class="pill">MCQs: <b>${b.total}</b></span>
          <span class="pill">Packs tried: <b>${tried.length}/${b.packs.length}</b></span>
          <span class="pill">Average best: <b>${avg === null ? "—" : avg + "%"}</b></span>
          <button class="pill pill-btn" id="randomBtn">🎲 Random 20</button>
        </div>
      </section>
      <div class="disclaimer" role="note"><b>Practice answer key — not an official FPSC key.</b> ${esc(keyNote(b))}</div>

      <h2 class="sec-title">CSS past papers <small>Real Part-I ${esc(b.shortName)} MCQs, ${b.years[b.years.length - 1]}–${b.years[0]} (only the ones that survived checking)</small></h2>
      <section class="pack-strip">
        ${yearPacks.map(p => packBtn(b, p, sc, "pack-chip", (r, pc) => `<strong>${esc(p.label)}</strong><small>${p.q.length} MCQs</small>${chip(r, pc)}`)).join("")}
      </section>

      <h2 class="sec-title">By topic <small>${b.topics.length} topics · each split into parts of up to 20</small></h2>
      <section class="grid topic-grid">
        ${b.topics.map(t => {
          const done = t.packs.filter(id => sc[id]).length;
          return `<div class="subject topic-card">
            <div class="icon" aria-hidden="true">${t.icon}</div>
            <h3>${esc(t.name)}</h3>
            <p class="sub">${t.count} MCQs · ${t.packs.length} part${t.packs.length > 1 ? "s" : ""}${done ? ` · ${done} tried` : ""}</p>
            <div class="part-chips">${t.packs.map(id => packBtn(b, b.packById[id], sc, "part-chip", (r, pc) => `${t.packs.length > 1 ? esc(b.packById[id].label.replace("Part ", "P")) : "Start"}${r ? ` <em>${pc}%</em>` : ""}`)).join("")}</div>
          </div>`;
        }).join("")}
      </section>

      <h2 class="sec-title">Mixed sets <small>All ${b.total} MCQs in ${b.sets.length} sets, in bank order${b.setOrderNote ? " (" + esc(b.setOrderNote) + ")" : ""}</small></h2>
      <section class="set-grid">
        ${b.sets.map(id => { const p = b.packById[id]; return packBtn(b, p, sc, "set-card", (r, pc) => `<strong>${esc(p.label)}</strong><small>Q${p.range[0]}–${p.range[1]}</small><span class="set-best">${r ? `Best ${r.best}/${r.total}` : "Not tried"}</span>`); }).join("")}
      </section>
      <p class="help">${esc(b.sourceNotes)} Sources: ${(Array.isArray(b.sources) ? b.sources : (b.sources ? [b.sources] : [])).filter(u => /^https?:\/\//.test(String(u))).map(u => { const url = String(u).split(" ")[0]; let host = url; try { host = new URL(url).hostname; } catch (e) {} return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(host)}</a>`; }).join(", ")}.
        Scores for this bank are saved separately from your yearly paper scores.</p>`;
    app.querySelectorAll("[data-p]").forEach(el => el.addEventListener("click", () => go("practice/" + bid + "/" + el.dataset.p)));
    document.getElementById("randomBtn").addEventListener("click", () => go("practice/" + bid + "/random"));
    window.scrollTo({ top: 0 });
  }
  function startPractice(bid, packId, reuse) {
    const b = PBANK[bid];
    let pack = b.packById[packId];
    if (packId === "random") {
      let idx = reuse;
      if (!idx) {
        idx = b.questions.map((_, i) => i);
        for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        idx = idx.slice(0, Math.min(20, idx.length));
      }
      pack = { id: "random", kind: "random", title: "Random 20", label: "Random", q: idx };
    }
    if (!pack) return renderPracticeHome(bid);
    pview = bid; setMode("objective");
    document.getElementById("brandTitle").textContent = "CSS Practice Bank";
    document.getElementById("brandSub").textContent = b.name + " · " + b.total + " MCQs";
    // Same quiz engine as the yearly papers: build a subject-shaped object (questions renumbered 1..n, bank number kept in the section tag).
    const subj = {
      id: pack.id, title: b.shortName + " · " + pack.title, rtl: b.rtl,
      subtitle: b.name + " practice bank · " + pack.q.length + " MCQs" + (pack.kind === "set" ? ` (bank Q${pack.range[0]}–${pack.range[1]})` : ""),
      answerKeyNote: "Practice answer key — not an official FPSC key. " + keyNote(b),
      questions: pack.q.map((qi, k) => { const q = b.questions[qi]; return Object.assign({}, q, { id: k + 1, section: (q.section ? q.section + " · " : "") + "Bank #" + q.id }); }),
    };
    // "Next pack" button on the result screen: next part of the same topic / next year / next set.
    let nextId = null;
    if (pack.kind === "topic") { const t = b.topics.find(t => t.id === pack.group); nextId = t.packs[t.packs.indexOf(pack.id) + 1] || null; }
    else if (pack.kind === "set") nextId = b.sets[b.sets.indexOf(pack.id) + 1] || null;
    else if (pack.kind === "year") { const y = b.years[b.years.indexOf(+pack.group) + 1]; nextId = y ? "css-" + y : null; }
    else if (pack.kind === "random") nextId = "random";
    const nextLabel = nextId === "random" ? "another random 20" : nextId ? b.packById[nextId].title : "";
    state = { subj, year, tag: pack.kind === "year" ? "Past paper" : "Practice", practice: { bank: bid, pack: pack.id, qidx: pack.q, nextId, nextLabel }, i: 0, answers: new Array(subj.questions.length).fill(null) };
    document.title = subj.title + " · " + b.name + " practice";
    setHash("practice/" + bid + "/" + pack.id);
    renderSidebar();
    renderQuestion();
    window.scrollTo({ top: 0 });
  }
  function leaveQuiz() {
    const pr = state && state.practice;
    state = null;
    if (pr) go("practice/" + pr.bank); else { app.className = "container"; renderHome(); }
  }

  /* ================= SUBJECTIVE (Part-II past papers) ================= */
  const PD = window.PAPERS_DATA || { subjects: [], years: [], gaps: [] };
  const PSUB = {}; PD.subjects.forEach(s => (PSUB[s.id] = s));
  const SUBJ_STORE = "cssPapers.subject";

  /* ================= PMS (Punjab PMS past papers) ================= */
  const PMD = window.PMS_DATA || { subjects: [], years: [], gaps: [] };
  const PMSUB = {}; PMD.subjects.forEach(s => (PMSUB[s.id] = s));
  const PMS_STORE = "pmsPapers.subject";
  const totalPMSPapers = PMD.subjects.reduce((a, s) => a + s.papers.length, 0);
  const pmYrRange = s => s.papers.length ? Math.min(...s.papers.map(p => p.year)) + "–" + Math.max(...s.papers.map(p => p.year)) : "—";

  /* ================= SYLLABUS ================= */
  const SD = window.SYLLABUS_DATA || { subjects: [], groups: [] };
  const SSUB = {}; SD.subjects.forEach(s => (SSUB[s.id] = s));
  const SYLL_STORE = "cssSyllabus.subject";
  let curSyll = null;

  /* ================= DMC (Detailed Marks Certificates) ================= */
  const DMD = window.DMC_DATA || { candidates: [], note: "" };
  const DCAND = {}; DMD.candidates.forEach(c => (DCAND[c.id] = c));
  const DMC_STORE = "cssDmc.candidate";
  let curDmc = null;
  const layoutEl = document.getElementById("layout");
  const subNav = document.getElementById("subNav"), subList = document.getElementById("subList");
  const objSide = document.getElementById("objSide"), subjInfo = document.getElementById("subjSideInfo");
  const resetBtn = document.getElementById("resetBtn");
  const totalPapers = PD.subjects.reduce((a, s) => a + s.papers.length, 0);
  const yrRange = s => s.papers.length ? Math.min(...s.papers.map(p => p.year)) + "–" + Math.max(...s.papers.map(p => p.year)) : "—";
  let curSubj = null, curPaper = null;

  function setMode(m) {
    mode = m;
    const subj = m === "subjective";
    const syll = m === "syllabus";
    const pms = m === "pms";
    const dmc = m === "dmc";
    document.body.classList.toggle("mode-subjective", subj || syll || pms || dmc);
    layoutEl.classList.toggle("three", subj || syll || pms || dmc);
    document.querySelectorAll(".mode").forEach(b => { const on = b.dataset.mode === m; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
    objSide.hidden = subj || syll || pms || dmc; subjInfo.hidden = !subj && !syll && !pms && !dmc; subNav.hidden = !subj && !syll && !pms && !dmc; resetBtn.hidden = subj || syll || pms || dmc;
    if (dmc) {
      document.getElementById("brandTitle").textContent = "CSS 2026 DMC";
      document.getElementById("brandSub").textContent = "Detailed Marks Certificates";
      app.className = "container"; renderDMCNav();
    } else if (pms) {
      document.getElementById("brandTitle").textContent = "PMS Past Papers";
      document.getElementById("brandSub").textContent = "Punjab PMS · Precis";
      app.className = "container"; renderPMSNav();
    } else if (syll) {
      document.getElementById("brandTitle").textContent = "CSS Syllabi";
      document.getElementById("brandSub").textContent = "FPSC subject syllabi · 10 subjects";
      app.className = "container"; renderSyllabusNav();
    } else if (subj) {
      document.getElementById("brandTitle").textContent = "CSS Past Papers";
      document.getElementById("brandSub").textContent = "Part-II Subjective · 2016–2026";
      app.className = "container"; renderSubNav();
    } else {
      document.getElementById("brandTitle").textContent = "CSS " + year;
      document.getElementById("brandSub").textContent = "Part-I MCQ Practice · 2024–2026";
    }
  }
  // Subjective navigation goes through the URL hash so Back/Forward and deep links work.
  function go(h) { if (location.hash.replace(/^#\/?/, "") === h) route(); else location.hash = h; }

  function renderSubNav() {
    subList.innerHTML = PD.subjects.map(s => `<button class="sub-item ${curSubj === s.id ? "active" : ""}" data-s="${s.id}" aria-pressed="${curSubj === s.id}">
        <span class="sub-ic" aria-hidden="true">${s.icon}</span>
        <span class="sub-txt"><strong>${esc(s.name)}</strong><small>${s.papers.length} papers · ${yrRange(s)}</small></span>
      </button>`).join("");
    subList.querySelectorAll(".sub-item").forEach(b => b.addEventListener("click", () => go("subjective/" + b.dataset.s)));
    subjInfo.innerHTML = `<div class="info-card"><strong>${totalPapers} papers</strong><small>${PD.subjects.length} subjects × ${PD.years.length} years (${PD.years[PD.years.length - 1]}–${PD.years[0]})</small></div>` +
      (PD.gaps || []).map(g => `<div class="gap"><span class="node" aria-hidden="true"></span><span><strong>${esc(g.range)}</strong><small>${esc(g.note)}</small></span></div>`).join("");
  }

  function renderPapersHome() {
    curSubj = null; curPaper = null; setMode("subjective");
    document.title = "CSS Past Papers (Part-II) · 2016–2026";
    app.innerHTML = `
      <section class="hero">
        <h1>Subjective past papers, 2016–2026.</h1>
        <p>Pick a subject from the list to see its papers year by year, then open any year to read or download that paper.</p>
        <div class="overall"><span class="pill">Subjects: <b>${PD.subjects.length}</b></span><span class="pill">Papers: <b>${totalPapers}</b></span><span class="pill">Years: <b>${PD.years[PD.years.length - 1]}–${PD.years[0]}</b></span></div>
      </section>
      <section class="grid">
        ${PD.subjects.map(s => `<button class="subject" data-s="${s.id}" aria-label="Open ${esc(s.name)} past papers">
          <div class="icon" aria-hidden="true">${s.icon}</div>
          <h3>${esc(s.name)}</h3>
          <p class="sub">Part-II subjective papers</p>
          <div class="meta"><span>${s.papers.length} papers</span><span class="best">${yrRange(s)}</span></div>
        </button>`).join("")}
      </section>
      <p class="help">Source: <a href="${esc(PD.source)}" target="_blank" rel="noopener">cssaspirants.pk</a>. ${esc(PD.notes || "")} Nothing before 2016 is on this source.</p>`;
    app.querySelectorAll(".subject").forEach(b => b.addEventListener("click", () => go("subjective/" + b.dataset.s)));
    window.scrollTo({ top: 0 });
  }

  function badges(p) {
    return `${p.hasMcqs ? `<span class="tag mcq">Part-I + II</span>` : `<span class="tag">Part-II</span>`}${p.scanned ? `<span class="tag scan">Scanned</span>` : ""}`;
  }
  function renderSubject(sid) {
    const s = PSUB[sid];
    curSubj = sid; curPaper = null; setMode("subjective");
    try { localStorage.setItem(SUBJ_STORE, sid); } catch (e) {}
    document.title = s.name + " · CSS Past Papers";
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#subjective">Subjective</a><span>›</span><b>${esc(s.name)}</b></nav>
      <section class="hero compact">
        <h1><span aria-hidden="true">${s.icon}</span> ${esc(s.name)}</h1>
        <p>${s.papers.length} past papers (${yrRange(s)}). Click a year to open the paper.</p>
      </section>
      <section class="year-grid">
        ${s.papers.map(p => `<button class="ycard" data-y="${p.year}" aria-label="Open ${esc(p.title)}">
          <span class="ycard-year">${p.year}</span>
          <span class="ycard-sub">${esc(s.name)}</span>
          <span class="ycard-tags">${badges(p)}</span>
          <span class="ycard-meta">${p.pages ? p.pages + " page" + (p.pages > 1 ? "s" : "") + " · " : ""}${p.sizeKB >= 1024 ? (p.sizeKB / 1024).toFixed(1) + " MB" : p.sizeKB + " KB"} · PDF</span>
          <span class="ycard-open">Open paper →</span>
        </button>`).join("")}
        <div class="ycard gap-card" aria-label="2006 to 2015 not available"><span class="ycard-year">2006–2015</span><span class="ycard-sub">Not on cssaspirants.pk</span></div>
      </section>
      <p class="help">PDFs from <a href="${esc(s.hub)}" target="_blank" rel="noopener">cssaspirants.pk</a>, saved with this site. 2024–2026 papers include the Part-I MCQs, which you can also practise under <a href="#objective">Objective</a>.</p>`;
    app.querySelectorAll(".ycard[data-y]").forEach(b => b.addEventListener("click", () => go("subjective/" + sid + "/" + b.dataset.y)));
    window.scrollTo({ top: 0 });
  }

  function renderPaper(sid, y) {
    const s = PSUB[sid];
    const i = s.papers.findIndex(p => String(p.year) === String(y));
    const p = s.papers[i];
    curSubj = sid; curPaper = p.year; setMode("subjective");
    try { localStorage.setItem(SUBJ_STORE, sid); } catch (e) {}
    document.title = p.title + " · Past paper";
    const newer = s.papers[i - 1], older = s.papers[i + 1];
    const quiz = DATA.byYear[p.year] && DATA.byYear[p.year].byId[s.objectiveId];
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#subjective">Subjective</a><span>›</span><a href="#subjective/${sid}">${esc(s.name)}</a><span>›</span><b>${p.year}</b></nav>
      <div class="paper-head">
        <div><h2>${esc(s.name)} <span class="year-tag">${p.year}</span></h2>
          <div class="sub">${badges(p)} ${p.pages ? p.pages + " pages · " : ""}${esc(p.contents)}</div></div>
        <div class="paper-actions">
          <a class="btn" href="${esc(p.pdfPath)}" target="_blank" rel="noopener">Open in new tab ↗</a>
          <a class="btn secondary" href="${esc(p.pdfPath)}" download="CSS-${p.year}-${sid}.pdf">Download</a>
          ${quiz ? `<a class="btn secondary" href="#${p.year}/${s.objectiveId}">Practise ${p.year} MCQs</a>` : ""}
        </div>
      </div>
      <div class="year-strip" role="group" aria-label="${esc(s.name)} years">
        ${s.papers.map(q => `<a class="chip ${q.year === p.year ? "active" : ""}" href="#subjective/${sid}/${q.year}" ${q.year === p.year ? 'aria-current="page"' : ""}>${q.year}</a>`).join("")}
      </div>
      <div class="viewer">
        <iframe src="${esc(p.pdfPath)}#view=FitH" title="${esc(p.title)} (PDF)" loading="lazy"></iframe>
      </div>
      <div class="actions">
        ${newer ? `<a class="btn secondary" href="#subjective/${sid}/${newer.year}">← ${newer.year}</a>` : "<span></span>"}
        <a class="btn secondary" href="#subjective/${sid}">All ${esc(s.name)} years</a>
        ${older ? `<a class="btn secondary" href="#subjective/${sid}/${older.year}">${older.year} →</a>` : "<span></span>"}
      </div>
      <p class="note">PDF not showing (common on phones)? Use “Open in new tab”. Source: <a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">cssaspirants.pk</a>.</p>`;
    window.scrollTo({ top: 0 });
  }

  function dmcPassingCell(p) { return p == null ? "—" : String(p); }
  function dmcBelowPass(row) {
    return row.passing != null && row.obtained < row.passing;
  }
  function dmcTableRows(rows) {
    return rows.map(r => {
      const fail = dmcBelowPass(r);
      const cls = [r.isTotal ? "dmc-total" : "", fail ? "dmc-fail" : ""].filter(Boolean).join(" ");
      return `<tr class="${cls}">
        <td>${esc(r.subject)}${fail ? '<span class="dmc-badge">Below pass</span>' : ""}</td>
        <td>${r.total}</td>
        <td>${dmcPassingCell(r.passing)}</td>
        <td>${r.obtained}</td>
      </tr>`;
    }).join("");
  }
  function dmcMarksTable(title, rows) {
    return `<div class="dmc-sec"><h3>${esc(title)}</h3>
      <div class="dmc-wrap"><table class="dmc-table">
        <thead><tr><th>Subject</th><th>Total</th><th>Passing</th><th>Obtained</th></tr></thead>
        <tbody>${dmcTableRows(rows)}</tbody>
      </table></div></div>`;
  }

  function renderDMCNav() {
    const cmpOn = curDmc === "compare";
    subList.innerHTML = DMD.candidates.map(c => `<button class="sub-item ${curDmc === c.id ? "active" : ""}" data-s="${c.id}" aria-pressed="${curDmc === c.id}">
        <span class="sub-ic" aria-hidden="true">👤</span>
        <span class="sub-txt"><strong>${esc(c.name)}</strong><small>Roll ${esc(c.rollNumber)} · ${c.writtenObtained}/${c.writtenTotal}</small></span>
      </button>`).join("") +
      `<button class="sub-item ${cmpOn ? "active" : ""}" data-s="compare" aria-pressed="${cmpOn}">
        <span class="sub-ic" aria-hidden="true">⚖</span>
        <span class="sub-txt"><strong>Compare</strong><small>Side-by-side marks</small></span>
      </button>`;
    subList.querySelectorAll(".sub-item").forEach(b => b.addEventListener("click", () => go("dmc/" + b.dataset.s)));
    subjInfo.innerHTML = `<div class="info-card"><strong>${DMD.candidates.length} candidates</strong><small>${esc(DMD.exam || "CSS 2026")}</small></div>`;
  }

  function renderDMCHome() {
    curDmc = null; setMode("dmc");
    document.title = "CSS 2026 DMC · Detailed Marks Certificates";
    app.innerHTML = `
      <section class="hero">
        <h1>CSS 2026 detailed marks.</h1>
        <p>Published DMCs for candidates who consented to share their written examination marks. Select a candidate to see subject-wise totals, passing marks, and obtained scores.</p>
        <div class="overall"><span class="pill">Exam: <b>CSS 2026</b></span><span class="pill">Candidates: <b>${DMD.candidates.length}</b></span></div>
      </section>
      <section class="grid">
        ${DMD.candidates.map(c => `<button class="subject" data-s="${c.id}" aria-label="View ${esc(c.name)} DMC">
          <div class="icon" aria-hidden="true">👤</div>
          <h3>${esc(c.name)}</h3>
          <p class="sub">Roll number ${esc(c.rollNumber)}</p>
          <div class="meta"><span>Written marks</span><span class="best">${c.writtenObtained} / ${c.writtenTotal}</span></div>
        </button>`).join("")}
        <a class="subject" href="#dmc/compare" style="text-decoration:none;color:inherit">
          <div class="icon" aria-hidden="true">⚖</div>
          <h3>Compare both</h3>
          <p class="sub">Subject-by-subject side by side</p>
          <div class="meta"><span>All subjects</span><span class="best">Open →</span></div>
        </a>
      </section>
      <p class="dmc-rule">${esc(DMD.note)}</p>`;
    app.querySelectorAll(".subject[data-s]").forEach(b => b.addEventListener("click", () => go("dmc/" + b.dataset.s)));
    window.scrollTo({ top: 0 });
  }

  function renderDMCCandidate(cid) {
    const c = DCAND[cid];
    if (!c) return renderDMCHome();
    curDmc = cid; setMode("dmc");
    try { localStorage.setItem(DMC_STORE, cid); } catch (e) {}
    document.title = c.name + " · CSS 2026 DMC";
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#dmc">DMC</a><span>›</span><b>${esc(c.name)}</b></nav>
      <section class="hero compact">
        <h1>${esc(c.name)}</h1>
        <p>Roll number <b>${esc(c.rollNumber)}</b> · ${esc(DMD.exam || "CSS 2026")}</p>
      </section>
      <p class="dmc-written">Marks in written: <b>${c.writtenObtained} / ${c.writtenTotal}</b></p>
      ${dmcMarksTable("Compulsory subjects", c.compulsory)}
      ${dmcMarksTable("Optional subjects", c.optional)}
      <p class="dmc-rule">${esc(DMD.note)}</p>
      <div class="actions">
        <a class="btn secondary" href="#dmc">All candidates</a>
        <a class="btn secondary" href="#dmc/compare">Compare both →</a>
      </div>`;
    window.scrollTo({ top: 0 });
  }

  function renderDMCCompare() {
    curDmc = "compare"; setMode("dmc");
    document.title = "Compare · CSS 2026 DMC";
    const cs = DMD.candidates;
    if (cs.length < 2) return renderDMCHome();
    const [a, b] = cs;
    const bySub = (cand, sub) => {
      const row = [...cand.compulsory, ...cand.optional].find(r => r.subject === sub);
      return row || null;
    };
    const sections = [
      { title: "Compulsory subjects", rows: a.compulsory.map(r => r.subject) },
      { title: "Optional subjects", rows: a.optional.map(r => r.subject) }
    ];
    const body = sections.map(sec => {
      const secRow = `<tr class="dmc-sec-row"><td colspan="3">${esc(sec.title)}</td></tr>`;
      const dataRows = sec.rows.map(sub => {
        const ra = bySub(a, sub), rb = bySub(b, sub);
        const rowCls = (ra && ra.isTotal) || (rb && rb.isTotal) ? "dmc-total" : "";
        const fa = ra && dmcBelowPass(ra), fb = rb && dmcBelowPass(rb);
        const cell = (r, fail) => r ? `<td class="num${fail ? " dmc-fail" : ""}">${r.obtained}${fail ? ' <span class="dmc-badge">Below pass</span>' : ""}</td>` : `<td class="num">—</td>`;
        return `<tr class="${rowCls}"><td>${esc(sub)}</td>${cell(ra, fa)}${cell(rb, fb)}</tr>`;
      }).join("");
      return secRow + dataRows;
    }).join("");
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#dmc">DMC</a><span>›</span><b>Compare</b></nav>
      <section class="hero compact">
        <h1>Compare marks</h1>
        <p>Obtained marks per subject for both candidates. GK and Computer Science use aggregate rows only for pass/fail highlighting.</p>
      </section>
      <div class="dmc-cmp-actions"><a class="btn secondary" href="#dmc">← All candidates</a></div>
      <div class="dmc-wrap"><table class="dmc-table cmp">
        <thead><tr>
          <th>Subject</th>
          <th class="dmc-cmp-h">${esc(a.name)}<br><small>Roll ${esc(a.rollNumber)} · ${a.writtenObtained}/${a.writtenTotal}</small></th>
          <th class="dmc-cmp-h">${esc(b.name)}<br><small>Roll ${esc(b.rollNumber)} · ${b.writtenObtained}/${b.writtenTotal}</small></th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table></div>
      <p class="dmc-rule">${esc(DMD.note)}</p>`;
    window.scrollTo({ top: 0 });
  }

  function renderPMSNav() {
    subList.innerHTML = PMD.subjects.map(s => `<button class="sub-item ${curPMSSubj === s.id ? "active" : ""}" data-s="${s.id}" aria-pressed="${curPMSSubj === s.id}">
        <span class="sub-ic" aria-hidden="true">${s.icon}</span>
        <span class="sub-txt"><strong>${esc(s.name)}</strong><small>${s.papers.length} papers · ${pmYrRange(s)}</small></span>
      </button>`).join("");
    subList.querySelectorAll(".sub-item").forEach(b => b.addEventListener("click", () => go("pms/" + b.dataset.s)));
    subjInfo.innerHTML = `<div class="info-card"><strong>${totalPMSPapers} papers</strong><small>${PMD.subjects.length} subject · ${PMD.years[0]}–${PMD.years[PMD.years.length - 1]}</small></div>` +
      (PMD.gaps || []).map(g => `<div class="gap"><span class="node" aria-hidden="true"></span><span><strong>${esc(g.range)}</strong><small>${esc(g.note)}</small></span></div>`).join("");
  }

  function renderSyllabusNav() {
    const grouped = {};
    SD.groups.forEach(g => { grouped[g.id] = { ...g, subjects: [] }; });
    SD.subjects.forEach(s => { if (grouped[s.groupId]) grouped[s.groupId].subjects.push(s); });
    
    subList.innerHTML = Object.values(grouped).filter(g => g.subjects.length).map(g => `
      <div class="syll-group">
        <div class="syll-group-title">${esc(g.name)}</div>
        ${g.subjects.map(s => `<button class="sub-item ${curSyll === s.id ? "active" : ""}" data-s="${s.id}" aria-pressed="${curSyll === s.id}">
          <span class="sub-ic" aria-hidden="true">${s.icon}</span>
          <span class="sub-txt"><strong>${esc(s.name)}</strong><small>${s.marks} marks · Code ${s.code}</small></span>
        </button>`).join("")}
      </div>
    `).join("");
    subList.querySelectorAll(".sub-item").forEach(b => b.addEventListener("click", () => go("syllabus/" + b.dataset.s)));
    subjInfo.innerHTML = `<div class="info-card"><strong>${SD.subjects.length} syllabi</strong><small>FPSC CSS subjects</small></div>`;
  }

  function renderSyllabusHome() {
    curSyll = null; setMode("syllabus");
    document.title = "CSS Syllabi · FPSC Subject Syllabi";
    
    const grouped = {};
    SD.groups.forEach(g => { grouped[g.id] = { ...g, subjects: [] }; });
    SD.subjects.forEach(s => { if (grouped[s.groupId]) grouped[s.groupId].subjects.push(s); });
    
    app.innerHTML = `
      <section class="hero">
        <h1>CSS subject syllabi.</h1>
        <p>Official FPSC syllabi for selected CSS subjects. Click any subject to view its detailed syllabus.</p>
        <div class="overall"><span class="pill">Syllabi available: <b>${SD.subjects.length}</b></span></div>
      </section>
      ${Object.values(grouped).filter(g => g.subjects.length).map(g => `
        <h2 class="sec-title">${esc(g.name)} <small>${g.marksNote}</small></h2>
        <section class="grid">
          ${g.subjects.map(s => `<button class="subject" data-s="${s.id}" aria-label="View ${esc(s.name)} syllabus">
            <div class="icon" aria-hidden="true">${s.icon}</div>
            <h3>${esc(s.name)}</h3>
            <p class="sub">Code ${s.code} · ${s.marks} marks</p>
            <div class="meta"><span>FPSC syllabus</span><span class="best">View PDF</span></div>
          </button>`).join("")}
        </section>
      `).join("")}
      <p class="help">Source: <a href="${esc(SD.source)}" target="_blank" rel="noopener">cssaspirants.pk</a>. ${esc(SD.note)}</p>`;
    app.querySelectorAll(".subject").forEach(b => b.addEventListener("click", () => go("syllabus/" + b.dataset.s)));
    window.scrollTo({ top: 0 });
  }

  function renderSyllabusViewer(sid) {
    const s = SSUB[sid];
    if (!s) return renderSyllabusHome();
    curSyll = sid; setMode("syllabus");
    try { localStorage.setItem(SYLL_STORE, sid); } catch (e) {}
    document.title = s.name + " · CSS Syllabus";
    
    const grp = SD.groups.find(g => g.id === s.groupId);
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#syllabus">Syllabus</a><span>›</span><b>${esc(s.name)}</b></nav>
      <div class="paper-head">
        <div><h2>${esc(s.name)} <span class="year-tag">Syllabus</span></h2>
          <div class="sub">${grp ? esc(grp.name) + " · " : ""}Code ${s.code} · ${s.marks} marks</div></div>
        <div class="paper-actions">
          <a class="btn" href="${esc(s.pdfPath)}" target="_blank" rel="noopener">Open in new tab ↗</a>
          <a class="btn secondary" href="${esc(s.pdfPath)}" download="CSS-Syllabus-${sid}.pdf">Download</a>
        </div>
      </div>
      <div class="viewer">
        <iframe src="${esc(s.pdfPath)}#view=FitH" title="${esc(s.name)} Syllabus (PDF)" loading="lazy"></iframe>
      </div>
      <div class="actions">
        <span></span>
        <a class="btn secondary" href="#syllabus">All syllabi</a>
        <span></span>
      </div>
      <p class="note">PDF not showing (common on phones)? Use "Open in new tab". Source: <a href="${esc(s.sourceUrl)}" target="_blank" rel="noopener">cssaspirants.pk</a>.</p>`;
    window.scrollTo({ top: 0 });
  }

  /* ================= PMS PAGES ================= */
  let curPMSSubj = null, curPMSPaper = null;

  function renderPMSHome() {
    curPMSSubj = null; curPMSPaper = null; setMode("pms");
    document.title = "PMS Past Papers · Punjab PMS";
    app.innerHTML = `
      <section class="hero">
        <h1>PMS past papers.</h1>
        <p>Punjab Provincial Management Service past papers from PPSC. Pick a subject to see papers by year, then open any year to read or download that paper.</p>
        <div class="overall"><span class="pill">Subjects: <b>${PMD.subjects.length}</b></span><span class="pill">Papers: <b>${totalPMSPapers}</b></span><span class="pill">Years: <b>${PMD.years[PMD.years.length - 1]}–${PMD.years[0]}</b></span></div>
      </section>
      <section class="grid">
        ${PMD.subjects.map(s => `<button class="subject" data-s="${s.id}" aria-label="Open ${esc(s.name)} past papers">
          <div class="icon" aria-hidden="true">${s.icon}</div>
          <h3>${esc(s.name)}</h3>
          <p class="sub">PMS past papers from PPSC</p>
          <div class="meta"><span>${s.papers.length} papers</span><span class="best">${pmYrRange(s)}</span></div>
        </button>`).join("")}
      </section>
      <p class="help">Source: <a href="${esc(PMD.source)}" target="_blank" rel="noopener">ppsc.gop.pk</a>. ${esc(PMD.note || "")}</p>`;
    app.querySelectorAll(".subject").forEach(b => b.addEventListener("click", () => go("pms/" + b.dataset.s)));
    window.scrollTo({ top: 0 });
  }

  function renderPMSSubject(sid) {
    const s = PMSUB[sid];
    if (!s) return renderPMSHome();
    curPMSSubj = sid; curPMSPaper = null; setMode("pms");
    try { localStorage.setItem(PMS_STORE, sid); } catch (e) {}
    document.title = s.name + " · PMS Past Papers";
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#pms">PMS</a><span>›</span><b>${esc(s.name)}</b></nav>
      <section class="hero compact">
        <h1><span aria-hidden="true">${s.icon}</span> ${esc(s.name)}</h1>
        <p>${s.papers.length} past papers (${pmYrRange(s)}). Click a year to open the paper.</p>
      </section>
      <section class="year-grid">
        ${s.papers.map(p => `<button class="ycard" data-y="${p.year}" aria-label="Open ${esc(p.title)}">
          <span class="ycard-year">${p.year}</span>
          <span class="ycard-sub">${esc(s.shortName || s.name)}</span>
          <span class="ycard-tags"><span class="tag">PMS</span></span>
          <span class="ycard-meta">${p.pages ? p.pages + " page" + (p.pages > 1 ? "s" : "") + " · " : ""}${p.sizeKB >= 1024 ? (p.sizeKB / 1024).toFixed(1) + " MB" : p.sizeKB + " KB"} · PDF</span>
          <span class="ycard-open">Open paper →</span>
        </button>`).join("")}
        ${PMD.gaps.map(g => `<div class="ycard gap-card" aria-label="${esc(g.range)} not available"><span class="ycard-year">${esc(g.range)}</span><span class="ycard-sub">${esc(g.note)}</span></div>`).join("")}
      </section>
      <p class="help">PDFs from <a href="${esc(s.hub)}" target="_blank" rel="noopener">ppsc.gop.pk</a>, saved with this site.</p>`;
    app.querySelectorAll(".ycard[data-y]").forEach(b => b.addEventListener("click", () => go("pms/" + sid + "/" + b.dataset.y)));
    window.scrollTo({ top: 0 });
  }

  function renderPMSPaper(sid, y) {
    const s = PMSUB[sid];
    if (!s) return renderPMSHome();
    const i = s.papers.findIndex(p => String(p.year) === String(y));
    const p = s.papers[i];
    if (!p) return renderPMSSubject(sid);
    curPMSSubj = sid; curPMSPaper = p.year; setMode("pms");
    try { localStorage.setItem(PMS_STORE, sid); } catch (e) {}
    document.title = p.title + " · PMS past paper";
    const newer = s.papers[i - 1], older = s.papers[i + 1];
    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#pms">PMS</a><span>›</span><a href="#pms/${sid}">${esc(s.shortName || s.name)}</a><span>›</span><b>${p.year}</b></nav>
      <div class="paper-head">
        <div><h2>${esc(s.name)} <span class="year-tag">${p.year}</span></h2>
          <div class="sub"><span class="tag">PMS</span> ${p.pages ? p.pages + " pages" : ""}</div></div>
        <div class="paper-actions">
          <a class="btn" href="${esc(p.pdfPath)}" target="_blank" rel="noopener">Open in new tab ↗</a>
          <a class="btn secondary" href="${esc(p.pdfPath)}" download="PMS-${p.year}-${sid}.pdf">Download</a>
        </div>
      </div>
      <div class="year-strip" role="group" aria-label="${esc(s.name)} years">
        ${s.papers.map(q => `<a class="chip ${q.year === p.year ? "active" : ""}" href="#pms/${sid}/${q.year}" ${q.year === p.year ? 'aria-current="page"' : ""}>${q.year}</a>`).join("")}
      </div>
      <div class="viewer">
        <iframe src="${esc(p.pdfPath)}#view=FitH" title="${esc(p.title)} (PDF)" loading="lazy"></iframe>
      </div>
      <div class="actions">
        ${newer ? `<a class="btn secondary" href="#pms/${sid}/${newer.year}">← ${newer.year}</a>` : "<span></span>"}
        <a class="btn secondary" href="#pms/${sid}">All ${esc(s.shortName || s.name)} years</a>
        ${older ? `<a class="btn secondary" href="#pms/${sid}/${older.year}">${older.year} →</a>` : "<span></span>"}
      </div>
      <p class="note">PDF not showing (common on phones)? Use "Open in new tab". Source: <a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">ppsc.gop.pk</a>.</p>`;
    window.scrollTo({ top: 0 });
  }

  /* ---------- router: #2025, #2025/punjabi, #objective, #subjective[/subject[/year]], #syllabus[/subject], #pms[/subject[/year]], #dmc[/id|compare] ---------- */
  function route() {
    const parts = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/").filter(Boolean);
    if (parts[0] === "dmc") {
      if (state && !confirmLeave()) { setHash(year + "/" + state.subj.id); return; }
      state = null;
      if (parts[1] === "compare") return renderDMCCompare();
      const cid = DCAND[parts[1]] ? parts[1] : null;
      if (!cid) return renderDMCHome();
      return renderDMCCandidate(cid);
    }
    if (parts[0] === "practice" || (parts[0] === "objective" && parts[1] === "practice")) {
      const pp = parts[0] === "practice" ? parts.slice(1) : parts.slice(2);
      const bid = PBANK[pp[0]] ? pp[0] : PR.banks.length ? PR.banks[0].id : null;
      if (!bid) { app.className = "container"; return renderHome(); }
      const target = PBANK[bid].packById[pp[1]] || pp[1] === "random" ? pp[1] : null;
      if (state && !(state.practice && state.practice.bank === bid && state.practice.pack === target) && !confirmLeave()) {
        setHash(state.practice ? "practice/" + state.practice.bank + "/" + state.practice.pack : year + "/" + state.subj.id); return;
      }
      if (target) {
        if (state && state.practice && state.practice.bank === bid && state.practice.pack === target) return;
        return startPractice(bid, target);
      }
      state = null; return renderPracticeHome(bid);
    }
    if (parts[0] === "pms") {
      if (state && !confirmLeave()) { setHash(year + "/" + state.subj.id); return; }
      state = null;
      const sid = PMSUB[parts[1]] ? parts[1] : null;
      if (!sid) return renderPMSHome();
      if (parts[2] && PMSUB[sid].papers.some(p => String(p.year) === parts[2])) return renderPMSPaper(sid, parts[2]);
      return renderPMSSubject(sid);
    }
    if (parts[0] === "syllabus") {
      if (state && !confirmLeave()) { setHash(year + "/" + state.subj.id); return; }
      state = null;
      const sid = SSUB[parts[1]] ? parts[1] : null;
      if (!sid) return renderSyllabusHome();
      return renderSyllabusViewer(sid);
    }
    if (parts[0] === "subjective") {
      if (state && !confirmLeave()) { setHash(year + "/" + state.subj.id); return; }
      state = null;
      const sid = PSUB[parts[1]] ? parts[1] : null;
      if (!sid) return renderPapersHome();
      if (parts[2] && PSUB[sid].papers.some(p => String(p.year) === parts[2])) return renderPaper(sid, parts[2]);
      return renderSubject(sid);
    }
    const [hy, hs] = parts;
    if (state && state.practice && !confirmLeave()) { setHash("practice/" + state.practice.bank + "/" + state.practice.pack); return; }
    if (state && state.practice) state = null;
    if (DATA.byYear[hy] && hy !== year) selectYear(hy, { silent: true });
    if (hs && YD.byId[hs]) startQuiz(hs); else { app.className = "container"; renderHome(); }
  }
  window.addEventListener("hashchange", route);

  document.querySelectorAll(".mode").forEach(b => b.addEventListener("click", () => {
    const m = b.dataset.mode;
    if (m === mode && m === "objective" && !state && !pview) return;
    if (m === "dmc") {
      if (!confirmLeave()) return;
      let last = null; try { last = localStorage.getItem(DMC_STORE); } catch (e) {}
      go(mode === "dmc" ? "dmc" : DCAND[last] ? "dmc/" + last : "dmc");
    } else if (m === "pms") {
      if (!confirmLeave()) return;
      let last = null; try { last = localStorage.getItem(PMS_STORE); } catch (e) {}
      go(mode === "pms" ? "pms" : PMSUB[last] ? "pms/" + last : "pms");
    } else if (m === "syllabus") {
      if (!confirmLeave()) return;
      let last = null; try { last = localStorage.getItem(SYLL_STORE); } catch (e) {}
      go(mode === "syllabus" ? "syllabus" : SSUB[last] ? "syllabus/" + last : "syllabus");
    } else if (m === "subjective") {
      if (!confirmLeave()) return;
      let last = null; try { last = localStorage.getItem(SUBJ_STORE); } catch (e) {}
      go(mode === "subjective" ? "subjective" : PSUB[last] ? "subjective/" + last : "subjective");
    } else {
      if (!confirmLeave()) return;
      state = null;
      if (mode === "subjective" || mode === "syllabus" || mode === "pms" || mode === "dmc" || pview || location.hash.indexOf("#practice") === 0) go(year); else { app.className = "container"; renderHome(); }
    }
  }));

  /* ---------- boot: #subjective/... > #2025 or #2025/punjabi > last selected year > default ---------- */
  const [hy] = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
  let saved = null; try { saved = localStorage.getItem(YEAR_STORE); } catch (e) {}
  const initial = DATA.byYear[hy] ? hy : DATA.byYear[saved] ? saved : String(DATA.defaultYear);
  selectYear(initial, { silent: true });
  route();
})();
