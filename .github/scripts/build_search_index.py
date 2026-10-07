#!/usr/bin/env python3
"""Build assets/search-index.json for the site search.

Run after adding or renaming articles (the "Search index bot" workflow does this
automatically on every push that touches articles or categories):
    python3 .github/scripts/build_search_index.py            # rebuild + report changes
    python3 .github/scripts/build_search_index.py --check    # exit 1 if the index is stale

New articles need no manual step: their topic is read from the category pages that
link to them, and basic keywords come from the title, slug and Dutch terms. Hand-written
aliases (ALIASES below) improve results further for colloquial searches.

Each entry: u (url), l (ar|nl), y (guide|tool|topic), t (title), d (description),
h (headings), c (topic label), k (aliases: colloquial Arabic, Dutch terms,
transliterations and common misspellings that should find this page).
"""
from __future__ import annotations
import argparse, html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Topic of each guide (slug -> category file name)
TOPIC = {
 'bsn-municipality-registration':'housing','digid-registration-guide':'housing','health-insurance-newcomers':'housing',
 'huisarts-registration':'housing','change-address-netherlands':'housing','health-insurance-2027':'housing',
 'cbr-driving-license-netherlands':'housing','energy-contracts-saving-2026':'money',
 'family-reunification-mvv-ind':'residence','asylum-family-reunification':'residence','eu-permanent-residence-netherlands':'residence',
 'dutch-naturalisation-guide':'residence','inburgering-integration-law-2026':'residence','nt2-b1-exam-guide':'residence',
 'employment-contracts-labor-law-2026':'work','minimum-wage-netherlands':'work','dutch-payslip-explained':'work',
 'zero-hours-contract':'work','temporary-agency-work-rights':'work','kvk-zzp-business-netherlands':'work','trending-jobs-2026':'work',
 'mbo-hbo-wo-comparison':'education','mbo-conditions':'education','bol-bbl-comparison':'education','student-finance':'education',
 'mbo-dutch-language-options':'education','diploma-evaluation-sbb':'education','dutch-school-system-basisschool':'education',
 'zorgtoeslag-guide':'benefits','housing-rent-allowance-2026':'benefits','kinderbijslag-guide':'benefits',
 'kindgebonden-budget-guide':'benefits','childcare-allowance-kinderopvangtoeslag':'benefits','toeslagpartner-guide':'benefits',
 'toeslagen-income-update':'benefits','annual-tax-return-2026':'money','municipal-taxes-exemption-kwijtschelding':'money',
 'prinsjesdag-2026-changes':'money',
}
TOPIC_LABEL = {
 'ar': {'housing':'البداية والحياة اليومية','residence':'الإقامة ولمّ الشمل','work':'العمل والراتب','education':'الدراسة والتعليم','benefits':'البدلات والمساعدات','money':'المال والضرائب'},
 'nl': {'housing':'Starten en dagelijks leven','residence':'Verblijf en gezinshereniging','work':'Werk en salaris','education':'Studie en onderwijs','benefits':'Toeslagen en uitkeringen','money':'Geld en belastingen'},
}
TOPIC_ALIASES = {
 'housing':'سكن بيت بلدية gemeente wonen بداية وصول جديد قادم',
 'residence':'اقامة إقامة هجرة IND verblijf لجوء',
 'work':'شغل عمل وظيفة راتب معاش werk baan salaris',
 'education':'دراسة مدرسة جامعة معهد تعليم studie school opleiding',
 'benefits':'بدل بدلات مساعدة مساعدات دعم فلوس الحكومة toeslag toeslagen uitkering',
 'money':'ضريبة ضرائب فلوس مال belasting geld',
}

