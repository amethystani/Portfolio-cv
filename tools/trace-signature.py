"""Traces the signature photo (tools/assets/signature-source.webp: black ink on textured paper) into an SVG path.

    python3 tools/trace-signature.py   # writes tools/assets/signature-path.json {viewBox, d, width, height}
                                       # and public/assets/brand/signature-*.svg
Needs Pillow, numpy and potracer. The paper texture is removed by subtracting a heavily blurred copy
(so uneven lighting does not matter), then the ink is thresholded and traced at 4x for smooth curves.
"""
import json, os
import numpy as np
from PIL import Image, ImageFilter
import potrace

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, 'assets', 'signature-source.webp')
OUT = os.path.join(HERE, 'assets', 'signature-path.json')
SCALE = 4
SIZE = 1000
INK = 28  # how much darker than the local paper a pixel must be to count as ink (0-255)

im = Image.open(SRC).convert('L')
paper = im.filter(ImageFilter.GaussianBlur(25))
diff = np.clip(np.array(paper, dtype=np.int16) - np.array(im, dtype=np.int16), 0, 255).astype(np.uint8)
ys, xs = np.where(diff > INK * 1.6)
pad = 14
x0, x1, y0, y1 = max(xs.min() - pad, 0), xs.max() + pad, max(ys.min() - pad, 0), ys.max() + pad
crop = Image.fromarray(diff).crop((x0, y0, x1, y1))
big = crop.resize((crop.width * SCALE, crop.height * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SCALE * 0.9))
bits = np.array(big) > INK
bm = potrace.Bitmap(~bits)  # potracer fills the False cells, so invert to fill the ink
plist = bm.trace(turdsize=300, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.2, opticurve=True, opttolerance=2.5)

k = SIZE / big.width
def pt(p): return f'{p.x * k:.1f} {p.y * k:.1f}'
parts = []
for curve in plist:
    parts.append(f'M{pt(curve.start_point)}')
    for seg in curve.segments:
        if seg.is_corner:
            parts.append(f'L{pt(seg.c)}L{pt(seg.end_point)}')
        else:
            parts.append(f'C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}')
    parts.append('Z')
w, h = SIZE, round(big.height * k, 2)
d = ''.join(parts)
json.dump({'width': w, 'height': h, 'viewBox': f'0 0 {w} {h}', 'd': d}, open(OUT, 'w'))
print('traced', len(plist), 'shapes', f'viewBox 0 0 {w} {h}', 'path chars', len(d))

# ---- outputs
# signature-sprite.svg: a bare path with id="signature" and no fill, referenced by <use> in components/icons/Logo.tsx
#   so fill, stroke and weight come from the page (theme colour, and a stroke that thickens the hairlines when it is small).
# signature-{cherry,cream}.svg: coloured copies for downloads and sharing.
root = os.path.join(HERE, '..')
outdir = os.path.join(root, 'public', 'assets', 'brand')
os.makedirs(outdir, exist_ok=True)
for old in ('signature.svg',):
    if os.path.exists(os.path.join(outdir, old)): os.remove(os.path.join(outdir, old))
open(os.path.join(outdir, 'signature-sprite.svg'), 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path id="signature" d="{d}"/></svg>\n')
for name, colour in [('cherry', '#9a0002'), ('cream', '#efe6de')]:
    open(os.path.join(outdir, f'signature-{name}.svg'), 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><title>Animesh Mishra signature</title><path fill="{colour}" d="{d}"/></svg>\n')
print('wrote public/assets/brand/signature-sprite.svg and signature-{cherry,cream}.svg')
