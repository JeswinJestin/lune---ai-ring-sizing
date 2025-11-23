
import React, { useState, useCallback, useEffect } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { LandingPage } from './components/LandingPage';
import { MethodSelection } from './components/MethodSelection';
import { ExistingRingSizer } from './components/ExistingRingSizer';
import { ExistingRingMeasurement } from './components/measurement/ExistingRingMeasurement';
import { RulerCalibration } from './components/measurement/RulerCalibration';
import { PrintableSizer as OldPrintableSizer } from './components/PrintableSizer';
import { PrintableSizer } from './components/measurement/PrintableSizer';
import { PhotoUploadSizer } from './components/measurement/PhotoUploadSizer';
import { ManualEntry } from './components/measurement/ManualEntry';
import { ProcessingAnimation } from './components/measurement/ProcessingAnimation';
import { MultiFingerSizing } from './components/measurement/MultiFingerSizing';
import { ResultsScreen } from './components/ResultsScreen';
import { ARTryOn } from './components/ARTryOn';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksPage } from './components/HowItWorksPage';
import { FeaturesPage } from './components/FeaturesPage';
import { AboutPage } from './components/AboutPage';
import { OnboardingTour } from './components/OnboardingTour';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { FloatingBackButton } from './components/FloatingBackButton';
import { useCursor } from './hooks/useCursor';
import type { MeasurementResult, SizingMethod, HandGender, RingSize } from './types';
import { measureFromAR } from './lib/measurement';
import { processDiameter } from './lib/imageProcessing';
import { diameterToSize } from './lib/sizeConversion';
import { Camera } from './components/measurement/Camera';

import { Button } from './components/Button';
import { RingRecommendations } from './components/RingRecommendations';
import { getRecommendations } from './lib/recommendations';


export type AppState =
  | 'landing'
  | 'method-selection'
  | 'camera-measure'
  | 'ruler-calibration'
  | 'existing-ring'
  | 'page-printable-sizer'
  | 'printable-sizer'
  | 'manual-entry'
  | 'multi-finger-sizing'
  | 'processing'
  | 'results'
  | 'ar-try-on'
  | 'process'
  | 'features'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'photo-upload'
  | 'recommendations';

const tourSteps = [
  { targetSelector: null, page: 'landing', title: 'Welcome to LUNE!', content: 'Your personal AI-powered ring sizing companion. Let\'s take a quick tour to see how you can find your perfect fit in seconds.' },
  { targetSelector: '#get-started-btn', page: 'landing', title: 'Ready to Begin?', content: 'Everything starts here. Click this button whenever you\'re ready to explore the different ways to measure your ring size.' },
  { targetSelector: '#method-credit-card', page: 'method-selection', title: 'Highest Accuracy Method', content: 'For the most precise measurement, use our AI-powered tool with any standard-sized card. It\'s our recommended and most popular option.' },
  { targetSelector: '#method-ai-scan', page: 'method-selection', title: 'The Future of Sizing', content: 'Feeling futuristic? This method uses just your camera to analyze your hand\'s geometry and predict your size. No card needed!' },
  { targetSelector: null, page: 'method-selection', title: 'You\'re All Set!', content: 'Now you know the basics. Feel free to explore the other methods or start your measurement. Happy sizing!' }
];

const getBackState = (currentState: AppState): AppState | null => {
  switch (currentState) {
    case 'method-selection': return 'landing';
    case 'camera-measure':
    case 'ruler-calibration':
    case 'existing-ring':
    case 'page-printable-sizer':
    case 'printable-sizer':
    case 'manual-entry':
    case 'photo-upload': return 'method-selection';
    case 'multi-finger-sizing': return 'results';
    case 'results': return 'method-selection';
    case 'ar-try-on': return 'results';
    case 'recommendations': return 'results';
    case 'process':
    case 'features':
    case 'about':
    case 'contact':
    case 'privacy':
    case 'terms': return 'landing';
    default: return null;
  }
};

