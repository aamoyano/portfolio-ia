"""
Genera src/app/opengraph-image.jpg (vista previa al compartir en WhatsApp, LinkedIn...).

Uso (necesita Pillow y fontTools con brotli, y haber hecho `npm run build` para tener las fuentes):
    python scripts/generar-imagen-og.py . <carpeta-de-salida>
Después copia el JPG a src/app/opengraph-image.jpg y src/app/twitter-image.jpg.
Las rutas de las fuentes dependen del build: si cambian, actualiza SG e IN.
"""
import sys, io
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root, out_dir = sys.argv[1], sys.argv[2]
media = root + "/.next/static/media/"

def font(path, wght, size):
    t = TTFont(media + path)
    t.flavor = None
    inst = instantiateVariableFont(t, {"wght": wght})
    buf = io.BytesIO(); inst.save(buf); buf.seek(0)
    return ImageFont.truetype(buf, size)

W, H = 1200, 630
SG = "237858b39a32779d-s.p.2cyn07wtgehh0.woff2"
IN = "07c7676b89ed2778-s.p.2bn3s6zvc0dyp.woff2"

# Fondo: la foto del lago recortada como en la web (object-position 62% 50%)
bg = Image.open(root + "/public/backgrounds/atardecer-lago.jpg").convert("RGB")
s = max(W / bg.width, H / bg.height)
bg = bg.resize((round(bg.width * s), round(bg.height * s)), Image.LANCZOS)
x = round((bg.width - W) * 0.62); y = round((bg.height - H) * 0.5)
bg = bg.crop((x, y, x + W, y + H))

# Velo azul arriba y abajo, como en Background.tsx
veil = Image.new("RGBA", (W, H))
vd = ImageDraw.Draw(veil)
stops = [(0, .35), (.35, .08), (.65, .12), (1, .45)]
for yy in range(H):
    t = yy / (H - 1)
    for (a, va), (b, vb) in zip(stops, stops[1:]):
        if a <= t <= b:
            v = va + (vb - va) * (t - a) / (b - a); break
    vd.line([(0, yy), (W, yy)], fill=(20, 25, 55, round(v * 255)))
img = Image.alpha_composite(bg.convert("RGBA"), veil)

# Panel de vidrio: fondo desenfocado + blanco translúcido + borde luminoso
cw, ch = 940, 440
cx, cy = (W - cw) // 2, (H - ch) // 2
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).rounded_rectangle((cx, cy, cx + cw, cy + ch), 40, fill=255)
blurred = img.filter(ImageFilter.GaussianBlur(22))
img.paste(blurred, (0, 0), mask)
glass = Image.new("RGBA", (W, H))
gd = ImageDraw.Draw(glass)
gd.rounded_rectangle((cx, cy, cx + cw, cy + ch), 40, fill=(255, 255, 255, 40), outline=(255, 255, 255, 110), width=2)
# sombra
shadow = Image.new("RGBA", (W, H))
ImageDraw.Draw(shadow).rounded_rectangle((cx, cy + 18, cx + cw, cy + ch + 18), 40, fill=(15, 20, 45, 90))
shadow = shadow.filter(ImageFilter.GaussianBlur(24))
base = Image.alpha_composite(img, Image.new("RGBA", (W, H)))
img = Image.alpha_composite(Image.alpha_composite(img, shadow), Image.new("RGBA", (W, H)))
img.paste(blurred, (0, 0), mask)
img = Image.alpha_composite(img, glass)

d = ImageDraw.Draw(img)
# Foto redonda con aro blanco
ps = 150
photo = Image.open(root + "/public/foto-antonio.jpg").convert("RGB").resize((ps, ps), Image.LANCZOS)
pm = Image.new("L", (ps * 4, ps * 4), 0); ImageDraw.Draw(pm).ellipse((0, 0, ps * 4 - 1, ps * 4 - 1), fill=255)
pm = pm.resize((ps, ps), Image.LANCZOS)
px, py = (W - ps) // 2, cy + 44
d.ellipse((px - 5, py - 5, px + ps + 5, py + ps + 5), fill=(255, 255, 255, 150))
img.paste(photo, (px, py), pm)

def center(text, f, yy, fill):
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, yy), text, font=f, fill=fill)

shade = Image.new("RGBA", (W, H))
center("Antonio Álvarez Moyano", font(SG, 600, 66), py + ps + 26, (255, 255, 255, 255))
center("IA y Big Data · Automatización y agentes", font(IN, 500, 28), py + ps + 112, (255, 255, 255, 215))

# Píldora: invitación al chat
f = font(IN, 600, 22)
label = "Pregúntale a mi IA sobre mi perfil"
tw = d.textlength(label, font=f)
pw, ph = tw + 56, 46
bx, by = (W - pw) / 2, cy + ch - ph - 30
d.rounded_rectangle((bx, by, bx + pw, by + ph), 23, fill=(255, 255, 255, 235))
d.text((bx + 28, by + 11), label, font=f, fill=(28, 35, 71, 255))

img.convert("RGB").save(out_dir + "/opengraph-image.jpg", "JPEG", quality=84, optimize=True, progressive=True)
print("ok")
