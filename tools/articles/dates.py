import datetime, os
AR_M=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
NL_M=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']
d=datetime.date.fromisoformat(os.environ['ARTICLE_DATE']) if os.environ.get('ARTICLE_DATE') else datetime.date.today()
DATE_ISO=d.isoformat(); DATE_AR=f'{d.day} {AR_M[d.month-1]} {d.year}'; DATE_NL=f'{d.day} {NL_M[d.month-1]} {d.year}'
