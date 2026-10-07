"""Turn legacy AR-only trend pages into full guide pages (AR + NL twin) and wire them
into sitemap, categories, article listings and language pairs.
Usage: python3 scaffold.py slug [slug...]   (config in NEW below)"""
import re, sys, json, glob, html
REPO = str(__import__('pathlib').Path(__file__).resolve().parents[2])
BASE = 'https://gidsnederland.nl'
from dates import DATE_ISO, DATE_AR, DATE_NL
CAT_NAME = {'money': ('المال والضرائب', 'Geld en belastingen'), 'housing': ('السكن والحياة اليومية', 'Wonen en dagelijks leven'),
            'benefits': ('الإعانات والبدلات', 'Toeslagen en uitkeringen'), 'work': ('العمل والراتب', 'Werk en salaris'),
            'education': ('الدراسة والتعليم', 'Studie en onderwijs'), 'residence': ('الإقامة ولمّ الشمل', 'Verblijf en gezinshereniging')}
NEW = {
 'prinsjesdag-2026-changes': dict(tpl='annual-tax-return-2026', cat='money', listing='support',
   ar=('Prinsjesdag 2026: ما الذي يتغير لك في 2027؟', 'الضرائب، الخصومات، البدلات، التأمين الصحي والطاقة في خطط ميزانية 2027، مع حالة كل إجراء: مقرر أم مقترح.'),
   nl=('Prinsjesdag 2026: wat verandert er voor jou in 2027?', 'Belasting, heffingskortingen, toeslagen, zorg en energie in de plannen voor 2027, met de status van elke maatregel.'),
   related=['toeslagen-income-update', 'health-insurance-2027', 'energy-contracts-saving-2026', 'annual-tax-return-2026']),
 'health-insurance-2027': dict(tpl='health-insurance-newcomers', cat='housing', listing='life',
   ar=('التأمين الصحي 2027: التبديل قبل 31 ديسمبر', 'المخاطرة الذاتية 400 يورو (مقترح)، القسط المتوقع، بدل الرعاية، قواعد التبديل، وما يحدث إن لم تكن مؤمَّناً.'),
   nl=('Zorgverzekering 2027: overstappen vóór 31 december', 'Eigen risico € 400 (voorstel), verwachte premie, zorgtoeslag, overstapregels en wat er gebeurt als je niet verzekerd bent.'),
   related=['health-insurance-newcomers', 'zorgtoeslag-guide', 'prinsjesdag-2026-changes', 'huisarts-registration']),
 'municipal-taxes-exemption-kwijtschelding': dict(tpl='annual-tax-return-2026', cat='money', listing='support',
   ar=('إعفاء ضرائب البلدية والمياه (Kwijtschelding)', 'من يستحق الإعفاء من ضريبة النفايات والصرف والمياه، حدود المال والسيارة، المستندات، مهلة الاعتراض 10 أيام، ومثال إنسخيدة.'),
   nl=('Kwijtschelding gemeentelijke en waterschapsbelastingen', 'Wie kwijtschelding krijgt voor afvalstoffen-, riool- en waterschapsbelasting, vermogensgrenzen, documenten, beroep binnen 10 dagen en het voorbeeld Enschede.'),
   related=['energy-contracts-saving-2026', 'toeslagen-income-update', 'housing-rent-allowance-2026', 'annual-tax-return-2026']),
 'energy-contracts-saving-2026': dict(tpl='annual-tax-return-2026', cat='money', listing='life',
   ar=('عقد الكهرباء والغاز: اختيار، تبديل، وتوفير', 'ثابت أم متغير أم ديناميكي، غرامة الإلغاء المبكر، ضريبة الطاقة 2026، نهاية المقاصة للألواح الشمسية 2027، وصندوق الطوارئ للطاقة.'),
   nl=('Energiecontract: kiezen, overstappen en besparen', 'Vast, variabel of dynamisch, de opzegvergoeding, energiebelasting 2026, einde salderen in 2027 en het Noodfonds Energie.'),
   related=['municipal-taxes-exemption-kwijtschelding', 'housing-rent-allowance-2026', 'prinsjesdag-2026-changes', 'toeslagen-income-update']),
}

