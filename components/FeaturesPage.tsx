import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from './icons/UtilIcons';
import { CreditCardIcon, HandIcon } from './icons/MethodIcons';

interface FeaturesPageProps {
  onGetStarted: () => void;
}

export const FeaturesPage = ({ onGetStarted }: FeaturesPageProps) => {
  return (
    <div className="w-full animate-[fadeInUp_0.5s_ease-out] py-section">
      <div className="max-w-container mx-auto px-section-x-mobile md:px-section-x">
        <div className="text-center mb-20">
            <h1 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Engineered for <span className="italic">Confidence</span></h1>
            <p className="text-lg md:text-xl text-silver-400 max-w-3xl mx-auto">
                LUNE combines cutting-edge technology with a seamless user experience to take the guesswork out of ring shopping.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 Inlined */}
            <Card className="flex flex-col justify-between p-6 md:col-span-2">
                <div>
                    <div className="w-12 h-12 rounded-xl bg-midnight-400/80 flex items-center justify-center mb-4 text-bronze-400">
                        <SparklesIcon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl text-silver-100 mb-2">AI-Powered Precision</h3>
                    <p className="text-silver-400">Our core technology uses computer vision to achieve up to 99% accuracy. By calibrating with everyday objects, we deliver measurements you can trust.</p>
                </div>
            </Card>

            {/* Feature 2 Inlined */}
            <Card className="flex flex-col justify-between p-6">
                <div>
                    <div className="w-12 h-12 rounded-xl bg-midnight-400/80 flex items-center justify-center mb-4 text-bronze-400">
                        <CreditCardIcon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl text-silver-100 mb-2">Multiple Methods</h3>
                    <p className="text-silver-400">Start with our highly accurate credit card method. More innovative methods, including phone screen calibration and pure hand analysis, are coming soon.</p>
                </div>
            </Card>

            {/* Feature 3 Inlined */}
            <Card className="flex flex-col justify-between p-6">
                <div>
                    <div className="w-12 h-12 rounded-xl bg-midnight-400/80 flex items-center justify-center mb-4 text-bronze-400">
                        <HandIcon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl text-silver-100 mb-2">Virtual AR Try-On</h3>
                    <p className="text-silver-400">Once you have your size, visualize how different rings will look on your actual hand using our augmented reality feature.</p>
                </div>
            </Card>

            {/* Feature 4 Inlined */}
            <Card className="flex flex-col justify-between p-6 md:col-span-2">
                <div>
                     <div className="w-12 h-12 rounded-xl bg-midnight-400/80 flex items-center justify-center mb-4 text-bronze-400">
                        <CheckCircleIcon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl text-silver-100 mb-2">Privacy-First & Secure</h3>
                    <p className="text-silver-400">Your privacy is paramount. All image processing is anonymized and we never store your photos, ensuring your data remains yours.</p>
                </div>
            </Card>
        </div>

        <div className="text-center mt-24 bg-gradient-to-br from-midnight-500 to-midnight-700/50 border border-platinum-300/10 rounded-3xl py-16 px-8">
            <h2 className="font-display text-3xl md:text-4xl text-silver-100 mb-4">Experience the Future of Sizing</h2>
            <p className="text-silver-400 max-w-xl mx-auto mb-8">Ready to shop for rings with complete confidence? Find your perfect fit in seconds with LUNE's AI-powered sizer.</p>
            <Button onClick={onGetStarted} className="px-8 py-4 text-lg">
                Measure Your Ring Size <ArrowRightIcon className="inline ml-2"/>
            </Button>
        </div>
      </div>
    </div>
  );
};