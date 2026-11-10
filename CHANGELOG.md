# Changelog

## 2026-11-10 — DMC (CSS 2026 detailed marks)

### Added
- **Fifth paper type, DMC:** Detailed Marks Certificates for CSS 2026 in the left rail (alongside Objective, Subjective, Syllabus, PMS). Lists consenting candidates as cards with roll number and written total.
- **Candidate view:** `#dmc/<id>` shows compulsory and optional subject tables (Subject, Total, Passing, Obtained). Aggregate rows are bold; subjects below the passing mark are highlighted with a “Below pass” badge. GK and Computer Science use total rows only for pass highlighting. Includes “Marks in written” and Rule 16(16) note text.
- **Compare view:** `#dmc/compare` shows both candidates’ obtained marks per subject side by side.
- Data in `js/dmc-data.js` only (no CNIC, PDFs, or FPSC portal URLs).

## 2026-11-03 — PMS past papers (English Precis)

### Added
- **Fourth paper type, PMS:** Punjab Provincial Management Service past papers in the left rail (alongside Objective, Subjective, Syllabus), with the same flow as Subjective — subject list, year cards, in-page PDF viewer.
- **English (Precis, Comprehension & Translation):** 5 official PDFs from [ppsc.gop.pk](https://www.ppsc.gop.pk/PMSPastPapers.aspx) for 2019, 2020, 2022, 2023, and 2024 (no 2021 listing on PPSC).
- **Deep links:** `#pms`, `#pms/english-precis-comprehension-translation`, `#pms/english-precis-comprehension-translation/2024`, etc.
- Catalog in `js/pms-data.js`; PDFs under `papers/pms/english-precis-comprehension-translation/`.

## 2026-11-03 — English Pair of Words practice bank (134 MCQs)

### Added
- **Third practice bank, 📝 English Pair of Words: 134 MCQs (67 unique pairs) in 16 packs.** Listed under Objective › Practice bank alongside Islamic Studies and Pakistan Affairs.
  - **CSS past papers 2016–2026**: 9 year packs covering CSS English (Precis & Composition) papers 2016–2018 and 2021–2026 from cssaspirants.pk (2019–2020 asked idioms only; pre-2016 papers not published there).
  - **By topic**: 9 packs (one per CSS year: 2016, 2017, 2018, 2021, 2022, 2023, 2024, 2025, 2026).
  - **Mixed sets**: 7 sets of 20 (last set 14).
  - Each pair becomes two MCQs: one tests the first word's meaning, one tests the second. Explanations include both words' meanings and self-explanatory sentences.
  - Repeated pairs merged: Dinghy/Dingy (2017, 2018), Faint/Feint (2018, 2023, 2024), Moat/Mote (2016, 2026).
- **Deep links**: `#practice/english-pair-of-words`, `#practice/english-pair-of-words/css-2026-pairs`, `#practice/english-pair-of-words/set-5` and `#practice/english-pair-of-words/random`.
- The data is in `data/practice/english-pair-of-words/` with the bank JSON and `by-topic/` folder.

### Changed
- **CSS styles**: Added `white-space:pre-line` to `.feedback .exp, .rv .exp` so multi-line explanations (each word on its own line) preserve line breaks.

## 2026-11-01 — Pakistan Affairs practice bank (660 MCQs)

### Added
- **Second practice bank, 🇵🇰 Pakistan Affairs: 660 checked MCQs in 89 packs.** It's listed under Objective › Practice bank next to Islamic Studies and works the same way (same quiz, disclaimer, Next button and Random 20).
  - **CSS past papers 2005–2023**: 19 year packs with 294 real Part-I Pakistan Affairs MCQs (12–18 per year).
  - **By topic**: 8 topics (Ancient & Muslim Rule; Reform Movements & Pakistan Movement; Partition & Early Years; Constitution & Politics; Foreign Policy & Kashmir; Geography & Resources; Economy & Infrastructure; Culture, Literature & Sufis) in 37 parts of up to 20.
  - **Mixed sets**: 33 sets of 20.
- Scores are saved under `cssMcqPractice.pakistan-affairs.scores.v1`, separately from the yearly scores and from Islamic Studies.
- **Deep links**: `#practice/pakistan-affairs`, `#practice/pakistan-affairs/css-2015`, `#practice/pakistan-affairs/constitution-politics-3`, `#practice/pakistan-affairs/set-7` and `#practice/pakistan-affairs/random`.
- The data is in `data/practice/pakistan-affairs/`, which holds the bank, `by-topic/`, `sources.md` and `verification-report.md`.

### Changed
- The bank page no longer hard-codes "Islamiat" in its headings. The mixed-sets order note now comes from `setOrderNote` in `practice-catalog.json`.
- The source list shows only URL entries.
- `rebuild-data.py` now reads topic names from titles that use either ":" or "·" as the separator.
- Yearly Objective (2024–2026) and Subjective are unchanged.

## 2026-11-01 — Islamic Studies practice bank (676 MCQs)

### Added
- **Objective › Practice bank**: a new "Practice bank" item in the left rail under the year timeline, plus a banner on every year's home page. Yearly papers 2024–2026 are unchanged.
- **Islamic Studies bank, 676 checked MCQs** in 91 packs. Each pack is at most 20 questions and uses the same quiz engine (green if right; red plus the correct answer if wrong; explanations and review of mistakes):
  - **CSS past papers 2005–2023**: 19 year packs (248 real Part-I Islamiat MCQs that passed checking, 3–19 per year).
  - **By topic**: 10 topic cards (Seerah, Quran & Tafseer, Hadith & Sunnah, Fiqh & Islamic Law, Pillars & Worship, Beliefs & Ethics, Companions & Family, Khulafa & Islamic History, Comparative Religion, Muslim Scholars) split into 38 parts of up to 20 questions.
  - **Mixed sets**: all 676 questions in 34 sets of 19–20.
  - **Random 20** button.
  - After each pack, a "Next" button opens the next part, set or year.
- **Separate scores**: stored under `cssMcqPractice.<bank>.scores.v1`, so yearly scores (`cssMcq<year>.scores.v1`) are never overwritten. "Reset scores" on the bank page clears only the bank.
- **Disclaimer** on the bank page and on every pack: practice key, not an official FPSC key.
- **Deep links**: `#practice/islamic-studies`, `#practice/islamic-studies/seerah-3`, `#practice/islamic-studies/css-2015`, `#practice/islamic-studies/set-7` and `#practice/islamic-studies/random`. `#objective/practice/...` also works.
- **Data**:
  - The bank is in `data/practice/islamic-studies/`: the main JSON, `by-topic/*.json`, `sources.md` and `verification-report.md`.
  - `data/practice-catalog.json` lists the banks.
  - `rebuild-data.py` builds `js/practice-data.js`. Each question is stored once and packs point to it by index. The build checks the data shape, and that every topic question is in the main bank and every question is in a topic.

## 2026-11-01 — Subjective (Part-II) past papers, 2016–2026

### Added
- **Objective / Subjective switch** at the top of the left sidebar. It's always visible (a two-button toggle on phones).
  - **Objective** is the existing Part-I MCQ quiz for 2024–2026. It works as before.
  - **Subjective** opens a second sidebar that stays in place, listing 7 subjects: English Precis & Composition, Pakistan Affairs, Current Affairs, Islamic Studies (Islamiat), Criminology, Gender Studies and Punjabi.
- **Year cards**: pick a subject to see one card per year, 2026 back to 2016. Each card shows the page count and file size, a "Part-I + II" or "Part-II" tag, and a "Scanned" tag where the PDF is a scan. A dashed card notes that 2006–2015 aren't on the source.
- **Paper viewer**: click a year card to see the PDF embedded on the page. The viewer has these controls:
  - Open in new tab and Download
  - A strip of years for jumping to another year
  - Newer/older buttons
  - A link to the cssaspirants.pk original
  - A "Practise <year> MCQs" button on 2024–2026 papers, which opens that year's Objective quiz
- **77 PDFs** (7 subjects × 11 years) are stored with the site in `papers/<subject-id>/<year>.pdf`, so the site doesn't link to files on cssaspirants.pk. All source URLs were checked on 1 Nov 2026 and returned HTTP 200.
- `data/subjective-catalog.json` is the source list of papers. `rebuild-data.py` now also builds `js/papers-data.js` from it and stops with an error if any listed PDF is missing.
- **Deep links**: `#subjective`, `#subjective/criminology` and `#subjective/criminology/2023`. Old links like `#2025` and `#2025/punjabi` still work, and `#objective` opens the Objective home page. Back and Forward work in Subjective, and the site remembers the last subject you opened.

### Notes
- cssaspirants.pk has no papers before 2016. The 2016–2023 PDFs contain Part-II only, while the 2024–2026 PDFs also include Part-I.
- Persian isn't included.

## 2026-11-01 — Multi-year support (2024, 2025, 2026)

### Added
- **Year timeline in the sidebar** (horizontal strip on phones) plus year chips on the home page. Pick 2024, 2025 or 2026 to load that year's 7 subjects and questions. Each year shows how many subjects you've tried and your average best score.
- **Deep links**: `#2025` opens a year; `#2024/punjabi` opens that quiz directly. The last year you picked is remembered.
- **2024 and 2025 data**: 7 subjects × 20 Part-I MCQs per year (English Vocabulary, Pakistan Affairs, Current Affairs, Islamiyat, Criminology, Gender Studies, Punjabi), 21 subject-year sets in total.
- Gap notice in the sidebar, home-page help text and footer: Part-I MCQs for 2006–2023 aren't on the free source.
- Optional Noto Nastaliq Urdu web font for Punjabi. Offline, the site falls back to system Urdu/Arabic fonts.

### Changed
- Data now lives in `data/<year>/<subject>.json`, with `data/catalog.json` (replaces `data/subjects.json`). `rebuild-data.py` bundles every year into `js/quiz-data.js` and checks each question's shape, so the site still works by double-clicking `index.html`.
- Scores are saved separately for each year in localStorage (`cssMcq<year>.scores.v1`). 2026 keeps its original key `cssMcq2026.scores.v1`, so existing progress is kept.
- "Reset scores" now clears only the selected year.
- Punjabi question cards and review items now set `dir="rtl"` and `lang="pnb"`. The RTL styling now also covers review explanations.
- Subject cards and quiz headers show a year badge.

### Known gaps
- **2016–2023:** the paper PDFs on cssaspirants.pk carry Part-II (subjective) only. The Part-I MCQ sheets weren't published.
- **2006–2015:** these papers aren't on cssaspirants.pk.
- **Answer keys are practice keys, not official FPSC keys.** Low-confidence keys are explained in each question's `explanation`. Punjabi 2024/2025 were transcribed from scans, so wording and keys are best-effort (10 and 12 keys flagged).
- "English Vocabulary" means English Precis & Composition Part-I (Persian isn't included).
- The old flat URLs `data/<subject>.json` are gone. They moved to `data/2026/<subject>.json`.
