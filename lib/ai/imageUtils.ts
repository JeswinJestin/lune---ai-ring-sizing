import type { Contour } from '../../types';

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const imageToCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0);
  return canvas;
};

export const getImageData = (canvas: HTMLCanvasElement): ImageData | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export const convertToGrayscale = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114);
    data[i] = avg;     // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  return imageData;
};

export const applyEdgeDetection = (imageData: ImageData): ImageData => {
    const grayscale = new Uint8ClampedArray(imageData.width * imageData.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        grayscale[i / 4] = (imageData.data[i] * 0.299) + (imageData.data[i + 1] * 0.587) + (imageData.data[i + 2] * 0.114);
    }

    const width = imageData.width;
    const height = imageData.height;
    const outputData = new Uint8ClampedArray(imageData.data.length);
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixel = grayscale[(y + i) * width + (x + j)];
                    pixelX += pixel * sobelX[i + 1][j + 1];
                    pixelY += pixel * sobelY[i + 1][j + 1];
                }
            }
            const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) >>> 0;
            const index = (y * width + x) * 4;
            outputData[index] = magnitude;
            outputData[index + 1] = magnitude;
            outputData[index + 2] = magnitude;
            outputData[index + 3] = 255;
        }
    }
    return new ImageData(outputData, width, height);
};

// Simplified contour finding (Moore-Neighbor tracing)
export const findContours = (binaryImage: ImageData): Contour[] => {
    // This is a complex CV algorithm. A full implementation is out of scope for an MVP.
    // This simplified version will find "blobs" and return their outer boundary.
    const contours: Contour[] = [];
    const { width, height, data } = binaryImage;
    const visited = new Uint8Array(width * height);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = y * width + x;
            if (data[index * 4] > 128 && !visited[index]) {
                const contour = traceBoundary(x, y, width, height, data, visited);
                if (contour.length > 20) { // Filter small noise
                    contours.push(contour);
                }
            }
        }
    }
    return contours;
};

// Helper for findContours
const traceBoundary = (startX: number, startY: number, width: number, height: number, data: Uint8ClampedArray, visited: Uint8Array): Contour => {
    const contour: Contour = [];
    let x = startX;
    let y = startY;
    let dir = 0;
    const MOORE_NEIGHBORS = [[-1,0], [-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1]];

    do {
        contour.push({ x, y });
        visited[y * width + x] = 1;
        
        let foundNext = false;
        for (let i = 0; i < 8; i++) {
            const nextDir = (dir + i) % 8;
            const nextX = x + MOORE_NEIGHBORS[nextDir][0];
            const nextY = y + MOORE_NEIGHBORS[nextDir][1];
            
            if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && data[(nextY * width + nextX) * 4] > 128) {
                x = nextX;
                y = nextY;
                dir = (nextDir + 5) % 8; // Turn back
                foundNext = true;
                break;
            }
        }
        if (!foundNext) break; // Isolated pixel
    } while (x !== startX || y !== startY);

    return contour;
};

const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
};

export const detectSkinTone = (imageData: ImageData): ImageData => {
    const data = imageData.data;
    const outputData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        // Skin tone ranges in HSV
        const isSkin = (h >= 0 && h <= 0.14) && (s >= 0.15 && s <= 0.9) && (v >= 0.2 && v <= 0.95);
        const value = isSkin ? 255 : 0;
        outputData[i] = value;
        outputData[i+1] = value;
        outputData[i+2] = value;
        outputData[i+3] = 255;
    }
    return new ImageData(outputData, imageData.width, imageData.height);
};
