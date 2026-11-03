// PMS past papers from Punjab Public Service Commission (PPSC)
// Source: https://www.ppsc.gop.pk/PMSPastPapers.aspx
window.PMS_DATA = {
  "exam": "PMS",
  "examName": "Provincial Management Service (Punjab)",
  "source": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
  "checkedAt": "2026-11-03",
  "note": "PMS past papers from Punjab Public Service Commission (PPSC). English (Precis, Comprehension & Translation) for years published on the official past-papers page.",
  "subjects": [
    {
      "id": "english-precis-comprehension-translation",
      "name": "English (Precis, Comprehension & Translation)",
      "shortName": "English Precis",
      "icon": "📖",
      "hub": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
      "papers": [
        {
          "year": 2024,
          "title": "PMS 2024 English (Precis, Comprehension & Translation)",
          "pdfPath": "papers/pms/english-precis-comprehension-translation/2024.pdf",
          "sourceUrl": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
          "pages": null,
          "sizeKB": 2772
        },
        {
          "year": 2023,
          "title": "PMS 2023 English (Precis, Comprehension & Translation)",
          "pdfPath": "papers/pms/english-precis-comprehension-translation/2023.pdf",
          "sourceUrl": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
          "pages": null,
          "sizeKB": 1839
        },
        {
          "year": 2022,
          "title": "PMS 2022 English (Precis, Comprehension & Translation)",
          "pdfPath": "papers/pms/english-precis-comprehension-translation/2022.pdf",
          "sourceUrl": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
          "pages": null,
          "sizeKB": 2554
        },
        {
          "year": 2020,
          "title": "PMS 2020 English (Precis, Comprehension & Translation)",
          "pdfPath": "papers/pms/english-precis-comprehension-translation/2020.pdf",
          "sourceUrl": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
          "pages": null,
          "sizeKB": 1043
        },
        {
          "year": 2019,
          "title": "PMS 2019 English (Precis, Comprehension & Translation)",
          "pdfPath": "papers/pms/english-precis-comprehension-translation/2019.pdf",
          "sourceUrl": "https://www.ppsc.gop.pk/PMSPastPapers.aspx",
          "pages": null,
          "sizeKB": 1561
        }
      ]
    }
  ],
  "years": [2024, 2023, 2022, 2020, 2019],
  "gaps": [
    {
      "range": "2021",
      "note": "No 2021 paper listed on ppsc.gop.pk."
    }
  ]
};

// Build lookup map for quick access
(function() {
  const PD = window.PMS_DATA;
  if (!PD) return;
  PD.byId = {};
  PD.subjects.forEach(s => {
    PD.byId[s.id] = s;
  });
})();
