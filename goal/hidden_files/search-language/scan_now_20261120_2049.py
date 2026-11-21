#!/usr/bin/env python3
"""Google Egypt autocomplete scan, 2026-11-20 20:49 EET occurrence (job zyra-search-language-scan).
Established methodology: suggestqueries.google.com/complete/search, hl=ar, gl=eg, client=firefox
(firefox returns the query itself as first suggestion, 10 results/keyword — the series of record).
Baseline: scan-2026-11-20-2029.json (20:29 EET).
Writes scan-2026-11-20-2049-eet-firefox.json and prints the diff.
Space writes (recordkeywordscan) are done by the agent with the CORRECT keyword ids:
  جلد الوزة=1, علاج جلد الوزة=2, كريم جلد الوزة=3, كريم سيلوليت=4, علاج السيلوليت=5,
  سيلوليت=6, ملح سيوة=7, يوريا=8, مخمرية=9, كريم يوريا للجسم=10, سكراب جسم=11, زبدة الشيا=12.
NEVER use list position as the id — that mislabeled the stored rows in prior runs.
"""
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

KEYWORDS = [
    "جلد الوزة",
    "علاج جلد الوزة",
    "كريم جلد الوزة",
    "سيلوليت",
    "كريم سيلوليت",
    "علاج السيلوليت",
    "يوريا",
    "كريم يوريا للجسم",
    "سكراب جسم",
    "زبدة الشيا",
    "مخمرية",
    "ملح سيوة",
]

BASE = "https://suggestqueries.google.com/complete/search"
HERE = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language"
PREV = f"{HERE}/scan-2026-11-20-2029.json"


def fetch(keyword):
    params = urllib.parse.urlencode(
        {"client": "firefox", "q": keyword, "hl": "ar", "gl": "eg"}
    )
    url = f"{BASE}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8")
    data = json.loads(raw)
    suggestions = data[1] if len(data) > 1 else []
    return suggestions[:10]


def main():
    with open(PREV, encoding="utf-8") as f:
        prev = json.load(f).get("results", {})
    now_utc = datetime.now(timezone.utc)
    eet = now_utc + timedelta(hours=2)
    scan = {
        "scan_time_eet": eet.strftime("%Y-%m-%d %H:%M EET"),
        "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "endpoint": "suggestqueries.google.com/complete/search",
        "params": "hl=ar&gl=eg&client=firefox",
        "previous_snapshot": "scan-2026-11-20-2029.json",
        "results": {},
        "errors": {},
        "diff_vs_previous": {},
    }
    for kw in KEYWORDS:
        try:
            sugg = fetch(kw)
            scan["results"][kw] = sugg
            print(f"OK  {kw}: {len(sugg)} suggestions")
            for s in sugg:
                print(f"     - {s}")
        except Exception as e:  # noqa: BLE001 - record and continue
            scan["errors"][kw] = str(e)
            print(f"FAIL {kw}: {e}", file=sys.stderr)
    for kw in KEYWORDS:
        old = prev.get(kw, [])
        new = scan["results"].get(kw, [])
        entered = [s for s in new if s not in old]
        left = [s for s in old if s not in new]
        order_only = entered == [] and left == [] and old != new
        scan["diff_vs_previous"][kw] = {
            "entered": entered,
            "left": left,
            "order_changed_only": order_only,
        }
    out_path = f"{HERE}/scan-2026-11-20-2049-eet-firefox.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(scan, f, ensure_ascii=False, indent=2)
    print(f"Snapshot saved: {out_path}")
    print("DIFF vs previous (20:29 EET):")
    print(json.dumps(scan["diff_vs_previous"], ensure_ascii=False, indent=2))
    if scan["errors"]:
        print(f"ERRORS: {len(scan['errors'])} keyword(s) failed", file=sys.stderr)


if __name__ == "__main__":
    import sys
    main()
