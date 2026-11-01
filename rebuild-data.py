# After adding or editing any data/<year>/<subject>.json file (e.g. to fix an answer key),
# run  `python rebuild-data.py`  to refresh js/quiz-data.js (which index.html loads).
# Bundling into one JS file keeps the site working offline when index.html is double-clicked.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
cat = json.load(open(os.path.join(HERE, "data", "catalog.json"), encoding="utf-8"))
by_year, errors = {}, []
for year in cat["years"]:
    subjects, by_id = [], {}
    for meta in cat["subjects"]:
        rel = f"data/{year}/{meta['id']}.json"
        path = os.path.join(HERE, rel)
        if not os.path.exists(path):
            continue
        doc = json.load(open(path, encoding="utf-8"))
        for q in doc["questions"]:
            if q.get("answer") not in "ABCD" or len(q.get("answer", "")) != 1 or sorted(q.get("options", {})) != list("ABCD") or not q.get("text"):
                errors.append(f"{rel} Q{q.get('id')}: bad shape")
        doc["year"] = year
        by_id[meta["id"]] = doc
        subjects.append({
            "id": meta["id"], "title": doc["title"], "subtitle": doc.get("subtitle", ""),
            "icon": meta.get("icon", "📝"), "questionCount": len(doc["questions"]),
            "rtl": bool(doc.get("rtl")), "file": rel,
        })
    if subjects:
        by_year[str(year)] = {"subjects": subjects, "byId": by_id}
if errors:
    sys.exit("Data errors:\n" + "\n".join(errors))
years = [y for y in cat["years"] if str(y) in by_year]
out = {"years": years, "defaultYear": cat.get("defaultYear", years[0]), "gaps": cat.get("gaps", []),
       "source": cat.get("source", ""), "keyNote": cat.get("keyNote", ""), "byYear": by_year}
with open(os.path.join(HERE, "js", "quiz-data.js"), "w", encoding="utf-8") as f:
    f.write("// AUTO-GENERATED from data/catalog.json + data/<year>/*.json by rebuild-data.py — edit the JSON and re-run.\n")
    f.write("window.MCQ_DATA = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n")
print("quiz-data.js rebuilt:", {y: {s["id"]: s["questionCount"] for s in v["subjects"]} for y, v in by_year.items()})

# ---- Subjective (Part-II) past papers: data/subjective-catalog.json -> js/papers-data.js ----
pcat_path = os.path.join(HERE, "data", "subjective-catalog.json")
if os.path.exists(pcat_path):
    pcat = json.load(open(pcat_path, encoding="utf-8"))
    missing = [p["pdfPath"] for s in pcat["subjects"] for p in s["papers"] if not os.path.exists(os.path.join(HERE, p["pdfPath"]))]
    if missing:
        sys.exit("Missing paper PDFs:\n" + "\n".join(missing))
    with open(os.path.join(HERE, "js", "papers-data.js"), "w", encoding="utf-8") as f:
        f.write("// AUTO-GENERATED from data/subjective-catalog.json by rebuild-data.py — edit the JSON and re-run.\n")
        f.write("window.PAPERS_DATA = " + json.dumps(pcat, ensure_ascii=False, indent=1) + ";\n")
    print("papers-data.js rebuilt:", {s["id"]: len(s["papers"]) for s in pcat["subjects"]})

