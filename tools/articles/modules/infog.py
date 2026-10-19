"""Embed an infographic PNG from /assets/infographics/ as a <figure> (size read from the PNG header)."""
import html, pathlib, struct
REPO = pathlib.Path(__file__).resolve().parents[3]

def FIG(name, lang, alt, cap):
    rel = f'/assets/infographics/{name}-{lang}.png'
    with open(REPO / rel.lstrip('/'), 'rb') as f:
        head = f.read(24)
    w, h = struct.unpack('>II', head[16:24])
    dl = 'حمّل الصورة' if lang == 'ar' else 'Afbeelding downloaden'
    return (f'<figure class="infographic" style="margin:1.75rem 0">'
            f'<a href="{rel}"><img src="{rel}" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{html.escape(alt, quote=True)}" '
            f'style="display:block;width:100%;height:auto;border-radius:18px;border:1px solid #e3e3e8"></a>'
            f'<figcaption class="muted" style="font-size:.9em;margin-top:.6rem">{cap} · <a href="{rel}" download>{dl}</a></figcaption></figure>')
