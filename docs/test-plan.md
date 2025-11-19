# Test Plan

## Scope
- Auto-adjust positioning and scale (`lib/arAutoAdjust.ts`)
- Compositing and image analysis (`components/ARTryOn.tsx`, `lib/imageAnalysis.ts`)
- UI controls behavior and screenshot capture

## Unit Tests
- `lib/__tests__/arAutoAdjust.test.ts`: angle normalization, scale, clamping.
- `lib/__tests__/imageAnalysis.test.ts`: alpha bounds center detection.

## Manual Tests
- Verify tracking stability with slow and fast movements.
- Confirm ring 5 omits gem; others composite correctly.
- Check zoom range and nudge controls adjust overlay as expected.

## Success Criteria
- Position error ≤ 2 mm over steady hold.
- Scale reflects entered diameter within ±0.5 mm.
- No visible jitter under typical lighting.