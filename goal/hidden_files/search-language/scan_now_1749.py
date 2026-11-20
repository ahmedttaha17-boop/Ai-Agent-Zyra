#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-19 17:49 EET.
firefox (10 results, canonical) + chrome (15 results, extended check).
Diffs firefox vs previous 17:09 EET run JSON
(hidden_files/search-language/scan-2026-11-19-1749.json, space-stored)
and chrome vs search-scans/prev.json."""
import json, urllib.request, urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة",
    "سيلوليت", "كريم سيلوليت", "علاج السيلوليت",
    "يوريا", "كريم يوريا للجسم", "سكراب جسم",
    "زبدة الشيا", "مخمرية", "ملح سيوة",
]
SL = "/home/hatch/workspace/zyra-marketing-intelligence-agent/search-language"
SS = "/home/hatch/workspace/zyra-marketing-intelligence-agent/search-scans"
HF = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))

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

# diff firefox vs 17:29 EET run JSON (space-stored snapshot)
prev_fx = {}
try:
    with open(f"{HF}/search-language/scan-2026-11-19-1729.json", encoding="utf-8") as f:
        prev_fx = json.load(f)["keywords"]
except Exception as e:
    prev_fx = {"_error": str(e)}

diff_fx = {}
for kw in KEYWORDS:
    if kw in fx and kw in prev_fx and isinstance(prev_fx, dict):
        new = [s for s in fx[kw] if s not in prev_fx[kw]]
        gone = [s for s in prev_fx[kw] if s not in fx[kw]]
        order = [(i, s) for i, s in enumerate(fx[kw]) if s in prev_fx[kw] and prev_fx[kw].index(s) != i]
        if new or gone or order:
            diff_fx[kw] = {"new": new, "gone": gone,
                           "order": [f"{s}: {prev_fx[kw].index(s)+1}->{i+1}" for i, s in order]}

# diff chrome vs prev.json
prev_ch = {}
try:
    with open(f"{SS}/prev.json", encoding="utf-8") as f:
        prev_ch = json.load(f)
except Exception as e:
    prev_ch = {"_error": str(e)}

diff_ch = {}
for kw in KEYWORDS:
    if kw in ch and kw in prev_ch and isinstance(prev_ch.get(kw), list):
        new = [s for s in ch[kw] if s not in prev_ch[kw]]
        gone = [s for s in prev_ch[kw] if s not in ch[kw]]
        if new or gone:
            diff_ch[kw] = {"new": new, "gone": gone}

stamp = now_eet.strftime("%Y-%m-%dT%H-%M-EET")
out = {
    "run": "zyra-search-language-scan",
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg",
    "previous_snapshot": "hidden_files/search-language/scan-2026-11-19-1749.json (space-stored 17:11 EET)",
    "keywords": fx,
    "chrome_keywords": ch,
    "errors": errors,
    "diff_vs_previous_firefox": diff_fx,
    "diff_vs_previous_chrome": diff_ch,
}
paths = {
    "firefox_baseline": f"{SL}/scan-{stamp}.json",
    "run_log_json": f"{HF}/search-language/scan-2026-11-19-1749.json",
}
for p in paths.values():
    with open(p, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
# chrome snapshot file
ch_path = f"{SS}/scan_{now_utc.strftime('%Y-%m-%dT%H%M%S')}.json"
with open(ch_path, "w", encoding="utf-8") as f:
    json.dump({"fetched_at_eet": out["fetched_at_eet"], "client": "chrome",
               "keywords": ch}, f, ensure_ascii=False, indent=1)
# refresh chrome prev.json
with open(f"{SS}/prev.json", "w", encoding="utf-8") as f:
    json.dump(ch, f, ensure_ascii=False, indent=1)
print("WROTE", paths["firefox_baseline"])
print("CHROME", ch_path)
print("FETCHED fx", len(fx), "ch", len(ch), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF_FX", json.dumps(diff_fx, ensure_ascii=False))
print("DIFF_CH", json.dumps(diff_ch, ensure_ascii=False))