# Words people actually type (colloquial Arabic, Dutch, transliterations, misspellings).
ALIASES = {
 'social-housing-sociale-huurwoning':'بيت اجتماعي سكن اجتماعي بيت من البلدية بيت حكومي تسجيل بيت انتظار بيت قائمة انتظار اوخنتي urgentie sociale huurwoning woningcorporatie inschrijven woningnet woninghuren wachttijd loting statushouder woning',
 'tenant-rights-netherlands':'حقوق المستأجر زيادة الإيجار رفع الإيجار الكفالة التأمين المالك صاحب البيت إصلاحات تصليح عطل طرد إخلاء huurverhoging huurcommissie waarborgsom borg verhuurder reparatie gebreken huurrecht ontruiming huurcontract',
 'foreign-driving-license-exchange':'تبديل الرخصة تحويل الرخصة رخصة سورية رخصة عراقية رخصة تركية رخصة أجنبية شوفيرية سواقة 185 يوم معادلة رخصة القيادة رخصة أوروبية بلدية RDW rijbewijs omwisselen buitenlands rijbewijs 185 dagen 30%-regeling expatregeling gezondheidsverklaring rijbewijs inwisselen',
 'traffic-fines-cjib':'مخالفة مرور مخالفة سرعة غرامة كاميرا رادار فلاش مخالفة سير دفع المخالفة اعتراض على مخالفة تقسيط الغرامة انذار رسالة CJIB تضاعف الغرامة verkeersboete bekeuring flitsboete boete betalen betalingsregeling aanmaning beroep mulder cjib flitsfoto boetebase',
 'year-end-checklist-2026':'نهاية السنة قبل 31 ديسمبر تغيير التأمين قائمة مهام تغييرات 2027 السنة الجديدة jaareinde checklist overstappen zorgverzekering 2027 eigen risico 2027 wat verandert 2027',
 'adult-learning-finance':'قرض دراسة للكبار دراسة بعد الثلاثين دراسة بعد 30 قرض DUO قرض التعلم levenlang leven lang leren krediet levenlanglerenkrediet studeren na 30 lening opleiding volwassenen STAP SLIM تمويل الدراسة للكبار',
 'aow-aio-pension':'تقاعد معاش تقاعدي معاش الشيخوخة راتب تقاعد سن التقاعد اي او في aow aow leeftijd pensioen aio aanvulling ouderen SVB معاش الكبار',
 'birth-parental-leave':'إجازة ولادة اجازة ولادة إجازة أمومة اجازة حمل إجازة أبوة إجازة الأب إجازة الشريك اجازة الوالدين zwangerschapsverlof bevallingsverlof geboorteverlof ouderschapsverlof verlof baby UWV ولادة',
 'debt-help-schuldhulp':'ديون دين مساعدة الديون حل الديون ديون كثيرة قروض غرامات تقسيط schulden schuldhulp schuldsanering wsnp beslag deurwaarder incasso betalingsregeling مأمور تنفيذ حجز',
 'energy-emergency-fund-2027':'صندوق الطاقة صندوق الطوارئ للطاقة فاتورة الكهرباء فاتورة الغاز مساعدة الطاقة دعم الكهرباء دعم الغاز نودفوندس noodfonds noodfonds energie energietoeslag energierekening stroom gas hulp',
 'sick-pay-ziektewet-wia':'مرض مريض راتب المرض إعانة المرض اعانة مرض عجز عن العمل عاجز عن العمل زيكتيفت وي اي ا ziek ziektewet wia wga iva arbeidsongeschikt ziekmelden loondoorbetaling wajong UWV',
 'single-parent-support':'أم وحيدة أب وحيد والد وحيد مطلقة مطلق أم عزباء طلاق انفصال دعم المطلقة alleenstaande ouder alleenstaande moeder kindgebonden budget alo kop iack kinderopvangtoeslag scheiding',
 'social-assistance-bijstand':'مساعدة اجتماعية مساعدة البلدية سوسيال بايستاند بيستاند راتب البلدية معونة دخل البلدية bijstand bijstandsuitkering participatiewet sociale dienst uitkering gemeente',
 'special-assistance-bijzondere-bijstand':'مساعدة خاصة مساعدة إضافية مساعدة طارئة مصاريف غير متوقعة ثلاجة غسالة أثاث بيزوندره bijzondere bijstand extra kosten gemeente hulp inrichting',
 'unemployment-benefit-ww':'بطالة إعانة البطالة اعانة بطالة فقدت عملي فصل من العمل طرد من العمل راتب البطالة ويه ويه ww ww uitkering werkloos ontslag werkloosheidswet UWV',
 'wmo-home-support':'رعاية منزلية مساعدة في البيت تنظيف البيت كرسي متحرك مساعدة كبار السن إعاقة وي ام او wmo huishoudelijke hulp thuiszorg mantelzorg rolstoel woningaanpassing gemeente',
 'zorgtoeslag-guide':'زورخ توسلاخ زورغ توسلاغ زورك زورخ توسلاق بدل التأمين بدل الصحة بدل التامين تعويض التأمين مساعدة التأمين الصحي دعم التأمين zorg toeslag zorgtoeslg zorgtoslag health allowance',
 'housing-rent-allowance-2026':'بدل السكن بدل الإيجار بدل الاجار بدل الايجار مساعدة الإيجار دعم الإيجار هور توسلاخ هورتوسلاخ huur toeslag huurtoesla huurtoeslg rent allowance ايجار اجار',
 'kinderbijslag-guide':'مخصصات الأطفال مخصصات الاولاد فلوس الاولاد فلوس الأطفال راتب الاطفال بدل الأطفال كيندربايسلاخ كيندر بايسلاخ كندر بيسلاخ SVB child benefit kinder bijslag',
 'kindgebonden-budget-guide':'كيندخبوندن بودجيت كيندخيبوندن ميزانية الطفل بدل الطفل الاضافي kindgebonden kind gebonden budget',
 'childcare-allowance-kinderopvangtoeslag':'الحضانة روضة حضانة الأطفال بدل الحضانة كيندروبفانغ kinderopvang opvang creche daycare BSO',
 'toeslagpartner-guide':'شريك البدلات شريك toeslag partner الزوج الزوجة المساكنة samenwonen',
 'toeslagen-income-update':'تغيير الدخل تعديل الدخل ميين توسلاخن mijn toeslagen زاد راتبي ترجيع بدلات terugbetalen',
 'family-reunification-mvv-ind':'لم الشمل لمشمل لم شمل جمع الشمل لم شمل الزوجة لم شمل الزوج زوجتي خطيبتي MVV gezinshereniging partner IND دخل لم الشمل امتحان السفارة inburgering buitenland',
 'asylum-family-reunification':'لم شمل اللجوء نارايس nareis لاجئ لجوء asiel لم الشمل للاجئين',
 'eu-permanent-residence-netherlands':'اقامة دائمة إقامة دائمة دائمة اقامة طويلة onbepaalde tijd permanent verblijf langdurig ingezetene',
 'dutch-naturalisation-guide':'الجنسية الجنسية الهولندية تجنيس تجنس الجواز الهولندي باسبور naturalisatie nederlander worden',
 'inburgering-integration-law-2026':'الاندماج اندماج انبورخرينغ انبرخرنغ inburgeren inburgering امتحان الاندماج DUO inburgering',
 'nt2-b1-exam-guide':'امتحان اللغة امتحان الدولة NT2 B1 B2 staatsexamen لغة هولندية',
 'employment-contracts-labor-law-2026':'عقد عقد العمل كونتراكت vast contract tijdelijk contract arbeidscontract ثابت مؤقت',
 'minimum-wage-netherlands':'اقل معاش معاش بالساعة الحد الادنى الحد الأدنى للأجور اقل راتب أقل راتب الاجر بالساعة كم الراتب minimumloon minimum loon',
 'dutch-payslip-explained':'ورقة المعاش كشف الراتب قسيمة الراتب ورقة الراتب سليب loonstrook صافي اجمالي bruto netto الضريبة على الراتب',
 'zero-hours-contract':'صفر ساعات نول اورن nul uren oproep min max عقد عند الطلب',
 'temporary-agency-work-rights':'مكتب عمل مكتب تشغيل وكالة توظيف اوتسيند اوتزيند uitzendbureau uitzend',
 'kvk-zzp-business-netherlands':'شغل حر عمل حر فريلانسر شركة مشروع تسجيل شركة كاكافا KVK ZZP zelfstandige',
 'trending-jobs-2026':'وظائف مطلوبة شغل مطلوب نقص العمال مهن مطلوبة',
 'student-finance':'منحة قرض الدراسة قرض ستوفي ستودي studiefinanciering DUO دعم الطلاب تمويل الدراسة',
 'mbo-conditions':'ام بي او امبو MBO شروط التسجيل معهد مهني',
 'mbo-hbo-wo-comparison':'جامعة هبو HBO WO الفرق بين MBO HBO',
 'bol-bbl-comparison':'دراسة مع عمل تدريب ستاج stage BOL BBL',
 'mbo-dutch-language-options':'اللغة الهولندية للدراسة لا اتكلم هولندي',
 'diploma-evaluation-sbb':'معادلة الشهادة تعديل الشهادة تقييم الشهادة IDW nuffic SBB diploma waardering',
 'dutch-school-system-basisschool':'مدرسة الأطفال ابتدائي بازيس سخول basisschool تسجيل الطفل في المدرسة',
 'bsn-municipality-registration':'رقم بي اس ان BSN البلدية خيمينته gemeente تسجيل العنوان inschrijven',
 'digid-registration-guide':'ديجي دي ديجيد ديجد DigiD دجي دي كلمة السر الحكومية',
 'health-insurance-newcomers':'تأمين صحي تامين صحي zorgverzekering eigen risico الإيجار الذاتي تأمين',
 'health-insurance-2027':'تأمين 2027 تغيير التأمين zorgverzekering 2027 ارخص تأمين',
 'huisarts-registration':'طبيب العائلة الدكتور طبيب هاوس ارتس huisarts دكتور',
 'change-address-netherlands':'تغيير العنوان انتقال نقل السكن verhuizen adres',
 'cbr-driving-license-netherlands':'رخصة سواقة رخصة القيادة شوفيرية rijbewijs CBR',
 'energy-contracts-saving-2026':'كهرباء غاز فاتورة الطاقة energie stroom gas',
 'annual-tax-return-2026':'الضريبة الضرائب البلاستينغ بلاستينغ دينست belastingdienst aangifte الإقرار الضريبي ارجاع الضريبة',
 'municipal-taxes-exemption-kwijtschelding':'إعفاء البلدية ضريبة البلدية فاتورة الزبالة فاتورة الماء kwijtschelding gemeentebelasting',
 'prinsjesdag-2026-changes':'ميزانية 2027 قرارات الحكومة prinsjesdag يوم الأمير',
}

