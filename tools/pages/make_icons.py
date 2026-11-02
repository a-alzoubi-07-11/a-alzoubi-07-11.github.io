"""Line icons for the whole site (replace emoji). Writes a marked block at the end of assets/apple.css.

Use in HTML/JS:  <i class="gi gi-home" aria-hidden="true"></i>  (inherits text colour, 1em square)
Run: python3 tools/pages/make_icons.py
"""
import os, re
from urllib.parse import quote

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CSS = os.path.join(REPO, 'assets', 'apple.css')

# 24x24 outline paths (stroke drawn by the wrapper below)
I = {
 'grad': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.2V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.8"/><path d="M22 9v5"/>',
 'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/>',
 'shield': '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
 'home': '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 'users': '<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9.5" r="2.3"/><path d="M16.5 14.6A4.5 4.5 0 0 1 21 19v1"/>',
 'child': '<circle cx="12" cy="6" r="2.6"/><path d="M8 11.5c1.2-1 2.5-1.5 4-1.5s2.8.5 4 1.5"/><path d="M12 10v5.5"/><path d="M9.5 21l2.5-5.5 2.5 5.5"/>',
 'key': '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9"/><path d="M16.5 6.5l2.5 2.5"/><path d="M14.5 8.5l2 2"/>',
 'id': '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2"/><path d="M14.5 10h4M14.5 14h4"/>',
 'bank': '<path d="M3 9.5L12 4l9 5.5"/><path d="M5.5 10v7.5M9.8 10v7.5M14.2 10v7.5M18.5 10v7.5"/><path d="M3 20.5h18"/>',
 'euro': '<path d="M17.5 6.6A7 7 0 1 0 17.5 17.4"/><path d="M4.5 10h9M4.5 14h9"/>',
 'health': '<path d="M12 20.5s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7.7a4.4 4.4 0 0 1 8 2.4c0 5.8-8 10.4-8 10.4z"/><path d="M9 12.5h6M12 9.5v6"/>',
 'doc': '<path d="M14 3H7.5A2 2 0 0 0 5.5 5v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7.5z"/><path d="M14 3v4.5h4.5"/><path d="M9 13h6M9 17h6"/>',
 'list': '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9"/><circle cx="4.5" cy="12" r=".9"/><circle cx="4.5" cy="18" r=".9"/>',
 'clipboard': '<rect x="5.5" y="4.5" width="13" height="16.5" rx="2.5"/><path d="M9 4.5V3.5h6v1"/><path d="M9 11h6M9 15h4"/>',
 'search': '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
 'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>',
 'play': '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z"/>',
 'camera': '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r=".6"/>',
 'music': '<path d="M9 18V5.5l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/>',
 'lock': '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
 'calendar': '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 'alert': '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.1"/>',
 'compass': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 'star': '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
 'bulb': '<path d="M9 17.5h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
 'tool': '<path d="M14.5 6.5a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3l6.5-6.5"/><path d="M14.5 6.5a4 4 0 0 1 4.6-2.9l-2.4 2.4.4 2 2 .4 2.4-2.4a4 4 0 0 1-2.9 4.6"/><path d="M8 13L4 9l2-2 4 4"/>',
 'calc': '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
 'check': '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.7"/>',
 'book': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
 'flask': '<path d="M9.5 3h5M10 3v6L4.8 18.5A1.7 1.7 0 0 0 6.3 21h11.4a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 14h9"/>',
 'laptop': '<rect x="4.5" y="5" width="15" height="10.5" rx="1.5"/><path d="M2.5 19h19"/>',
 'chart': '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
 'scale': '<path d="M12 3.5v17M7 20.5h10"/><path d="M5 7.5h14"/><path d="M5 7.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/><path d="M19 7.5l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
 'leaf': '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/>',
 'car': '<path d="M5 16.5V12l1.8-4.5A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.5L19 12v4.5"/><path d="M3.5 12h17v4.5h-17z"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>',
 'plane': '<path d="M10.5 13.5L3 11l1.5-1.5 8 .5 4-4.2c.9-.9 2.6-1.1 3.3-.4.7.7.5 2.4-.4 3.3l-4.2 4 .5 8L14 22l-2.5-7.5-3.5 3.3V20l-1.5 1.5-1-3.5-3.5-1L3.5 15.5h2.2z"/>',
 'cart': '<path d="M3 4h2.5l2.2 11h10.6l2-8H6.5"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
 'palette': '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-.8-1.4-.8-2.4c0-1 .9-1.6 2-1.6H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r=".9"/><circle cx="10.5" cy="7" r=".9"/><circle cx="15" cy="7.5" r=".9"/>',
 'gear': '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 'building': '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M9 15h.01M15 15h.01"/><path d="M10.5 21v-4h3v4"/>',
 'chat': '<path d="M20.5 12a8 8 0 0 1-11.8 7.1L3.5 20.5l1.4-5A8 8 0 1 1 20.5 12z"/>',
 'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3.1-3.1a4 4 0 0 0-5.7-5.7L12 6.3"/><path d="M14 10a4 4 0 0 0-5.7 0l-3.1 3.1a4 4 0 0 0 5.7 5.7l1.1-1.1"/>',
 'refresh': '<path d="M20 11a8 8 0 0 0-14.3-4.3L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 14.3 4.3L20 15.5"/><path d="M20 20v-4.5h-4.5"/>',
 'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 'pen': '<path d="M15.5 4.5l4 4L8 20H4v-4z"/><path d="M13 7l4 4"/>',
 'brain': '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5.5A2 2 0 0 0 9 4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
 'paw': '<circle cx="7" cy="10" r="1.8"/><circle cx="10.5" cy="6" r="1.8"/><circle cx="14.5" cy="6" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M8.5 17.5c0-2.8 1.8-5 4-5s4 2.2 4 5c0 1.6-1.3 2.5-2.6 2.1-1-.3-1.8-.3-2.8 0-1.3.4-2.6-.5-2.6-2.1z"/>',
 'bolt': '<path d="M13 2.5L4.5 13.5H12l-1 8 8.5-11H12z"/>',
 'tooth': '<path d="M7 3.5c-2 0-3.5 1.7-3.5 4 0 3 1.5 4.5 2 7.5.4 2.6 1 5.5 2.5 5.5s1.5-4.5 4-4.5 2.5 4.5 4 4.5 2.1-2.9 2.5-5.5c.5-3 2-4.5 2-7.5 0-2.3-1.5-4-3.5-4-2 0-3 1.2-5 1.2S9 3.5 7 3.5z"/>',
 'pill': '<rect x="2.6" y="8.3" width="18.8" height="7.4" rx="3.7" transform="rotate(-45 12 12)"/><path d="M8.7 8.7l6.6 6.6"/>',
 'flag': '<path d="M5 21V4"/><path d="M5 4.5h11l-2 4 2 4H5"/>',
 'robot': '<rect x="4.5" y="8" width="15" height="11" rx="3"/><path d="M12 4.5V8"/><circle cx="12" cy="4" r=".8"/><path d="M9.5 13h.01M14.5 13h.01M9.5 16h5"/>',
 'anchor': '<circle cx="12" cy="5" r="2"/><path d="M12 7v14"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M8.5 10.5h7"/>',
 'cup': '<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1 1 1 1 2M11.5 3.5c0 1 1 1 1 2"/>',
 'mic': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
 'drop': '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
 'dot': '<circle cx="12" cy="12" r="4"/>',
 'cross': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
 'printer': '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14.5h10V21H7z"/>',
}

def uri(body):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" '
           'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>')
    return 'url("data:image/svg+xml,' + quote(svg, safe=' =:/,."-()') .replace('"', "'") + '")'

def build():
    out = ['/* @icons:start — generated by tools/pages/make_icons.py, do not edit by hand */',
           '.gi,i[class^=gi-]{display:inline-block;width:1em;height:1em;flex:none;vertical-align:-.14em;background-color:currentColor;'
           '-webkit-mask:var(--gi) center/contain no-repeat;mask:var(--gi) center/contain no-repeat}']
    for k, v in I.items():
        out.append('.gi-%s{--gi:%s}' % (k, uri(v)))
    out.append('/* @icons:end */')
    return '\n'.join(out)

if __name__ == '__main__':
    s = open(CSS, encoding='utf-8').read()
    s = re.sub(r'\n?/\* @icons:start.*?/\* @icons:end \*/\n?', '\n', s, flags=re.S).rstrip('\n')
    s += '\n' + build() + '\n'
    open(CSS, 'w', encoding='utf-8').write(s)
    print('icons:', len(I))
