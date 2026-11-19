#!/usr/bin/env python3
# ZYRA statics V3 — 11 genuinely different compositions (one layout per angle)
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import arabic_reshaper
from bidi.algorithm import get_display
from PIL import features as _pf

BASE = "/home/hatch/workspace/zyra-marketing-intelligence-agent/creative/produced-v2"
AST = BASE + "/assets"; OUT = BASE + "/designs"
FB, FS, FR = AST + "/Cairo-700.ttf", AST + "/Cairo-600.ttf", AST + "/Cairo-400.ttf"
W, H = 1080, 1350
IVORY = (250, 246, 239); WHITE = (255, 255, 255)
TEAL = (14, 79, 69); TEAL_D = (10, 56, 49); INK = (23, 53, 47)
TERRA = (201, 111, 74); TERRA_D = (176, 92, 58)
MUTED = (96, 110, 104); GOLD = (176, 134, 47); SAND = (243, 227, 194)
RED = (178, 58, 48); YELL = (247, 215, 116); LIGHT = (205, 220, 212)

def font(size, w=400):
    return ImageFont.truetype(FB if w >= 700 else FS if w >= 600 else FR, size)
def sh(t):
    if _pf.check('raqm'):
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
def left_text(d, x, y, t, f, fill, maxw=952, lh=1.25):
    for ln in wrap(d, t, f, maxw):
        d.text((x, y), sh(ln), font=f, fill=fill); y += int(f.size * lh)
    return y
def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)
def paste_cover(canvas, img, box, radius=0, fx=0.5, fy=0.5):
    x0, y0, x1, y1 = [int(v) for v in box]; bw, bh = x1 - x0, y1 - y0
    scale = max(bw / img.width, bh / img.height)
    im = img.resize((int(img.width * scale) + 2, int(img.height * scale) + 2))
    left = int((im.width - bw) * fx); top = int((im.height - bh) * fy)
    im = im.crop((left, top, left + bw, top + bh))
    if radius:
        mask = Image.new("L", (bw, bh), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, bw, bh], radius=radius, fill=255)
        canvas.paste(im, (x0, y0), mask)
    else:
        canvas.paste(im, (x0, y0))
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
def logo(c, x=52, y=38, h=92):
    lg = Image.open(AST + "/logo.png").convert("RGBA"); lg.thumbnail((h, h)); c.paste(lg, (x, y), lg)
def chip_r(d, xr, y, t, fill=TEAL):
    f = font(29, 700); wdt = tw(d, t, f) + 44
    rrect(d, [xr - wdt, y, xr, y + 58], 29, fill=fill)
    d.text((xr - wdt / 2, y + 29), sh(t), font=f, fill=WHITE, anchor="mm")
def chip_l(d, x, y, t, fill=TEAL):
    f = font(29, 700); wdt = tw(d, t, f) + 44
    rrect(d, [x, y, x + wdt, y + 58], 29, fill=fill)
    d.text((x + wdt / 2, y + 29), sh(t), font=f, fill=WHITE, anchor="mm")
    return wdt
