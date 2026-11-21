#!/usr/bin/env python3
"""Google Egypt autocomplete scan for Zyra Care tracked keywords.
Endpoint: suggestqueries.google.com/complete/search
Params (established methodology, matches all prior scan files):
  hl=ar, gl=eg, client=firefox  (client=firefox returns the query itself as
  first suggestion; client=chrome does not - mixing clients creates a
  uniform false diff across all 12 keywords.)
Saves the snapshot JSON in the established schema and prints a diff
vs the previous snapshot file.
Usage: python3 scan_search_language.py [previous_snapshot_path]
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
HERE = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"


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
    prev_path = sys.argv[1] if len(sys.argv) > 1 else None
    prev = {}
    prev_label = None
    if prev_path:
        with open(prev_path, encoding="utf-8") as f:
            prev = json.load(f).get("results", {})
        prev_label = prev_path.split("/")[-1]
    now_utc = datetime.now(timezone.utc)
    eet = now_utc + timedelta(hours=2)
    scan = {
        "scan_time_eet": eet.strftime("%Y-%m-%d %H:%M EET"),
        "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "endpoint": "suggestqueries.google.com/complete/search",
        "params": "hl=ar&gl=eg&client=firefox",
        "previous_snapshot": prev_label,
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
    if prev:
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
    out_path = f"{HERE}/search-language-scan-2026-11-20-1349.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(scan, f, ensure_ascii=False, indent=2)
    print(f"Snapshot saved: {out_path}")
    print("DIFF vs previous:")
    print(json.dumps(scan["diff_vs_previous"], ensure_ascii=False, indent=2))
    if scan["errors"]:
        print(f"ERRORS: {len(scan['errors'])} keyword(s) failed", file=sys.stderr)


if __name__ == "__main__":
    main()
