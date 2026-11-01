# Verification report — Pakistan Affairs practice bank

- **Output:** `pakistan-affairs-practice.json` (660 questions, valid JSON, same schema as the Islamic Studies bank). The bank is split by topic in `by-topic/` (8 files).
- **Topics:** Ancient & Muslim Rule (pre-1857) 45; Reform Movements & Pakistan Movement (1857–1947) 96; Partition & Early Years (1947–1958) 61; Constitution, Government & Political History 151; Geography, Water & Natural Resources 65; Economy, Industry & Infrastructure 29; Foreign Policy, Kashmir & International Relations 73; Culture, Literature, Sufis & National Symbols 140
- **Answer distribution:** {'A': 173, 'B': 198, 'C': 162, 'D': 127}

## Process
1. I parsed every item and kept only those with 4 options and a key.
2. I removed duplicates using fuzzy matching (similarity > 0.8) against the 60 questions in the existing 2024/2025/2026 yearly files, within cssprep, and between pakjobmcqs and cssprep. Repeats across years, such as the Day of Deliverance, Simla Deputation, Rawalpindi Conspiracy, Anjuman-i-Himayat-i-Islam, SCO and 18th Amendment dates, were also removed by hand.
3. I reviewed all 961 candidates (378 + 583) by hand. **I dropped 301 items** for these reasons:
   - The key was ambiguous or disputed, or two options were equally defensible.
   - The item depended on time (the "current" CJ, Speaker, ambassador, UNSG, CM) or used outdated economic figures.
   - The item was off-syllabus: public administration items in CSS 2023, the US Electoral College, Rumi and Omar Khayyam.
   - The item was garbled or trivial.
   - The obscure key could not be verified.
4. I corrected wrong keys and stems. Where a key was uncertain I kept the item and flagged it.

## Keys corrected (8)
- Q185: In which year were provincial elections held in East Pakistan? → **C. 1954**
- Q196: Redcliff award was given in which date and time? → **D. 17th August 1947 5:00 PM**
- Q297: How many general seats are there in the National Assembly of Pakistan? → **C. 266**
- Q348: When did Zulfiqar Ali Bhutto become the prime minister of Pakistan? → **B. 1973**
- Q444: What is Pakistan's largest stock exchange? → **D. Pakistan Stock Exchange**
- Q555: In which language did Amir Khusro primarily write his poetry? → **A. Persian**
- Q608: In which century did Moin Uddin Chishti settle in the Indian subcontinent? → **B. 12th-century**
- Q626: Mir Kalil Ur Rehman was the founder of ? → **B. Jang Group**

## Stems or options fixed (key unchanged)
- I replaced duplicated options with a new distractor in three items: the 1st April 1948 canal-water date, the 24 March 1946 Cabinet Mission date, and the Jamali PM item.
- I made five stems more precise:
  - "first Martial Law" now reads "first nationwide Martial Law (Oct 1958)", in two items.
  - "largest Agency in Northern Area" now reads "largest agency of former FATA".
  - Musharraf's "vote of no confidence" now reads "vote of confidence".
  - The Constitution Commission year is now 1960 (the source said 1962).
- Where a past-paper option leaked its answer, such as "None of these (Calcutta)" or "None of these (K.K. Aziz)", I removed the hint from the option and put it in the explanation.

