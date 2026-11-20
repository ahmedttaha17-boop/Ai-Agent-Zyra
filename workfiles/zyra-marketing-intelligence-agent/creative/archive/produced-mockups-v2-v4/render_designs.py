#!/usr/bin/env python3
# ZYRA V2 static designs compositor v2 — fixed Arabic (Noto Sans Arabic) + no-overlap layout
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import arabic_reshaper
from bidi.algorithm import get_display

BASE = "/home/hatch/workspace/zyra-marketing-intelligence-agent/creative/produced-v2"
AST = BASE + "/assets"; OUT = BASE + "/designs"
FB = AST + "/Cairo-700.ttf"
FS = AST + "/Cairo-600.ttf"
FR = AST + "/Cairo-400.ttf"
W, H = 1080, 1350
IVORY = (250, 246, 239); WHITE = (255, 255, 255)
TEAL = (14, 79, 69); TEAL_D = (10, 56, 49); INK = (23, 53, 47)
TERRA = (201, 111, 74); TERRA_D = (176, 92, 58)
MUTED = (96, 110, 104); GOLD = (176, 134, 47); SAND = (243, 227, 194)
RED = (178, 58, 48); YELL = (247, 215, 116)

def font(size, w=400):
    return ImageFont.truetype(FB if w >= 700 else FS if w >= 600 else FR, size)
from PIL import features as _pf
USE_RAQM = _pf.check('raqm')
def sh(t):
    if USE_RAQM:
        return t.replace("%", "٪").replace(" + ", "، ").replace(" • ", "، ").replace(" — ", ": ")
    return get_display(arabic_reshaper.reshape(t))
def tw(d, t, f): return d.textlength(sh(t), font=f)
def wrap(d, t, f, maxw):
    words, lines, cur = t.split(), [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if tw(d, trial, f) <= maxw or not cur: cur = trial
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines
def right_text(d, xr, y, t, f, fill, maxw=952, lh=1.25):
    for ln in wrap(d, t, f, maxw):
        s = sh(ln); d.text((xr - d.textlength(s, font=f), y), s, font=f, fill=fill)
        y += int(f.size * lh)
    return y
def center_text(d, cx, y, t, f, fill, maxw, lh=1.25):
    for ln in wrap(d, t, f, maxw):
        s = sh(ln); d.text((cx - d.textlength(s, font=f) / 2, y), s, font=f, fill=fill)
        y += int(f.size * lh)
    return y
def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)
def paste_cover(canvas, img, box, radius=32, fx=0.5, fy=0.5):
    x0, y0, x1, y1 = box; bw, bh = x1 - x0, y1 - y0
    scale = max(bw / img.width, bh / img.height)
    im = img.resize((int(img.width * scale) + 2, int(img.height * scale) + 2))
    left = int((im.width - bw) * fx); top = int((im.height - bh) * fy)
    im = im.crop((left, top, left + bw, top + bh))
    mask = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, bw, bh], radius=radius, fill=255)
    canvas.paste(im, (x0, y0), mask)
def shadow(canvas, box, r=32):
    ov = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(ov).rounded_rectangle([box[0], box[1] + 10, box[2], box[3] + 10], radius=r, fill=(30, 40, 35, 60))
    canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), ov.filter(ImageFilter.GaussianBlur(14))).convert("RGB"), (0, 0))
def check(d, cx, cy, r, color, ok=True):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=5)
    if ok:
        d.line([cx - r * 0.5, cy, cx - r * 0.12, cy + r * 0.42], fill=color, width=6)
        d.line([cx - r * 0.12, cy + r * 0.42, cx + r * 0.55, cy - r * 0.45], fill=color, width=6)
    else:
        d.line([cx - r * 0.4, cy - r * 0.4, cx + r * 0.4, cy + r * 0.4], fill=color, width=6)
        d.line([cx + r * 0.4, cy - r * 0.4, cx - r * 0.4, cy + r * 0.4], fill=color, width=6)
