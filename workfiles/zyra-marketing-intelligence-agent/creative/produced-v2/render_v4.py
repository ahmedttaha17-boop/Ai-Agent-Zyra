#!/usr/bin/env python3
# ZYRA statics V4 — visual-hook-first, decluttered, Ahmed's 03:03 corrections applied
_head = open("/home/hatch/workspace/zyra-marketing-intelligence-agent/creative/produced-v2/render_v3.py", encoding="utf-8").read().split("# ---------- KA-1")[0]
exec(_head)
import math, random
from PIL import Image, ImageDraw

KPT = Image.open(AST + "/kp_texture.webp").convert("RGB")
CST = Image.open(AST + "/cs_texture.webp").convert("RGB")
BEACH = Image.open(AST + "/beach.webp").convert("RGB")
BRIDE = Image.open(AST + "/bride.webp").convert("RGB")
SOL_CS3 = "روتين السيلوليت 3 قطع: صابونة كولاجين، سكراب كافيين، كريم ريتينول بالليل"
SOL_CS3S = "3 قطع: صابونة كولاجين، سكراب كافيين، كريم ريتينول بالليل"

def circle_img(c, img, cx, cy, r, ring=TEAL, wdt=6):
    paste_cover(c, img, (cx - r, cy - r, cx + r, cy + r), r, fy=0.5)
    ImageDraw.Draw(c).ellipse([cx - r, cy - r, cx + r, cy + r], outline=ring, width=wdt)

# KA-1 bride: countdown + bride visual + texture inset, clean bottom row
def ka1():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: عروسة")
    d.ellipse([396, 128, 684, 416], outline=GOLD, width=9)
    center_text(d, 540, 224, "العد التنازلي", font(40, 700), GOLD, 280)
    center_text(d, 540, 282, "بدأ", font(60, 700), GOLD, 280)
    y = center_text(d, 540, 452, "فرحي قرب.. ودراعي لسه خشن؟", font(82, 700), INK, 980, 1.22)
    center_text(d, 540, y + 4, "جلد الوزة محتاج روتين ثابت، مش كريم مرة وخلاص", font(41, 400), MUTED, 940)
    shadow(c, (64, 800, 1016, 1130)); paste_cover(c, BRIDE, (64, 800, 1016, 1130), 32, fy=0.45); d = ImageDraw.Draw(c)
    circle_img(c, KPT, 176, 1018, 88, ring=WHITE, wdt=7)
    f = font(38, 700); pw = tw(d, "799 ج بدل 1,020", f) + 48
    rrect(d, [64, 1180, 64 + pw, 1264], 42, fill=TEAL)
    d.text((64 + pw / 2, 1222), sh("799 ج بدل 1,020"), font=f, fill=GOLD, anchor="mm")
    cta_pill(d, W - 64, 1180, "ابدئي من دلوقتي")
    center_text(d, 540, 1292, SOL_KP, font(31, 600), TEAL, 980)
    c.save(OUT + "/KA-1-bride.png"); print("KA-1")

# KA-2 switcher: 2 big shelves + texture inset + dark band, one clean row
def ka2():
    c = Image.new("RGB", (W, H), (243, 238, 228)); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: جرّبت كتير")
    for row, yy in enumerate((210, 420)):
        d.line([56, yy + 140, 1024, yy + 140], fill=(176, 166, 148), width=9)
        for i, xx in enumerate((110, 390, 670)):
            jar(d, xx, yy, 210, 140, (205, 197, 183) if (i + row) % 2 else (196, 206, 198))
            check(d, xx + 105, yy + 74, 32, (160, 95, 82), ok=False)
    shadow(c, (56, 596, 330, 856)); paste_cover(c, KPT, (56, 596, 330, 856), 26, fy=0.5); d = ImageDraw.Draw(c)
    rrect(d, [56, 596, 330, 856], 26, outline=WHITE, width=6)
    d.rectangle([0, 700, W, H], fill=TEAL_D); d = ImageDraw.Draw(c)
    paste_cover(c, KPT, (56, 596, 330, 856), 26, fy=0.5); d = ImageDraw.Draw(c)
    rrect(d, [56, 596, 330, 856], 26, outline=WHITE, width=6)
    y = right_text(d, W - 64, 730, "صرفتي كام على كريمات ومفيش فرق؟", font(76, 700), WHITE, 952, 1.22)
    y = right_text(d, W - 64, y + 10, "المشكلة مكانتش فيكي.. كانت في منتج لوحده", font(41, 400), LIGHT, 952)
    right_text(d, W - 64, y + 16, SOL_KP, font(39, 600), WHITE, 952)
    d.text((64, 1186), sh("799 ج بدل 1,020"), font=font(38, 700), fill=GOLD)
    cta_pill(d, W - 64, 1168, "جرّبي السيستم كامل")
    c.save(OUT + "/KA-2-switcher.png"); print("KA-2")

