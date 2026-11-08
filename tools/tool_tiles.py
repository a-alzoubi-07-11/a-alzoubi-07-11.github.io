"""Tool tiles shown on /tools.html, /nl/tools.html and the beroep pages.

Run:  python3 tools/tool_tiles.py   (rewrites the tile block in both tools pages)
Edit TILES to add or reorder a tool; colours: blue, green, orange, red.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (icon, colour, ar_href, ar_title, ar_sub, nl_href, nl_title, nl_sub, is_new)
TILES = [
    ("<i class=gi-mail aria-hidden=true></i>", "red", "/beroep/", "رسالة الطعن", "على رفض الإقامة الدائمة — جاهزة للنسخ والإرسال",
     "/nl/beroep/", "Beroepschrift", "Tegen afwijzing asiel onbepaalde tijd", True),
    ("<i class=gi-home aria-hidden=true></i>", "orange", "/calculators/permanent-residence-check.html", "فاحص الإقامة والجنسية", "متى تستحق الإقامة الدائمة أو الجنسية؟",
     "/nl/calculators/permanent-residence-check.html", "Check verblijf en naturalisatie", "Wanneer kun je permanent verblijf krijgen?", False),
    ("<i class=gi-health aria-hidden=true></i>", "green", "/calculators/zorgtoeslag.html", "حاسبة zorgtoeslag", "كم بدل التأمين الصحي الذي قد تحصل عليه؟",
     "/nl/calculators/zorgtoeslag.html", "Zorgtoeslag berekenen", "Hoeveel zorgtoeslag kun je krijgen?", False),
    ("<i class=gi-child aria-hidden=true></i>", "blue", "/calculators/kindgebonden-budget.html", "حاسبة kindgebonden budget", "تقدير بدل الأطفال الشهري",
     "/nl/calculators/kindgebonden-budget.html", "Kindgebonden budget", "Schat je maandelijkse bedrag", False),
    ("<i class=gi-doc aria-hidden=true></i>", "blue", "/cv.html", "أنشئ سيرتك الذاتية", "CV بالهولندي في 6 خطوات مع ترجمة",
     "/nl/cv.html", "Maak je cv", "Nederlands cv in 6 stappen", False),
    ("<i class=gi-euro aria-hidden=true></i>", "green", "#salary", "تقدير الراتب", "من bruto إلى netto لعام 2026",
     "#salary", "Salarisindicatie", "Van bruto naar netto in 2026", False),
    ("<i class=gi-check aria-hidden=true></i>", "orange", "#checklist", "خطوات البداية", "قائمة أول الإجراءات في هولندا",
     "#checklist", "Eerste stappen", "Checklist voor nieuwkomers", False),
    ("<i class=gi-calc aria-hidden=true></i>", "red", "#budget", "ميزانيتي", "نظّم دخلك ومصاريفك الشهرية",
     "#budget", "Mijn budget", "Inkomsten en uitgaven per maand", False),
    ("<i class=gi-grad aria-hidden=true></i>", "blue", "#routes", "مسارات التعليم", "قارن بين MBO وHBO وWO",
     "#routes", "Onderwijsroutes", "MBO, HBO en WO vergelijken", False),
]


def tiles_html(lang: str, current: str = "", page_local: bool = True, base: str = "") -> str:
    """page_local: '#anchor' tiles link to the tools page itself; otherwise they point at base + '#anchor'."""
    new_label = "جديد" if lang == "ar" else "Nieuw"
    label = "الأدوات" if lang == "ar" else "Hulpmiddelen"
    out = []
    for ico, col, ah, at, asub, nh, nt, nsub, is_new in TILES:
        href, title, sub = (ah, at, asub) if lang == "ar" else (nh, nt, nsub)
        if href.startswith("#") and not page_local:
            href = base + href
        cur = ' aria-current="page"' if href == current else ""
        badge = f'<span class="tt-new">{new_label}</span>' if is_new and href != current else ""
        wide = " tt-wide" if is_new else ""
        out.append(f'<a class="tt-card tt-{col}{wide}" href="{href}"{cur}>{badge}<span class="tt-ico" aria-hidden="true">{ico}</span>'
                   f'<strong>{title}</strong><span class="tt-sub">{sub}</span></a>')
    return f'<nav class="tool-tiles" aria-label="{label}">{"".join(out)}</nav>'


CSS_LINK = '<link rel="stylesheet" href="/assets/tool-tiles.css?v=2">'


def update_tools_page(path: Path, lang: str) -> None:
    s = path.read_text(encoding="utf-8")
    block = tiles_html(lang)
    s, n = re.subn(r'<nav class="(?:tool-nav|tool-tiles)"[^>]*>.*?</nav>', lambda m: block, s, count=1, flags=re.S)
    assert n == 1, f"no tool nav found in {path}"
    if "tool-tiles.css" not in s:
        s = s.replace('<link rel="stylesheet" href="/assets/tools.css?v=1">', '<link rel="stylesheet" href="/assets/tools.css?v=1">' + CSS_LINK, 1)
        assert "tool-tiles.css" in s, f"tools.css link not found in {path}"
    path.write_text(s, encoding="utf-8")
    print("updated", path.relative_to(ROOT))


if __name__ == "__main__":
    update_tools_page(ROOT / "tools.html", "ar")
    update_tools_page(ROOT / "nl/tools.html", "nl")
