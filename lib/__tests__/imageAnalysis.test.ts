import { describe, it, expect } from 'vitest';
import { alphaBoundsFromImageData, centerOf } from '../imageAnalysis';

describe('alphaBounds', () => {
  it('detects bounds of opaque square', async () => {
    const size = 64;
    const data = new Uint8ClampedArray(size * size * 4);
    for (let y = 16; y < 48; y++) {
      for (let x = 16; x < 48; x++) {
        const idx = (y * size + x) * 4;
        data[idx] = 255;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }
    const b = alphaBoundsFromImageData(data, size)!;
    expect(b.w).toBeGreaterThan(30);
    expect(b.h).toBeGreaterThan(30);
    const ctr = centerOf(b);
    expect(Math.round(ctr.cx)).toBeCloseTo(32, 0);
    expect(Math.round(ctr.cy)).toBeCloseTo(32, 0);
  });
});