# KA-3 gym: phone full of problem texture, new hook, lean column
def ka3():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c); logo(c)
    rrect(d, [566, 110, 1024, 1240], 56, fill=TEAL_D)
    paste_cover(c, KPT, (584, 128, 1006, 1222), 44, fy=0.5); d = ImageDraw.Draw(c)
    for i, xx in enumerate((612, 700, 788)):
        d.line([xx, 158, xx + 64, 158], fill=TERRA if i == 0 else WHITE, width=7)
    chip_l(d, 64, 150, "شريحة: بنات الجيم")
    y = right_text(d, 520, 260, "بتتمرني ودراعك لسه خشن؟", font(74, 700), INK, 456, 1.22)
    y = right_text(d, 520, y + 12, "العرق والاحتكاك بيبيّنوا جلد الوزة أكتر", font(40, 400), MUTED, 456)
    y = right_text(d, 520, y + 22, SOL_KP, font(37, 600), TEAL, 456)
    d.text((520 - tw(d, "799 ج", font(46, 700)), y + 26), sh("799 ج"), font=font(46, 700), fill=GOLD)
    cta_pill(d, 520, 1090, "اطلبي روتينك")
    c.save(OUT + "/KA-3-gym.png"); print("KA-3")

# KA-4 mom: night, product + texture circle, slim solution row
def ka4():
    c = Image.new("RGB", (W, H), (24, 44, 39)); d = ImageDraw.Draw(c)
    rnd = random.Random(5)
    for _ in range(20):
        x, y, r = rnd.randint(300, 700), rnd.randint(36, 140), rnd.randint(2, 4)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(232, 226, 202))
    d.ellipse([52, 316, 182, 446], fill=(240, 230, 200))
    d.ellipse([88, 302, 200, 414], fill=(24, 44, 39))
    lg = Image.open(AST + "/logo.png").convert("RGBA"); lg.thumbnail((92, 92)); c.paste(lg, (52, 38), lg); d = ImageDraw.Draw(c)
    chip_r(d, W - 56, 50, "شريحة: أم جديدة", TERRA)
    y = center_text(d, 540, 168, "بقيتي أم.. ونسيتي نفسك؟", font(84, 700), WHITE, 980, 1.22)
    center_text(d, 540, y + 8, "دقايق قبل النوم ترجعلك ملمس دراعك", font(42, 400), LIGHT, 940)
    shadow(c, (250, 520, 830, 950)); paste_cover(c, KP, (250, 520, 830, 950), 36, fy=0.55); d = ImageDraw.Draw(c)
    circle_img(c, KPT, 268, 540, 84, ring=WHITE, wdt=7)
    rrect(d, [140, 1000, 940, 1130], 26, fill=WHITE)
    right_text(d, 908, 1022, SOL_KP, font(36, 600), INK, 520, 1.3)
    d.text((168, 1036), sh("799 ج"), font=font(40, 700), fill=TERRA_D)
    d.text((168, 1090), sh("بدل 1,020"), font=font(28, 400), fill=MUTED)
    wdt = tw(d, "ابدئي الليلة", font(44, 700)) + 84
    rrect(d, [540 - wdt / 2, 1170, 540 + wdt / 2, 1254], 42, fill=TERRA)
    d.text((540, 1212), sh("ابدئي الليلة"), font=font(44, 700), fill=WHITE, anchor="mm")
    center_text(d, 540, 1280, N1, font(27, 400), LIGHT, 900)
    c.save(OUT + "/KA-4-mom.png"); print("KA-4")

