CSS Practice — Part-I MCQs (2024–2026) + Part-II past papers (2016–2026)
=========================================================================

HOW TO OPEN
  Just double-click  index.html  — it opens in your browser and works offline.
  (No internet, no install, no server needed.)

TWO MODES (switch at the top of the left sidebar)
  * OBJECTIVE  = the MCQ quiz described below (2024, 2025, 2026).
  * SUBJECTIVE = past papers. A second sidebar lists 7 subjects. Pick one to see a card for each year
    from 2026 back to 2016. Click a year card to view that paper's PDF, open it in a new tab, or
    download it.
    Links: index.html#subjective/criminology  and  index.html#subjective/criminology/2023
    The PDFs are in papers/<subject>/<year>.pdf. The list of papers is in data/subjective-catalog.json.
    After editing that list, run  python rebuild-data.py.
    The source (cssaspirants.pk) has no papers before 2016. The 2016–2023 papers have Part-II only.

HOW IT WORKS (Objective)
  * Pick an exam YEAR (2024, 2025, 2026) from the timeline in the left sidebar (top strip on phones)
    or the year chips on the home page. The home page then shows that year's 7 subject cards.
    Pick ONE subject; you only get that subject's 20 MCQs.
  * Links: index.html#2025 opens 2025; index.html#2024/punjabi opens that quiz directly.
  * Click an option:
      - Correct  -> the option turns GREEN with a green bar + "Correct" toast.
      - Wrong    -> your choice turns RED, and the correct option is shown in GREEN.
    After answering, that question is locked. Press "Next" to continue.
  * Keyboard: A-D or 1-4 to answer, Enter / Right arrow for next, Left arrow to go back.
  * The numbered squares at the top show progress (green = right, red = wrong); click one to jump.
  * At the end you get your score (X/20 and %), a list of the questions you got wrong
    with the correct answers, and buttons to Retry or go Back to subjects.
  * Your BEST score per subject is saved in this browser (localStorage), separately for each
    year, and shown on the home cards and sidebar. "Reset scores" (top right) clears the
    selected year only.

ANSWER KEYS
  These are PRACTICE keys prepared for revision — NOT official FPSC keys.
  Punjabi (all years) and Current Affairs 2026 came from scans; treat their keys as best-effort.
  Part-I MCQs for 2016–2023 aren't published on the free source (cssaspirants.pk); 2006–2015
  aren't on it at all. So only 2024–2026 are included.

FIXING AN ANSWER / EDITING DATA
  data/<year>/<subject>.json are the source files, plus data/catalog.json (years, subject order, icons).
  To add a year: drop its JSON files into data/<year>/ and add the year to data/catalog.json.
  After editing a JSON file, run:   python rebuild-data.py
  That regenerates js/quiz-data.js, which is what index.html actually loads
  (bundled this way so double-clicking works without a web server).
