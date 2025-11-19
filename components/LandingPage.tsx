
import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon, CameraIcon } from './icons/UtilIcons';
import { CreditCardIcon, HandIcon, RingIcon } from './icons/MethodIcons';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="w-full bg-gradient-to-br from-midnight-800/60 via-midnight-900/70 to-black/80">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        <div className="absolute inset-0 animate-[fadeIn_1.5s_ease-in-out] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-midnight-700/50 via-midnight-900/70 to-black/80"></div>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl z-10"></div>
        
        <div className="relative z-20 flex flex-col items-center animate-[fadeInUp_0.8s_ease-out]">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                <h1 className="font-display text-display-lg md:text-display-2xl font-light text-silver-100 max-w-4xl">
                    Find Your Perfect <span className="italic">Ring Size</span> in Seconds
                </h1>
                <p className="mt-6 text-lg md:text-xl text-silver-300 max-w-2xl mx-auto">
                    AI-powered precision. No guesswork. No returns. The confidence to buy jewelry online, gifted by LUNE.
                </p>
                <div className="mt-12">
                    <Button id="get-started-btn" onClick={onGetStarted} className="px-8 py-4 text-lg">
                        Get Started <ArrowRightIcon className="inline ml-2"/>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-section-lg">
        <div className="max-w-container-narrow mx-auto px-section-x-mobile md:px-section-x text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
          <h2 className="font-display text-display-md text-silver-100 mb-4">Simplicity in Three Steps</h2>
          <p className="text-lg text-silver-400 max-w-2xl mx-auto mb-16">
            Getting your perfect ring size has never been easier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="border-t-2 border-bronze-500 pt-6">
              <CameraIcon className="w-10 h-10 text-bronze-400 mb-4"/>
              <h3 className="text-xl font-semibold text-silver-200 mb-2">1. Capture</h3>
              <p className="text-silver-400">Use your camera to snap a photo of your finger next to a standard card for scale.</p>
            </div>
            <div className="border-t-2 border-bronze-500 pt-6">
              <SparklesIcon className="w-10 h-10 text-bronze-400 mb-4"/>
              <h3 className="text-xl font-semibold text-silver-200 mb-2">2. Analyze</h3>
              <p className="text-silver-400">Our AI instantly analyzes the image, calculating your size with incredible precision.</p>
            </div>
            <div className="border-t-2 border-bronze-500 pt-6">
              <CheckCircleIcon className="w-10 h-10 text-bronze-400 mb-4"/>
              <h3 className="text-xl font-semibold text-silver-200 mb-2">3. Discover</h3>
              <p className="text-silver-400">Receive your accurate size and start shopping for rings with total confidence.</p>
            </div>
          </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-section-lg">
        <div className="max-w-container-narrow mx-auto px-section-x-mobile md:px-section-x text-center">
            <h2 className="font-display text-display-md text-silver-100 mb-16">Engineered for Confidence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CreditCardIcon className="h-12 w-12 text-bronze-400 mb-3"/>
                    <h3 className="text-xl font-semibold text-silver-200 mb-2">AI-Powered Precision</h3>
                    <p className="text-silver-400 text-sm">Achieve up to 99% accuracy using our advanced computer vision technology calibrated with any standard card.</p>
                </Card>
                <Card>
                    <HandIcon className="h-12 w-12 text-bronze-400 mb-3"/>
                    <h3 className="text-xl font-semibold text-silver-200 mb-2">Virtual AR Try-On</h3>
                    <p className="text-silver-400 text-sm">Visualize how different rings will look on your hand with our immersive augmented reality experience.</p>
                </Card>
                <Card>
                    <RingIcon className="h-12 w-12 text-bronze-400 mb-3"/>
                    <h3 className="text-xl font-semibold text-silver-200 mb-2">Multiple Sizing Methods</h3>
                    <p className="text-silver-400 text-sm">From our AI scan to measuring an existing ring, choose the method that's most convenient for you.</p>
                </Card>
                <Card>
                    <CheckCircleIcon className="h-12 w-12 text-bronze-400 mb-3"/>
                    <h3 className="text-xl font-semibold text-silver-200 mb-2">Privacy First</h3>
                    <p className="text-silver-400 text-sm">Your privacy is paramount. Images are processed anonymously and never stored on our servers.</p>
                </Card>
            </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-section-lg">
          <div className="max-w-container-text mx-auto px-section-x-mobile md:px-section-x text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
              <img src="https://i.pravatar.cc/100?u=a042581f4e29026704d" alt="Happy customer" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-midnight-400"/>
              <p className="font-display text-3xl text-silver-200 leading-snug">
                  "I was so hesitant to buy my engagement ring online, but LUNE made it foolproof. The sizing was dead-on accurate, and the AR try-on was a game-changer. So much better than printing a piece of paper!"
              </p>
              <p className="mt-6 font-semibold text-silver-300 tracking-wider">- Jessica L.</p>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-xl">
        <div className="max-w-container-narrow mx-auto px-section-x-mobile md:px-section-x text-center">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl py-16 px-8 shadow-2xl">
              <h2 className="font-display text-4xl md:text-display-md text-silver-100 mb-4">Find Your Perfect Fit Today</h2>
              <p className="text-silver-400 max-w-xl mx-auto mb-8">The most accurate, easy-to-use ring sizer is just a click away. Get started now—it's free!</p>
              <Button onClick={onGetStarted} className="px-8 py-4 text-lg">
                  Measure Your Ring Size <ArrowRightIcon className="inline ml-2"/>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
