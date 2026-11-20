#!/usr/bin/env python3
"""Google Egypt autocomplete scan for Zyra tracked keywords (12:09 EET run).
Firefox client = canonical 10-result snapshot, diffed vs the 11:50 EET
firefox snapshot (search-language/scan-2026-11-19T11-50-EET.json, "keywords"
structure, which matches the space's stored suggestions).
Chrome client = extended 15-result check, diffed vs search-scans/prev.json
(refreshed at the 11:49 run to the chrome results)."""
import json, time, urllib.request, urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة",
    "سيلوليت", "كريم سيلوليت", "علاج السيلوليت",
    "يوريا", "كريم يوريا للجسم", "سكراب جسم",
    "زبدة الشيا", "مخمرية", "ملح سيوة",
]
HIDDEN = "/home/hatch/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files"
SL = "/home/hatch/workspace/zyra-marketing-intelligence-agent/search-language"
SS = "/home/hatch/workspace/zyra-marketing-intelligence-agent/search-scans"
PREV_FF = f"{SL}/scan-2026-11-19T11-50-EET.json"
PREV_CH = f"{SS}/prev.json"

now_utc = datetime.now(timezone.utc)
now_eet = now_utc.astimezone(ZoneInfo("Africa/Cairo"))
stamp = now_eet.strftime("%Y-%m-%d-%H%M")

def fetch(kw, client):
    qs = urllib.parse.urlencode({"client": client, "hl": "ar", "gl": "eg", "q": kw})
    req = urllib.request.Request(
        f"https://suggestqueries.google.com/complete/search?{qs}",
        headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))[1]

def compute_diff(results, prev):
    diff = {}
    for kw in KEYWORDS:
        if kw in results and kw in prev:
            new = [s for s in results[kw] if s not in prev[kw]]
            gone = [s for s in prev[kw] if s not in results[kw]]
            order_only = None
            if not new and not gone and results[kw] != prev[kw]:
                moves = []
                for i, s in enumerate(results[kw]):
                    j = prev[kw].index(s)
                    if i != j:
                        moves.append(f"{s!r} {j+1}->{i+1}")
                order_only = "; ".join(moves)
            if new or gone or order_only:
                diff[kw] = {"new": new, "gone": gone}
                if order_only:
                    diff[kw]["order_only"] = order_only
    return diff

ff_results, ff_errors = {}, {}
for kw in KEYWORDS:
    try:
        ff_results[kw] = fetch(kw, "firefox")
    except Exception as e:
        ff_errors[kw] = f"{type(e).__name__}: {e}"
    time.sleep(0.5)

ch_results, ch_errors = {}, {}
for kw in KEYWORDS:
    try:
        ch_results[kw] = fetch(kw, "chrome")
    except Exception as e:
        ch_errors[kw] = f"{type(e).__name__}: {e}"
    time.sleep(0.5)

diff_ff, diff_ch = {}, {}
try:
    with open(PREV_FF, encoding="utf-8") as f:
        prev_ff = json.load(f)["keywords"]
    diff_ff = compute_diff(ff_results, prev_ff)
except Exception as e:
    diff_ff = {"error": str(e)}
try:
    with open(PREV_CH, encoding="utf-8") as f:
        prev_ch = json.load(f)
    # prev.json may be a bare keyword->list mapping or {"results": ...}
    if isinstance(prev_ch, dict) and "results" in prev_ch:
        prev_ch = prev_ch["results"]
    diff_ch = compute_diff(ch_results, prev_ch)
except Exception as e:
    diff_ch = {"error": str(e)}

out = {
    "run": "zyra-search-language-scan",
    "timestamp_local": now_eet.isoformat(),
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?hl=ar&gl=eg",
    "previous_snapshot": "search-language/scan-2026-11-19T11-50-EET.json (firefox); search-scans/prev.json (chrome, refreshed 11:49)",
    "results": ff_results,
    "errors": ff_errors,
    "diff_vs_previous": diff_ff,
    "chrome_results": ch_results,
    "chrome_errors": ch_errors,
    "chrome_diff_vs_prev": diff_ch,
}
path = f"{HIDDEN}/search-language/scan-{stamp}.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
ch_path = f"{SS}/scan_{now_utc.strftime('%Y-%m-%dT%H%M%S')}.json"
with open(ch_path, "w", encoding="utf-8") as f:
    json.dump({"scannedAt": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
               "results": ch_results, "errors": ch_errors},
              f, ensure_ascii=False, indent=2)
print("WROTE", path)
print("WROTE_CHROME", ch_path)
print("FF FETCHED", len(ff_results), "ERRORS", json.dumps(ff_errors, ensure_ascii=False))
print("FF DIFF", json.dumps(diff_ff, ensure_ascii=False))
print("CH FETCHED", len(ch_results), "ERRORS", json.dumps(ch_errors, ensure_ascii=False))
print("CH DIFF", json.dumps(diff_ch, ensure_ascii=False))
