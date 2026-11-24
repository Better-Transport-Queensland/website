"""
Generate the homepage cover image for a Policy Platform edition.

Renders the PDF's cover page in the centre with a fan of inner pages either
side (each step out is smaller and more rotated), over a photo background with
a subtle brand-gradient overlay. Output is a 1920x1080 WebP for
`coverImage` in data/policy-platform.ts. Save it next to the PDF with the same
name, e.g. btq-policy-platform-2026.1.pdf -> btq-policy-platform-2026.1.webp.

Requirements (Python 3.10+):
    pip install pymupdf pillow numpy

Usage:
    python scripts/generate-policy-platform-cover.py \
        public/policy-platform/btq-policy-platform-2026.1.pdf \
        public/policy-platform/btq-policy-platform-2026.1.webp \
        --background scripts/2024-09-16-AirportTrain.jpg \
        --pages 22,5,21,34

`--background` is required. Any photo works, as it is cover-cropped to 16:9;
use one at least 1920x1080 so the result stays sharp.

`--pages` lists the inner pages (0-based PDF page indexes) left to right,
excluding the cover; half go left of the cover and half go right. Pick pages
with charts, maps or diagrams, as they read best at thumbnail size. The cover
is page 0 unless `--cover` says otherwise.
"""

import argparse
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageFilter

WIDTH, HEIGHT = 1920, 1080
SUPERSAMPLE = 2  # pages are composited at 2x then downscaled for clean edges
WEBP_QUALITY = 92

# Site brand gradient: .bg-brand-gradient in styles/tailwind.css
# (bg-linear-to-br from-indigo-900 via-indigo-800 to-purple-900)
BRAND_GRADIENT = ('#312e81', '#3730a3', '#581c87')


# --------------------------------------------------------------------------- #
#  Colour helpers (Tailwind v4 interpolates gradients in OKLab)               #
# --------------------------------------------------------------------------- #
def _hex_to_linear(h: str) -> np.ndarray:
    c = np.array([int(h[i : i + 2], 16) / 255 for i in (1, 3, 5)])
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _linear_to_oklab(c: np.ndarray) -> np.ndarray:
    m1 = np.array(
        [
            [0.4122214708, 0.5363325363, 0.0514459929],
            [0.2119034982, 0.6806995451, 0.1073969566],
            [0.0883024619, 0.2817188376, 0.6299787005],
        ]
    )
    m2 = np.array(
        [
            [0.2104542553, 0.7936177850, -0.0040720468],
            [1.9779984951, -2.4285922050, 0.4505937099],
            [0.0259040371, 0.7827717662, -0.8086757660],
        ]
    )
    return np.cbrt(c @ m1.T) @ m2.T


def _oklab_to_srgb(lab: np.ndarray) -> np.ndarray:
    m2i = np.array(
        [
            [1, 0.3963377774, 0.2158037573],
            [1, -0.1055613458, -0.0638541728],
            [1, -0.0894841775, -1.2914855480],
        ]
    )
    m1i = np.array(
        [
            [4.0767416621, -3.3077115913, 0.2309699292],
            [-1.2684380046, 2.6097574011, -0.3413193965],
            [-0.0041960863, -0.7034186147, 1.7076147010],
        ]
    )
    c = np.clip(((lab @ m2i.T) ** 3) @ m1i.T, 0, 1)
    return np.where(c <= 0.0031308, 12.92 * c, 1.055 * c ** (1 / 2.4) - 0.055)


def brand_gradient(w: int, h: int, opacity: float) -> Image.Image:
    """A 'to bottom right' three-stop gradient as an RGBA layer."""
    stops = [_linear_to_oklab(_hex_to_linear(c)) for c in BRAND_GRADIENT]
    yy, xx = np.mgrid[0:h, 0:w]
    t = (((xx + 0.5) / w + (yy + 0.5) / h) / 2)[..., None]
    lab = np.where(
        t < 0.5,
        stops[0] + (stops[1] - stops[0]) * (t / 0.5),
        stops[1] + (stops[2] - stops[1]) * ((t - 0.5) / 0.5),
    )
    rgb = (_oklab_to_srgb(lab) * 255 + 0.5).astype('uint8')
    alpha = np.full((h, w, 1), int(255 * opacity), dtype='uint8')
    return Image.fromarray(np.concatenate([rgb, alpha], axis=2), 'RGBA')


# --------------------------------------------------------------------------- #
#  Layers                                                                     #
# --------------------------------------------------------------------------- #
def background(path: Path, blur: float, overlay: float) -> Image.Image:
    """Cover-crop the photo to the frame, soften it, and tint with the brand gradient."""
    photo = Image.open(path).convert('RGB')
    scale = max(WIDTH / photo.width, HEIGHT / photo.height)
    photo = photo.resize(
        (round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS
    )
    left = (photo.width - WIDTH) // 2
    top = (photo.height - HEIGHT) // 2
    photo = photo.crop((left, top, left + WIDTH, top + HEIGHT))
    if blur:
        photo = photo.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(
        photo.convert('RGBA'), brand_gradient(WIDTH, HEIGHT, overlay)
    )


def render_page(doc: pymupdf.Document, index: int, height: int) -> Image.Image:
    page = doc[index]
    zoom = height / page.rect.height
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples).convert(
        'RGBA'
    )


