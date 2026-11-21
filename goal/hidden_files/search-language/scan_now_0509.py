#!/usr/bin/env python3
"""Google Egypt autocomplete scan for Zyra tracked keywords (05:09 EET run).
Fetches suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg
for each keyword; firefox = canonical 10-result snapshot, diffed vs the 04:49 EET
snapshot (scan-2026-11-20-0449.json); chrome = extended check, diffed vs the
03:50 EET chrome run (scan-2026-11-20-0350.json chrome_keywords). Writes scan JSON
into the goal hidden_files/search-language/ directory."""
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
PREV_FX = f"{DIR}/scan-2026-11-20-0449.json"
PREV_CH = f"{DIR}/scan-2026-11-20-0350.json"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))
stamp = now_eet.strftime("%Y-%m-%d-%H%M")

def fetch(kw, client):
    url = ("https://suggestqueries.google.com/complete/search?client=" + client
           + "&hl=ar&gl=eg&q=" + urllib.parse.quote(kw))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data[1]

fx, ch, errors = {}, {}, {}
for kw in KEYWORDS:
    try:
        fx[kw] = fetch(kw, "firefox")
    except Exception as e:
        errors[f"firefox:{kw}"] = f"{type(e).__name__}: {e}"
    try:
        ch[kw] = fetch(kw, "chrome")
    except Exception as e:
        errors[f"chrome:{kw}"] = f"{type(e).__name__}: {e}"

def load_prev(path, key):
    try:
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)
        if key == "results":
            return {k: v["suggestions"] for k, v in raw["results"].items()}
        return raw[key]
    except Exception as e:
        return {"_error": str(e)}

prev_fx = load_prev(PREV_FX, "results")
prev_ch = load_prev(PREV_CH, "chrome_keywords")

def diff(cur, prevd):
    out = {}
    for kw in KEYWORDS:
        if kw in cur and kw in prevd and isinstance(prevd.get(kw), list):
            new = [s for s in cur[kw] if s not in prevd[kw]]
            gone = [s for s in prevd[kw] if s not in cur[kw]]
            order = [f"{s}: {prevd[kw].index(s)+1}->{i+1}"
                     for i, s in enumerate(cur[kw])
                     if s in prevd[kw] and prevd[kw].index(s) != i]
            if new or gone or order:
                out[kw] = {"new": new, "gone": gone, "order": order}
    return out

diff_fx = diff(fx, prev_fx)
diff_ch = diff(ch, prev_ch)

out = {
    "run": "zyra-search-language-scan",
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg",
    "previous_snapshot": "scan-2026-11-20-0449.json (04:49 EET, firefox); scan-2026-11-20-0350.json chrome_keywords (03:50 EET, chrome)",
    "keywords": fx,
    "chrome_keywords": ch,
    "errors": errors,
    "diff_vs_previous_firefox": diff_fx,
    "diff_vs_previous_chrome": diff_ch,
}
with open(f"{DIR}/scan-{stamp}.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("WROTE", f"{DIR}/scan-{stamp}.json")
print("FETCHED fx", len(fx), "ch", len(ch), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF_FX", json.dumps(diff_fx, ensure_ascii=False))
print("DIFF_CH", json.dumps(diff_ch, ensure_ascii=False))