# KA-5 student: hanger + texture polaroid + corner block
def ka5():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: طالبات")
    d.arc([478, 92, 602, 216], start=180, end=360, fill=TEAL, width=8)
    d.line([540, 152, 540, 216], fill=TEAL, width=8)
    d.line([540, 216, 190, 520], fill=TEAL, width=8); d.line([540, 216, 890, 520], fill=TEAL, width=8)
    d.line([190, 520, 890, 520], fill=TEAL, width=8)
    tag = Image.new("RGBA", (330, 140), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
    td.rounded_rectangle([4, 4, 326, 136], radius=16, fill=(255, 252, 244, 255), outline=TERRA, width=4)
    tag = tag.rotate(-8, expand=True); c.paste(tag, (600, 500), tag); d = ImageDraw.Draw(c)
    center_text(d, 748, 552, "البسي اللي بتحبيه", font(33, 700), TERRA_D, 300)
    pol = Image.new("RGBA", (300, 350), (0, 0, 0, 0)); pd = ImageDraw.Draw(pol)
    pd.rectangle([0, 0, 300, 350], fill=WHITE)
    paste_cover(pol, KPT, (12, 12, 288, 268), 2, fy=0.5); pd = ImageDraw.Draw(pol)
    center_text(pd, 150, 288, "ملمس الدراع دلوقتي", font(26, 600), INK, 280)
    pol = pol.rotate(5, expand=True, resample=Image.BICUBIC)
    c.paste(pol, (90, 560), pol); d = ImageDraw.Draw(c)
    y = center_text(d, 540, 950, "بتخبي دراعك حتى في الصيف؟", font(72, 700), INK, 980, 1.22)
    shadow(c, (64, 1130, 400, 1310)); paste_cover(c, KP, (64, 1130, 400, 1310), 24, fy=0.6); d = ImageDraw.Draw(c)
    d.rectangle([440, 1100, W, H], fill=TEAL_D); d = ImageDraw.Draw(c)
    yy = right_text(d, W - 48, 1124, SOL_KP, font(31, 600), WHITE, 560, 1.3)
    d.text((W - 48 - tw(d, "799 ج بدل 1,020", font(36, 700)), yy + 6), sh("799 ج بدل 1,020"), font=font(36, 700), fill=GOLD)
    wdt = tw(d, "ابدئي قبل الصيف", font(38, 700)) + 72
    rrect(d, [W - 48 - wdt, 1252, W - 48, 1328], 38, fill=TERRA)
    d.text((W - 48 - wdt / 2, 1290), sh("ابدئي قبل الصيف"), font=font(38, 700), fill=WHITE, anchor="mm")
    c.save(OUT + "/KA-5-student.png"); print("KA-5")

# KA-6 winter: diagonal, texture circle + product circle, clean band
def ka6():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c)
    d.polygon([(0, 0), (1080, 0), (0, 800)], fill=(196, 216, 226))
    rnd = random.Random(11)
    for _ in range(70):
        x, y, r = rnd.randint(10, 700), rnd.randint(10, 500), rnd.randint(2, 5)
        if x + y < 900: d.ellipse([x - r, y - r, x + r, y + r], fill=WHITE)
    cx, cy = 110, 545
    for a in range(0, 180, 30):
        dx, dy = 44 * math.cos(math.radians(a)), 44 * math.sin(math.radians(a))
        d.line([cx - dx, cy - dy, cx + dx, cy + dy], fill=TEAL, width=6)
    logo(c); chip_r(d, W - 56, 50, "شريحة: جفاف الشتا")
    y = right_text(d, W - 64, 170, "الشتا جه.. وجلدك بقى ناشف وخشن؟", font(82, 700), INK, 952, 1.22)
    right_text(d, W - 64, y + 8, "جفاف الشتا بيضاعف جلد الوزة، والمرطب العادي بيقصر", font(42, 400), MUTED, 952)
    circle_img(c, KPT, 240, 760, 150, ring=WHITE, wdt=8)
    circle_img(c, KP, 800, 800, 205, ring=TEAL, wdt=6)
    left_text(d, 64, 950, "موسم الجفاف بدأ", font(40, 700), TEAL_D, 480)
    d.rectangle([0, 1150, W, H], fill=(196, 216, 226)); d = ImageDraw.Draw(c)
    right_text(d, W - 64, 1170, "روتين الشتا: سكراب ناعم، لوشن يوريا 25%، شيا", font(36, 600), TEAL_D, 660)
    d.text((64, 1178), sh("799 ج بدل 1,020"), font=font(36, 700), fill=TERRA_D)
    cta_pill(d, W - 64, 1258, "جهزي جلدك للشتا", h=74)
    c.save(OUT + "/KA-6-winter.png"); print("KA-6")

