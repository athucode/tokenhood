/**
 * Browser-side image shrinking: any size photo in, a data URL under `maxChars` out.
 * Scales the longest side down to `maxDim`, then lowers WebP quality and size until it fits.
 * Animated GIFs that already fit are kept as-is; bigger ones become a still image.
 */
export async function compressImage(file: File, maxChars: number, maxDim: number): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file is not an image.");

  const original = await readAsDataUrl(file);
  if (original.length <= maxChars && file.type !== "image/heic") return original;

  const img = await loadImage(original);
  let scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));

  for (let attempt = 0; attempt < 8; attempt++) {
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

    for (const q of [0.85, 0.72, 0.6, 0.48]) {
      const url = canvas.toDataURL("image/webp", q);
      // Safari without WebP encoding falls back to PNG; use JPEG there.
      const out = url.startsWith("data:image/webp") ? url : canvas.toDataURL("image/jpeg", q);
      if (out.length <= maxChars) return out;
    }
    scale *= 0.75;
  }
  throw new Error("Could not shrink this image enough. Try another one.");
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image format is not supported by your browser."));
    img.src = src;
  });
}