def cta_pill(d, xr, y, t, h=84):
    f = font(44, 700); wdt = tw(d, t, f) + 84
    rrect(d, [xr - wdt, y, xr, y + h], h // 2, fill=TERRA)
    d.text((xr - wdt / 2, y + h / 2), sh(t), font=f, fill=WHITE, anchor="mm")
    return wdt
def warn_line(d, y, dark=False):
    f = font(26, 400); s = sh(WARN)
    d.text(((W - d.textlength(s, font=f)) / 2, y), s, font=f, fill=(228, 196, 182) if dark else (150, 90, 70))

KP = Image.open(AST + "/kp_routine.webp").convert("RGB")
CS = Image.open(AST + "/cs_routine.webp").convert("RGB")
WARN = "تنبيه: الريتينول لا يُستخدم أثناء الحمل والرضاعة"
SOL_KP = "روتين جلد الوزة الكامل: سكراب، لوشن يوريا 25%، زبدة شيا"
SOL_CS = "روتين السيلوليت: سكراب كافيين، كريم ريتينول بالليل"
N1 = "دفع عند الاستلام، استرجاع 14 يوم"; N2 = "دفع عند الاستلام"

# ---------- KA-1: centered countdown poster ----------
def ka1():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: عروسة")
    d.ellipse([370, 150, 710, 490], outline=GOLD, width=10)
    d.ellipse([398, 178, 682, 462], outline=(224, 203, 156), width=3)
    center_text(d, 540, 252, "العد التنازلي", font(42, 700), GOLD, 300)
    center_text(d, 540, 312, "بدأ", font(66, 700), GOLD, 300)
    y = center_text(d, 540, 540, "فرحي قرب.. ودراعي لسه خشن؟", font(84, 700), INK, 980, 1.22)
    y = center_text(d, 540, y + 6, "جلد الوزة محتاج روتين ثابت، مش كريم مرة وخلاص", font(42, 400), MUTED, 940)
    center_text(d, 540, y + 16, SOL_KP, font(40, 600), TEAL, 960)
    shadow(c, (64, 952, 1016, 1142)); paste_cover(c, KP, (64, 952, 1016, 1142), 32, fy=0.62); d = ImageDraw.Draw(c)
    f = font(38, 700); pw = tw(d, "799 ج بدل 1,020", f) + 48
    rrect(d, [64, 1180, 64 + pw, 1264], 42, fill=TEAL)
    d.text((64 + pw / 2, 1222), sh("799 ج بدل 1,020"), font=f, fill=GOLD, anchor="mm")
    cta_pill(d, W - 64, 1180, "ابدئي من دلوقتي")
    center_text(d, 540, 1296, N1, font(28, 400), MUTED, 900)
    c.save(OUT + "/KA-1-bride.png"); print("KA-1")

# ---------- KA-2: shelf scene + dark band ----------
def ka2():
    c = Image.new("RGB", (W, H), (243, 238, 228)); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: جرّبت كتير")
    for row, yy in enumerate((196, 376, 556)):
        d.line([56, yy + 118, 1024, yy + 118], fill=(176, 166, 148), width=8)
        for i, xx in enumerate((86, 322, 558, 794)):
            jar(d, xx, yy, 168, 118, (205, 197, 183) if (i + row) % 2 else (196, 206, 198))
            check(d, xx + 84, yy + 62, 26, (160, 95, 82), ok=False)
    d.rectangle([0, 716, W, H], fill=TEAL_D); d = ImageDraw.Draw(c)
    y = right_text(d, W - 64, 748, "صرفتي كام على كريمات ومفيش فرق؟", font(78, 700), WHITE, 952, 1.22)
    y = right_text(d, W - 64, y + 8, "المشكلة مكانتش فيكي.. كانت في منتج لوحده", font(42, 400), LIGHT, 952)
    right_text(d, W - 64, y + 18, SOL_KP, font(40, 600), WHITE, 952)
    f = font(38, 700); d.text((64, 1170), sh("799 ج بدل 1,020"), font=f, fill=GOLD)
    cta_pill(d, W - 64, 1152, "جرّبي السيستم كامل")
    right_text(d, W - 64, 1272, N1, font(28, 400), LIGHT, 952)
    c.save(OUT + "/KA-2-switcher.png"); print("KA-2")

# ---------- KA-3: story phone split ----------
def ka3():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c); logo(c)
    rrect(d, [566, 110, 1024, 1240], 56, fill=TEAL_D)
    paste_cover(c, KP, (584, 128, 1006, 1222), 44, fy=0.55); d = ImageDraw.Draw(c)
    for i, xx in enumerate((612, 700, 788)):
        d.line([xx, 158, xx + 64, 158], fill=TERRA if i == 0 else WHITE, width=7)
    chip_l(d, 64, 150, "شريحة: بنات الجيم")
    y = right_text(d, 520, 250, "بتتمرني.. والحبيبات محرجاكي؟", font(72, 700), INK, 456, 1.22)
    y = right_text(d, 520, y + 10, "العرق والاحتكاك بيبيّنوا جلد الوزة أكتر", font(40, 400), MUTED, 456)
    y = right_text(d, 520, y + 20, SOL_KP, font(38, 600), TEAL, 456)
    d.text((520 - tw(d, "799 ج", font(44, 700)), y + 24), sh("799 ج"), font=font(44, 700), fill=GOLD)
    cta_pill(d, 520, 1080, "اطلبي روتينك")
    right_text(d, 520, 1196, N2, font(28, 400), MUTED, 456)
    c.save(OUT + "/KA-3-gym.png"); print("KA-3")