def jar(d, x, y, wdt, hgt, fill):
    rrect(d, [x, y, x + wdt, y + hgt], 16, fill=fill)
    rrect(d, [x + 8, y - 18, x + wdt - 8, y + 6], 9, fill=tuple(max(0, c - 22) for c in fill))

KP = Image.open(AST + "/kp_routine.webp").convert("RGB")
CS = Image.open(AST + "/cs_routine.webp").convert("RGB")
WARN = "تنبيه: الريتينول لا يُستخدم أثناء الحمل والرضاعة"
SC = (388, 460)  # scene card size

def skeleton(code, seg, headline, bridge, solution, price, cta, note, bg, scene_img, img, warn=False, dark=False, fy=0.55):
    c = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(c)
    lg = Image.open(AST + "/logo.png").convert("RGBA"); lg.thumbnail((92, 92))
    c.paste(lg, (52, 38), lg); d = ImageDraw.Draw(c)
    f = font(29, 700); wdt = tw(d, seg, f) + 44
    rrect(d, [W - 56 - wdt, 50, W - 56, 108], 29, fill=TEAL if not dark else TERRA)
    s = sh(seg); d.text((W - 56 - wdt / 2, 79), s, font=f, fill=WHITE, anchor="mm")
    ink = WHITE if dark else INK
    y = right_text(d, W - 64, 158, headline, font(86, 700), ink, 952, 1.22)
    right_text(d, W - 64, y + 8, bridge, font(42, 400), (205, 220, 212) if dark else MUTED, 952, 1.3)
    # visual zone: scene card left + product right
    shadow(c, (64, 540, 452, 1000)); shadow(c, (476, 540, 1016, 1000)); d = ImageDraw.Draw(c)
    mask = Image.new("L", SC, 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, SC[0], SC[1]], radius=32, fill=255)
    c.paste(scene_img, (64, 540), mask)
    rrect(d, [64, 540, 452, 1000], 32, outline=(210, 200, 180), width=2)
    paste_cover(c, img, (476, 540, 1016, 1000), 32, fy=fy); d = ImageDraw.Draw(c)
    # solution card
    rrect(d, [64, 1024, W - 64, 1170], 26, fill=TEAL_D if not dark else WHITE)
    sf = font(39, 600); scol = WHITE if not dark else INK
    yy = 1042
    for ln in wrap(d, solution, sf, 600)[:2]:
        s = sh(ln); d.text((W - 96 - d.textlength(s, font=sf), yy), s, font=sf, fill=scol); yy += 52
    pf = font(37, 700); ps = sh(price)
    d.text((94, 1070), ps, font=pf, fill=GOLD if not dark else TERRA)
    # CTA row
    cf = font(44, 700); cw = tw(d, cta, cf) + 84
    rrect(d, [W - 64 - cw, 1192, W - 64, 1276], 42, fill=TERRA)
    s = sh(cta); d.text((W - 64 - cw / 2, 1234), s, font=cf, fill=WHITE, anchor="mm")
    nf = font(30, 400); ns = sh(note)
    d.text((64, 1218), ns, font=nf, fill=(205, 220, 212) if dark else MUTED)
    if warn:
        wf = font(26, 400); ws = sh(WARN)
        d.text(((W - d.textlength(ws, font=wf)) / 2, 1302), ws, font=wf, fill=(228, 196, 182) if dark else (150, 90, 70))
    c.save(OUT + "/" + code + ".png"); print("done", code)

def card(bg):
    im = Image.new("RGB", SC, bg); return im, ImageDraw.Draw(im)

def sc_countdown():
    im, d = card((252, 248, 238))
    d.ellipse([64, 60, 324, 320], outline=GOLD, width=9)
    d.ellipse([88, 84, 300, 296], outline=(224, 203, 156), width=3)
    center_text(d, 194, 138, "العد التنازلي", font(34, 700), GOLD, 240)
    center_text(d, 194, 190, "بدأ", font(52, 700), GOLD, 240)
    center_text(d, 194, 356, "لأجمل يوم في عمرك", font(30, 400), MUTED, 320)
    return im

