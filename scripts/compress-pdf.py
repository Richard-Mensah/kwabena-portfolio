"""Shrink the generated portfolio PDF for fast download without visible quality loss.

Safe in-place recompression: every opaque RGB image stream larger than MAX_PX on its long edge is
downscaled to MAX_PX and re-encoded as high-quality JPEG *in the same object*, so pages that draw
images through patterns keep working. Images with transparency (soft masks) are left untouched.

Usage (after `npm run pdf`):  python scripts/compress-pdf.py [path]
Requires: pip install pymupdf pillow
"""
import io
import os
import sys

import pymupdf
from PIL import Image

MAX_PX = 1700
QUALITY = 86

path = sys.argv[1] if len(sys.argv) > 1 else "public/kwabena-acheampong-portfolio.pdf"
before = os.path.getsize(path)
doc = pymupdf.open(path)
changed = 0
for xref in range(1, doc.xref_length()):
    try:
        if doc.xref_get_key(xref, "Subtype")[1] != "/Image":
            continue
        if doc.xref_get_key(xref, "SMask")[0] != "null" or doc.xref_get_key(xref, "ImageMask")[1] == "true":
            continue
        info = doc.extract_image(xref)
        if not info or info.get("smask"):
            continue
        im = Image.open(io.BytesIO(info["image"]))
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX_PX / max(w, h))
        if scale >= 1.0 and info["ext"] in ("jpg", "jpeg") and len(info["image"]) < 400_000:
            continue
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        data = buf.getvalue()
        if len(data) >= len(doc.xref_stream_raw(xref) or b"") and scale >= 1.0:
            continue
        doc.update_stream(xref, data, compress=False)
        doc.xref_set_key(xref, "Filter", "/DCTDecode")
        doc.xref_set_key(xref, "DecodeParms", "null")
        doc.xref_set_key(xref, "Width", str(im.width))
        doc.xref_set_key(xref, "Height", str(im.height))
        doc.xref_set_key(xref, "BitsPerComponent", "8")
        doc.xref_set_key(xref, "ColorSpace", "/DeviceGray" if im.mode == "L" else "/DeviceRGB")
        changed += 1
    except Exception as e:  # never break the PDF over one image
        print(f"skip xref {xref}: {e}")

tmp = path + ".tmp"
doc.save(tmp, garbage=4, deflate=True)
doc.close()
os.replace(tmp, path)
print(f"{path}: {before / 1e6:.2f} MB -> {os.path.getsize(path) / 1e6:.2f} MB ({changed} images recompressed)")