TOOLS = {
 'ar': [
  ('/tools.html#checklist','خطواتك الأولى','قائمة مرتبة بما تسجّله بعد الوصول','قائمة مهام بداية واصل جديد checklist'),
  ('/tools.html#budget','ميزانية الشهر','دخلك ومصاريفك والبدلات في جدول واحد','ميزانية مصروف حساب المصاريف budget'),
  ('/tools.html#salary','تقدير الراتب الصافي','من الإجمالي إلى الصافي لعام 2026','حاسبة الراتب حساب الصافي netto bruto calculator'),
  ('/cv.html','السيرة الذاتية CV','سيرة هولندية في أربع خطوات','سي في سيرة ذاتية cv curriculum'),
  ('/#pathway','مخطط المسار الدراسي','من وضعك الحالي إلى الشهادة','مسار دراسي'),
  ('/#levels','مستويات التعليم','VMBO وHAVO وMBO وHBO والجامعة','مستويات vmbo havo vwo'),
  ('/#compare','مقارنة المسارات','قارن مسارين جنباً إلى جنب','مقارنة'),
  ('/#transitions','الانتقال بين المستويات','كيف تنتقل من مستوى إلى آخر','انتقال'),
  ('/#mbo-beroepen','مهن MBO','المهن وما تحتاجه لكل منها','مهن مهنة beroep'),
  ('/#exams','امتحانات القبول','الامتحانات المطلوبة وكيف تستعد','امتحان قبول'),
  ('/#salaries','الرواتب حسب المهنة','رواتب تقديرية بعد التخرج','رواتب'),
 ],
 'nl': [
  ('/nl/tools.html#checklist','Eerste stappen','Checklist voor je eerste weken','checklist start'),
  ('/nl/tools.html#budget','Maandbudget','Inkomen, vaste lasten en toeslagen','budget kosten'),
  ('/nl/tools.html#salary','Nettosalaris 2026','Van bruto naar netto, indicatief','salaris rekenen netto bruto'),
  ('/nl/cv.html','Maak je cv','Nederlands cv in vier stappen','cv curriculum'),
  ('/nl/tools.html#routes','Onderwijsroutes','Mbo, hbo en wo naast elkaar','onderwijs routes'),
 ],
}

