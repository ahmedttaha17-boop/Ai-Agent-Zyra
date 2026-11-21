#!/usr/bin/env python3
"""Search-language scan — scheduled run 2026-11-20 19:09 EET.
Established methodology: suggestqueries.google.com/complete/search,
hl=ar, gl=eg, client=firefox (series of record; 10 suggestions/keyword).
Compares vs scan-2026-11-20-1831-firefox.json (previous Firefox snapshot).
Note: scan-2026-11-20-1849.json is a different (non-Firefox) series — do
NOT compare against it; mixing clients creates a uniform false diff.
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
PREV = f"{HERE}/scan-2026-11-20-1831-firefox.json"


def fetch(keyword):
    params = urllib.parse.urlencode(
        {"client": "firefox", "q": keyword, "hl": "ar", "gl": "eg"}
    )
    req = urllib.request.Request(
        f"{BASE}?{params}", headers={"User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return (data[1] if len(data) > 1 else [])[:10]


def main():
    with open(PREV, encoding="utf-8") as f:
        prev_data = json.load(f)
    prev = {v["keyword"]: v["suggestions"] for v in prev_data["results"].values()}
    now_utc = datetime.now(timezone.utc)
    eet = now_utc + timedelta(hours=2)
    stamp = eet.strftime("%H%M")
    scan = {
        "scanned_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scan_time_eet": eet.strftime("%Y-%m-%d %H:%M EET"),
        "endpoint": "suggestqueries.google.com/complete/search",
        "params": "hl=ar&gl=eg&client=firefox",
        "previous_snapshot": "scan-2026-11-20-1831-firefox.json",
        "client": "firefox",
        "results": {},
        "errors": [],
        "diff_vs_previous": {},
    }
    for i, kw in enumerate(KEYWORDS, start=1):
        try:
            sugg = fetch(kw)
            scan["results"][str(i)] = {"keyword": kw, "suggestions": sugg}
            print(f"OK  {kw}: {len(sugg)}")
            for s in sugg:
                print(f"     - {s}")
        except Exception as e:  # noqa: BLE001
            scan["errors"].append({"keyword": kw, "error": str(e)})
            print(f"FAIL {kw}: {e}")
    for kw in KEYWORDS:
        old = prev.get(kw, [])
        new = next(
            (v["suggestions"] for v in scan["results"].values() if v["keyword"] == kw),
            [],
        )
        scan["diff_vs_previous"][kw] = {
            "entered": [s for s in new if s not in old],
            "left": [s for s in old if s not in new],
            "order_changed_only": (not [s for s in new if s not in old])
            and (not [s for s in old if s not in new])
            and old != new,
        }
    out = f"{HERE}/scan-2026-11-20-{stamp}-firefox.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(scan, f, ensure_ascii=False, indent=2)
    print(f"Snapshot saved: {out}")
    print("DIFF vs previous (1831 firefox):")
    print(json.dumps(scan["diff_vs_previous"], ensure_ascii=False, indent=2))
    if scan["errors"]:
        print(f"ERRORS: {len(scan['errors'])} keyword(s) failed")


if __name__ == "__main__":
    main()
