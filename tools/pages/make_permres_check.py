"""Build the residence & citizenship checker pages (AR + NL).

Run: python3 tools/pages/make_permres_check.py
Logic and result texts live in assets/permres-check.js; figures there must match the tables below.
Rules checked on IND pages, forms 6009 / 6011 / bijlage 7111 and the naturalisation pages on 19 October 2026.
"""
import os, sys, datetime
sys.path.insert(0, os.path.dirname(__file__))
import make_kindgebondenbudget as k  # noqa: E402

SLUG = 'permanent-residence-check'
AR_PATH = f'calculators/{SLUG}.html'
NL_PATH = f'nl/calculators/{SLUG}.html'
k.HEAD = ('<link rel="stylesheet" href="/assets/tools.css?v=1"><link rel="stylesheet" href="/assets/permres-check.css?v=2">'
          '<script src="/assets/permres-check.js?v=3" defer></script>')
k.SOURCES = [
    ('IND · Verblijfsvergunning EU-langdurig ingezetene', 'https://ind.nl/nl/verblijfsvergunningen/langdurig-ingezetene-eu/verblijfsvergunning-eu-langdurig-ingezetene'),
    ('IND · Verblijfsvergunning onbepaalde tijd aanvragen (regulier)', 'https://ind.nl/nl/vervangen-verlengen-vernieuwen-en-wijzigen/onbepaalde-tijd/verblijfsvergunning-onbepaalde-tijd-aanvragen'),
    ('IND · Asiel onbepaalde tijd in Nederland aanvragen', 'https://ind.nl/nl/verblijfsvergunningen/asiel/asiel-onbepaalde-tijd-in-nederland-aanvragen'),
    ('IND · Tijdelijke en niet-tijdelijke verblijfsdoelen', 'https://ind.nl/nl/tijdelijke-en-niet-tijdelijke-verblijfsdoelen'),
    ('IND · Inkomenseisen: zelfstandig, duurzaam en voldoende inkomen', 'https://ind.nl/nl/zelfstandig-duurzaam-en-voldoende-inkomen'),
    ('IND · Inkomenseisen normbedragen', 'https://ind.nl/nl/inkomenseisen-normbedragen'),
    ('IND · Inburgering bij sterkere verblijfsvergunning', 'https://ind.nl/nl/met-een-verblijfsvergunning-wonen-in-nederland/inburgering-bij-sterkere-verblijfsvergunning'),
    ('IND · Nederlander worden door naturalisatie', 'https://ind.nl/nl/nederlanderschap/nederlander-worden-door-naturalisatie'),
    ('IND · Uitzonderingen 5 jaar verblijf bij naturalisatie', 'https://ind.nl/nl/uitzonderingen-5-jaar-verblijf-bij-naturalisatie'),
    ('IND · Formulier 6009 (regulier: EU-langdurig of onbepaalde tijd)', 'https://ind.nl/nl/formulieren/6009.pdf'),
    ('IND · Formulier 6011 (asiel: EU-langdurig ingezetene)', 'https://ind.nl/nl/formulieren/6011.pdf'),
    ('IND · Bijlage Bewijsmiddelen inkomen 7111', 'https://ind.nl/nl/formulieren/7111.pdf'),
    ('IND · Leges: kosten van een aanvraag', 'https://ind.nl/nl/leges-kosten-van-een-aanvraag'),
]


def radios(name, opts, req=True):
    r = ' required' if req else ''
    return '<div class="prc-opts">' + ''.join(
        f'<label><input type="radio" name="{name}" value="{v}"{r}><span><b>{t}</b>{f"<small>{s}</small>" if s else ""}</span></label>'
        for v, t, s in opts) + '</div>'


def select(name, opts, req=True, blank=True):
    return (f'<select id="prc-{name}" name="{name}"{" required" if req else ""}>' + ('<option value="">—</option>' if blank else '')
            + ''.join(f'<option value="{v}">{t}</option>' for v, t in opts) + '</select>')


def q(label, ctrl, hint='', show=None, forid=None):
    tag = 'label' if forid else 'div'
    fa = f' for="prc-{forid}"' if forid else ''
    sh = f' data-show="{show}" hidden' if show else ''
    return f'<{tag} class="prc-q"{fa}{sh}><span>{label}{f"<small>{hint}</small>" if hint else ""}</span>{ctrl}</{tag}>'


def numin(name, ph, mx, step='1', req=True):
    return (f'<input id="prc-{name}" name="{name}" type="number" inputmode="decimal" min="0" max="{mx}" step="{step}" '
            f'placeholder="{ph}" dir="ltr"{" required" if req else ""}>')


Y = datetime.date.today().year


