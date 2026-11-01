# Changelog

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