NEW.update({
 'cbr-driving-license-netherlands': dict(tpl='health-insurance-newcomers', cat='housing', listing='life',
   ar=('رخصة القيادة في هولندا: CBR والتكاليف والتبديل', 'امتحان النظري والعملي وأسعار 2026، لغات الامتحان، 185 يوماً، أي رخص أجنبية تُبدَّل، ولماذا يحتاج السوريون للامتحان.'),
   nl=('Rijbewijs halen of omwisselen in Nederland', 'Theorie- en praktijkexamen en tarieven 2026, examentalen, de 185-dagenregel, welke buitenlandse rijbewijzen je kunt omwisselen.'),
   related=['bsn-municipality-registration', 'digid-registration-guide', 'change-address-netherlands', 'trending-jobs-2026']),
 'kvk-zzp-business-netherlands': dict(tpl='employment-contracts-labor-law-2026', cat='work', listing='work',
   ar=('العمل الحر في هولندا: التسجيل في KvK والضرائب', 'رسوم التسجيل، من يحق له العمل الحر، الضريبة المضافة وKOR، خصومات 2026 وما يتغير 2027، وقانون DBA.'),
   nl=('Zzp’er worden: inschrijven bij KVK en belastingen', 'Inschrijfvergoeding, wie zelfstandig mag werken, btw en KOR, ondernemersaftrek 2026 en 2027, en de Wet DBA.'),
   related=['employment-contracts-labor-law-2026', 'annual-tax-return-2026', 'toeslagen-income-update', 'dutch-payslip-explained']),
 'inburgering-integration-law-2026': dict(tpl='health-insurance-newcomers', cat='residence', listing='immigration',
   ar=('الاندماج (Inburgering) في 2026: المسارات والمهلة والتكاليف', 'المقابلة الشاملة وخطة PIP، مسارات B1 والتعليم وZ، مهلة 3 سنوات، الغرامات (لا غرامات على حاملي اللجوء)، والإقامة الدائمة والجنسية.'),
   nl=('Inburgeren in 2026: routes, termijn en kosten', 'Brede intake en PIP, B1-, onderwijs- en Z-route, termijn van 3 jaar, boetes (niet voor asielstatushouders), permanent verblijf en naturalisatie.'),
   related=['nt2-b1-exam-guide', 'dutch-naturalisation-guide', 'eu-permanent-residence-netherlands', 'mbo-dutch-language-options']),
 'trending-jobs-2026': dict(tpl='employment-contracts-labor-law-2026', cat='work', listing='work',
   ar=('المهن المطلوبة في هولندا 2026–2027', 'أرقام الشواغر من CBS، قائمة المهن الواعدة من UWV في الرعاية والتقنية والنقل والتعليم، توقعات تفينته، وطرق الدخول للقادمين الجدد.'),
   nl=('Kansrijke beroepen in Nederland 2026–2027', 'Vacaturecijfers van het CBS, kansrijke beroepen van UWV in zorg, techniek, transport en onderwijs, Twente en routes voor nieuwkomers.'),
   related=['diploma-evaluation-sbb', 'bol-bbl-comparison', 'mbo-conditions', 'employment-contracts-labor-law-2026']),
})

