#!/usr/bin/env python3
"""Google Egypt autocomplete scan, run 2026-11-20 07:29 EET.
firefox (10 results) + chrome (extended check).
Diff vs space's stored suggestions (scan 2026-11-20 07:10 EET, lastScanAt 05:10:46Z)."""
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

# Previous snapshot = space's stored suggestions after the 07:10 EET run (getopsstate, lastScanAt 2026-11-20T05:10:46Z).
PREV = {
    "جلد الوزة": ["جلد الوزة", "جلد الوزة بالانجليزي", "جلد الوزة في المؤخرة", "جلد الوزة في اليد", "جلد الوزة في الوجه", "جلد الوزة في الذراع", "جلد الوزة في البكيني", "جلد الوزة تحت الابط", "جلد الوزة في الثدي", "جلد الوزة قبل وبعد الليزر"],
    "علاج جلد الوزة": ["علاج جلد الوزة", "علاج جلد الوزة بالفازلين", "علاج جلد الوزة في المؤخرة", "علاج جلد الوزة بزيت جونسون", "علاج جلد الوزة في البيت", "علاج جلد الوزة من الصيدلية", "علاج جلد الوزة بالليزر", "علاج جلد الوزة تحت الابط", "علاج جلد الوزة في المناطق الحساسة", "علاج جلد الوزة في الوجه"],
    "كريم جلد الوزة": ["كريم جلد الوزة", "كريم جلد الوزة من الصيدلية", "كريم جلد الوزة من dm", "كريم لعلاج جلد الوزة", "كريم لازالة جلد الوزة", "كريم لي جلد الوزة", "افضل كريم جلد الوزة", "كريم تقشير جلد الوزة", "كريم يوسيرين جلد الوزة", "كريم ضد جلد الوزة"],
    "سيلوليت": ["سيلوليت", "سيلوليت الرجل", "سيلوليت رول", "سيلوليت بالانجليزي", "سيلوليت الافخاذ", "سيلوليت رول نون", "سيلوليت رولر", "سيلوليت الجسم", "سيلوليت البطن", "سيلوليت الذراعين"],
    "كريم سيلوليت": ["كريم سيلوليت", "كريم سيلوليت بعد الولادة", "كريم سيلوليت للتنحيف", "كريم سيلوليت الجسم", "كريم سيلوليت نيفيا", "كريم سيلوليت للحامل", "كريم سيلوليت النهدي", "افضل كريم سيلوليت", "كريم علاج سيلوليت", "كريم انتي سيلوليت"],
    "علاج السيلوليت": ["علاج السيلوليت", "علاج السيلوليت في المنزل", "علاج السيلوليت في الجسم", "علاج السيلوليت في المؤخرة", "علاج السيلوليت في الفخذين", "علاج السيلوليت بالقهوة", "علاج السيلوليت في المؤخرة طبيعيا", "علاج السيلوليت بالرياضة", "علاج السيلوليت بالليزر", "علاج السيلوليت الاحمر"],
    "يوريا": ["يوريا كريم", "يوريا", "يورياج", "يورياج مزيل عرق", "يوريا ٢٠٪", "يوريان تيمبر", "يورياج غسول", "يورياج سيكا", "يورياج صن بلوك", "يوريا الدم"],
    "كريم يوريا للجسم": ["كريم يوريا للجسم", "كريم يوريا للجسم النهدي", "افضل كريم يوريا للجسم", "كريم يوريا ٢٠ للجسم", "كريم يوريا 10 للجسم", "فوائد كريم يوريا للجسم", "كريم فيه يوريا للجسم", "كريم يوسيرين يوريا للجسم", "كريم يوريا مرطب للجسم", "كريم يوريا ٤٠ للجسم"],
    "سكراب جسم": ["سكراب جسم", "سكراب جسم وردي", "سكراب جسم دوف", "سكراب جسم منزلي", "سكراب جسم قهوه", "سكراب جسم كوزمو", "سكراب جسم النهدي", "سكراب جسم اصفر", "سكراب جسم طبي", "سكراب جسم بالانجليزي"],
    "زبدة الشيا": ["زبدة الشيا", "زبدة الشيا للشعر", "زبدة الشيا للجسم", "زبدة الشيا امتنان", "زبدة الشيا الخام في الصيدليات", "زبدة الشيا للوجه", "زبدة الشيا الخام", "زبدة الشيا افريكانا", "زبدة الشيا الاصلية", "زبدة الشيا الحواج"],
    "مخمرية": ["مخمرية العود الملكي", "مخمرية", "مخمرية للجسم", "مخمرية رجالي", "مخمرية فيونكة", "مخمرية رنة خلخال", "مخمرية بودي", "مخمرية للجسم للنساء", "مخمرية يارا", "مخمرية مايت سينما"],
    "ملح سيوة": ["ملح سيوة", "ملح سيوة الصخري", "ملح سيوة للبيع", "ملح سيوة بالانجليزي", "ملح سيوة بالفرنسية", "ملح سيوة للتصدير", "اباجورة ملح سيوة", "فوائد ملح سيوة للبشرة", "فوائد ملح سيوة", "بحيرات ملح سيوة"],
}

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

diff_fx = diff(fx, PREV)
diff_ch = diff(ch, PREV)

stamp = now_eet.strftime("%Y-%m-%d-%H%M")
out = {
    "run": "zyra-search-language-scan",
    "fetched_at_eet": now_eet.strftime("%Y-%m-%d %H:%M EET"),
    "fetched_at_utc": now_utc.strftime("%Y-%m-%dT%H:%MZ"),
    "source": "suggestqueries.google.com/complete/search?client=firefox|chrome&hl=ar&gl=eg",
    "previous_snapshot": "space stored suggestions after 07:10 EET run (lastScanAt 2026-11-20T05:10:46Z)",
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
