# متابعة فهرسة Google

سير العمل **Google indexing monitor** يفحص يومياً الساعة 04:45 UTC، وعند تغيير الصفحات أو خريطة الموقع، ويمكن تشغيله يدوياً من Actions. أول إضافة له تشغّل فحصاً فورياً.

يستخدم السر الموجود `GSC_SERVICE_ACCOUNT_JSON` والخاصية المتحققة `https://gidsnederland.nl/`. يحتاج حساب الخدمة صلاحية مستخدم كامل أو مالك في Search Console لإرسال الخريطة. تبقى المفاتيح في GitHub Secrets ولا تُكتب في التقارير.

يفحص الروابط باستخدام URL Inspection API، ويفصل المفهرس وغير المفهرس وأخطاء الاتصال والروابط غير المفحوصة. لا يعتبر خطأ API أو انتهاء الحصة فهرسة ناجحة. يفحص HTTP وcanonical وnoindex للروابط المتبقية، ويسجل كل الروابط وعناوينها دون اختصار القائمة.

يرسل `https://gidsnederland.nl/sitemap.xml` عبر Search Console Sitemaps API عند تغيّر الروابط/lastmod الحقيقي أو بعد مرور سبعة أيام على آخر إرسال ناجح. يتحقق من تطابق الخريطة المنشورة مع النسخة المفحوصة قبل إرسالها. لا يغيّر تواريخ lastmod أو المحتوى لإجبار إعادة الزحف، ولا يعدّل أداة رسائل الطعن أو صفحات noindex المتعمدة.

الملفات التي يحدثها داخل `docs/indexing/`:

- `REPORT.md`: ملخص قابل للقراءة مع القائمة الكاملة للمتبقي وأسباب Google والعوائق التقنية.
- `report.json`: نتائج الفحص الحالية وأي فشل إرسال أو صلاحيات.
- `pending.csv`: العناوين والروابط المتبقية أو مجهولة الحالة، للمراجعة وطلبات الفهرسة اليدوية ذات الأولوية.
- `history.json`: تطور الأعداد لآخر 90 يوماً.
- `state.json`: حالة كل رابط وموعد وبصمة آخر إرسال ناجح، لمنع الإرسال المتكرر.

نجاح التشغيل يعني أن الفحص والإرسال/التأجيل النظامي نجحا، وليس أن كل الصفحات أصبحت مفهرسة. يستمر الفحص ما دامت توجد صفحات متبقية، ويرصد أيضاً الصفحات الجديدة وفقدان الفهرسة لاحقاً. عند نمو الموقع فوق حد الفحص، تبقى الروابط غير المفحوصة «مجهولة» ويظهر فشل يحتاج رفع الحد ضمن حصة Google.

Google لا توفر طلب فهرسة مباشر عبر URL Inspection API. واجهة Indexing API مخصصة لصفحات JobPosting وBroadcastEvent، ولا تُستخدم للمقالات العادية. يمكن طلب فهرسة رابط مهم يدوياً من Search Console، لكن الطلب أو إرسال الخريطة لا يضمن الفهرسة ولا يسرّعها تكرار الطلب نفسه.

المراجع الرسمية:

- https://developers.google.com/webmaster-tools/v1/sitemaps/submit
- https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/apis/indexing-api/v3/quickstart