def form(L):
    F = L['F']
    years = [(str(y), str(y)) for y in range(Y, Y - 41, -1)]
    s1 = (f'<fieldset data-step="1"><legend tabindex="-1">{F["s1"]}</legend>'
          + q(F['permit'], radios('permit', F['permits']), F['permit_h'])
          + q(F['ground'], select('ground', F['grounds']), F['ground_h'], 'ground', 'ground')
          + q(F['purpose'], select('purpose', F['purposes']), F['purpose_h'], 'purpose', 'purpose')
          + '<div class="prc-grid">'
          + q(F['nat'], select('nat', F['nats'], False, False), '', None, 'nat')
          + q(F['age'], numin('age', '35', '110'), '', None, 'age')
          + '</div>'
          + q(F['origin'], select('origin', F['origins'], False, False), F['origin_h'], 'origin', 'origin')
          + q(F['dpartner'], select('dpartner', F['dpartners'], False, False), F['dpartner_h'], 'dpartner', 'dpartner')
          + q(F['dpYears'], numin('dpYears', '3', '80', '0.5', False), F['dpYears_h'], 'dpyears', 'dpYears')
          + '</fieldset>')
    s2 = (f'<fieldset data-step="2" hidden><legend tabindex="-1">{F["s2"]}</legend>'
          + f'<div class="prc-q"><span>{F["start"]}<small>{F["start_h"]}</small></span><div class="prc-grid">'
          + select('startMonth', F['months'], True) + select('startYear', years, True) + '</div></div>'
          + '<div class="prc-grid">'
          + q(F['study'], numin('studyYears', '0', '40', '0.5', False), F['study_h'], 'studyYears', 'studyYears')
          + q(F['total'], numin('totalYears', '0', '90', '0.5', False), F['total_h'], None, 'totalYears')
          + q(F['absLong'], numin('absLong', '0', '120'), F['absLong_h'], None, 'absLong')
          + q(F['absTotal'], numin('absTotal', '0', '120'), F['absTotal_h'], None, 'absTotal')
          + '</div>'
          + q(F['gap'], radios('gap', F['yn_gap']), F['gap_h'])
          + q(F['brp'], radios('brp', F['yn']))
          + q(F['crime'], radios('crime', F['yn_crime']), F['crime_h'])
          + '</fieldset>')
    s3 = (f'<fieldset data-step="3" hidden><legend tabindex="-1">{F["s3"]}</legend>'
          + q(F['inb'], radios('inb', F['inbs']), F['inb_h']) + '</fieldset>')
    s4 = (f'<fieldset data-step="4" hidden><legend tabindex="-1">{F["s4"]}</legend>'
          + q(F['src'], select('src', F['srcs']), F['src_h'], None, 'src')
          + q(F['contract'], select('contract', F['contracts']), F['contract_h'], 'contract', 'contract')
          + f'<div class="prc-q" data-show="fasea" hidden><span>{F["fa"]}</span><div class="prc-opts">'
          + ''.join(f'<label><input type="checkbox" name="fa{i+1}"><span>{t}</span></label>' for i, t in enumerate(F['fas'])) + '</div></div>'
          + '<div data-show="hist" hidden>'
          + q(F['h12'], radios('hist12', F['yn']), F['h12_h'])
          + q(F['h36'], radios('hist36', F['yn']), F['h36_h'])
          + q(F['bij3'], radios('bij3', F['yn'])) + '</div>'
          + '<div class="prc-grid" data-show="salary" hidden>'
          + q(F['salary'], numin('salary', '2300', '100000', '0.01'), F['salary_h'], None, 'salary')
          + q(F['vg'], select('vg', F['vgs'], False, False), F['vg_h'], None, 'vg') + '</div>'
          + '<div class="prc-grid" data-show="zzp" hidden>'
          + q(F['zzpM'], numin('zzpMonths', '24', '600'), '', None, 'zzpMonths')
          + q(F['zzpP'], numin('zzpProfit', '2000', '100000', '0.01'), F['zzpP_h'], None, 'zzpProfit') + '</div>'
          + q(F['benM'], numin('benMonths', '12', '600'), '', 'ben', 'benMonths')
          + q(F['partner'], select('partner', F['partners'], False, False), F['partner_h'], None, 'partner')
          + '<div class="prc-grid" data-show="partnerinc" hidden>'
          + q(F['pDur'], select('pDur', F['yn_sel'], False, False), F['pDur_h'], None, 'pDur')
          + q(F['pInc'], numin('pIncome', '2000', '100000', '0.01', False), F['salary_h'], None, 'pIncome') + '</div>'
          + '</fieldset>')
    return (f'<section id="prc" class="tool-section" aria-label="{L["title"]}"><h2><span>{L["form_h"]}</span></h2>'
            f'<noscript><p class="notice"><span>{L["noscript"]}</span></p></noscript>'
            f'<div class="prc-head"><span class="prc-steplabel"></span><span>🔒 {F["private"]}</span></div>'
            '<div class="prc-progress" aria-hidden="true"><span></span></div>'
            f'<form novalidate hidden>{s1}{s2}{s3}{s4}<p class="prc-msg" role="alert"></p>'
            f'<div class="prc-nav" hidden><button type="button" class="tool-button prc-back" hidden><span>{F["back"]}</span></button>'
            f'<button type="button" class="tool-button primary prc-next"><span>{F["next"]}</span></button>'
            f'<button type="submit" class="tool-button primary prc-go" hidden><span>{F["go"]}</span></button></div></form>'
            '<div class="prc-result" role="status" aria-live="polite" tabindex="-1" hidden></div></section>')


k.form = form

AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
NL_MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

