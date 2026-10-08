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
 'bsn-municipality-registration':'housing سجل البلدية بي ار بي موعد البلدية تسجيل السكن عنوان بريدي BRP afspraak gemeente sofinummer burgerservicenummer','digid-registration-guide':'housing','health-insurance-newcomers':'housing',
 'huisarts-registration':'housing طبيب عام تسجيل عند طبيب طوارئ ليلاً خط الطوارئ 112 huisartsenpost spoed apotheek inschrijven huisarts','change-address-netherlands':'housing','health-insurance-2027':'housing',
 'cbr-driving-license-netherlands':'housing امتحان السواقة امتحان نظري امتحان عملي مدرسة سواقة دروس سواقة theorie-examen praktijkexamen rijschool','energy-contracts-saving-2026':'money',
 'family-reunification-mvv-ind':'residence','asylum-family-reunification':'residence','eu-permanent-residence-netherlands':'residence',
 'dutch-naturalisation-guide':'residence جواز هولندي الجنسية بعد 5 سنوات حفل التجنيس التخلي عن الجنسية naturalisatieceremonie afstandsplicht','inburgering-integration-law-2026':'residence','nt2-b1-exam-guide':'residence',
 'employment-contracts-labor-law-2026':'work فصل من العمل فترة التجربة عقد مؤقت عقد دائم proeftijd ontslag transitievergoeding opzegtermijn','minimum-wage-netherlands':'work','dutch-payslip-explained':'work',
 'zero-hours-contract':'work عقد الطلب عقد بدون ساعات شغل بالاستدعاء ساعات قليلة عرض ساعات ثابتة بعد 12 شهر nulurencontract oproepkracht min-max contract 3 uur vaste uren aanbod','temporary-agency-work-rights':'work','kvk-zzp-business-netherlands':'work','trending-jobs-2026':'work',
 'mbo-hbo-wo-comparison':'education الفرق بين المعهد والجامعة جامعة تطبيقية جامعة بحثية بكالوريوس ماستر hogeschool universiteit bachelor master verschil mbo hbo wo','mbo-conditions':'education','bol-bbl-comparison':'education','student-finance':'education',
 'mbo-dutch-language-options':'education الدراسة بالإنجليزي معهد بدون هولندي تعلم الهولندي للدراسة لغة المعهد Nederlands als tweede taal mbo nieuwkomers taaleis entree','diploma-evaluation-sbb':'education','dutch-school-system-basisschool':'education',
 'zorgtoeslag-guide':'benefits','housing-rent-allowance-2026':'benefits','kinderbijslag-guide':'benefits',
 'kindgebonden-budget-guide':'benefits بدل الأطفال الإضافي فلوس الأولاد من الضرائب kindgebonden budget bedrag 2026','childcare-allowance-kinderopvangtoeslag':'benefits','toeslagpartner-guide':'benefits',
 'toeslagen-income-update':'benefits تحديث الدخل البدلات ارجاع البدلات دين البدلات inkomen doorgeven voorschot','annual-tax-return-2026':'money','municipal-taxes-exemption-kwijtschelding':'money',
 'prinsjesdag-2026-changes':'money ميزانية الحكومة التغييرات القادمة قرارات الميزانية الضرائب الجديدة miljoenennota begroting 2027 wat verandert',
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
 'asylum-two-status-system-2026':'نظام الحالتين نظام الحالتين اللجوء لاجئ حماية ثانوية اقامة لجوء ثلاث سنوات اقامة مؤقتة اقامة غير محددة تغيير قوانين اللجوء 12 يونيو لم الشمل للحماية الثانوية انتظار سنتين جمع الشمل طلب لم الشمل موقوف IND ما بيبت بطلبي ستاتوس الحماية الاضافية تعديل الاقامة بطاقة اللجوء tweestatusstelsel twee statussen subsidiaire bescherming vluchteling asielvergunning bepaalde tijd onbepaalde tijd nareis nareistermijn migratiepact asielpas pasje statushouder wachttijd nareis IND beslist niet',
 'syrian-documents-legalisation-translation':'وثائق سورية تصديق الوثائق السورية ترجمة محلفة مترجم محلف ترجمة معتمدة شهادة ميلاد سورية عقد زواج سوري دفتر العائلة هوية سورية تصديق الخارجية السورية سفارة دمشق مغلقة تصديق شهادة تصديق اوراق تسجيل الوثائق في البلدية معادلة وثائق اوراق سورية legalisatie legaliseren Syrische documenten beëdigd vertaler beëdigde vertaling vertaling Arabisch geboorteakte huwelijksakte familieboekje Bureau Wbtv buitenlandse akte omzetten BRP inschrijven akte',
 'asylum-residence-hub':'اللجوء مركز اللجوء كل اللجوء مساعدة لاجئين مساعدة قانونية مجانية فلوختيلينغ فيرك VluchtelingenWerk جوريديش لوكيت Juridisch Loket مستشار اجتماعي sociaal raadslieden محقق وطني اومبودسمان ombudsman شكوى ضد IND اين اجد مساعدة منظمات اللاجئين اقامة لجوء اقامة دليل اللجوء asiel hub hulp vluchtelingen gratis juridische hulp klacht overheid nationale ombudsman sociaal raadsman asielzoeker verblijf',
 'bezwaar-objection-letter':'اعتراض رسالة اعتراض اعتراض على قرار اعتراض على التوسلاخ اعتراض على البلدية بيزوار بزوار رفض طلب قرار ظالم محكمة استئناف bezwaar bezwaarschrift bezwaar maken bezwaarbrief pro forma bezwaar ingebrekestelling dwangsom beroep rechtbank griffierecht',
 'legal-aid-lawyer-toevoeging':'محامي مجاني محامي ببلاش محامي على حساب الدولة محامي مدعوم مساعدة قانونية استشارة قانونية جوريديش لوكيت توفوخينغ toevoeging toevoeging advocaat gratis advocaat pro deo advocaat prodeo juridisch loket eigen bijdrage advocaat rechtsbijstand raad voor rechtsbijstand toevoging',
 'scams-phishing-netherlands':'احتيال نصب نصاب رسالة مزيفة رسالة الضرائب مزيفة هاي ماما تصيد فيشينغ سرقة حساب البنك oplichting phishing fishing oplichter hoi mam bankhelpdeskfraude geldezel nepwebshop tikkie fraude fraudehelpdesk quishing',
 'pregnancy-newborn-care':'حمل حامل ولادة قابلة الداية فرلوسكوندخه كرامزورخ ممرضة الولادة تسجيل المولود تسجيل الطفل الاعتراف بالطفل إيكو سونار verloskundige kraamzorg zwanger bevalling aangifte geboorte erkenning 20 wekenecho nipt hielprik kraampakket consultatiebureau',
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
 'childcare-allowance-kinderopvangtoeslag':'الحضانة روضة حضانة الأطفال بدل الحضانة كيندروبفانغ kinderopvang opvang creche daycare BSO بدل الحضانة الساعات حضانة بعد المدرسة kinderopvangtoeslag uurprijs gastouder',
 'toeslagpartner-guide':'شريك البدلات شريك toeslag partner الزوج الزوجة المساكنة samenwonen شريك الحياة الزوج والزوجة بالبدلات مساكن صديقة صديق نسكن مع بعض عقد شراكة partnerschap fiscale partner gehuwd samenwonend medehuurder kind 18 ouder inwonend',
 'toeslagen-income-update':'تغيير الدخل تعديل الدخل ميين توسلاخن mijn toeslagen زاد راتبي ترجيع بدلات terugbetalen',
 'family-reunification-mvv-ind':'لم الشمل لمشمل لم شمل جمع الشمل لم شمل الزوجة لم شمل الزوج زوجتي خطيبتي MVV gezinshereniging partner IND دخل لم الشمل امتحان السفارة inburgering buitenland',
 'asylum-family-reunification':'لم شمل اللجوء نارايس nareis لاجئ لجوء asiel لم الشمل للاجئين لمشمل لاجئ لم شمل الأولاد لم شمل الزوجة لاجئ ثلاثة أشهر مهلة 3 أشهر وثائق DNA فحص الحمض nareisaanvraag verblijfsvergunning asiel gezinsleden',
 'eu-permanent-residence-netherlands':'اقامة دائمة إقامة دائمة دائمة اقامة طويلة onbepaalde tijd permanent verblijf langdurig ingezetene إقامة غير محدودة إقامة دائمة 5 سنوات verblijfsvergunning onbepaalde tijd EU-langdurig ingezetene',
 'dutch-naturalisation-guide':'الجنسية الجنسية الهولندية تجنيس تجنس الجواز الهولندي باسبور naturalisatie nederlander worden',
 'inburgering-integration-law-2026':'الاندماج اندماج انبورخرينغ انبرخرنغ inburgeren inburgering امتحان الاندماج DUO inburgering دورة الاندماج مدرسة اللغة PVT خطة الاندماج B1 route Z route onderwijsroute inburgeringsplicht',
 'nt2-b1-exam-guide':'امتحان اللغة امتحان الدولة NT2 B1 B2 staatsexamen لغة هولندية امتحان اللغة الهولندية امتحان الدولة نت تو ستاتس اكزامن مستوى بي ون مستوى بي تو تسجيل امتحان سعر الامتحان staatsexamen nt2 programma I II taalexamen',
 'employment-contracts-labor-law-2026':'عقد عقد العمل كونتراكت vast contract tijdelijk contract arbeidscontract ثابت مؤقت',
 'minimum-wage-netherlands':'اقل معاش معاش بالساعة الحد الادنى الحد الأدنى للأجور اقل راتب أقل راتب الاجر بالساعة كم الراتب minimumloon minimum loon',
 'dutch-payslip-explained':'ورقة المعاش كشف الراتب قسيمة الراتب ورقة الراتب سليب loonstrook صافي اجمالي bruto netto الضريبة على الراتب',
 'zero-hours-contract':'صفر ساعات نول اورن nul uren oproep min max عقد عند الطلب',
 'temporary-agency-work-rights':'مكتب عمل مكتب تشغيل وكالة توظيف اوتسيند اوتزيند uitzendbureau uitzend وكالة العمالة اوتسيندبورو اتسيند شركة تشغيل عقد A B C مرحلة عقد وكالة uitzendkracht fase A fase B uitzendovereenkomst inlener ABU NBBU',
 'kvk-zzp-business-netherlands':'شغل حر عمل حر فريلانسر شركة مشروع تسجيل شركة كاكافا KVK ZZP zelfstandige فتح شركة سجل تجاري رقم كي في كي ضريبة BTW عمل مستقل فري لانس بيزنس eenmanszaak btw-nummer ondernemer kleineondernemersregeling KOR',
 'trending-jobs-2026':'وظائف مطلوبة شغل مطلوب نقص العمال مهن مطلوبة شغل سريع وظائف كثيرة نقص عمالة شغل في التمريض شغل في البناء فنيين وظائف للأجانب kansberoepen tekortberoepen vacatures UWV beroepen werk zoeken',
 'student-finance':'منحة قرض الدراسة قرض ستوفي ستودي studiefinanciering DUO دعم الطلاب تمويل الدراسة ستوفي فلوس الدراسة منحة أداء منحة إضافية تذكرة السفر للطلاب studiefinanciering aanvullende beurs studentenreisproduct',
 'mbo-conditions':'ام بي او امبو MBO شروط التسجيل معهد مهني التسجيل في المعهد شروط المعهد المهني MBO مستوى 1 2 3 4 انتري entree toelatingseisen mbo inschrijven mbo niveau 1 2 3 4 lesgeld',
 'mbo-hbo-wo-comparison':'جامعة هبو HBO WO الفرق بين MBO HBO',
 'bol-bbl-comparison':'دراسة مع عمل تدريب ستاج stage BOL BBL تدريب مهني دراسة وشغل عمل مع دراسة راتب أثناء الدراسة leerbaan beroepsopleidende leerweg beroepsbegeleidende leerweg stage leerbedrijf',
 'mbo-dutch-language-options':'اللغة الهولندية للدراسة لا اتكلم هولندي',
 'diploma-evaluation-sbb':'معادلة الشهادة تعديل الشهادة تقييم الشهادة IDW nuffic SBB diploma waardering معادلة شهادة جامعية الاعتراف بالشهادة تقييم الشهادة الأجنبية diplomawaardering IDW Nuffic buitenlands diploma',
 'dutch-school-system-basisschool':'مدرسة الأطفال ابتدائي بازيس سخول basisschool تسجيل الطفل في المدرسة مدرسة ابتدائية تسجيل الأولاد بالمدرسة المدرسة الإلزامية صف مدرسة الأطفال روضة leerplicht groep 1 schoolkeuze VO middelbare school',
 'bsn-municipality-registration':'رقم بي اس ان BSN البلدية خيمينته gemeente تسجيل العنوان inschrijven',
 'digid-registration-guide':'ديجي دي ديجيد ديجد DigiD دجي دي كلمة السر الحكومية رمز التفعيل رسالة التفعيل تطبيق ديجيد ID check ديجي دي ما وصلني activeringscode DigiD app sms-controle inloggen',
 'health-insurance-newcomers':'تأمين صحي تامين صحي zorgverzekering eigen risico الإيجار الذاتي تأمين تأمين للقادمين الجدد غرامة التأمين أربعة أشهر basisverzekering CAK boete zorgverzekeraar verplicht verzekeren',
 'health-insurance-2027':'تأمين 2027 تغيير التأمين zorgverzekering 2027 ارخص تأمين تأمين السنة الجديدة قسط التأمين التحمل الذاتي 2027 premie 2027 overstappen basispakket aanvullende verzekering',
 'huisarts-registration':'طبيب العائلة الدكتور طبيب هاوس ارتس huisarts دكتور',
 'change-address-netherlands':'تغيير العنوان انتقال نقل السكن verhuizen adres نقل العنوان تغيير البيت الانتقال لبيت جديد تسجيل العنوان الجديد verhuizing doorgeven adreswijziging gemeente',
 'cbr-driving-license-netherlands':'رخصة سواقة رخصة القيادة شوفيرية rijbewijs CBR',
 'energy-contracts-saving-2026':'كهرباء غاز فاتورة الطاقة energie stroom gas توفير الكهرباء توفير الغاز عقد ثابت عقد متغير فاتورة الطاقة الشهرية vast contract variabel contract energieleverancier besparen',
 'annual-tax-return-2026':'الضريبة الضرائب البلاستينغ بلاستينغ دينست belastingdienst aangifte الإقرار الضريبي ارجاع الضريبة إقرار ضريبي ارجاع ضريبة اعادة الضريبة blauwe envelop aangifte inkomstenbelasting voorlopige aanslag',
 'municipal-taxes-exemption-kwijtschelding':'إعفاء البلدية ضريبة البلدية فاتورة الزبالة فاتورة الماء kwijtschelding gemeentebelasting ضرائب البلدية إعفاء من الضرائب ضريبة النفايات waterschapsbelasting afvalstoffenheffing rioolheffing',
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
