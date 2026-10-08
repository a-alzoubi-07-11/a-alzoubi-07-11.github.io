import re, json, html
REPO = str(__import__('pathlib').Path(__file__).resolve().parents[2])
BASE="https://gidsnederland.nl"
LBL={'ar':dict(toc='في هذا الدليل',faq='أسئلة شائعة',sumdef='الخلاصة العملية',src='المصادر الرسمية',faqid='ar-faq',vf='التحقق من المصادر الرسمية ونطاق هذا الدليل:'),
     'nl':dict(toc='In deze gids',faq='Veelgestelde vragen',sumdef='Kort samengevat',src='Officiële bronnen',faqid='nl-faq',vf='Officiële bronnen en reikwijdte gecontroleerd:')}
def esc(s): return html.escape(s,quote=True)
def build(slug,lang,spec,date_iso,date_text):
    path=f"{REPO}/{'nl/' if lang=='nl' else ''}articles/{slug}.html"
    t=open(path,encoding='utf-8').read()
    L=LBL[lang]; title=spec['title']; desc=spec['desc']; site='Nederlandsgids' if lang=='nl' else 'دليل هولندا بالعربية'
    full=f"{spec.get('seo_title') or title} | {site}"  # optional short SEO <title>; H1/headline keep the full title
    t=re.sub(r'<title>.*?</title>',lambda m:f'<title>{esc(full)}</title>',t,1,re.S)
    t=re.sub(r'(<meta name="description" content=")[^"]*"',lambda m:m.group(1)+esc(desc)+'"',t,1)
    t=re.sub(r'(<meta property="og:title" content=")[^"]*"',lambda m:m.group(1)+esc(full)+'"',t,1)
    t=re.sub(r'(<meta property="og:description" content=")[^"]*"',lambda m:m.group(1)+esc(desc)+'"',t,1)
    # JSON-LD
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',t,re.S)
    j=json.loads(m.group(1))
    for n in j['@graph']:
        if n['@type']=='Article':
            n['headline']=title; n['description']=desc; n['dateModified']=date_iso
            n['citation']=[u for _,u in spec['sources']]
        if n['@type']=='BreadcrumbList': n['itemListElement'][-1]['name']=title
    j['@graph']=[n for n in j['@graph'] if n['@type']!='FAQPage']
    if spec.get('faq'):
        j['@graph'].append({"@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":re.sub('<[^>]+>','',a)}} for q,a in spec['faq']]})
    t=t[:m.start(1)]+json.dumps(j,ensure_ascii=False)+t[m.end(1):]
    # h1 + breadcrumb
    t=re.sub(r'(<h1><span>).*?(</span></h1>)',lambda m:m.group(1)+esc(title)+m.group(2),t,1,re.S)
    t=re.sub(r'(<li aria-current="page"><span>).*?(</span></li>)',lambda m:m.group(1)+esc(spec.get('crumb',title))+m.group(2),t,1,re.S)
    # meta date
    t=re.sub(r'<time datetime="[^"]*"><span>[^<]*</span></time>',f'<time datetime="{date_iso}"><span>{date_text}</span></time>',t,1)
    # body
    body=spec['body']
    ids=re.findall(r'<h2 id="([^"]+)">(.*?)</h2>',body,re.S)
    toc=''.join(f'<li><a href="#{i}">{h}</a></li>' for i,h in ids)
    if spec.get('faq'): toc+=f'<li><a href="#{L["faqid"]}">{L["faq"]}</a></li>'
    faq=''
    if spec.get('faq'):
        faq=f'<section id="{L["faqid"]}"><h2>{L["faq"]}</h2>'+''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q,a in spec['faq'])+'</section>'
    dirn='rtl' if lang=='ar' else 'ltr'
    inner=(f'<div lang="{lang}" dir="{dirn}"><div class="summary"><strong>{spec.get("summary_title",L["sumdef"])}</strong>{spec["summary"]}</div>'
           f'<nav class="toc" aria-label="{L["toc"]}"><h2>{L["toc"]}</h2><ul>{toc}</ul></nav>{body}{faq}</div>')
    srcs=''.join(f'<li id="source-{i+1}"><a href="{u}" rel="noopener noreferrer">{esc(l)}</a></li>' for i,(l,u) in enumerate(spec['sources']))
    srcsec=f'<section id="sources"><h2><span>{L["src"]}</span></h2><p class="muted"><span>{spec["src_note"]}</span></p><ul>{srcs}</ul></section>'
    pat=re.compile(r'<div lang="\w+" dir="\w+">.*?</div><section id="sources">.*?</section>',re.S)
    assert pat.search(t),slug
    t=pat.sub(lambda m:inner+srcsec,t,1)
    open(path,'w',encoding='utf-8').write(t)
    return path
