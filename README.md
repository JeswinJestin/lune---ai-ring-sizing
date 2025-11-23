# LUNE: AI Ring Sizing & AR Try‑On
![License](https://img.shields.io/github/license/JeswinJestin/lune---ai-ring-sizing)

An elegant, glass‑morphism React + Vite app for accurate ring sizing and immersive AR try‑on. It measures finger diameter from camera input, converts to ring size, and visualizes rings with layered band/gem overlays.

## Quick Links
- Live Dev: `npm run dev` → `http://localhost:3000/`
- Tests: `npm test` (Vitest, jsdom)
- Build: `npm run build`

## Visual Overview
<details>
  <summary>Screenshots & Workflows</summary>

  - Landing + CTA (glass hero)
    - showcases onboarding and feature highlights
  - Measurement Capture
    - guided camera, analysis progress, error handling
  - Results
    - diameter, circumference, ring size standards, actions
  - AR Try‑On
    - live tracking, position/rotation/zoom controls, band+gem composite

  Note: Add screenshots to `docs/images/` and reference them here.
</details>

<img width="1821" height="960" alt="Image" src="https://github.com/user-attachments/assets/59e4612f-2eba-4f98-b410-7deb487367f7" />
<br />
<img width="1819" height="958" alt="Image" src="https://github.com/user-attachments/assets/49d3d501-89ed-4fd3-aabc-c51921ddbec1" />
<br />
<img width="1821" height="954" alt="Image" src="https://github.com/user-attachments/assets/a9ac6bf7-3473-43c6-aac0-d9317c2275e8" />
<br />
<img width="1820" height="956" alt="Image" src="https://github.com/user-attachments/assets/1eb8b20a-4283-443d-949d-7fc98f848898" />

## Features
- Multi‑method sizing: camera capture, existing ring sizer, printable sizer
- Auto‑adjusted AR overlay with EMA smoothing and deadzone gating
- Band+gem compositing with alpha‑bounds center alignment
- Favorites and recommendations carousel
- Glass‑morphism surfaces across hero and sections

## About
LUNE reduces uncertainty when buying rings online. It focuses on usability, accuracy (mm precision), and delightful visualization. The AR tracking aligns to the ring finger and composites the ring to minimize drift and misalignment.

## Tech Stack
- React + TypeScript, Vite
- TailwindCSS styling
- MediaPipe Hands for landmarks
- Vitest + jsdom for tests

## Getting Started
1. Install: `npm install`
2. Dev: `npm run dev` and open `http://localhost:3000/`
3. Test: `npm test`
4. Build: `npm run build`

## Key Files
- App state navigation: `App.tsx:220–251`
- AR core: `components/ARTryOn.tsx` (tracking, smoothing, compositing)
- Auto‑adjust: `lib/arAutoAdjust.ts:38–97`
- Image analysis: `lib/imageAnalysis.ts`
- Tests: `lib/__tests__/*.test.ts`
- Assets: `public/{id}_RING.png`, optional `_{id}_band.png`, `_{id}_gem.png`

## Topics / Tags
`react` `vite` `typescript` `tailwindcss` `ar` `mediapipe` `computer‑vision` `ring‑sizing` `glass‑morphism`

## License
MIT — see the License section below or `package.json:license`.

## Security & Confidentiality
- `.trae/` and similar development rule files are ignored by `.gitignore` and must not be uploaded.
- No secrets or API keys are committed.

## Contributing
- Fork → branch → PR.
- Run tests before submitting.

## Changelog Highlights
- AR smoothing + deadzone gating
- Composite band+gem offscreen canvas
- Glass morphism across hero and sections
- Expanded zoom controls and instruction overlay

## License (MIT)
Copyright (c) LUNE contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
