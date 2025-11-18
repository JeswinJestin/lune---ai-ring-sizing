import { describe, it, expect } from 'vitest';
import { computePixelToMm, diameterFromLandmarks, measureFromAR, stabilizeMeasurements } from '../measurement';

describe('measurement computations', () => {
  it('computes px->mm ratio from reference', () => {
    const px2mm = computePixelToMm({ knownMm: 85.6, measuredPx: 400 });
    expect(px2mm).toBeCloseTo(0.214, 3);
  });

  it('stabilizes measurements with outlier rejection', () => {
    const vals = [17.2, 17.4, 17.3, 40.0, 17.5, 17.3, 17.2];
    const s = stabilizeMeasurements(vals, 0.1, 7);
    expect(s).toBeGreaterThan(17);
    expect(s).toBeLessThan(18);
  });

  it('estimates diameter from landmarks', () => {
    const vw = 1280, vh = 720;
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    lm[5] = { x: 0.45, y: 0.7, z: 0 }; // index mcp
    lm[17] = { x: 0.55, y: 0.7, z: 0 }; // pinky mcp
    lm[13] = { x: 0.5, y: 0.45, z: 0 }; // ring mcp
    lm[14] = { x: 0.5, y: 0.40, z: 0 }; // ring pip
    const d = diameterFromLandmarks(lm as any, { width: vw, height: vh });
    expect(d.diameterMm).toBeGreaterThan(14.0);
    expect(d.diameterMm).toBeLessThan(22.2);
  });

  it('measureFromAR uses reference scale when provided', () => {
    const vw = 1280, vh = 720;
    const lm = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    lm[13] = { x: 0.5, y: 0.45, z: 0 };
    lm[14] = { x: 0.5, y: 0.40, z: 0 };
    const ref = { knownMm: 85.6, measuredPx: 400 };
    const m = measureFromAR(lm as any, { width: vw, height: vh }, ref);
    expect(m.method).toBe('reference');
    expect(m.diameterMm).toBeGreaterThanOrEqual(14.0);
  });
});