#!/usr/bin/env python3
"""Add bilingual article links to the eight published demos; preserve original ZIP."""
from pathlib import Path
import sys
root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site')
slugs = ['marea-stay', 'factuurflow', 'haven-interiors', 'leadpilot', 'pulse-studio', 'vraagassistent', 'rivier-coffee', 'orderbridge']
for slug in slugs:
    path = root / slug / 'index.html'
    html = path.read_text()
    if 'id="mcc-project-article"' in html:
        continue
    assert '</body>' in html, f'Missing body: {path}'
    block = f'''<aside id="mcc-project-article" aria-label="MCC projectartikel" style="position:relative;padding:32px 24px;background:#071827;color:#f4efe6;text-align:center;font:16px/1.6 system-ui,sans-serif">
<p style="margin:0 0 12px">Het verhaal achter deze MCC-conceptdemo · The story behind this MCC concept</p>
<nav aria-label="Project article languages" style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px">
<a href="https://mccai.nl/v3/nl/blog/{slug}" lang="nl" style="color:#f4efe6;text-decoration:underline;padding:8px">Lees het projectartikel</a>
<a href="https://mccai.nl/v3/en/blog/{slug}" lang="en" style="color:#f4efe6;text-decoration:underline;padding:8px">Read the project article</a>
</nav></aside>'''
    path.write_text(html.replace('</body>', block + '\n</body>'))
print('Linked all eight demos to their Dutch and English MCC articles.')