NEW.update({
 'social-assistance-bijstand': dict(tpl='toeslagen-income-update', cat='benefits', listing='support',
   ar=('المساعدة الاجتماعية (Bijstand) 2026', 'من يستحقها، المبالغ من 1 يوليو 2026، حد المدخرات 8,000 يورو، الالتزامات وشرط اللغة 1F، وقواعد 2026 و2027 الجديدة.'),
   nl=('Bijstand in 2026: recht, bedragen en plichten', 'Wie recht heeft, normen per 1 juli 2026, vermogensgrens € 8.000, plichten en taaleis 1F, en nieuwe regels 2026 en 2027.'),
   related=['special-assistance-bijzondere-bijstand', 'debt-help-schuldhulp', 'municipal-taxes-exemption-kwijtschelding', 'toeslagen-income-update']),
 'special-assistance-bijzondere-bijstand': dict(tpl='toeslagen-income-update', cat='benefits', listing='support',
   ar=('المساعدة الخاصة وبدل الدخل الفردي من البلدية', 'Bijzondere bijstand للتكاليف الضرورية المفاجئة، وبدل الدخل الفردي السنوي (مثال إنسخيدة: 114 يورو للشخص الوحيد)، وكيف تطلبهما.'),
   nl=('Bijzondere bijstand en individuele inkomenstoeslag', 'Bijzondere bijstand voor noodzakelijke onvoorziene kosten en de jaarlijkse inkomenstoeslag (voorbeeld Enschede: € 114 alleenstaand).'),
   related=['social-assistance-bijstand', 'municipal-taxes-exemption-kwijtschelding', 'debt-help-schuldhulp', 'kindgebonden-budget-guide']),
 'debt-help-schuldhulp': dict(tpl='toeslagen-income-update', cat='money', listing='support',
   ar=('مساعدة الديون المجانية من البلدية', 'موعد خلال 4 أسابيع أو 3 أيام عمل عند الخطر، المهلة 6 أشهر، الحد المحمي من الحجز، تسوية الديون القانونية 18 شهراً، وحدود تكاليف التحصيل.'),
   nl=('Gratis schuldhulp van de gemeente', 'Gesprek binnen 4 weken of 3 werkdagen bij dreiging, adempauze, beslagvrije voet, Wsnp in 18 maanden en maximale incassokosten.'),
   related=['social-assistance-bijstand', 'toeslagen-income-update', 'municipal-taxes-exemption-kwijtschelding', 'energy-contracts-saving-2026']),
 'unemployment-benefit-ww': dict(tpl='employment-contracts-labor-law-2026', cat='work', listing='work',
   ar=('إعانة البطالة WW 2026', 'الشروط (26 من 36 أسبوعاً)، المدة حتى 24 شهراً، 75% ثم 70%، الطلب خلال أسبوع، 4 طلبات توظيف كل 4 أسابيع، والفصل بالتراضي.'),
   nl=('WW-uitkering in 2026', 'Voorwaarden (26 van 36 weken), duur tot 24 maanden, 75% dan 70%, aanvragen binnen een week, 4 sollicitatieactiviteiten per 4 weken, vaststellingsovereenkomst.'),
   related=['employment-contracts-labor-law-2026', 'social-assistance-bijstand', 'temporary-agency-work-rights', 'toeslagen-income-update']),
 'aow-aio-pension': dict(tpl='toeslagen-income-update', cat='benefits', listing='support',
   ar=('التقاعد AOW والتكملة AIO للمهاجرين', 'سن التقاعد 67 ثم 67 و3 أشهر في 2028، نقص 2% عن كل سنة خارج هولندا، وكيف تكمل AIO دخلك إلى الحد الاجتماعي.'),
   nl=('AOW en AIO-aanvulling voor migranten', 'AOW-leeftijd 67 en 67 jaar en 3 maanden in 2028, 2% korting per jaar buiten Nederland, en hoe de AIO-aanvulling werkt.'),
   related=['social-assistance-bijstand', 'zorgtoeslag-guide', 'housing-rent-allowance-2026', 'wmo-home-support']),
 'wmo-home-support': dict(tpl='health-insurance-newcomers', cat='benefits', listing='support',
   ar=('دعم البلدية في البيت (Wmo)', 'المساعدة المنزلية، الكرسي المتحرك، تعديل البيت، المرافقة والرعاية النهارية؛ الطلب والبحث خلال 6 أسابيع والمساهمة 21.80 يورو شهرياً.'),
   nl=('Wmo: hulp van de gemeente thuis', 'Huishoudelijke hulp, rolstoel, woningaanpassing, begeleiding en dagbesteding; melding, onderzoek binnen 6 weken en eigen bijdrage € 21,80 per maand.'),
   related=['aow-aio-pension', 'huisarts-registration', 'health-insurance-2027', 'special-assistance-bijzondere-bijstand']),
})

