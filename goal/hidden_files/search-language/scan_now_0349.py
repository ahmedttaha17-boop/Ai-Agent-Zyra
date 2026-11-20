#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-20 03:49 EET.
firefox (10 results) + chrome (extended check).
Diff vs previous snapshot hidden_files/search-language/snapshot-2026-11-20-0329.json (03:29 EET)."""
import json, urllib.request, urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة",
    "سيلوليت", "كريم سيلوليت", "علاج السيلوليت",
    "يوريا", "كريم يوريا للجسم", "سكراب جسم",
    "زبدة الشيا", "مخمرية", "ملح سيوة",
]
HF = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language"

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

prev = {}
try:
    with open(f"{HF}/snapshot-2026-11-20-0329.json", encoding="utf-8") as f:
        prev = json.load(f).get("snapshots", {})
except Exception as e:
    prev = {"_error": str(e)}

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

diff_fx = diff(fx, prev)
diff_ch = diff(ch, prev)

stamp = now_eet.strftime("%Y-%m-%d-%H%M")
out = {
    "run": "zyra-search-language-scan",
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg",
    "previous_snapshot": "hidden_files/search-language/snapshot-2026-11-20-0329.json (03:29 EET)",
    "keywords": fx,
    "chrome_keywords": ch,
    "errors": errors,
    "diff_vs_previous_firefox": diff_fx,
    "diff_vs_previous_chrome": diff_ch,
}
with open(f"{HF}/scan-{stamp}.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
snap = {
    "timestamp_eet": now_eet.strftime("%Y-%m-%dT%H:%M:%S+02:00"),
    "snapshots": fx,
}
with open(f"{HF}/snapshot-{stamp}.json", "w", encoding="utf-8") as f:
    json.dump(snap, f, ensure_ascii=False, indent=1)
print("WROTE", f"{HF}/scan-{stamp}.json")
print("FETCHED fx", len(fx), "ch", len(ch), "ERRORS", json.dumps(errors, ensure_ascii=False))
print("DIFF_FX", json.dumps(diff_fx, ensure_ascii=False))
print("DIFF_CH", json.dumps(diff_ch, ensure_ascii=False))
