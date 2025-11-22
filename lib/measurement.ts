import type { Landmark, HandProfile, HandGender, HandSize } from '../types';

export type ReferenceScale = { knownMm: number; measuredPx: number };

export type MeasurementOutput = {
  diameterMm: number;
  circumferenceMm: number;
  coordinates: { x: number; y: number; z?: number }[];
  method: 'reference' | 'landmarks';
};

const AVG_PALM_WIDTH_MM = 79.0;

// Palm width estimates (mm) based on anthropometric data
const PALM_WIDTH_TABLE: Record<string, Record<string, number>> = {
  male: { xs: 76, s: 80, m: 84, l: 89, xl: 94 },
  female: { xs: 68, s: 72, m: 76, l: 80, xl: 84 },
  child: { xs: 50, s: 55, m: 60, l: 65, xl: 70 },
};

/**
 * Automatically detect hand size based on measured palm width in pixels
 * This uses the ratio of measured palm width to viewport to classify size
 */
export const detectHandSize = (palmWidthPx: number, viewport: { width: number; height: number }, gender: HandGender): HandSize => {
  // Normalize palm width as percentage of viewport width
  const palmRatio = palmWidthPx / viewport.width;

  // Thresholds based on gender (empirically determined)
  const thresholds = {
    male: { xs: 0.20, s: 0.23, m: 0.26, l: 0.29 }, // xl: > 0.29
    female: { xs: 0.17, s: 0.20, m: 0.23, l: 0.26 }, // xl: > 0.26
    child: { xs: 0.12, s: 0.15, m: 0.18, l: 0.21 }, // xl: > 0.21
  };

  const t = thresholds[gender];

  if (palmRatio < t.xs) return 'xs';
  if (palmRatio < t.s) return 's';
  if (palmRatio < t.m) return 'm';
  if (palmRatio < t.l) return 'l';
  return 'xl';
};

export const getEstimatedPalmWidth = (profile?: HandProfile): number => {
  if (!profile) return AVG_PALM_WIDTH_MM;
  return PALM_WIDTH_TABLE[profile.gender]?.[profile.size] || AVG_PALM_WIDTH_MM;
};

export const computePixelToMm = (scale: ReferenceScale): number => {
  return scale.knownMm / Math.max(1, scale.measuredPx);
};

const distPx = (a: Landmark, b: Landmark, vw: number, vh: number) => {
  const dx = (a.x - b.x) * vw;
  const dy = (a.y - b.y) * vh;
  return Math.sqrt(dx * dx + dy * dy);
};

export const diameterFromLandmarks = (landmarks: Landmark[], viewport: { width: number; height: number }, gender?: HandGender): { diameterMm: number; coords: { x: number; y: number; z?: number }[]; detectedSize: HandSize } => {
  const vw = viewport.width; const vh = viewport.height;
  const PALM_INDEX = 5; const PALM_PINKY = 17; const RING_MCP = 13; const RING_PIP = 14;
  if (!landmarks || landmarks.length < 18) return { diameterMm: 0, coords: [], detectedSize: 'm' };
  const palmWidthPx = distPx(landmarks[PALM_INDEX], landmarks[PALM_PINKY], vw, vh);
  if (palmWidthPx < 10) return { diameterMm: 0, coords: [], detectedSize: 'm' };

  // Auto-detect hand size from palm width
  const detectedSize = detectHandSize(palmWidthPx, viewport, gender || 'female');
  const profile: HandProfile = { gender: gender || 'female', size: detectedSize };
  const estimatedPalmWidth = getEstimatedPalmWidth(profile);
  const pxPerMm = palmWidthPx / estimatedPalmWidth;
  const knuckleLenPx = distPx(landmarks[RING_MCP], landmarks[RING_PIP], vw, vh);
  const fingerWidthPx = knuckleLenPx * 0.8;
  const diameterMm = Math.max(14.0, Math.min(22.2, fingerWidthPx / pxPerMm));
  const coords = [landmarks[RING_MCP], landmarks[RING_PIP]].map(l => ({ x: l.x * vw, y: l.y * vh, z: l.z }));
  return { diameterMm, coords, detectedSize };
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

export const measureFromAR = (landmarks: Landmark[], viewport: { width: number; height: number }, reference?: ReferenceScale, gender?: HandGender): MeasurementOutput & { detectedSize?: HandSize } => {
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
  const d = diameterFromLandmarks(landmarks, viewport, gender);
  const circumferenceMm = d.diameterMm * Math.PI;
  return { diameterMm: d.diameterMm, circumferenceMm, coordinates: d.coords, method: 'landmarks', detectedSize: d.detectedSize };
};