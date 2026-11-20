#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-20 00:09 EET.
firefox (10 results, canonical) + chrome (15 results, extended check).
Diffs firefox + chrome vs previous 23:49 EET run JSON
(hidden_files/search-language/scan-2026-11-19-2349.json, keys
"keywords" and "chrome_keywords")."""
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

prev_doc = {}
try:
    with open(f"{HF}/search-language/scan-2026-11-19-2349.json", encoding="utf-8") as f:
        prev_doc = json.load(f)
except Exception as e:
    prev_doc = {"_error": str(e)}
prev_fx = prev_doc.get("keywords", {})
prev_ch = prev_doc.get("chrome_keywords", {})

def diff(cur, prev):
    out = {}
    for kw in KEYWORDS:
        if kw in cur and kw in prev and isinstance(prev.get(kw), list):
            new = [s for s in cur[kw] if s not in prev[kw]]
            gone = [s for s in prev[kw] if s not in cur[kw]]
            order = [f"{s}: {prev[kw].index(s)+1}->{i+1}"
                     for i, s in enumerate(cur[kw])
                     if s in prev[kw] and prev[kw].index(s) != i]
            if new or gone or order:
                out[kw] = {"new": new, "gone": gone, "order": order}
    return out

diff_fx = diff(fx, prev_fx)
diff_ch = diff(ch, prev_ch)

stamp = now_eet.strftime("%Y-%m-%dT%H-%M-EET")
out = {
    "run": "zyra-search-language-scan",
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg",
    "previous_snapshot": "hidden_files/search-language/scan-2026-11-19-2349.json (23:49 EET run, keywords + chrome_keywords)",
    "keywords": fx,
    "chrome_keywords": ch,
    "errors": errors,
    "diff_vs_previous_firefox": diff_fx,
    "diff_vs_previous_chrome": diff_ch,
}
paths = {
    "firefox_baseline": f"{SL}/scan-{stamp}.json",
    "run_log_json": f"{HF}/search-language/scan-2026-11-20-0009.json",
}
for p in paths.values():
    with open(p, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
ch_path = f"{SS}/scan_{now_utc.strftime('%Y-%m-%dT%H%M%S')}.json"
with open(ch_path, "w", encoding="utf-8") as f:
    json.dump({"fetched_at_eet": out["fetched_at_eet"], "client": "chrome",
               "keywords": ch}, f, ensure_ascii=False, indent=1)
fx10_path = f"{HF}/search-scans/scan-2026-11-20-{now_eet.strftime('%H%M')}.json"
with open(fx10_path, "w", encoding="utf-8") as f:
    json.dump({"fetched_at_eet": out["fetched_at_eet"], "client": "firefox",
               "keywords": fx}, f, ensure_ascii=False, indent=1)
with open(f"{SS}/prev.json", "w", encoding="utf-8") as f:
    json.dump(ch, f, ensure_ascii=False, indent=1)
print("WROTE", paths["firefox_baseline"])
print("CHROME", ch_path)
print("FX10", fx10_path)
print("FETCHED fx", len(fx), "ch", len(ch), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF_FX", json.dumps(diff_fx, ensure_ascii=False))
print("DIFF_CH", json.dumps(diff_ch, ensure_ascii=False))
