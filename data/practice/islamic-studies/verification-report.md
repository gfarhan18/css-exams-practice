# Verification report: Islamic Studies practice bank

- **File:** `/workspace/css-mcqs-2026/extracted/islamic-bank/islamic-studies-practice.json`
- **Total MCQs:** 676 (questions 1–248 are real CSS Part-I MCQs from 2005–2023 in year order; questions 249–676 are topic-wise CSS/FPSC-style MCQs grouped by topic)
- **Schema:** same as the yearly files (`id`, `name`, `title`, `subtitle`, `year: null`, `rtl`, `answerKeyNote`, `source` [array], `questions[]` with `id`/`text`/`options A–D`/`answer`/`explanation`). Two extra fields: top-level `bank: "practice"`, and per-question `section` (e.g. `"Seerah · CSS 2015"`), which `js/app.js` already shows as a `section-tag`.
- **Split files:** `by-topic/*.json` (10 topics, same schema).
- **Checks run:** every item has exactly 4 non-empty options A–D, an answer in A–D, and an explanation. IDs run 1..N. The JSON parses. Answer spread: A/B/C/D = see below.

## Method
1. Parsed every CSS year page on cssprep.com.pk (2005–2023) and all 78 Islamiat chapter pages on pakjobmcqs.com into a structured form (stem, options, key, explanation). That gave 1068 items after removing exact duplicates.
2. Read every item by hand, with the key checked against the Quran, Hadith, standard Seerah and history references. The 2005–2016 CSS keys were also compared with the CSS Times solved compilation (a second source).
3. Fixed keys only where the correct answer was clear and was one of the four options. Dropped items that were ambiguous (two defensible answers), disputed with no clear resolution, garbled, trivial or unverifiable (e.g. "how many books in Baghdad"), off-syllabus (Hajj camp rules, TV dramas), or near-duplicates.
4. Explanations: source notes for each item, explanations kept from the source where they exist, and correction or low-confidence notes added.

## Removed items
- Near-duplicates removed: 123
- Dropped for quality/correctness: 269

## Keys corrected (12)
| Bank Q# | Question | Key | Why |
|---|---|---|---|
| 8 | Amount of zakat cannot be used in _____ . | D → B | Fixed: the classic CSS key (also CSS Times 2005 compilation) is "Mosque"; Zakat requires tamleek (transfer of ownership to an eligible person), so it cannot fund mosque construction. Original options vary between sources. |
| 97 | 9th Zil-Hajj is also called ________. | B → A | Fixed: 9 Dhul-Hijjah is called Yawm-e-Arafah (Day of Arafah); "Wuquf-e-Arafat" is the rite performed on that day, not the name of the day. |
| 229 | Hazrat Aisha (R.A) lived after the death of Prophet Muhammad for how many years? | C → D | Fixed: the Prophet (PBUH) died in 11 AH and Hazrat Aisha (RA) died in 57/58 AH, i.e. about 46–47 years later, so none of 28/45/44 is right. |
| 561 | The Battle of Yarmouk was a significant conflict fought between Muslims and which empire? | B → C | Fixed: Yarmouk (15 AH / 636 AD) was fought against the Byzantine (Eastern Roman) Empire under Heraclius; "Byzantine" is the precise option. |
| 388 | Before his passing, the Prophet Muhammad (PBUH) advised kind treatment towards which group? | B → A | Fixed: in his final illness the Prophet (PBUH) urged the Muhajireen to treat the Ansar kindly (Sahih al-Bukhari, Manaqib al-Ansar). |
| 456 | In which Nabvi year did the first migration to Habsha (Abyssinia) take place? | B → C | Fixed: the first migration to Abyssinia took place in Rajab of the 5th year of Prophethood (615 AD). |
| 465 | Who led the last Sariya (military expedition) during the lifetime of the Prophet Muhammad (PBUH)? | B → A | Fixed: the last expedition dispatched by the Prophet (PBUH) was the army of Usama bin Zaid (RA) towards Syria; it set out after his passing under Hazrat Abu Bakr (RA). |
| 626 | What is the share of a husband in inheritance if there are no entitled descendants (children/grandchildren)? | D → A | Fixed: Surah An-Nisa 4:12 — the husband gets 1/2 if the wife leaves no children, and 1/4 if she does. |
| 473 | Who wrote an 'Essay on life of Hazrat Muhammad (peace be upon him)'? | D → A | Fixed: Sir Syed Ahmad Khan wrote "A Series of Essays on the Life of Mohammed" (1870) in reply to William Muir. |
| 474 | Who wrote the first book on Seerah Rasool Ullah? | D → B | Fixed: Muhammad ibn Ishaq (d. 150/151 AH) wrote the first comprehensive Seerah; Ibn Hisham later edited/abridged it. |
| 583 | The book Khutbat-e-Ahmadiya is written by? | C → B | Fixed: "Khutbat-e-Ahmadiya" (1870) is by Sir Syed Ahmad Khan, the Urdu version of his essays on the life of the Prophet (PBUH). |
| 597 | How many Umayyad caliphs were there? | C → B | Fixed: the Umayyad dynasty of Damascus had 14 caliphs (Muawiya I to Marwan II), 661–750 AD. |