AR = dict(lang='ar', home='/', home_t='الرئيسية', tools='/tools.html', tools_t='أدوات عملية للحياة في هولندا',
    title='فاحص الإقامة الدائمة والجنسية',
    page_title='فاحص الإقامة الدائمة والجنسية: ماذا يقول ملفك، ومتى تستحق EU-langdurig أو الجنسية؟',
    desc='أداة مجانية بالعربية: تقرأ نوع إقامتك (asiel أو regulier) وتطبّق عليه شروط IND، فتعطيك تقييماً من 5، والتواريخ المتوقعة للإقامة الدائمة والجنسية، والاستمارة الصحيحة 6009 أو 6011.',
    summary='أجب عن أربع خطوات قصيرة، فيقرأ الفاحص ملفك كما يقرؤه موظف ملفات: يشرح نوع إقامتك وما يعنيه، ويفحص كل شرط، ويرسم لك <b>خريطة طريق بالتواريخ</b> من إقامتك الحالية إلى الإقامة الدائمة ثم <b>الجنسية الهولندية</b>، مع نصائح مبنية على إجاباتك، والاستمارة والأوراق الصحيحة.',
    how_h='كيف يفكّر الفاحص؟',
    how=('يبدأ بنوع إقامتك لأن كل شيء يُبنى عليه: إقامة اللجوء تقدّم بالاستمارة 6011 للإقامة الأوروبية فقط، والإقامة العادية بالاستمارة 6009 للمسارين، '
         'والغرض المؤقت يغلق الطريق. ثم يحسب المدة من تاريخ بدء إقامتك (الدراسة بالنصف للأوروبية)، ويفحص الغياب والاندماج والدخل حسب نوع العقد، '
         'ويحسب متى يُفتح كل باب: الإقامة الأوروبية، والإقامة العادية الدائمة، والتجنّس، الذي لا يشترط دخلاً، ويُفتح بعد 3 سنوات مع شريك هولندي. '
         'ويكتشف الإجابات المتناقضة وينبّهك إليها. كل شيء يُحسب في متصفحك ولا نحفظ أي إجابة.'),
    form_h='افحص ملفك',
    noscript='الفاحص يحتاج JavaScript. اقرأ الشروط في الجداول أدناه أو في دليل الإقامة الأوروبية الدائمة.',
    F=dict(private='لا نحفظ إجاباتك', next='التالي', back='السابق', go='اقرأ ملفي',
        s1='1. وضعك القانوني', s2='2. منذ متى أنت هنا؟', s3='3. الاندماج', s4='4. الدخل وعقد العمل',
        permit='ما نوع إقامتك الحالية؟', permit_h='النوع مكتوب على بطاقة الإقامة (I أو II أو III أو IV)، والغرض في خانة الملاحظات.',
        permits=[('asiel_bt', 'إقامة لجوء محددة المدة', 'asiel bepaalde tijd · النوع III'),
                 ('asiel_ot', 'إقامة لجوء غير محددة المدة', 'asiel onbepaalde tijd · النوع IV (قبل 12 يونيو 2026)'),
                 ('reg_bt', 'إقامة عادية محددة المدة', 'regulier bepaalde tijd · النوع I: شريك، عائلة، عمل، دراسة…'),
                 ('reg_ot', 'إقامة عادية غير محددة المدة', 'regulier onbepaalde tijd · النوع II'),
                 ('eu_lt', 'إقامة أوروبية دائمة', 'EU-langdurig ingezetene · النوع V'),
                 ('bluecard', 'البطاقة الزرقاء الأوروبية', 'Europese blauwe kaart'),
                 ('chavez', 'إقامة مع طفل هولندي قاصر', 'Chavez'),
                 ('eu_citizen', 'أنا مواطن EU أو EER أو سويسري', ''),
                 ('none', 'ليس لدي إقامة سارية الآن', '')],
        ground='على أي أساس حصلت على اللجوء؟', ground_h='مكتوب في قرار IND (beschikking). يهمّ في التجنّس: اللاجئ معفى عادة من التخلي عن جنسيته.',
        grounds=[('refugee', 'لاجئ (vluchteling / verdragsvluchteling)'), ('subsidiary', 'حماية ثانوية (subsidiaire bescherming)'), ('unknown', 'لا أعرف')],
        purpose='ما غرض إقامتك العادية؟', purpose_h='مكتوب على البطاقة، مثلاً «verblijf bij partner» أو «arbeid in loondienst».',
        purposes=[('partner', 'العيش مع الشريك أو العائلة (verblijf bij partner/gezinslid)'), ('arbeid', 'عمل بأجر (arbeid in loondienst)'),
                  ('kennis', 'مهاجر ذو كفاءة (kennismigrant)'), ('zelfstandig', 'عمل حر (arbeid als zelfstandige)'),
                  ('onderzoek', 'بحث علمي (onderzoek)'), ('humanitair_nt', 'إنساني غير مؤقت (humanitair niet-tijdelijk)'),
                  ('other_nt', 'غرض آخر غير مؤقت'),
                  ('studie', 'دراسة (studie)'), ('zoekjaar', 'سنة البحث عن عمل (zoekjaar)'), ('aupair', 'au pair'),
                  ('seizoen', 'عمل موسمي (seizoenarbeid)'), ('stage', 'تدريب (stage/praktikant)'),
                  ('ict', 'نقل داخل شركة (ICT)'), ('uitwisseling', 'تبادل (Working Holiday)'),
                  ('medisch', 'علاج طبي (medische behandeling)'), ('humanitair_t', 'إنساني مؤقت (humanitair tijdelijk)')],
        nat='جنسيتك', nats=[('other', 'جنسية أخرى'), ('tr', 'تركية'), ('be_lu', 'بلجيكية أو لوكسمبورغية'), ('stateless', 'بلا جنسية (مسجّل في BRP)')],
        age='عمرك',
        origin='كيف وصلت إلى هولندا؟', origin_h='قد يعفيك من شرط الدخل في الإقامة العادية الدائمة ومن التخلي عن جنسيتك عند التجنّس.',
        origins=[('adult', 'وصلت بعد سن 3'), ('born', 'وُلدت في هولندا وعشت فيها دائماً'), ('before3', 'وصلت قبل سن 3 وعشت فيها دائماً'),
                 ('minor', 'حصلت على إقامة كقاصر للعيش مع والديّ وبقيت هنا')],
        dpartner='هل شريكك هولندي الجنسية؟', dpartner_h='يقصّر مدة التجنّس إلى 3 سنوات، ويعفيك غالباً من التخلي عن جنسيتك إن كنتما متزوجين.',
        dpartners=[('no', 'لا'), ('married', 'نعم، متزوجان أو شراكة مسجلة'), ('cohab', 'نعم، نسكن معاً دون زواج')],
        dpYears='كم سنة تسكنان معاً؟', dpYears_h='مع الشريك الهولندي نفسه، دون انقطاع.',
        start='متى بدأت إقامتك القانونية المتواصلة؟', start_h='تاريخ أول إقامة سارية دون انقطاع بعدها. نحسب منه كل التواريخ.',
        months=[(str(i + 1), m) for i, m in enumerate(AR_MONTHS)],
        study='كم سنة منها كانت بإقامة دراسة؟', study_h='تُحسب بالنصف للإقامة الأوروبية.',
        total='كم سنة عشت في هولندا إجمالاً؟', total_h='مع فترات سابقة قديمة. اختياري؛ 10 سنوات إجمالاً تفتح التجنّس بعد سنتين.',
        absLong='أطول فترة غياب متواصلة خارج هولندا (بالأشهر)', absLong_h='منذ بدء إقامتك.',
        absTotal='مجموع أشهر الغياب في آخر 5 سنوات', absTotal_h='اجمع كل السفرات.',
        gap='هل انتهت إقامتك مرة قبل أن تجدّدها؟', gap_h='أي فترة بلا إقامة سارية (verblijfsgat).',
        yn_gap=[('no', 'لا، جدّدت دائماً في الوقت', ''), ('yes', 'نعم، كانت هناك فجوة', '')],
        brp='هل أنت مسجّل بعنوانك في البلدية (BRP)؟', yn=[('yes', 'نعم', ''), ('no', 'لا', '')],
        crime='هل لديك حكم أو قضية جارية؟', crime_h='للتقييم فقط؛ لا نحفظ الإجابة.',
        yn_crime=[('no', 'لا', ''), ('yes', 'نعم', '')],
        inb='ما وضع الاندماج (inburgering) لديك؟', inb_h='الإقامة العادية الدائمة والتجنّس يطلبان مستوى A2 على الأقل أو إعفاء.',
        inbs=[('diploma', 'لدي شهادة الاندماج', 'inburgeringsdiploma'),
              ('cert2021', 'لدي certificaat inburgering', 'قانون الاندماج 2021'),
              ('zroute', 'لدي شهادة Z-route', 'مسار الاعتماد على الذات'),
              ('exempt_edu', 'لدي شهادة دراسة هولندية معفية', 'شهادة مذكورة في قائمة الملحق 7116، مثل staatsexamen NT2'),
              ('exempt_med', 'معفى لأسباب طبية دائمة', 'بتقرير طبي'),
              ('exempt_other', 'إعفاء آخر', 'ظروف خاصة، أو تقرير DUO (قانون 2013)'),
              ('busy', 'ما زلت أدرس للاندماج', ''), ('none', 'ليس لدي أي شيء بعد', '')],
        src='ما مصدر دخلك الأساسي؟', src_h='إن كان دخلك لا يكفي فيمكن إضافة دخل الشريك.',
        srcs=[('loon', 'عمل بأجر عند صاحب عمل'), ('uitzend', 'عمل عبر وكالة توظيف (uitzendbureau)'), ('zzp', 'عمل حر (zzp / eenmanszaak)'),
              ('dga', 'مدير ومالك شركتي (DGA / bv)'), ('ww_zw', 'إعانة WW أو ZW'), ('wia', 'إعانة عجز (WIA/WAO)'),
              ('aow', 'AOW أو تقاعد'), ('bijstand', 'bijstand / Participatiewet / Wajong'), ('none', 'لا دخل لي (يعتمد على الشريك)')],
        contract='نوع عقدك والمدة المتبقية منه', contract_h='احسب المدة من اليوم الذي يستلم فيه IND طلبك.',
        contracts=[('vast', 'عقد دائم (vast / onbepaalde tijd)'), ('t12', 'عقد مؤقت متبقٍّ منه 12 شهراً أو أكثر'),
                   ('t6', 'عقد متبقٍّ منه 6 إلى 12 شهراً'), ('t0', 'عقد متبقٍّ منه أقل من 6 أشهر'),
                   ('faseA', 'عقد uitzend من نوع Fase A'), ('flex', 'عقد مرن: uitzend (غير A)، oproep، nuluren، min-max')],
        fa='اختر ما ينطبق على عقد Fase A:', fas=['بقي منه 12 شهراً أو أكثر', 'ينص على استثناء uitzendbeding', 'فيه التزام بمواصلة دفع الراتب (loondoorbetalingsverplichting)'],
        h12='هل كان متوسط دخلك كافياً في آخر 12 شهراً؟', h12_h='من العمل أو WW أو ZW فقط.',
        h36='هل كان متوسط دخلك كافياً في آخر 3 سنوات؟', h36_h='من العمل أو WW أو ZW، دون أشهر فارغة.',
        bij3='هل تلقيت bijstand في آخر 3 سنوات؟',
        salary='الراتب الشهري الإجمالي (sv-loon) باليورو', salary_h='من قسيمة الراتب: sv-loon أو heffingsloon. للإعانة: المبلغ الإجمالي.',
        vg='كيف تستلم vakantiegeld؟', vg_h='يحدد أي مبلغ نقارن به.', vgs=[('yearly', 'مرة في السنة'), ('monthly', 'جزء كل شهر مع الراتب')],
        zzpM='منذ كم شهراً لديك دخل من العمل الحر؟', zzpP='متوسط الربح الشهري باليورو', zzpP_h='الإيرادات ناقص التكاليف.',
        benM='كم شهراً بقي من الإعانة؟',
        partner='هل لديك زوج أو شريك مسجّل تسكن معه ويمكن احتساب دخله؟', partner_h='دخل الشريك يُحسب فقط في هذه الحالة.',
        partners=[('no', 'لا'), ('yes', 'نعم، متزوجان أو شراكة مسجلة ونسكن معاً')],
        pDur='هل دخل الشريك مستقل ومستدام؟', pDur_h='بالقواعد نفسها: عقد 12 شهراً أو سجل دخل.', yn_sel=[('yes', 'نعم'), ('no', 'لا أو لا أعرف')],
        pInc='دخل الشريك الشهري (sv-loon)'))

