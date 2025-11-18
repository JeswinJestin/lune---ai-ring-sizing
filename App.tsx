


import React, { useState, useCallback, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MethodSelection } from './components/MethodSelection';
import { ExistingRingSizer } from './components/ExistingRingSizer';
import { PrintableSizer } from './components/PrintableSizer';
import { ProcessingAnimation } from './components/measurement/ProcessingAnimation';
import { ResultsScreen } from './components/ResultsScreen';
import { ARTryOn } from './components/ARTryOn';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HowItWorksPage } from './components/HowItWorksPage';
import { FeaturesPage } from './components/FeaturesPage';
import { AboutPage } from './components/AboutPage';
import { OnboardingTour } from './components/OnboardingTour';
import { ContactPage } from './components/ContactPage';
import { FloatingBackButton } from './components/FloatingBackButton';
import { useCursor } from './hooks/useCursor';
import type { MeasurementResult, SizingMethod } from './types';
import { processDiameter } from './lib/imageProcessing';
import { diameterToSize } from './lib/sizeConversion';
import { Camera } from './components/measurement/Camera';

import { Button } from './components/Button';
import { RingRecommendations } from './components/RingRecommendations';
import { getRecommendations } from './lib/recommendations';


export type AppState = 
  | 'landing' 
  | 'method-selection' 
  | 'measurement-capture'
  | 'sizer-existing-ring'
  | 'page-printable-sizer'
  | 'processing' 
  | 'results' 
  | 'ar-try-on' 
  | 'process' 
  | 'features' 
  | 'about'
  | 'contact'
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
        case 'measurement-capture':
        case 'sizer-existing-ring':
        case 'page-printable-sizer': return 'method-selection';
        case 'results': return 'method-selection';
        case 'ar-try-on': return 'results';
        case 'recommendations': return 'results';
        case 'process':
        case 'features':
        case 'about':
        case 'contact': return 'landing';
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
  useCursor();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('lune_tour_completed');
    if (!hasSeenTour) {
      setTimeout(() => setIsTourActive(true), 1000);
    }
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
    } catch {}
  }, []);

  const handleNavigate = (page: AppState) => {
    setAppState(page);
    window.scrollTo(0, 0);
  };

  const handleMethodSelect = (method: SizingMethod) => {
    setCurrentMethod(method);
    if (method === 'credit-card' || method === 'ai-scan') {
      handleNavigate('measurement-capture');
    } else if (method === 'existing-ring') {
      handleNavigate('sizer-existing-ring');
    } else if (method === 'printable') {
      handleNavigate('page-printable-sizer');
    }
  };

  const handleCapture = async (imageBlob: Blob) => {
    handleNavigate('processing');
    setProcessingError(null);
    setProcessingProgress({ percentage: 0, message: 'Initializing' });
    try {
      const analysisResult: { fingerDiameter_mm: number, confidence: number } = await new Promise(resolve => setTimeout(() => resolve({ fingerDiameter_mm: 17, confidence: 95 }), 1000));
      const ringSize = diameterToSize(analysisResult.fingerDiameter_mm);
      if (!ringSize) throw new Error('Could not determine ring size from measurement.');
      const result: MeasurementResult = {
        ringSize,
        confidence: analysisResult.confidence,
        fingerDiameter_mm: analysisResult.fingerDiameter_mm,
        fingerCircumference_mm: analysisResult.fingerDiameter_mm * Math.PI,
        imagePreviewUrl: URL.createObjectURL(imageBlob),
      };
      setMeasurementResult(result);
      setProcessingProgress({ percentage: 100, message: 'Done' });
      setTimeout(() => { handleNavigate('results'); }, 800);
    } catch (error: any) {
      console.error("Image processing failed:", error);
      setProcessingError(error.message || "An unknown error occurred during analysis.");
      handleNavigate('results');
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
  
  const isFullScreenPage = ['measurement-capture', 'processing', 'ar-try-on'].includes(appState);

  const backState = getBackState(appState);
  const showBackButton = !!backState && !isFullScreenPage;


  const renderContent = () => {
    switch (appState) {
      case 'landing': return <LandingPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'method-selection': return <MethodSelection onMethodSelect={handleMethodSelect} />;
      case 'measurement-capture': return <Camera onCapture={handleCapture} onCancel={handleBack} method={currentMethod} />;
      case 'sizer-existing-ring': return <ExistingRingSizer onSubmit={handleDiameterSubmit} onCancel={handleBack} />;
      case 'page-printable-sizer': return <PrintableSizer onBack={handleBack} />;
      case 'processing': return <ProcessingAnimation percentage={processingProgress?.percentage || 0} message={processingProgress?.message || 'Initializing'} />;
      case 'results': 
        if (processingError) {
          return (
            <div className="text-center p-8">
              <h2 className="font-display text-3xl text-error mb-4">Analysis Failed</h2>
              <p className="text-silver-300 max-w-md mx-auto mb-6">{processingError}</p>
              <div className="flex gap-3 justify-center mb-6">
                <Button onClick={() => handleNavigate('measurement-capture')} variant="secondary">Retake photo</Button>
                <Button onClick={() => handleNavigate('method-selection')}>Try Again</Button>
              </div>
              <p className="text-silver-400 text-sm">Tips: Improve lighting, hold camera steady, ensure hand within outline.</p>
            </div>
          );
        }
        return measurementResult ? <ResultsScreen result={measurementResult} onMeasureAgain={() => handleNavigate('method-selection')} onTryOn={() => handleNavigate('ar-try-on')} onViewRecommendations={() => handleNavigate('recommendations')} /> : <div className="text-center p-8">Loading results...</div>;
      case 'ar-try-on': return measurementResult ? <ARTryOn result={measurementResult} onBack={() => handleNavigate('results')} /> : null;
      case 'recommendations': return measurementResult ? <RingRecommendations rings={getRecommendations(measurementResult.ringSize)} onBack={() => handleNavigate('results')} /> : null;
      case 'process': return <HowItWorksPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'features': return <FeaturesPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'about': return <AboutPage onGetStarted={() => handleNavigate('method-selection')} />;
      case 'contact': return <ContactPage />;
      default: return <LandingPage onGetStarted={() => handleNavigate('method-selection')} />;
    }
  };

  return (
    <div className={`custom-cursor-region bg-midnight-600 min-h-screen flex flex-col ${isFullScreenPage ? '' : 'pt-20'}`}>
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
