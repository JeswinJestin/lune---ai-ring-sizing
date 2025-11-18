import type { Landmark } from '../types';

export type ReferenceScale = { knownMm: number; measuredPx: number };

export type MeasurementOutput = {
  diameterMm: number;
  circumferenceMm: number;
  coordinates: { x: number; y: number; z?: number }[];
  method: 'reference' | 'landmarks';
};

const AVG_PALM_WIDTH_MM = 79.0;

export const computePixelToMm = (scale: ReferenceScale): number => {
  return scale.knownMm / Math.max(1, scale.measuredPx);
};

const distPx = (a: Landmark, b: Landmark, vw: number, vh: number) => {
  const dx = (a.x - b.x) * vw;
  const dy = (a.y - b.y) * vh;
  return Math.sqrt(dx * dx + dy * dy);
};

export const diameterFromLandmarks = (landmarks: Landmark[], viewport: { width: number; height: number }): { diameterMm: number; coords: { x: number; y: number; z?: number }[] } => {
  const vw = viewport.width; const vh = viewport.height;
  const PALM_INDEX = 5; const PALM_PINKY = 17; const RING_MCP = 13; const RING_PIP = 14;
  if (!landmarks || landmarks.length < 18) return { diameterMm: 0, coords: [] };
  const palmWidthPx = distPx(landmarks[PALM_INDEX], landmarks[PALM_PINKY], vw, vh);
  if (palmWidthPx < 10) return { diameterMm: 0, coords: [] };
  const pxPerMm = palmWidthPx / AVG_PALM_WIDTH_MM;
  const knuckleLenPx = distPx(landmarks[RING_MCP], landmarks[RING_PIP], vw, vh);
  const fingerWidthPx = knuckleLenPx * 0.8;
  const diameterMm = Math.max(14.0, Math.min(22.2, fingerWidthPx / pxPerMm));
  const coords = [landmarks[RING_MCP], landmarks[RING_PIP]].map(l => ({ x: l.x * vw, y: l.y * vh, z: l.z }));
  return { diameterMm, coords };
};

export const stabilizeMeasurements = (values: number[], tolerancePct = 0.12, window = 8): number => {
  const recent = values.slice(-window);
  if (recent.length === 0) return 0;
  const sorted = [...recent].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const filtered = recent.filter(v => Math.abs(v - median) <= median * tolerancePct);
  const base = filtered.length ? filtered : recent;
  const avg = base.reduce((a, b) => a + b, 0) / base.length;
  return avg;
};

export const measureFromAR = (landmarks: Landmark[], viewport: { width: number; height: number }, reference?: ReferenceScale): MeasurementOutput => {
  if (reference) {
    const px2mm = computePixelToMm(reference);
    const vw = viewport.width; const vh = viewport.height;
    const RING_MCP = 13; const RING_PIP = 14;
    const knuckleLenPx = distPx(landmarks[RING_MCP], landmarks[RING_PIP], vw, vh);
    const fingerWidthPx = knuckleLenPx * 0.8;
    const diameterMm = Math.max(14.0, Math.min(22.2, fingerWidthPx * px2mm));
    const circumferenceMm = diameterMm * Math.PI;
    const coords = [landmarks[RING_MCP], landmarks[RING_PIP]].map(l => ({ x: l.x * vw, y: l.y * vh, z: l.z }));
    return { diameterMm, circumferenceMm, coordinates: coords, method: 'reference' };
  }
  const d = diameterFromLandmarks(landmarks, viewport);
  const circumferenceMm = d.diameterMm * Math.PI;
  return { diameterMm: d.diameterMm, circumferenceMm, coordinates: d.coords, method: 'landmarks' };
};