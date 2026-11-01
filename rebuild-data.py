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