export const App = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [currentMethod, setCurrentMethod] = useState<SizingMethod | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<{ percentage: number; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calibratedPxPerMm, setCalibratedPxPerMm] = useState<number | null>(null);

  useCursor();
  useSmoothScroll(); // Enable smooth scroll


  useEffect(() => {
    const hasSeenTour = localStorage.getItem('lune_tour_completed');
    // User requested to close onboarding process. Disabling auto-start.
    // if (!hasSeenTour) {
    //   setTimeout(() => setIsTourActive(true), 1000);
    // }
    try {
      const last = localStorage.getItem('lune_last_output');
      if (last) {
        const parsed = JSON.parse(last);
        if (parsed && typeof parsed.fingerDiameter_mm === 'number') {
          const ringSize = diameterToSize(parsed.fingerDiameter_mm);
          if (ringSize) {
            setMeasurementResult({
              ringSize,
              confidence: parsed.confidence || 70,
              fingerDiameter_mm: parsed.fingerDiameter_mm,
              fingerCircumference_mm: parsed.fingerDiameter_mm * Math.PI,
              imagePreviewUrl: '',
            });
          }
        }
      }
    } catch { }
  }, []);

  const handleNavigate = (page: AppState) => {
    setAppState(page);
    window.scrollTo(0, 0);
  };

  const handleMethodSelect = (method: 'camera' | 'ruler' | 'existing-ring' | 'upload' | 'print' | 'manual') => {
    // Map UI method selection to internal SizingMethod type
    let internalMethod: SizingMethod = 'ai-scan';

    if (method === 'camera') {
      internalMethod = 'ai-scan';
      handleNavigate('camera-measure');
    } else if (method === 'existing-ring') {
      internalMethod = 'existing-ring';
      handleNavigate('existing-ring');
    } else if (method === 'print') {
      internalMethod = 'printable';
      handleNavigate('printable-sizer');
    } else if (method === 'ruler') {
      internalMethod = 'ruler';
      handleNavigate('ruler-calibration');
    } else if (method === 'upload') {
      internalMethod = 'upload';
      handleNavigate('photo-upload');
    } else if (method === 'manual') {
      internalMethod = 'manual';
      handleNavigate('manual-entry');
    }

    setCurrentMethod(internalMethod);
  };

  const handleCalibration = (pxPerMm: number) => {
    setCalibratedPxPerMm(pxPerMm);
    // After calibration, go to camera measurement with the calibrated value
    setCurrentMethod('ai-scan');
    handleNavigate('camera-measure');
  };

  const handleCapture = async (imageBlob: Blob, gender?: HandGender, landmarks?: any) => {
    handleNavigate('processing');
    setProcessingError(null);
    setProcessingProgress({ percentage: 0, message: 'Initializing' });
    setIsProcessing(true);

    try {
      if (currentMethod === 'ai-scan' || currentMethod === 'ruler') {
        // Simulate processing steps for better UX
        setProcessingProgress({ percentage: 30, message: 'Detecting hand landmarks...' });
        await new Promise(resolve => setTimeout(resolve, 500));

        setProcessingProgress({ percentage: 60, message: 'Calculating precise dimensions...' });
        await new Promise(resolve => setTimeout(resolve, 500));

        setProcessingProgress({ percentage: 90, message: 'Finalizing measurement...' });

        let finalDiameter;
        let finalConfidence;
        let detectedSize;

        if (calibratedPxPerMm && landmarks) {
          // Recalculate using calibrated value
          const refScale = { knownMm: 1, measuredPx: calibratedPxPerMm };
          const calibratedResult = measureFromAR(landmarks, { width: 640, height: 480 }, refScale, gender);
          finalDiameter = calibratedResult.diameterMm;
          finalConfidence = 98;
          detectedSize = calibratedResult.detectedSize;
        } else {
          const result = landmarks
            ? measureFromAR(landmarks, { width: 640, height: 480 }, undefined, gender)
            : { diameterMm: 17, detectedSize: 'm' as const };
          finalDiameter = result.diameterMm;
          finalConfidence = 85;
          detectedSize = result.detectedSize;
        }

        const ringSize = diameterToSize(finalDiameter);
        if (!ringSize) throw new Error('Could not determine ring size.');

        setMeasurementResult({
          ringSize,
          confidence: finalConfidence,
          fingerDiameter_mm: finalDiameter,
          fingerCircumference_mm: finalDiameter * Math.PI,
          imagePreviewUrl: URL.createObjectURL(imageBlob),
          handProfile: detectedSize ? { gender: gender || 'female', size: detectedSize } : undefined,
          method: calibratedPxPerMm ? 'calibrated-camera' : 'ai-scan'
        });
      } else {
        // Fallback/Mock for other methods
        const analysisResult: { fingerDiameter_mm: number, confidence: number } = await new Promise(resolve => setTimeout(() => resolve({ fingerDiameter_mm: 17, confidence: 95 }), 1000));
        const ringSize = diameterToSize(analysisResult.fingerDiameter_mm);
        if (!ringSize) throw new Error('Could not determine ring size.');
        setMeasurementResult({
          ringSize,
          confidence: analysisResult.confidence,
          fingerDiameter_mm: analysisResult.fingerDiameter_mm,
          fingerCircumference_mm: analysisResult.fingerDiameter_mm * Math.PI,
          imagePreviewUrl: URL.createObjectURL(imageBlob),
        });
      }

      setProcessingProgress({ percentage: 100, message: 'Complete!' });
      await new Promise(resolve => setTimeout(resolve, 200));

      handleNavigate('results');
    } catch (error: any) {
      console.error("Processing failed:", error);
      setProcessingError(error.message || "An unknown error occurred.");
      handleNavigate('results');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const handleDiameterSubmit = async (diameter: number) => {
    handleNavigate('processing');
    setProcessingError(null);
    try {
      const { fingerDiameter_mm, confidence } = await processDiameter(diameter);
      const ringSize = diameterToSize(fingerDiameter_mm);
      if (!ringSize) {
        throw new Error("Could not determine a ring size for the given diameter.");
      }
      setMeasurementResult({
        ringSize,
        confidence,
        fingerDiameter_mm,
        fingerCircumference_mm: fingerDiameter_mm * Math.PI,
        imagePreviewUrl: '',
      });
      setTimeout(() => {
        handleNavigate('results');
      }, 2500);
    } catch (error: any) {
      console.error("Diameter processing failed:", error);
      setProcessingError(error.message);
      handleNavigate('results');
    }
  };

  const handleManualEntryComplete = (size: RingSize, bandWidth?: number) => {
    setMeasurementResult({
      ringSize: size,
      confidence: 100, // Manual entry is 100% confident
      fingerDiameter_mm: size.diameter_mm,
      fingerCircumference_mm: size.circumference_mm,
      imagePreviewUrl: '',
      bandWidth,
    });
    handleNavigate('results');
  };

  const handleBack = () => {
    const backState = getBackState(appState);
    if (backState) {
      handleNavigate(backState);
    }
  };

  const handleStartTour = () => {
    const stepPage = tourSteps[0].page as AppState;
    if (appState !== stepPage) {
      handleNavigate(stepPage);
    }
    setTourStep(0);
    setIsTourActive(true);
  };

  const advanceTour = () => {
    const nextStepIndex = tourStep + 1;
    if (nextStepIndex < tourSteps.length) {
      const nextStepPage = tourSteps[nextStepIndex].page as AppState;
      if (appState !== nextStepPage) {
        handleNavigate(nextStepPage);
      }
      setTourStep(nextStepIndex);
    } else {
      setIsTourActive(false);
      localStorage.setItem('lune_tour_completed', 'true');
    }
  };

  const retreatTour = () => {
    if (tourStep > 0) {
      const prevStepIndex = tourStep - 1;
      const prevStepPage = tourSteps[prevStepIndex].page as AppState;
      if (appState !== prevStepPage) {
        handleNavigate(prevStepPage);
      }
      setTourStep(prevStepIndex);
    }
  };

  const isFullScreenPage = ['camera-measure', 'processing', 'ar-try-on', 'ruler-calibration'].includes(appState);

  // Pages that have their own built-in back buttons (don't show FloatingBackButton)
  const pagesWithOwnBackButton = ['method-selection', 'printable-sizer', 'manual-entry', 'existing-ring', 'multi-finger-sizing', 'photo-upload', 'camera-measure'];

  const backState = getBackState(appState);
  const showBackButton = !!backState && !isFullScreenPage && !pagesWithOwnBackButton.includes(appState);


  const renderContent = () => {
    switch (appState) {
      case 'landing': return <LandingPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'method-selection': return <MethodSelection onSelectMethod={handleMethodSelect} onBack={() => handleNavigate('landing')} />;
      case 'camera-measure': return <Camera onCapture={handleCapture} onBack={handleBack} isProcessing={isProcessing} processingProgress={processingProgress} processingError={processingError} />;
      case 'existing-ring': return <ExistingRingMeasurement onComplete={(size) => {
        setMeasurementResult({
          ringSize: size,
          confidence: 90,
          fingerDiameter_mm: size.diameter_mm,
          fingerCircumference_mm: size.circumference_mm,
          imagePreviewUrl: '',
        });
        handleNavigate('results');
      }} onBack={handleBack} />;
      case 'page-printable-sizer': return <OldPrintableSizer onBack={handleBack} />;
      case 'printable-sizer': return <PrintableSizer onBack={handleBack} />;
      case 'manual-entry': return <ManualEntry onComplete={handleManualEntryComplete} onBack={handleBack} />;
      case 'ruler-calibration': return <RulerCalibration onCalibrate={handleCalibration} onBack={() => handleNavigate('method-selection')} />;
      case 'processing': return <ProcessingAnimation percentage={processingProgress?.percentage || 0} message={processingProgress?.message || 'Initializing'} />;
      case 'results':
        if (processingError) {
          return (
            <div className="text-center p-8">
              <h2 className="font-display text-3xl text-error mb-4">Analysis Failed</h2>
              <p className="text-silver-300 max-w-md mx-auto mb-6">{processingError}</p>
              <div className="flex gap-3 justify-center mb-6">
                <Button onClick={() => handleNavigate('camera-measure')} variant="secondary">Retake photo</Button>
                <Button onClick={() => handleNavigate('method-selection')}>Try Again</Button>
              </div>
              <p className="text-silver-400 text-sm">Tips: Improve lighting, hold camera steady, ensure hand within outline.</p>
            </div>
          );
        }
        return measurementResult ? <ResultsScreen result={measurementResult} onMeasureAgain={() => handleNavigate('method-selection')} onTryOn={() => handleNavigate('ar-try-on')} onViewRecommendations={() => handleNavigate('recommendations')} onMultiFingerSizing={() => handleNavigate('multi-finger-sizing')} /> : <div className="text-center p-8">Loading results...</div>;
      case 'multi-finger-sizing': return measurementResult ? <MultiFingerSizing currentSize={measurementResult.ringSize} onBack={() => handleNavigate('results')} onComplete={(measurements) => {
        console.log('Saved measurements:', measurements);
        handleNavigate('results');
      }} /> : null;
      case 'ar-try-on': return measurementResult ? <ARTryOn result={measurementResult} onBack={() => handleNavigate('results')} /> : null;
      case 'recommendations': return measurementResult ? <RingRecommendations rings={getRecommendations(measurementResult.ringSize)} onBack={() => handleNavigate('results')} /> : null;
      case 'process': return <HowItWorksPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'features': return <FeaturesPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'about': return <AboutPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'terms': return <TermsAndConditionsPage />;
      case 'photo-upload': return <PhotoUploadSizer onBack={handleBack} onComplete={(result) => {
        // Map generic hand size to approximate ring size for now
        // In a real app, we'd use the fingerWidth mm directly
        const sizeMap: Record<string, RingSize> = {
          'xs': { us: 4, uk: 'H', eu: 47, diameter_mm: 14.9, circumference_mm: 46.8 },
          's': { us: 5, uk: 'J', eu: 49, diameter_mm: 15.7, circumference_mm: 49.3 },
          'm': { us: 7, uk: 'N', eu: 54, diameter_mm: 17.3, circumference_mm: 54.4 },
          'l': { us: 9, uk: 'R', eu: 60, diameter_mm: 19.0, circumference_mm: 59.5 },
          'xl': { us: 11, uk: 'V', eu: 65, diameter_mm: 20.6, circumference_mm: 64.6 }
        };

        const estimatedSize = sizeMap[result.handSize] || sizeMap['m'];

        setMeasurementResult({
          ringSize: estimatedSize,
          confidence: result.confidence,
          fingerDiameter_mm: result.fingerWidth,
          fingerCircumference_mm: result.fingerWidth * Math.PI,
          imagePreviewUrl: '', // We could pass the image URL if we lifted state
        });
        handleNavigate('results');
      }} />;
      default: return <LandingPage onGetStarted={() => handleNavigate('method-selection')} />;
    }
  };

  return (
    <div className={`custom-cursor-region bg-midnight-600 min-h-screen flex flex-col ${isFullScreenPage ? '' : 'pt-20'} `}>
      {!isFullScreenPage && <Header onNavigate={handleNavigate} />}
      {showBackButton && <FloatingBackButton onBack={handleBack} />}
      <main className="flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
      {!isFullScreenPage && <Footer onNavigate={handleNavigate} />}
      <OnboardingTour
        isActive={isTourActive && tourSteps[tourStep].page === appState}
        steps={tourSteps}
        currentStepIndex={tourStep}
        onNext={advanceTour}
        onPrev={retreatTour}
        onSkip={() => {
          setIsTourActive(false);
          localStorage.setItem('lune_tour_completed', 'true');
        }}
      />
    </div>
  );
};