NL = dict(lang='nl', home='/nl/', home_t='Home', tools='/nl/tools.html', tools_t='Praktische hulpmiddelen voor Nederland',
    title='Check permanent verblijf en naturalisatie',
    page_title='Check permanent verblijf en naturalisatie: wat zegt jouw dossier en wanneer kun je EU-langdurig of Nederlander worden?',
    desc='Gratis check: leest je verblijfsvergunning (asiel of regulier), past de IND-voorwaarden toe en geeft een score van 5, de verwachte data voor permanent verblijf en naturalisatie, en het juiste formulier 6009 of 6011.',
    summary='Beantwoord vier korte stappen en de check leest je dossier zoals een behandelaar dat doet: uitleg over je vergunning, elke voorwaarde getoetst, een <b>routekaart met data</b> van je huidige vergunning naar permanent verblijf en <b>het Nederlanderschap</b>, persoonlijk advies, en het juiste formulier met documenten.',
    how_h='Hoe denkt de check?',
    how=('Alles begint bij je vergunning: met een asielvergunning vraag je met formulier 6011 alleen EU-langdurig aan, met een reguliere vergunning met 6009 beide routes, '
         'en een tijdelijk doel sluit de weg af. Daarna rekenen we vanaf de startdatum van je verblijf (studie telt half voor EU-langdurig), toetsen afwezigheid, inburgering en inkomen per soort contract, '
         'en berekenen wanneer elke deur opengaat: EU-langdurig, regulier onbepaalde tijd en naturalisatie, zonder inkomenseis en met een Nederlandse partner al na 3 jaar. '
         'Tegenstrijdige antwoorden worden gemeld. Alles wordt in je browser berekend; we slaan niets op.'),
    form_h='Check je dossier',
    noscript='De check vraagt JavaScript. Lees de voorwaarden in de tabellen hieronder of in de gids EU-langdurig ingezetene.',
    F=dict(private='We slaan je antwoorden niet op', next='Volgende', back='Vorige', go='Lees mijn dossier',
        s1='1. Je verblijfssituatie', s2='2. Sinds wanneer ben je hier?', s3='3. Inburgering', s4='4. Inkomen en contract',
        permit='Welke verblijfsvergunning heb je nu?', permit_h='Het type (I, II, III of IV) staat op je pas, het doel bij de opmerkingen.',
        permits=[('asiel_bt', 'Asiel bepaalde tijd', 'type III'), ('asiel_ot', 'Asiel onbepaalde tijd', 'type IV (vóór 12 juni 2026)'),
                 ('reg_bt', 'Regulier bepaalde tijd', 'type I: partner, gezin, werk, studie…'), ('reg_ot', 'Regulier onbepaalde tijd', 'type II'),
                 ('eu_lt', 'EU-langdurig ingezetene', 'type V'), ('bluecard', 'Europese blauwe kaart', ''),
                 ('chavez', 'Verblijf bij minderjarig Nederlands kind', 'Chavez'),
                 ('eu_citizen', 'Ik ben EU/EER-burger of Zwitser', ''), ('none', 'Ik heb nu geen geldige vergunning', '')],
        ground='Op welke grond kreeg je asiel?', ground_h='Staat in je IND-beschikking. Belangrijk bij naturalisatie: een vluchteling hoeft meestal geen afstand te doen van zijn nationaliteit.',
        grounds=[('refugee', 'Vluchteling (verdragsvluchteling)'), ('subsidiary', 'Subsidiaire bescherming'), ('unknown', 'Weet ik niet')],
        purpose='Wat is je verblijfsdoel?', purpose_h='Staat op je pas, bijvoorbeeld «verblijf bij partner» of «arbeid in loondienst».',
        purposes=[('partner', 'Verblijf bij partner of gezinslid'), ('arbeid', 'Arbeid in loondienst'), ('kennis', 'Kennismigrant'),
                  ('zelfstandig', 'Arbeid als zelfstandige'), ('onderzoek', 'Wetenschappelijk onderzoek'), ('humanitair_nt', 'Humanitair niet-tijdelijk'),
                  ('other_nt', 'Ander niet-tijdelijk doel'),
                  ('studie', 'Studie'), ('zoekjaar', 'Zoekjaar hoogopgeleiden'), ('aupair', 'Au pair'), ('seizoen', 'Seizoenarbeid'),
                  ('stage', 'Stagiair of praktikant'), ('ict', 'Overplaatsing binnen een onderneming'), ('uitwisseling', 'Uitwisseling (Working Holiday)'),
                  ('medisch', 'Medische behandeling'), ('humanitair_t', 'Tijdelijke humanitaire gronden')],
        nat='Nationaliteit', nats=[('other', 'Andere nationaliteit'), ('tr', 'Turks'), ('be_lu', 'Belgisch of Luxemburgs'), ('stateless', 'Staatloos (zo ingeschreven in de BRP)')],
        age='Leeftijd',
        origin='Hoe kwam je naar Nederland?', origin_h='Kan vrijstelling geven van de inkomenseis (regulier) en van afstand doen bij naturalisatie.',
        origins=[('adult', 'Na mijn 3e gekomen'), ('born', 'In Nederland geboren en altijd hier gewoond'), ('before3', 'Vóór mijn 3e gekomen en altijd hier gewoond'),
                 ('minor', 'Als minderjarige vergunning bij mijn ouders gekregen en hier gebleven')],
        dpartner='Is je partner Nederlander?', dpartner_h='Verkort de naturalisatietermijn tot 3 jaar en geeft bij een huwelijk meestal vrijstelling van afstand doen.',
        dpartners=[('no', 'Nee'), ('married', 'Ja, getrouwd of geregistreerd partner'), ('cohab', 'Ja, ongehuwd samenwonend')],
        dpYears='Hoeveel jaar wonen jullie samen?', dpYears_h='Met dezelfde Nederlandse partner, onafgebroken.',
        start='Wanneer begon je onafgebroken rechtmatig verblijf?', start_h='Datum van je eerste geldige vergunning zonder onderbreking daarna. Alle data rekenen we hiervandaan.',
        months=[(str(i + 1), m) for i, m in enumerate(NL_MONTHS)],
        study='Hoeveel jaar daarvan met een studievergunning?', study_h='Telt voor de helft bij EU-langdurig.',
        total='Hoeveel jaar woon je in totaal in Nederland?', total_h='Met eerdere periodes. Optioneel; 10 jaar in totaal opent naturalisatie na 2 jaar.',
        absLong='Langste aaneengesloten afwezigheid (maanden)', absLong_h='Sinds de start van je verblijf.',
        absTotal='Totaal aantal maanden weg in de laatste 5 jaar', absTotal_h='Tel alle reizen op.',
        gap='Is je vergunning ooit verlopen vóór je verlengde?', gap_h='Elke periode zonder geldige vergunning (verblijfsgat).',
        yn_gap=[('no', 'Nee, altijd op tijd verlengd', ''), ('yes', 'Ja, er was een gat', '')],
        brp='Sta je ingeschreven in de BRP van je gemeente?', yn=[('yes', 'Ja', ''), ('no', 'Nee', '')],
        crime='Heb je een veroordeling of lopende strafzaak?', crime_h='Alleen voor de beoordeling; we slaan niets op.',
        yn_crime=[('no', 'Nee', ''), ('yes', 'Ja', '')],
        inb='Wat is je situatie met inburgering?', inb_h='Regulier onbepaalde tijd en naturalisatie vragen minimaal A2 of vrijstelling.',
        inbs=[('diploma', 'Ik heb een inburgeringsdiploma', ''), ('cert2021', 'Ik heb het certificaat inburgering', 'Wi 2021'),
              ('zroute', 'Ik heb een Z-routecertificaat', ''), ('exempt_edu', 'Ik heb een vrijstellend Nederlands diploma', 'een diploma uit de lijst in bijlage 7116, zoals staatsexamen Nt2'),
              ('exempt_med', 'Medische ontheffing', 'met medisch advies'), ('exempt_other', 'Andere vrijstelling of ontheffing', 'bijzondere omstandigheden, DUO-advies (Wi 2013)'),
              ('busy', 'Ik ben nog bezig', ''), ('none', 'Nog niets', '')],
        src='Wat is je belangrijkste inkomen?', src_h='Is het niet genoeg, dan kun je het inkomen van je partner toevoegen.',
        srcs=[('loon', 'Loondienst bij een werkgever'), ('uitzend', 'Via een uitzendbureau'), ('zzp', 'Zzp / eenmanszaak'), ('dga', 'Directeur-grootaandeelhouder (bv)'),
              ('ww_zw', 'WW of ZW'), ('wia', 'WIA/WAO'), ('aow', 'AOW of pensioen'), ('bijstand', 'Bijstand / Participatiewet / Wajong'), ('none', 'Geen eigen inkomen (partner)')],
        contract='Soort contract en resterende looptijd', contract_h='Reken vanaf de dag dat de IND je aanvraag ontvangt.',
        contracts=[('vast', 'Vast contract'), ('t12', 'Tijdelijk, nog 12 maanden of langer'), ('t6', 'Nog 6 tot 12 maanden'), ('t0', 'Korter dan 6 maanden'),
                   ('faseA', 'Fase A-uitzendcontract'), ('flex', 'Flexibel: uitzend (niet fase A), oproep, nuluren, min-max')],
        fa='Wat geldt voor je fase A-contract?', fas=['Nog 12 maanden of langer geldig', 'Uitzendbeding is uitgesloten', 'Er is een loondoorbetalingsverplichting'],
        h12='Was je inkomen de laatste 12 maanden gemiddeld voldoende?', h12_h='Alleen uit werk, WW of ZW.',
        h36='Was je inkomen de laatste 3 jaar gemiddeld voldoende?', h36_h='Uit werk, WW of ZW, zonder lege maanden.',
        bij3='Had je in de laatste 3 jaar bijstand?',
        salary='Bruto maandinkomen (sv-loon) in euro', salary_h='Op je loonstrook: sv-loon of heffingsloon. Bij een uitkering: het brutobedrag.',
        vg='Hoe krijg je vakantiegeld?', vg_h='Bepaalt met welk normbedrag we vergelijken.', vgs=[('yearly', 'Eén keer per jaar'), ('monthly', 'Elke maand een deel')],
        zzpM='Hoeveel maanden heb je zzp-inkomen?', zzpP='Gemiddelde winst per maand in euro', zzpP_h='Omzet min kosten.',
        benM='Hoeveel maanden krijg je de uitkering nog?',
        partner='Heb je een echtgenoot of geregistreerd partner met wie je samenwoont en wiens inkomen kan meetellen?', partner_h='Alleen dan telt het inkomen van je partner.',
        partners=[('no', 'Nee'), ('yes', 'Ja, getrouwd of geregistreerd en samenwonend')],
        pDur='Is het inkomen van je partner zelfstandig en duurzaam?', pDur_h='Zelfde regels: contract van 12 maanden of inkomensverleden.', yn_sel=[('yes', 'Ja'), ('no', 'Nee of weet ik niet')],
        pInc='Maandinkomen partner (sv-loon)'))

