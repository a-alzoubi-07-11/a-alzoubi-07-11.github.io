#!/usr/bin/env python3
"""Build assets/search-index.json for the site search.

Run after adding or renaming articles:
    python3 .github/scripts/build_search_index.py

Each entry: u (url), l (ar|nl), y (guide|tool|topic), t (title), d (description),
h (headings), c (topic label), k (aliases: colloquial Arabic, Dutch terms,
transliterations and common misspellings that should find this page).
"""
from __future__ import annotations
import html, json, re
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
 'minimum-wage-netherlands':'الحد الادنى الحد الأدنى للأجور اقل راتب أقل راتب الاجر بالساعة كم الراتب minimumloon minimum loon',
 'dutch-payslip-explained':'قسيمة الراتب ورقة الراتب سليب loonstrook صافي اجمالي bruto netto الضريبة على الراتب',
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
  ('/index.html#pathway','مخطط المسار الدراسي','من وضعك الحالي إلى الشهادة','مسار دراسي'),
  ('/index.html#levels','مستويات التعليم','VMBO وHAVO وMBO وHBO والجامعة','مستويات vmbo havo vwo'),
  ('/index.html#compare','مقارنة المسارات','قارن مسارين جنباً إلى جنب','مقارنة'),
  ('/index.html#transitions','الانتقال بين المستويات','كيف تنتقل من مستوى إلى آخر','انتقال'),
  ('/index.html#mbo-beroepen','مهن MBO','المهن وما تحتاجه لكل منها','مهن مهنة beroep'),
  ('/index.html#exams','امتحانات القبول','الامتحانات المطلوبة وكيف تستعد','امتحان قبول'),
  ('/index.html#salaries','الرواتب حسب المهنة','رواتب تقديرية بعد التخرج','رواتب'),
 ],
 'nl': [
  ('/nl/tools.html#checklist','Eerste stappen','Checklist voor je eerste weken','checklist start'),
  ('/nl/tools.html#budget','Maandbudget','Inkomen, vaste lasten en toeslagen','budget kosten'),
  ('/nl/tools.html#salary','Nettosalaris 2026','Van bruto naar netto, indicatief','salaris rekenen netto bruto'),
  ('/nl/cv.html','Maak je cv','Nederlands cv in vier stappen','cv curriculum'),
  ('/nl/tools.html#routes','Onderwijsroutes','Mbo, hbo en wo naast elkaar','onderwijs routes'),
 ],
}

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
    topic = TOPIC.get(slug)
    return {
        'u': ('/nl' if lang == 'nl' else '') + f'/articles/{slug}.html', 'l': lang, 'y': 'guide',
        't': title, 'd': html.unescape(d.group(1)) if d else '', 'h': ' | '.join(heads),
        'c': TOPIC_LABEL[lang].get(topic, ''), 'k': ALIASES.get(slug, '') + ' ' + TOPIC_ALIASES.get(topic, ''),
    }

def main():
    out = []
    for f in sorted((ROOT / 'articles').glob('*.html')):
        out.append(entry(f, 'ar', f.stem))
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
    (ROOT / 'assets' / 'search-index.json').write_text(json.dumps({'v': 1, 'items': out}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(len(out), 'entries')

if __name__ == '__main__':
    main()