def sc_shelf():
    im, d = card((240, 234, 224))
    for yy in (120, 300):
        d.line([28, yy + 108, 360, yy + 108], fill=(176, 166, 148), width=7)
        for xx in (52, 208):
            jar(d, xx, yy, 128, 108, (205, 197, 183))
            check(d, xx + 64, yy + 56, 24, (160, 95, 82), ok=False)
    center_text(d, 194, 22, "جرّبتي كل ده؟", font(32, 700), INK, 340)
    return im

def sc_story():
    im, d = card(TEAL_D)
    rrect(d, [54, 26, 334, 434], 34, outline=WHITE, width=6)
    paste_cover(im, KP, (66, 38, 322, 422), 28, fy=0.6); d = ImageDraw.Draw(im)
    for i, xx in enumerate((84, 148, 212)):
        d.line([xx, 58, xx + 48, 58], fill=TERRA if i == 0 else (255, 255, 255), width=6)
    return im

def sc_night():
    im, d = card((22, 40, 35))
    d.ellipse([216, 52, 356, 192], fill=(240, 230, 200))
    d.ellipse([252, 40, 372, 160], fill=(22, 40, 35))
    rnd = random.Random(3)
    for _ in range(26):
        x, y, r = rnd.randint(16, 372), rnd.randint(16, 300), rnd.randint(2, 4)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(232, 226, 202))
    center_text(d, 194, 330, "5 دقايق قبل النوم", font(36, 700), (240, 230, 200), 340)
    center_text(d, 194, 384, "بس كده.. وخلاص", font(28, 400), (190, 200, 190), 340)
    return im

