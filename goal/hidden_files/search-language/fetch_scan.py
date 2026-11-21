import json, sys, time, urllib.parse, urllib.request

KEYWORDS = [
    "جلد الوزة", "علاج جلد الوزة", "كريم جلد الوزة", "سيلوليت",
    "كريم سيلوليت", "علاج السيلوليت", "يوريا", "كريم يوريا للجسم",
    "سكراب جسم", "زبدة الشيا", "مخمرية", "ملح سيوة",
]

def fetch(kw):
    params = urllib.parse.urlencode({"client": "firefox", "hl": "ar", "gl": "eg", "q": kw})
    url = "https://suggestqueries.google.com/complete/search?" + params
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

out = {}
errors = {}
for kw in KEYWORDS:
    try:
        data = fetch(kw)
        sugg = data[1] if len(data) > 1 else []
        out[kw] = sugg
        print(f"OK  {kw}: {len(sugg)} suggestions")
    except Exception as e:
        errors[kw] = str(e)
        print(f"ERR {kw}: {e}")
    time.sleep(0.5)

ts = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
result = {"scannedAtUtc": ts, "suggestions": out, "errors": errors}
with open(sys.argv[1], "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("ERRORS:", errors if errors else "none")