NEW.update({
 'single-parent-support': dict(tpl='kindgebonden-budget-guide', cat='benefits', listing='family',
   ar=('دعم الوالد الوحيد في هولندا 2026', 'ميزانية الأطفال وإضافة الوالد الوحيد، خصم الجمع بين العمل والأطفال حتى 3,032 يورو، بدل الحضانة 96%، والمساعدة الاجتماعية الأعلى منذ 2026، مع أمثلة محسوبة.'),
   nl=('Steun voor alleenstaande ouders in 2026', 'Kindgebonden budget met alleenstaande-ouderkop, IACK tot € 3.032, kinderopvangtoeslag 96% en hogere bijstand sinds 2026, met rekenvoorbeelden.'),
   related=['kindgebonden-budget-guide', 'childcare-allowance-kinderopvangtoeslag', 'social-assistance-bijstand', 'toeslagpartner-guide']),
 'birth-parental-leave': dict(tpl='employment-contracts-labor-law-2026', cat='work', listing='family',
   ar=('إجازة الحمل والولادة والأبوة 2026', '16 أسبوعاً للأم بأجر كامل، أسبوع للشريك ثم 5 أسابيع بـ70%، و9 أسابيع أبوة مدفوعة بـ70% في السنة الأولى، مع أمثلة محسوبة.'),
   nl=('Zwangerschaps-, geboorte- en ouderschapsverlof 2026', '16 weken voor de moeder op 100%, partner 1 week plus 5 weken op 70%, en 9 weken betaald ouderschapsverlof op 70% in het eerste jaar, met rekenvoorbeelden.'),
   related=['employment-contracts-labor-law-2026', 'single-parent-support', 'childcare-allowance-kinderopvangtoeslag', 'kinderbijslag-guide']),
 'energy-emergency-fund-2027': dict(tpl='energy-contracts-saving-2026', cat='money', listing='life',
   ar=('صندوق طوارئ الطاقة 2026–2027', 'التحضير من 1 ديسمبر والطلب من 4 يناير حتى 7 مايو 2027، الشروط 130% و200% من الحد الاجتماعي، دعم من 120 حتى 1,800 يورو، مع أمثلة محسوبة.'),
   nl=('Noodfonds Energie 2026–2027', 'Voorbereiden vanaf 1 december, aanvragen 4 januari t/m 7 mei 2027, grenzen 130% en 200% van het sociaal minimum, € 120 tot € 1.800 steun, met rekenvoorbeelden.'),
   related=['energy-contracts-saving-2026', 'debt-help-schuldhulp', 'social-assistance-bijstand', 'municipal-taxes-exemption-kwijtschelding']),
 'sick-pay-ziektewet-wia': dict(tpl='employment-contracts-labor-law-2026', cat='work', listing='work',
   ar=('الدخل عند المرض: Ziektewet وWIA', 'أجر المرض سنتين، إعانة Ziektewet 70% لمن لا صاحب عمل له، خطوات العودة للعمل، وWIA بعد سنتين (WGA وIVA)، مع أمثلة محسوبة.'),
   nl=('Inkomen bij ziekte: Ziektewet en WIA', 'Loondoorbetaling 2 jaar, Ziektewet 70% zonder werkgever, re-integratiestappen en WIA na 2 jaar (WGA en IVA), met rekenvoorbeelden.'),
   related=['employment-contracts-labor-law-2026', 'unemployment-benefit-ww', 'temporary-agency-work-rights', 'wmo-home-support']),
 'adult-learning-finance': dict(tpl='student-finance', cat='education', listing='education',
   ar=('تمويل الدراسة للكبار: قرض التعلم مدى الحياة', 'قرض DUO لمن هم حتى 56 سنة بفائدة 2.33% في 2026، ما انتهى (STAP) ولمن SLIM، وطرق العودة للدراسة مع أمثلة.'),
   nl=('Studeren als volwassene: levenlanglerenkrediet', 'DUO-krediet tot en met 56 jaar met 2,33% rente in 2026, wat stopte (STAP), voor wie SLIM is, en routes terug naar school met voorbeelden.'),
   related=['student-finance', 'mbo-dutch-language-options', 'diploma-evaluation-sbb', 'trending-jobs-2026']),
})


