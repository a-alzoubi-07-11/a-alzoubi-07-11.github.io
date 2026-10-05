import sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'modules'))
from dates import DATE_ISO,DATE_AR,DATE_NL
import sys,importlib,re,os,json
sys.path.insert(0,'.')
from gen import build,REPO
mods=sys.argv[1:]
for m in mods:
    a=importlib.import_module(m)
    a.AR['sources']=a.SRC; a.NL['sources']=a.SRC
    build(a.SLUG,'ar',a.AR,DATE_ISO,DATE_AR)
    build(a.SLUG,'nl',a.NL,DATE_ISO,DATE_NL)
# validate
bad=0
for m in mods:
    a=importlib.import_module(m)
    for p in (f'articles/{a.SLUG}.html',f'nl/articles/{a.SLUG}.html'):
        t=open(f'{REPO}/{p}',encoding='utf-8').read()
        json.loads(re.search(r'ld\+json">(.*?)</script>',t,re.S).group(1))
        for l in set(re.findall(r'href="(/[^"#]*)"',t)):
            if not os.path.exists(REPO+l) and not l.endswith('/'): print('MISSING',p,l); bad+=1
        print(p,len(t))
print('bad',bad)