def topics_from_categories():
    """slug -> topic key, read from categories/*.html (a new article only has to be linked there)."""
    found = {}
    for cat in sorted((ROOT / 'categories').glob('*.html')):
        for slug in re.findall(r'href="/articles/([a-z0-9-]+)\.html"', cat.read_text(encoding='utf-8')):
            found.setdefault(slug, cat.stem)
    return found

def auto_keywords(slug, title, desc):
    """Fallback keywords for guides without hand-written aliases."""
    words = set(slug.replace('-', ' ').split())
    words |= set(re.findall(r'[A-Za-z][A-Za-z0-9]{2,}', title + ' ' + desc))
    return ' '.join(sorted(w for w in words if not w.isdigit()))

def text(s):
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def entry(path, lang, slug):
    s = path.read_text(encoding='utf-8')
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    title = text(h1s[-1]) if h1s else ''
    title = re.sub(r'^ترند عاجل\s*', '', title)
    if not title:
        m = re.search(r'<title>(.*?)</title>', s, re.S); title = text(m.group(1)).split('|')[0].strip()
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    heads = [text(h) for h in re.findall(r'<h2[^>]*>(.*?)</h2>', s, re.S)]
    SKIP = {'في هذا الدليل','In deze gids','الأسئلة الشائعة','Veelgestelde vragen','المصادر','Bronnen','المصادر الرسمية','Officiële bronnen','مسرد','Begrippen'}
    heads = [h for h in heads if h and len(h) < 90 and h not in SKIP][:14]
    topic = TOPIC.get(slug) or AUTO_TOPIC.get(slug)
    desc = html.unescape(d.group(1)) if d else ''
    return {
        'u': ('/nl' if lang == 'nl' else '') + f'/articles/{slug}.html', 'l': lang, 'y': 'guide',
        't': title, 'd': desc, 'h': ' | '.join(heads),
        'c': TOPIC_LABEL[lang].get(topic or '', ''), 'k': (ALIASES.get(slug) or auto_keywords(slug, title, desc)) + ' ' + TOPIC_ALIASES.get(topic or '', ''),
    }

