#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-20 16:29 EET.
Established series methodology (per 15:30 run note): firefox client only,
10 suggestions, hl=ar, gl=eg. Diffs vs the space baseline
search-language/scan-2026-11-20T16-09-EET.json (space-stored, lastScanAt
2026-11-20T14:12:20Z, verified identical to space suggestions field by field).
Entered strings are also checked against ALL historical snapshots in
search-language/ so returning strings are not mislabelled brand-new.
Writes run JSON to hidden_files root and a baseline copy to search-language/.
"""
import json
import os
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

HF = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"
SL = os.path.join(HF, "search-language")
BASE = "https://suggestqueries.google.com/complete/search"
BASELINE = os.path.join(SL, "scan-2026-11-20T16-09-EET.json")


def fetch(keyword):
    params = urllib.parse.urlencode(
        {"client": "firefox", "q": keyword, "hl": "ar", "gl": "eg"}
    )
    req = urllib.request.Request(f"{BASE}?{params}",
                                 headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data[1][:10] if len(data) > 1 else []


def load_suggestions(path):
    """Leniently extract {keyword: [suggestions]} from any snapshot schema."""
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return {}
    for key in ("results", "keywords"):
        if isinstance(data.get(key), dict):
            out = {}
            for k, v in data[key].items():
                if isinstance(v, list):
                    out[k] = v
            if out:
                return out
    if isinstance(data, dict):
        out = {k: v for k, v in data.items()
               if isinstance(v, list) and all(isinstance(x, str) for x in v)}
        if out:
            return out
    return {}


def main():
    prev = load_suggestions(BASELINE)
    # full history set of every suggestion string ever seen
    history = set()
    history_files = 0
    for name in os.listdir(SL):
        if not (name.startswith("scan-") and name.endswith(".json")):
            continue
        sugg = load_suggestions(os.path.join(SL, name))
        if sugg:
            history_files += 1
            for lst in sugg.values():
                history.update(lst)

    now_utc = datetime.now(timezone.utc)
    eet = now_utc + timedelta(hours=2)
    scan = {
        "scan_time_eet": eet.strftime("%Y-%m-%d %H:%M EET"),
        "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "endpoint": "suggestqueries.google.com/complete/search",
        "params": "hl=ar&gl=eg&client=firefox",
        "previous_snapshot": "search-language/scan-2026-11-20T16-09-EET.json",
        "history_files_checked": history_files,
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
            print(f"FAIL {kw}: {e}")
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
            "entered_brand_new_ever": [s for s in entered if s not in history],
            "entered_returning": [s for s in entered if s in history],
        }
    out_root = os.path.join(HF, "search-language-scan-2026-11-20-1629.json")
    out_base = os.path.join(SL, "scan-2026-11-20-1629-eet.json")
    for p in (out_root, out_base):
        with open(p, "w", encoding="utf-8") as f:
            json.dump(scan, f, ensure_ascii=False, indent=2)
    print(f"Snapshot saved: {out_root}")
    print(f"Baseline copy: {out_base}")
    print("DIFF vs 16:09 EET:")
    print(json.dumps(scan["diff_vs_previous"], ensure_ascii=False, indent=2))
    if scan["errors"]:
        print(f"ERRORS: {len(scan['errors'])} keyword(s) failed")


if __name__ == "__main__":
    main()
