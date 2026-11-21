#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-20 22:49 EET.
Methodology (matches the 22:09/22:29 EET runs it diffs against):
  client=chrome, hl=ar, gl=eg — 15 suggestions per keyword.
Diff vs hidden_files/search-language-scan-2026-11-20-2229.json.
"""
import json, urllib.request, urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة",
    "سيلوليت", "كريم سيلوليت", "علاج السيلوليت",
    "يوريا", "كريم يوريا للجسم", "سكراب جسم",
    "زبدة الشيا", "مخمرية", "ملح سيوة",
]
HF = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))

def fetch(kw):
    url = ("https://suggestqueries.google.com/complete/search?client=chrome"
           "&hl=ar&gl=eg&q=" + urllib.parse.quote(kw))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data[1]

results, errors = {}, {}
for kw in KEYWORDS:
    try:
        results[kw] = fetch(kw)
        print(f"OK  {kw}: {len(results[kw])} suggestions")
    except Exception as e:
        errors[kw] = f"{type(e).__name__}: {e}"
        print(f"FAIL {kw}: {e}")

prev = {}
with open(f"{HF}/search-language-scan-2026-11-20-2229.json", encoding="utf-8") as f:
    prev = json.load(f)["results"]

diff = {}
for kw in KEYWORDS:
    old = prev.get(kw, [])
    new = results.get(kw, [])
    old10, new10 = old[:10], new[:10]
    diff[kw] = {
        "entered": [s for s in new10 if s not in old10],
        "exited": [s for s in old10 if s not in new10],
        "beyond_top10_new": [s for s in new[10:] if s not in old],
        "top10": new10,
        "full": new,
    }

stamp = now_eet.strftime("%Y-%m-%d %H:%M EET")
scan = {
    "timestamp_eet": stamp,
    "endpoint": "suggestqueries.google.com/complete/search",
    "params": "hl=ar&gl=eg&client=chrome",
    "previous_snapshot": "search-language-scan-2026-11-20-2229.json (22:29 EET)",
    "results": results,
    "errors": errors,
}
scan_path = f"{HF}/search-language-scan-2026-11-20-2249.json"
with open(scan_path, "w", encoding="utf-8") as f:
    json.dump(scan, f, ensure_ascii=False, indent=2)
diff_path = f"{HF}/search-language-diff-2026-11-20-2249.json"
with open(diff_path, "w", encoding="utf-8") as f:
    json.dump(diff, f, ensure_ascii=False, indent=2)
print("Snapshot saved:", scan_path)
print("Diff saved:", diff_path)
print("DIFF:")
print(json.dumps({k: {"entered": v["entered"], "exited": v["exited"],
                      "beyond_top10_new": v["beyond_top10_new"]}
                  for k, v in diff.items()}, ensure_ascii=False, indent=2))
if errors:
    print("ERRORS:", json.dumps(errors, ensure_ascii=False))
