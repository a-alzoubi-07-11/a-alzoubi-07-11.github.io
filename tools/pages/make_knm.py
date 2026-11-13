"""Build /knm-oefenen.html and /nl/knm-oefenen.html: practice questions about Dutch society (KNM themes).
Questions: assets/knm-questions.js (checked by tests/knm.test.js). Run: python3 tools/pages/make_knm.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_page import page  # noqa: E402
HEAD = '<link rel="stylesheet" href="/assets/knm.css?v=1"><script src="/assets/knm-questions.js?v=1" defer></script><script src="/assets/knm.js?v=1" defer></script>'
AR = dict(title='تدريب على امتحان KNM: أسئلة عن المجتمع الهولندي', desc='تدرّب مجاناً على أسئلة معرفة المجتمع الهولندي KNM بالعربية والهولندية: الصحة، العمل، التعليم، الدولة، التاريخ والحياة اليومية، مع شرح لكل جواب.',
 main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/"><span>الرئيسية</span></a></li><li><a href="/tools.html"><span>الأدوات</span></a></li>'
       '<li aria-current="page"><span>تدريب KNM</span></li></ol></nav><article class="reader"><h1><span>تدريب على امتحان KNM</span></h1><p class="article-sub"><span>أسئلة عن المجتمع الهولندي مع شرح لكل جواب</span></p>'
       '<p class="summary"><span>اختر موضوعاً وأجب عن 10 أسئلة. بعد كل سؤال ترى الجواب الصحيح وشرحه. <strong>هذه أسئلة تدريب كتبها الموقع وليست أسئلة الامتحان الرسمي</strong>؛ للتحضير الكامل استخدم أيضاً أمثلة الامتحانات الرسمية على inburgeren.nl. '
       'يمكنك التبديل إلى الهولندية من أعلى الصفحة لتتدرب بلغة الامتحان. نتيجتك تُحفظ على جهازك فقط.</span></p>'
       '<div id="knm"><noscript><p>هذه الأداة تحتاج JavaScript.</p></noscript></div>'
       '<section class="tool-section"><h2>اقرأ أيضاً</h2><ul><li><a href="/articles/inburgering-integration-law-2026.html">دليل الاندماج (inburgering)</a></li><li><a href="/articles/nt2-b1-exam-guide.html">امتحان الدولة NT2</a></li><li><a href="/articles/dutch-naturalisation-guide.html">الجنسية الهولندية بالتجنس</a></li></ul></section></article></main>'))
NL = dict(title='KNM oefenen: vragen over de Nederlandse maatschappij', desc='Oefen gratis met vragen over Kennis van de Nederlandse Maatschappij (KNM): gezondheid, werk, onderwijs, staat, geschiedenis en dagelijks leven, met uitleg bij elk antwoord.',
 main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/nl/"><span>Home</span></a></li><li><a href="/nl/tools.html"><span>Hulpmiddelen</span></a></li>'
       '<li aria-current="page"><span>KNM oefenen</span></li></ol></nav><article class="reader"><h1><span>KNM oefenen</span></h1><p class="article-sub"><span>Vragen over de Nederlandse maatschappij, met uitleg bij elk antwoord</span></p>'
       '<p class="summary"><span>Kies een onderwerp en beantwoord 10 vragen. Na elke vraag zie je het goede antwoord met uitleg. <strong>Dit zijn oefenvragen van deze site, geen officiële examenvragen</strong>; gebruik ook de officiële oefenexamens op inburgeren.nl. '
       'Je score wordt alleen op je eigen apparaat bewaard.</span></p>'
       '<div id="knm"><noscript><p>Dit hulpmiddel heeft JavaScript nodig.</p></noscript></div>'
       '<section class="tool-section"><h2>Lees ook</h2><ul><li><a href="/nl/articles/inburgering-integration-law-2026.html">Inburgeren</a></li><li><a href="/nl/articles/nt2-b1-exam-guide.html">Staatsexamen Nt2</a></li><li><a href="/nl/articles/dutch-naturalisation-guide.html">Naturalisatie</a></li></ul></section></article></main>'))
if __name__ == '__main__':
    for lang, L, path, twin in (('ar', AR, 'knm-oefenen.html', 'nl/knm-oefenen.html'), ('nl', NL, 'nl/knm-oefenen.html', 'knm-oefenen.html')):
        print(page(lang=lang, path=path, twin=twin, title=L['title'], desc=L['desc'], main=L['main'], head_extra=HEAD))