# CA-1 beach: NEW headline + swimsuit hero
def ca1():
    c = Image.new("RGB", (W, H), SAND); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: المصيف")
    y = right_text(d, W - 64, 140, "الصيف الجاي هتلبسي المايوه اللي نفسك فيه", font(78, 700), INK, 952, 1.22)
    right_text(d, W - 64, y + 6, "السر إنك تبدئي من دلوقتي", font(42, 400), MUTED, 952)
    paste_cover(c, BEACH, (0, 470, 1080, 1010), 0, fy=0.5); d = ImageDraw.Draw(c)
    d.rectangle([0, 1010, W, H], fill=IVORY); d = ImageDraw.Draw(c)
    right_text(d, W - 64, 1034, SOL_CS3, font(37, 600), TEAL_D, 690)
    d.text((64, 1044), sh("799 ج بدل 975"), font=font(37, 700), fill=TERRA_D)
    cta_pill(d, W - 64, 1150, "اطلبي وابدئي")
    warn_line(d, 1300)
    c.save(OUT + "/CA-1-beach.png"); print("CA-1")

# CA-2 honeymoon doc (decluttered: no bottom note)
def ca2():
    c = Image.new("RGB", (W, H), (253, 251, 246)); d = ImageDraw.Draw(c)
    for yy in range(210, 1330, 92):
        d.line([40, yy, 1040, yy], fill=(214, 222, 228), width=2)
    d.line([130, 0, 130, H], fill=(232, 190, 180), width=3)
    logo(c, 170, 36)
    chip_r(d, W - 56, 50, "شريحة: عروسة مسافرة")
    y = right_text(d, W - 64, 150, "بتجهزي شنطة شهر العسل؟", font(80, 700), INK, 880, 1.22)
    right_text(d, W - 64, y + 4, "متسيبيش ملمس جسمك للصدفة", font(40, 400), MUTED, 880)
    items = ["الفساتين", "الميكب", "البرفان", "الشوز", "روتين السيلوليت"]
    for i, it in enumerate(items):
        yy = 428 + i * 92; last = i == len(items) - 1
        rrect(d, [950, yy, 998, yy + 48], 10, outline=TERRA if last else MUTED, width=4)
        check(d, 974, yy + 24, 15, TERRA if last else TEAL)
        f = font(40, 700 if last else 400)
        s = sh(it); d.text((922 - d.textlength(s, font=f), yy + 2), s, font=f, fill=TERRA_D if last else INK)
        if last: d.line([922 - d.textlength(s, font=f), yy + 56, 930, yy + 56], fill=TERRA, width=4)
    ph = Image.new("RGBA", (420, 330), (0, 0, 0, 0)); pd = ImageDraw.Draw(ph)
    pd.rectangle([0, 0, 420, 330], fill=WHITE)
    paste_cover(ph, CS, (14, 14, 406, 268), 4, fy=0.5)
    ph = ph.rotate(-6, expand=True, resample=Image.BICUBIC)
    c.paste(ph, (120, 920), ph); d = ImageDraw.Draw(c)
    d.ellipse([800, 900, 1010, 1110], fill=GOLD)
    center_text(d, 905, 952, "799 ج", font(46, 700), WHITE, 190)
    center_text(d, 905, 1010, "بدل 975", font(30, 700), WHITE, 190)
    wdt = tw(d, "ضيفيه لشنطتك", font(44, 700)) + 84
    pill = Image.new("RGBA", (int(wdt) + 8, 96), (0, 0, 0, 0)); pd2 = ImageDraw.Draw(pill)
    pd2.rounded_rectangle([4, 4, wdt + 4, 92], radius=44, fill=TERRA + (255,))
    pd2.text(((wdt + 8) / 2, 48), sh("ضيفيه لشنطتك"), font=font(44, 700), fill=WHITE, anchor="mm")
    pill = pill.rotate(-4, expand=True, resample=Image.BICUBIC)
    c.paste(pill, (560, 1160), pill); d = ImageDraw.Draw(c)
    warn_line(d, 1312)
    c.save(OUT + "/CA-2-honeymoon.png"); print("CA-2")

