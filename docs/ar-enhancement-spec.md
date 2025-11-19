# AR Enhancement Specification

## Goals
- Accurate finger alignment and sizing
- Stable tracking without drifting
- Unified band+gem compositing aligned to center
- Usable adjustment controls for fine-tuning

## Positioning and Scale
- Auto-adjust based on ring finger landmarks with viewport clamping (`lib/arAutoAdjust.ts:38–97`).
- EMA smoothing with deadzone gating to reduce jitter (`components/ARTryOn.tsx:102–120`).
- Scale derived from palm width and requested diameter, with 15% multiplier for realistic size (`components/ARTryOn.tsx:106`).

## Layering
- Offscreen canvas composites band and gem to one image (`components/ARTryOn.tsx:161–205`).
- Content-aware alignment via alpha bounds and center (`lib/imageAnalysis.ts:1–31`).
- Gem omitted for ring id 5.

## Controls
- Nudge buttons for position and slider for rotation.
- Zoom range expanded to 0.60–1.60 (`components/ARTryOn.tsx:176–185`).

## UX
- Instruction overlay uses glass morphism (`components/ARTryOn.tsx:387–391`).