# ---------- KA-4: dark night centered ----------
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
    rrect(d, [140, 990, 940, 1172], 26, fill=WHITE)
    yy = center_text(d, 540, 1008, SOL_KP, font(37, 600), INK, 700)
    f = font(36, 700); s = sh("799 ج بدل 1,020")
    d.text(((W - d.textlength(s, font=f)) / 2, 1106), s, font=f, fill=TERRA_D)
    wdt = tw(d, "ابدئي الليلة", font(44, 700)) + 84
    rrect(d, [540 - wdt / 2, 1198, 540 + wdt / 2, 1282], 42, fill=TERRA)
    d.text((540, 1240), sh("ابدئي الليلة"), font=font(44, 700), fill=WHITE, anchor="mm")
    center_text(d, 540, 1298, N1, font(28, 400), LIGHT, 900)
    c.save(OUT + "/KA-4-mom.png"); print("KA-4")

# ---------- KA-5: minimal hanger asymmetric ----------
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
    y = center_text(d, 540, 690, "بتخبي دراعك حتى في الصيف؟", font(82, 700), INK, 980, 1.22)
    center_text(d, 540, y + 6, "الحبيبات الخشنة دي اسمها جلد الوزة.. وليها روتين", font(42, 400), MUTED, 940)
    shadow(c, (64, 1010, 440, 1296)); paste_cover(c, KP, (64, 1010, 440, 1296), 28, fy=0.6); d = ImageDraw.Draw(c)
    d.rectangle([520, 1010, W, H], fill=TEAL_D); d = ImageDraw.Draw(c)
    yy = right_text(d, W - 48, 1040, SOL_KP, font(34, 600), WHITE, 470, 1.3)
    right_text(d, W - 48, yy + 10, "799 ج بدل 1,020", font(40, 700), GOLD, 470)
    wdt = tw(d, "ابدئي قبل الصيف", font(42, 700)) + 80
    rrect(d, [W - 48 - wdt, 1216, W - 48, 1296], 40, fill=TERRA)
    d.text((W - 48 - wdt / 2, 1256), sh("ابدئي قبل الصيف"), font=font(42, 700), fill=WHITE, anchor="mm")
    c.save(OUT + "/KA-5-student.png"); print("KA-5")