# CA-3 fit: board with Egyptian row + texture inset
def ca3():
    c = Image.new("RGB", (W, H), TEAL_D); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: ملتزمة صحياً", TERRA)
    y = right_text(d, W - 64, 150, "بتتمرني وبتاكلي صح.. ولسه موجود؟", font(80, 700), WHITE, 952, 1.22)
    right_text(d, W - 64, y + 8, "السيلوليت مش ذنبك ومش مقياس مجهودك", font(42, 400), LIGHT, 952)
    rrect(d, [64, 470, 1016, 906], 26, fill=(16, 74, 64), outline=(52, 110, 98), width=3)
    rows = [("تمرين", True), ("أكل صحي", True), ("مية ونوم", True), ("سكراب وكريم", False)]
    for i, (t, ok) in enumerate(rows):
        yy = 506 + i * 102
        check(d, 140, yy + 28, 25, (120, 220, 180) if ok else TERRA, ok=ok)
        f = font(44, 700 if not ok else 400); s = sh(t)
        d.text((940 - d.textlength(s, font=f), yy), s, font=f, fill=(255, 205, 180) if not ok else WHITE)
        if i < 3: d.line([110, yy + 76, 970, yy + 76], fill=(40, 95, 84), width=2)
    shadow(c, (64, 946, 400, 1246)); paste_cover(c, CST, (64, 946, 400, 1246), 28, fy=0.5); d = ImageDraw.Draw(c)
    yy = right_text(d, W - 64, 956, "اللي ناقصك: صابونة كولاجين، سكراب كافيين، كريم ريتينول بالليل", font(37, 600), WHITE, 540)
    d.text((W - 64 - tw(d, "799 ج بدل 975", font(38, 700)), yy + 14), sh("799 ج بدل 975"), font=font(38, 700), fill=GOLD)
    cta_pill(d, W - 64, 1150, "كمّلي اللي ناقصك")
    warn_line(d, 1304, dark=True)
    c.save(OUT + "/CA-3-fit.png"); print("CA-3")