# ---- Practice banks: data/practice-catalog.json -> js/practice-data.js ----
# Questions are stored once per bank; packs (CSS-year packs, topic parts, mixed sets) are index lists into them.
import math, re
prcat_path = os.path.join(HERE, "data", "practice-catalog.json")
if os.path.exists(prcat_path):
    prcat = json.load(open(prcat_path, encoding="utf-8"))
    banks, perr = [], []
    def chunks(idx, size):
        n = max(1, math.ceil(len(idx) / size)); base, extra = divmod(len(idx), n); out, k = [], 0
        for i in range(n):
            m = base + (1 if i < extra else 0); out.append(idx[k:k + m]); k += m
        return out
    for b in prcat["banks"]:
        doc = json.load(open(os.path.join(HERE, b["file"]), encoding="utf-8"))
        qs = doc["questions"]
        for q in qs:
            if q.get("answer") not in list("ABCD") or sorted(q.get("options", {})) != list("ABCD") or not q.get("text") \
               or not all(str(v).strip() for v in q["options"].values()):
                perr.append(f"{b['file']} Q{q.get('id')}: bad shape")
        key = lambda q: json.dumps([q["text"], q["options"], q["answer"]], ensure_ascii=False)
        pos = {key(q): i for i, q in enumerate(qs)}
        packs = []
        # 1) real CSS papers: section tag ending "CSS <year>"
        by_year = {}
        for i, q in enumerate(qs):
            m = re.search(r"CSS (\d{4})\s*$", q.get("section", ""))
            if m: by_year.setdefault(int(m.group(1)), []).append(i)
        years = sorted(by_year, reverse=True)
        for y in years:
            packs.append({"id": f"css-{y}", "kind": "year", "group": str(y), "title": f"CSS {y} past-paper MCQs",
                          "label": str(y), "q": by_year[y]})
        # 2) topics, split into parts
        topics = []
        for t in b["topics"]:
            tdoc = json.load(open(os.path.join(HERE, t["file"]), encoding="utf-8"))
            idx = []
            for q in tdoc["questions"]:
                k = key(q)
                if k not in pos: perr.append(f"{t['file']} Q{q.get('id')}: not found in main bank")
                else: idx.append(pos[k])
            tname = tdoc["title"].split(":", 1)[-1].strip()
            parts = chunks(idx, b.get("partSize", 20))
            pids = []
            for n, part in enumerate(parts, 1):
                pid = f"{t['id']}-{n}"; pids.append(pid)
                packs.append({"id": pid, "kind": "topic", "group": t["id"],
                              "title": f"{tname}" + (f" · Part {n} of {len(parts)}" if len(parts) > 1 else ""),
                              "label": f"Part {n}", "q": part})
            topics.append({"id": t["id"], "name": tname, "icon": t.get("icon", "📝"), "count": len(idx), "packs": pids})
        # 3) mixed sets in bank order
        sets = chunks(list(range(len(qs))), b.get("setSize", 20))
        set_ids = []
        for n, part in enumerate(sets, 1):
            pid = f"set-{n}"; set_ids.append(pid)
            packs.append({"id": pid, "kind": "set", "group": "sets", "title": f"Mixed set {n} of {len(sets)}",
                          "label": f"Set {n}", "range": [part[0] + 1, part[-1] + 1], "q": part})
        covered = sorted({i for p in packs if p["kind"] == "topic" for i in p["q"]})
        if covered != list(range(len(qs))): perr.append(f"{b['id']}: topic packs cover {len(covered)}/{len(qs)} questions")
        banks.append({"id": b["id"], "name": b["name"], "shortName": b.get("shortName", b["name"]), "icon": b.get("icon", "📚"),
                      "title": doc.get("title", b["name"]), "subtitle": doc.get("subtitle", ""), "rtl": bool(doc.get("rtl")),
                      "answerKeyNote": doc.get("answerKeyNote", ""), "sources": doc.get("source", []), "sourceNotes": b.get("sourceNotes", ""),
                      "total": len(qs), "years": years, "topics": topics, "sets": set_ids, "packs": packs,
                      "questions": [{k: q[k] for k in ("id", "text", "options", "answer", "explanation", "section") if k in q} for q in qs]})
    if perr:
        sys.exit("Practice data errors:\n" + "\n".join(perr))
    with open(os.path.join(HERE, "js", "practice-data.js"), "w", encoding="utf-8") as f:
        f.write("// AUTO-GENERATED from data/practice-catalog.json + data/practice/** by rebuild-data.py — edit the JSON and re-run.\n")
        f.write("window.PRACTICE_DATA = " + json.dumps({"banks": banks}, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("practice-data.js rebuilt:", {b["id"]: {"questions": b["total"], "yearPacks": len(b["years"]), "topicPacks": sum(len(t["packs"]) for t in b["topics"]), "sets": len(b["sets"])} for b in banks})
