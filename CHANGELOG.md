# Changelog

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
