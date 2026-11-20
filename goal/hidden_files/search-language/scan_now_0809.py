#!/usr/bin/env python3
"""Google Egypt autocomplete scan for Zyra tracked keywords (08:09 EET run).
Fetches suggestqueries.google.com/complete/search?client=firefox&hl=ar&gl=eg
for each keyword, diffs vs the 07:30 EET snapshot (same method, 10 items) and
vs the 07:49 EET extended snapshot (top-10 slice), writes scan JSON into the
goal hidden_files/search-language/ directory."""
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
PREV = f"{DIR}/scan-2026-11-19-0730.json"
PREV2 = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-scan-2026-11-19-0749.json"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))
stamp = now_eet.strftime("%Y-%m-%d-%H%M")

results, errors = {}, {}
for kw in KEYWORDS:
    url = ("https://suggestqueries.google.com/complete/search?client=firefox"
           "&hl=ar&gl=eg&q=" + urllib.parse.quote(kw))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.loads(r.read().decode("utf-8"))
        results[kw] = data[1]
    except Exception as e:
        errors[kw] = f"{type(e).__name__}: {e}"

def compute_diff(results, prev):
    diff = {}
    for kw in KEYWORDS:
        if kw in results and kw in prev:
            new = [s for s in results[kw] if s not in prev[kw]]
            gone = [s for s in prev[kw] if s not in results[kw]]
            order_only = None
            if not new and not gone and results[kw] != prev[kw]:
                moves = []
                for i, s in enumerate(results[kw]):
                    j = prev[kw].index(s)
                    if i != j:
                        moves.append(f"{s!r} {j+1}->{i+1}")
                order_only = "; ".join(moves)
            if new or gone or order_only:
                diff[kw] = {"new": new, "gone": gone}
                if order_only:
                    diff[kw]["order_only"] = order_only
    return diff

diff = {}
try:
    with open(PREV, encoding="utf-8") as f:
        prev = json.load(f)["results"]
    diff["vs_0730"] = compute_diff(results, prev)
except Exception as e:
    diff["vs_0730_error"] = str(e)

try:
    with open(PREV2, encoding="utf-8") as f:
        prev2_raw = json.load(f)["results"]
    prev2 = {k: v["suggestions"][:10] for k, v in prev2_raw.items()}
    diff["vs_0749_top10"] = compute_diff(results, prev2)
except Exception as e:
    diff["vs_0749_error"] = str(e)

out = {
    "run": "zyra-search-language-scan",
    "timestamp_local": now_eet.isoformat(),
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox&hl=ar&gl=eg",
    "previous_snapshot": "scan-2026-11-19-0730.json",
    "results": results,
    "errors": errors,
    "diff_vs_previous": diff,
}
path = f"{DIR}/scan-{stamp}.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("WROTE", path)
print("FETCHED", len(results), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF", json.dumps(diff, ensure_ascii=False))
