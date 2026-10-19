"""Build the permanent-residence infographics (AR + NL) as PNG files.

Usage: FONT_DIR=/path/to/@fontsource/tajawal/files python3 tools/infographics/permres.py
Writes assets/infographics/<name>-<lang>.png (1080 px wide, rendered at 2x then downscaled).
Figures checked against IND pages on 18 October 2026 (normbedragen 1 July – 31 December 2026, leges 2026).
"""
import os, pathlib, html
from playwright.sync_api import sync_playwright

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / 'assets' / 'infographics'
FONT_DIR = os.environ.get('FONT_DIR', '')

def font_css():
    if not FONT_DIR:
        return ''
    css = ''
    for w in (400, 500, 700, 800):
        for sub in ('arabic', 'latin'):
            f = pathlib.Path(FONT_DIR) / f'tajawal-{sub}-{w}-normal.woff2'
            if f.exists():
                css += f"@font-face{{font-family:'Tajawal';font-weight:{w};src:url('file://{f}') format('woff2')}}"
    return css

BASE_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;background:#f5f5f7;font-family:'Tajawal',system-ui,sans-serif;color:#1d1d1f;-webkit-font-smoothing:antialiased}
.page{padding:56px 56px 40px}
.kicker{display:inline-block;background:#fff1e8;color:#c2410c;font-weight:800;font-size:22px;padding:6px 18px;border-radius:999px;margin-bottom:18px}
h1{font-size:50px;line-height:1.25;font-weight:800;letter-spacing:-.5px}
.sub{font-size:25px;color:#6e6e73;margin-top:12px;line-height:1.5}
.nl{direction:ltr;unicode-bidi:isolate}
b,strong,.tag{unicode-bidi:isolate}
.card{background:#fff;border:1px solid #e3e3e8;border-radius:28px;padding:26px 30px}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:30px;font-size:19px;color:#6e6e73}
.brand{font-weight:800;color:#1d1d1f}
.brand b{color:#ff6b1a}
.ok{color:#15803d}.warn{color:#b45309}.bad{color:#b91c1c}
.pill{display:inline-block;font-size:19px;font-weight:800;padding:4px 14px;border-radius:999px}
.pill.ok{background:#e7f6ee}.pill.warn{background:#fff6e0}.pill.bad{background:#fdecea}
"""

def page(lang, body, extra_css=''):
    d = 'rtl' if lang == 'ar' else 'ltr'
    return (f'<!doctype html><html lang="{lang}" dir="{d}"><head><meta charset="utf-8">'
            f'<style>{font_css()}{BASE_CSS}{extra_css}</style></head><body><div class="page">{body}</div></body></html>')

def foot(lang):
    if lang == 'ar':
        return ('<div class="foot"><span>المصدر: IND · المبالغ من 1 يوليو حتى 31 ديسمبر 2026 · للتوعية وليس استشارة قانونية</span>'
                '<span class="brand">gidsnederland<b>.nl</b></span></div>')
    return ('<div class="foot"><span>Bron: IND · bedragen 1 juli – 31 december 2026 · ter informatie, geen juridisch advies</span>'
            '<span class="brand">gidsnederland<b>.nl</b></span></div>')

# ---------------------------------------------------------------- 1. contract / duurzaam inkomen
CONTRACT_CSS = """
.grid{display:grid;grid-template-columns:1fr;gap:18px;margin-top:34px}
.row{display:grid;grid-template-columns:330px 60px 1fr;align-items:stretch}
.row .k{background:#1d1d1f;color:#fff;border-radius:24px;padding:22px 24px;font-size:27px;font-weight:800;line-height:1.35;display:flex;flex-direction:column;justify-content:center}
.row .k small{display:block;font-size:20px;font-weight:500;opacity:.8;margin-top:6px}
.row .arrow{display:flex;align-items:center;justify-content:center;font-size:40px;color:#ff6b1a;font-weight:800}
.row .v{background:#fff;border:1px solid #e3e3e8;border-radius:24px;padding:20px 24px;font-size:24px;line-height:1.5}
.row .v strong{font-size:26px}
.amounts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px}
.amounts div{background:#fff;border:1px solid #e3e3e8;border-radius:24px;padding:20px 22px}
.amounts b{display:block;font-size:40px;color:#0071e3;font-weight:800;direction:ltr;text-align:start;unicode-bidi:isolate}
.amounts span{font-size:21px;color:#3a3a3c;line-height:1.45;display:block;margin-top:4px}
.rule{margin-top:26px;background:#fff6e0;border:1px solid #f1d39b;border-radius:24px;padding:20px 26px;font-size:24px;line-height:1.55}
"""

def contract(lang):
    a = lang == 'ar'
    arrow = '←' if a else '→'
    if a:
        head = ('<span class="kicker">EU-langdurig ingezetene</span><h1>هل عقد عملك مقبول عند IND؟</h1>'
                '<p class="sub">الدخل يجب أن يكون <b>zelfstandig</b> و<b>duurzaam</b> و<b>voldoende</b>. المدة المتبقية تُحسب من يوم استلام IND لطلبك.</p>')
        rows = [
            ('vast contract<small>عقد غير محدد المدة</small>', '<span class="pill ok">مقبول</span> &nbsp;يكفي أن يكون <strong>راتبك الحالي</strong> بالمبلغ المطلوب.'),
            ('tijdelijk ≥ 12 maanden<small>أو uitzend Fase A بشروطه</small>', '<span class="pill ok">مقبول</span> &nbsp;مثل العقد الدائم. Fase A: سارٍ 12 شهراً + <span class="nl">uitzendbeding</span> مستثنى + <span class="nl">loondoorbetaling</span>.'),
            ('tijdelijk 6 – 12 maanden', '<span class="pill warn">بشرط</span> &nbsp;متوسط دخل كافٍ في <strong>آخر 12 شهراً</strong> من العمل أو <span class="nl">WW/ZW</span> — أو في آخر 3 سنوات.'),
            ('tijdelijk &lt; 6 maanden', '<span class="pill warn">صعب</span> &nbsp;متوسط دخل كافٍ في <strong>آخر 3 سنوات</strong> + راتب حالي كافٍ. لا <span class="nl">bijstand</span>.'),
            ('flexibel contract<small>uitzend · oproep · nuluren · min-max</small>', '<span class="pill warn">صعب</span> &nbsp;نفس القاعدة: <strong>آخر 3 سنوات</strong> + الراتب الحالي.'),
        ]
        amounts = ('<div class="amounts"><div><b>€ 1.635,90</b><span>تثبت الدخل بنفسك<br>sv-loon شهرياً بدون vakantiegeld</span></div>'
                   '<div><b>€ 1.766,77</b><span>المبلغ نفسه<br>مع vakantiegeld</span></div>'
                   '<div><b>€ 2.337,00</b><span>مع دخل الشريك<br>بدون vakantiegeld</span></div></div>')
        rule = ('<div class="rule"><b>نصيحة:</b> إذا بقي من عقدك أقل من 12 شهراً، اطلب من صاحب العمل <b>تمديده قبل التقديم</b>. '
                'وفترة التجربة <span class="nl">proeftijd</span> تُحسب ضمن المدة.</div>')
    else:
        head = ('<span class="kicker">EU-langdurig ingezetene</span><h1>Is jouw arbeidscontract goed genoeg voor de IND?</h1>'
                '<p class="sub">Je inkomen moet <b>zelfstandig</b>, <b>duurzaam</b> en <b>voldoende</b> zijn. De resterende looptijd telt vanaf de dag dat de IND je aanvraag ontvangt.</p>')
        rows = [
            ('Vast contract<small>onbepaalde tijd</small>', '<span class="pill ok">Duurzaam</span> &nbsp;Alleen je <strong>huidige salaris</strong> moet het normbedrag halen.'),
            ('Tijdelijk ≥ 12 maanden<small>of fase A-uitzendcontract</small>', '<span class="pill ok">Duurzaam</span> &nbsp;Als vast. Fase A: nog 12 maanden geldig + uitzendbeding uitgesloten + loondoorbetalingsverplichting.'),
            ('Tijdelijk 6 – 12 maanden', '<span class="pill warn">Onder voorwaarde</span> &nbsp;Gemiddeld voldoende inkomen in de <strong>laatste 12 maanden</strong> uit werk of WW/ZW — of in de laatste 3 jaar.'),
            ('Tijdelijk &lt; 6 maanden', '<span class="pill warn">Lastig</span> &nbsp;Gemiddeld voldoende inkomen in de <strong>laatste 3 jaar</strong> + nu voldoende. Geen bijstand.'),
            ('Flexibel contract<small>uitzend · oproep · nuluren · min-max</small>', '<span class="pill warn">Lastig</span> &nbsp;Zelfde regel: <strong>laatste 3 jaar</strong> + huidig inkomen.'),
        ]
        amounts = ('<div class="amounts"><div><b>€ 1.635,90</b><span>Eigen inkomen<br>sv-loon per maand zonder vakantiegeld</span></div>'
                   '<div><b>€ 1.766,77</b><span>Zelfde norm<br>met vakantiegeld</span></div>'
                   '<div><b>€ 2.337,00</b><span>Met inkomen partner<br>zonder vakantiegeld</span></div></div>')
        rule = ('<div class="rule"><b>Tip:</b> loopt je contract korter dan 12 maanden? Vraag je werkgever om <b>verlenging vóór je aanvraag</b>. '
                'De proeftijd telt mee.</div>')
    grid = '<div class="grid">' + ''.join(f'<div class="row"><div class="k">{k}</div><div class="arrow">{arrow}</div><div class="v">{v}</div></div>' for k, v in rows) + '</div>'
    return page(lang, head + grid + amounts + rule + foot(lang), CONTRACT_CSS)

# ---------------------------------------------------------------- 2. asylum route
ROUTE_CSS = """
.steps{margin-top:34px;position:relative}
.step{display:grid;grid-template-columns:86px 1fr;gap:22px;margin-bottom:18px;position:relative}
.num{width:86px;height:86px;border-radius:50%;background:#1d1d1f;color:#fff;font-size:40px;font-weight:800;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}
.step.final .num{background:#ff6b1a}
.step:not(:last-child)::after{content:'';position:absolute;top:86px;bottom:-18px;inset-inline-start:41px;width:4px;background:#d2d2d7}
.step .card h3{font-size:30px;font-weight:800;line-height:1.3}
.step .card p{font-size:23px;line-height:1.55;color:#3a3a3c;margin-top:6px}
.step .card .tags{margin-top:10px;display:flex;flex-wrap:wrap;gap:8px}
.tag{font-size:19px;font-weight:700;background:#f5f5f7;border:1px solid #e3e3e8;border-radius:999px;padding:4px 14px;direction:ltr;unicode-bidi:isolate}
.side{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px}
.side .card{font-size:22px;line-height:1.55}
.side .card b{display:block;font-size:24px;margin-bottom:4px}
.side .blue{background:#eaf1fb;border-color:#c7dcf5}
.side .amber{background:#fff6e0;border-color:#f1d39b}
"""

def step(n, title, text, tags=(), final=False):
    t = ''.join(f'<span class="tag">{x}</span>' for x in tags)
    return (f'<div class="step{" final" if final else ""}"><div class="num">{n}</div><div class="card"><h3>{title}</h3>'
            f'<p>{text}</p>{f"<div class=tags>{t}</div>" if t else ""}</div></div>')

def asylum(lang):
    if lang == 'ar':
        head = ('<span class="kicker">verblijfsvergunning asiel</span><h1>من إقامة اللجوء إلى الإقامة الدائمة</h1>'
                '<p class="sub">منذ 12 يونيو 2026 لا يمكن طلب <span class="nl">asiel onbepaalde tijd</span>. الطريق الآن هو <b>EU-langdurig ingezetene</b>.</p>')
        steps = [
            step(1, 'جدّد إقامة اللجوء في وقتها', 'التصاريح الجديدة والمجدّدة صالحة 3 سنوات. لا تترك فجوة في إقامتك القانونية.', ('verlengen: € 0',)),
            step(2, 'أنهِ الاندماج', 'شهادة الاندماج، أو شهادة Z-route، أو إعفاء موثّق عبر الملحق 7116.', ('inburgeringsdiploma', 'Z-route', 'bijlage 7116')),
            step(3, 'دخل مستقل ومستدام', 'عمل بعقد مناسب، أو WW/ZW. الـ bijstand لا يُحسب. يمكن احتساب دخل الشريك.', ('≥ € 1.635,90', 'geen bijstand')),
            step(4, '5 سنوات متواصلة', 'إقامة قانونية متواصلة، ولا غياب أكثر من 6 أشهر متتالية أو 10 أشهر إجمالاً.', ('5 jaar', 'max 6 / 10 mnd weg')),
            step(5, 'قدّم الطلب ورقياً', 'لحاملي إقامة اللجوء: الطلب كتابي فقط بالنموذج 6011، والرسوم 254 يورو للبالغ.', ('formulier 6011', '€ 254', '< 18: € 85'), True),
        ]
        side = ('<div class="side"><div class="card blue"><b>لديك asiel onbepaalde tijd؟</b>إن حصلت عليها قبل 12 يونيو 2026 فهي باقية لك. جدّد البطاقة فقط كل 5 سنوات.</div>'
                '<div class="card amber"><b>دخلك لا يكفي بعد؟</b>استمر بتجديد إقامة اللجوء، واعمل على الدخل، وافحص شروط التجنّس.</div></div>')
    else:
        head = ('<span class="kicker">verblijfsvergunning asiel</span><h1>Van asielvergunning naar permanent verblijf</h1>'
                '<p class="sub">Sinds 12 juni 2026 kun je geen asiel onbepaalde tijd meer aanvragen. De route is nu <b>EU-langdurig ingezetene</b>.</p>')
        steps = [
            step(1, 'Verleng je asielvergunning op tijd', 'Nieuwe en verlengde vergunningen zijn 3 jaar geldig. Laat geen gat in je rechtmatig verblijf vallen.', ('verlengen: € 0',)),
            step(2, 'Rond je inburgering af', 'Inburgeringsdiploma, certificaat Z-route of een vrijstelling/ontheffing via bijlage 7116.', ('inburgeringsdiploma', 'Z-route', 'bijlage 7116')),
            step(3, 'Zelfstandig en duurzaam inkomen', 'Werk met een geschikt contract, of WW/ZW. Bijstand telt niet. Inkomen van je partner mag meetellen.', ('≥ € 1.635,90', 'geen bijstand')),
            step(4, '5 jaar onafgebroken', 'Rechtmatig verblijf zonder onderbreking; niet langer dan 6 maanden achter elkaar en 10 maanden in totaal weg.', ('5 jaar', 'max 6 / 10 mnd weg')),
            step(5, 'Vraag schriftelijk aan', 'Met een asielvergunning kan het alleen schriftelijk, met formulier 6011. Leges € 254 voor volwassenen.', ('formulier 6011', '€ 254', '< 18: € 85'), True),
        ]
        side = ('<div class="side"><div class="card blue"><b>Heb je asiel onbepaalde tijd?</b>Gekregen vóór 12 juni 2026? Die houd je. Alleen het document vernieuw je elke 5 jaar.</div>'
                '<div class="card amber"><b>Inkomen nog niet genoeg?</b>Blijf je asielvergunning verlengen, werk aan je inkomen en bekijk de voorwaarden voor naturalisatie.</div></div>')
    return page(lang, head + '<div class="steps">' + ''.join(steps) + '</div>' + side + foot(lang), ROUTE_CSS)

# ---------------------------------------------------------------- 3. regular route (decision tree)
TREE_CSS = """
.q{background:#1d1d1f;color:#fff;border-radius:24px;padding:20px 26px;font-size:28px;font-weight:800;line-height:1.35;margin-top:22px}
.q small{display:block;font-size:20px;font-weight:500;opacity:.8;margin-top:4px}
.branch{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px}
.b{border-radius:22px;padding:18px 22px;font-size:22px;line-height:1.5;border:1px solid #e3e3e8;background:#fff}
.b b{display:block;font-size:24px;margin-bottom:2px}
.b.no{background:#fdecea;border-color:#f3c1bc}
.b.go{background:#e7f6ee;border-color:#b5e0c8}
.b.alt{background:#eaf1fb;border-color:#c7dcf5}
.down{font-size:34px;color:#ff6b1a;font-weight:800;text-align:center;line-height:1;margin-top:10px}
"""

def regular(lang):
    if lang == 'ar':
        head = ('<span class="kicker">verblijfsvergunning regulier</span><h1>أي إقامة دائمة تناسبك؟</h1>'
                '<p class="sub">لأصحاب الإقامة العادية: شريك، عائلة، عمل، kennismigrant، أعمال حرة، Chavez…</p>')
        body = (
            '<div class="q">١. هل غرض إقامتك مؤقت؟<small>tijdelijk verblijfsdoel</small></div>'
            '<div class="branch"><div class="b no"><b>نعم ✗</b>seizoenarbeid، au pair، zoekjaar، stage، uitwisseling، ICT، grensoverschrijdende dienstverlening: هذه السنوات لا تُحسب.</div>'
            '<div class="b go"><b>لا ✓</b>مثل verblijf bij partner، arbeid in loondienst، kennismigrant، zelfstandige. تابع.</div></div><div class="down">↓</div>'
            '<div class="q">٢. 5 سنوات متواصلة + شهادة الاندماج؟<small>الدراسة: بالنصف للأوروبية، كاملة للعادية · inburgering A2+</small></div>'
            '<div class="branch"><div class="b no"><b>ليس بعد</b>جدّد إقامتك الحالية في وقتها وأكمل الاندماج.</div>'
            '<div class="b go"><b>نعم ✓</b>تابع إلى شرط الدخل.</div></div><div class="down">↓</div>'
            '<div class="q">٣. هل دخلك zelfstandig وduurzaam وvoldoende؟<small>€ 1.635,90 · أو € 2.337,00 مع الشريك</small></div>'
            '<div class="branch"><div class="b go"><b>نعم ✓ ← EU-langdurig ingezetene</b>الخيار الأقوى: حقوق إضافية داخل الاتحاد الأوروبي. الرسوم 254 يورو.</div>'
            '<div class="b alt"><b>لا ← هل لك إعفاء؟</b>10 سنوات إقامة أو أكثر، أو وُلدت في هولندا، أو وصلت قبل سن 3، أو كانت إقامتك كقاصر عند والديك ← <b>regulier onbepaalde tijd</b> بلا شرط دخل.</div></div>'
        )
    else:
        head = ('<span class="kicker">verblijfsvergunning regulier</span><h1>Welk permanent verblijf past bij jou?</h1>'
                '<p class="sub">Voor reguliere vergunninghouders: partner, gezin, werk, kennismigrant, zelfstandige, Chavez…</p>')
        body = (
            '<div class="q">1. Heb je een tijdelijk verblijfsdoel?<small>tijdelijk of niet-tijdelijk</small></div>'
            '<div class="branch"><div class="b no"><b>Ja ✗</b>Seizoenarbeid, au pair, zoekjaar, stage, uitwisseling, overplaatsing binnen een onderneming, grensoverschrijdende dienstverlening: deze jaren tellen niet.</div>'
            '<div class="b go"><b>Nee ✓</b>Bijvoorbeeld verblijf bij partner, arbeid in loondienst, kennismigrant, zelfstandige. Ga door.</div></div><div class="down">↓</div>'
            '<div class="q">2. 5 jaar onafgebroken + inburgeringsdiploma?<small>studie: half voor EU-langdurig, volledig voor regulier · inburgering A2+</small></div>'
            '<div class="branch"><div class="b no"><b>Nog niet</b>Verleng je huidige vergunning op tijd en rond je inburgering af.</div>'
            '<div class="b go"><b>Ja ✓</b>Ga door naar de inkomenseis.</div></div><div class="down">↓</div>'
            '<div class="q">3. Is je inkomen zelfstandig, duurzaam en voldoende?<small>€ 1.635,90 · of € 2.337,00 met partner</small></div>'
            '<div class="branch"><div class="b go"><b>Ja ✓ → EU-langdurig ingezetene</b>De sterkste keuze: extra rechten binnen de EU. Leges € 254.</div>'
            '<div class="b alt"><b>Nee → vrijstelling?</b>10 jaar of langer verblijf, in Nederland geboren, vóór je 3e gekomen, of als minderjarige bij je ouders → <b>regulier onbepaalde tijd</b> zonder inkomenseis.</div></div>'
        )
    return page(lang, head + body + foot(lang), TREE_CSS)

BUILDERS = {'permres-contract': contract, 'permres-asylum-route': asylum, 'permres-regular-route': regular}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = REPO / 'tools' / 'infographics' / '_build'
    tmp.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': 1080, 'height': 800}, device_scale_factor=1)
        for name, fn in BUILDERS.items():
            for lang in ('ar', 'nl'):
                f = tmp / f'{name}-{lang}.html'
                f.write_text(fn(lang), encoding='utf-8')
                pg.goto(f.as_uri()); pg.wait_for_timeout(300)
                out = OUT / f'{name}-{lang}.png'
                pg.screenshot(path=str(out), full_page=True)
                print(out.relative_to(REPO), out.stat().st_size)
        b.close()

if __name__ == '__main__':
    main()
