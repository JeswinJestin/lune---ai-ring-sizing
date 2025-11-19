export type Bounds = { x: number; y: number; w: number; h: number };

export const alphaBounds = (img: HTMLImageElement, targetSize: number): Bounds | null => {
  const c = document.createElement('canvas');
  c.width = targetSize;
  c.height = targetSize;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  ctx.clearRect(0, 0, targetSize, targetSize);
  ctx.drawImage(img, 0, 0, targetSize, targetSize);
  const data = ctx.getImageData(0, 0, targetSize, targetSize).data;
  return alphaBoundsFromImageData(data, targetSize);
};

export const centerOf = (b: Bounds): { cx: number; cy: number } => {
  return { cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
};

export const alphaBoundsFromImageData = (data: Uint8ClampedArray, size: number): Bounds | null => {
  let minX = size, minY = size, maxX = -1, maxY = -1;
  for (let y = 0; y < size; y++) {
    const row = y * size * 4;
    for (let x = 0; x < size; x++) {
      const a = data[row + x * 4 + 3];
      if (a > 5) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
};