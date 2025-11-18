
import type { CameraGuidance, Contour } from '../../types';
import { getImageData } from './imageUtils';

let guidanceCanvas: HTMLCanvasElement | null = null;
const ANALYSIS_WIDTH = 320;

// Simplified contour finding and analysis for real-time feedback
const quickAnalyzeFrameObjects = (imageData: ImageData): { hasCardLikeObject: boolean; hasCoinLikeObject: boolean } => {
    const { data, width, height } = imageData;
    const visited = new Uint8Array(width * height);
    let hasCardLikeObject = false;
    let hasCoinLikeObject = false;

    // Simplified thresholding
    for (let i = 0; i < data.length; i += 4) {
        const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = brightness > 80 ? 255 : 0;
    }

    // Find the largest blob, which is likely the primary object
    let maxContour: Contour = [];
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = y * width + x;
            if (data[index * 4] > 128 && !visited[index]) {
                const contour = traceBoundary(x, y, width, height, data, visited);
                if (contour.length > maxContour.length) {
                    maxContour = contour;
                }
            }
        }
    }
    
    if (maxContour.length > 50) { // Must be a significant size
        let minX = width, minY = height, maxX = 0, maxY = 0;
        for (const p of maxContour) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
        const boxWidth = maxX - minX;
        const boxHeight = maxY - minY;
        const aspectRatio = boxWidth / boxHeight;

        // Check for card-like aspect ratio (approx 1.58)
        if (aspectRatio > 1.3 && aspectRatio < 1.9) {
            hasCardLikeObject = true;
        }
        // Check for coin-like aspect ratio (circular, approx 1.0)
        if (aspectRatio > 0.8 && aspectRatio < 1.2) {
            hasCoinLikeObject = true;
        }
    }
    
    return { hasCardLikeObject, hasCoinLikeObject };
};

const traceBoundary = (startX: number, startY: number, width: number, height: number, data: Uint8ClampedArray, visited: Uint8Array): Contour => {
    const contour: Contour = [];
    let x = startX, y = startY;
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
            if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && data[(nextY * width + nextX) * 4] > 128 && !visited[nextY * width + nextX]) {
                x = nextX; y = nextY;
                dir = (nextDir + 5) % 8;
                foundNext = true;
                break;
            }
        }
        if (!foundNext) break;
    } while (x !== startX || y !== startY);
    return contour;
};


export const analyzeCameraFrame = async (videoElement: HTMLVideoElement): Promise<CameraGuidance> => {
    if (!guidanceCanvas) guidanceCanvas = document.createElement('canvas');
    const canvas = guidanceCanvas;
    const aspectRatio = videoElement.videoHeight / videoElement.videoWidth;
    canvas.width = ANALYSIS_WIDTH;
    canvas.height = ANALYSIS_WIDTH * aspectRatio;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error("Could not create canvas context for guidance.");

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = getImageData(canvas);
    if (!imageData) throw new Error("Could not get image data for guidance.");
    
    const { data, width, height } = imageData;
    let totalBrightness = 0, skinPixels = 0;
    
    for (let i = 0; i < data.length; i += 8) { // Sample even more sparsely for speed
        const r = data[i], g = data[i + 1], b = data[i + 2];
        totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
        if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
            skinPixels++;
        }
    }
    
    const { hasCardLikeObject } = quickAnalyzeFrameObjects(imageData);
    const pixelCount = data.length / 4 / 8;
    const avgBrightness = totalBrightness / pixelCount;
    
    const guidance: CameraGuidance = {
        lighting: avgBrightness < 50 ? 'dark' : avgBrightness > 200 ? 'bright' : 'good',
        quality: 'good', // Blur detection is too slow for real-time, assuming 'good' for now
        objectDetected: hasCardLikeObject,
        fingerDetected: (skinPixels / pixelCount) > 0.1,
        distance: 'good',
        message: ''
    };
    
    if (guidance.lighting === 'dark') guidance.message = "💡 More lighting needed";
    else if (guidance.lighting === 'bright') guidance.message = "☀️ Too bright, find some shade";
    else if (!guidance.fingerDetected) guidance.message = "✋ Position ring finger in frame";
    else if (!guidance.objectDetected) guidance.message = " प्लेसहोल्डर: एक संदर्भ वस्तु रखें";
    else guidance.message = "✅ Perfect! Tap to capture";

    return guidance;
};
