"""Vergleicht zwei Ordner mit Bildschirmfotos aus visual-snapshots.cjs.

Aufruf: python tests/browser/visual-compare.py <Ordner A> <Ordner B> [Schwelle]
Ein Pixel gilt als verändert, wenn sich ein Farbkanal um mehr als die Schwelle
(Vorgabe 6 von 255) unterscheidet. Edge zeichnet Verläufe von Lauf zu Lauf um
ein bis zwei Stufen anders; das ist kein sichtbarer Unterschied.
"""
import os
import sys

from PIL import Image, ImageChops

a, b = sys.argv[1], sys.argv[2]
threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 6
names = sorted(name for name in os.listdir(a) if name.endswith(".png"))
changed = []
for name in names:
    other = os.path.join(b, name)
    if not os.path.exists(other):
        changed.append((name, "fehlt im zweiten Ordner"))
        continue
    x = Image.open(os.path.join(a, name)).convert("RGB")
    y = Image.open(other).convert("RGB")
    if x.size != y.size:
        changed.append((name, "Größe %sx%s statt %sx%s" % (y.size + x.size)))
        continue
    mask = ImageChops.difference(x, y).convert("L").point(lambda value: 255 if value > threshold else 0)
    box = mask.getbbox()
    if box:
        pixels = sum(1 for value in mask.crop(box).getdata() if value)
        changed.append((name, "%d Pixel im Bereich %s" % (pixels, box)))
for name, why in changed:
    print("verändert: %s (%s)" % (name, why))
print("%d von %d Bildern ohne sichtbaren Unterschied." % (len(names) - len(changed), len(names)))
sys.exit(1 if changed else 0)
