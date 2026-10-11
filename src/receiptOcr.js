const TARGET_MIN_WIDTH = 1600;
const TARGET_MAX_WIDTH = 2600;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });

const preprocess = (img) => {
  const scale = Math.min(
    TARGET_MAX_WIDTH / img.width,
    Math.max(1, TARGET_MIN_WIDTH / img.width)
  );
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;

  const hist = new Array(256).fill(0);
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const g = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) | 0;
    gray[j] = g;
    hist[g]++;
  }

  const total = w * h;
  const cut = Math.max(1, Math.round(total * 0.02));
  let low = 0;
  let high = 255;
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= cut) { low = v; break; }
  }
  acc = 0;
  for (let v = 255; v >= 0; v--) {
    acc += hist[v];
    if (acc >= cut) { high = v; break; }
  }
  if (high - low < 10) { low = 0; high = 255; }
  const range = high - low;

  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const stretched = Math.min(255, Math.max(0, ((gray[j] - low) * 255) / range));
    px[i] = px[i + 1] = px[i + 2] = stretched;
    px[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  return canvas;
};

const recognizeReceipt = async (imageSrc, onProgress) => {
  const { default: Tesseract } = await import('tesseract.js');
  const logger = onProgress
    ? (m) => { if (m && typeof m.progress === 'number') onProgress(m.progress); }
    : undefined;

  const attempt = async (image) =>
    Tesseract.recognize(image, 'eng', {
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: '6',
      ...(logger ? { logger } : {})
    });

  try {
    const img = await loadImage(imageSrc);
    const canvas = preprocess(img);
    const result = await attempt(canvas);
    const lines = (result.data.text || '').split(/\r?\n/).filter(l => l.trim());
    if (lines.length >= 3) return result;
  } catch (err) {
    // fall through to raw image
  }
  return attempt(imageSrc);
};

export { recognizeReceipt };
