#!/usr/bin/env python3
"""Google Egypt autocomplete scan for Zyra tracked keywords (01:49 EET run, 2026-11-21).
Client=chrome to match the 01:11 EET previous snapshot (15 suggestions/keyword,
seed keyword absent from returned lists). Diffs vs scan-2026-11-21-0111-eet.json."""
import json, urllib.request, urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة",
    "سيلوليت", "كريم سيلوليت", "علاج السيلوليت",
    "يوريا", "كريم يوريا للجسم", "سكراب جسم",
    "زبدة الشيا", "مخمرية", "ملح سيوة",
]
DIR = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language"
PREV = f"{DIR}/scan-2026-11-21-0111-eet.json"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))

results, errors = {}, {}
for kw in KEYWORDS:
    url = ("https://suggestqueries.google.com/complete/search?client=chrome"
           "&hl=ar&gl=eg&q=" + urllib.parse.quote(kw))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.loads(r.read().decode("utf-8"))
        results[kw] = data[1]
    except Exception as e:
        errors[kw] = f"{type(e).__name__}: {e}"

diff = {}
try:
    with open(PREV, encoding="utf-8") as f:
        prev = json.load(f)["results"]
    for kw in KEYWORDS:
        if kw in results and kw in prev:
            old, new = prev[kw], results[kw]
            entered = [s for s in new[:10] if s not in old[:10]]
            left = [s for s in old[:10] if s not in new[:10]]
            beyond_new = [s for s in new[10:] if s not in old]
            order_only = entered == [] and left == [] and old[:10] != new[:10]
            diff[kw] = {
                "entered": entered,
                "left": left,
                "beyond_top10_new": beyond_new,
                "top10": new[:10],
                "full": new,
                "order_changed_only": order_only,
            }
except Exception as e:
    diff = {"_error": str(e)}

out = {
    "run": "zyra-search-language-scan",
    "scanned_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "endpoint": "suggestqueries.google.com/complete/search?client=chrome&hl=ar&gl=eg",
    "previous_snapshot": "scan-2026-11-21-0111-eet.json",
    "results": results,
    "errors": errors,
    "diff_vs_previous": diff,
}
stamp = now_eet.strftime("%Y-%m-%d-%H%M")
path = f"{DIR}/scan-{stamp}-eet.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("WROTE", path)
print("FETCHED", len(results), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF", json.dumps(diff, ensure_ascii=False, indent=1))
