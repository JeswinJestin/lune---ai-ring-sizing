# Navigation Audit

## Summary
The application uses an internal state machine to control navigation without a router. Pages are rendered via `renderContent()` in `App.tsx` and navigated using `handleNavigate(page)`.

## Pages
- landing → `App.tsx:220` `LandingPage`
- method-selection → `App.tsx:221` `MethodSelection`
- measurement-capture → `App.tsx:222` `Camera`
- sizer-existing-ring → `App.tsx:223` `ExistingRingSizer`
- page-printable-sizer → `App.tsx:224` `PrintableSizer`
- processing → `App.tsx:225` `ProcessingAnimation`
- results → `App.tsx:233` `ResultsScreen`
- ar-try-on → `App.tsx:245` `ARTryOn`
- recommendations → `App.tsx:246` `RingRecommendations`
- process → `App.tsx:247` `HowItWorksPage`
- features → `App.tsx:248` `FeaturesPage`
- about → `App.tsx:249` `AboutPage`
- contact → `App.tsx:250` `ContactPage`

## Navigation Entrypoints
- Header links to pages via `Header.tsx:31–36` using `onNavigate(page)`.
- Footer links to product and company pages via `Footer.tsx:17–33`.
- Landing CTA `Measure Your Ring Size` navigates to method-selection via `LandingPage.tsx:108–116`.
- Results screen buttons navigate to measurement, try-on, and recommendations via `App.tsx:233–245`.

## Findings
- No broken links detected; all header and footer targets exist.
- AR Try-On is gated by a measurement result; attempting from footer triggers an alert rather than navigation.
- Back logic uses `getBackState(appState)` in `App.tsx:173–187` to ensure sensible return paths.

## Recommendations
- Consider adding deep-linking or query-based routing for shareable URLs.
- Provide direct AR entry when a cached `measurementResult` exists.