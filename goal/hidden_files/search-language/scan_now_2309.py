#!/usr/bin/env python3
"""Google Egypt autocomplete scan, 2026-11-20 23:09 EET occurrence (job zyra-search-language-scan).
Follows the 22:49 EET run: client=chrome (13-15 suggestions/keyword, no bare-query echo).
Baseline: hidden_files/search-language-scan-2026-11-20-2249.json (22:49 EET, chrome).
Diff per keyword: top10 entered/exited + beyond-top-10 new + order changes.
Writes search-language-scan-2026-11-20-2309.json and search-language-diff-2026-11-20-2309.json.
Space writes (recordkeywordscan) are done by the agent with the CORRECT keyword ids:
  جلد الوزة=1, علاج جلد الوزة=2, كريم جلد الوزة=3, كريم سيلوليت=4, علاج السيلوليت=5,
  سيلوليت=6, ملح سيوة=7, يوريا=8, مخمرية=9, كريم يوريا للجسم=10, سكراب جسم=11, زبدة الشيا=12.
NEVER use list position as the id.
"""
import json
import sys
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
HF = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"
PREV = f"{HF}/search-language-scan-2026-11-20-2249.json"


def fetch(keyword):
    params = urllib.parse.urlencode(
        {"client": "chrome", "q": keyword, "hl": "ar", "gl": "eg"}
    )
    url = f"{BASE}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8")
    data = json.loads(raw)
    return data[1] if len(data) > 1 else []


def main():
    with open(PREV, encoding="utf-8") as f:
        prev = json.load(f).get("results", {})
    now_utc = datetime.now(timezone.utc)
    eet = now_utc + timedelta(hours=2)
    scan = {
        "timestamp_eet": eet.strftime("%Y-%m-%d %H:%M EET"),
        "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "endpoint": "suggestqueries.google.com/complete/search",
        "params": "hl=ar&gl=eg&client=chrome",
        "previous_snapshot": "search-language-scan-2026-11-20-2249.json (22:49 EET)",
        "results": {},
        "errors": {},
    }
    for kw in KEYWORDS:
        try:
            sugg = fetch(kw)
            scan["results"][kw] = sugg
            print(f"OK  {kw}: {len(sugg)} suggestions")
        except Exception as e:  # noqa: BLE001 - record and continue
            scan["errors"][kw] = f"{type(e).__name__}: {e}"
            print(f"FAIL {kw}: {e}", file=sys.stderr)
    diff = {}
    for kw in KEYWORDS:
        old_full = prev.get(kw, [])
        new_full = scan["results"].get(kw, [])
        old_top = old_full[:10]
        new_top = new_full[:10]
        entered = [s for s in new_top if s not in old_top]
        exited = [s for s in old_top if s not in new_top]
        beyond_new = [s for s in new_full if s not in old_full and s not in new_top]
        order = [
            f"{s}: {old_top.index(s)+1}->{i+1}"
            for i, s in enumerate(new_top)
            if s in old_top and old_top.index(s) != i
        ]
        diff[kw] = {
            "entered": entered,
            "exited": exited,
            "beyond_top10_new": beyond_new,
            "top10": new_top,
            "full": new_full,
            "order_changed": order,
            "order_changed_only": (not entered and not exited and old_top != new_top),
        }
    out_scan = f"{HF}/search-language-scan-2026-11-20-2309.json"
    out_diff = f"{HF}/search-language-diff-2026-11-20-2309.json"
    with open(out_scan, "w", encoding="utf-8") as f:
        json.dump(scan, f, ensure_ascii=False, indent=2)
    with open(out_diff, "w", encoding="utf-8") as f:
        json.dump(diff, f, ensure_ascii=False, indent=2)
    print(f"Snapshot saved: {out_scan}")
    print(f"Diff saved: {out_diff}")
    print("DIFF vs previous (22:49 EET):")
    print(json.dumps(diff, ensure_ascii=False, indent=2))
    if scan["errors"]:
        print(f"ERRORS: {len(scan['errors'])} keyword(s) failed", file=sys.stderr)


if __name__ == "__main__":
    main()
