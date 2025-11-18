import React from 'react';
import { Button } from './Button';
import { CameraIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon } from './icons/UtilIcons';

interface HowItWorksPageProps {
  onGetStarted: () => void;
}

export const HowItWorksPage = ({ onGetStarted }: HowItWorksPageProps) => {
  return (
    <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x text-center">
        <h1 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Simplicity in Three Steps</h1>
        <p className="text-lg md:text-xl text-silver-400 max-w-2xl mx-auto mb-20">
          Getting your perfect ring size has never been easier. Follow our guided process for a measurement you can trust.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-section-x-mobile md:px-section-x space-y-4">
          {/* Step 1 Inlined */}
          <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-platinum-300/20 bg-midnight-500 flex items-center justify-center text-bronze-400">
                      <CameraIcon className="w-8 h-8"/>
                  </div>
                  <div className="w-px h-24 bg-gradient-to-b from-platinum-300/20 to-transparent my-4"></div>
              </div>
              <div>
                  <p className="text-lg font-semibold text-bronze-400 mb-2">Step 01</p>
                  <h3 className="font-display text-3xl text-silver-100 mb-3">Capture with Confidence</h3>
                  <p className="text-silver-400 max-w-md">Use your phone's camera to take a picture of your ring finger next to a standard credit card. This provides a perfect real-world scale.</p>
              </div>
          </div>

          {/* Step 2 Inlined */}
          <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-platinum-300/20 bg-midnight-500 flex items-center justify-center text-bronze-400">
                      <SparklesIcon className="w-8 h-8"/>
                  </div>
                   <div className="w-px h-24 bg-gradient-to-b from-platinum-300/20 to-transparent my-4"></div>
              </div>
              <div>
                  <p className="text-lg font-semibold text-bronze-400 mb-2">Step 02</p>
                  <h3 className="font-display text-3xl text-silver-100 mb-3">Instant AI Analysis</h3>
                  <p className="text-silver-400 max-w-md">Our AI model analyzes the image in seconds, calculating your finger's precise diameter with up to 99% accuracy.</p>
              </div>
          </div>

          {/* Step 3 Inlined */}
          <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-platinum-300/20 bg-midnight-500 flex items-center justify-center text-bronze-400">
                      <CheckCircleIcon className="w-8 h-8"/>
                  </div>
              </div>
              <div>
                  <p className="text-lg font-semibold text-bronze-400 mb-2">Step 03</p>
                  <h3 className="font-display text-3xl text-silver-100 mb-3">Receive Your Results</h3>
                  <p className="text-silver-400 max-w-md">Get your ring size in US, UK, and EU standards, along with a detailed report. You're now ready to shop with confidence or try on rings with our AR feature!</p>
              </div>
          </div>
      </div>

      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x text-center mt-24">
        <div className="bg-gradient-to-br from-midnight-500 to-midnight-700/50 border border-platinum-300/10 rounded-3xl py-16 px-8">
            <h2 className="font-display text-3xl md:text-4xl text-silver-100 mb-4">Ready to Find Your Perfect Fit?</h2>
            <p className="text-silver-400 max-w-xl mx-auto mb-8">The most accurate, easy-to-use ring sizer is just a click away. Get started now—it's free!</p>
            <Button onClick={onGetStarted} className="px-8 py-4 text-lg">
                Measure Your Ring Size <ArrowRightIcon className="inline ml-2"/>
            </Button>
        </div>
      </div>
    </div>
  );
};