AUTO_TOPIC = {}

def build():
    global AUTO_TOPIC
    AUTO_TOPIC = topics_from_categories()
    out, problems = [], []
    for f in sorted((ROOT / 'articles').glob('*.html')):
        e = entry(f, 'ar', f.stem); out.append(e)
        if not e['t']: problems.append(f'{e["u"]}: no title found')
        if not e['c']: problems.append(f'{e["u"]}: not linked from any category page (topic unknown)')
        nl = ROOT / 'nl' / 'articles' / f.name
        if nl.exists():
            out.append(entry(nl, 'nl', f.stem))
    for lang, tools in TOOLS.items():
        for u, t, d, k in tools:
            out.append({'u': u, 'l': lang, 'y': 'tool', 't': t, 'd': d, 'h': '', 'c': 'أداة' if lang == 'ar' else 'Hulpmiddel', 'k': k})
    for lang in ('ar', 'nl'):
        for key, label in TOPIC_LABEL[lang].items():
            out.append({'u': ('/nl' if lang == 'nl' else '') + f'/categories/{key}.html', 'l': lang, 'y': 'topic', 't': label,
                        'd': 'كل الأدلة في هذا القسم' if lang == 'ar' else 'Alle gidsen in dit onderwerp', 'h': '', 'c': '', 'k': TOPIC_ALIASES[key]})
    no_alias = sorted({e['u'] for e in out if e['y'] == 'guide' and e['l'] == 'ar' and e['u'].split('/')[-1][:-5] not in ALIASES})
    return {'v': 1, 'items': out}, problems, no_alias

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='exit 1 if the committed index is out of date')
    args = ap.parse_args()
    path = ROOT / 'assets' / 'search-index.json'
    data, problems, no_alias = build()
    new = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    old = path.read_text(encoding='utf-8') if path.exists() else '{"items":[]}'
    old_urls = {(e['u'], e['l']) for e in json.loads(old).get('items', [])}
    new_urls = {(e['u'], e['l']) for e in data['items']}
    added, removed = sorted(new_urls - old_urls), sorted(old_urls - new_urls)
    changed = new != old
    print(f"entries: {len(data['items'])} | added: {len(added)} | removed: {len(removed)} | changed: {changed}")
    for u, l in added: print(f'  + [{l}] {u}')
    for u, l in removed: print(f'  - [{l}] {u}')
    for p in problems: print(f'  ! {p}')
    if no_alias: print('  i guides using automatic keywords only (add ALIASES for better colloquial search): ' + ', '.join(no_alias))
    if args.check:
        sys.exit(1 if changed else 0)
    if changed:
        path.write_text(new, encoding='utf-8')
        print('wrote', path.relative_to(ROOT))

if __name__ == '__main__':
    main()
    import runpy, pathlib
    runpy.run_path(str(pathlib.Path(__file__).with_name('build_llms_txt.py')), run_name='__main__')