NEW.update({
 'social-housing-sociale-huurwoning': dict(tpl='housing-rent-allowance-2026', cat='housing', listing='life',
   ar=('السكن الاجتماعي 2026: التسجيل والانتظار والأولوية', 'حدود الدخل 51,537 و56,910، الإيجار المناسب حتى 713 أو 764 يورو، التسجيل والقرعة، مدة الانتظار، والأولوية العاجلة والقانون الجديد.'),
   nl=('Sociale huurwoning 2026: inschrijven, wachttijd, urgentie', 'Inkomensgrenzen € 51.537 en € 56.910, passend toewijzen tot € 713/€ 764, inschrijven en loting, wachttijden en urgentie.'),
   related=['housing-rent-allowance-2026', 'tenant-rights-netherlands', 'bsn-municipality-registration', 'change-address-netherlands']),
 'tenant-rights-netherlands': dict(tpl='housing-rent-allowance-2026', cat='housing', listing='life',
   ar=('حقوق المستأجر 2026', 'زيادة الإيجار 4.1% و6.1% و4.4%، الكفالة شهران وتُعاد خلال 14 يوماً، الإصلاحات، لجنة الإيجار، والعقود الدائمة، مع أمثلة.'),
   nl=('Huurrechten 2026', 'Huurverhoging 4,1%, 6,1% en 4,4%, borg max. 2 maanden en terug binnen 14 dagen, reparaties, Huurcommissie en vaste contracten, met voorbeelden.'),
   related=['social-housing-sociale-huurwoning', 'housing-rent-allowance-2026', 'debt-help-schuldhulp', 'municipal-taxes-exemption-kwijtschelding']),
 'year-end-checklist-2026': dict(tpl='prinsjesdag-2026-changes', cat='money', listing='life',
   ar=('قائمة نهاية السنة 2026', 'التأمين الصحي قبل 31 ديسمبر، دخل 2027 في البدلات، الدفعة المؤقتة للضرائب، وصندوق الطاقة من يناير — بالتواريخ.'),
   nl=('Checklist jaareinde 2026', 'Zorgverzekering vóór 31 december, inkomen 2027 bij Toeslagen, voorlopige aanslag en Noodfonds Energie vanaf januari — op datum.'),
   related=['health-insurance-2027', 'prinsjesdag-2026-changes', 'energy-emergency-fund-2027', 'toeslagen-income-update']),
})
NEW.update({
 'foreign-driving-license-exchange': dict(tpl='cbr-driving-license-netherlands', cat='housing', listing='life',
   ar=('تبديل رخصة القيادة الأجنبية 2026', 'من يحق له التبديل، 185 يوماً لرخص خارج أوروبا و15 سنة لرخص الاتحاد الأوروبي، قائمة RDW، الوثائق والخطوات في البلدية، ولماذا لا تُبدَّل الرخصة السورية.'),
   nl=('Buitenlands rijbewijs omwisselen 2026', 'Wie mag omwisselen, 185 dagen voor niet-EU en 15 jaar voor EU-rijbewijzen, de RDW-landenlijst, documenten en stappen bij de gemeente.'),
   related=['cbr-driving-license-netherlands', 'traffic-fines-cjib', 'bsn-municipality-registration', 'change-address-netherlands']),
 'traffic-fines-cjib': dict(tpl='cbr-driving-license-netherlands', cat='money', listing='life',
   ar=('المخالفات المرورية وCJIB: الدفع والاعتراض والتقسيط', 'مهلة 8 أسابيع وتذكير مجاني، الإنذار ×1.5 و×3، رسوم 9 يورو، الاعتراض خلال 6 أسابيع، والتقسيط من 75 يورو حتى 36 شهراً.'),
   nl=('Verkeersboete en CJIB: betalen, beroep en termijnen', '8 weken en gratis herinnering, aanmaning ×1,5 en ×3, € 9 administratiekosten, beroep binnen 6 weken en betalingsregeling vanaf € 75 tot 36 maanden.'),
   related=['foreign-driving-license-exchange', 'debt-help-schuldhulp', 'cbr-driving-license-netherlands', 'digid-registration-guide']),
 'bezwaar-objection-letter': dict(tpl='toeslagen-income-update', cat='money', listing='life',
   ar=('الاعتراض على قرار حكومي (bezwaar)', 'مهلة 6 أسابيع، ما يجب أن تحتويه رسالة الاعتراض مع نموذج جاهز، غرامة يومية حتى 1,442 يورو إن تأخرت الجهة، ورسوم المحكمة 54 أو 200 يورو في 2026.'),
   nl=('Bezwaar maken tegen een besluit', '6 weken termijn, wat in je bezwaarschrift moet met voorbeeldbrief, dwangsom tot € 1.442 bij te laat beslissen en griffierecht € 54 of € 200 in 2026.'),
   related=['legal-aid-lawyer-toevoeging','toeslagen-income-update','traffic-fines-cjib','social-assistance-bijstand']),
 'legal-aid-lawyer-toevoeging': dict(tpl='debt-help-schuldhulp', cat='money', listing='life',
   ar=('المحامي المدعوم (toevoeging) 2026', 'محامٍ بدعم حكومي إن كان دخلك حتى 35,400 يورو (أعزب) أو 50,000 (أسرة): مساهمة ذاتية من 257 يورو ناقص خصم 69، ونصيحة مجانية على 0800-8020.'),
   nl=('Advocaat met toevoeging 2026', 'Gesubsidieerde advocaat bij een inkomen t/m € 35.400 (alleenstaand) of € 50.000 (gezin): eigen bijdrage vanaf € 257 min € 69 korting, gratis advies via 0800-8020.'),
   related=['bezwaar-objection-letter','debt-help-schuldhulp','tenant-rights-netherlands','social-assistance-bijstand']),
 'scams-phishing-netherlands': dict(tpl='traffic-fines-cjib', cat='money', listing='life',
   ar=('الاحتيال والتصيّد في هولندا', 'رسائل Belastingdienst وDigiD المزيفة، «هاي ماما»، احتيال موظف البنك، الإيجار الوهمي وgeldezel — وماذا تفعل فوراً: البنك، الشرطة، Fraudehelpdesk 088 786 73 72.'),
   nl=('Oplichting en phishing', 'Valse berichten van Belastingdienst en DigiD, hoi-mam-fraude, bankhelpdeskfraude, nephuur en geldezels — en wat je direct doet: bank, aangifte, Fraudehelpdesk 088 786 73 72.'),
   related=['digid-registration-guide','tenant-rights-netherlands','debt-help-schuldhulp','legal-aid-lawyer-toevoeging']),
 'pregnancy-newborn-care': dict(tpl='birth-parental-leave', cat='benefits', listing='family',
   ar=('الحمل والولادة في هولندا', 'القابلة أولاً، NIPT وإيكو الأسبوع 20 مجاناً، الكرامزورخ 5.70 يورو للساعة (24–80 ساعة)، وتسجيل المولود خلال 3 أيام وتأمينه خلال 4 أشهر.'),
   nl=('Zwanger en bevallen in Nederland', 'Verloskundige eerst, NIPT en 20 wekenecho gratis, kraamzorg € 5,70 per uur (24–80 uur), aangifte binnen 3 dagen en baby verzekeren binnen 4 maanden.'),
   related=['birth-parental-leave','kinderbijslag-guide','kindgebonden-budget-guide','health-insurance-newcomers']),
})