def sc_hanger():
    im, d = card((252, 249, 243))
    d.arc([144, 40, 244, 140], start=180, end=360, fill=TEAL, width=6)
    d.line([194, 92, 64, 240], fill=TEAL, width=6); d.line([194, 92, 324, 240], fill=TEAL, width=6)
    d.line([64, 240, 324, 240], fill=TEAL, width=6)
    tag = Image.new("RGBA", (300, 128), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
    td.rounded_rectangle([4, 4, 296, 124], radius=14, fill=(255, 252, 244, 255), outline=TERRA, width=4)
    tag = tag.rotate(-7, expand=True); im.paste(tag, (48, 268), tag); d = ImageDraw.Draw(im)
    center_text(d, 196, 316, "البسي اللي بتحبيه", font(31, 700), TERRA_D, 280)
    return im

def sc_winter():
    im = Image.new("RGB", SC, (196, 216, 226)); d = ImageDraw.Draw(im)
    for row in range(3):
        yy = 26 + row * 26
        for x in range(10, 388, 40):
            off = 20 if row % 2 else 0
            d.line([x + off, yy + (11 if (x // 40) % 2 else 0), x + off + 20, yy + (0 if (x // 40) % 2 else 11)], fill=TERRA if row != 1 else TEAL, width=5)
    rnd = random.Random(11)
    for _ in range(60):
        x, y, r = rnd.randint(14, 374), rnd.randint(110, 446), rnd.randint(2, 5)
        d.ellipse([x - r, y - r, x + r, y + r], fill=WHITE)
    cx, cy = 194, 218
    for a in range(0, 180, 30):
        import math
        dx, dy = 44 * math.cos(math.radians(a)), 44 * math.sin(math.radians(a))
        d.line([cx - dx, cy - dy, cx + dx, cy + dy], fill=TEAL, width=6)
    d.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=TEAL)
    center_text(d, 194, 330, "موسم الجفاف بدأ", font(36, 700), TEAL_D, 340)
    center_text(d, 194, 386, "جلدك محتاج خطة شتا", font(28, 400), (70, 100, 110), 340)
    return im

def sc_beach():
    im, d = card(SAND)
    d.ellipse([118, 48, 270, 200], fill=(246, 214, 130))
    d.ellipse([118, 48, 270, 200], outline=(232, 192, 100), width=4)
    for i, col in enumerate((TEAL, TERRA, WHITE, TEAL)):
        d.rectangle([0, 300 + i * 26, 388, 326 + i * 26], fill=col)
    center_text(d, 194, 226, "جاهزة للمصيف؟", font(36, 700), TEAL_D, 340)
    return im

def sc_pack():
    im, d = card(WHITE)
    items = ["الفساتين", "الميكب", "البرفان", "روتين السيلوليت"]
    center_text(d, 194, 26, "قايمة الشنطة", font(33, 700), INK, 340)
    for i, it in enumerate(items):
        yy = 104 + i * 86; last = i == len(items) - 1
        rrect(d, [296, yy, 340, yy + 44], 10, outline=TERRA if last else MUTED, width=4)
        check(d, 318, yy + 22, 14, TERRA if last else TEAL)
        f = font(33, 700 if last else 400)
        s = sh(it); d.text((272 - d.textlength(s, font=f), yy + 4), s, font=f, fill=TERRA_D if last else INK)
    return im

def sc_board():
    im, d = card((16, 74, 64))
    rows = [("تمرين", True), ("أكل صحي", True), ("مية ونوم", True), ("عناية موضعية", False)]
    for i, (t, ok) in enumerate(rows):
        yy = 52 + i * 102
        check(d, 52, yy + 26, 23, (120, 220, 180) if ok else TERRA, ok=ok)
        f = font(37, 700 if not ok else 400); s = sh(t)
        d.text((352 - d.textlength(s, font=f), yy), s, font=f, fill=(255, 205, 180) if not ok else WHITE)
        if i < 3: d.line([36, yy + 72, 352, yy + 72], fill=(40, 95, 84), width=2)
    return im

def sc_flags():
    im, d = card((252, 249, 243))
    rows = ["هيختفي في أسبوع", "نتيجة من أول مرة", "هيقلل مقاسك بكريم"]
    center_text(d, 194, 24, "وعود اتقالت لك؟", font(32, 700), INK, 340)
    for i, t in enumerate(rows):
        yy = 116 + i * 108
        d.polygon([(36, yy), (36, yy + 42), (82, yy + 11)], fill=RED)
        d.line([36, yy, 36, yy + 60], fill=INK, width=5)
        f = font(35, 400); s = sh(t); x0 = 356 - d.textlength(s, font=f)
        d.text((x0, yy + 2), s, font=f, fill=MUTED)
        d.line([x0 - 6, yy + 24, 362, yy + 24], fill=RED, width=5)
    return im

def sc_desk():
    im, d = card((233, 220, 195))
    for (x, y, rot, t) in [(30, 60, -6, "قعدة طول اليوم"), (44, 252, 5, "جلدك محتاج روتين")]:
        note = Image.new("RGBA", (320, 168), (0, 0, 0, 0)); nd = ImageDraw.Draw(note)
        nd.rounded_rectangle([4, 4, 316, 164], radius=8, fill=YELL + (255,))
        nd.ellipse([146, 12, 174, 40], fill=TERRA + (255,))
        note = note.rotate(rot, expand=True); im.paste(note, (x, y), note); d = ImageDraw.Draw(im)
        center_text(d, x + 160, y + 66, t, font(33, 700), INK, 290)
    return im

SOL_KP = "روتين جلد الوزة الكامل: سكراب + لوشن يوريا 25% + زبدة شيا"
SOL_CS = "روتين السيلوليت: سكراب كافيين، كريم ريتينول بالليل"
N1 = "دفع عند الاستلام • استرجاع 14 يوم"; N2 = "دفع عند الاستلام"

skeleton("KA-1-bride", "شريحة: عروسة", "فرحي قرب.. ودراعي لسه خشن؟", "جلد الوزة محتاج روتين ثابت، مش كريم مرة وخلاص", SOL_KP, "799 ج بدل 1,020", "ابدئي من دلوقتي", N1, IVORY, sc_countdown(), KP)
skeleton("KA-2-switcher", "شريحة: جرّبت كتير", "صرفتي كام على كريمات ومفيش فرق؟", "المشكلة مكانتش فيكي.. كانت في منتج لوحده", SOL_KP, "799 ج بدل 1,020", "جرّبي السيستم كامل", N1, (243, 238, 228), sc_shelf(), KP)
skeleton("KA-3-gym", "شريحة: بنات الجيم", "بتتمرني.. والحبيبات محرجاكي؟", "العرق والاحتكاك بيبيّنوا جلد الوزة أكتر", SOL_KP, "799 ج", "اطلبي روتينك", N2, IVORY, sc_story(), KP)
skeleton("KA-4-mom", "شريحة: أم جديدة", "بقيتي أم.. ونسيتي نفسك؟", "دقايق قبل النوم ترجعلك ملمس دراعك", SOL_KP, "799 ج بدل 1,020", "ابدئي الليلة", N1, (24, 44, 39), sc_night(), KP, dark=True)
skeleton("KA-5-student", "شريحة: طالبات", "بتخبي دراعك حتى في الصيف؟", "الحبيبات الخشنة دي اسمها جلد الوزة.. وليها روتين", SOL_KP, "799 ج بدل 1,020", "ابدئي قبل الصيف", N2, IVORY, sc_hanger(), KP)
skeleton("KA-6-winter", "شريحة: جفاف الشتا", "الشتا جه.. وجلدك بقى ناشف وخشن؟", "جفاف الشتا بيضاعف جلد الوزة، والمرطب العادي بيقصر", "روتين الشتا: سكراب ناعم، لوشن يوريا 25%، شيا", "799 ج بدل 1,020", "جهزي جلدك للشتا", N1, IVORY, sc_winter(), KP)
skeleton("CA-1-beach", "شريحة: المصيف", "لسه هتتجنبي الشورت الصيف ده كمان؟", "ابدئي روتينك في البيت من دلوقتي", SOL_CS, "799 ج بدل 975", "اطلبي وابدئي", N2, SAND, sc_beach(), CS, warn=True)
skeleton("CA-2-honeymoon", "شريحة: عروسة مسافرة", "بتجهزي شنطة شهر العسل؟", "متسيبيش ملمس جسمك للصدفة", SOL_CS, "799 ج بدل 975", "ضيفيه لشنطتك", N2, IVORY, sc_pack(), CS, warn=True)
skeleton("CA-3-fit", "شريحة: ملتزمة صحياً", "بتتمرني وبتاكلي صح.. ولسه موجود؟", "السيلوليت مش ذنبك ومش مقياس مجهودك", "كمّلي بخطوة موضعية: سكراب كافيين، كريم ريتينول بالليل", "799 ج بدل 975", "كمّلي اللي ناقصك", N2, TEAL_D, sc_board(), CS, warn=True, dark=True)
skeleton("CA-4-skeptic", "شريحة: اتنصب عليها", "اتقالك قبل كده إنه هيختفي في أسبوع؟", "دي كانت كدبة بيع.. الحقيقة: ملمس ومظهر بيتحسنوا مع الانتظام", "روتين السيلوليت الكامل — ولو مش مناسبك: استرجاع 14 يوم", "799 ج بدل 975", "اطلبي من غير مخاطرة", N2, IVORY, sc_flags(), CS, warn=True)
skeleton("CA-5-office", "شريحة: موظفات", "شغل مكتب وقعدة طول اليوم؟", "جسمك محتاج حركة.. وجلدك محتاج روتين", "روتين مسائي: سكراب كافيين، كريم ريتينول بالليل", "799 ج بدل 975", "اطلبي روتينك المسائي", N2, (233, 220, 195), sc_desk(), CS, warn=True)
print("ALL DONE")
