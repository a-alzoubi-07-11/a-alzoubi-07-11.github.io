"""Build /partners.html and /nl/partners.html: all active partner offers (from assets/partners.json),
with a clear advertising disclosure. The list is rendered in the browser from the same JSON as the bar,
so adding an offer only needs a change in assets/partners.json.

Run: python3 tools/pages/make_partners.py
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_page import page, REPO  # noqa: E402

LIST_JS = '<script src="/assets/partners-page.js?v=1" defer></script>'

AR = dict(
    title='عروض الشركاء وأكواد الخصم',
    desc='عروض وأكواد خصم من شركاء دليل هولندا بالعربية، مثل مكاتب الترجمة المحلفة. كل عرض إعلان مدفوع وموضّح بوضوح.',
    main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/"><span>الرئيسية</span></a></li>'
          '<li aria-current="page"><span>عروض الشركاء</span></li></ol></nav><article class="reader"><h1><span>عروض الشركاء وأكواد الخصم</span></h1>'
          '<p class="summary"><span>هنا تجد العروض الحالية من شركاء الموقع. هذه <strong>إعلانات وتعاونات مدفوعة</strong>: قد يحصل الموقع على مقابل من الشريك. '
          'لا نختبر خدمات الشركاء ولا نضمنها، ولا يؤثر أي تعاون على محتوى الأدلة أو مصادرها الرسمية. قارن الأسعار واطلب عرض سعر مكتوباً قبل الدفع.</span></p>'
          '<div id="partner-list"><p class="muted">…</p></div>'
          '<section class="tool-section"><h2>تريد أن تصبح شريكاً؟</h2><p>إذا كنت تقدم خدمة مفيدة للعرب في هولندا (ترجمة محلفة، محاسبة، دورات لغة…)، '
          'راسلنا عبر <a href="/contact.html">صفحة التواصل</a>. نعرض فقط خدمات قانونية بوصف واضح وبلا وعود مضللة.</p></section>'
          '</article></main>'),
)
NL = dict(
    title='Aanbiedingen van partners en kortingscodes',
    desc='Aanbiedingen en kortingscodes van partners van Gids Nederland, zoals beëdigde vertaalbureaus. Elke aanbieding is duidelijk gemarkeerd als advertentie.',
    main=('<main id="content" class="wrap"><nav class="breadcrumbs" aria-label="مسار التنقل / Kruimelpad"><ol><li><a href="/nl/"><span>Home</span></a></li>'
          '<li aria-current="page"><span>Partners</span></li></ol></nav><article class="reader"><h1><span>Aanbiedingen van partners en kortingscodes</span></h1>'
          '<p class="summary"><span>Hier staan de actuele aanbiedingen van onze partners. Dit zijn <strong>advertenties en betaalde samenwerkingen</strong>: '
          'de site kan een vergoeding van de partner krijgen. Wij testen en garanderen de diensten van partners niet, en geen samenwerking beïnvloedt de inhoud '
          'van de gidsen of hun officiële bronnen. Vergelijk prijzen en vraag een schriftelijke offerte voordat je betaalt.</span></p>'
          '<div id="partner-list"><p class="muted">…</p></div>'
          '<section class="tool-section"><h2>Partner worden?</h2><p>Bied je een nuttige dienst voor Arabischtaligen in Nederland (beëdigd vertalen, boekhouding, taalcursussen…)? '
          'Neem contact op via de <a href="/nl/contact.html">contactpagina</a>. We tonen alleen legale diensten, duidelijk omschreven en zonder misleidende beloften.</p></section>'
          '</article></main>'),
)

if __name__ == '__main__':
    for lang, L, path, twin in (('ar', AR, 'partners.html', 'nl/partners.html'), ('nl', NL, 'nl/partners.html', 'partners.html')):
        out = page(lang=lang, path=path, twin=twin, title=L['title'], desc=L['desc'], main=L['main'],
                   head_extra='<link rel="stylesheet" href="/assets/tools.css?v=1">')
        s = open(out, encoding='utf-8').read()
        # offers change often and are advertising: keep this page out of Google's index, links still followed
        s = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex,follow">', s, count=1)
        s = s.replace('</main>', '</main>' + LIST_JS, 1)
        open(out, 'w', encoding='utf-8').write(s)
        print(out)