## Flagged low-confidence keys (10)
Kept because they are frequently asked in CSS and the given key is the accepted CSS answer, but sources differ. Each one says "Low confidence" in its explanation.

| Bank Q# | Question | Note |
|---|---|---|
| 8 | Amount of zakat cannot be used in ___ (CSS 2005) | Key changed from D to B (Mosque), following the original paper and CSS Times. Under strict tamleek, "All of these" is also arguable. |
| 27 | Imam Shafi took the office of “Religious Judgment” in the age of _____. | Low confidence: biographies say Imam Shafi'i was allowed to give fatwa at about 15 years old. |
| 43 | First Mujadid was Hazrat Umar bin Abdul Aziz. Who was the second one? | Low confidence: the "second Mujaddid" (2nd Hijri century) is usually given as Imam al-Shafi'i; the CSS Times compilation gave Ahmad Sirhindi, who is "Mujaddid Alf-e-Sani" (renewer of the 2nd millennium), a different idea. |
| 91 | Hazrat Muhammad (PBUH) was born about three thousands years, after ________. | Low confidence: the gap between Ibrahim (AS) and the Prophet (PBUH) is often given as about 2,500–3,000 years; B is the intended answer. |
| 167 | There are _____ clauses in Charter of Madina. | Low confidence: the number of clauses depends on how the text is split (Dr. Hamidullah 52/53; many CSS keys say 47). |
| 235 | House of Wisdom (Bayt-ul-Hikmah) was established by? | Low confidence: Bayt al-Hikmah began under Harun al-Rashid and was greatly expanded by al-Ma'mun; keys differ. |
| 356 | During the formation of the Brotherhood Pact in Yathrib, how many Muhajreen were there? | Low confidence: Mawakhat paired about 45 Muhajireen with 45 Ansar (90 people), per Ibn Sa'd. |
| 362 | How many months after the migration to Madinah was the Brotherhood Pact (Mawakhat) established? | Low confidence: the time after Hijrah given for Mawakhat varies by source (about 5–8 months). |
| 395 | Who was the first to raise the flag in a Ghazwa for the Muslims? | Low confidence: Hazrat Hamza (RA) carried the first banner, on the Sif al-Bahr expedition (1 AH). Some sources say Ubaidah bin Harith (RA). |
| 458 | In which Islamic month did the emigrants return from Abyssinia (Habsha)? | Low confidence: the migrants are reported to have returned in Shawwal of the 5th Nabawi year. |

## Items with an added clarifying note (17)
- Q1: Who collected Quranic verses in one place?
- Q57: Sadaq-e-Eid-ul-fitr has been proclaimed in the year _________.
- Q78: Splitting of the moon occurred in ________.
- Q209: When Hajj was made compulsory?
- Q214: How many times Holy Prophet (PBUH) paid zakat in his lifetime?
- Q257: Who was responsible for introducing punctuation marks in the written text of the Holy Quran?
- Q281: The year 206 AH is the birth year of which person?
- Q288: What is said to be the first meal served in Jannah according to Islamic tradition?
- Q335: How far must a Muslim travel to perform Qasr prayer according to Islamic jurisprudence?
- Q341: According to the Hadith, what is considered the Zakat of the body?
- Q420: How many Muslim soldiers were martyred in the Battle of Mauta?
- Q435: In which year did Prophet Muhammad (PBUH) send letters to various kings inviting them to Islam?
- Q449: On which date is Shab-e-Mairaj observed in the Islamic calendar?
- Q524: How many sons did Prophet Muhammad ﷺ have with his first wife, Hazrat Khadija (RA)?
- Q525: The title 'Maseeh ul Islam' is associated with which Companion of the Prophet Muhammad (PBUH)?
- Q560: Which Caliph established the institution of Bait Ul Mal for the welfare of the Islamic state?
- Q665: How many gods are there in Zoroastrianism?

