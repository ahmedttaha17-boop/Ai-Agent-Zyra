#!/usr/bin/env python3
"""Fetch Google Egypt autocomplete suggestions for Zyra's tracked keywords.

Reads previous suggestions from prev.json (keyword -> list), fetches the
live endpoint, writes scan_<timestamp>.json and diff.json.
"""
import json, sys, time, urllib.parse, urllib.request

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة", "كريم سيلوليت",
    "علاج السيلوليت", "سيلوليت", "ملح سيوة", "يوريا", "مخمرية",
    "كريم يوريا للجسم", "سكراب جسم", "زبدة الشيا",
]

BASE = "https://suggestqueries.google.com/complete/search"
HEADERS = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"}

def fetch(kw):
    qs = urllib.parse.urlencode({"client": "chrome", "hl": "ar", "gl": "eg", "q": kw})
    req = urllib.request.Request(f"{BASE}?{qs}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

def main():
    ts = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
    with open("prev.json", encoding="utf-8") as f:
        prev = json.load(f)
    results = {}
    errors = {}
    for kw in KEYWORDS:
        try:
            data = fetch(kw)
            sugg = data[1] if len(data) > 1 else []
            results[kw] = sugg
            print(f"OK  {kw}: {len(sugg)} suggestions")
        except Exception as e:  # noqa: BLE001
            errors[kw] = str(e)
            print(f"FAIL {kw}: {e}", file=sys.stderr)
        time.sleep(1)
    with open(f"scan_{ts.replace(':', '')}.json", "w", encoding="utf-8") as f:
        json.dump({"scannedAt": ts + "Z", "results": results, "errors": errors},
                  f, ensure_ascii=False, indent=2)
    diff = {}
    for kw, sugg in results.items():
        old = set(prev.get(kw, []))
        new = [s for s in sugg if s not in old]
        gone = [s for s in prev.get(kw, []) if s not in set(sugg)]
        diff[kw] = {"new": new, "gone": gone, "count": len(sugg), "prevCount": len(old)}
    with open("diff.json", "w", encoding="utf-8") as f:
        json.dump({"scannedAt": ts + "Z", "diff": diff}, f, ensure_ascii=False, indent=2)
    print("NEW SUGGESTIONS:")
    for kw, d in diff.items():
        if d["new"]:
            print(f"  {kw}: {d['new']}")
    print("ERRORS:", errors if errors else "none")

if __name__ == "__main__":
    main()
