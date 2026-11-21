import json, urllib.request, urllib.parse, time, sys, os
KEYWORDS = ["جلد الوزة","علاج جلد الوزة","كريم جلد الوزة","سيلوليت","كريم سيلوليت","علاج السيلوليت","يوريا","كريم يوريا للجسم","سكراب جسم","زبدة الشيا","مخمرية","ملح سيوة"]
results = {}; errors = {}
for kw in KEYWORDS:
    q = urllib.parse.quote(kw)
    url = f"https://suggestqueries.google.com/complete/search?client=chrome&hl=ar&gl=eg&q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            data = json.loads(r.read().decode("utf-8"))
            sugg = data[1]
            results[kw] = sugg
            print(f"OK {kw}: {len(sugg)} suggestions", flush=True)
    except Exception as e:
        errors[kw] = str(e)
        print(f"FAIL {kw}: {e}", file=sys.stderr, flush=True)
base = os.path.expanduser("~/workspace/goals/zyra-care-relaunch-and-marketing-intelligence-agent/hidden_files/search-language-scans/")
out = {"fetched_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "client": "chrome", "results": results, "errors": errors}
with open(base+"snapshot_chrome_2026-11-21_0129.json","w",encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("ERRORS:", len(errors))
