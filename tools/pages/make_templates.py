"""Build /templates.html and /nl/templates.html: Dutch letter templates with Arabic explanations.
Templates and logic live in assets/letter-templates.js (tested by tests/letters.test.js).
Run: python3 tools/pages/make_templates.py
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_page import page  # noqa: E402

HEAD = '<link rel="stylesheet" href="/assets/letter-templates.css?v=1"><script src="/assets/letter-templates.js?v=1" defer></script>'
AR = dict(title='نماذج رسائل هولندية جاهزة', desc='نماذج رسائل بالهولندية مع شرح عربي: طلب موعد، طلب وثائق، سؤال للبلدية، إلغاء اشتراك، ورسالة لصاحب العمل. املأ الحقول وانسخ الرسالة.',
  main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/"><span>الرئيسية</span></a></li>'
        '<li><a href="/tools.html"><span>الأدوات</span></a></li><li aria-current="page"><span>نماذج رسائل</span></li></ol></nav><article class="reader"><h1><span>نماذج رسائل هولندية جاهزة</span></h1>'
        '<p class="summary"><span>اختر نموذجاً، اقرأ متى تستخدمه، واملأ الحقول بالهولندية البسيطة. تظهر الرسالة الهولندية فوراً ويمكنك نسخها. '
        'هذه نماذج عامة وليست استشارة قانونية؛ للاعتراض على قرار استخدم <a href="/articles/bezwaar-objection-letter.html">دليل الاعتراض</a>، وللطعن على رفض الإقامة الدائمة استخدم <a href="/beroep/">أداة رسالة الطعن</a>.</span></p>'
        '<div id="letters"><noscript><p>هذه الأداة تحتاج JavaScript.</p></noscript></div></article></main>'))
NL = dict(title='Voorbeeldbrieven in het Nederlands', desc='Voorbeeldbrieven: afspraak aanvragen, documenten opvragen, vraag aan de gemeente, abonnement opzeggen en bericht aan je werkgever. Vul in en kopieer.',
  main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/nl/"><span>Home</span></a></li>'
        '<li><a href="/nl/tools.html"><span>Hulpmiddelen</span></a></li><li aria-current="page"><span>Voorbeeldbrieven</span></li></ol></nav><article class="reader"><h1><span>Voorbeeldbrieven in het Nederlands</span></h1>'
        '<p class="summary"><span>Kies een brief, lees wanneer je hem gebruikt en vul de velden in. De brief verschijnt direct en je kunt hem kopiëren. '
        'Dit zijn algemene voorbeelden, geen juridisch advies; voor bezwaar tegen een besluit zie de <a href="/nl/articles/bezwaar-objection-letter.html">gids bezwaar maken</a>.</span></p>'
        '<div id="letters"><noscript><p>Dit hulpmiddel heeft JavaScript nodig.</p></noscript></div></article></main>'))
if __name__ == '__main__':
    for lang, L, path, twin in (('ar', AR, 'templates.html', 'nl/templates.html'), ('nl', NL, 'nl/templates.html', 'templates.html')):
        print(page(lang=lang, path=path, twin=twin, title=L['title'], desc=L['desc'], main=L['main'], head_extra=HEAD))