# ---------- KA-6: diagonal winter ----------
def ka6():
    c = Image.new("RGB", (W, H), IVORY); d = ImageDraw.Draw(c)
    d.polygon([(0, 0), (1080, 0), (0, 800)], fill=(196, 216, 226))
    rnd = random.Random(11)
    for _ in range(70):
        x, y, r = rnd.randint(10, 700), rnd.randint(10, 500), rnd.randint(2, 5)
        if x + y < 900: d.ellipse([x - r, y - r, x + r, y + r], fill=WHITE)
    for row in range(3):
        yy = 300 + row * 26
        for x in range(30, 480, 40):
            off = 20 if row % 2 else 0
            d.line([x + off, yy + (11 if (x // 40) % 2 else 0), x + off + 20, yy + (0 if (x // 40) % 2 else 11)], fill=TERRA if row != 1 else TEAL, width=5)
    cx, cy = 170, 470
    for a in range(0, 180, 30):
        dx, dy = 46 * math.cos(math.radians(a)), 46 * math.sin(math.radians(a))
        d.line([cx - dx, cy - dy, cx + dx, cy + dy], fill=TEAL, width=6)
    logo(c); chip_r(d, W - 56, 50, "شريحة: جفاف الشتا")
    y = right_text(d, W - 64, 170, "الشتا جه.. وجلدك بقى ناشف وخشن؟", font(82, 700), INK, 952, 1.22)
    right_text(d, W - 64, y + 8, "جفاف الشتا بيضاعف جلد الوزة، والمرطب العادي بيقصر", font(42, 400), MUTED, 952)
    # circle product crop overlapping diagonal
    box = (600, 620, 1030, 1050)
    shadow(c, box, r=215); paste_cover(c, KP, box, 215, fy=0.55); d = ImageDraw.Draw(c)
    d.ellipse([600, 620, 1030, 1050], outline=TEAL, width=6)
    left_text(d, 64, 700, "موسم الجفاف بدأ", font(44, 700), TEAL_D, 480)
    left_text(d, 64, 762, "جلدك محتاج خطة شتا", font(34, 400), (70, 100, 110), 480)
    d.rectangle([0, 1150, W, H], fill=(196, 216, 226)); d = ImageDraw.Draw(c)
    right_text(d, W - 64, 1168, "روتين الشتا: سكراب ناعم، لوشن يوريا 25%، شيا", font(36, 600), TEAL_D, 660)
    d.text((64, 1180), sh("799 ج بدل 1,020"), font=font(36, 700), fill=TERRA_D)
    cta_pill(d, W - 64, 1258, "جهزي جلدك للشتا", h=74)
    d.text((64, 1266), sh(N1), font=font(26, 400), fill=(70, 100, 110))
    c.save(OUT + "/KA-6-winter.png"); print("KA-6")

# ---------- CA-1: beach full-bleed band ----------
def ca1():
    c = Image.new("RGB", (W, H), SAND); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: المصيف")
    y = right_text(d, W - 64, 150, "لسه هتتجنبي الشورت الصيف ده كمان؟", font(82, 700), INK, 952, 1.22)
    right_text(d, W - 64, y + 8, "ابدئي روتينك في البيت من دلوقتي", font(42, 400), MUTED, 952)
    for i, col in enumerate((TEAL, TERRA, WHITE, TEAL)):
        d.rectangle([0, 428 + i * 24, W, 452 + i * 24], fill=col)
    paste_cover(c, CS, (0, 524, 1080, 1010), 0, fy=0.5); d = ImageDraw.Draw(c)
    d.rectangle([0, 1010, W, H], fill=IVORY); d = ImageDraw.Draw(c)
    right_text(d, W - 64, 1036, SOL_CS, font(39, 600), TEAL_D, 680)
    d.text((64, 1046), sh("799 ج بدل 975"), font=font(37, 700), fill=TERRA_D)
    cta_pill(d, W - 64, 1150, "اطلبي وابدئي")
    d.text((64, 1176), sh(N2), font=font(30, 400), fill=MUTED)
    warn_line(d, 1300)
    c.save(OUT + "/CA-1-beach.png"); print("CA-1")

# ---------- CA-2: packing list document ----------
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
    # product stamp photo
    ph = Image.new("RGBA", (420, 330), (0, 0, 0, 0)); pd = ImageDraw.Draw(ph)
    pd.rectangle([0, 0, 420, 330], fill=WHITE)
    ph.paste(ph, (0, 0)); paste_cover(ph, CS, (14, 14, 406, 268), 4, fy=0.5)
    ph = ph.rotate(-6, expand=True, resample=Image.BICUBIC)
    c.paste(ph, (120, 920), ph); d = ImageDraw.Draw(c)
    # price tag circle
    d.ellipse([800, 900, 1010, 1110], fill=GOLD)
    center_text(d, 905, 952, "799 ج", font(46, 700), WHITE, 190)
    center_text(d, 905, 1010, "بدل 975", font(30, 700), WHITE, 190)
    wdt = tw(d, "ضيفيه لشنطتك", font(44, 700)) + 84
    pill = Image.new("RGBA", (int(wdt) + 8, 96), (0, 0, 0, 0)); pd2 = ImageDraw.Draw(pill)
    pd2.rounded_rectangle([4, 4, wdt + 4, 92], radius=44, fill=TERRA + (255,))
    pd2.text(((wdt + 8) / 2, 48), sh("ضيفيه لشنطتك"), font=font(44, 700), fill=WHITE, anchor="mm")
    pill = pill.rotate(-4, expand=True, resample=Image.BICUBIC)
    c.paste(pill, (560, 1160), pill); d = ImageDraw.Draw(c)
    d.text((64, 1296), sh(N2), font=font(28, 400), fill=MUTED)
    warn_line(d, 1308)
    c.save(OUT + "/CA-2-honeymoon.png"); print("CA-2")

# ---------- CA-3: scoreboard dark ----------
def ca3():
    c = Image.new("RGB", (W, H), TEAL_D); d = ImageDraw.Draw(c); logo(c)
    chip_r(d, W - 56, 50, "شريحة: ملتزمة صحياً", TERRA)
    y = right_text(d, W - 64, 150, "بتتمرني وبتاكلي صح.. ولسه موجود؟", font(80, 700), WHITE, 952, 1.22)
    right_text(d, W - 64, y + 8, "السيلوليت مش ذنبك ومش مقياس مجهودك", font(42, 400), LIGHT, 952)
    rrect(d, [64, 470, 1016, 906], 26, fill=(16, 74, 64), outline=(52, 110, 98), width=3)
    rows = [("تمرين", True), ("أكل صحي", True), ("مية ونوم", True), ("عناية موضعية", False)]
    for i, (t, ok) in enumerate(rows):
        yy = 506 + i * 102
        check(d, 140, yy + 28, 25, (120, 220, 180) if ok else TERRA, ok=ok)
        f = font(44, 700 if not ok else 400); s = sh(t)
        d.text((940 - d.textlength(s, font=f), yy), s, font=f, fill=(255, 205, 180) if not ok else WHITE)
        if i < 3: d.line([110, yy + 76, 970, yy + 76], fill=(40, 95, 84), width=2)
    shadow(c, (64, 946, 420, 1246)); paste_cover(c, CS, (64, 946, 420, 1246), 28, fy=0.5); d = ImageDraw.Draw(c)
    yy = right_text(d, W - 64, 956, "كمّلي بخطوة موضعية: سكراب كافيين، كريم ريتينول بالليل", font(38, 600), WHITE, 540)
    d.text((W - 64 - tw(d, "799 ج بدل 975", font(38, 700)), yy + 14), sh("799 ج بدل 975"), font=font(38, 700), fill=GOLD)
    cta_pill(d, W - 64, 1150, "كمّلي اللي ناقصك")
    warn_line(d, 1304, dark=True)
    c.save(OUT + "/CA-3-fit.png"); print("CA-3")

# ---------- CA-4: editorial full-height image ----------
def ca4():
    c = Image.new("RGB", (W, H), IVORY)
    paste_cover(c, CS, (712, 0, 1080, 1350), 0, fx=0.5, fy=0.5); d = ImageDraw.Draw(c)
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
    yy = right_text(d, 632, by + 18, "روتين السيلوليت الكامل: ولو مش مناسبك، استرجاع 14 يوم", font(35, 600), WHITE, 560)
    d.text((64, by + 96), sh("799 ج بدل 975"), font=font(35, 700), fill=GOLD)
    cta_pill(d, 664, by + 196, "اطلبي من غير مخاطرة")
    d.text((40, by + 300), sh(N2), font=font(27, 400), fill=MUTED)
    wf = font(23, 400); ws = sh(WARN)
    d.text((40, 1312), ws, font=wf, fill=(150, 90, 70))
    c.save(OUT + "/CA-4-skeptic.png"); print("CA-4")

# ---------- CA-5: desk collage ----------
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
    # polaroid
    pol = Image.new("RGBA", (470, 560), (0, 0, 0, 0)); pd = ImageDraw.Draw(pol)
    pd.rectangle([0, 0, 470, 560], fill=WHITE)
    paste_cover(pol, CS, (18, 18, 452, 452), 2, fy=0.5); pd = ImageDraw.Draw(pol)
    center_text(pd, 235, 478, "روتيني المسائي", font(34, 600), INK, 420)
    pol = pol.rotate(3, expand=True, resample=Image.BICUBIC)
    c.paste(pol, (90, 620), pol); d = ImageDraw.Draw(c)
    def n3(nd, wdt, hgt):
        center_text(nd, wdt / 2, 44, SOL_CS, font(31, 600), TEAL_D, wdt - 32)
        center_text(nd, wdt / 2, 128, "799 ج بدل 975", font(33, 700), TERRA_D, wdt - 32)
    note(590, 700, 440, 210, -3, n3)
    cta_pill(d, W - 64, 1150, "اطلبي روتينك المسائي")
    d.text((64, 1176), sh(N2), font=font(29, 400), fill=MUTED)
    warn_line(d, 1306)
    c.save(OUT + "/CA-5-office.png"); print("CA-5")

for fn in (ka1, ka2, ka3, ka4, ka5, ka6, ca1, ca2, ca3, ca4, ca5):
    fn()
print("ALL V3 DONE")