## Flagged items ({len(low)})
Each of these explanations carries a note. "Low confidence" means the source key is plausible but obscure, or sources disagree. "Note" means the key is right but the stem has a known flaw, such as a wrong year in the original paper.
- Q1 (Ancient & Muslim Rule (pre-1857)): Excavations at Moen-jo-daro have revealed _________ in earthen vessels.
- Q3 (Ancient & Muslim Rule (pre-1857)): Clive in one of his Gazettes made it mandatory that no Muslim shall be given an employment higher than that of
- Q5 (Ancient & Muslim Rule (pre-1857)): Who became the first Sultan of newly established Muslim Sultanate of Delhi in 1207?
- Q15 (Ancient & Muslim Rule (pre-1857)): Which office held supreme judicial authority during Mughal rule?
- Q21 (Ancient & Muslim Rule (pre-1857)): Who called the 'spiritual guide' as shopkeepers?
- Q31 (Ancient & Muslim Rule (pre-1857)): Ahmad Shah Abdali launched his early invasions against __________.
- Q48 (Reform Movements & Pakistan Movement (1857–1947)): Nawab Sir Salimullah Khan was President of Bengal Musilm Leage in _____.
- Q52 (Reform Movements & Pakistan Movement (1857–1947)): Quaid-e-Azam said in an interview on any hope of India and Pakistan coming to a peaceful settlement provided t
- Q60 (Reform Movements & Pakistan Movement (1857–1947)): Who was first appointed Nazim of Nadva-ul-ulema in 1883?
- Q67 (Reform Movements & Pakistan Movement (1857–1947)): Anjuman-e-Islamia Punjab was founded for the renaissance of Islam in the year ______.
- Q80 (Reform Movements & Pakistan Movement (1857–1947)): When Nadva-tul-Ulema came into being?
- Q89 (Reform Movements & Pakistan Movement (1857–1947)): Which of the following was/were the drawback(s) of the government of Indian Act 1858?
- Q93 (Reform Movements & Pakistan Movement (1857–1947)): Who was appointed the first principal of Darul ulum Deoband?
- Q118 (Reform Movements & Pakistan Movement (1857–1947)): The first secretary of Khilafat Committee was ______________.
- Q143 (Partition & Early Years (1947–1958)): Radcliffe Commission submitted its formula for the division of India in to two countries to Lord Mountbatton o
- Q156 (Partition & Early Years (1947–1958)): Islamabad was declared capital of Pakistan in ______.
- Q169 (Partition & Early Years (1947–1958)): The Bogra formula which was presented on 7th Oct 1953, is also called ______________.
- Q176 (Partition & Early Years (1947–1958)): How many members were there in the First Constituent Assembly of Pakistan?
- Q177 (Partition & Early Years (1947–1958)): According to Article of the Constitution of Pakistan, steps shall be taken to enable the Muslims of Pakistan, 
- Q192 (Partition & Early Years (1947–1958)): What was the status of Bahawalpur immediately before the formation of One Unit in West Pakistan?
- Q220 (Constitution, Government & Political History): Friday was declared Official holiday in Pakistan on ______.
- Q254 (Constitution, Government & Political History): How was the representation from East and West Pakistan structured in the Constitution Commission of 1960?
- Q290 (Constitution, Government & Political History): According to 19th Amendment, the Judicial Commission shall comprise?
- Q354 (Geography, Water & Natural Resources): Kalabagh iron deposits are largest in Pakistan with an estimated reserve of _________.
- Q356 (Geography, Water & Natural Resources): The Hasni tribe is settled in __________.
- Q376 (Geography, Water & Natural Resources): Murree is situated in which mountainous range?
- Q393 (Geography, Water & Natural Resources): Gwadar remained under Oman's rule for years.
- Q407 (Geography, Water & Natural Resources): Which country has maximum glaciers other than polar glaciers?
- Q427 (Economy, Industry & Infrastructure): China Pakistan Economic Corridor will be fully operational by _?
- Q440 (Economy, Industry & Infrastructure): The first dry port in Pakistan was built in Lahore in _?
- Q447 (Economy, Industry & Infrastructure): What is the full name of Pakistan's own satellite PRSS?
- Q463 (Foreign Policy, Kashmir & International Relations): President Asif Zardari approved the transfer of Gwadar Port Operation to China from Singapore on __________.
- Q467 (Foreign Policy, Kashmir & International Relations): Pakistan to host the 19th SAARC summit in _______.
- Q505 (Foreign Policy, Kashmir & International Relations): The "Treaty of Rann of Kutch" was signed between India and Pakistan in which year?
- Q508 (Foreign Policy, Kashmir & International Relations): Who becomes first female ambassador of Pakistan to Iran?
- Q509 (Foreign Policy, Kashmir & International Relations): Which country gifted the silver railing erected on Quaid-e-Azam's Tomb?
- Q602 (Culture, Literature, Sufis & National Symbols): The Sindhi language is based on?
- Q604 (Culture, Literature, Sufis & National Symbols): First SOS village of Pakistan was?
- Q613 (Culture, Literature, Sufis & National Symbols): In which year was Nazia Hassan, the famous Pakistani singer, awarded the Pride of Performance medal?
- Q625 (Culture, Literature, Sufis & National Symbols): Name Pakistan's first Sikh female journalist who has been selected as one of the 100 most influential Sikh per
- Q660 (Culture, Literature, Sufis & National Symbols): Who built the shrine of Lal Shahbaz Qalandar at Sehwan, Sindh, and in which year?

## Caveats
- This is a practice key, not an official FPSC key. CSS past-paper keys are community solutions.
- Some past-paper stems keep their original wording or typos, so they match what candidates saw in the exam.
