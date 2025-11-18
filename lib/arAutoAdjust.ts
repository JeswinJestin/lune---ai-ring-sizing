import type { Landmark } from '../types';

type AutoAdjustInput = {
  landmarks: Landmark[]; // normalized 0..1
  viewport: { width: number; height: number };
  fingerDiameterMm: number;
};

type AutoAdjustOutput = {
  position: { x: number; y: number };
  rotationDeg: number;
  scalePx: number;
  zoom: number;
  viewportClamped: boolean;
  posture: {
    outerHand: boolean;
    innerHand: boolean;
    sidePortion: boolean;
    slantedAngle: boolean;
    legPositioning: boolean;
  };
};

const AVG_PALM_WIDTH_MM = 79.0;

const dist = (a: Landmark, b: Landmark, vw: number, vh: number) => {
  const dx = (a.x - b.x) * vw;
  const dy = (a.y - b.y) * vh;
  return Math.sqrt(dx * dx + dy * dy);
};

const angleDeg = (a: Landmark, b: Landmark) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

export function computeAutoAdjustments({ landmarks, viewport, fingerDiameterMm }: AutoAdjustInput): AutoAdjustOutput {
  const vw = viewport.width;
  const vh = viewport.height;
  const PALM_INDEX = 5; // index finger MCP
  const PALM_PINKY = 17; // pinky MCP
  const RING_MCP = 13; // ring MCP
  const RING_PIP = 14; // ring PIP
  const RING_TIP = 16; // ring fingertip

  if (!landmarks || landmarks.length < 17) {
    return {
      position: { x: vw / 2, y: vh / 2 },
      rotationDeg: 0,
      scalePx: Math.max(40, fingerDiameterMm * 3),
      zoom: 1,
      viewportClamped: false,
      posture: { outerHand: false, innerHand: true, sidePortion: false, slantedAngle: false, legPositioning: false },
    };
  }

  const palmWidthPx = dist(landmarks[PALM_INDEX], landmarks[PALM_PINKY], vw, vh);
  const pxPerMm = palmWidthPx > 1 ? palmWidthPx / AVG_PALM_WIDTH_MM : vw / 300; // fallback

  // Base position: ring finger PIP projected to pixels
  const cx = (1 - landmarks[RING_PIP].x) * vw;
  const cy = landmarks[RING_PIP].y * vh;

  // Orientation: angle along ring finger axis
  let theta = angleDeg(landmarks[RING_MCP], landmarks[RING_PIP]);
  // Normalize to -90..90 for overlay convenience
  if (theta > 90) theta -= 180; if (theta < -90) theta += 180;

  // Scale: diameter mm to pixels
  const scalePx = Math.max(24, fingerDiameterMm * pxPerMm);

  // Posture heuristics
  const slantedAngle = Math.abs(theta) > 20;
  const handHeightSpan = Math.abs(landmarks[0].y - landmarks[9].y);
  const sidePortion = handHeightSpan < 0.25;
  const outerHand = landmarks[PALM_PINKY].x > landmarks[PALM_INDEX].x; // mirrored; outer if pinky side further right
  const innerHand = !outerHand;
  const legPositioning = false; // non-hand anatomy ignored by design

  // Keep zoom fixed per requirement
  let zoom = 1;

  // Clamp into viewport
  const half = scalePx / 2;
  let x = Math.min(vw - half, Math.max(half, cx));
  let y = Math.min(vh - half, Math.max(half, cy));
  const clamped = x !== cx || y !== cy;

  return {
    position: { x, y },
    rotationDeg: theta,
    scalePx,
    zoom,
    viewportClamped: clamped,
    posture: { outerHand, innerHand, sidePortion, slantedAngle, legPositioning },
  };
}