# CA-4 skeptic: full-height problem texture right
def ca4():
    c = Image.new("RGB", (W, H), IVORY)
    paste_cover(c, CST, (712, 0, 1080, 1350), 0, fx=0.5, fy=0.5); d = ImageDraw.Draw(c)
    logo(c)
    chip_l(d, 52, 150, "شريحة: اتنصب عليها")
    y = right_text(d, 664, 240, "اتقالك قبل كده إنه هيختفي في أسبوع؟", font(68, 700), INK, 612, 1.22)
    y = right_text(d, 664, y + 8, "دي كانت كدبة بيع.. الحقيقة: ملمس ومظهر بيتحسنوا مع الانتظام", font(36, 400), MUTED, 612)
    rows = ["هيختفي في أسبوع", "نتيجة من أول مرة", "هيقلل مقاسك بكريم"]
    for i, t in enumerate(rows):
        yy = y + 30 + i * 84
        d.polygon([(600, yy), (600, yy + 40), (646, yy + 11)], fill=RED)
        d.line([600, yy, 600, yy + 58], fill=INK, width=5)
        f = font(37, 400); s = sh(t); x0 = 570 - d.textlength(s, font=f)
        d.text((x0, yy + 2), s, font=f, fill=MUTED)
        d.line([x0 - 6, yy + 24, 578, yy + 24], fill=RED, width=5)
    by = y + 30 + 3 * 84 + 16
    rrect(d, [40, by, 664, by + 168], 24, fill=TEAL_D)
    right_text(d, 632, by + 18, "روتين السيلوليت الكامل 3 قطع: ولو مش مناسبك، استرجاع 14 يوم", font(34, 600), WHITE, 560)
    d.text((64, by + 100), sh("799 ج بدل 975"), font=font(35, 700), fill=GOLD)
    cta_pill(d, 664, by + 196, "اطلبي من غير مخاطرة")
    wf = font(23, 400); ws = sh(WARN)
    d.text((40, 1312), ws, font=wf, fill=(150, 90, 70))
    c.save(OUT + "/CA-4-skeptic.png"); print("CA-4")

# CA-5 office collage: texture polaroid
def ca5():
    c = Image.new("RGB", (W, H), (233, 220, 195)); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: موظفات")
    def note(x, y, wdt, hgt, rot, draw_fn):
        nt = Image.new("RGBA", (wdt, hgt), (0, 0, 0, 0)); nd = ImageDraw.Draw(nt)
        nd.rounded_rectangle([4, 4, wdt - 4, hgt - 4], radius=10, fill=YELL + (255,))
        nd.ellipse([wdt / 2 - 14, 12, wdt / 2 + 14, 40], fill=TERRA + (255,))
        draw_fn(nd, wdt, hgt)
        nt = nt.rotate(rot, expand=True, resample=Image.BICUBIC)
        c.paste(nt, (x, y), nt)
    def n1(nd, wdt, hgt):
        center_text(nd, wdt / 2, 58, "شغل مكتب وقعدة", font(44, 700), INK, wdt - 40)
        center_text(nd, wdt / 2, 122, "طول اليوم؟", font(44, 700), INK, wdt - 40)
    note(56, 150, 470, 230, -5, n1)
    def n2(nd, wdt, hgt):
        center_text(nd, wdt / 2, 52, "جسمك محتاج حركة.. وجلدك محتاج روتين", font(33, 600), TEAL_D, wdt - 36)
    note(500, 420, 500, 190, 4, n2)
    pol = Image.new("RGBA", (470, 560), (0, 0, 0, 0)); pd = ImageDraw.Draw(pol)
    pd.rectangle([0, 0, 470, 560], fill=WHITE)
    paste_cover(pol, CST, (18, 18, 452, 452), 2, fy=0.5); pd = ImageDraw.Draw(pol)
    center_text(pd, 235, 478, "ملمس الفخد دلوقتي", font(32, 600), INK, 420)
    pol = pol.rotate(3, expand=True, resample=Image.BICUBIC)
    c.paste(pol, (90, 620), pol); d = ImageDraw.Draw(c)
    def n3(nd, wdt, hgt):
        center_text(nd, wdt / 2, 40, SOL_CS3S, font(30, 600), TEAL_D, wdt - 30)
        center_text(nd, wdt / 2, 138, "799 ج بدل 975", font(33, 700), TERRA_D, wdt - 32)
    note(590, 700, 440, 210, -3, n3)
    cta_pill(d, W - 64, 1150, "اطلبي روتينك المسائي")
    warn_line(d, 1306)
    c.save(OUT + "/CA-5-office.png"); print("CA-5")

for fn in (ka1, ka2, ka3, ka4, ka5, ka6, ca1, ca2, ca3, ca4, ca5):
    fn()
print("ALL V4 DONE")
