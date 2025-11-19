import { describe, it, expect } from 'vitest';
import { computeAutoAdjustments } from '../arAutoAdjust';

const makeLm = (x: number, y: number) => ({ x, y, z: 0 });

describe('computeAutoAdjustments', () => {
  it('normalizes angle and computes scale from diameter', () => {
    const vw = 1280; const vh = 720;
    const landmarks = Array.from({ length: 21 }, (_, i) => makeLm(0.5, 0.5));
    landmarks[13] = makeLm(0.6, 0.5);
    landmarks[14] = makeLm(0.7, 0.5);
    landmarks[5] = makeLm(0.4, 0.6);
    landmarks[17] = makeLm(0.8, 0.6);
    const out = computeAutoAdjustments({ landmarks, viewport: { width: vw, height: vh }, fingerDiameterMm: 18 });
    expect(out.rotationDeg).toBeGreaterThanOrEqual(-90);
    expect(out.rotationDeg).toBeLessThanOrEqual(90);
    expect(out.scalePx).toBeGreaterThan(24);
    expect(out.position.x).toBeGreaterThan(0);
    expect(out.position.y).toBeGreaterThan(0);
  });
});