## Answer distribution
{'D': 133, 'C': 175, 'B': 179, 'A': 189}

## Notable dropped items and why (sample of the reasons)
- CSS 2007/2018 "first writer of Wahi in Quraish": the two papers' keys contradict each other and the site changed the options.
- CSS 2008 "law of inheritance revealed": 3 AH and 4 AH are both cited.
- CSS 2009 "custodian of Bait-ul-Mal under Umar": the paper key was "None (Abdullah bin Masud)", but option A, Abdullah bin Arqam, was also Umar's treasurer.
- CSS 2011 "Sahabi who died in the Prophet's hands at Uhud": the site's key (Hamza) is wrong, and the original key was "None of these".
- CSS 2012 "zakat revealed in 9 AH": conflicts with the standard view that it became obligatory in 2 AH.
- CSS 2017 and 2023 Hajjat-ul-Wida pilgrim count: one key says 124,000 and the other 130,000.
- CSS 2017 "law of refraction", "Imam Malik = Mujtahid-e-Mutlaq", "combined prayers at Khandaq": unverifiable or disputed.
- CSS 2023 "Jizya imposed in 8 AH": the Jizya verse (9:29) is dated 9 AH.
- pakjobmcqs: Muhammad bin Maslamah "martyred at Khyber" (it was his brother Mahmud); Mu'tah "in Taif" (it is in Jordan); "Treaty of Sevres abolished the Ottoman Empire" (it was Lausanne); "last prayer led was Asr" (it was Maghrib); first Abyssinia return; Li'an "80 lashes" (Li'an leads to separation, not lashes); pre-Islamic widow mourning; Quba "15 km"; and similar.

## Full list of dropped (non-duplicate) items
- uid 28: Who was the first writer of “Wahi” in Quraish? (CSS 2007)
- uid 33: When law of inheritence was revealed? (CSS 2008)
- uid 53: Hazrat Umer (RA) appointed ___________ as custodian of Bait-ul-Mal.
- uid 59: River Neil was declared as Sayed-ul-Anhar by Hazrat ____________.
- uid 96: Which Sahabi was died in the hands of the Holy Prophet (PBUH) in the battle of Uhad?
- uid 102: Which country is known as the “Land of Prophets”?
- uid 107: The duration of third period of the compilation of Hadith is ________.
- uid 116: In which hijri the order of zakat was revealed?
- uid 158: By Ma Abudtum متدبعام Quran refers to _______.
- uid 159: By Ara’ayta تيارا Quran refers to ________.
- uid 160: By Tazleel ليلضت Quran refers to _________.
- uid 161: By ميظع نتيرق Quran refers to __________.
- uid 175: The literal meaning of “Wahi” is ___________.
- uid 184: Book Maliat Ka Islami Nizam written by ___________.
- uid 195: In Ghuzwa-e-Khandaq, the Holy Prophet PBUH offered the Nimaz of two times combinedly which are _____ and _______.
- uid 200: The title given to Imam Malik is _________.
- uid 204: How many people were present at the last sermon of Holy Prophet PBUH?
- uid 205: Law of refraction was given by ________.
- uid 217: Hijrat of the Holy Prophet (SAW) is mentioned in Surah __________.
- uid 218: Masjid Quba is _____ away from Madina.
- uid 228: Who was the first writer of “Wahi” in Quraish?
- uid 264: Prophet (PBUH) ordered the invasion of the tribe _______.
- uid 276: Ijma of one place followed by people of other place is called ____________.
- uid 287: How many times the word "Mubeen" is repeated in Surah Yasin?
- uid 302: To whom did Hazrat Muhammad (PBUH) write a letter in Syria?
- uid 309: Pilgrims with Holy Prophet (SAW) on Hajj al-Wida?
- uid 310: Jizya was imposed in the Islamic state by the Holy Prophet (PBUH) in the year of Hijra?
- uid 317: The book Insan-e-Kamil is written by?
- uid 323: What was the first capital of the Abbasid Caliphate?
- uid 329: Approximately how many books did Baghdad boast during the flourishing period under Haroon-ul-Rasheed?
- uid 334: Who was the only person born inside the Kaaba?
- uid 336: In which Islamic month did Hazrat Fatimah (R.A.) pass away?
- uid 337: What was the honorary title given to Hazrat Ali (RA) by the Holy Prophet (PBUH)?
- uid 343: What does the title "Murtaza" signify, which is associated with Imam Ali (AS) and the Holy Prophet (PBUH)?
- uid 345: What event will occur after the first blowing of the trumpet by Israfil (علیہ السلام)?
- uid 346: What is the literal meaning of the term 'Akhirah' in Islamic terminology?
- uid 350: Who is the first angel to be questioned on the Day of Qiyamat according to Islamic tradition?
- uid 351: What type of deeds are rewarded with Jannat according to Islamic beliefs?
- uid 352: Who will be the first person questioned on the Day of Qiyamat?
- uid 353: On the Day of Judgment, how will humans move around according to Islamic teachings?
- uid 356: What type of soil was commonly found in the Arabian Peninsula before Islam?
- uid 363: Before the advent of Islam, what was the mourning period for widows among Arabs?
- uid 365: What honorary title was given to Hazrat Talha (R.A) for his role among the Ansar?
- uid 366: Who led the funeral prayer for Hazrat Abdul Rahman bin Auf (R.A.)?
- uid 373: Who was the mother of Hazrat Talha (R.A)?
- uid 374: How many times did the event of Shaq-e-Sadr occur in the life of the Holy Prophet (SAW)?
- uid 375: In whose house was the Holy Prophet (PBUH) born?
- uid 387: How did the Holy Prophet (PBUH) assist his companions who were in debt?
- uid 399: Who was the first major false claimant to Prophethood in Islam?
- uid 401: Humama bin Kharsha was a disciple of which prominent Islamic figure?
- uid 402: Who falsely claimed prophethood during the caliphate of Hazrat Abu Bakar Siddique (R.A.)?
- uid 405: Who is considered the savior of Islam due to his leadership and support during the early caliphate?
- uid 414: In which year was Hazrat Ali (A.S) first given the title of Imam?
- uid 415: How many days after being wounded did Hazrat Ali (RA) pass away?
- uid 421: What was the total area of Hazrat Umer's (RA) caliphate?
- uid 422: Who abolished the Zakat on horses during the early Islamic period?
- uid 425: In which year of Hijri did the Battle of Yarmuk occur?
- uid 426: Which Caliph requested to be buried near the feet of Prophet Muhammad (PBUH)?
- uid 428: In which Hijri year was Cyprus conquered by the Muslims?
- uid 435: During whose caliphate was the city of Tripoli conquered?
- uid 438: During which prayer did the change of Qibla occur?
- uid 439: How many months after the Hijrah did the change of Qibla occur in Madina?
- uid 441: In which Islamic month was the Qibla direction changed from Al-Aqsa mosque to Masjid-e-Haram?
- uid 445: Who led the congregation when the Qiblah was changed at Masjid al-Qiblatayn?
- uid 447: Where was the command to change the Qibla received?
- uid 451: Who were the parties involved in the signing of the Meesaq-e-Madina?
- uid 454: The Meesaq-e-Madina was an agreement signed between Muslims and which group in Madina?
- uid 469: In the Injeel, Prophet Muhammad (P.B.U.H.) is referred to as 'Farqaleet'. What does 'Farqaleet' mean?
- uid 470: How many parts does the famous work 'Summa Theologica' by St. Thomas Aquinas contain?
- uid 481: In Sikh teachings, as mentioned in the Gurbani of Guru Nanak, what is the real name given to the supernatural being?
- uid 484: In which religious text of a non-Muslim community is the Quran mentioned multiple times?
- uid 492: What is Bab-ul-Fatah also known as?
- uid 495: Who was the first woman to embrace Islam after Hazrat Khadija (RA)?
- uid 505: Muslim thinkers categorize economy as what type of economy?
- uid 507: Why did the Prophet (PBUH) express disapproval toward a high dome constructed by a companion?
- uid 511: Which major financial practice was prohibited in the same year Hajj was made obligatory?
- uid 523: What honorary title was given to Imam Malik for his contributions to Islamic jurisprudence?
- uid 526: How long did it take to complete Tafsir al-Tabari?
- uid 527: What is the process of interpreting the Quran by using the Quran itself known as?
- uid 528: What should the interpretation (Tafseer) of the Quran begin with?
- uid 540: Who delivered the sermon at the Farewell Pilgrimage (Hajjatul Wida)?
- uid 543: How did Prophet Muhammad (PBUH) often begin his sermons to make them more impactful?
- uid 549: Where is the famous Friday Mosque located?
- uid 550: The Fatimid Caliphate was established in which country?
- uid 552: Fatimid caliphate was established in _?
- uid 553: What was the first Islamic month in Iran before the revolution?
- uid 555: Which of the following is a famous work by Abu Jafar Tusi?
- uid 556: Which is the most authentic book of Fiqh according to the Jafari school of thought?
- uid 558: What is referred to by the term 'Usul al-Arba'a' in Islamic literature?
- uid 559: What is Asul Arba a collection of in Islamic jurisprudence?
- uid 567: Who was the commander of the Muslim forces in the Battle of Badr?
- uid 568: How many Muhajirun were there in the Battle of Badr?
- uid 577: What was the outcome of the Battle of Hunain?
- uid 581: In which battle did the Prophet Muhammad (SAW) appoint three generals to lead the Muslim army?
- uid 584: How long did the siege of Madina last during the Battle of the Trench?
- uid 588: How many horses did the anti-Muslim allies have during the Battle of the Trench?
- uid 592: What was the outcome for Hazrat Muhammad bin Muslimah (RA) during the battle at the fort of Naim?
- uid 594: Who killed the Jew spy that tried to get secret information from Fort Fareh-Yatum?
- uid 600: How many days did the siege of the main fort Qamoos last before it was captured?
- uid 605: Who sent an ambassador to the ruler of Busra before the Battle of Muta?
- uid 610: Which tribes embraced Islam following the Battle of Mota?
- uid 611: Where did the Ghazwa Mota take place?
- uid 613: How did Muslim women contribute during the Battle of Tabuk?
- uid 614: What was the primary objective of the Expedition of Usra led by Prophet Muhammad (SAW)?
- uid 617: Who was the commander of the Muslim forces during the Battle of Tabook?
- uid 625: Who fought and killed Talha bin Abi Talha in the first fight of the Battle of Uhud?
- uid 630: Who among the following defended the Holy Prophet (PBUH) during the Battle of Uhud?
- uid 631: In which Hijrah year were the battles of Ghazwat Salim, Banu Nuzair, Uhad, Hamra-al-Asad, and Ghatfan fought?
- uid 632: Who is the author of 'Qawaid al-Tahdith'?
- uid 638: What is the second kind of hadith known as?
- uid 639: Which Islamic scholar is referred to as Mutfqa Alea in Islamic literature?
- uid 640: What is the term used for a Hadith that is narrated by various people, but one narrator stands out due to higher credibility?
- uid 645: What is the rule for entering the Hujjaj room after 9 PM during Hajj?
- uid 646: How many obligatory acts (Wajibat) are there in Hajj according to Islamic teachings?
- uid 647: Which Kalimah is traditionally recited by pilgrims during the Hajj on their way to Mina?
- uid 651: Which type of Tawaf is also known as Tawaf-e-Ziyarat during the Hajj pilgrimage?
- uid 653: In Hinduism, what is the significance of a ceremonial bath?
- uid 654: Which religion is considered the oldest among the divine religions on earth?
- uid 657: Who was the first Hafiz of the Holy Quran?
- uid 660: Who was the last person to compile the revelations of the Quran known as Kitab-e-Wahi?
- uid 661: How many Huffaz were there at the time of the Prophet Muhammad's ﷺ passing?
- uid 662: In which year was the Quran first transcribed in the Kufic script?
- uid 663: How many Ansari companions were part of the committee for the compilation of the Quran?
- uid 664: What is the third period in the history of Hadith commonly known as?
- uid 665: Who was the first scribe of the Wahi (revelation) during the Prophet's time?
- uid 667: Who is noted for praising the efforts of Muslims in preserving Ahadith?
- uid 669: Who admired the Muslim efforts for saving Ahadith?
- uid 670: What is the meaning of the Hadith 'Do not count your wealth, lest Allah counts it for you' in Islamic teachings?
- uid 671: What are the actions, sayings, and approvals of the Prophet Muhammad (PBUH) collectively known as?
- uid 674: How many ahadith are included in Sunan al-Kubra?
- uid 677: What is necessary for reciting the Holy Quran?
- uid 679: What was the initial form of revelation received by the Prophet Muhammad (PBUH) for the Holy Quran?
- uid 681: What is the function of the letter 'Baa' in the Arabic phrase 'Bismillah'?
- uid 687: Which country's legal system is often regarded as having harsh punishments, particularly for crimes like theft and adultery?
- uid 691: From which root word is the term 'Tazir' derived in Islamic law?
- uid 693: What is the prescribed Islamic penalty for the act of 'Li'an' according to Islamic law?
- uid 696: Ethics that deals with 'Ethical Action' is referred to as what?
- uid 697: Which principle is highlighted by the saying 'Thou shall not kill'?
- uid 699: What does the virtue of 'Good character' denote in Islamic teachings?
- uid 700: What action best represents the principle of ethical responsibility in Islam?
- uid 705: What is considered essential for achieving the highest good and common good in Islamic teachings?
- uid 706: What is the opposite of 'Shar' in Islamic terminology?
- uid 708: What is the meaning of the term 'ihtamalu' in Islamic context?
- uid 709: In Islamic jurisprudence, what is the term for a justifiable claim or entitlement?
- uid 710: Which term in Islam refers to the concept of the 'Seven Internal Organs' as mentioned in the Quran?
- uid 711: In the context of Arabic grammar, the sentence 'Muhammad Rasool Ullah' is classified as which type of sentence?
- uid 712: What is the meaning of the Arabic word 'ar-Rakb'?
- uid 713: In Arabic grammar, which form is 'i'tasimū' considered to be?
- uid 714: Which term in Islamic philosophy refers to the potential of a sensation to lead to similar future sensations?
- uid 718: To whom is the booty (Ghanimah) mainly entitled in Islamic teachings?
- uid 720: What did Allah promise to do to the hearts of the infidels according to Islamic teachings?
- uid 722: According to the Quran, what is the primary purpose of fighting (Qital)?
- uid 723: What is the true purpose of Jihad in Islam?
- uid 724: Which form of Jihad is considered superior to all others in Islamic teachings?
- uid 725: How many times is the word 'jihad' mentioned in the Quran?
- uid 734: What do Jews traditionally do at the Western Wall in Jerusalem?
- uid 736: When is the Talab-e-Mowasibat performed in Islamic judicial proceedings?
- uid 737: According to Islamic judicial principles, what should be done with a complaint even if it's not relevant?
- uid 738: Which theory of justice emphasizes the principle of 'Kill the sin, not the sinner'?
- uid 739: Which theory of punishment is advocated by criminology as a means of transforming offenders into law-abiding citizens?
- uid 747: According to the Prophet Muhammad (PBUH), which act is considered the greatest deed?
- uid 749: Which Kalima is traditionally recited during a funeral in Islamic tradition?
- uid 751: How many kings embraced Islam after receiving letters from the Holy Prophet (PBUH)?
- uid 756: Which ruler embraced Islam in response to the invitation of Prophet Muhammad (PBUH)?
- uid 760: Which Prophet expressed the wish to be part of the Ummah of Prophet Muhammad (PBUH)?
- uid 769: On which date did the event of Mairaj take place?
- uid 772: Who was appointed as the first teacher in Madina after the Prophet's migration?
- uid 773: What significant event in the life of Prophet Muhammad ﷺ occurred on 24th September 622 AD?
- uid 774: How far is Masjid-e-Quba from Madina?
- uid 775: When did the Friday prayer become obligatory for Muslims?
- uid 778: In which city did Salat-e-Juma become obligatory for Muslims?
- uid 787: Who was appointed as the leader of the first migration to Abyssinia?
- uid 788: Who was responsible for Najashi embracing Islam?
- uid 791: How many wars in total were held during the life of Prophet Muhammad (PBUH) after the announcement of Prophethood?
- uid 792: How many battles (Ghazwat) mentioned in the Holy Quran did the Prophet Muhammad (PBUH) participate in?
- uid 793: Who was appointed as the first commander of the Islamic Army?
- uid 795: How many Ghazwat were fought by Muslims during the month of Ramadan?
- uid 796: Who led the first Sariya expedition in Islamic history?
- uid 798: In which Ghazwa were the tribes Bani Salba and Bani Muharba involved?
- uid 802: What is the name of Muslim Scientist who presented the concept of blood pressure?
- uid 804: When was Rabia Basri (RB) born?
- uid 805: Faisal Masjid was constructed in 1986. When was the first prayer held there?
- uid 806: What is the name of the Muslim scientist who presented the concept of blood pressure?
- uid 813: Which right is inherently linked to the right of contract in Islamic jurisprudence?
- uid 815: Under Islamic law, a marriage is automatically dissolved when either the husband or the wife becomes what?
- uid 816: According to Muslim personal law, what is the legal age for marriage for males and females respectively?
- uid 817: In Islamic law, what is the status of a gift made to an unborn person?
- uid 818: To what extent are heirs responsible for the debts of the deceased in Islamic law?
- uid 821: Which month is traditionally known as the favorite month of the Prophet Muhammad ﷺ?
- uid 824: What was the original color of the dome of the Holy Prophet Muhammad's (PBUH) mosque in Madina?
- uid 827: In which Hijri year was wine declared Haram in Islam?
- uid 828: In which year was the commandment of Hijab revealed to the Muslim women?
- uid 829: Which was the last prayer led by the Holy Prophet (PBUH) before his passing?
- uid 832: What is the alternative name for Jabal Malaikah in Islamic tradition?
- uid 836: Who is the author of 'Seerat-ul-Nabi'?
- uid 852: Who said Sheikh Ahmad Sirhindi is the spiritual leader of Muslims?
- uid 855: Risala Roohi Sharif written by?
- uid 864: Which treaty abolished the Ottoman Empire?
- uid 868: The historical Turkish dramas 'Dirilis: Ertugrul' and 'Kuruluş: Osman' are set in which century?
- uid 869: What was the duration of the Ottoman Caliphate?
- uid 873: Who led the first Friday prayer (Jummah) as Imam before the migration (Hijrah)?
- uid 880: Who is the Current Secretary General of OIC?
- uid 881: The book "Western Dominance and Political Islam: Challenge and Response" is written by _?
- uid 882: For how many years are the Chairman and its members elected in the Islamic political system?
- uid 883: How many female representatives are there in a Local Committee according to the Islamic political system?
- uid 884: Who is the renowned Islamic scholar known for his contributions to the principles of Islamic governance?
- uid 885: Which category of rights is considered foundational, as other rights are dependent upon them?
- uid 886: Which principle serves as the foundation of Islamic democracy?
- uid 887: What rights are non-Muslim minorities granted in an Islamic state according to Islamic teachings?
- uid 888: In Islamic governance, what does legislation primarily refer to?
- uid 894: In which year was the famous Arab poet Hassan bin Thabit born in Yathrib?
- uid 895: What was the age of Hazrat Ali (R.A) when he accepted Islam?
- uid 898: Who was the first Muslim to lose one of his eyes in the path of Allah?
- uid 899: What was the first prayer for which Hazrat Bilal called the Azan?
- uid 900: What does the term 'Fatrat al-Wahi' refer to in Islamic history?
- uid 901: Where is Jabal-e-Noor, the mountain associated with the first revelation to Prophet Muhammad (PBUH), located?
- uid 908: How far is Mount Jabal-e-Nour from Makkah?
- uid 909: What was the duration of the Makki period during the life of Prophet Muhammad (PBUH)?
- uid 910: What is the literal meaning of 'Nabi' in Islamic terminology?
- uid 912: Which prophet received the revelation of the Holy Quran?
- uid 914: To which Prophet does the Muslim Ummah belong according to Islamic tradition?
- uid 916: What action is most likely to earn Allah's love according to Islamic teachings?
- uid 917: How many forms of divine revelation (Wahi) are recognized in Islam?
- uid 918: What is the term used in Islamic belief for anyone claiming prophethood after Muhammad (PBUH)?
- uid 922: In which prayer is there a significant gap between the Azan and the Namaz time?
- uid 923: What are Wajib prayers referred to as?
- uid 927: What is the third type of prayer in Islam called?
- uid 928: Which Islamic worship necessitates the highest level of cleanliness before it can be performed?
- uid 935: What is the penalty for deliberately breaking a fast during the month of Ramadan according to Islamic teachings?
- uid 936: How many Muslims does Allah forgive every day at the time of Iftar during Ramadan?
- uid 950: Which companion of the Holy Prophet (PBUH) was responsible for the maintenance of his house?
- uid 952: Who was responsible for crafting the ring of Prophet Muhammad (PBUH)?
- uid 955: Which companion of the Holy Prophet Muhammad (S.A.W) was responsible for making his ring?
- uid 957: What were the names of the swords used by Hazrat Muhammad (PBUH)?
- uid 960: In which year of Hijri was Imam Al Nasai born?
- uid 968: What is the primary designation of Darul-ul-Aman?
- uid 970: Which aspect of Islamic teachings emphasizes maintaining the social order and avoiding chaos against the state?
- uid 972: What are duties considered as within a society?
- uid 973: What is the purpose of giving Mehr to a woman in Islam?
- uid 974: According to Islamic teachings, how are individuals regarded in terms of social status?
- uid 975: What is meant by the term 'Jalabib' in Islamic context?
- uid 977: What is considered the basic unit of society in Islamic teachings?
- uid 978: Which term refers to the phrase 'for the poor emigrants who were expelled from their homes' in Islamic studies?
- uid 979: According to Qiyas, which of the following can be analogized to alcohol due to similar effects?
- uid 985: What is the term for the consensus of Muslim scholars on a legal issue that is followed by others?
- uid 987: How many types of Ijma are recognized in Islamic jurisprudence?
- uid 990: What other title was Hazrat Zulkifl (علیہ السلام) known by?
- uid 992: Which prophet's wife did not accept the belief in Tauheed (Oneness of Allah)?
- uid 999: Which Surah of the Quran ends with a prayer?
- uid 1000: How many times does the word 'Islam' appear in the Holy Quran?
- uid 1003: What is the central theme of the Quranic Surah Al-Asr?
- uid 1006: The command to lower one's voice is a translation of which Quranic term?
- uid 1007: The first revelation of Surah Al-Qalam begins with which Arabic letter?
- uid 1010: What is the significance of the name Al Aleem in Islamic tradition?
- uid 1012: Which belief grants self-respect to mankind in Islam?
- uid 1014: What is the central theme emphasized in the Qur'an?
- uid 1015: Why did people begin to worship natural phenomena instead of following the fundamental teachings of their Creator?
- uid 1016: What is the first and foremost belief in Islam?
- uid 1017: Which concept embodies the idea of the unity of existence in Islamic theology, central to the doctrine of Tauheed?
- uid 1024: Bait-e-Rizwan, also known as Bait-e-Shajrah, took place under which type of tree in 6 AH?
- uid 1026: In the Treaty of Hudaybiyyah, who conceded most points in return for peace?
- uid 1032: Who was responsible for martyring Hazrat Hussain ibn Ali at Karbala?
- uid 1034: Who among the following is known as the 'Alexander of the Muslim World'?
- uid 1038: For whom did Prophet Muhammad ﷺ arrange education due to their exceptional intellectual abilities?
- uid 1042: When was Hazrat Maimuna bint al-Harith born?
- uid 1051: How many months after the incident of Shoib Abi Talib did Abu Talib pass away?
- uid 1057: What is Jannatul Mu'alla known as in Islamic history?
- uid 1062: To whom can Zakat money be rightfully given according to Islamic teachings?
- uid 1063: According to the Zakat and Usher Ordinance, which type of asset is exempted from Zakat?
