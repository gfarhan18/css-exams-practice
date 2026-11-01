(function () {
  "use strict";
  const DATA = window.MCQ_DATA;
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const yearNav = document.getElementById("yearNav");
  const gapList = document.getElementById("gapList");
  const LETTERS = ["A", "B", "C", "D"];
  const YEAR_STORE = "cssMcq.selectedYear";

  if (!DATA || !DATA.byYear) { app.innerHTML = "<p>Could not load js/quiz-data.js.</p>"; return; }
  const YEARS = DATA.years.map(String);
  let year = null;                 // selected exam year (string)
  let YD = null;                   // DATA.byYear[year]

  /* ---------- storage (namespaced per year, e.g. cssMcq2025.scores.v1; 2026 keeps the original key) ---------- */
  const storeKey = y => "cssMcq" + y + ".scores.v1";
  function loadScores(y) { try { return JSON.parse(localStorage.getItem(storeKey(y || year))) || {}; } catch (e) { return {}; } }
  function saveScore(id, score, total) {
    const all = loadScores();
    const prev = all[id] || { best: 0, attempts: 0 };
    all[id] = { best: Math.max(prev.best, score), total, attempts: prev.attempts + 1, last: score, lastAt: new Date().toISOString() };
    try { localStorage.setItem(storeKey(year), JSON.stringify(all)); } catch (e) {}
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
    document.getElementById("brandTitle").textContent = "CSS " + y;
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
      return `<button class="year ${y === year ? "active" : ""}" data-y="${y}" aria-pressed="${y === year}" aria-label="CSS ${y}: ${done.length} of ${subs.length} subjects attempted">
        <span class="node" aria-hidden="true"></span>
        <span class="y-main"><strong>${y}</strong><small>${subs.length} subjects · ${done.length}/${subs.length} tried${avg === null ? "" : " · " + avg + "%"}</small></span>
      </button>`;
    }).join("");
    yearNav.querySelectorAll(".year").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.y === year && !state) return;
      if (!confirmLeave()) return;
      selectYear(b.dataset.y);
    }));
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
    state = null;
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
    state = { subj, year, i: 0, answers: new Array(subj.questions.length).fill(null) };
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
        <div><h2>${esc(subj.title)} <span class="year-tag">${state.year}</span></h2><div class="sub"><bdi>${esc(subj.subtitle)}</bdi></div></div>
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
        <button class="btn secondary" id="quitBtn">← Subjects</button>
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
      app.className = "container"; renderHome();
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
        <h2>${esc(subj.title)} ${state.year} — ${msg}</h2>
        <p>${isNewBest && prevBest < score ? "🎉 New best score!" : `Best so far: ${Math.max(prevBest, score)}/${total}`} · ${total - score} wrong</p>
        <div class="row">
          <button class="btn" id="retryBtn">↻ Retry ${esc(subj.title)}</button>
          <button class="btn secondary" id="backBtn">Back to subjects</button>
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
    document.getElementById("retryBtn").addEventListener("click", () => startQuiz(subj.id));
    document.getElementById("backBtn").addEventListener("click", () => { app.className = "container"; renderHome(); });
    renderSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- global ---------- */
  document.getElementById("homeBtn").addEventListener("click", () => {
    if (!confirmLeave()) return;
    app.className = "container"; renderHome();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
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

  /* ---------- boot: #2025 or #2025/punjabi > last selected year > default ---------- */
  const [hy, hs] = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
  let saved = null; try { saved = localStorage.getItem(YEAR_STORE); } catch (e) {}
  const initial = DATA.byYear[hy] ? hy : DATA.byYear[saved] ? saved : String(DATA.defaultYear);
  selectYear(initial, { silent: true });
  if (hs && YD.byId[hs]) startQuiz(hs); else renderHome();
})();
