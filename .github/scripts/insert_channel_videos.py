#!/usr/bin/env python3
"""Insert the channel's own explainer videos into matching guides (AR + NL).

Data: .github/scripts/channel_videos.json. The block goes right before the FAQ
section and is wrapped in markers, so running the script again replaces it
instead of adding a second copy. Privacy: nothing loads from YouTube until the
visitor presses play (assets/video-embed.js, youtube-nocookie.com).
"""
import html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / ".github/scripts/channel_videos.json").read_text(encoding="utf-8"))
START, END = "<!-- channel-videos:start -->", "<!-- channel-videos:end -->"
SCRIPT = '<script src="/assets/video-embed.js?v=2" defer></script>'

T = {
    "ar": {"h": "شاهد الشرح بالفيديو", "intro": "شرح عملي خطوة بخطوة من قناتنا على يوتيوب.",
           "privacy": "لا يُحمَّل أي محتوى من يوتيوب قبل أن تضغط تشغيل.", "play": "تشغيل الفيديو",
           "yt": "شاهد على يوتيوب", "label": "فيديو الشرح"},
    "nl": {"h": "Bekijk de uitleg in een video", "intro": "Een praktische stap-voor-stapuitleg van ons YouTube-kanaal (in het Arabisch).",
           "privacy": "Er wordt niets van YouTube geladen voordat je op afspelen drukt.", "play": "Video afspelen",
           "yt": "Bekijk op YouTube", "label": "Uitlegvideo"},
}


def block(lang, ids):
    t = T[lang]
    items = []
    for vid in ids:
        title = html.escape(DATA["videos"][vid], quote=True)
        items.append(
            f'<figure class="cv-item"><div class="video-slot" data-video-id="{vid}" data-video-title="{title}">'
            f'<div class="video-placeholder"><p class="cv-title">{title}</p>'
            f'<button type="button" class="cv-play" data-play-video>{t["play"]}</button>'
            f'<p class="cv-note">{t["privacy"]}</p></div></div>'
            f'<figcaption><a href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener">{t["yt"]}</a></figcaption></figure>')
    return (f'{START}<section class="cv" id="video" aria-label="{t["label"]}"><h2>{t["h"]}</h2>'
            f'<p class="cv-intro">{t["intro"]}</p>{"".join(items)}</section>{END}')


def process(path, lang, ids):
    s = path.read_text(encoding="utf-8")
    s = re.sub(re.escape(START) + ".*?" + re.escape(END), "", s, flags=re.S)
    m = re.search(r'<section id="(?:ar-|nl-)?faq">', s)
    if not m:
        print("no FAQ anchor, skipped:", path.relative_to(ROOT)); return False
    s = s[:m.start()] + block(lang, ids) + s[m.start():]
    if "video-embed.js" not in s:
        s = s.replace("</body>", SCRIPT + "\n</body>", 1)
    path.write_text(s, encoding="utf-8")
    return True


def main():
    done = 0
    for slug, ids in DATA["guides"].items():
        for lang, folder in (("ar", "articles"), ("nl", "nl/articles")):
            p = ROOT / folder / f"{slug}.html"
            if not p.exists():
                print("missing:", p.relative_to(ROOT)); continue
            done += process(p, lang, ids)
    print("updated", done, "pages")


if __name__ == "__main__":
    sys.exit(main())