e = lambda x: '<span dir="ltr">€ ' + f'{x:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.') + '</span>'
AR_BODY = f'''
<section><h2>ما الذي يفحصه الفاحص؟</h2>
<table><thead><tr><th>الشرط</th><th>الإقامة الأوروبية EU-langdurig</th><th>العادية regulier onbepaalde tijd</th><th>الجنسية (التجنّس)</th></tr></thead><tbody>
<tr><td>من يقدّم</td><td>اللجوء (6011)، والعادية غير المؤقتة (6009)</td><td>العادية غير المؤقتة فقط (6009)</td><td>كل إقامة دائمة أو غير مؤقتة، عبر البلدية</td></tr>
<tr><td>المدة</td><td>5 سنوات متواصلة؛ الدراسة بالنصف</td><td>5 سنوات؛ الدراسة كاملة؛ لا تُحسب السنوات قبل سن 8</td><td>5 سنوات؛ 3 مع شريك هولندي؛ سنتان إن عشت 10 سنوات إجمالاً</td></tr>
<tr><td>الدخل</td><td>{e(1635.90)} للشخص الوحيد، {e(2337)} مع الشريك</td><td>نفسه، مع إعفاءات (10 سنوات، الولادة في هولندا…)</td><td><b>لا يوجد شرط دخل</b></td></tr>
<tr><td>الاندماج</td><td>شهادة أو إعفاء</td><td>A2 على الأقل أو إعفاء</td><td>A2 على الأقل أو إعفاء</td></tr>
<tr><td>الجنسية الأصلية</td><td>تبقى</td><td>تبقى</td><td>تتخلى عنها، إلا في استثناءات (لاجئ، زواج من هولندي، الولادة في هولندا…)</td></tr>
<tr><td>الرسوم 2026</td><td>{e(254)}</td><td>{e(254)}</td><td>{e(1139)} (لحامل إقامة لجوء {e(847)})</td></tr>
</tbody></table>
<p><b>كيف نحسب مؤشر الجاهزية؟</b> لكل شرط وزن. الشرط المتحقق يأخذ وزنه كاملاً، والذي يحتاج انتباهاً جزءاً منه. وإن فشل شرط واحد لا يتجاوز المؤشر 40%، لأن IND يرفض الطلب إذا غاب شرط واحد. المؤشر ليس نسبة قبول رسمية، بل يدلك على ما ينقصك.</p>
<p><b>عن خطة الـ 10 سنوات للتجنّس:</b> نوقش اقتراح لرفع مدة التجنّس إلى 10 سنوات، لكنه لم يصبح قانوناً حتى أكتوبر 2026. القاعدة السارية 5 سنوات. إن تغيّرت سنحدّث الفاحص.</p>
</section>
<section><h2>أدلة مرتبطة</h2><ul>
<li><a href="/articles/eu-permanent-residence-netherlands.html">الإقامة الأوروبية الدائمة: كل الشروط وعقود العمل</a></li>
<li><a href="/articles/permanent-residence-asylum-route.html">من إقامة اللجوء إلى الإقامة الدائمة</a></li>
<li><a href="/articles/permanent-residence-regular-route.html">الإقامة الدائمة لأصحاب الإقامة العادية</a></li>
<li><a href="/articles/dutch-naturalisation-guide.html">التجنّس في هولندا</a></li>
<li><a href="/articles/inburgering-integration-law-2026.html">الاندماج 2026</a></li>
</ul></section>
'''
NL_BODY = f'''
<section><h2>Wat toetst de check?</h2>
<table><thead><tr><th>Voorwaarde</th><th>EU-langdurig ingezetene</th><th>Regulier onbepaalde tijd</th><th>Naturalisatie</th></tr></thead><tbody>
<tr><td>Wie vraagt aan</td><td>Asiel (6011), regulier niet-tijdelijk (6009)</td><td>Alleen regulier niet-tijdelijk (6009)</td><td>Elke permanente of niet-tijdelijke vergunning, via de gemeente</td></tr>
<tr><td>Duur</td><td>5 jaar onafgebroken; studie telt half</td><td>5 jaar; studie telt volledig; jaren vóór je 8e niet</td><td>5 jaar; 3 met Nederlandse partner; 2 als je in totaal 10 jaar hier woonde</td></tr>
<tr><td>Inkomen</td><td>{e(1635.90)} alleen, {e(2337)} met partner</td><td>Zelfde, met vrijstellingen (10 jaar, geboren in NL…)</td><td><b>Geen inkomenseis</b></td></tr>
<tr><td>Inburgering</td><td>Diploma of vrijstelling</td><td>Minimaal A2 of vrijstelling</td><td>Minimaal A2 of vrijstelling</td></tr>
<tr><td>Oude nationaliteit</td><td>Blijft</td><td>Blijft</td><td>Afstand doen, behalve uitzonderingen (vluchteling, getrouwd met Nederlander, geboren in NL…)</td></tr>
<tr><td>Leges 2026</td><td>{e(254)}</td><td>{e(254)}</td><td>{e(1139)} (asielvergunninghouder {e(847)})</td></tr>
</tbody></table>
<p><b>Hoe berekenen we de score?</b> Elke voorwaarde heeft een gewicht. Voldaan geeft het volle gewicht, «let op» een deel. Is één voorwaarde niet voldaan, dan blijft de score onder 40%, want de IND wijst af als één voorwaarde ontbreekt. De score is geen officiële slagingskans, maar laat zien wat je nog mist.</p>
<p><b>Het plan voor 10 jaar naturalisatietermijn:</b> er is een voorstel besproken om de termijn naar 10 jaar te verhogen, maar dat is in oktober 2026 nog geen wet. De regel is 5 jaar. Verandert dat, dan passen we de check aan.</p>
</section>
<section><h2>Gerelateerde gidsen</h2><ul>
<li><a href="/nl/articles/eu-permanent-residence-netherlands.html">EU-langdurig ingezetene: alle voorwaarden en contracten</a></li>
<li><a href="/nl/articles/permanent-residence-asylum-route.html">Van asielvergunning naar permanent verblijf</a></li>
<li><a href="/nl/articles/permanent-residence-regular-route.html">Permanent verblijf met een reguliere vergunning</a></li>
<li><a href="/nl/articles/dutch-naturalisation-guide.html">Naturalisatie</a></li>
<li><a href="/nl/articles/inburgering-integration-law-2026.html">Inburgeren 2026</a></li>
</ul></section>
'''
AR_FAQ = [
    ('هل هذا الفاحص تابع لـ IND؟', 'لا. هو أداة مستقلة من دليل هولندا بالعربية تطبّق الشروط التي ينشرها IND على إجاباتك. القرار الرسمي لـ IND وحده.'),
    ('هل النتيجة نسبة قبول رسمية؟', 'لا. هي مؤشر جاهزية يدلك على الشروط المتحققة والناقصة.'),
    ('لماذا قد يكون التجنّس أسهل من الإقامة الأوروبية؟', 'لأن التجنّس لا يشترط دخلاً. من دخله لا يكفي للإقامة الأوروبية قد يستوفي شروط التجنّس بعد 5 سنوات، مع الاندماج بمستوى A2.'),
    ('أي استمارة أستخدم؟', 'حامل إقامة اللجوء: 6011 ورقياً فقط. حامل الإقامة العادية: 6009 عبر الإنترنت أو ورقياً. التجنّس: عبر موعد في البلدية.'),
    ('هل تُحفظ إجاباتي؟', 'لا. كل شيء يُحسب في متصفحك، ولا نرسل أي معلومة.'),
]
NL_FAQ = [
    ('Is deze check van de IND?', 'Nee. Het is een onafhankelijke hulp van Nederlandsgids die de gepubliceerde IND-voorwaarden op je antwoorden toepast. Alleen de IND beslist.'),
    ('Is de score een officiële slagingskans?', 'Nee. Het is een gereedheidsscore die laat zien welke voorwaarden voldaan zijn en welke niet.'),
    ('Waarom kan naturalisatie makkelijker zijn dan EU-langdurig?', 'Omdat naturalisatie geen inkomenseis heeft. Wie niet genoeg inkomen heeft voor EU-langdurig, kan na 5 jaar met inburgering op A2-niveau wel kunnen naturaliseren.'),
    ('Welk formulier gebruik ik?', 'Asielvergunning: 6011, alleen schriftelijk. Reguliere vergunning: 6009, online of schriftelijk. Naturalisatie: via een afspraak bij de gemeente.'),
    ('Worden mijn antwoorden opgeslagen?', 'Nee. Alles wordt in je browser berekend; er wordt niets verstuurd.'),
]

if __name__ == '__main__':
    print(k.build(AR, AR_BODY, AR_FAQ, AR_PATH, NL_PATH))
    print(k.build(NL, NL_BODY, NL_FAQ, NL_PATH, AR_PATH))