def short_titles():
    m = {}
    for lang, pat in (('ar', 'categories/*.html'), ('nl', 'nl/categories/*.html')):
        for f in glob.glob(f'{REPO}/{pat}'):
            for s, t in re.findall(r'<h2><a href="/(?:nl/)?articles/([a-z0-9-]+)\.html">(.*?)</a></h2>', open(f, encoding='utf-8').read()):
                m[(s, lang)] = re.sub('<[^>]+>', '', t)
    for s, c in NEW.items():
        m[(s, 'ar')], m[(s, 'nl')] = c['ar'][0], c['nl'][0]
    return m


def clone(slug, lang, c, st):
    pre = 'nl/' if lang == 'nl' else ''
    t = open(f"{REPO}/{pre}articles/{c['tpl']}.html", encoding='utf-8').read().replace(c['tpl'] + '.html', slug + '.html')
    # drop page-specific correction notices (dated "— تصحيح/correctie" asides) right after the meta block
    t = re.sub(r'<aside class="notice"><span>[^<]*(تصحيح|[Cc]orrectie|[Hh]erstel)[^<]*</span></aside>', '', t)
    href = (lambda s: f'/{pre}articles/{s}.html')
    items = ''.join(f'<li><a href="{href(s)}"><span>{html.escape(st[(s, lang)])}</span></a></li>' for s in c['related'])
    t = re.sub(r'(<section><h2><span>(?:أدلة مرتبطة|Gerelateerde gidsen|[^<]*)</span></h2><ul>).*?(</ul></section>)',
               lambda m: m.group(1) + items + m.group(2), t, 1, re.S)
    cat_ar, cat_nl = CAT_NAME[c['cat']]
    items2 = ''.join(f'<li><a href="{href(s)}">{html.escape(st[(s, lang)])}</a></li>' for s in c['related'])
    all_lbl = (f'جميع أدلة: {cat_ar}' if lang == 'ar' else f'Alle gidsen: {cat_nl}')
    t = re.sub(r'(<section class="related-guides"><h2>[^<]*</h2><ul>).*?</ul><a href="[^"]*">[^<]*</a>',
               lambda m: m.group(1) + items2 + f'</ul><a href="/{pre}categories/{c["cat"]}.html">{all_lbl}</a>', t, 1, re.S)
    open(f"{REPO}/{pre}articles/{slug}.html", 'w', encoding='utf-8').write(t)