def drop_shadow(page: Image.Image, blur: int, opacity: float, pad: int) -> Image.Image:
    """A soft dark silhouette of the page, padded so the blur isn't clipped."""
    shadow = Image.new('RGBA', (page.width + pad * 2, page.height + pad * 2), (0, 0, 0, 0))
    silhouette = Image.new('RGBA', page.size, (8, 6, 30, int(255 * opacity)))
    shadow.paste(silhouette, (pad, pad), page)
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def page_fan(
    doc: pymupdf.Document,
    cover: int,
    inner: list[int],
    cover_height: int,
    spread: float,
    step_angle: float,
    step_scale: float,
) -> Image.Image:
    """
    Lay the pages out like a hand of cards: each page sits on an arc around a
    pivot below the cover and is rotated to follow it, so the fan is
    symmetrical and the outermost pages' bottoms line up.
    """
    s = SUPERSAMPLE
    w, h = WIDTH * s, HEIGHT * s
    ch = cover_height * s

    n_left = len(inner) // 2
    left, right = inner[:n_left], inner[n_left:]
    # (pdf index, level) where level is signed distance from the cover
    slots = [(p, -(n_left - i)) for i, p in enumerate(left)]
    slots += [(p, i + 1) for i, p in enumerate(right)]
    # Outermost first so the cover ends up on top
    slots.sort(key=lambda slot: -abs(slot[1]))
    slots.append((cover, 0))

    pivot_radius = ch * 2.6
    placed = []
    for index, level in slots:
        scale = step_scale ** abs(level)
        angle = step_angle * level  # degrees clockwise from upright
        page = render_page(doc, index, round(ch * scale))
        # Slide each page along the arc; `spread` widens the gaps.
        theta = np.radians(angle * spread)
        cx = pivot_radius * np.sin(theta)
        # Lift smaller pages so their visual centre stays near the cover's.
        cy = pivot_radius * (1 - np.cos(theta)) + (ch - page.height) * 0.15
        placed.append((page, angle, cx, cy))

    # Measure the rotated bounds so the whole fan can be centred in the frame.
    rotated = []
    for page, angle, cx, cy in placed:
        r = page.rotate(-angle, expand=True, resample=Image.BICUBIC)
        rotated.append((page, angle, r, cx, cy))
    x0 = min(cx - r.width / 2 for _, _, r, cx, _ in rotated)
    x1 = max(cx + r.width / 2 for _, _, r, cx, _ in rotated)
    y0 = min(cy - r.height / 2 for _, _, r, _, cy in rotated)
    y1 = max(cy + r.height / 2 for _, _, r, _, cy in rotated)
    ox = w / 2 - (x0 + x1) / 2
    oy = h / 2 - (y0 + y1) / 2

    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pad = 60 * s
    for page, angle, r, cx, cy in rotated:
        # Wide ambient shadow plus a tighter contact shadow under each page.
        for blur, opacity, dy in ((34 * s, 0.55, 26 * s), (8 * s, 0.35, 6 * s)):
            sh = drop_shadow(page, blur, opacity, pad).rotate(
                -angle, expand=True, resample=Image.BICUBIC
            )
            layer.alpha_composite(
                sh, (round(ox + cx - sh.width / 2), round(oy + cy - sh.height / 2 + dy))
            )
        layer.alpha_composite(
            r, (round(ox + cx - r.width / 2), round(oy + cy - r.height / 2))
        )

    return layer.resize((WIDTH, HEIGHT), Image.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[1])
    parser.add_argument('pdf', type=Path, help='Policy platform PDF')
    parser.add_argument('output', type=Path, help='Output .webp path')
    parser.add_argument(
        '--pages',
        default='22,5,21,34',
        help='Inner pages left to right, 0-based, comma separated (default: 22,5,21,34)',
    )
    parser.add_argument('--cover', type=int, default=0, help='Cover page index (default: 0)')
    parser.add_argument(
        '--background',
        type=Path,
        required=True,
        help='Background photo, cover-cropped to 16:9 (ideally at least 1920x1080)',
    )
    parser.add_argument('--cover-height', type=int, default=736, help='Cover height in px; other pages scale with it (default: 736)')
    parser.add_argument('--step-angle', type=float, default=9, help='Extra rotation per step out, degrees (default: 9)')
    parser.add_argument('--step-scale', type=float, default=0.86, help='Size multiplier per step out (default: 0.86)')
    parser.add_argument('--spread', type=float, default=1.0, help='Horizontal spacing multiplier (default: 1.0)')
    parser.add_argument('--blur', type=float, default=0, help='Background blur radius (default: 0)')
    parser.add_argument('--overlay', type=float, default=0.45, help='Gradient overlay opacity 0-1 (default: 0.45)')
    args = parser.parse_args()

    for path, what in ((args.pdf, 'PDF'), (args.background, 'background image')):
        if not path.is_file():
            parser.error(f'{what} not found: {path}')

    inner = [int(p) for p in args.pages.split(',') if p.strip()]
    doc = pymupdf.open(args.pdf)
    for p in [args.cover, *inner]:
        if not 0 <= p < len(doc):
            parser.error(f'page {p} is out of range (PDF has {len(doc)} pages)')

    image = background(args.background, args.blur, args.overlay)
    image.alpha_composite(
        page_fan(
            doc,
            args.cover,
            inner,
            args.cover_height,
            args.spread,
            args.step_angle,
            args.step_scale,
        )
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.convert('RGB').save(args.output, 'WEBP', quality=WEBP_QUALITY, method=6)
    print(f'Wrote {args.output} ({args.output.stat().st_size / 1024:.0f} KB)')


if __name__ == '__main__':
    main()