def sitemap_add(slug):
    p = f'{REPO}/sitemap.xml'; s = open(p, encoding='utf-8').read()
    def entry(loc):
        return (f'  <url>\n    <loc>{BASE}{loc}</loc>\n    <lastmod>{DATE_ISO}</lastmod>\n'
                f'    <xhtml:link rel="alternate" hreflang="ar" href="{BASE}/articles/{slug}.html"/>\n'
                f'    <xhtml:link rel="alternate" hreflang="nl" href="{BASE}/nl/articles/{slug}.html"/>\n'
                f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/articles/{slug}.html"/>\n  </url>\n')
    for loc in (f'/articles/{slug}.html', f'/nl/articles/{slug}.html'):
        if f'<loc>{BASE}{loc}</loc>' not in s:
            s = s.replace('</urlset>', entry(loc) + '</urlset>')
    open(p, 'w', encoding='utf-8').write(s)


def category_add(slug, c):
    for lang in ('ar', 'nl'):
        pre = 'nl/' if lang == 'nl' else ''
        p = f"{REPO}/{pre}categories/{c['cat']}.html"; s = open(p, encoding='utf-8').read()
        if f'/{pre}articles/{slug}.html' in s:
            continue
        title, desc = c[lang]
        card = f'<article class="topic-card"><h2><a href="/{pre}articles/{slug}.html">{html.escape(title)}</a></h2><p>{html.escape(desc)}</p></article>'
        i = s.rfind('</div></main>'); assert i > 0, p
        s = s[:i] + card + s[i:]
        open(p, 'w', encoding='utf-8').write(s)


def listing_move(slug, c):
    for lang in ('ar', 'nl'):
        pre = 'nl/' if lang == 'nl' else ''
        p = f'{REPO}/{pre}articles.html'; s = open(p, encoding='utf-8').read()
        # remove old legacy card if present
        s = re.sub(r'<article class="guide-card"[^>]*>(?:(?!</article>).)*?/' + pre + 'articles/' + slug + r'\.html.*?</article>', '', s, flags=re.S)
        title, desc = c[lang]
        chk = f'تحقق من المصادر: {DATE_AR}' if lang == 'ar' else f'Broncontrole: {DATE_NL}'
        card = (f'<article class="guide-card" data-guide-card data-topic="{c["listing"]}" data-search="{html.escape(title + " " + desc + chk)}">'
                f'<h3><a href="/{pre}articles/{slug}.html"><span>{html.escape(title)}</span></a></h3><p><span>{html.escape(desc)}</span></p>'
                f'<p class="muted"><span>{chk}</span></p></article>')
        m = re.search(r'<section id="' + c['listing'] + r'" data-cluster>.*?(</div></section>)', s, re.S); assert m, (p, c['listing'])
        s = s[:m.start(1)] + card + s[m.start(1):]
        open(p, 'w', encoding='utf-8').write(s)


def pairs_add(slug):
    p = f'{REPO}/docs/language-pairs.json'; d = json.load(open(p, encoding='utf-8'))
    if f'articles/{slug}.html' not in d:
        d.append(f'articles/{slug}.html')
        json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)


if __name__ == '__main__':
    st = short_titles()
    for slug in sys.argv[1:]:
        c = NEW[slug]
        for lang in ('ar', 'nl'):
            clone(slug, lang, c, st)
        sitemap_add(slug); category_add(slug, c); listing_move(slug, c); pairs_add(slug)
        print('scaffolded', slug)
